/**
 * 浏览器侧的 V2 蓄力换算：把「蓄速」直接灌进 V2 自己的两条原生规则。
 *
 *  1) 蓄速作用在 ChargeTime（0.01 s 单位）上，走原生 GetStatValue 的两池合流
 *     —— 直接 import V2 的 calcChargeValue，不在这里重写一份。
 *  2) 满蓄次数按 dt=0.033 逐次累加求，不用「秒÷0.033」的解析近似
 *     —— 直接 import V2 的 ticksToReach。
 *
 * 所以站点上调蓄速得到的 tick 数，和模拟器里算的是同一段代码。
 *
 * 两个入口对应两种输入来源，区别只在「取整在哪里发生」：
 *
 *   calc()            一个合并后的总百分比（手动输入总蓄速）
 *   calcFromEntries() 词条原始档位 + 魔方加成（装备词条 / 阿卡数据）
 *
 * 后者才是客户端的形状。原生 GetStatValue(0x5DCF860) 的 standard==User 分支
 * （见 战斗模拟器V2技术契约.md:1043）是「每条 imul base×p×n → ×0.0001 →
 * DoubleToLong 后累加」，也就是**逐条在蓄力单位上取整**；而不是先把百分比
 * 取整再相乘。站点自己的 calculateChargeSpeedFromEntries 走的是后者
 * （Math.round(5.8)=6、Math.round(5.51)=6…），误差在长蓄力上会放大成 tick。
 *
 * 全程整数：Function 记录的 value 是「百分之一百分点」（-580 = -5.80%），
 * ChargeTime 是「百分之一秒」。所以小数只允许出现在转成 value 之前那一层
 * （toNativeValue 的 Math.round(x*100)），一旦进了池就全是整数。
 */
import { calcChargeValue } from '../simulator/src/core/charge.js';
import { groupByValue } from '../simulator/src/core/stat.js';
import { ticksToReach } from '../simulator/src/core/time.js';

/**
 * 蓄速百分比 → 原生 Function 记录里的 value（百分之一百分点，整数）。
 * 保留两位小数：5.83% → -583。不要在这里提前 round 成整数百分点，
 * 那等于把 -583 压成 -600。
 */
const toNativeValue = (percent) => -Math.round(Number(percent) * 100);

/** 目标量 ≤ 0（满蓄速把 ChargeTime 压到 0）时，客户端首个 tick 即满 */
function finish(units) {
  if (!(units > 0)) return { units: 0, ticks: 1 };
  return { units, ticks: ticksToReach(units) };
}

globalThis.__V2_CHARGE = {
  /**
   * 单个总百分比（手动输入总蓄速时走这条）。
   * 同样保留两位小数 —— 阿卡数据给的 chargeSpeed 就是两位小数。
   * @returns {{units:number, ticks:number}} 生效后的 ChargeTime 与满蓄所需 tick 数
   */
  calc(baseUnits, speedPercent) {
    const speed = Number(speedPercent) || 0;
    if (!(speed > 0)) return finish(baseUnits);
    const { units } = calcChargeValue(baseUnits, [{ p: toNativeValue(speed), n: 1, standard: 1 }]);
    return finish(units);
  },

  /**
   * 词条模式：用原始档位重建 Function 行，绕过站点的百分比取整。
   *
   * 三条与原生对齐的规则：
   *  1) 每条词条一条 standard=1（User，作用于自身）的记录；
   *  2) **同值记录合成 count**（原生在构建阶段就是这么合的，groupByValue 就是
   *     这一步），所以两条 5.80% 是 {p:-580, n:2} 取整一次，不是两次；
   *  3) 全部交给 calcChargeValue，逐条在蓄力单位上取整后合流。
   *
   * @param {number} baseUnits 基础蓄力（0.01 s 单位）
   * @param {number[]} entries 词条原始档位（如 5.8 / 5.51 / 4.92 / 3.75）
   * @param {number} [cubeBonus] 魔方蓄速加成（百分比数值）。站点手动模式固定
   *        2.12；阿卡模式按魔方等级是 1.06 / 1.59 / 2.12，由调用方算出。
   * @returns {{units:number, ticks:number, rows:number, records:number}|null}
   *          无有效条目时返回 null
   */
  calcFromEntries(baseUnits, entries, cubeBonus = 0) {
    const percents = [];
    for (const raw of entries || []) {
      const pct = Number(raw) || 0;
      if (pct > 0) percents.push(toNativeValue(pct));
    }
    const cube = Number(cubeBonus) || 0;
    if (cube > 0) percents.push(toNativeValue(cube));
    if (!percents.length) return null;
    const rows = groupByValue(percents).map((g) => ({ p: g.p, n: g.n, standard: 1 }));
    const { units } = calcChargeValue(baseUnits, rows);
    return { ...finish(units), rows: rows.length, records: percents.length };
  },
};

globalThis.dispatchEvent(new Event('v2charge:ready'));
