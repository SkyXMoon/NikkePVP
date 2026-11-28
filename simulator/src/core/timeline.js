/**
 * D4 —— 单角色事件表
 *
 * 把 C/D 批的各分支模型组合成一条事件时间轴：
 *   { tick, playTime, frame60, gap, type }
 *
 *   tick     事件序号（1 起，权威时间轴；同一记录在任何设备上 tick 一致）
 *   playTime tick × eventDt（0.033）——模拟器累计的"播放时间"，三位小数舍入口径
 *   frame60  tick × 2 —— 60fps 显示帧（30Hz 事件 × 2）
 *   gap      与上一 FIRE 事件的事件数间隔
 *   type     AIM(开局) / FIRE / RELOAD(完成时刻)
 *
 * 输入从 CharacterShotTable 直接取字段（已核对 2026-10-30 global 表）。
 */

import { EVENT_DT_30 } from './time.js';
import { simulateDownInterval, simulateDownSequence, simulateDownChargeBurst, simulateUpCycle, simulateReloadSequence } from './cycles.js';

/**
 * @param {{
 *   id:string,
 *   inputType:number,            // 1=DOWN 2=UP 3=DOWN_Charge
 *   rateOfFire:number,
 *   chargeTimeUnits?:number,     // ChargeTime（0.01s）
 *   mfsUnits?:number,            // MaintainFireStance
 *   fireTimingUnits?:number,     // FireTiming（IT=2 专属）
 *   maxAmmo:number,
 *   reloadTimeUnits?:number,     // ReloadTime（0.01s）
 *   reloadBulletBp?:number,      // ReloadBullet（万分比）
 *   preDelayUnits?:number,       // SpotFirstDelay
 *   approachEvents?:number,      // 冲锋时长（事件数）；缺省=足够长，槽已满
 *   shots:number,
 *   eventDt?:number,
 * }} p
 * @returns {{events:Array, summary:object}}
 */
export function buildCharacterTimeline(p) {
  const eventDt = p.eventDt ?? EVENT_DT_30;
  const mfs = p.mfsUnits ?? 0;
  const pre = p.preDelayUnits ?? 20;
  let fireTicks = [];
  const reloads = [];
  let note = '';

  if (p.inputType === 1) {
    // DOWN：间隔 + 换弹。
    // 首发模型（2026-11-02，按用户观察修正）：累计槽无门控，冲锋阶段照常累计，
    // 进入射程切 Aim 时槽已满（approachEvents 足够长）——第 1 发只被前置卡着，
    // 落在 preReady（前置 20 单位 → 6 事件 ≈ 0.2s）。因此 AR/SG/SMG/MG 起手一致。
    // approachEvents 可显式给冲锋时长（事件数）以模拟短冲锋：
    // initialAcc = min(1, approachEvents × RoF/60 × dt)。
    const interval = simulateDownInterval({ rateOfFire: p.rateOfFire, eventDt });
    let initialAcc = 1;
    if (p.approachEvents != null) {
      const inc = Math.max(0, p.rateOfFire / 60) * eventDt;
      initialAcc = Math.min(1, p.approachEvents * inc);
    }
    const probe = simulateDownSequence({ rateOfFire: p.rateOfFire, preDelayUnits: pre, shotCount: 1, initialAcc, eventDt });
    const shift = probe.fireTicks[0] - 1; // 首发事件序号-1
    if (p.maxAmmo > 0 && p.reloadTimeUnits!=null) {
      const r = simulateReloadSequence({
        maxAmmo: p.maxAmmo,
        reloadTimeUnits: p.reloadTimeUnits,
        reloadSpeedBp:p.reloadSpeedBp,
        reloadFunctions:p.reloadFunctions,
        reloadBulletBp: p.reloadBulletBp ?? 10000,
        shots: p.shots,
        intervalEvents: interval,
        eventDt,
      });
      fireTicks = r.fireTicks.map((t) => t + shift);
      r.reloadTicksAt.forEach((t) => reloads.push(t + shift));
      if (r.perReload < p.maxAmmo) note = `分段装填 ${r.perReload} 发/次`;
    } else {
      // 无弹匣（无限）：纯连射
      let t = 1;
      for (let i = 0; i < p.shots; i++) { fireTicks.push(t); t += interval; }
    }
  } else if (p.inputType === 2) {
    // UP：完整循环（含 MFS）
    const c = simulateUpCycle({
      preDelayUnits: pre,
      chargeTimeSec: p.chargeTimeUnits / 100,
      shots: p.shots,
      mfsUnits: mfs,
      fireTimingUnits: p.fireTimingUnits ?? 0,
      rateOfFire: p.rateOfFire || 60,
      eventDt,
    });
    fireTicks = c.fireTicks;
    if (mfs > 0) note = `MFS ${mfs}（${(mfs / 100).toFixed(2)}s）阻塞 Idle`;
  } else if (p.inputType === 3) {
    // DOWN_Charge：每发清蓄力；连射参数由调用方显式提供。
    const c = simulateDownChargeBurst({
      chargeTimeSec: p.chargeTimeUnits / 100,
      followUpChargeTimeSec: (p.followUpChargeTimeUnits ?? p.chargeTimeUnits) / 100,
      rateOfFire: p.rateOfFire,
      shotCount: p.shots,
      preDelayUnits: pre,
      eventDt,
    });
    fireTicks = c.fireTicks;
    if (p.maxAmmo > 0 && p.reloadTimeUnits!=null) {
      // 弹药模型与 IT=1 相同（首发也耗 1 发）；整体平移蓄力偏移，
      // 使第 1 发落在满蓄的下一事件（c.fireTicks[0]）
      const shift = c.fireTicks[0] - 1;
      const gaps = c.fireTicks.slice(1).map((v, i) => v - c.fireTicks[i]);
      const interval = gaps[0] ?? simulateDownInterval({ rateOfFire: p.rateOfFire, eventDt });
      const r = simulateReloadSequence({
        maxAmmo: p.maxAmmo,
        reloadTimeUnits: p.reloadTimeUnits,
        reloadSpeedBp:p.reloadSpeedBp,
        reloadFunctions:p.reloadFunctions,
        reloadBulletBp: p.reloadBulletBp ?? 10000,
        shots: p.shots,
        intervalEvents: interval,
        eventDt,
      });
      fireTicks = r.fireTicks.map((t) => t + shift);
      r.reloadTicksAt.forEach((t) => reloads.push(t + shift));
      if (r.perReload < p.maxAmmo) note = `分段装填 ${r.perReload} 发/次`;
    }
  } else {
    throw new RangeError(`buildCharacterTimeline: 不支持的 InputType ${p.inputType}`);
  }

  const events = [];
  events.push({ tick: 1, playTime: +(1 * eventDt).toFixed(4), frame60: 2, gap: null, type: 'AIM' });
  let lastFire = null;
  for (const t of fireTicks) {
    const gap = lastFire === null ? null : t - lastFire;
    events.push({ tick: t, playTime: +(t * eventDt).toFixed(4), frame60: t * 2, gap, type: 'FIRE' });
    lastFire = t;
  }
  for (const t of reloads) {
    events.push({ tick: t, playTime: +(t * eventDt).toFixed(4), frame60: t * 2, gap: null, type: 'RELOAD_DONE' });
  }
  events.sort((a, b) => a.tick - b.tick);

  const fireGaps = fireTicks.slice(1).map((v, i) => v - fireTicks[i]);
  const summary = {
    id: p.id,
    inputType: p.inputType,
    shots: fireTicks.length,
    firstFireTick: fireTicks[0],
    firstFireSec: +(fireTicks[0] * eventDt).toFixed(3),
    steadyGap: fireGaps.length ? [...new Set(fireGaps)] : [],
    steadyGapSec: fireGaps.length ? [...new Set(fireGaps)].map((g) => +(g * eventDt).toFixed(3)) : [],
    reloadCount: reloads.length,
    note,
  };
  return { events, summary };
}
