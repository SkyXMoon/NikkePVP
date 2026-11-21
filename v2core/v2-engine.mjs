import { Texture } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { decodeCharacter } from '../simulator/src/core/db-codec.js';
import { createArenaCalculator } from '../simulator/src/calculator/arena-calculator.js';
// 阵容装配（槽位 → characters / native）在 `calculator/lineup.js`。那里是纯函数，
// 小程序分包用同一个函数、只换数据来源；抄第二份必然漂移——少写一个字段不会报错，
// 只会让某个角色的充能线静默消失。
import { assembleLineup, applyTeamEffects, emptyActor, HITSCAN_FIRE_TYPES } from '../simulator/src/calculator/lineup.js';
import { projectSiteTeam, specialChargeRows } from './v2-result.mjs';
import { cloneCalculationModel } from './v2-model.mjs';
import { buildJackalLinkTimeline } from './v2-link-groups.mjs';

await globalThis.__NIKKE_CHARACTER_DATA_READY__;

// 同一张页面里 V1/V2 并存：入口由 v2-switch.js 换成按模式分派的转发器。这里一律
// 「登记」，不再直接覆盖全局；要取原实现走 __v1，否则拿到转发器会绕回自己。
const register = (name, fn) => (typeof globalThis.__v2Register === 'function'
  ? globalThis.__v2Register(name, fn) : (globalThis[name] = fn));
const v1 = name => (typeof globalThis.__v1 === 'function' ? globalThis.__v1(name) : globalThis[name]);

const ASSETS = '/v2core/assets';
const dataCache = new Map();
const modelCache = new Map();
const results = new Map();
const pending = new Map();
let lastCalculation = null;
const treasureStorageKey='nikke-v2-treasure-phases';
let treasurePhases={};
try { const saved=JSON.parse(localStorage.getItem(treasureStorageKey)||'{}');
  if(saved&&typeof saved==='object'&&!Array.isArray(saved))treasurePhases=saved;
} catch {}
const treasureKey=(character,teamKey)=>`${state.filters.region}/${teamKey}/${character.id}`;
try {
  const shared = new URL(location.href).searchParams.get('v2phase');
  if (shared && shared.length <= 4096) {
    for (const [key, phase] of Object.entries(JSON.parse(shared))) {
      if (/^(cn|global)\/(attack|defense)\/\d+$/.test(key) && [1, 2, 3].includes(phase)) {
        treasurePhases[key] = phase;
      }
    }
    localStorage.setItem(treasureStorageKey, JSON.stringify(treasurePhases));
  }
} catch { /* Invalid optional share settings leave the stored selection in use. */ }
const originalShareParams = v1('getCurrentTeamShareParams');
register('getCurrentTeamShareParams', function () {
  const params = originalShareParams();
  if (params.some(([key]) => key !== 'mode' && key !== 'region')) {
    const phases = Object.fromEntries(Object.entries(treasurePhases)
      .filter(([key]) => key.startsWith(`${state.filters.region}/`)));
    if (Object.keys(phases).length) params.push(['v2phase', encodeURIComponent(JSON.stringify(phases))]);
  }
  return params;
});

async function loadJson(url) {
  if (!dataCache.has(url)) dataCache.set(url, fetch(url).then(response => {
    if (!response.ok) throw new Error(`V2资源加载失败 ${response.status} ${url}`);
    return response.json();
  }).catch(error => { dataCache.delete(url); throw error; }));
  return dataCache.get(url);
}

/** Character data for the requested ids, borrowing the other region when needed.
 *
 *  Two on-disk shapes have to behave the same: the published build writes an index
 *  (`characterFiles`) with one file per character, while the source tree keeps the
 *  same rows inline. The published per-character files are `db-codec` partitions —
 *  the same encoder the mini program bundle uses, so there is one format and one
 *  decoder, and only the packaging differs (one `{v,d}` payload per character here,
 *  one `{v,t,c}` document per region there; the string table lives in this index).
 *  `decodeCharacter` also returns a non-encoded row untouched, which is why the
 *  inline source shape needs no special case. A team may legitimately mix rosters
 *  (a player comparing the two clients) and the regions do not share a character
 *  list (CN 161, global 213), so a missing id falls back to the other region's file
 *  instead of leaving `undefined` behind — which used to take the whole calculation down.
 *  The returned map is exact, because everything region-bound downstream (shot
 *  profile, muzzle binding, arena model) has to follow the same source.
 */
async function loadCharacterData(region, resourceIds) {
  const other = region === 'cn' ? 'global' : 'cn';
  const fileFor = r => `/simulator/data/characters${r === 'cn' ? '.cn' : ''}.json`;
  const ids = [...new Set(resourceIds)];
  const primary = await loadJson(fileFor(region));
  const has = (doc, id) => (doc?.characterFiles ? !!doc.characterFiles[id] : !!doc?.[id]);
  const read = async (doc, id) => {
    if (!doc?.characterFiles) return doc?.[id];
    if (!doc.characterFiles[id]) return undefined;
    return decodeCharacter(await loadJson(doc.characterFiles[id]), doc.t);
  };
  const missing = ids.filter(id => !has(primary, id));
  const fallback = missing.length ? await loadJson(fileFor(other)) : null;
  const crossRegion = new Map();
  const rows = await Promise.all(ids.map(async id => {
    if (has(primary, id)) return [id, await read(primary, id)];
    if (!has(fallback, id)) return [id, undefined];
    crossRegion.set(String(id), other);
    return [id, await read(fallback, id)];
  }));
  return { db: Object.fromEntries(rows), crossRegion };
}

/** Player-facing skill text, keyed by resource id.
 *
 *  The calculator reports charge against the native skill entity id (`1471110`),
 *  which says nothing to a player. `tools/export_skill_text.py` renders the real
 *  name and description, and also records which id prefix belongs to which slot,
 *  because that numbering is per-character (471 uses `14711` for skill 1, 011 uses
 *  `1011` for skill 2). A borrowed character keeps its own region's text.
 */
async function loadSkillText(region, resourceIds) {
  const fileFor = r => `/simulator/data/skill-text${r === 'cn' ? '.cn' : ''}.json`;
  const primary = await loadJson(fileFor(region));
  if (resourceIds.every(id => primary[id])) return primary;
  return { ...(await loadJson(fileFor(region === 'cn' ? 'global' : 'cn'))), ...primary };
}

/** Per-region arena asset index, cached: a borrowed character needs its own one. */
const assetIndexCache = new Map();
async function arenaAssetIndex(region) {
  const url = `${ASSETS}/${region === 'global' ? 'global/' : ''}out/sd_batch/index.json`;
  if (!assetIndexCache.has(url)) assetIndexCache.set(url, await loadJson(url));
  return assetIndexCache.get(url);
}

function slotInput(character, positionIndex, teamKey, team) {
  if (!character) return null;
  const effective = characterForSlot(character, positionIndex, teamKey, team);
  const arca = getArcaChargeParameters(character, teamKey);
  return {
    character: effective,
    entries: arca?.speedEntries ?? getSavedCharacterChargeSpeedEntries(character, teamKey),
    cubeType: arca?.cubeType ?? getSavedCharacterCubeType(character, teamKey),
    cubeBonus: arca ? Math.max(0, Math.round((arca.chargeSpeed - (arca.speedEntries ?? [])
      .reduce((sum, value) => sum + Number(value || 0), 0)) * 100) / 100) : null,
    magazine: arca?.magazine ?? getSavedCharacterMagazine(character, teamKey),
    reloadSeconds: arca?.reloadSeconds ?? getSavedCharacterReloadSeconds(character, teamKey),
    treasurePhase: /珍藏$/.test(effective.name) ? treasurePhases[treasureKey(character,teamKey)] : 0,
    counterEnabled: isScarlet(character)?effective.scarletCounterEnabled:undefined,
    penetrationShots: isRedHood(character)?effective.redHoodPierceCount:undefined,
    positionIndex,
  };
}

function snapshot(contexts={}) {
  return {
    region: state.filters.region === 'cn' ? 'cn' : 'global',
    arena: isPaidArenaModeActive() ? state.paidArenaMode === 'c' ? 'arenachampion' : 'arenaspecial' : 'arenanormal',
    attack: state.team.map((character, index) => slotInput(character, index, 'attack', state.team)),
    defense: state.defenseTeam.map((character, index) => slotInput(character, index, 'defense', state.defenseTeam)),
    universal: Object.fromEntries(['attack','defense'].map(key=>[key,[...(contexts[key]?.universalCharges??getUniversalChargeState(key))]])),
    sacrifices: Object.fromEntries(['attack','defense'].map(key=>[key,[...(contexts[key]?.sacrificeFrames??getRosannaSacrificeFrameState(key))]])),
    links: Object.fromEntries(['attack','defense'].map(key=>[key,structuredClone(contexts[key]?.jackalLink??getJackalLinkState(key))])),
  };
}

async function loadModel(code, index, region) {
  const entry = index.characters.find(character => character.code === code) ?? {file:`${code}_00.glb`};
  // 国服的 sd_batch 是分批交付的，新角色往往只有国际服那一份模型；同一个角色的
  // 两区模型是同一套资源，缺国服文件时退回国际服路径，别让一次 404 把整次计算
  // 判死。两条都没有才抛，由调用方把该角色降级成空位。
  const candidates = region === 'global' ? [`${ASSETS}/global/out/sd_batch/${entry.file}`]
    : [`${ASSETS}/out/sd_batch/${entry.file}`, `${ASSETS}/global/out/sd_batch/${entry.file}`];
  const cacheKey = `${region}:${code}:${entry.file}`;
  if (!modelCache.has(cacheKey)) modelCache.set(cacheKey, (async () => {
    let lastError = null;
    for (const url of candidates) {
      const response = await fetch(url);
      if (!response.ok) { lastError = new Error(`V2模型加载失败 ${response.status} ${code}`); continue; }
      const bytes = await response.arrayBuffer();
      const loader = new GLTFLoader();
      loader.register(() => ({ name: 'calculation_no_texture_decode', loadTexture: () => Promise.resolve(new Texture()) }));
      return loader.parseAsync(bytes, '');
    }
    throw lastError ?? new Error(`V2模型加载失败 ${code}`);
  })().catch(error => { modelCache.delete(cacheKey); throw error; }));
  const template = await modelCache.get(cacheKey);
  return cloneCalculationModel(template);
}

async function calculate(input) {
  const regionAssets = `${ASSETS}/${input.region === 'global' ? 'global/' : ''}`;
  const masterPromise = loadJson('/src/data/character-assets.master.json');
  const dbPromise = masterPromise.then(master => {
    const ids = new Set([...input.attack, ...input.defense].filter(Boolean).map(slot => String(slot.character.id)));
    return loadCharacterData(input.region, master.linked.filter(row => ids.has(String(row.legacyId)))
      .map(row => String(Number(row.gameCharacterId))));
  });
  // Labels are presentation only: a missing or stale text artifact must not take
  // the calculation down, it only puts the native ids back in the tooltip.
  const skillTextPromise = masterPromise.then(master => {
    const ids = new Set([...input.attack, ...input.defense].filter(Boolean).map(slot => String(slot.character.id)));
    return loadSkillText(input.region, [...new Set(master.linked.filter(row => ids.has(String(row.legacyId)))
      .map(row => String(Number(row.gameCharacterId))))]);
  }).catch(() => ({}));
  const [{ db, crossRegion }, shooting, bindings, colliders, borrowedBindings, index, master, arena, skillText] = await Promise.all([
    dbPromise,
    loadJson(`/simulator/data/native-shooting${input.region === 'global' ? '.global' : ''}.json`),
    loadJson(`/simulator/data/native-bindings${input.region === 'global' ? '.global' : ''}.json`),
    loadJson(`/simulator/data/native-colliders.${input.region}.json`),
    // 跨区借绑定用：对方区的绑定表只在真的缺绑定时才读，这里并行拿一份不额外花钱
    // （同一个 URL 有 `dataCache`，另一处也要读它）。
    loadJson(`/simulator/data/native-bindings${input.region === 'cn' ? '.global' : ''}.json`),
    loadJson(`${regionAssets}out/sd_batch/index.json`), masterPromise,
    loadJson(`${regionAssets}arena/${input.arena}.json`), skillTextPromise,
  ]);
  const resourceIds = new Map(master.linked.map(row => [String(row.legacyId), String(Number(row.gameCharacterId))]));
  // 装配在 `calculator/lineup.js`：小程序分包调的是同一个函数，只换数据来源。
  const { actors, native, burstCharges, notes } = assembleLineup(input, {
    db, crossRegion, resourceIds, skillText, shooting, bindings, colliders, borrowedBindings,
  });
  // 逐个加载模型，失败只降级这一个角色：把它换成空位并记一条提示。以前这里是
  // Promise.all 直接抛，一个角色缺模型就会让整次 calculate 失败，两个队的结果都
  // 变成错误文本，图表被顶掉——用户看到的就是「图表没了」。
  const models = new Map();
  await Promise.all(actors.filter(actor => actor.character && !HITSCAN_FIRE_TYPES.has(actor.config.fireType)).map(async actor => {
    const assetRegion = actor.config.assetRegion ?? input.region;
    const modelIndex = actor.config.assetRegion && actor.config.assetRegion !== input.region
      ? await arenaAssetIndex(actor.config.assetRegion) : index;
    try {
      models.set(actor.config.id, await loadModel(actor.config.assetCode, modelIndex, assetRegion));
    } catch (error) {
      const key = actor.config.team === 0 ? 'attack' : 'defense';
      notes[key].push(`${actor.character.name} 的 SD 模型缺失（${error.message}），本次不参与计算`);
      actors[actors.indexOf(actor)] = emptyActor(key, actor.config.slotIndex);
    }
  }));
  // 模型与绑定必须成对可用：`createArenaCalculator` 建 sampler 时会 `requireBinding`，
  // 那里的失败是整体抛出的，一个角色就能顶掉两队的图。所以缺绑定的角色在这里先降级
  // 成空位，和缺模型走同一条路——提示只进 notes（最终合成 toast），不进图表。
  for (const actor of [...actors]) {
    if (!actor.character || HITSCAN_FIRE_TYPES.has(actor.config.fireType)) continue;
    if (native.bindings?.[actor.config.assetCode]?.muzzles?.length) continue;
    const key = actor.config.team === 0 ? 'attack' : 'defense';
    notes[key].push(`${actor.character.name} 的枪口绑定缺失，本次不参与计算`);
    actors[actors.indexOf(actor)] = emptyActor(key, actor.config.slotIndex);
  }
  // 绑定是跨区借来的角色明确说一句，别让人以为用的是本区资产。
  for (const actor of actors) {
    if (!actor.character) continue;
    const from = native.borrowedBindings?.[actor.config.assetCode];
    if (from) notes[actor.config.team === 0 ? 'attack' : 'defense']
      .push(`${actor.character.name} 的枪口绑定借用${from === 'cn' ? '国服' : '国际服'}资产`);
  }
  // 链接分摊与献祭死亡事件必须在降级之后：被换成空位的角色不该还收死亡事件。
  const passiveEvents = applyTeamEffects(actors, input);
  const calculator = await createArenaCalculator({ arena, characters: actors.map(actor => actor.config), native, models });
  const activeTeams = [...new Set(actors.filter(actor => actor.character).map(actor => actor.config.team))];
  // `simulateBurst` 的 options.continueUntilFrame 折成上限；其余入口不带这个字段。
  const totalTicks = Number.isInteger(input.totalTicks) && input.totalTicks > 0 ? input.totalTicks : 5006;
  const calculation = calculator.calculate({ totalTicks, seed: 1, burstCharges, stopWhenTeamsReady: activeTeams,
    passiveEvents:passiveEvents.filter(event=>event.tick<=totalTicks) });
  const sequence = (members, frame) => getBurstSequence(members).map((entry, index) =>
    ({ ...entry, frame: getBurstStageFrame(frame, index + 1, input.region) }));
  // 豺狼链接这类「独立一行」的充能：原生技能派发，但不在成员行画（与 V1 一致）。
  const specialRows = specialChargeRows(calculation, input, actors);
  const result = {
    attackResult: projectSiteTeam(calculation, actors, 'attack', sequence, { specialRows }),
    defenseResult: projectSiteTeam(calculation, actors, 'defense', sequence, { specialRows }),
  };
  for (const key of ['attack', 'defense']) {
    const team = key === 'attack' ? result.attackResult : result.defenseResult;
    if (!team || !notes[key].length) continue;
    team.warning = [...new Set(notes[key])].join('；');
  }
  lastCalculation = { input, calculation, result, actors };
  return result;
}

function messageResults(input, message) {
  const side = key => input[key].some(Boolean) || input.universal[key].some(value => value > 0)
    ? { engine: 'v2', error: message, members: [] } : null;
  return { attackResult: side('attack'), defenseResult: side('defense') };
}

function requestResults(input = snapshot()) {
  const key = JSON.stringify(input);
  if (results.has(key)) return results.get(key);
  if (![...input.attack, ...input.defense].some(Boolean) &&
      ![...input.universal.attack, ...input.universal.defense].some(value => value > 0))
    return { attackResult: null, defenseResult: null };
  if (!pending.has(key)) {
    const job = calculate(input).then(result => {
      results.set(key, result);
      if (results.size > 20) results.delete(results.keys().next().value);
    }).catch(error => {
      console.error('[v2core]', error);
      results.set(key, messageResults(input, `V2计算失败：${error.message}`));
    }).finally(() => {
      pending.delete(key);
      // app.js 的 getBattleResultsSnapshot() 会把「计算中」这个占位对象缓存在
      // state.battleResults 里，之后一直复用它。V2 是异步算的，算完必须先作废这份
      // 缓存再重绘，否则 render 又读到占位，界面就永远停在「计算中」/空图 ——
      // 用户看到的现象是「切到 V2 了，图和数字都不动」。
      if (typeof globalThis.invalidateBattleResults === 'function') globalThis.invalidateBattleResults();
      if (typeof globalThis.render === 'function') globalThis.render();
    });
    pending.set(key, job);
  }
  return messageResults(input, 'V2核心计算中…');
}

async function readyResults(input=snapshot()) {
  const key=JSON.stringify(input);
  requestResults(input);
  await pending.get(key);
  return results.get(key)??{attackResult:null,defenseResult:null};
}

register('computeBattleResults', () => isPaidArenaModeActive()
  ? computePaidArenaBattleResultsForRow() : requestResults());
// The chart asks for two extra rows. V1 derived them from its own rules; V2 already
// puts both into the native event stream, so these read the same events the chart
// is showing instead of re-deriving anything.
//   · 红莲反击: an FT75 OnHurtRatio row. `probabilityMode` is `expected` for the
//     site calculation, so each event already carries probability × charge — the
//     expected value, not a sampled roll.
//   · 豺狼链接: 就是「被攻击 N 次」那条原生技能（豺狼是 FT72 / OnHurtCount /
//     阈值 10 → 1111110）。V1 用自己的一套累计模型画这一行；V2 不另算一遍，
//     直接读驱动真正派发出来的充能事件，把它显示成「连接触发」。
//     分摊本身没有充能点，所以链接只负责把受击次数攒起来，充能来自这条技能。
const frameOfTick = tick => Math.max(0, (tick - 6) * 2);
function chargeTemplateTriggers(calculation, pattern) {
  return new Set((calculation.result.chargeTemplates ?? [])
    .filter(row => pattern.test(row.trigger?.name ?? ''))
    .map(row => String(row.skillId)));
}
function teamCounterGroups(chartResults, build) {
  const calculation = lastCalculation?.calculation;
  if (!calculation) return [];
  return chartResults.flatMap(item => {
    const teamKey = item.teamKey;
    return build({ item, teamKey, calculation, members: item.result?.members ?? [] })
      .filter(group => group && group.timeline.length > 0);
  });
}
// 红莲反击读的是原生事件，不补算：c222 的 222221001 是 FT75／OnHurtRatio(trigger 7)／
// threshold 3000，原生在角色受击入口 0x5F0D210→0x5F0D613 派发 7，驱动按本体受击逐次
// 生成 skillId=222221001 的充能事件（一次本体受击 = 自身基础 0.45% × 30% = 0.135%）。
// 掩体受击走 0x5F0E55D 的 13，不算本体受击，也不在这里。
register('getScarletCounterGroups', chartResults => {
  if (!lastCalculation?.calculation) return [];
  const hurtSkillIds = chargeTemplateTriggers(lastCalculation.calculation, /Hurt|Cover/);
  const nameOf = id => (lastCalculation.actors ?? [])
    .find(actor => actor.config.id === String(id))?.character?.name ?? null;
  return teamCounterGroups(chartResults, ({ teamKey, calculation, members }) => {
    const gaugeMax = calculation.result.gaugeMax || 1;
    return members.map(member => {
      // `counterEnabled` only exists for the character V1 flagged as 红莲; a
      // switched-off counter drops her hurt rows in the driver, so there is
      // nothing to show either.
      const slot = lastCalculation.input?.[teamKey]?.[member.positionIndex];
      if (!slot || slot.counterEnabled !== true) return null;
      const actorId = `${teamKey}-${member.positionIndex}`;
      const events = (calculation.simulation?.events ?? []).filter(event =>
        event.id === actorId && event.skillId && hurtSkillIds.has(String(event.skillId)) &&
        (event.contacts?.length ?? 0) > 0);
      if (!events.length) return null;
      const chargePerCounter = (events[0].charge ?? 0) / gaugeMax * 100;
      let cumulativeCharge = 0;
      const timeline = events.map(event => {
        const charge = (event.charge ?? 0) / gaugeMax * 100;
        cumulativeCharge += charge;
        // 反击事件的 contacts 是这一击的施加者，用它的名字标出「谁打的」。
        const triggerSources = (event.contacts ?? []).map(contact => ({
          frame: frameOfTick(event.tick),
          attackerPositionIndex: Number(String(contact.id).split('-').pop()),
          characterName: nameOf(contact.id),
          hits: [{ positionIndex: member.positionIndex, hitCount: contact.probability ?? 1 }],
        }));
        return {
          frame: frameOfTick(event.tick),
          triggerCount: event.expectedOccurrences ?? 1,
          triggerSources,
          charge, cumulativeCharge,
        };
      });
      if (!timeline.length) return null;
      return {
        teamKey, groupKey: `${teamKey}-scarlet-counter-${member.positionIndex}`,
        label: '红莲反击', type: 'scarletCounter', member,
        chargePerCounter, timeline,
      };
    });
  });
});
register('getJackalLinkGroups', chartResults => {
  return teamCounterGroups(chartResults, ({ teamKey, calculation, members }) => {
    const link = lastCalculation.input?.links?.[teamKey];
    if (!link?.enabled || !link.ownerId) return [];
    const linked = new Set([link.ownerId, ...(link.targetIds ?? [])].map(String));
    const owner = members.find(member => member.character && linked.has(String(member.character.id)) &&
      String(member.character.id) === String(link.ownerId));
    if (!owner) return [];
    const built = buildJackalLinkTimeline({
      events: calculation.simulation?.events ?? [],
      gaugeMax: calculation.result?.gaugeMax || 1,
      ownerActorId: `${teamKey}-${owner.positionIndex}`,
      // 打人的人是敌方，名字必须从双方演员表里取；用本队 members 兜底会把
      // 敌方 P1 显示成本队 P1，玩家看到的「谁打的」就全是自己人。
      nameOf: id => (lastCalculation.actors ?? [])
        .find(actor => actor.config.id === String(id))?.character?.name ?? null,
      members, teamKey,
    });
    if (!built) return [];
    return [{
      teamKey, groupKey: `${teamKey}-jackal-link-${owner.positionIndex}`,
      label: '豺狼链接', type: 'jackalLink', member: owner,
      chargePerLink: built.chargePerLink, timeline: built.timeline,
    }];
  });
});
const originalChartMarkup = v1('getChargeChartMarkup');
// 图表卡片里只画图。说明性文字（计算缺口、按当前攻击目标计算这类假设、未充满提示、
// 计算失败的原因）一律不出现在这里：它们把图表挤下去，玩家要看的是轴。这类提示
// 统一走站点的 toast，同一批内容只在变化时弹一次，避免每次重算都糊一层。
// 以前这里还留了一个「两队都算不出来就原地显示错误原文」的例外——那等于给自己留
// 后门，任何一次单点异常都会把图换成一段红字。现在没有例外：画不出图就留空，
// 错误只走 toast。
let lastChartNotice = '';
register('getChargeChartMarkup', function (attack, gutter, defense, chartSize) {
  const results = [attack, defense].filter(Boolean);
  const errors = [...new Set(results.flatMap(result => (result.error ? [result.error] : [])))];
  const gaps = results.flatMap(result => result.v2Gaps ?? []);
  if (gaps.length) console.debug('[v2core] 计算缺口', gaps.map(gap =>
    `${gap.id} ${gap.functionId ?? ''} ${gap.reason}`.trim()));
  const notices = [...new Set(results.flatMap(result => [
    ...(result.warning ? [result.warning] : []),
    ...(result.v2TargetingAssumptions?.length ? ['未配置属性排序的技能按当前攻击目标计算。'] : []),
    ...(result.v2Gaps ?? []).map(gap => gap.message).filter(Boolean),
  ]).concat(errors))];
  const notice = notices.join(' ');
  if (notice && notice !== lastChartNotice) {
    lastChartNotice = notice;
    if (typeof globalThis.showToast === 'function') globalThis.showToast(notice, { duration: 6000 });
  }
  const drawable = results.some(result => result && !result.error);
  // 一个角色都没填时不走「算不出来」的短路：那会留下一片空白，看起来像加载失败。
  // 交给 V1 的画法铺一张空图（坐标轴＋网格），和 V1 的空态一致。
  // 真选了角色但两队都报错才返回空字符串，错误本身已经进了 toast。
  if (!drawable && (attack || defense)) return '';
  const markup = originalChartMarkup.call(this, attack, gutter, defense, chartSize);
  return markup.replace('<svg ', '<svg data-calculation-engine="v2" ');
});
register('computePaidArenaBattleResultsForRow', function (rowIndex = state.paidArenaActiveRowIndex) {
  const attack = getPaidArenaSimulationContext(state.paidArenaMode, 'attack', rowIndex);
  const defense = getPaidArenaSimulationContext(state.paidArenaMode, 'defense', rowIndex);
  return withPaidArenaSimulationState(attack, defense, () => requestResults(snapshot({attack,defense})));
});
register('getPaidArenaChartResultForTeam', function (teamKey, rowIndex) {
  return computePaidArenaBattleResultsForRow(rowIndex)[teamKey === 'defense' ? 'defenseResult' : 'attackResult'];
});
/** 站点 V1 的 `simulateBurst` 有 12 个参数（`app.js:6438`）。V1 是「一次算一队」的
 *  帧排布模型，所以外部要把对手的换弹/闪避/嘲讽时间轴、开局眩晕窗口、被动充能
 *  事件一轮轮喂回去收敛。V2 双方同时逐帧模拟，这些东西由原生技能和射击自己产生，
 *  再喂一遍会重复计算。所以签名全接、能映射的映射、其余显式丢弃——不再让调用方
 *  以为传了就生效。
 *
 *  真生效的四个：
 *    opponentTeam            覆盖对侧队伍（不再依赖 snapshot 恰好读到同一份 state）
 *    universalChargeOverride 覆盖本队空位的万能充能
 *    sacrificeFrameOverride  覆盖本队献祭帧
 *    options.continueUntilFrame 折算成本次计算时长上限
 */
register('simulateBurst', function (team, teamKey = 'attack',
  specialChargeEvents = [], opponentReloadTimeline = [], opponentTurnDodgeTimeline = [],
  stunWindows = [], opponentTauntTarget = null, universalChargeOverride = null,
  opponentTeam = [], sacrificeFrameOverride = null, stunDodgeEvents = [], options = {}) {
  const input = snapshot();
  input[teamKey] = team.map((character, index) => slotInput(character, index, teamKey, team));
  const otherKey = teamKey === 'defense' ? 'attack' : 'defense';
  if (Array.isArray(opponentTeam) && opponentTeam.length)
    input[otherKey] = opponentTeam.map((character, index) => slotInput(character, index, otherKey, opponentTeam));
  if (Array.isArray(universalChargeOverride)) input.universal[teamKey] = [...universalChargeOverride];
  if (Array.isArray(sacrificeFrameOverride)) input.sacrifices[teamKey] = [...sacrificeFrameOverride];
  const untilFrame = Number(options?.continueUntilFrame);
  if (Number.isFinite(untilFrame) && untilFrame > 0)
    input.totalTicks = Math.min(5006, Math.ceil(untilFrame / 2) + 6);
  // V1 的迭代中间产物，V2 由原生模拟接管（见上）。列出来是为了让读者一眼看到
  // 「这 6 个确实被考虑过」，而不是漏了。
  void specialChargeEvents; void opponentReloadTimeline; void opponentTurnDodgeTimeline;
  void stunWindows; void opponentTauntTarget; void stunDodgeEvents;
  return requestResults(input)[teamKey === 'defense' ? 'defenseResult' : 'attackResult'];
});
register('simulatePaidArenaBurst', function (team, chargeSpeeds, universalCharges, sacrificeFrames,
  pierceCounts, counterEnabled, jackalLink, teamKey = 'attack') {
  const input = snapshot();
  input[teamKey] = team.map((character, index) => {
    const slot = slotInput(character, index, teamKey, team);
    if (slot) slot.character.chargeSpeedPercent = Number(chargeSpeeds?.[index]) || 0;
    return slot;
  });
  input.universal[teamKey] = [...universalCharges];
  input.sacrifices[teamKey] = [...sacrificeFrames];
  input.links[teamKey] = structuredClone(jackalLink??{enabled:false});
  for(const slot of input[teamKey].filter(Boolean)){
    if(isScarlet(slot.character))slot.counterEnabled=counterEnabled?.[slot.positionIndex]!==false;
    if(isRedHood(slot.character))slot.penetrationShots=Number(pierceCounts?.[slot.positionIndex])||0;
    slot.entries=[];slot.cubeBonus=0;
  }
  return requestResults(input)[teamKey === 'defense' ? 'defenseResult' : 'attackResult'];
});
globalThis.__V2_ENGINE__ = { engine: 'v2', ready:(rowIndex=state.paidArenaActiveRowIndex)=>{
  if(!isPaidArenaModeActive())return readyResults();
  const row=rowIndex;
  const attack=getPaidArenaSimulationContext(state.paidArenaMode,'attack',row);
  const defense=getPaidArenaSimulationContext(state.paidArenaMode,'defense',row);
  return withPaidArenaSimulationState(attack,defense,()=>readyResults(snapshot({attack,defense})));
}, get lastCalculation() { return lastCalculation; },
  get pending() { return pending.size; } };

const originalSettingsModal=v1('createSlotSettingsModal');
register('createSlotSettingsModal',function(){
  const backdrop=originalSettingsModal();
  const context=getSlotSettingsContext();
  if(!backdrop||!context||!/珍藏$/.test(context.character.name))return backdrop;
  const {character,teamKey}=context,region=state.filters.region==='cn'?'cn':'global';
  const key=treasureKey(character,teamKey);
  loadJson('/src/data/character-assets.master.json').then(async master=>{
    if(!backdrop.isConnected)return;
    const resource=master.linked.find(row=>String(row.legacyId)===String(character.id));
    const { db } = await loadCharacterData(region,[String(Number(resource?.gameCharacterId))]);
    if(!backdrop.isConnected)return;
    const phases=db[String(Number(resource?.gameCharacterId))]?.treasurePhases??[];
    if(!phases.length)return;
    const label=document.createElement('label');label.className='settings-field';
    label.textContent='珍藏品阶段';
    const select=document.createElement('select');select.className='slot-settings-treasure-phase';
    for(const phase of phases){const option=document.createElement('option');
      option.value=phase.phase;option.textContent=`第${phase.phase}阶段`;select.append(option);}
    select.value=String(treasurePhases[key]??Math.max(...phases.map(phase=>phase.phase)));
    select.addEventListener('change',()=>{
      treasurePhases[key]=Number(select.value);
      localStorage.setItem(treasureStorageKey,JSON.stringify(treasurePhases));
      render();
    });
    label.append(select);backdrop.querySelector('.slot-settings-modal').append(label);
  }).catch(error=>console.error('[v2 treasure]',error));
  return backdrop;
});

// 角标与首帧放行都归 v2-switch.js：同一张页面可能随时切回 V1，标记得跟着模式变。
// 这里原先还包了一层空的 render（`render = () => originalRender()`），什么也没做，
// 已删掉。
render();
