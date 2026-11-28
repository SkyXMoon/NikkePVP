import { groupByValue, statDelta, statValue } from './stat.js';

/**
 * A7 —— 弹匣上限
 *
 * 客户端依据：get_MaxAmmo (0x5D10B70)
 *   0x5D10BB3 call 0x5D0FEF0 → 为真时直接返回 999（0x5D10BBE mov ecx,0x3E7）
 *     —— 表里 MaxAmmo=999 的配置就是走这个"无限弹匣"标记，不是 999 发。
 *   0x5D10BD0 call 0x5D10840（ hotfix 前置）
 *   0x5DCBF00 内两次 GetStatValue(0x5DCF860)，参数均为同一 base：
 *     r8d=0xE  (14,  StatAmmo       技能/buff)   → 0x5DCBF9C
 *     r8d=0x6C (108, StatAmmoLoad   装备词条)    → 0x5DCC027
 *   两池分别算完后合并（0x5DCC0F0/F6）：
 *     total = FT14值 + FT108值 − base     （两池各含一次base，减掉一次）
 *   最终钳制（0x5DCC105 → 0x195F870）：
 *     0x195F870 即 Math.Max(a,b)（cmp/cmovge），调用时 rcx=1
 *     ⇒ MaxAmmo = max(1, total)
 *
 * 每个池内部走 GetStatValue 的 Standard 分池逻辑（见 A4）。
 *
 * @param {number} base 基础弹匣（发）
 * @param {number[]} gearPercents 装备词条百分比（FT108）
 * @param {number[]} buffPercents 技能/buff 百分比（FT14）
 */
export function calcMaxAmmo(base, gearPercents = [], buffPercents = []) {
  if (!Number.isInteger(base) || base <= 0) {
    throw new RangeError(`calcMaxAmmo: 非法基础弹匣 ${base}`);
  }
  const gearGroups = groupByValue(gearPercents);
  const buffGroups = groupByValue(buffPercents);
  const gearDelta = statDelta(base, gearGroups);
  const buffDelta = statDelta(base, buffGroups);
  const raw = base + gearDelta + buffDelta;
  return {
    ammo: Math.max(1, raw),
    raw,
    base,
    gearDelta,
    buffDelta,
    gearGroups,
    buffGroups,
  };
}

/**
 * A7b —— 分池版弹匣（允许条目带 standard）
 *
 * 注意：两池都传入同一个 base，各自返回"含 base 的池值"。
 * 原生随后如何合并（相加后减 base？还是先减再加？）以及最终钳制范围
 * 都未解析，因此这里**不输出合并总数**，只分别给出两池值。
 *
 * @param {number} base
 * @param {{p:number,n?:number,standard?:number}[]} gearEntries FT108
 * @param {{p:number,n?:number,standard?:number}[]} buffEntries FT14
 */
export function calcMaxAmmoPools(base, gearEntries = [], buffEntries = []) {
  if (!Number.isInteger(base) || base <= 0) {
    throw new RangeError(`calcMaxAmmoPools: 非法基础弹匣 ${base}`);
  }
  const gear = statValue(base, gearEntries);
  const buff = statValue(base, buffEntries);
  return { base, gear, buff };
}
