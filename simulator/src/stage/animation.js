const CLIP = {
  AIM_START: 'aim_start',
  FIRE: 'cover_shot',
  IDLE: 'aim_end',
  RELOAD_START: 'cover_reload',
  RELOAD_DONE: 'aim_start',
};

import * as THREE from 'three';

// 优先选择角色导出的射击挂点；仅在缺少射击挂点时使用武器根节点。
export function muzzleNodes(root) {
  const sockets = [], fallback = [];
  root.traverse((o) => {
    if (o === root) return;
    if (/^socket_rifle(?: \d+)?$/i.test(o.name || '')) sockets.push(o);
    else if (/^Dummy_Wp_root/i.test(o.name || '')) fallback.push(o);
  });
  sockets.sort((a, b) => (a.name === 'socket_rifle' ? -1 : b.name === 'socket_rifle' ? 1 : a.name.localeCompare(b.name, undefined, {numeric:true})));
  return sockets.length ? sockets : fallback.slice(0, 1);
}

export function muzzleWorldAtPose(ch, index = 0) {
  const nodes = ch.nativeMuzzles ?? muzzleNodes(ch.root);
  if (!nodes.length) return null;
  ch.root.updateWorldMatrix(true, true);
  return nodes[index % nodes.length].getWorldPosition(new THREE.Vector3());
}

/** Resolve serialized Transform paths using original glTF node names, not sanitized runtime names. */
export async function bindNativeMuzzles(glb, binding) {
  if (!binding?.muzzles?.length) throw new Error('Missing native muzzle binding');
  const nodes=glb.parser.json.nodes;
  const parents=new Map();
  nodes.forEach((n,i)=>(n.children??[]).forEach(c=>parents.set(c,i)));
  const path=i=>parents.has(i)?`${path(parents.get(i))}/${nodes[i].name}`:nodes[i].name;
  const paths=nodes.map((_,i)=>path(i));
  return Promise.all(binding.muzzles.map(p=>{
    const hits=paths.map((v,i)=>({v,i})).filter(({v})=>v===p || p.endsWith('/'+v) || v.endsWith('/'+p));
    if(hits.length!==1) throw new Error(`Native muzzle binding ambiguous/missing: ${p}`);
    return glb.parser.getDependency('node',hits[0].i);
  }));
}

// 导出模型的身体中心挂点，作为目标点近似；它尚未与原生 HitPoint 绑定完成。
export function sampleTargetLocal(ch) {
  const socket = ch.root.getObjectByName('socket_position_center01');
  if (!socket) return null;
  if (ch.actions.aim_idle) applyPose(ch, {clip:'aim_idle',t:0});
  ch.root.updateWorldMatrix(true, true);
  const point = ch.root.worldToLocal(socket.getWorldPosition(new THREE.Vector3()));
  ch.mixer.stopAllAction();
  return point.toArray();
}

/**
 * 采样发射点：把模型摆到 cover_shot 的 Shot 时刻姿势，取武器挂点的 root 局部位置。
 * 挂点名随 SD 小人 GLB 交付（socket_rifle / Dummy_Wp_root_Main，见场地 JSON forward_axis 契约，
 * 枪口轴由角色挂点决定、场地 JSON 不代答）；挂点是骨骼子节点，随动画联动。
 * 返回 root 局部偏移（与站位/朝向无关，可跨场地复用）；无挂点或无剪辑时返回 null（回退 aim_position）。
 */
export function sampleMuzzleLocal(ch) {
  const action = ch.actions[CLIP.FIRE];
  let socket = null;
  ch.root.traverse((o) => {
    if (!socket && o !== ch.root && (o.name === 'socket_rifle' || o.name?.startsWith('Dummy_Wp_root'))) socket = o;
  });
  if (!action || !socket) return null;
  const t = ch.clipEvents[CLIP.FIRE]
    ?? Math.max(0, action.getClip().duration * 0.35 - 1e-4); // 缺 Shot 事件时取开火段中后段近似
  ch.mixer.stopAllAction();
  action.reset();
  action.play();
  action.paused = true;
  action.time = t;
  ch.mixer.update(0);
  ch.root.updateMatrixWorld(true);
  const world = socket.getWorldPosition(new THREE.Vector3());
  ch.mixer.stopAllAction(); // 还原；下一 renderFrame 的 applyPose 会重新摆姿势
  return ch.root.worldToLocal(world).toArray();
}

export function applyPose(ch, pose) {
  const a = ch.actions[pose.clip];
  if (!a) return;
  ch.mixer.stopAllAction();
  a.reset();
  a.play();
  a.time = pose.t;
  a.paused = true;
  ch.mixer.update(0);
}

export function extractShotEvents(glb, code) {
  const out = {};
  // GLTFLoader 用 Promise.all 按 JSON 索引生成 AnimationClip，不复制动画 extras。
  for (const [i, clip] of glb.animations.entries()) {
    const events = glb.parser?.json.animations?.[i]?.extras?.events;
    if (!Array.isArray(events)) continue;
    const shot = events.find((e) => e.fn === 'Shot' && Number.isFinite(e.t) && e.t >= 0);
    if (shot) out[clip.name.replace(`${code}_`, '')] = shot.t;
  }
  return out;
}

export function timelineFor(events, code, durations, clipEvents = {}, facingTarget = null, stateSpeeds = {}) {
  const out = [];
  for (const e of events) {
    if (e.id !== code) continue;
    const clip = CLIP[e.type];
    if (!clip || !durations[clip]) continue;
    const lead = e.type === 'FIRE' ? Math.round((clipEvents[clip] ?? 0) * 60) : 0;
    const request = { frame: Math.max(0, e.tick * 2 - lead), clip, dur: durations[clip], type: e.type };
    if (stateSpeeds[clip] != null) request.speed = stateSpeeds[clip];
    // 朝向只在逻辑 FIRE 帧生效，不随 Shot 提前量提前；来源由舞台显式传入。
    if (e.type === 'FIRE' && facingTarget) {
      request.facing = { ...facingTarget, point: [...facingTarget.point], frame: e.tick * 2 };
    }
    out.push(request);
  }
  // 保留逻辑事件顺序；后发事件即使提前开播，也优先于此前的动画请求。
  return out;
}

export function facingAt(ch, frame) {
  for (let i = ch.timeline.length - 1; i >= 0; i--) {
    const facing = ch.timeline[i].facing;
    if (facing && facing.frame <= frame) return facing;
  }
  return null;
}

export function poseAt(ch, frame) {
  let e = null;
  for (let i = ch.timeline.length - 1; i >= 0; i--) {
    if (ch.timeline[i].frame <= frame) { e = ch.timeline[i]; break; }
  }
  if (!e) {
    const d = ch.durs.aim_idle || 1;
    return { clip: 'aim_idle', t: (frame / 60) % d, type: '—', since: 0 };
  }
  const speed = e.speed ?? 1;
  let t = (frame - e.frame) / 60 * speed;
  // 仅做剪辑级自然衔接；未还原 Animator 的状态速度、exitTime 或 transition 混合。
  if (['aim_start', 'cover_shot'].includes(e.clip) && t >= e.dur && ch.durs.aim_idle > 0) {
    const idleTime = (frame - e.frame - e.dur / speed * 60) / 60;
    return { clip: 'aim_idle', t: idleTime % ch.durs.aim_idle, type: e.type, since: e.frame };
  }
  if (e.clip === 'aim_idle') t %= e.dur;
  else t = Math.min(t, Math.max(0, e.dur - 0.0001));
  return { clip: e.clip, t, type: e.type, since: e.frame };
}
