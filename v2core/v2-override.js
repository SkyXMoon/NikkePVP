/**
 * V2 站点的蓄力参数预览适配；正式队伍与充能轴结果由 v2-engine.mjs 接管。
 *
 * 做法：包两层。
 *   getChargeFrames              —— 蓄力武器的 chargeFrames / firstFrame / interval 用 V2 算
 *   getCharacterChargeFrameInfo  —— 详情页那行「蓄力时间：2s（120F）」的帧数用 V2 算
 *
 * 蓄速：两条输入并行。
 *   装备词条模式 —— 从 characterChargeSpeedEntries 取四条词条的**原始档位**，
 *                    连同蓄速魔方一起交给 calcFromEntries，由 GetStatValue 的
 *                    User 池逐条在蓄力单位上取整。这条是客户端形状。
 *   手动总蓄速   —— 站点已经把一切压成一个数，只能拿 chargeSpeedPercent 走
 *                    单条记录（calc）。
 * 优先词条：站点自己的 calculateChargeSpeedFromEntries 会用 Math.round 把
 * 5.8→6、5.51→6…，在长蓄力上会放大成 tick 差，所以能绕开就绕开。
 * 没有蓄速时直接用导出的基准 tick，保证与报告一致。
 *
 * 坐标原点：站点时间轴的 0 = 起手瞬间；V2 的第 6 tick 也是起手瞬间。
 * 所以站点帧数 = V2 相对 tick × 2（60 fps 显示帧）。
 */
(function () {
  const TABLE = globalThis.__V2_TIMING || {};
  // 同一张页面里 V1/V2 并存：全局入口由 v2-switch.js 换成了按模式分派的转发器。
  // 登记而不是直接覆盖，V1 才能随时切回来；取「原实现」也走 __v1，否则拿到的是
  // 转发器本身，V2 模式下会绕回自己。
  const register = (name, fn) => (typeof globalThis.__v2Register === 'function'
    ? globalThis.__v2Register(name, fn)
    : (globalThis[name] = fn));
  const v1 = name => (typeof globalThis.__v1 === 'function'
    ? globalThis.__v1(name)
    : globalThis[name]);
  const v2Mode = () => globalThis.__CALC_ENGINE__?.current === 'v2';
  // app.js 的首帧在等这个闸门（见 index.html 里的 __NIKKE_RENDER_GATE__）。覆盖脚本
  // 没机会跑完就不能让页面一直停在加载态，所以所有退出路径都放行。
  const release = () => {
    const open = globalThis.__NIKKE_RELEASE_RENDER__;
    if (typeof open !== 'function') return;
    globalThis.__NIKKE_RELEASE_RENDER__ = null;
    open();
  };
  try {
  const orig = v1('getChargeFrames') || globalThis.getChargeFrames;
  if (typeof orig !== 'function') {
    console.error('[v2core] 找不到 getChargeFrames，替换失败');
    release();
    return;
  }

  const norm = (s) => String(s ?? '')
    .replace(/[\s\u3000]/g, '')
    .replace(/：/g, ':')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .toLowerCase();

  const stats = { hit: 0, miss: 0, nonCharge: 0, arcaApplied: 0, entriesApplied: 0, speedApplied: 0, speedError: 0 };

  /**
   * 「XX 珍藏」是同一角色的珍藏品形态，客户端同一个 rid、同一套武器参数
   * （实测 海伦/拉普拉斯/贝伊 珍藏与原版 0% 蓄力帧、单发充能占比完全一致），
   * 只是站点把它当独立条目，所以查找时剥掉后缀再匹配一次。
   */
  function lookup(character) {
    const key = norm(character && character.name);
    if (TABLE[key]) return TABLE[key];
    const bare = key.replace(/珍藏$/, '');
    return bare !== key ? TABLE[bare] || null : null;
  }

  /** 该角色当前的蓄速（与原站 getChargeFrames 里同一取法） */
  function speedOf(character) {
    const usable = typeof globalThis.canApplyChargeSpeed === 'function'
      ? globalThis.canApplyChargeSpeed(character) : true;
    return usable ? Number(character && character.chargeSpeedPercent) || 0 : 0;
  }

  /** 站点固定蓄速魔方值；阿卡模式按魔方等级是 1.06 / 1.59 / 2.12，用实际值。 */
  const CUBE_CHARGE_SPEED = 2.12;

  /**
   * 解出「词条原始档位 + 魔方加成」，三个来源按可信度排优先级：
   *
   *  arca   阿卡数据。它给了 speedEntries（四槽原始档位，两位小数）和
   *         chargeSpeed（含魔方加成的总数，两位小数）。魔方按等级分档，
   *         所以不能直接用 2.12，要用 chargeSpeed - ΣspeedEntries 反推。
   *  gear   本地装备词条。站点把词条和魔方压成整数百分比存进 chargeSpeeds，
   *         但 characterChargeSpeedEntries 里还留着原始档位，魔方用站点常量。
   *  null   手动总蓄速（此时站点会把词条清空），交给 calc() 走单条。
   */
  function speedSourceOf(character, teamKey) {
    if (!character || character.id == null) return null;

    const getArca = globalThis.getArcaChargeParameters;
    if (typeof getArca === 'function') {
      let arca = null;
      try {
        arca = getArca(character, teamKey);
      } catch (err) {
        arca = null;
      }
      if (arca) {
        const entries = (Array.isArray(arca.speedEntries) ? arca.speedEntries : [])
          .map((v) => Number(v))
          .filter((v) => v > 0);
        const total = Number(arca.chargeSpeed);
        const entrySum = entries.reduce((sum, v) => sum + v, 0);
        // 反推魔方那一段；四舍五入到两位小数消掉浮点尾差。
        const cubeBonus = Number.isFinite(total)
          ? Math.max(0, Math.round((total - entrySum) * 100) / 100)
          : 0;
        if (entries.length || cubeBonus > 0) return { kind: 'arca', entries, cubeBonus };
        return null;
      }
    }

    const getEntries = globalThis.getSavedCharacterChargeSpeedEntries;
    if (typeof getEntries !== 'function') return null;
    let entries;
    try {
      entries = getEntries(character, teamKey);
    } catch (err) {
      return null;
    }
    if (!Array.isArray(entries) || !entries.some((v) => Number(v) > 0)) return null;
    const getCube = globalThis.getSavedCharacterCubeType;
    const cubeType = typeof getCube === 'function' ? getCube(character, teamKey) : null;
    const cubeBonus = cubeType === 'charge-speed' ? CUBE_CHARGE_SPEED : 0;
    return { kind: 'gear', entries, cubeBonus };
  }

  /** 蓄速生效后的满蓄 tick 数；算不了就回落到导出基准值 */
  function chargeTicksOf(character, row, teamKey) {
    const live = globalThis.__V2_CHARGE;
    if (!live || !(row.chargeUnits > 0)) return { ticks: row.chargeTicks, units: row.chargeUnits, source: 'base' };
    // 这里抛错会连带整个充能曲线白屏，所以宁可回落也不能冒泡。
    try {
      const src = character.chargeSpeedInputSource === 'total' ? null : speedSourceOf(character, teamKey);
      if (src) {
        const r = live.calcFromEntries(row.chargeUnits, src.entries, src.cubeBonus);
        if (r) {
          if (src.kind === 'arca') stats.arcaApplied++;
          else stats.entriesApplied++;
          return { ticks: r.ticks, units: r.units, source: src.kind };
        }
      }
      const speed = speedOf(character);
      if (speed > 0) {
        stats.speedApplied++;
        return { ...live.calc(row.chargeUnits, speed), source: 'speed' };
      }
    } catch (err) {
      stats.speedError++;
      console.error('[v2core] 蓄速换算失败，回落导出基准值', row.name, err);
    }
    return { ticks: row.chargeTicks, units: row.chargeUnits, source: 'base' };
  }

  function framesOf(character, teamKey, useGear = true) {
    const row = lookup(character);
    // 只接管真正要蓄力的角色：非蓄力枪种（AR/SG/SMG）与 MG 预热在 V2 里
    // chargeTicks 是 null，蓄力 0 的角色是 0，都不改 —— MG 的 96 帧预热里程碑
    // 是「首个里程碑」不是首发，覆盖它会破坏语义。
    if (!row || !(row.chargeTicks > 0)) return null;
    const { ticks, units, source } = useGear
      ? chargeTicksOf(character, row, teamKey)
      : { ticks: row.chargeTicks, units: row.chargeUnits, source: 'base' };
    const baseFrames = (row.chargeTicks - 1) * 2;
    const frames = (ticks - 1) * 2;
    return { row, ticks, units, frames, source, delta: frames - baseFrames };
  }

  register('getChargeFrames', function (character, positionIndex, teamKey) {
    const base = orig.call(this, character, positionIndex, teamKey);
    const r = framesOf(character, teamKey);
    if (!r) {
      if (lookup(character)) stats.nonCharge++; else stats.miss++;
      return base;
    }
    stats.hit++;
    const row = r.row;
    // 站点原 firstFrame = 蓄力 + 出手 + 飞行；V2 用首次命中 tick（已含弹道）。
    // 飞行帧必须和 firstFrame 同源：站点是拿 firstFrame − projectileFlightFrames
    // 反推出手帧的（app.js:6335 / 6375 / 6667），留着站点那套 16 帧估值，火箭就会
    // 在蓄力还没走完时起飞。原生飞行帧 = 首个 HIT − 首个 FIRE。
    const flightFrames = row.firstHitRel != null && row.firstFireRel != null
      ? (row.firstHitRel - row.firstFireRel) * 2
      : base.projectileFlightFrames;
    return Object.assign({}, base, {
      chargeFrames: r.frames,
      baseChargeFrames: r.frames,
      firstFrame: row.firstHitRel == null ? base.firstFrame : row.firstHitRel * 2 + r.delta,
      projectileFlightFrames: flightFrames,
      interval: r.row.intervalTicks ? r.row.intervalTicks * 2 + r.delta : base.interval,
      baseIntervalFrames: r.row.intervalTicks ? r.row.intervalTicks * 2 + r.delta : base.baseIntervalFrames,
      v2Charge: true,
      v2ChargeTicks: r.ticks,
      v2ChargeSeconds: r.units / 100,
      v2ChargeSource: r.source,
      v2ChargeSpeed: speedOf(character),
    });
  });

  // 详情页那行「蓄力时间：2s（120F）」的帧数也换成 V2：秒数不动，帧数用整 tick。
  // 这一层不带槽位蓄速（原站同样不带），所以只换算基础蓄力。
  const origInfo = v1('getCharacterChargeFrameInfo');
  if (typeof origInfo === 'function') {
    register('getCharacterChargeFrameInfo', function (character) {
      const base = origInfo.call(this, character);
      const r = framesOf(character, undefined, false);
      if (!r) return base;
      return { seconds: base.seconds, frames: r.ticks * 2 };
    });
  }

  const originalTimingLabel = v1('getTimingLabel');
  if (typeof originalTimingLabel === 'function') {
    register('getTimingLabel', function (character) {
      const r = framesOf(character, undefined, false);
      if (!r) return originalTimingLabel.call(this, character);
      const row = r.row;
      const preparation = row.preReadyTick;
      const parts = [`蓄力 ${r.ticks}次计步（30fps）`];
      if (preparation != null) parts.push(`准备 ${preparation}步`);
      if (row.inputType === 3) parts.push('连射与再蓄力按技能发数计算');
      else if (row.intervalTicks != null) parts.push(`周期 ${row.intervalTicks}F（30fps）`);
      if (row.firstFireRel != null) parts.push(`首发 ${row.firstFireRel}F（30fps）`);
      return parts.join(' / ');
    });
  }

  const originalDetailLines = v1('getChargeWeaponDetailLines');
  if (typeof originalDetailLines === 'function') {
    register('getChargeWeaponDetailLines', function (character) {
      const r = framesOf(character, undefined, false);
      if (!r) return originalDetailLines.call(this, character);
      const lines = originalDetailLines.call(this, character);
      // 这里走全局名：v2 模式下转发到本文件的 getTimingLabel，v1 模式下走原实现。
      return [getTimingLabel(character), ...lines.slice(1)];
    });
  }

  globalThis.__V2_COVERAGE__ = stats;
  // 只有真要跑 V2 时才把计算入口先占成「加载中」：V1 模式下这等于把页面按在错误态。
  // 占位实现就位之后才放行首帧 —— app.js 的第一次 render 拿到「V2核心加载中」，
  // 不会先画一份 V1 结果再被替换（刷新时那一下闪）。
  if (v2Mode()) {
    const loadingResult = () => ({ engine: 'v2', error: 'V2核心加载中…', members: [] });
    const loadingPair = () => ({ attackResult: loadingResult(), defenseResult: loadingResult() });
    register('computeBattleResults', loadingPair);
    register('computePaidArenaBattleResultsForRow', loadingPair);
    register('getPaidArenaChartResultForTeam', loadingResult);
    register('simulateBurst', loadingResult);
    register('simulatePaidArenaBurst', loadingResult);
  }
  release();
  console.info('[v2core] 已接管 ', Object.keys(TABLE).length, '人；命中统计见 __V2_COVERAGE__');
  } finally {
    // 中途抛错也要放行，否则首帧会一直等到 index.html 里那个兜底超时。
    release();
  }
})();
