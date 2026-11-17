/**
 * E1/E2 —— 逐 tick 事件驱动器
 *
 * 复刻已证的服务端/客户端模拟驱动（2026-11-02）：
 *   - 驱动频率 30Hz（用户确认），每事件 dt 经三位小数舍入 = 0.033
 *     （UpdateSpot 0x3DAD0E0：_deltaTime=[舍入值]，PlayTime += dt）
 *   - 事件分派为同步调用（SendEventDefault 直接 call，无排队）
 *   - 单角色事件内顺序（ProcessWeaponLogic 0x5E07110）：
 *       UpdatePreDelay → MFS/UpTypeFireTiming → UpdateAccumFireDelay/发射判定
 *       → UpdateChargeTime → UpdateReload → RateOfFire
 *   - BT 相位：默认武器更新后求值，UP读取本次更新后的满蓄状态；
 *     btBeforeWeapon=true 表示另一侧相位
 *
 * 与 timeline.js（解析式组合）互为交叉验证：两者输出必须一致。
 */

import { EVENT_DT_30, f32 } from './time.js';
import { STANCE_AIM, PreDelayTimer, AccumFireTimer, ChargeTimer, MfsTimer, FIRE_THRESHOLD, reloadDurationTicks,TeamCheckTimeClock } from './timers.js';
import { FunctionTrack } from './functions.js';
import { calcChargeValue } from './charge.js';
import { statValue } from './stat.js';
import {getReloadTimeUnits} from './reload.js';
import { AimRecovery } from './aim-recovery.js';

/**
 * Critical-hit derived triggers (TimingTriggerType 45/46/47/48/84/86).
 * Crit rate is a probability factor, not a modelled stat, so anything gated by
 * these is excluded from first-charge reporting by decision, not by evidence.
 */
const CRITICAL_TRIGGERS = new Set(['OnCriticalHitNum','OnCriticalHitRatio','OnCriticalHitNumOnce',
  'OnCriticalHitRatioOnce','OnPelletCriticalHitNum','OnFunctionDamageCriticalHit']);
// The same six decisions, keyed the way a legacy skill row carries its trigger.
// Kept next to the name set so the two cannot drift: both mean "this row can only
// fire on a critical hit", and first-charge reporting drops it either way.
const CRITICAL_TRIGGER_IDS = new Set([45,46,47,48,84,86]);
import { selectTarget } from './targeting.js';
import { computeShotDamage } from './rates.js';
import { pickChargeRows, pickInfectionRows, rowToBuff } from './skills.js';
import { BurstGauge, BURST_GAUGE_MAX } from './burst.js';
import { settleChargeEvent, fullChargeRepeatResults, isFullChargeHit } from './charge-events.js';
import { matchChargeBindings } from './charge-bindings.js';
import { compileSkillEntities,compileHitCountObservers,SkillHitCountObserver } from './skill-entities.js';
import { getSkillChargeCandidates,skillAimChoices } from './targeting.js';
import { compileChargeTrigger, matchChargeTrigger, describeChargeEffect,compileConnectedPeriodicBindings } from './charge-templates.js';
import {ExpectedPeriodicState} from './periodic-charge.js';
import {FunctionProgram,isInstantShareEffect,pvpScopeFor,suppliedScopes} from './function-program.js';
import {expectedReactionTurns} from './reaction-expectation.js';

/**
 * 单角色运行时状态。
 * @param {{id:string, inputType:number, rateOfFire:number, chargeTimeUnits?:number,
 *          mfsUnits?:number, fireTimingUnits?:number, maxAmmo:number,
 *          reloadTimeUnits?:number, reloadSpeedBp?:number, reloadBulletBp?:number, preDelayUnits?:number,
 *          initialAcc?:number}} cfg
 */
export class CharacterRunner {
  constructor(cfg) {
    this.cfg = cfg;
    this.pre = new PreDelayTimer(cfg.preDelayUnits ?? 20);
    this.acc = new AccumFireTimer(cfg.rateOfFire, cfg.initialAcc ?? 0);
    this.endRof = cfg.endRof ?? cfg.rateOfFire;       // MG 爬升目标
    this.changePerShot = cfg.changePerShot ?? 0;       // 每发 RoF 增量（0x5F0661F）
    this.charge = cfg.inputType === 2 || cfg.inputType === 3
      ? new ChargeTimer((cfg.chargeTimeUnits ?? 100) / 100) : null;
    this.mfs = new MfsTimer();
    this.functions = new FunctionTrack();     // E5 账本：buff 全生命周期
    for (const b of cfg.onStartBuffs ?? []) if (!([13,102,159].includes(b.ft) && b.target === 2)) this.functions.add({...b,casterId:b.casterId ?? cfg.id});
    this.baseChargeUnits = cfg.chargeTimeUnits ?? 100; // 基础蓄力（0.01s）
    this.ammo = cfg.maxAmmo > 0 ? cfg.maxAmmo : Infinity; // SpotWeaponData .ctor: CurrentAmmo = MaxAmmo (0x5D0D268..276)
    this.usedAmmo = 0;
    this.fullChargeHits = 0;
    this.fullChargeShots = 0;
    this.pelletHits = 0;
    this.shotHits = 0;
    this.hurtCount = 0; // 受击次数；概率命中按期望累加，可以是小数
    this.reloadLeft = 0;
    this.reloadElapsed = f32(0);
    this.fireTimingLeft = 0; // UpTypeFireTiming 窗口（事件数）
    this.mfsIdlePending = false;
    // BT 在战斗开始（tick 1 之前）已请求 Aim（与 simulateUpCycle 的开局 Idle→Aim 一致）
    this.aiming = true;
    this.idleLeft = 0; // IT=2 发射后的 Idle 事件（ResetFire 借此触发）
    this.resumeAimPending = false;
    // This BT node resolves SpineCharacterPrefabController specifically.
    // SD presentation and headless arena paths do not enter its Spine wait.
    this.aimRecovery = cfg.aimRecovery?.hasPresentation && cfg.aimRecovery.presentationKind === 'spine'
      ? new AimRecovery(cfg.aimRecovery) : null;
    const reloadUnits=cfg.reloadTimeUnits==null?0:this.getReloadTimeUnits();
    this.reloadSpan = reloadUnits>0?reloadDurationTicks(reloadUnits):0;
    this.perReload = cfg.reloadBulletBp != null && cfg.maxAmmo > 0
      ? Math.round(cfg.maxAmmo * cfg.reloadBulletBp / 10000) : cfg.maxAmmo;
    // 弹匣上限是活的：FT14 StatAmmo 只改上限，不改当前弹量（原生每次读 MaxAmmo，
    // CurrentAmmo 只在 SpotWeaponData .ctor 里赋过一次初值）。叠加层数与到期由
    // FunctionTrack.applyState 负责（fullCount 封顶、TimeSec 递减），这里只把账本
    // 里的 FT14 条目折成武器上限：
    //   Percent（valueType 2）+ standard==1 → 走 statValue 的 stat-1 池，与 FT16/FT13 同路；
    //   Integer（valueType 1）→ 直接是「发」，按层数累加到上限上。
    // 混合形状（既有百分比又有固定发数）按「先缩放基础值、再叠加定值」处理，
    // 这一顺序尚未从原生证实，只有同时出现两种形状时才会走到。
    this.liveMaxAmmo = () => {
      if (!(this.cfg.maxAmmo > 0)) return this.cfg.maxAmmo;
      const rows = this.functions.byFt(14);
      if (!rows.length) return this.cfg.maxAmmo;
      let flat = 0;
      const percent = [];
      for (const b of rows) {
        const n = b.stacks ?? 1;
        if (b.valueType === 2) { if (b.standard === 1) percent.push({ p: b.value, n, standard: 1 }); }
        else flat += b.value * n;
      }
      const scaled = percent.length ? statValue(this.cfg.maxAmmo, percent).value : this.cfg.maxAmmo;
      return Math.max(0, scaled + flat);
    };
    this.livePerReload = () => {
      const cap = this.liveMaxAmmo();
      return this.cfg.reloadBulletBp != null && this.cfg.maxAmmo > 0
        ? Math.round(cap * this.cfg.reloadBulletBp / 10000) : cap;
    };
        // V2.1 伤害接入（数据显式输入）：
    //   attack + shot + skills → 每伤害实例数值（computeShotDamage，静态系数语义）
    //   hp > 0 → 该角色可受击：HP 扣减、归零判死（targeting 的 alive 过滤已在）
    // IT=2/3 只有满蓄才能开火（CanFire 门控）→ 满蓄倍率恒参与乘算区。
    this.perInstanceDamage = (cfg.attack > 0 && cfg.shot)
      ? computeShotDamage(cfg.skills ?? [], cfg.shot, {
          attack: cfg.attack, fullCharge: cfg.inputType === 2 || cfg.inputType === 3,
        }).damage : null;
    this.hp = cfg.hp > 0 ? cfg.hp : null;
    this.alive = true;
    // 充能技能行分拣（无原生证据的触发时机进 unsupported，不猜语义）：
    //   FT102 trigger43 OnEndFullBurst → 本队 BURST_END（StepFull→None）时挂载
    // 开局直充只剩 `burstCharges` 这一路 caller 输入；技能表里的 FT111 trigger38
    // OnSpawnTarget 在竞技场没有派发源（详见 skills.js 的 pickChargeRows 注释），
    // 已不再进任何"已实现"桶，只作为 arena-no-spawn 的缺口记录存在。
    const notRegistered=new Set((cfg.chargeBindings??[])
      .filter(row=>row.variant===cfg.chargeVariant&&(row.excludedNotRegistered||row.excludedUnreachable)).map(row=>row.id));
    const chargeRows = cfg.skills ? pickChargeRows(cfg.skills.filter(row=>!notRegistered.has(row.id))) : null;
    this.ft111FullChargeShotRows = chargeRows ? chargeRows.ft111FullChargeShot : [];
    this.ft111UseAmmoRows = chargeRows ? chargeRows.ft111UseAmmo : [];
    this.ft111TeamAmmoRows = chargeRows ? chargeRows.ft111TeamAmmo : [];
    this.ft111NikkeDeadRows = chargeRows ? chargeRows.ft111NikkeDead : [];
    this.ft61FullChargeShotRows = chargeRows ? chargeRows.ft61FullChargeShot : [];
    this.ft12FullChargeShotRows = chargeRows ? chargeRows.ft12FullChargeShot : [];
    const ft75Rows = chargeRows ? chargeRows.ft75HitRows : [];
    this.ft75HitRows = ft75Rows;
    this.ft75HurtRows = chargeRows?.ft75HurtRows ?? [];
    if(cfg.counterEnabled===false)this.ft75HurtRows=[];
    this.ft111HurtRows = chargeRows?.ft111HurtRows ?? [];
    this.chargeTriggerTemplates=new Map((cfg.skills??[]).map(row=>[row.id,compileChargeTrigger(row)]));
    this.ft102EndBurstBuffs = chargeRows
      ? chargeRows.ft102EndFullBurst.map((r) => ({ ...rowToBuff(r), casterId: cfg.id }))
      : [];
    const excludedProgramNodes=new Set((cfg.chargeFunctionProgram?.nodes??[])
      .filter(node=>node.excludedBeforeFirstBurst||node.excludedInPvp).map(node=>node.id));
    this.unsupportedChargeRows = chargeRows
      // Legacy rows reach here before the program-level gates can see them, so
      // the same decisions are applied on the raw trigger id. The row stays in
      // unsupportedCharge; only first-charge reporting drops it.
      ? chargeRows.unsupported.filter(row=>!excludedProgramNodes.has(row.id))
        .map(row=>{
          const scope=pvpScopeFor(row);
          // 只有 `trigger` 用 TimingTriggerType。`statusTrigger` 用的是另一套
          // StatusTriggerType 枚举，数值区间重叠但含义不同：TimingTriggerType 45 是
          // OnCriticalHitNum，StatusTriggerType 45 是 IsFunctionOff、46 是
          // IsCheckFunctionOverlapUp、48 是 IsCheckPosition。拿同一张暴击集合去判
          // 状态位，会把「本组未生效」这种普通前置条件当成暴击门控——贝斯蒂：战术升级
          // 的 209410101（statusTrigger 45 + statusValue 2094101）就是这样被剔出首槽清单的。
          const critGated=CRITICAL_TRIGGER_IDS.has(row.trigger);
          return {...row,
            ...(critGated?{criticalGated:true}:{}),
            ...(scope?{pvpScope:scope}:{})};
        })
      : [];
    this.unsupportedChargeRows.push(...(cfg.chargeFunctionProgram?.sourceGaps??[]));
    this.skillEntityBindings=compileSkillEntities(cfg.chargeBindings,{variant:cfg.chargeVariant,functions:cfg.skills,program:cfg.chargeFunctionProgram});
    // Program-only skill entities (no charge-binding row at all) are invisible to
    // matchChargeBindings, so their reasons have to be reported here or they would
    // stay silent. Bindings that do have a row keep the richer coverage entry below.
    for(const gap of this.skillEntityBindings.missing)
      if(!(cfg.chargeBindings??[]).some(row=>row.id===gap.id)&&!this.unsupportedChargeRows.some(row=>row.id===gap.id))
        this.unsupportedChargeRows.push({id:gap.id,ft:72,skill:gap.id,reason:gap.reason});
    this.observerBindings=compileHitCountObservers(cfg.chargeFunctionProgram);this.hitCountObservers=[];
    this.connectedPeriodic=compileConnectedPeriodicBindings(cfg.chargeBindings,cfg.chargeVariant);
    this.periodicFunctions=new Map();
    this.normalSkillCooldowns=new Map(this.skillEntityBindings.connected.filter(b=>b.automaticCooldown)
      .map(b=>[b.id,Math.fround(b.automaticCooldown)]));
    const implementedRows=[
      ...this.ft61FullChargeShotRows,...this.ft12FullChargeShotRows,
      ...this.ft75HitRows,...this.ft75HurtRows,...this.ft111HurtRows,
      ...this.ft111FullChargeShotRows,...this.ft111UseAmmoRows,
      ...this.ft111TeamAmmoRows,...this.ft111NikkeDeadRows,
      ...(cfg.onStartBuffs ?? []).filter(b=>[102,146].includes(b.ft)),
      ...(chargeRows?.ft102EndFullBurst ?? [])];
    this.legacyFunctionIds=new Set(implementedRows.map(row=>row.id));
    this.chargeTemplates=implementedRows.map(row=>({skillId:row.id,effect:describeChargeEffect(row.ft),
      trigger:this.chargeTriggerTemplates.get(row.id),timing:'native-event'}));
    this.chargeTemplates.push(...this.connectedPeriodic.connected.map(binding=>({skillId:binding.id,effect:'damage-result',
      templateId:'damage-result/PeriodicFunction',periodCentiseconds:100,durationUnits:binding.durationUnits,
      activations:binding.activations.map(a=>({functionId:a.id,trigger:a.chargeTrigger})),timing:'per-active-function'})));
    this.chargeBindingCoverage=matchChargeBindings(cfg.chargeBindings,{
      variant:cfg.chargeVariant,implementedIds:[...implementedRows.map(s=>'function:'+s.id),...this.skillEntityBindings.connected.map(s=>s.key),
        ...this.connectedPeriodic.connected.map(s=>s.key)]});
    const knownGaps=new Set(this.unsupportedChargeRows.map(s=>s.id));
    for(const row of this.chargeBindingCoverage.missing)if(!knownGaps.has(row.id)){
      const entityMiss=this.skillEntityBindings.missing.find(s=>s.key===row.key);
      const activationTriggers=(entityMiss?.activations??[]).map(a=>a.trigger);
      // A skill entity is only ever reserved through its activations, so when every
      // one of them is out of reach the binding is too — and the reason belongs to
      // the activation, not to this binding's own check.
      const activationScope=activationTriggers.length&&activationTriggers.every(t=>pvpScopeFor({trigger:t}))
        ?pvpScopeFor({trigger:activationTriggers[0]}):null;
      const bindingScope=pvpScopeFor(row)??activationScope;
      this.unsupportedChargeRows.push({id:row.id,ft:row.ft ?? 72,trigger:row.trigger,
        skill:row.id,slot:row.slots[0],chargeEntry:row.effect,
        cooldownUnits:entityMiss?.cooldownUnits??0,activationCount:entityMiss?.activationCount??0,
        ...(activationTriggers.length&&activationTriggers.every(t=>CRITICAL_TRIGGERS.has(t))?{criticalGated:true}:{}),
        ...(bindingScope?{pvpScope:bindingScope}:{}),
        reason:row.kind==='skill'?(entityMiss?.reason ?? 'native-skill-entity-handler-not-connected'):'native-function-handler-not-connected'});
      knownGaps.add(row.id);
    }
    // 感染技能（哈兰 瘟疫转移）：FT70 施加 + FT75 DOT。trigger=0 stT=18 的 FT75
    // 之前被 pickChargeRows 丢弃（ft75HitRows 只收 27/29/61），这里单独接入。
    const infRows = cfg.skills ? pickInfectionRows(cfg.skills) : null;
    this.infApplyRows = infRows ? infRows.apply : [];
    this.infDotRows = infRows ? infRows.dot : [];
    this.chargeTemplates.push(...this.infDotRows.map(row=>({skillId:row.id,effect:'damage-result',
      templateId:'damage-result/PeriodicFunction',periodCentiseconds:100,timing:'per-active-function',
      conditionTemplate:'infection-subset',conditionCoverage:'partial'})));
    // 感染状态账本：targetKey('id:kind') -> { remain, casterId }
    //   命中时由 FT70(trigger2 OnShotRatio) 按概率施加/刷新；每 1s(60F) 触发一次 FT75 DOT
    this.infected = new Map();
    this.rand = cfg.rand ?? Math.random; // 确定性由调用方传种子；缺省走全局随机
    // 满蓄穿透特化（技能2 捕食）：FT54 由满蓄射击激活，持续 N 发。
    // 激活形状有两种，效果是同一个：trigger 6 (OnFullChargeShot) 每次满蓄射击都触发；
    // trigger 60 (OnFullChargeShotNum) 只在第 N 次满蓄射击触发——43 的 204311001 是后者
    // （threshold 3、发数 1），原来只认 trigger 6，那一条就从来没被算过。
    this.penetrateLeft = 0;
    const ft54rows = (cfg.skills ?? []).filter((s) => s.ft === 54 && s.target === 1 && [6, 60].includes(s.trigger));
    this.ft54FullChargeShotRows = ft54rows.filter((s) => s.trigger === 6);
    this.ft54ShotCountRows = ft54rows.filter((s) => s.trigger === 60);
    this.ft54Duration = ft54rows.reduce((n, s) => n + (s.durationValue || 1), 0);
    // CurrentBurstChargeValue：武器侧每次 SetBurstChargeValue 写入的 perShot 值，
    // FT102 standard==1 分支读的是【施加者】的该值（C），不读伤害
    this.lastChargeValue = 0;
  }

  /**
   * 单事件更新。btBeforeWeapon: true 时 BT 在武器更新前请求 Aim。
   *
   * V1：输出动画可直接消费的事件流：
   *   AIM_START   进入瞄准（开局 BT 请求，动画播 ToAim）
   *   FIRE        发射（AimFire 触发）
   *   IDLE        发射后请求 Idle（IT=2 瞬时转换；动画播 ToIdle/ToCover）
   *   RELOAD_START 换弹开始（弹尽后的下一事件）
   *   RELOAD_DONE 换弹完成（弹匣恢复）
   *
   * @returns {{events:Array<{type:string}>}} 本事件产生的事件（可多个，顺序即动画顺序）
   */
  getReloadTimeUnits(){
    return getReloadTimeUnits(this.cfg.reloadTimeUnits??0,{
      reloadSpeedBp:this.cfg.reloadSpeedBp??0,functions:this.functions.list()});
  }

  isStunned(){return this.functions.byFt(6).length>0;}

  finishShot(shotFunctions, eventDt) {
    this.functions.onFire(shotFunctions);
    if (this.cfg.inputType !== 3) return;
    // UpdateAccumFireDelay dispatches the shot synchronously, then the native
    // weapon update calls UpdateChargeTime. Read the post-shot attribute pool.
    const units = calcChargeValue(this.baseChargeUnits, this.functions.chargeSpeedEntries()).units;
    this.charge.target = f32(units / 100);
    if (!this.isStunned() && this.reloadLeft === 0 && this.aiming && this.pre.isReady() &&
        this.mfs.current <= 0 && this.fireTimingLeft <= 0 && !this.charge.isFull()) {
      this.charge.tick(eventDt);
    }
  }

  /** 目标是否不可命中（射界内无目标）。blockedTicks: 事件序号数组；blockedRanges: [[from,to],...] */
  isBlocked(t) {
    const c = this.cfg;
    if (c.blockedTicks && c.blockedTicks.includes(t)) return true;
    if (c.blockedRanges) {
      for (const r of c.blockedRanges) if (t >= r[0] && t <= r[1]) return true;
    }
    return false;
  }

  step(eventDt, btBeforeWeapon = false, tick = 0, deferShotConsumption = false) {
    this.currentTick=tick;
    // --- BT 求值（前置相位）：请求 Aim ---
    const out = [];
    this.aimRecovery?.advancePreviousPresentation(eventDt);

    // Time-based effects continue to expire during reload as well as while firing.
    this.functions.tick(eventDt);
    const canAct=!this.isStunned();
    if (btBeforeWeapon && canAct && this.reloadLeft === 0 && this.aimRecovery?.ready) {
      this.aimRecovery.finish();
      this.aiming = true;
      out.push({ type: 'AIM_START' });
    }
    // Arena UpdateDefaultWeapon keeps dispatching ProcessWeaponLogic while
    // IsReloading. RoF accumulation and existing fire locks do not stop there.
    let effectiveRate=this.acc.rateOfFire;
    if(this.changePerShot===0&&Number.isFinite(this.cfg.rateOfFire)){
      const entries=ft=>this.functions.byFt(ft).filter(b=>b.standard===1&&b.valueType===2)
        .map(b=>({p:b.value,n:b.stacks??1,standard:1}));
      effectiveRate=Math.min(statValue(this.cfg.rateOfFire,entries(16)).value,
        statValue(this.endRof,entries(85)).value);
    }
    this.acc.tick(eventDt,effectiveRate);
    this.mfs.tick(eventDt);
    if (this.fireTimingLeft > 0) this.fireTimingLeft -= 1;

    // --- 换弹进度（UpdateReload 0x5E09190）---
    if (this.reloadLeft > 0) {
      this.resumeAimPending = false; // 换弹结束已有独立的回瞄准请求
      this.reloadElapsed=f32(this.reloadElapsed+f32(eventDt));
      const targetSeconds=f32(f32(this.getReloadTimeUnits())*f32(.01));
      if (this.reloadElapsed >= targetSeconds) {
        this.reloadLeft=0;
        this.aimRecovery?.finish();
        this.aiming = true;
        this.ammo = Math.min(this.liveMaxAmmo(), this.ammo + this.livePerReload());
        return { events: [{ type: 'RELOAD_DONE' }] };
      }
      // Diagnostic countdown only: completion uses the actual float accumulator
      // and live target above, including effects applied/expired during reload.
      this.reloadLeft=Math.max(1,Math.ceil((targetSeconds-this.reloadElapsed)/f32(eventDt)));
      return { events: out };
    }
    if (btBeforeWeapon && this.resumeAimPending && canAct) {
      this.aiming = true;
      out.push({ type: 'AIM_START' });
      this.resumeAimPending = false;
    }

    // --- E5 账本心跳（时间类递减；移除即属性回落）---
    if (this.charge) {
      // 蓄力目标实时取属性池（GetStatValue 每次现算的语义）
      const units = calcChargeValue(this.baseChargeUnits, this.functions.chargeSpeedEntries()).units;
      this.charge.target = f32(units / 100);
    }

    // --- 武器事件内顺序 ---
    if (this.aiming&&canAct) this.pre.tick(eventDt, STANCE_AIM); // 0x5E073D5

    let fired = false;
    // 目标门控：每事件现算（0x5E07930）
    //   enemies 存在 → 走真实选择（候选池→嘲讽优先→PreferTarget 排序）
    //   否则退回 blockedRanges 手动语义
    let chosen = null;
    let hasTarget;
    if (this.cfg.enemies) {
      const sel = selectTarget(this.resolveEnemies?.(this.cfg.enemies)??this.cfg.enemies, {
        preferTarget: this.cfg.preferTarget ?? 0,
        selfId: this.cfg.id,
        rand: this.cfg.rand,
      });
      chosen = sel.target;
      hasTarget = !!chosen;
      this.currentTargetId = chosen?.id;
    } else {
      hasTarget = !this.isBlocked(tick);
    }
    // UP weapons fire through the subsequent BT evaluation. It observes this
    // tick's updated charge, unlike DOWN_Charge's weapon-update fire check.
    const btAfterCharge = this.cfg.inputType === 2 && !btBeforeWeapon;
    if (btAfterCharge && canAct && this.aiming && this.pre.isReady() &&
        this.mfs.current <= 0 && this.fireTimingLeft <= 0 && !this.charge.isFull()) {
      this.charge.tick(eventDt);
    }
    const canFire = canAct && hasTarget && this.aiming && this.pre.isReady() && this.mfs.current <= 0
      && this.fireTimingLeft <= 0 && this.acc.isOverThreshold(FIRE_THRESHOLD)
      && (this.cfg.inputType !== 2 || (this.charge && this.charge.isFull()))
      && (this.cfg.inputType !== 3 || (this.charge && this.charge.isFull()));
    if (canFire) {
      fired = true;
      out.push({ type: 'FIRE', target: chosen ? chosen.id : undefined, lastAmmo: this.ammo === 1,
        fullChargeRate: this.charge?.isFull() ? 1 : 0 });
      this.acc.reset(); // OnAfterFire 0x5F06591
      this.ammo -= 1;   // UseAmmo 0x5D0CBB0
      this.usedAmmo += 1; // UsedAmmo accumulates actual spent ammunition across reloads
      // TeamContext.OnAfterFire clears CurrentChargeTime for input type 3
      // (0x5F061ED cmp eax,3; 0x5F06239..23F writes zero via setter).
      if (this.cfg.inputType === 3) this.charge.reset();
      if (!deferShotConsumption && this.cfg.inputType !== 3) this.functions.onFire();
      if (this.changePerShot > 0) {
        this.acc.rateOfFire = Math.min(this.endRof, this.acc.rateOfFire + this.changePerShot);
      }
      if (this.cfg.mfsUnits > 0) {
        this.mfs.set(this.cfg.mfsUnits);
        this.mfsIdlePending = this.cfg.inputType === 2;
        this.fireTimingLeft = Math.max(
          Math.ceil(this.cfg.mfsUnits / (eventDt * 100)),
          Math.ceil(((this.cfg.fireTimingUnits ?? 0) * 0.0001) / eventDt),
        );
      }
      if (this.ammo <= 0 && this.cfg.reloadTimeUnits!=null) {
        const units=this.getReloadTimeUnits();
        this.reloadSpan=units>0?reloadDurationTicks(units,eventDt):0;
        this.reloadElapsed=f32(0);
        this.reloadLeft = Math.max(1,this.reloadSpan);
        out.push({ type: 'RELOAD_START' });
      }
      // Last muzzle requests Idle synchronously. ResetFire clears both timers.
      // Re-enter Aim through a later BT request, preserving its weapon phase.
      if (this.cfg.inputType === 2 && (this.cfg.mfsUnits ?? 0) === 0) {
        out.push({ type: 'IDLE' });
        this.aiming = false;
        this.resumeAimPending = this.reloadLeft === 0;
        if (this.aimRecovery && this.resumeAimPending) {
          this.aimRecovery.begin();
          this.aiming = false;
          this.resumeAimPending = false;
        }
        this.pre.reset();
        if (this.charge) this.charge.reset();
        this.acc.acc = Math.max(1, this.acc.acc);
      }
    }

    // --- 充能（CanFire 门控 + !IsFullCharge）---
    if (fired && this.cfg.inputType === 3 && !deferShotConsumption) {
      this.finishShot(this.functions.list().slice(), eventDt);
    }
    if (!btAfterCharge && !(fired && this.cfg.inputType === 3) && this.charge && canAct && this.aiming && this.pre.isReady() && this.mfs.current <= 0 && this.fireTimingLeft <= 0 && !this.charge.isFull()) {
      this.charge.tick(eventDt);
    }

    // Input2's Idle request is rejected while MaintainFireStance is positive.
    // Once it expires, apply ResetFire once, then re-enter Aim on the next tick.
    // ResetFire clears charge/pre-delay and both locks (0x5F19984..0x5F19A31).
    if (this.mfsIdlePending && this.mfs.current <= 0) {
      this.mfsIdlePending = false;
      out.push({ type: 'IDLE' });
      this.aiming = false;
      this.resumeAimPending = this.reloadLeft === 0;
      if (this.aimRecovery && this.resumeAimPending) {
        this.aimRecovery.begin();
        this.aiming = false;
        this.resumeAimPending = false;
      }
      this.pre.reset();
      this.charge?.reset();
      this.fireTimingLeft = 0;
      this.acc.acc = Math.max(1, this.acc.acc);
    }

    // --- BT 求值（后置相位，默认）：UP在本次蓄力更新后判定发射 ---
    if (this.aimRecovery?.pending) {
      if (!btBeforeWeapon && !fired && canAct && this.reloadLeft === 0 && this.aimRecovery.ready) {
        this.aimRecovery.finish();
        this.aiming = true;
        out.push({ type: 'AIM_START' });
      }
    } else if (!btBeforeWeapon && !fired && canAct && this.resumeAimPending) {
      this.aiming = true;
      this.resumeAimPending = false;
      out.push({ type: 'AIM_START' });
    }

    return { events: out };
  }
}

/**
 * 驱动器：多角色共享同一 tick 源，每个阵营一个爆裂槽。
 *
 * 充能通路（全部有地址，见 burst.js 顶部）：
 *   FIRE → 每份伤害实例（shotCount × muzzleCount × targetsPerHit）在**命中时刻**
 *   调 SetBurstChargeValue 得 perShot 值 → FT102 逐条修正 → BurstChargeEvent
 *   → 同阵营槽 UpdateDamage。空枪（无目标/无命中）不产生实例 = 不充能。
 *
 * @param {{characters:Array, totalTicks:number, btBeforeWeapon?:boolean}} p
 * @returns {{events:Array}} [{tick, id, type}]
 */
export function runSpotDriver({ characters, totalTicks, btBeforeWeapon = false, enemies = null,
  burstMax = BURST_GAUGE_MAX, fullChargeRate = 0, burstCharges = null,
  burstDurationTicks = 300, autoRelease = true, shooting = null, probabilityMode = 'sampled',passiveEvents=[], stopWhenTeamsReady=[] }) {
  if (!['sampled','expected'].includes(probabilityMode)) throw new RangeError('Invalid probability mode');
  const runners = characters.map((c) => new CharacterRunner(enemies ? { ...c, enemies } : c));
  const byId = new Map(runners.map((r) => [r.cfg.id, r]));
  // FT31 lives on the affected attacker; its caster is the forced target.
  // Reuse targeting's taunt preference without resetting weapon timers.
  for(const runner of runners)runner.resolveEnemies=candidates=>{
    if(runner.functions.byFt(177).length)return candidates;
    const casters=new Set(runner.functions.byFt(31).map(b=>b.casterId)
      .filter(id=>byId.get(id)?.alive));
    if(!casters.size)return candidates;
    return candidates.map(c=>({...c,taunting:casters.has(c.id),immuneTaunt:false}));
  };
  const passiveEventsByTick=new Map();
  if(!Array.isArray(passiveEvents))throw new TypeError('passiveEvents must be an array of native notifications');
  for(const event of passiveEvents){
    if(!event||!Number.isInteger(event.tick)||event.tick<1||event.tick>totalTicks||
      !['resurrection','entity-probably-die','death'].includes(event.type)||!byId.has(event.targetId)||
      event.type==='entity-probably-die'&&!byId.has(event.casterId))throw new TypeError('Invalid native passive notification');
    const list=passiveEventsByTick.get(event.tick)??[];list.push(event);passiveEventsByTick.set(event.tick,list);
  }
  const checkTimeClocks=new Map();
  for(const runner of runners)if(runner.cfg.onCheckTimeCycleUnits>0){
    const team=runner.cfg.team??0,units=runner.cfg.onCheckTimeCycleUnits;
    if(checkTimeClocks.has(team)&&checkTimeClocks.get(team).cycle!==units*.01)throw new Error('Conflicting team check-time cycles');
    if(!checkTimeClocks.has(team))checkTimeClocks.set(team,new TeamCheckTimeClock(units));
  }
  if (!shooting) for (const r of runners) {
    // Without a shooting module nothing can be contacted, so every row that needs
    // an actual hit says so instead of disappearing silently.
    r.unsupportedChargeRows.push(...r.ft75HitRows.map(s=>({ft:s.ft,trigger:s.trigger,id:s.id,skill:s.skill,
      reason:'shooting-module-required'})));
    r.unsupportedChargeRows.push(...[...r.ft75HurtRows,...r.ft111HurtRows].map(s=>({ft:s.ft,trigger:s.trigger,id:s.id,skill:s.skill,
      reason:'shooting-module-required'})));
    r.ft75HurtRows=[];r.ft111HurtRows=[];
    for (const buff of r.functions.byFt(146)) r.unsupportedChargeRows.push({ft:146,trigger:1,id:buff.id,
      reason:'shooting-module-required'});
    r.ft75HitRows=[]; // fixture-only driver has no actual contacted entities
  }
  // A shooting module that cannot fire an actor reports why instead of throwing,
  // so the rest of the lineup still produces a timeline. Each entry is a real
  // first-charge gap: an actor that never fires contributes no normal-shot charge.
  else for (const row of shooting.unsupported ?? []) {
    const owner = runners.find((r) => r.cfg.id === row.id);
    if (owner && !owner.unsupportedChargeRows.some((g) => g.reason === row.reason))
      owner.unsupportedChargeRows.push({id: row.id, ft: 0, reason: row.reason});
  }
  // AllCharacter is applied by the caster to all living characters on its own team.
  for (const caster of runners) for (const buff of caster.cfg.onStartBuffs ?? []) {
    if (![13,102,159].includes(buff.ft) || buff.target !== 2) continue;
    for (const recipient of runners) if ((recipient.cfg.team ?? 0) === (caster.cfg.team ?? 0))
      recipient.functions.add({...buff,casterId:caster.cfg.id});
  }
  // 每个逻辑 tick 的实际弹药快照，供展示层随时间轴正播或倒拖读取。
  const ammoById = new Map(runners.map(r => [r.cfg.id, [r.ammo]]));
  /** @type {Map<number, BurstGauge>} */
  const gauges = new Map();
  const gaugeFor = (team) => {
    if (!(burstMax > 0)) return null;
    const k = Number(team) || 0;
    if (!gauges.has(k)) gauges.set(k, new BurstGauge(burstMax));
    return gauges.get(k);
  };
  const readyTicks = new Map();
  const teamAmmoCount = new Map();
  /**
   * 爆裂循环状态（UpdateDamage 0x5D099C0 的 CurrentBurstState 门控）：
   *   idle   → 充能正常入槽
   *   ready  → 槽满，等待释放（原生由玩家/服务端决定时机；autoRelease 时下一事件释放）
   *   active → 爆裂中：CurrentBurstState != 0，UpdateDamage 首行直接返回，**充能全部丢弃**
   *            持续 burstDurationTicks 后 ChangeBurstStep 归位，槽重置回满
   */
  const burstState = new Map(); // team -> {phase, readyTick, startTick, endTick, count}
  const stateFor = (team) => {
    const k = Number(team) || 0;
    if (!burstState.has(k)) burstState.set(k, { phase: 'idle', readyTick: null, startTick: null, endTick: null, count: 0 });
    return burstState.get(k);
  };
  // 命中队列：FIRE 时挂入，到达事件才结算（瞬发 flight=0 → 同一事件内结算）
  const pendingHits = [];
  const pendingSkillEntities = [];
  const events = [];

  // 开局：BT 在事件 1 之前已请求 Aim（动画播 ToAim）
  for (const r of runners) {
    events.push({ tick: 1, id: r.cfg.id, type: 'AIM_START', team: r.cfg.team ?? 0 });
    gaugeFor(r.cfg.team ?? 0); // 每个参战阵营先建槽（无命中时也在）
  }

  // FT111 BurstGaugeCharge：按 burst_energy_max 比例直接充（不经过伤害/FT102）。
  // 开局这条路只剩 caller 的 `burstCharges` 参数——技能表里唯一会在开局充的
  // trigger 38 OnSpawnTarget 在竞技场没有派发源，已从分拣里摘掉（见 skills.js）。
  const ft111Charge = (cid, team, g, val, trigger, skillId, tick = 0, probability = 1,expectedOccurrences=1) => {
    const result = settleChargeEvent({kind:'direct',gauge:g,functionValue:val,probability,expectedOccurrences});
    if (result.becameReady) markReady(tick, team, g, cid, 'FT111');
    events.push({ tick, id: cid, team, type: 'BURST_CHARGE', charge: result.generatedCharge,
      templateId:trigger==null?null:`direct-gauge/${compileChargeTrigger({trigger,triggerValue:1}).name??trigger}`,
      creditedCharge:result.creditedCharge, dropped:result.dropped,
      source: 'FT111', trigger, skillId, probability,expectedOccurrences, probabilityMode });
  };
  if (burstCharges) {
    for (const [cid, val] of Object.entries(burstCharges)) {
      const r = byId.get(cid);
      const team = r ? (r.cfg.team ?? 0) : 0;
      const g = gaugeFor(team);
      if (!g) continue;
      ft111Charge(cid, team, g, val, null, null);
    }
  }

  function markReady(t, team, g, id, source) {
    const st = stateFor(team);
    if (st.phase !== 'idle') return;
    st.phase = 'ready';
    if (!readyTicks.has(team)) readyTicks.set(team, t);
    events.push({ tick: t, id, team, type: 'BURST_READY', filled: g.filled, source });
  }

  /**
   * 每 tick 开头的爆裂状态机（原生时机：UpdateDamage 命中时判 state，
   * ChangeBurstStep 由 BurstChangeEvent 驱动；此处把释放/结束落在 tick 边界）。
   */
  const stepBurst = (t) => {
    for (const [team, st] of burstState) {
      const g = gauges.get(team);
      if (!g) continue;
      if (st.phase === 'ready' && autoRelease) {
        st.phase = 'active';
        st.startTick = t;
        st.endTick = t + Math.max(1, burstDurationTicks);
        st.count += 1;
        events.push({ tick: t, team, type: 'BURST_START', count: st.count, duration: burstDurationTicks });
      } else if (st.phase === 'active' && t >= st.endTick) {
        g.release(); // 槽重置回满，重新开始充能
        st.phase = 'idle';
        st.startTick = null;
        st.endTick = null;
        events.push({ tick: t, team, type: 'BURST_END', count: st.count });
        // FT102 trigger43 OnEndFullBurst：StepFull→None 跃迁（0x5F0A14A/0x5F0A1B2）
        // 挂到该队所有持有此技能行的角色；Battles 常驻 / TimeSec 到期回落
        for (const caster of runners) {
          if ((caster.cfg.team ?? 0) !== team || !caster.alive || !caster.ft102EndBurstBuffs.length) continue;
          for (const buff of caster.ft102EndBurstBuffs) {
            const recipients = buff.target === 2
              ? runners.filter(r => (r.cfg.team ?? 0) === team && r.alive)
              : buff.target === 1 || buff.target == null ? [caster] : [];
            for (const recipient of recipients) recipient.functions.add({ ...buff });
          }
          events.push({ tick: t, id: caster.cfg.id, team, type: 'FN_APPLY',
            ft: 102, trigger: 43, rows: caster.ft102EndBurstBuffs.length });
        }
      }
    }
  };

  // 命中结算：本次实例的充能值 = perShot → FT102 修正（按到达时刻的生效函数）
  // 伤害结算（ProcessDamageTargetInfo 0x5DBEFE0：每个 target info 一次伤害 + 一次充能）：
  //   每实例伤害 = shooter.perInstanceDamage（V2.1 公式，发射时快照）× 实例数 → 目标 HP。
  //   HP ≤ 0 → 死亡：alive=false + DEATH 事件 + 从目标池剔除（selectTarget 过滤 alive）。
  const settle = (t, hit) => {
    if (hit.instances === 0) {
      events.push({ tick: t, id: hit.id, team: hit.team, type: 'MISS', instances: 0, charge: 0,
        contacts: hit.contacts, reason: hit.reason, shotId: hit.shotId });
      return;
    }
    const r = byId.get(hit.id);
    let damage, damageTotal;
    const damageContacts = hit.contacts
      ? hit.contacts.filter(c => c.kind === 'character').map(c => c.id)
      : hit.targetId ? Array(hit.instances).fill(hit.targetId) : [];
    let damageInstances = 0;
    if (r && r.perInstanceDamage != null && !hit.skillChargeOnly) {
      for (const targetId of damageContacts) {
      const target = byId.get(targetId);
      if (target && target.alive && target.hp != null) {
        damage = r.perInstanceDamage;
        if(damage>=target.hp)dispatchPassiveEvent({type:'entity-probably-die',casterId:hit.id,targetId},t);
        target.hp -= damage;
        damageInstances++;
        if (target.hp <= 0) {
          target.hp = 0;
          target.alive = false;
          events.push({ tick: t, id: target.cfg.id, team: target.cfg.team ?? 0, type: 'DEATH' });
          // TeamContext notifies each team's living members with OnNikkeDead (44).
          for (const recipient of runners) {
            if (!recipient.alive) continue;
            const team=recipient.cfg.team ?? 0, g=gaugeFor(team);
            if (g) for (const row of recipient.ft111NikkeDeadRows)
              ft111Charge(recipient.cfg.id,team,g,row.value,44,row.skill ?? row.id,t);
          }
          // 目标池描述符同步（selectTarget 过滤 alive!==false；含 cfg 自带与 runSpotDriver 传入两种来源）
          for (const r2 of runners) {
            if (!r2.cfg.enemies) continue;
            for (const e of r2.cfg.enemies) if (e.id === target.cfg.id) e.alive = false;
          }
        }
      }
      }
      if (damageInstances) damageTotal = damage * damageInstances;
    }
    if(hit.sharedHurtContacts)reactToContacts(t,hit,r);
    for(const owner of runners)if(owner.alive)for(const observer of owner.hitCountObservers)
      for(const contact of hit.contacts??[]){
        const outcome=observer.hit(contact,(hit.probability??1)*(contact.probability??1),hit.expectedOccurrences??1);
        if(outcome?.reason){
          owner.functions.uncertainGroups??=new Set();owner.functions.uncertainGroups.add('observer:'+observer.binding.id);
          owner.functionProgram?.gap({id:observer.binding.id,ft:0},outcome.reason);
        }
        else if(outcome?.functionId)owner.functionProgram?.invoke(outcome.functionId,{tick:t,
          target:participant(owner),triggerTarget:contact,probability:outcome.probability});
      }
    // Full-charge repeat is dispatched synchronously before the original charge
    // event. Its zeroed charge-rate does not remove the base per-shot charge.
    if (!hit.skillChargeOnly && r) {
      // CalculateFullChargeHitDamageRepeat uses SpotFirst(GetFunctions(146)).
      const buff=r.functions.byFt(146)[0];
      // Automatic charge weapons currently fire only at full charge. An actual
      // contact may override this with its captured partial/full charge state.
      const rate=hit.fullChargeRate ?? ((r.cfg.inputType===2 || r.cfg.inputType===3)?1:0);
      for (const repeat of fullChargeRepeatResults(hit,buff,rate)) settle(t,repeat);
    }
    // 感染施加（FT70 trigger2 OnShotRatio）：命中的每个实体（含掩体）按概率施加/刷新状态。
    // 施加本身不产生 DamageResultData ⇒ 不充能（代码证据：FT70 无伤害结算路径）。
    if (r && r.infApplyRows.length && !hit.skillChargeOnly) {
      applyContact: for (const contact of hit.contacts ?? []) {
        if (contact.kind !== 'character' && contact.kind !== 'cover') continue;
        for (const row of r.infApplyRows) {
          const chance = (row.triggerValue ?? 0) / 10000; // 25% ⇒ 2500/10000
          if(chance<=0)continue;
          if(probabilityMode==='sampled'&&chance<1&&r.rand()>=chance)continue;
          if(!(row.durationValue>0)||row.durationType!==1){
            if(!r.unsupportedChargeRows.some(g=>g.id===row.id&&g.reason==='infection-duration-unverified'))
              r.unsupportedChargeRows.push({id:row.id,ft:70,reason:'infection-duration-unverified'});
            continue;
          }
          const key=`${contact.id}:${contact.kind}`,existing=r.infected.get(key);
          const state=existing??{timer:new ExpectedPeriodicState(row.durationValue),casterId:hit.id,targetId:contact.id,kind:contact.kind};
          state.timer.apply(probabilityMode==='expected'?chance:1,row.durationValue);
          r.infected.set(key,state);
          events.push({ tick: t, id: hit.id, team: hit.team, type: 'INFECT_APPLY',
            target: contact.id, kind: contact.kind, ft: 70, skillId: row.id,
            probability:probabilityMode==='expected'?chance:1,probabilityMode });
          continue applyContact; // 每实体每发最多施加一次
        }
      }
    }
    const g = gaugeFor(hit.team);
    if (!g) return; // 无槽配置：维持原语义（不发 HIT 事件），伤害已在上方结算
    const charge = settleChargeEvent({kind:'damage',gauge:g,ownerId:hit.id,
      weapon:{perShot:hit.perShot,targetPerShot:hit.targetPerShot,
        fullChargeBurstEnergy:hit.fullChargeBurstEnergy,isTarget:hit.isTarget},
      instances:hit.instances,chargeRate:fullChargeRate,probability:hit.probability ?? 1,expectedOccurrences:hit.expectedOccurrences??1,
      functions:r?r.functions.list():[],
      modifierArithmetic:r?.cfg.burstModifierArithmetic,
      readCasterValue:casterId=>byId.get(casterId)?.lastChargeValue,
      writeBaseValue:(_ownerId,base)=>{if(r) r.lastChargeValue=base;}});
    const total = charge.generatedCharge;
    events.push({
      tick: t, id: hit.id, team: hit.team, type: 'HIT',
      instances: hit.instances, charge: total, dmg: total,
      target: hit.targetId, damage, damageTotal, dropped: charge.dropped,
      creditedCharge:charge.creditedCharge, perInstanceCharge:charge.value,
      fullChargeRate:hit.skillChargeOnly?0:(hit.fullChargeRate ??
        ((r?.cfg.inputType===2 || r?.cfg.inputType===3)?1:0)),
      contacts: hit.contacts, reason: hit.reason, shotId: hit.shotId,
      source:hit.skillChargeOnly?(hit.skillSource ?? 'FT75'):undefined, skillId:hit.skillId,
      templateId:hit.templateId,
      triggerCount:hit.triggerCount,
      skillDamageNotModeled:hit.skillChargeOnly || undefined,
      probability:hit.probability ?? 1,expectedOccurrences:hit.expectedOccurrences??1, probabilityMode,
    });
    if(hit.skillChargeOnly&&!hit.graphOwnsConnected&&hit.skillId&&hit.reason!=='dot')
      r?.functionProgram?.connected(hit.skillId,{tick:t,target:{id:hit.targetId,kind:hit.contacts?.[0]?.kind??'character'},
        triggerTarget:{id:hit.targetId,kind:hit.contacts?.[0]?.kind??'character'}});
    if (charge.becameReady) markReady(t, hit.team, g, hit.id, 'hit');
    // Each supported FT75 hit trigger targets the contacted entity and
    // dispatches a separate CommonHurtEvent. That result goes through this same
    // charge path. OnHitNum threshold 1 also applies to noncharged normal hits.
    // The skill's HP damage is not yet modeled by this subset.
    if (!hit.skillChargeOnly && !hit.deferSkill && r) triggerSkill(t,hit);
    if(!hit.sharedHurtContacts)reactToContacts(t,hit,r);
  };
  const reactToContacts=(t,hit,r)=>{
    const contacts=(hit.sharedHurtContacts??hit.contacts??[]).flatMap(contact=>{
      const victim=byId.get(contact.id);
      if(contact.kind!=='character'||!victim?.cfg.hurtShareTargetIds?.length)return [contact];
      return [...new Set([contact.id,...victim.cfg.hurtShareTargetIds])]
        .filter(id=>byId.get(id)?.alive&&(byId.get(id).cfg.team??0)===(victim.cfg.team??0))
        .map(id=>({...contact,id}));
    });
    for (const contact of contacts) {
      const victim = byId.get(contact.id);
      if (!victim || !victim.alive || (victim.cfg.team ?? 0) === (hit.team ?? 0)) continue;
      const trigger = contact.kind === 'character' ? 7 : contact.kind === 'cover' ? 13 : null;
      if (!trigger) continue;
      const incoming=(hit.probability??1)*(contact.probability??1);
      if(trigger===7&&r){
        // 受击次数按期望累积。一发只有 p 概率真的落在身上时，这一次贡献 p 次计数，
        // 累计每跨过一个整数就派发一次 OnHurtCount。这条路径以前一遇到概率就整条
        // 放弃、只报一个「期望受击计数未接线」的缺口，结果豺狼这类「被攻击 N 次」
        // 的技能在真实阵容里恒为 0 —— 而 V1 一直是按命中次数算的。
        const weight=incoming*(hit.expectedOccurrences??1);
        if(weight>0){
          const before=Math.floor(victim.hurtCount);
          victim.hurtCount+=weight;
          const after=Math.floor(victim.hurtCount);
          for(let count=before+1;count<=after;count++)
            victim.functionProgram?.dispatch({type:'OnHurtCount',tick:t,count,
              target:participant(victim),triggerTarget:participant(r)});
        }
      }
      if(hit.suppressReactions)continue;
      if(trigger===13&&r){
        if(incoming===1)victim.functionProgram?.dispatch({type:'OnCoverHurtRatio',tick:t,
          target:participant(victim),triggerTarget:participant(r)});
        else for(const node of victim.functionProgram?.roots??[])
          if(node.trigger==='OnCoverHurtRatio'&&!node.excludedBeforeFirstBurst)
            victim.functionProgram.gap(node,'function-program-correlated-state-expectation-not-connected');
      }
      if(trigger===7&&probabilityMode==='expected'&&r){
        const probability=row=>row.triggerValue/10000;
        const q=actor=>actor.ft75HurtRows.reduce((sum,row)=>sum+probability(row),0);
        const turns=expectedReactionTurns(incoming,q(victim),q(r));
        const stateful=[victim,r].some(actor=>actor.functions.byFt(102).some(b=>b.standard===1&&b.casterId&&b.casterId!==actor.cfg.id)||
          actor.ft75HurtRows.some(row=>actor.cfg.chargeFunctionProgram?.nodes.find(n=>n.id===row.id)?.connected.length));
        if(!turns.supported||stateful){
          const reason=stateful?'stateful-reaction-expectation-not-connected':turns.reason;
          if(!victim.unsupportedChargeRows.some(g=>g.reason===reason))victim.unsupportedChargeRows.push({id:'reaction',ft:75,reason});
          continue;
        }
        for(const [reactor,attacker,weight] of [[victim,r,turns.first],[r,victim,turns.second]]){
          if(!weight)continue;
          const gauge=gaugeFor(reactor.cfg.team??0);
          for(const row of reactor.ft111HurtRows.filter(s=>s.trigger===7))if(gauge)
            ft111Charge(reactor.cfg.id,reactor.cfg.team??0,gauge,row.value,7,row.id,t,probability(row),weight);
          for(const row of reactor.ft75HurtRows)settle(t,{id:reactor.cfg.id,team:reactor.cfg.team??0,instances:1,
            contacts:[{id:attacker.cfg.id,kind:'character'}],targetId:attacker.cfg.id,
            perShot:reactor.cfg.burstEnergyBp??0,probability:probability(row),expectedOccurrences:weight,fullChargeRate:0,
            suppressReactions:true,skillChargeOnly:true,skillSource:'OnHurtRatio',skillId:row.id,
            templateId:'damage-result/OnHurtRatio'});
        }
        continue;
      }
      for (const row of victim.ft111HurtRows.filter(s=>s.trigger===trigger)) {
        const p=probabilityWeight(victim,row), gauge=gaugeFor(victim.cfg.team ?? 0);
        if (p && gauge) ft111Charge(victim.cfg.id,victim.cfg.team ?? 0,gauge,row.value,trigger,row.id,t,p*incoming);
      }
      if (trigger === 7) for (const row of victim.ft75HurtRows) {
        const p=probabilityWeight(victim,row);
        if (p) settle(t,{id:victim.cfg.id,team:victim.cfg.team ?? 0,instances:1,
          contacts:[{id:hit.id,kind:'character'}],targetId:hit.id,
          perShot:victim.cfg.burstEnergyBp ?? 0,probability:p,fullChargeRate:0,
          suppressReactions:true,skillChargeOnly:true,skillSource:'OnHurtRatio',skillId:row.id,templateId:'damage-result/OnHurtRatio'});
      }
    }
  };
  const probabilityWeight = (runner,row) => {
    const template=runner.chargeTriggerTemplates.get(row.id);
    return matchChargeTrigger(template,{type:template?.event},{probabilityMode,random:()=>runner.rand()});
  };
  const triggerSkill = (t,hit) => {
    const r=byId.get(hit.id);
    if (r) {
      // OnCheckPassiveCharacterFire increments and dispatches OnPelletHitNum
      // per valid result, before target deduplication used by other hit triggers.
      let pelletsThisShot=0;
      if (r.cfg.weaponType === 'SG') for (const contact of hit.contacts ?? []) {
        if (contact.kind !== 'character' && contact.kind !== 'cover') continue;
        r.pelletHits++;
        pelletsThisShot++;
        r.functionProgram?.dispatch({type:'OnPelletHitNum',tick:t,count:r.pelletHits,target:contact,triggerTarget:contact});
        if(hit.nativeShotGroupKnown!==false)
          r.functionProgram?.dispatch({type:'OnPelletHitPerShot',tick:t,count:pelletsThisShot,target:contact,triggerTarget:contact});
        else for(const node of r.functionProgram?.roots??[])
          if(node.trigger==='OnPelletHitPerShot'&&!node.excludedBeforeFirstBurst)
            r.functionProgram.gap(node,'native-shot-group-unverified');
        reserveSkillEntities(r,t,'OnPelletHitNum',r.pelletHits);
        for (const row of r.ft75HitRows.filter(s=>s.trigger===64)) {
          if (!matchChargeTrigger(r.chargeTriggerTemplates.get(row.id),{type:'pellet-hit',count:r.pelletHits})) continue;
          settle(t,{...hit,instances:1,contacts:[contact],targetId:contact.id,
            skillChargeOnly:true,fullChargeRate:0,skillId:row.id,skillSource:'OnPelletHitNum',templateId:'damage-result/OnPelletHitNum'});
        }
      }
      const unique=new Map();
      for (const contact of hit.contacts ?? []) unique.set(`${contact.kind}:${contact.id}`,contact);
      const contacts=[...unique.values()];
      const valid=contacts.filter(c=>c.kind==='character'||c.kind==='cover');
      const shotGroupKnown=hit.nativeShotGroupKnown!==false;
      // Native increments ShotHitNum once for a nonempty valid-result list,
      // before dispatching trigger31 to each target in that shot event.
      if(valid.length&&shotGroupKnown)r.shotHits++;
      if(valid.length&&!shotGroupKnown)for(const row of r.ft75HitRows.filter(s=>s.trigger===31))
        if(!r.unsupportedChargeRows.some(g=>g.id===row.id&&g.reason==='native-shot-group-unverified'))
          r.unsupportedChargeRows.push({id:row.id,ft:75,skill:row.skill,reason:'native-shot-group-unverified'});
      for (const contact of contacts) {
        if (contact.kind !== 'character' && contact.kind !== 'cover') continue;
        const full = isFullChargeHit(hit.fullChargeRate ??
          ((r.cfg.inputType === 2 || r.cfg.inputType === 3) ? 1 : 0));
        if (full) r.fullChargeHits++;
        if(full){
          r.functionProgram?.dispatch({type:'OnFullChargeHit',tick:t,target:contact,triggerTarget:contact});
          r.functionProgram?.dispatch({type:'OnFullChargeHitNum',tick:t,count:r.fullChargeHits,target:contact,triggerTarget:contact});
        }
        if(hit.lastAmmo)r.functionProgram?.dispatch({type:'OnLastShotHit',tick:t,target:contact,triggerTarget:contact});
        // Instant-weapon result path (CharacterFire: native 0x5F0C7AC).
        // Projectile creation has a separate trigger-2 phase; do not move it
        // to impact merely because this function also settles projectiles.
        if([1,4,5,9].includes(r.cfg.weaponTypeCode))
          r.functionProgram?.dispatch({type:'OnShotRatio',tick:t,target:contact,triggerTarget:contact});
        if(shotGroupKnown)r.functionProgram?.dispatch({type:'OnHitNum',tick:t,count:r.shotHits,target:contact,triggerTarget:contact});
        if(shotGroupKnown)r.functionProgram?.dispatch({type:'OnHitNumberOver',tick:t,count:valid.length,target:contact,triggerTarget:contact});
        else for(const node of r.functionProgram?.roots??[])
          if(node.trigger==='OnHitNumberOver'&&!node.excludedBeforeFirstBurst)
            r.functionProgram.gap(node,'native-shot-group-unverified');
        for (const row of r.ft75HitRows) {
          if (row.trigger === 64) continue;
          if (row.trigger === 31 && !shotGroupKnown) continue;
          const probability=matchChargeTrigger(r.chargeTriggerTemplates.get(row.id),{
            type:'ordinary-hit',fullCharge:full,lastAmmo:hit.lastAmmo,
            count:row.trigger===61?r.fullChargeHits:row.trigger===31?r.shotHits:1,
          },{probabilityMode,random:()=>r.rand()});
          if (!probability) continue;
          settle(t,{...hit,instances:1,contacts:[contact],targetId:contact.id,
            skillChargeOnly:true,skillId:row.id,probability,
            triggerCount:row.trigger===31?r.shotHits:row.trigger===61?r.fullChargeHits:undefined,
            templateId:`damage-result/${r.chargeTriggerTemplates.get(row.id).name}`});
        }
        for(const binding of r.connectedPeriodic.connected.filter(b=>!r.functionProgram?.nodes.has(b.id)))for(const activation of binding.activations){
          if(!shotGroupKnown){
            if(!r.unsupportedChargeRows.some(g=>g.id===binding.id&&g.reason==='native-shot-group-unverified'))
              r.unsupportedChargeRows.push({id:binding.id,ft:202,reason:'native-shot-group-unverified'});
            continue;
          }
          const p=matchChargeTrigger(activation.chargeTrigger,{type:'ordinary-hit',count:r.shotHits});
          if(!p)continue;
          const key=`${binding.id}/${contact.kind}/${contact.id}`;
          const state=r.periodicFunctions.get(key)??{timer:new ExpectedPeriodicState(binding.durationUnits,{resetOnRefresh:binding.resetOnRefresh}),
            casterId:hit.id,targetId:contact.id,kind:contact.kind,skillId:binding.id,source:'FT202'};
          state.timer.apply(p,binding.durationUnits);r.periodicFunctions.set(key,state);
          events.push({tick:t,id:r.cfg.id,team:r.cfg.team??0,type:'PERIODIC_APPLY',skillId:binding.id,
            activationId:activation.id,triggerCount:r.shotHits,target:contact.id,kind:contact.kind});
        }
      }
    }
  };

  const processArrivals = (t) => {
    // FIFO：同 tick 到达按发射顺序结算（原生事件同步逐 call 派发，先发先结）；
    // FT102 的 C 读施加者 lastChargeValue，顺序错了同 tick 首发会读到旧值
    let remaining = pendingHits.length;
    for (let i = 0; i < remaining;) {
      if (pendingHits[i].tick <= t) {
        settle(t, pendingHits.splice(i, 1)[0]);
        remaining -= 1;
      } else i += 1;
    }
  };
  // Native 自动射击就绪 accrues one round per 0.2 s cycle while charging
  // (247111004: TimingTriggerType 67 OnCheckTime / TimingTriggerValue 20 /
  // StatusTriggerType 66 IsCharging, feeding the 2471103 group — the same 0.2 s
  // values[2] encodes) and the auto fire spends one round per sequential hit.
  // Only a full charge fires, so the loaded rounds are the cycles the gauge
  // spent, capped by the group rows: 5 normally, 15 once 七个小矮人全面出击 is up.
  const sequentialAmmoCount=(runner,binding)=>{
    const {group,cap}=binding.sequentialAmmo??{},interval=binding.targetIntervalSeconds;
    let limit=null;
    for(const node of runner.cfg.chargeFunctionProgram?.nodes??[]){
      if(String(node.groupId)!==group||!(node.fullCount>=1))continue;
      const live=node.status==='None'?true
        :node.status==='IsFunctionOn'?runner.functions.group(node.statusValue).length>0
        :node.status==='IsFunctionOff'?runner.functions.group(node.statusValue).length===0:null;
      if(live!==true)continue;
      limit=Math.max(limit??0,node.fullCount);
    }
    if(!(limit>0))limit=cap;
    const cycles=Math.floor(Math.fround(Math.fround(runner.charge?.target??0)/interval)+1e-6);
    return Math.max(1,Math.min(limit,Math.max(cycles,1)));
  };
  const reserveSkillEntities=(runner,t,trigger,value)=>{
    for(const binding of runner.skillEntityBindings.connected){
      if(binding.programManaged)continue;
      for(const activation of binding.activations){
        if(activation.trigger!==trigger)continue;
        const template=activation.chargeTrigger;
        if(!matchChargeTrigger(template,{type:template?.event,count:value,lastAmmo:value}))continue;
        pendingSkillEntities.push({tick:t+binding.reservationTicks+binding.hitOffsetTicks,runner,binding,
          ...(binding.sequentialAmmo?{count:sequentialAmmoCount(runner,binding)}:{})});
        events.push({tick:t,id:runner.cfg.id,team:runner.cfg.team??0,type:'SKILL_RESERVE',
          skillId:binding.id,activationId:activation.id,trigger});
      }
    }
  };
  const pendingSkillImpacts=[];
  const processSkillEntities=t=>{
    for(let i=0;i<pendingSkillEntities.length;){
      const request=pendingSkillEntities[i];
      if(request.tick>t){i++;continue;}
      pendingSkillEntities.splice(i,1);
      const {runner,binding}=request;
      if(!runner.alive)continue;
      const team=runner.cfg.team??0;
      if(binding.stateContainer){
        const actor={id:runner.cfg.id,team,kind:'character'};
        for(const phase of ['before_use','after_use'])runner.functionProgram?.phase(binding.id,phase,
          {tick:t,target:actor,triggerTarget:actor});
        continue;
      }
      const eligible=getSkillChargeCandidates(runners.filter(r=>(r.cfg.team??0)!==team)
        .map(r=>({...r.cfg.rankingStats,...r.cfg.targetingStats,id:r.cfg.id,alive:r.alive,elements:r.cfg.elements})),binding.entity.preferCondition);
      if(eligible.unsupported){
        if(!runner.unsupportedChargeRows.some(g=>g.id===binding.id&&g.reason===eligible.reason))
          runner.unsupportedChargeRows.push({id:binding.id,ft:72,reason:eligible.reason});
        continue;
      }
      if(eligible.missingElements){
        if(!runner.unsupportedChargeRows.some(r=>r.id===binding.id))runner.unsupportedChargeRows.push({id:binding.id,ft:72,
          skill:binding.id,reason:'missing-target-element-data'});
        continue;
      }
      const spatial=binding.spatial?shooting?.resolveSkillTargets?.({tick:t,cfg:{...runner.cfg,skillCurrentTargetId:runner.currentTargetId},binding,
        candidates:eligible.candidates,probabilityMode}):null;
      if(spatial?.usedRankingFallback)events.push({type:'SKILL_TARGET_FALLBACK',tick:t,id:runner.cfg.id,team,
        skillId:binding.id,target:spatial.aimTargetId,rankingField:spatial.rankingField});
      if(binding.spatial&&spatial?.supported!==true){
        const reason=spatial?.reason??'skill-spatial-target-producer-required';
        if(!runner.unsupportedChargeRows.some(g=>g.id===binding.id&&g.reason===reason))
          runner.unsupportedChargeRows.push({id:binding.id,ft:72,reason,
            ...(spatial?.rankingField ? {rankingField:spatial.rankingField,preferTarget:spatial.preferTarget} : {})});
        continue;
      }
      const requested=request.count??binding.targetCount;
      const count=binding.spatial?spatial.contacts.length:binding.sequential?(eligible.candidates.length?requested:0):Math.min(requested,eligible.candidates.length);
      if(!count)continue;
      const actor={id:runner.cfg.id,team,kind:'character'};
      runner.functionProgram?.phase(binding.id,'before_use',{tick:t,target:actor,triggerTarget:actor});
      const aimContext=shooting?.getSkillAimContext?.({cfg:runner.cfg,candidates:eligible.candidates});
      let selected=binding.spatial?spatial.contacts.map(c=>({...c,probability:c.probability??1})):
        (aimContext?.candidates??eligible.candidates).map(c=>({...c,kind:'character',probability:1}));
      const expectedRandom=!binding.spatial&&binding.entity.preferTarget==='Random'&&probabilityMode==='expected';
      const hasTargetCommands=(runner.cfg.chargeFunctionProgram?.entities.find(e=>e.id===binding.id)?.commands.before_hurt.length??0)+
        (runner.cfg.chargeFunctionProgram?.entities.find(e=>e.id===binding.id)?.commands.after_hurt.length??0)>0;
      const skillCommands=runner.cfg.chargeFunctionProgram?.entities.find(e=>e.id===binding.id)?.commands;
      const chargeSensitiveCommands=['before_hurt','after_hurt'].flatMap(phase=>skillCommands?.[phase]??[])
        .some(id=>!['StatAtk','StatDef','StatCritical','StatCriticalDamage','StatHpHeal','AddDamage','DamageReduction']
          .includes(runner.functionProgram?.nodes.get(id)?.effect));
      if(expectedRandom)selected=selected.map(c=>({...c,probability:count/selected.length}));
      else if(!binding.spatial&&(count<selected.length||binding.targetIntervalSeconds>0&&count>1)){
        if(binding.entity.preferTarget==='Random'){
          if(probabilityMode==='expected')selected=selected.map(c=>({...c,probability:count/selected.length}));
          else {
            // Sampling without replacement, refilled once the pool is exhausted:
            // 依次攻击 can have more segments than targets (自动射击 spends up to
            // 15 rounds at one locked target), and an empty pool would push an
            // undefined contact into the hurt phases.
            const all=[...selected],pool=[...selected];selected=[];
            for(let i=0;i<count;i++){
              if(!pool.length)pool.push(...all);
              selected.push(pool.splice(Math.floor(runner.rand()*pool.length),1)[0]);
            }
          }
        }else {
          const order=skillAimChoices(selected,binding.entity.preferTarget,{probabilityMode,random:()=>runner.rand(),aimRay:aimContext?.aimRay,
            missingRankingPolicy:runner.cfg.skillMissingRankingPolicy,currentTargetId:runner.currentTargetId});
          if(order.usedRankingFallback)events.push({type:'SKILL_TARGET_FALLBACK',tick:t,id:runner.cfg.id,team,
            skillId:binding.id,target:order.choices[0]?.target.id,rankingField:order.rankingField});
          if(order.supported)selected=order.ordered.slice(0,count);
          else {
            const targetSensitive=hasTargetCommands||selected.some(c=>{
              const victim=byId.get(c.id);return victim?.ft75HurtRows.length||victim?.ft111HurtRows.length;
            });
            if(targetSensitive&&!runner.unsupportedChargeRows.some(r=>r.id===binding.id&&r.reason===order.reason))
              runner.unsupportedChargeRows.push({id:binding.id,ft:72,reason:order.reason,
                ...(order.rankingField ? {rankingField:order.rankingField,preferTarget:order.preferTarget} : {})});
            if(chargeSensitiveCommands||selected.some(c=>{
              const victim=byId.get(c.id);return victim?.ft75HurtRows.length||victim?.ft111HurtRows.length;
            }))continue;
            selected=[];
          }
        }
      }
      const damageModifiers={};
      const beforeHurtTargets=spatial?.effectContacts??selected;
      // Hit probability saturates at 1: when the segment count reaches the candidate
      // count every candidate is hit for sure, so 自动射击's lock-on marker
      // (1471110 before_hurt -> 147111002 on the target) is deterministic state, not
      // an unmodelable correlated expectation.
      for(const target of beforeHurtTargets)runner.functionProgram?.phase(binding.id,'before_hurt',{tick:t,target,triggerTarget:target,probability:Math.min(1,target.probability??1),damageModifiers});
      // AfterUse is synchronous in ProcessCharacterSkill; hurt events are queued
      // by SendWait, and their HurtFunctionList runs before parent gauge charge.
      runner.functionProgram?.phase(binding.id,'after_use',{tick:t,target:actor,triggerTarget:actor});
      if(binding.observer){
        for(const target of selected)runner.hitCountObservers.push(new SkillHitCountObserver(binding,target,t));
        events.push({tick:t,id:actor.id,team,type:'HIT_OBSERVER_START',skillId:binding.id,targets:selected.map(c=>c.id)});
        continue;
      }
      for(const seconds of binding.hitMarkerSeconds??[0]){
        if(binding.spatial)for(const target of selected)pendingSkillImpacts.push({runner,binding,selected:[target],count:1,
          probability:target.probability,started:t,remaining:Math.fround(seconds),damageModifiers});
        else if(!binding.targetIntervalSeconds)pendingSkillImpacts.push({runner,binding,selected,count,
          started:t,remaining:Math.fround(seconds),damageModifiers});
        else {
          let offset=0;
          for(let k=0;k<count;k++){
            const positionTargets=!selected.length?[]:expectedRandom?selected.map(c=>({...c,probability:c.probability/count})):
              binding.sequential?[selected[k%selected.length]]:selected.length===count?[selected[k]]:
                selected.map(c=>({...c,probability:c.probability/count}));
            pendingSkillImpacts.push({runner,binding,selected:positionTargets,count:1,started:t,
              remaining:Math.fround(Math.fround(seconds)+offset),damageModifiers});
            offset=Math.fround(offset+binding.targetIntervalSeconds);
          }
        }
      }
    }
    for(let i=0;i<pendingSkillImpacts.length;){
      const impact=pendingSkillImpacts[i],{runner,binding,selected,count}=impact;
      if(impact.started<t)impact.remaining=Math.fround(impact.remaining-Math.fround(EVENT_DT_30));
      if(impact.remaining>0){i++;continue;}
      pendingSkillImpacts.splice(i,1);
      if(!runner.alive)continue;
      for(const target of selected)runner.functionProgram?.phase(binding.id,'after_hurt',{tick:t,target,triggerTarget:target,probability:target.probability});
      settle(t,{id:runner.cfg.id,team:runner.cfg.team??0,instances:count,
        probability:impact.probability??1,contacts:binding.spatial?selected.map(c=>({...c,probability:1})):selected,
        perShot:runner.cfg.burstEnergyBp??0,fullChargeRate:0,skillChargeOnly:true,
        skillSource:'CharacterSkill.'+binding.effect,skillId:binding.id,templateId:'skill-entity/'+binding.effect,
        sharedHurtContacts:impact.damageModifiers?.sharedHurtTargets?.size?
          Array.from({length:count},()=>[...impact.damageModifiers.sharedHurtTargets.values()]).flat():undefined});
    }
  };

  const externalBooks=new Map();
  const participant=r=>({...r.cfg.rankingStats,id:r.cfg.id,team:r.cfg.team??0,kind:'character',alive:r.alive,elementIds:r.cfg.elementIds,weaponTypeCode:r.cfg.weaponTypeCode});
  const activeControls=new Map();
  const recordControls=tick=>{
    const current=new Map();
    for(const runner of runners)for(const buff of runner.functions.list()){
      if(!runner.alive||![6,31].includes(buff.ft))continue;
      const key=JSON.stringify([runner.cfg.id,buff.ft,buff.casterId]);
      current.set(key,{id:runner.cfg.id,team:runner.cfg.team??0,ft:buff.ft,casterId:buff.casterId,skillId:buff.id});
    }
    for(const [key,control] of activeControls)if(!current.has(key)){
      events.push({...control,tick,type:'CONTROL_END'});
      activeControls.delete(key);
    }
    for(const [key,control] of current)if(!activeControls.has(key)){
      events.push({...control,tick,type:'CONTROL_START'});
      activeControls.set(key,control);
    }
  };
  const bookFor=entity=>{
    const own=entity.kind!=='cover'?byId.get(entity.id)?.functions:null;
    if(own)return own;
    const key=`${entity.kind}/${entity.id}`;
    if(!externalBooks.has(key))externalBooks.set(key,new FunctionTrack());
    return externalBooks.get(key);
  };
  const observedFunctionTypes=new Set(runners.flatMap(r=>(r.cfg.chargeFunctionProgram?.nodes??[]).flatMap(n=>[
    ['OnFunctionBuffCheck','OnFunctionBuffEtcCheck','OnFunctionDebuffCheck','OnFunctionDebuffEtcCheck'].includes(n.trigger)?n.threshold:null,n.status==='IsFunctionTypeOffCheck'?n.statusValue:null,
    n.status2==='IsFunctionTypeOffCheck'?n.statusValue2:null]).filter(v=>v!=null)));
  for(const runner of runners){
    const program=runner.cfg.chargeFunctionProgram;
    const cadenceNodes=runner.changePerShot===0?(program?.nodes??[]).filter(n=>[16,85].includes(n.ft)&&!n.excludedBeforeFirstBurst&&!n.excludedInPvp):[];
    const reloadNodes=(program?.nodes??[]).filter(n=>[13,159].includes(n.ft)&&!n.excludedBeforeFirstBurst&&!n.excludedInPvp);
    const controlNodes=(program?.nodes??[]).filter(n=>[6,31].includes(n.ft)&&!n.excludedBeforeFirstBurst&&!n.excludedInPvp);
    const chargeSpeedNodes=(program?.nodes??[]).filter(n=>n.ft===61&&!n.excludedBeforeFirstBurst&&!n.excludedInPvp);
    // FT54 穿透有两种形状，按 duration 分归属：Shots/SkillShots 是「按发数」的
    // 一次性穿透，由下面射击前的满蓄特化按发数递减；其余（TimeSec/Battles）是状态，
    // 由函数程序写进账本、射击侧只认「在场即穿透」。状态形状必须进覆盖闭包，
    // 否则它既不报缺口也不会被派发——471 的 247121002（OnFullCharge、TimeSec/500）
    // 就是这样整条没生效的。
    const penetrationStateNodes=(program?.nodes??[]).filter(n=>n.ft===54&&
      !['Shots','SkillShots'].includes(n.durationType)&&!n.excludedBeforeFirstBurst&&!n.excludedInPvp);
    // FT14 弹匣上限：它不改当前弹量，只改换弹后这一梭能打多少发，所以只有「换过弹」
    // 才看得出来。但它必须进覆盖闭包，否则整张图都不会为只带 FT14 的角色建立，
    // 效果既不进账本也不报缺口——白雪公主：纯真年代 222411001 就是这样静默丢失。
    const ammoStateNodes=(program?.nodes??[]).filter(n=>n.ft===14&&!n.excludedBeforeFirstBurst&&!n.excludedInPvp);
    const chargeGroups=new Set(chargeSpeedNodes.map(n=>n.groupId));
    const chargeRemovers=(program?.nodes??[]).filter(n=>n.ft===164&&chargeGroups.has(String(n.value))&&!n.excludedBeforeFirstBurst&&!n.excludedInPvp);
    const observedProducers=(program?.nodes??[]).filter(n=>observedFunctionTypes.has(n.ft)&&!n.excludedBeforeFirstBurst&&!n.excludedInPvp);
    if(!program||!runner.cfg.skills?.some(row=>program.nodes.some(node=>node.id===row.id))||
      !runner.cfg.chargeBindings?.length&&!cadenceNodes.length&&!reloadNodes.length&&!controlNodes.length&&!chargeSpeedNodes.length&&!penetrationStateNodes.length&&!ammoStateNodes.length&&!observedProducers.length)continue;
    const required=new Set(runner.chargeBindingCoverage.missing.filter(b=>b.kind==='function').map(b=>b.id));
    for(const node of cadenceNodes)required.add(node.id);
    for(const node of reloadNodes)required.add(node.id);
    for(const node of controlNodes)required.add(node.id);
    for(const node of [...chargeSpeedNodes,...chargeRemovers,...penetrationStateNodes,...ammoStateNodes])required.add(node.id);
    for(const node of observedProducers)required.add(node.id);
    for(const binding of [...runner.skillEntityBindings.connected,...runner.skillEntityBindings.missing]){
      required.add(binding.id);
      for(const activation of binding.activations??[])required.add(activation.id);
      const entity=program.entities.find(e=>e.id===binding.id);
      for(const id of Object.values(entity?.commands??{}).flat())required.add(id);
    }
    for(const binding of runner.connectedPeriodic.connected)required.add(binding.id);
    if(!required.size)continue;
    const actor=participant(runner);
    const targets=(type,context)=>type==='Self'?[actor]:type==='Target'?[context.target??context.triggerTarget].filter(Boolean):
      type==='Entity'?byId.has(context.target.id)?[participant(byId.get(context.target.id))]:[context.target]:
      type==='EnemyCharacters'?runners.filter(r=>r.alive&&(r.cfg.team??0)!==(byId.get(context.target.id)?.cfg.team??actor.team)).map(participant):
      type==='Monsters'?[]:
      type==='AllCharacter'?runners.filter(r=>r.alive&&(r.cfg.team??0)===actor.team).map(participant):
      type==='AllMonster'?runners.filter(r=>r.alive&&(r.cfg.team??0)!==actor.team).map(participant):[];
    const legacyActivations=runner.skillEntityBindings.connected.filter(b=>!b.programManaged).flatMap(b=>b.activations.map(a=>a.id));
    runner.functionProgram=new FunctionProgram({program,actor,bookFor,targets,required:[...required],cadenceSupported:runner.changePerShot===0,probabilityMode,random:()=>runner.rand(),skipRoots:[...runner.legacyFunctionIds,...legacyActivations],
      // A death or resurrection branch only counts as out of reach while the
      // caller has supplied no such notification; once it has, the branch runs
      // and whatever it needs becomes a real gap.
      suppliedScopes:suppliedScopes(passiveEvents.map(event=>event.type==='death'?{...event,type:'entity-probably-die'}:event)),
      onGap:(node,reason)=>{
        if(!runner.unsupportedChargeRows.some(g=>g.id===node.id&&g.reason===reason)){
          const scope=pvpScopeFor(node);
          runner.unsupportedChargeRows.push({id:node.id,ft:node.ft??0,trigger:node.trigger,reason,
            ...(CRITICAL_TRIGGERS.has(node.trigger)?{criticalGated:true}:{}),
            ...(scope?{pvpScope:scope}:{})});
        }
      },
      onEvent:event=>{
        events.push({tick:event.tick??0,id:actor.id,team:actor.team,
          type:['OnFunctionBuffCheck','OnFunctionBuffEtcCheck','OnFunctionDebuffCheck','OnFunctionDebuffEtcCheck'].includes(event.type)?'FUNCTION_TYPE_CHECK':'FUNCTION_STATE',
          event:event.type,groupId:event.groupId,target:event.owner.id,
          ...(event.functionType!=null?{functionType:event.functionType}:{})});
        for(const other of runners)if(other!==runner)other.functionProgram?.dispatch(event);
      },
      onCommand:({kind,node,skillId,target,context})=>{
        const t=context.tick??0,p=context.probability??1;
        if(kind==='skill'){
          const binding=[...runner.skillEntityBindings.connected,...runner.observerBindings.connected].find(b=>b.id===skillId);
          if(!binding)return false;
          // SkillType 29 is registered by the graph (247111001 OnStart ft72) but the
          // auto fire itself is the weapon's full-charge step: the rounds are only
          // spent then, and 0.2 s cycles are only accrued while charging.
          if(binding.sequentialAmmo)return true;
          pendingSkillEntities.push({tick:t+1,runner,binding});
          events.push({tick:t,id:actor.id,team:actor.team,type:'SKILL_RESERVE',skillId,activationId:node.id,trigger:node.trigger});
          return true;
        }
        if(kind==='damage'){
          const periodic=node.durationUnits>0||node.durationType==='TimeSecBattles';
          if(periodic){
            if(!['TimeSec','TimeSec_Ver2','TimeSec_Ver3','TimeSecBattles'].includes(node.durationType))return false;
            const duration=node.durationType==='TimeSecBattles'?Infinity:node.durationUnits;
            const key=`${node.id}/${target.kind}/${target.id}`;
            const state=runner.periodicFunctions.get(key)??{timer:new ExpectedPeriodicState(duration,{resetOnRefresh:node.durationType==='TimeSec_Ver3'}),
              targetId:target.id,kind:target.kind,skillId:node.id,source:'FT'+node.ft,groupId:node.groupId};
            state.timer.apply(p,duration);runner.periodicFunctions.set(key,state);
            events.push({tick:t,id:actor.id,team:actor.team,type:'PERIODIC_APPLY',skillId:node.id,target:target.id,
              triggerCount:context.count,activationId:context.activationId,probability:p});
          }
          if([64,75].includes(node.ft))settle(t,{id:actor.id,team:actor.team,instances:1,perShot:runner.cfg.burstEnergyBp??0,
            targetId:target.id,contacts:[{id:target.id,kind:target.kind}],fullChargeRate:0,skillChargeOnly:true,
            skillSource:'FT'+node.ft,skillId:node.id,probability:p,graphOwnsConnected:true,templateId:'damage-result/FunctionProgram'});
          return true;
        }
        if(isInstantShareEffect(node)&&context.damageModifiers){
          context.damageModifiers.sharedHurtTargets??=new Map();
          context.damageModifiers.sharedHurtTargets.set(`${target.kind}/${target.id}`,{id:target.id,kind:target.kind});
          return true;
        }
        if(node.ft===102||node.ft===61||node.ft===146){
          bookFor(target).applyState(node,actor.id);return true;
        }
        if(node.ft===111){
          const owner=byId.get(target.id),team=owner?.cfg.team??actor.team,gauge=gaugeFor(team);
          if(gauge)ft111Charge(actor.id,team,gauge,node.value,null,node.id,t,p);
          return true;
        }
        return false;
      }});
    runner.functions.onExpire=buff=>runner.functionProgram.emit('OnFunctionOff',buff.groupId,participant(runner),
      {tick:runner.currentTick??0,target:participant(runner),triggerTarget:participant(runner)});
    // These rows were collected before the graph existed, so a row that names a
    // program node picks up that node's reach verdict now — including one derived
    // from its parents, and including the case where the verdict is "reachable":
    // the graph knows whether a caller-input event actually arrived, a row's own
    // trigger name cannot, so the node decides either way.
    for(const row of runner.unsupportedChargeRows){
      if(row.id==null)continue;
      const node=runner.functionProgram.nodes.get(String(row.id));
      if(!node)continue;
      if(node.pvpScope)row.pvpScope=node.pvpScope;else delete row.pvpScope;
    }
    const issues=runner.functionProgram.audit(new Set([...runner.skillEntityBindings.connected,...runner.observerBindings.connected].map(b=>b.id)));
    if(!checkTimeClocks.has(actor.team))for(const node of runner.functionProgram.roots)
      if(node.trigger==='OnCheckTime'&&runner.functionProgram.relevant.has(node.id)&&!node.excludedBeforeFirstBurst)
        issues.push({id:node.id,ft:node.ft,reason:'function-program-team-clock-required'});
    for(const issue of issues)runner.functionProgram.gap(issue,issue.reason);
    // Claim graph coverage only after validating the whole relevant command
    // closure, including state producers, predicates and skill reservations.
    // `blocking:false` marks a node the arena can never reach: it is still
    // recorded as unsupported, but it cannot veto the rest of the graph.
    if(!issues.some(issue=>issue.blocking!==false)){
      const handled=new Set([...runner.functionProgram.relevant].filter(id=>program.nodes.some(n=>n.id===id)));
      // A row-level verdict (`charge-row-*`) says only that the legacy skill-row
      // shape did not match a template. Once the native program implements the
      // same node, that verdict is superseded and must not resurface as a gap.
      runner.unsupportedChargeRows=runner.unsupportedChargeRows.filter(row=>{
        // An out-of-reach row is not implemented, and skipping it in the audit did
        // not implement it. The claim says this program's arena behaviour is
        // modelled, not that the barrier or spawn subsystems exist, so the record
        // survives and only its first-charge verdict stays suppressed.
        if(row.pvpScope)return true;
        if(!handled.has(row.id)||!row.reason)return !handled.has(row.id);
        if(String(row.reason).startsWith('charge-row-'))return false;
        return row.reason!=='native-function-handler-not-connected';
      });
      for(const binding of runner.chargeBindingCoverage.missing.filter(b=>b.kind==='function'&&handled.has(b.id)))
        runner.chargeTemplates.push({skillId:binding.id,effect:describeChargeEffect(binding.ft),templateId:'native-function-program',timing:'native-command-graph'});
      runner.chargeBindingCoverage.missing=runner.chargeBindingCoverage.missing.filter(b=>b.kind!=='function'||!handled.has(b.id));
    }
  }
  const dispatchPassiveEvent=(event,tick)=>{
    const target=byId.get(event.targetId),caster=byId.get(event.casterId);
    if(!target?.alive)return;
    const triggerTarget=participant(target);
    events.push({tick,id:event.targetId,team:target.cfg.team??0,type:'NATIVE_PASSIVE',nativeType:event.type,casterId:event.casterId});
    for(const runner of runners){
      if(!runner.alive)continue;
      runner.functionProgram?.dispatch({type:event.type==='resurrection'?'OnResurrection':'OnEnemyDead',tick,
        target:triggerTarget,triggerTarget,casterTeam:caster?.cfg.team??0});
    }
    if(event.type==='death'){
      target.alive=false;
      events.push({tick,id:target.cfg.id,team:target.cfg.team??0,type:'DEATH',source:'caller-input'});
      for(const recipient of runners)if(recipient.alive){
        const team=recipient.cfg.team??0,g=gaugeFor(team);
        if(g)for(const row of recipient.ft111NikkeDeadRows)
          ft111Charge(recipient.cfg.id,team,g,row.value,44,row.skill??row.id,tick);
      }
    }
  };
  for(const runner of runners)runner.functionProgram?.dispatch({type:'OnStart',tick:0,target:participant(runner)});
  recordControls(0);

  for (let t = 1; t <= totalTicks; t++) {
    if (stopWhenTeamsReady.length && stopWhenTeamsReady.every(team => readyTicks.has(team))) break;
    for(const event of passiveEventsByTick.get(t)??[])dispatchPassiveEvent(event,t);
    for(const runner of runners){
      for(const observer of runner.hitCountObservers)observer.advance(EVENT_DT_30,t);
      runner.hitCountObservers=runner.hitCountObservers.filter(o=>o.remaining>0&&!o.complete);
    }
    for(const [team,clock] of checkTimeClocks)for(const count of clock.advance(EVENT_DT_30))
      for(const runner of runners)if(runner.alive&&(runner.cfg.team??0)===team)
        runner.functionProgram?.dispatch({type:'OnCheckTime',tick:t,count,target:participant(runner)});
    for(const runner of runners)if(runner.alive)runner.functionProgram?.advance(EVENT_DT_30,t);
    for(const book of externalBooks.values())book.tick(EVENT_DT_30);
    recordControls(t);
    stepBurst(t); // 爆裂释放/结束在 tick 边界结算
    shooting?.beforeTick(t, runners);
    // SpotSkill initializes CurrentCooltime to MaxCooltime for normal skills;
    // UpdateSkillStatus subtracts float32(dt*100), including during reload.
    for(const runner of runners)if(runner.alive)for(const binding of runner.skillEntityBindings.connected){
      if(!binding.automaticCooldown)continue;
      const left=Math.fround(runner.normalSkillCooldowns.get(binding.id)-Math.fround(EVENT_DT_30*100));
      if(left>0){runner.normalSkillCooldowns.set(binding.id,left);continue;}
      runner.normalSkillCooldowns.set(binding.id,Math.fround(binding.automaticCooldown));
      pendingSkillEntities.push({tick:t,runner,binding});
      events.push({tick:t,id:runner.cfg.id,team:runner.cfg.team??0,type:'SKILL_RESERVE',skillId:binding.id,trigger:'NormalSkillCooldown'});
    }
    processSkillEntities(t);
    // Each active function owns its native centisecond pulse timer. Refreshing
    // TimeSec extends duration without resetting phase; pulse overshoot remains.
    for (const r of runners) {
      if (!r.alive) continue;
       for(const stateMap of [r.infected,r.periodicFunctions])for (const [key, state] of stateMap) {
          const pulse=state.timer.advance(EVENT_DT_30);
          if(state.timer.expired)stateMap.delete(key);
          if(!pulse)continue;
          // DOT 伤害（perInstanceDamage 的万分之一已并入 settle 公式；此处仅结算充能实例）
          settle(t, {
            id: r.cfg.id, team: r.cfg.team ?? 0, instances: 1, perShot: r.cfg.burstEnergyBp ?? 0,
            targetPerShot: r.cfg.targetBurstEnergyBp ?? r.cfg.burstEnergyBp ?? 0,
            fullChargeBurstEnergy: r.cfg.fullChargeBurstEnergyBp ?? 0, isTarget: false,
            targetId:state.targetId,contacts:[{id:state.targetId,kind:state.kind}],
            reason: 'dot', skillChargeOnly: true, skillSource:state.source??'FT75', skillId:state.skillId??r.infDotRows[0].id,
            templateId:'damage-result/PeriodicFunction',
            probability:pulse,
          });
        }
    }
    const settleShot = (hit) => {
      const cfg = byId.get(hit.id).cfg;
      const inputType = hit.inputTypeAtFire ?? cfg.inputType;
      if (cfg.arenaAuto && (inputType === 2 || inputType === 3) &&
          hit.fullChargeRate != null && !isFullChargeHit(hit.fullChargeRate))
        throw new Error('PVP自动蓄力武器的普攻必须满蓄；射击接口不能生成半蓄命中');
      settle(t, { ...hit, perShot: cfg.burstEnergyBp ?? 0,
        targetPerShot: cfg.targetBurstEnergyBp ?? cfg.burstEnergyBp ?? 0,
        fullChargeBurstEnergy: cfg.fullChargeBurstEnergyBp ?? 0, isTarget: false,
        targetId: hit.targetId ?? hit.target });
    };
    for (const hit of shooting?.advance(t) ?? []) settleShot(hit);
    processArrivals(t); // 跨 tick 到达的飞弹
    for (const r of runners) {
      if (!r.alive) { // 死亡角色不再行动（GetCandidateList 剔除死者的推论）
        ammoById.get(r.cfg.id)[t] = r.ammo;
        continue;
      }
      const shotFunctions = r.functions.list().slice();
      const res = r.step(EVENT_DT_30, btBeforeWeapon, t, true);
      ammoById.get(r.cfg.id)[t] = r.ammo;
      for (const ev of res.events ?? []) {
        events.push({ tick: t, id: r.cfg.id, team: r.cfg.team ?? 0, ...ev });
        if(ev.type==='RELOAD_DONE')r.functionProgram?.dispatch({type:'OnEndReload',tick:t,target:participant(r)});
        if (ev.type !== 'FIRE') continue;
        r.functionProgram?.dispatch({type:'OnUseAmmo',tick:t,count:r.usedAmmo,target:participant(r)});
        r.functionProgram?.dispatch({type:'OnLastAmmoUse',tick:t,lastAmmo:ev.lastAmmo,target:participant(r)});
        reserveSkillEntities(r,t,'OnUseAmmo',r.usedAmmo);
        reserveSkillEntities(r,t,'OnLastAmmoUse',ev.lastAmmo);
        const shotFullChargeRate = ev.fullChargeRate ??
          ((r.cfg.inputType === 2 || r.cfg.inputType === 3) ? 1 : 0);
        for (const row of r.ft111UseAmmoRows) {
          const team=r.cfg.team ?? 0, g=gaugeFor(team);
          if (g && matchChargeTrigger(r.chargeTriggerTemplates.get(row.id),{type:'ammo-used',count:r.usedAmmo}))
            ft111Charge(r.cfg.id,team,g,row.value,3,row.skill ?? row.id,t);
        }
        // TeamAmmoTrigger increments once for each ammo-use event, then checks
        // trigger 83 for each living member of that same team.
        const team=r.cfg.team ?? 0, teamUsed=(teamAmmoCount.get(team) ?? 0)+1;
        teamAmmoCount.set(team,teamUsed);
        for (const recipient of runners) {
          if (!recipient.alive || (recipient.cfg.team ?? 0)!==team) continue;
          recipient.functionProgram?.dispatch({type:'OnUseTeamAmmo',tick:t,count:teamUsed,
            target:participant(recipient),triggerTarget:participant(r)});
          for (const row of recipient.ft111TeamAmmoRows) {
            const g=gaugeFor(team);
            if (g && matchChargeTrigger(recipient.chargeTriggerTemplates.get(row.id),{type:'team-ammo-used',count:teamUsed}))
              ft111Charge(recipient.cfg.id,team,g,row.value,83,row.skill ?? row.id,t);
          }
        }
        // trigger 51 (OnFullCharge) is the gauge reaching full, not the shot leaving.
        // A state written there must be live for this very shot: 471's 247121002 is
        // ft54 / trigger 51 / TimeSec 500, so 全蓄力穿透特化 has to pierce the shot
        // that filled the gauge. fireType=1 fires inside this tick, so 51 is
        // dispatched before the shot below instead of after it.
        let onFullChargeDone = false;
        const dispatchOnFullCharge = () => {
          if (onFullChargeDone || !isFullChargeHit(shotFullChargeRate)) return;
          onFullChargeDone = true;
          r.functionProgram?.dispatch({type:'OnFullCharge',tick:t,target:participant(r)});
        };
        // Both instant-fire and projectile-fire handlers dispatch trigger 6 for a full-charge shot.
        const fullChargeShot = () => {
          if (!isFullChargeHit(shotFullChargeRate)) return;
          // SkillType 29 自动射击 is part of this same full-charge step and has no
          // UseCharacterSkillId row, so the function program never reserves it. It is
          // resolved before the dispatches below: the rounds were loaded during the
          // charge that just finished, while those dispatches spend the burst's
          // remaining uses (247110113 RemoveFunctionGroup 1471301 on OnFullChargeShot)
          // and would otherwise hide the +10 round cap from this very shot.
          reserveSkillEntities(r, t, 'OnFullChargeShot', 1);
          // 蓄满那一刻（含按住不松）。Arena auto-fires a charged weapon the moment its
          // gauge fills, so 51 lands on the same tick as the shot here — but it does
          // not wait for the shot: it is the gauge reaching full, which is why it is
          // a separate trigger from 6 and not a substitute for it.
          dispatchOnFullCharge();
          r.functionProgram?.dispatch({type:'OnFullChargeShot',tick:t,target:participant(r)});
          r.fullChargeShots++;
          r.functionProgram?.dispatch({type:'OnFullChargeShotNum',tick:t,count:r.fullChargeShots,target:participant(r)});
          const team = r.cfg.team ?? 0, g = gaugeFor(team);
          if (g) for (const row of r.ft111FullChargeShotRows)
            ft111Charge(r.cfg.id, team, g, row.value, 6, row.skill ?? row.id, t);
          for (const row of r.ft61FullChargeShotRows) {
            r.functions.setSingle({...rowToBuff(row),casterId:r.cfg.id});
            events.push({tick:t,id:r.cfg.id,team,type:'FN_APPLY',ft:61,trigger:6,skillId:row.id});
          }
          for(const row of r.ft12FullChargeShotRows){
            const previous=r.functions.list().find(b=>b.id===row.id&&b.casterId===r.cfg.id);
            r.functions.setSingle({...rowToBuff(row),casterId:r.cfg.id,
              stacks:Math.min(row.fullCount,(previous?.stacks??0)+1)});
            events.push({tick:t,id:r.cfg.id,team,type:'FN_APPLY',ft:12,trigger:6,skillId:row.id});
          }
          };
        if (r.cfg.fireType === 1) dispatchOnFullCharge();
        if (r.cfg.fireType !== 1) fullChargeShot();
        if (shooting) {
          // FT54 满蓄穿透在射击前生效：IT=2/3 每次满蓄射击都触发（fireType=1 在 fire 前设参）。
          // trigger 60 是「第 N 次满蓄射击」：fireType≠1 时本拍已计数，fireType=1 时本拍
          // 还没计数（fullChargeShot() 在射击之后），所以补 1 再取模。
          const ft54ShotCount = r.fullChargeShots + (r.cfg.fireType === 1 ? 1 : 0);
          const ft54Triggered = r.ft54FullChargeShotRows.length > 0 ||
            r.ft54ShotCountRows.some((row) => (row.triggerValue ?? 1) > 0 &&
              ft54ShotCount > 0 && ft54ShotCount % row.triggerValue === 0);
          if (ft54Triggered && isFullChargeHit(shotFullChargeRate)) {
            if (r.penetrateLeft <= 0) r.penetrateLeft = r.ft54Duration; // 满蓄射击刷新剩余发数
            r.cfg.penetration = 1;
            r.penetrateLeft--;
          } else if (r.functions.byFt(54).length > 0) {
            // FT54 StatPenetration 挂在函数程序上时，触发条件由程序自己管，这里只认
            // "函数在场"：穿透是状态不是一次性发数，所以在场就穿。这与上面那条
            // 满蓄穿透特化是同一个 FT 的同一效果，区别只在激活由谁判定——小红帽的
            // 247021001 是 OnStart、真理的 183221001 是 None，开局就在，所以每一发
            // 都是穿透射击（竞技场穿透 = 当前目标 + 掩体 2 个命中实例/发）。
            r.cfg.penetration = 1;
          } else if (r.penetrateLeft <= 0) {
            r.cfg.penetration = 0; // 穿透发数耗尽后复位
          }
          if(r.cfg.penetrationShots!=null)r.cfg.penetration=r.usedAmmo<=r.cfg.penetrationShots?1:0;
          const explosionRange=statValue(r.cfg.explosionRange??0,r.functions.byFt(12)
            .filter(b=>b.standard===1&&b.valueType===2).map(b=>({p:b.value,n:b.stacks??1,standard:1}))).value;
          const hits=shooting.fire({ tick: t, cfg: {...r.cfg,explosionRange}, targetId: ev.target, lastAmmo:ev.lastAmmo,
            fullChargeRate:shotFullChargeRate });
          const aggregate = r.cfg.fireType===1 && ((r.cfg.shotCount ?? 1)>1 || (r.cfg.muzzleCount ?? 1)>1);
          const groups=new Map();
          for(const [index,hit] of hits.entries()){
            const key=aggregate?(hit.muzzleIndex??0):index;
            if(!groups.has(key))groups.set(key,[]);
            groups.get(key).push(hit);
          }
          for(const group of groups.values()){
           for(const hit of group)settleShot({...hit,lastAmmo:hit.lastAmmo ?? ev.lastAmmo,
            inputTypeAtFire:hit.inputTypeAtFire ?? r.cfg.inputType,
            fullChargeRate:hit.fullChargeRate ?? shotFullChargeRate,deferSkill:aggregate});
           if(aggregate&&group.some(hit=>hit.instances>0))triggerSkill(t,{
            id:r.cfg.id,team:r.cfg.team ?? 0,instances:1,lastAmmo:ev.lastAmmo,
            fullChargeRate:group[0]?.fullChargeRate ?? shotFullChargeRate,
            nativeShotGroupKnown:(r.cfg.muzzleCount??1)===1||group.every(hit=>Number.isInteger(hit.muzzleIndex)),
            contacts:group.flatMap(hit=>hit.contacts ?? []),perShot:r.cfg.burstEnergyBp ?? 0,
            targetPerShot:r.cfg.targetBurstEnergyBp ?? r.cfg.burstEnergyBp ?? 0,
            fullChargeBurstEnergy:r.cfg.fullChargeBurstEnergyBp ?? 0,isTarget:false,
          });
          }
          if (r.cfg.fireType === 1) fullChargeShot();
          r.finishShot(shotFunctions, EVENT_DT_30);
          continue;
        }
        // 命中实例数 = 弹丸数 × 管数 × 命中目标数
        const instances = (r.cfg.shotCount || 1) * (r.cfg.muzzleCount || 1)
          * (r.cfg.targetsPerHit ?? 1);
        pendingHits.push({
          tick: t + (r.cfg.projectileTicks || 0),
          id: r.cfg.id,
          team: r.cfg.team ?? 0,
          instances,
          targetId: ev.target,
          lastAmmo: ev.lastAmmo,
          fullChargeRate: shotFullChargeRate,
          perShot: r.cfg.burstEnergyBp ?? 0,
          targetPerShot: r.cfg.targetBurstEnergyBp ?? r.cfg.burstEnergyBp ?? 0,
          fullChargeBurstEnergy: r.cfg.fullChargeBurstEnergyBp ?? 0,
          isTarget: false, // PVP 受击方是角色，TargetBurstEnergy 只对怪生效
        });
        if (r.cfg.fireType === 1) { processArrivals(t); fullChargeShot(); }
        r.finishShot(shotFunctions, EVENT_DT_30);
      }
    }
    processArrivals(t); // 本 tick 发射的瞬发命中（flight=0）
    recordControls(t);
  }
  const firstTeam = [...gauges.keys()].sort((a, b) => a - b)[0];
  const main = firstTeam == null ? null : gauges.get(firstTeam);
  const readyTick = firstTeam == null ? null : (readyTicks.get(firstTeam) ?? null);
  const unsupportedCharge = runners.flatMap((r) => r.unsupportedChargeRows.map((row) => ({
    ...row,id: r.cfg.id,functionId:row.id,ft: row.ft, trigger: row.trigger, skill: row.skill ?? row.id,
    // Only surfaced when true, so existing gap records keep their exact shape.
    ...((row.ammoGated ?? r.functionProgram?.ammoGated?.has(row.id)) ? {ammoGated:true} : {}),
  })));
  // 弹匣容量(14/108)与换弹时长(13/159)只改变「打空之后」的节奏。本次运行若没有
  // 发生换弹，这些行对首槽充能没有影响，不构成首槽缺口（仍保留在 unsupportedCharge 里）。
  const reloadStarted = events.some((e) => e.type === 'RELOAD_START');
  // SpotSkill starts a normal skill at full cooltime (UpdateSkillStatus subtracts
  // float32(dt*100) until zero), so an auto-cooldown skill with no activation
  // function first fires at cooldownUnits centiseconds. If that lands at or after
  // the tick the first gauge fills, the skill contributes nothing to it.
  const firstReleaseTick = (row) => row.cooldownUnits > 0
    ? Math.ceil(row.cooldownUnits / (EVENT_DT_30 * 100)) : null;
  // First charge is a 5s problem: 150 ticks at 1/30s. When the gauge actually
  // fills earlier, that earlier tick is the real horizon.
  const firstChargeHorizon = readyTick ?? Math.min(totalTicks, 150);
  const unsupportedFirstCharge = unsupportedCharge.filter(row =>
    !(row.slot === 'burst' && row.trigger === 0) &&
    !(row.trigger === 22 || row.trigger === 43) &&
    !(shooting?.supportsParts === false && row.ft === 75 && [33,34,35,36,66,73].includes(row.trigger)) &&
    !(!reloadStarted && [13,14,108,159].includes(row.ft)) &&
    !(!reloadStarted && row.ammoGated) &&
    !row.criticalGated &&
    // Out of arena reach: no spawns, no monsters, no barrier lifecycle. The row
    // is still collected; only the first-charge verdict drops it, because a node
    // that can never fire adds no charge to miss.
    !row.pvpScope &&
    !(!row.activationCount && firstReleaseTick(row) !== null && firstReleaseTick(row) >= firstChargeHorizon));
  return {
    events,
    ammoById,
    unsupportedCharge,
    unsupportedFirstCharge,
    burst: main ? {
      max: main.max,
      filled: main.filled,
      fillRate: main.fillRate,
      ready: main.ready,
      readyTick,
      readyFrame: readyTick == null ? null : readyTick * 2,
      totalCharge: main.totalCharge,
      chargeEvents: main.events,
      burstCount: firstTeam == null ? 0 : (burstState.get(firstTeam)?.count ?? 0),
    } : null,
    gauges,
    chargeTemplates:runners.flatMap(r=>[
      ...r.chargeTemplates.map(template=>({actorId:r.cfg.id,...template})),
      ...r.skillEntityBindings.connected.map(b=>({actorId:r.cfg.id,skillId:b.id,effect:'damage-result',
        templateId:'skill-entity/'+b.effect,
        triggers:b.activations.map(a=>a.chargeTrigger),cooldownUnits:b.automaticCooldown,
        reservationTicks:b.reservationTicks,hitOffsetTicks:b.hitOffsetTicks})),
    ]),
    probabilityMode,
    readyTicks,
    burstState,
  };
}
