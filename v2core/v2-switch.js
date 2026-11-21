/**
 * 计算核心开关：同一张页面里在 V1（经典帧排布）与 V2（SD 逐帧驱动）之间切换。
 *
 * 为什么不再有第二个页面：V2 以前是 /v2core/index.html —— 主站 index.html 的
 * 手工副本，只有脚本尾巴不同。两份 DOM 各自演化，主站加的功能经常漏到 V2 页上，
 * 表现就是「只是换了个计算核心，一大片操作坏了」。所以现在只有一张页面，V2 不再
 * 复制 DOM，也不再复制 app.js，只把自己挂到同一组全局入口上。
 *
 * 分工：
 *   __V1_IMPL__      app.js 自己的实现，本文件加载时快照一份，永远可以切回去
 *   __V2_IMPL__      v2-override.js / v2-engine.mjs 通过 __v2Register() 登记
 *   __CALC_ENGINE__  'v1' | 'v2'，存 localStorage，也接受 ?engine=v2（旧链接）
 *
 * 为什么要在 globalThis 上装转发器：app.js 是按名字调用全局函数的
 * （`computeBattleResults()`、`getChargeChartMarkup()`…），函数声明就挂在
 * globalThis 上。只有把这些槽位换成按当前 mode 分派的转发器，V1 才能在**不重载
 * 页面**的情况下把入口拿回来。V2 侧则统一走 `__v2Register`，不再直接覆盖全局。
 *
 * V2 的脚本是**按需加载**的：默认 v1 时一个字节都不下（three.js + 模拟器体量不小），
 * 只有切到 V2（或带 ?engine=v2 打开）才注入，注入顺序固定：
 *   1. v2-timing.js     （经典脚本，v2-override 在加载时就要读它的表）
 *   2. v2-override.js   （经典脚本，先接管蓄力帧数并放行首帧）
 *   3. v2-charge.mjs / v2-engine.mjs（模块，importmap 已在 index.html 里备好）
 */
(function () {
  const STORAGE_KEY = 'nikke-calc-engine';
  const V2_VERSION = 'V1.80.1167';

  /** 会被 V2 接管的全局入口。顺序不重要，名必须与 app.js / V2 侧一致。 */
  const ENTRIES = [
    'computeBattleResults',
    'computePaidArenaBattleResultsForRow',
    'getPaidArenaChartResultForTeam',
    'simulateBurst',
    'simulatePaidArenaBurst',
    'getChargeChartMarkup',
    'getScarletCounterGroups',
    'getJackalLinkGroups',
    'getChargeFrames',
    'getCharacterChargeFrameInfo',
    'getTimingLabel',
    'getChargeWeaponDetailLines',
    'getCurrentTeamShareParams',
    'createSlotSettingsModal',
  ];

  const V1 = (globalThis.__V1_IMPL__ = {});
  const V2 = (globalThis.__V2_IMPL__ = {});
  for (const name of ENTRIES) {
    if (typeof globalThis[name] === 'function') V1[name] = globalThis[name];
  }

  /** V2 侧取「原来的实现」必须走这里。直接读 globalThis 会拿到转发器本身，
   *  于是在 V2 模式下绕回自己，变成无限递归（getChargeChartMarkup 就是这么包的）。 */
  globalThis.__v1 = name => V1[name] || null;
  globalThis.__v2Register = (name, fn) => {
    V2[name] = fn;
    return fn;
  };

  let mode = readMode();
  globalThis.__CALC_ENGINE__ = { get current() { return mode; } };

  for (const name of ENTRIES) {
    if (!V1[name]) continue;
    globalThis[name] = function () {
      const impl = (mode === 'v2' && V2[name]) ? V2[name] : V1[name];
      return impl.apply(this, arguments);
    };
  }

  function readMode() {
    try {
      const param = new URLSearchParams(location.search).get('engine');
      if (param === 'v1' || param === 'v2') {
        localStorage.setItem(STORAGE_KEY, param);
        return param;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'v1' || saved === 'v2') return saved;
    } catch { /* 隐私模式下 localStorage 会抛，按默认 v1 处理 */ }
    return 'v1';
  }

  function persist(next) {
    mode = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* 存不下就只在本次生效 */ }
    // 地址栏里的 ?engine= 优先级高于 localStorage。切换后必须抹掉，否则刷新又跳回去。
    try {
      const url = new URL(location.href);
      if (url.searchParams.has('engine')) {
        url.searchParams.delete('engine');
        history.replaceState(null, '', url.href);
      }
    } catch { /* 忽略：不影响本次切换 */ }
  }

  function releaseGate() {
    const open = globalThis.__NIKKE_RELEASE_RENDER__;
    if (typeof open !== 'function') return;
    globalThis.__NIKKE_RELEASE_RENDER__ = null;
    open();
  }

  function injectScript(src, isModule) {
    return new Promise((resolve, reject) => {
      const element = document.createElement('script');
      if (isModule) element.type = 'module';
      element.src = src;
      element.onload = () => resolve();
      element.onerror = () => reject(new Error(`加载失败 ${src}`));
      document.head.append(element);
    });
  }

  let loading = null;
  /** 注入 V2 的三段脚本；成功后 __V2_ENGINE__ 就已就位（模块里的顶层 await 决定
   *  了 load 事件在整张模块图求值完之后才触发）。 */
  function loadV2() {
    if (loading) return loading;
    const query = `?v=${encodeURIComponent(V2_VERSION)}`;
    loading = (async () => {
      await injectScript(`/v2core/v2-timing.js${query}`);
      // v2-override 里会按 mode 决定是否先占住计算入口、放行首帧，所以它必须在
      // v2-engine 之前落地：首帧不能是 V1 的数字。
      await injectScript(`/v2core/v2-override.js${query}`);
      await Promise.all([
        injectScript(`/v2core/v2-charge.mjs${query}`, true),
        injectScript(`/v2core/v2-engine.mjs${query}`, true),
      ]);
      wrapEngineReady();
    })().catch(error => {
      loading = null;
      throw error;
    });
    return loading;
  }

  /** 分享 / 导出模块会 `await __V2_ENGINE__.ready()`。V2 脚本一旦加载过，这个对象
   *  就一直在，所以 V1 模式下要让它立刻返回，否则导出一张 V1 的图还要等一次完整
   *  V2 模拟。 */
  function wrapEngineReady() {
    const engine = globalThis.__V2_ENGINE__;
    if (!engine || engine.__switchWrapped) return;
    const ready = engine.ready.bind(engine);
    const wrapped = Object.create(engine);
    wrapped.ready = (...args) => (mode === 'v1' ? Promise.resolve() : ready(...args));
    wrapped.__switchWrapped = true;
    globalThis.__V2_ENGINE__ = wrapped;
  }

  function notify(message) {
    if (typeof globalThis.showToast === 'function') globalThis.showToast(message);
  }

  // 切换过程中 app.js 的 render 也会调 __bindEngineSwitch → repaint()，如果 repaint()
  // 每次都从 mode 推文案，就会把「加载中」盖掉。这里记住阶段，无参调用沿用它。
  let phase = 'idle';
  function repaint(nextPhase) {
    if (nextPhase) phase = nextPhase;
    const button = document.getElementById('calculatorEngineSwitch');
    const loading = phase === 'loading';
    if (button) {
      button.textContent = loading
        ? (mode === 'v2' ? '计算核心：V2（加载中…）' : '计算核心：V1（切换中…）')
        : `计算核心：${mode === 'v2' ? 'V2' : 'V1'}`;
      button.title = loading ? '正在加载并运行新的计算核心，图表会保留到新结果就绪。'
        : mode === 'v2'
          ? '当前由 SD 逐帧驱动计算。点击切回 V1（帧排布核心）。'
          : '当前由经典帧排布核心计算。点击切换到 V2（SD 逐帧驱动）。';
      button.dataset.engine = mode;
    }
    const badge = ensureBadge();
    if (badge) {
      badge.textContent = loading
        ? (mode === 'v2' ? 'V2 核心 · 加载中…' : 'V1 核心 · 切换中…')
        : mode === 'v2' ? 'V2 核心 · 逐帧射击／技能充能' : 'V1 核心 · 帧排布';
      badge.title = loading ? '正在加载并运行新的计算核心，图表会保留到新结果就绪。'
        : mode === 'v2'
          ? '未填角色的站位使用静止标准碰撞靶；计算采用本区数据与期望概率，时间轴为60fps显示帧。'
          : '经典帧排布核心。点击切到 V2（SD 逐帧驱动），或在侧边栏切换。';
      badge.dataset.engine = mode;
    }
  }

  function ensureBadge() {
    let badge = document.getElementById('calc-engine-status');
    if (badge) return badge;
    if (!document.body) return null;
    badge = document.createElement('button');
    badge.id = 'calc-engine-status';
    badge.type = 'button';
    badge.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99999;' +
      'background:#2b3a67;color:#dfe4ff;border:1px solid #4a6cf7;border-radius:999px;' +
      'padding:4px 10px;font-size:11.5px;line-height:1.6;opacity:.85;cursor:pointer;';
    badge.addEventListener('click', () => toggle());
    document.body.append(badge);
    return badge;
  }

  let busy = false;
  function rerender() {
    if (typeof globalThis.invalidateBattleResults === 'function') globalThis.invalidateBattleResults();
    if (typeof globalThis.render === 'function') globalThis.render();
  }

  async function setEngine(next, { silent = false } = {}) {
    if (next !== 'v1' && next !== 'v2') return;
    if (busy || next === mode) { repaint(); return; }
    busy = true;
    const previous = mode;
    persist(next);
    // 关键：切换期间**不动界面**。首帧一重绘就会把 app.js 的「计算中」占位缓存进
    // state.battleResults，图先被清空、再等十来秒才回来 —— 看上去就是「点了没反应」
    // 或者「图没了」。这里等新核心真的算出结果，再一次性换过去。
    repaint('loading');
    try {
      if (next === 'v2') {
        if (!silent) notify('正在加载 V2 计算核心…');
        await loadV2();
        // 等首次结果就绪再重绘。设上限：模型多或机器慢时（实测冷启动 10–25 秒）
        // 不能让按钮永远停在「加载中」——超时也放行，后续 V2 自己算完会再重绘。
        const ready = globalThis.__V2_ENGINE__?.ready?.();
        if (ready) await Promise.race([ready, new Promise(resolve => setTimeout(resolve, 25000))]);
      }
      rerender();
    } catch (error) {
      console.error('[v2core] 切换计算核心失败', error);
      persist(previous);
      phase = 'idle';
      repaint();
      notify(`V2 计算核心加载失败，已回到 V1：${error.message}`);
      rerender();
      return;
    } finally {
      busy = false;
      phase = 'idle';
    }
    repaint();
  }

  const toggle = () => setEngine(mode === 'v2' ? 'v1' : 'v2');
  globalThis.__setCalcEngine = next => setEngine(next);
  globalThis.__toggleCalcEngine = toggle;
  globalThis.__loadCalcEngineV2 = loadV2;

  /** app.js 每次 render 都会调一次；这里用 dataset.bound 防重复绑定。 */
  globalThis.__bindEngineSwitch = function (button) {
    const element = button || document.getElementById('calculatorEngineSwitch');
    if (!element) return;
    if (!element.dataset.bound) {
      element.dataset.bound = 'true';
      element.addEventListener('click', event => {
        event.preventDefault();
        toggle();
      });
    }
    repaint();
  };

  // v1：立刻放行首帧（不需要等任何 V2 脚本）。v2：由 v2-override 装好占位实现后放行，
  // 否则首帧会先画一份 V1 的结果再被替换 —— 就是刷新时那一下闪。
  if (mode === 'v2') {
    loadV2().catch(error => {
      console.error('[v2core] V2 计算核心加载失败，回落 V1', error);
      persist('v1');
      repaint();
      releaseGate();
    });
  } else {
    releaseGate();
  }

  if (document.readyState === 'loading') {
    addEventListener('DOMContentLoaded', () => globalThis.__bindEngineSwitch());
  } else {
    globalThis.__bindEngineSwitch();
  }
})();
