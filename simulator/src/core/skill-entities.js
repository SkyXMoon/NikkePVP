/** Charge-only projection of verified InstantNumber / InstantAll / sequential entries.
 * No character IDs and no damage/HP formula. Eligibility is conservative.
 */
import {compileChargeTrigger} from './charge-templates.js';
import {pvpScopeFor} from './function-program.js';

/** Native type27: skill values are function ID, body-result threshold, targets.
 * Its successful observation invokes a function; it is not a damage entity.
 */
export function compileHitCountObservers(program){
 const connected=[],missing=[];
 for(const source of program?.entities??[]){
  if(source.type!=='TargetHitCountGetBuff')continue;
  const values=source.values??[],functionId=String(values[0]?.skill_value);
  let reason=null;
  if(!source.resource?.verified)reason='observer-skill-resource-unverified';
  else if(Object.values(source.resource.timelines).some(v=>v.length))reason='observer-timeline-not-connected';
  else if(!program.nodes.some(n=>n.id===functionId))reason='observer-function-reference-missing';
  else if(![values[1]?.skill_value,values[2]?.skill_value].every(v=>Number.isInteger(v)&&v>0))reason='observer-count-unverified';
  else if(source.durationType!=='TimeSec'||!(source.durationUnits>0))reason='observer-duration-not-connected';
  if(reason){missing.push({id:source.id,reason});continue;}
  connected.push({id:source.id,effect:source.type,observer:true,targetCount:values[2].skill_value,
   functionId,requiredHits:values[1].skill_value,durationUnits:source.durationUnits,
   entity:{preferTarget:source.preferTarget,preferCondition:source.preferCondition,resource:source.resource},
   hitMarkerSeconds:[0]});
 }
 return {connected,missing};
}

export class SkillHitCountObserver {
 constructor(binding,target,started){
  this.binding=binding;this.target=target;this.started=started;this.count=0;
  this.remaining=Math.fround(binding.durationUnits);this.complete=false;
 }
 advance(dt,tick){if(tick>this.started)this.remaining=Math.fround(this.remaining-Math.fround(Math.fround(dt)*100));}
 hit(contact,probability=1,occurrences=1){
  if(this.complete||this.remaining<=0||contact.kind!=='character'||contact.id!==this.target.id)return null;
  if(probability===0||occurrences===0)return null;
  if(probability!==1||occurrences!==1){this.complete=true;return {reason:'observer-probabilistic-hit-state-not-connected'};}
  if(++this.count<this.binding.requiredHits)return null;
  this.complete=true;return {functionId:this.binding.functionId,probability:this.target.probability??1};
 }
}
export function compileSkillEntities(bindings=[], {variant,functions=[],program}={}) {
 const ids=new Set(functions.map(f=>f.id)),connected=[],missing=[];
 const programNodes=new Set((program?.nodes??[]).map(n=>n.id));
 // An activation the command graph dispatches itself, so the binding must not also
 // run it as a legacy timer. `OnEnemyDead` is deliberately absent: whether an
 // enemy dies needs full HP/damage accounting, which this simulator does not
 // model, so the event only ever arrives as caller-supplied input. Treating it as
 // program-managed would assert a path the calculation cannot produce on its own.
 const managedActivation=a=>programNodes.has(a.id)&&(['OnLastAmmoUse','OnFunctionOn','OnFullCount','OnStart','OnUseTeamAmmo','OnUseAmmo','OnFullChargeShot','OnHurtCount','OnFullChargeShotNum','OnFullChargeHitNum','OnHitNum','OnCheckTime'].includes(a.trigger)||
   a.trigger==='None'&&((program?.nodes??[]).some(n=>n.connected.includes(a.id))||
     (program?.entities??[]).some(e=>Object.values(e.commands).flat().includes(a.id))));
 for(const id of programNodes)ids.add(id);
 for(const binding of bindings.filter(b=>b.kind==='skill'&&b.variant===variant&&!b.excludedBeforeFirstBurst)){
  const entity=binding.entity,resource=entity?.resource;
  let reason=null;
  const activations=(binding.activations ?? []).filter(a=>ids.has(a.id))
    .map(a=>({...a,chargeTrigger:compileChargeTrigger(a)}));
  if(![1,2,13,21,24].includes(binding.skillType))reason='skill-type-handler-not-connected';
  else if(!resource?.verified)reason='skill-resource-unverified';
  else if(Object.values(resource.timelines).filter(times=>times.length).length>1)reason='multiple-timeline-priority-not-connected';
  else if(Object.values(resource.timelines).flat().some(t=>!Number.isFinite(t)||t<0))reason='invalid-hit-marker-time';
  // These auxiliary effects do not gate the skill's own charge result. Their
  // HP/stat/taunt simulation is separate from this target-count projection.
  else if(entity.auxiliaryFunctions.length && !entity.auxiliaryFunctions.every(id=>programNodes.has(id)) && !(entity.auxiliaryEffects?.length===entity.auxiliaryFunctions.length&&
    entity.auxiliaryEffects.every(e=>['StatAtk','StatDef','StatCriticalDamage','StatHpHeal','Taunt','DamageReduction'].includes(e.effect))))reason='skill-auxiliary-functions-not-connected';
  else if(!['None','IncludeNoneTargetLast','OnlyWind'].includes(entity.preferCondition))reason='skill-target-condition-not-connected';
  else if([2,24].includes(binding.skillType)&&(!Number.isInteger(entity.values[1]?.skill_value)||entity.values[1].skill_value<1))reason='skill-target-count-unverified';
  else if(binding.skillType===24&&entity.auxiliaryFunctions.length&&
    !entity.auxiliaryEffects?.every(e=>['StatAtk','StatDef','StatCriticalDamage','StatHpHeal','DamageReduction'].includes(e.effect)))
    reason='sequential-target-command-state-not-connected';
  else if(binding.skillType===13&&!(entity.values[2]?.skill_value>0))reason='skill-spatial-range-unverified';
  else if(binding.skillType===13&&(entity.values[1]?.skill_value??0)!==0)reason='skill-spatial-target-cap-not-connected';
  else if(binding.skillType===21&&(!(entity.values[2]?.skill_value>0)||entity.values[1]?.skill_value!==1))reason='skill-spatial-separate-layout-not-connected';
  else if((entity.values[2]?.skill_value??0)<0)reason='invalid-target-stagger';
  else if(!activations.length && binding.activations?.length)reason='skill-activation-function-not-selected';
  else if(!activations.length && !entity.rootSkill)reason='skill-root-ownership-unverified';
  else if(!activations.length && !(entity.cooldownUnits>0))reason='root-skill-cooldown-not-connected';
  else if(activations.some(a=>!(managedActivation(a))&&
    (!['OnUseAmmo','OnLastAmmoUse','OnPelletHitNum'].includes(a.trigger)||a.status!=='None'||a.status2!=='None'||a.delay||a.threshold<1)))
    reason='skill-activation-state-not-connected';
  // cooldownUnits/activationCount travel with the gap so the first-charge view can
  // tell an auto-cooldown skill that never fires before the first burst from a real gap.
  if(reason)missing.push({...binding,reason,cooldownUnits:entity.cooldownUnits??0,
    activationCount:binding.activations?.length??0});
  else connected.push({...binding,targetCount:[1,13].includes(binding.skillType)?Infinity:entity.values[1].skill_value,activations,
    spatial:[13,21].includes(binding.skillType),
    programManaged:activations.some(a=>managedActivation(a)),
    // AddFunction(72) -> ReservationProcessTargetingProcessor.SendWaitTick,
    // WaitSendTick creates a one-tick yield before the empty-marker hurt event.
    automaticCooldown:activations.length?null:entity.cooldownUnits,
    reservationTicks:activations.length?1:0,hitOffsetTicks:0,
    sequential:binding.skillType===24,
    targetIntervalSeconds:[2,24].includes(binding.skillType)?Math.fround((entity.values[2]?.skill_value??0)/100):0,
    hitMarkerSeconds:Object.values(resource.timelines).find(times=>times.length)??[0]});
 }
 // Native SkillType 29 (TargetingSequentialAttack, 白雪公主：重型武装 1471110).
 // It is not a "use skill" row: the full-charge auto fire spends the 自动射击就绪
 // rounds it accumulated while charging, so it has no UseCharacterSkillId producer
 // in the function table and never appears in the charge-binding index. Compiling it
 // only from `bindings` therefore dropped the whole effect without leaving a gap.
 // Parameters are the native skill values, not V1's delayed-hit table:
 //   values[0] per-segment damage ratio (10559 = the 105.59% of 效果2)
 //   values[1] 自动射击就绪 function group (its rows carry the round cap)
 //   values[2] cycle in centiseconds — the same encoding type 2/24 use for
 //             `targetIntervalSeconds`, and the same 20 the scheduler row
 //             247111004 carries (TimingTriggerType 67 OnCheckTime,
 //             TimingTriggerValue 20, StatusTriggerType 66 IsCharging, whose
 //             ConnectedFunction list feeds the 2471103 ammo group). The skill
 //             text states it directly: 每 {value} 秒 锁定 / 装弹 / 挂易伤.
 //   values[3] loaded-round cap (247111003 FullCount = 5; overridden to 15 by
 //             247112003 while 七个小矮人全面出击 is up)
 //   values[4] also 20, the per-segment spacing the 依次攻击 text leaves implicit;
 //             equal to values[2] here, so the sequential spacing is 0.2 s either
 //             way. Kept unused rather than guessed at a second meaning.
 for(const source of program?.entities??[]){
  if(source.type!=='TargetingSequentialAttack')continue;
  if(connected.some(b=>b.id===source.id)||missing.some(b=>b.id===source.id))continue;
  const values=source.values??[];
  const interval=Math.fround((values[2]?.skill_value??0)/100);
  const ammoGroup=String(values[1]?.skill_value??'');
  const cap=values[3]?.skill_value??0;
  const ammoRows=(program?.nodes??[]).filter(n=>String(n.groupId)===ammoGroup&&n.fullCount>=1);
  let reason=null;
  if(!(interval>0))reason='sequential-cycle-unverified';
  else if(!Number.isInteger(cap)||cap<1)reason='sequential-target-count-unverified';
  else if(!ammoRows.length)reason='sequential-ammo-group-unverified';
  else if(!ammoRows.some(n=>['None','IsFunctionOn','IsFunctionOff'].includes(n.status)))reason='sequential-ammo-state-unverified';
  if(reason){
   missing.push({key:'skill:'+source.id,id:source.id,kind:'skill',effect:source.type,skillType:29,
    variant,entity:source,cooldownUnits:source.cooldownUnits??0,activationCount:0,reason});
   continue;
  }
  connected.push({key:'skill:'+source.id,id:source.id,kind:'skill',effect:source.type,skillType:29,
   variant,entity:source,slots:[],
   // The auto fire is the weapon's own full-charge step: no function row fires it.
   activations:[{id:source.id,trigger:'OnFullChargeShot',threshold:1,status:'None',statusValue:0,
     status2:'None',delay:0,synthetic:true,
     chargeTrigger:compileChargeTrigger({trigger:'OnFullChargeShot',threshold:1,status:'None',status2:'None'})}],
   programManaged:false,automaticCooldown:null,reservationTicks:1,hitOffsetTicks:0,
   sequential:true,targetCount:cap,targetIntervalSeconds:interval,
   sequentialAmmo:{group:ammoGroup,cap},
   hitMarkerSeconds:Object.values(source.resource?.timelines??{}).find(times=>times.length)??[0]});
 }
 // A state-only skill may reserve another skill from its use commands.
 // It runs the function graph but never creates a parent damage result.
 for(const source of program?.entities??[]){
  if(source.type!=='SetBuff')continue;
  // A hurt command the arena cannot reach never runs, so it must not decide whether
  // this container behaves as a state-only skill. 玛律恰那's 1322510 is a SetBuff
  // container whose only hurt command is gated on OnMonsterDead.
  const live=id=>!pvpScopeFor((program.nodes??[]).find(n=>n.id===id));
  if(source.commands.before_hurt.some(live)||source.commands.after_hurt.some(live))continue;
  const commands=[...source.commands.before_use,...source.commands.after_use];
  if(!commands.some(id=>(program.nodes??[]).some(n=>n.id===id&&n.ft===72)))continue;
  const activations=(program.nodes??[]).filter(n=>n.ft===72&&String(n.value)===source.id)
    .map(n=>({id:n.id,trigger:n.trigger}));
  const root=Object.values(program.skillRoots).includes(source.id);
  const container={id:source.id,kind:'skill',variant,stateContainer:true,entity:source,
    activations,programManaged:true,automaticCooldown:!activations.length&&root?source.cooldownUnits:null,
    reservationTicks:1};
  const safe=commands.every(id=>(program.nodes??[]).some(n=>n.id===id&&['Self','AllCharacter'].includes(n.target)));
  const emptyTimeline=source.resource?.verified&&Object.values(source.resource.timelines).every(times=>times.length===0);
  if(!emptyTimeline||!safe||!activations.length&&!(container.automaticCooldown>0))
    missing.push({...container,reason:'state-container-input-not-connected'});
  else connected.push(container);
 }
 return {connected,missing};
}
