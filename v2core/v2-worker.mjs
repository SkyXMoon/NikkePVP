import { createChargeEngine } from '../simulator/src/calculator/charge-engine.js';
// 阵容装配（槽位 → characters / native）在 `calculator/lineup.js`。那里是纯函数，
// 小程序分包用同一个函数、只换数据来源；抄第二份必然漂移——少写一个字段不会报错，
// 只会让某个角色的充能线静默消失。
import { assembleLineup, applyTeamEffects, emptyActor, HITSCAN_FIRE_TYPES } from '../simulator/src/calculator/lineup.js';
import { setMuzzleBakeTable, bakeMuzzles } from '../simulator/src/stage/muzzle-table.js';
// 数据加载与主线程共用一份（珍藏品阶段面板也要读角色库）：单一实现，避免两处解码漂移。
import { loadJson, loadCharacterData, loadSkillText } from './v2-character-data.mjs';

const ASSETS = '/v2core/assets';

/**
 * Pure-data V2 calculation entry. Runs in Web Worker (or directly as fallback).
 * Returns structured-cloneable calculation outputs; UI projection stays on main thread.
 */
export async function runCoreCalculation(input) {
  const regionAssets = `${ASSETS}/${input.region === 'global' ? 'global/' : ''}`;
  const masterPromise = loadJson('/src/data/character-assets.master.json');
  const dbPromise = masterPromise.then(master => {
    const ids = new Set([...input.attack, ...input.defense].filter(Boolean).map(slot => String(slot.character.id)));
    return loadCharacterData(input.region, master.linked.filter(row => ids.has(String(row.legacyId)))
      .map(row => String(Number(row.gameCharacterId))));
  });
  const skillTextPromise = masterPromise.then(master => {
    const ids = new Set([...input.attack, ...input.defense].filter(Boolean).map(slot => String(slot.character.id)));
    return loadSkillText(input.region, [...new Set(master.linked.filter(row => ids.has(String(row.legacyId)))
      .map(row => String(Number(row.gameCharacterId))))]);
  }).catch(() => ({}));
  const [{ db, crossRegion }, shooting, colliders, muzzleBake, master, arena, skillText] = await Promise.all([
    dbPromise,
    loadJson(`/simulator/data/native-shooting${input.region === 'global' ? '.global' : ''}.json`),
    loadJson(`/simulator/data/native-colliders.${input.region}.json`),
    loadJson('/simulator/data/muzzle-bake.json'),
    masterPromise,
    loadJson(`${regionAssets}arena/${input.arena}.json`),
    skillTextPromise,
  ]);
  const resourceIds = new Map(master.linked.map(row => [String(row.legacyId), String(Number(row.gameCharacterId))]));
  const { actors, native, burstCharges, notes } = assembleLineup(input, {
    db, crossRegion, resourceIds, skillText, shooting, bindings: null, colliders, borrowedBindings: null,
  });
  setMuzzleBakeTable(muzzleBake);
  for (const actor of [...actors]) {
    if (!actor.character || HITSCAN_FIRE_TYPES.has(actor.config.fireType)) continue;
    if (bakeMuzzles(actor.config.assetCode ?? actor.config.id)) continue;
    const key = actor.config.team === 0 ? 'attack' : 'defense';
    notes[key].push(`${actor.character.name} 的枪口烘焙数据缺失，本次不参与计算`);
    actors[actors.indexOf(actor)] = emptyActor(key, actor.config.slotIndex);
  }
  const passiveEvents = applyTeamEffects(actors, input);
  const calculator = createChargeEngine({ arena, characters: actors.map(actor => actor.config), native, muzzleBake });
  const activeTeams = [...new Set(actors.filter(actor => actor.character).map(actor => actor.config.team))];
  const totalTicks = Number.isInteger(input.totalTicks) && input.totalTicks > 0 ? input.totalTicks : 5006;
  const calculation = calculator.calculate({
    totalTicks, seed: 1, burstCharges, stopWhenTeamsReady: activeTeams,
    passiveEvents: passiveEvents.filter(event => event.tick <= totalTicks),
  });
  return {
    calculation: {
      result: calculation.result,
      shots: calculation.shots,
      stanceEvents: calculation.stanceEvents,
      colliderMotion: calculation.colliderMotion,
      simulation: { events: calculation.simulation?.events ?? [] },
    },
    actors,
    notes,
  };
}

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  self.onmessage = async (event) => {
    const { id, input } = event.data ?? {};
    try {
      const data = await runCoreCalculation(input);
      self.postMessage({ id, ok: true, data });
    } catch (error) {
      self.postMessage({ id, ok: false, error: error?.message || String(error) });
    }
  };
}
