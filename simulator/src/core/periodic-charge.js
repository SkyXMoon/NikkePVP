/** SpotFunction.UpdateActiveTime / UpdateTimeFunctionV2 timing template.
 * Units are native centiseconds; this module emits pulse eligibility only.
 * The caller owns activation conditions, target state and charge settlement.
 */
export class PeriodicChargeTimer {
  constructor(durationUnits,{resetOnRefresh=false}={}) {
    if((!Number.isFinite(durationUnits)&&durationUnits!==Infinity)||durationUnits<=0)throw new RangeError('Invalid periodic duration');
    this.remaining=Math.fround(durationUnits);
    this.active=0;
    this.resetOnRefresh=resetOnRefresh;
  }

  refresh(durationUnits) {
    if((!Number.isFinite(durationUnits)&&durationUnits!==Infinity)||durationUnits<=0)throw new RangeError('Invalid periodic duration');
    this.remaining=Math.fround(durationUnits);
    if(this.resetOnRefresh)this.active=0;
  }

  advance(eventDeltaSeconds) {
    if(!Number.isFinite(eventDeltaSeconds)||eventDeltaSeconds<=0)throw new RangeError('Invalid event delta');
    if(this.expired)return false;
    const delta=Math.fround(Math.fround(eventDeltaSeconds)*100);
    this.remaining=Math.fround(Math.max(0,Math.fround(this.remaining-delta)));
    this.active=Math.fround(this.active+delta);
    // Native emits at most once per update and retains overshoot, including
    // the update that expires the duration. Removal follows pulse processing.
    if(this.active<100)return false;
    this.active=Math.fround(this.active-100);
    return true;
  }

  get expired(){return this.remaining<=0;}
}

/** Exact state expectation for independent probabilistic application events.
 * Branches retain their native timer phase and last-successful refresh duration.
 * This is conditional on the supplied hit/activation timeline, not an HP model.
 */
export class ExpectedPeriodicState {
  constructor(durationUnits,options={}) {
    // Validate even when no successful application has occurred yet.
    new PeriodicChargeTimer(durationUnits,options);
    this.durationUnits=durationUnits;
    this.options=options;
    this.absent=1;
    this.states=new Map();
  }

  add(states,timer,weight) {
    if(!weight)return;
    const key=`${timer.active}/${timer.remaining}`;
    const previous=states.get(key);
    if(previous)previous.weight+=weight;
    else states.set(key,{timer,weight});
  }

  copy(timer) {
    const clone=new PeriodicChargeTimer(this.durationUnits,this.options);
    clone.remaining=timer.remaining;clone.active=timer.active;
    return clone;
  }

  apply(probability,durationUnits=this.durationUnits) {
    if(!Number.isFinite(probability)||probability<0||probability>1)throw new RangeError('Invalid state probability');
    new PeriodicChargeTimer(durationUnits,this.options);
    if(!probability)return;
    const next=new Map();
    for(const {timer,weight} of this.states.values()){
      this.add(next,this.copy(timer),weight*(1-probability));
      const refreshed=this.copy(timer);refreshed.refresh(durationUnits);
      this.add(next,refreshed,weight*probability);
    }
    this.add(next,new PeriodicChargeTimer(durationUnits,this.options),this.absent*probability);
    this.absent*=1-probability;
    this.states=next;
  }

  advance(eventDeltaSeconds) {
    let pulse=0;const next=new Map();
    for(const {timer,weight} of this.states.values()){
      if(timer.advance(eventDeltaSeconds))pulse+=weight;
      if(timer.expired)this.absent+=weight;
      else this.add(next,timer,weight);
    }
    this.states=next;
    // Only suppress floating-point roundoff; never sample or discard branches.
    return Math.min(1,pulse);
  }

  get expired(){return this.states.size===0;}
  get activeProbability(){return [...this.states.values()].reduce((sum,s)=>sum+s.weight,0);}
}
