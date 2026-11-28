/**
 * E6 —— 角色数据加载（data/characters.json，2026-10-30 global 表导出）
 *
 * JSON 结构（资源Id → 配置）：{ name, charId, shotId, shot{...}, skills[{skill,id,ft,value,...}] }
 * shot 字段与 CharacterShotTable 一致；skills 为该角色三技能 1 级的 FunctionTable 行。
 */

import { resolvePreferTarget } from '../stage/native-data.js';
import { pickOnStartBuffs } from './skills.js';
import { ARENA_POSTURE_PROFILES } from '../../data/arena-posture-profiles.js';

/**
 * 按变体策略挑技能行：want='treasure' 时每个技能组优先珍藏品行，组内没有则回退普通。
 * @param {Array<{skill:string, variant:string}>} skills
 */
export function pickVariantSkills(skills, variant='normal') {
  const want = variant;
  if (!['normal','treasure'].includes(want)) throw new RangeError('Unknown character skill variant');
  const byGroup = new Map();
  for (const s of skills) {
    if (!byGroup.has(s.skill)) byGroup.set(s.skill, []);
    byGroup.get(s.skill).push(s);
  }
  const out = [];
  for (const rows of byGroup.values()) {
    const chosen = rows.filter((s) => s.variant === want);
    out.push(...(chosen.length ? chosen : rows.filter((s) => s.variant === 'normal')));
  }
  return out;
}

/**
 * @param {object} db loadCharacters() 输出
 * @param {string|number} resourceId 资源 Id（如 '100' 拉普拉斯）
 * @returns {{name:string, shot:object, skills:Array}}
 */
export function getCharacter(db, resourceId) {
  const c = db[String(resourceId)];
  if (!c) throw new RangeError(`getCharacter: 未知资源Id ${resourceId}`);
  return c;
}

/**
 * 把 JSON 角色转成 CharacterRunner 配置（含 OnStart 自动挂载的 buff）。
 * @param {object} c getCharacter 输出
 * @returns {object} CharacterRunner cfg
 */
export function toRunnerConfig(c, {variant,treasure,treasurePhase,reloadTimeUnits,reloadSpeedBp=0,hasPresentation=false,presentationKind='sd'} = {}) {
  if (!['sd', 'spine'].includes(presentationKind)) throw new RangeError('Unknown presentation kind');
  if(treasure!==undefined){
    if(typeof treasure!=='boolean')throw new TypeError('treasure must be boolean');
    const selected=treasure?'treasure':'normal';
    if(variant!==undefined&&variant!==selected)throw new RangeError('Conflicting skill variant options');
    variant=selected;
  }
  let phaseProfile;
  if(treasurePhase!==undefined){
    if(!Number.isInteger(treasurePhase)||treasurePhase<0)throw new RangeError('Invalid treasure phase');
    const selected=treasurePhase===0?'normal':'treasure';
    if(variant!==undefined&&variant!==selected)throw new RangeError('Conflicting treasure phase options');
    variant=selected;
    if(treasurePhase>0){
      phaseProfile=c.treasurePhases?.find(p=>p.phase===treasurePhase);
      if(!phaseProfile)throw new RangeError('Treasure phase data not available');
    }
  }
  const s = c.shot;
  const selectedVariant=variant??c.defaultSkillVariant??'normal';
  const enrich=row=>({...row,...c.functionMetadata?.[row.id]});
  const skills = (phaseProfile?Object.entries(phaseProfile.slotVariants).flatMap(([slot,selected])=>
    pickVariantSkills(c.skills.filter(row=>row.slot===slot),selected)):
    pickVariantSkills(c.skills,selectedVariant)).map(enrich);
  const chargeVariant=phaseProfile?.variant??selectedVariant;
  const sourceProgram=c.chargeFunctionPrograms?.find(p=>p.variant===chargeVariant);
  if(phaseProfile&&!sourceProgram)throw new RangeError('Treasure phase function graph not available');
  return {
    id: c.name,
    burstModifierArithmetic:c.region==='global'?'pooled-stat-round':'per-row-truncate',
    // Arena-specific priority, else base. One resolver so stage and core agree.
    preferTarget:resolvePreferTarget(s.nativeProfile),
    weaponType: s.weaponType,
    weaponTypeCode: {None:0,AR:1,RL:2,SR:3,MG:4,SG:5,AS:6,GL:7,PS:8,SMG:9}[s.weaponType],
    elements: c.elements,
    elementIds:c.elementIds,
    onCheckTimeCycleUnits:c.onCheckTimeCycleUnits,
    chargeVariant,
    treasurePhase,
    chargeBindings: c.chargeBindings,
    chargeFunctionProgram:sourceProgram?{...sourceProgram,nodes:sourceProgram.nodes.map(enrich)}:undefined,
    inputType: s.inputType,
    rateOfFire: s.rateOfFire,
    endRof: s.endRof,
    changePerShot: s.changePerShot,
    chargeTimeUnits: s.chargeTime,
    maxAmmo: s.maxAmmo,
    reloadTimeUnits: reloadTimeUnits??s.reloadTime,
    reloadSpeedBp,
    reloadBulletBp: s.reloadBulletBp,
    preDelayUnits: s.preDelay,
    postDelayUnits: s.postDelay,
    aimRecovery: s.postDelay == null ? undefined : {
      postDelayUnits: s.postDelay,
      hasPresentation,
      presentationKind,
      policy: ARENA_POSTURE_PROFILES[c.region],
    },
    mfsUnits: s.mfs,
    fireTimingUnits: s.fireTiming,
    burstEnergyBp: s.burstEnergyBp, // 每实例充能（raw，10000 = 1%），命中时结算
    targetBurstEnergyBp: s.targetBurstEnergyBp,
    fullChargeBurstEnergyBp: s.fullChargeBurstEnergyBp,
    fireType: s.fireType,
    projectileSpeed: s.projectileSpeed,
    projectileTicks: s.projectileTicks ?? 0,
    shotCount: s.shotCount,
    muzzleCount: s.muzzleCount,
    penetration: s.penetration,
    explosionRange: s.explosionRange,
    initialAcc: 1, // 入场动画预满槽
    onStartBuffs: pickOnStartBuffs(skills.map((x) => ({
      id: x.id, groupId: x.group ?? x.skill, ft: x.ft, value: x.value,
      buffType:x.buffType,buffRemoveType:x.buffRemoveType,
      standard: x.standard, valueType: x.valueType,
      durationType: x.durationType, durationValue: x.durationValue, trigger: x.trigger, target: x.target,
      statusTrigger: x.statusTrigger, statusTrigger2: x.statusTrigger2, statusStandard:x.statusStandard, delayValue: x.delayValue,
    }))),
    // 充能技能行（FT111 trigger38 / FT102 trigger43）由 driver 的 pickChargeRows 分拣接线
    skills: skills.map((x) => ({
      id: x.id, skill: x.skill, slot:x.slot, groupId:x.group ?? x.skill, ft: x.ft, value: x.value,
      buffType:x.buffType,buffRemoveType:x.buffRemoveType,
      standard: x.standard, valueType: x.valueType,
      durationType: x.durationType, durationValue: x.durationValue, trigger: x.trigger,
      target: x.target, statusTrigger: x.statusTrigger, statusTrigger2: x.statusTrigger2, statusStandard:x.statusStandard, statusValue:x.statusValue,
      delayType: x.delayType, delayValue: x.delayValue, triggerValue:x.triggerValue, fullCount:x.fullCount, level: x.level, variant: x.variant,
    })),
  };
}
