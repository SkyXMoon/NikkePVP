/** Native trigger templates. No character IDs, names, HP or charge arithmetic.
 * Inputs are native event facts/counters, not inferred skill-description text.
 * Effect execution remains owned by driver.js and charge-events.js.
 */
const TRIGGERS = Object.freeze({
  1: {name:'OnStart',event:'start',mode:'always'},
  2: {name:'OnShotRatio',event:'ordinary-hit',mode:'probability'},
  3: {name:'OnUseAmmo',event:'ammo-used',mode:'count'},
  37: {name:'OnLastAmmoUse',event:'last-ammo-used',mode:'flag',flag:'lastAmmo'},
  6: {name:'OnFullChargeShot',event:'full-charge-shot',mode:'always'},
  7: {name:'OnHurtRatio',event:'body-hurt',mode:'probability'},
  13: {name:'OnCoverHurtRatio',event:'cover-hurt',mode:'probability'},
  27: {name:'OnFullChargeHit',event:'ordinary-hit',mode:'flag',flag:'fullCharge'},
  29: {name:'OnLastShotHit',event:'ordinary-hit',mode:'flag',flag:'lastAmmo'},
  31: {name:'OnHitNum',event:'ordinary-hit',mode:'count'},
  38: {name:'OnSpawnTarget',event:'target-spawn',mode:'always'},
  43: {name:'OnEndFullBurst',event:'burst-end',mode:'always'},
  44: {name:'OnNikkeDead',event:'nikke-dead',mode:'always'},
  61: {name:'OnFullChargeHitNum',event:'ordinary-hit',mode:'count',flag:'fullCharge'},
  64: {name:'OnPelletHitNum',event:'pellet-hit',mode:'count'},
  83: {name:'OnUseTeamAmmo',event:'team-ammo-used',mode:'count'},
});
const BY_NAME=new Map(Object.entries(TRIGGERS).map(([id,t])=>[t.name,Number(id)]));
const none=value=>value==null||value===0||value==='None';

/** Compile eligibility only. A template does not prove that its producer is wired. */
export function compileChargeTrigger(row) {
  const id=typeof row.trigger==='string'?BY_NAME.get(row.trigger):row.trigger;
  const definition=TRIGGERS[id];
  if(!definition)return {supported:false,reason:'trigger-template-unverified'};
  if(!none(row.statusTrigger ?? row.status)||!none(row.statusTrigger2 ?? row.status2))
    return {supported:false,reason:'trigger-condition-template-unverified'};
  if((row.delayValue ?? row.delay ?? 0)!==0)
    return {supported:false,reason:'trigger-delay-template-unverified'};
  const threshold=row.triggerValue ?? row.threshold ?? 0;
  if(definition.mode==='count'&&(!Number.isInteger(threshold)||threshold<1))
    return {supported:false,reason:'invalid-trigger-count'};
  if(definition.mode==='probability'&&(!Number.isFinite(threshold)||threshold<=0||threshold>10000))
    return {supported:false,reason:'invalid-trigger-probability'};
  return {supported:true,id,...definition,threshold,
    templateId:`native-trigger.${definition.name}`};
}

/** Return dispatch probability after evaluating a supplied native event.
 * Counters are supplied by the event producer, so compiling OnHitNum(N) does not
 * invent how shotgun/dual-muzzle/multi-target counters are incremented.
 */
export function matchChargeTrigger(template,event,{probabilityMode='expected',random}={}) {
  if(!template?.supported||event.type!==template.event)return 0;
  if(template.flag&&!event[template.flag])return 0;
  if(template.mode==='count'){
    if(!Number.isInteger(event.count)||event.count<1||event.count%template.threshold!==0)return 0;
  }
  if(template.mode!=='probability')return 1;
  const p=template.threshold/10000;
  if(probabilityMode==='expected')return p;
  if(probabilityMode!=='sampled')throw new RangeError('Unknown probability mode');
  if(p===1)return 1;
  if(typeof random!=='function')throw new TypeError('Sampled probability requires a random source');
  return random()<p?1:0;
}

/** Describe an implemented effect without moving its arithmetic into templates. */
export function describeChargeEffect(ft) {
  return ({75:'damage-result',111:'direct-gauge',102:'gauge-modifier',146:'full-charge-repeat'})[ft]??null;
}

/** Verified FT75 producer subset. Unknown state/counter producers remain gaps. */
export function compileDamageChargeTemplate(row) {
  const trigger=compileChargeTrigger(row);
  if(row.ft!==75||row.slot==='burst'||row.target!==4)
    return {supported:false,reason:'damage-owner-or-target-unverified'};
  if(!trigger.supported)return trigger;
  if(trigger.id===29&&trigger.threshold!==10000)
    return {supported:false,reason:'last-hit-probability-unverified'};
  if(![2,7,27,29,31,61,64].includes(trigger.id))
    return {supported:false,reason:'damage-trigger-producer-unverified'};
  return {supported:true,skillId:row.id,trigger,effect:'damage-result',
    templateId:`damage-result/${trigger.name}`,timing:'native-event'};
}

/** Connected FT0 markers -> native FT202 periodic damage, before first burst.
 * Activation paths are compiled from raw connected_function IDs, not names.
 */
export function compileConnectedPeriodicBindings(bindings=[],variant) {
  const connected=[],missing=[];
  for(const binding of bindings.filter(b=>b.kind==='function'&&b.ft===202&&b.variant===variant&&!b.excludedBeforeFirstBurst)){
    const node=binding.functionNode;
    const parents=(binding.activationFunctions??[]).filter(p=>!p.excludedBeforeFirstBurst);
    const activations=parents.map(parent=>({...parent,chargeTrigger:compileChargeTrigger(parent)}));
    let reason=null;
    if(!node||node.ft!==202||node.trigger!=='None'||node.target!=='Target'||node.delay||
      !none(node.status)||!none(node.status2)||node.connected.length)
      reason='periodic-function-node-unverified';
    else if(!['TimeSec','TimeSec_Ver2','TimeSec_Ver3'].includes(node.durationType)||!(node.durationUnits>0))
      reason='periodic-function-duration-unverified';
    else if(!activations.length||activations.some(p=>p.ft!==0||p.target!=='Target'||!p.connected.includes(binding.id)||
      !p.chargeTrigger.supported||p.chargeTrigger.id!==31))reason='periodic-function-activation-not-connected';
    if(reason)missing.push({...binding,reason});
    else connected.push({...binding,activations,durationUnits:node.durationUnits,resetOnRefresh:node.durationType==='TimeSec_Ver3'});
  }
  return {connected,missing};
}
