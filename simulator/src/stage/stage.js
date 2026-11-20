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
import { toGltf, validateArenaContract, applyCharacterPlacement, applyModelFacing, assignCovers, muzzleWorld } from './geometry.js';
import { setMuzzleBakeTable, bakeDurations, bakeShotTime, bakeMuzzles, muzzleBakeReady, muzzleBakeCount, muzzleBakeGaps } from './muzzle-table.js';

import {selectBoundEffects,selectDefaultEffects} from './weapon-fx.js';

const ASSET = '/assets';

const DEFAULT_LINEUP = {
  red: ['c232', 'c430', 'c352', 'c511', 'c100'],
  blue: ['c010', 'c011', 'c102', 'c070', 'c014'],
};

const $ = (id) => document.getElementById(id);
const status = $('status');
// 分阶段耗时：模型/场地改成后台加载后，「数值多久可用」必须可观测，不能靠体感。
const BOOT_T0 = performance.now();
const marks = {};
function mark(name) { marks[name] = Math.round(performance.now() - BOOT_T0); return marks[name]; }
function markText() {
  const mb = (n) => `${(n / 1048576).toFixed(1)}MB`;
  return Object.entries(marks).map(([k, v]) => `${k} ${(v / 1000).toFixed(2)}s`).join(' · ')
    + (firstFrameBytes ? ` · 首屏 ${mb(firstFrameBytes)}` : '');
}
window.__bootMarks = marks;
window.__bootBytes = () => ({ firstFrame: firstFrameBytes, total: preloadBytes });
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
// 首帧前实际下载的字节数：模型/场地改成后台加载后，这是唯一可复现的提速指标。
let preloadBytes = 0;
let paintReady = false;
let firstFrameBytes = 0;

async function fetchBuffer(url) {
  // serve.py 已返回 no-store；主动绕过历史 HTTP 缓存及 Three.FileLoader 的内存缓存。
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
  const buf = await r.arrayBuffer();
  if (!paintReady) preloadBytes += buf.byteLength;
  return buf;
}

async function loadJson(url) {
  return JSON.parse(new TextDecoder().decode(await fetchBuffer(url)));
}

async function loadGlb(url) {
  return loader.parseAsync(await fetchBuffer(url), new URL('.', new URL(url, location.href)).href);
}

async function loadIndex() {
  const [idx, data, native, bindings, colliders, cnColliders, effects, roster, muzzleBake] = await Promise.all([
    loadJson(`${ASSET}/out/sd_batch/index.json`),
    loadJson(new URL('../../data/characters.cn.json', import.meta.url)),
    loadJson(new URL('../../data/native-shooting.json', import.meta.url)),
    loadJson(new URL('../../data/native-bindings.json', import.meta.url)),
    loadJson(new URL('../../data/native-colliders.global.json', import.meta.url)),
    loadJson(new URL('../../data/native-colliders.cn.json', import.meta.url)),
    loadJson(new URL('../../data/weapon-effects.json', import.meta.url)),
    loadJson(new URL('../../data/cn-roster.json', import.meta.url)),
    // 枪口/剪辑数值表：模拟层不再依赖模型，缺表时才回退 GLB 采样。
    loadJson(new URL('../../data/muzzle-bake.json', import.meta.url)).catch(() => null),
  ]);
  setMuzzleBakeTable(muzzleBake);
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

/** 场地契约 JSON（站位/掩体/机位）：只有几十 KB，数值链必需，与场地模型无关。 */
async function loadArenaJson(name) {
  const json = await loadJson(`${ASSET}/arena/${name}.json`);
  validateArenaContract(json);
  return json;
}

/** 场地模型（5–9MB）：只服务渲染，数值链不等它。 */
async function loadArenaScene(name, group, json) {
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

/** 既无烘焙值又无模型时的兜底枪口偏移（胸口高度、朝前偏一点），只影响缺口角色。 */
const FALLBACK_MUZZLE_OFFSET = [0, 1.35, 0.35];
let muzzleFallbackIds = new Set();

function runSimulation(cfgs) {
  // 不再要求 chars 里已有模型：枪口默认走烘焙表，模型只用于对拍/兜底。
  if (cfgs.length) {
    muzzleFallbackIds = new Set();
    shooting = createArenaShooting({arena:currentArena, characters:cfgs, native:nativeShooting,
      heightOffset:placementHeight,
      muzzleAt:(id,tick,point,index)=>{
        // 数值表命中：站位 + 目标 yaw 旋转 root 局部偏移。场地站位是纯 yaw、scale=1，
        // 与「摆姿势后取骨骼世界坐标」等价（对拍 284 个模型，偏差 < 5e-5）。
        const baked = muzzleSource === 'glb' ? null : bakeMuzzles(id);
        const state = shooting?.states?.get(id);
        if (baked && state) return new THREE.Vector3(...muzzleWorld(state.pos.toArray(), point.toArray(), baked[index % baked.length]));
        const ch=chars.find(c=>c.code===id);
        // 只有「整表缺失」或显式对拍模式才走骨骼：否则模型到没到会改变同一阵容的数值。
        if ((muzzleSource === 'glb' || !muzzleBakeReady()) && ch?.mixer) {
          const face={point:point.toArray(),frame:tick*2};
          // FIRE is the native Shot event, so sample the exported clip at its Shot time.
          const shotTime=ch.clipEvents.cover_shot;
          if (shotTime==null) throw new Error(`Missing Shot animation event: ${id}`);
          applyPose(ch,{clip:'cover_shot',t:shotTime});
          applyModelFacing(ch.model,ch.modelBaseMatrix,face);
          return muzzleWorldAtPose(ch,index);
        }
        if (!state) throw new Error(`Missing serialized muzzle: ${id}`);
        muzzleFallbackIds.add(id);
        return new THREE.Vector3(...muzzleWorld(state.pos.toArray(), point.toArray(), FALLBACK_MUZZLE_OFFSET));
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
  // 模拟尚未跑完时也会被调用（模型分批到位就渲染一帧），缺字段按空处理。
  const g = gauges.series ?? new Map();
  const ph = gauges.phases ?? new Map();
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
/** 枪口来源：bake=数值表（默认，无模型也能算），glb=摆姿势取骨骼（旧路径，用于对拍）。 */
let muzzleSource = 'bake';

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

// ---------- 角色（分两段构建：先骨架，后模型） ----------
/**
 * 骨架：只建挂点、脚环、名牌与时间轴所需数值。
 * 时长与 Shot 时刻取自烘焙表，所以「模型没到」也能算出完整动作时间轴与弹道。
 */
function createCharacterSkeleton(cfg, group) {
  // 外层只承载挂点；内部层仅为网页朝向层，不冒充角色原生 _model 绑定。
  const root = new THREE.Group();
  const model = new THREE.Group();
  root.add(model);
  model.updateMatrix();
  const modelBaseMatrix = model.matrix.clone();
  group.add(root);

  const durs = { ...(bakeDurations(cfg.id) ?? {}) };
  const clipEvents = {};
  const shot = bakeShotTime(cfg.id);
  if (shot != null) clipEvents.cover_shot = shot;

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

  return {
    code: cfg.id, name: cfg.name, team: cfg.team, label: cfg.label, weaponType:cfg.weaponType, maxAmmo:cfg.maxAmmo,
    root, model, modelBaseMatrix, mixer:null, actions:{}, durs, clipEvents, ring, tag,
    tracer: null, timeline: [], nativeMuzzles: [], stateSpeeds:requireBinding(nativeShooting,cfg.id).stateSpeeds,
    modelLoaded: false,
  };
}

/** 模型到位：补 Mixer / 动作 / 原生挂点，并把 tracer 的枪口取样接回骨骼。 */
async function attachModel(ch, cfg, glb) {
  ch.model.add(glb.scene);
  const mixer = new THREE.AnimationMixer(glb.scene);
  const actions = {};
  for (const clip of glb.animations) {
    const name = clip.name.replace(`${cfg.id}_`, '');
    actions[name] = mixer.clipAction(clip);
    ch.durs[name] = clip.duration;
    if (name === 'aim_idle') actions[name].setLoop(THREE.LoopRepeat, Infinity);
    else { actions[name].setLoop(THREE.LoopOnce, 1); actions[name].clampWhenFinished = true; }
  }
  ch.mixer = mixer;
  ch.actions = actions;
  // 烘焙表优先，与骨架阶段同口径：GLB 只补表里缺的剪辑，不覆盖表里的值。
  const bakedDurs = bakeDurations(cfg.id);
  if (bakedDurs) for (const [k, v] of Object.entries(bakedDurs)) ch.durs[k] = v;
  // 剪辑内的逻辑结算点（GLB extras.events，如 {t, fn:'Shot'}）：
  // FIRE 事件对应剪辑内 t 时刻，动画要提前 t×60 帧开播才能对上枪口帧
  const clipEvents = extractShotEvents(glb, cfg.id);
  const bakedShot = bakeShotTime(cfg.id);
  if (bakedShot != null) clipEvents.cover_shot = bakedShot;
  ch.clipEvents = clipEvents;
  // Bindings come from the asset export layer, not the shot table: a character can
  // have shot physics and still ship no exported muzzle. Fail by name, not by
  // passing undefined into the node-path matcher.
  ch.nativeMuzzles = await bindNativeMuzzles(glb, requireBinding(nativeShooting, cfg.id));
  ch.modelLoaded = true;
  if (ch.tracer) {
    ch.tracer.resolveOrigin = (fire, projectileIndex) => {
      applyPose(ch, poseAt(ch, fire));
      applyModelFacing(ch.model, ch.modelBaseMatrix, facingAt(ch, fire));
      const origin = muzzleWorldAtPose(ch, projectileIndex);
      applyPose(ch, poseAt(ch, S.frame));
      applyModelFacing(ch.model, ch.modelBaseMatrix, facingAt(ch, S.frame));
      return origin;
    };
  }
}

/**
 * 场地未到位时的落脚平面：尺寸按站位范围铺开，先让弹道与脚环落在可见地面附近。
 */
function addPlaceholderGround(arenaJson) {
  const pts = arenaJson.covers.map((c) => new THREE.Vector3(...toGltf(c.character_position)));
  const box = new THREE.Box3().setFromPoints(pts);
  const size = box.getSize(new THREE.Vector3());
  const c = box.getCenter(new THREE.Vector3());
  const span = Math.max(size.x, size.z, 12) * 1.6;
  const grid = new THREE.GridHelper(span, 20, 0x2a3140, 0x1b202b);
  grid.position.set(c.x, 0, c.z);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(span, span),
    new THREE.MeshBasicMaterial({ color: 0x11151c, transparent: true, opacity: 0.9 }),
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(c.x, -0.01, c.z);
  const holder = new THREE.Group();
  holder.add(plane, grid);
  scene.add(holder);
  return holder;
}

/** 分批拉模型：同一时刻最多 3 个在飞，每到一个就渲染一帧，边看边长。 */
async function loadModelsProgressive(cfgs, concurrency = 3) {
  const queue = cfgs.map((cfg, i) => ({ cfg, ch: chars[i] }));
  let done = 0;
  const failed = [];
  const worker = async () => {
    while (queue.length) {
      const { cfg, ch } = queue.shift();
      const entry = indexByCode.get(cfg.id);
      try {
        const glb = await loadGlb(`${ASSET}/out/sd_batch/${entry.file}`);
        await attachModel(ch, cfg, glb);
      } catch (err) {
        failed.push(`${cfg.name}：${err.message}`);
        console.warn('[stage] 模型加载失败', cfg.id, err);
      }
      done++;
      status.textContent = `模型 ${done}/${cfgs.length}${failed.length ? ` · 失败 ${failed.length}` : ''}…`;
      renderFrame();
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length || 1) }, worker));
  return failed;
}

// ---------- 启动 ----------
async function boot() {
  const q = new URLSearchParams(location.search); // ?n=1 只加载一人（调试用）?look= / ?cam= / ?debug=1
  if (q.get('muzzle') === 'glb') muzzleSource = 'glb'; // 对拍用：强制走骨骼采样
  // 默认「数值优先」：场地模型与小人模型后台加载，首帧不等它们。
  // ?eager=1 恢复旧顺序（全部资源到位再算），?muzzle=glb / ?debug=1 必须走旧顺序。
  const eager = q.get('eager') === '1' || q.has('debug') || muzzleSource === 'glb';
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
  status.textContent = '加载场地配置…';
  let arenaJson = await loadArenaJson(S.arena);
  mark('data');

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
  $('data-limit').textContent=`${intlShot.length ? `${intlShot.map(c=>c.name).join('、')}的射击配置暂用国际服表（国服表无该角色）` : '射击配置均来自国服表'}${fallbackFx.length ? `；${fallbackFx.map(c=>c.name).join('、')}暂用同枪种默认特效，专属特效尚未核对` : ''}${noFx.length ? `；${noFx.map(c=>c.name).join('、')}的特效绑定尚未核对` : ''}${ambiguous.length ? `；${ambiguous.map(c=>c.name).join('、')}存在技能表归属不明确` : ''}${muzzleSource === 'glb' ? '；枪口按 GLB 骨骼采样（对拍模式）' : (muzzleBakeCount() ? `；枪口取数值表 ${muzzleBakeCount()} 个角色（缺口 ${muzzleBakeGaps().length}）` : '；枪口表缺失，回退骨骼采样')}。`;
  const limit = Number(q.get('n'));
  if (limit > 0) cfgs.length = Math.min(limit, cfgs.length);

  // ---- 命中几何：站位/瞄准点/掩体 → 飞行帧数与实例数（替代手填参数） ----
  rebuildGeometry(arenaJson, cfgs);


  // 场地模型只服务渲染：立刻开始下载，数值链不 await 它。
  const placeholder = eager ? null : addPlaceholderGround(arenaJson);
  const arenaTask = loadArenaScene(S.arena, arenaGroup, arenaJson);

  // ---- 第一段：数值与骨架。只依赖配置 + 烘焙表，不等场地模型和角色模型 ----
  status.textContent = '计算模拟…';
  const group = new THREE.Group();
  scene.add(group);
  chars = cfgs.map((cfg) => createCharacterSkeleton(cfg, group));
  if (eager) {
    // 旧顺序：先备齐场地与模型再算。?muzzle=glb 对拍与 ?debug=1 需要真实的骨骼/包围盒。
    await arenaTask;
    mark('arena');
    status.textContent = `加载小人 0/${cfgs.length}…`;
    await loadModelsProgressive(cfgs, 4);
    mark('models');
  }
  runSimulation(cfgs);
  mark('sim');

  status.textContent = '加载弹体形状…';
  const projIndex = await loadJson(`${ASSET}/projectile/projectiles_index.json`).catch(() => ({ items: [] }));
  const projectileCache = new Map();
  const loadProjectile = (url) => {
    if (!projectileCache.has(url)) projectileCache.set(url, loadGlb(url));
    return projectileCache.get(url);
  };
  const projectileAssets = await Promise.all(cfgs.map((cfg) =>
    loadProjectileAsset(cfg, projIndex, loadProjectile, `${ASSET}/projectile`)));

  // 弹道线只依赖弹体形状与命中几何，模型还没到也能画。
  cfgs.forEach((cfg, i) => {
    chars[i].tracer = createTracer(group, geoByCode.get(cfg.id), cfg, projectileAssets[i]);
  });

  placeAll();
  fitCameraToChars();
  refreshCharacters();
  bindControls();
  requestAnimationFrame(tickLoop);
  setFrame(q.get('frame') ? Number(q.get('frame')) : 0);
  // 首帧达成：此后再下载的都算「后台补齐」，不计入首屏。
  firstFrameBytes = preloadBytes;
  paintReady = true;
  mark('first-frame');
  status.textContent = `数值就绪 · ${chars.length} 人 · ${events.length} 事件 · ${markText()}`;

  // ---- 第二段：场地与小人后台补齐。首帧、拖动、播放都不等它们 ----
  const finishStatus = (failed = []) => {
    status.textContent = `就绪 · ${chars.length} 人 · ${events.length} 事件 · ${window.__arenaBox ?? ''} · ${markText()}`
      + (failed.length ? ` · 模型失败 ${failed.length}` : '')
      + (muzzleFallbackIds.size ? ` · 枪口兜底 ${[...muzzleFallbackIds].join('、')}（表缺该皮肤）` : '');
  };
  if (!eager) {
    arenaTask.then(() => {
      mark('arena');
      placeholder?.remove();
      placeAll();
      refreshCharacters();
      renderFrame();
      finishStatus();
    }).catch((err) => {
      console.error(err);
      // 场地只是壳：加载失败也保留数值与弹道，别把整页推进失败态。
      status.textContent = `场地加载失败：${err.message}（数值仍可用）`;
    });
    loadModelsProgressive(cfgs, 3).then((failed) => {
      mark('models');
      refreshCharacters();
      renderFrame();
      finishStatus(failed);
    });
  }

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
      // 契约 JSON 决定站位与命中几何，必须先到；场景模型随后到也不影响数值。
      arenaJson = await loadArenaJson(S.arena);
      rebuildGeometry(arenaJson, cfgs);
      placeAll();
      runSimulation(cfgs);
      refreshCharacters();
      fitCameraToChars();
      renderFrame();
      status.textContent = `就绪 · 场地模型加载中…`;
      await loadArenaScene(S.arena, arenaGroup, arenaJson);
      placeAll();
      refreshCharacters();
      renderFrame();
      status.textContent = `就绪 · ${chars.length} 人 · ${events.length} 事件 · ${window.__arenaBox ?? ''}`;
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
  setFrame(q.get('frame') ? Number(q.get('frame')) : 0);
  requestAnimationFrame(tickLoop);
  finishStatus();
}

boot().catch((err) => {
  console.error(err);
  status.textContent = `失败：${err.message}`;
});
