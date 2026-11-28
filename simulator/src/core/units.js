/**
 * A1 —— 时间单位常量
 * 依据：SpotSimulationRunner._perFrame = 0.033333335，_stepsPerFrame = 8（RVA 0x3DB0630 循环上限）。
 *      注意这是独立模拟驱动的常量，**不是正常 PVP 的追帧机制证据**：
 *      正常入口 SpotRunner.Update 取 Time.deltaTime，事件 dt 另经三位小数舍入并按 PER_FRAME 拆分。
 *      默认战斗假设每 30Hz 帧一个武器事件（该帧率来自运行时配置 SpotPerFrameRate，未静态定值）。
 * 属性层蓄力/时间类数值单位为 0.01 秒（StatValue 整数）。
 */

export const TICK_PER_SEC = 30;
export const DISPLAY_FPS = 60;
export const DISPLAY_FRAMES_PER_TICK = DISPLAY_FPS / TICK_PER_SEC; // 2
export const UNIT_PER_SEC = 100; // 1 单位 = 0.01s
export const MAX_CATCHUP_STEPS = 8;

/** 一秒对应的逻辑 tick 数（整数断言用） */
export function ticksPerSecond() {
  return TICK_PER_SEC;
}

/** 一个逻辑 tick 对应的显示帧数（必须为整数，否则显示与逻辑不同步） */
export function displayFramesPerTick() {
  return DISPLAY_FRAMES_PER_TICK;
}
