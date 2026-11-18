/** Convert V2 events to the existing site's presentation contract.
 *
 *  Returns `null` when there is nothing a player can act on: `reason` is an internal
 *  driver code (`function-program-correlated-hurt-count-expectation-not-connected`),
 *  and printing it in the chart area told the reader nothing. The code itself stays
 *  on `v2Gaps[].reason` for auditing; only gaps with a real explanation get wording.
 */
const GAP_MESSAGES = {
  'skill-target-ranking-input-required': (gap, owner) => {
    const attribute = { attack: '攻击力', defence: '防御力', hp: '当前生命值', maxHp: '最大生命值' }[gap.rankingField] ?? '属性';
    return `${owner}：技能${gap.functionId ?? gap.skill ?? ''}需要按${attribute}选择目标，当前缺少候选目标的${attribute}数据，相关技能充能可能不完整。`;
  },
};

export function formatCalculationGap(gap, actors) {
  const actor = actors.find(entry => entry.config.id === gap.id);
  const owner = actor ? `${actor.config.team === 0 ? '进攻' : '防守'}P${actor.config.slotIndex + 1} ${actor.character?.name ?? ''}` : gap.id;
  const format = GAP_MESSAGES[gap.reason];
  return format ? format(gap, owner) : null;
}

/** Human name for the skill a charge contribution came from.
 *
 *  Events carry the native skill entity id (`1471110`), never a slot, and the
 *  numbering is per character: 471 spends `14711` on skill 1 while 011 spends
 *  `1011` on skill 2. `skill-text.json` therefore ships the character's own
 *  id-prefix map next to the rendered text. Without a match the caller keeps the
 *  raw id, which is still better than inventing a label.
 */
const SLOT_NAMES = { skill1: '技能1', skill2: '技能2', burst: '爆裂技能', skill4: '技能4' };

function skillOf(actor, skillId) {
  const text = actor?.skillText;
  if (!text || !skillId) return null;
  const id = String(skillId);
  const prefixes = text.prefixes ?? {};
  const prefix = Object.keys(prefixes).filter(key => id.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  const slot = prefix && prefixes[prefix];
  const entry = slot && text.slots?.[slot];
  if (!entry?.name) return null;
  return { slot, slotName: SLOT_NAMES[slot] ?? slot, name: entry.name };
}

function missedPassTick(shot) {
  const fixedTarget = shot.fireType === 3 || shot.fireType === 4 && shot.trackingTargetBound === false;
  if (!fixedTarget || !shot.path?.length || !shot.aimPoint || !shot.from) return shot.endTick;
  const direction = shot.aimPoint.map((value, axis) => value - shot.from[axis]);
  // Locate the recorded segment crossing the launch aim plane. The projectile
  // can keep travelling until range cleanup after it has already missed here.
  const index = shot.path.findIndex(point => point.reduce((dot, value, axis) =>
    dot + (value - shot.aimPoint[axis]) * direction[axis], 0) >= 0);
  return index > 0 ? shot.fireTick + index : shot.endTick;
}

/** 独立展示行（豺狼链接、红莲反击）的充能来源。
 *
 *  这些充能在原生驱动里就是当事人自己的技能派发的，但站点把它们画成单独一行。
 *  V1 的做法是把这类充能以 `showOnMember:false` 注入，只累加队总与角色累计，
 *  不在成员行打点。V2 走的是真技能，如果不标出来，同一笔充能会在成员行和独立
 *  行各显示一次（用户看到的就是「链接充能跑到了豺狼身上」）。
 *
 *  `specialRows[actorId] = { label, skillIds }`：该角色这些技能的充能归到哪一行。
 */
export function specialChargeRows(calculation, input, actors) {
  const rows = {};
  const add = (actorId, label, skillIds) => {
    const row = (rows[actorId] ??= { label, skillIds: new Set() });
    row.label = label;
    for (const id of skillIds) row.skillIds.add(String(id));
  };
  const hurtSkills = new Set((calculation.simulation?.events ?? [])
    .filter(event => event.type === 'SKILL_RESERVE' && event.trigger === 'OnHurtCount')
    .map(event => String(event.skillId)));
  for (const key of ['attack', 'defense']) {
    if (!hurtSkills.size) break;
    const link = input.links?.[key];
    if (!link?.enabled || !link.ownerId) continue;
    const team = key === 'attack' ? 0 : 1;
    const owner = actors.find(actor => actor.character && actor.config.team === team &&
      String(actor.character.id) === String(link.ownerId));
    if (owner) add(owner.config.id, '豺狼链接', hurtSkills);
  }
  // 红莲反击：受击概率充能（FT75／OnHurtRatio）在 V1 里同样只上独立行。
  for (const template of calculation.result?.chargeTemplates ?? []) {
    if (!/OnHurtRatio/i.test(template.trigger?.name ?? '')) continue;
    const actor = actors.find(entry => entry.config.id === String(template.actorId));
    if (!actor || actor.config.counterEnabled !== true) continue;
    add(actor.config.id, '红莲反击', [template.skillId]);
  }
  return rows;
}

export function projectSiteTeam(calculation, actors, teamKey, burstSequenceOf, options = {}) {
  const team = teamKey === 'attack' ? 0 : 1;
  const entries = actors.filter(actor => actor.config.team === team && actor.character);
  const native = calculation.result.teams.find(row => row.team === team);
  if (!entries.length && !native?.timeline.some(event => event.generatedCharge > 0)) return null;
  const frameOf = tick => Math.max(0, (tick - 6) * 2);
  const specialRows = options.specialRows ?? {};
  const byId = new Map(actors.map(actor => [actor.config.id, actor]));
  const events = calculation.result.events.filter(event => event.team === team);
  const members = entries.map(actor => ({
    character: actor.character, positionIndex: actor.config.slotIndex,
    hits: 0, totalCharge: 0, attackChargeTotal: 0, hitFrames: [],
    reloadEvents: [], flightEvents: [], missedShotEvents: [], turnDodgeEvents: [],
  }));
  const byPosition = new Map(members.map(member => [member.positionIndex, member]));
  const grouped = new Map();
  for (const event of native.timeline) {
    const actor = byId.get(event.actorId);
    if (!actor) continue;
    const member = byPosition.get(actor.config.slotIndex);
    const frame = frameOf(event.tick);
    const row = grouped.get(frame) ?? { frame, totalCharge: 0, contributions: [] };
    row.totalCharge = event.cumulativePercent;
    const charge = event.generatedCharge / calculation.result.gaugeMax * 100;
    const targets = new Map();
    for (const contact of event.contacts) {
      const target = byId.get(contact.id);
      if (target) targets.set(target.config.slotIndex,
        (targets.get(target.config.slotIndex) ?? 0) + (contact.probability ?? 1));
    }
    // 独立展示行的充能：只进队总与角色累计，不在成员行画点。
    const special = specialRows[event.actorId];
    const isSpecial = !!special && special.skillIds.has(String(event.skillId));
    if (member) {
      member.totalCharge += charge;
      if (!isSpecial) {
        member.attackChargeTotal += charge;
        member.hitFrames.push(frame);
      }
    }
    const skill = skillOf(actor, event.skillId);
    const contribution = {
      positionIndex: actor.config.slotIndex, characterId: actor.character?.id,
      character: actor.character,
      characterName: actor.character?.name ?? `P${actor.config.slotIndex + 1}万能`,
      charge, cumulativeCharge: member?.totalCharge ?? charge,
      labels: [isSpecial ? special.label
        : !member ? '万能充能'
        : skill ? `${skill.slotName}「${skill.name}」`
        : event.skillId ? `技能 ${event.skillId}`
        : event.type === 'HIT' ? '普通攻击' : '直接充能'],
      skills: skill ? [{ slot: skill.slot, slotName: skill.slotName, name: skill.name }] : [],
      counterHits: event.contacts.length,
      positionHits: [...targets].map(([positionIndex, hitCount]) => ({ positionIndex, hitCount })),
      targetHits: [...targets].map(([positionIndex, hitCount]) => ({ positionIndex, hitCount })),
      showOnMember: !!member && !isSpecial,
      v2: { tick: event.tick, skillId: event.skillId, templateId: event.templateId,
        source: event.source, instances: event.instances },
    };
    const previous = row.contributions.find(part => part.positionIndex === contribution.positionIndex &&
      part.showOnMember === contribution.showOnMember);
    if (previous) {
      previous.charge += contribution.charge;
      previous.cumulativeCharge = contribution.cumulativeCharge;
      previous.counterHits += contribution.counterHits;
      previous.labels = [...new Set([...previous.labels, ...contribution.labels])];
      const known = new Set(previous.skills.map(entry => `${entry.slot}/${entry.name}`));
      previous.skills.push(...contribution.skills.filter(entry => !known.has(`${entry.slot}/${entry.name}`)));
      previous.v2.events.push(contribution.v2);
      for (const field of ['positionHits', 'targetHits']) {
        for (const hit of contribution[field]) {
          const existing = previous[field].find(value => value.positionIndex === hit.positionIndex);
          if (existing) existing.hitCount += hit.hitCount;
          else previous[field].push({ ...hit });
        }
      }
    } else {
      contribution.v2 = { ...contribution.v2, events: [{ ...contribution.v2 }] };
      row.contributions.push(contribution);
    }
    grouped.set(frame, row);
  }
  for (const member of members) {
    const actor = entries.find(entry => entry.config.slotIndex === member.positionIndex);
    const owned = events.filter(event => event.id === actor.config.id);
    member.hits = owned.filter(event => event.type === 'FIRE').length;
    let reloadStart = null;
    for (const event of owned) {
      if (event.type === 'RELOAD_START') reloadStart = frameOf(event.tick);
      if (event.type === 'RELOAD_DONE' && reloadStart != null) {
        member.reloadEvents.push({ positionIndex: member.positionIndex,
          characterName: member.character.name, startFrame: reloadStart,
          endFrame: frameOf(event.tick), reloadFrames: frameOf(event.tick) - reloadStart });
        reloadStart = null;
      }
    }
    let hidden = null;
    for (const event of (calculation.stanceEvents ?? []).filter(event => event.id === actor.config.id)) {
      if (hidden) {
        const endTick = Math.min(event.tick, native.readyTick ?? calculation.result.totalTicks);
        if (hidden.cause === 'stance' && endTick > hidden.tick) {
          member.turnDodgeEvents.push({ positionIndex: member.positionIndex,
            characterName: member.character.name, startFrame: frameOf(hidden.tick),
            endFrame: frameOf(endTick), dodgeFrames: (endTick - hidden.tick) * 2,
            source: 'v2-collider-pose' });
        }
      }
      hidden = event.pose === 'hide' ? event : null;
      if (native.readyTick != null && event.tick >= native.readyTick) break;
    }
    for (const shot of calculation.shots.filter(shot => shot.id === actor.config.id &&
      (native.readyTick == null || shot.fireTick <= native.readyTick))) {
      if (shot.endTick == null || shot.endTick === shot.fireTick) continue;
      const missed = !shot.contacts?.length;
      const markerTick = missed ? missedPassTick(shot) : shot.endTick;
      if (native.readyTick != null && markerTick > native.readyTick) continue;
      member.flightEvents.push({ positionIndex: member.positionIndex, characterName: member.character.name,
        startFrame: frameOf(shot.fireTick), endFrame: frameOf(markerTick),
        flightFrames: (markerTick - shot.fireTick) * 2, missed });
      if (missed) member.missedShotEvents.push({ positionIndex: member.positionIndex,
        characterName: member.character.name, frame: frameOf(markerTick),
        flightStartFrame: frameOf(shot.fireTick), flightFrames: (markerTick - shot.fireTick) * 2,
        source: 'v2-projectile', reason: shot.reason });
    }
  }
  const timeline = [...grouped.values()].sort((a, b) => a.frame - b.frame);
  const fullFrame = native.readyTick == null ? null : frameOf(native.readyTick);
  const burstSequence = fullFrame == null ? [] : burstSequenceOf(members, fullFrame);
  const controls=new Map(),stunTimeline=[],tauntTimeline=[];
  const endTick=native.readyTick??calculation.result.totalTicks;
  for(const event of events.filter(event=>event.tick<=endTick)){
    if(!['CONTROL_START','CONTROL_END'].includes(event.type))continue;
    const key=JSON.stringify([event.id,event.ft,event.casterId]);
    if(event.type==='CONTROL_START')controls.set(key,event);
    else {
      const start=controls.get(key);
      if(start)appendControl(start,event.tick);
      controls.delete(key);
    }
  }
  for(const start of controls.values())appendControl(start,endTick);
  function appendControl(start,until){
    const actor=byId.get(start.id),caster=byId.get(start.casterId);
    if(!actor||until<=start.tick)return;
    const window={positionIndex:actor.config.slotIndex,characterName:actor.character?.name,
      startFrame:frameOf(start.tick),endFrame:frameOf(until),skillId:start.skillId,
      sourcePositionIndex:caster?.config.slotIndex,source:'v2-function-state'};
    if(start.ft===6)stunTimeline.push(window);
    if(start.ft===31)tauntTimeline.push({...window,frame:window.startFrame,
      tauntCenterPositionIndex:caster?.config.slotIndex});
  }
  return {
    engine: 'v2', teamKey, fullFrame, timeline, members,
    burstSequence, availableBurstLevel: burstSequence.length,
    burst1Frame: burstSequence[0]?.frame ?? null,
    burst2Frame: burstSequence[1]?.frame ?? null,
    burst3Frame: burstSequence[2]?.frame ?? null,
    canFullBurst: burstSequence.some(entry => entry.stage === 'B3'),
    totalCharge: native.percent, fullCharge: native.percent,
    chargePerSecond: fullFrame > 0 ? native.percent * 60 / fullFrame : 0,
    calculationEndFrame: frameOf(calculation.result.totalTicks),
    finishingPositionIndices: timeline.find(row => row.frame === fullFrame)?.contributions
      .map(part => part.positionIndex) ?? [],
    reloadTimeline: members.flatMap(member => member.reloadEvents),
    flightTimeline: members.flatMap(member => member.flightEvents),
    turnDodgeTimeline: members.flatMap(member => member.turnDodgeEvents),
    missedTimeline: members.flatMap(member => member.missedShotEvents),
    stunTimeline, stunDodgeTimeline: [], tauntTimeline,
    v2Gaps: native.gaps.map(gap => ({ ...gap, message: formatCalculationGap(gap, actors) })),
    v2TargetingAssumptions: events.filter(event => event.type === 'SKILL_TARGET_FALLBACK'),
    ...(fullFrame == null ? { warning: `V2在${frameOf(calculation.result.totalTicks)}显示帧内未充满，请检查阵容与计算缺口。` } : {}),
  };
}
