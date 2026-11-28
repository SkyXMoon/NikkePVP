/**
 * C 批 —— 单条射击循环（每条分支独立，不组装状态机）
 *
 * 每 tick 的更新顺序取自 WeaponLogic.ProcessWeaponLogic 0x5E07110：
 *   0x5E073D5 UpdatePreDelay          → 前置
 *   ...       （发射判定段，含 UpTypeFireDelay 处理）
 *   0x5E076C3 UpdateAccumFireDelay    → 射速累计
 *   0x5E076D1 UpdateChargeTime        → 蓄力
 *   0x5E076DF UpdatePenetrationTime
 *   0x5E076ED UpdateAccuracy
 *   0x5E076FB UpdateReload
 *   0x5E07709 UpdateWeaponStatus
 *   0x5E07717 UpdateRateOfFire
 *
 * 因此同一 tick 内：先更新前置，再更新射速累计，最后更新蓄力。
 *
 * 蓄力门控（UpdateChargeTime 0x5E085F0 内部，按顺序）：
 *   0x5E08668 门函数 0x5DDF470（武器状态不属于 3/4/5）→ 否则 return
 *   0x5E0868F CanFire（IsReadyForPreDelay && StanceType==2）→ 否则 return
 *   0x5E08735 CurrentMaintainFireStance 必须 <= 0          → 否则 return
 *   0x5E08768 另一 double 属性必须 <= 0                    → 否则 return
 *   0x5E087C7 charge = min(ChargeTime, charge + dt)
 *
 * 也就是说：前置未就绪、或后摇锁未过期，蓄力完全不累计。
 */

import { EVENT_DT_30 } from './time.js';
import { STANCE_AIM, PreDelayTimer, AccumFireTimer, ChargeTimer, FIRE_THRESHOLD, reloadDurationTicks } from './timers.js';
import {getReloadTimeUnits} from './reload.js';
import { f32 } from './time.js';

/**
 * 默认事件 dt。
 *
 * 客户端同一事件 dt 会依次传给前置、累计、蓄力等所有子更新
 * （ProcessWeaponLogic 0x5E07110 的 xmm7 来自事件 +0x48）。
 * 该值受两处影响：管理器三位小数舍入，以及竞技场 min(remainingDt, PER_FRAME) 拆分。
 * 这里给的是「单位倍率 + 30Hz 输入」的条件值，不是所有配置的常量，
 * 因此所有模拟函数都把它作为显式参数。
 */
export const DT = EVENT_DT_30;

/**
 * C1 —— UP（蓄力型）单发：从请求 Aim 起，到「满蓄可发」所需的 tick。
 *
 * 起点约定：tick 0 = BT 下发 Aim 的那一帧（此时各计时器均为 0）。
 * 返回值为「满蓄发生在第几 tick 的末尾」，不含 BT 求值相位与收枪重置帧
 * （那两帧属于 D1 的组合范畴）。
 *
 * @param {{preDelayUnits:number, chargeTimeSec:number, eventDt?:number, maxTicks?:number}} p
 */
export function simulateUpSingleShot({ preDelayUnits, chargeTimeSec, eventDt = DT, maxTicks = 2000 }) {
  const pre = new PreDelayTimer(preDelayUnits);
  const charge = new ChargeTimer(chargeTimeSec);

  for (let t = 1; t <= maxTicks; t++) {
    pre.tick(eventDt, STANCE_AIM); // 0x5E073D5
    if (pre.isReady()) charge.tick(eventDt); // CanFire 门控（0x5E0868F）
    if (charge.isFull()) return { tick: t, preReadyTick: findPreReady(preDelayUnits, eventDt), chargeTicks: t - findPreReady(preDelayUnits, eventDt) + 1 };
  }
  throw new RangeError(`simulateUpSingleShot: ${maxTicks} 次事件内未满蓄`);
}

function findPreReady(preDelayUnits, eventDt = DT) {
  const pre = new PreDelayTimer(preDelayUnits);
  for (let t = 1; t <= 1000; t++) {
    pre.tick(eventDt, STANCE_AIM);
    if (pre.isReady()) return t;
  }
  throw new RangeError('findPreReady: 前置始终未就绪');
}

/**
 * C2 —— DOWN（恒定射速）单发间隔：射速累计槽达到阈值所需的 tick。
 *
 * 起点约定：tick 0 = 槽为 0。每发 OnAfterFire 会清槽，故下一发重复同样过程。
 * 阈值恒为 1.0（TryCharacterFire 0x5E077EC），不存在第二个更低门槛。
 * 本函数只计算「累计达到 1.0」；就绪、姿态、目标门控不在其中。
 *
 * @param {{rateOfFire:number, eventDt?:number, threshold?:number, maxTicks?:number}} p
 */
export function simulateDownInterval({ rateOfFire, eventDt = DT, threshold = FIRE_THRESHOLD, maxTicks = 5000 }) {
  const acc = new AccumFireTimer(rateOfFire);
  for (let t = 1; t <= maxTicks; t++) {
    acc.tick(eventDt); // 0x5E076C3
    if (acc.isOverThreshold(threshold)) return t;
  }
  throw new RangeError(`simulateDownInterval: ${maxTicks} 次事件内未达阈值`);
}

/**
 * C2b —— DOWN 连续射击（含门控）：累计无条件推进，发射受 CanFire 约束。
 *
 * 三条原生依据：
 *   1. UpdateAccumFireDelay 0x5E07F70 开头直接读槽做加减，**无姿态/前置/换弹门控**，
 *      所以前置未就绪期间累计照样在涨。
 *   2. TryCharacterFire 0x5E07760 → CanFire 0x5E065A0：要求前置就绪（0x5E06613）
 *      且姿态==2(Aim)（0x5E06635 cmp eax,2）才可能发射，未通过时本步不发射、槽不清零。
 *   3. CalculateShot 0x5DE5630 的收枪分支由 0x5DE5C62 读 InputType(+0xE8)、
 *      0x5DE5C68 cmp eax,2 / jne 跳过，故 InputType=1（SG/AR/SMG）**不会请求 Idle**，
 *      姿态保持 Aim、MaintainFireStance=0，下一发不需要重新满足前置。
 *
 * 于是稳定状态下的实际间隔 = 累计达标步数，且与首发相同（首发射击时前置早已就绪）。
 *
 * @param {{rateOfFire:number, preDelayUnits:number, shotCount:number, eventDt?:number, threshold?:number, maxTicks?:number, unavailableTicks?:number[]}} p
 * @returns {{preReadyTick:number, fireTicks:number[]}}
 */
export function simulateDownSequence({
  rateOfFire,
  preDelayUnits,
  shotCount,
  initialAcc = 0,
  eventDt = DT,
  threshold = FIRE_THRESHOLD,
  maxTicks = 10000,
  unavailableTicks = [],
}) {
  const pre = new PreDelayTimer(preDelayUnits);
  const acc = new AccumFireTimer(rateOfFire, initialAcc);
  const fireTicks = [];
  const blocked = new Set(unavailableTicks);
  let preReadyTick = 0;

  for (let t = 1; t <= maxTicks && fireTicks.length < shotCount; t++) {
    pre.tick(eventDt, STANCE_AIM); // 0x5E073D5，仅在 Aim 累计
    acc.tick(eventDt); // 0x5E076C3，无门控
    if (!preReadyTick && pre.isReady()) preReadyTick = t;

    // CanFire = 前置就绪 && 姿态Aim && 有合法目标
    // 目标无效时（blocked）本次不发射，槽**不清零**，故代价只是这一次被跳过
    const canFire = pre.isReady() && !blocked.has(t);
    if (canFire && acc.isOverThreshold(threshold)) {
      fireTicks.push(t);
      acc.reset(); // OnAfterFire 0x5F06591 置 0
    }
  }
  if (fireTicks.length < shotCount) throw new RangeError('simulateDownSequence: 事件数不足');
  return { preReadyTick, fireTicks };
}

/**
 * C3 —— DOWN_Charge（按住蓄力，InputType=3）
 *
 * 原生语义（2026-11-02 复核）：
 *   1. 累计槽**无条件推进**（UpdateAccumFireDelay 对 IT=3 也照跑，0x5E076C3）；
 *   2. 发射条件 = TryCharacterFire && IsFullCharge（0x5E081B3..0x5E081E9）；
 *   3. 充能受门控：CanAct → CanFire(前置+Aim) → !IsFullCharge → MFS → double属性
 *      （0x5E085F0，见文档 6.2），即**前置未就绪时充能不动，但槽照涨**；
 *   4. 事件内顺序：前置 → 累计/发射判定 → 充能（0x5E073D5/0x5E076C3/0x5E076D1），
 *      所以"蓄满的那一 tick"的发射判定用的是充能前的状态，**首发落在满蓄的下一 tick**；
 *   5. OnAfterFire 对 InputType3 每发清当前蓄力（0x5F0623F），不清前置；
 *      后续连射需要技能提供降低后的蓄力参数，不能假设蓄力永久保留。
 *
 * 由此首发间隔 = 满蓄 tick + 1，而不是"清槽后再累计一轮"。
 *
 * @param {{chargeTimeSec:number, rateOfFire:number, shotCount:number, preDelayUnits?:number,
 *          followUpChargeTimeSec?:number, eventDt?:number, threshold?:number, maxTicks?:number}} p
 * @returns {{preReadyTick:number, chargeTick:number, fireTicks:number[]}}
 */
export function simulateDownChargeBurst({
  chargeTimeSec,
  followUpChargeTimeSec = chargeTimeSec,
  rateOfFire,
  shotCount,
  preDelayUnits = 20,
  eventDt = DT,
  threshold = FIRE_THRESHOLD,
  maxTicks = 10000,
}) {
  const pre = new PreDelayTimer(preDelayUnits);
  const charge = new ChargeTimer(chargeTimeSec);
  const acc = new AccumFireTimer(rateOfFire);
  const fireTicks = [];
  let preReadyTick = 0;
  let chargeTick = 0;

  for (let t = 1; t <= maxTicks && fireTicks.length < shotCount; t++) {
    pre.tick(eventDt, STANCE_AIM); // 0x5E073D5
    acc.tick(eventDt); // 0x5E076C3，无门控
    if (!preReadyTick && pre.isReady()) preReadyTick = t;

    // 发射判定（IsFullCharge 用本 tick 充能前的状态，与原生事件内顺序一致）
    if (pre.isReady() && charge.isFull() && acc.isOverThreshold(threshold)) {
      fireTicks.push(t);
      acc.reset(); // OnAfterFire 清槽
        charge.reset();
        charge.target = Math.fround(followUpChargeTimeSec);
    }

    // 充能（CanFire 门控 + 未满蓄才累计）
    if (pre.isReady() && !charge.isFull()) {
      charge.tick(eventDt);
      if (!chargeTick && charge.isFull()) chargeTick = t;
    }
  }
  if (fireTicks.length < shotCount) throw new RangeError('simulateDownChargeBurst: 事件数不足');
  return { preReadyTick, chargeTick, fireTicks };
}

/**
 * C4 —— MG 爬升：每发后 RoF += ChangePershot，用变化中的 RoF 累计。
 *
 * 注意：本函数只用已确证的「每发 +ChangePershot」与「累计槽」，
 * 不含 UpdateRateOfFire 的逐帧平滑逼近（该段语义未确证，见 timers.js）。
 *
 * @param {{initRof:number, endRof:number, changePerShot:number, shotCount:number, eventDt?:number, threshold?:number, maxTicks?:number}} p
 * @returns {{fireTicks:number[], rofAfter:number[]}}
 */
export function simulateMgRamp({
  initRof,
  endRof,
  changePerShot,
  shotCount,
  eventDt = DT,
  threshold = FIRE_THRESHOLD,
  maxTicks = 20000,
}) {
  let rof = initRof;
  const acc = new AccumFireTimer(rof);
  const fireTicks = [];
  const rofAfter = [];
  let t = 0;

  while (fireTicks.length < shotCount) {
    t += 1;
    acc.rateOfFire = rof;
    acc.tick(eventDt);
    if (acc.isOverThreshold(threshold)) {
      fireTicks.push(t);
      acc.reset();
      rof = Math.min(endRof, rof + changePerShot); // OnAfterFire 0x5F0661F
      rofAfter.push(rof);
    }
    if (t > maxTicks) throw new RangeError('simulateMgRamp: 超时');
  }
  return { fireTicks, rofAfter };
}

/**
 * D1 —— UP（蓄力型）完整循环
 *
 * 原生链路（2026-11-02）：
 *   IT=2 的 fired 恒为 false（0x5E08186 只处理 IT 1/3），
 *   开火请求来自 BT：CheckChangeStance（0x5DDF530，内含 0x5DDF756 TryCharacterFire、
 *   0x5DDF831 发 PreCalculateCharacterShotEvent），条件=姿态Aim + 槽≥1 + 满蓄等。
 *   槽在 Aim 期间照常累计（无门控），ResetFire 后被抬到 max(1,·)（0x5F1981C），
 *   所以"槽≥1"在满蓄时天然成立。
 *
 * 循环（每发）：
 *   Aim → 前置(6) → 充能(31次，含共同起手F0) → 当拍满蓄 → 后置BT发射 → 请求 Idle → ResetFire（清前置/充能）
 *       → BT 重新请求 Aim → 下一发
 *
 * 默认使用已核对的后置BT相位。发射后保持Idle，下一次BT请求Aim后，
 * 后续武器更新才恢复前置累计。btBeforeWeapon保留为显式相位实验参数。
 * 连续射击周期仍需与网站已验证的恢复时间进一步对齐。
 *
 * @param {{preDelayUnits?:number, chargeTimeSec:number, shots?:number,
 *          aimRequestDelay?:number, mfsUnits?:number, fireTimingUnits?:number,
 *          rateOfFire?:number, btBeforeWeapon?:boolean,
 *          eventDt?:number, maxTicks?:number}} p
 * @returns {{fireTicks:number[]}} 各发所在事件序号（从第 1 次事件计）
 */
export function simulateUpCycle({
  preDelayUnits = 20,
  chargeTimeSec,
  shots = 3,
  aimRequestDelay = 1,
  mfsUnits = 0,
  fireTimingUnits = 0,
  rateOfFire = 60, // IT=2 表值分布：87行=60、12行=0(特殊行MaxAmmo=0)；显式参数防隐患
  initialAcc = 0,
  btBeforeWeapon = false,
  eventDt = DT,
  maxTicks = 10000,
}) {
  const pre = new PreDelayTimer(preDelayUnits);
  const charge = new ChargeTimer(chargeTimeSec);
  const acc = new AccumFireTimer(rateOfFire, initialAcc);
  const fireTicks = [];

  let stance = 'Idle'; // 开局 BT 先请求 Aim
  let idleLeft = 1;
  let resetPending = false;
  let mfsLeft = f32(0); // MaintainFireStance 剩余（0.01s 单位，float32）
  let holdLeft = 0; // UpTypeFireTiming 窗口（事件数）：IsHave 为真期间 BT 不发射（0x5DDF80C）
  let mfsLatch = false; // MFS 过期后 Idle 只生效一次（闩锁），下次开火重新置位

  for (let t = 1; t <= maxTicks && fireTicks.length < shots; t++) {
    let resumeAimAfterWeapon = false;
    if (stance === 'Idle') {
      idleLeft -= 1;
      if (idleLeft <= 0) {
        if (t === 1 || btBeforeWeapon) stance = 'Aim';
        else resumeAimAfterWeapon = true;
      }
    }

    const wasFull = charge.isFull();

    if (stance === 'Aim') {
      pre.tick(eventDt, STANCE_AIM); // 0x5E073D5
      if (pre.isReady() && !charge.isFull()) charge.tick(eventDt); // 0x5E076D1（CanFire + !IsFullCharge 门控）
    }
    if (stance === 'Aim') acc.tick(eventDt); // 槽无门控照涨
    if (mfsLeft > 0) mfsLeft = f32(Math.max(0, mfsLeft - f32(eventDt * 100))); // 0x5E089B0
    if (holdLeft > 0) holdLeft -= 1;

    const tryFire = () => {
      if (stance !== 'Aim' || !pre.isReady() || !charge.isFull()) return false;
      if (!acc.isOverThreshold(1)) return false;
      if (holdLeft > 0) return false; // IsHaveUpTypeFireTimingValue=true → 0x5DDF80C jne 跳过发射
      fireTicks.push(t);
      acc.reset(); // OnAfterFire 0x5F06591：任意 IT 开火后槽清零
      if (mfsUnits > 0) {
        // MFS>0：Idle 请求被 ChangeStanceEvent.Send 拒绝（0x5E4B596），
        // 姿态保持 Aim，直到锁过期才真正切走并触发 ResetFire。
        // 同时 ResetFire 会设 UpTypeFireTiming（0x5F199DF），开火被 IsHave 窗口挡住；
        // 窗口取 MFS 与 FireTiming 的较大者（FireTiming 单位未定，暂按 0.0001s 折算）。
        mfsLeft = f32(mfsUnits);
        mfsLatch = true;
        const mfsTicks = Math.ceil(mfsUnits / (eventDt * 100));
        const ftTicks = Math.ceil((fireTimingUnits * 0.0001) / eventDt);
        holdLeft = Math.max(mfsTicks, ftTicks);
      } else {
        stance = 'Idle';
        idleLeft = aimRequestDelay;
        resetPending = true;
      }
      return true;
    };

    if (!btBeforeWeapon || wasFull) tryFire();

    if (mfsUnits > 0 && mfsLatch && mfsLeft === 0 && stance === 'Aim') {
      // 锁过期：此前被拒的 Idle 请求生效（只生效一次，闩锁防每帧重触发）
      stance = 'Idle';
      idleLeft = aimRequestDelay;
      resetPending = true;
      mfsLatch = false;
      // MFS expires in the weapon phase, before this tick's BT Aim request.
      resumeAimAfterWeapon = !btBeforeWeapon && aimRequestDelay === 1;
    }

    if (resetPending && stance === 'Idle') {
      // ResetFire 0x5F19490：前置/充能清零，槽抬到 max(1,·)
      pre.reset();
      charge.reset();
      acc.acc = Math.max(1, acc.acc);
      resetPending = false;
    }
    if (resumeAimAfterWeapon && stance === 'Idle') stance = 'Aim';
  }
  if (fireTicks.length < shots) throw new RangeError('simulateUpCycle: 事件数不足');
  return { fireTicks };
}

/**
 * D3 —— 弹匣与换弹循环
 *
 * 原生依据（2026-11-02）：
 *   - 开局弹药 = MaxAmmo（SpotWeaponData .ctor 0x5D0D268..276）；ReloadStartAmmo 是换弹判断阈值
 *   - 每次开火 UseAmmo(1)（0x5D0CBB0，发 CharacterUseAmmo 事件 366）
 *   - 空弹 IsEmpty（0x5D100A0）→ BT 请求换弹 → StartReload（0x5F1A000，
 *     门控 CanAct、IsEmpty、其它状态检查）
 *   - 换弹时长 = GetStatValue(InitReloadTime +0x2A0, FT159)（0x5D11E70 尾部
 *     jmp 0x5DCF860，r8d=0x9F）；无 FT159 条目时回退 FT13（r8d=0xD → 0x5D0B4A0）
 *   - 表单位：ReloadTime=100 ⇒ 1.00s（0.01s 单位，与蓄力一致）
 *   - 装填量 = round(ReloadBullet/10000 × MaxAmmo)（round 语义与原生
 *     DoubleToLong 一致：中点远离零）：AR 10000=满弹匣；SG 3300 →
 *     round(9×0.33)=3 发，3 次装满（与游戏内分段换弹体感一致）
 *   - 进度累计 UpdateReload（0x5E09190），姿态等门控细节未全解
 *
 * @param {{maxAmmo:number, reloadTimeUnits:number, reloadBulletBp:number,
 *          startAmmo?:number, shots:number, intervalEvents:number,
 *          eventDt?:number, maxTicks?:number}} p
 * @returns {{fireTicks:number[], reloadTicksAt:number[], perReload:number, reloadTickSpan:number}}
 */
export function simulateReloadSequence({
  maxAmmo,
  reloadTimeUnits,
  reloadSpeedBp=0,
  reloadFunctions=[],
  reloadBulletBp,
  startAmmo = maxAmmo,
  shots,
  intervalEvents,
  eventDt = DT,
  maxTicks = 100000,
}) {
  if (startAmmo <= 0) throw new RangeError('simulateReloadSequence: startAmmo 必须 > 0');
  const effectiveReload=getReloadTimeUnits(reloadTimeUnits,{reloadSpeedBp,functions:reloadFunctions});
  const reloadTicks = Math.max(1,effectiveReload>0?reloadDurationTicks(effectiveReload, eventDt):0);
  // round 半递增语义（原生 DoubleToLong：中点远离零），如 round(2.97)=3
  const raw = (maxAmmo * reloadBulletBp) / 10000;
  const perReload = Math.round(raw); // 2.97 → 3，三次装满
  if (perReload <= 0) throw new RangeError('simulateReloadSequence: ReloadBullet 折算 ≤ 0');

  const fireTicks = [];
  const reloadsAt = [];
  let ammo = startAmmo;
  let t = 1;

  while (fireTicks.length < shots && t <= maxTicks) {
    if (ammo <= 0) {
      const complete = fireTicks.at(-1) + reloadTicks;
      reloadsAt.push(complete);
      // Rate accumulation runs during reload; do not append a fresh full
      // firing interval after the reload duration. Completion itself cannot fire.
      t = Math.max(t, complete + 1);
      ammo = Math.min(maxAmmo, ammo + perReload);
      continue;
    }
    fireTicks.push(t);
    ammo -= 1;
    t += intervalEvents;
  }
  if (fireTicks.length < shots) throw new RangeError('simulateReloadSequence: 事件数不足');
  return { fireTicks, reloadTicksAt: reloadsAt, perReload, reloadTickSpan: reloadTicks };
}
