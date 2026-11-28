/** Native arena shooting subset. Addresses and resource extraction: README.md.
 * All vectors here are glTF world space. Rendering consumes the recorded paths.
 */
// 数学用 `core/math3.js`，不引 three：这条链（driver → shooting → charge-calculator）
// 要整包打进小程序分包，而 `import ... from 'three'` 会把整包 three.module.js 拖进
// 产物（实测 244KB / 358KB），tree-shaking 掉不掉。math3 只实现这里用到的算子，
// 且与 three 逐算子对拍到 1e-12（tests/math3.test.js），所以换掉不改变任何数值。
// 浏览器侧不受影响：调用方传进来的 three Vector3 也能用（鸭子类型，只用到
// clone/sub/toArray 等方法），stage.js 与 arena-calculator.js 无需改动。
import { Vector3, Quaternion, Matrix4 } from '../core/math3.js';
const T = { Vector3, Quaternion, Matrix4 };
import { characterPlacement, toGltf, toGltfRotation, assignCovers } from './geometry.js';
import { EVENT_DT_30, f32 } from '../core/time.js';
import {skillAimChoices} from '../core/targeting.js';

const V = a => new T.Vector3(...a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// `ShotLogic.GetInstantBoxHalfExtents` (FireType 21) turns the shot table's
// BoxWidth/BoxHeight into half extents with `value * .01f * .5f` and writes a
// constant 90 into the depth slot, so the overlap box is a long flat slab.
const SHOT_TABLE_SCALE = 0.005;
const INSTANT_BOX_DEPTH = 90;
// `ShotLogic.GetTargetPenetration` (0x5DE94A0) is a sphere sweep down the whole
// aim ray (`GetRays`, not the animated muzzle):
// `PhysicsUtil.FireSphereCastAllNonAlloc(origin, dir, 180f, radius, ...)` keeps
// every valid hit (max distance constant at RVA 0x7E651B4 = 180). The radius is
// is `SpotWeaponData.CurrentPenetration`, i.e. the FT54 stat, so it is only > 0
// while the penetration state is live — that is the same condition the driver
// writes into `cfg.penetration`. There is no "target + its cover" pairing in the
// client: a cover is one more collider on the ray, hit only when the ray reaches it.
const PENETRATION_MAX_DISTANCE = 180;
// 爆炸覆盖不设接触容差。之前这里加过 1cm 容差，依据是「接触点到同角色掩体盒 0.502，
// 差 2mm 卡在 0.5 外」，但那个 0.502 是用审计脚本的盒快照算的——快照取的是射击前的
// hide 姿态（`createArenaShooting` 只跑了一次 `updateBoxes`），而模拟里防守方在 aim
// 姿态，本体盒比快照高 1.1m。按模拟真实几何复算，接触点到掩体只剩垂直差 0.4917，
// 本来就在 0.5 内，容差归零后红莲:暗影仍是每发本体+掩体。容差是错误几何催生的
// 补丁，已删除；边界判定只用原生半径。
// FT54 values are percentages (471 = 100), and the stat is applied in world units.
const PENETRATION_VALUE_SCALE = 0.01;
const DEFAULT_PENETRATION_VALUE = 100;
// `GetRays` (0x5DE8D90) puts CurrentAccuracyCircle × .5 (const 0x7E64F20) into the
// rays builder; `GetRay` (0x5DE8B20) → 0x5DDF130 then offsets the aim point by
// radius × .001 (const 0x7E652A4) × a random unit-disk sample (0x5F409E0, two
// uniforms + sqrt(1−u²)). Per-shot lateral jitter is therefore
// accuracy_circle_scale × .0005 world units, and `UpdateAccuracy` (0x5E08290)
// walks the scale from start toward end by change_pershot / change_speed.
const ACCURACY_BUILDER_SCALE = 0.5;
const ACCURACY_POINT_SCALE = 0.001;

// Deterministic per-actor RNG for the accuracy disk; seeded from the cfg id so a
// lineup replays identically without touching cfg.rand (target selection keeps
// its own stream).
function mulberry32(seed) {
  let a=seed>>>0||0x9E3779B9;
  return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
}
// UpdateAccuracy walks start→end; pershot steps once per fired shot, clamped at
// the end value in whichever direction the row defines. speed (per second) is not
// modelled yet — rows that only grow by speed are tracked as a known gap.
export function accuracyJitterScale(acc,shotsFired) {
  if(!acc)return 0;
  const start=f32(acc.start??0),end=f32(acc.end??acc.start??0);
  const scale=f32(start+f32((acc.pershot??0)*shotsFired));
  return end>=start?Math.min(scale,end):Math.max(scale,end);
}
/** NKColliders.UpdateTick advances local offset by (Aim-Hide) / SPEED * dt. */
export function stepColliderOffset(position, aim, hide, stance, dt, motion) {
  const target = stance === 2 ? aim : hide;
  const distance = position.map((value, axis) => f32(value - target[axis]));
  const squared = f32(f32(f32(distance[0] * distance[0]) + f32(distance[1] * distance[1])) + f32(distance[2] * distance[2]));
  if (squared < motion.positionEpsilonSquared) return [...position];
  return position.map((value, axis) => {
    const direction = stance === 2 ? f32(aim[axis] - hide[axis]) : f32(hide[axis] - aim[axis]);
    const next = f32(value + f32(f32(direction / motion.durationSeconds) * dt));
    return motion.clampedAxes.includes(axis) ? Math.max(hide[axis], Math.min(aim[axis], next)) : next;
  });
}

/** Exact sphere/OBB sweep: distance to a box is quadratic between slab crossings.
 * Unlike expanding all three slabs, this does not introduce square corner hits.
 */
export function sweepBox(from, to, box, radius = 0) {
  const p = from.clone().sub(box.center).applyQuaternion(box.rotation.clone().invert());
  const d = to.clone().sub(from).applyQuaternion(box.rotation.clone().invert());
  const cuts = [0, 1];
  for (let i = 0; i < 3; i++) if (Math.abs(d.getComponent(i)) > 1e-12) {
    for (const sign of [-1, 1]) {
      const t = (sign * box.half.getComponent(i) - p.getComponent(i)) / d.getComponent(i);
      if (t > 0 && t < 1) cuts.push(t);
    }
  }
  cuts.sort((a,b) => a-b);
  for (let k = 0; k < cuts.length - 1; k++) {
    const lo = cuts[k], hi = cuts[k+1], mid = (lo+hi)/2;
    let a = 0, b = 0, c = -radius*radius;
    for (let i=0; i<3; i++) {
      const x=p.getComponent(i), v=d.getComponent(i), h=box.half.getComponent(i);
      const m=x+v*mid;
      if (Math.abs(m)<=h) continue;
      const q=x-Math.sign(m)*h;
      a+=v*v; b+=2*q*v; c+=q*q;
    }
    if (a*lo*lo+b*lo+c <= 1e-12) return lo;
    if (a > 1e-20) {
      const disc=b*b-4*a*c;
      if (disc < 0) continue;
      const t=(-b-Math.sqrt(disc))/(2*a);
      if (t >= lo-1e-10 && t <= hi+1e-10) return clamp(t,lo,hi);
    }
  }
  return null;
}

export function boxDistance(point, box) {
  const p=point.clone().sub(box.center).applyQuaternion(box.rotation.clone().invert());
  return Math.hypot(...[0,1,2].map(i=>Math.max(0,Math.abs(p.getComponent(i))-box.half.getComponent(i))));
}

/** 球扫相切时的接触点。`sweepBox` 给出的 t 让球心到盒表面正好一个命中球半径，
 * 所以球心到盒的最近点就是原生 `SphereCastHit.point`（接触点）。
 * 爆炸判定用的是这个点，不是球心。
 */
export function contactOnBox(point, box) {
  const local=point.clone().sub(box.center).applyQuaternion(box.rotation.clone().invert());
  const x=Math.max(-box.half.x,Math.min(box.half.x,local.x));
  const y=Math.max(-box.half.y,Math.min(box.half.y,local.y));
  const z=Math.max(-box.half.z,Math.min(box.half.z,local.z));
  return new T.Vector3(x,y,z).applyQuaternion(box.rotation).add(box.center);
}

/** ProjectileHomingMovement.UpdateTick 0x3F4A140; angle is degrees, delta is NOT normalized for lerp. */
export function stepHoming(s, target, dt=EVENT_DT_30) {
  s.phaseTime=f32(s.phaseTime+dt);
  // Native state 2 is terminal, even if the target later crosses back.
  if (!s.trackingStopped && !s.tracking) {
    if (s.phaseTime>(s.script.FreeFlyTime??0)*.01) {s.tracking=true;s.phaseTime=0;}
  } else if (!s.trackingStopped && s.phaseTime>s.script.TrackingDelay*.01) {
    s.target.copy(target);s.phaseTime=0;
    const delta=s.target.clone().sub(s.pos);
    if (delta.z*s.initialZ<0 && !s.script.IsRetarget) {
      s.trackingStopped=true;
    } else if (delta.lengthSq()>1e-20) {
      const angle=s.dir.angleTo(delta)*180/Math.PI;
      if (angle>1e-8) s.dir.lerp(delta,clamp((dt/0.0166666675359)*s.script.MaxRotation/angle,0,1)).normalize();
    }
  }
  return s.pos.clone().addScaledVector(s.dir,s.speed*dt);
}

function curvePoint(s, dt) {
  const curve=s.curve;
  if (!curve?.segments?.length) throw new Error('Missing native Bezier path');
  const keys=curve.speedCurve;
  if (!keys.every(k=>k.value===keys[0].value)) throw new Error('Unsupported varying native curve speed');
  const n=curve.segments.length;
  const inc=Math.min(1,dt*s.speed/s.distance*keys[0].value*n);
  s.progress=f32(s.progress+inc/n);
  s.segmentTime=f32(s.segmentTime+inc);
  const seg=curve.segments[Math.min(s.segment,n-1)];
  const t=clamp(s.segmentTime,0,1), u=1-t;
  const p=new T.Vector3();
  for (let i=0;i<4;i++) p.addScaledVector(V(toGltf(seg[i])),[u*u*u,3*u*u*t,3*u*t*t,t*t*t][i]);
  const out=p.multiplyScalar(s.distance).applyQuaternion(s.curveRotation).add(s.from);
  if (s.segmentTime>=1) {s.segmentTime=f32(s.segmentTime-1);s.segment++;}
  return out;
}

export function createArenaShooting({arena, characters, native, muzzleAt, heightOffset=()=>0}) {
  const motion = native.colliderMotion;
  if (motion && (motion.mode !== 'offset-linear' || !(motion.durationSeconds > 0) ||
      !Array.isArray(motion.spotConstant) || !Array.isArray(motion.clampedAxes)))
    throw new Error('Unsupported native collider motion profile');
  const placements=assignCovers(arena.covers,characters);
  const states=new Map();
  for (const cfg of characters) {
    const pl=placements.get(cfg.id);
    if (!pl) throw new Error(`No arena slot: ${cfg.id}`);
    const matrix=new T.Matrix4().set(...characterPlacement(pl).matrix.flat());
    const off=heightOffset(pl);matrix.elements[13]+=off;
    const pos=new T.Vector3(),rot=new T.Quaternion(),scale=new T.Vector3();matrix.decompose(pos,rot,scale);
    const boxes={};
    for (const kind of ['character','cover']) {
      const def=native.colliders[kind];
      boxes[kind]={id:cfg.id,key:`${cfg.id}:${kind}`,kind,team:cfg.team,
        center:new T.Vector3(),rotation:rot.clone().multiply(new T.Quaternion(...toGltfRotation(def.rotation))),
        half:V(def.size).multiply(V(def.scale)).multiply(scale).multiplyScalar(.5)};
    }
    states.set(cfg.id,{cfg,pl,matrix,pos,boxes,height:off,stance:2,curveIndex:0,
      characterOffset:[...(motion?.resetToHideOnInit ? native.colliders.hidePosition : native.colliders.character.position)]});
  }
  const active=[],shots=[],stanceEvents=[];
  function updateBoxes(selected=states.values(),dt=0) {
    for (const s of selected) {
      if (motion && dt > 0) s.characterOffset = stepColliderOffset(s.characterOffset,
        native.colliders.aimPosition, native.colliders.hidePosition, s.stance, dt, motion);
      for (const kind of ['character','cover']) {
        const def=native.colliders[kind];
        const offset=kind==='character' ? (motion ? s.characterOffset : native.colliders[s.stance===2?'aimPosition':'hidePosition']) : def.position;
        const p=motion ? offset.map((value,axis)=>f32(value+motion.spotConstant[axis])) : offset;
        if(kind==='character')s.characterOrigin=V(toGltf(p)).applyMatrix4(s.matrix);
        const local=V(toGltf(def.center)).multiply(V(def.scale)).applyQuaternion(new T.Quaternion(...toGltfRotation(def.rotation))).add(V(toGltf(p)));
        s.boxes[kind].center.copy(local.applyMatrix4(s.matrix));
      }
    }
  }
  updateBoxes();
  function sampleRunners(tick,rs) {
    const selected=[];
    for (const r of rs) {
      const s=states.get(r.cfg.id);
      s.alive=r.alive!==false;
      const stance=r.reloadLeft>0?3:r.aiming?2:0;
      if(s.stance!==stance)stanceEvents.push({tick,id:r.cfg.id,team:r.cfg.team,
        pose:stance===2?'aim':'hide',cause:r.reloadLeft>0?'reload':'stance'});
      s.stance=stance;
      selected.push(s);
    }
    updateBoxes(selected,motion ? EVENT_DT_30 : 0);
    for (const r of rs) {
      const own=states.get(r.cfg.id);
      r.cfg.enemies=[...states.values()].filter(s=>s.cfg.team!==r.cfg.team).map(s=>({...s.cfg.rankingStats,id:s.cfg.id,alive:s.alive!==false,inZone:true,
        distance:own.pos.distanceTo(s.pos),x:s.pos.x,slotIndex:s.pl.slot}));
    }
  }
  // An actor whose native fire type or projectile script is not modelled cannot
  // fire at all. Reporting that while firing would abort the whole lineup for one
  // character, so it is detected once here, exposed through `unsupported`, and the
  // actor simply produces no shots. Callers turn each entry into a named gap.
  const unsupported=[],unusable=new Set();
  for(const cfg of characters){
    const type=cfg.fireType;
    if(Number.isInteger(type)&&![1,2,3,4,19,21].includes(type)){
      unsupported.push({id:cfg.id,fireType:type,reason:'native-fire-type-not-connected'});
      unusable.add(cfg.id);continue;
    }
    if(type!==2&&type!==4)continue; // Instant/Direct and legacy fixtures need no script
    const profile=native.weapons[String(cfg.resourceId ?? Number(cfg.id.slice(1)))];
    if(!profile)continue; // fire() still reports the missing weapon profile
    const key=(profile.homingScript??'').toLowerCase();
    if(!native.scripts[`${type===2?'curve':'homing'}_${key}`]){
      unsupported.push({id:cfg.id,fireType:type,reason:'native-projectile-script-not-connected'});
      unusable.add(cfg.id);
    }
  }
  const enemyBoxes=team=>[...states.values()].filter(s=>s.cfg.team!==team&&s.alive!==false).flatMap(s=>Object.values(s.boxes));
  function skillAimContext({cfg,candidates}){
    return {aimRay:states.get(cfg.id)?.aimRay,
      candidates:candidates.map(c=>({...c,aimPosition:states.get(c.id)?.characterOrigin.toArray()}))};
  }
  function cast(from,to,team,radius=0,objectRadius=radius) {
    let best=null;
    const swept=[];
    for (const box of enemyBoxes(team)) {
      const t=sweepBox(from,to,box,box.kind==='character'?radius:objectRadius);
      if (t===null) continue;
      swept.push(box.key);
      if (!best || t<best.t) best={box,t,point:from.clone().lerp(to,t)};
    }
    return best ? {...best,swept} : null;
  }
  // `ShotLogic.FireInstantBox` (FireType 21) runs PhysicsUtil.FireOverlapBoxNonAlloc
  // around the first valid hit and damages every collider inside, all on the fire
  // tick — there is no projectile and no travel time. Half extents come from the
  // shot table (BoxWidth/BoxHeight scaled by .01*.5); the depth half extent is the
  // constant 90 the native getter writes.
  function instantBoxHits(team,contact,dir,profile) {
    const half=new T.Vector3(f32((profile.boxWidth??0)*SHOT_TABLE_SCALE),
      f32((profile.boxHeight??0)*SHOT_TABLE_SCALE),INSTANT_BOX_DEPTH);
    if (!(half.x>0) || !(half.y>0)) return null; // no box data: keep the single contact
    const center=contact.box.center.clone();
    const inverse=new T.Quaternion().setFromRotationMatrix(
      new T.Matrix4().lookAt(center.clone().sub(dir),center,new T.Vector3(0,1,0))).invert();
    const hits=[];
    for (const b of enemyBoxes(team)) {
      // Enemy boxes are near-cubic, so an axis-aligned comparison in the shot box's
      // frame only ignores their own rotation.
      const p=b.center.clone().sub(center).applyQuaternion(inverse);
      if (Math.abs(p.x)<=half.x+b.half.x && Math.abs(p.y)<=half.y+b.half.y && Math.abs(p.z)<=half.z+b.half.z)
        hits.push(b);
    }
    return hits;
  }
  // `ShotLogic.GetTargetPenetration`: one sphere sweep along the fire ray; every
  // enemy box it reaches becomes its own hit instance, in distance order.
  function penetrationHits(team,from,dir,cfg) {
    const value=Number.isFinite(cfg.penetrationValue)?cfg.penetrationValue:DEFAULT_PENETRATION_VALUE;
    const radius=f32(value*PENETRATION_VALUE_SCALE);
    const to=from.clone().addScaledVector(dir,PENETRATION_MAX_DISTANCE);
    const found=[];
    for (const box of enemyBoxes(team)) {
      const t=sweepBox(from,to,box,radius);
      if (t!==null) found.push({box,t});
    }
    found.sort((a,b)=>a.t-b.t);
    return found.map(hit=>hit.box);
  }
  function complete(s,tick,contact,reason,boxHits,penHits) {
    const hits=new Map();
    // 爆炸中心取**接触点**，不是球心。原生 ShotLogic 在命中点跑
    // `Physics.OverlapSphere(hit.point, SpotExplosionRange*0.01)`（0x5DEA240：
    // radius 由 0x5D12480 取表值后乘 0x7E64F10=0.01f，center 是球扫结果里那个
    // 24 字节 Vector3，布局同 RaycastHit.point）。V2 的 s.pos 是球与盒相切时的
    // 球心，比接触点远一个命中球半径（0.5m），对 0.5m 半径的 RL 来说这 0.5m
    // 正好决定掩体算不算进来。
    const center=contact?contactOnBox(s.pos,contact.box):s.pos;
    const range=reason==='range'?0:(s.cfg.explosionRange??0)*.01;
    // A native overlap-shaped shot (`FireType` 21) decides its own instance set at
    // fire time, so it bypasses the contact/penetration/splash derivation below.
    if (boxHits) for (const b of boxHits) hits.set(b.key,b);
    else {
      if (contact) hits.set(contact.box.key,contact.box);
      // 穿透（FT54 StatPenetration）：弹道球扫到的每个合法盒各算一次命中，掩体只
      // 是其中一个盒——扫不到就没有第二个实例，不再强行配对。
      if (penHits) for (const b of penHits) hits.set(b.key,b);
      if (range>0) for (const b of enemyBoxes(s.cfg.team)) if (boxDistance(center,b)<=range) hits.set(b.key,b);
    }
    Object.assign(s.record,{endTick:tick,reason,timeout:reason==='duration',
      exploded:!boxHits&&range>0,contacts:[...hits.values()].map(b=>({id:b.id,kind:b.kind})),
      to:center.toArray(),instances:hits.size});
    // 逐盒覆盖明细：把本发**实际用到**的盒（中心 + 半尺寸）和每个盒到爆心的 OBB 距离
    // 一起写进射击记录。任何审计/复核都必须读这个字段，不要另建 probe 去读
    // `states.boxes`——那只是 `createArenaShooting` 初始化时的一帧（stance 设成 2
    // 而 characterOffset 还是 hidePosition），与射击时刻的盒位相差 1.1m，正是
    // 「0.502 卡边界」那次误判的来源。
    if (range>0 && !boxHits) {
      s.record.range=+range.toFixed(4);
      s.record.swept=(s.swept||[]).slice();
      s.record.coverage=enemyBoxes(s.cfg.team).map(b=>{
        const d=boxDistance(center,b);
        return {k:b.key,id:b.id,type:b.kind,c:b.center.toArray().map(v=>+v.toFixed(4)),
          h:[b.half.x,b.half.y,b.half.z].map(v=>+v.toFixed(4)),d:+d.toFixed(4),hit:d<=range};
      });
    }
    // `to` 是爆炸/命中结算的落点（接触点）：爆炸范围按它到各盒的距离判定，排查
    // 「为什么这一发只覆盖 N 个盒」时这是唯一能对上的坐标。
    return {id:s.cfg.id,team:s.cfg.team,instances:hits.size,contacts:s.record.contacts,to:s.record.to,exploded:s.record.exploded,shotId:s.record.shotId,muzzleIndex:s.record.muzzleIndex,reason,lastAmmo:s.record.lastAmmo,fullChargeRate:s.record.fullChargeRate,inputTypeAtFire:s.record.inputTypeAtFire};
  }
  return {
    stanceEvents,
    colliderMotion:motion,
    ...(motion ? { beforeTeamTick:sampleRunners, afterTeamTick:sampleRunners } : {}),
    shots,states,placements,supportsParts:false,unsupported,
    getSkillAimContext:skillAimContext,
    resolveSkillTargets({cfg,binding,candidates,probabilityMode}){
      if(![13,21].includes(binding.skillType))return {supported:false,reason:'skill-spatial-shape-not-connected'};
      const own=states.get(cfg.id);
      const pool=candidates.filter(c=>states.has(c.id)).map(c=>({...c,
        distance:own.pos.distanceTo(states.get(c.id).pos),x:states.get(c.id).pos.x,
        aimPosition:states.get(c.id).characterOrigin.toArray()}));
      const aims=skillAimChoices(pool,binding.entity.preferTarget,{probabilityMode,random:cfg.rand,
        aimRay:states.get(cfg.id)?.aimRay,missingRankingPolicy:cfg.skillMissingRankingPolicy,currentTargetId:cfg.skillCurrentTargetId});
      if(!aims.supported)return aims;
      if(!aims.choices.length)return {supported:true,contacts:[],effectContacts:[]};
      if(binding.skillType===21&&aims.choices.length>1)return {supported:false,reason:'skill-spatial-correlated-aim-expectation-not-connected'};
      // Native GetTargets: value * .5f * .01f; FireSphereCast is
      // Physics.OverlapSphere, centered on SpotCharacter.GetPosition().
      const radius=f32(f32(binding.entity.values[2].skill_value*f32(.5))*f32(.01));
      const weights=new Map(),eligible=new Set(pool.map(c=>c.id));
      for(const aim of aims.choices){
        const center=states.get(aim.target.id).characterOrigin;
        for(const box of enemyBoxes(cfg.team))if(eligible.has(box.id)&&boxDistance(center,box)<=radius)
          weights.set(box.key,{id:box.id,kind:box.kind,probability:(weights.get(box.key)?.probability??0)+aim.probability});
      }
      const contacts=[...weights.values()];
      const selection=aims.usedRankingFallback?{usedRankingFallback:true,rankingField:aims.rankingField,aimTargetId:aims.choices[0].target.id}:{};
      if(binding.skillType===21){
        const primary=contacts.find(c=>c.id===aims.choices[0]?.target.id&&c.kind==='character');
        if(!primary)return {supported:false,reason:'skill-spatial-primary-contact-not-connected'};
        return {supported:true,contacts:[primary],effectContacts:contacts,...selection};
      }
      return {supported:true,contacts,...selection};
    },
    beforeTick(tick,rs) {
      sampleRunners(tick,rs);
    },
    fire({tick,cfg,targetId,lastAmmo=false,fullChargeRate}) {
      const own=states.get(cfg.id),target=states.get(targetId);
      if(unusable.has(cfg.id))return [];
      if (!target) throw new Error(`Invalid selected target: ${targetId}`);
      const profile=native.weapons[String(cfg.resourceId ?? Number(cfg.id.slice(1)))];
      if (!profile) throw new Error(`Missing native weapon: ${cfg.id}`);
      // FireType 1 Instant, 19 MechaShiftyShot and 21 InstantBox are all hitscan:
      // the client resolves and applies damage inside the fire call, so none of them
      // creates a projectile. Only the projectile types carry a real travel time.
      // FireType 21 resolves through FireInstantBox, which never calls
      // GetTargetPenetration, so a penetration stat cannot widen its instance set.
      if (cfg.penetration>0 && ![1,19,21].includes(cfg.fireType)) throw new Error('Penetration only modeled for instant fireType=1/19/21');
      const aimOrigin=V(toGltf(own.pl.aim_position));aimOrigin.y+=own.height;
      const aimDir=target.boxes.character.center.clone().sub(aimOrigin).normalize();
      own.aimRay={origin:aimOrigin.toArray(),direction:aimDir.toArray()};
      const rayEnd=aimOrigin.clone().addScaledVector(aimDir,200);
      const pre=cast(aimOrigin,rayEnd,cfg.team);
      const point=pre?.point??rayEnd;
      // CN RegisterCollider appends the first collider at index 0, while
      // GetColliderByIndex rejects <= 0 (0x41097E6..81F). A missing Transform
      // keeps the launch hit point fixed through the native local offset.
      const binding=native.projectileTargetBinding;
      const colliderIndex=pre?binding?.colliderIndices[pre.box.kind]:null;
      const targetBound=!!pre && (!binding || colliderIndex>=binding.minimumColliderIndex);
      const result=[];
      // Accuracy-circle state lives on the actor state: the native UpdateAccuracy
      // walks the scale per fired shot, and each shot samples its own disk.
      const accProfile=cfg.inputType===2
        ? {start:profile.autoAccuracyStart,end:profile.autoAccuracyEnd,pershot:profile.autoAccuracyChangePershot}
        : {start:profile.accuracyStart,end:profile.accuracyEnd,pershot:profile.accuracyChangePershot};
      if ((accProfile.start??0)>0 && !own.accRng) own.accRng=mulberry32(
        [...cfg.id].reduce((h,ch)=>Math.imul(h,31)+ch.charCodeAt(0)|0,7));
      for (let i=0;i<(cfg.shotCount||1)*(cfg.muzzleCount||1);i++) {
        const from=muzzleAt(cfg.id,tick,point,i);
        if (!from) throw new Error(`Missing serialized muzzle: ${cfg.id}`);
        const record={shotId:shots.length,muzzleIndex:Math.floor(i/(cfg.shotCount||1)),id:cfg.id,fireTick:tick,fireType:cfg.fireType,inputTypeAtFire:cfg.inputType,lastAmmo,fullChargeRate,from:from.toArray(),aimPoint:point.toArray(),target:targetId,path:[from.toArray()]};
        if(cfg.fireType===2 || cfg.fireType===4){
          record.trackingTargetBound=targetBound;
          record.targetColliderIndex=colliderIndex??null;
        }
        shots.push(record);
        own.firedShots=(own.firedShots??0)+1;
        const accScale=accuracyJitterScale(accProfile,own.firedShots-1);
        if (cfg.fireType===1 || cfg.fireType===19) {
          const s={cfg,pos:(pre?.point??rayEnd).clone(),record,swept:pre?.swept??[]};
          // 穿透是整条瞄准射线的属性：`GetRays` 用的是角色 Aim 位置发出的射线
          // （不是动画枪口），所以球扫也从 aimOrigin 起，而不是从这根枪口起。
          // 每发在瞄准点上加 accuracy 圆盘抖动后重算球扫方向。
          let pen=null;
          if (cfg.penetration>0) {
            // 判定盒不跟骨骼：NKColliders.UpdateTick 只按 CurrentStance 在两个静态点之间
            // 匀速推进（全程 SPEED=0.2s，带 MinX/MaxX/MinY/MaxY clamp）。它相对角色的
            // 位移量级（CN：aim y=1.0 / hide y=-0.1）比 accuracy 抖动（5mm）大两个数量级，
            // 所以逐发命中表要能和 stance 相位对账，而不是只看抖动。
            const tgt=states.get(targetId);
            if (tgt) {
              const box=tgt.boxes.character;
              record.targetStance=tgt.stance;
              record.targetBoxY=[f32(box.center.y-box.half.y),f32(box.center.y+box.half.y)];
              record.targetBoxCenter=box.center.toArray();
            }
            let penDir=aimDir;
            if (accScale>0) {
              const radius=f32(f32(accScale*ACCURACY_BUILDER_SCALE)*ACCURACY_POINT_SCALE);
              // InsideUnitCircle (0x5F409E0) 的实际分布：x ~ U[-1,1]，y 在该 x 的弦上均匀。
              //   x = Range(-1, 1)                    // 0x5F40A21..0x5F40A65
              //   y = Range(-√(1-x²), √(1-x²))        // 0x5F40A6A..0x5F40A7E
              // 它是"按 x 均匀切片"，密度 ∝ 1/√(1-x²)，**不是**面积均匀的圆盘（也**不是**
              // Unity Random.insideUnitCircle 的面积均匀）。早先的 r=√(1-u²)+均匀角
              // 把点压向圆周：平均半径 3.93mm vs 真实 3.54mm（按 R=5mm）。
              const u1=own.accRng(),u2=own.accRng();
              const jx=f32(u1*2-1);
              const jb=f32(Math.sqrt(Math.max(0,1-jx*jx)));
              const jy=f32(u2*2*jb-jb);
              // math3 的 Vector3 没有叉积，垂直基手工算（统一用数组下标）：ref 取与 aimDir 夹角最大的轴。
              const d=aimDir,ref=Math.abs(d.y)<0.9?[0,1,0]:[1,0,0];
              const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
              const len=v=>Math.hypot(v[0],v[1],v[2]);
              const dv=[d.x,d.y,d.z];
              const rc=cross(dv,ref),rl=len(rc);
              const right=new T.Vector3(rc[0]/rl,rc[1]/rl,rc[2]/rl);
              const rv=[right.x,right.y,right.z];
              const uc=cross(dv,rv),ul=len(uc);
              const up=new T.Vector3(uc[0]/ul,uc[1]/ul,uc[2]/ul);
              const jittered=point.clone()
                .addScaledVector(right,f32(jx*radius))
                .addScaledVector(up,f32(jy*radius));
              penDir=jittered.sub(aimOrigin).normalize();
              record.accuracyJitter=radius;
              record.accuracyOffset=[f32(jx*radius),f32(jy*radius)];
            }
            pen=penetrationHits(cfg.team,aimOrigin,penDir,cfg);
          }
          record.accuracyScale=accScale;
          result.push(complete(s,tick,pre,pre?'contact':'ray-miss',null,pen));
          continue;
        }
        if (cfg.fireType===21) {
          const s={cfg,pos:(pre?.point??rayEnd).clone(),record};
          result.push(complete(s,tick,pre,pre?'contact':'ray-miss',
            pre?instantBoxHits(cfg.team,pre,aimDir,profile):null));
          continue;
        }
        const scriptKey=profile.homingScript.toLowerCase();
        const script=native.scripts[`${cfg.fireType===2?'curve':'homing'}_${scriptKey}`];
        if(cfg.fireType!==3 && !script) throw new Error(`Missing native projectile script: ${cfg.id}/${scriptKey}`);
        const forward=point.clone().sub(own.pos).normalize();
        const s={cfg,profile,record,from:from.clone(),pos:from.clone(),dir:cfg.fireType===4?forward:point.clone().sub(from).normalize(),
          target:point.clone(),targetId:pre?.box.id??targetId,targetKind:targetBound?pre.box.kind:null,
          offset:pre?pre.box.center.clone().sub(point):new T.Vector3(),
          initialZ:forward.z,script,phaseTime:0,tracking:false,elapsed:0,speed:cfg.projectileSpeed,
          duration:cfg.fireType===3?Infinity:script.DurationTime*.01};
        if (cfg.fireType===2) {
          s.curve=script.curves[own.curveIndex++%script.curves.length];
          s.speed*=.01;s.distance=from.distanceTo(point);s.progress=0;s.segment=0;s.segmentTime=0;
          // Object LookRotation points +Z at target; Matrix4.lookAt is camera -Z.
          s.curveRotation=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(point,from,new T.Vector3(0,1,0)));
        } else if (cfg.fireType!==3 && cfg.fireType!==4) throw new Error(`Unsupported native FireType ${cfg.fireType}`);
        active.push(s);
      }
      return result;
    },
    advance(tick) {
      const result=[];
      for (let i=active.length-1;i>=0;i--) {
        const s=active[i];
        if (s.record.fireTick===tick) continue;
        const target=s.targetKind?states.get(s.targetId).boxes[s.targetKind].center.clone().sub(s.offset):s.target.clone();
        let end;
        if (s.cfg.fireType===2 && s.progress<s.script.ChangeFlyTypePercent*.01) {
          end=curvePoint(s,EVENT_DT_30);s.dir.copy(end).sub(s.pos).normalize();
          if(s.progress>=s.script.ChangeFlyTypePercent*.01) {s.speed=s.script.HomingSpeed;s.initialZ=s.dir.z;s.tracking=false;s.phaseTime=0;}
        } else if(s.cfg.fireType===4 || s.cfg.fireType===2) end=stepHoming(s,target);
        else end=s.pos.clone().addScaledVector(s.dir,s.speed*EVENT_DT_30);
        s.elapsed=f32(s.elapsed+EVENT_DT_30);
        // SpotProjectile.UpdateTick calls Arrival.UpdateTick (CheckHit) after
        // movement, before CheckDuration and CheckRange (0x5B407AD..7E3).
        const expired=s.elapsed>=s.duration;
        const homing=s.cfg.fireType===4 || (s.cfg.fireType===2 && s.progress>=s.script.ChangeFlyTypePercent*.01);
        const outOfRange=!homing && (end.z < -10 || end.z > 300);
        const hit=cast(s.pos,end,s.cfg.team,s.profile.radius*.01,s.profile.radiusObject*.01);
        if (hit) s.swept=hit.swept;
        s.pos.copy(hit?.point??end);s.record.path.push(s.pos.toArray());
        if(hit || expired || outOfRange) {
          result.push(complete(s,tick,hit,hit?'contact':expired?'duration':'range'));
          active.splice(i,1);
        }
      }
      return result;
    },
  };
}
