import { Texture } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { toRunnerConfig } from '../simulator/src/core/data.js';
import { groupByValue } from '../simulator/src/core/stat.js';
import { mergeNativeData } from '../simulator/src/stage/native-data.js';
import { addCnShootingProfiles } from '../simulator/src/stage/cn-roster.js';
import { createArenaCalculator } from '../simulator/src/calculator/arena-calculator.js';
import { projectSiteTeam } from './v2-result.mjs';

await globalThis.__NIKKE_CHARACTER_DATA_READY__;

const ASSETS = '/v2core/assets';
const dataCache = new Map();
const bufferCache = new Map();
const results = new Map();
const pending = new Map();
let lastCalculation = null;
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
const originalShareParams = globalThis.getCurrentTeamShareParams;
globalThis.getCurrentTeamShareParams = function () {
  const params = originalShareParams();
  if (params.some(([key]) => key !== 'mode' && key !== 'region')) {
    const phases = Object.fromEntries(Object.entries(treasurePhases)
      .filter(([key]) => key.startsWith(`${state.filters.region}/`)));
    if (Object.keys(phases).length) params.push(['v2phase', encodeURIComponent(JSON.stringify(phases))]);
  }
  return params;
};

async function loadJson(url) {
  if (!dataCache.has(url)) dataCache.set(url, fetch(url).then(response => {
    if (!response.ok) throw new Error(`V2资源加载失败 ${response.status} ${url}`);
    return response.json();
  }).catch(error => { dataCache.delete(url); throw error; }));
  return dataCache.get(url);
}

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
    reloadSeconds: arca?.reloadSeconds ?? null,
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

function configuredActor(input, side, db, resourceIds) {
  const resourceId = resourceIds.get(String(input.character.id));
  const source = db[resourceId];
  if (!source) throw new Error(`${input.character.name} 缺少${side.region === 'cn' ? '国服' : '国际服'}V2原始数据`);
  const code = `c${resourceId.padStart(3, '0')}`;
  const treasure = /珍藏$/.test(input.character.name);
  const config = {
    ...toRunnerConfig(source, { treasure, treasurePhase: input.treasurePhase, hasPresentation: true, presentationKind: 'sd' }),
    id: `${side.key}-${input.positionIndex}`, assetCode: code, resourceId,
    slotIndex: input.positionIndex, team: side.key === 'attack' ? 0 : 1,
  };
  const percentages = input.entries.filter(value => Number(value) > 0).map(Number);
  if (percentages.length || !(input.character.chargeSpeedPercent > 0)) {
    const cube = input.cubeBonus ?? (input.cubeType === 'charge-speed' ? 2.12 : 0);
    if (cube > 0) percentages.push(cube);
  } else if (input.character.chargeSpeedPercent > 0) {
    percentages.push(input.character.chargeSpeedPercent);
  }
  for (const [index, row] of groupByValue(percentages.map(value => -Math.round(value * 100))).entries()) {
    config.onStartBuffs.push({ id: `equipment-charge-${index}`, kind: 'permanent', remain: Infinity,
      standard: 1, stacks: row.n, effect: { kind: 'chargeSpeed', percent: row.p } });
  }
  if (input.cubeType === 'quantum') config.onStartBuffs.push({ id: 'equipment-quantum',
    ft: 102, value: 466, valueType: 2, standard: 1, stacks: 1, kind: 'permanent', remain: Infinity });
  if (input.magazine > 0) config.maxAmmo = input.magazine;
  if (input.reloadSeconds != null) config.reloadTimeUnits = Math.round(input.reloadSeconds * 100);
  const stats=input.character.stats??{};
  config.counterEnabled=input.counterEnabled;
  config.penetrationShots=input.penetrationShots;
  config.rankingStats=Object.fromEntries(['attack','defence','hp','maxHp'].filter(key=>Number.isFinite(stats[key]))
    .map(key=>[key,stats[key]]));
  return { config, character: input.character };
}

async function loadModel(code, index, region) {
  const entry = index.characters.find(character => character.code === code) ?? {file:`${code}_00.glb`};
  const url = `${ASSETS}/${region === 'global' ? 'global/' : ''}out/sd_batch/${entry.file}`;
  if (!bufferCache.has(url)) bufferCache.set(url, fetch(url).then(response => {
    if (!response.ok) throw new Error(`V2模型加载失败 ${response.status} ${code}`);
    return response.arrayBuffer();
  }).catch(error => { bufferCache.delete(url); throw error; }));
  const loader = new GLTFLoader();
  loader.register(() => ({ name: 'calculation_no_texture_decode', loadTexture: () => Promise.resolve(new Texture()) }));
  return loader.parseAsync((await bufferCache.get(url)).slice(0), '');
}

async function calculate(input) {
  const regionAssets = `${ASSETS}/${input.region === 'global' ? 'global/' : ''}`;
  const [db, shooting, bindings, colliders, index, master, arena] = await Promise.all([
    loadJson(`/simulator/data/characters${input.region === 'cn' ? '.cn' : ''}.json`),
    loadJson(`/simulator/data/native-shooting${input.region === 'global' ? '.global' : ''}.json`),
    loadJson(`/simulator/data/native-bindings${input.region === 'global' ? '.global' : ''}.json`),
    loadJson(`/simulator/data/native-colliders.${input.region}.json`),
    loadJson(`${regionAssets}out/sd_batch/index.json`), loadJson('/src/data/character-assets.master.json'),
    loadJson(`${regionAssets}arena/${input.arena}.json`),
  ]);
  const resourceIds = new Map(master.linked.map(row => [String(row.legacyId), String(Number(row.gameCharacterId))]));
  const merged = mergeNativeData(shooting, bindings, colliders);
  const native = input.region === 'cn' ? addCnShootingProfiles(merged, db) : merged;
  const actors = [];
  const burstCharges = {};
  for (const key of ['attack', 'defense']) {
    for (let position = 0; position < 5; position++) {
      const slot = input[key][position];
      const actor = slot ? configuredActor(slot, { key, region: input.region }, db, resourceIds) : {
        character: null,
        config: { id: `${key}-${position}`, team: key === 'attack' ? 0 : 1, slotIndex: position,
          calculationTarget: true, weaponType: 'None', inputType: 1, rateOfFire: 0,
          initialAcc: 0, maxAmmo: 0, fireType: 1, burstEnergyBp: 0, skills: [] },
      };
      actors.push(actor);
      if (!slot && input.universal[key][position] > 0)
        burstCharges[actor.config.id] = Math.round(input.universal[key][position] * 100);
    }
  }
  const models = new Map(await Promise.all(actors.filter(actor => actor.character && ![1,19,21].includes(actor.config.fireType)).map(async actor =>
    [actor.config.id, await loadModel(actor.config.assetCode, index, input.region)])));
  const passiveEvents=[];
  for(const key of ['attack','defense']){
    const members=actors.filter(actor=>actor.config.team===(key==='attack'?0:1)&&actor.character);
    const link=input.links[key];
    if(link?.enabled){
      const ids=new Set([link.ownerId,...link.targetIds].map(String));
      const linked=members.filter(actor=>ids.has(String(actor.character.id))).map(actor=>actor.config.id);
      for(const actor of members)if(linked.includes(actor.config.id))actor.config.hurtShareTargetIds=linked;
    }
    for(const actor of members){
      const frame=input.sacrifices[key][actor.config.slotIndex];
      if(frame!=null&&Number.isFinite(Number(frame)))passiveEvents.push({type:'death',targetId:actor.config.id,
        tick:Math.max(1,6+Math.ceil(Number(frame)/2))});
    }
  }
  const calculator = await createArenaCalculator({ arena, characters: actors.map(actor => actor.config), native, models });
  const activeTeams = [...new Set(actors.filter(actor => actor.character).map(actor => actor.config.team))];
  const calculation = calculator.calculate({ totalTicks: 5006, seed: 1, burstCharges, stopWhenTeamsReady: activeTeams,
    passiveEvents:passiveEvents.filter(event=>event.tick<=5006) });
  const sequence = (members, frame) => getBurstSequence(members).map((entry, index) =>
    ({ ...entry, frame: getBurstStageFrame(frame, index + 1, input.region) }));
  const result = {
    attackResult: projectSiteTeam(calculation, actors, 'attack', sequence),
    defenseResult: projectSiteTeam(calculation, actors, 'defense', sequence),
  };
  lastCalculation = { input, calculation, result };
  return result;
}

function messageResults(input, message) {
  const side = key => input[key].some(Boolean) || input.universal[key].some(value => value > 0)
    ? { engine: 'v2', error: message, members: [] } : null;
  return { attackResult: side('attack'), defenseResult: side('defense') };
}

function requestResults(input = snapshot()) {
  const key = JSON.stringify(input);
  if (results.has(key)) return results.get(key);
  if (![...input.attack, ...input.defense].some(Boolean) &&
      ![...input.universal.attack, ...input.universal.defense].some(value => value > 0))
    return { attackResult: null, defenseResult: null };
  if (!pending.has(key)) {
    const job = calculate(input).then(result => {
      results.set(key, result);
      if (results.size > 20) results.delete(results.keys().next().value);
    }).catch(error => {
      console.error('[v2core]', error);
      results.set(key, messageResults(input, `V2计算失败：${error.message}`));
    }).finally(() => {
      pending.delete(key);
      render();
    });
    pending.set(key, job);
  }
  return messageResults(input, 'V2核心计算中…');
}

async function readyResults(input=snapshot()) {
  const key=JSON.stringify(input);
  requestResults(input);
  await pending.get(key);
  return results.get(key)??{attackResult:null,defenseResult:null};
}

globalThis.computeBattleResults = () => isPaidArenaModeActive()
  ? computePaidArenaBattleResultsForRow() : requestResults();
// These old chart helpers derive skill effects from legacy rules. V2 skill
// contributions already arrive in the projected native event stream.
globalThis.getScarletCounterGroups = () => [];
globalThis.getJackalLinkGroups = () => [];
const originalChartMarkup = globalThis.getChargeChartMarkup;
globalThis.getChargeChartMarkup = function (attack, gutter, defense, chartSize) {
  const messages = [attack, defense].filter(Boolean).flatMap(result => [
    ...(result.error ? [result.error] : []),
    ...(result.warning ? [result.warning] : []),
    ...(result.v2Gaps ?? []).map(gap => `V2计算缺口 ${gap.id ?? ''} ${gap.reason}`),
  ]);
  const notices = [...new Set(messages)].map(message => `<p role="status">${escapeHtml(message)}</p>`).join('');
  if ([attack, defense].some(Boolean) && ![attack, defense].some(result => result && !result.error)) return notices;
  const markup = originalChartMarkup.call(this, attack, gutter, defense, chartSize);
  return notices + markup.replace('<svg ', '<svg data-calculation-engine="v2" ');
};
globalThis.computePaidArenaBattleResultsForRow = function (rowIndex = state.paidArenaActiveRowIndex) {
  const attack = getPaidArenaSimulationContext(state.paidArenaMode, 'attack', rowIndex);
  const defense = getPaidArenaSimulationContext(state.paidArenaMode, 'defense', rowIndex);
  return withPaidArenaSimulationState(attack, defense, () => requestResults(snapshot({attack,defense})));
};
globalThis.getPaidArenaChartResultForTeam = function (teamKey, rowIndex) {
  return computePaidArenaBattleResultsForRow(rowIndex)[teamKey === 'defense' ? 'defenseResult' : 'attackResult'];
};
globalThis.simulateBurst = function (team, teamKey = 'attack') {
  const input = snapshot();
  input[teamKey] = team.map((character, index) => slotInput(character, index, teamKey, team));
  return requestResults(input)[teamKey === 'defense' ? 'defenseResult' : 'attackResult'];
};
globalThis.simulatePaidArenaBurst = function (team, chargeSpeeds, universalCharges, sacrificeFrames,
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
};
globalThis.__V2_ENGINE__ = { engine: 'v2', ready:(rowIndex=state.paidArenaActiveRowIndex)=>{
  if(!isPaidArenaModeActive())return readyResults();
  const row=rowIndex;
  const attack=getPaidArenaSimulationContext(state.paidArenaMode,'attack',row);
  const defense=getPaidArenaSimulationContext(state.paidArenaMode,'defense',row);
  return withPaidArenaSimulationState(attack,defense,()=>readyResults(snapshot({attack,defense})));
}, get lastCalculation() { return lastCalculation; },
  get pending() { return pending.size; } };

const originalSettingsModal=globalThis.createSlotSettingsModal;
globalThis.createSlotSettingsModal=function(){
  const backdrop=originalSettingsModal();
  const context=getSlotSettingsContext();
  if(!backdrop||!context||!/珍藏$/.test(context.character.name))return backdrop;
  const {character,teamKey}=context,region=state.filters.region==='cn'?'cn':'global';
  const key=treasureKey(character,teamKey);
  Promise.all([loadJson(`/simulator/data/characters${region==='cn'?'.cn':''}.json`),
    loadJson('/src/data/character-assets.master.json')]).then(([db,master])=>{
    if(!backdrop.isConnected)return;
    const resource=master.linked.find(row=>String(row.legacyId)===String(character.id));
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
};

const originalRender = globalThis.render;
globalThis.render = function () {
  originalRender();
  document.getElementById('paidInferenceButton')?.remove();
};

const badge = document.createElement('div');
badge.id = 'v2-engine-status';
badge.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99999;background:#2b3a67;color:#dfe4ff;border-radius:8px;padding:4px 10px;font-size:12px;pointer-events:none';
badge.textContent = 'V2核心 · 逐帧射击／命中／技能充能';
badge.title = '未填角色的站位使用静止标准碰撞靶；计算采用本区数据与期望概率，时间轴为60fps显示帧。';
document.getElementById('v2-timing-status')?.remove();
document.body.append(badge);
render();
