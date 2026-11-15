import { roundHalfUp } from './numeric.js';

/**
 * A3 —— 按「数值」分组
 *
 * 客户端依据：GetStatValue(0x5DCF860) 的百分比分支在循环体内
 *   取 count(0x3EF66D0，movsxd)、value(0x3FA5610)、base(0x3CEEC30)，
 *   执行 imul count×value×base，再 ×0.0001，然后立刻 DoubleToLong 取整（0x5DCFB26）。
 * 也就是说每条 Function 记录自带一个 count，同值记录在构建阶段合成 count。
 *
 * 注意：按「相同 p 合并」与 count 字段语义一致，但真正的分组键
 *      （是否还含 source 等字段）尚未从构建链证实，属建模选择。
 *
 * @param {number[]} values 百分比数值（例如 -492 表示 -4.92%）
 * @returns {{p:number, n:number}[]} 按首次出现顺序分组
 */
export function groupByValue(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('groupByValue: 需要数组');
  }
  /** @type {Map<number, number>} */
  const counts = new Map();
  for (const v of values) {
    if (!Number.isFinite(v)) {
      throw new RangeError(`groupByValue: 非法数值 ${v}`);
    }
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()].map(([p, n]) => ({ p, n }));
}

/**
 * A4 —— 属性最终值（两种 FunctionStandard 走不同池）
 *
 * 原生 GetStatValue 0x5DCF860 的循环体分两支，最后在 0x5DCFC5E–0x5DCFC80 合流：
 *
 *   Standard == 1（0x5DCFB0D 起）
 *       imul count,value,base → ×0.0001 → call DoubleToLong → add rsi
 *       ⇒ 每条独立取整后累加到 rsi
 *
 *   Standard != 1
 *       value×count 原始累加到 r12，**不取整**
 *
 *   合流：
 *       r13(base) × r12 × 0.0001 + (rbx(base) + rsi) → DoubleToLong 一次
 *
 * 即：
 *   result = round( base × Σ(非1池 p×n)/10000 + base + Σ1池 round(base×p×n/10000) )
 *
 * @param {number} baseUnits 基础值（蓄力为 0.01s 单位，弹匣为「发」）
 * @param {{p:number,n?:number,standard?:number}[]} entries
 * @returns {{value:number, delta:number, roundedPool:number, rawPool:number}}
 */
export function statValue(baseUnits, entries) {
  if (!Number.isFinite(baseUnits)) {
    throw new RangeError(`statValue: 非法基础值 ${baseUnits}`);
  }
  if (!Array.isArray(entries)) {
    throw new TypeError('statValue: entries 需要数组');
  }

  let roundedPool = 0;
  let rawPool = 0;

  for (const e of entries) {
    if (!e || !Number.isFinite(e.p)) {
      throw new RangeError(`statValue: 非法条目 ${JSON.stringify(e)}`);
    }
    const n = e.n ?? 1;
    if (!Number.isInteger(n) || n <= 0) {
      throw new RangeError(`statValue: 非法次数 ${JSON.stringify(e)}`);
    }
    const standard = e.standard ?? 1;

    if (standard === 1) {
      roundedPool += roundHalfUp((baseUnits * e.p * n) / 10000);
    } else {
      rawPool += e.p * n;
    }
  }

  const value = roundHalfUp((baseUnits * rawPool) / 10000 + baseUnits + roundedPool);
  return { value, delta: value - baseUnits, roundedPool, rawPool };
}

/**
 * A4b —— 仅标准1池的增量
 *
 * 保留它是为了单测能直接比对「逐组取整」这一行为。
 *
 * @param {number} baseUnits
 * @param {{p:number,n:number}[]} groups
 * @returns {number}
 */
export function statDelta(baseUnits, groups) {
  if (!Number.isFinite(baseUnits)) {
    throw new RangeError(`statDelta: 非法基础值 ${baseUnits}`);
  }
  if (!Array.isArray(groups)) {
    throw new TypeError('statDelta: groups 需要数组');
  }
  let delta = 0;
  for (const g of groups) {
    if (!g || !Number.isFinite(g.p) || !Number.isInteger(g.n) || g.n <= 0) {
      throw new RangeError(`statDelta: 非法分组 ${JSON.stringify(g)}`);
    }
    delta += roundHalfUp((baseUnits * g.p * g.n) / 10000);
  }
  return delta;
}
