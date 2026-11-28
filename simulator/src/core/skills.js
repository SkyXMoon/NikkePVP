/**
 * E6 —— 技能配置加载器
 *
 * 依据（6.11）：技能行为全在 FunctionTable 配置里，代码只提供触发时机。
 * 本模块把 FunctionTable.csv 的行解析成 buff 定义，供驱动器自动挂载。
 *
 * 字段映射（2026-10-30 global 表）：
 *   FunctionType        → 属性池（如 61=蓄速、14/108=弹匣、159=换弹时长）
 *   FunctionStandard    → 取整分池（1=逐条，其它=合流后一次取整）
 *   FunctionValueType   → 数值类型（绝对/百分比）
 *   FunctionValue       → 万分比
 *   DurationType/Value  → 时长计法与数值（1=TimeSec 秒）
 *   TimingTriggerType   → 触发时机（1=OnStart 战斗开始）
 *
 * V0 范围：只实现 OnStart（进战斗挂一次）触发；其余触发点后续加。
 */

import {compileDamageChargeTemplate} from './charge-templates.js';

const TRIGGER_ONSTART = 1;
// OnStart is evaluated for initially alive participants. Status standard 1 is User.
const onStartChargeConditions = d => !d.statusTrigger2 && !d.delayValue &&
  (!d.statusTrigger || (d.statusTrigger === 43 && d.statusStandard === 1));

/** 极简 CSV 解析（RFC4180 子集：支持引号与逗号） */
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/**
 * 解析 FunctionTable → buff 定义列表。
 * @param {string} csvText
 * @returns {Array<{id:string, groupId:string, ft:number, standard:number,
 *                  valueType:number, value:number, durationType:number,
 *                  durationValue:number, trigger:number}>}
 */
export function loadFunctionTable(csvText) {
  const rows = parseCsv(csvText);
  const head = rows[0];
  const col = (name) => head.indexOf(name);
  const cId = col('Id'), cG = col('GroupId'), cFT = col('FunctionType'),
    cStd = col('FunctionStandard'), cVT = col('FunctionValueType'),
    cV = col('FunctionValue'), cDT = col('DurationType'), cDV = col('DurationValue'),
    cTr = col('TimingTriggerType');
  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const x = rows[r];
    const ft = parseInt(x[cFT], 10);
    if (!Number.isFinite(ft)) continue;
    out.push({
      id: x[cId], groupId: x[cG], ft,
      standard: parseInt(x[cStd], 10) || 0,
      valueType: parseInt(x[cVT], 10) || 0,
      value: parseInt(x[cV], 10) || 0,
      durationType: parseInt(x[cDT], 10) || 0,
      durationValue: parseFloat(x[cDV]) || 0,
      trigger: parseInt(x[cTr], 10) || 0,
    });
  }
  return out;
}

/**
 * 挑出战斗开始时挂载的 buff（OnStart 且有时长）。
 * @param {Array} defs loadFunctionTable 输出
 * @param {{chargeSpeedFt?:number}} map FT → 效果类型（V0 只支持 chargeSpeed=61）
 */
export function pickOnStartBuffs(defs, map = { chargeSpeedFt: 61 }) {
  return defs
    .filter((d) => d.trigger === TRIGGER_ONSTART && d.value !== 0 &&
      !([13,61,102,146,159].includes(d.ft) && !onStartChargeConditions(d)) &&
      !([13,159].includes(d.ft) && d.target!=null && ![1,2].includes(d.target)) &&
      !(d.ft === 61 && d.target != null && d.target !== 1) &&
      !(d.ft === 146 && d.target != null && d.target !== 1))
    .map(rowToBuff);
}

/** FunctionTable 行 → FunctionTrack buff 定义（统一出口，充能侧复用） */
export function rowToBuff(d) {
  // standard / valueType 必须带出：FT102 的算术分支完全依赖这两个字段
  const b = {
    id: d.id, groupId: d.groupId, ft: d.ft, value: d.value,
    buffType:d.buffType,buffRemoveType:d.buffRemoveType,
    standard: d.standard ?? 0, valueType: d.valueType ?? 0, target: d.target, stacks: 1,
  };
  if (d.durationType === 1) {
    // TimeSec 的 DurationValue 是 0.01s 刻度：爱丽丝 FT102 dv=500 = 5s（契约定案），
    // 飞弹 DurationTime=100×0.01=1s 同惯例
    b.kind = 'time'; b.remain = d.durationValue / 100;
  } else {
    // 其余计法 V0 不模拟到期，当常驻
    b.kind = 'permanent'; b.remain = Infinity;
  }
  if (d.ft === 61) {
    b.effect = { kind: 'chargeSpeed', percent: d.value };
  }
  return b;
}

/**
 * 充能相关技能行分拣（characters.json 的 skills 行，2026-11-04）。
 * 有原生证据的触发时机才接线，其余原样列出（不猜语义）：
 *   - FT111 trigger 6 OnFullChargeShot：满蓄射击时直接充；目前仅支持自身目标
 *   - FT111 trigger 3 OnUseAmmo：个人累计消耗弹药达到阈值倍数时直接充
 *   - FT102 trigger 43 OnEndFullBurst：StepFull→None 跃迁（0x5F0A14A/0x5F0A1B2）时挂载
 *
 * FT111 trigger 38 OnSpawnTarget **不接线**：竞技场没有"目标出现"这个事件。
 * 客户端 `TeamContext.OnCheckPassiveSpawnTarget`（RVA 0x5F12060）的触发源是
 * `SpotMonster` 与 `MonsterSpawnActionEndEvent`，`SpotEventType` 里也没有泛化的
 * SpawnTarget，只有 CreateEntity / AppearedTargetMonster / MonsterSpawn / 
 * MonsterSpawnActionEnd 这几个怪物生成路径。竞技场十名妮姬都是 `SpotObjectType.Character`，
 * 不生成任何 SpotMonster。所以这一行落进 `unsupported`，由 `PVP_SCOPE_TRIGGERS`
 * 记成 `arena-no-spawn`——记录在案，但不充能。
 * 旧注释引用的 0x5E7A1C9 落在 `AddFunction` 内部，只证明充能公式，不证明派发。
 * @param {Array<{ft:number, trigger:number, id:string, skill?:string}>} skills
 * @returns {{ft111FullChargeShot:Array, ft111UseAmmo:Array, ft102EndFullBurst:Array, ft75HitRows:Array, unsupported:Array<{ft:number,trigger:number,id:string}>}}
 */
export function pickChargeRows(skills = []) {
  const ft111FullChargeShot = [];
  const ft111UseAmmo = [];
  const ft111TeamAmmo = [];
  const ft111NikkeDead = [];
  const ft61FullChargeShot = [];
  const ft12FullChargeShot = [];
  const ft102EndFullBurst = [];
  const ft75HitRows = [];
  const ft75HurtRows = [], ft111HurtRows = [];
  const unsupported = [];
  const excludedInPvp = [];
  for (const s of skills) {
    const damageTemplate=s.ft===75?compileDamageChargeTemplate(s):null;
    // DamageLogic.IsParts 0x5DBDD5C checks SpotMonster_TypeInfo (0x9824938).
    // NIKKE and cover hits cannot produce OnPartsHitRatio in arena battles.
    if(s.ft===75&&s.trigger===34)excludedInPvp.push({id:s.id,reason:'parts-hit-requires-monster'});
    else if(s.ft===12&&s.trigger===6&&s.target===1&&s.standard===1&&s.valueType===2&&s.durationType===1&&
      s.fullCount>=1&&!s.statusTrigger&&!s.statusTrigger2&&!s.delayValue)ft12FullChargeShot.push(s);
    else if(damageTemplate?.supported&&s.trigger!==7)ft75HitRows.push(s);
    else if(damageTemplate?.supported&&s.trigger===7)ft75HurtRows.push(s);
    else if ((s.ft === 111 && [7,13].includes(s.trigger) && s.target === 1) &&
      s.triggerValue > 0 && s.triggerValue <= 10000 && s.slot !== 'burst' && !s.statusTrigger && !s.statusTrigger2 && !s.delayValue)
      (s.ft === 75 ? ft75HurtRows : ft111HurtRows).push(s);
    else if (s.ft === 61 && s.trigger === 6 && s.target === 1 && s.fullCount === 1 &&
      (s.durationType === 2 || s.durationType === 3) && !s.statusTrigger && !s.statusTrigger2 && !s.delayValue) ft61FullChargeShot.push(s);
    else if (s.ft === 61 && s.trigger === 1 && (s.target == null || s.target === 1) && onStartChargeConditions(s)) { /* applied by onStartBuffs */ }
    // FT111 trigger 38 OnSpawnTarget 故意没有分支：竞技场没有派发源（见函数头注释），
    // 让它落到下面的 FT111 兜底桶，进 unsupported 后由 PVP_SCOPE_TRIGGERS 记成
    // arena-no-spawn。写一个空分支会把它从所有桶里抹掉——那正是"静默消失"的老问题。
    else if (s.ft === 111 && s.trigger === 6 && s.target === 1 && !s.statusTrigger && !s.statusTrigger2 && !s.delayValue) ft111FullChargeShot.push(s);
    else if (s.ft === 111 && s.trigger === 3 && s.target === 1 && s.triggerValue > 0 && !s.statusTrigger && !s.statusTrigger2 && !s.delayValue) ft111UseAmmo.push(s);
    else if (s.ft === 111 && s.trigger === 83 && s.target === 1 && s.triggerValue > 0 && !s.statusTrigger && !s.statusTrigger2 && !s.delayValue) ft111TeamAmmo.push(s);
    else if (s.ft === 111 && s.trigger === 44 && s.target === 1 && !s.triggerValue && !s.statusTrigger && !s.statusTrigger2 && !s.delayValue) ft111NikkeDead.push(s);
    else if (s.ft === 102 && s.trigger === 1 && (s.target === 1 || s.target === 2) &&
      onStartChargeConditions(s)) { /* applied by onStartBuffs */ }
    else if (s.ft === 146 && s.trigger === 1 && s.target === 1 && onStartChargeConditions(s)) { /* applied by onStartBuffs */ }
    else if (s.ft === 102 && s.trigger === 43 && (s.target == null || s.target === 1 || s.target === 2) &&
      !s.statusTrigger && !s.statusTrigger2 && !s.delayValue) ft102EndFullBurst.push(s);
    // FT12 is deliberately absent from the list below. StatExplosion is an
    // explosion-range attribute, consumed only to size the blast for a shot; its
    // one charge-side shape is the full-charge-shot branch above. Any FT12 row
    // left over has no charge semantics at all, so listing it here would invent a
    // gap rather than report one. That is one row in either region.
    else if ([61,14,108,13,159,16,102,111,146,214,75].includes(s.ft))
      // The row is charge-relevant but no wired template accepted it. The
      // `charge-row-` prefix marks a verdict about this legacy row shape only: a
      // validated native function program supersedes it, so the driver may retire
      // the row once the program implements the same node. Every record still
      // carries a reason, so triage never sees a bare row.
      unsupported.push({ ft: s.ft, trigger: s.trigger, id: s.id, skill: s.skill, ...(s.slot ? {slot:s.slot} : {}),
        // The condition slots travel with the record: a row can be triggered by one
        // event and gated by another, and the driver's gates have to see both to
        // judge it. 薇尔维特's FT214 fires on a full-charge shot count but is
        // conditioned on an OnCriticalHitNum count.
        ...(s.statusTrigger ? {statusTrigger:s.statusTrigger} : {}),
        ...(s.statusTrigger2 ? {statusTrigger2:s.statusTrigger2} : {}),
        reason: 'charge-row-' + (damageTemplate?.reason ?? 'template-not-connected') });
  }
  return { ft111FullChargeShot, ft111UseAmmo, ft111TeamAmmo, ft111NikkeDead, ft61FullChargeShot, ft12FullChargeShot, ft102EndFullBurst, ft75HitRows, ft75HurtRows, ft111HurtRows, unsupported, excludedInPvp };
}

/**
 * 感染类技能行分拣（哈兰 瘟疫转移 样式，2026-11-07 接入）。
 *
 * 结构证据（FunctionTargetType.Target=4，契约已证掩体是合法函数目标）：
 *   - FT70 Infection trigger=2(OnShotRatio)：攻击按 triggerValue/10000 概率对当前命中目标施加感染状态
 *   - FT75 Damage trigger=0 stT=18(IsFunctionOn)：目标带感染状态期间持续造成伤害
 *     技能文本「间隔1秒」「持续{description_value_02}秒」⇒ 每 1s 跳一次，持续 durationValue/100 秒
 *   两者同 skill/group 配成一对；施加行驱动 DOT 行的触发。
 *
 * @param {Array<{ft:number,trigger:number,statusTrigger:number,target:number,value:number,triggerValue:number,durationValue:number,group:string,skill:string,id:string}>} skills
 * @returns {{apply:Array, dot:Array}}
 *   apply: 施加感染的状态行（FT70 trigger2）
 *   dot:   持续伤害行（FT75 trigger0 stT18），target=4 且与某 apply 行同 skill
 */
export function pickInfectionRows(skills = []) {
  const apply = [];
  const dot = [];
  const applySkills = new Set();
  for (const s of skills) {
    if (s.ft === 70 && s.trigger === 2 && s.target === 4) {
      apply.push(s);
      applySkills.add(s.skill ?? s.group ?? s.groupId);
    }
  }
  for (const s of skills) {
    if (s.ft === 75 && s.trigger === 0 && s.statusTrigger === 18 && s.target === 4 &&
      applySkills.has(s.skill ?? s.group ?? s.groupId)) {
      dot.push(s);
    }
  }
  return { apply, dot };
}
