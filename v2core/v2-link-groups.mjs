/**
 * 豺狼链接那一行的数据。
 *
 * V1 用自己的一套累计模型画这一行（每 10 次受击给一次基础充能，帧 +6）。V2 不
 * 再手算第二遍：驱动已经把「被攻击 N 次」做成原生技能（豺狼是 FT72 / OnHurtCount
 * / 阈值 10 → 1111110），每次跨过阈值都会真的派发充能事件，并且每次接触都留了
 * 一条 `HURT_COUNT` 流水。这里只做展示层聚合：把流水按触发点切批，配上对应的
 * 充能事件。
 *
 * 边界：受击次数是期望累计（概率命中按权重加），所以「本次触发」是期望命中数，
 * 不是某一次实战的整数命中数；分摊本身没有充能点，链接只负责攒次数。
 */

/**
 * 从 actor id（`attack-4` / `defense-0`）取站位序号。攻击方与防守方各占一个
 * 位置序号空间，所以只按后缀取，不按队名前缀——这一行要同时显示敌我双方。
 */
function positionOf(id) {
  const match = /^[A-Za-z]+-(\d+)$/.exec(String(id));
  return match ? Number(match[1]) : -1;
}

export function buildJackalLinkTimeline({ events = [], gaugeMax = 1, ownerActorId, members = [], teamKey, nameOf }) {
  const percentOf = event => (event.charge ?? 0) / gaugeMax * 100;
  const frameOfTick = tick => Math.max(0, (tick - 6) * 2);
  const hurts = events.filter(event => event.type === 'HURT_COUNT' && String(event.id) === ownerActorId);
  if (!hurts.length) return null;
  // 充能只认豺狼自己那条 OnHurtCount 技能，别把同一时间轴上的其它技能算进来。
  const hurtSkillIds = new Set(events
    .filter(event => event.type === 'SKILL_RESERVE' && event.trigger === 'OnHurtCount')
    .map(event => String(event.skillId)));
  const chargeEvents = events.filter(event => event.type === 'HIT' && String(event.id) === ownerActorId &&
    event.skillId && hurtSkillIds.has(String(event.skillId)));
  // 预约事件在触发那一拍，入槽事件在下一拍。切批次按预约拍切，充能取入槽值。
  const reserves = events.filter(event => event.type === 'SKILL_RESERVE' && String(event.id) === ownerActorId &&
    event.skillId && hurtSkillIds.has(String(event.skillId)));
  // 名字只用于显示。攻击者在对面那一队，所以优先用调用方给的双方演员表查；
  // 拿不到再退回本队成员（会串位，仅作兜底），都没有就留空。
  const memberAt = id => members.find(entry => `${teamKey}-${entry.positionIndex}` === String(id)) ??
    members.find(entry => entry.positionIndex === positionOf(id));
  const nameAt = id => (nameOf ? nameOf(id) : null) ?? memberAt(id)?.character?.name ?? null;
  // 触发点直接用充能事件本身：阈值多少由数据决定，这里不猜，也不按「每个整数
  // 都算一次」去数——那样每次接触都会被当成一次触发。
  let cumulativeCharge = 0;
  let hurtIndex = 0;
  let lastCount = 0;
  const timeline = [];
  // 预约与入槽是一对一，但槽满时只有预约、没有入槽的情况要能容错，所以按 tick 取。
  const remainingCharges = [...chargeEvents];
  for (const reserve of reserves) {
    const at = remainingCharges.findIndex(event => event.tick >= reserve.tick);
    const chargeEvent = at >= 0 ? remainingCharges.splice(at, 1)[0] : null;
    const batch = [];
    while (hurtIndex < hurts.length && hurts[hurtIndex].tick <= reserve.tick) batch.push(hurts[hurtIndex++]);
    const crossed = batch.at(-1)?.count ?? lastCount;
    lastCount = crossed;
    const sources = new Map();
    let batchHits = 0;
    for (const entry of batch) {
      batchHits += entry.weight;
      // 按「哪一帧 + 谁 + 打在谁身上」分组：同一角色在不同帧的攻击要分开列，
      // 否则 tooltip 只会报一个首帧，看不出累积是怎么攒起来的。
      const key = `${entry.tick}|${entry.attackerId}|${entry.id}`;
      const source = sources.get(key) ?? { frame: frameOfTick(entry.tick), hitCount: 0,
        characterName: nameAt(entry.attackerId),
        attackerPositionIndex: positionOf(entry.attackerId), hits: [] };
      source.hitCount += entry.weight;
      const target = source.hits.find(hit => hit.positionIndex === positionOf(entry.id));
      if (target) target.hitCount += entry.weight;
      else source.hits.push({ positionIndex: positionOf(entry.id), hitCount: entry.weight });
      sources.set(key, source);
    }
    // 只算真正入槽的量：槽满了以后的触发是发生了、但没进槽，不能画成充能。
    const charge = chargeEvent ? (chargeEvent.creditedCharge ?? chargeEvent.charge ?? 0) / gaugeMax * 100 : 0;
    cumulativeCharge += charge;
    timeline.push({
      frame: frameOfTick(chargeEvent?.tick ?? reserve.tick),
      stageStartFrame: frameOfTick(batch[0]?.tick ?? reserve.tick),
      stageEndFrame: frameOfTick(batch.at(-1)?.tick ?? reserve.tick),
      hitCount: batchHits, accumulatedHits: crossed,
      triggerHitCount: batchHits, triggerSources: [...sources.values()],
      triggerCount: 1, charge, cumulativeCharge,
    });
  }
  if (!timeline.length) return null;
  return { chargePerLink: chargeEvents.length ? percentOf(chargeEvents[0]) : 0, timeline };
}

/**
 * 红莲反击那一行。
 *
 * V1 是展示层模型：每被命中一次，按 0.3 概率获得「一次普攻」的充能。原生数据里
 * c225 这条被动是伤害行（FT72 × 3），不是充能行，驱动不会为它派发充能事件，所以
 * 这里按 V1 的口径补算。调用方若拿到原生派发的同一条充能，应优先用原生事件，
 * 不要两边都算——那正是「同一笔充能在两行各画一次」的来源。
 *
 * `positions` 是「算作被她挨打」的站位集合：她单独站着就只算自己；在豺狼链接里
 * 就整组算，与 V1 的 getJackalLinkedHitCount 同一条口径。
 */
export const SCARLET_COUNTER_PROBABILITY = 0.3;

export function buildScarletCounterTimeline({ events = [], gaugeMax = 1, team, positions = [], unit = 0, nameOf = () => null }) {
  if (!(unit > 0)) return null;
  const frameOfTick = tick => Math.max(0, (tick - 6) * 2);
  const targets = new Set(positions);
  const chargePerCounter = unit / gaugeMax * 100 * SCARLET_COUNTER_PROBABILITY;
  const timeline = events
    .filter(event => event.type === 'HIT' && Number.isFinite(event.team) && event.team !== team)
    .map(event => {
      let triggerCount = 0;
      const sources = new Map();
      for (const contact of event.contacts ?? []) {
        const position = positionOf(contact.id);
        if (!targets.has(position)) continue;
        // 站点默认按期望算，命中概率就是这一击的权重。
        const weight = contact.probability ?? 1;
        if (!(weight > 0)) continue;
        triggerCount += weight;
        const key = String(event.id);
        const source = sources.get(key) ?? { frame: frameOfTick(event.tick),
          attackerPositionIndex: positionOf(event.id), characterName: nameOf(event.id), hits: [] };
        source.hits.push({ positionIndex: position, hitCount: weight });
        sources.set(key, source);
      }
      if (!(triggerCount > 0)) return null;
      return { frame: frameOfTick(event.tick), triggerCount, triggerSources: [...sources.values()],
        charge: chargePerCounter * triggerCount };
    })
    .filter(Boolean);
  if (!timeline.length) return null;
  let cumulativeCharge = 0;
  return {
    chargePerCounter,
    timeline: timeline.map(entry => {
      cumulativeCharge += entry.charge;
      return { ...entry, cumulativeCharge };
    }),
  };
}
