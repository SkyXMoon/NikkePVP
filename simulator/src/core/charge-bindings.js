/** Match verified native charge paths to selected runtime skill IDs.
 * A reverse-path match is not an implementation or activation certificate.
 */
export function matchChargeBindings(bindings, {variant, implementedIds=[]}={}) {
 const implemented=new Set(implementedIds),missing=[],matched=[],excluded=[];
 for(const row of bindings ?? []){
  if(row.variant!==variant)continue;
  if(row.excludedBeforeFirstBurst||row.excludedInPvp||row.excludedNotRegistered||row.excludedUnreachable){excluded.push(row);continue;}
  matched.push(row);
  if(!implemented.has(row.key))missing.push(row);
 }
 return {matched,missing,excluded};
}
