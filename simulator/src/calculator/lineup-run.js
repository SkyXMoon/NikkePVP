/** 一次完整的阵容计算：装配 → 净数值引擎 → 站点展示契约。
 *
 *  网站与小程序走同一条：差别只有「表从哪来」（`fetch` / 分包 `require`）和
 *  「发射点从哪来」（网站采样 GLB，小程序读烘焙表）。后者由 `createChargeEngine`
 *  统一成烘焙表，所以这里只剩一个入口。
 *
 *  `tables` 由调用方读好传进来：
 *    { db, crossRegion, resourceIds, skillText, shooting, bindings, colliders,
 *      borrowedBindings, arenaDoc, muzzleBake }
 *  缺 `arenaDoc` 或 `muzzleBake` 会直接抛——静默少一份表只会让结果悄悄变样。
 */
import { assembleLineup, applyTeamEffects, emptyActor, HITSCAN_FIRE_TYPES } from './lineup.js';
import { createChargeEngine } from './charge-engine.js';
import { bakeMuzzles, setMuzzleBakeTable } from '../stage/muzzle-table.js';
import { projectSiteTeam, specialChargeRows } from '../../../v2core/v2-result.mjs';

/** 显示帧与 tick 的换算；与站点 `frameOfTick` 同一口径（tick 6 = 帧 0，每帧 2 tick）。 */
export const frameOfTick = tick => Math.max(0, (tick - 6) * 2);

export function runLineup(input, tables, { totalTicks = 5006, seed = 1, sequence, compact = false } = {}) {
  const { actors, native, burstCharges, notes, teamCodes } = assembleLineup(input, tables);
  // 烘焙表是模块级状态，必须在下面那句 `bakeMuzzles` 之前装好——`createChargeEngine`
  // 里也会装一次，但那时降级判断已经做完了，顺序反了会让所有角色都判成「缺枪口」。
  setMuzzleBakeTable(tables.muzzleBake ?? null);
  // 缺烘焙枪口的角色必须先降级成空位：`createChargeEngine` 只是把它记进
  // `missingMuzzle`，真到开火那一刻 `muzzleAt` 返回 null，射击层会抛
  // 「Missing serialized muzzle」把整场计算带走。站点侧对应的是「缺 GLB / 缺绑定」，
  // 走同一条路：把该角色换成空位并记一条提示，别让一个角色顶掉两个队的图。
  for (const actor of [...actors]) {
    if (!actor.character || HITSCAN_FIRE_TYPES.has(actor.config.fireType)) continue;
    if (bakeMuzzles(actor.config.assetCode ?? actor.config.id)) continue;
    const key = actor.config.team === 0 ? 'attack' : 'defense';
    notes[key].push(`${actor.character.name} 的枪口数据缺失，本次不参与计算`);
    actors[actors.indexOf(actor)] = emptyActor(key, actor.config.slotIndex);
  }
  const passiveEvents = applyTeamEffects(actors, input);
  const characters = actors.map(actor => actor.config);
  const engine = createChargeEngine({ arena: tables.arenaDoc, characters, native,
    muzzleBake: tables.muzzleBake });
  const activeTeams = [...new Set(actors.filter(actor => actor.character).map(actor => actor.config.team))];
  const calculation = engine.calculate({ totalTicks, seed, burstCharges, stopWhenTeamsReady: activeTeams,
    passiveEvents: passiveEvents.filter(event => event.tick <= totalTicks) });
  // 独立展示行（豺狼链接 / 红莲反击）的充能必须标出来，否则同一笔充能会在成员行
  // 和独立行各画一次。这一步读的是驱动真正派发的事件，不另算。
  const specialRows = specialChargeRows(calculation, input, actors);
  const sequenceOf = sequence ?? (() => []);
  const team = key => projectSiteTeam(calculation, actors, key, sequenceOf, { specialRows, compact });
  const result = { attackResult: team('attack'), defenseResult: team('defense') };
  for (const key of ['attack', 'defense']) {
    const row = key === 'attack' ? result.attackResult : result.defenseResult;
    if (row && notes[key].length) row.warning = [...new Set(notes[key])].join('；');
  }
  return { ...result, actors, native, calculation, notes, teamCodes,
    missingMuzzle: engine.missingMuzzle, placements: engine.placements };
}
