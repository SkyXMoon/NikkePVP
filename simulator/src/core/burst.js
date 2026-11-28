/**
 * 第一期核心 —— 爆裂充能（按原生算术还原，2026-11-03 重写）
 *
 * 全部依据来自 GameAssembly.dll 反汇编，地址见 output/nikke-sd-rl-charge.md。
 *
 * 一、每份伤害实例的充能值（SpotWeaponData.SetBurstChargeValue 0x5D0B780）
 *     perShot = isTarget ? Target_burst_energy_pershot : Burst_energy_pershot
 *     if (Full_charge_burst_energy > 0)
 *        add = float32(float32(F − 10000) × chargeRate) × 1e-4      // double
 *     else add = 0
 *     value = DoubleToLong(perShot × (add + 1.0))
 *     竞技场 SpotModType.Arena == 2 → chargeRate 直接置 0（0x5DC127A）
 *     ⇒ PVP 内 value 恒等于 perShot，与伤害数值无关。
 *
 * 二、FT102 FirstBurstGaugeSpeedUp 在每次充能事件上逐条修正
 *     （GetFirstBurstGaugeSpeedUpStatValue 0x5DC9A60）
 *     对 owner 容器内每条 FT102：
 *       valueType=1(整数):            A = value × iteration
 *       valueType=2(万分比) std==1:   A = DoubleToLong(iteration × value × C × 1e-4)
 *       valueType=2(万分比) std!=1:   P = value × iteration
 *       delta = trunc_int32(B × P × 1e-4 + A)      // B = 本次 perShot 值；C = 施加者武器充能值
 *       total += delta（逐条取整后累加，不可先合并比例）
 *     返回 max(total, 0) 作为事件值。
 *     注意：**不是**"开局预充整槽"，而是每次命中按 B 的比例加。
 *
 * 三、FT111 BurstGaugeCharge（FunctionContext.AddFunction 0x5E79B40 的 111 分支）
 *     q = DoubleToLong(burst_energy_max × value × 1e-4)
 *     直接发 BurstChargeEvent，不经过 FT102、不读伤害。
 *
 * 四、进槽（TeamContext.OnBurstCharge 0x5F06B70 → UpdateDamage 0x5D099C0 → UpdateGauge 0x5D09B50）
 *     阵营不匹配直接丢；CurrentBurstState != 0 直接丢；
 *     remaining = max(remaining − float32(value), 0)；remaining ≤ 0 即可爆裂。
 *     全程 float32，无上限钳制（负值会把剩余顶回上限以上）。
 */

export const F32 = Math.fround;

/**
 * 充能单位：武器表 raw 值与 burst_energy_max 同一刻度。
 * 本地导出 CSV 的"每发充能量(%)" = raw / 10000（见 NIKKE_Workflow add_cn_skill_rows.py:123），
 * 因此 raw 10000 = 1%。
 * 刻度不是假设：213 条里有 2 条不是 100 的整数倍（0.225%、0.074%），
 * 万分位（10000=100%）会得到 22.5/7.4 这种非整数值，而该字段是 int，
 * 只有 1e-6 刻度能存成整数 ⇒ 整槽 100% = 1000000。
 */
export const BURST_GAUGE_MAX = 1000000;

/** Math.Round(x, 5, MidpointRounding.ToEven) 的 JS 复刻 */
export function roundHalfEven(x) {
  const scale = 1e5;
  const v = x * scale;
  const f = Math.floor(v);
  const d = v - f;
  let n;
  if (d > 0.5) n = f + 1;
  else if (d < 0.5) n = f;
  else n = f % 2 === 0 ? f : f + 1;
  return n / scale;
}

/** CommonUtil.DoubleToLong 0x3F3AD00：Round(x,5,ToEven) → ±0.5 → 截断 */
export function doubleToLong(x) {
  if (!Number.isFinite(x)) return 0;
  const r = roundHalfEven(x);
  const adj = r > 0 ? 0.5 : (r < 0 ? -0.5 : 0);
  return Math.trunc(r + adj);
}

/** cvttsd2si（向零截断到 int32） */
export function truncInt32(x) {
  if (!Number.isFinite(x)) return 0;
  return Math.trunc(x) | 0;
}

/**
 * SpotWeaponData.SetBurstChargeValue 0x5D0B780。
 * @param {{perShot:number, targetPerShot?:number, fullChargeBurstEnergy?:number,
 *          isTarget?:boolean, chargeRate?:number}} p
 * @returns {number} 本次充能值（raw，10000 = 1%）
 */
export function setBurstChargeValue({ perShot, targetPerShot, fullChargeBurstEnergy = 0,
  isTarget = false, chargeRate = 0 }) {
  const base = isTarget ? (targetPerShot ?? perShot) : perShot;
  let add = 0;
  if (fullChargeBurstEnergy > 0) {
    // 0x5D0B913 sub eax,0x2710 → cvtsi2ss → mulss chargeRate → cvtss2sd → mulsd 1e-4
    const t = F32(F32(fullChargeBurstEnergy - 10000) * F32(chargeRate));
    add = t * 1e-4;
  }
  return doubleToLong(base * (add + 1.0));
}

/**
 * GetFirstBurstGaugeSpeedUpStatValue 0x5DC9A60 的可执行版。
 *
 * @param {object} p
 * @param {number} p.base             本次 perShot 充能值 B
 * @param {Array}  [p.functions]      owner 当前生效的效果行（只取 ft===102）
 * @param {number} [p.casterValue]    FT102 standard==1 缺省的施加者武器充能值 C；
 *                                    自施放时 C === B（同一次 SetBurstChargeValue 写入值）
 * @param {(casterId:string)=>number|undefined} [p.casterValueOf]
 *                                    按 casterId 取施加者 CurrentBurstChargeValue；
 *                                    给出时优先于 casterValue，未命中回退 B
 * @param {string} [p.ownerId]
 * @returns {{value:number, contributions:Map<string,number>}}
 */
export function applyFirstBurstGaugeSpeedUp({ base, functions = [], casterValue, casterValueOf, ownerId = '' }) {
  const B = base;
  const seed = truncInt32(Math.max(0, B)); // 0x5DC9BF7 Math.Max(0, B) → 转 int64
  const contributions = new Map([[ownerId, seed]]);
  let total = B;                            // 0x5DC9D0D：累计起点是原始 B，不是 seed

  for (const f of functions) {
    if (f.ft !== 102) continue;
    // C = 施加者当前武器充能值；按行取施加者，缺省回退调用方给的值，再回退 B
    const C = (f.casterId && casterValueOf ? casterValueOf(f.casterId) : undefined)
      ?? casterValue ?? B;
    const n = f.stacks ?? 1;
    const v = f.value ?? 0;
    let A = 0;   // 直接整数增量
    let P = 0;   // 以 B 为基数的万分比例
    if (f.valueType === 1) {
      A = v * n;                            // 0x5DC9FA1 imul
    } else if (f.valueType === 2) {
      if (f.standard === 1) {
        // 0x5DC9F43–0x5DC9F59：先 int64 连乘，再转 double × 1e-4 过 DoubleToLong
        A = doubleToLong((n * v * C) * 1e-4);
      } else {
        P = v * n;
      }
    }
    // 0x5DC9FC4 imul rax,r14 → cvtsi2sd → mulsd 1e-4 → addsd A → cvttsd2si
    const delta = truncInt32((B * P) * 1e-4 + A);
    total += delta;
    const key = f.casterId ?? ownerId;
    contributions.set(key, (contributions.get(key) ?? 0) + delta);
  }
  return { value: truncInt32(Math.max(0, total)), contributions };
}

/**
 * FT111 BurstGaugeCharge 的直接充能量（0x5E7A1C9 分支）。
 * @param {number} burstEnergyMax burst_energy_max（= 槽上限）
 * @param {number} value          FunctionValue（万分比，10000 = 100%）
 */
/** International ProcessDamageTargetInfo calls GetStatValue(FT102): integer
 * and caster-standard deltas form one pool; other percentages form one pool,
 * followed by one final DoubleToLong. CN retains its per-row truncation model.
 */
export function applyBurstGaugeStatValue({base,functions=[],casterValueOf,ownerId=''}){
  let additions=0,percent=0;
  for(const f of functions){
    if(f.ft!==102)continue;
    const n=f.stacks??1,v=f.value??0;
    if(f.valueType===1)additions+=n*v;
    else if(f.valueType===2){
      if(f.standard===1)additions+=doubleToLong(n*v*(casterValueOf?.(f.casterId)??base)*1e-4);
      else percent+=n*v;
    }
  }
  const value=Math.max(0,doubleToLong(base+additions+base*percent*1e-4));
  return {value,contributions:new Map([[ownerId,value]])};
}

export function burstGaugeChargeValue(burstEnergyMax, value) {
  return doubleToLong(burstEnergyMax * (value * 1e-4));
}

/**
 * 单队伍爆裂槽。remaining 是"还差多少"，不是已积累量。
 */
export class BurstGauge {
  /** @param {number} max 槽容量（raw 单位，10000 = 1%） */
  constructor(max = BURST_GAUGE_MAX) {
    if (!(max > 0)) throw new RangeError(`BurstGauge: 非法上限 ${max}`);
    this.max = F32(max);
    this.remaining = F32(max);   // +0x28 CurrentBurstGauge
    this.ready = false;          // CurrentBurstState != 0 的等价标记
    this.totalCharge = 0;        // 累计入槽量（展示用）
    this.events = 0;             // 入槽次数（展示用）
  }

  /** 已积累量 */
  get filled() {
    return F32(this.max - this.remaining);
  }

  /** UI 百分比（get_GaugeRate 0x5D0A2B0 = remaining / max，注意是"剩余比例"） */
  get gaugeRate() {
    return this.remaining / this.max;
  }

  /** 已积累百分比（0~1），给面板用 */
  get fillRate() {
    return 1 - this.remaining / this.max;
  }

  /**
   * UpdateDamage 0x5D099C0 + UpdateGauge 0x5D09B50。
   * @param {number} value 充能事件值（raw；与伤害无关）
   * @returns {boolean} 本次之后是否达到可爆裂
   */
  applyCharge(value) {
    if (this.ready) return true;           // CurrentBurstState != 0 → 直接返回
    this.totalCharge += value;
    this.events += 1;
    this.remaining = F32(Math.max(F32(this.remaining - F32(value)), 0));
    if (this.remaining <= 0) this.ready = true;
    return this.ready;
  }

  /** 释放爆裂：槽重置（ChangeBurstStep / Reset 语义） */
  release() {
    this.remaining = this.max;
    this.ready = false;
    this.totalCharge = 0;
    this.events = 0;
  }
}

/**
 * 从每发充能推算充满所需发数/时间（不再经过伤害）。
 * @param {{max?:number, chargePerShot:number, shotsPerSecond:number}} p
 */
export function estimateChargeTime({ max = BURST_GAUGE_MAX, chargePerShot, shotsPerSecond }) {
  if (!(chargePerShot > 0) || !(shotsPerSecond > 0)) {
    throw new RangeError('estimateChargeTime: 每发充能与射速必须为正');
  }
  const shots = Math.ceil(max / chargePerShot);
  return { shots, seconds: shots / shotsPerSecond };
}
