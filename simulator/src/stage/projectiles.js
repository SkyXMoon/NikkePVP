import * as THREE from 'three';
import {createNativeFx,worldTrailEmitters,sampleWorldTrail,particleTexture} from './weapon-fx.js';

const PROJECTILE_TYPES = new Set([2, 3, 4, 5]);

export function selectProjectileAsset(cfg, index, base = '/assets/projectile') {
  if (!PROJECTILE_TYPES.has(cfg.fireType)) return { kind: 'none', url: null, label: '瞬发，无飞行弹体' };
  // 只匹配同角色的普攻弹体；排除 hit/muz/sk2/ult/scope 和未指定的 a/b 形态。
  const stems = ['proj_trail_arena', 'normal_proj_arena', 'proj_arena', 'proj_trail', 'normal_proj', 'proj'];
  for (const stem of stems) {
    const name = `fx_${cfg.id}_${stem}`;
    const item = index.items?.find((it) => it.name === name && it.glb);
    const path = item?.glb.replaceAll('\\', '/');
    if (path && /^out\/[^/]+\.glb$/.test(path)) {
      return { kind: 'character-resource', name, url: `${base}/${path}`,
        label: `角色同名普攻网格：${name}（运行时映射未验证）` };
    }
  }
  const name = cfg.fireType === 4 ? 'fx_c121_proj_trail' : 'fx_c100_proj_trail';
  const mesh = cfg.fireType === 4 ? 'fx_fbx_rocket_04_low' : 'fx_fbx_sphere_03';
  return { kind: 'generic-placeholder', name, url: `${base}/out/${name}__${mesh}.glb`,
    label: `通用占位：借用 ${cfg.fireType === 4 ? 'c121 火箭' : 'c100 球形'}网格，无本角色可用映射` };
}

export async function loadProjectileAsset(cfg, index, load, base) {
  if(cfg.weaponFx) return {kind:'native-arena-prefab',url:null,model:null,fx:cfg.weaponFx,
    name:cfg.weaponFx.model?.name??null,
    label:`竞技场配置：${cfg.weaponFx.model?.name??'无实体弹体'}；命中 ${cfg.weaponFx.hit?.name??'无'}（原网格/初始粒子参数，着色与发射简化）`};
  const asset = selectProjectileAsset(cfg, index, base);
  if (!asset.url) return { ...asset, model: null };
  try {
    const gltf = await load(asset.url);
    return { ...asset, model: gltf.scene };
  } catch (error) {
    return { ...asset, kind: 'generic-placeholder', model: null, failedUrl: asset.url,
      label: `通用几何占位：${asset.name} 加载失败（${error.message}）` };
  }
}

export function createTracer(parent, geo, cfg, asset) {
  return { parent, geo, team: cfg.team, asset,
    count: PROJECTILE_TYPES.has(cfg.fireType) ? (cfg.shotCount || 1) * (cfg.muzzleCount || 1) : 1,
    shots: [], instances: [], visualOrigins: new Map(), resolveOrigin: null,
    trailEmitters:worldTrailEmitters(asset.fx?.model?.profile) };
}

function createInstance(tracer) {
  const line = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({
    color: tracer.team === 0 ? 0xffb070 : 0x70c8ff, transparent: true, opacity: 0.9,
  }));
  line.frustumCulled = false;
  const head = new THREE.Group();
  const nativeHead=createNativeFx(tracer.asset.fx?.model?.profile);
  const nativeHit=createNativeFx(tracer.asset.fx?.hit?.profile);
  // 枪口特效：世界空间独立挂点，随每次发射在枪口帧位播放（arena 配置 Muzzle 字段）
  const nativeMuzzle=createNativeFx(tracer.asset.fx?.muzzle?.profile);
  if(nativeMuzzle){nativeMuzzle.root.visible=false;tracer.parent.add(nativeMuzzle.root);}
  const worldTrails=tracer.trailEmitters.map(emitter=>{
    const geometry=new THREE.BufferGeometry();
    const material=new THREE.PointsMaterial({size:emitter.size,color:emitter.color,opacity:emitter.opacity,
      map:particleTexture(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
    const points=new THREE.Points(geometry,material);points.frustumCulled=false;tracer.parent.add(points);
    return {emitter,points};
  });
  if(nativeHead)head.add(nativeHead.root);
  else if(tracer.asset.fx) { /* Native null Model means no projectile mesh. */ }
  else if (tracer.asset.model) head.add(tracer.asset.model.clone(true));
  else head.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xfff0b0 })));
  head.userData.projectile = { kind: tracer.asset.kind, url: tracer.asset.url };
  const flash = tracer.asset.fx ? (nativeHit?.root??new THREE.Group()) : new THREE.Mesh(new THREE.SphereGeometry(1.1, 14, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd070, transparent: true, opacity: 0.95 }));
  const glow = tracer.asset.fx ? new THREE.Group() : new THREE.Mesh(new THREE.SphereGeometry(2.2, 14, 12),
    new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false }));
  tracer.parent.add(line, head, flash, glow);
  return { line, head, flash, glow, nativeHead, nativeHit, nativeMuzzle, worldTrails };
}

export function resetTracer(tracer, geo, events, id) {
  tracer.geo = geo;
  tracer.visualOrigins.clear();
  tracer.shots = events.filter((e) => e.type === 'FIRE' && e.id === id).map((e) => e.tick * 2);
  for (const instance of tracer.instances) hideInstance(instance);
}

function hideInstance(instance) {
  const { line, head, flash, glow, worldTrails = [], nativeMuzzle } = instance;
  line.visible = head.visible = flash.visible = glow.visible = false;
  if(nativeMuzzle)nativeMuzzle.root.visible=false;
  for(const trail of worldTrails)trail.points.visible=false;
}

/**
 * 沿 30Hz tick 路径按弧长取样（p∈[0,1] 为飞行窗口进度）。
 * path 是逐 tick 位置（含起点），弧长参数化保持恒速：到达 path 终点恰好是 p=1。
 * @returns {[number,number,number]}
 */
export function samplePath(path, p) {
  const progress = Math.min(1, Math.max(0, p));
  let total = 0;
  const segs = [];
  for (let i = 1; i < path.length; i++) {
    const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2]);
    segs.push(d);
    total += d;
  }
  let remain = progress * total;
  for (let i = 0; i < segs.length; i++) {
    if (remain <= segs[i] || i === segs.length - 1) {
      const f = segs[i] > 1e-9 ? remain / segs[i] : 1;
      const a = path[i];
      const b = path[i + 1];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    }
    remain -= segs[i];
  }
  return [...path[path.length - 1]];
}

export function updateTracer(tracer, frame) {
  if (!tracer) return;
  if (tracer.records) return updateRecordedTracer(tracer,frame);
  const geo = tracer.geo;
  const flight = (geo?.flightFrames ?? 0) * 2;
  let used = 0;
  if (geo) for (let shotIndex = 0; shotIndex < tracer.shots.length; shotIndex++) {
    const fire = tracer.shots[shotIndex];
    const dt = frame - fire;
    if (dt < 0 || dt > flight + 14) continue;
    for (let projectileIndex = 0; projectileIndex < tracer.count; projectileIndex++) {
      const instance = tracer.instances[used] ?? (tracer.instances[used] = createInstance(tracer));
      used++;
      const { head, line, flash, glow } = instance;
      Object.assign(instance, { shotIndex, projectileIndex, fire, impact: fire + flight });
      const flying = flight > 0 && dt < flight;
      head.visible = line.visible = flying;
      flash.visible = glow.visible = !flying && !geo.timeout;
      if (flying) {
        const p = dt / flight;
        const key = `${fire}:${projectileIndex}`;
        if (!tracer.visualOrigins.has(key)) {
          tracer.visualOrigins.set(key, tracer.resolveOrigin?.(fire, projectileIndex)?.clone() ?? geo.from.clone());
        }
        const visualFrom = tracer.visualOrigins.get(key);
        const visualOffset = visualFrom.clone().sub(geo.from).multiplyScalar(1 - p);
        if (geo.path) {
          // Homing 逐tick曲线：沿 path 弧长插值；朝向取下一显示帧位置
          head.position.set(...samplePath(geo.path, p));
          head.position.add(visualOffset);
          const ahead = samplePath(geo.path, Math.min(1, p + 1 / flight));
          const nextOffset = visualFrom.clone().sub(geo.from).multiplyScalar(1 - Math.min(1, p + 1 / flight));
          for (let i = 0; i < 3; i++) ahead[i] += nextOffset.getComponent(i);
          if (ahead.some((v, i) => Math.abs(v - head.position.getComponent(i)) > 1e-9)) {
            head.lookAt(...ahead);
          }
        } else {
          head.position.copy(geo.from).lerp(geo.to, p);
          head.position.add(visualOffset);
          // GLB 保留导出尺寸；Object3D 的 +Z 对准实际飞行方向，不放大实体或闪光。
          head.lookAt(geo.to);
        }
        line.geometry.setFromPoints([visualFrom, head.position]);
      } else {
        const end = geo.path ? new THREE.Vector3(...geo.path[geo.path.length - 1]) : geo.to;
        flash.position.copy(end);
        glow.position.copy(end);
      }
    }
  }
  for (let i = used; i < tracer.instances.length; i++) hideInstance(tracer.instances[i]);
}

/** Tick-time interpolation; never bend a recorded path to a newly sampled muzzle. */
export function sampleTickPath(path, tick) {
  const t=Math.max(0,Math.min(path.length-1,tick));
  const i=Math.floor(t), j=Math.min(path.length-1,i+1), f=t-i;
  return path[i].map((v,k)=>v+(path[j][k]-v)*f);
}

function updateRecordedTracer(tracer,frame) {
  let used=0;
  for(const shot of tracer.records) {
    const start=shot.fireTick*2, end=(shot.endTick??(shot.fireTick+shot.path.length-1))*2;
    const linger=Math.max(14,...tracer.trailEmitters.map(e=>Math.ceil(e.life*60)));
    if(frame<start || frame>end+linger) continue;
    const instance=tracer.instances[used]??(tracer.instances[used]=createInstance(tracer));
    used++;
    const {head,line,flash,glow}=instance;
    const flying=frame<end;
    head.visible=line.visible=flying;
    flash.visible=glow.visible=!flying && (shot.instances>0 || shot.exploded);
    instance.nativeHead?.update((frame-start)/60,true);
    instance.nativeHit?.update((frame-end)/60);
    // 枪口特效：发射帧起播，持续 prefab 的 delay+lifetime；每发独立实例互不覆盖
    const muzzle=instance.nativeMuzzle;
    if(muzzle){
      const age=(frame-start)/60;
      muzzle.root.visible=age>=0&&age<=muzzle.duration;
      if(muzzle.root.visible){muzzle.root.position.set(...shot.from);muzzle.update(age);}
    }
    for(const trail of instance.worldTrails) {
      const positions=sampleWorldTrail(shot.path,(frame-start)/2,trail.emitter);
      trail.points.geometry.setFromPoints(positions);
      trail.points.visible=positions.length>0;
    }
    if(tracer.asset.fx) {
      head.visible=flying&&!!instance.nativeHead;
      glow.visible=false;
      flash.visible=flash.visible&&!!instance.nativeHit;
      // The inspection trajectory is independent of the prefab's Trail field.
      line.visible=flying || (frame-end<=2 && shot.instances>0);
      if(!flying&&line.visible)line.geometry.setFromPoints([new THREE.Vector3(...shot.from),new THREE.Vector3(...shot.to)]);
    }
    if(flying) {
      head.position.set(...sampleTickPath(shot.path,(frame-start)/2));
      const ahead=sampleTickPath(shot.path,(frame-start)/2+.5);
      if(ahead.some((v,i)=>Math.abs(v-head.position.getComponent(i))>1e-9)) head.lookAt(...ahead);
      const elapsed=(frame-start)/2;
      line.geometry.setFromPoints([...shot.path.slice(0,Math.floor(elapsed)+1).map(p=>new THREE.Vector3(...p)),head.position]);
    } else {
      flash.position.set(...shot.to);glow.position.copy(flash.position);
    }
    Object.assign(instance,{fire:start,impact:end,shotId:shot.shotId});
  }
  for(let i=used;i<tracer.instances.length;i++) hideInstance(tracer.instances[i]);
}
