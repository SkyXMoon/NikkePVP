/**
 * V2.1 —— FT → 伤害系数映射（SetCasterDamageInfos 0x5B22030 配对表的可执行版）
 *
 * 每条技能效果行的 FT 对应一个 DamageInfoByAttackType 字段 → CalculateDamage 的系数槽。
 * 同 FT 多行（同一角色多个技能）按 A4 语义累加（万分比求和）。
 *
 * 【未映射】FT76 DamageRatioUp（AllDamage +0x58）在 GetDamage 内的目标槽未查，
 *   不猜——命中该 FT 的行会被跳过并计入 ignored。
 */

import { calculateDamage } from './damage.js';

/** FT → {slot, kind}；kind: additive | multiplicative */
export const FT_RATE_MAP = {
  80:  { slot: 'elementRate',         kind: 'multiplicative' },
  87:  { slot: 'coreShot',            kind: 'additive' },
  88:  { slot: 'coreShot',            kind: 'additive' },
  95:  { slot: 'addDamage',           kind: 'additive' },
  96:  { slot: 'break',               kind: 'additive' },
  106: { slot: 'singleBurst',         kind: 'additive' },
  112: { slot: 'parts',               kind: 'additive' },
  113: { slot: 'projectile',          kind: 'additive' },
  129: { slot: 'chargeDamageRate',    kind: 'multiplicative' },
  145: { slot: 'duration',            kind: 'additive' },
  149: { slot: 'penetration',         kind: 'additive' },
  160: { slot: 'defIgnore',           kind: 'additive' },
  161: { slot: 'defIgnore',           kind: 'additive' },
  162: { slot: 'bonusRange',          kind: 'additive' },
  172: { slot: 'barrier',             kind: 'additive' },
  183: { slot: 'sticky',              kind: 'additive' },
  184: { slot: 'projectileExplosion', kind: 'additive' },
};

/**
 * 从技能效果行构建伤害系数表。
 * @param {Array<{ft:number, value:number}>} skills
 * @returns {{rates:Record<string,number>, ignored:Array<{ft:number,value:number}>}}
 *   rates：可直接传给 calculateDamage；未映射 FT 列入 ignored（不猜槽位）。
 */
export function buildDamageRates(skills) {
  const sums = {};   // 加算槽 → Σ value (万分比)
  const mult = {};   // 乘算槽 → Σ value
  const ignored = [];
  for (const s of skills) {
    const m = FT_RATE_MAP[s.ft];
    if (!m || !s.value) { ignored.push({ ft: s.ft, value: s.value }); continue; }
    const k = m.kind === 'multiplicative' ? mult : sums;
    k[m.slot] = (k[m.slot] ?? 0) + s.value;
  }
  const rates = {};
  for (const [slot, v] of Object.entries(sums)) rates[slot] = 1 + v / 10000;
  for (const [slot, v] of Object.entries(mult)) rates[slot] = 1 + v / 10000;
  return { rates, ignored };
}

/**
 * 武器基础伤害输入（CharacterShotTable）。
 * @param {{damage:number|string, fullChargeDamage?:number|string, shotCount?:number, muzzleCount?:number}} shot
 * @param {{attack:number, fullCharge?:boolean}} p  attack = 攻击力（属性池输出）
 */
export function shotDamageInput(shot, { attack, fullCharge = false }) {
  const bp = fullCharge && shot.fullChargeDamage ? Number(shot.fullChargeDamage) : 10000;
  return {
    damage: attack * (Number(shot.damage) / 10000),
    chargeDamageRate: bp / 10000,
    shotCount: shot.shotCount || 1,
    muzzleCount: shot.muzzleCount || 1,
  };
}

/** 一站式：角色技能 + 武器行 + 攻击力 → 最终每实例伤害 */
export function computeShotDamage(skills, shot, { attack, fullCharge = false }) {
  const { rates, ignored } = buildDamageRates(skills);
  const input = shotDamageInput(shot, { attack, fullCharge });
  const dmg = calculateDamage({
    damage: input.damage,
    shotCount: input.shotCount,
    muzzleCount: input.muzzleCount,
    rates: { ...rates, chargeDamageRate: input.chargeDamageRate * (rates.chargeDamageRate ?? 1) },
  });
  return { damage: dmg, rates, ignored };
}
