/** Native function-group command interpreter. No character IDs or HP formula.
 * All state writes use the recipient's existing FunctionTrack owner.
 */
import {FT_RATE_MAP} from './rates.js';
/** Events an arena battle cannot produce, or that this simulator has no
 * subsystem for. A node gated on one of them can never fire, so counting it as a
 * first-charge gap over-reports: the row contributes no charge either way. Each
 * scope says *why* it is out of reach, because the two reasons are different and
 * must not be read as one.
 *
 *  - arena-no-spawn: the arena is a fixed ten-Nikke lineup. Nothing is summoned,
 *    nothing counts as a monster, no monster ever dies, so `targets('Monsters')`
 *    is always empty.
 *  - no-barrier-model: barrier exists only as a damage-reduction stat slot.
 *    Nothing installs, absorbs or breaks one, so its events never arrive and its
 *    predicate can never be true.
 *  - arena-no-core: a core is a monster collider. Character and cover targets keep
 *    IsCore false, so a core-hit counter never advances.
 *  - caller-input-death / caller-input-resurrection: whether an enemy dies or comes
 *    back needs full HP and damage accounting, which this simulator does not do.
 *    The event arrives as caller-supplied input or not at all; with no input the
 *    branch simply does not happen and charge proceeds normally.
 *  - caller-input-hp: same argument for an HP-ratio trigger. There is no HP pool,
 *    so "the ratio went above/below a line" cannot be derived here either.
 *  - team-ammo-not-before-first-burst: team ammo does exist in arena, but the pool
 *    cannot be filled before the first burst, so it adds nothing to the first slot.
 *    The subsystem stays unbuilt on purpose; the row is still recorded.
 */
const PVP_SCOPE_TRIGGERS=new Map([
  // Arena is a fixed ten-Nikke lineup: nothing is summoned, nothing counts as a
  // monster, no monster ever dies, so `targets('Monsters')` is always empty.
  // Program nodes carry the trigger name, legacy skill rows carry its id, so both
  // are listed side by side and cannot drift apart.
  ['OnSpawnEnemy','arena-no-spawn'], [82,'arena-no-spawn'],
  ['OnSpawnMonster','arena-no-spawn'], [26,'arena-no-spawn'],
  ['OnSpawnMonsterExcludeNoneType','arena-no-spawn'], [85,'arena-no-spawn'],
  ['OnSpawnMonsterIncludeNoneType','arena-no-spawn'], [94,'arena-no-spawn'],
  ['OnSummonMonster','arena-no-spawn'], [62,'arena-no-spawn'],
  ['OnMonsterDead','arena-no-spawn'], [50,'arena-no-spawn'],
  // Barrier exists only as a damage-reduction stat slot. Nothing installs,
  // absorbs or breaks one, so its events never arrive and its predicate can never
  // be true (52 OnInstallBarrier, 91 OnBrokenBarrier).
  ['OnInstallBarrier','no-barrier-model'], [52,'no-barrier-model'],
  ['OnBrokenBarrier','no-barrier-model'], [91,'no-barrier-model'],
  // 58 OnCoreHitNum. DamageData keeps IsCore=false for character/cover targets, and
  // trigger 58 is dispatched only from the StatusInfo.IsCore branch, so a core-hit
  // counter cannot advance in arena. Same fact the binding export already applies
  // to the CN region.
  ['OnCoreHitNum','arena-no-core'], [58,'arena-no-core'],
  // Death and resurrection need full HP/damage accounting. Deliberately not
  // modelled: the caller supplies the notification, or the branch never happens.
  ['OnEnemyDead','caller-input-death'], [71,'caller-input-death'],
  ['OnResurrection','caller-input-resurrection'], [42,'caller-input-resurrection'],
  // HP ratio is the same kind of fact as death: this simulator carries no HP pool
  // and no damage accounting, so whether the ratio is above or below a line is
  // caller input, not something it can derive. 爱丽丝(191)'s FT54 sits on
  // OnHpRatioUp(8000) with a `Battles` duration — with no HP feed the branch never
  // happens, and charge proceeds without it.
  ['OnHpRatioUp','caller-input-hp'], [16,'caller-input-hp'],
  ['OnHpRatioUnder','caller-input-hp'], [15,'caller-input-hp'],
]);
const PVP_SCOPE_STATUSES=new Map([['IsHaveBarrier','no-barrier-model']]);
// A caller-input scope holds only while the caller supplies no such native event.
// With no input the branch never happens and charge proceeds normally; once the
// caller provides the notification the branch is live again and its gaps count.
export const CALLER_INPUT_EVENTS=new Map([
  ['caller-input-death','entity-probably-die'],
  ['caller-input-resurrection','resurrection'],
]);
export const suppliedScopes=(events=[])=>new Set([...CALLER_INPUT_EVENTS]
  .filter(([,type])=>events.some(event=>event?.type===type)).map(([scope])=>scope));
// Function types whose subsystem is out of first-charge reach on purpose.
const PVP_SCOPE_FTS=new Map([
  // 214 AddTeamAmmo. Team ammo exists in arena, but the pool cannot be filled
  // before the first burst, so it contributes nothing to the first slot. Recorded,
  // not built.
  [214,'team-ammo-not-before-first-burst'],
]);
const directScope=node=>PVP_SCOPE_TRIGGERS.get(node?.trigger)
  ??PVP_SCOPE_STATUSES.get(node?.status)??PVP_SCOPE_STATUSES.get(node?.status2)
  ??PVP_SCOPE_FTS.get(node?.ft)??null;
/** Why this node is out of arena reach, or null when it is reachable.
 * A node inherits the verdict through its activation edges: an event that cannot
 * happen invokes no child either, so a branch hanging off a dead root is equally
 * dead. `FunctionProgram` stamps the verdict onto `node.pvpScope` for every node
 * it holds — including a reachable one, `null` — because a caller-input scope
 * stops applying once the caller supplies the event, and the stamp is what says
 * so. A legacy skill row carries no graph and no stamp, so it always answers
 * from its own fields.
 * The verdict is recorded on the gap row; the first-charge view drops it there,
 * so the collection layer keeps every factual row. */
export const pvpScopeFor=node=>node&&Object.hasOwn(node,'pvpScope')?node.pvpScope:directScope(node);
export const isStaticRateState=node=>[16,85].includes(node.ft)&&node.target==='Self'&&
  node.standard==='User'&&node.valueType==='Percent'&&
  ['TimeSec','TimeSec_Ver2','TimeSec_Ver3','Battles','TimeSecBattles'].includes(node.durationType);
export const isReloadState=node=>[13,159].includes(node.ft)&&node.valueType==='Percent'&&
  ['TimeSec','TimeSec_Ver2','TimeSec_Ver3','Battles','TimeSecBattles','Shots','SkillShots'].includes(node.durationType);
export const isInstantShareEffect=node=>node.ft===135&&['Target','AllMonster'].includes(node.target)&&
  node.standard==='FunctionTarget'&&node.valueType==='Percent'&&node.value===10000&&
  node.durationUnits===0&&node.durationType==='TimeSec'&&node.fullCount===1&&
  node.trigger==='None'&&!(node.delay>0);
// Stat writes only: they land in the ledger and reshape no hit instance and no
// fire cadence. `StatBonusRangeMin` (FT140) belongs here for the same reason —
// it is a range attribute, not a shot count; 爱德：特工兔女郎's 231511002 only
// became visible once the FT54 state closure pulled its counter producer in.
const stateOnly=node=>['StatAtk','StatDef','StatChargeDamage','StatCritical','StatCriticalDamage','StatHpHeal','AddDamage','DamageReduction','Taunt','Infection','DurationDamageRatio','PartsDamage','StatBonusRangeMin'].includes(node.effect)||
  Object.hasOwn(FT_RATE_MAP,node.ft);
/** Ammo/reload effects: they only change what happens after a magazine empties. */
export const AMMO_FTS=new Set([13,14,27,108,159]);
/** Group ids a node reads through its status or trigger. */
export const groupRefs=node=>{
  const refs=[];
  if(['IsFunctionOn','IsFunctionOff','IsFullCount'].includes(node.status)&&node.statusValue!=null)refs.push(String(node.statusValue));
  if(['IsFunctionOn','IsFunctionOff','IsFullCount'].includes(node.status2)&&node.statusValue2!=null)refs.push(String(node.statusValue2));
  if(['OnFunctionOn','OnFunctionOff','OnFullCount'].includes(node.trigger)&&node.threshold!=null)refs.push(String(node.threshold));
  return [...new Set(refs)];
};
export class FunctionProgram {
  constructor({program,actor,bookFor,targets,onCommand,onEvent,onGap,skipRoots=[],required=null,cadenceSupported=false,probabilityMode='expected',random=Math.random,suppliedScopes=[]}) {
    this.actor=actor;this.bookFor=bookFor;this.targets=targets;this.onCommand=onCommand;
    this.onEvent=onEvent;this.onGap=onGap;this.skipRoots=new Set(skipRoots);
    this.nodes=new Map((program?.nodes??[]).map(n=>[n.id,n]));
    this.roots=(program?.roots??[]).map(id=>this.nodes.get(id)).filter(Boolean);
    this.program=program;this.depth=0;this.pending=[];
    this.useCounts=new Map();
    this.cadenceSupported=cadenceSupported;
    this.probabilityMode=probabilityMode;this.random=random;
    // Native notifications the caller handed in. A caller-input scope holds only
    // while its event is absent, so this set decides which of them still apply.
    this.supplied=new Set(suppliedScopes);
    this.relevant=required==null?null:new Set(required);
    this.ammoGated=this.computeAmmoGated();
    this.computeOutOfReach();
    if(this.relevant){
      let changed=true;
      while(changed){changed=false;const before=this.relevant.size;
        for(const entity of program.entities??[]){
          const references=[...Object.values(entity.commands).flat(),...(entity.functionReferences??[])];
          if(!this.relevant.has(entity.id)&&!references.some(id=>this.relevant.has(id)))continue;
          this.relevant.add(entity.id);
          for(const id of references)this.relevant.add(id);
          for(const node of this.nodes.values())if(node.ft===72&&String(node.value)===entity.id||
            node.effect==='UseSkill1'&&program.skillRoots.skill1===entity.id||node.effect==='UseSkill2'&&program.skillRoots.skill2===entity.id)
            this.relevant.add(node.id);
        }
        for(const node of this.nodes.values()){
          if(node.connected.some(id=>this.relevant.has(id)))this.relevant.add(node.id);
          if(!this.relevant.has(node.id))continue;
          for(const child of node.connected)this.relevant.add(child);
          const groups=[['IsFunctionOn','IsFunctionOff','IsFullCount'].includes(node.status)?node.statusValue:null,
            ['IsFunctionOn','IsFunctionOff','IsFullCount'].includes(node.status2)?node.statusValue2:null,
            ['OnFunctionOn','OnFunctionOff','OnFullCount'].includes(node.trigger)?node.threshold:null];
          for(const producer of this.nodes.values())if(groups.some(g=>g!=null&&String(g)===producer.groupId))this.relevant.add(producer.id);
        }
        changed=this.relevant.size!==before;
      }
    }
  }

  gap(node,reason){this.onGap?.(node,reason);return null;}
  /**
   * Nodes that can only fire as a consequence of ammo/reload changes: an ammo
   * effect itself, or a node whose status/trigger groups are produced solely by
   * ammo effects. If the magazine never empties they cannot fire at all.
   */
  computeAmmoGated(){
    const gated=new Set(),nodes=[...this.nodes.values()];
    for(const node of nodes){
      if(AMMO_FTS.has(node.ft)){gated.add(node.id);continue;}
      const refs=groupRefs(node);
      if(!refs.length)continue;
      const producers=refs.map(id=>nodes.filter(n=>String(n.groupId)===id));
      if(producers.every(list=>list.length>0&&list.every(n=>AMMO_FTS.has(n.ft))))gated.add(node.id);
    }
    return gated;
  }
  /**
   * Out-of-reach closure. The seed is the per-node verdict; the step is an
   * activation edge. A child is out of reach once *every* way of reaching it is:
   * one live parent keeps it alive, and a skill-entity command list counts as
   * live because the entity is bound from the charge table rather than gated on
   * an arena event. An inherited node keeps the parent's label, so the recorded
   * reason still says which subsystem is missing.
   */
  computeOutOfReach(){
    const out=new Set(),inbound=new Map();
    const edge=(from,to)=>{let list=inbound.get(to);if(!list)inbound.set(to,list=[]);list.push(from);};
    for(const node of this.nodes.values()){
      // `excludedInPvp` is the binding export's own verdict that this function is
      // ineligible in PVP. A never-dispatched parent invokes no child, so the
      // children inherit it exactly like a trigger the arena cannot produce.
      const stamped=directScope(node);
      // A caller-input scope holds only while the caller supplies no such native
      // event. With no input that branch never happens and charge proceeds
      // normally; once the caller hands the notification in, the branch is live
      // again and its own gaps have to count. Either way the node is stamped,
      // `null` included: silence from this graph is a verdict, not an absence.
      const own=stamped?(this.supplied.has(stamped)?null:stamped)
        :node.excludedInPvp?'excluded-in-pvp':null;
      node.pvpScope=own;
      if(own)out.add(node.id);
      for(const child of node.connected)edge(node.id,child);
    }
    for(const entity of this.program?.entities??[])
      for(const ids of Object.values(entity.commands??{}))
        for(const id of ids)edge(`@${entity.id}`,id);
    let changed=true;
    while(changed){changed=false;
      for(const node of this.nodes.values()){
        if(out.has(node.id))continue;
        const parents=inbound.get(node.id);
        if(!parents?.length||!parents.every(id=>out.has(id)))continue;
        out.add(node.id);
        node.pvpScope=parents.map(id=>this.nodes.get(id)?.pvpScope).find(Boolean)??'unreachable-parent';
        changed=true;
      }
    }
    this.outOfReach=out;
  }
  /** An entity whose whole command table the arena cannot reach produces nothing,
   * so a reference to it is moot rather than missing. 玛律恰那's 1322510 is a
   * SetBuff container whose only hurt command is gated on OnMonsterDead. */
  inertEntity(id){
    const entity=this.program?.entities?.find(e=>e.id===String(id));
    if(!entity)return false;
    const commands=Object.values(entity.commands??{}).flat();
    return commands.length>0&&commands.every(command=>pvpScopeFor(this.nodes.get(String(command))));
  }
  audit(skillIds){
    const issues=[];
    // `blocking` distinguishes "this program cannot be claimed complete" from
    // "this node is unsupported". A node whose trigger or predicate the arena
    // cannot produce still has to be recorded — nothing implements it — but it
    // never fires, so it cannot make the simulated timeline wrong either. Without
    // the split one dead node vetoes the claim for the whole graph, and every row
    // the graph does implement keeps reading as a gap.
    const report=(node,reason)=>issues.push({id:node.id,ft:node.ft,reason,trigger:node.trigger,
      ...(pvpScopeFor(node)?{blocking:false,pvpScope:pvpScopeFor(node)}:{})});
    const conditions=new Set(['IsFunctionTypeOffCheck','None','IsFunctionOn','IsFunctionOff','IsFullCount','IsCheckFunctionOverlapUp',
      'IsStun','IsAlive','IsCheckMonsterType','IsCharacter','IsCheckEnemyNikke','IsCheckMonsterExcludeNoneType','IsSearchElementId','IsWeaponType',
      'IsCheckNotTarget']);
    const triggers=new Set(['OnLastAmmoUse','OnFunctionBuffCheck','OnFunctionBuffEtcCheck','OnFunctionDebuffCheck','OnFunctionDebuffEtcCheck','OnEndReload','OnHitNumberOver','OnFullChargeShotNum','OnFullChargeHitNum','OnHurtCount','OnStart','OnFullCharge','OnFullChargeShot','OnFullChargeHit','OnLastShotHit','OnFunctionOn','OnFunctionOff','OnFullCount','OnHitNum','OnPelletHitNum','OnPelletHitPerShot','OnShotRatio','OnCoverHurtRatio','OnUseAmmo','OnUseTeamAmmo','OnCheckTime','OnResurrection','OnEnemyDead']);
    for(const node of this.nodes.values()){
      if(this.relevant&&!this.relevant.has(node.id)||node.excludedBeforeFirstBurst||node.excludedInPvp||this.skipRoots.has(node.id))continue;
      // A stateOnly node only writes stat/taunt/... buffs: it neither creates hit
      // events nor reshapes the firing cadence, so an unrecognised condition or
      // trigger on it cannot become a first-charge gap.
      if(!stateOnly(node)){
        if(!['Self','Target','AllCharacter','AllMonster'].includes(node.target))report(node,'function-program-target-not-connected');
        for(const [type,value] of [[node.status,node.statusValue],[node.status2,node.statusValue2]])
          if(type&&!conditions.has(type))report(node,'function-program-condition-not-connected');
        if(node.delay>0&&node.delayType!=='TimeSec')report(node,'function-program-delay-type-not-connected');
        if(this.roots.includes(node)&&node.trigger!=='None'&&!triggers.has(node.trigger))
          report(node,'function-program-trigger-not-connected');
        if(this.roots.includes(node)&&['OnShotRatio','OnCoverHurtRatio'].includes(node.trigger)&&node.threshold>0&&node.threshold<10000&&this.probabilityMode==='expected')
          report(node,'state-program-probabilistic-condition-not-connected');
        if(['OnShotRatio','OnCoverHurtRatio'].includes(node.trigger)&&(!Number.isInteger(node.threshold)||node.threshold<0||node.threshold>10000))
          report(node,'function-program-probability-invalid');
        if([75,202].includes(node.ft)&&(node.durationUnits>0||node.durationType==='TimeSecBattles')&&
          !['TimeSec','TimeSec_Ver2','TimeSec_Ver3','TimeSecBattles'].includes(node.durationType))
          report(node,'function-program-duration-not-connected');
      }
      if(node.ft===72||['UseSkill1','UseSkill2'].includes(node.effect)){
        const id=node.ft===72?String(node.value):this.program.skillRoots[node.effect==='UseSkill1'?'skill1':'skill2'];
        if(!skillIds.has(id)&&!this.inertEntity(id))report(node,'function-program-skill-not-connected');
      }else if(![0,6,54,61,64,75,77,102,111,124,134,146,164,167,202].includes(node.ft)&&
        !stateOnly(node)&&!isReloadState(node)&&!isInstantShareEffect(node)&&!(this.cadenceSupported&&isStaticRateState(node)))
        report(node,'function-program-effect-not-connected');
    }
    return issues;
  }
  condition(type,standard,value,context,otherValue){
    if(type==='None'||type==null)return true;
    const entity=standard==='User'?this.actor:standard==='FunctionTarget'?context.target:
      standard==='TriggerTarget'?context.triggerTarget:null;
    if(!entity)return null;
    const book=this.bookFor(entity),group=book.group(value);
    if(type==='IsFunctionTypeOffCheck'){
      if(book.uncertainFunctionTypes?.has(Number(value)))return null;
      return book.byFt(Number(value)).length===0;
    }
    const testedGroup=type==='IsCheckFunctionOverlapUp'?otherValue:value;
    if(['IsFunctionOn','IsFunctionOff','IsFullCount','IsCheckFunctionOverlapUp'].includes(type)&&
      book.uncertainGroups?.has(String(testedGroup)))return null;
    if(type==='IsFunctionOn')return group.length>0;
    if(type==='IsFunctionOff')return group.length===0;
    if(type==='IsFullCount')return group.some(b=>b.stacks>=(b.fullCount??1));
    if(type==='IsCheckFunctionOverlapUp')return book.group(otherValue).every(b=>b.stacks>=value);
    if(type==='IsStun')return book.byFt(6).length>0;
    if(type==='IsAlive')return entity.alive!==false;
    if(type==='IsCheckMonsterType')return entity.kind==='monster';
    if(type==='IsCharacter')return entity.kind==='character';
    if(type==='IsWeaponType'){
      const target=this.targets('Entity',{target:entity})[0];
      if(target?.kind!=='character')return false;
      return Number.isInteger(target.weaponTypeCode)?target.weaponTypeCode===value:null;
    }
    if(type==='IsSearchElementId'){
      const ids=this.targets('Entity',{target:entity})[0]?.elementIds;
      return Array.isArray(ids)?ids.includes(value):null;
    }
    if(type==='IsCheckEnemyNikke')return this.targets('EnemyCharacters',{target:entity}).length>=value;
    if(type==='IsCheckMonsterExcludeNoneType')return this.targets('Monsters',{target:entity}).length>=value;
    if(type==='IsCheckNotTarget'){
      // Native: SpotFunctionLogic.IsValidStatusCondition, StatusTriggerType 62
      // (jump table 0x5DD3E8C -> case 0x5DD3B31).
      // The branch opens with an il2cpp `isinst SpotMonster` (klass vtable slot
      // compare at 0x5DD3B5F); when the cast fails it returns **false** itself
      // (0x5DD3B38 -> 0x5DD3E1A `xor al,al; ret`) -- the value is never read.
      // Arena hit targets are characters (same premise as driver.js:1314), so
      // this condition cannot hold there regardless of the row's value.
      if(entity.kind!=='monster')return false;
      // Cast succeeds: value 1 -> IsIrregular() ? 1 : IsTarget(),
      // value 2 -> IsTarget(), anything else -> 0; then the byte is negated.
      // IsTarget is SpotMonster.<IsTarget>k__BackingField at 0xC8 and
      // IsIrregular is the sibling getter at 0x5B3E4C0 -- both runtime state.
      if(value!==1&&value!==2)return true;
      if(value===1&&entity.isIrregular===true)return false;
      return entity.isTarget==null?null:!entity.isTarget;
    }
    return null;
  }

  matches(node,context){
    const first=this.condition(node.status,node.statusStandard,node.statusValue,context,node.statusValue2);
    if(first===false)return false;
    const second=this.condition(node.status2,node.statusStandard2,node.statusValue2,context,node.statusValue);
    if(second===false)return false;
    return first==null||second==null?null:true;
  }

  dispatch(event){
    for(const node of this.roots){
      if(this.skipRoots.has(node.id)||node.excludedBeforeFirstBurst||node.excludedInPvp||node.trigger!==event.type)continue;
      if(this.relevant&&!this.relevant.has(node.id))continue;
      if(['OnFunctionBuffCheck','OnFunctionBuffEtcCheck','OnFunctionDebuffCheck','OnFunctionDebuffEtcCheck'].includes(node.trigger)){
        if(event.functionType!==node.threshold||event.owner?.id!==this.actor.id||event.owner?.kind!==this.actor.kind)continue;
      }else if(['OnFunctionOn','OnFunctionOff','OnFullCount'].includes(node.trigger)){
        if(String(node.threshold)!==String(event.groupId)||event.owner?.id!==this.actor.id||event.owner?.kind!==this.actor.kind)continue;
      }else if(node.trigger==='OnResurrection'){
        if(![0,1].includes(node.threshold)||event.triggerTarget?.team==null||this.actor.team==null){
          this.gap(node,'function-program-resurrection-team-not-connected');continue;
        }
        if((event.triggerTarget.team===this.actor.team)!==(node.threshold===0))continue;
      }else if(node.trigger==='OnLastAmmoUse'){
        if(!event.lastAmmo)continue;
        if(node.threshold!==10000){this.gap(node,'function-program-last-ammo-threshold-unverified');continue;}
      }else if(node.trigger==='OnHitNumberOver'){
        if(!Number.isInteger(event.count)||event.count<node.threshold)continue;
      }else if(node.trigger==='OnEnemyDead'){
        if(event.casterTeam!==this.actor.team)continue;
      }else if(['OnFullChargeShotNum','OnFullChargeHitNum','OnHurtCount','OnHitNum','OnPelletHitNum','OnPelletHitPerShot','OnUseAmmo','OnUseTeamAmmo','OnCheckTime'].includes(node.trigger)){
        const unconditionalFullChargeCount=['OnFullChargeShotNum','OnFullChargeHitNum'].includes(node.trigger)&&node.threshold===0;
        if(!unconditionalFullChargeCount&&(!event.count||event.count%node.threshold!==0))continue;
      }else if(['OnShotRatio','OnCoverHurtRatio'].includes(node.trigger)){
        if(!Number.isInteger(node.threshold)||node.threshold<0||node.threshold>10000){
          this.gap(node,'function-program-probability-invalid');continue;
        }
        if(node.threshold===0)continue;
        if(node.threshold!==10000){
          if(this.probabilityMode==='expected'){
            this.gap(node,'state-program-probabilistic-condition-not-connected');continue;
          }
          if(this.random()>=node.threshold/10000)continue;
        }
      }else if(!['OnStart','OnEndReload','OnFullCharge','OnFullChargeShot','OnFullChargeHit','OnLastShotHit'].includes(node.trigger))continue;
      this.invoke(node.id,{...event,target:event.target??this.actor,triggerTarget:event.triggerTarget??event.target??this.actor});
    }
  }

  invoke(id,context){
    const node=this.nodes.get(String(id));
    if(!node)return this.gap({id:String(id)},'function-program-reference-missing');
    if(this.relevant&&!this.relevant.has(node.id))return;
    if(node.excludedBeforeFirstBurst||node.excludedInPvp)return;
    if(++this.depth>100){this.depth--;return this.gap(node,'function-program-synchronous-cycle');}
    try{
      let admitted=false;
      for(const target of this.targets(node.target,context)){
        const input={...context,target,activationId:context.activationId??node.id};
        const valid=this.matches(node,input);
        if(valid==null){this.gap(node,'function-program-condition-not-connected');continue;}
        if(!valid)continue;
        if(!admitted){
          const limit=node.limitValue??0;
          if(!Number.isInteger(limit)||limit<0)return this.gap(node,'function-program-use-limit-invalid');
          const used=this.useCounts.get(node.id)??0;
          if(limit&&used>=limit)return;
          if(limit)this.useCounts.set(node.id,used+1);
          admitted=true;
        }
        // ProcessFunctionAdd checks both predicates before OnGetAddFunction
        // queues this recipient. ConnectedFunctionAdd runs immediately after
        // that request; expiry sends AddFunctionEvent, not ProcessFunctionAdd.
        if(node.ft===134){
          if(!node.connected.length||node.delay>0){this.gap(node,'function-program-cycle-layout-not-connected');continue;}
          const index=this.bookFor(target).nextFunctionCycleIndex(node.id,node.connected.length);
          this.invoke(node.connected[index],input);
          continue;
        }
        if(node.delay>0){
          if(node.delayType!=='TimeSec'){
            this.gap(node,'function-program-delay-type-not-connected');continue;
          }
          this.pending.push({node,context:input,remaining:Math.fround(node.delay)});
        }else this.execute(node,input);
        for(const child of node.connected)this.invoke(child,input);
      }
    }finally{this.depth--;}
  }

  advance(dt,tick){
    const batch=this.pending;this.pending=[];
    const decrement=Math.fround(Math.fround(dt)*100);
    for(const item of batch){
      item.remaining=Math.fround(item.remaining-decrement);
      if(item.remaining>0)this.pending.push(item);
      else if(item.context.target.alive!==false)this.execute(item.node,{...item.context,tick});
    }
  }

  execute(node,input){
        const target=input.target;
        const book=this.bookFor(target);
        if(node.ft===77){
          if(!Number.isInteger(node.value)||node.value<0)return this.gap(node,'function-program-dispel-count-invalid');
          const snapshot=book.list().slice();
          if(book.uncertainGroups?.size||snapshot.some(b=>!b.buffType||!b.buffRemoveType))
            return this.gap(node,'function-program-dispel-metadata-not-connected');
          let remaining=node.value;
          for(const buff of snapshot){
            if(!remaining)break;
            if(buff.buffType!=='Buff'||buff.buffRemoveType!=='Clear')continue;
            if(book.removeFunction(buff)){
              remaining--;this.emit('OnFunctionOff',buff.groupId,target,input);
            }
          }
        }else if(node.ft===164){
          const removed=book.removeGroup(node.value);
          if(removed.length)this.emit('OnFunctionOff',String(node.value),target,input);
        }else if(node.ft===167){
          const old=book.group(node.value)[0];
          if(old?.stateNode)this.add(old.stateNode,old.casterId,target,node.fullCount,input);
        }else if(node.ft===72||node.effect==='UseSkill1'||node.effect==='UseSkill2'){
          const skillId=node.ft===72?String(node.value):this.program.skillRoots[node.effect==='UseSkill1'?'skill1':'skill2'];
          if(!this.onCommand?.({kind:'skill',node,skillId,target,context:input})&&!this.inertEntity(skillId))
            this.gap(node,'function-program-skill-not-connected');
        }else if(node.ft===124){
          // Transformation: switch the actor's form. The form itself is carried by
          // the connected functions, not by this node — 方舟黑色游侠's 257010118
          // writes group 2570118 with `Battles` duration and the transformed skill
          // set (FT1 StatAtk, FT202 DurationDamage) is gated on it, while the exit
          // node 257010113 goes through 257010114 RemoveFunctionGroup(2570118).
          // This node's own group is TimeSec with durationUnits 0, i.e. not a
          // function that persists, and `value` is only the form index (570 uses 1
          // to enter, 0 to leave). So the switch adds no charge of its own; the
          // only thing it changes is *when* the child's state lands, which is the
          // delay it already carries.
        }else if([64,75,202].includes(node.ft)){
          if(!this.onCommand?.({kind:'damage',node,target,context:input}))this.gap(node,'function-program-damage-not-connected');
          else if(node.durationUnits>0||node.durationType==='TimeSecBattles'){
            if((input.probability??1)===1)this.add(node,this.actor.id,target,1,input);
            else {
              book.uncertainGroups??=new Set();book.uncertainGroups.add(String(node.groupId));
            }
          }
        }else if([0,6,54,61,102,146].includes(node.ft)||stateOnly(node)||isReloadState(node)||this.cadenceSupported&&isStaticRateState(node)){
          this.add(node,this.actor.id,target,1,input);
        }else if(!this.onCommand?.({kind:'effect',node,target,context:input})){
          this.gap(node,'function-program-effect-not-connected');return;
        }
  }

  add(node,casterId,target,count,context){
    if(node.fullCount<1)return this.gap(node,'function-program-stack-limit-unverified');
    if((context.probability??1)!==1){
      const book=this.bookFor(target);book.uncertainGroups??=new Set();book.uncertainGroups.add(String(node.groupId));
      book.uncertainFunctionTypes??=new Set();book.uncertainFunctionTypes.add(node.ft);
      return this.gap(node,'function-program-correlated-state-expectation-not-connected');
    }
    const result=this.bookFor(target).applyState(node,casterId,count);
    if(result.removed)this.emit('OnFunctionOff',node.groupId,target,context);
    else {
      this.emit('OnFunctionOn',node.groupId,target,context);
      const typeTrigger={Buff:'OnFunctionBuffCheck',DeBuff:'OnFunctionDebuffCheck',BuffEtc:'OnFunctionBuffEtcCheck',DebuffEtc:'OnFunctionDebuffEtcCheck'}[node.buffType];
      if(typeTrigger)this.emit(typeTrigger,node.groupId,target,{...context,functionType:node.ft});
      if(result.becameFull)this.emit('OnFullCount',node.groupId,target,context);
    }
    return result;
  }

  emit(type,groupId,owner,context){
    const event={...context,type,groupId,owner};
    this.onEvent?.(event);
    this.dispatch(event);
  }

  connected(id,context){for(const child of this.nodes.get(id)?.connected??[])this.invoke(child,{...context,activationId:context.activationId??id});}
  phase(skillId,phase,context){for(const id of this.program?.entities.find(s=>s.id===skillId)?.commands[phase]??[])this.invoke(id,context);}
}
