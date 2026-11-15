/** Convert V2 events to the existing site's presentation contract. */
export function formatCalculationGap(gap, actors) {
  const actor = actors.find(entry => entry.config.id === gap.id);
  const owner = actor ? `${actor.config.team === 0 ? '进攻' : '防守'}P${actor.config.slotIndex + 1} ${actor.character?.name ?? ''}` : gap.id;
  if (gap.reason === 'skill-target-ranking-input-required') {
    const attribute = { attack: '攻击力', defence: '防御力', hp: '当前生命值', maxHp: '最大生命值' }[gap.rankingField] ?? '属性';
    return `${owner}：技能${gap.functionId ?? gap.skill ?? ''}需要按${attribute}选择目标，当前缺少候选目标的${attribute}数据，相关技能充能可能不完整。`;
  }
  return `V2计算缺口 ${owner ?? ''} ${gap.reason}`;
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

export function projectSiteTeam(calculation, actors, teamKey, burstSequenceOf) {
  const team = teamKey === 'attack' ? 0 : 1;
  const entries = actors.filter(actor => actor.config.team === team && actor.character);
  const native = calculation.result.teams.find(row => row.team === team);
  if (!entries.length && !native?.timeline.some(event => event.generatedCharge > 0)) return null;
  const frameOf = tick => Math.max(0, (tick - 6) * 2);
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
    if (member) {
      member.totalCharge += charge;
      member.attackChargeTotal += charge;
      member.hitFrames.push(frame);
    }
    const contribution = {
      positionIndex: actor.config.slotIndex, characterId: actor.character?.id,
      character: actor.character,
      characterName: actor.character?.name ?? `P${actor.config.slotIndex + 1}万能`,
      charge, cumulativeCharge: member?.totalCharge ?? charge,
      labels: [!member ? '万能充能' : event.skillId ? `技能 ${event.skillId}` : event.type === 'HIT' ? '普通攻击' : '直接充能'],
      counterHits: event.contacts.length,
      positionHits: [...targets].map(([positionIndex, hitCount]) => ({ positionIndex, hitCount })),
      targetHits: [...targets].map(([positionIndex, hitCount]) => ({ positionIndex, hitCount })),
      showOnMember: !!member,
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
