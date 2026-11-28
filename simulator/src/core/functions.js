/**
 * E5 —— buff 时长账本
 *
 * 依据（2026-11-02，nikke-sd-rl-cycle.md 6.9/6.10）：
 *   - 每角色持有 buff（SpotFunction）列表；
 *   - 时间类（TimeSec*）：每 tick 剩余 -= dt×系数，钳 0，归零移除
 *     （UpdateTimeFunctionV2 0x5E84352 subss / UpdateActiveTime 0x5D05B70 判定）；
 *   - 发数类（Shots/SkillShots）：每次开火 -1
 *     （FunctionRemoveByDurationType 0x5E7D280，由事件扣）；
 *   - buff 带一个属性效果（如蓄速百分比），移除后属性随之回落——
 *     落实为"效果集变化 → 重算派生属性"。
 */

import { EVENT_DT_30 } from './time.js';

/**
 * @typedef {{id:string, kind:'time'|'shots'|'hits', remain:number,
 *            effect?:{kind:'chargeSpeed', percent:number}} } BuffDef
 */

export class FunctionTrack {
  constructor() {
    this.functionCycles = new Map();
    /** @type {BuffDef[]} */
    this.buffs = [];
  }

  nextFunctionCycleIndex(id,length){
    if(!Number.isInteger(length)||length<1)throw new RangeError('Invalid function cycle length');
    const next=(this.functionCycles.get(String(id))??-1)+1;
    this.functionCycles.set(String(id),next);
    return next%length;
  }

  /** AddFunction 0x5E78C10：入列 */
  add(buff) {
    this.buffs.push({ ...buff });
  }

  setSingle(buff) {
    this.buffs = this.buffs.filter(b => !(b.id === buff.id && b.casterId === buff.casterId));
    this.buffs.push({ ...buff });
  }

  /** Native group state: merge this caster's group, clamp stacks, refresh time.
   * Numeric stat consumers and group predicates share this same owned ledger.
   */
  applyState(node,casterId,delta=1) {
    const groupId=String(node.groupId),previous=this.buffs.find(b=>String(b.groupId)===groupId&&b.casterId===casterId);
    const maximum=node.fullCount;
    if(!Number.isInteger(maximum)||maximum<1)throw new RangeError('Invalid function stack limit');
    const count=Math.max(0,Math.min(maximum,(previous?.stacks??0)+delta));
    this.buffs=this.buffs.filter(b=>b!==previous);
    if(!count)return {count:0,removed:!!previous,becameFull:false};
    const time=['TimeSec','TimeSec_Ver2','TimeSec_Ver3'].includes(node.durationType);
    const shots=['Shots','SkillShots'].includes(node.durationType);
    const buff={id:node.id,groupId,ft:node.ft,value:node.value,casterId,stacks:count,fullCount:maximum,
      standard:{User:1,FunctionTarget:2,TriggerTarget:3}[node.standard]??0,
      valueType:node.valueType==='Percent'?2:1,
      buffType:node.buffType,buffRemoveType:node.buffRemoveType,
      nativeState:true,kind:time?'time':shots?'shots':'permanent',remain:time?node.durationUnits/100:shots?node.durationUnits:Infinity,
      remainingUnits:time?Math.fround(node.durationUnits):null,stateNode:node};
    if(node.ft===61)buff.effect={kind:'chargeSpeed',percent:node.value};
    this.buffs.push(buff);
    return {count,removed:false,becameFull:maximum>1&&count>=maximum&&(previous?.stacks??0)<maximum,
      added:!previous};
  }

  group(groupId){return this.buffs.filter(b=>String(b.groupId)===String(groupId));}
  removeGroup(groupId){const removed=this.group(groupId);this.buffs=this.buffs.filter(b=>!removed.includes(b));return removed;}
  removeFunction(buff){const index=this.buffs.indexOf(buff);if(index<0)return false;this.buffs.splice(index,1);return true;}

  /** 到期心跳：时间类每 tick 减。返回本 tick 移除的 id 列表。 */
  tick(eventDt = EVENT_DT_30) {
    const removed = [];
    const expired=[];
    for (const b of this.buffs) {
      if (b.kind === 'time') {
        if(b.nativeState){b.remainingUnits=Math.fround(Math.max(0,Math.fround(b.remainingUnits-Math.fround(Math.fround(eventDt)*100))));b.remain=b.remainingUnits/100;}
        else b.remain = Math.max(0, b.remain - eventDt);
      }
    }
    this.buffs = this.buffs.filter((b) => {
      if (b.kind === 'time' && b.remain <= 0) { removed.push(b.id);expired.push(b); return false; }
      return true;
    });
    for(const b of expired)this.onExpire?.(b);
    return removed;
  }

  /** Consume effects participating in this shot; newly granted effects start with the next shot. */
  onFire(eligibleBuffs = this.buffs) {
    const participating = new Set(eligibleBuffs);
    const removed = [];
    const expired=[];
    for (const b of this.buffs) {
      if (b.kind === 'shots' && participating.has(b)) b.remain -= 1;
    }
    this.buffs = this.buffs.filter((b) => {
      if (b.kind === 'shots' && participating.has(b) && b.remain <= 0) { removed.push(b.id);expired.push(b); return false; }
      return true;
    });
    for(const b of expired)this.onExpire?.(b);
    return removed;
  }

  /** 收集当前生效的蓄速百分比（给 calcChargeUnits 用） */
  chargeSpeedPercents() {
    return this.buffs
      .filter((b) => b.effect && b.effect.kind === 'chargeSpeed')
      .map((b) => b.effect.percent);
  }

  chargeSpeedEntries() {
    return this.buffs.filter(b=>b.effect?.kind==='chargeSpeed')
      .map(b=>({p:b.effect.percent,n:b.stacks ?? 1,standard:b.standard ?? 1}));
  }

  /**
   * 当前生效的全部 Function 行（按加入顺序）。
   * 充能侧的 FT102 计算直接消费它：原生遍历 owner 容器 FunctionAll，
   * 顺序影响逐条取整的累加结果，故不排序。
   */
  list() {
    return this.buffs;
  }

  /** 只取指定 FunctionType 的行（FT102 用） */
  byFt(ft) {
    return this.buffs.filter((b) => b.ft === ft);
  }
}
