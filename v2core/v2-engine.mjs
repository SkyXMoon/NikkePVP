import { projectSiteTeam, specialChargeRows } from './v2-result.mjs';
import { buildJackalLinkTimeline } from './v2-link-groups.mjs';
// 数据加载与 Worker 共用一份实现；计算链本身按需加载（见 runCalculationInWorker），
// 这样支持 Worker 的浏览器不会在主线程再解析一遍 charge-engine → shooting → driver。
import { loadJson, loadCharacterData } from './v2-character-data.mjs';

await globalThis.__NIKKE_CHARACTER_DATA_READY__;

// 同一张页面里 V1/V2 并存：入口由 v2-switch.js 换成按模式分派的转发器。这里一律
// 「登记」，不再直接覆盖全局；要取原实现走 __v1，否则拿到转发器会绕回自己。
const register = (name, fn) => (typeof globalThis.__v2Register === 'function'
  ? globalThis.__v2Register(name, fn) : (globalThis[name] = fn));
const v1 = name => (typeof globalThis.__v1 === 'function' ? globalThis.__v1(name) : globalThis[name]);

const DEBOUNCE_MS = 40;
const results = new Map();
const pending = new Map();
const latestSeqByScope = new Map();
let nextSeq = 0;
let lastCalculation = null;
let calcWorker = null;
let nextWorkerReqId = 0;
const workerCallbacks = new Map();
const treasureStorageKey='nikke-v2-treasure-phases';
let treasurePhases={};
try { const saved=JSON.parse(localStorage.getItem(treasureStorageKey)||'{}');
  if(saved&&typeof saved==='object'&&!Array.isArray(saved))treasurePhases=saved;
} catch {}
const treasureKey=(character,teamKey)=>`${state.filters.region}/${teamKey}/${character.id}`;
try {
  const shared = new URL(location.href).searchParams.get('v2phase');
  if (shared && shared.length <= 4096) {
    for (const [key, phase] of Object.entries(JSON.parse(shared))) {
      if (/^(cn|global)\/(attack|defense)\/\d+$/.test(key) && [1, 2, 3].includes(phase)) {
        treasurePhases[key] = phase;
      }
    }
    localStorage.setItem(treasureStorageKey, JSON.stringify(treasurePhases));
  }
} catch { /* Invalid optional share settings leave the stored selection in use. */ }
const originalShareParams = v1('getCurrentTeamShareParams');
register('getCurrentTeamShareParams', function () {
  const params = originalShareParams();
  if (params.some(([key]) => key !== 'mode' && key !== 'region')) {
    const phases = Object.fromEntries(Object.entries(treasurePhases)
      .filter(([key]) => key.startsWith(`${state.filters.region}/`)));
    if (Object.keys(phases).length) params.push(['v2phase', encodeURIComponent(JSON.stringify(phases))]);
  }
  return params;
});

function slotInput(character, positionIndex, teamKey, team) {
  if (!character) return null;
  const effective = characterForSlot(character, positionIndex, teamKey, team);
  const arca = getArcaChargeParameters(character, teamKey);
  return {
    character: effective,
    entries: arca?.speedEntries ?? getSavedCharacterChargeSpeedEntries(character, teamKey),
    cubeType: arca?.cubeType ?? getSavedCharacterCubeType(character, teamKey),
    cubeBonus: arca ? Math.max(0, Math.round((arca.chargeSpeed - (arca.speedEntries ?? [])
      .reduce((sum, value) => sum + Number(value || 0), 0)) * 100) / 100) : null,
    magazine: arca?.magazine ?? getSavedCharacterMagazine(character, teamKey),
    reloadSeconds: arca?.reloadSeconds ?? getSavedCharacterReloadSeconds(character, teamKey),
    treasurePhase: /珍藏$/.test(effective.name) ? treasurePhases[treasureKey(character,teamKey)] : 0,
    counterEnabled: isScarlet(character)?effective.scarletCounterEnabled:undefined,
    penetrationShots: isRedHood(character)?effective.redHoodPierceCount:undefined,
    positionIndex,
  };
}

function snapshot(contexts={}) {
  return {
    region: state.filters.region === 'cn' ? 'cn' : 'global',
    arena: isPaidArenaModeActive() ? state.paidArenaMode === 'c' ? 'arenachampion' : 'arenaspecial' : 'arenanormal',
    attack: state.team.map((character, index) => slotInput(character, index, 'attack', state.team)),
    defense: state.defenseTeam.map((character, index) => slotInput(character, index, 'defense', state.defenseTeam)),
    universal: Object.fromEntries(['attack','defense'].map(key=>[key,[...(contexts[key]?.universalCharges??getUniversalChargeState(key))]])),
    sacrifices: Object.fromEntries(['attack','defense'].map(key=>[key,[...(contexts[key]?.sacrificeFrames??getRosannaSacrificeFrameState(key))]])),
    links: Object.fromEntries(['attack','defense'].map(key=>[key,structuredClone(contexts[key]?.jackalLink??getJackalLinkState(key))])),
  };
}

function getCalcWorker() {
  if (typeof Worker !== 'function') return null;
  if (!calcWorker) {
    try {
      // 继承 engine 自己的 `?v=`：worker 是独立请求，不带版本参数时会吃到浏览器缓存，
      // 改了计算却「看不到效果」——这种现象很难排查，所以版本随页面壳一起换。
      const workerUrl = new URL('./v2-worker.mjs', import.meta.url);
      workerUrl.search = new URL(import.meta.url).search;
      calcWorker = new Worker(workerUrl, { type: 'module' });
      calcWorker.onmessage = (event) => {
        const { id, ok, data, error } = event.data ?? {};
        const cb = workerCallbacks.get(id);
        if (!cb) return;
        workerCallbacks.delete(id);
        if (ok) cb.resolve(data);
        else cb.reject(new Error(error || 'V2 Worker 计算失败'));
      };
      calcWorker.onerror = (event) => {
        const message = event?.message || 'V2 Worker 运行异常';
        for (const cb of workerCallbacks.values()) cb.reject(new Error(message));
        workerCallbacks.clear();
        calcWorker?.terminate?.();
        calcWorker = null;
      };
    } catch {
      calcWorker = null;
      return null;
    }
  }
  return calcWorker;
}

async function runCalculationInWorker(input) {
  const worker = getCalcWorker();
  if (!worker) {
    // 没有 Worker 支持时退回主线程。这里用动态 import：支持 Worker 的浏览器不该
    // 为了这个后退分支把整条纯数据计算链先解析一遍。
    const { runCoreCalculation } = await import('./v2-worker.mjs');
    return runCoreCalculation(input);
  }
  return new Promise((resolve, reject) => {
    const id = ++nextWorkerReqId;
    workerCallbacks.set(id, { resolve, reject });
    try {
      worker.postMessage({ id, input });
    } catch (error) {
      workerCallbacks.delete(id);
      reject(error);
    }
  });
}

async function calculate(input) {
  const { calculation, actors, notes } = await runCalculationInWorker(input);
  const sequence = (members, frame) => getBurstSequence(members).map((entry, index) =>
    ({ ...entry, frame: getBurstStageFrame(frame, index + 1, input.region) }));
  // 豺狼链接这类「独立一行」的充能：原生技能派发，但不在成员行画（与 V1 一致）。
  const specialRows = specialChargeRows(calculation, input, actors);
  const result = {
    attackResult: projectSiteTeam(calculation, actors, 'attack', sequence, { specialRows }),
    defenseResult: projectSiteTeam(calculation, actors, 'defense', sequence, { specialRows }),
  };
  for (const key of ['attack', 'defense']) {
    const team = key === 'attack' ? result.attackResult : result.defenseResult;
    if (!team || !notes[key].length) continue;
    team.warning = [...new Set(notes[key])].join('；');
  }
  return { input, calculation, result, actors };
}

function messageResults(input, message) {
  const side = key => input[key].some(Boolean) || input.universal[key].some(value => value > 0)
    ? { engine: 'v2', error: message, members: [] } : null;
  return { attackResult: side('attack'), defenseResult: side('defense') };
}

function setCachedResult(key, entry) {
  results.set(key, entry);
  if (results.size > 20) results.delete(results.keys().next().value);
}

function requestResults(input = snapshot(), { immediate = false, scope = 'default' } = {}) {
  const key = JSON.stringify(input);
  if (results.has(key)) {
    const cached = results.get(key);
    if (cached.calculation) lastCalculation = cached;
    return cached.result;
  }
  if (![...input.attack, ...input.defense].some(Boolean) &&
      ![...input.universal.attack, ...input.universal.defense].some(value => value > 0))
    return { attackResult: null, defenseResult: null };
  if (!pending.has(key)) {
    for (const [oldKey, staleJob] of pending.entries()) {
      if (staleJob.scope === scope && staleJob.timerId != null) {
        clearTimeout(staleJob.timerId);
        staleJob.timerId = null;
        staleJob.cancelled = true;
        pending.delete(oldKey);
        staleJob.resolve?.(null);
      }
    }
    const seq = ++nextSeq;
    latestSeqByScope.set(scope, seq);
    let resolveJob;
    const promise = new Promise(resolve => { resolveJob = resolve; });
    const job = { promise, timerId: null, cancelled: false, scope, seq, resolve: resolveJob };
    const run = () => {
      calculate(input).then(computed => {
        setCachedResult(key, computed);
        if (latestSeqByScope.get(scope) === seq) lastCalculation = computed;
      }).catch(error => {
        console.error('[v2core]', error);
        setCachedResult(key, { result: messageResults(input, `V2计算失败：${error.message}`) });
      }).finally(() => {
        pending.delete(key);
        // app.js 的 getBattleResultsSnapshot() 会把「计算中」这个占位对象缓存在
        // state.battleResults 里，之后一直复用它。V2 是异步算的，算完必须先作废这份
        // 缓存再重绘，否则 render 又读到占位，界面就永远停在「计算中」/空图 ——
        // 用户看到的现象是「切到 V2 了，图和数字都不动」。
        // 过期任务只更新缓存，不打断最新任务的渲染周期。
        if (latestSeqByScope.get(scope) === seq) {
          if (typeof globalThis.invalidateBattleResults === 'function') globalThis.invalidateBattleResults();
          if (typeof globalThis.render === 'function') globalThis.render();
        }
        resolveJob();
      });
    };
    pending.set(key, job);
    if (immediate) run();
    else job.timerId = setTimeout(() => {
      job.timerId = null;
      if (!job.cancelled) run();
    }, DEBOUNCE_MS);
  }
  return messageResults(input, 'V2核心计算中…');
}

async function readyResults(input = snapshot(), options = {}) {
  const key = JSON.stringify(input);
  requestResults(input, { ...options, immediate: true });
  await pending.get(key)?.promise;
  return results.get(key)?.result ?? { attackResult: null, defenseResult: null };
}

register('computeBattleResults', () => isPaidArenaModeActive()
  ? computePaidArenaBattleResultsForRow() : requestResults());
// The chart asks for two extra rows. V1 derived them from its own rules; V2 already
// puts both into the native event stream, so these read the same events the chart
// is showing instead of re-deriving anything.
//   · 红莲反击: an FT75 OnHurtRatio row. `probabilityMode` is `expected` for the
//     site calculation, so each event already carries probability × charge — the
//     expected value, not a sampled roll.
//   · 豺狼链接: 就是「被攻击 N 次」那条原生技能（豺狼是 FT72 / OnHurtCount /
//     阈值 10 → 1111110）。V1 用自己的一套累计模型画这一行；V2 不另算一遍，
//     直接读驱动真正派发出来的充能事件，把它显示成「连接触发」。
//     分摊本身没有充能点，所以链接只负责把受击次数攒起来，充能来自这条技能。
const frameOfTick = tick => Math.max(0, (tick - 6) * 2);
function chargeTemplateTriggers(calculation, pattern) {
  return new Set((calculation.result.chargeTemplates ?? [])
    .filter(row => pattern.test(row.trigger?.name ?? ''))
    .map(row => String(row.skillId)));
}
function teamCounterGroups(chartResults, build) {
  const calculation = lastCalculation?.calculation;
  if (!calculation) return [];
  return chartResults.flatMap(item => {
    const teamKey = item.teamKey;
    return build({ item, teamKey, calculation, members: item.result?.members ?? [] })
      .filter(group => group && group.timeline.length > 0);
  });
}
// 红莲反击读的是原生事件，不补算：c222 的 222221001 是 FT75／OnHurtRatio(trigger 7)／
// threshold 3000，原生在角色受击入口 0x5F0D210→0x5F0D613 派发 7，驱动按本体受击逐次
// 生成 skillId=222221001 的充能事件（一次本体受击 = 自身基础 0.45% × 30% = 0.135%）。
// 掩体受击走 0x5F0E55D 的 13，不算本体受击，也不在这里。
register('getScarletCounterGroups', chartResults => {
  if (!lastCalculation?.calculation) return [];
  const hurtSkillIds = chargeTemplateTriggers(lastCalculation.calculation, /Hurt|Cover/);
  const nameOf = id => (lastCalculation.actors ?? [])
    .find(actor => actor.config.id === String(id))?.character?.name ?? null;
  return teamCounterGroups(chartResults, ({ teamKey, calculation, members }) => {
    const gaugeMax = calculation.result.gaugeMax || 1;
    return members.map(member => {
      // `counterEnabled` only exists for the character V1 flagged as 红莲; a
      // switched-off counter drops her hurt rows in the driver, so there is
      // nothing to show either.
      const slot = lastCalculation.input?.[teamKey]?.[member.positionIndex];
      if (!slot || slot.counterEnabled !== true) return null;
      const actorId = `${teamKey}-${member.positionIndex}`;
      const events = (calculation.simulation?.events ?? []).filter(event =>
        event.id === actorId && event.skillId && hurtSkillIds.has(String(event.skillId)) &&
        (event.contacts?.length ?? 0) > 0);
      if (!events.length) return null;
      const chargePerCounter = (events[0].charge ?? 0) / gaugeMax * 100;
      let cumulativeCharge = 0;
      const timeline = events.map(event => {
        const charge = (event.charge ?? 0) / gaugeMax * 100;
        cumulativeCharge += charge;
        // 反击事件的 contacts 是这一击的施加者，用它的名字标出「谁打的」。
        const triggerSources = (event.contacts ?? []).map(contact => ({
          frame: frameOfTick(event.tick),
          attackerPositionIndex: Number(String(contact.id).split('-').pop()),
          characterName: nameOf(contact.id),
          hits: [{ positionIndex: member.positionIndex, hitCount: contact.probability ?? 1 }],
        }));
        return {
          frame: frameOfTick(event.tick),
          triggerCount: event.expectedOccurrences ?? 1,
          triggerSources,
          charge, cumulativeCharge,
        };
      });
      if (!timeline.length) return null;
      return {
        teamKey, groupKey: `${teamKey}-scarlet-counter-${member.positionIndex}`,
        label: '红莲反击', type: 'scarletCounter', member,
        chargePerCounter, timeline,
      };
    });
  });
});
register('getJackalLinkGroups', chartResults => {
  return teamCounterGroups(chartResults, ({ teamKey, calculation, members }) => {
    const link = lastCalculation.input?.links?.[teamKey];
    if (!link?.enabled || !link.ownerId) return [];
    const linked = new Set([link.ownerId, ...(link.targetIds ?? [])].map(String));
    const owner = members.find(member => member.character && linked.has(String(member.character.id)) &&
      String(member.character.id) === String(link.ownerId));
    if (!owner) return [];
    const built = buildJackalLinkTimeline({
      events: calculation.simulation?.events ?? [],
      gaugeMax: calculation.result?.gaugeMax || 1,
      ownerActorId: `${teamKey}-${owner.positionIndex}`,
      // 打人的人是敌方，名字必须从双方演员表里取；用本队 members 兜底会把
      // 敌方 P1 显示成本队 P1，玩家看到的「谁打的」就全是自己人。
      nameOf: id => (lastCalculation.actors ?? [])
        .find(actor => actor.config.id === String(id))?.character?.name ?? null,
      members, teamKey,
    });
    if (!built) return [];
    return [{
      teamKey, groupKey: `${teamKey}-jackal-link-${owner.positionIndex}`,
      label: '豺狼链接', type: 'jackalLink', member: owner,
      chargePerLink: built.chargePerLink, timeline: built.timeline,
    }];
  });
});
const originalChartMarkup = v1('getChargeChartMarkup');
// 图表卡片里只画图。说明性文字（计算缺口、按当前攻击目标计算这类假设、未充满提示、
// 计算失败的原因）一律不出现在这里：它们把图表挤下去，玩家要看的是轴。这类提示
// 统一走站点的 toast，同一批内容只在变化时弹一次，避免每次重算都糊一层。
// 以前这里还留了一个「两队都算不出来就原地显示错误原文」的例外——那等于给自己留
// 后门，任何一次单点异常都会把图换成一段红字。现在没有例外：画不出图就留空，
// 错误只走 toast。
let lastChartNotice = '';
register('getChargeChartMarkup', function (attack, gutter, defense, chartSize) {
  const results = [attack, defense].filter(Boolean);
  const errors = [...new Set(results.flatMap(result => (result.error ? [result.error] : [])))];
  const gaps = results.flatMap(result => result.v2Gaps ?? []);
  if (gaps.length) console.debug('[v2core] 计算缺口', gaps.map(gap =>
    `${gap.id} ${gap.functionId ?? ''} ${gap.reason}`.trim()));
  const notices = [...new Set(results.flatMap(result => [
    ...(result.warning ? [result.warning] : []),
    ...(result.v2TargetingAssumptions?.length ? ['未配置属性排序的技能按当前攻击目标计算。'] : []),
    ...(result.v2Gaps ?? []).map(gap => gap.message).filter(Boolean),
  ]).concat(errors))];
  const notice = notices.join(' ');
  if (notice && notice !== lastChartNotice) {
    lastChartNotice = notice;
    if (typeof globalThis.showToast === 'function') globalThis.showToast(notice, { duration: 6000 });
  }
  const drawable = results.some(result => result && !result.error);
  // 一个角色都没填时不走「算不出来」的短路：那会留下一片空白，看起来像加载失败。
  // 交给 V1 的画法铺一张空图（坐标轴＋网格），和 V1 的空态一致。
  // 真选了角色但两队都报错才返回空字符串，错误本身已经进了 toast。
  if (!drawable && (attack || defense)) return '';
  const markup = originalChartMarkup.call(this, attack, gutter, defense, chartSize);
  return markup.replace('<svg ', '<svg data-calculation-engine="v2" ');
});
register('computePaidArenaBattleResultsForRow', function (rowIndex = state.paidArenaActiveRowIndex) {
  const attack = getPaidArenaSimulationContext(state.paidArenaMode, 'attack', rowIndex);
  const defense = getPaidArenaSimulationContext(state.paidArenaMode, 'defense', rowIndex);
  return withPaidArenaSimulationState(attack, defense, () =>
    requestResults(snapshot({ attack, defense }), { scope: `paid-${rowIndex}` }));
});
register('getPaidArenaChartResultForTeam', function (teamKey, rowIndex) {
  return computePaidArenaBattleResultsForRow(rowIndex)[teamKey === 'defense' ? 'defenseResult' : 'attackResult'];
});
/** 站点 V1 的 `simulateBurst` 有 12 个参数（`app.js:6438`）。V1 是「一次算一队」的
 *  帧排布模型，所以外部要把对手的换弹/闪避/嘲讽时间轴、开局眩晕窗口、被动充能
 *  事件一轮轮喂回去收敛。V2 双方同时逐帧模拟，这些东西由原生技能和射击自己产生，
 *  再喂一遍会重复计算。所以签名全接、能映射的映射、其余显式丢弃——不再让调用方
 *  以为传了就生效。
 *
 *  真生效的四个：
 *    opponentTeam            覆盖对侧队伍（不再依赖 snapshot 恰好读到同一份 state）
 *    universalChargeOverride 覆盖本队空位的万能充能
 *    sacrificeFrameOverride  覆盖本队献祭帧
 *    options.continueUntilFrame 折算成本次计算时长上限
 */
register('simulateBurst', function (team, teamKey = 'attack',
  specialChargeEvents = [], opponentReloadTimeline = [], opponentTurnDodgeTimeline = [],
  stunWindows = [], opponentTauntTarget = null, universalChargeOverride = null,
  opponentTeam = [], sacrificeFrameOverride = null, stunDodgeEvents = [], options = {}) {
  const input = snapshot();
  input[teamKey] = team.map((character, index) => slotInput(character, index, teamKey, team));
  const otherKey = teamKey === 'defense' ? 'attack' : 'defense';
  if (Array.isArray(opponentTeam) && opponentTeam.length)
    input[otherKey] = opponentTeam.map((character, index) => slotInput(character, index, otherKey, opponentTeam));
  if (Array.isArray(universalChargeOverride)) input.universal[teamKey] = [...universalChargeOverride];
  if (Array.isArray(sacrificeFrameOverride)) input.sacrifices[teamKey] = [...sacrificeFrameOverride];
  const untilFrame = Number(options?.continueUntilFrame);
  if (Number.isFinite(untilFrame) && untilFrame > 0)
    input.totalTicks = Math.min(5006, Math.ceil(untilFrame / 2) + 6);
  // V1 的迭代中间产物，V2 由原生模拟接管（见上）。列出来是为了让读者一眼看到
  // 「这 6 个确实被考虑过」，而不是漏了。
  void specialChargeEvents; void opponentReloadTimeline; void opponentTurnDodgeTimeline;
  void stunWindows; void opponentTauntTarget; void stunDodgeEvents;
  return requestResults(input)[teamKey === 'defense' ? 'defenseResult' : 'attackResult'];
});
register('simulatePaidArenaBurst', function (team, chargeSpeeds, universalCharges, sacrificeFrames,
  pierceCounts, counterEnabled, jackalLink, teamKey = 'attack') {
  const input = snapshot();
  input[teamKey] = team.map((character, index) => {
    const slot = slotInput(character, index, teamKey, team);
    if (slot) slot.character.chargeSpeedPercent = Number(chargeSpeeds?.[index]) || 0;
    return slot;
  });
  input.universal[teamKey] = [...universalCharges];
  input.sacrifices[teamKey] = [...sacrificeFrames];
  input.links[teamKey] = structuredClone(jackalLink??{enabled:false});
  for(const slot of input[teamKey].filter(Boolean)){
    if(isScarlet(slot.character))slot.counterEnabled=counterEnabled?.[slot.positionIndex]!==false;
    if(isRedHood(slot.character))slot.penetrationShots=Number(pierceCounts?.[slot.positionIndex])||0;
    slot.entries=[];slot.cubeBonus=0;
  }
  return requestResults(input)[teamKey === 'defense' ? 'defenseResult' : 'attackResult'];
});
globalThis.__V2_ENGINE__ = { engine: 'v2', ready:(rowIndex=state.paidArenaActiveRowIndex)=>{
  if(!isPaidArenaModeActive())return readyResults();
  const row=rowIndex;
  const attack=getPaidArenaSimulationContext(state.paidArenaMode,'attack',row);
  const defense=getPaidArenaSimulationContext(state.paidArenaMode,'defense',row);
  return withPaidArenaSimulationState(attack,defense,()=>readyResults(snapshot({attack,defense})));
}, get lastCalculation() { return lastCalculation; },
  get pending() { return pending.size; } };

const originalSettingsModal=v1('createSlotSettingsModal');
register('createSlotSettingsModal',function(){
  const backdrop=originalSettingsModal();
  const context=getSlotSettingsContext();
  if(!backdrop||!context||!/珍藏$/.test(context.character.name))return backdrop;
  const {character,teamKey}=context,region=state.filters.region==='cn'?'cn':'global';
  const key=treasureKey(character,teamKey);
  loadJson('/src/data/character-assets.master.json').then(async master=>{
    if(!backdrop.isConnected)return;
    const resource=master.linked.find(row=>String(row.legacyId)===String(character.id));
    const { db } = await loadCharacterData(region,[String(Number(resource?.gameCharacterId))]);
    if(!backdrop.isConnected)return;
    const phases=db[String(Number(resource?.gameCharacterId))]?.treasurePhases??[];
    if(!phases.length)return;
    const label=document.createElement('label');label.className='settings-field';
    label.textContent='珍藏品阶段';
    const select=document.createElement('select');select.className='slot-settings-treasure-phase';
    for(const phase of phases){const option=document.createElement('option');
      option.value=phase.phase;option.textContent=`第${phase.phase}阶段`;select.append(option);}
    select.value=String(treasurePhases[key]??Math.max(...phases.map(phase=>phase.phase)));
    select.addEventListener('change',()=>{
      treasurePhases[key]=Number(select.value);
      localStorage.setItem(treasureStorageKey,JSON.stringify(treasurePhases));
      render();
    });
    label.append(select);backdrop.querySelector('.slot-settings-modal').append(label);
  }).catch(error=>console.error('[v2 treasure]',error));
  return backdrop;
});

// 角标与首帧放行都归 v2-switch.js：同一张页面可能随时切回 V1，标记得跟着模式变。
// 这里原先还包了一层空的 render（`render = () => originalRender()`），什么也没做，
// 已删掉。
render();
