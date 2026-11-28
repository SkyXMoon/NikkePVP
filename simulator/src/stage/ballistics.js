/**
 * LEGACY STATIC FIXTURE ONLY. Not imported by stage.js.
 * This earlier approximation uses mesh AABBs, guessed homing, and static arrival
 * counts. Its parameters are NOT native evidence. Retained only for historical
 * renderer/driver fixture tests; actual shooting uses shooting.js and the exported
 * native-shooting.json contract. Never use this helper for V2 calculation.
 */
import * as THREE from 'three';

const HOMING_DT = 1 / 30;
const HOMING_DT_BASE = 0.016666668; // 反汇编常数（60fps 基准 dt）
const HOMING_MAX_ROTATION = 3.0;    // 旧夹具值
const HOMING_PHASE_DELAY = 0.01;    // lv1 FreeFlyTime(0) + TrackingDelay(0.01s)
const HOMING_MAX_TICKS = 45;        // 旧测试夹具上限；客户端 lv1 实际为 1 秒

/**
 * 追踪转向（旧近似公式，不是客户端公式）：t = clamp((dt/0.016666668)*MaxRotation/dist, 0, 1)。
 * 30Hz 下 dt/0.016666668*3.0 ≈ 6，即 t = clamp(6/dist, 0, 1)：dist<6 时一步对准目标。
 * @param {THREE.Vector3} dir 当前方向（单位向量）
 * @param {THREE.Vector3} toDir 指向目标方向（单位向量）
 * @param {number} dist 当前弹体到目标距离
 */
export function homingSteer(dir, toDir, dist) {
  if (dist < 1e-9) return toDir.clone();
  const t = Math.min(1, Math.max(0, (HOMING_DT / HOMING_DT_BASE) * HOMING_MAX_ROTATION / dist));
  if (t >= 1) return toDir.clone();
  if (t <= 0) return dir.clone();
  const delta = new THREE.Quaternion().setFromUnitVectors(dir, toDir);
  return dir.clone().applyQuaternion(
    new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), delta, t)).normalize();
}

/**
 * 旧静态夹具逐 tick 近似（不是客户端运动）。
 * 初值方向 = 指向目标；第 1 tick 累计时间(0) < 0.01s 不转向，第 2 tick 起进入追踪。
 * 掩体碰撞用线段/tick 步进，与 blocked 逻辑一致；终点段裁剪到目标，掩体不越过目标。
 * @param {object} p
 * @param {THREE.Vector3} p.from 发射点
 * @param {THREE.Vector3} p.to 目标点
 * @param {number} p.speed spot_projectile_speed（单位/秒，无缩放）
 * @param {(from:THREE.Vector3, to:THREE.Vector3)=>{name:string,point:THREE.Vector3}|null} [p.blocked]
 * @param {number} [p.maxTicks] 超时封顶 tick 数
 * @param {THREE.Vector3} [p.initialDir] 测试接缝：覆盖初值方向（生产默认指向目标）
 * @returns {{tick:number, point:THREE.Vector3, blocked:string|null, path:THREE.Vector3[], timeout:boolean}}
 *   tick: 命中/超时 tick（1 起）；path: 每 tick 末位置（含起点，长度 = tick+1）
 */
export function simulateHomingPath({ from, to, speed, blocked = null, maxTicks = HOMING_MAX_TICKS, initialDir = null }) {
  const pos = from.clone();
  const dir = initialDir ? initialDir.clone().normalize() : to.clone().sub(from).normalize();
  const path = [pos.clone()];
  const step = speed * HOMING_DT;
  let elapsed = 0;
  let tracking = false;
  for (let tick = 1; tick <= maxTicks; tick++) {
    // 相位在位移前用累计时间精确判断：第1tick elapsed=0 < 0.01s 不转向
    if (!tracking && elapsed > HOMING_PHASE_DELAY) tracking = true;
    if (tracking) {
      const dist = pos.distanceTo(to);
      if (dist > 1e-9) dir.copy(homingSteer(dir, to.clone().sub(pos).normalize(), dist));
    }
    const dist = pos.distanceTo(to);
    const reachTarget = dist <= step;
    const end = reachTarget ? to.clone() : pos.clone().addScaledVector(dir, step);
    // 末段裁剪到目标：掩体只可能挡在 pos→end 之间，不会越过目标
    const coverHit = blocked?.(pos, end) ?? null;
    if (coverHit) {
      path.push(coverHit.point.clone());
      return { tick, point: coverHit.point.clone(), blocked: coverHit.name, path, timeout: false };
    }
    path.push(end.clone());
    if (reachTarget) return { tick, point: to.clone(), blocked: null, path, timeout: false };
    pos.copy(end);
    elapsed += HOMING_DT;
  }
  return { tick: maxTicks, point: pos.clone(), blocked: null, path, timeout: true };
}

/**
 * @param {object} p
 * @param {Array<{center:[number,number,number], size:[number,number,number], name:string}>} p.covers
 *        已转换到 glTF 坐标（x 取反后的 center）
 * @param {number} [p.speedUnit] spot_projectile_speed → 米/秒 的换算系数
 */
export function createHitResolver({ covers = [], speedUnit = 1.0 } = {}) {
  const boxes = covers.map((c) => {
    const center = new THREE.Vector3(...c.center);
    const size = new THREE.Vector3(...c.size);
    return {
      name: c.name ?? 'cover',
      box: new THREE.Box3(center.clone().sub(size.clone().multiplyScalar(0.5)),
        center.clone().add(size.clone().multiplyScalar(0.5))),
    };
  });

  const ray = new THREE.Ray(); // Ray.intersectBox（Raycaster 没有这个方法）

  /** 射线是否被某个掩体挡住（起点到终点之间有交点） */
  function blocked(from, to) {
    const dir = to.clone().sub(from);
    const dist = dir.length();
    if (dist < 1e-4) return null;
    dir.normalize();
    ray.set(from, dir);
    let nearest = null;
    let nearestDist = dist;
    for (const b of boxes) {
      // 发射点在某掩体AABB内（站位贴掩体，枪口在其中，见 geometry.muzzleWorld）不视为被挡；
      // 否则起点在盒内时 intersectBox 返回出口点，第1tick即哑火。目标掩体仍参与遮挡。
      if (b.box.containsPoint(from)) continue;
      const hit = ray.intersectBox(b.box, new THREE.Vector3());
      const distance = hit ? from.distanceTo(hit) : Infinity;
      // THREE.Ray 没有 far 裁剪；只接受线段内最近交点。
      if (distance <= nearestDist) {
        nearestDist = distance;
        nearest = { name: b.name, point: hit };
      }
    }
    return nearest;
  }

  /**
   * 一发的命中解析。
   * @returns {{frames:number, flightFrames:number, blocked:string|null, extras:string[], instances:number,
   *            point:THREE.Vector3, path:Array<[number,number,number]>|null, timeout:boolean}}
   *   frames: 到实际交点的命中结算延迟（30Hz tick），掩体与角色同规则；fireType4 = 逐tick命中 tick
   *   flightFrames: 与 frames 相同，供显示飞行与到达爆炸使用
   *   blocked: 挡弹掩体名（null = 直达目标）
   *   extras: 爆炸波及的其它目标 id（不含主目标）
   *   instances: 充能实例数（掩体命中 = 1；命中目标 = 1 + extras）
   *   path: fireType4 专有——每 tick 末位置（[x,y,z]，含起点，长度 = frames+1），显示与结算共用；
   *         其他 fireType 为 null（显示走 from→point 直线）
   *   timeout: fireType4 Duration 超时未命中任何东西
   */
  function resolve({ from, to, fireType, projectileSpeed, explosionRange, enemies }) {
    let blockedRes;
    let impact;
    let frames;
    let path = null;
    let timeout = false;
    if (fireType === 4 && (projectileSpeed ?? 0) * speedUnit > 0) {
      const sim = simulateHomingPath({ from, to, speed: (projectileSpeed ?? 0) * speedUnit, blocked });
      blockedRes = sim.blocked ? { name: sim.blocked } : null;
      impact = sim.point;
      frames = sim.tick;
      path = sim.path.map((p) => p.toArray());
      timeout = sim.timeout;
    } else {
      blockedRes = blocked(from, to);
      impact = blockedRes ? blockedRes.point.clone() : to.clone();
      const dist = from.distanceTo(impact);
      const speedMs = (projectileSpeed ?? 0) * speedUnit; // 米/秒
      const isProjectile = fireType === 2 || fireType === 3 || fireType === 5;
      frames = (isProjectile && speedMs > 0) ? Math.max(1, Math.round(dist / (speedMs / 30))) : 0;
    }
    const blockedName = blockedRes ? blockedRes.name : null;
    const flightFrames = frames;
    // 发射射线只作静态预瞄近似；伤害/充能与显示爆炸均等待同一到达时刻。
    let extras = [];
    if (!blockedName && explosionRange > 0) {
      // SpotExplosionRange：万分位米（500 = 5m），爆炸中心 = 目标站位
      const radius = explosionRange / 100;
      for (const [id, pos] of enemies) {
        if (pos.distanceTo(to) <= radius && pos.distanceTo(to) > 0.01) extras.push(id);
      }
    }
    return { frames, flightFrames, blocked: blockedName, extras, instances: 1 + extras.length, point: impact, path, timeout };
  }

  return { resolve, blocked };
}
