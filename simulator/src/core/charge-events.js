/** Native charge-event settlement. No HP, targeting, skill IDs or rendering. */
import { setBurstChargeValue, applyFirstBurstGaugeSpeedUp, applyBurstGaugeStatValue, burstGaugeChargeValue } from './burst.js';

/**
 * Call only after the caller has established event eligibility and team/owner.
 * Damage magnitude is intentionally not an input: CommonHurt may carry zero HP
 * damage and still reach charge processing. Unverified triggers stay upstream.
 * The gauge and modifier arithmetic remain owned by burst.js.
 */
export function settleChargeEvent({ kind, gauge, ownerId = '', weapon = {},
  instances = 1, chargeRate = 0, functions = [], functionValue = 0,
  readCasterValue, writeBaseValue, probability = 1,expectedOccurrences=1,modifierArithmetic='per-row-truncate' }) {
  if (kind !== 'damage' && kind !== 'direct') throw new RangeError('Unknown charge event kind');
  if(!['per-row-truncate','pooled-stat-round'].includes(modifierArithmetic))throw new RangeError('Unknown charge modifier arithmetic');
  if (!Number.isInteger(instances) || instances < 0) throw new RangeError('Invalid charge instance count');
  if (kind === 'direct' && instances !== 1) throw new RangeError('Direct charge is one event');
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) throw new RangeError('Invalid charge probability');
  if(!Number.isFinite(expectedOccurrences)||expectedOccurrences<0)throw new RangeError('Invalid expected occurrence count');
  const before = gauge.filled;
  const dropped = gauge.ready;
  let base = 0, value = 0, contributions = new Map();
  if (instances > 0) {
    if (kind === 'direct') {
      value = burstGaugeChargeValue(gauge.max, functionValue);
    } else {
      base = setBurstChargeValue({ ...weapon, chargeRate });
      // Native writes CurrentBurstChargeValue before FT102 reads any caster.
      writeBaseValue?.(ownerId, base);
      const modify=modifierArithmetic==='pooled-stat-round'?applyBurstGaugeStatValue:applyFirstBurstGaugeSpeedUp;
      ({ value, contributions } = modify({ base, functions,
        ownerId, casterValueOf: readCasterValue }));
    }
    // Expected-value mode weights the completed native event, never its input
    // parameters: native truncation and FT102 must precede probability weighting.
    value *= probability*expectedOccurrences;
    // Do not replace native float32 per-instance writes with one multiplied sum.
    for (let index = 0; index < instances; index++) gauge.applyCharge(value);
  }
  return { kind, base, value, instances, generatedCharge: value * instances,
    creditedCharge: gauge.filled - before, dropped,
    becameReady: !dropped && gauge.ready, contributions };
}

/** FullChargeRate is event state, not inferred from HP damage or weapon name. */
export function isFullChargeHit(fullChargeRate) {
  return Number.isFinite(fullChargeRate) && fullChargeRate >= 1;
}

/** The first active FT146 adds one result per valid contact, before the parent. */
export function fullChargeRepeatResults(hit, buff, fullChargeRate) {
  if (!buff || hit.skillChargeOnly || !isFullChargeHit(fullChargeRate)) return [];
  return (hit.contacts ?? []).filter(c => c.kind === 'character' || c.kind === 'cover')
    .map(contact => ({ ...hit, instances: 1, contacts: [contact], targetId: contact.id,
      fullChargeRate: 0, skillChargeOnly: true, skillSource: 'FT146', skillId: buff.id,
      templateId:'full-charge-repeat' }));
}
