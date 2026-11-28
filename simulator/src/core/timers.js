/**
 * B 批 —— 单个计时器（全部按原生实现复刻，不做解析化简）
 *
 * 证据来源（全部为 GameAssembly.dll 反汇编，RVA - 0x1000 = 文件偏移）：
 *
 *   B1 PreDelay      WeaponLogic.UpdatePreDelay      0x5E08CF0
 *        current = min(threshold, current + dt × 100)     0x5E08E43 mulss / 0x5E08E4B addss / 0x5E08E4F minss
 *        常量 100.0（RVA 0x7E64FDC），仅 StanceType==2(Aim) 累计（0x5E08D81 cmp eax,2 / jne）
 *        就绪判定 IsReadyForPreDelay 0x5E06E60：
 *          FloatToLong(CurrentPreDelay) >= SpotPreDelay   0x5E06FA4 call FloatToLong / 0x5E06FEC setle
 *
 *   B2 AccumFireDelay WeaponLogic.UpdateAccumFireDelay 0x5E07F70
 *        acc += max(0, RateOfFire / 60) × eventDt     0x5E080CC divss / 0x5E080D7 maxss / 0x5E080E2 mulss / 0x5E080ED addss
 *        常量 60.0（RVA 0x7E64F68，.rdata）；eventDt 为事件字段 +0x48
 *        本函数不判阈值、不钳上限；阈值在 TryCharacterFire 0x5E07760：
 *          0x5E077EC comiss xmm6,[0x7E64F2C] → jb 失败；该常量字节 00 00 80 3F = 1.0f。
 *        发后 OnAfterFire 0x5F060E0 的 muzzleIndex==0 分支（0x5F0653F/0x5F06591）
 *        把 +0x594 写成 0，不是相减、也不保留超额。
 *
 *   B3 ChargeTime    WeaponLogic.UpdateChargeTime      0x5E085F0
 *        charge = min(charge + dt, ChargeTime)            0x5E087C7 addss / 0x5E087CB minss
 *        注意单位是「秒」，不是 0.01s
 *
 *   B4 MFS 后摇锁    WeaponLogic.UpdateMaintainFireStance 0x5E089B0
 *        current = max(0, current - dt × 100)             0x5E08A5C mulss / 0x5E08A64 subss / 0x5E08A6B maxss
 *        常量 100.0（RVA 0x7E64F98），单位 0.01s（表值 83 = 0.83s）
 *        挡 Idle 的判定是 current > 0（ChangeStanceEvent.Send 0x5E4B596）
 *
 *   B5 RateOfFire    OnAfterFire 0x5F0661F 每发 += ChangePershot（钳到 EndRateOfFire）
 *                    UpdateRateOfFire 0x5E08EC0 另有「向目标值靠拢」的逻辑，
 *                    但 xmm6/xmm9 语义未对齐，本轮不实现，留 C4。
 *                    RateOfFireResetTime = 表值 100 × 0.01 = 1.0 秒（0x5D1164A mulss 常量 0.01 @ RVA 0x7E64F10）
 *
 * 未确证、因此不实现的部分：
 *   - RoF 的逐帧逼近/停火衰减（见 B5 说明）；
 *   - MG 的 RoF 递减是否只在 InputType=3 生效（0x5E08F61 按接口返回值分支，返回值语义未确证）。
 */

import { f32, TICK_DT, EVENT_DT_30, ticksToReachSeconds } from './time.js';
import { roundHalfUp } from './numeric.js';

/** TeamContext.UpdateFunctionTrigger: double remainder, strict > cycle,
 * scheduled cycle count (not actual elapsed time) converted to centiseconds.
 */
export class TeamCheckTimeClock {
  constructor(cycleUnits){
    if(!Number.isFinite(cycleUnits)||cycleUnits<=0)throw new RangeError('Invalid team check-time cycle');
    this.cycle=cycleUnits*.01;this.current=0;this.accumulated=0;
  }
  advance(dt){
    this.current+=Math.fround(dt);
    const events=[];
    while(this.current>this.cycle){
      this.current-=this.cycle;this.accumulated+=this.cycle;
      events.push(roundHalfUp(this.accumulated*100));
    }
    return events;
  }
}

/** 姿态枚举：原生只对 2 累计前置（0x5E08D81） */
export const STANCE_AIM = 2;

/** B1 —— 前置延迟累计器（单位 0.01s） */
export class PreDelayTimer {
  /** @param {number} thresholdUnits SpotPreDelay（20 = 0.2s） */
  constructor(thresholdUnits) {
    if (!Number.isInteger(thresholdUnits) || thresholdUnits < 0) {
      throw new RangeError(`PreDelayTimer: 非法阈值 ${thresholdUnits}`);
    }
    this.threshold = thresholdUnits;
    this.current = 0;
  }

  /** @param {number} dt 秒 @param {number} stanceType 姿态枚举 */
  tick(dt, stanceType) {
    if (stanceType !== STANCE_AIM) return; // 非瞄准姿态不累计
    const delta = f32(f32(dt) * 100); // 0x5E08E43
    const next = f32(this.current + delta); // 0x5E08E4B
    this.current = f32(Math.min(this.threshold, next)); // 0x5E08E4F minss
  }

  /** IsReadyForPreDelay：FloatToLong(current) >= threshold */
  isReady() {
    return roundHalfUp(f32(this.current)) >= this.threshold;
  }

  reset() {
    this.current = 0;
  }
}

/** 发射阈值：TryCharacterFire 0x5E077EC 与 1.0f 比较（0x7E64F2C，字节 00 00 80 3F） */
export const FIRE_THRESHOLD = 1;
// SpotWeaponData.get_IsFullCharge 0x5D101F7 loads System.Single.Epsilon,
// bits 0x00000001 at RVA 0x7E65ABC; this is not an >= target comparison.
export const FULL_CHARGE_EQUALITY_EPSILON = 2 ** -149;

/** StartReload stores float32(units * .01f); UpdateReload adds .033f each tick. */
export function reloadDurationTicks(units, eventDt = EVENT_DT_30) {
  return ticksToReachSeconds(f32(f32(units) * f32(.01)), eventDt);
}

/** B2 —— 射速累计槽（单位「槽」） */
export class AccumFireTimer {
  /**
   * @param {number} rateOfFire 当前 RoF（可随 MG 爬升变化）
   * @param {number} initialAcc 初始槽值。战斗开局的槽不是 0：
   *   UpdateAccumFireDelay 无门控（已证），冲锋阶段照常累计，
   *   进入射程切 Aim 时槽通常已 ≥1（用户观察：AR/SG/SMG/MG 起手一致）。
   */
  constructor(rateOfFire, initialAcc = 0) {
    this.rateOfFire = rateOfFire;
    this.acc = f32(initialAcc);
  }

  /** @param {number} eventDt 事件 dt（秒），来自 ProcessWeaponLogicEvent +0x48 */
  tick(eventDt, rateOfFire = this.rateOfFire) {
    const rate = Math.max(0, f32(rateOfFire / 60)); // 0x5E080CC divss + maxss
    const delta = f32(rate * f32(eventDt)); // 0x5E080E2
    this.acc = f32(this.acc + delta); // 0x5E080ED
  }

  /** 达到 1.0 才满足累计条件；随后仍有就绪/姿态/目标门控（CanFire 0x5E065A0） */
  isOverThreshold(threshold = FIRE_THRESHOLD) {
    return this.acc >= threshold;
  }

  reset() {
    this.acc = 0; // OnAfterFire 0x5F06591 写 0
  }
}

/** B3 —— 蓄力累计器（单位「秒」） */
export class ChargeTimer {
  /** @param {number} chargeTimeSec 目标秒数（由 calcChargeUnits /100 得到） */
  constructor(chargeTimeSec) {
    if (!(chargeTimeSec > 0)) {
      throw new RangeError(`ChargeTimer: 非法蓄力时长 ${chargeTimeSec}`);
    }
    // 必须是 float32：客户端 minss 比较的是 float32 目标值。
    // 若用 double 保存（如 1.68），累加结果 1.6799999 永远 < 1.68，
    // min 钳不到目标，满蓄永不成立。
    this.target = f32(chargeTimeSec);
    this.charge = 0;
  }

  tick(dt) {
    const next = f32(this.charge + f32(dt)); // 0x5E087C7 addss
    this.charge = f32(Math.min(this.target, next)); // 0x5E087CB minss
  }

  isFull() {
    return Math.abs(f32(Math.abs(this.charge) - Math.abs(this.target))) <= FULL_CHARGE_EQUALITY_EPSILON;
  }

  reset() {
    this.charge = 0;
  }
}

/** B4 —— 发射后摇锁（单位 0.01s，挡 Idle 请求） */
export class MfsTimer {
  constructor() {
    this.current = 0;
  }

  /** 发射后填入表值（CheckChangeStance 0x5DDF7EA 每发刷新） */
  set(units) {
    this.current = f32(units);
  }

  tick(dt) {
    const delta = f32(f32(dt) * 100); // 0x5E08A5C
    const next = f32(this.current - delta); // 0x5E08A64
    this.current = f32(Math.max(0, next)); // 0x5E08A6B
  }

  /** ChangeStanceEvent.Send：current > 0 时拒绝 Idle */
  blocksIdle() {
    return this.current > 0;
  }

  /** ResetFire 里清零 */
  reset() {
    this.current = 0;
  }
}

/** B5 —— 射速爬升（MG） */
export class RateOfFireTimer {
  /**
   * @param {number} initRof 表值 RateOfFire（MG = 60）
   * @param {number} endRof 表值 EndRateOfFire（MG = 4200）
   * @param {number} changePerShot 表值 RateOfFireChangePershot（MG = 100）
   */
  constructor(initRof, endRof, changePerShot) {
    this.initRof = initRof;
    this.endRof = endRof;
    this.changePerShot = changePerShot;
    this.current = initRof;
  }

  /** OnAfterFire 0x5F0661F：current += ChangePershot，钳到 EndRoF（实锤） */
  onFire() {
    this.current = Math.min(this.endRof, this.current + this.changePerShot);
  }

  /**
   * 停火重置：表值 RateOfFireResetTime=100 × 0.01 = 1.0s（0x5D1164A 常量 0.01 实锤）。
   * 但「1.0s 到期是瞬间回 60 还是逐帧衰减」尚未确证——UpdateRateOfFire 0x5E08EC0
   * 的寄存器语义（xmm6/xmm9）未对齐，按现有推断会得出 69 秒降回的不合理结果。
   * 因此这里只提供显式重置，不做自动计时，等 C4 再补。
   */
  resetToInit() {
    this.current = this.initRof;
  }
}

/** 便捷：默认 dt（SpotSimulationRunner._perFrame） */
export { TICK_DT };

/**
 * ResetFire 对累计槽的处理（TeamContext.ResetFire 0x5F19490）。
 *
 * 原生依据：0x5F19713 读 InputType(+0xE8)，0x5F19719 cmp eax,2 / jne 0x5F1988D。
 *   InputType==2（蓄力型 UP）：0x5F1980F 载 1.0f（RVA 0x7E64F2C），
 *                              0x5F1981C maxss → 写回 max(1.0, 当前值)。
 *   InputType!=2（SG/AR/SMG/MG）：0x5F198D3 xorps xmm1,xmm1 → 写回 0。
 *
 * 也就是说：蓄力型收枪后下一发不会被拖慢（槽已 ≥1）；恒定射速型收枪会把
 * 已累计的进度整段丢掉，恢复射击后要重新累计。
 *
 * 触发路径：ChangeStance 0x5F022A0 → OnHide 0x5F15330（0x5F153D5）→ ResetFire。
 * ResetFire 全库只有一个直接调用点，即 OnHide；OnHide 只被 ChangeStance 调用。
 * 因此**只有发生离开 Aim 的姿态切换才会付出这份代价**，单纯"没有目标"不会。
 *
 * @param {number} inputType 武器 inputType（1=DOWN，2=UP，3=DOWN_Charge）
 * @param {number} accum 当前槽值
 * @returns {number} 写入后的槽值
 */
export function applyResetFire(inputType, accum) {
  if (inputType === 2) return Math.max(1, f32(accum));
  return 0;
}
