import {statValue} from './stat.js';

/** ReloadTime table units are centiseconds. Positive reloadSpeedBp reduces
 * duration (2000 = 20%); native FT13/159 values retain their signed convention.
 * get_ReloadTime 0x5D11F65..0x5D120F8 selects FT159 when present, else FT13.
 */
export function getReloadTimeUnits(baseUnits,{reloadSpeedBp=0,functions=[]}={}) {
  if(!Number.isInteger(baseUnits)||baseUnits<0)throw new RangeError('Invalid base reload time');
  if(!Number.isInteger(reloadSpeedBp))throw new RangeError('Invalid reload speed basis points');
  const fixed=functions.filter(f=>f.ft===159);
  const rows=fixed.length?fixed:functions.filter(f=>f.ft===13);
  const entries=rows.map(f=>{
    if(f.valueType!==2)throw new RangeError('Unsupported reload function value type');
    return {p:f.value,n:f.stacks??1,standard:f.standard??1};
  });
  if(!fixed.length&&reloadSpeedBp)entries.push({p:-reloadSpeedBp,standard:1});
  return statValue(baseUnits,entries).value;
}
