/** Native arena shooting subset. Addresses and resource extraction: README.md.
 * All vectors here are glTF world space. Rendering consumes the recorded paths.
 */
import * as T from 'three';
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
    states.set(cfg.id,{cfg,pl,matrix,pos,boxes,height:off,stance:2,curveIndex:0});
  }
  const active=[],shots=[],stanceEvents=[];
  function updateBoxes() {
    for (const s of states.values()) {
      for (const kind of ['character','cover']) {
        const def=native.colliders[kind];
        const p=kind==='character' ? native.colliders[s.stance===2?'aimPosition':'hidePosition'] : def.position;
        if(kind==='character')s.characterOrigin=V(toGltf(p)).applyMatrix4(s.matrix);
        const local=V(toGltf(def.center)).multiply(V(def.scale)).applyQuaternion(new T.Quaternion(...toGltfRotation(def.rotation))).add(V(toGltf(p)));
        s.boxes[kind].center.copy(local.applyMatrix4(s.matrix));
      }
    }
  }
  updateBoxes();
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
    for (const box of enemyBoxes(team)) {
      const t=sweepBox(from,to,box,box.kind==='character'?radius:objectRadius);
      if (t!==null && (!best || t<best.t)) best={box,t,point:from.clone().lerp(to,t)};
    }
    return best;
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
  function complete(s,tick,contact,reason,boxHits) {
    const hits=new Map();
    // A native overlap-shaped shot (`FireType` 21) decides its own instance set at
    // fire time, so it bypasses the contact/penetration/splash derivation below.
    if (boxHits) for (const b of boxHits) hits.set(b.key,b);
    else {
      if (contact) hits.set(contact.box.key,contact.box);
      // 满蓄穿透（FT54 竞技场特化）：命中实例 = 当前目标 + 掩体 共 2 个（用户实测定案）。
      // IsValidFunctionTarget 拒绝 SpotDynamicObject/SpotSummon 但不拒 SpotCover，
      // 掩体是合法函数目标 ⇒ 穿透命中必含角色掩体盒。
      if (s.cfg.penetration>0 && contact) {
        const other=contact.box.kind==='character'?'cover':'character';
        const sibling=states.get(contact.box.id)?.boxes?.[other];
        if (sibling) hits.set(sibling.key,sibling);
      }
      const range=reason==='range'?0:(s.cfg.explosionRange??0)*.01;
      if (range>0) for (const b of enemyBoxes(s.cfg.team)) if (boxDistance(s.pos,b)<=range) hits.set(b.key,b);
    }
    const range=reason==='range'?0:(s.cfg.explosionRange??0)*.01;
    Object.assign(s.record,{endTick:tick,reason,timeout:reason==='duration',
      exploded:!boxHits&&range>0,contacts:[...hits.values()].map(b=>({id:b.id,kind:b.kind})),
      to:s.pos.toArray(),instances:hits.size});
    return {id:s.cfg.id,team:s.cfg.team,instances:hits.size,contacts:s.record.contacts,shotId:s.record.shotId,muzzleIndex:s.record.muzzleIndex,reason,lastAmmo:s.record.lastAmmo,fullChargeRate:s.record.fullChargeRate,inputTypeAtFire:s.record.inputTypeAtFire};
  }
  return {
    stanceEvents,
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
      const alive = new Map(rs.map(r=>[r.cfg.id,r.alive!==false]));
      for (const r of rs) {
        const s=states.get(r.cfg.id);
        s.alive=alive.get(r.cfg.id);
        const stance=r.reloadLeft>0?3:r.aiming?2:0;
        if(s.stance!==stance)stanceEvents.push({tick,id:r.cfg.id,team:r.cfg.team,
          pose:stance===2?'aim':'hide',cause:r.reloadLeft>0?'reload':'stance'});
        s.stance=stance;
      }
      updateBoxes();
      for (const r of rs) {
        const own=states.get(r.cfg.id);
        r.cfg.enemies=[...states.values()].filter(s=>s.cfg.team!==r.cfg.team).map(s=>({...s.cfg.rankingStats,id:s.cfg.id,alive:alive.get(s.cfg.id)!==false,inZone:true,
          distance:own.pos.distanceTo(s.pos),x:s.pos.x,slotIndex:s.pl.slot}));
      }
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
      if (cfg.penetration>0 && ![1,21].includes(cfg.fireType)) throw new Error('Penetration only modeled for hitscan fireType=1/21');
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
      for (let i=0;i<(cfg.shotCount||1)*(cfg.muzzleCount||1);i++) {
        const from=muzzleAt(cfg.id,tick,point,i);
        if (!from) throw new Error(`Missing serialized muzzle: ${cfg.id}`);
        const record={shotId:shots.length,muzzleIndex:Math.floor(i/(cfg.shotCount||1)),id:cfg.id,fireTick:tick,fireType:cfg.fireType,inputTypeAtFire:cfg.inputType,lastAmmo,fullChargeRate,from:from.toArray(),aimPoint:point.toArray(),target:targetId,path:[from.toArray()]};
        if(cfg.fireType===2 || cfg.fireType===4){
          record.trackingTargetBound=targetBound;
          record.targetColliderIndex=colliderIndex??null;
        }
        shots.push(record);
        if (cfg.fireType===1 || cfg.fireType===19) {
          const s={cfg,pos:(pre?.point??rayEnd).clone(),record};
          result.push(complete(s,tick,pre,pre?'contact':'ray-miss'));
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
