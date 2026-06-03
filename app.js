const FRAMES_PER_SECOND = 60;
const TEAM_SIZE = 5;
const ENEMY_TEAM_SIZE = 5;
const LINEUP_SLOT_COUNT = 10;
const DEFAULT_RL_TARGET_INDEX = 0;
const BURST_EPSILON = 1e-6;
const STORAGE_KEY = "nikke-arena-charge-team-v2";
const LEGACY_STORAGE_KEY = "nikke-arena-charge-team-v1";
const WEAPON_ORDER = ["SMG", "AR", "SG", "MG", "SR", "RL"];
const WEAPON_LABELS = {
  SMG: "冲锋枪",
  AR: "步枪",
  SG: "霰弹枪",
  MG: "机枪",
  SR: "狙击步枪",
  RL: "发射器",
};
const STAGE_LABELS = {
  B1: "爆裂 I",
  B2: "爆裂 II",
  B3: "爆裂 III",
};
const STANDARD_CHARGE_FRAMES = [
  { label: "2RL", frame: 152 },
  { label: "4SG", frame: 126 },
  { label: "5SG", frame: 168 },
  { label: "3RL", frame: 228 },
  { label: "6SG", frame: 210 },
  { label: "7SG", frame: 252 },
  { label: "4RL", frame: 304 },
  { label: "8SG", frame: 294 },
];
const MG_WARMUP_EVENTS = [
  { frame: 96, shots: 12 },
  { frame: 152, shots: 22 },
  { frame: 180, shots: 14 },
];
const STANDARD_TIMELINE_EVENTS = [
  { label: "罗姗娜", tooltip: "罗姗娜（96F）消除BUFF", frame: 96 },
];
const ROSANNA_BUFF_REMOVE_FRAME = 96;
const LITTLE_MERMAID_STUN_FRAME = 196;
const LITTLE_MERMAID_STUN_DURATION_FRAMES = 180;
const LITTLE_MERMAID_STUN_TARGET_INDEX = 0;
const LITTLE_MERMAID_TIMELINE_EVENT = {
  label: "小美人鱼",
  tooltip: "小美人鱼（196F）晕眩P1，持续3秒",
  frame: LITTLE_MERMAID_STUN_FRAME,
};
const CINDERELLA_PROJECTILE_FLIGHT_FRAMES = 0;
const CINDERELLA_ATTACK_INTERVAL_FRAMES = 22;
const CINDERELLA_INITIAL_CHARGE_SEQUENCE = [4, 2, 2, 2, 4, 4];
const CINDERELLA_LOOP_CHARGE_SEQUENCE = [2, 2, 2, 2, 4, 4];
const CINDERELLA_TARGET_HIT_COUNT = 2;
const CINDERELLA_INITIAL_CHARGE_FRAMES = 70;
const DEFAULT_CHARGE_WEAPON_CHARGE_FRAMES = 60;
const CHART_MAX_FRAME = 600;
const CHART_WIDTH = 1800;
const CHART_HEIGHT = 660;
const CHART_MIN_WIDTH = 320;
const SCARLET_COUNTER_PROBABILITY = 0.3;
const JACKAL_LINK_HIT_THRESHOLD = 10;
const RED_HOOD_CHARGE_SPEED_PER_ATTACK = 3.81;
const RED_HOOD_MAX_CHARGE_SPEED_STACKS = 10;
const FIXED_CHARGE_SPEED_FRAMES_60 = new Map([
  [0, 60],
  [1, 60],
  [2, 58],
  [3, 58],
  [4, 58],
  [5, 56],
  [6, 56],
  [7, 56],
  [8, 54],
  [9, 54],
  [10, 54],
  [11, 52],
  [12, 52],
  [13, 52],
  [14, 52],
  [15, 50],
  [16, 50],
  [17, 50],
  [18, 48],
  [19, 48],
  [20, 48],
  [21, 46],
  [22, 46],
  [23, 46],
  [24, 46],
  [25, 44],
  [26, 44],
  [27, 44],
  [28, 42],
  [29, 42],
  [30, 42],
  [31, 40],
  [32, 40],
  [33, 40],
  [34, 40],
  [35, 38],
  [36, 38],
  [37, 38],
  [38, 36],
  [39, 36],
  [40, 36],
  [41, 34],
  [42, 34],
  [43, 34],
  [44, 32],
  [45, 32],
  [46, 32],
]);
const MG_SUSTAIN_START_FRAME = 182;
const MG_SUSTAIN_INTERVAL_FRAMES = 2;
const QUANTUM_RELIC_CUBE_MULTIPLIER = 1.0466;

async function loadCharacterData() {
  if (typeof CHARACTERS !== "undefined" && Array.isArray(CHARACTERS)) return;
  const response = await fetch("/api/characters?full=1", {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`角色数据加载失败：${response.status}`);
  }
  const payload = await response.json();
  globalThis.DATA_SOURCES = payload.sources || {};
  globalThis.CHARACTERS = Array.isArray(payload.characters) ? payload.characters : [];
}

const state = {
  defenseTeam: Array(TEAM_SIZE).fill(null),
  defenseChargeSpeeds: Array(TEAM_SIZE).fill(0),
  defenseUniversalCharges: Array(TEAM_SIZE).fill(0),
  defenseRedHoodPierceCounts: Array(TEAM_SIZE).fill(0),
  defenseScarletCounterEnabled: Array(TEAM_SIZE).fill(true),
  team: Array(TEAM_SIZE).fill(null),
  chargeSpeeds: Array(TEAM_SIZE).fill(0),
  universalCharges: Array(TEAM_SIZE).fill(0),
  redHoodPierceCounts: Array(TEAM_SIZE).fill(0),
  scarletCounterEnabled: Array(TEAM_SIZE).fill(true),
  characterChargeSpeeds: {
    defense: {},
    attack: {},
  },
  characterQuantumCubes: {
    defense: {},
    attack: {},
  },
  characterRedHoodPierceCounts: {
    defense: {},
    attack: {},
  },
  jackalLinks: {
    defense: { enabled: false, ownerId: null, targetIds: [] },
    attack: { enabled: false, ownerId: null, targetIds: [] },
  },
  activeLineupIndex: 0,
  lineupSlots: Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyLineupSlot()),
  compactAvatarIcons: true,
  activeTeamKey: "attack",
  filters: {
    common: "common",
    weapon: "all",
    company: "all",
    stage: "all",
    region: "cn",
    search: "",
  },
  battleResults: null,
  calculationRequestId: 0,
};

const els = {
  characterGrid: document.querySelector("#characterGrid"),
  teamSlots: document.querySelector("#teamSlots"),
  resultPanel: document.querySelector("#resultPanel"),
  chargeChart: document.querySelector("#chargeChart"),
  lineupSlots: document.querySelector("#lineupSlots"),
  clearTeamButton: document.querySelector("#clearTeamButton"),
  copyTeamButton: document.querySelector("#copyTeamButton"),
  swapTeamButton: document.querySelector("#swapTeamButton"),
  commonToggle: document.querySelector("#commonToggle"),
  regionToggle: document.querySelector("#regionToggle"),
  compactAvatarToggle: document.querySelector("#compactAvatarToggle"),
  stageFilterButtons: document.querySelectorAll("[data-stage-filter]"),
  searchInput: document.querySelector("#searchInput"),
  helpButton: document.querySelector("#helpButton"),
  toast: document.querySelector("#toast"),
  summaryStrip: document.querySelector("#summaryStrip"),
  sortSummary: document.querySelector("#sortSummary"),
  listCount: document.querySelector("#listCount"),
};

let draggedTeamIndex = null;
let draggedTeamKey = null;
let pointerTeamDrag = null;
let suppressTeamSlotClick = false;
let resizeRenderId = null;
let openSlotSettings = null;
let isHelpModalOpen = false;

const TEAM_LABELS = {
  defense: "防守队",
  attack: "进攻队",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function frameToSeconds(frame) {
  return formatNumber(frame / FRAMES_PER_SECOND, 2);
}

function formatNumber(value, maxDigits = 2) {
  const number = Number(value) || 0;
  return number
    .toFixed(maxDigits)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

function formatFrame(frame) {
  return `${frame} 帧 / ${frameToSeconds(frame)} 秒`;
}

function formatFrameCount(frame) {
  return String(Math.round(Number(frame) || 0));
}

function getStandardChargeBand(frame) {
  const rlValue = frame / 76;
  const formattedRlValue = Number.isInteger(rlValue)
    ? String(rlValue)
    : rlValue
        .toFixed(2)
        .replace(/0+$/, "")
        .replace(/\.$/, "");
  return `等于${formattedRlValue}RL`;
}

function getTeamPositionText(finishingPositionIndices = [], teamKey = "attack") {
  const finishingPositions = new Set(finishingPositionIndices);
  const team = getTeamState(teamKey);
  const chargeSpeeds = getChargeSpeedState(teamKey);
  const universalCharges = getUniversalChargeState(teamKey);
  return team
    .map((character, index) => {
      if (!character) {
        const universalCharge = sanitizeUniversalCharge(universalCharges[index]);
        return universalCharge > 0 ? `P${index + 1}万能(${universalCharge})` : "空位";
      }
      const chargeSpeed = Number(chargeSpeeds[index]) || Number(character.chargeSpeedPercent) || 0;
      const isChargeWeapon = character.weapon === "RL" || character.weapon === "SR";
      const prefix = finishingPositions.has(index) && canShowFinishMarker(character) ? "*" : "";
      const name = `${prefix}${character.name}`;
      return isChargeWeapon && chargeSpeed > 0 ? `${name}(${chargeSpeed})` : name;
    })
    .join("，");
}

function canShowFinishMarker(character) {
  return character && ["RL", "SR"].includes(character.weapon);
}

function formatSeconds(value) {
  return formatNumber(value, 2);
}

function getCharacterChargeFrameInfo(character) {
  const statSeconds = Number(character?.stats?.chargeSeconds);
  const timingFrames = Number(character?.timing?.chargeFrames);
  const frames = Number.isFinite(timingFrames) && timingFrames > 0 ? timingFrames : Math.round((Number.isFinite(statSeconds) ? statSeconds : 0) * FRAMES_PER_SECOND);
  const seconds = Number.isFinite(statSeconds) && statSeconds > 0 ? statSeconds : frames / FRAMES_PER_SECOND;
  return { seconds, frames };
}

function getChargeWeaponDetailLines(character) {
  if (!isChargeWeapon(character)) return [];
  const { seconds, frames } = getCharacterChargeFrameInfo(character);
  return [`蓄力时间：${formatSeconds(seconds)}s（${frames}F）`];
}

function isAnyBurstStageCharacter(character) {
  return character?.name === "小红帽" || character?.slug === "小红帽" || String(character?.burstStage || "").trim() === "Λ";
}

function isRedHood(character) {
  return character?.id === 111 || character?.name === "小红帽" || character?.slug === "小红帽";
}

function getCharacterBurstStages(character) {
  if (isAnyBurstStageCharacter(character)) return ["B1", "B2", "B3"];
  return String(character?.burstStage || "")
    .split("/")
    .map((stage) => stage.trim())
    .filter((stage) => ["B1", "B2", "B3"].includes(stage));
}

function normalizeStageFilter(stage = "all") {
  return ["B1", "B2", "B3"].includes(stage) ? stage : "all";
}

function getAvailableBurstLevel(members = []) {
  const stageSet = new Set(members.flatMap((member) => getCharacterBurstStages(member.character || member)));
  if (!stageSet.has("B1")) return 0;
  if (!stageSet.has("B2")) return 1;
  if (!stageSet.has("B3")) return 2;
  return 3;
}

function getAvailableBurstMarkers(result) {
  if (!result || result.error) return [];
  return [
    { label: "爆裂1", frame: result.burst1Frame, stage: "B1" },
    { label: "爆裂2", frame: result.burst2Frame, stage: "B2" },
    { label: "爆裂3", frame: result.burst3Frame, stage: "B3" },
  ]
    .slice(0, Number.isFinite(result.availableBurstLevel) ? result.availableBurstLevel : 3)
    .filter((marker) => Number.isFinite(marker.frame));
}

function getBurstDisplayEndFrame(result) {
  const markers = getAvailableBurstMarkers(result);
  return markers.length ? markers.at(-1).frame : result?.fullFrame || 0;
}

function getResultCopyText(result, teamKey = "attack") {
  return `${getTeamPositionText(result.finishingPositionIndices, teamKey)}\n${getStandardChargeBand(result.fullFrame)}（${result.fullFrame}F）`;
}

function getBattleResultsCopyText(battleResults = getBattleResultsSnapshot()) {
  const entries = [
    { teamKey: "defense", result: battleResults.defenseResult },
    { teamKey: "attack", result: battleResults.attackResult },
  ].filter((entry) => entry.result && !entry.result.error);

  return entries
    .map((entry) => `${TEAM_LABELS[entry.teamKey]}\n${getResultCopyText(entry.result, entry.teamKey)}`)
    .join("\n\n");
}

function normalizeTeamKey(teamKey = state.activeTeamKey) {
  return teamKey === "defense" ? "defense" : "attack";
}

function getTeamState(teamKey = state.activeTeamKey) {
  return normalizeTeamKey(teamKey) === "defense" ? state.defenseTeam : state.team;
}

function getChargeSpeedState(teamKey = state.activeTeamKey) {
  return normalizeTeamKey(teamKey) === "defense" ? state.defenseChargeSpeeds : state.chargeSpeeds;
}

function getUniversalChargeState(teamKey = state.activeTeamKey) {
  return normalizeTeamKey(teamKey) === "defense" ? state.defenseUniversalCharges : state.universalCharges;
}

function getRedHoodPierceCountState(teamKey = state.activeTeamKey) {
  return normalizeTeamKey(teamKey) === "defense" ? state.defenseRedHoodPierceCounts : state.redHoodPierceCounts;
}

function getScarletCounterEnabledState(teamKey = state.activeTeamKey) {
  return normalizeTeamKey(teamKey) === "defense" ? state.defenseScarletCounterEnabled : state.scarletCounterEnabled;
}

function sanitizeUniversalCharge(value) {
  const charge = Number(value);
  if (!Number.isFinite(charge) || charge <= 0) return 0;
  return Math.min(100, Math.round(charge * 1000) / 1000);
}

function sanitizeRedHoodPierceCount(value) {
  const count = Math.floor(Number(value) || 0);
  return Math.max(0, Math.min(2, count));
}

function sanitizeScarletCounterEnabled(value) {
  return value !== false;
}

function createEmptyLineupSlot() {
  return {
    defenseTeam: Array(TEAM_SIZE).fill(null),
    defenseUniversalCharges: Array(TEAM_SIZE).fill(0),
    defenseRedHoodPierceCounts: Array(TEAM_SIZE).fill(0),
    defenseScarletCounterEnabled: Array(TEAM_SIZE).fill(true),
    team: Array(TEAM_SIZE).fill(null),
    universalCharges: Array(TEAM_SIZE).fill(0),
    redHoodPierceCounts: Array(TEAM_SIZE).fill(0),
    scarletCounterEnabled: Array(TEAM_SIZE).fill(true),
    jackalLinks: {
      defense: { enabled: false, ownerId: null, targetIds: [] },
      attack: { enabled: false, ownerId: null, targetIds: [] },
    },
  };
}

function serializeLineupSlot() {
  return {
    defenseTeam: state.defenseTeam.map((character) => character?.id || null),
    defenseUniversalCharges: [...state.defenseUniversalCharges],
    defenseRedHoodPierceCounts: [...state.defenseRedHoodPierceCounts],
    defenseScarletCounterEnabled: [...state.defenseScarletCounterEnabled],
    team: state.team.map((character) => character?.id || null),
    universalCharges: [...state.universalCharges],
    redHoodPierceCounts: [...state.redHoodPierceCounts],
    scarletCounterEnabled: [...state.scarletCounterEnabled],
    jackalLinks: {
      defense: { ...normalizeJackalLink("defense"), targetIds: [...normalizeJackalLink("defense").targetIds] },
      attack: { ...normalizeJackalLink("attack"), targetIds: [...normalizeJackalLink("attack").targetIds] },
    },
  };
}

function normalizeLineupSlot(slot = {}) {
  const empty = createEmptyLineupSlot();
  return {
    defenseTeam: Array.from({ length: TEAM_SIZE }, (_, index) => slot.defenseTeam?.[index] ?? empty.defenseTeam[index]),
    defenseUniversalCharges: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(slot.defenseUniversalCharges?.[index])),
    defenseRedHoodPierceCounts: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(slot.defenseRedHoodPierceCounts?.[index])),
    defenseScarletCounterEnabled: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(slot.defenseScarletCounterEnabled?.[index])),
    team: Array.from({ length: TEAM_SIZE }, (_, index) => slot.team?.[index] ?? empty.team[index]),
    universalCharges: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(slot.universalCharges?.[index])),
    redHoodPierceCounts: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(slot.redHoodPierceCounts?.[index])),
    scarletCounterEnabled: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(slot.scarletCounterEnabled?.[index])),
    jackalLinks: {
      defense: {
        enabled: Boolean(slot.jackalLinks?.defense?.enabled),
        ownerId: slot.jackalLinks?.defense?.ownerId || null,
        targetIds: Array.isArray(slot.jackalLinks?.defense?.targetIds) ? slot.jackalLinks.defense.targetIds : [],
      },
      attack: {
        enabled: Boolean(slot.jackalLinks?.attack?.enabled),
        ownerId: slot.jackalLinks?.attack?.ownerId || null,
        targetIds: Array.isArray(slot.jackalLinks?.attack?.targetIds) ? slot.jackalLinks.attack.targetIds : [],
      },
    },
  };
}

function normalizeLineupSlots(savedSlots = []) {
  return Array.from({ length: LINEUP_SLOT_COUNT }, (_, index) => normalizeLineupSlot(savedSlots[index]));
}

function saveCurrentLineupSlot() {
  state.lineupSlots[state.activeLineupIndex] = serializeLineupSlot();
}

function loadLineupSlot(index) {
  const slot = normalizeLineupSlot(state.lineupSlots[index]);
  state.defenseTeam = Array.from({ length: TEAM_SIZE }, (_, slotIndex) => getCharacterById(slot.defenseTeam[slotIndex]));
  state.defenseUniversalCharges = [...slot.defenseUniversalCharges];
  state.defenseRedHoodPierceCounts = [...slot.defenseRedHoodPierceCounts];
  state.defenseScarletCounterEnabled = [...slot.defenseScarletCounterEnabled];
  state.team = Array.from({ length: TEAM_SIZE }, (_, slotIndex) => getCharacterById(slot.team[slotIndex]));
  state.universalCharges = [...slot.universalCharges];
  state.redHoodPierceCounts = [...slot.redHoodPierceCounts];
  state.scarletCounterEnabled = [...slot.scarletCounterEnabled];
  applySavedTeamChargeSpeeds("defense");
  applySavedTeamChargeSpeeds("attack");
  applySavedTeamRedHoodPierceCounts("defense");
  applySavedTeamRedHoodPierceCounts("attack");
  state.jackalLinks = {
    defense: { ...slot.jackalLinks.defense, targetIds: [...slot.jackalLinks.defense.targetIds] },
    attack: { ...slot.jackalLinks.attack, targetIds: [...slot.jackalLinks.attack.targetIds] },
  };
  normalizeJackalLinks();
}

function getCharacterChargeSpeedMemory(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.characterChargeSpeeds[normalizedTeamKey]) {
    state.characterChargeSpeeds[normalizedTeamKey] = {};
  }
  return state.characterChargeSpeeds[normalizedTeamKey];
}

function getCharacterQuantumCubeMemory(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.characterQuantumCubes[normalizedTeamKey]) {
    state.characterQuantumCubes[normalizedTeamKey] = {};
  }
  return state.characterQuantumCubes[normalizedTeamKey];
}

function getCharacterRedHoodPierceCountMemory(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.characterRedHoodPierceCounts[normalizedTeamKey]) {
    state.characterRedHoodPierceCounts[normalizedTeamKey] = {};
  }
  return state.characterRedHoodPierceCounts[normalizedTeamKey];
}

function sanitizeChargeSpeed(value) {
  return Math.max(0, Number(value) || 0);
}

function getSavedCharacterChargeSpeed(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return 0;
  return sanitizeChargeSpeed(getCharacterChargeSpeedMemory(teamKey)[character.id]);
}

function saveCharacterChargeSpeed(character, value, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  getCharacterChargeSpeedMemory(teamKey)[character.id] = sanitizeChargeSpeed(value);
}

function resetCharacterChargeSpeed(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  delete getCharacterChargeSpeedMemory(teamKey)[character.id];
}

function getSavedCharacterQuantumCube(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return false;
  return Boolean(getCharacterQuantumCubeMemory(teamKey)[character.id]);
}

function saveCharacterQuantumCube(character, enabled, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  getCharacterQuantumCubeMemory(teamKey)[character.id] = Boolean(enabled);
}

function resetCharacterQuantumCube(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  delete getCharacterQuantumCubeMemory(teamKey)[character.id];
}

function getDisplayMagazine() {
  return null;
}

function hasSavedCharacterRedHoodPierceCount(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return false;
  return Object.prototype.hasOwnProperty.call(getCharacterRedHoodPierceCountMemory(teamKey), character.id);
}

function getSavedCharacterRedHoodPierceCount(character, teamKey = state.activeTeamKey, fallback = 0) {
  if (!character?.id) return sanitizeRedHoodPierceCount(fallback);
  const memory = getCharacterRedHoodPierceCountMemory(teamKey);
  return hasSavedCharacterRedHoodPierceCount(character, teamKey)
    ? sanitizeRedHoodPierceCount(memory[character.id])
    : sanitizeRedHoodPierceCount(fallback);
}

function saveCharacterRedHoodPierceCount(character, value, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  getCharacterRedHoodPierceCountMemory(teamKey)[character.id] = sanitizeRedHoodPierceCount(value);
}

function rememberTeamSlotChargeSpeed(teamKey, index) {
  const character = getTeamState(teamKey)[index];
  if (!character) return;
  saveCharacterChargeSpeed(character, getChargeSpeedState(teamKey)[index], teamKey);
}

function rememberTeamSlotRedHoodPierceCount(teamKey, index) {
  const character = getTeamState(teamKey)[index];
  if (!character || !isRedHood(character)) return;
  saveCharacterRedHoodPierceCount(character, getRedHoodPierceCountState(teamKey)[index], teamKey);
}

function rememberTeamChargeSpeeds(teamKey) {
  for (let index = 0; index < TEAM_SIZE; index += 1) {
    rememberTeamSlotChargeSpeed(teamKey, index);
  }
}

function rememberTeamRedHoodPierceCounts(teamKey) {
  for (let index = 0; index < TEAM_SIZE; index += 1) {
    rememberTeamSlotRedHoodPierceCount(teamKey, index);
  }
}

function applySavedTeamChargeSpeeds(teamKey) {
  const team = getTeamState(teamKey);
  const chargeSpeeds = getChargeSpeedState(teamKey);
  for (let index = 0; index < TEAM_SIZE; index += 1) {
    chargeSpeeds[index] = team[index] ? getSavedCharacterChargeSpeed(team[index], teamKey) : 0;
  }
}

function applySavedTeamRedHoodPierceCounts(teamKey) {
  const team = getTeamState(teamKey);
  const pierceCounts = getRedHoodPierceCountState(teamKey);
  for (let index = 0; index < TEAM_SIZE; index += 1) {
    pierceCounts[index] = team[index] && isRedHood(team[index])
      ? getSavedCharacterRedHoodPierceCount(team[index], teamKey, pierceCounts[index])
      : 0;
  }
}

function setActiveTeam(teamKey) {
  state.activeTeamKey = normalizeTeamKey(teamKey);
}

function applyChargeSpeedFrames(baseFrames, chargeSpeedPercent = 0) {
  if (!baseFrames) return baseFrames;
  const speed = Math.round(Number(chargeSpeedPercent) || 0);
  if (baseFrames === 60 && FIXED_CHARGE_SPEED_FRAMES_60.has(speed)) return FIXED_CHARGE_SPEED_FRAMES_60.get(speed);
  if (speed <= 0) return baseFrames;
  return Math.floor((baseFrames / 2) / (1 + speed / 100)) * 2;
}

function applyChargeSpeedTotalFrames(baseFrames, chargeSpeedPercent = 0) {
  if (!baseFrames) return baseFrames;
  const speed = Math.round(Number(chargeSpeedPercent) || 0);
  if (speed <= 0) return baseFrames;
  return Math.floor(baseFrames / (1 + speed / 100) / 2) * 2;
}

function applyChargeSpeedIntervalFrames(baseChargeFrames, fixedFrames, chargeSpeedPercent = 0) {
  return applyChargeSpeedFrames(baseChargeFrames, chargeSpeedPercent) + (Number(fixedFrames) || 0);
}

function isCinderella(character) {
  return character?.name === "灰姑娘" || character?.slug === "灰姑娘";
}

function getCinderellaChargeMultiplier(shotNumber = 1) {
  const normalizedShotNumber = Math.max(1, Math.floor(Number(shotNumber) || 1));
  if (normalizedShotNumber <= CINDERELLA_INITIAL_CHARGE_SEQUENCE.length) {
    return CINDERELLA_INITIAL_CHARGE_SEQUENCE[normalizedShotNumber - 1];
  }
  const loopIndex = (normalizedShotNumber - CINDERELLA_INITIAL_CHARGE_SEQUENCE.length - 1) % CINDERELLA_LOOP_CHARGE_SEQUENCE.length;
  return CINDERELLA_LOOP_CHARGE_SEQUENCE[loopIndex];
}

function getRlProjectileFlightFrames(character, positionIndex, teamKey = "attack") {
  if (isCinderella(character)) return CINDERELLA_PROJECTILE_FLIGHT_FRAMES;
  if (Number.isFinite(character.projectileFlightFrames)) return character.projectileFlightFrames;
  if (normalizeTeamKey(teamKey) === "defense") {
    if (positionIndex <= 1) return 16;
    if (positionIndex <= 3) return 14;
    return 12;
  }
  const positionKey = `P${positionIndex + 1}`;
  return character.timing?.projectileFlightFramesByPosition?.[positionKey] ?? (positionIndex <= 1 ? 16 : 14);
}

function getChargeFrames(character, positionIndex, teamKey = "attack") {
  const speed = Number(character.chargeSpeedPercent) || 0;

  if (character.weapon === "MG") {
    return {
      firstFrame: MG_WARMUP_EVENTS[0].frame,
      interval: MG_SUSTAIN_INTERVAL_FRAMES,
      chargeFrames: 0,
    };
  }

  if (character.timing?.firstFrame !== null && character.timing?.intervalFrames !== null) {
    const baseChargeFrames = isCinderella(character)
      ? CINDERELLA_INITIAL_CHARGE_FRAMES
      : character.timing.chargeFrames ?? 0;
    const chargeFrames = applyChargeSpeedFrames(baseChargeFrames, speed);
    const baseIntervalFrames =
      character.timing.turnFrames != null ? baseChargeFrames + character.timing.turnFrames : character.timing.intervalFrames;
    const fixedIntervalFrames = Math.max(0, baseIntervalFrames - baseChargeFrames);
    const intervalFrames = applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, speed);

    if (character.weapon === "RL" && character.timing.projectileFlightFramesByPosition) {
      const flightFrames = getRlProjectileFlightFrames(character, positionIndex, teamKey);
      const firstFrame = isCinderella(character)
        ? chargeFrames + flightFrames
        : character.firstFrameOverride ?? chargeFrames + flightFrames;
      return {
        firstFrame,
        interval: isCinderella(character) ? CINDERELLA_ATTACK_INTERVAL_FRAMES : character.attackIntervalFrames || intervalFrames,
        reloadInterval: isCinderella(character) ? firstFrame : null,
        chargeFrames,
        baseChargeFrames,
        baseIntervalFrames,
        projectileFlightFrames: flightFrames,
      };
    }

    if (["SR", "RL"].includes(character.weapon)) {
      return {
        firstFrame: character.firstFrameOverride ?? chargeFrames,
        interval: character.attackIntervalFrames || intervalFrames,
        chargeFrames,
        baseChargeFrames,
        baseIntervalFrames,
      };
    }

    return {
      firstFrame: character.timing.firstFrame,
      interval: character.timing.intervalFrames,
      chargeFrames,
    };
  }

  const sheetChargeFrames =
    typeof character.stats?.chargeSeconds === "number" ? Math.round(character.stats.chargeSeconds * FRAMES_PER_SECOND) : null;
  const chargeFrames = applyChargeSpeedFrames(sheetChargeFrames ?? 60, speed);

  if (character.weapon === "SMG") return { firstFrame: 0, interval: 4, chargeFrames: 0 };
  if (character.weapon === "AR") return { firstFrame: 0, interval: 6, chargeFrames: 0 };
  if (character.weapon === "SG") return { firstFrame: 0, interval: 42, chargeFrames: 0 };
  if (character.weapon === "SR") {
    const turnFrames = character.turnFrames ?? 16;
    const baseChargeFrames = sheetChargeFrames ?? 60;
    return {
      firstFrame: character.firstFrameOverride ?? applyChargeSpeedFrames(baseChargeFrames, speed),
      interval: character.attackIntervalFrames || applyChargeSpeedIntervalFrames(baseChargeFrames, turnFrames, speed),
      chargeFrames,
      baseChargeFrames,
      baseIntervalFrames: baseChargeFrames + turnFrames,
    };
  }
  if (character.weapon === "RL") {
    const flightFrames = getRlProjectileFlightFrames(character, positionIndex, teamKey);
    const turnFrames = character.turnFrames ?? 16;
    const baseChargeFrames = sheetChargeFrames ?? 60;
    return {
      firstFrame: character.firstFrameOverride ?? applyChargeSpeedFrames(baseChargeFrames, speed) + flightFrames,
      interval: character.attackIntervalFrames || applyChargeSpeedIntervalFrames(baseChargeFrames, turnFrames, speed),
      chargeFrames,
      baseChargeFrames,
      baseIntervalFrames: baseChargeFrames + turnFrames,
      projectileFlightFrames: flightFrames,
    };
  }

  throw new Error(`未知武器类型：${character.weapon}`);
}

function getRlHitSegments(character) {
  if (isCinderella(character)) return CINDERELLA_TARGET_HIT_COUNT;
  const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
  const start = Math.max(0, DEFAULT_RL_TARGET_INDEX - range);
  const end = Math.min(ENEMY_TEAM_SIZE - 1, DEFAULT_RL_TARGET_INDEX + range);
  return (end - start + 1) * 2;
}

function getEffectiveBurstGen(character) {
  const baseBurstGen = Number(character.burstGen) || 0;
  return character.quantumRelicCubeEnabled ? baseBurstGen * QUANTUM_RELIC_CUBE_MULTIPLIER : baseBurstGen;
}

function getBaseChargeUnit(character) {
  const baseCharge = getEffectiveBurstGen(character);
  return character.weapon === "SG" ? baseCharge / 10 : baseCharge;
}

function getChargeHitMultiplier(character, shotNumber = null) {
  if (isCinderella(character)) return getCinderellaChargeMultiplier(shotNumber);
  if (character.weapon === "RL") return getRlHitSegments(character);
  if (character.weapon === "SG") return 10;
  return 1 + getPenetrationExtraHitCount(character, shotNumber);
}

function getChargeHitLabel(character, hitMultiplier = getChargeHitMultiplier(character)) {
  if (isCinderella(character)) return `命中：${CINDERELLA_TARGET_HIT_COUNT} hit；充能倍率：4/2/2/2/4/4，之后 2/2/2/2/4/4 循环`;
  return `命中：${hitMultiplier} hit`;
}

function getChargeValue(character, shotNumber = null) {
  const coverMultiplier = getChargeHitMultiplier(character, shotNumber);
  const extraMultiplier = character.hasExtraDamage ? 2 : 1;
  return getBaseChargeUnit(character) * coverMultiplier * extraMultiplier + (character.flatBurstBonus || 0);
}

function getDelayedExtraLabel(character) {
  return character?.id === 57 || character?.slug === "哈兰" || character?.name === "哈兰" ? "中毒充能" : "延迟额外";
}

function isHarran(character) {
  return character?.id === 57 || character?.slug === "哈兰" || character?.name === "哈兰";
}

function getHarranPoisonChargeValue(character) {
  return getBaseChargeUnit(character) * (character.hasExtraDamage ? 2 : 1);
}

function getHarranPoisonEvent(event, currentFrame) {
  if (!isHarran(event.character) || event.poisonChargeStarted) return null;
  event.poisonChargeStarted = true;
  return {
    character: event.character,
    positionIndex: event.positionIndex,
    frame: currentFrame + 60,
    chargeValue: getHarranPoisonChargeValue(event.character),
    source: "harran-poison",
    label: "中毒充能",
    repeatFrames: 60,
  };
}

function getChargeBreakdown(character) {
  const hitMultiplier = getChargeHitMultiplier(character);
  const extraMultiplier = character.hasExtraDamage ? 2 : 1;
  const hitLabel = getChargeHitLabel(character, hitMultiplier);
  const baseChargeUnit = getBaseChargeUnit(character);
  const effectiveBurstGen = getEffectiveBurstGen(character);
  const flatBonus = character.flatBurstBonus || 0;
  const lines = [
    `充能组成：${formatNumber(baseChargeUnit, 5)} × ${hitMultiplier} × ${extraMultiplier}${flatBonus ? ` + ${formatNumber(flatBonus, 2)}` : ""} = ${formatNumber(getChargeValue(character), 2)}%`,
    `基础：${formatNumber(baseChargeUnit, 5)}%${character.quantumRelicCubeEnabled ? `（量子遗迹魔方 ${formatNumber(character.burstGen, 2)} × 1.0466）` : ""}`,
    hitLabel,
  ];

  if (character.hasExtraDamage) lines.push("额外伤害 ×2");
  if (isRedHood(character)) lines.push(`攻击蓄速：每次攻击 +${formatNumber(RED_HOOD_CHARGE_SPEED_PER_ATTACK, 2)}%，最多 ${RED_HOOD_MAX_CHARGE_SPEED_STACKS} 层`);
  if (flatBonus) lines.push(`固定补充 +${formatNumber(flatBonus, 2)}%`);
  if (character.hitCountExtraEvents?.length) {
    lines.push(
      `攻击追加：${character.hitCountExtraEvents
        .map((event) => {
          const triggerText = event.every ? `每${event.every}发` : `第${event.hit}次`;
          const delayText = event.delayFrames ? `${event.delayFrames}帧后 ` : "";
          return `${triggerText}${delayText} +${formatNumber(baseChargeUnit * event.segments * extraMultiplier, 2)}%`;
        })
        .join("，")}`,
    );
  }
  if (character.magazineEmptyExtraCharge) {
    lines.push(
      `尾弹追加：打完弹夹后${Number(character.magazineEmptyExtraDelayFrames) || 12}帧 +${formatNumber(character.magazineEmptyExtraCharge, 2)}%`,
    );
  }
  if (isHarran(character)) {
    lines.push(`中毒充能：第一发命中后每60F +${formatNumber(getHarranPoisonChargeValue(character), 2)}%`);
  } else if (character.delayedExtraHits?.length) {
    const delayedLabel = getDelayedExtraLabel(character);
    lines.push(
      `${delayedLabel}：${character.delayedExtraHits
        .map((event) => `${event.delayFrames}帧后 +${formatNumber(baseChargeUnit * event.segments * extraMultiplier, 2)}%`)
        .join("，")}`,
    );
  }

  return lines.join("\n");
}

function getCharacterDetailText(character) {
  return [
    `${character.name}（${character.rarity || "SSR"}）`,
    `最终单发充能：${formatNumber(getChargeValue(character), 2)}%`,
    ...getChargeWeaponDetailLines(character),
    getChargeBreakdown(character),
  ].join("\n");
}

function getCharacterTooltip() {
  let tooltip = document.querySelector(".character-hover-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "character-hover-tooltip";
    document.body.append(tooltip);
  }
  return tooltip;
}

function positionCharacterTooltip(tile) {
  const tooltip = getCharacterTooltip();
  const rect = tile.getBoundingClientRect();
  const gap = 8;
  const width = Math.min(340, Math.max(260, window.innerWidth - 24));
  tooltip.style.width = `${width}px`;
  const tooltipHeight = tooltip.offsetHeight || 180;
  const placeAbove = rect.bottom + gap + tooltipHeight > window.innerHeight && rect.top > tooltipHeight + gap;
  const left = Math.min(Math.max(rect.left, 12), Math.max(window.innerWidth - width - 12, 12));
  const top = placeAbove ? rect.top - tooltipHeight - gap : rect.bottom + gap;
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${Math.min(Math.max(top, 12), Math.max(window.innerHeight - tooltipHeight - 12, 12))}px`;
}

function showCharacterTooltip(character, index, tile) {
  const tooltip = getCharacterTooltip();
  const detailLines = [...getChargeWeaponDetailLines(character), ...getChargeBreakdown(character).split("\n")];
  tooltip.innerHTML = `
    <div class="character-tooltip-head">
      <strong>${escapeHtml(character.name)}</strong>
      <span>可右键复制</span>
    </div>
    <div class="character-tooltip-meta">
      #${index + 1} · ${escapeHtml(character.rarity || "SSR")} · ${escapeHtml(character.weapon)} · ${escapeHtml(character.burstStage)} · ${escapeHtml(getRegionLabel(character))}
    </div>
    <div class="character-tooltip-main">最终单发 ${formatNumber(getChargeValue(character), 2)}%</div>
    <div class="character-tooltip-lines">
      ${detailLines.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}
    </div>
  `;
  tooltip.classList.add("show");
  positionCharacterTooltip(tile);
}

function hideCharacterTooltip() {
  document.querySelector(".character-hover-tooltip")?.classList.remove("show");
}

function getDelayedExtraEvents(event, currentFrame) {
  if (isHarran(event.character)) return [];
  return (event.character.delayedExtraHits || []).map((extra) => ({
    character: event.character,
    positionIndex: event.positionIndex,
    frame: currentFrame + extra.delayFrames,
    chargeValue: getBaseChargeUnit(event.character) * extra.segments * (event.character.hasExtraDamage ? 2 : 1),
    source: "delayed",
  }));
}

function getMagazineEmptyExtraEvent(event, reloadEvent) {
  if (!event || !reloadEvent || !event.character.magazineEmptyExtraCharge) return null;
  const delayFrames = Number(event.character.magazineEmptyExtraDelayFrames) || 12;
  return {
    character: event.character,
    positionIndex: event.positionIndex,
    frame: reloadEvent.startFrame + delayFrames,
    chargeValue: Number(event.character.magazineEmptyExtraCharge) || 0,
    source: "magazine-empty",
    label: event.character.magazineEmptyExtraLabel || "尾弹追加",
  };
}

function getTriggeredHitCountExtraEvents(event) {
  return (event.character.hitCountExtraEvents || []).filter(
    (extra) => extra.hit === event.hits || (extra.every && event.hits > 0 && event.hits % extra.every === 0),
  );
}

function getHitCountExtraChargeValue(event, extra) {
  const extraMultiplier = event.character.hasExtraDamage ? 2 : 1;
  return getBaseChargeUnit(event.character) * extra.segments * extraMultiplier;
}

function getHitCountExtraCharge(event) {
  return getTriggeredHitCountExtraEvents(event)
    .filter((extra) => !extra.delayFrames)
    .reduce((sum, extra) => sum + getHitCountExtraChargeValue(event, extra), 0);
}

function getDelayedHitCountExtraEvents(event, currentFrame) {
  return getTriggeredHitCountExtraEvents(event)
    .filter((extra) => Number(extra.delayFrames) > 0)
    .map((extra) => ({
      character: event.character,
      positionIndex: event.positionIndex,
      frame: currentFrame + Number(extra.delayFrames),
      chargeValue: getHitCountExtraChargeValue(event, extra),
      source: "hit-count-delayed",
      label: extra.label || "尾弹追加",
    }));
}

function getAttackShotCount(event) {
  if (event.character.weapon !== "MG") return 1;
  return MG_WARMUP_EVENTS[event.mgWarmupIndex]?.shots ?? 1;
}

function getAttackChargeShotNumber(event, shotCount = 1) {
  return isCinderella(event.character) ? event.shotsInMagazine + shotCount : event.hits;
}

function getCounterHitCount(character, shotCount = 1) {
  if (character.weapon === "SG") return shotCount * 10;
  return shotCount;
}

function getPenetrationExtraHitCount(character, shotNumber = null) {
  if (!character) return 0;
  if (isRedHood(character)) {
    const pierceCount = sanitizeRedHoodPierceCount(character.redHoodPierceCount);
    if (Number.isFinite(Number(shotNumber))) {
      return Number(shotNumber) > 0 && Number(shotNumber) <= pierceCount ? 1 : 0;
    }
    return pierceCount > 0 ? 1 : 0;
  }
  return character.hasPenetration ? 1 : 0;
}

function getTargetPositionIndex(character, teamKey = "attack") {
  const rule = character.targetRule?.[normalizeTeamKey(teamKey)] || "↗";
  return rule === "↖" || rule === "↘" ? ENEMY_TEAM_SIZE - 1 : DEFAULT_RL_TARGET_INDEX;
}

function getAttackHitProfile(character, shotCount = 1, teamKey = "attack", shotNumber = null) {
  const shotHits = getCounterHitCount(character, shotCount);
  const targetPositionIndex = getTargetPositionIndex(character, teamKey);

  if (isCinderella(character)) {
    return {
      totalHits: shotHits,
      bodyHits: [[targetPositionIndex, shotCount]],
      targetHits: [[targetPositionIndex, CINDERELLA_TARGET_HIT_COUNT]],
    };
  }

  if (character.weapon === "RL") {
    const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
    const start = Math.max(0, targetPositionIndex - range);
    const end = Math.min(ENEMY_TEAM_SIZE - 1, targetPositionIndex + range);
    const bodyHits = Array.from({ length: end - start + 1 }, (_, offset) => [start + offset, shotCount]);
    return {
      totalHits: shotHits,
      bodyHits,
      targetHits: bodyHits.map(([positionIndex, hitCount]) => [positionIndex, hitCount * 2]),
    };
  }

  const penetrationExtraHits = getPenetrationExtraHitCount(character, shotNumber);
  if (penetrationExtraHits > 0) {
    return {
      totalHits: shotHits * (1 + penetrationExtraHits),
      bodyHits: [[targetPositionIndex, shotCount]],
      targetHits: [[targetPositionIndex, shotCount * (1 + penetrationExtraHits)]],
    };
  }

  return {
    totalHits: shotHits,
    bodyHits: [[targetPositionIndex, shotHits]],
    targetHits: [[targetPositionIndex, shotHits]],
  };
}

function getAttackContributionLabel(character, shotCount = 1, shotNumber = null) {
  if (character.weapon === "MG" && shotCount > 1) return `命中：${shotCount} hit`;
  return getChargeHitLabel(character, getChargeHitMultiplier(character, shotNumber));
}

function isReloadingAtFrame(positionIndex, frame, reloadTimeline = []) {
  return reloadTimeline.some(
    (reload) => reload.positionIndex === positionIndex && reload.startFrame < frame && reload.endFrame > frame,
  );
}

function getReceivedPositionHits(character, hitProfile, frame, opponentReloadTimeline = []) {
  if (character.weapon === "RL") return hitProfile.bodyHits;
  return hitProfile.bodyHits.filter(([positionIndex]) => !isReloadingAtFrame(positionIndex, frame, opponentReloadTimeline));
}

function getMagazineSize(character) {
  if (isChargeWeapon(character)) return Infinity;
  const magazine = Math.floor(Number(character.stats?.magazine) || 0);
  return magazine > 0 ? magazine : Infinity;
}

function getReloadFrames(character) {
  const reloadSeconds = Number(character.stats?.reloadSeconds) || 0;
  return reloadSeconds > 0 ? Math.round(reloadSeconds * FRAMES_PER_SECOND) : 0;
}

function getEffectiveCharacterStats(character, teamKey = "attack") {
  if (!isScarlet(character)) return character.stats;
  return { ...character.stats, magazine: 60 };
}

function getRedHoodChargeSpeedStacksAfterAttack(event, shotCount = 1) {
  if (!isRedHood(event.character)) return 0;
  return Math.min(RED_HOOD_MAX_CHARGE_SPEED_STACKS, (Number(event.redHoodChargeSpeedStacks) || 0) + shotCount);
}

function getRedHoodStackedChargeSpeed(character, stacks = 0) {
  const baseSpeed = Number(character.chargeSpeedPercent) || 0;
  const stackBonus = Math.round(
    Math.min(RED_HOOD_MAX_CHARGE_SPEED_STACKS, Math.max(0, Number(stacks) || 0)) * RED_HOOD_CHARGE_SPEED_PER_ATTACK,
  );
  return baseSpeed + stackBonus;
}

function getRedHoodStackedInterval(event, stacks = event.redHoodChargeSpeedStacks) {
  const baseChargeFrames = event.baseChargeFrames || event.chargeFrames || 0;
  const fixedIntervalFrames = Math.max(0, (event.baseIntervalFrames || event.interval) - baseChargeFrames);
  return applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, getRedHoodStackedChargeSpeed(event.character, stacks));
}

function getBaseNextAttackFrame(event, currentFrame, shotCount = 1) {
  if (event.character.weapon !== "MG") {
    if (isRedHood(event.character)) {
      return currentFrame + getRedHoodStackedInterval(event, getRedHoodChargeSpeedStacksAfterAttack(event, shotCount));
    }
    return currentFrame + event.interval;
  }

  if (event.mgWarmupIndex < MG_WARMUP_EVENTS.length - 1) {
    event.mgWarmupIndex += 1;
    return MG_WARMUP_EVENTS[event.mgWarmupIndex].frame;
  }

  event.mgWarmupIndex += 1;
  return event.nextFrame < MG_SUSTAIN_START_FRAME ? MG_SUSTAIN_START_FRAME : event.nextFrame + MG_SUSTAIN_INTERVAL_FRAMES;
}

function getFrameAfterStun(frame, positionIndex, stunWindows = []) {
  let adjustedFrame = frame;
  let moved = true;
  while (moved) {
    moved = false;
    stunWindows.forEach((window) => {
      if (window.positionIndex !== positionIndex) return;
      if (adjustedFrame >= window.startFrame && adjustedFrame < window.endFrame) {
        adjustedFrame = window.endFrame;
        moved = true;
      }
    });
  }
  return adjustedFrame;
}

function isChargeWeapon(character) {
  return character && ["RL", "SR"].includes(character.weapon);
}

function getChargeInterruptedFrame(character, positionIndex, startFrame, endFrame, resetFrames, stunWindows = []) {
  if (!isChargeWeapon(character)) return null;
  const interruption = stunWindows
    .filter((window) => window.positionIndex === positionIndex && window.startFrame > startFrame && window.startFrame <= endFrame)
    .sort((a, b) => a.startFrame - b.startFrame)[0];
  return interruption ? interruption.endFrame + resetFrames : null;
}

function getInitialAttackFrameAfterStun(character, positionIndex, firstFrame, stunWindows = []) {
  return getChargeInterruptedFrame(character, positionIndex, 0, firstFrame, firstFrame, stunWindows) ?? getFrameAfterStun(firstFrame, positionIndex, stunWindows);
}

function getNextAttackFrameAfterStun(event, currentFrame, baseNextFrame, stunWindows = []) {
  return (
    getChargeInterruptedFrame(event.character, event.positionIndex, currentFrame, baseNextFrame, baseNextFrame - currentFrame, stunWindows) ??
    getFrameAfterStun(baseNextFrame, event.positionIndex, stunWindows)
  );
}

function getReloadAttackFrameAfterStun(event, reloadEndFrame, defaultNextFrame, stunWindows = []) {
  const nextFrame = isRedHood(event.character)
    ? defaultNextFrame
    : isCinderella(event.character) || isChargeWeapon(event.character)
      ? reloadEndFrame + (event.reloadInterval || event.chargeFrames || event.interval)
      : reloadEndFrame;
  return (
    getChargeInterruptedFrame(event.character, event.positionIndex, reloadEndFrame, nextFrame, nextFrame - reloadEndFrame, stunWindows) ??
    getFrameAfterStun(nextFrame, event.positionIndex, stunWindows)
  );
}

function advanceAttackEvent(event, currentFrame, shotCount = 1, stunWindows = []) {
  const nextRedHoodStacks = getRedHoodChargeSpeedStacksAfterAttack(event, shotCount);
  const baseNextFrame = getBaseNextAttackFrame(event, currentFrame, shotCount);
  const magazine = getMagazineSize(event.character);
  const reloadFrames = getReloadFrames(event.character);
  event.shotsInMagazine += shotCount;
  if (isRedHood(event.character)) {
    event.redHoodChargeSpeedStacks = nextRedHoodStacks;
  }

  if (Number.isFinite(magazine) && reloadFrames > 0 && event.shotsInMagazine >= magazine) {
    event.shotsInMagazine %= magazine;
    const reloadEvent = {
      positionIndex: event.positionIndex,
      characterName: event.character.name,
      startFrame: currentFrame,
      endFrame: currentFrame + reloadFrames,
      reloadFrames,
    };
    event.reloadEvents.push(reloadEvent);
    event.nextFrame = getReloadAttackFrameAfterStun(event, reloadEvent.endFrame, baseNextFrame + reloadFrames, stunWindows);
    return reloadEvent;
  }

  event.nextFrame = getNextAttackFrameAfterStun(event, currentFrame, baseNextFrame, stunWindows);
  return null;
}

function characterForSlot(character, positionIndex, teamKey = "attack") {
  if (!character) return null;
  const chargeSpeeds = getChargeSpeedState(teamKey);
  const redHoodPierceCounts = getRedHoodPierceCountState(teamKey);
  const scarletCounterEnabled = getScarletCounterEnabledState(teamKey);
  return {
    ...character,
    hasPenetration: isRedHood(character) ? false : character.hasPenetration,
    stats: getEffectiveCharacterStats(character, teamKey),
    chargeSpeedPercent: Number(chargeSpeeds[positionIndex]) || character.chargeSpeedPercent || 0,
    quantumRelicCubeEnabled: getSavedCharacterQuantumCube(character, teamKey),
    redHoodPierceCount: isRedHood(character) ? sanitizeRedHoodPierceCount(redHoodPierceCounts[positionIndex]) : 0,
    scarletCounterEnabled: isScarlet(character) ? sanitizeScarletCounterEnabled(scarletCounterEnabled[positionIndex]) : false,
  };
}

function simulateBurst(
  team,
  teamKey = "attack",
  specialChargeEvents = [],
  opponentReloadTimeline = [],
  stunWindows = [],
) {
  const members = team
    .map((character, positionIndex) => ({ character: characterForSlot(character, positionIndex, teamKey), positionIndex }))
    .filter((member) => member.character);
  const universalMembers = getUniversalChargeState(teamKey)
    .map((charge, positionIndex) => ({
      positionIndex,
      charge: sanitizeUniversalCharge(charge),
      characterName: `P${positionIndex + 1}万能`,
    }))
    .filter((member) => !team[member.positionIndex] && member.charge > 0);

  if (members.length === 0 && universalMembers.length === 0) return null;

  const events = members.map((member) => {
    const timing = getChargeFrames(member.character, member.positionIndex, teamKey);
    return {
      ...member,
      nextFrame: getInitialAttackFrameAfterStun(member.character, member.positionIndex, timing.firstFrame, stunWindows),
      interval: timing.interval,
      reloadInterval: timing.reloadInterval || timing.interval,
      chargeFrames: timing.chargeFrames,
      baseChargeFrames: timing.baseChargeFrames || timing.chargeFrames,
      baseIntervalFrames: timing.baseIntervalFrames || timing.interval,
      projectileFlightFrames: timing.projectileFlightFrames || 0,
      chargeValue: getChargeValue(member.character),
      hits: 0,
      shotsInMagazine: 0,
      redHoodChargeSpeedStacks: 0,
      mgWarmupIndex: member.character.weapon === "MG" ? 0 : null,
      totalCharge: 0,
      attackChargeTotal: 0,
      hitFrames: [],
      reloadEvents: [],
      flightEvents: [],
      poisonChargeStarted: false,
    };
  });

  let totalCharge = 0;
  let currentFrame = 0;
  let pendingExtraEvents = [];
  let currentFrameContributors = new Set(universalMembers.map((member) => member.positionIndex));
  const timeline = [];
  if (universalMembers.length) {
    const contributions = universalMembers.map((member) => {
      const charge = member.charge;
      totalCharge += charge;
      return {
        positionIndex: member.positionIndex,
        characterName: member.characterName,
        charge,
        cumulativeCharge: charge,
        labels: ["万能充能"],
        counterHits: 0,
        positionHits: [],
        targetHits: [],
        showOnMember: false,
      };
    });
    timeline.push({
      frame: 0,
      totalCharge,
      contributions,
    });
  }

  while (totalCharge < 100 - BURST_EPSILON && currentFrame <= 10000) {
    if (events.length === 0 && pendingExtraEvents.length === 0 && specialChargeEvents.length === 0) break;
    const nextAttackFrame = Math.min(...events.map((event) => event.nextFrame));
    const nextExtraFrame = pendingExtraEvents.length ? Math.min(...pendingExtraEvents.map((event) => event.frame)) : Infinity;
    const nextSpecialFrame = specialChargeEvents.length ? Math.min(...specialChargeEvents.map((event) => event.frame)) : Infinity;
    currentFrame = Math.min(nextAttackFrame, nextExtraFrame, nextSpecialFrame);
    currentFrameContributors = new Set();
    const contributions = new Map();
    const getContributionKey = (event, showOnMember, label = "") =>
      `${event.positionIndex}:${showOnMember ? "member" : `special:${label}`}`;
    const addContribution = (event, value, label, counterHits = 1, showOnMember = true) => {
      if (!event || !value) return;
      currentFrameContributors.add(event.positionIndex);
      const contributionKey = getContributionKey(event, showOnMember, label);
      const current = contributions.get(contributionKey) || {
        positionIndex: event.positionIndex,
        character: event.character,
        charge: 0,
        cumulativeCharge: 0,
        labels: [],
        counterHits: 0,
        positionHits: new Map(),
        targetHits: new Map(),
        showOnMember: false,
      };
      current.charge += value;
      current.cumulativeCharge = showOnMember ? event.attackChargeTotal : event.totalCharge;
      current.labels.push(label);
      current.counterHits += Math.max(Number(counterHits) || 0, 0);
      current.showOnMember = current.showOnMember || showOnMember;
      contributions.set(contributionKey, current);
    };
    const addPositionHits = (event, positionHits) => {
      const current = contributions.get(getContributionKey(event, true));
      if (!current) return;
      positionHits.forEach(([positionIndex, hitCount]) => {
        current.positionHits.set(positionIndex, (current.positionHits.get(positionIndex) || 0) + hitCount);
      });
    };
    const addTargetHits = (event, targetHits) => {
      const current = contributions.get(getContributionKey(event, true));
      if (!current) return;
      targetHits.forEach(([positionIndex, hitCount]) => {
        current.targetHits.set(positionIndex, (current.targetHits.get(positionIndex) || 0) + hitCount);
      });
    };

    const activeSpecials = specialChargeEvents.filter((event) => event.frame === currentFrame);
    specialChargeEvents = specialChargeEvents.filter((event) => event.frame !== currentFrame);
    activeSpecials.forEach((special) => {
      const owner = events.find((event) => event.positionIndex === special.positionIndex);
      if (!owner) return;
      totalCharge += special.chargeValue;
      owner.totalCharge += special.chargeValue;
      addContribution(owner, special.chargeValue, special.label, 0, false);
    });

    const activeExtras = pendingExtraEvents.filter((event) => event.frame === currentFrame);
    pendingExtraEvents = pendingExtraEvents.filter((event) => event.frame !== currentFrame);
    activeExtras.forEach((extra) => {
      totalCharge += extra.chargeValue;
      const owner = events.find((event) => event.character.id === extra.character.id);
      if (owner) {
        owner.totalCharge += extra.chargeValue;
        owner.attackChargeTotal += extra.chargeValue;
        addContribution(owner, extra.chargeValue, extra.label || getDelayedExtraLabel(owner.character));
        if (extra.repeatFrames) {
          pendingExtraEvents.push({
            ...extra,
            frame: currentFrame + extra.repeatFrames,
          });
        }
      }
    });

    const activeEvents = events.filter((event) => event.nextFrame === currentFrame);
    activeEvents.forEach((event) => {
      const shotCount = getAttackShotCount(event);
      event.hits += shotCount;
      const chargeShotNumber = getAttackChargeShotNumber(event, shotCount);
      event.hitFrames.push(shotCount > 1 ? `${currentFrame}×${shotCount}` : currentFrame);
      if (event.character.weapon === "RL" && event.projectileFlightFrames > 0) {
        const flightEvent = {
          positionIndex: event.positionIndex,
          characterName: event.character.name,
          startFrame: Math.max(0, currentFrame - event.projectileFlightFrames),
          endFrame: currentFrame,
          flightFrames: event.projectileFlightFrames,
        };
        event.flightEvents.push(flightEvent);
      }
      const hitProfile = getAttackHitProfile(event.character, shotCount, teamKey, chargeShotNumber);
      const receivedPositionHits = getReceivedPositionHits(event.character, hitProfile, currentFrame, opponentReloadTimeline);
      const chargeValue = getChargeValue(event.character, chargeShotNumber) * shotCount;
      totalCharge += chargeValue;
      event.totalCharge += chargeValue;
      event.attackChargeTotal += chargeValue;
      addContribution(event, chargeValue, getAttackContributionLabel(event.character, shotCount, chargeShotNumber));
      const currentContribution = contributions.get(getContributionKey(event, true));
      if (currentContribution) {
        const receivedHitTotal = receivedPositionHits.reduce((sum, [, hitCount]) => sum + hitCount, 0);
        currentContribution.counterHits += Math.max(receivedHitTotal - 1, 0);
      }
      addPositionHits(event, receivedPositionHits);
      addTargetHits(event, hitProfile.targetHits);
      const hitCountExtraCharge = getHitCountExtraCharge(event);
      totalCharge += hitCountExtraCharge;
      event.totalCharge += hitCountExtraCharge;
      event.attackChargeTotal += hitCountExtraCharge;
      addContribution(event, hitCountExtraCharge, "额外触发");
      pendingExtraEvents.push(...getDelayedHitCountExtraEvents(event, currentFrame));
      const harranPoisonEvent = getHarranPoisonEvent(event, currentFrame);
      if (harranPoisonEvent) pendingExtraEvents.push(harranPoisonEvent);
      pendingExtraEvents.push(...getDelayedExtraEvents(event, currentFrame));
      const reloadEvent = advanceAttackEvent(event, currentFrame, shotCount, stunWindows);
      const magazineEmptyExtra = getMagazineEmptyExtraEvent(event, reloadEvent);
      if (magazineEmptyExtra) pendingExtraEvents.push(magazineEmptyExtra);
    });

    if (contributions.size) {
      timeline.push({
        frame: currentFrame,
        totalCharge,
        contributions: [...contributions.values()].map((contribution) => ({
          positionIndex: contribution.positionIndex,
          characterName: contribution.character.name,
          charge: contribution.charge,
          cumulativeCharge: contribution.cumulativeCharge,
          labels: contribution.labels,
          counterHits: contribution.counterHits,
          positionHits: [...contribution.positionHits.entries()].map(([positionIndex, hitCount]) => ({ positionIndex, hitCount })),
          targetHits: [...contribution.targetHits.entries()].map(([positionIndex, hitCount]) => ({ positionIndex, hitCount })),
          showOnMember: contribution.showOnMember,
        })),
      });
    }
  }

  if (totalCharge < 100 - BURST_EPSILON) {
    return {
      error: "超过 10000 帧仍未充满，请检查角色数据。",
      members: events,
    };
  }

  const availableBurstLevel = getAvailableBurstLevel(events);

  return {
    teamKey,
    fullFrame: currentFrame,
    burst1Frame: currentFrame + 26,
    burst2Frame: currentFrame + 58,
    burst3Frame: currentFrame + 90,
    availableBurstLevel,
    canFullBurst: availableBurstLevel === 3,
    totalCharge,
    chargePerSecond: currentFrame === 0 ? totalCharge * FRAMES_PER_SECOND : (totalCharge / currentFrame) * FRAMES_PER_SECOND,
    finishingPositionIndices: [...currentFrameContributors].sort((a, b) => a - b),
    timeline,
    reloadTimeline: events.flatMap((event) => event.reloadEvents),
    flightTimeline: events.flatMap((event) => event.flightEvents),
    stunTimeline: stunWindows,
    members: events,
  };
}

function getCharacterById(id) {
  if (id === null || id === undefined) return null;
  const normalizedId = String(id);
  return CHARACTERS.find((character) => String(character.id) === normalizedId) || null;
}

function getRegionLabel(character) {
  return character.regions.includes("cn") ? "国际 / 国服" : "国际服";
}

function getAvatarMarkup(character) {
  if (character.avatarUrl) {
    return `<img src="${escapeHtml(character.avatarUrl)}" alt="${escapeHtml(character.name)}" loading="lazy" referrerpolicy="no-referrer" />`;
  }
  return `<span>${escapeHtml(character.weapon)}</span>`;
}

function getTimingLabel(character) {
  if (character.weapon === "MG") {
    return "暖机 96f×12 / 152f×22 / 180f×14 / 182f后每2f";
  }
  if (character.weapon === "RL") {
    const timing = character.timing || {};
    const flight = timing.projectileFlightFrames ?? timing.projectileFlightFramesByPosition?.P1 ?? character.projectileFlightFrames ?? 16;
    return `蓄力 ${timing.chargeFrames ?? "-"}f / 飞行 ${flight}f / 转身 ${timing.turnFrames ?? character.turnFrames ?? 16}f`;
  }
  if (character.weapon === "SR") {
    return `蓄力 ${character.timing?.chargeFrames ?? "-"}f / 转身 ${character.timing?.turnFrames ?? 16}f`;
  }
  return `间隔 ${getChargeFrames(character, 0).interval}f`;
}

function getChargeSpeedPreviewFrame(character, positionIndex = 0, teamKey = "attack", chargeSpeed = 0) {
  if (!character || !canShowFinishMarker(character)) return null;
  const previewCharacter = {
    ...character,
    chargeSpeedPercent: sanitizeChargeSpeed(chargeSpeed),
  };
  const timing = getChargeFrames(previewCharacter, positionIndex, teamKey);
  return Number.isFinite(timing.chargeFrames) ? timing.chargeFrames : timing.firstFrame;
}

function getTagMarkup(character) {
  const tags = [];
  if (character.hasPenetration && !isRedHood(character)) tags.push("穿透");
  if (character.hasExtraDamage) tags.push("额外伤害");
  if (character.flatBurstBonus) tags.push(`固定 +${character.flatBurstBonus}`);
  if (character.weapon === "RL") tags.push(`RL ${getRlHitSegments(character)} hit`);
  return tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
}

function getRarityClass(character) {
  const rarity = String(character.rarity || "SSR").toLowerCase();
  return ["ssr", "sr", "r"].includes(rarity) ? rarity : "ssr";
}

function getTeamSlotRarityClass(character) {
  return character ? ` rarity-${getRarityClass(character)}` : "";
}

function setTeamSlotDragImage(event, slot) {
  if (!event.dataTransfer || !slot) return;
  const clone = slot.cloneNode(true);
  const rect = slot.getBoundingClientRect();
  clone.classList.add("drag-image");
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.position = "fixed";
  clone.style.left = "-1000px";
  clone.style.top = "-1000px";
  clone.style.pointerEvents = "none";
  document.body.append(clone);
  event.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
  requestAnimationFrame(() => clone.remove());
}

function isTeamSlotDragControl(target) {
  return Boolean(
    target?.closest?.(
      ".slot-settings-toggle, .slot-link-toggle, .slot-link-target, .slot-pierce-count, .slot-counter-toggle, .universal-charge-field",
    ),
  );
}

function clearPointerTeamDragClasses() {
  els.teamSlots.querySelectorAll(".team-slot").forEach((teamSlot) => {
    teamSlot.classList.remove("is-dragging", "is-drop-target");
  });
}

function getTeamSlotAtPoint(x, y) {
  const element = document.elementFromPoint(x, y);
  return element?.closest?.(".team-slot") || null;
}

function updatePointerTeamDragTarget(clientX, clientY) {
  if (!pointerTeamDrag?.active) return;
  const targetSlot = getTeamSlotAtPoint(clientX, clientY);
  els.teamSlots.querySelectorAll(".team-slot.is-drop-target").forEach((slot) => {
    if (slot !== targetSlot) slot.classList.remove("is-drop-target");
  });

  if (
    !targetSlot ||
    (targetSlot.dataset.teamKey === pointerTeamDrag.teamKey && Number(targetSlot.dataset.slotIndex) === pointerTeamDrag.index)
  ) {
    pointerTeamDrag.target = null;
    return;
  }

  targetSlot.classList.add("is-drop-target");
  pointerTeamDrag.target = targetSlot;
}

function startPointerTeamDrag(event, slot, teamKey, index) {
  if (!pointerTeamDrag || pointerTeamDrag.active) return;
  pointerTeamDrag.active = true;
  pointerTeamDrag.slot = slot;
  draggedTeamIndex = index;
  draggedTeamKey = teamKey;
  slot.classList.add("is-dragging");
  updatePointerTeamDragTarget(event.clientX, event.clientY);
}

function handleTeamSlotPointerDown(event, slot, character, teamKey, index) {
  if (!character || event.pointerType === "mouse" || isTeamSlotDragControl(event.target)) return;
  pointerTeamDrag = {
    pointerId: event.pointerId,
    teamKey,
    index,
    slot,
    startX: event.clientX,
    startY: event.clientY,
    active: false,
    target: null,
  };
  slot.setPointerCapture?.(event.pointerId);
}

function handleTeamSlotPointerMove(event) {
  if (!pointerTeamDrag || event.pointerId !== pointerTeamDrag.pointerId) return;
  const distance = Math.hypot(event.clientX - pointerTeamDrag.startX, event.clientY - pointerTeamDrag.startY);
  if (!pointerTeamDrag.active && distance >= 8) {
    startPointerTeamDrag(event, pointerTeamDrag.slot, pointerTeamDrag.teamKey, pointerTeamDrag.index);
  }
  if (!pointerTeamDrag.active) return;
  event.preventDefault();
  updatePointerTeamDragTarget(event.clientX, event.clientY);
}

function finishPointerTeamDrag(event) {
  if (!pointerTeamDrag || event.pointerId !== pointerTeamDrag.pointerId) return;
  const drag = pointerTeamDrag;
  pointerTeamDrag = null;
  drag.slot?.releasePointerCapture?.(event.pointerId);
  clearPointerTeamDragClasses();
  draggedTeamIndex = null;
  draggedTeamKey = null;

  if (!drag.active) return;
  suppressTeamSlotClick = true;
  setTimeout(() => {
    suppressTeamSlotClick = false;
  }, 0);
  if (!drag.target) return;
  moveTeamSlot(drag.teamKey, drag.index, drag.target.dataset.teamKey, Number(drag.target.dataset.slotIndex));
}

function getWeaponIcon(character) {
  const weaponIconMap = {
    SG: "1",
    RL: "2",
    SR: "3",
    AR: "4",
    SMG: "5",
    MG: "6",
  };
  return `assets/icons/ui/weapons/${weaponIconMap[character.weapon] || "1"}.png`;
}

function getBurstIcon(character) {
  const firstStage = isAnyBurstStageCharacter(character) ? "B1" : String(character.burstStage || "B0").split("/")[0];
  const burstIconMap = {
    B0: "0",
    B1: "1",
    B2: "2",
    B3: "3",
  };
  return `assets/icons/ui/bursts/${burstIconMap[firstStage] || "0"}.png`;
}

function getElementIcon(character) {
  const elementIconMap = {
    燃烧: "1",
    风压: "2",
    铁甲: "3",
    电击: "4",
    水冷: "5",
  };
  return `assets/icons/ui/elements/${elementIconMap[character.element] || "1"}.png`;
}

function getIconMarkup(src, label, className) {
  return `<span class="tile-icon ${className}"><img src="${escapeHtml(src)}" alt="${escapeHtml(label)}" loading="lazy" /></span>`;
}

function isSlotSettingsOpen(teamKey, index) {
  return openSlotSettings?.teamKey === teamKey && openSlotSettings.index === index;
}

function toggleSlotSettings(teamKey, index) {
  openSlotSettings = isSlotSettingsOpen(teamKey, index) ? null : { teamKey, index };
}

function getJackalLinkState(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.jackalLinks[normalizedTeamKey]) {
    state.jackalLinks[normalizedTeamKey] = { enabled: false, ownerId: null, targetIds: [] };
  }
  return state.jackalLinks[normalizedTeamKey];
}

function isLinkProvider(character) {
  return isJackal(character) || isPoli(character);
}

function getTeamLinkProvider(teamKey = state.activeTeamKey) {
  const linkState = getJackalLinkState(teamKey);
  const team = getTeamState(teamKey);
  return team.find((character) => character && isLinkProvider(character) && character.id === linkState.ownerId) || null;
}

function getDefaultTeamLinkProvider(teamKey = state.activeTeamKey) {
  return getTeamState(teamKey).find((character) => character && isLinkProvider(character)) || null;
}

function normalizeJackalLink(teamKey = state.activeTeamKey) {
  const linkState = getJackalLinkState(teamKey);
  const team = getTeamState(teamKey);
  if (linkState.enabled && !linkState.ownerId) {
    linkState.ownerId = getDefaultTeamLinkProvider(teamKey)?.id || null;
  }
  const owner = getTeamLinkProvider(teamKey);
  if (!owner) {
    linkState.enabled = false;
    linkState.ownerId = null;
    linkState.targetIds = [];
    return linkState;
  }

  const availableTargetIds = new Set(
    team
      .filter((character) => character && character.id !== owner.id)
      .map((character) => character.id),
  );
  linkState.targetIds = [...new Set(linkState.targetIds || [])].filter((id) => availableTargetIds.has(id)).slice(0, 2);
  return linkState;
}

function normalizeJackalLinks() {
  normalizeJackalLink("defense");
  normalizeJackalLink("attack");
}

function getJackalLinkTargetIds(teamKey = state.activeTeamKey) {
  return normalizeJackalLink(teamKey).targetIds;
}

function isJackalLinkEnabled(teamKey = state.activeTeamKey) {
  const linkState = normalizeJackalLink(teamKey);
  return Boolean(linkState.enabled && getTeamLinkProvider(teamKey));
}

function toggleJackalLink(teamKey, owner) {
  const linkState = normalizeJackalLink(teamKey);
  if (!owner || !isLinkProvider(owner)) return;
  const isSameOwner = linkState.enabled && linkState.ownerId === owner.id;
  linkState.enabled = !isSameOwner;
  linkState.ownerId = linkState.enabled ? owner.id : null;
  if (!linkState.enabled) linkState.targetIds = [];
  openSlotSettings = null;
  saveTeam();
  render();
}

function toggleJackalLinkTarget(teamKey, character) {
  const linkState = normalizeJackalLink(teamKey);
  if (!linkState.enabled || !character || character.id === linkState.ownerId) return;
  const targetSet = new Set(linkState.targetIds || []);
  if (targetSet.has(character.id)) {
    targetSet.delete(character.id);
  } else if (targetSet.size < 2) {
    targetSet.add(character.id);
  }
  linkState.targetIds = [...targetSet].slice(0, 2);
  openSlotSettings = null;
  saveTeam();
  render();
}

function getFilteredCharacters() {
  const keyword = state.filters.search.trim().toLowerCase();
  return CHARACTERS.filter((character) => {
    const matchesCommon = Boolean(keyword) || state.filters.common === "all" || character.isCommon;
    const matchesRegion = character.regions.includes(state.filters.region);
    const stageFilter = normalizeStageFilter(state.filters.stage);
    const matchesStage = stageFilter === "all" || getCharacterBurstStages(character).includes(stageFilter);
    const matchesSearch =
      !keyword ||
      character.name.toLowerCase().includes(keyword) ||
      character.enName.toLowerCase().includes(keyword);
    return matchesCommon && matchesRegion && matchesStage && matchesSearch;
  }).sort((a, b) => {
    const chargeDiff = getChargeValue(b) - getChargeValue(a);
    const weaponDiff = WEAPON_ORDER.indexOf(a.weapon) - WEAPON_ORDER.indexOf(b.weapon);
    return chargeDiff || weaponDiff || a.name.localeCompare(b.name, "zh-CN");
  });
}

function renderCharacters() {
  const pickedIds = new Set(getTeamState().filter(Boolean).map((character) => character.id));
  const fragment = document.createDocumentFragment();
  const characters = getFilteredCharacters();
  updateSortSummary();
  els.listCount.textContent = `${characters.length}/${CHARACTERS.length} 名角色`;

  characters.forEach((character, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `character-tile rarity-${getRarityClass(character)}${pickedIds.has(character.id) ? " is-picked" : ""}`;
    tile.setAttribute("aria-label", `加入 ${character.name}，${character.weapon}，单发 ${formatNumber(getChargeValue(character), 2)}%`);
    tile.innerHTML = `
      <span class="tile-avatar">${getAvatarMarkup(character)}</span>
      ${
        state.compactAvatarIcons
          ? ""
          : `
            ${getIconMarkup(getWeaponIcon(character), character.weapon, "weapon-icon")}
            ${getIconMarkup(getBurstIcon(character), character.burstStage, "burst-icon")}
            ${getIconMarkup(getElementIcon(character), character.element, "element-icon")}
          `
      }
      <span class="tile-charge">${formatNumber(getChargeValue(character), 1)}</span>
      <span class="tile-check" aria-hidden="true">✓</span>
    `;
    tile.addEventListener("mouseenter", () => showCharacterTooltip(character, index, tile));
    tile.addEventListener("mousemove", () => positionCharacterTooltip(tile));
    tile.addEventListener("mouseleave", hideCharacterTooltip);
    tile.addEventListener("focus", () => showCharacterTooltip(character, index, tile));
    tile.addEventListener("blur", hideCharacterTooltip);
    tile.addEventListener("click", () => toggleCharacter(character));
    tile.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      copyCharacterDetails(character);
      hideCharacterTooltip();
    });
    fragment.append(tile);
  });

  els.characterGrid.replaceChildren(fragment);
}

function renderSingleTeamLegacy() {
  const fragment = document.createDocumentFragment();
  const result = simulateBurst(state.team, "attack");
  const finishingPositions = new Set(result && !result.error ? result.finishingPositionIndices : []);

  state.team.forEach((character, index) => {
    const isFinisher = finishingPositions.has(index) && canShowFinishMarker(character);
    const slot = document.createElement("div");
    slot.className = `team-slot${character ? " filled" : ""}${getTeamSlotRarityClass(character)}${isFinisher ? " is-finisher" : ""}`;
    slot.dataset.slotIndex = index;
    slot.draggable = Boolean(character);
    slot.innerHTML = character
      ? `
        <button class="slot-remove" type="button" aria-label="移除 ${escapeHtml(character.name)}">
          <span class="position">P${index + 1}</span>
          <span class="team-avatar">${getAvatarMarkup(character)}</span>
          <span class="slot-copy" aria-hidden="true">
            ${isFinisher ? '<span class="finish-mark">定</span>' : ""}
          </span>
        </button>
        <label class="speed-control">
          <span>蓄</span>
          <input type="number" min="0" max="100" step="1" value="${Number(state.chargeSpeeds[index]) || 0}" data-speed-index="${index}" />
          <span>%</span>
        </label>
      `
      : `
        <div class="slot-empty">
          <span class="position">P${index + 1}</span>
          <span class="team-avatar empty-avatar">+</span>
        </div>
      `;

    slot.addEventListener("dragstart", (event) => {
      if (!character || event.target.closest(".speed-control")) {
        event.preventDefault();
        return;
      }
      draggedTeamIndex = index;
      slot.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));
      setTeamSlotDragImage(event, slot);
    });

    slot.addEventListener("dragend", () => {
      draggedTeamIndex = null;
      els.teamSlots.querySelectorAll(".team-slot").forEach((teamSlot) => {
        teamSlot.classList.remove("is-dragging", "is-drop-target");
      });
    });

    slot.addEventListener("dragover", (event) => {
      if (draggedTeamIndex === null || draggedTeamIndex === index) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      slot.classList.add("is-drop-target");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("is-drop-target");
    });

    slot.addEventListener("drop", (event) => {
      event.preventDefault();
      const sourceIndex = Number(event.dataTransfer.getData("text/plain") || draggedTeamIndex);
      slot.classList.remove("is-drop-target");
      moveTeamSlot(sourceIndex, index);
    });

    if (character) {
      slot.querySelector(".slot-remove").addEventListener("click", () => removeCharacter(index));
      const speedControl = slot.querySelector(".speed-control");
      speedControl.addEventListener("pointerdown", (event) => event.stopPropagation());
      speedControl.addEventListener("mousedown", (event) => event.stopPropagation());
      speedControl.addEventListener("dragstart", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      const speedInput = slot.querySelector("[data-speed-index]");
      speedInput.addEventListener("pointerdown", (event) => event.stopPropagation());
      speedInput.addEventListener("dragstart", (event) => event.stopPropagation());
      speedInput.addEventListener("input", (event) => {
        state.chargeSpeeds[index] = Math.max(0, Number(event.target.value) || 0);
        saveTeam();
        invalidateBattleResults();
        updateTeamFinishMarkers(renderResults());
        refreshBattleResults();
      });
    }
    fragment.append(slot);
  });

  els.teamSlots.replaceChildren(fragment);
}

function createSlotSettingsModal() {
  if (!openSlotSettings) return null;

  const teamKey = normalizeTeamKey(openSlotSettings.teamKey);
  const index = Number(openSlotSettings.index);
  const team = getTeamState(teamKey);
  const character = team[index];
  if (!character) {
    openSlotSettings = null;
    return null;
  }

  const chargeSpeeds = getChargeSpeedState(teamKey);
  const chargeSpeedValue = sanitizeChargeSpeed(chargeSpeeds[index]);
  const canEditChargeSpeed = canShowFinishMarker(character);
  const chargeSpeedPreviewFrame = getChargeSpeedPreviewFrame(character, index, teamKey, chargeSpeedValue);
  const quantumCubeEnabled = getSavedCharacterQuantumCube(character, teamKey);
  const backdrop = document.createElement("div");
  backdrop.className = "slot-settings-backdrop";
  backdrop.setAttribute("role", "presentation");
  backdrop.innerHTML = `
    <section class="slot-settings-modal" role="dialog" aria-modal="true" aria-label="设置 ${escapeHtml(character.name)}">
      <div class="slot-settings-modal-head">
        <div>
          <span class="slot-settings-team">${escapeHtml(TEAM_LABELS[teamKey])} P${index + 1}</span>
          <strong>${escapeHtml(character.name)}</strong>
        </div>
        <button class="slot-settings-close" type="button" aria-label="关闭设置">X</button>
      </div>
      ${
        canEditChargeSpeed
          ? `
            <label class="settings-field">
        <span>蓄速</span>
        <input class="slot-settings-input" type="number" min="0" max="100" step="1" value="${chargeSpeedValue}" />
        <span>%</span>
        <span class="slot-settings-frame-preview">${formatFrameCount(chargeSpeedPreviewFrame)}F</span>
            </label>
          `
          : ""
      }
      <label class="settings-check-field">
        <img class="settings-check-icon" src="assets/icons/ui/cubes/quantum-24x24.webp" alt="" aria-hidden="true" />
        <span>启用量子遗迹魔方</span>
        <input class="slot-settings-quantum-cube" type="checkbox"${quantumCubeEnabled ? " checked" : ""} />
      </label>
      <button class="slot-settings-reset" type="button">重置默认</button>
    </section>
  `;

  backdrop.addEventListener("click", (event) => {
    if (event.target !== backdrop) return;
    openSlotSettings = null;
    render();
  });

  const modal = backdrop.querySelector(".slot-settings-modal");
  modal.addEventListener("click", (event) => event.stopPropagation());
  modal.addEventListener("pointerdown", (event) => event.stopPropagation());
  modal.addEventListener("mousedown", (event) => event.stopPropagation());
  modal.addEventListener("dragstart", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  backdrop.querySelector(".slot-settings-close").addEventListener("click", (event) => {
    event.preventDefault();
    openSlotSettings = null;
    render();
  });

  const speedInput = backdrop.querySelector(".slot-settings-input");
  if (speedInput) {
    const speedFramePreview = backdrop.querySelector(".slot-settings-frame-preview");
    const updateSpeedFramePreview = () => {
      if (!speedFramePreview) return;
      const frame = getChargeSpeedPreviewFrame(character, index, teamKey, speedInput.value);
      speedFramePreview.textContent = `${formatFrameCount(frame)}F`;
    };
    speedInput.addEventListener("pointerdown", (event) => event.stopPropagation());
    speedInput.addEventListener("focus", (event) => event.target.select());
    speedInput.addEventListener("click", (event) => event.target.select());
    speedInput.addEventListener("dragstart", (event) => event.stopPropagation());
    speedInput.addEventListener("input", (event) => {
      chargeSpeeds[index] = sanitizeChargeSpeed(event.target.value);
      saveCharacterChargeSpeed(character, chargeSpeeds[index], teamKey);
      updateSpeedFramePreview();
      saveTeam();
      invalidateBattleResults();
      updateTeamFinishMarkers(renderResults());
      refreshBattleResults();
    });
  }

  const quantumCubeInput = backdrop.querySelector(".slot-settings-quantum-cube");
  quantumCubeInput.addEventListener("change", (event) => {
    saveCharacterQuantumCube(character, event.target.checked, teamKey);
    saveTeam();
    render();
  });

  backdrop.querySelector(".slot-settings-reset").addEventListener("click", (event) => {
    event.preventDefault();
    chargeSpeeds[index] = 0;
    resetCharacterChargeSpeed(character, teamKey);
    resetCharacterQuantumCube(character, teamKey);
    saveTeam();
    render();
  });

  return backdrop;
}

function closeHelpModal() {
  isHelpModalOpen = false;
  document.querySelector(".help-modal-backdrop")?.remove();
}

function createHelpModal() {
  if (!isHelpModalOpen) return null;
  const sections = [
    {
      title: "充能轴",
      items: [
        "上方图表展示双方队伍的关键充能帧、标准 RL 轴、爆裂节点、换弹、晕眩等时间点。",
        "鼠标在图表内移动时，会自动显示距离最近的关键帧详情，并用辅助线标记对应角色和帧数。",
      ],
    },
    {
      title: "队伍槽位",
      items: [
        "上排为防守队，下排为进攻队；点击任意队伍会切换当前操作队伍。",
        "空槽可填写“充”作为万能充能值；再次选择角色会直接覆盖该槽位并清零万能充能。",
        "角色头像可拖拽换位；右键任意队伍头像可复制双方队伍的充能完成信息。",
      ],
    },
    {
      title: "角色设置",
      items: [
        "点击头像右上角齿轮，可设置蓄力速度、量子遗迹魔方等角色专属参数。",
        "蓄速、量子魔方按进攻/防守分别保存；切换方案时会沿用该角色在对应队伍侧的保存值。",
      ],
    },
    {
      title: "链接与特殊轴",
      items: [
        "豺狼、波莉可开启链接；豺狼链接会产生充能，波莉链接只影响共同受击与红莲反击。",
        "红莲在可被攻击时会显示反击充能轴；罗珊娜、小美人鱼等特殊时间点会显示在标准轴上。",
        "被罗珊娜消除链接后，后续共同受击效果不再生效。",
      ],
    },
    {
      title: "角色选择",
      items: [
        "搜索会在当前服务器和常用筛选范围内查找角色；常用、国服、简洁开关会本地保存。",
        "角色默认按最终单发充能效率从高到低排序；再次点击已选角色会从当前队伍中移除。",
        "右键角色卡可复制该角色当前显示的详细充能信息。",
      ],
    },
    {
      title: "方案与操作",
      items: [
        "下方 1-10 按钮用于保存不同攻防队伍方案。",
        "复制按钮会复制当前防守与进攻队的完成帧信息；切换按钮会互换攻防角色，但蓄速等参数使用角色在对应队伍侧保存的数据。",
        "清空按钮会同时清空防守队和进攻队。",
      ],
    },
  ];
  const backdrop = document.createElement("div");
  backdrop.className = "help-modal-backdrop";
  backdrop.innerHTML = `
    <section class="help-modal" role="dialog" aria-modal="true" aria-label="页面说明">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Help</span>
          <strong>页面说明</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="关闭说明">X</button>
      </div>
      <div class="help-modal-content">
        ${sections
          .map(
            (section) => `
              <article class="help-section">
                <h2>${escapeHtml(section.title)}</h2>
                <ul>
                  ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
  const modal = backdrop.querySelector(".help-modal");
  modal.addEventListener("click", (event) => event.stopPropagation());
  backdrop.addEventListener("click", closeHelpModal);
  backdrop.querySelector(".help-modal-close").addEventListener("click", (event) => {
    event.preventDefault();
    closeHelpModal();
  });
  return backdrop;
}

function openHelpModal() {
  isHelpModalOpen = true;
  document.querySelector(".help-modal-backdrop")?.remove();
  const modal = createHelpModal();
  if (modal) document.body.append(modal);
}

function getLineupSlotCount(slot) {
  return [
    ...(slot.defenseTeam || []).filter(Boolean),
    ...(slot.team || []).filter(Boolean),
    ...(slot.defenseUniversalCharges || []).filter((charge) => sanitizeUniversalCharge(charge) > 0),
    ...(slot.universalCharges || []).filter((charge) => sanitizeUniversalCharge(charge) > 0),
  ].length;
}

function renderLineupSlots() {
  if (!els.lineupSlots) return;
  const fragment = document.createDocumentFragment();
  state.lineupSlots.forEach((slot, index) => {
    const count = getLineupSlotCount(slot);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lineup-slot-button${index === state.activeLineupIndex ? " is-active" : ""}${count ? " has-lineup" : ""}`;
    button.dataset.lineupIndex = index;
    button.textContent = String(index + 1);
    button.title = `方案 ${index + 1}${count ? ` · ${count}/10` : " · 空"}`;
    fragment.append(button);
  });
  els.lineupSlots.replaceChildren(fragment);
}

function renderTeam(battleResults = getBattleResultsSnapshot()) {
  const fragment = document.createDocumentFragment();
  const { attackResult, defenseResult } = battleResults;
  const resultsByTeam = new Map([
    ["defense", defenseResult],
    ["attack", attackResult],
  ]);

  ["defense", "attack"].forEach((teamKey) => {
    const team = getTeamState(teamKey);
    const chargeSpeeds = getChargeSpeedState(teamKey);
    const universalCharges = getUniversalChargeState(teamKey);
    const redHoodPierceCounts = getRedHoodPierceCountState(teamKey);
    const scarletCounterEnabled = getScarletCounterEnabledState(teamKey);
    const row = document.createElement("section");
    row.className = `team-row${state.activeTeamKey === teamKey ? " is-active" : ""}`;
    row.dataset.teamKey = teamKey;
    row.setAttribute("aria-label", TEAM_LABELS[teamKey]);
    row.innerHTML = '<div class="team-slots-row"></div>';
    row.addEventListener("click", () => {
      const wasActive = state.activeTeamKey === teamKey;
      setActiveTeam(teamKey);
      if (!wasActive) render();
    });

    const slotsRow = row.querySelector(".team-slots-row");
    const jackalLinkState = normalizeJackalLink(teamKey);
    const isJackalConnecting = isJackalLinkEnabled(teamKey);
    const jackalTargetIds = new Set(jackalLinkState.targetIds);
    const linkOwner = getTeamLinkProvider(teamKey);
    const linkOwnerName = linkOwner ? (isJackal(linkOwner) ? "豺狼链接" : "波莉链接") : "链接";
    team.forEach((character, index) => {
      const teamResult = resultsByTeam.get(teamKey);
      const finishingPositions = new Set(teamResult && !teamResult.error ? teamResult.finishingPositionIndices : []);
      const isFinisher = finishingPositions.has(index) && canShowFinishMarker(character);
      const isSettingsOpen = character && isSlotSettingsOpen(teamKey, index);
      const chargeSpeedValue = sanitizeChargeSpeed(chargeSpeeds[index]);
      const universalChargeValue = sanitizeUniversalCharge(universalCharges[index]);
      const displayMagazine = character ? getDisplayMagazine(character, teamKey) : null;
      const redHoodPierceCount = character && isRedHood(character) ? sanitizeRedHoodPierceCount(redHoodPierceCounts[index]) : 0;
      const isScarletCounterEnabled = character && isScarlet(character) ? sanitizeScarletCounterEnabled(scarletCounterEnabled[index]) : false;
      const sideBadgeText =
        character && canShowFinishMarker(character) && chargeSpeedValue > 0
          ? `${chargeSpeedValue}%`
          : displayMagazine
            ? String(displayMagazine)
            : "";
      const hasQuantumCube = character && getSavedCharacterQuantumCube(character, teamKey);
      const isJackalOwner = character && isLinkProvider(character);
      const isActiveLinkOwner = character && isJackalConnecting && jackalLinkState.ownerId === character.id;
      const isJackalTarget = character && jackalTargetIds.has(character.id);
      const canSelectJackalTarget =
        character && character.id !== jackalLinkState.ownerId && isJackalConnecting && (isJackalTarget || jackalTargetIds.size < 2);
      const slot = document.createElement("div");
      slot.className = `team-slot${character ? " filled" : ""}${getTeamSlotRarityClass(character)}${!character && universalChargeValue > 0 ? " has-universal" : ""}${isFinisher ? " is-finisher" : ""}`;
      slot.dataset.slotIndex = index;
      slot.dataset.teamKey = teamKey;
      slot.draggable = Boolean(character);
      slot.innerHTML = character
        ? `
          <button class="slot-remove" type="button" aria-label="移除 ${escapeHtml(character.name)}">
            <span class="team-avatar">${getAvatarMarkup(character)}</span>
            <span class="slot-copy" aria-hidden="true">
              ${isFinisher ? '<span class="finish-mark">定</span>' : ""}
              ${hasQuantumCube ? '<span class="slot-cube-badge"><img src="assets/icons/ui/cubes/quantum-24x24.webp" alt="" /></span>' : ""}
              ${sideBadgeText ? `<span class="slot-speed-badge">${sideBadgeText}</span>` : ""}
            </span>
          </button>
          <button class="slot-settings-toggle${isSettingsOpen ? " is-open" : ""}" type="button" aria-label="设置 ${escapeHtml(character.name)}" title="设置">
            <img src="assets/icons/ui/settings.svg" alt="" aria-hidden="true" />
          </button>
          ${
            isRedHood(character)
              ? `
                <button class="slot-pierce-count${redHoodPierceCount > 0 ? " is-active" : ""}" type="button" data-pierce-count="${redHoodPierceCount}" aria-label="设置 ${escapeHtml(character.name)} 穿透次数：${redHoodPierceCount}" title="穿透次数 ${redHoodPierceCount}">
                  <img class="slot-pierce-icon" src="assets/icons/ui/pierce.svg" alt="" aria-hidden="true" />
                  ${redHoodPierceCount > 0 ? `<span class="slot-pierce-value">${redHoodPierceCount}</span>` : ""}
                </button>
              `
              : ""
          }
          ${
            isScarlet(character)
              ? `
                <button class="slot-counter-toggle${isScarletCounterEnabled ? " is-active" : ""}" type="button" aria-label="${isScarletCounterEnabled ? "关闭" : "开启"} ${escapeHtml(character.name)} 反击" title="红莲反击：${isScarletCounterEnabled ? "开启" : "关闭"}">
                  <img src="assets/icons/ui/pierce.svg" alt="" aria-hidden="true" />
                </button>
              `
              : ""
          }
          ${
            isJackalOwner
              ? `
                <button class="slot-link-toggle${isActiveLinkOwner ? " is-active" : ""}" type="button" aria-label="${isActiveLinkOwner ? "关闭" : "开启"}${isJackal(character) ? "豺狼链接" : "波莉链接"}" title="${isJackal(character) ? "豺狼链接" : "波莉链接"}">
                  <img src="assets/icons/ui/link.svg" alt="" aria-hidden="true" />
                </button>
              `
              : ""
          }
          ${
            canSelectJackalTarget
              ? `
                <button class="slot-link-target${isJackalTarget ? " is-selected" : ""}" type="button" aria-label="${isJackalTarget ? "取消" : "选择"}${linkOwnerName}目标 ${escapeHtml(character.name)}" title="${isJackalTarget ? "取消链接" : "链接目标"}">
                  ${isJackalTarget ? '<img src="assets/icons/ui/link.svg" alt="" aria-hidden="true" />' : '<span>+</span>'}
                </button>
              `
              : ""
          }
        `
        : `
          <div class="slot-empty">
            <span class="position">P${index + 1}</span>
            <label class="universal-charge-field" aria-label="P${index + 1}充能值">
              <span class="universal-charge-label">充</span>
              <input type="text" inputmode="decimal" value="${universalChargeValue || ""}" placeholder="0" data-universal-index="${index}" />
            </label>
          </div>
        `;

      slot.addEventListener("click", () => {
        if (state.activeTeamKey !== teamKey) {
          setActiveTeam(teamKey);
          render();
        }
      });

      slot.addEventListener("dragstart", (event) => {
        if (!character || isTeamSlotDragControl(event.target)) {
          event.preventDefault();
          return;
        }
        draggedTeamIndex = index;
        draggedTeamKey = teamKey;
        slot.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", `${teamKey}:${index}`);
        setTeamSlotDragImage(event, slot);
      });

      slot.addEventListener("dragend", () => {
        draggedTeamIndex = null;
        draggedTeamKey = null;
        els.teamSlots.querySelectorAll(".team-slot").forEach((teamSlot) => {
          teamSlot.classList.remove("is-dragging", "is-drop-target");
        });
      });

      slot.addEventListener("dragover", (event) => {
        if (draggedTeamIndex === null || (draggedTeamKey === teamKey && draggedTeamIndex === index)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        slot.classList.add("is-drop-target");
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("is-drop-target");
      });

      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        const [sourceTeamKey, sourceIndexText] = String(event.dataTransfer.getData("text/plain") || `${draggedTeamKey}:${draggedTeamIndex}`).split(":");
        slot.classList.remove("is-drop-target");
        moveTeamSlot(sourceTeamKey, Number(sourceIndexText), teamKey, index);
      });

      slot.addEventListener("pointerdown", (event) => handleTeamSlotPointerDown(event, slot, character, teamKey, index));
      slot.addEventListener("pointermove", handleTeamSlotPointerMove);
      slot.addEventListener("pointerup", finishPointerTeamDrag);
      slot.addEventListener("pointercancel", finishPointerTeamDrag);

      if (character) {
        slot.querySelector(".slot-remove").addEventListener("click", (event) => {
          event.stopPropagation();
          if (suppressTeamSlotClick) {
            event.preventDefault();
            return;
          }
          setActiveTeam(teamKey);
          removeCharacter(teamKey, index);
        });
        slot.querySelector(".slot-remove").addEventListener("contextmenu", (event) => {
          event.preventDefault();
          event.stopPropagation();
          copyBattleResultsSummary();
        });
        const settingsToggle = slot.querySelector(".slot-settings-toggle");
        settingsToggle.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          setActiveTeam(teamKey);
          toggleSlotSettings(teamKey, index);
          render();
        });
        settingsToggle.addEventListener("pointerdown", (event) => event.stopPropagation());
        settingsToggle.addEventListener("dragstart", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        const pierceToggle = slot.querySelector(".slot-pierce-count");
        if (pierceToggle) {
          pierceToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setActiveTeam(teamKey);
            const pierceCounts = getRedHoodPierceCountState(teamKey);
            pierceCounts[index] = (sanitizeRedHoodPierceCount(pierceCounts[index]) + 1) % 3;
            saveCharacterRedHoodPierceCount(character, pierceCounts[index], teamKey);
            saveTeam();
            render();
          });
          pierceToggle.addEventListener("pointerdown", (event) => event.stopPropagation());
          pierceToggle.addEventListener("dragstart", (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
        }
        const counterToggle = slot.querySelector(".slot-counter-toggle");
        if (counterToggle) {
          counterToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setActiveTeam(teamKey);
            const counterEnabled = getScarletCounterEnabledState(teamKey);
            counterEnabled[index] = !sanitizeScarletCounterEnabled(counterEnabled[index]);
            saveTeam();
            render();
          });
          counterToggle.addEventListener("pointerdown", (event) => event.stopPropagation());
          counterToggle.addEventListener("dragstart", (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
        }
        const linkToggle = slot.querySelector(".slot-link-toggle");
        if (linkToggle) {
          linkToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setActiveTeam(teamKey);
            toggleJackalLink(teamKey, character);
          });
          linkToggle.addEventListener("pointerdown", (event) => event.stopPropagation());
          linkToggle.addEventListener("dragstart", (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
        }
        const linkTarget = slot.querySelector(".slot-link-target");
        if (linkTarget) {
          linkTarget.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setActiveTeam(teamKey);
            toggleJackalLinkTarget(teamKey, character);
          });
          linkTarget.addEventListener("pointerdown", (event) => event.stopPropagation());
          linkTarget.addEventListener("dragstart", (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
        }
      } else {
        const universalInput = slot.querySelector("[data-universal-index]");
        universalInput.addEventListener("click", (event) => event.stopPropagation());
        universalInput.addEventListener("focus", (event) => event.target.select());
        universalInput.addEventListener("input", (event) => {
          setActiveTeam(teamKey);
          const value = sanitizeUniversalCharge(event.target.value);
          universalCharges[index] = value;
          slot.classList.toggle("has-universal", value > 0);
          saveTeam();
          invalidateBattleResults();
          renderResults();
          updateTeamFinishMarkers();
          renderLineupSlots();
          refreshBattleResults();
        });
      }
      slotsRow.append(slot);
    });

    fragment.append(row);
  });

  const settingsModal = createSlotSettingsModal();
  if (settingsModal) fragment.append(settingsModal);

  els.teamSlots.replaceChildren(fragment);
}

function updateTeamFinishMarkers(result = null, defenseResult = null) {
  if (!result || !defenseResult) {
    const battleResults = getBattleResultsSnapshot();
    result = battleResults.attackResult;
    defenseResult = battleResults.defenseResult;
  }
  const finishingPositionsByTeam = new Map([
    ["defense", new Set(defenseResult && !defenseResult.error ? defenseResult.finishingPositionIndices : [])],
    ["attack", new Set(result && !result.error ? result.finishingPositionIndices : [])],
  ]);

  els.teamSlots.querySelectorAll(".team-slot").forEach((slot) => {
    const teamKey = slot.dataset.teamKey || "attack";
    const index = Number(slot.dataset.slotIndex);
    const finishingPositions = finishingPositionsByTeam.get(teamKey) || new Set();
    const character = getTeamState(teamKey)[index];
    const isFinisher = finishingPositions.has(index) && canShowFinishMarker(character);
    slot.classList.toggle("is-finisher", isFinisher);

    const slotCopy = slot.querySelector(".slot-copy");
    if (!slotCopy) return;

    const existingMark = slotCopy.querySelector(".finish-mark");
    if (isFinisher && !existingMark) {
      const mark = document.createElement("span");
      mark.className = "finish-mark";
      mark.textContent = "定";
      slotCopy.append(mark);
      return;
    }

    if (!isFinisher && existingMark) {
      existingMark.remove();
    }
  });
}

function getHitFrameValue(frame) {
  return Number.parseInt(String(frame).split("×")[0], 10);
}

function formatTooltipLines(lines) {
  return escapeHtml(lines.join("\n"));
}

function formatContributionSourceLabels(labels = []) {
  const normalizedLabels = labels.map((label) => (String(label).startsWith("命中：") ? "命中" : label)).filter(Boolean);
  return [...new Set(normalizedLabels)].join(" + ");
}

function getContributionLabelHitCount(labels = []) {
  const hitLabel = labels.find((label) => String(label).startsWith("命中："));
  const match = String(hitLabel || "").match(/命中：([\d.]+)\s*hit/);
  return match ? Number(match[1]) : null;
}

function formatContributionTargetHits(positionHits = [], labels = []) {
  if (!Array.isArray(positionHits) || positionHits.length === 0) return null;
  const visiblePositionHits = positionHits.filter((positionHit) => Number(positionHit.hitCount) > 0);
  const rawHitTotal = visiblePositionHits.reduce((sum, positionHit) => sum + Number(positionHit.hitCount), 0);
  const labelHitTotal = getContributionLabelHitCount(labels);
  const displayMultiplier =
    Number.isFinite(labelHitTotal) && rawHitTotal > 0 && labelHitTotal > rawHitTotal ? labelHitTotal / rawHitTotal : 1;
  const targets = visiblePositionHits
    .sort((a, b) => a.positionIndex - b.positionIndex)
    .map((positionHit) => `P${positionHit.positionIndex + 1} (${formatNumber(Number(positionHit.hitCount) * displayMultiplier, 2)} hit)`);
  return targets.length ? `命中目标：${targets.join(", ")}` : null;
}

function isScarlet(character) {
  return character?.name === "红莲" || character?.slug === "红莲";
}

function isJackal(character) {
  return character?.name === "豺狼" || character?.slug === "豺狼";
}

function isPoli(character) {
  return character?.name === "波莉" || character?.slug === "波莉" || character?.name === "波莉 珍藏" || character?.slug === "波莉-珍藏";
}

function isRosanna(character) {
  return character?.name === "罗珊娜" || character?.slug === "罗珊娜";
}

function resultHasRosanna(result) {
  return Boolean(result && !result.error && result.members.some((member) => isRosanna(member.character)));
}

function isLittleMermaid(character) {
  return character?.name === "小美人鱼" || character?.slug === "小美人鱼";
}

function resultHasLittleMermaid(result) {
  return Boolean(result && !result.error && result.members.some((member) => isLittleMermaid(member.character)));
}

function teamHasLittleMermaid(team = []) {
  return team.some((character) => isLittleMermaid(character));
}

function getStunWindowsForTeam(teamKey = "attack") {
  const opponentTeam = normalizeTeamKey(teamKey) === "attack" ? state.defenseTeam : state.team;
  if (!teamHasLittleMermaid(opponentTeam)) return [];
  return [
    {
      source: "小美人鱼",
      label: "小美人鱼晕眩",
      positionIndex: LITTLE_MERMAID_STUN_TARGET_INDEX,
      startFrame: LITTLE_MERMAID_STUN_FRAME,
      endFrame: LITTLE_MERMAID_STUN_FRAME + LITTLE_MERMAID_STUN_DURATION_FRAMES,
    },
  ];
}

function getCounterTriggerCount(entry) {
  const count = entry.contributions.reduce((sum, contribution) => {
    if (Number.isFinite(contribution.counterHits)) {
      return sum + Math.max(contribution.counterHits, 0);
    }
    const labelCount = contribution.labels.reduce((labelSum, label) => {
      const match = String(label).match(/(\d+)\s*发|[x×]\s*(\d+)/i);
      return labelSum + (match ? Number(match[1] || match[2]) || 1 : 1);
    }, 0);
    return sum + Math.max(labelCount, 1);
  }, 0);
  return Math.max(count, 0);
}

function getJackalLinkedPositionIndices(result) {
  if (!result || result.error) return [];
  const linkState = normalizeJackalLink(result.teamKey);
  if (!linkState.enabled || !linkState.ownerId) return [];
  const targetIds = new Set(getJackalLinkTargetIds(result.teamKey));
  const linkedPositions = result.members
    .filter((member) => member.character.id === linkState.ownerId || targetIds.has(member.character.id))
    .map((member) => member.positionIndex);
  return [...new Set(linkedPositions)].sort((a, b) => a - b);
}

function getJackalLinkedHitCount(entry, linkedPositionIndices) {
  const linkedPositions = new Set(linkedPositionIndices);
  if (linkedPositions.size === 0) return 0;
  return entry.contributions.reduce((sum, contribution) => {
    if (!Array.isArray(contribution.positionHits)) return sum;
    return (
      sum +
      contribution.positionHits.reduce(
        (positionSum, positionHit) => positionSum + (linkedPositions.has(positionHit.positionIndex) ? positionHit.hitCount : 0),
        0,
      )
    );
  }, 0);
}

function getPositionHitCount(entry, positionIndex) {
  return entry.contributions.reduce((sum, contribution) => {
    if (!Array.isArray(contribution.positionHits)) return sum;
    return (
      sum +
      contribution.positionHits.reduce(
        (positionSum, positionHit) => positionSum + (positionHit.positionIndex === positionIndex ? positionHit.hitCount : 0),
        0,
      )
    );
  }, 0);
}

function isLinkSuppressedByRosanna(opponentResult, frame) {
  return frame >= ROSANNA_BUFF_REMOVE_FRAME && resultHasRosanna(opponentResult);
}

function getScarletCounterTriggerCount(result, member, entry, opponentResult = null) {
  const linkedPositionIndices = getJackalLinkedPositionIndices(result);
  if (linkedPositionIndices.includes(member.positionIndex)) {
    if (isLinkSuppressedByRosanna(opponentResult, entry.frame)) {
      return getPositionHitCount(entry, member.positionIndex);
    }
    return getJackalLinkedHitCount(entry, linkedPositionIndices);
  }
  return getPositionHitCount(entry, member.positionIndex);
}

function getScarletCounterGroups(chartResults, visibleTimelineByTeam) {
  return chartResults.flatMap((item) => {
    const opponentTeamKey = item.teamKey === "defense" ? "attack" : "defense";
    const opponentTimeline = visibleTimelineByTeam.get(opponentTeamKey) || [];
    if (opponentTimeline.length === 0) return [];

    return item.result.members
      .filter((member) => isScarlet(member.character) && member.character.scarletCounterEnabled !== false)
      .map((member) => {
        const chargePerCounter = getChargeValue(member.character) * SCARLET_COUNTER_PROBABILITY;
        let cumulativeCharge = 0;
        const timeline = opponentTimeline
          .map((entry) => {
            const opponentResult = chartResults.find((resultItem) => resultItem.teamKey === opponentTeamKey)?.result || null;
            const triggerCount = getScarletCounterTriggerCount(item.result, member, entry, opponentResult);
            const charge = chargePerCounter * triggerCount;
            if (charge <= BURST_EPSILON) return null;
            cumulativeCharge += charge;
            return {
              frame: entry.frame,
              triggerCount,
              charge,
              cumulativeCharge,
            };
          })
          .filter(Boolean);

        return {
          teamKey: item.teamKey,
          groupKey: `${item.teamKey}-scarlet-counter-${member.positionIndex}`,
          label: "红莲反击",
          type: "scarletCounter",
          member,
          chargePerCounter,
          timeline,
        };
      })
      .filter((group) => group.timeline.length > 0);
  });
}

function getJackalLinkGroups(chartResults, visibleTimelineByTeam) {
  return chartResults.flatMap((item) => {
    const opponentTeamKey = item.teamKey === "defense" ? "attack" : "defense";
    const opponentTimeline = visibleTimelineByTeam.get(opponentTeamKey) || [];
    const linkOwner = getTeamLinkProvider(item.teamKey);
    const linkedPositionIndices = getJackalLinkedPositionIndices(item.result);
    if (!isJackal(linkOwner) || linkedPositionIndices.length === 0 || opponentTimeline.length === 0) return [];

    return item.result.members
      .filter((member) => member.character.id === linkOwner.id)
      .map((member) => {
        const chargePerLink = getEffectiveBurstGen(member.character);
        let accumulatedHits = 0;
        let triggeredLinks = 0;
        let cumulativeCharge = 0;
        const timeline = opponentTimeline
          .map((entry) => {
            const hitCount = isLinkSuppressedByRosanna(
              chartResults.find((resultItem) => resultItem.teamKey === opponentTeamKey)?.result || null,
              entry.frame,
            )
              ? getPositionHitCount(entry, member.positionIndex)
              : getJackalLinkedHitCount(entry, linkedPositionIndices);
            accumulatedHits += hitCount;
            const nextTriggeredLinks = Math.floor(accumulatedHits / JACKAL_LINK_HIT_THRESHOLD);
            const triggerCount = nextTriggeredLinks - triggeredLinks;
            if (triggerCount <= 0) return null;
            triggeredLinks = nextTriggeredLinks;
            const charge = chargePerLink * triggerCount;
            cumulativeCharge += charge;
            return {
              frame: entry.frame,
              hitCount,
              accumulatedHits,
              triggerCount,
              charge,
              cumulativeCharge,
            };
          })
          .filter(Boolean);

        return {
          teamKey: item.teamKey,
          groupKey: `${item.teamKey}-jackal-link-${member.positionIndex}`,
          label: "豺狼链接",
          type: "jackalLink",
          member,
          chargePerLink,
          timeline,
        };
      })
      .filter((group) => group.timeline.length > 0);
  });
}

function getSpecialChargeTooltipLines(group, entry) {
  if (group.type === "jackalLink") {
    return [
      group.label,
      `时间：${entry.frame} F`,
      `受击累计：${entry.accumulatedHits} hit`,
      `连接触发：${entry.triggerCount} × ${formatNumber(group.chargePerLink, 2)}% = ${formatNumber(entry.charge, 2)}%`,
      `累计充能：${formatNumber(entry.cumulativeCharge, 2)}%`,
    ];
  }

  return [
    group.label,
    `时间：${entry.frame} F`,
    `期望反击：${entry.triggerCount} × ${formatNumber(group.chargePerCounter, 3)}% = ${formatNumber(entry.charge, 3)}%`,
    `累计充能：${formatNumber(entry.cumulativeCharge, 3)}%`,
  ];
}

function getSpecialChargeEventsForTeam(targetResult, opponentResult) {
  if (!targetResult || targetResult.error || !opponentResult || opponentResult.error) return [];
  const opponentTimeline = opponentResult.timeline || [];
  if (opponentTimeline.length === 0) return [];
  const events = [];

  targetResult.members.forEach((member) => {
    if (isScarlet(member.character) && member.character.scarletCounterEnabled !== false) {
      const chargePerCounter = getChargeValue(member.character) * SCARLET_COUNTER_PROBABILITY;
      opponentTimeline.forEach((entry) => {
        const triggerCount = getScarletCounterTriggerCount(targetResult, member, entry, opponentResult);
        if (triggerCount <= 0) return;
        events.push({
          frame: entry.frame,
          positionIndex: member.positionIndex,
          chargeValue: chargePerCounter * triggerCount,
          label: "红莲反击",
        });
      });
    }

    const linkOwner = getTeamLinkProvider(targetResult.teamKey);
    if (isJackal(member.character) && linkOwner?.id === member.character.id) {
      const linkedPositionIndices = getJackalLinkedPositionIndices(targetResult);
      if (linkedPositionIndices.length === 0) return;
      const chargePerLink = getEffectiveBurstGen(member.character);
      let accumulatedHits = 0;
      let triggeredLinks = 0;
      opponentTimeline.forEach((entry) => {
        const hitCount = isLinkSuppressedByRosanna(opponentResult, entry.frame)
          ? getPositionHitCount(entry, member.positionIndex)
          : getJackalLinkedHitCount(entry, linkedPositionIndices);
        accumulatedHits += hitCount;
        const nextTriggeredLinks = Math.floor(accumulatedHits / JACKAL_LINK_HIT_THRESHOLD);
        const triggerCount = nextTriggeredLinks - triggeredLinks;
        if (triggerCount <= 0) return;
        triggeredLinks = nextTriggeredLinks;
        events.push({
          frame: entry.frame,
          positionIndex: member.positionIndex,
          chargeValue: chargePerLink * triggerCount,
          label: "豺狼链接",
        });
      });
    }
  });

  return events.sort((a, b) => a.frame - b.frame || a.positionIndex - b.positionIndex);
}

function getResultSignature(result) {
  if (!result) return "empty";
  if (result.error) return `error:${result.error}`;
  return `${result.fullFrame}:${result.finishingPositionIndices.join(",")}:${result.timeline.length}:${result.totalCharge.toFixed(3)}`;
}

function computeBattleResults() {
  const attackStunWindows = getStunWindowsForTeam("attack");
  const defenseStunWindows = getStunWindowsForTeam("defense");
  let attackResult = simulateBurst(state.team, "attack", [], [], attackStunWindows);
  let defenseResult = simulateBurst(state.defenseTeam, "defense", [], [], defenseStunWindows);

  for (let index = 0; index < 8; index += 1) {
    const attackSpecials = getSpecialChargeEventsForTeam(attackResult, defenseResult);
    const defenseSpecials = getSpecialChargeEventsForTeam(defenseResult, attackResult);
    const nextAttackResult = simulateBurst(
      state.team,
      "attack",
      attackSpecials,
      defenseResult?.reloadTimeline || [],
      attackStunWindows,
    );
    const nextDefenseResult = simulateBurst(
      state.defenseTeam,
      "defense",
      defenseSpecials,
      attackResult?.reloadTimeline || [],
      defenseStunWindows,
    );
    const stable =
      getResultSignature(nextAttackResult) === getResultSignature(attackResult) &&
      getResultSignature(nextDefenseResult) === getResultSignature(defenseResult);
    attackResult = nextAttackResult;
    defenseResult = nextDefenseResult;
    if (stable) break;
  }

  return { attackResult, defenseResult };
}

function shouldUseWorkerCalculation() {
  return false;
}

function createCalculationPayload() {
  return {
    defenseTeam: state.defenseTeam.map((character) => character?.id || null),
    defenseChargeSpeeds: [...state.defenseChargeSpeeds],
    defenseUniversalCharges: [...state.defenseUniversalCharges],
    team: state.team.map((character) => character?.id || null),
    chargeSpeeds: [...state.chargeSpeeds],
    universalCharges: [...state.universalCharges],
    characterQuantumCubes: state.characterQuantumCubes,
    jackalLinks: state.jackalLinks,
  };
}

function getBattleResultsSnapshot() {
  if (state.battleResults) return state.battleResults;
  if (shouldUseWorkerCalculation()) return { attackResult: null, defenseResult: null };
  const results = computeBattleResults();
  state.battleResults = results;
  return results;
}

async function fetchBattleResultsFromWorker() {
  const response = await fetch("/api/calculate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(createCalculationPayload()),
  });
  if (!response.ok) throw new Error(`Worker计算失败：${response.status}`);
  return response.json();
}

function refreshBattleResults() {
  if (!shouldUseWorkerCalculation()) {
    state.battleResults = computeBattleResults();
    return;
  }

  const requestId = state.calculationRequestId + 1;
  state.calculationRequestId = requestId;
  fetchBattleResultsFromWorker()
    .then((results) => {
      if (requestId !== state.calculationRequestId) return;
      state.battleResults = results;
      renderTeam(results);
      renderSummaryStrip(results.attackResult, results.defenseResult);
      renderResults(results);
      renderLineupSlots();
    })
    .catch((error) => {
      console.error(error);
      showToast(error?.message || "Worker计算失败");
    });
}

function invalidateBattleResults() {
  state.battleResults = null;
}

function estimateChartLabelWidth(label) {
  return [...String(label)].reduce((width, char) => width + (char.charCodeAt(0) > 255 ? 15 : 8), 0);
}

function getCumulativeContributionLines(result, frame) {
  const cumulativeByPosition = new Map();
  result.timeline
    .filter((entry) => entry.frame <= frame)
    .forEach((entry) => {
      entry.contributions.forEach((contribution) => {
        if (contribution.showOnMember === false) return;
        cumulativeByPosition.set(
          contribution.positionIndex,
          (cumulativeByPosition.get(contribution.positionIndex) || 0) + contribution.charge,
        );
      });
    });

  return result.members
    .map((member) => {
      const cumulative = cumulativeByPosition.get(member.positionIndex) || 0;
      if (cumulative <= BURST_EPSILON) return null;
      return `${member.character.name}：${formatNumber(cumulative, 2)}%`;
    })
    .filter(Boolean);
}

function getSpecialContributionTotal(result, frame, labelText) {
  let cumulative = 0;
  result.timeline
    .filter((entry) => entry.frame <= frame)
    .forEach((entry) => {
      entry.contributions.forEach((contribution) => {
        if (contribution.showOnMember !== false) return;
        if (!contribution.labels.some((label) => label.includes(labelText))) return;
        cumulative += contribution.charge;
      });
    });

  return cumulative;
}

function getChargeChartSize() {
  const rect = els.chargeChart?.getBoundingClientRect();
  return {
    width: Math.max(CHART_MIN_WIDTH, Math.round(rect?.width || CHART_WIDTH)),
    height: Math.max(260, Math.round(rect?.height || CHART_HEIGHT)),
  };
}

function getChargeChartMarkup(result, measuredLabelGutter = null, defenseResult = null, chartSize = getChargeChartSize()) {
  const attackResult = result && !result.error ? result : null;
  const defenseChartResult = defenseResult && !defenseResult.error ? defenseResult : null;
  const chartResults = [
    { teamKey: "defense", result: defenseChartResult },
    { teamKey: "attack", result: attackResult },
  ].filter((item) => item.result);
  const hasRosanna = chartResults.some((item) => item.result.members.some((member) => isRosanna(member.character)));
  const hasLittleMermaid = chartResults.some((item) => resultHasLittleMermaid(item.result));
  const width = chartSize.width;
  const margin = { top: 30, right: 42, bottom: 42, left: 0 };
  const visibleTimelineByTeam = new Map(
    chartResults.map((item) => [
      item.teamKey,
      item.result.timeline.filter((entry) => entry.frame <= CHART_MAX_FRAME),
    ]),
  );
  const timelineByFrame = new Map(
    chartResults.flatMap((item) => visibleTimelineByTeam.get(item.teamKey).map((entry) => [`${item.teamKey}-${entry.frame}`, entry])),
  );
  const pointByMemberFrame = new Map(
    chartResults.flatMap((item) =>
      visibleTimelineByTeam.get(item.teamKey).flatMap((entry) =>
        entry.contributions
          .filter((contribution) => contribution.showOnMember !== false)
          .map((contribution) => [
            `${item.teamKey}-${contribution.positionIndex}-${entry.frame}`,
            { entry, contribution, teamKey: item.teamKey, result: item.result },
          ]),
      ),
    ),
  );
  const memberPointGroups = chartResults.flatMap((item) =>
    item.result.members.map((member) => ({
      teamKey: item.teamKey,
      groupKey: `${item.teamKey}-${member.positionIndex}`,
      result: item.result,
      member,
      frames: visibleTimelineByTeam
        .get(item.teamKey)
        .filter((entry) =>
          entry.contributions.some((contribution) => contribution.positionIndex === member.positionIndex && contribution.showOnMember !== false),
        )
        .map((entry) => entry.frame),
    })),
  );
  const visibleReloadEvents = chartResults.flatMap((item) => {
    const displayEndFrame = getBurstDisplayEndFrame(item.result);
    return (item.result.reloadTimeline || [])
      .filter((reload) => reload.startFrame <= Math.min(CHART_MAX_FRAME, displayEndFrame))
      .map((reload) => ({ ...reload, teamKey: item.teamKey, displayEndFrame }));
  });
  const visibleStunEvents = chartResults.flatMap((item) => {
    const displayEndFrame = getBurstDisplayEndFrame(item.result);
    return (item.result.stunTimeline || [])
      .filter((stun) => stun.startFrame <= Math.min(CHART_MAX_FRAME, displayEndFrame))
      .map((stun) => ({ ...stun, teamKey: item.teamKey, displayEndFrame }));
  });
  const points = memberPointGroups.flatMap((group) =>
    group.frames.map((frame) => ({ frame, groupKey: group.groupKey, teamKey: group.teamKey, positionIndex: group.member.positionIndex, result: group.result })),
  );
  const scarletCounterGroups = [
    ...getScarletCounterGroups(chartResults, visibleTimelineByTeam),
    ...getJackalLinkGroups(chartResults, visibleTimelineByTeam),
  ];
  const universalChargeGroups = chartResults
    .map((item) => {
      const timeline = item.result.timeline
        .map((entry) => {
          const contributions = entry.contributions.filter((contribution) =>
            contribution.showOnMember === false && contribution.labels.some((label) => label.includes("万能充能")),
          );
          if (contributions.length === 0) return null;
          return {
            frame: entry.frame,
            charge: contributions.reduce((sum, contribution) => sum + contribution.charge, 0),
            cumulativeCharge: contributions.reduce((sum, contribution) => sum + contribution.cumulativeCharge, 0),
            contributions,
          };
        })
        .filter(Boolean);
      if (timeline.length === 0) return null;
      return {
        teamKey: item.teamKey,
        groupKey: `${item.teamKey}-universal-charge`,
        label: "万能充能",
        timeline,
      };
    })
    .filter(Boolean);
  const totalGroups = chartResults.map((item) => ({
    teamKey: item.teamKey,
    result: item.result,
    timeline: item.result.timeline.filter((entry) => entry.frame <= CHART_MAX_FRAME),
    groupKey: `${item.teamKey}-total`,
    label: "总充能",
  }));
  const primaryTotalGroup = totalGroups.find((group) => group.teamKey === "attack") || totalGroups[0];
  const visibleStandards = totalGroups
    .filter((group) => group.result.fullFrame <= CHART_MAX_FRAME)
    .map((group) => ({ label: "", frame: group.result.fullFrame, isFullFrame: true, teamKey: group.teamKey }));
  const resultFrameCandidates = chartResults.flatMap((item) => {
    const displayEndFrame = getBurstDisplayEndFrame(item.result);
    return [
      item.result.fullFrame,
      ...getAvailableBurstMarkers(item.result).map((marker) => marker.frame),    ];
  });
  const counterFrameCandidates = scarletCounterGroups.flatMap((group) => group.timeline.map((entry) => entry.frame));
  const maxFrame = Math.min(CHART_MAX_FRAME, Math.max(...resultFrameCandidates, ...counterFrameCandidates, chartResults.length ? 1 : CHART_MAX_FRAME));
  const rlStandards = Array.from({ length: Math.floor(maxFrame / 76) }, (_, index) => ({
    label: `${index + 1}RL`,
    tooltip: `${index + 1}RL · ${(index + 1) * 76} F`,
    frame: (index + 1) * 76,
  }));
  const standardEvents = [
    ...(hasRosanna ? STANDARD_TIMELINE_EVENTS : []),
    ...(hasLittleMermaid ? [LITTLE_MERMAID_TIMELINE_EVENT] : []),
  ].filter((event) => event.frame <= maxFrame);
  const standardMarkers = [...rlStandards, ...standardEvents].sort((a, b) => a.frame - b.frame);
  const tickStep = maxFrame <= 180 ? 20 : maxFrame <= 320 ? 40 : 60;
  const tickFrames = Array.from({ length: Math.floor(maxFrame / tickStep) + 1 }, (_, index) => index * tickStep);
  if (!tickFrames.includes(maxFrame)) tickFrames.push(maxFrame);
  const finishingPositionsByTeam = new Map(chartResults.map((item) => [item.teamKey, new Set(item.result.finishingPositionIndices)]));
  const labelGap = 10;
  const chartLabels = [
    "标准轴",
    ...totalGroups.map((group) => group.label),
    ...universalChargeGroups.map((group) => group.label),
    ...scarletCounterGroups.map((group) => group.label),
    ...memberPointGroups.map((group) => {
      const finishingPositions = finishingPositionsByTeam.get(group.teamKey) || new Set();
      return `${finishingPositions.has(group.member.positionIndex) && canShowFinishMarker(group.member.character) ? "*" : ""}${group.member.character.name}`;
    }),
  ];
  const labelGutter =
    measuredLabelGutter ?? Math.ceil(Math.max(...chartLabels.map(estimateChartLabelWidth), 0) + labelGap);
  const chartWidth = width - labelGutter - margin.right;
  const xForFrame = (frame) => labelGutter + (frame / maxFrame) * chartWidth;
  const standardLaneIndex = 0;
  const defenseGroups = memberPointGroups.filter((group) => group.teamKey === "defense");
  const attackGroups = memberPointGroups.filter((group) => group.teamKey === "attack");
  const defenseCounterGroups = scarletCounterGroups.filter((group) => group.teamKey === "defense");
  const attackCounterGroups = scarletCounterGroups.filter((group) => group.teamKey === "attack");
  const defenseUniversalGroups = universalChargeGroups.filter((group) => group.teamKey === "defense");
  const attackUniversalGroups = universalChargeGroups.filter((group) => group.teamKey === "attack");
  const hasTeamSeparator = defenseGroups.length > 0 && attackGroups.length > 0;
  const hasDefenseTotal = totalGroups.some((group) => group.teamKey === "defense");
  const firstMemberLaneIndex = 1;
  const firstDefenseUniversalLaneIndex = firstMemberLaneIndex + defenseGroups.length;
  const firstDefenseCounterLaneIndex = firstDefenseUniversalLaneIndex + defenseUniversalGroups.length;
  const defenseTotalLaneIndex = hasDefenseTotal ? firstDefenseCounterLaneIndex + defenseCounterGroups.length : null;
  const separatorLaneIndex = hasTeamSeparator ? firstDefenseCounterLaneIndex + defenseCounterGroups.length + (hasDefenseTotal ? 1 : 0) : null;
  const firstAttackLaneIndex =
    firstDefenseCounterLaneIndex + defenseCounterGroups.length + (hasDefenseTotal ? 1 : 0) + (hasTeamSeparator ? 1 : 0);
  const firstAttackUniversalLaneIndex = firstAttackLaneIndex + attackGroups.length;
  const firstAttackCounterLaneIndex = firstAttackUniversalLaneIndex + attackUniversalGroups.length;
  const attackTotalLaneIndex = firstAttackCounterLaneIndex + attackCounterGroups.length;
  const laneCount = attackTotalLaneIndex + (totalGroups.some((group) => group.teamKey === "attack") ? 1 : 0);
  const height = chartSize.height;
  const chartHeight = height - margin.top - margin.bottom;
  const laneByGroupKey = new Map([
    ...defenseGroups.map((group, index) => [group.groupKey, firstMemberLaneIndex + index]),
    ...attackGroups.map((group, index) => [group.groupKey, firstAttackLaneIndex + index]),
  ]);
  const laneByCounterGroupKey = new Map([
    ...defenseCounterGroups.map((group, index) => [group.groupKey, firstDefenseCounterLaneIndex + index]),
    ...attackCounterGroups.map((group, index) => [group.groupKey, firstAttackCounterLaneIndex + index]),
  ]);
  const laneByUniversalGroupKey = new Map([
    ...defenseUniversalGroups.map((group, index) => [group.groupKey, firstDefenseUniversalLaneIndex + index]),
    ...attackUniversalGroups.map((group, index) => [group.groupKey, firstAttackUniversalLaneIndex + index]),
  ]);
  const laneByTotalKey = new Map(
    totalGroups.map((group) => [group.teamKey, group.teamKey === "defense" ? defenseTotalLaneIndex : attackTotalLaneIndex]).filter(([, lane]) => lane !== null),
  );
  const yForLane = (index) => margin.top + (chartHeight / Math.max(laneCount, 1)) * index;
  const yForGroup = (groupKey) => yForLane(laneByGroupKey.get(groupKey) ?? attackTotalLaneIndex);
  const yForCounterGroup = (groupKey) => yForLane(laneByCounterGroupKey.get(groupKey) ?? attackTotalLaneIndex);
  const yForUniversalGroup = (groupKey) => yForLane(laneByUniversalGroupKey.get(groupKey) ?? attackTotalLaneIndex);
  const yForTeamTotal = (teamKey) => yForLane(laneByTotalKey.get(teamKey) ?? attackTotalLaneIndex);
  const yForStandard = () => yForLane(standardLaneIndex);

  const gridLines = tickFrames
    .map((frame) => {
      const x = xForFrame(frame);
      const isFullFrame = primaryTotalGroup && frame === primaryTotalGroup.result.fullFrame;
      return `
        <g class="${isFullFrame ? "chart-grid is-full" : "chart-grid"}">
          <line x1="${x}" y1="${margin.top}" x2="${x}" y2="${height - margin.bottom}" />
          <text x="${x}" y="${height - 14}" text-anchor="middle">${frame}F</text>
        </g>
      `;
    })
    .join("");

  const standardLines = visibleStandards
    .filter((standard, index, standards) => standards.findIndex((item) => item.teamKey === standard.teamKey && item.frame === standard.frame) === index)
    .map((standard) => {
      const x = xForFrame(standard.frame);
      const isFullFrame = standard.isFullFrame;
      const label = standard.label ? `<text x="${x}" y="${margin.top - 34}" text-anchor="middle">${escapeHtml(standard.label)}</text>` : "";
      return `
        <g class="${isFullFrame ? `chart-standard is-full team-${standard.teamKey}` : `chart-standard team-${standard.teamKey}`}">
          <line x1="${x}" y1="${margin.top - 24}" x2="${x}" y2="${height - margin.bottom}" />
          ${label}
        </g>
      `;
    })
    .join("");

  const positionLines = Array.from({ length: laneCount }, (_, index) => {
    const y = yForLane(index);
    return `<line class="chart-position-line" x1="${labelGutter}" y1="${y}" x2="${width - margin.right}" y2="${y}" />`;
  }).join("");
  const teamSeparatorLine =
    separatorLaneIndex !== null
      ? `<line class="chart-team-separator" x1="0" y1="${yForLane(separatorLaneIndex)}" x2="${width - margin.right}" y2="${yForLane(separatorLaneIndex)}" />`
      : "";

  const standardReferenceLines = standardMarkers
    .map((standard) => {
      const x = xForFrame(standard.frame);
      return `<line class="chart-standard-reference" x1="${x}" y1="${yForStandard()}" x2="${x}" y2="${height - margin.bottom}" />`;
    })
    .join("");
  const firstStandardFrame = rlStandards[0]?.frame;
  const standardTrack =
    firstStandardFrame === undefined
      ? ""
      : `<line class="chart-track chart-standard-track" x1="${xForFrame(firstStandardFrame)}" y1="${yForStandard()}" x2="${xForFrame(maxFrame)}" y2="${yForStandard()}" />`;
  const standardPoints = standardMarkers
    .map((standard) => {
      const x = xForFrame(standard.frame);
      const y = yForStandard();
      const tooltip = escapeHtml(standard.tooltip || `${standard.label} · ${standard.frame} F`);
      return `<circle class="chart-standard-point" cx="${x}" cy="${y}" r="4" data-tooltip="${tooltip}"></circle><text class="chart-standard-label" x="${x}" y="${y - 10}" text-anchor="middle">${escapeHtml(standard.label)}</text>`;
    })
    .join("");

  const getTrackSegments = (startFrame, endFrame, pauses) => {
    const segments = [];
    let cursor = startFrame;
    pauses
      .map((pause) => ({
        start: Math.max(startFrame, pause.startFrame),
        end: Math.min(endFrame, pause.endFrame),
      }))
      .filter((pause) => pause.end > pause.start)
      .sort((a, b) => a.start - b.start)
      .forEach((pause) => {
        if (pause.start > cursor) segments.push({ start: cursor, end: pause.start });
        if (pause.suppressTrackAfter) {
          cursor = endFrame;
          return;
        }
        cursor = Math.max(cursor, pause.end);
      });
    if (cursor < endFrame) segments.push({ start: cursor, end: endFrame });
    return segments;
  };
  const getStunTrackPauses = (group) => {
    const groupStuns = visibleStunEvents.filter(
      (stun) => stun.teamKey === group.teamKey && stun.positionIndex === group.member.positionIndex,
    );
    if (!isChargeWeapon(group.member.character)) return groupStuns;

    return groupStuns.map((stun) => {
      const previousFrame = group.frames.filter((frame) => frame < stun.startFrame).at(-1);
      const nextFrame = group.frames.find((frame) => frame > stun.startFrame);
      return {
        ...stun,
        startFrame: previousFrame !== undefined && nextFrame !== undefined ? previousFrame : stun.startFrame,
      };
    });
  };
  const tracks = memberPointGroups
    .flatMap((group) => {
      const y = yForGroup(group.groupKey);
      if (isChargeWeapon(group.member.character)) {
        if (group.member.character.weapon === "RL") {
          const shotFrames = (group.result.flightTimeline || [])
            .filter(
              (flight) =>
                flight.positionIndex === group.member.positionIndex &&
                flight.endFrame <= CHART_MAX_FRAME &&
                flight.endFrame <= getBurstDisplayEndFrame(group.result),
            )
            .map((flight) => ({ frame: flight.endFrame, missed: flight.missed }));

          return shotFrames
            .slice(1)
            .map((shot, index) => {
              if (shot.missed) return "";
              const previousFrame = shotFrames[index].frame;
              return shot.frame > previousFrame
                ? `<line class="chart-track team-${group.teamKey}" x1="${xForFrame(previousFrame)}" y1="${y}" x2="${xForFrame(shot.frame)}" y2="${y}" />`
                : "";
            })
            .filter(Boolean);
        }

        return group.frames
          .slice(1)
          .map((frame, index) => {
            const previousFrame = group.frames[index];
            return frame > previousFrame
              ? `<line class="chart-track team-${group.teamKey}" x1="${xForFrame(previousFrame)}" y1="${y}" x2="${xForFrame(frame)}" y2="${y}" />`
              : "";
          })
          .filter(Boolean);
      }
      const groupReloads = visibleReloadEvents.filter(
        (reload) => reload.teamKey === group.teamKey && reload.positionIndex === group.member.positionIndex,
      ).map((reload) => ({ ...reload, suppressTrackAfter: true }));
      const groupStuns = getStunTrackPauses(group);

      if (group.frames.length < 2) return "";
      const firstFrame = Math.min(...group.frames);
      const lastFrame = Math.max(...group.frames);
      return getTrackSegments(firstFrame, lastFrame, [...groupReloads, ...groupStuns]).map(
        (segment) =>
          `<line class="chart-track team-${group.teamKey}" x1="${xForFrame(segment.start)}" y1="${y}" x2="${xForFrame(segment.end)}" y2="${y}" />`,
      );
    })
    .flat()
    .join("");
  const stunPoints = visibleStunEvents
    .flatMap((stun) => {
      const groupKey = `${stun.teamKey}-${stun.positionIndex}`;
      if (!laneByGroupKey.has(groupKey)) return [];
      const y = yForGroup(groupKey);
      const endFrame = Math.min(stun.endFrame, maxFrame, stun.displayEndFrame);
      const markers = [
        {
          frame: Math.min(stun.startFrame, maxFrame),
          tooltip: `${TEAM_LABELS[stun.teamKey]} P${stun.positionIndex + 1}\n时间：${stun.startFrame} F\n状态：被晕眩`,
        },
      ];
      if (endFrame >= stun.endFrame) {
        markers.push({
          frame: endFrame,
          tooltip: `${TEAM_LABELS[stun.teamKey]} P${stun.positionIndex + 1}\n时间：${stun.endFrame} F\n状态：晕眩解除`,
        });
      }
      return markers.map(
        (marker) =>
          `<circle class="chart-stun-point team-${stun.teamKey}" cx="${xForFrame(marker.frame)}" cy="${y}" r="4" data-tooltip="${escapeHtml(marker.tooltip)}"></circle>`,
      );
    })
    .join("");
  const reloadDurationTracks = visibleReloadEvents
    .flatMap((reload) => {
      const y = yForGroup(`${reload.teamKey}-${reload.positionIndex}`);
      const startFrame = Math.min(reload.startFrame, maxFrame);
      const group = memberPointGroups.find((item) => item.teamKey === reload.teamKey && item.member.positionIndex === reload.positionIndex);
      const nextHitFrame = group?.frames.find((frame) => frame > reload.startFrame) ?? reload.endFrame;
      const endFrame = Math.min(nextHitFrame, maxFrame, reload.displayEndFrame);
      if (endFrame <= startFrame) return [];
      const tooltip = escapeHtml(`${reload.characterName}\n???${reload.startFrame}F -> ${reload.endFrame}F`);
      return [`<line class="chart-dodge-track chart-dodge-reload-duration team-${reload.teamKey}" x1="${xForFrame(startFrame)}" y1="${y}" x2="${xForFrame(endFrame)}" y2="${y}" data-tooltip="${tooltip}"></line>`];
    })
    .join("");
  const scarletCounterTracks = scarletCounterGroups
    .map((group) => {
      if (group.timeline.length < 2) return "";
      const y = yForCounterGroup(group.groupKey);
      const firstFrame = group.timeline[0].frame;
      const lastFrame = group.timeline.at(-1).frame;
      return `<line class="chart-track chart-scarlet-counter-track team-${group.teamKey}" x1="${xForFrame(firstFrame)}" y1="${y}" x2="${xForFrame(lastFrame)}" y2="${y}" />`;
    })
    .join("");
  const universalChargePoints = universalChargeGroups
    .flatMap((group) =>
      group.timeline.map((entry) => {
        const x = xForFrame(entry.frame);
        const y = yForUniversalGroup(group.groupKey);
        const lines = [
          group.label,
          `时间：${entry.frame} F`,
          `充能：${formatNumber(entry.charge, 2)}%`,
          "组成：",
          ...entry.contributions.map((contribution) => `${contribution.characterName}：${formatNumber(contribution.charge, 2)}%`),
        ];
        return `<circle class="chart-universal-point team-${group.teamKey}" cx="${x}" cy="${y}" r="4" data-tooltip="${formatTooltipLines(lines)}"></circle>`;
      }),
    )
    .join("");

  const pointMarks = points
    .map((point) => {
      const x = xForFrame(point.frame);
      const y = yForGroup(point.groupKey);
      const pointDetail = pointByMemberFrame.get(`${point.teamKey}-${point.positionIndex}-${point.frame}`);
      const contribution = pointDetail?.contribution;
      const entry = pointDetail?.entry || timelineByFrame.get(`${point.teamKey}-${point.frame}`);
      const tooltip = contribution
        ? formatTooltipLines([
            contribution.characterName,
            `时间：${point.frame} F`,
            `充能：${formatNumber(contribution.charge, 2)}%`,
            `累积充能：${formatNumber(contribution.cumulativeCharge, 2)}%`,
            `充能组成：${formatContributionSourceLabels(contribution.labels)}`,
            formatContributionTargetHits(contribution.targetHits, contribution.labels),
          ].filter(Boolean))
        : "";
      const isFinisher =
        point.frame === point.result.fullFrame &&
        (finishingPositionsByTeam.get(point.teamKey) || new Set()).has(point.positionIndex) &&
        canShowFinishMarker(point.result.members.find((member) => member.positionIndex === point.positionIndex)?.character);
      return `<circle class="${isFinisher ? `chart-point team-${point.teamKey} is-finisher` : `chart-point team-${point.teamKey}`}" cx="${x}" cy="${y}" r="${isFinisher ? 6 : 4}" data-tooltip="${tooltip}"></circle>`;
    })
    .join("");

  const totalPoints = totalGroups
    .flatMap((group) =>
      group.timeline.map((entry) => {
        const x = xForFrame(entry.frame);
        const y = yForTeamTotal(group.teamKey);
        const jackalLinkTotal = getSpecialContributionTotal(group.result, entry.frame, "豺狼链接");
        const scarletCounterTotal = getSpecialContributionTotal(group.result, entry.frame, "红莲反击");
        const universalChargeTotal = getSpecialContributionTotal(group.result, entry.frame, "万能充能");
        const characterChargeLines = getCumulativeContributionLines(group.result, entry.frame);
        const tooltip = formatTooltipLines([
          `${group.label} · ${entry.frame}F`,
          `累计总充能：${formatNumber(entry.totalCharge, 2)}%`,
          ...(universalChargeTotal > BURST_EPSILON ? [`万能充能：${formatNumber(universalChargeTotal, 2)}%`] : []),
          ...(jackalLinkTotal > BURST_EPSILON ? [`豺狼链接充能：${formatNumber(jackalLinkTotal, 2)}%`] : []),
          ...(scarletCounterTotal > BURST_EPSILON ? [`红莲反击充能：${formatNumber(scarletCounterTotal, 2)}%`] : []),
          ...(characterChargeLines.length ? ["各角色充能：", ...characterChargeLines] : []),
        ]);
        return `<circle class="chart-total-point team-${group.teamKey}" cx="${x}" cy="${y}" r="4" data-tooltip="${tooltip}"></circle>`;
      }),
    )
    .join("");
  const scarletCounterPoints = scarletCounterGroups
    .flatMap((group) =>
      group.timeline.map((entry) => {
        const x = xForFrame(entry.frame);
        const y = yForCounterGroup(group.groupKey);
        const tooltip = formatTooltipLines(getSpecialChargeTooltipLines(group, entry));
        return `<circle class="chart-scarlet-counter-point team-${group.teamKey}" cx="${x}" cy="${y}" r="4" data-tooltip="${tooltip}"></circle>`;
      }),
    )
    .join("");

  const burstPoints = totalGroups
    .flatMap((group) =>
      getAvailableBurstMarkers(group.result)
        .filter((marker) => marker.frame <= CHART_MAX_FRAME)
        .map((marker) => {
          const x = xForFrame(marker.frame);
          const y = yForTeamTotal(group.teamKey);
          const tooltip = escapeHtml(`${TEAM_LABELS[group.teamKey]} ${marker.label} · ${marker.frame} F`);
          return `<circle class="chart-burst-point team-${group.teamKey}" cx="${x}" cy="${y}" r="5" data-tooltip="${tooltip}"></circle><text class="chart-burst-label team-${group.teamKey}" x="${x}" y="${y - 10}" text-anchor="middle">${escapeHtml(marker.label)}</text>`;
        }),
    )
    .join("");

  const chargeTotalTrack = totalGroups
    .map((group) =>
      group.timeline.length > 1
        ? `<line class="chart-track chart-total-track chart-total-charge-track team-${group.teamKey}" x1="${xForFrame(group.timeline[0].frame)}" y1="${yForTeamTotal(group.teamKey)}" x2="${xForFrame(Math.min(group.result.fullFrame, CHART_MAX_FRAME))}" y2="${yForTeamTotal(group.teamKey)}" />`
        : "",
    )
    .join("");
  const burstTotalTrack = totalGroups
    .map((group) => {
      const markers = getAvailableBurstMarkers(group.result).filter((marker) => marker.frame <= CHART_MAX_FRAME);
      if (markers.length === 0) return "";
      const maxBurstFrame = Math.max(...markers.map((marker) => marker.frame));
      return `<line class="chart-track chart-total-track chart-total-burst-track team-${group.teamKey}" x1="${xForFrame(markers[0].frame)}" y1="${yForTeamTotal(group.teamKey)}" x2="${xForFrame(maxBurstFrame)}" y2="${yForTeamTotal(group.teamKey)}" />`;
    })
    .join("");

  const labels = memberPointGroups.map((group) => {
    const y = yForGroup(group.groupKey);
    const finishingPositions = finishingPositionsByTeam.get(group.teamKey) || new Set();
    const prefix = finishingPositions.has(group.member.positionIndex) && canShowFinishMarker(group.member.character) ? "*" : "";
    return `<text class="chart-name" x="0" y="${y + 4}" text-anchor="start">${escapeHtml(prefix + group.member.character.name)}</text>`;
  }).join("");
  const scarletCounterLabels = scarletCounterGroups
    .map((group) => `<text class="chart-name chart-scarlet-counter-name team-${group.teamKey}" x="0" y="${yForCounterGroup(group.groupKey) + 4}" text-anchor="start">${escapeHtml(group.label)}</text>`)
    .join("");
  const universalChargeLabels = universalChargeGroups
    .map((group) => `<text class="chart-name chart-universal-name team-${group.teamKey}" x="0" y="${yForUniversalGroup(group.groupKey) + 4}" text-anchor="start">${escapeHtml(group.label)}</text>`)
    .join("");
  const standardLabel = `<text class="chart-name chart-standard-name" x="0" y="${yForStandard() + 4}" text-anchor="start">标准轴</text>`;
  const totalLabels = totalGroups
    .map((group) => `<text class="chart-name chart-total-name team-${group.teamKey}" x="0" y="${yForTeamTotal(group.teamKey) + 4}" text-anchor="start">${escapeHtml(group.label)}</text>`)
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMinYMin meet" data-label-gap="${labelGap}" data-label-gutter="${labelGutter}" role="img" aria-label="队伍充能关键帧图表">
      <rect class="chart-bg" x="0" y="0" width="${width}" height="${height}" rx="8" />
      ${gridLines}
      ${standardLines}
      ${positionLines}
      ${teamSeparatorLine}
      ${standardReferenceLines}
      ${standardTrack}
      ${standardPoints}
      ${tracks}
      ${reloadDurationTracks}      ${scarletCounterTracks}
      ${chargeTotalTrack}
      ${burstTotalTrack}
      ${universalChargePoints}
      ${pointMarks}      ${stunPoints}
      ${scarletCounterPoints}
      ${totalPoints}
      ${burstPoints}
      ${standardLabel}
      ${labels}
      ${universalChargeLabels}
      ${scarletCounterLabels}
      ${totalLabels}
    </svg>
  `;
}

function renderChargeChart(result, defenseResult = simulateBurst(state.defenseTeam, "defense", [], [], [], getStunWindowsForTeam("defense"))) {
  els.chargeChart.innerHTML = getChargeChartMarkup(result, null, defenseResult);
  fitChargeChartLabels(result, defenseResult);
  requestAnimationFrame(() => fitChargeChartLabels(result, defenseResult));
}

function fitChargeChartLabels(result, defenseResult = null) {
  const svg = els.chargeChart.querySelector("svg");
  if (!svg || ((!result || result.error) && (!defenseResult || defenseResult.error))) return;

  const labels = [...svg.querySelectorAll(".chart-name")];
  if (labels.length === 0) return;

  try {
    const labelGap = Number(svg.dataset.labelGap) || 10;
    const currentGutter = Number(svg.dataset.labelGutter) || 0;
    const measuredGutter = Math.ceil(Math.max(...labels.map((label) => label.getBBox().width), 0) + labelGap);

    if (Math.abs(measuredGutter - currentGutter) > 1) {
      els.chargeChart.innerHTML = getChargeChartMarkup(result, measuredGutter, defenseResult);
    }
  } catch {
    // getBBox can fail while the SVG is detached; the estimated layout remains usable.
  }
}

function getChartTooltip() {
  let tooltip = els.chargeChart.querySelector(".chart-hover-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "chart-hover-tooltip";
    els.chargeChart.append(tooltip);
  }
  return tooltip;
}

function getChartGuideLine(className) {
  let line = els.chargeChart.querySelector(`.${className}`);
  if (!line) {
    line = document.createElement("div");
    line.className = className;
    els.chargeChart.append(line);
  }
  return line;
}

function showNearestChartTooltip(event) {
  const svg = els.chargeChart.querySelector("svg");
  if (!svg) return;

  const points = [...svg.querySelectorAll("[data-tooltip]")];
  if (points.length === 0) return;

  const nearest = points
    .map((point) => {
      const box = point.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      return { point, distance: dx * dx + dy * dy };
    })
    .sort((a, b) => a.distance - b.distance)[0]?.point;

  const tooltipText = nearest?.dataset.tooltip;
  if (!tooltipText) return;

  const chartBox = els.chargeChart.getBoundingClientRect();
  const svgBox = svg.getBoundingClientRect();
  const pointBox = nearest.getBoundingClientRect();
  const pointX = pointBox.left + pointBox.width / 2 - chartBox.left;
  const pointY = pointBox.top + pointBox.height / 2 - chartBox.top;
  const svgLeft = svgBox.left - chartBox.left;
  const svgTop = svgBox.top - chartBox.top;
  const viewBox = svg.viewBox.baseVal;
  const labelGutter = Number(svg.dataset.labelGutter) || 0;
  const frameZeroX = svgLeft + (labelGutter / viewBox.width) * svgBox.width;
  const plotBottomY = svgTop + ((viewBox.height - 42) / viewBox.height) * svgBox.height;
  const horizontalGuide = getChartGuideLine("chart-hover-guide-x");
  const verticalGuide = getChartGuideLine("chart-hover-guide-y");
  const tooltip = getChartTooltip();

  horizontalGuide.classList.add("show");
  horizontalGuide.style.left = `${frameZeroX}px`;
  horizontalGuide.style.top = `${pointY}px`;
  horizontalGuide.style.width = `${Math.max(pointX - frameZeroX, 0)}px`;

  verticalGuide.classList.add("show");
  verticalGuide.style.left = `${pointX}px`;
  verticalGuide.style.top = `${pointY}px`;
  verticalGuide.style.height = `${Math.max(plotBottomY - pointY, 0)}px`;

  tooltip.textContent = tooltipText;
  tooltip.classList.add("show");
  const tooltipWidth = 360;
  const placeLeft = pointX + tooltipWidth + 18 > chartBox.width;
  tooltip.style.left = `${placeLeft ? Math.max(pointX - tooltipWidth - 14, 8) : pointX + 14}px`;
  const tooltipHeight = tooltip.offsetHeight || 120;
  const preferredTop = pointY + tooltipHeight + 18 > chartBox.height ? pointY - tooltipHeight - 14 : pointY - 18;
  tooltip.style.top = `${Math.min(Math.max(preferredTop, 8), Math.max(chartBox.height - tooltipHeight - 8, 8))}px`;
}

function hideChartTooltip() {
  const tooltip = els.chargeChart.querySelector(".chart-hover-tooltip");
  if (tooltip) tooltip.classList.remove("show");
  els.chargeChart.querySelectorAll(".chart-hover-guide-x, .chart-hover-guide-y").forEach((line) => line.classList.remove("show"));
}

function renderSummaryStrip(attackResult, defenseResult) {
  const entries = [
    { teamKey: "defense", result: defenseResult },
    { teamKey: "attack", result: attackResult },
  ].filter((entry) => entry.result && !entry.result.error);

  if (entries.length === 0) {
    els.summaryStrip.textContent = "队伍为空，选择角色后开始计算";
    els.summaryStrip.oncontextmenu = null;
    return;
  }

  els.summaryStrip.innerHTML = entries
    .map(
      (entry, index) => `
        ${index > 0 ? '<span class="summary-vs">VS</span>' : ""}
        <span class="summary-team summary-${entry.teamKey}">
          <span>${TEAM_LABELS[entry.teamKey]}</span>
          <strong>${entry.result.fullFrame}F</strong>
        </span>
      `,
    )
    .join("");

  els.summaryStrip.oncontextmenu = (event) => {
    event.preventDefault();
    copyBattleResultsSummary();
  };
}

function renderResults(battleResults = getBattleResultsSnapshot()) {
  const { attackResult: result, defenseResult } = battleResults;
  renderSummaryStrip(result, defenseResult);

  if (!result) {
    els.resultPanel.innerHTML = "";
    renderChargeChart(null, defenseResult);
    return null;
  }

  if (result.error) {
    els.resultPanel.innerHTML = `<p class="empty-result">${escapeHtml(result.error)}</p>`;
    renderChargeChart(result, defenseResult);
    return result;
  }

  renderChargeChart(result, defenseResult);
  els.resultPanel.innerHTML = "";

  return result;
}

function render() {
  renderCharacters();
  invalidateBattleResults();
  const battleResults = getBattleResultsSnapshot();
  renderTeam(battleResults);
  renderLineupSlots();
  renderResults(battleResults);
  refreshBattleResults();
}

function addCharacterLegacy(character) {
  if (state.team.some((member) => member && member.id === character.id)) {
    showToast(`${character.name} 已在队伍中，不能重复加入。`);
    return;
  }

  const emptyIndex = state.team.findIndex((member) => !member);
  if (emptyIndex === -1) {
    showToast("队伍已满，请先移除一个槽位。");
    return;
  }

  state.team[emptyIndex] = character;
  saveTeam();
  render();
}

function toggleCharacterLegacy(character) {
  const pickedIndex = state.team.findIndex((member) => member && member.id === character.id);
  if (pickedIndex !== -1) {
    removeCharacter(pickedIndex);
    return;
  }

  addCharacter(character);
}

function removeCharacterLegacy(index) {
  state.team[index] = null;
  state.chargeSpeeds[index] = 0;
  saveTeam();
  render();
}

function moveTeamSlotLegacy(fromIndex, toIndex) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= TEAM_SIZE ||
    toIndex >= TEAM_SIZE ||
    !state.team[fromIndex]
  ) {
    return;
  }

  const fromCharacter = state.team[fromIndex];
  const fromSpeed = state.chargeSpeeds[fromIndex];

  if (state.team[toIndex]) {
    [state.team[fromIndex], state.team[toIndex]] = [state.team[toIndex], state.team[fromIndex]];
    [state.chargeSpeeds[fromIndex], state.chargeSpeeds[toIndex]] = [state.chargeSpeeds[toIndex], state.chargeSpeeds[fromIndex]];
  } else {
    state.team[toIndex] = fromCharacter;
    state.chargeSpeeds[toIndex] = fromSpeed;
    state.team[fromIndex] = null;
    state.chargeSpeeds[fromIndex] = 0;
  }

  saveTeam();
  render();
}

function clearTeamLegacy() {
  state.team = Array(TEAM_SIZE).fill(null);
  state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
  state.universalCharges = Array(TEAM_SIZE).fill(0);
  state.redHoodPierceCounts = Array(TEAM_SIZE).fill(0);
  state.scarletCounterEnabled = Array(TEAM_SIZE).fill(true);
  saveTeam();
  render();
}

function addCharacter(character) {
  const team = getTeamState();
  const chargeSpeeds = getChargeSpeedState();
  const universalCharges = getUniversalChargeState();
  const redHoodPierceCounts = getRedHoodPierceCountState();
  const scarletCounterEnabled = getScarletCounterEnabledState();
  if (team.some((member) => member && member.id === character.id)) {
    showToast(`${character.name} 已在${TEAM_LABELS[state.activeTeamKey]}中`);
    return;
  }

  const emptyIndex = team.findIndex((member) => !member);
  if (emptyIndex === -1) {
    showToast(`${TEAM_LABELS[state.activeTeamKey]}已满，请先移除一个槽位`);
    return;
  }

  team[emptyIndex] = character;
  chargeSpeeds[emptyIndex] = getSavedCharacterChargeSpeed(character, state.activeTeamKey);
  universalCharges[emptyIndex] = 0;
  redHoodPierceCounts[emptyIndex] = isRedHood(character) ? getSavedCharacterRedHoodPierceCount(character, state.activeTeamKey) : 0;
  scarletCounterEnabled[emptyIndex] = true;
  openSlotSettings = null;
  saveTeam();
  render();
}

function toggleCharacter(character) {
  const pickedIndex = getTeamState().findIndex((member) => member && member.id === character.id);
  if (pickedIndex !== -1) {
    removeCharacter(state.activeTeamKey, pickedIndex);
    return;
  }

  addCharacter(character);
}

function removeCharacter(teamKey, index) {
  const team = getTeamState(teamKey);
  const chargeSpeeds = getChargeSpeedState(teamKey);
  const universalCharges = getUniversalChargeState(teamKey);
  const redHoodPierceCounts = getRedHoodPierceCountState(teamKey);
  const scarletCounterEnabled = getScarletCounterEnabledState(teamKey);
  team[index] = null;
  chargeSpeeds[index] = 0;
  universalCharges[index] = 0;
  redHoodPierceCounts[index] = 0;
  scarletCounterEnabled[index] = true;
  normalizeJackalLink(teamKey);
  openSlotSettings = null;
  saveTeam();
  render();
}

function moveTeamSlot(fromTeamKey, fromIndex, toTeamKey, toIndex) {
  const fromTeam = getTeamState(fromTeamKey);
  const toTeam = getTeamState(toTeamKey);
  const fromSpeeds = getChargeSpeedState(fromTeamKey);
  const toSpeeds = getChargeSpeedState(toTeamKey);
  const fromUniversalCharges = getUniversalChargeState(fromTeamKey);
  const toUniversalCharges = getUniversalChargeState(toTeamKey);
  const fromPierceCounts = getRedHoodPierceCountState(fromTeamKey);
  const toPierceCounts = getRedHoodPierceCountState(toTeamKey);
  const fromCounterEnabled = getScarletCounterEnabledState(fromTeamKey);
  const toCounterEnabled = getScarletCounterEnabledState(toTeamKey);

  if (
    (fromTeamKey === toTeamKey && fromIndex === toIndex) ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= TEAM_SIZE ||
    toIndex >= TEAM_SIZE ||
    !fromTeam[fromIndex]
  ) {
    return;
  }

  const fromCharacter = fromTeam[fromIndex];
  const fromSpeed = fromSpeeds[fromIndex];
  const fromUniversalCharge = fromUniversalCharges[fromIndex];
  const fromPierceCount = fromPierceCounts[fromIndex];
  const fromCounterState = fromCounterEnabled[fromIndex];

  if (toTeam[toIndex]) {
    [fromTeam[fromIndex], toTeam[toIndex]] = [toTeam[toIndex], fromTeam[fromIndex]];
    [fromSpeeds[fromIndex], toSpeeds[toIndex]] = [toSpeeds[toIndex], fromSpeeds[fromIndex]];
    [fromUniversalCharges[fromIndex], toUniversalCharges[toIndex]] = [toUniversalCharges[toIndex], fromUniversalCharges[fromIndex]];
    [fromPierceCounts[fromIndex], toPierceCounts[toIndex]] = [toPierceCounts[toIndex], fromPierceCounts[fromIndex]];
    [fromCounterEnabled[fromIndex], toCounterEnabled[toIndex]] = [toCounterEnabled[toIndex], fromCounterEnabled[fromIndex]];
    rememberTeamSlotChargeSpeed(fromTeamKey, fromIndex);
    rememberTeamSlotChargeSpeed(toTeamKey, toIndex);
    rememberTeamSlotRedHoodPierceCount(fromTeamKey, fromIndex);
    rememberTeamSlotRedHoodPierceCount(toTeamKey, toIndex);
  } else {
    toTeam[toIndex] = fromCharacter;
    toSpeeds[toIndex] = fromSpeed;
    toUniversalCharges[toIndex] = fromUniversalCharge;
    toPierceCounts[toIndex] = fromPierceCount;
    toCounterEnabled[toIndex] = fromCounterState;
    fromTeam[fromIndex] = null;
    fromSpeeds[fromIndex] = 0;
    fromUniversalCharges[fromIndex] = 0;
    fromPierceCounts[fromIndex] = 0;
    fromCounterEnabled[fromIndex] = true;
    rememberTeamSlotChargeSpeed(toTeamKey, toIndex);
    rememberTeamSlotRedHoodPierceCount(toTeamKey, toIndex);
  }

  setActiveTeam(toTeamKey);
  normalizeJackalLink(fromTeamKey);
  normalizeJackalLink(toTeamKey);
  openSlotSettings = null;
  saveTeam();
  render();
}

function clearTeam() {
  state.defenseTeam = Array(TEAM_SIZE).fill(null);
  state.defenseChargeSpeeds = Array(TEAM_SIZE).fill(0);
  state.defenseUniversalCharges = Array(TEAM_SIZE).fill(0);
  state.defenseRedHoodPierceCounts = Array(TEAM_SIZE).fill(0);
  state.defenseScarletCounterEnabled = Array(TEAM_SIZE).fill(true);
  state.team = Array(TEAM_SIZE).fill(null);
  state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
  state.universalCharges = Array(TEAM_SIZE).fill(0);
  state.redHoodPierceCounts = Array(TEAM_SIZE).fill(0);
  state.scarletCounterEnabled = Array(TEAM_SIZE).fill(true);
  normalizeJackalLinks();
  openSlotSettings = null;
  saveTeam();
  render();
}

function swapBattleTeams() {
  rememberTeamChargeSpeeds("defense");
  rememberTeamChargeSpeeds("attack");
  rememberTeamRedHoodPierceCounts("defense");
  rememberTeamRedHoodPierceCounts("attack");

  [state.defenseTeam, state.team] = [state.team, state.defenseTeam];
  [state.defenseUniversalCharges, state.universalCharges] = [state.universalCharges, state.defenseUniversalCharges];
  [state.defenseRedHoodPierceCounts, state.redHoodPierceCounts] = [state.redHoodPierceCounts, state.defenseRedHoodPierceCounts];
  [state.defenseScarletCounterEnabled, state.scarletCounterEnabled] = [state.scarletCounterEnabled, state.defenseScarletCounterEnabled];
  [state.jackalLinks.defense, state.jackalLinks.attack] = [state.jackalLinks.attack, state.jackalLinks.defense];

  applySavedTeamChargeSpeeds("defense");
  applySavedTeamChargeSpeeds("attack");
  applySavedTeamRedHoodPierceCounts("defense");
  applySavedTeamRedHoodPierceCounts("attack");
  normalizeJackalLinks();
  openSlotSettings = null;
  saveTeam();
  render();
}

function switchLineupSlot(index) {
  const nextIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(index) || 0));
  if (nextIndex === state.activeLineupIndex) return;
  saveCurrentLineupSlot();
  state.activeLineupIndex = nextIndex;
  loadLineupSlot(nextIndex);
  openSlotSettings = null;
  saveTeam();
  render();
}

function normalizeSavedCharacterChargeSpeeds(savedSpeeds = {}) {
  return Object.fromEntries(
    Object.entries(savedSpeeds || {})
      .map(([characterId, speed]) => [characterId, sanitizeChargeSpeed(speed)])
      .filter(([characterId]) => getCharacterById(characterId)),
  );
}

function normalizeSavedCharacterFlags(savedFlags = {}) {
  return Object.fromEntries(
    Object.entries(savedFlags || {})
      .map(([characterId, enabled]) => [characterId, Boolean(enabled)])
      .filter(([characterId]) => getCharacterById(characterId)),
  );
}

function normalizeSavedCharacterRedHoodPierceCounts(savedCounts = {}) {
  return Object.fromEntries(
    Object.entries(savedCounts || {})
      .map(([characterId, count]) => [characterId, sanitizeRedHoodPierceCount(count)])
      .filter(([characterId]) => getCharacterById(characterId)),
  );
}

function rememberLoadedTeamChargeSpeeds(teamKey) {
  getTeamState(teamKey).forEach((character, index) => {
    if (character) {
      saveCharacterChargeSpeed(character, getChargeSpeedState(teamKey)[index], teamKey);
    }
  });
}

function rememberLoadedTeamRedHoodPierceCounts(teamKey) {
  getTeamState(teamKey).forEach((character, index) => {
    if (character && isRedHood(character) && !hasSavedCharacterRedHoodPierceCount(character, teamKey)) {
      saveCharacterRedHoodPierceCount(character, getRedHoodPierceCountState(teamKey)[index], teamKey);
    }
  });
}

function saveTeam() {
  normalizeJackalLinks();
  saveCurrentLineupSlot();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      defenseTeam: state.defenseTeam.map((character) => character?.id || null),
      defenseChargeSpeeds: state.defenseChargeSpeeds,
      defenseUniversalCharges: [...state.defenseUniversalCharges],
      defenseRedHoodPierceCounts: [...state.defenseRedHoodPierceCounts],
      defenseScarletCounterEnabled: [...state.defenseScarletCounterEnabled],
      team: state.team.map((character) => character?.id || null),
      chargeSpeeds: state.chargeSpeeds,
      universalCharges: [...state.universalCharges],
      redHoodPierceCounts: [...state.redHoodPierceCounts],
      scarletCounterEnabled: [...state.scarletCounterEnabled],
      characterChargeSpeeds: state.characterChargeSpeeds,
      characterQuantumCubes: state.characterQuantumCubes,
      characterRedHoodPierceCounts: state.characterRedHoodPierceCounts,
      activeLineupIndex: state.activeLineupIndex,
      lineupSlots: state.lineupSlots,
      jackalLinks: state.jackalLinks,
      compactAvatarIcons: state.compactAvatarIcons,
      filters: state.filters,
      activeTeamKey: state.activeTeamKey,
    }),
  );
}

function loadTeam() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.defenseTeam = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(saved.defenseTeam?.[index]));
      state.defenseChargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => Number(saved.defenseChargeSpeeds?.[index]) || 0);
      state.defenseUniversalCharges = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(saved.defenseUniversalCharges?.[index]));
      state.defenseRedHoodPierceCounts = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(saved.defenseRedHoodPierceCounts?.[index]));
      state.defenseScarletCounterEnabled = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(saved.defenseScarletCounterEnabled?.[index]));
      state.team = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(saved.team?.[index]));
      state.chargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => Number(saved.chargeSpeeds?.[index]) || 0);
      state.universalCharges = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(saved.universalCharges?.[index]));
      state.redHoodPierceCounts = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(saved.redHoodPierceCounts?.[index]));
      state.scarletCounterEnabled = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(saved.scarletCounterEnabled?.[index]));
      state.characterChargeSpeeds = {
        defense: normalizeSavedCharacterChargeSpeeds(saved.characterChargeSpeeds?.defense),
        attack: normalizeSavedCharacterChargeSpeeds(saved.characterChargeSpeeds?.attack),
      };
      state.characterQuantumCubes = {
        defense: normalizeSavedCharacterFlags(saved.characterQuantumCubes?.defense),
        attack: normalizeSavedCharacterFlags(saved.characterQuantumCubes?.attack),
      };
      state.characterRedHoodPierceCounts = {
        defense: normalizeSavedCharacterRedHoodPierceCounts(saved.characterRedHoodPierceCounts?.defense),
        attack: normalizeSavedCharacterRedHoodPierceCounts(saved.characterRedHoodPierceCounts?.attack),
      };
      state.jackalLinks = {
        defense: {
          enabled: Boolean(saved.jackalLinks?.defense?.enabled),
          ownerId: saved.jackalLinks?.defense?.ownerId || null,
          targetIds: Array.isArray(saved.jackalLinks?.defense?.targetIds) ? saved.jackalLinks.defense.targetIds : [],
        },
        attack: {
          enabled: Boolean(saved.jackalLinks?.attack?.enabled),
          ownerId: saved.jackalLinks?.attack?.ownerId || null,
          targetIds: Array.isArray(saved.jackalLinks?.attack?.targetIds) ? saved.jackalLinks.attack.targetIds : [],
        },
      };
      state.activeLineupIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(saved.activeLineupIndex) || 0));
      state.lineupSlots = normalizeLineupSlots(saved.lineupSlots);
      if (Array.isArray(saved.lineupSlots)) {
        loadLineupSlot(state.activeLineupIndex);
      } else {
        saveCurrentLineupSlot();
      }
      state.compactAvatarIcons = saved.compactAvatarIcons !== false;
      state.filters = {
        ...state.filters,
        ...(saved.filters && typeof saved.filters === "object" ? saved.filters : {}),
        common: saved.filters?.common === "all" ? "all" : "common",
        region: saved.filters?.region === "global" ? "global" : "cn",
        stage: normalizeStageFilter(saved.filters?.stage),
        search: typeof saved.filters?.search === "string" ? saved.filters.search : "",
      };
      rememberLoadedTeamChargeSpeeds("defense");
      rememberLoadedTeamChargeSpeeds("attack");
      rememberLoadedTeamRedHoodPierceCounts("defense");
      rememberLoadedTeamRedHoodPierceCounts("attack");
      normalizeJackalLinks();
      setActiveTeam(saved.activeTeamKey || "attack");
      return;
    }

    const legacyIds = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "[]");
    if (Array.isArray(legacyIds)) {
      state.team = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(legacyIds[index]));
      saveCurrentLineupSlot();
    }
  } catch {
    state.defenseTeam = Array(TEAM_SIZE).fill(null);
    state.defenseChargeSpeeds = Array(TEAM_SIZE).fill(0);
    state.defenseUniversalCharges = Array(TEAM_SIZE).fill(0);
    state.defenseRedHoodPierceCounts = Array(TEAM_SIZE).fill(0);
    state.defenseScarletCounterEnabled = Array(TEAM_SIZE).fill(true);
    state.team = Array(TEAM_SIZE).fill(null);
    state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
    state.universalCharges = Array(TEAM_SIZE).fill(0);
    state.redHoodPierceCounts = Array(TEAM_SIZE).fill(0);
    state.scarletCounterEnabled = Array(TEAM_SIZE).fill(true);
    state.characterChargeSpeeds = { defense: {}, attack: {} };
    state.characterQuantumCubes = { defense: {}, attack: {} };
    state.activeLineupIndex = 0;
    state.lineupSlots = Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyLineupSlot());
    state.jackalLinks = {
      defense: { enabled: false, ownerId: null, targetIds: [] },
      attack: { enabled: false, ownerId: null, targetIds: [] },
    };
  }
}

let toastTimer = null;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through for file:// or permission-limited contexts.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("copy command failed");
}

function isTextEditingElement(element = document.activeElement) {
  if (!element) return false;
  const tagName = element.tagName?.toLowerCase();
  if (tagName === "textarea") return true;
  if (element.isContentEditable) return true;
  if (tagName !== "input") return false;
  const type = String(element.type || "text").toLowerCase();
  return ["text", "search", "number", "decimal", "tel", "url", "email", "password"].includes(type);
}

function scheduleResponsiveRender() {
  if (resizeRenderId) cancelAnimationFrame(resizeRenderId);
  resizeRenderId = requestAnimationFrame(() => {
    resizeRenderId = null;
    if (isTextEditingElement()) return;
    render();
  });
}

async function copyCharacterDetails(character) {
  try {
    await copyTextToClipboard(getCharacterDetailText(character));
    showToast(`已复制 ${character.name} 的详细信息`);
  } catch {
    showToast("复制失败，请检查浏览器剪切板权限");
  }
}

async function copyBattleResultsSummary() {
  const text = getBattleResultsCopyText();
  if (!text) {
    showToast("队伍为空，无法复制结果");
    return;
  }
  try {
    await copyTextToClipboard(text);
    showToast("已复制双方队伍信息");
  } catch {
    showToast("复制失败，请检查浏览器剪切板权限");
  }
}

function bindEvents() {
  els.helpButton.addEventListener("click", openHelpModal);
  els.clearTeamButton.addEventListener("click", clearTeam);
  els.copyTeamButton.addEventListener("click", copyBattleResultsSummary);
  els.swapTeamButton.addEventListener("click", swapBattleTeams);
  els.lineupSlots.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lineup-index]");
    if (!button) return;
    switchLineupSlot(Number(button.dataset.lineupIndex));
  });
  els.chargeChart.addEventListener("mousemove", showNearestChartTooltip);
  els.chargeChart.addEventListener("mouseleave", hideChartTooltip);
  window.addEventListener("resize", scheduleResponsiveRender);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isHelpModalOpen) closeHelpModal();
  });
  els.commonToggle.addEventListener("change", (event) => {
    state.filters.common = event.target.checked ? "common" : "all";
    saveTeam();
    renderCharacters();
  });
  els.regionToggle.addEventListener("change", (event) => {
    state.filters.region = event.target.checked ? "cn" : "global";
    saveTeam();
    renderCharacters();
  });
  els.compactAvatarToggle.addEventListener("change", (event) => {
    state.compactAvatarIcons = event.target.checked;
    saveTeam();
    renderCharacters();
  });
  els.stageFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const stage = normalizeStageFilter(button.dataset.stageFilter);
      state.filters.stage = state.filters.stage === stage ? "all" : stage;
      saveTeam();
      renderCharacters();
      syncFilterControls();
    });
  });
  els.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    saveTeam();
    renderCharacters();
  });
}

function updateSortSummary() {
  const filters = [];
  const stage = normalizeStageFilter(state.filters.stage);
  if (stage !== "all") filters.push(`爆裂${stage.replace("B", "")}`);
  if (state.filters.common === "common") filters.push("常用");
  if (state.filters.region === "cn") filters.push("国服");
  if (state.compactAvatarIcons) filters.push("简化图标");
  els.sortSummary.textContent = "排序：";
  const sortText = document.createElement("strong");
  sortText.textContent = "充能从高到低";
  els.sortSummary.append(sortText);
  filters.forEach((filter) => {
    const dot = document.createElement("span");
    dot.className = "sort-dot";
    dot.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = filter;
    els.sortSummary.append(dot, label);
  });
}

function syncFilterControls() {
  els.commonToggle.checked = state.filters.common === "common";
  els.regionToggle.checked = state.filters.region === "cn";
  els.compactAvatarToggle.checked = state.compactAvatarIcons;
  els.stageFilterButtons.forEach((button) => {
    const isActive = normalizeStageFilter(state.filters.stage) === button.dataset.stageFilter;
    button.setAttribute("aria-pressed", String(isActive));
  });
  els.searchInput.value = state.filters.search;
  updateSortSummary();
}

async function bootstrap() {
  await loadCharacterData();
  bindEvents();
  loadTeam();
  syncFilterControls();
  render();
}

bootstrap().catch((error) => {
  console.error(error);
  els.toast.textContent = error?.message || "初始化失败";
  els.toast.classList.add("show");
});
