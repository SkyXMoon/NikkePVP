/**
 * V1 —— 事件 → 动画请求映射
 *
 * 依据（2026-11-01 动画解析 + 11-03 事件流）：
 *   c000_00_animator 的转场条件全是表现参数（AimFire / IsReload / ToAim / ToCover），
 *   逻辑事件只负责触发，不反过来约束节奏（roadmap：不让素材长度决定逻辑）。
 *
 * 映射（剪辑名来自 animation_summary.csv）：
 *   AIM_START   → aim_start   进入瞄准
 *   FIRE        → shot        发射（AimFire 触发）
 *   IDLE        → aim_end     发射后收枪（IT=2）
 *   RELOAD_START→ cover_reload 掩体换弹
 *   RELOAD_DONE → aim_start   回瞄准
 *
 * 时长只用于表现层播放与"是否会被下一事件打断"的检查，不参与逻辑。
 */

/**
 * 事件 → Animator 参数（2026-11-01 控制器解析：转场条件全为表现参数，
 * 不存在"等动画播完才允许下一逻辑事件"的门控）。
 *   ToAim     trigger  进入瞄准（AnyState 入口）
 *   AimFire   trigger  发射（Shot 状态）
 *   ToCover   trigger  收枪（AnyState 入口）
 *   IsReload  bool     换弹中
 */
export const EVENT_PARAM = {
  AIM_START: [{ name: 'ToAim', kind: 'trigger' }],
  FIRE: [{ name: 'AimFire', kind: 'trigger' }],
  IDLE: [{ name: 'ToCover', kind: 'trigger' }],
  RELOAD_START: [{ name: 'IsReload', kind: 'bool', value: true }],
  RELOAD_DONE: [{ name: 'IsReload', kind: 'bool', value: false }, { name: 'ToAim', kind: 'trigger' }],
};

export const EVENT_CLIP = {
  AIM_START: 'aimStart',
  FIRE: 'shot',
  IDLE: 'aimEnd',
  RELOAD_START: 'coverReload',
  RELOAD_DONE: 'aimStart',
};

/**
 * 把事件流转成动画请求序列（不含播放，只给表现层消费）。
 *
 * @param {Array<{tick:number,id:string,type:string}>} events
 * @param {object} anims data/animations.json（code → 剪辑时长）
 * @param {Record<string,string>} charCode 角色名 → 动画 code（如 {拉毗:'c010'}）
 * @returns {Array<{tick:number, frame60:number, id:string, event:string, clip:string, clipName:string, duration:number|null, interrupted:boolean}>}
 */
export function toAnimRequests(events, anims, charCode = {}) {
  const out = [];
  // 按角色记录"上一条动画请求何时结束"，用于判断是否被打断
  const busyUntil = new Map();
  for (const e of events) {
    const clip = EVENT_CLIP[e.type];
    if (!clip) continue;
    const code = charCode[e.id];
    const a = code ? anims[code] : null;
    const dur = a ? a[clip] ?? null : null;
    const frame60 = e.tick * 2;
    const until = busyUntil.get(e.id) ?? 0;
    const interrupted = dur != null && frame60 + dur * 60 < until;
    out.push({
      tick: e.tick,
      frame60,
      id: e.id,
      event: e.type,
      clip,
      clipName: a ? `${code}_${clip}` : null,
      duration: dur,
      interrupted,
    });
    if (dur != null) busyUntil.set(e.id, frame60 + dur * 60);
  }
  return out;
}

/**
 * 事件流 → Animator 调用序列（可直接喂给实际的 Animator 桥接层）。
 * @param {Array<{tick:number,id:string,type:string}>} events
 * @returns {Array<{tick:number, frame60:number, id:string, event:string, calls:Array}>}
 */
export function toAnimatorCalls(events) {
  const out = [];
  for (const e of events) {
    const calls = EVENT_PARAM[e.type];
    if (!calls) continue;
    out.push({ tick: e.tick, frame60: e.tick * 2, id: e.id, event: e.type, calls });
  }
  return out;
}
