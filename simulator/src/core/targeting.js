/**
 * V2 —— 目标选择（TargetingLogic 的可执行子集）
 *
 * 原生依据：
 *   GetCandidateList 0x5DEF3B0 → 候选池（存活 + 射界内）
 *   GetPreferTargetList 0x5DF19D0 → 嘲讽列表优先，再按 PreferTargetType 排序
 *   IsInShootingZone 0x5DF6900 → 射界过滤
 *   FunctionType 31=Taunt / 177=ImmuneTaunt
 *   TryCharacterFire：主目标打不到 → 0x5E07930 重查；查到别人就换目标，全无才空枪
 *
 * PreferTargetType 枚举（dump 1364823）按名字直译实现；未覆盖的编号会回退为"列表顺序"
 * 并在结果里标记 unsupported，避免静默给错答案。
 */

/** PreferTargetType（仅列实现覆盖到的） */
export const PREFER = {
  None: 0,
  Attacker: 1, Defender: 2, Supporter: 3,
  Front: 7, Back: 8, Left: 9, Right: 10,
  LowHP: 11, HighHP: 12, HighMaxHP: 13,
  LowDefence: 14, HighDefence: 15, LowAttack: 16, HighAttack: 17,
  TargetSR: 24, TargetAR: 25, TargetAS: 26, TargetRL: 27, TargetGL: 28, TargetPS: 29,
  BurstStep: 30, Random: 31,
  NearAim:53,
  SlotOrder:55, ReverseSlotOrder:56,
};

const point3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
/** Native GetNormalVectorToAimRay: magnitude of (head-origin) cross direction. */
export function distanceToAimRay(point,ray){
 if(!point3(point)||!point3(ray?.origin)||!point3(ray?.direction))return null;
 const f=Math.fround,d=ray.direction.map(f);
 const length=f(Math.sqrt(f(f(f(d[0]*d[0])+f(d[1]*d[1]))+f(d[2]*d[2]))));
 if(!length)return null;
 const unit=d.map(v=>f(v/length)),v=point.map((p,i)=>f(f(p)-f(ray.origin[i])));
 const cross=[f(f(v[1]*unit[2])-f(v[2]*unit[1])),f(f(v[2]*unit[0])-f(v[0]*unit[2])),f(f(v[0]*unit[1])-f(v[1]*unit[0]))];
 return f(Math.sqrt(f(f(f(cross[0]*cross[0])+f(cross[1]*cross[1]))+f(cross[2]*cross[2]))));
}

/** Skill aim selection reuses the targeting owner; absent ranking inputs are
 * not replaced by arbitrary roster order. Random expected mode keeps all aims.
 */
export function skillAimChoices(candidates,prefer,{probabilityMode='expected',random,aimRay,
 missingRankingPolicy='require-input',currentTargetId}={}){
 let pool=getCandidates(candidates);const kind=PREFER[prefer];
 if(kind==null)return {supported:false,reason:'skill-aim-preference-not-connected'};
 if(!pool.length)return {supported:true,choices:[]};
 if(prefer==='NearAim'&&pool.length>1){
  pool=pool.map(c=>({...c,aimDistance:distanceToAimRay(c.aimPosition,aimRay)}));
  if(pool.some(c=>c.aimDistance==null))return {supported:false,reason:'skill-aim-ray-input-required'};
 }else if(prefer==='NearAim')pool=pool.map(c=>({...c,aimDistance:0}));
 if(prefer==='Random'&&probabilityMode==='expected')return {supported:true,
  choices:pool.map(target=>({target,probability:1/pool.length}))};
 const field=({LowHP:'hp',HighHP:'hp',HighMaxHP:'maxHp',LowDefence:'defence',HighDefence:'defence',
  LowAttack:'attack',HighAttack:'attack'})[prefer];
 if(pool.length>1&&field&&pool.some(c=>!Number.isFinite(c[field]))){
  if(missingRankingPolicy!=='current-target')
   return {supported:false,reason:'skill-target-ranking-input-required',rankingField:field,preferTarget:prefer};
  const target=pool.find(candidate=>candidate.id===currentTargetId)??pool[0];
  return {supported:true,ordered:[target,...pool.filter(candidate=>candidate!==target)],
   choices:[{target,probability:1}],usedRankingFallback:true,rankingField:field};
 }
 const result=selectTarget(pool,{preferTarget:kind,rand:random});
 if(result.unsupported)return {supported:false,reason:'skill-aim-preference-not-connected'};
 return {supported:true,ordered:result.candidates,choices:result.target?[{target:result.target,probability:1}]:[]};
}

const WEAPON_BY_PREFER = {
  24: 'SR', 25: 'AR', 26: 'SMG', 27: 'RL', 28: 'GL', 29: 'PS',
};
const CLASS_BY_PREFER = { 1: 'attacker', 2: 'defender', 3: 'supporter' };

/**
 * 候选池：存活 + 射界内。
 * @param {Array} enemies 敌人列表（字段见文件头）
 * @param {{ignoreZone?:boolean}} opts
 */
export function getCandidates(enemies, opts = {}) {
  return enemies.filter((e) => e.alive !== false && (opts.ignoreZone ? true : e.inZone !== false));
}

/** Element-condition branch used by native skill target selection. */
export function getSkillChargeCandidates(enemies, condition = 'None') {
  const candidates=getCandidates(enemies);
  if(condition==='None'||condition==='IncludeNoneTargetLast')return {candidates,missingElements:false};
  if(condition!=='OnlyWind')return {candidates:[],missingElements:false,unsupported:true,reason:'skill-target-condition-not-connected'};
  if(candidates.some(c=>!Array.isArray(c.elements)))return {candidates:[],missingElements:true};
  return {candidates:candidates.filter(c=>c.elements.includes('Wind')),missingElements:false};
}

/**
 * 嘲讽优先：有可嘲讽目标时只在其内选。
 * @param {Array} candidates
 */
export function applyTaunt(candidates) {
  const taunts = candidates.filter((e) => e.taunting && !e.immuneTaunt);
  return taunts.length ? taunts : candidates;
}

function cmpNum(a, b, key, desc) {
  const va = a[key] ?? 0, vb = b[key] ?? 0;
  return desc ? vb - va : va - vb;
}

/**
 * 选择目标。
 * @param {Array} enemies
 * @param {{preferTarget?:number, selfId?:string, opts?:{ignoreZone?:boolean}, rand?:()=>number}} cfg
 * @returns {{target:object|null, candidates:Array, usedTaunt:boolean, unsupported:boolean}}
 */
export function selectTarget(enemies, cfg = {}) {
  const prefer = cfg.preferTarget ?? 0;
  const pool0 = getCandidates(enemies, cfg.opts);
  const pool = applyTaunt(pool0);
  const usedTaunt = pool.length !== pool0.length || (pool.length > 0 && pool[0].taunting);
  if (!pool.length) return { target: null, candidates: [], usedTaunt: false, unsupported: false };

  let list = pool.slice();
  // LastSelf/FirstSelf 语义：自带过滤，这里按名字近似
  if (prefer >= 18 && prefer <= 23 && cfg.selfId) {
    const rest = list.filter((e) => e.id !== cfg.selfId);
    if (rest.length) list = rest;
  }
  if (prefer >= 32 && prefer <= 37 && cfg.selfId) {
    const self = list.find((e) => e.id === cfg.selfId);
    if (self) return { target: self, candidates: list, usedTaunt, unsupported: false };
  }

  let unsupported = false;
  switch (prefer) {
    // GetPreferTargetList(0x5DF19D0): None leaves the candidate order intact.
    // GetTargetList's later SortSqrMagnitude operates on REMAINING candidates
    // after preferred entries were removed (0x5DF5514..5560), not this list.
    case PREFER.None: break;
    case 1: case 2: case 3: { // Attacker/Defender/Supporter
      const want = CLASS_BY_PREFER[prefer];
      const f = list.filter((e) => e.charClass === want);
      if (f.length) list = f;
      break;
    }
    case 4: case 5: case 6: { // 同名 + Random
      const want = CLASS_BY_PREFER[prefer - 3];
      const f = list.filter((e) => e.charClass === want);
      list = f.length ? f : list;
      const r = (cfg.rand ?? Math.random)();
      return { target: list[Math.floor(r * list.length) % list.length], candidates: list, usedTaunt, unsupported };
    }
    case 7: list.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0)); break;              // Front 最近
    case 8: list.sort((a, b) => (b.distance ?? 0) - (a.distance ?? 0)); break;              // Back 最远
    case 9: list.sort((a, b) => (a.x ?? 0) - (b.x ?? 0)); break;                            // Left
    case 10: list.sort((a, b) => (b.x ?? 0) - (a.x ?? 0)); break;                           // Right
    case 11: list.sort((a, b) => cmpNum(a, b, 'hp', false)); break;                          // LowHP
    case 12: list.sort((a, b) => cmpNum(a, b, 'hp', true)); break;                           // HighHP
    case 13: list.sort((a, b) => cmpNum(a, b, 'maxHp', true)); break;                        // HighMaxHP
    case 14: list.sort((a, b) => cmpNum(a, b, 'defence', false)); break;
    case 15: list.sort((a, b) => cmpNum(a, b, 'defence', true)); break;
    case 16: list.sort((a, b) => cmpNum(a, b, 'attack', false)); break;
    case 17: list.sort((a, b) => cmpNum(a, b, 'attack', true)); break;
    case 18: case 19: case 20: case 21: case 22: case 23: {
      const map = { 18: 11, 19: 12, 20: 14, 21: 15, 22: 16, 23: 17 };
      const sub = map[prefer];
      list = selectTarget(list, { preferTarget: sub, selfId: cfg.selfId }).candidates;
      break;
    }
    case 24: case 25: case 26: case 27: case 28: case 29: {
      const w = WEAPON_BY_PREFER[prefer];
      const f = list.filter((e) => e.weaponType === w);
      if (f.length) list = f;
      break;
    }
    case 30: unsupported = true; break; // BurstStep 需要爆发链数据，V2 不实现
    case 53:
      if(list.some(c=>!Number.isFinite(c.aimDistance)))unsupported=true;
      else list.sort((a,b)=>a.aimDistance-b.aimDistance);
      break;
    case 55: case 56:
      if(list.length>1&&list.some(c=>!Number.isInteger(c.slotIndex)))unsupported=true;
      else list.sort((a,b)=>prefer===55?a.slotIndex-b.slotIndex:b.slotIndex-a.slotIndex);
      break;
    case 31: { // Random
      const r = (cfg.rand ?? Math.random)();
      return { target: list[Math.floor(r * list.length) % list.length], candidates: list, usedTaunt, unsupported: false };
    }
    default: unsupported = true;
  }
  return { target: list[0] ?? null, candidates: list, usedTaunt, unsupported };
}
