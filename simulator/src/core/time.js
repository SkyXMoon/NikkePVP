/**
 * A6 —— tick 换算（严格按客户端累加行为，不用解析公式近似）
 *
 * 客户端依据：
 *   UpdateChargeTime (0x5E085F0) 每次执行
 *     charge = min(charge + dt, ChargeTime)         // 0x5E087C7 addss / 0x5E087CB minss
 *   满蓄判定为 charge 达到 ChargeTime（float32 比较）。
 *
 * 两个 dt 必须分开，不能混用：
 *
 *   TICK_DT —— 真实帧间隔 1/30s。只用于「第几次事件 = 多少真实秒」的换算。
 *     来源：SpotSimulationRunner.FixedUpdate 0x3DB0695 载入常量 0x807A9E4（字节 89 88 08 3D）。
 *
 *   EVENT_DT_30 —— 传给武器逻辑的事件 dt。
 *     来源：SpotManagement.UpdateSpot 0x3DAD21D..0x3DAD24B
 *        float 倍率乘积 → cvtps2pd → Math.Round(double,3,ToEven)(0x195FD00) → cvtsd2ss。
 *     单位倍率 + 30Hz 输入时，1/30 被舍入成 0.033，故事件 dt 是 0.033 而不是 0.0333…。
 *     该值最终还受竞技场 min(remainingDt, PER_FRAME) 拆分影响（0x5F1E0BE..0x5F1E0CA），
 *     PER_FRAME 取自运行时配置 SpotPerFrameRate（getter 0x3DAE590），不是代码常量。
 *
 * 因此 tick 数必须用 float32 逐事件累加求出，
 * 不能用 ceil(秒 × 30) 这种解析近似——两者在边界上会差 1 次。
 */

/** 真实帧间隔 1/30s；用于真实时间换算，不用于武器累计 */
export const TICK_DT = 0.033333335;

/** 单位倍率、30Hz 输入经三位小数舍入后的事件 dt（0.033f） */
export const EVENT_DT_30 = 0.033;

/** 用 Math.fround 模拟 float32 精度 */
export function f32(x) {
  return Math.fround(x);
}

/**
 * 从 0 开始按事件 dt 累加，需要多少次才能达到 targetUnits（0.01s 单位）。
 * 完全复刻 addss/minss 行为，不做任何解析化简。
 *
 * @param {number} targetUnits 目标时长（0.01s 单位，100 = 1.00s）
 * @param {number} [eventDt] 事件 dt，默认 EVENT_DT_30；需与调用场景一致
 * @returns {number} 所需事件次数
 */
export function ticksToReach(targetUnits, eventDt = EVENT_DT_30) {
  if (!Number.isFinite(targetUnits) || targetUnits <= 0) {
    throw new RangeError(`ticksToReach: 非法目标 ${targetUnits}`);
  }
  return ticksToReachSeconds(f32(targetUnits / 100), eventDt);
}

/** Shared float32 accumulator for native timers whose target is already seconds. */
export function ticksToReachSeconds(targetSeconds, eventDt = EVENT_DT_30) {
  const dt = f32(eventDt);
  const target = f32(targetSeconds);
  if (!(target > 0) || !Number.isFinite(target) || !(dt > 0) || !Number.isFinite(dt))
    throw new RangeError('ticksToReachSeconds: target and delta must be finite and positive');
  let charge = f32(0);
  let ticks = 0;
  // 上限保护：正常战斗不会超过 10 分钟
  const MAX_TICKS = 30 * 600;
  while (charge < target) {
    charge = f32(charge + dt);
    ticks += 1;
    if (ticks > MAX_TICKS) {
      throw new RangeError(`ticksToReach: 超过 ${MAX_TICKS} 次事件，目标秒数 ${target}`);
    }
  }
  return ticks;
}

/** 逻辑 tick → 显示帧（客户端 60fps 显示，每 tick 2 帧） */
export function ticksToDisplayFrames(ticks) {
  if (!Number.isInteger(ticks) || ticks < 0) {
    throw new RangeError(`ticksToDisplayFrames: 非法 tick ${ticks}`);
  }
  return ticks * 2;
}
