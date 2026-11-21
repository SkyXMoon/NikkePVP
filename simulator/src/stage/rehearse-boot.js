/**
 * 演练页的宿主脚本：只负责「参数、进度、错误」三件事，3D 与逐帧全部交给
 * `stage.js`（调试页与演练页共用同一份实现，避免两套 DOM 各自漂移）。
 *
 * URL 约定（由主页面「演练」入口拼好）：
 *   region=cn|global      数据与模型目录
 *   arena=arenanormal|arenaspecial|arenachampion
 *   red=c232,c430,...     攻方 5 个角色码（cNNN，皮肤取默认）
 *   blue=c010,c011,...    守方 5 个角色码
 *   title=...             可选，顶部显示的对局标题
 *   frame=123             可选，进入时停在这一帧
 */
const q = new URLSearchParams(location.search);
const region = q.get('region') === 'global' ? 'global' : 'cn';
const arena = ['arenanormal', 'arenaspecial', 'arenachampion'].includes(q.get('arena'))
  ? q.get('arena') : 'arenanormal';

const $ = (id) => document.getElementById(id);
const loading = $('loading');
const stageText = $('ld-stage');
const barFill = $('ld-bar');
const errorBox = $('ld-error');
const retry = $('ld-retry');
const hintBox = $('ld-hint');
const gotoLink = $('ld-goto');

if (q.get('title')) $('title').textContent = q.get('title');
// stage.js 从这里读场次；它的 <select id="arena"> 是隐藏的调试控件，但值必须一致，
// 否则 boot 时会用默认场次覆盖 URL。
const arenaSelect = $('arena');
if (arenaSelect) arenaSelect.value = arena;

// 必须在 fail() 之前声明：缺参数/未开会员时 fail 可能在模块顶部就执行，访问后者会踩 TDZ。
let settled = false;
// 会员校验期间 stage.js 还没加载，#status 仍是最初的「加载中…」，
// 让 poll 别把遮罩文案改成它。
let membershipPending = true;

/** 没传 red/blue 时不要静默用调试页的默认阵容：那会让演练页显示一组不相干的角色。 */
const hasLineup = Boolean(q.get('red') && q.get('blue'));
if (!hasLineup) fail(new Error('缺少队伍参数：请从竞技场页面的「演练」按钮进入。'));

function fail(error, action) {
  settled = true;
  loading.classList.remove('done');
  loading.style.display = '';
  stageText.textContent = '无法开始演练';
  errorBox.style.display = 'block';
  errorBox.textContent = String(error?.message || error);
  // 有明确出口（去登录 / 返回主站）时不再给「重新加载」：刷新还是同一个身份，白等一遍。
  retry.hidden = Boolean(action);
  if (action && gotoLink) {
    gotoLink.hidden = false;
    gotoLink.href = action.href;
    gotoLink.textContent = action.label;
  }
  barFill.style.width = '100%';
  barFill.style.background = 'linear-gradient(90deg,#7a2f27,#e05a4d)';
}
retry?.addEventListener('click', () => location.reload());

/** 阶段文案 → 进度。stage.js 的 status 是唯一可信的阶段来源，不另开一套状态机。 */
function progressFrom(text) {
  const model = text.match(/模型\s+(\d+)\/(\d+)/);
  if (model) return { pct: 32 + 60 * (Number(model[1]) / Math.max(1, Number(model[2]))), label: `下载 SD 模型 ${model[1]}/${model[2]}` };
  if (text.includes('加载索引')) return { pct: 6, label: '读取角色与场地数据' };
  if (text.includes('计算模拟')) return { pct: 20, label: '计算逐帧事件' };
  if (text.includes('加载弹体')) return { pct: 28, label: '准备弹体与特效' };
  if (text.startsWith('就绪')) return { pct: 100, label: '就绪' };
  if (text.includes('场地')) return { pct: 34, label: '下载竞技场模型' };
  if (text.includes('加载')) return { pct: 4, label: text };
  return null;
}

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)}MB`;

/**
 * 演练是会员功能。主站「演练」按钮已经拦过一道，这里再拦一次——演练页是静态页，
 * 直接改 URL 也能进来，只在主站拦等于没拦。
 * 「会员」在站内就是 season_data 这一条权益（与主站 canUseSeasonDataFeature 同一判据）。
 */
const MEMBER_FEATURE_KEY = 'season_data';
const AUTH_SESSION_STORAGE_KEY = 'nikke-supabase-auth-session-v1';

function readAuthSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AUTH_SESSION_STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object' || !parsed.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

function membershipRequired() {
  // 本地开发默认放行（调试常常没登录），线上任何域名都强制校验；
  // 这个参数只能「在本地多拦一道」，无法在生产放宽。
  const host = location.hostname;
  const isLocal = host === '127.0.0.1' || host === 'localhost' || host === '';
  return !isLocal || q.get('enforceMember') === '1';
}

async function verifyMembership() {
  try {
    return await checkMembership();
  } finally {
    // 无论放行还是拦下，校验都已经有结论：遮罩文案归 fail()/轮询接管。
    membershipPending = false;
  }
}

async function checkMembership() {
  if (!membershipRequired()) return true;
  stageText.textContent = '校验会员权限…';
  const session = readAuthSession();
  if (!session?.accessToken) {
    fail(new Error('演练是会员功能，请先登录账号后再进入。'), { href: '/?signin=1', label: '去登录' });
    return false;
  }
  const cfg = globalThis.__NIKKE_CONFIG__;
  if (!cfg?.functionsBaseUrl || !cfg?.publishableKey) {
    fail(new Error('缺少账号服务配置，无法校验会员权限。'));
    return false;
  }
  let rows = [];
  try {
    const res = await fetch(`${cfg.functionsBaseUrl}/account-status`, {
      headers: {
        accept: 'application/json',
        apikey: cfg.publishableKey,
        authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (res.status === 401 || res.status === 403) {
      fail(new Error('登录状态已失效，请回到主站重新登录。'), { href: '/?signin=1', label: '去登录' });
      return false;
    }
    const payload = await res.json().catch(() => null);
    if (!res.ok || !payload?.ok) throw new Error(payload?.message || `HTTP ${res.status}`);
    rows = payload?.data?.entitlements || [];
  } catch (error) {
    fail(new Error(`无法校验会员权限：${error?.message || error}`));
    return false;
  }
  const active = rows.some((row) => {
    const key = String(row?.featureKey || row?.feature_key || '').trim();
    if (key !== MEMBER_FEATURE_KEY) return false;
    const status = String(row?.status || '').toLowerCase();
    if (status && status !== 'active' && status !== 'trial') return false;
    // 服务端已经滤过到期行，这里再兜一次：缓存/中间层可能带回旧响应。
    const expires = row?.expiresAt || row?.expires_at || '';
    if (!expires) return true;
    const at = Date.parse(expires);
    return Number.isNaN(at) ? true : at > Date.now();
  });
  if (!active) {
    fail(new Error('当前账号还不是会员。开通会员（小程序「账号 → 会员与我的订单」）后即可使用演练。'), { href: '/', label: '返回主站' });
    return false;
  }
  return true;
}

function poll() {
  // 已经进了失败态或完成态就不再轮询：否则 fail() 写下的「无法开始演练」
  // 会被下一帧用 #status 的旧文案（加载中…）覆盖掉。
  if (settled) return;
  if (membershipPending) { requestAnimationFrame(poll); return; }
  const text = $('status')?.textContent?.trim() ?? '';
  if (text.startsWith('失败')) { settled = true; fail(new Error(text.replace(/^失败：/, ''))); return; }
  const p = progressFrom(text);
  if (p) {
    stageText.textContent = p.label;
    barFill.style.width = `${Math.min(100, p.pct)}%`;
  }
  // 模型命中本地缓存时不出网，文案要跟着变；否则「已下载 22MB」会让人以为每次都在重下。
  // 有缓存命中时以缓存量为主：此时剩下的数字多半是浏览器已缓存、只在内存里解码的
  // 数据表，不代表真的在走网络。
  const down = Number(globalThis.__sdBytes) || 0;
  const cached = Number(globalThis.__sdCachedBytes) || 0;
  const detail = cached > 0 ? `本地缓存 ${mb(cached)}`
    : down > 0 ? `已下载 ${mb(down)}` : '';
  if (detail && p && p.pct < 100) stageText.textContent = `${p.label} · ${detail}`;
  // 模型是从本地缓存读的，就别再说「正在下载」：先命中一次就切文案，且只切一次。
  if (cached > 0 && hintBox && hintBox.dataset.cached !== '1') {
    hintBox.dataset.cached = '1';
    hintBox.innerHTML = '正在从本地缓存载入 SD 模型与竞技场模型，不会重新下载。<br />载入完成后即可逐帧查看每一次开火、换弹与充能。';
  }
  if (p && p.pct >= 100) {
    // stage 的「就绪」可能出现两次（场地先到、模型后到）；后台任务没清零前不要撤遮罩。
    const pending = Number(globalThis.__sdPending) || 0;
    if (pending > 0) {
      stageText.textContent = `补齐场地与模型…${detail ? ` · ${detail}` : ''}`;
      barFill.style.width = '96%';
      requestAnimationFrame(poll);
      return;
    }
    settled = true;
    stageText.textContent = '就绪';
    loading.classList.add('done');
    setTimeout(() => { loading.style.display = 'none'; }, 500);
    return;
  }
  requestAnimationFrame(poll);
}
requestAnimationFrame(poll);

addEventListener('error', (event) => { if (!settled) fail(event.error || event.message); });
addEventListener('unhandledrejection', (event) => { if (!settled) fail(event.reason); });

// 返回来源页（同源），否则回主站。
$('back').addEventListener('click', (event) => {
  if (history.length > 1 && document.referrer.startsWith(location.origin)) {
    event.preventDefault();
    history.back();
  }
});

// 最后再加载 stage.js：它在模块顶层就会往 #app / #top 里挂东西，前面必须全部就位。
// 会员校验不通过时不导入，连排版与模型请求都不会发生。
if (hasLineup) {
  verifyMembership()
    .then((ok) => { if (ok) import('./stage.js'); })
    .catch((error) => fail(error));
}
