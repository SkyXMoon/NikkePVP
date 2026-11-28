/** Expected counts of native OnHurt -> counter-hurt events for a fixed pair.
 * HP/death is intentionally outside the first-gauge charge projection.
 * A response returns to its triggering attacker; multiple response functions
 * contribute independent offspring. Solve the two-state branching system,
 * rather than cutting the series off after an arbitrary number of bounces.
 */
export function expectedReactionTurns(incoming,firstResponse,returnResponse){
 for(const p of [incoming,firstResponse,returnResponse])
  if(!Number.isFinite(p)||p<0)throw new RangeError('Invalid reaction expectation');
 const cycle=firstResponse*returnResponse;
 if(cycle>=1)return {supported:false,reason:'nonconvergent-reaction-expectation'};
 const first=incoming/(1-cycle);
 return {supported:true,first,second:first*firstResponse};
}
