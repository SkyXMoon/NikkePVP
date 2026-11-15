import { groupByValue, statDelta, statValue } from './stat.js';

/**
 * A5 —— 蓄力时长（单位 0.01s）
 *
 * 客户端依据：
 *   ChargeTime 是 StatValue（整数，单位 1/100 秒），
 *   经 GetStatValue 合并后由 DoubleToLong 取整（见 A3/A4）。
 *   本函数只做「基础值 + 增量」，不引入任何客户端没有的下限/上限逻辑。
 *
 * 注意：客户端是否存在蓄力下限钳制尚未查证（文档 9.6 列为未闭合），
 *      因此这里不做 max(1, ...) 之类的臆造保护；若将来查证存在，再补。
 *
 * @param {number} baseUnits 基础蓄力（0.01s 单位；1.00s = 100，2.00s = 200）
 * @param {number[]} percents 各来源百分比（负值表示加速，如 -492 = -4.92%）
 * @returns {{units:number, delta:number, groups:{p:number,n:number}[]}}
 */
export function calcChargeUnits(baseUnits, percents = []) {
  if (!Number.isInteger(baseUnits) || baseUnits <= 0) {
    throw new RangeError(`calcChargeUnits: 非法基础值 ${baseUnits}`);
  }
  const groups = groupByValue(percents);
  const delta = statDelta(baseUnits, groups);
  return { units: baseUnits + delta, delta, groups };
}

/**
 * A5b —— 按 FunctionStandard 分池的蓄力值
 *
 * 与 calcChargeUnits 的差别：允许条目带 standard，走 0x5DCFC5E 的合流公式，
 * 而不是把所有条目都当成「逐条取整」。FT61 实测存在两类 Standard
 * （202 条 Standard=1、43 条 Standard=2，见文档 11.4），所以两者都要能表达。
 *
 * @param {number} baseUnits 基础蓄力（0.01s 单位）
 * @param {{p:number,n?:number,standard?:number}[]} entries
 */
export function calcChargeValue(baseUnits, entries = []) {
  if (!Number.isInteger(baseUnits) || baseUnits <= 0) {
    throw new RangeError(`calcChargeValue: 非法基础值 ${baseUnits}`);
  }
  const r = statValue(baseUnits, entries);
  return { units: r.value, delta: r.delta, roundedPool: r.roundedPool, rawPool: r.rawPool };
}
