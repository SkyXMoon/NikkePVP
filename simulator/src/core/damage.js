/**
 * V2.1 —— 伤害公式（CalculateDamage 0x5DB4EB0，指令级还原）
 *
 * 原生结构（2026-11-03）：
 *   每发伤害 = damage ÷ ShotCount ÷ muzzleAdj
 *     muzzleAdj：muzzleCount≥2 时为 1（调用方传入的 damage 已含双发），否则 = muzzleCount
 *     （mov eax,1; cmp edi,1; cmovle eax,edi; cvtsi2sd; divsd）
 *   加算区 = 1 + Σ(rateᵢ − 1)   —— float32 逐步累加（addss），顺序敏感
 *   最终   = 加算区 × 每发伤害 × elementRate × chargeDamageRate × resistRate
 *     —— double 乘法（mulsd），无最终取整
 *
 * 系数分类（0x5DB5076..0x5DB51E9）：
 *   加算（各自 −1 求和）：critical, core, category, burst, bonusRange, sticky,
 *     break, addDamage, singleBurst, projectile, parts, coreShot, penetration,
 *     defIgnore, duration, barrier, projectileExplosion
 *   乘算（原值直乘）：elementRate, chargeDamageRate, resistRate
 *
 * 系数值的来源（哪个 FT / 表喂哪个槽）属下一步；本模块只负责公式本身。
 */

import { f32 } from './time.js';

/** 加算区系数名（按原生累加顺序） */
export const ADDITIVE_RATES = [
  'critical', 'core', 'category', 'burst', 'bonusRange', 'sticky',
  'break', 'addDamage', 'singleBurst', 'projectile', 'parts',
  'coreShot', 'penetration', 'defIgnore', 'duration', 'barrier',
  'projectileExplosion',
];

/** 乘算区系数名（按原生乘法顺序） */
export const MULTIPLICATIVE_RATES = ['elementRate', 'chargeDamageRate', 'resistRate'];

/**
 * @param {{damage:number, shotCount:number, muzzleCount:number,
 *          rates:Record<string,number>}} p
 *   rates：全部系数，缺省按 1.0（无加成）处理。注意原生表中 1.0 表示"无加成"，
 *   表值若为"1+加成"形式则直接传。
 * @returns {number} 最终伤害（double，未取整——原生此处无取整指令）
 */
export function calculateDamage({ damage, shotCount, muzzleCount, rates = {} }) {
  if (!(damage >= 0)) throw new RangeError(`calculateDamage: 非法伤害 ${damage}`);
  if (!(shotCount > 0)) throw new RangeError(`calculateDamage: 非法 ShotCount ${shotCount}`);

  // muzzleAdj：muzzleCount≤1 时除以 muzzleCount（0 → 0 需防护，原生 cvtsi2sd 除 0 = inf，
  // 但正常表值 muzzleCount≥1），≥2 时除以 1（调用方 damage 已含双发总量）
  const muzzleAdj = muzzleCount <= 1 ? Math.max(1, muzzleCount) : 1;

  // 每发伤害（double 除法）
  let perShot = damage / shotCount / muzzleAdj;

  // 加算区：float32 逐步累加，顺序 = ADDITIVE_RATES
  let additive = f32(f32(rates.critical ?? 1) - 1);
  additive = f32(additive + 1); // 基数 1.0 加回（0x5DB50B3）
  for (let i = 1; i < ADDITIVE_RATES.length; i++) {
    const r = f32(rates[ADDITIVE_RATES[i]] ?? 1);
    additive = f32(additive + f32(r - 1));
  }

  // 乘算区（double）
  let result = additive * perShot;
  result *= rates.elementRate ?? 1;
  result *= rates.chargeDamageRate ?? 1;
  result *= rates.resistRate ?? 1;
  return result;
}
