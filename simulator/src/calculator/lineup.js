/** 阵容装配：从「5+5 个角色槽位 + 五份数据表」到「计算引擎要的 characters / native」。
 *
 *  这一段以前只活在 `v2core/v2-engine.mjs` 里，和 `fetch`、`state`、模型加载混在一起，
 *  所以小程序要复用就只能抄一份——抄一份就必然漂移（`configuredActor` 少写一个字段，
 *  对应角色的充能线会静默消失，不报错）。
 *
 *  这里只保留**纯函数**：不读文件、不 fetch、不碰 DOM、不碰 three。调用方负责把表读
 *  进来，无论是网站上的 `fetch`、小程序分包里的 `require`，还是 Node 测试里的 `fs`。
 *  角色模型（GLB）不进这里——那是站点专有的表现层，小程序用烘焙枪口。
 *
 *  `input` 的形状与站点 `snapshot()` 一致：
 *    { region, attack[5], defense[5], universal{attack,defense}, sacrifices{...}, links{...} }
 *  每个槽位（可为 null）：
 *    { character, entries[], cubeType, cubeBonus, magazine, reloadSeconds,
 *      treasurePhase, counterEnabled, penetrationShots, positionIndex }
 */
import { toRunnerConfig } from '../core/data.js';
import { groupByValue } from '../core/stat.js';
import { mergeNativeData } from '../stage/native-data.js';
import { addCnShootingProfiles } from '../stage/cn-roster.js';

/** `FireType` 1/19/21 是 hitscan：命中在开火那一刻沿瞄准射线解出，不需要模型，
 *  发射点固定在 `aim_position`。与 `charge-engine.js` / `arena-calculator.js` 同一判据。 */
export const HITSCAN_FIRE_TYPES = new Set([1, 19, 21]);

/** 空槽位的角色配置。`calculationTarget` 标记它只是个占位，不参与一切原生计算。 */
export function emptyActor(key, position) {
  return {
    character: null,
    config: { id: `${key}-${position}`, team: key === 'attack' ? 0 : 1, slotIndex: position,
      calculationTarget: true, weaponType: 'None', inputType: 1, rateOfFire: 0,
      initialAcc: 0, maxAmmo: 0, fireType: 1, burstEnergyBp: 0, skills: [] },
  };
}

/** 装备/魔方给的充能速度，折成永久 buff 行。
 *
 *  规则照旧：手动填的百分比优先；一个都没填而角色自带充能速度时，用角色自带的
 *  （那是武器本身的属性，不是装备）。同值合并成一条 `stacks`，因为驱动里同源同值的
 *  buff 叠层与多条独立 buff 在 `round(3)` 之后等价，但条数少一半。
 */
export function chargeSpeedBuffs(slot) {
  const buffs = [];
  const percentages = (slot.entries ?? []).filter(value => Number(value) > 0).map(Number);
  if (percentages.length || !(slot.character.chargeSpeedPercent > 0)) {
    const cube = slot.cubeBonus ?? (slot.cubeType === 'charge-speed' ? 2.12 : 0);
    if (cube > 0) percentages.push(cube);
  } else if (slot.character.chargeSpeedPercent > 0) {
    percentages.push(slot.character.chargeSpeedPercent);
  }
  for (const [index, row] of groupByValue(percentages.map(value => -Math.round(value * 100))).entries()) {
    buffs.push({ id: `equipment-charge-${index}`, kind: 'permanent', remain: Infinity,
      standard: 1, stacks: row.n, effect: { kind: 'chargeSpeed', percent: row.p } });
  }
  return buffs;
}

/** 一个槽位 → 引擎要的角色配置。
 *
 *  `resourceIds` 是 legacyId → gameCharacterId（`character-assets.master.json` 的
 *  `linked`），`db` 是按 gameCharacterId 索引的原始表。两者必须同源：拿 legacyId
 *  直接去 `db` 里查会查到另一个角色。
 *
 *  跨区借来的角色（本区没有这个 id）用对方区的数据，且必须把 `assetRegion` 标出来，
 *  因为下游按它决定枪口绑定与场地模型；结果里也要说明，不然玩家以为算的是本区数值。
 */
export function configuredActor(slot, side, { db, resourceIds, crossRegion, notes, skillText }) {
  const resourceId = resourceIds.get(String(slot.character.id));
  const source = db[resourceId];
  if (!source) throw new Error(`${slot.character.name} 缺少${side.region === 'cn' ? '国服' : '国际服'}V2原始数据`);
  const code = `c${String(resourceId).padStart(3, '0')}`;
  const assetRegion = crossRegion?.get(String(resourceId)) ?? side.region;
  if (assetRegion !== side.region) {
    notes?.push(`${slot.character.name} 不在${side.region === 'cn' ? '国服' : '国际服'}，按${assetRegion === 'cn' ? '国服' : '国际服'}数据计算`);
  }
  const treasure = /珍藏$/.test(slot.character.name);
  const config = {
    ...toRunnerConfig(source, { treasure, treasurePhase: slot.treasurePhase, hasPresentation: true, presentationKind: 'sd' }),
    id: `${side.key}-${slot.positionIndex}`, assetCode: code, resourceId,
    slotIndex: slot.positionIndex, team: side.key === 'attack' ? 0 : 1,
    skillMissingRankingPolicy: 'current-target',
    assetRegion,
    ...(assetRegion !== side.region ? { crossRegion: assetRegion } : {}),
  };
  config.onStartBuffs.push(...chargeSpeedBuffs(slot));
  if (slot.cubeType === 'quantum') config.onStartBuffs.push({ id: 'equipment-quantum',
    ft: 102, value: 466, valueType: 2, standard: 1, stacks: 1, kind: 'permanent', remain: Infinity });
  if (slot.magazine > 0) config.maxAmmo = slot.magazine;
  if (slot.reloadSeconds != null) config.reloadTimeUnits = Math.round(slot.reloadSeconds * 100);
  const stats = slot.character.stats ?? {};
  config.counterEnabled = slot.counterEnabled;
  config.penetrationShots = slot.penetrationShots;
  config.rankingStats = Object.fromEntries(['attack', 'defence', 'hp', 'maxHp'].filter(key => Number.isFinite(stats[key]))
    .map(key => [key, stats[key]]));
  return { config, character: slot.character, skillText: skillText?.[resourceId] };
}

/** 原生表按队伍拼装：碰撞盒/弹道跟本区，枪口绑定允许跨区借但必须记账。
 *
 *  国服的 SD 资产是分批交付的：新角色可能只有国际服那份模型，也就只有国际服的绑定。
 *  站点侧 `loadModel` 已经允许模型跨区回退，绑定必须按同一条判据回退，否则会出现
 *  「模型拿到了、绑定没有」——`createArenaCalculator` 建 sampler 时 `requireBinding`
 *  会整体抛出，一个角色就能顶掉两队的图。
 */
export function nativeForTeam(base, { region, crossRegion, codes = [], borrowedBindings }) {
  const other = region === 'cn' ? 'global' : 'cn';
  const bindings = { ...base.bindings };
  const borrowed = {};
  const wanted = new Set([...codes, ...(crossRegion ? [...crossRegion.keys()].map(id => `c${String(id).padStart(3, '0')}`) : [])]);
  for (const code of wanted) {
    if (bindings[code]?.muzzles?.length) continue;
    const alt = borrowedBindings?.characters?.[code];
    if (alt?.muzzles?.length) { bindings[code] = alt; borrowed[code] = other; }
  }
  return { ...base, bindings, borrowedBindings: borrowed };
}

/** 整场阵容装配。
 *
 *  返回的 `actors` 还没有过模型校验——那是站点专有的降级（缺 GLB → 空位）。小程序
 *  没有模型这一步，直接拿 `actors.map(a => a.config)` 去 `createChargeEngine`。
 */
export function assembleLineup(input, tables) {
  const { db, crossRegion, resourceIds, skillText, shooting, bindings, colliders,
    fallbackColliders, borrowedBindings } = tables;
  const notes = { attack: [], defense: [] };
  const teamCodes = [...new Set([...input.attack, ...input.defense].filter(Boolean)
    .map(slot => resourceIds.get(String(slot.character.id))).filter(Boolean)
    .map(rid => `c${String(rid).padStart(3, '0')}`))];
  const merged = mergeNativeData(shooting, bindings, colliders, fallbackColliders);
  // 国服补射击档：本区角色用自己的国服弹道表，跨区借来的角色保留原表（不能贴成国服）。
  const native = input.region === 'cn'
    ? addCnShootingProfiles(nativeForTeam(merged, { region: input.region, crossRegion, codes: teamCodes, borrowedBindings }),
      db, new Set(crossRegion ? crossRegion.keys() : []))
    : nativeForTeam(merged, { region: input.region, crossRegion, codes: teamCodes, borrowedBindings });

  const actors = [];
  const burstCharges = {};
  for (const key of ['attack', 'defense']) {
    for (let position = 0; position < 5; position++) {
      const slot = input[key][position];
      let actor;
      if (!slot) actor = emptyActor(key, position);
      else {
        // 一个槽位不可用不能连累另外四个：降级成空位并说明原因。这也覆盖了「两个区
        // 都没有这个角色」的情况。
        try {
          actor = configuredActor(slot, { key, region: input.region },
            { db, resourceIds, crossRegion, notes: notes[key], skillText });
        } catch (error) {
          actor = emptyActor(key, position);
          notes[key].push(`${slot.character.name} 无法参与计算：${error.message}`);
        }
      }
      actors.push(actor);
      if (!slot && input.universal?.[key]?.[position] > 0)
        burstCharges[actor.config.id] = Math.round(input.universal[key][position] * 100);
    }
  }

  return { actors, native, burstCharges, notes, teamCodes };
}

/** 队伍级效果：豺狼链接的分摊名单 + 献祭帧转成的被动死亡事件。
 *
 *  必须放在「降级成空位」之后调用：站点会因为缺 GLB 模型或枪口绑定把某个角色换成
 *  空位，这时它不该再收到死亡事件，也不该留在分摊名单里。装配阶段还不知道谁会降级，
 *  所以这段单独一个函数，由两侧在各自降级完成后调用一次。
 */
export function applyTeamEffects(actors, input) {
  const passiveEvents = [];
  for (const key of ['attack', 'defense']) {
    const members = actors.filter(actor => actor.config.team === (key === 'attack' ? 0 : 1) && actor.character);
    const link = input.links?.[key];
    if (link?.enabled) {
      const ids = new Set([link.ownerId, ...(link.targetIds ?? [])].map(String));
      const linked = members.filter(actor => ids.has(String(actor.character.id))).map(actor => actor.config.id);
      for (const actor of members) if (linked.includes(actor.config.id)) actor.config.hurtShareTargetIds = linked;
    }
    for (const actor of members) {
      const frame = input.sacrifices?.[key]?.[actor.config.slotIndex];
      if (frame != null && Number.isFinite(Number(frame))) passiveEvents.push({ type: 'death',
        targetId: actor.config.id, tick: Math.max(1, 6 + Math.ceil(Number(frame) / 2)) });
    }
  }
  return passiveEvents;
}
