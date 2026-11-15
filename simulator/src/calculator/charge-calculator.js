/** Presentation-independent V2 charge entry. Collision remains owned by shooting.js. */
import { runSpotDriver } from '../core/driver.js';
import { BurstGauge, BURST_GAUGE_MAX } from '../core/burst.js';
import { EVENT_DT_30 } from '../core/time.js';
import { SpotRandom } from '../core/random.js';

/** A repeatable random stream for targeting and probabilistic charge skills. */
function randomStream(seed) {
  const random = new SpotRandom(seed | 0);
  return () => random.nextDouble();
}

/**
 * Calculate with actual shot contacts; never fall back to targetsPerHit fixtures.
 * A fresh shooting instance must be supplied for every run. No DOM/WebGL needed.
 * autoRelease=true is reserved for the existing scene replay; the calculator
 * defaults to first charge only and does not require damage, HP or burst skills.
 * passiveEvents supplies known native resurrection / entity-probably-die
 * notifications at tick boundaries; it does not derive or change HP/life state.
 */
export function runChargeCalculation({ characters, shooting, totalTicks = 900,
  seed = 1, autoRelease = false, burstMax = BURST_GAUGE_MAX, probabilityMode = autoRelease ? 'sampled' : 'expected',passiveEvents=[], burstCharges=null, stopWhenTeamsReady=[] }) {
  if (!Array.isArray(characters) || !characters.length)
    throw new TypeError('V2 计算需要参战角色');
  if (new Set(characters.map(c => c.id)).size !== characters.length)
    throw new TypeError('V2 参战实例 ID 必须唯一');
  if (!Number.isInteger(totalTicks) || totalTicks < 0 || totalTicks > 36000)
    throw new RangeError('V2 计算时长必须为 0～36000 个逻辑帧');
  if (!Number.isInteger(seed)) throw new TypeError('V2 随机种子必须为整数');
  if (!Number.isFinite(burstMax) || burstMax <= 0)
    throw new RangeError('V2 爆裂槽上限必须为正数');
  if (!shooting || !['beforeTick', 'fire', 'advance'].every(k => typeof shooting[k] === 'function'))
    throw new TypeError('V2 计算需要实际射击与命中接口');
  const rand = randomStream(seed);
  const configs = characters.map(c => {
    const cfg = { ...c, rand, arenaAuto: true, onStartBuffs: c.onStartBuffs?.map(b => ({ ...b })),
      skills: c.skills?.map(s => ({ ...s })) };
    // First-charge calculations are independent of unfinished HP/damage data.
    if (!autoRelease) {
      delete cfg.hp; delete cfg.attack;
      // Burst-slot effects are outside the first-gauge model. In particular an
      // OnStart row inside that slot must not become an opening passive.
      const burstIds = new Set((cfg.skills ?? []).filter(s=>s.slot==='burst').map(s=>s.id));
      const burstGroups = new Set((cfg.skills ?? []).filter(s=>s.slot==='burst').map(s=>String(s.groupId ?? s.skill)));
      cfg.excludedFirstChargeEffects = (cfg.skills ?? []).filter(s=>s.slot!=='burst' && s.statusTrigger===18 && burstGroups.has(String(s.statusValue)))
        .map(s=>({id:s.id,reason:'requires-burst-slot-function',group:s.statusValue}));
      for(const binding of cfg.chargeBindings??[])if(binding.variant===cfg.chargeVariant&&(binding.excludedBeforeFirstBurst||binding.excludedInPvp)&&
        !cfg.excludedFirstChargeEffects.some(e=>e.id===binding.id))
        cfg.excludedFirstChargeEffects.push({id:binding.id,reason:binding.excludedInPvp?'native-target-type-ineligible-in-pvp':'proven-burst-dependency',
          proof:binding.pvpEligibilityProof??binding.burstDependencyProof});
      const excludedIds=new Set(cfg.excludedFirstChargeEffects.map(s=>s.id));
      cfg.skills = cfg.skills?.filter(s=>s.slot!=='burst' && !excludedIds.has(s.id));
      cfg.onStartBuffs = cfg.onStartBuffs?.filter(b=>!burstIds.has(b.id)&&!excludedIds.has(b.id));
    }
    return cfg;
  });
  const simulation = runSpotDriver({ characters: configs, shooting, totalTicks,
    burstMax, autoRelease, probabilityMode,passiveEvents, burstCharges, stopWhenTeamsReady });
  const result=projectFirstCharge(simulation, { characters: configs, totalTicks, seed });
  return { simulation, result };
}

/** Project native events for a charge chart; no attack/skill rules live here. */
export function projectFirstCharge(simulation, { characters, totalTicks, seed = 1 }) {
  const max = simulation.burst?.max ?? BURST_GAUGE_MAX;
  const teams = [...new Set(characters.map(c => Number(c.team) || 0))].map(team => {
    const readyTick = simulation.readyTicks.get(team) ?? null;
    const gauge = new BurstGauge(max);
    const timeline = [];
    for (const event of simulation.events) {
      if ((event.team ?? 0) !== team || (readyTick != null && event.tick > readyTick) ||
          !['HIT', 'BURST_CHARGE'].includes(event.type)) continue;
      const before = gauge.filled;
      if (!event.dropped) {
        // Driver applies each contact separately using float32 remaining gauge.
        const instances = event.type === 'HIT' ? event.instances : 1;
        for (let n = 0; n < instances; n++) gauge.applyCharge(event.charge / instances);
      }
      timeline.push({
        tick: event.tick, frame30: event.tick, frame60: event.tick * 2,
        simulationSeconds: event.tick * EVENT_DT_30,
        actorId: event.id, type: event.type, source: event.source ?? 'weapon',
        skillId: event.skillId ?? null, shotId: event.shotId ?? null,
        templateId:event.templateId ?? null,
        triggerCount:event.triggerCount ?? null,
        probability:event.probability ?? 1,
        expectedOccurrences:event.expectedOccurrences??1,
        contacts: (event.contacts ?? []).map(c => ({ ...c })),
        instances: event.instances ?? 1, generatedCharge: event.charge,
        fullChargeRate: event.fullChargeRate ?? null,
        creditedCharge: gauge.filled - before, cumulativeCharge: gauge.filled,
        cumulativePercent: gauge.fillRate * 100, dropped: !!event.dropped,
      });
    }
    const ids = new Set(characters.filter(c => (Number(c.team) || 0) === team).map(c => c.id));
    const gaps = simulation.unsupportedFirstCharge.filter(row => ids.has(row.id)).map(row => ({ ...row }));
    return { team, readyTick, readyFrame30: readyTick, readyFrame60: readyTick == null ? null : readyTick * 2,
      readySimulationSeconds: readyTick == null ? null : readyTick * EVENT_DT_30,
      filled: gauge.filled, percent: gauge.fillRate * 100, timeline,
      coverage: gaps.length ? 'known-gaps' : 'no-reported-gaps', gaps };
  });
  const events = simulation.events.filter(event => {
    const readyTick = simulation.readyTicks.get(event.team ?? 0);
    return readyTick == null || event.tick <= readyTick;
  }).map(event => ({ ...event, frame30: event.tick, frame60: event.tick * 2,
    simulationSeconds: event.tick * EVENT_DT_30,
    ...(event.contacts ? { contacts: event.contacts.map(c => ({ ...c })) } : {}) }));
  return { schemaVersion: 1, engine: 'v2', scope: 'first-charge', seed,
    chargeTemplates:simulation.chargeTemplates ?? [],
    excludedFirstChargeEffects:characters.flatMap(c=>(c.excludedFirstChargeEffects ?? []).map(e=>({actorId:c.id,...e}))),
    arenaModel: { automatic: true, chargedNormalShots: 'full-charge',
      chargeValueRate: 0, skillDamageInheritsFullCharge: false,
      randomAlgorithm: 'System.Random-subtractive', seed32: seed | 0, probabilityMode:simulation.probabilityMode ?? 'sampled' },
    clock: { ticksPerSecond: 30, eventDeltaSeconds: EVENT_DT_30, displayFramesPerTick: 2 },
    totalTicks, gaugeMax: max, events, teams };
}
