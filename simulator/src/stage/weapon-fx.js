import * as T from 'three';
import {toGltf,toGltfRotation} from './geometry.js';

// Mesh/transform/initial particle values come from the bound arena prefab.
// This is a deterministic inspection renderer, not a Unity shader/ParticleSystem runtime.
let softDisc;
export function particleTexture() {
  if(softDisc)return softDisc;
  const n=32,data=new Uint8Array(n*n*4);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const r=Math.hypot((x+.5)/n*2-1,(y+.5)/n*2-1),i=(y*n+x)*4;
    data[i]=data[i+1]=data[i+2]=255;data[i+3]=Math.round(Math.max(0,1-r)**2*255);
  }
  softDisc=new T.DataTexture(data,n,n,T.RGBAFormat);softDisc.needsUpdate=true;
  return softDisc;
}
const scalar=(v, fallback=1)=>Number.isFinite(v?.scalar)?v.scalar:fallback;
function curveValue(curve,t) {
  const keys=curve?.m_Curve;
  if(!keys?.length)return 1;
  if(t<=keys[0].time)return keys[0].value;
  for(let i=1;i<keys.length;i++)if(t<=keys[i].time){
    const a=keys[i-1],b=keys[i],d=b.time-a.time,u=(t-a.time)/d;
    return (2*u**3-3*u*u+1)*a.value+(u**3-2*u*u+u)*d*a.outSlope+(-2*u**3+3*u*u)*b.value+(u**3-u*u)*d*b.inSlope;
  }
  return keys.at(-1).value;
}
// 原始序列化贴图（arena_fx 交付，未做 V 翻转；Unity 采样约定 y 向下，three.js 用
// flipY=true 的常规 Texture 加载与 Unity 的 UV 惯性一致——图集行序自上而下）。
const texCache=new Map();
function atlasTexture(file,uv){
  // Node 测试环境无 document/ImageLoader：退回软圆盘，只保证结构可构建；
  // 浏览器加载原始序列化 PNG（含图集动画）。
  if(typeof document==='undefined')return particleTexture();
  const url=`./data/fx-textures/${file}`;
  let base=texCache.get(url);
  if(!base){
    base=new T.TextureLoader().load(url);
    base.colorSpace=T.SRGBColorSpace;
    texCache.set(url,base);
  }
  // 每个 emitter 独立 clone，避免共享 offset/repeat
  const map=base.clone();
  map.needsUpdate=true;
  map.repeat.set(1/(uv?.tilesX??1),1/(uv?.tilesY??1));
  return map;
}
/** 图集帧偏移：SingleRow(1) 用 rowIndex 选行、frameOverTime×tilesX 走列；
 *  Auto(0) 按帧序铺满 tilesX×tilesY。返回 [offsetU, offsetV]。
 *  frameOverTime 曲线只有单键（导出截断，无常数值可用）时按线性进度回退。 */
export function atlasOffset(uv,progress){
  if(!uv?.tilesX)return null;
  const tx=uv.tilesX,ty=uv.tilesY??1,f=Math.min(1,Math.max(0,progress));
  const keys=uv.frameOverTime?.maxCurve?.m_Curve??[];
  const g=keys.length>=2?Math.min(1,Math.max(0,curveValue({m_Curve:keys},f))):f;
  let col,row;
  if((uv.animationType??1)===1){
    col=Math.floor(g*tx)%tx;
    row=uv.rowMode===1?Math.min(uv.rowIndex??0,ty-1):0;
    // rowMode Random(1)：原生每粒子随机取行；确定性渲染固定 rowIndex
  }else{
    const idx=Math.floor(g*tx*ty)%(tx*ty);
    col=idx%tx;row=Math.floor(idx/tx);
  }
  return [col/tx,1-(row+1)/ty];
}
export function createNativeFx(profile) {
  if(!profile) return null;
  const particles=[];
  function build(p) {
    const node=new T.Group();node.name=p.name;
    node.position.fromArray(toGltf(p.position));node.quaternion.fromArray(toGltfRotation(p.rotation));node.scale.fromArray(p.scale);
    node.visible=p.active!==false;
    if(p.particle && p.renderMode!=null){
      const initial=p.particle.initial,c=initial.startColor?.maxColor??{r:1,g:1,b:1,a:1};
      const materialOptions={color:new T.Color(c.r,c.g,c.b),transparent:true,opacity:c.a,depthWrite:false,blending:T.AdditiveBlending};
      let visual;
      if(p.mesh){
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p.mesh.positions.flatMap(v=>toGltf(v)),3));
        g.setIndex(p.mesh.triangles.flatMap(t=>[t[0],t[2],t[1]]));
        visual=new T.Mesh(g,new T.MeshBasicMaterial({...materialOptions,side:T.DoubleSide}));
      } else if(p.particle.texture){
        visual=new T.Sprite(new T.SpriteMaterial({...materialOptions,map:atlasTexture(p.particle.texture.file,p.particle.uv)}));
      } else visual=new T.Sprite(new T.SpriteMaterial({...materialOptions,map:particleTexture()}));
      node.add(visual);
      particles.push({visual,initial,settings:p.particle,size:p.particle.size,baseOpacity:c.a,uv:p.particle.uv});
    }
    for(const child of p.children??[])node.add(build(child));
    return node;
  }
  const root=build(profile);
  root.userData.nativeFx={name:profile.name,representation:'prefab-mesh-and-initial-particle-values',unityShader:false,emitters:particles.length};
  let duration=0;
  for(const p of particles)duration=Math.max(duration,scalar(p.settings.startDelay,0)+Math.max(.001,scalar(p.initial.startLifetime,.1)));
  return {root,duration,update(age,continuous=false){
    for(const p of particles){
      const delay=scalar(p.settings.startDelay,0),life=Math.max(.001,scalar(p.initial.startLifetime,.1));
      const local=age-delay;
      const t=continuous?Math.max(0,local)%life:Math.max(0,local);
      p.visual.visible=local>=0 && (continuous||local<=life);
      const factor=p.size?.enabled?curveValue(p.size.curve?.maxCurve??p.size.x?.maxCurve,t/life):1;
      const x=scalar(p.initial.startSize)*factor;
      p.visual.scale.set(x,p.initial.size3D?scalar(p.initial.startSizeY)*factor:x,p.initial.size3D?scalar(p.initial.startSizeZ)*factor:x);
      p.visual.material.opacity=p.baseOpacity*(continuous?1:Math.max(0,1-t/life));
      const off=atlasOffset(p.uv,t/life);
      if(off&&p.visual.material.map)p.visual.material.map.offset.set(off[0],off[1]);
    }
  }};
}

export function selectBoundEffects(cfg,contract) {
  const binding=contract.characters[cfg.id];
  if(!binding)throw new Error(`Missing arena FX binding: ${cfg.id}`);
  const field=k=>binding.fields[k]?{...binding.fields[k],profile:contract.assets[binding.fields[k].name]}:null;
  const model=field('Model'),hit=field('Hit');
  if(model&&!model.profile || hit&&!hit.profile)throw new Error(`Missing arena FX prefab: ${cfg.id}`);
  return {binding,model,hit,muzzle:field('Muzzle'),trail:field('Trail')??field('Trance')};
}

// These entries contain only the original default ArenaWeaponSet fields.
// A missing character-specific mapping must remain visible to the caller.
export function selectDefaultEffects(weaponType,contract) {
  const source={RL:'c430',AR:'c010',SG:'c011',SR:'c102',SMG:'c195'}[weaponType];
  const binding=contract.characters[source];
  if(!binding || Object.values(binding.fields).some(field=>field && field.source!=='default.ArenaWeaponSet')) return null;
  return {...selectBoundEffects({id:source},contract),fallback:true};
}

/** Extract world-space emitters from the bound projectile prefab.
 * SimulationSpace 1 = World; local-space emitters remain attached to the projectile.
 */
export function worldTrailEmitters(profile) {
  const result=[];
  function visit(node,parent,parentActive=true) {
    const local=new T.Matrix4().compose(new T.Vector3(...toGltf(node.position)),
      new T.Quaternion(...toGltfRotation(node.rotation)),new T.Vector3(...node.scale));
    const matrix=parent.clone().multiply(local), p=node.particle, emission=p?.emission;
    const active=parentActive && node.active!==false;
    if(active && p?.simulationSpace===1 && emission?.enabled && node.renderMode!=null) {
      const rate=v=>v?.minMaxState===3?(scalar(v,0)+(v.minScalar??0))/2:scalar(v,0);
      const timeRate=rate(emission.rateOverTime),distanceRate=rate(emission.rateOverDistance);
      if(timeRate>0 || distanceRate>0) {
        const c=p.initial.startColor?.maxColor??{r:1,g:1,b:1,a:1};
        result.push({name:node.name,offset:new T.Vector3().setFromMatrixPosition(matrix),
          size:scalar(p.initial.startSize,.1),life:scalar(p.initial.startLifetime,.1),
          color:new T.Color(c.r,c.g,c.b),opacity:c.a,timeRate,distanceRate});
      }
    }
    for(const child of node.children??[])visit(child,matrix,active);
  }
  if(profile)visit(profile,new T.Matrix4());
  return result;
}

/** Deterministic replay of world-space particles: distance and time emission use
 * the resource's rates; lifespan is taken from its initial particle module.
 * Random curves, texture, velocity and shader remain simplified.
 */
export function sampleWorldTrail(path, elapsedTick, emitter, tickSeconds=.033) {
  if(path.length<2 || elapsedTick<0)return [];
  const end=Math.min(elapsedTick,path.length-1), points=[];
  const emit=(t,a,b,f)=>{
    if((elapsedTick-t)*tickSeconds>emitter.life)return;
    const direction=b.clone().sub(a);
    const rotation=direction.lengthSq()?new T.Quaternion().setFromRotationMatrix(
      new T.Matrix4().lookAt(b,a,new T.Vector3(0,1,0))):new T.Quaternion();
    points.push(a.clone().lerp(b,f).add(emitter.offset.clone().applyQuaternion(rotation)));
  };
  let dist=0,lastDist=0,lastTime=0;
  for(let i=1;i<path.length && i-1<end;i++) {
    const a=new T.Vector3(...path[i-1]), b=new T.Vector3(...path[i]);
    const fraction=Math.min(1,end-(i-1)),length=a.distanceTo(b),next=dist+length*fraction;
    if(emitter.distanceRate>0 && length>0) {
      const spacing=1/emitter.distanceRate;
      while(lastDist+spacing<=next+1e-9){lastDist+=spacing;const f=(lastDist-dist)/length;emit(i-1+f,a,b,f);}
    }
    if(emitter.timeRate>0) {
      const step=1/(emitter.timeRate*tickSeconds);
      while(lastTime+step<=i-1+fraction+1e-9){lastTime+=step;emit(lastTime,a,b,lastTime-(i-1));}
    }
    dist=next;
  }
  return points;
}
