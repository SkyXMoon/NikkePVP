/**
 * 逐帧检视页：5v5 十个 SD 小人 + 竞技场，按模拟器事件流逐帧摆姿势。
 *
 * 逻辑源：src/core/driver.js（30Hz tick）→ 显示帧 = tick × 2（60fps）
 * 动画源：/assets/out/sd_batch/*.glb（30fps 原始关键帧，播放端插值）
 *
 * 关键约束（来自资产说明）：
 *   - JSON 点位是 Unity 左手坐标，GLB 是右手 → 放进场景时 x 取反
 *   - 动画名 <code>_<clip>；aim_idle 循环，aim_start / cover_shot 播完自然接入 aim_idle
 *   - 仅剪辑级播放，不等同完整 Animator；模型朝向使用逐发预瞄射线交点
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { runChargeCalculation } from '../calculator/charge-calculator.js';
import { buildGaugeSeries } from './gauge-series.js';
import { requireCnResource, selectableCnCharacters, readLineup, addCnShootingProfiles } from './cn-roster.js';
import { mergeNativeData, requireBinding, resolvePreferTarget } from './native-data.js';
import { toRunnerConfig } from '../core/data.js';
import { createArenaShooting } from './shooting.js';
import { loadProjectileAsset, createTracer, resetTracer, updateTracer } from './projectiles.js';
import { applyPose, extractShotEvents, timelineFor, poseAt, facingAt, muzzleWorldAtPose, bindNativeMuzzles } from './animation.js';
import { toGltf, validateArenaContract, applyCharacterPlacement, applyModelFacing, assignCovers } from './geometry.js';

import {selectBoundEffects,selectDefaultEffects} from './weapon-fx.js';

const ASSET = '/assets';

const DEFAULT_LINEUP = {
  red: ['c232', 'c430', 'c352', 'c511', 'c100'],
  blue: ['c010', 'c011', 'c102', 'c070', 'c014'],
};

const $ = (id) => document.getElementById(id);
const status = $('status');
new ResizeObserver(()=>{
  document.documentElement.style.setProperty('--toolbar-bottom',`${$('top').getBoundingClientRect().bottom+12}px`);
}).observe($('top'));

// ---------- 三维基础 ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
$('app').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1014);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 2000);
camera.position.set(0, 8, 18);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

scene.add(new THREE.HemisphereLight(0xffffff, 0x333344, 1.1));
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(6, 12, 8);
scene.add(dir);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---------- 状态 ----------
const S = {
  frame: 0,
  totalFrames: 1800,
  playing: false,
  fps: 60,
  speed: 1,
  arena: 'arenanormal',
  yOffset: 0,
  ground: false,
};

/** @type {Array<{code:string,name:string,team:number,root:THREE.Object3D,mixer:THREE.AnimationMixer,actions:object,durs:object,timeline:Array}>} */
let chars = [];
let events = [];
let gauges = { max: 1000000, series: new Map() };
let ammoById = new Map();
let geoByCode = new Map();
let arenaMixer = null;
let arenaActions = {};
const loader = new GLTFLoader();
const indexByCode = new Map();
let characterData = {};
let cnRoster;
let nativeShooting;
let weaponEffects;
let shooting;
let currentArena;

// ---------- 资源 ----------
async function loadJson(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  return r.json();
}

async function loadGlb(url) {
  // serve.py 已返回 no-store；主动绕过历史 HTTP 缓存及 Three.FileLoader 的内存缓存。
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  return loader.parseAsync(await r.arrayBuffer(), new URL('.', new URL(url, location.href)).href);
}

async function loadIndex() {
  const [idx, data, native, bindings, colliders, cnColliders, effects, roster] = await Promise.all([
    loadJson(`${ASSET}/out/sd_batch/index.json`),
    loadJson(new URL('../../data/characters.cn.json', import.meta.url)),
    loadJson(new URL('../../data/native-shooting.json', import.meta.url)),
    loadJson(new URL('../../data/native-bindings.json', import.meta.url)),
    loadJson(new URL('../../data/native-colliders.global.json', import.meta.url)),
    loadJson(new URL('../../data/native-colliders.cn.json', import.meta.url)),
    loadJson(new URL('../../data/weapon-effects.json', import.meta.url)),
    loadJson(new URL('../../data/cn-roster.json', import.meta.url)),
  ]);
  characterData = data;
  // Shot physics, muzzle bindings and arena collision boxes ship as three provenance
  // layers; merge once here so a borrowed layer stays visible downstream. The stage
  // renders the CN roster, so CN colliders are its own region and global is the fallback.
  nativeShooting = addCnShootingProfiles(
    mergeNativeData(native, bindings, cnColliders, colliders), data);
  weaponEffects=effects;
  cnRoster=roster;
  for (const c of idx.characters) indexByCode.set(c.code, c);
  return idx;
}

async function loadArena(name, group) {
  const json = await loadJson(`${ASSET}/arena/${name}.json`);
  validateArenaContract(json);
  const glb = await loadGlb(`${ASSET}/out/arena_${name}.glb`);
  group.clear();
  arenaMixer = null;
  arenaActions = {};
  group.add(glb.scene);
  arenaMixer = new THREE.AnimationMixer(glb.scene);
  for (const clip of glb.animations) arenaActions[clip.name] = arenaMixer.clipAction(clip);

  arenaRoot = glb.scene;
  const abox = new THREE.Box3().setFromObject(glb.scene);
  const asize = abox.getSize(new THREE.Vector3());
  window.__arenaBox = `arenaBox ${asize.x.toFixed(0)}x${asize.y.toFixed(0)}x${asize.z.toFixed(0)}`;
  window.__arenaMinY = abox.min.y.toFixed(1);
  const targets = json.covers.map((c) => new THREE.Vector3(...toGltf(c.character_position)));
  if (targets.length) {
    const box = new THREE.Box3().setFromPoints(targets);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    // 两队沿 z 站成一列、隔着 x 轴对射：从 +x 一端斜上方看，两排都在画面里。
    // 不用 JSON 的 camera（那是中庭俯视演出机位，贴在装饰件上）。
    const dist = Math.max(size.x, size.z) * 2.1;
    controls.target.copy(c);
    camera.position.copy(c).add(new THREE.Vector3(0.52, 0.72, 0.46).normalize().multiplyScalar(dist));
    camera.up.set(0, 1, 0);
    camera.lookAt(c);
    camera.fov = 50;
    camera.updateProjectionMatrix();
    controls.update();
  }
  return json;
}

// ---------- 阵容与模拟 ----------
function cfgFor(code, team, label) {
  const entry = indexByCode.get(code);
  const key = String(parseInt(code.slice(1), 10));
  requireCnResource(cnRoster,key);
  const ch = characterData[key];
  if (!entry) throw new Error(`资产索引里没有 ${code}`);
  if (!ch) throw new Error(`角色数据里没有 ${code}（${key}）`);
  const cfg = toRunnerConfig(ch);
  cfg.id = code;              // 事件里用 code 作唯一 id
  cfg.name = cnRoster.characters.find(c=>c.resourceId===key)?.name ?? entry.name;
  cfg.team = team;
  cfg.label = label;
  cfg.preferTarget = resolvePreferTarget(nativeShooting.weapons[key]);
  cfg.weaponFx=weaponEffects.characters[code] ? selectBoundEffects(cfg,weaponEffects) :
    (selectDefaultEffects(ch.shot.weaponType,weaponEffects) ??
      {binding:{weaponType:ch.shot.weaponType},model:null,hit:null,muzzle:null,trail:null});
  cfg.weaponType=cfg.weaponFx.binding.weaponType;
  return cfg;
}

function runSimulation(cfgs) {
  if (chars.length) {
    shooting = createArenaShooting({arena:currentArena, characters:cfgs, native:nativeShooting,
      heightOffset:placementHeight,
      muzzleAt:(id,tick,point,index)=>{
        const ch=chars.find(c=>c.code===id);
        const face={point:point.toArray(),frame:tick*2};
        // FIRE is the native Shot event, so sample the exported clip at its Shot time.
        const shotTime=ch.clipEvents.cover_shot;
        if (shotTime==null) throw new Error(`Missing Shot animation event: ${id}`);
        applyPose(ch,{clip:'cover_shot',t:shotTime});
        applyModelFacing(ch.model,ch.modelBaseMatrix,face);
        return muzzleWorldAtPose(ch,index);
      }});
  }
  const { simulation: res, result: chargeResult } = runChargeCalculation({
    characters: cfgs,
    totalTicks: Math.ceil(S.totalFrames / 2),
    burstMax: 1000000,
    shooting,
    autoRelease: true,
  });
  events = res.events;
  ammoById = res.ammoById;
  window.__shooting = shooting;
  window.__simulation = res;
  window.__chargeCalculation = chargeResult;
  $('charge-limit').textContent = res.unsupportedFirstCharge.length
    ? `首次充能结果未完整：${res.unsupportedFirstCharge.length} 项技能触发尚未接入。` : '';
  // 逐帧累计爆裂槽（供滑到任意帧直接显示）
  const maxFrame = S.totalFrames;
  const gaugeMax = res.burst ? res.burst.max : 1000000;
  gauges = buildGaugeSeries(events, maxFrame, gaugeMax);
}

// ---------- 渲染一帧 ----------
const rows = new Map();

function renderFrame() {
  const f = S.frame;
  $('frame').value = String(f);
  $('fnum').textContent = `F${f}`;
  const tick = Math.floor(f / 2);

  for (const ch of chars) {
    const pose = poseAt(ch, f);
    applyPose(ch, pose);
    applyModelFacing(ch.model, ch.modelBaseMatrix, facingAt(ch, f));
    updateTracer(ch.tracer, f);
    ch.tag.userData.setAmmo(ammoById.get(ch.code)?.[tick], ch.maxAmmo);
    const row = rows.get(ch.code);
    if (!row) continue;
    const localFrame = Math.round(pose.t * 30);
    row.querySelector('.c').textContent = `${pose.clip} · ${localFrame}f`;
    row.classList.toggle('hit', pose.type === 'FIRE' && pose.since === f);
  }

  if (arenaMixer) {
    arenaMixer.stopAllAction();
    const clip = arenaActions[Object.keys(arenaActions).find((n) => n.endsWith('_ingame'))];
    if (clip) { clip.play(); clip.time = (f / 60) % clip.getClip().duration; clip.paused = true; }
    arenaMixer.update(0);
  }

  // 爆裂槽
  const g = gauges.series;
  const ph = gauges.phases;
  const phaseName = ['充能中', '已满', '爆裂中'];
  const p0 = (g.get(0)?.[f] ?? 0) * 100;
  const p1 = (g.get(1)?.[f] ?? 0) * 100;
  $('gauges').innerHTML = `
    <div class="row"><span class="n">红队</span><span class="c">${p0.toFixed(1)}% · ${phaseName[ph.get(0)?.[f] ?? 0]}</span></div>
    <div class="bar"><i style="width:${Math.min(100, p0)}%"></i></div>
    <div class="row" style="margin-top:6px"><span class="n">蓝队</span><span class="c">${p1.toFixed(1)}% · ${phaseName[ph.get(1)?.[f] ?? 0]}</span></div>
    <div class="bar"><i style="width:${Math.min(100, p1)}%"></i></div>
    <div class="tip">tick ${tick} / ${Math.floor(S.totalFrames / 2)}</div>`;

  // 本帧事件
  const now = events.filter((e) => e.tick * 2 === f || (e.tick * 2 === f - 1));
  const nm = window.__nameByCode ?? new Map();
  $('events').innerHTML = now.length
    ? now.map((e) => `<span class="ev ${e.type}">${nm.get(e.id) ?? e.id} ${e.type}${e.charge ? ` +${(e.charge / 10000).toFixed(2)}%` : ''}</span>`).join('')
    : '<span class="k">—</span>';

  renderer.render(scene, camera);
}

// ---------- 控件 ----------
function setFrame(f) {
  S.frame = Math.max(0, Math.min(S.totalFrames, Math.round(f)));
  renderFrame();
}

let rebuildAfterPlacementChange = () => {};
function bindControls() {
  $('prev1').onclick = () => { S.playing = false; $('play').classList.remove('on'); $('play').textContent = '播放'; setFrame(S.frame - 1); };
  $('next1').onclick = () => { S.playing = false; $('play').classList.remove('on'); $('play').textContent = '播放'; setFrame(S.frame + 1); };
  $('prev10').onclick = () => setFrame(S.frame - 10);
  $('next10').onclick = () => setFrame(S.frame + 10);
  $('frame').oninput = (e) => setFrame(Number(e.target.value));
  $('play').onclick = () => {
    S.playing = !S.playing;
    $('play').classList.toggle('on', S.playing);
    $('play').textContent = S.playing ? '暂停' : '播放';
  };
  $('fps').onchange = (e) => { S.fps = Number(e.target.value); };
  $('speed').onchange = (e) => { S.speed = Number(e.target.value); };
  $('yoff').oninput = (e) => { S.yOffset = Number(e.target.value) || 0; rebuildAfterPlacementChange(); };
  $('ground').onchange = (e) => { S.ground = e.target.checked; rebuildAfterPlacementChange(); };
  $('tofire').onclick = () => {
    const f = events.find((e) => e.type === 'FIRE');
    if (f) setFrame(f.tick * 2);
  };
  $('tomiss').onclick = () => {
    const focus=new URLSearchParams(location.search).get('missCharacter');
    const miss=events.find(e=>e.type==='MISS' && (!focus || e.id===focus));
    if(miss) { S.playing=false;$('play').classList.remove('on');$('play').textContent='播放';setFrame(miss.tick*2); }
  };
  $('toburst').onclick = () => {
    const t = gauges.readyTick?.get(0) ?? gauges.readyTick?.get(1);
    if (t != null) setFrame(t * 2);
  };
  $('frame').max = String(S.totalFrames);
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setFrame(S.frame + (e.shiftKey ? 10 : 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setFrame(S.frame - (e.shiftKey ? 10 : 1)); }
    if (e.code === 'Space') { e.preventDefault(); $('play').click(); }
  });
}

let last = 0;
let acc = 0;
function tickLoop(now) {
  requestAnimationFrame(tickLoop);
  if (S.playing) {
    const dt = last ? (now - last) / 1000 : 0;
    acc += dt * S.fps * S.speed;
    if (acc >= 1) {
      const step = Math.floor(acc);
      acc -= step;
      setFrame(S.frame + step);
      if (S.frame >= S.totalFrames) { S.playing = false; $('play').classList.remove('on'); $('play').textContent = '播放'; }
    }
  }
  last = now;
  if (!S.playing) { controls.update(); renderer.render(scene, camera); }
}

// ---------- 摆位 ----------
const placements = new Map();
function placementHeight(placement) {
  const p=toGltf(placement.character_position);
  return S.yOffset+(S.ground?groundY(p[0],p[2],p[1])-p[1]:0);
}
function rebuildGeometry(arenaJson, cfgs) {
  currentArena=arenaJson;
  placements.clear();
  for(const [id,pl] of assignCovers(arenaJson.covers,cfgs)) placements.set(id,pl);
  geoByCode.clear();
}

function refreshCharacters() {
  for (const ch of chars) {
    const shots=shooting?.shots.filter(s=>s.id===ch.code)??[];
    const shot=shots[0];
    ch.facingTarget=null;
    ch.timeline=timelineFor(events,ch.code,ch.durs,ch.clipEvents,null,ch.stateSpeeds);
    for(const request of ch.timeline) if(request.type==='FIRE') {
      const fire=shots.find(s=>s.fireTick*2>=request.frame && s.fireTick*2===request.frame+Math.round((ch.clipEvents.cover_shot??0)*60));
      if(fire) request.facing={point:fire.aimPoint,frame:fire.fireTick*2,source:'native-preaim-ray'};
    }
    if(ch.tracer) {
      resetTracer(ch.tracer,null,events,ch.code);
      ch.tracer.records=shots;
    }
    if(shot) geoByCode.set(ch.code,{from:new THREE.Vector3(...shot.from),to:new THREE.Vector3(...shot.aimPoint),
      targetLabel:shot.target,frames:(shot.endTick??shot.fireTick)-shot.fireTick,
      flightFrames:(shot.endTick??shot.fireTick)-shot.fireTick,extras:[],instances:shot.instances??0});
  }
  window.__nameByCode = new Map(chars.map((c) => [c.code, `${c.label} ${c.name}`]));
  $('chars').innerHTML = chars.map((ch) => {
    const geo = geoByCode.get(ch.code);
    const tgt = geo ? ` →${geo.blocked ? '掩体' : geo.targetLabel}${geo.flightFrames ? `·飞行${geo.flightFrames}t` : '·瞬发'}` : '';
    const asset = ch.tracer?.asset;
    const source = asset && asset.kind !== 'none'
      ? `<br><small class="projectile-source" style="color:#6f7683"></small>` : '';
    const facing = '';
    const homing = '';
    return `<div class="row" data-code="${ch.code}">
      <span class="n">${ch.label} ${ch.name} · ${ch.weaponType}<small style="color:#6f7683">${tgt}</small>${source}${facing}${homing}</span><span class="c">—</span>
    </div>`;
  }).join('');
  rows.clear();
  for (const el of document.querySelectorAll('#chars .row')) {
    rows.set(el.dataset.code, el);
    const source = el.querySelector('.projectile-source');
    const tracer = chars.find((ch) => ch.code === el.dataset.code)?.tracer;
    if (source) {
      source.textContent = tracer.asset.label;
      source.title = tracer.asset.url ?? '';
    }
  }
}

/** 按贴地后的真实站位取景（arena 自带机位与坐标 y 都不适合看十个人） */
function fitCameraToChars() {
  if (!chars.length) return;
  const box = new THREE.Box3();
  for (const ch of chars) {
    const p = ch.root.position;
    box.expandByPoint(new THREE.Vector3(p.x, p.y, p.z));
    box.expandByPoint(new THREE.Vector3(p.x, p.y + 2.4, p.z));
  }
  const c = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const dist = Math.max(size.x, size.z, 8) * 2.1;   // 拉远：场馆外壳很大，太近会钻进结构里
  controls.target.copy(c);
  camera.position.copy(c).add(new THREE.Vector3(0.52, 0.72, 0.46).normalize().multiplyScalar(dist));
  camera.up.set(0, 1, 0);
  camera.lookAt(c);
  camera.fov = 50;
  camera.updateProjectionMatrix();
  controls.update();
}



function labelSprite(text, color) {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 128;
  const ctx = cv.getContext('2d');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  sp.scale.set(2.8, 0.7, 1);
  sp.userData.setAmmo = (current, maximum) => {
    const ammoText = Number.isFinite(current) ? `${current}/${maximum}` : '∞/∞';
    if (sp.userData.ammoText === ammoText) return;
    sp.userData.ammoText = ammoText;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = 'rgba(0,0,0,.55)';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.font = 'bold 38px "Microsoft YaHei", system-ui';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(ammoText, 256, 34, 496);
    ctx.font = 'bold 36px "Microsoft YaHei", system-ui';
    ctx.fillStyle = color;
    ctx.fillText(text, 256, 93, 496);
    tex.needsUpdate = true;
  };
  return sp;
}

const raycaster = new THREE.Raycaster();
let arenaRoot = null;

/** 从站位正上方往下打一条射线，取场地表面高度（角色脚底贴地） */
function groundY(x, z, fallback) {
  if (!arenaRoot) return fallback;
  raycaster.set(new THREE.Vector3(x, fallback + 30, z), new THREE.Vector3(0, -1, 0));
  raycaster.far = 80;
  const hits = raycaster.intersectObject(arenaRoot, true);
  for (const h of hits) {
    if (h.object.isMesh && h.object.visible) return h.point.y;
  }
  return fallback;
}

function placeAll() {
  for (const ch of chars) {
    const pl = placements.get(ch.code);
    if (!pl) continue;
    applyCharacterPlacement(ch.root, pl, S.yOffset, S.ground ? groundY : null);
    ch.tracer?.visualOrigins.clear();
  }
}

// ---------- 启动 ----------
async function boot() {
  const q = new URLSearchParams(location.search); // ?n=1 只加载一人（调试用）?look= / ?cam= / ?debug=1
  if (['arenanormal','arenaspecial','arenachampion'].includes(q.get('arena'))) {
    S.arena=q.get('arena');
    $('arena').value=S.arena;
  }
  status.textContent = '加载索引…';
  const idx = await loadIndex();
  const choices=selectableCnCharacters(cnRoster,characterData,idx,nativeShooting);
  const lineup=readLineup(q,DEFAULT_LINEUP,new Set(choices.map(c=>c.code)));
  const selector=$('lineup');
  for(const [team,codes] of Object.entries(lineup)) for(const [i,code] of codes.entries()) {
    const label=document.createElement('label');
    label.textContent=`${team==='red'?'红':'蓝'}${i+1} `;
    const select=document.createElement('select');
    for(const choice of choices) {
      const option=document.createElement('option');
      option.value=choice.code; option.textContent=choice.name; select.appendChild(option);
    }
    select.value=code; select.dataset.team=team; label.appendChild(select); selector.appendChild(label);
  }
  $('apply-lineup').onclick=()=>{
    const selects=[...selector.querySelectorAll('select')];
    const codes=selects.map(s=>s.value);
    if(new Set(codes).size!==10) { $('lineup-error').textContent='十个位置请使用不同角色。'; return; }
    const next=new URL(location.href);
    next.searchParams.set('red',codes.slice(0,5).join(','));
    next.searchParams.set('blue',codes.slice(5).join(','));
    location.assign(next);
  };

  const arenaGroup = new THREE.Group();
  scene.add(arenaGroup);
  status.textContent = '加载场地…';
  let arenaJson = await loadArena(S.arena, arenaGroup);

  const cfgs = [];
  lineup.red.forEach((code, i) => cfgs.push(cfgFor(code, 0, `R${i + 1}`)));
  lineup.blue.forEach((code, i) => cfgs.push(cfgFor(code, 1, `B${i + 1}`)));
  if (q.has('gear')) {
    const [code,raw]=q.get('gear').split(':');
    const hundredths=Math.round(Number(raw)*100);
    const valid=[198,228,257,286,316,345,375,404,433,463,492,521,551,580,609];
    const cfg=cfgs.find(c=>c.id===code);
    if (!cfg || !valid.includes(hundredths) || ![2,3].includes(cfg.inputType))
      throw new Error('装备蓄速演示参数无效');
    cfg.onStartBuffs.push({id:'demo-gear-charge',ft:61,standard:1,kind:'permanent',remain:Infinity,
      value:-hundredths,effect:{kind:'chargeSpeed',percent:-hundredths}});
    $('gear-info').textContent=`装备词条演示：${cfg.name} 蓄速 +${(hundredths/100).toFixed(2)}%（单条）；其余角色 0%。`;
  }
  const missingFx=cfgs.filter(c=>!weaponEffects.characters[c.id]);
  const fallbackFx=missingFx.filter(c=>c.weaponFx.fallback);
  const noFx=missingFx.filter(c=>!c.weaponFx.fallback);
  const intlShot=cfgs.filter(c=>nativeShooting.weapons[String(Number(c.id.slice(1)))].source!=='cn-shot-table');
  const ambiguous=cfgs.filter(c=>characterData[String(Number(c.id.slice(1)))].skillExportWarnings?.length);
  $('data-limit').textContent=`${intlShot.length ? `${intlShot.map(c=>c.name).join('、')}的射击配置暂用国际服表（国服表无该角色）` : '射击配置均来自国服表'}${fallbackFx.length ? `；${fallbackFx.map(c=>c.name).join('、')}暂用同枪种默认特效，专属特效尚未核对` : ''}${noFx.length ? `；${noFx.map(c=>c.name).join('、')}的特效绑定尚未核对` : ''}${ambiguous.length ? `；${ambiguous.map(c=>c.name).join('、')}存在技能表归属不明确` : ''}。`;
  const limit = Number(q.get('n'));
  if (limit > 0) cfgs.length = Math.min(limit, cfgs.length);

  // ---- 命中几何：站位/瞄准点/掩体 → 飞行帧数与实例数（替代手填参数） ----
  rebuildGeometry(arenaJson, cfgs);


  // 角色模型
  status.textContent = `加载小人 0/${cfgs.length}…`;
  const group = new THREE.Group();
  scene.add(group);
  let loaded = 0;
  const models = await Promise.all(cfgs.map(async (cfg) => {
    const entry = indexByCode.get(cfg.id);
    const glb = await loadGlb(`${ASSET}/out/sd_batch/${entry.file}`);
    loaded++;
    status.textContent = `加载小人 ${loaded}/${cfgs.length}…`;
    return glb;
  }));

  status.textContent = '加载弹体形状…';
  const projIndex = await loadJson(`${ASSET}/projectile/projectiles_index.json`).catch(() => ({ items: [] }));
  const projectileCache = new Map();
  const loadProjectile = (url) => {
    if (!projectileCache.has(url)) projectileCache.set(url, loadGlb(url));
    return projectileCache.get(url);
  };
  const projectileAssets = await Promise.all(cfgs.map((cfg) =>
    loadProjectileAsset(cfg, projIndex, loadProjectile, `${ASSET}/projectile`)));

  // Bindings come from the asset export layer, not the shot table: a character can
  // have shot physics and still ship no exported muzzle. Fail by name, not by
  // passing undefined into the node-path matcher.
  const nativeMuzzles = await Promise.all(models.map((glb,i)=>bindNativeMuzzles(glb,requireBinding(nativeShooting,cfgs[i].id))));
  chars = cfgs.map((cfg, i) => {
    const glb = models[i];
    // 外层只承载挂点；内部层仅为网页朝向层，不冒充角色原生 _model 绑定。
    const root = new THREE.Group();
    const model = new THREE.Group();
    model.add(glb.scene);
    root.add(model);
    model.updateMatrix();
    const modelBaseMatrix = model.matrix.clone();
    group.add(root);
    const mixer = new THREE.AnimationMixer(glb.scene);
    const actions = {};
    const durs = {};
    for (const clip of glb.animations) {
      const name = clip.name.replace(`${cfg.id}_`, '');
      actions[name] = mixer.clipAction(clip);
      durs[name] = clip.duration;
      if (name === 'aim_idle') actions[name].setLoop(THREE.LoopRepeat, Infinity);
      else { actions[name].setLoop(THREE.LoopOnce, 1); actions[name].clampWhenFinished = true; }
    }
    // 剪辑内的逻辑结算点（GLB extras.events，如 {t, fn:'Shot'}）：
    // FIRE 事件对应剪辑内 t 时刻，动画要提前 t×60 帧开播才能对上枪口帧
    const clipEvents = extractShotEvents(glb, cfg.id);
    // 脚下圆环 + 名字，保证"看不清模型"时也能确认谁在哪一帧做什么
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.75, 1.05, 28),
      new THREE.MeshBasicMaterial({ color: cfg.team === 0 ? 0xe05a4d : 0x4d8ee0, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    root.add(ring);
    const tag = labelSprite(`${cfg.name} · ${cfg.weaponType}`, cfg.team === 0 ? '#ffb3aa' : '#a9c8ff');
    tag.position.set(0, 2.9, 0);
    root.add(tag);

    const tracer = createTracer(group, geoByCode.get(cfg.id), cfg, projectileAssets[i]);

    const ch = {
      code: cfg.id, name: cfg.name, team: cfg.team, label: cfg.label, weaponType:cfg.weaponType, maxAmmo:cfg.maxAmmo,
      root, model, modelBaseMatrix, mixer, actions, durs, clipEvents, ring, tag, tracer,
      timeline: [], nativeMuzzles:nativeMuzzles[i], stateSpeeds:requireBinding(nativeShooting,cfg.id).stateSpeeds,
    };
    tracer.resolveOrigin = (fire, projectileIndex) => {
      applyPose(ch, poseAt(ch, fire));
      applyModelFacing(ch.model, ch.modelBaseMatrix, facingAt(ch, fire));
      const origin = muzzleWorldAtPose(ch, projectileIndex);
      applyPose(ch, poseAt(ch, S.frame));
      applyModelFacing(ch.model, ch.modelBaseMatrix, facingAt(ch, S.frame));
      return origin;
    };
    return ch;
  });

  placeAll();
  rebuildGeometry(arenaJson, cfgs);
  runSimulation(cfgs);
  fitCameraToChars();
  refreshCharacters();

  rebuildAfterPlacementChange = () => {
    rebuildGeometry(arenaJson, cfgs);
    placeAll();
    runSimulation(cfgs);
    refreshCharacters();
    renderFrame();
  };

  $('arena').onchange = async (e) => {
    S.arena = e.target.value;
    status.textContent = '切换场地…';
    try {
      arenaJson = await loadArena(S.arena, arenaGroup);
      rebuildGeometry(arenaJson, cfgs);
      placeAll();
      runSimulation(cfgs);
      refreshCharacters();
      fitCameraToChars();
      status.textContent = '就绪';
      renderFrame();
    } catch (err) {
      S.playing = false;
      status.textContent = `失败：${err.message}`;
    }
  };

  // 调试机位：?look=x,y,z&cam=x,y,z（世界坐标，glTF 右手）
  if (q.get('look')) {
    const l = q.get('look').split(',').map(Number);
    controls.target.set(l[0], l[1], l[2]);
    const cp = (q.get('cam') || `${l[0] + 8},${l[1] + 3},${l[2] + 8}`).split(',').map(Number);
    camera.position.set(cp[0], cp[1], cp[2]);
    camera.lookAt(controls.target);
    controls.update();
  }

  // ?debug=1：把几何数字打到事件栏，便于校准机位/落地高度
  if (q.get('debug')) {
    const cb = new THREE.Box3().setFromObject(chars[0].root);
    const lines = [
      `arena ${window.__arenaBox} minY ${window.__arenaMinY}`,
      `char0 bbox min ${cb.min.toArray().map((v) => v.toFixed(2))} max ${cb.max.toArray().map((v) => v.toFixed(2))}`,
      ...chars.map((c) => `${c.code} ${c.root.position.toArray().map((v) => v.toFixed(2))}`),
    ];
    for (const l of lines) console.log('[dbg]', l);
    const pre = document.createElement('pre');
    pre.id = 'dbgpre';
    pre.textContent = lines.join(' | ');
    document.body.appendChild(pre);
    const ch = chars[0];
    let meshes = 0, skinned = 0;
    ch.root.traverse((o) => { if (o.isMesh) { meshes++; if (o.isSkinnedMesh) skinned++; } });
    console.log('[dbg] name', typeof ch.name, JSON.stringify(ch.name), 'label', ch.label);
    console.log('[dbg] meshes', meshes, 'skinned', skinned, 'scale', ch.root.scale.toArray().join(','), 'pos', ch.root.position.toArray().map((v) => v.toFixed(2)).join(','));
    console.log('[dbg] ground', chars.map((c) => {
      const p = c.root.position;
      const o = new THREE.Ray(new THREE.Vector3(p.x, p.y + 30, p.z), new THREE.Vector3(0, -1, 0));
      const ys = [];
      arenaRoot.traverse((obj) => {
        if (!obj.isMesh || !obj.visible) return;
        const hit = o.intersectBox(new THREE.Box3().setFromObject(obj), new THREE.Vector3());
        if (hit) ys.push(`$y{}`.replace('$y{}', hit.y.toFixed(1) + ':' + (obj.name || '?').slice(0, 18)));
      });
      return `${c.code}@${p.y.toFixed(1)} [${ys.sort((a, b) => b - a).slice(0, 6).join(',')}]`;
    }).join(' '));
    console.log('[dbg] geo', chars.map((c) => { const g = geoByCode.get(c.code); return g ? `${c.code}:${g.frames}t${g.blocked ? '挡' : ''}×${1 + g.extras.length}` : c.code; }).join(' '));
    console.log('[dbg] clips', Object.keys(ch.actions).join(','), 'durs', Object.values(ch.durs).map((d) => d.toFixed(2)).join(','));
  }

  bindControls();
  status.textContent = `就绪 · ${chars.length} 人 · ${events.length} 事件 · ${window.__arenaBox ?? ''} · cam ${camera.position.toArray().map((v) => v.toFixed(1)).join(',')}`;
  setFrame(q.get('frame') ? Number(q.get('frame')) : 0);
  requestAnimationFrame(tickLoop);
}

boot().catch((err) => {
  console.error(err);
  status.textContent = `失败：${err.message}`;
});
