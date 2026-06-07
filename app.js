const FRAMES_PER_SECOND = 60;
const TEAM_SIZE = 5;
const ENEMY_TEAM_SIZE = 5;
const LINEUP_SLOT_COUNT = 10;
const PAID_ARENA_TEAM_COUNTS = { c: 5, p: 3 };
const BATTLE_POWER_ADVANTAGE_RATE = 0.154;
const DEFAULT_RL_TARGET_INDEX = 0;
const BURST_EPSILON = 1e-6;
const BURST_STAGE_INTERVAL_FRAMES = 32;
const BURST_START_DELAY_BY_REGION = {
  cn: 24,
  global: 26,
};
const STORAGE_KEY = "nikke-arena-charge-team-v2";
const LEGACY_STORAGE_KEY = "nikke-arena-charge-team-v1";
const PAID_DEV_ACCESS_KEY = "nikke-paid-dev-access";
const THEME_STORAGE_KEY = "nikke-arena-theme";
const HELP_INTRO_STORAGE_KEY = "nikke-help-intro-seen-v1";
const LOCAL_PAID_API_URL = "http://localhost:8787/api/paid/miss-inference";
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
const VESTI_TACTICAL_PROJECTILE_FLIGHT_FRAMES = 12;
const VESTI_TACTICAL_GUIDE_FRAMES = 2;
const VESTI_TACTICAL_HIT_OFFSETS = [0, 22, 44, 66];
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
const ROSANNA_SACRIFICE_CHARGE = 36.54;
const RED_HOOD_CHARGE_SPEED_PER_ATTACK = 3.81;
const RED_HOOD_MAX_CHARGE_SPEED_STACKS = 10;
const MISS_DODGE_WINDOW_FRAMES = 6;
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
const CHARGE_SPEED_ENTRY_OPTIONS = [0, 1.98, 2.28, 2.57, 2.86, 3.16, 3.45, 3.75, 4.04, 4.33, 4.63, 4.92, 5.21, 5.51, 5.8, 6.09];
const CHARGE_SPEED_ENTRY_COUNT = 4;
const CUBE_TYPE_NONE = "none";
const CUBE_TYPE_CHARGE_SPEED = "charge-speed";
const CUBE_TYPE_QUANTUM = "quantum";
const CHARGE_SPEED_CUBE_VALUE = 2.12;
const MG_SUSTAIN_START_FRAME = 182;
const MG_SUSTAIN_INTERVAL_FRAMES = 2;
const CHANGELOG_ITEMS = [
  "冠军特殊竞技场增加10套方案",
  "区分国服国际服爆裂开启帧",
  "移除渡鸦转身空枪判定",
  "更新渡鸦中毒充能逻辑",
  "修正超阿充能补充逻辑",
  "统一RL飞行帧站位减少规则",
  "更新阿妮斯超级巨星充能光环",
  "优化战贝充能计算说明",
  "修正战贝额外伤害和转身",
  "更新战贝引导连射逻辑",
];
const QUANTUM_RELIC_CUBE_MULTIPLIER = 1.0466;
const ANIS_SUPERSTAR_CHARGE_SUPPLEMENT_RATE = 0.06;

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
  defenseRosannaSacrificeFrames: Array(TEAM_SIZE).fill(null),
  team: Array(TEAM_SIZE).fill(null),
  chargeSpeeds: Array(TEAM_SIZE).fill(0),
  universalCharges: Array(TEAM_SIZE).fill(0),
  redHoodPierceCounts: Array(TEAM_SIZE).fill(0),
  scarletCounterEnabled: Array(TEAM_SIZE).fill(true),
  rosannaSacrificeFrames: Array(TEAM_SIZE).fill(null),
  characterChargeSpeeds: {
    defense: {},
    attack: {},
  },
  characterChargeSpeedEntries: {
    defense: {},
    attack: {},
  },
  characterQuantumCubes: {
    defense: {},
    attack: {},
  },
  characterCubeTypes: {
    defense: {},
    attack: {},
  },
  characterMagazines: {
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
  paidArenaMode: "normal",
  paidArenaActiveRowIndex: 0,
  paidArenaActiveLineupIndex: {
    c: 0,
    p: 0,
  },
  paidArenaDataTeamKey: "attack",
  paidArenaTeams: {
    c: createEmptyPaidArenaTeams("c"),
    p: createEmptyPaidArenaTeams("p"),
  },
  paidArenaLineupSlots: {
    c: Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyPaidArenaLineupSlot("c")),
    p: Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyPaidArenaLineupSlot("p")),
  },
  paidArenaUniversalCharges: {
    c: createEmptyPaidArenaUniversalCharges("c"),
    p: createEmptyPaidArenaUniversalCharges("p"),
  },
  paidArenaChargeSpeeds: {
    c: createEmptyPaidArenaChargeSpeeds("c"),
    p: createEmptyPaidArenaChargeSpeeds("p"),
  },
  paidArenaRosannaSacrificeFrames: {
    c: createEmptyPaidArenaRosannaSacrificeFrames("c"),
    p: createEmptyPaidArenaRosannaSacrificeFrames("p"),
  },
  allowMissedShots: true,
  battlePowerBase: 0,
  testMode: false,
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
  appVersion: document.querySelector("#appVersion"),
  paidInferenceButton: document.querySelector("#paidInferenceButton"),
  paidCModeButton: document.querySelector("#paidCModeButton"),
  paidPModeButton: document.querySelector("#paidPModeButton"),
  clearTeamButton: document.querySelector("#clearTeamButton"),
  copyTeamButton: document.querySelector("#copyTeamButton"),
  swapTeamButton: document.querySelector("#swapTeamButton"),
  allowMissedShotsToggle: document.querySelector("#allowMissedShotsToggle"),
  battlePowerBaseInput: document.querySelector("#battlePowerBaseInput"),
  battlePowerDefense: document.querySelector("#battlePowerDefense"),
  battlePowerAttack: document.querySelector("#battlePowerAttack"),
  commonToggle: document.querySelector("#commonToggle"),
  regionToggle: document.querySelector("#regionToggle"),
  compactAvatarToggle: document.querySelector("#compactAvatarToggle"),
  stageFilterButtons: document.querySelectorAll("[data-stage-filter]"),
  searchInput: document.querySelector("#searchInput"),
  sidebarMenuButton: document.querySelector("#sidebarMenuButton"),
  appSidebar: document.querySelector("#appSidebar"),
  appSidebarBackdrop: document.querySelector("#appSidebarBackdrop"),
  sidebarCloseButton: document.querySelector("#sidebarCloseButton"),
  changelogButton: document.querySelector("#changelogButton"),
  sidebarHelpButton: document.querySelector("#sidebarHelpButton"),
  themeToggleButton: document.querySelector("#themeToggleButton"),
  helpButton: document.querySelector("#helpButton"),
  toast: document.querySelector("#toast"),
  summaryStrip: document.querySelector("#summaryStrip"),
  sortSummary: document.querySelector("#sortSummary"),
  listCount: document.querySelector("#listCount"),
};

let draggedTeamIndex = null;
let draggedTeamKey = null;
let draggedPaidArenaRowIndex = null;
let draggedLineupIndex = null;
let pointerTeamDrag = null;
let suppressTeamSlotClick = false;
let suppressLineupClick = false;
let resizeRenderId = null;
let openSlotSettings = null;
let openRosannaSacrificeSettings = null;
let isHelpModalOpen = false;
let isSidebarOpen = false;
const localPaidInferenceState = {
  result: null,
  error: "",
  loading: false,
  requestSignature: "",
  refreshTimer: null,
};

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
      const isChargeWeapon = canEditChargeSpeed(character);
      const prefix = finishingPositions.has(index) && canShowFinishMarker(character) ? "*" : "";
      const name = `${prefix}${character.name}`;
      return isChargeWeapon && chargeSpeed > 0 ? `${name}(${chargeSpeed})` : name;
    })
    .join("，");
}

function canShowFinishMarker(character) {
  return character && ["RL", "SR"].includes(character.weapon);
}

function isPascal(character) {
  return character?.name === "帕斯卡" || character?.enName === "Pascal";
}

function isSnowWhiteHeavyArms(character) {
  return character?.id === 3 || character?.enName === "Snow White: Heavy Arms";
}

function canApplyChargeSpeed(character) {
  return canShowFinishMarker(character) && !isPascal(character) && !isSnowWhiteHeavyArms(character);
}

function canEditChargeSpeed(character) {
  return canApplyChargeSpeed(character);
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

function getBurstStartDelayFrames(region = state.filters.region) {
  return BURST_START_DELAY_BY_REGION[region === "global" ? "global" : "cn"];
}

function getBurstStageFrame(fullFrame, stageIndex, region = state.filters.region) {
  return fullFrame + getBurstStartDelayFrames(region) + Math.max(0, stageIndex - 1) * BURST_STAGE_INTERVAL_FRAMES;
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

function getPaidArenaCopyText() {
  if (!isPaidArenaModeActive()) return "";
  const teams = getPaidArenaTeams();
  const universalRows = getPaidArenaUniversalCharges();
  const sacrificeRows = getPaidArenaRosannaSacrificeFrames();
  const dataTeamKey = getPaidArenaDataTeamKey();
  const dataSourceLabel = getPaidArenaSelectedDataTeamKey() === "defense" ? "防守数据" : "进攻数据";
  const rows = teams.map((team, rowIndex) => {
    const universalCharges = universalRows[rowIndex] || Array(TEAM_SIZE).fill(0);
    const sacrificeFrames = sacrificeRows[rowIndex] || Array(TEAM_SIZE).fill(null);
    const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, dataTeamKey);
    const members = Array.from({ length: TEAM_SIZE }, (_, index) => {
      const character = team[index];
      const universalCharge = sanitizeUniversalCharge(universalCharges[index]);
      if (character) {
        const chargeSpeed = sanitizeChargeSpeed(chargeSpeeds[index]);
        if (chargeSpeed > 0 && canEditChargeSpeed(character)) return `${character.name}(${chargeSpeed})`;
        return character.name;
      }
      return universalCharge > 0 ? `充${formatNumber(universalCharge, 2)}%` : "空";
    }).join("，");
    return `第${rowIndex + 1}队：${members}\n${getPaidArenaResultText(team, universalCharges, chargeSpeeds, null, sacrificeFrames)}`;
  });
  return [`${getPaidArenaModeLabel()}（${dataSourceLabel}）`, ...rows].join("\n\n");
}

function getArenaCopyText() {
  return isPaidArenaModeActive() ? getPaidArenaCopyText() : getBattleResultsCopyText();
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

function sanitizeSacrificeFrame(value) {
  if (value === null || value === undefined || value === "") return null;
  const frame = Math.floor(Number(value));
  return Number.isFinite(frame) && frame >= 0 && frame <= CHART_MAX_FRAME ? frame : null;
}

function getRosannaSacrificeFrameState(teamKey = state.activeTeamKey) {
  return normalizeTeamKey(teamKey) === "defense" ? state.defenseRosannaSacrificeFrames : state.rosannaSacrificeFrames;
}

function createEmptyLineupSlot() {
  return {
    defenseTeam: Array(TEAM_SIZE).fill(null),
    defenseUniversalCharges: Array(TEAM_SIZE).fill(0),
    defenseRedHoodPierceCounts: Array(TEAM_SIZE).fill(0),
    defenseScarletCounterEnabled: Array(TEAM_SIZE).fill(true),
    defenseRosannaSacrificeFrames: Array(TEAM_SIZE).fill(null),
    team: Array(TEAM_SIZE).fill(null),
    universalCharges: Array(TEAM_SIZE).fill(0),
    redHoodPierceCounts: Array(TEAM_SIZE).fill(0),
    scarletCounterEnabled: Array(TEAM_SIZE).fill(true),
    rosannaSacrificeFrames: Array(TEAM_SIZE).fill(null),
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
    defenseRosannaSacrificeFrames: [...state.defenseRosannaSacrificeFrames],
    team: state.team.map((character) => character?.id || null),
    universalCharges: [...state.universalCharges],
    redHoodPierceCounts: [...state.redHoodPierceCounts],
    scarletCounterEnabled: [...state.scarletCounterEnabled],
    rosannaSacrificeFrames: [...state.rosannaSacrificeFrames],
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
    defenseRosannaSacrificeFrames: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeSacrificeFrame(slot.defenseRosannaSacrificeFrames?.[index])),
    team: Array.from({ length: TEAM_SIZE }, (_, index) => slot.team?.[index] ?? empty.team[index]),
    universalCharges: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(slot.universalCharges?.[index])),
    redHoodPierceCounts: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(slot.redHoodPierceCounts?.[index])),
    scarletCounterEnabled: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(slot.scarletCounterEnabled?.[index])),
    rosannaSacrificeFrames: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeSacrificeFrame(slot.rosannaSacrificeFrames?.[index])),
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

function cloneLineupSlot(slot = {}) {
  return normalizeLineupSlot(JSON.parse(JSON.stringify(normalizeLineupSlot(slot))));
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
  state.defenseRosannaSacrificeFrames = [...slot.defenseRosannaSacrificeFrames];
  state.team = Array.from({ length: TEAM_SIZE }, (_, slotIndex) => getCharacterById(slot.team[slotIndex]));
  state.universalCharges = [...slot.universalCharges];
  state.redHoodPierceCounts = [...slot.redHoodPierceCounts];
  state.scarletCounterEnabled = [...slot.scarletCounterEnabled];
  state.rosannaSacrificeFrames = [...slot.rosannaSacrificeFrames];
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

function getCharacterChargeSpeedEntryMemory(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.characterChargeSpeedEntries[normalizedTeamKey]) {
    state.characterChargeSpeedEntries[normalizedTeamKey] = {};
  }
  return state.characterChargeSpeedEntries[normalizedTeamKey];
}

function getCharacterQuantumCubeMemory(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.characterQuantumCubes[normalizedTeamKey]) {
    state.characterQuantumCubes[normalizedTeamKey] = {};
  }
  return state.characterQuantumCubes[normalizedTeamKey];
}

function getCharacterCubeTypeMemory(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.characterCubeTypes[normalizedTeamKey]) {
    state.characterCubeTypes[normalizedTeamKey] = {};
  }
  return state.characterCubeTypes[normalizedTeamKey];
}

function getCharacterMagazineMemory(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.characterMagazines[normalizedTeamKey]) {
    state.characterMagazines[normalizedTeamKey] = {};
  }
  return state.characterMagazines[normalizedTeamKey];
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

function sanitizeChargeSpeedEntry(value) {
  const numeric = Number(value) || 0;
  return CHARGE_SPEED_ENTRY_OPTIONS.find((option) => Math.abs(option - numeric) < 0.001) ?? 0;
}

function normalizeChargeSpeedEntries(entries = []) {
  return Array.from({ length: CHARGE_SPEED_ENTRY_COUNT }, (_, index) => sanitizeChargeSpeedEntry(entries?.[index]));
}

function calculateChargeSpeedFromEntries(entries = []) {
  const normalizedEntries = normalizeChargeSpeedEntries(entries).filter((value) => value > 0);
  const grouped = new Map();
  normalizedEntries.forEach((value) => {
    const key = value.toFixed(2);
    grouped.set(key, (grouped.get(key) || 0) + value);
  });
  return [...grouped.values()].reduce((sum, value) => sum + Math.round(value), 0);
}

function sanitizeCubeType(value) {
  return [CUBE_TYPE_CHARGE_SPEED, CUBE_TYPE_QUANTUM].includes(value) ? value : CUBE_TYPE_NONE;
}

function sanitizeCharacterCubeType(character, value) {
  const cubeType = sanitizeCubeType(value);
  if (cubeType === CUBE_TYPE_CHARGE_SPEED && !canEditChargeSpeed(character)) return CUBE_TYPE_NONE;
  return cubeType;
}

function getChargeSpeedCubeBonus(cubeType) {
  return sanitizeCubeType(cubeType) === CUBE_TYPE_CHARGE_SPEED ? Math.round(CHARGE_SPEED_CUBE_VALUE) : 0;
}

function calculateChargeSpeedFromEntriesAndCube(entries = [], cubeType = CUBE_TYPE_NONE) {
  return calculateChargeSpeedFromEntries(entries) + getChargeSpeedCubeBonus(cubeType);
}

function hasChargeSpeedEntries(entries = []) {
  return normalizeChargeSpeedEntries(entries).some((entry) => entry > 0);
}

function formatChargeSpeedEntry(value) {
  return `${sanitizeChargeSpeedEntry(value).toFixed(2)}%`;
}

function sanitizeMagazine(value) {
  const magazine = Math.floor(Number(value) || 0);
  if (magazine === 20) return 20;
  if (magazine < 26) return 20;
  return Math.min(88, magazine);
}

function parseCompleteMagazine(value) {
  const magazine = Math.floor(Number(value));
  if (!Number.isFinite(magazine)) return null;
  if (magazine === 20) return 20;
  if (magazine >= 26 && magazine <= 88) return magazine;
  return null;
}

function getSavedCharacterChargeSpeed(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return 0;
  return sanitizeChargeSpeed(getCharacterChargeSpeedMemory(teamKey)[character.id]);
}

function saveCharacterChargeSpeed(character, value, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  getCharacterChargeSpeedMemory(teamKey)[character.id] = sanitizeChargeSpeed(value);
}

function getSavedCharacterChargeSpeedEntries(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return normalizeChargeSpeedEntries();
  const entries = getCharacterChargeSpeedEntryMemory(teamKey)[character.id];
  return normalizeChargeSpeedEntries(entries);
}

function saveCharacterChargeSpeedEntries(character, entries, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  const normalizedEntries = normalizeChargeSpeedEntries(entries);
  const speed = calculateChargeSpeedFromEntriesAndCube(normalizedEntries, getSavedCharacterCubeType(character, teamKey));
  getCharacterChargeSpeedEntryMemory(teamKey)[character.id] = normalizedEntries;
  saveCharacterChargeSpeed(character, speed, teamKey);
}

function resetCharacterChargeSpeed(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  delete getCharacterChargeSpeedMemory(teamKey)[character.id];
  delete getCharacterChargeSpeedEntryMemory(teamKey)[character.id];
}

function getSavedCharacterQuantumCube(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return false;
  return getSavedCharacterCubeType(character, teamKey) === CUBE_TYPE_QUANTUM;
}

function saveCharacterQuantumCube(character, enabled, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  saveCharacterCubeType(character, enabled ? CUBE_TYPE_QUANTUM : CUBE_TYPE_NONE, teamKey);
}

function resetCharacterQuantumCube(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  delete getCharacterQuantumCubeMemory(teamKey)[character.id];
  delete getCharacterCubeTypeMemory(teamKey)[character.id];
}

function getSavedCharacterCubeType(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return CUBE_TYPE_NONE;
  const cubeType = sanitizeCharacterCubeType(character, getCharacterCubeTypeMemory(teamKey)[character.id]);
  if (cubeType !== CUBE_TYPE_NONE) return cubeType;
  return Boolean(getCharacterQuantumCubeMemory(teamKey)[character.id]) ? CUBE_TYPE_QUANTUM : CUBE_TYPE_NONE;
}

function getCubeIconSrc(cubeType) {
  const normalizedCubeType = sanitizeCubeType(cubeType);
  if (normalizedCubeType === CUBE_TYPE_CHARGE_SPEED) return "assets/icons/ui/cubes/charge-speed.png";
  if (normalizedCubeType === CUBE_TYPE_QUANTUM) return "assets/icons/ui/cubes/quantum.png";
  return "";
}

function saveCharacterCubeType(character, cubeType, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  const previousCubeType = getSavedCharacterCubeType(character, teamKey);
  const previousChargeSpeed = getSavedCharacterChargeSpeed(character, teamKey);
  const normalizedCubeType = sanitizeCharacterCubeType(character, cubeType);
  const cubeMemory = getCharacterCubeTypeMemory(teamKey);
  const quantumMemory = getCharacterQuantumCubeMemory(teamKey);
  if (normalizedCubeType === CUBE_TYPE_NONE) {
    delete cubeMemory[character.id];
    delete quantumMemory[character.id];
  } else {
    cubeMemory[character.id] = normalizedCubeType;
    quantumMemory[character.id] = normalizedCubeType === CUBE_TYPE_QUANTUM;
  }
  const entries = getSavedCharacterChargeSpeedEntries(character, teamKey);
  if (hasChargeSpeedEntries(entries) || getSavedCharacterChargeSpeed(character, teamKey) === 0) {
    saveCharacterChargeSpeedEntries(character, entries, teamKey);
  } else {
    const bonusDelta = getChargeSpeedCubeBonus(normalizedCubeType) - getChargeSpeedCubeBonus(previousCubeType);
    saveCharacterChargeSpeed(character, Math.max(0, previousChargeSpeed + bonusDelta), teamKey);
  }
}

function getSavedCharacterMagazine(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return null;
  const memory = getCharacterMagazineMemory(teamKey);
  if (!Object.prototype.hasOwnProperty.call(memory, character.id)) return null;
  const magazine = sanitizeMagazine(memory[character.id]);
  return magazine > 0 ? magazine : null;
}

function getDisplayMagazine(character, teamKey = state.activeTeamKey) {
  if (!state.allowMissedShots || !isScarlet(character)) return null;
  return getSavedCharacterMagazine(character, teamKey) || sanitizeMagazine(character.stats?.magazine);
}

function saveCharacterMagazine(character, value, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  getCharacterMagazineMemory(teamKey)[character.id] = sanitizeMagazine(value);
}

function resetCharacterMagazine(character, teamKey = state.activeTeamKey) {
  if (!character?.id) return;
  delete getCharacterMagazineMemory(teamKey)[character.id];
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

function isLaplace(character) {
  return character?.id === 33 || character?.name === "拉普拉斯" || character?.slug === "拉普拉斯";
}

function isVestiTacticalUpgrade(character) {
  return (
    character?.id === 87 ||
    character?.enName === "Vesti: Tactical Upgrade" ||
    (String(character?.slug || "").includes("贝斯蒂") && String(character?.slug || "").includes("战术升级"))
  );
}

function isRaven(character) {
  return character?.id === 59 || character?.enName === "Raven";
}

function isAnisSuperstar(character) {
  return character?.id === 2 || character?.enName === "Anis: Star";
}

function getAnisSuperstarSupplementValue(team = []) {
  const anis = team.find((member) => member && isAnisSuperstar(member));
  return anis ? (Number(anis.burstGen) || 0) * ANIS_SUPERSTAR_CHARGE_SUPPLEMENT_RATE : 0;
}

function getRlProjectileFlightBaseFrames(character) {
  if (Number.isFinite(character.projectileFlightBaseFrames)) return character.projectileFlightBaseFrames;
  return character.timing?.projectileFlightFramesByPosition?.P1 ?? 16;
}

function getRlProjectileFlightReduction(positionIndex, teamKey = "attack", arenaMode = state.paidArenaMode) {
  if (arenaMode === "c") return positionIndex <= 1 ? 0 : 2;
  if (normalizeTeamKey(teamKey) === "defense") {
    if (positionIndex <= 1) return 0;
    if (positionIndex <= 3) return 2;
    return 4;
  }
  return positionIndex <= 1 ? 0 : 2;
}

function isTargetingP5Cinderella(character, targetPositionIndex, opponentTeam = []) {
  return (
    character?.weapon === "SR" &&
    targetPositionIndex === ENEMY_TEAM_SIZE - 1 &&
    isCinderella(opponentTeam?.[targetPositionIndex])
  );
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
  if (isVestiTacticalUpgrade(character)) return VESTI_TACTICAL_PROJECTILE_FLIGHT_FRAMES;
  if (Number.isFinite(character.projectileFlightFrames)) return character.projectileFlightFrames;
  return Math.max(0, getRlProjectileFlightBaseFrames(character) - getRlProjectileFlightReduction(positionIndex, teamKey));
}

function getChargeFrames(character, positionIndex, teamKey = "attack") {
  const speed = canApplyChargeSpeed(character) ? Number(character.chargeSpeedPercent) || 0 : 0;

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

    if (
      character.weapon === "RL" &&
      (character.timing.projectileFlightFramesByPosition ||
        Number.isFinite(character.projectileFlightFrames) ||
        Number.isFinite(character.projectileFlightBaseFrames))
    ) {
      const flightFrames = getRlProjectileFlightFrames(character, positionIndex, teamKey);
      if (isVestiTacticalUpgrade(character)) {
        return {
          firstFrame: chargeFrames + VESTI_TACTICAL_GUIDE_FRAMES + flightFrames,
          interval: chargeFrames + VESTI_TACTICAL_GUIDE_FRAMES + VESTI_TACTICAL_HIT_OFFSETS.at(-1),
          reloadInterval: null,
          chargeFrames,
          baseChargeFrames,
          baseIntervalFrames,
          projectileFlightFrames: flightFrames,
        };
      }
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
  if (isRaven(character)) return 5;
  const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
  const start = Math.max(0, DEFAULT_RL_TARGET_INDEX - range);
  const end = Math.min(ENEMY_TEAM_SIZE - 1, DEFAULT_RL_TARGET_INDEX + range);
  return (end - start + 1) * 2;
}

function getEffectiveBurstGen(character) {
  const baseBurstGen = Number(character.burstGen) || 0;
  return baseBurstGen * (character.quantumRelicCubeEnabled ? QUANTUM_RELIC_CUBE_MULTIPLIER : 1);
}

function getBaseChargeUnit(character) {
  const baseCharge = getEffectiveBurstGen(character);
  const baseChargeUnit = character.weapon === "SG" ? baseCharge / 10 : baseCharge;
  return baseChargeUnit + (character.superstarChargeSupplementValue || 0);
}

function hasEffectiveExtraDamage(character) {
  if (isLaplace(character) && state.filters.region === "global") return false;
  return Boolean(character.hasExtraDamage);
}

function getChargeHitMultiplier(character, shotNumber = null) {
  if (isCinderella(character)) return getCinderellaChargeMultiplier(shotNumber);
  if (character.weapon === "RL") return getRlHitSegments(character);
  if (character.weapon === "SG") return 10;
  return 1 + getPenetrationExtraHitCount(character, shotNumber);
}

function getChargeHitLabel(character, hitMultiplier = getChargeHitMultiplier(character), shotNumber = null) {
  if (isCinderella(character)) return `命中：${CINDERELLA_TARGET_HIT_COUNT} hit；充能倍率：4/2/2/2/4/4，之后 2/2/2/2/4/4 循环`;
  const hasExtraDamage = hasEffectiveExtraDamage(character);
  if (character.weapon === "RL") return `爆炸命中${hasExtraDamage ? "+额外伤害" : ""}`;
  if (getPenetrationExtraHitCount(character, shotNumber) > 0) return `命中+穿透${hasExtraDamage ? "+额外伤害" : ""}`;
  return `命中${hasExtraDamage ? "+额外伤害" : ""}`;
}

function getChargeValue(character, shotNumber = null) {
  const coverMultiplier = getChargeHitMultiplier(character, shotNumber);
  const extraMultiplier = hasEffectiveExtraDamage(character) ? 2 : 1;
  return getBaseChargeUnit(character) * coverMultiplier * extraMultiplier + (character.flatBurstBonus || 0);
}

function getDelayedExtraChargeTotal(character) {
  if (isHarran(character)) return 0;
  const extraMultiplier = hasEffectiveExtraDamage(character) ? 2 : 1;
  const baseChargeUnit = getBaseChargeUnit(character);
  return (character.delayedExtraHits || []).reduce(
    (sum, extra) => sum + baseChargeUnit * (Number(extra.segments) || 0) * extraMultiplier,
    0,
  );
}

function getFixedSequenceChargeTotal(character, shotNumber = null) {
  if (isVestiTacticalUpgrade(character)) {
    return getChargeValue(character, shotNumber) * Math.max(0, VESTI_TACTICAL_HIT_OFFSETS.length - 1);
  }
  return 0;
}

function getSingleShotChargeValue(character, shotNumber = null) {
  return getChargeValue(character, shotNumber) + getDelayedExtraChargeTotal(character) + getFixedSequenceChargeTotal(character, shotNumber);
}

function getAttackChargeValue(character, shotNumber = null, hitProfile = null, shotCount = 1) {
  if (!hitProfile || isCinderella(character)) return getChargeValue(character, shotNumber) * shotCount;
  if (hitProfile.p5CinderellaDecoy && character.flatBurstBonus) return (character.flatBurstBonus || 0) * shotCount;
  const actualHitMultiplier = (hitProfile.targetHits || []).reduce((sum, [, hitCount]) => sum + (Number(hitCount) || 0), 0);
  const extraMultiplier = hasEffectiveExtraDamage(character) ? 2 : 1;
  const flatBonus = (character.flatBurstBonus || 0) * shotCount;
  return getBaseChargeUnit(character) * actualHitMultiplier * extraMultiplier + flatBonus;
}

function getDelayedExtraLabel(character) {
  return character?.id === 57 || character?.slug === "哈兰" || character?.name === "哈兰" ? "中毒充能" : "延迟额外";
}

function isHarran(character) {
  return character?.id === 57 || character?.slug === "哈兰" || character?.name === "哈兰";
}

function getHarranPoisonChargeValue(character) {
  return getBaseChargeUnit(character) * (hasEffectiveExtraDamage(character) ? 2 : 1);
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
  const extraMultiplier = hasEffectiveExtraDamage(character) ? 2 : 1;
  const hitLabel = getChargeHitLabel(character, hitMultiplier);
  const baseChargeUnit = getBaseChargeUnit(character);
  const effectiveBurstGen = getEffectiveBurstGen(character);
  const flatBonus = character.flatBurstBonus || 0;
  const superstarSupplementValue = character.superstarChargeSupplementValue || 0;
  const rawBaseChargeUnit = character.weapon === "SG" ? effectiveBurstGen / 10 : effectiveBurstGen;
  const delayedExtraChargeTotal = getDelayedExtraChargeTotal(character);
  const fixedSequenceChargeTotal = getFixedSequenceChargeTotal(character);
  const fixedSequenceMultiplier = isVestiTacticalUpgrade(character) ? VESTI_TACTICAL_HIT_OFFSETS.length : 1;
  const mainChargeFormula = `${formatNumber(baseChargeUnit, 5)} × ${hitMultiplier} × ${extraMultiplier}${
    fixedSequenceMultiplier > 1 ? ` × ${fixedSequenceMultiplier}` : ""
  }`;
  const chargeFormulaParts = [
    mainChargeFormula,
    ...(flatBonus ? [formatNumber(flatBonus, 2)] : []),
    ...(delayedExtraChargeTotal ? [formatNumber(delayedExtraChargeTotal, 2)] : []),
    ...(fixedSequenceChargeTotal && fixedSequenceMultiplier === 1 ? [formatNumber(fixedSequenceChargeTotal, 2)] : []),
  ];
  const lines = [
    `充能计算：${chargeFormulaParts.join(" + ")} = ${formatNumber(getSingleShotChargeValue(character), 2)}%`,
    `基础：${formatNumber(baseChargeUnit, 5)}%${
      character.quantumRelicCubeEnabled || superstarSupplementValue
        ? `（${formatNumber(rawBaseChargeUnit, 5)}${superstarSupplementValue ? ` + ${formatNumber(superstarSupplementValue, 3)} 超阿补充` : ""}${
            character.quantumRelicCubeEnabled ? `；${formatNumber(character.burstGen, 2)} × 1.0466` : ""
          }）`
        : ""
    }`,
    `充能组成：${hitLabel}`,
  ];

  if (hasEffectiveExtraDamage(character)) lines.push("额外伤害 ×2");
  if (superstarSupplementValue) lines.push(`超阿补充：基础 +${formatNumber(superstarSupplementValue, 3)}%`);
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
  if (fixedSequenceChargeTotal) {
    lines.push(`引导连射：蓄力后引导共计${VESTI_TACTICAL_HIT_OFFSETS.length}发`);
  }

  return lines.join("\n");
}

function getCharacterDetailText(character) {
  return [
    `${getCharacterDisplayName(character)}（${character.rarity || "SSR"}）（${character.weapon || "-"}）`,
    `最终单发充能：${formatNumber(getSingleShotChargeValue(character), 2)}%`,
    ...getChargeWeaponDetailLines(character),
    getChargeBreakdown(character),
  ].join("\n");
}

function getCharacterEnglishName(character) {
  const englishName = String(character?.enName || "").trim();
  if (!englishName || englishName === character?.name) return "";
  return englishName;
}

function getCharacterDisplayName(character) {
  const englishName = getCharacterEnglishName(character);
  return englishName ? `${character.name}（${englishName}）` : character.name;
}

function getCharacterSearchText(character) {
  return [character.name, character.enName, character.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
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
      <strong>${escapeHtml(getCharacterDisplayName(character))}</strong>
      <span>可右键复制</span>
    </div>
    <div class="character-tooltip-meta">
      #${index + 1} · ${escapeHtml(character.rarity || "SSR")} · ${escapeHtml(character.weapon)} · ${escapeHtml(character.burstStage)} · ${escapeHtml(getRegionLabel(character))}
    </div>
    <div class="character-tooltip-main">最终单发 ${formatNumber(getSingleShotChargeValue(character), 2)}%</div>
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

function canUseHoverTooltip() {
  return window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? true;
}

function hideFloatingTooltips() {
  hideCharacterTooltip();
  hideChartTooltip();
}

function getDelayedExtraPositionHits(extra, hitProfile = null) {
  const segments = Math.max(0, Number(extra?.segments) || 0);
  if (segments <= 0) return [];
  if (extra?.targetMode === "all") {
    return Array.from({ length: ENEMY_TEAM_SIZE }, (_, positionIndex) => [positionIndex, 1]);
  }
  const targetPositionIndex = hitProfile?.bodyHits?.[0]?.[0] ?? hitProfile?.targetHits?.[0]?.[0] ?? DEFAULT_RL_TARGET_INDEX;
  return [[targetPositionIndex, segments]];
}

function getDelayedExtraEvents(event, currentFrame, hitProfile = null) {
  if (isHarran(event.character)) return [];
  return (event.character.delayedExtraHits || []).map((extra) => {
    const positionHits = getDelayedExtraPositionHits(extra, hitProfile);
    return {
      character: event.character,
      positionIndex: event.positionIndex,
      frame: currentFrame + extra.delayFrames,
      chargeValue: getBaseChargeUnit(event.character) * extra.segments * (hasEffectiveExtraDamage(event.character) ? 2 : 1),
      positionHits,
      targetHits: positionHits,
      source: "delayed",
      label: extra.label,
    };
  });
}

function getVestiTacticalFollowUpEvents(event, currentFrame, hitProfile = null) {
  if (!isVestiTacticalUpgrade(event.character)) return [];
  const chargeValue = getAttackChargeValue(event.character, null, hitProfile, 1);
  const positionHits = getReceivedPositionHits(event.character, hitProfile, currentFrame, []);
  const targetHits = hitProfile?.targetHits || [];
  return VESTI_TACTICAL_HIT_OFFSETS.slice(1).map((offset) => ({
    character: event.character,
    positionIndex: event.positionIndex,
    frame: currentFrame + offset,
    chargeValue,
    positionHits,
    targetHits,
    source: "vesti-tactical-follow-up",
    label: getAttackContributionLabel(event.character, 1, null, hitProfile),
    countAsHitFrame: true,
    flightFrames: event.projectileFlightFrames,
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
  const extraMultiplier = hasEffectiveExtraDamage(event.character) ? 2 : 1;
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

function getAttackHitProfile(
  character,
  shotCount = 1,
  teamKey = "attack",
  shotNumber = null,
  targetPositionIndexOverride = null,
  opponentTeam = [],
) {
  const shotHits = getCounterHitCount(character, shotCount);
  const targetPositionIndex = Number.isInteger(targetPositionIndexOverride)
    ? Math.max(0, Math.min(ENEMY_TEAM_SIZE - 1, targetPositionIndexOverride))
    : getTargetPositionIndex(character, teamKey);
  const p5CinderellaDecoy = isTargetingP5Cinderella(character, targetPositionIndex, opponentTeam);

  if (isCinderella(character)) {
    return {
      totalHits: shotHits,
      bodyHits: [[targetPositionIndex, shotCount]],
      targetHits: [[targetPositionIndex, CINDERELLA_TARGET_HIT_COUNT]],
      p5CinderellaDecoy: false,
    };
  }

  if (character.weapon === "RL") {
    const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
    const start = Math.max(0, targetPositionIndex - range);
    const end = Math.min(ENEMY_TEAM_SIZE - 1, targetPositionIndex + range);
    const bodyHits = Array.from({ length: end - start + 1 }, (_, offset) => [start + offset, shotCount]);
    if (isRaven(character)) {
      return {
        totalHits: shotHits,
        bodyHits,
        targetHits: bodyHits.map(([positionIndex]) => [positionIndex, (positionIndex === targetPositionIndex ? 3 : 2) * shotCount]),
        p5CinderellaDecoy: false,
      };
    }
    return {
      totalHits: shotHits,
      bodyHits,
      targetHits: bodyHits.map(([positionIndex, hitCount]) => [positionIndex, hitCount * 2]),
      p5CinderellaDecoy: false,
    };
  }

  const penetrationExtraHits = getPenetrationExtraHitCount(character, shotNumber);
  if (penetrationExtraHits > 0) {
    const effectivePenetrationExtraHits = p5CinderellaDecoy ? 0 : penetrationExtraHits;
    return {
      totalHits: shotHits * (1 + effectivePenetrationExtraHits),
      bodyHits: [[targetPositionIndex, shotCount]],
      targetHits: [[targetPositionIndex, shotCount * (1 + effectivePenetrationExtraHits)]],
      p5CinderellaDecoy,
    };
  }

  return {
    totalHits: shotHits,
    bodyHits: [[targetPositionIndex, shotHits]],
    targetHits: [[targetPositionIndex, shotHits]],
    p5CinderellaDecoy,
  };
}

function getAttackContributionLabel(character, shotCount = 1, shotNumber = null, hitProfile = null) {
  const supplementLabel = character.superstarChargeSupplementValue ? "+超阿补充" : "";
  if (hitProfile?.p5CinderellaDecoy) {
    const actualHitMultiplier = (hitProfile.targetHits || []).reduce((sum, [, hitCount]) => sum + (Number(hitCount) || 0), 0);
    return `命中：${actualHitMultiplier} hit${supplementLabel}`;
  }
  if (character.weapon === "MG" && shotCount > 1) return `命中${supplementLabel}`;
  return `${getChargeHitLabel(character, getChargeHitMultiplier(character, shotNumber), shotNumber)}${supplementLabel}`;
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

function isNoah(character) {
  return character?.id === 12 || character?.name === "诺雅" || character?.slug === "诺雅";
}

function isNoise(character) {
  return character?.id === 49 || character?.name === "诺伊斯" || character?.slug === "诺伊斯";
}

function isTauntCharacter(character) {
  return isNoah(character) || isNoise(character);
}

function getTauntTargetState(team = [], teamKey = "attack", chargeSpeedsOverride = null) {
  const candidates = team
    .map((character, positionIndex) => {
      if (!character || !isTauntCharacter(character)) return null;
      const slotCharacter = characterForSlot(character, positionIndex, teamKey, team);
      if (Array.isArray(chargeSpeedsOverride)) {
        slotCharacter.chargeSpeedPercent = sanitizeChargeSpeed(chargeSpeedsOverride[positionIndex]);
      }
      const timing = getChargeFrames(slotCharacter, positionIndex, teamKey);
      return {
        positionIndex,
        chargeFrames: Number(timing.chargeFrames) || 0,
        activationFrame: Number(timing.firstFrame) || 0,
        priority: isNoah(character) ? 1 : 0,
      };
    })
    .filter(Boolean);
  if (!candidates.length) return null;
  candidates.sort(
    (a, b) =>
      b.chargeFrames - a.chargeFrames ||
      b.priority - a.priority ||
      b.activationFrame - a.activationFrame ||
      b.positionIndex - a.positionIndex,
  );
  return candidates[0];
}

function getTauntedTargetPositionIndex(event, attackSequenceNumber, currentFrame, opponentTauntTarget = null) {
  if (!Number.isInteger(opponentTauntTarget?.positionIndex)) return null;
  if (!event || event.positionIndex > 1) return null;
  if (attackSequenceNumber < 2) return null;
  if (currentFrame <= opponentTauntTarget.activationFrame) return null;
  return opponentTauntTarget.positionIndex;
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
  if (!state.allowMissedShots) return { ...character.stats, magazine: 60 };
  const savedMagazine = getSavedCharacterMagazine(character, teamKey);
  return savedMagazine ? { ...character.stats, magazine: savedMagazine } : character.stats;
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

function getTurnDodgeStartFrame(event, currentFrame) {
  return Math.max(0, currentFrame - (Number(event.projectileFlightFrames) || 0));
}

function getTurnDodgeFrames(event) {
  if (!isChargeWeapon(event.character)) return 0;
  if (isCinderella(event.character)) return 0;
  if (isVestiTacticalUpgrade(event.character) || isRaven(event.character)) return 0;
  const turnFrames = Number(event.character.timing?.turnFrames ?? event.character.turnFrames ?? 0) || 0;
  return Math.min(MISS_DODGE_WINDOW_FRAMES, Math.max(0, turnFrames));
}

function addTurnDodgeEvent(event, currentFrame) {
  const dodgeFrames = getTurnDodgeFrames(event);
  if (dodgeFrames <= 0) return;
  const startFrame = getTurnDodgeStartFrame(event, currentFrame);
  event.turnDodgeEvents.push({
    positionIndex: event.positionIndex,
    characterName: event.character.name,
    startFrame,
    endFrame: startFrame + dodgeFrames,
    dodgeFrames,
  });
}

function isMissedByDodgeWindow(positionIndex, flightStartFrame, hitFrame, window) {
  if (window.positionIndex !== positionIndex) return false;
  const windowEndFrame = Math.min(window.endFrame, window.startFrame + MISS_DODGE_WINDOW_FRAMES);
  return flightStartFrame < window.startFrame && window.startFrame < hitFrame && hitFrame < windowEndFrame;
}

function getRlShotMissDodgeWindow(
  event,
  currentFrame,
  teamKey,
  opponentReloadTimeline = [],
  opponentTurnDodgeTimeline = [],
  targetPositionIndexOverride = null,
) {
  if (!state.allowMissedShots) return false;
  if (event.character.weapon !== "RL" || event.projectileFlightFrames <= 0) return false;
  const targetPositionIndex = Number.isInteger(targetPositionIndexOverride)
    ? Math.max(0, Math.min(ENEMY_TEAM_SIZE - 1, targetPositionIndexOverride))
    : getTargetPositionIndex(event.character, teamKey);
  const flightStartFrame = Math.max(0, currentFrame - event.projectileFlightFrames);
  return [
    ...opponentReloadTimeline.map((window) => ({ ...window, type: "reload" })),
    ...opponentTurnDodgeTimeline.map((window) => ({ ...window, type: "turn" })),
  ].find((window) => isMissedByDodgeWindow(targetPositionIndex, flightStartFrame, currentFrame, window));
}

function characterForSlot(character, positionIndex, teamKey = "attack", team = []) {
  if (!character) return null;
  const chargeSpeeds = getChargeSpeedState(teamKey);
  const redHoodPierceCounts = getRedHoodPierceCountState(teamKey);
  const scarletCounterEnabled = getScarletCounterEnabledState(teamKey);
  const superstarChargeSupplementValue = getAnisSuperstarSupplementValue(team);
  const chargeSpeedPercent = canApplyChargeSpeed(character)
    ? Number(chargeSpeeds[positionIndex]) || character.chargeSpeedPercent || 0
    : 0;
  return {
    ...character,
    hasPenetration: isRedHood(character) ? false : character.hasPenetration,
    stats: getEffectiveCharacterStats(character, teamKey),
    chargeSpeedPercent,
    quantumRelicCubeEnabled: getSavedCharacterQuantumCube(character, teamKey),
    superstarChargeSupplementValue,
    redHoodPierceCount: isRedHood(character) ? sanitizeRedHoodPierceCount(redHoodPierceCounts[positionIndex]) : 0,
    scarletCounterEnabled: isScarlet(character) ? sanitizeScarletCounterEnabled(scarletCounterEnabled[positionIndex]) : false,
  };
}

function getRosannaSacrificeEventsForTeam(team = [], teamKey = "attack", sacrificeFrameOverride = null) {
  if (!team.some((character) => character && isRosanna(character))) return [];
  const sacrificeFrames = Array.isArray(sacrificeFrameOverride)
    ? sacrificeFrameOverride
    : getRosannaSacrificeFrameState(teamKey);
  return team
    .map((character, positionIndex) => ({
      character,
      positionIndex,
      frame: sanitizeSacrificeFrame(sacrificeFrames[positionIndex]),
    }))
    .filter((event) => event.character && !isRosanna(event.character) && event.frame !== null)
    .map((event) => ({
      ...event,
      chargeValue: ROSANNA_SACRIFICE_CHARGE,
      label: "罗珊娜献祭",
    }))
    .sort((a, b) => a.frame - b.frame || a.positionIndex - b.positionIndex);
}

function simulateBurst(
  team,
  teamKey = "attack",
  specialChargeEvents = [],
  opponentReloadTimeline = [],
  opponentTurnDodgeTimeline = [],
  stunWindows = [],
  opponentTauntTarget = null,
  universalChargeOverride = null,
  opponentTeam = [],
  sacrificeFrameOverride = null,
) {
  const members = team
    .map((character, positionIndex) => ({ character: characterForSlot(character, positionIndex, teamKey, team), positionIndex }))
    .filter((member) => member.character);
  const universalCharges = Array.isArray(universalChargeOverride) ? universalChargeOverride : getUniversalChargeState(teamKey);
  const universalMembers = universalCharges
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
      missedShotEvents: [],
      turnDodgeEvents: [],
      poisonChargeStarted: false,
    };
  });

  let totalCharge = 0;
  let currentFrame = 0;
  let pendingExtraEvents = [];
  let sacrificeEvents = getRosannaSacrificeEventsForTeam(team, teamKey, sacrificeFrameOverride);
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
    const activeAttackEvents = events.filter((event) => !event.sacrificed);
    if (activeAttackEvents.length === 0 && pendingExtraEvents.length === 0 && specialChargeEvents.length === 0 && sacrificeEvents.length === 0) break;
    const nextAttackFrame = activeAttackEvents.length ? Math.min(...activeAttackEvents.map((event) => event.nextFrame)) : Infinity;
    const nextExtraFrame = pendingExtraEvents.length ? Math.min(...pendingExtraEvents.map((event) => event.frame)) : Infinity;
    const nextSpecialFrame = specialChargeEvents.length ? Math.min(...specialChargeEvents.map((event) => event.frame)) : Infinity;
    const nextSacrificeFrame = sacrificeEvents.length ? Math.min(...sacrificeEvents.map((event) => event.frame)) : Infinity;
    currentFrame = Math.min(nextAttackFrame, nextExtraFrame, nextSpecialFrame, nextSacrificeFrame);
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

    const activeSacrifices = sacrificeEvents.filter((event) => event.frame === currentFrame);
    sacrificeEvents = sacrificeEvents.filter((event) => event.frame !== currentFrame);
    activeSacrifices.forEach((sacrifice) => {
      const owner = events.find((event) => event.positionIndex === sacrifice.positionIndex);
      if (!owner || owner.sacrificed) return;
      totalCharge += sacrifice.chargeValue;
      owner.totalCharge += sacrifice.chargeValue;
      owner.sacrificed = true;
      owner.sacrificeFrame = currentFrame;
      owner.sacrificeCharge = sacrifice.chargeValue;
      addContribution(owner, sacrifice.chargeValue, sacrifice.label, 0, false);
    });
    if (activeSacrifices.length) {
      const sacrificedIds = new Set(
        events.filter((event) => event.sacrificed).map((event) => event.character.id),
      );
      pendingExtraEvents = pendingExtraEvents.filter((event) => !sacrificedIds.has(event.character?.id));
    }

    const activeSpecials = specialChargeEvents.filter((event) => event.frame === currentFrame);
    specialChargeEvents = specialChargeEvents.filter((event) => event.frame !== currentFrame);
    activeSpecials.forEach((special) => {
      const owner = events.find((event) => event.positionIndex === special.positionIndex);
      if (!owner || owner.sacrificed) return;
      totalCharge += special.chargeValue;
      owner.totalCharge += special.chargeValue;
      addContribution(owner, special.chargeValue, special.label, 0, false);
    });

    const activeExtras = pendingExtraEvents.filter((event) => event.frame === currentFrame);
    pendingExtraEvents = pendingExtraEvents.filter((event) => event.frame !== currentFrame);
    activeExtras.forEach((extra) => {
      const owner = events.find((event) => event.character.id === extra.character.id);
      if (!owner || owner.sacrificed) return;
      totalCharge += extra.chargeValue;
      owner.totalCharge += extra.chargeValue;
      owner.attackChargeTotal += extra.chargeValue;
      if (extra.countAsHitFrame) owner.hitFrames.push(extra.frame);
      if (extra.flightFrames > 0) {
        owner.flightEvents.push({
          positionIndex: owner.positionIndex,
          characterName: owner.character.name,
          startFrame: Math.max(0, extra.frame - extra.flightFrames),
          endFrame: extra.frame,
          flightFrames: extra.flightFrames,
          missed: false,
        });
      }
      addContribution(owner, extra.chargeValue, extra.label || getDelayedExtraLabel(owner.character));
      addPositionHits(owner, extra.positionHits || []);
      addTargetHits(owner, extra.targetHits || []);
      if (extra.repeatFrames) {
        pendingExtraEvents.push({
          ...extra,
          frame: currentFrame + extra.repeatFrames,
        });
      }
    });

    const activeEvents = events.filter((event) => !event.sacrificed && event.nextFrame === currentFrame);
    activeEvents.forEach((event) => {
      const shotCount = getAttackShotCount(event);
      const attackSequenceNumber = event.hitFrames.length + 1;
      const tauntedTargetPositionIndex = getTauntedTargetPositionIndex(
        event,
        attackSequenceNumber,
        currentFrame,
        opponentTauntTarget,
      );
      const missDodgeWindow = getRlShotMissDodgeWindow(
        event,
        currentFrame,
        teamKey,
        opponentReloadTimeline,
        opponentTurnDodgeTimeline,
        tauntedTargetPositionIndex,
      );
      const isMissedShot = Boolean(missDodgeWindow);
      event.hits += shotCount;
      const chargeShotNumber = getAttackChargeShotNumber(event, shotCount);
      event.hitFrames.push(shotCount > 1 ? `${currentFrame}×${shotCount}` : currentFrame);
      addTurnDodgeEvent(event, currentFrame);
      if (event.character.weapon === "RL" && event.projectileFlightFrames > 0) {
        const flightEvent = {
          positionIndex: event.positionIndex,
          characterName: event.character.name,
          startFrame: Math.max(0, currentFrame - event.projectileFlightFrames),
          endFrame: currentFrame,
          flightFrames: event.projectileFlightFrames,
          missed: isMissedShot,
        };
        event.flightEvents.push(flightEvent);
        if (isMissedShot) {
          event.missedShotEvents.push({
            positionIndex: event.positionIndex,
            characterName: event.character.name,
            frame: currentFrame,
            flightStartFrame: flightEvent.startFrame,
            flightFrames: event.projectileFlightFrames,
            dodgeType: missDodgeWindow.type,
            dodgeStartFrame: missDodgeWindow.startFrame,
            dodgeEndFrame: Math.min(missDodgeWindow.endFrame, missDodgeWindow.startFrame + MISS_DODGE_WINDOW_FRAMES),
            dodgerName: missDodgeWindow.characterName,
            dodgerPositionIndex: missDodgeWindow.positionIndex,
          });
        }
      }

      if (isMissedShot) {
        const reloadEvent = advanceAttackEvent(event, currentFrame, shotCount, stunWindows);
        const magazineEmptyExtra = getMagazineEmptyExtraEvent(event, reloadEvent);
        if (magazineEmptyExtra) pendingExtraEvents.push(magazineEmptyExtra);
        return;
      }

      const hitProfile = getAttackHitProfile(
        event.character,
        shotCount,
        teamKey,
        chargeShotNumber,
        tauntedTargetPositionIndex,
        opponentTeam,
      );
      const receivedPositionHits = getReceivedPositionHits(event.character, hitProfile, currentFrame, opponentReloadTimeline);
      const chargeValue = getAttackChargeValue(event.character, chargeShotNumber, hitProfile, shotCount);
      totalCharge += chargeValue;
      event.totalCharge += chargeValue;
      event.attackChargeTotal += chargeValue;
      addContribution(event, chargeValue, getAttackContributionLabel(event.character, shotCount, chargeShotNumber, hitProfile));
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
      pendingExtraEvents.push(...getDelayedExtraEvents(event, currentFrame, hitProfile));
      pendingExtraEvents.push(...getVestiTacticalFollowUpEvents(event, currentFrame, hitProfile));
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
    burst1Frame: getBurstStageFrame(currentFrame, 1),
    burst2Frame: getBurstStageFrame(currentFrame, 2),
    burst3Frame: getBurstStageFrame(currentFrame, 3),
    availableBurstLevel,
    canFullBurst: availableBurstLevel === 3,
    totalCharge,
    chargePerSecond: currentFrame === 0 ? totalCharge * FRAMES_PER_SECOND : (totalCharge / currentFrame) * FRAMES_PER_SECOND,
    finishingPositionIndices: [...currentFrameContributors].sort((a, b) => a - b),
    timeline,
    reloadTimeline: events.flatMap((event) => event.reloadEvents),
    turnDodgeTimeline: events.flatMap((event) => event.turnDodgeEvents),
    flightTimeline: events.flatMap((event) => event.flightEvents),
    missedTimeline: events.flatMap((event) => event.missedShotEvents),
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
  const avatarUrl = getCharacterAvatarUrl(character);
  if (avatarUrl) {
    return `<img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(character.name)}" loading="lazy" referrerpolicy="no-referrer" />`;
  }
  return `
    <span class="avatar-fallback">
      <span class="avatar-fallback-name">${escapeHtml(character.name)}</span>
      <span class="avatar-fallback-weapon">${escapeHtml(character.weapon)}</span>
    </span>
  `;
}

function getCharacterAvatarUrl(character) {
  return character?.avatarUrl || character?.nameCodeAvatarUrl || "";
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
  if (!character || !canEditChargeSpeed(character)) return null;
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
  if (hasEffectiveExtraDamage(character)) tags.push("额外伤害");
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
      ".slot-settings-toggle, .slot-link-toggle, .slot-link-target, .slot-pierce-count, .slot-counter-toggle, .slot-sacrifice-toggle, .universal-charge-field",
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
    (pointerTeamDrag.paidArena
      ? Number(targetSlot.dataset.paidArenaRowIndex) === pointerTeamDrag.rowIndex &&
        Number(targetSlot.dataset.slotIndex) === pointerTeamDrag.index
      : targetSlot.dataset.teamKey === pointerTeamDrag.teamKey && Number(targetSlot.dataset.slotIndex) === pointerTeamDrag.index)
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
  draggedPaidArenaRowIndex = pointerTeamDrag.rowIndex ?? null;
  slot.classList.add("is-dragging");
  updatePointerTeamDragTarget(event.clientX, event.clientY);
}

function handleTeamSlotPointerDown(event, slot, character, teamKey, index, options = {}) {
  if (!character || event.pointerType === "mouse" || isTeamSlotDragControl(event.target)) return;
  pointerTeamDrag = {
    pointerId: event.pointerId,
    teamKey,
    index,
    paidArena: Boolean(options.paidArena),
    rowIndex: Number.isInteger(options.rowIndex) ? options.rowIndex : null,
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
  draggedPaidArenaRowIndex = null;

  if (!drag.active) return;
  suppressTeamSlotClick = true;
  setTimeout(() => {
    suppressTeamSlotClick = false;
  }, 0);
  if (!drag.target) return;
  if (drag.paidArena) {
    movePaidArenaSlot(drag.rowIndex, drag.index, Number(drag.target.dataset.paidArenaRowIndex), Number(drag.target.dataset.slotIndex));
  } else {
    moveTeamSlot(drag.teamKey, drag.index, drag.target.dataset.teamKey, Number(drag.target.dataset.slotIndex));
  }
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

function getSacrificeMarkMarkup(frame) {
  const sacrificeFrame = sanitizeSacrificeFrame(frame);
  if (sacrificeFrame === null) return "";
  return `<span class="sacrifice-mark"><span>祭</span><small>${sacrificeFrame}F</small></span>`;
}

function isSlotSettingsOpen(teamKey, index) {
  return openSlotSettings?.teamKey === teamKey && openSlotSettings.index === index;
}

function isRosannaSacrificeSettingsOpen(teamKey, index) {
  return (
    openRosannaSacrificeSettings &&
    !openRosannaSacrificeSettings.paidArenaMode &&
    openRosannaSacrificeSettings.teamKey === teamKey &&
    openRosannaSacrificeSettings.index === index
  );
}

function toggleSlotSettings(teamKey, index) {
  openSlotSettings = isSlotSettingsOpen(teamKey, index) ? null : { teamKey, index };
  openRosannaSacrificeSettings = null;
}

function toggleRosannaSacrificeSettings(teamKey, index) {
  openRosannaSacrificeSettings = isRosannaSacrificeSettingsOpen(teamKey, index) ? null : { teamKey, index };
  openSlotSettings = null;
}

function isPaidArenaRosannaSacrificeSettingsOpen(mode, rowIndex, index) {
  return (
    openRosannaSacrificeSettings?.paidArenaMode === normalizePaidArenaMode(mode) &&
    Number(openRosannaSacrificeSettings.rowIndex) === Number(rowIndex) &&
    Number(openRosannaSacrificeSettings.index) === Number(index)
  );
}

function togglePaidArenaRosannaSacrificeSettings(mode, rowIndex, index) {
  openRosannaSacrificeSettings = isPaidArenaRosannaSacrificeSettingsOpen(mode, rowIndex, index)
    ? null
    : { paidArenaMode: normalizePaidArenaMode(mode), rowIndex, index };
  openSlotSettings = null;
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
  openRosannaSacrificeSettings = null;
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
  openRosannaSacrificeSettings = null;
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
    const matchesSearch = !keyword || getCharacterSearchText(character).includes(keyword);
    return matchesCommon && matchesRegion && matchesStage && matchesSearch;
  }).sort((a, b) => {
    const chargeDiff = getSingleShotChargeValue(b) - getSingleShotChargeValue(a);
    const weaponDiff = WEAPON_ORDER.indexOf(a.weapon) - WEAPON_ORDER.indexOf(b.weapon);
    return chargeDiff || weaponDiff || a.name.localeCompare(b.name, "zh-CN");
  });
}

function renderCharacters() {
  const pickedIds = isPaidArenaModeActive()
    ? getPaidArenaPickedIds()
    : new Set(getTeamState().filter(Boolean).map((character) => character.id));
  const fragment = document.createDocumentFragment();
  const characters = getFilteredCharacters();
  updateSortSummary();
  els.listCount.textContent = `${characters.length}/${CHARACTERS.length} 名角色`;

  characters.forEach((character, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `character-tile rarity-${getRarityClass(character)}${pickedIds.has(character.id) ? " is-picked" : ""}`;
    tile.setAttribute("aria-label", `加入 ${character.name}，${character.weapon}，单发 ${formatNumber(getSingleShotChargeValue(character), 2)}%`);
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
      <span class="tile-charge">${formatNumber(getSingleShotChargeValue(character), 1)}</span>
      <span class="tile-check" aria-hidden="true">✓</span>
    `;
    tile.addEventListener("mouseenter", () => {
      if (canUseHoverTooltip()) showCharacterTooltip(character, index, tile);
    });
    tile.addEventListener("mousemove", () => {
      if (canUseHoverTooltip()) positionCharacterTooltip(tile);
    });
    tile.addEventListener("mouseleave", hideCharacterTooltip);
    tile.addEventListener("focus", () => {
      if (canUseHoverTooltip()) showCharacterTooltip(character, index, tile);
    });
    tile.addEventListener("blur", hideCharacterTooltip);
    tile.addEventListener("touchstart", hideCharacterTooltip, { passive: true });
    tile.addEventListener("click", () => {
      hideCharacterTooltip();
      toggleCharacter(character);
    });
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

function getSlotSettingsContext() {
  if (!openSlotSettings) return null;

  if (openSlotSettings.paidArenaMode) {
    const mode = normalizePaidArenaMode(openSlotSettings.paidArenaMode);
    const rowIndex = Number(openSlotSettings.rowIndex);
    const index = Number(openSlotSettings.index);
    const teams = getPaidArenaTeams(mode);
    const team = teams[rowIndex];
    const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, getPaidArenaDataTeamKey());
    const character = team?.[index] || null;
    if (!character || !chargeSpeeds) return null;
    return {
      character,
      chargeSpeeds,
      index,
      teamKey: getPaidArenaDataTeamKey(),
      simulationTeamKey: getPaidArenaDataTeamKey(),
      title: `${getPaidArenaModeLabel(mode)} ${rowIndex + 1} P${index + 1}`,
      isPaidArena: true,
    };
  }

  const teamKey = normalizeTeamKey(openSlotSettings.teamKey);
  const index = Number(openSlotSettings.index);
  const team = getTeamState(teamKey);
  const character = team[index];
  if (!character) return null;
  return {
    character,
    chargeSpeeds: getChargeSpeedState(teamKey),
    index,
    teamKey,
    simulationTeamKey: teamKey,
    title: `${TEAM_LABELS[teamKey]} P${index + 1}`,
    isPaidArena: false,
  };
}

function refreshSlotSettingsChanges(context) {
  saveTeam();
  if (context?.isPaidArena) {
    render();
    return;
  }
  invalidateBattleResults();
  updateTeamFinishMarkers(renderResults());
  refreshBattleResults();
}

function applySavedChargeSpeedToNormalTeam(character, teamKey) {
  const team = getTeamState(teamKey);
  const chargeSpeeds = getChargeSpeedState(teamKey);
  const slotIndex = team.findIndex((member) => member && member.id === character?.id);
  if (slotIndex === -1) return;
  chargeSpeeds[slotIndex] = getSavedCharacterChargeSpeed(character, teamKey);
}

function createSlotSettingsModal() {
  if (!openSlotSettings) return null;

  const context = getSlotSettingsContext();
  if (!context) {
    openSlotSettings = null;
    return null;
  }

  const { character, chargeSpeeds, index, teamKey, simulationTeamKey } = context;
  const chargeSpeedValue = sanitizeChargeSpeed(chargeSpeeds[index]);
  const chargeSpeedEntries = getSavedCharacterChargeSpeedEntries(character, teamKey);
  const showChargeSpeedSettings = canEditChargeSpeed(character);
  const chargeSpeedPreviewFrame = getChargeSpeedPreviewFrame(character, index, simulationTeamKey, chargeSpeedValue);
  const chargeSpeedEntryOptions = CHARGE_SPEED_ENTRY_OPTIONS.map(
    (option) => `<option value="${option.toFixed(2)}">${formatChargeSpeedEntry(option)}</option>`,
  ).join("");
  const chargeSpeedEntrySelects = chargeSpeedEntries
    .map(
      (entry, entryIndex) => `
        <select class="slot-settings-speed-entry" data-speed-entry-index="${entryIndex}" aria-label="蓄力速度词条 ${entryIndex + 1}">
          ${chargeSpeedEntryOptions.replace(`value="${entry.toFixed(2)}"`, `value="${entry.toFixed(2)}" selected`)}
        </select>
      `,
    )
    .join("");
  const cubeType = getSavedCharacterCubeType(character, teamKey);
  const showChargeSpeedCubeOption = showChargeSpeedSettings;
  const isScarletSettings = state.allowMissedShots && isScarlet(character);
  const magazineValue = getSavedCharacterMagazine(character, teamKey) || sanitizeMagazine(character.stats?.magazine);
  const backdrop = document.createElement("div");
  backdrop.className = "slot-settings-backdrop";
  backdrop.setAttribute("role", "presentation");
  backdrop.innerHTML = `
    <section class="slot-settings-modal" role="dialog" aria-modal="true" aria-label="设置 ${escapeHtml(character.name)}">
      <div class="slot-settings-modal-head">
        <div>
          <span class="slot-settings-team">${escapeHtml(context.title)}</span>
          <strong>${escapeHtml(character.name)}</strong>
        </div>
        <button class="slot-settings-close" type="button" aria-label="关闭设置">X</button>
      </div>
      ${
        showChargeSpeedSettings
          ? `
            <div class="settings-field settings-speed-entries">
              <span>蓄速</span>
              <div class="slot-settings-speed-entry-list">
                ${chargeSpeedEntrySelects}
              </div>
              <input class="slot-settings-speed-total" type="number" min="0" max="100" step="1" value="${chargeSpeedValue}" aria-label="最终蓄力速度" />
              <span class="slot-settings-frame-preview">${formatFrameCount(chargeSpeedPreviewFrame)}F</span>
            </div>
          `
          : ""
      }
      ${
        isScarletSettings
          ? `
            <label class="settings-field">
              <span>弹容</span>
              <input class="slot-settings-magazine" type="number" min="20" max="88" step="1" value="${magazineValue}" />
              <span>发</span>
            </label>
          `
          : ""
      }
      <div class="settings-cube-field" role="radiogroup" aria-label="魔方选择">
        <span>魔方</span>
        <label class="settings-cube-option">
          <input class="slot-settings-cube-type" type="radio" name="slot-cube-type" value="${CUBE_TYPE_NONE}"${cubeType === CUBE_TYPE_NONE ? " checked" : ""} />
          <span>无魔方</span>
        </label>
        ${
          showChargeSpeedCubeOption
            ? `
              <label class="settings-cube-option is-icon-only" title="蓄速魔方 +${CHARGE_SPEED_CUBE_VALUE.toFixed(2)}%">
                <input class="slot-settings-cube-type" type="radio" name="slot-cube-type" value="${CUBE_TYPE_CHARGE_SPEED}"${cubeType === CUBE_TYPE_CHARGE_SPEED ? " checked" : ""} />
                <img class="settings-check-icon" src="assets/icons/ui/cubes/charge-speed.png" alt="" aria-hidden="true" />
              </label>
            `
            : ""
        }
        <label class="settings-cube-option is-icon-only" title="量子魔方">
          <input class="slot-settings-cube-type" type="radio" name="slot-cube-type" value="${CUBE_TYPE_QUANTUM}"${cubeType === CUBE_TYPE_QUANTUM ? " checked" : ""} />
          <img class="settings-check-icon" src="assets/icons/ui/cubes/quantum.png" alt="" aria-hidden="true" />
        </label>
      </div>
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

  const speedEntrySelects = [...backdrop.querySelectorAll(".slot-settings-speed-entry")];
  if (speedEntrySelects.length) {
    const speedFramePreview = backdrop.querySelector(".slot-settings-frame-preview");
    const speedTotal = backdrop.querySelector(".slot-settings-speed-total");
    const getCurrentSpeedEntries = () => speedEntrySelects.map((select) => sanitizeChargeSpeedEntry(select.value));
    const getCurrentCubeType = () =>
      sanitizeCubeType(backdrop.querySelector(".slot-settings-cube-type:checked")?.value || getSavedCharacterCubeType(character, teamKey));
    const updateSpeedFramePreview = () => {
      const speed = calculateChargeSpeedFromEntriesAndCube(getCurrentSpeedEntries(), getCurrentCubeType());
      if (speedTotal) speedTotal.value = speed;
      if (speedFramePreview) {
        const frame = getChargeSpeedPreviewFrame(character, index, simulationTeamKey, speed);
        speedFramePreview.textContent = `${formatFrameCount(frame)}F`;
      }
    };
    const updateManualSpeedFramePreview = () => {
      if (!speedFramePreview) return;
      const speed = sanitizeChargeSpeed(speedTotal?.value);
      const frame = getChargeSpeedPreviewFrame(character, index, simulationTeamKey, speed);
      speedFramePreview.textContent = `${formatFrameCount(frame)}F`;
    };
    const commitSpeedValue = () => {
      const entries = getCurrentSpeedEntries();
      const speed = calculateChargeSpeedFromEntriesAndCube(entries, getCurrentCubeType());
      saveCharacterChargeSpeedEntries(character, entries, teamKey);
      if (chargeSpeeds[index] === speed) {
        saveTeam();
        updateSpeedFramePreview();
        return;
      }
      chargeSpeeds[index] = speed;
      applySavedChargeSpeedToNormalTeam(character, teamKey);
      updateSpeedFramePreview();
      refreshSlotSettingsChanges(context);
    };
    speedEntrySelects.forEach((select) => {
      select.addEventListener("pointerdown", (event) => event.stopPropagation());
      select.addEventListener("dragstart", (event) => event.stopPropagation());
      select.addEventListener("change", () => {
        updateSpeedFramePreview();
        commitSpeedValue();
      });
    });
    if (speedTotal) {
      const commitManualSpeedValue = () => {
        const speed = sanitizeChargeSpeed(speedTotal.value);
        speedTotal.value = speed;
        const emptyEntries = normalizeChargeSpeedEntries();
        speedEntrySelects.forEach((select) => {
          select.value = "0.00";
        });
        getCharacterChargeSpeedEntryMemory(teamKey)[character.id] = emptyEntries;
        saveCharacterChargeSpeed(character, speed, teamKey);
        if (chargeSpeeds[index] === speed) {
          saveTeam();
          updateManualSpeedFramePreview();
          return;
        }
        chargeSpeeds[index] = speed;
        applySavedChargeSpeedToNormalTeam(character, teamKey);
        updateManualSpeedFramePreview();
        refreshSlotSettingsChanges(context);
      };
      speedTotal.addEventListener("pointerdown", (event) => event.stopPropagation());
      speedTotal.addEventListener("focus", (event) => event.target.select());
      speedTotal.addEventListener("click", (event) => event.target.select());
      speedTotal.addEventListener("dragstart", (event) => event.stopPropagation());
      speedTotal.addEventListener("input", updateManualSpeedFramePreview);
      speedTotal.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        speedTotal.blur();
      });
      speedTotal.addEventListener("blur", commitManualSpeedValue);
    }
  }

  const magazineInput = backdrop.querySelector(".slot-settings-magazine");
  if (magazineInput) {
    magazineInput.addEventListener("pointerdown", (event) => event.stopPropagation());
    magazineInput.addEventListener("focus", (event) => event.target.select());
    magazineInput.addEventListener("click", (event) => event.target.select());
    magazineInput.addEventListener("dragstart", (event) => event.stopPropagation());
    magazineInput.addEventListener("input", (event) => {
      const magazine = parseCompleteMagazine(event.target.value);
      if (magazine === null) return;
      saveCharacterMagazine(character, magazine, teamKey);
      refreshSlotSettingsChanges(context);
    });
    magazineInput.addEventListener("blur", (event) => {
      const magazine = sanitizeMagazine(event.target.value);
      event.target.value = magazine;
      saveCharacterMagazine(character, magazine, teamKey);
      refreshSlotSettingsChanges(context);
    });
  }

  backdrop.querySelectorAll(".slot-settings-cube-type").forEach((input) => {
    input.addEventListener("change", (event) => {
      if (!event.target.checked) return;
      saveCharacterCubeType(character, event.target.value, teamKey);
      chargeSpeeds[index] = getSavedCharacterChargeSpeed(character, teamKey);
      applySavedChargeSpeedToNormalTeam(character, teamKey);
      refreshSlotSettingsChanges(context);
      render();
    });
  });

  backdrop.querySelector(".slot-settings-reset").addEventListener("click", (event) => {
    event.preventDefault();
    chargeSpeeds[index] = 0;
    resetCharacterChargeSpeed(character, teamKey);
    applySavedChargeSpeedToNormalTeam(character, teamKey);
    resetCharacterQuantumCube(character, teamKey);
    resetCharacterMagazine(character, teamKey);
    saveTeam();
    render();
  });

  return backdrop;
}

function createRosannaSacrificeModal() {
  if (!openRosannaSacrificeSettings) return null;
  const paidArenaMode = normalizePaidArenaMode(openRosannaSacrificeSettings.paidArenaMode);
  const isPaidArena = paidArenaMode !== "normal";
  const teamKey = isPaidArena ? getPaidArenaDataTeamKey() : normalizeTeamKey(openRosannaSacrificeSettings.teamKey);
  const rowIndex = Number(openRosannaSacrificeSettings.rowIndex) || 0;
  const index = Number(openRosannaSacrificeSettings.index);
  const team = (isPaidArena ? getPaidArenaTeams(paidArenaMode)[rowIndex] : getTeamState(teamKey)) || [];
  const rosanna = team[index];
  if (!rosanna || !isRosanna(rosanna)) {
    openRosannaSacrificeSettings = null;
    return null;
  }

  const sacrificeFrames = isPaidArena
    ? getPaidArenaRosannaSacrificeFrames(paidArenaMode)[rowIndex]
    : getRosannaSacrificeFrameState(teamKey);
  if (!sacrificeFrames) {
    openRosannaSacrificeSettings = null;
    return null;
  }
  sacrificeFrames[index] = null;
  const targetRows = team
    .map((character, positionIndex) => ({ character, positionIndex }))
    .filter((entry) => entry.character && entry.positionIndex !== index);
  const backdrop = document.createElement("div");
  backdrop.className = "slot-settings-backdrop";
  backdrop.setAttribute("role", "presentation");
  backdrop.innerHTML = `
    <section class="slot-settings-modal rosanna-sacrifice-modal" role="dialog" aria-modal="true" aria-label="罗珊娜献祭设置">
      <div class="slot-settings-modal-head">
        <div>
          <span class="slot-settings-team">${escapeHtml(isPaidArena ? `${getPaidArenaModeLabel(paidArenaMode)} P${rowIndex + 1}` : TEAM_LABELS[teamKey])}</span>
          <strong>罗珊娜献祭</strong>
        </div>
        <button class="slot-settings-close" type="button" aria-label="关闭献祭设置">X</button>
      </div>
      <div class="rosanna-sacrifice-list">
        ${
          targetRows.length
            ? targetRows
                .map(({ character, positionIndex }) => {
                  const frame = sanitizeSacrificeFrame(sacrificeFrames[positionIndex]);
                  return `
                    <label class="rosanna-sacrifice-row">
                      <span class="rosanna-sacrifice-avatar">${getAvatarMarkup(character)}</span>
                      <span class="rosanna-sacrifice-name">P${positionIndex + 1} ${escapeHtml(character.name)}</span>
                      <input class="rosanna-sacrifice-frame" type="number" min="0" max="${CHART_MAX_FRAME}" step="1" value="${frame ?? ""}" placeholder="空" data-sacrifice-index="${positionIndex}" />
                      <span>F</span>
                    </label>
                  `;
                })
                .join("")
            : '<p class="rosanna-sacrifice-empty">暂无可献祭角色</p>'
        }
      </div>
      <button class="slot-settings-reset rosanna-sacrifice-reset" type="button">重置默认</button>
    </section>
  `;

  const close = () => {
    openRosannaSacrificeSettings = null;
    saveTeam();
    render();
  };
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
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
    close();
  });
  const getCurrentSacrificeFrames = () =>
    isPaidArena ? getPaidArenaRosannaSacrificeFrames(paidArenaMode)[rowIndex] : getRosannaSacrificeFrameState(teamKey);
  backdrop.querySelector(".rosanna-sacrifice-reset").addEventListener("click", (event) => {
    event.preventDefault();
    const currentFrames = getCurrentSacrificeFrames();
    if (!currentFrames) return;
    currentFrames.fill(null);
    saveTeam();
    render();
  });
  backdrop.addEventListener("input", (event) => {
    if (!event.target.matches(".rosanna-sacrifice-frame")) return;
    const positionIndex = Number(event.target.dataset.sacrificeIndex);
    const currentFrames = getCurrentSacrificeFrames();
    if (!currentFrames) return;
    currentFrames[positionIndex] = sanitizeSacrificeFrame(event.target.value);
    saveTeam();
  });
  backdrop.querySelectorAll(".rosanna-sacrifice-frame").forEach((input) => {
    input.addEventListener("focus", () => input.select());
  });

  return backdrop;
}

function hasSeenHelpIntro() {
  return localStorage.getItem(HELP_INTRO_STORAGE_KEY) === "1";
}

function markHelpIntroSeen() {
  localStorage.setItem(HELP_INTRO_STORAGE_KEY, "1");
}

function getHelpButtonCenter() {
  const rect = els.helpButton?.getBoundingClientRect();
  if (!rect) return { x: window.innerWidth - 30, y: 30 };
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function animateHelpIntroClose(backdrop) {
  const modal = backdrop?.querySelector(".help-modal");
  if (!backdrop || !modal) {
    backdrop?.remove();
    return;
  }
  const modalRect = modal.getBoundingClientRect();
  const target = getHelpButtonCenter();
  const originX = target.x - modalRect.left;
  const originY = target.y - modalRect.top;
  modal.style.setProperty("--help-close-origin-x", `${originX}px`);
  modal.style.setProperty("--help-close-origin-y", `${originY}px`);
  backdrop.classList.add("is-closing-to-help");
  const removeBackdrop = () => backdrop.remove();
  backdrop.addEventListener("animationend", removeBackdrop, { once: true });
  window.setTimeout(removeBackdrop, 360);
}

function closeHelpModal() {
  isHelpModalOpen = false;
  const backdrop = document.querySelector(".help-modal-backdrop");
  if (!backdrop) return;
  const isIntro = backdrop.dataset.intro === "true";
  if (isIntro) {
    markHelpIntroSeen();
    animateHelpIntroClose(backdrop);
    return;
  }
  backdrop.remove();
}

function createHelpModal(options = {}) {
  if (!isHelpModalOpen) return null;
  const sections = [
    {
      title: "竞技场模式",
      items: [
        "默认是普通竞技场，上排防守队、下排进攻队；点击“冠”“特”可切换冠军竞技场和特殊竞技场。",
        "冠军竞技场显示 5 队，特殊竞技场显示 3 队，同一模式内共用妮姬不可重复选择。",
        "“测”为反推模式入口；未开放时会提示功能状态。",
      ],
    },
    {
      title: "队伍槽位",
      items: [
        "点击任意队伍会切换当前操作队伍；角色头像可拖拽换位，移动端也支持拖动。",
        "空槽可填写“充”作为万能充能值；选择角色会直接覆盖该槽位并清零万能充能。",
        "队伍栏上方可填写战力基准值，自动换算可防与可攻战压。",
        "1-10 按钮用于保存当前模式方案；普通、冠军、特殊竞技场会分别保留各自 10 套方案。",
      ],
    },
    {
      title: "充能轴",
      items: [
        "上方图表展示双方关键充能帧、标准 RL 轴、换弹/转身、空枪、晕眩与特殊事件。",
        "鼠标在图表内移动时，会显示最近关键帧详情，并用辅助线标记对应角色和帧数。",
        "总充能轴会汇总角色攻击、万能充能、红莲反击、豺狼链接等有效贡献。",
        "队伍无法完成爆裂 1/2/3 时，充能轴只显示到实际可进入的位置。",
      ],
    },
    {
      title: "角色设置",
      items: [
        "点击头像右上角齿轮，可设置蓄力速度词条、最终蓄速、蓄速/量子魔方、红莲弹容等参数。",
        "蓄速词条会按相同词条先合并再四舍五入；也可以直接手填最终蓄速，手填后会清空词条。",
        "蓄速魔方会额外增加 2.12% 蓄速，取整后为 +2；量子魔方会提高单发基础充能。",
        "角色参数按进攻/防守分别保存；冠军/特殊竞技场可选择沿用普通竞技场的进攻或防守数据。",
      ],
    },
    {
      title: "特殊机制",
      items: [
        "“空”开关用于计算空枪；开启后红莲弹容、RL/SR 转身和换弹空枪判定才会参与。",
        "豺狼、波莉可开启链接；豺狼链接会产生充能，波莉链接只影响共同受击与红莲反击。",
        "红莲反击、小红帽穿透、灰姑娘特殊发射、嘲讽、晕眩、罗珊娜消除 BUFF 等都会进入计算。",
        "罗珊娜消除链接后，后续共同受击效果不再生效。",
      ],
    },
    {
      title: "角色选择",
      items: [
        "搜索支持中文名和英文名；1/2/3 可筛选爆裂阶段，常/国开关会本地保存。",
        "角色默认按最终单发充能效率从高到低排序；再次点击已选角色会从当前队伍中移除。",
        "右键角色卡可复制该角色当前显示的详细充能信息；悬停可查看充能组成。",
      ],
    },
    {
      title: "复制与分享",
      items: [
        "普通竞技场复制会生成充能轴、防守 VS 进攻信息和双方队伍图片。",
        "冠军/特殊竞技场复制会生成对应模式的队伍图片，右上角会显示当前访问网址。",
        "桌面端可右键复制；移动端可长按或点击分享按钮调用系统分享图片。",
      ],
    },
    {
      title: "页面工具",
      items: [
        "左上角菜单可打开侧边栏，查看更新日志、使用说明和当前版本。",
        "右上角问号同样可打开本说明；侧边栏的太阳/月亮按钮可切换浅色与深色主题。",
        "分享图标用于分享当前队伍信息，“换”互换攻防队伍，“清”清空双方队伍。",
      ],
    },
  ];
  const copyShareIndex = sections.findIndex((section) => section.title === "复制与分享");
  if (copyShareIndex > 1) {
    const [copyShareSection] = sections.splice(copyShareIndex, 1);
    sections.splice(1, 0, copyShareSection);
  }

  const backdrop = document.createElement("div");
  backdrop.className = "help-modal-backdrop";
  if (options.intro) backdrop.dataset.intro = "true";
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

function openHelpModal(options = {}) {
  isHelpModalOpen = true;
  document.querySelector(".help-modal-backdrop")?.remove();
  const modal = createHelpModal(options);
  if (modal) document.body.append(modal);
}

function showInitialHelpIntro() {
  if (hasSeenHelpIntro()) return;
  window.requestAnimationFrame(() => openHelpModal({ intro: true }));
}

function closeChangelogModal() {
  document.querySelector(".changelog-modal-backdrop")?.remove();
}

function openChangelogModal() {
  closeChangelogModal();
  const backdrop = document.createElement("div");
  backdrop.className = "help-modal-backdrop changelog-modal-backdrop";
  backdrop.innerHTML = `
    <section class="help-modal changelog-modal" role="dialog" aria-modal="true" aria-label="更新日志">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Log</span>
          <strong>更新日志</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="关闭更新日志">X</button>
      </div>
      <div class="help-modal-content">
        <article class="help-section">
          <h2>最近 10 条</h2>
          <ul>
            ${CHANGELOG_ITEMS.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      </div>
    </section>
  `;
  const modal = backdrop.querySelector(".help-modal");
  modal.addEventListener("click", (event) => event.stopPropagation());
  backdrop.addEventListener("click", closeChangelogModal);
  backdrop.querySelector(".help-modal-close").addEventListener("click", (event) => {
    event.preventDefault();
    closeChangelogModal();
  });
  document.body.append(backdrop);
}

function setSidebarOpen(open) {
  isSidebarOpen = Boolean(open);
  els.appSidebar?.classList.toggle("is-open", isSidebarOpen);
  if (els.appSidebar) els.appSidebar.setAttribute("aria-hidden", isSidebarOpen ? "false" : "true");
  if (els.appSidebarBackdrop) els.appSidebarBackdrop.hidden = !isSidebarOpen;
}

function normalizeTheme(theme) {
  return theme === "light" ? "light" : "dark";
}

function applyTheme(theme) {
  const nextTheme = normalizeTheme(theme);
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  els.themeToggleButton?.querySelector(".theme-sun")?.classList.toggle("is-active", nextTheme === "light");
  els.themeToggleButton?.querySelector(".theme-moon")?.classList.toggle("is-active", nextTheme === "dark");
  els.themeToggleButton?.setAttribute("aria-label", nextTheme === "light" ? "切换为黑色主题" : "切换为白色主题");
  els.themeToggleButton?.setAttribute("title", nextTheme === "light" ? "切换为黑色主题" : "切换为白色主题");
}

function initTheme() {
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "dark");
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
}

function isWechatMiniProgramRuntime() {
  return window.__wxjs_environment === "miniprogram" || Boolean(window.wx?.miniProgram);
}

function isLocalDevRuntime() {
  const { protocol, hostname } = window.location;
  return protocol === "file:" || ["localhost", "127.0.0.1", "::1"].includes(hostname);
}

function hasLocalPaidDevAccess() {
  return isLocalDevRuntime() && localStorage.getItem(PAID_DEV_ACCESS_KEY) === "1";
}

function setLocalPaidDevAccess(enabled) {
  if (!isLocalDevRuntime()) return;
  if (enabled) {
    localStorage.setItem(PAID_DEV_ACCESS_KEY, "1");
  } else {
    localStorage.removeItem(PAID_DEV_ACCESS_KEY);
  }
}

function syncLocalPaidDevAccessControl() {
  if (!els.appVersion) return;
  const isLocalDev = isLocalDevRuntime();
  els.appVersion.classList.toggle("is-local-dev", isLocalDev);
  els.appVersion.classList.toggle("has-paid-dev-access", hasLocalPaidDevAccess());
  if (isLocalDev) {
    els.appVersion.setAttribute("role", "button");
    els.appVersion.setAttribute("tabindex", "0");
    els.appVersion.setAttribute("title", hasLocalPaidDevAccess() ? "关闭本地付费测试" : "启用本地付费测试");
  } else {
    els.appVersion.removeAttribute("role");
    els.appVersion.removeAttribute("tabindex");
    els.appVersion.removeAttribute("title");
  }
}

function toggleLocalPaidDevAccess() {
  if (!isLocalDevRuntime()) return;
  const nextEnabled = !hasLocalPaidDevAccess();
  setLocalPaidDevAccess(nextEnabled);
  if (!nextEnabled && state.testMode) setPaidTestMode(false);
  syncLocalPaidDevAccessControl();
  showToast(nextEnabled ? "已启用本地付费测试" : "已关闭本地付费测试");
}

function closePaidFeatureModal() {
  document.querySelector(".paid-modal-backdrop")?.remove();
}

function isMobileCopyChoiceRuntime() {
  return window.matchMedia?.("(pointer: coarse)")?.matches || window.matchMedia?.("(max-width: 760px)")?.matches;
}

function getLocalPaidInferencePayload() {
  return {
    attackTeam: state.team.map((character) => character?.id || null),
    attackChargeSpeeds: [...state.chargeSpeeds],
    maxAutoShots: 3,
  };
}

function createEmptyPaidArenaTeams(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(null));
}

function createEmptyPaidArenaUniversalCharges(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(0));
}

function createEmptyPaidArenaChargeSpeeds(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(0));
}

function createEmptyPaidArenaRosannaSacrificeFrames(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(null));
}

function createEmptyPaidArenaLineupSlot(mode) {
  return {
    teams: createEmptyPaidArenaTeams(mode).map((team) => team.map((character) => character?.id || null)),
    universalCharges: createEmptyPaidArenaUniversalCharges(mode),
    chargeSpeeds: createEmptyPaidArenaChargeSpeeds(mode),
    rosannaSacrificeFrames: createEmptyPaidArenaRosannaSacrificeFrames(mode),
    activeRowIndex: 0,
  };
}

function normalizePaidArenaMode(mode) {
  return mode === "c" || mode === "p" ? mode : "normal";
}

function isPaidArenaModeActive() {
  return state.paidArenaMode === "c" || state.paidArenaMode === "p";
}

function getPaidArenaTeams(mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  if (!Array.isArray(state.paidArenaTeams[normalizedMode])) {
    state.paidArenaTeams[normalizedMode] = createEmptyPaidArenaTeams(normalizedMode);
  }
  state.paidArenaTeams[normalizedMode] = normalizePaidArenaTeams(state.paidArenaTeams[normalizedMode], normalizedMode);
  return state.paidArenaTeams[normalizedMode];
}

function getPaidArenaUniversalCharges(mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  if (!Array.isArray(state.paidArenaUniversalCharges?.[normalizedMode])) {
    state.paidArenaUniversalCharges[normalizedMode] = createEmptyPaidArenaUniversalCharges(normalizedMode);
  }
  state.paidArenaUniversalCharges[normalizedMode] = normalizePaidArenaUniversalCharges(
    state.paidArenaUniversalCharges[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaUniversalCharges[normalizedMode];
}

function getPaidArenaChargeSpeeds(mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  if (!Array.isArray(state.paidArenaChargeSpeeds?.[normalizedMode])) {
    state.paidArenaChargeSpeeds[normalizedMode] = createEmptyPaidArenaChargeSpeeds(normalizedMode);
  }
  state.paidArenaChargeSpeeds[normalizedMode] = normalizePaidArenaChargeSpeeds(
    state.paidArenaChargeSpeeds[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaChargeSpeeds[normalizedMode];
}

function getPaidArenaRosannaSacrificeFrames(mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  if (!Array.isArray(state.paidArenaRosannaSacrificeFrames?.[normalizedMode])) {
    state.paidArenaRosannaSacrificeFrames[normalizedMode] = createEmptyPaidArenaRosannaSacrificeFrames(normalizedMode);
  }
  state.paidArenaRosannaSacrificeFrames[normalizedMode] = normalizePaidArenaRosannaSacrificeFrames(
    state.paidArenaRosannaSacrificeFrames[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaRosannaSacrificeFrames[normalizedMode];
}

function normalizePaidArenaTeams(savedTeams = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
      const savedValue = savedTeams?.[rowIndex]?.[slotIndex] ?? null;
      if (typeof savedValue === "string" || typeof savedValue === "number") return getCharacterById(savedValue);
      return savedValue?.id ? getCharacterById(savedValue.id) : null;
    }),
  );
}

function normalizePaidArenaUniversalCharges(savedCharges = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => sanitizeUniversalCharge(savedCharges?.[rowIndex]?.[slotIndex])),
  );
}

function normalizePaidArenaChargeSpeeds(savedSpeeds = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => sanitizeChargeSpeed(savedSpeeds?.[rowIndex]?.[slotIndex])),
  );
}

function normalizePaidArenaRosannaSacrificeFrames(savedFrames = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => sanitizeSacrificeFrame(savedFrames?.[rowIndex]?.[slotIndex])),
  );
}

function serializePaidArenaTeams(mode) {
  return getPaidArenaTeams(mode).map((team) => team.map((character) => character?.id || null));
}

function serializePaidArenaUniversalCharges(mode) {
  return getPaidArenaUniversalCharges(mode).map((teamCharges) => [...teamCharges]);
}

function serializePaidArenaChargeSpeeds(mode) {
  return getPaidArenaChargeSpeeds(mode).map((teamSpeeds) => [...teamSpeeds]);
}

function serializePaidArenaRosannaSacrificeFrames(mode) {
  return getPaidArenaRosannaSacrificeFrames(mode).map((teamFrames) => [...teamFrames]);
}

function serializePaidArenaLineupSlot(mode) {
  return {
    teams: serializePaidArenaTeams(mode),
    universalCharges: serializePaidArenaUniversalCharges(mode),
    chargeSpeeds: serializePaidArenaChargeSpeeds(mode),
    rosannaSacrificeFrames: serializePaidArenaRosannaSacrificeFrames(mode),
    activeRowIndex: Math.max(0, Math.min((PAID_ARENA_TEAM_COUNTS[mode] || 1) - 1, Number(state.paidArenaActiveRowIndex) || 0)),
  };
}

function normalizePaidArenaLineupSlot(slot = {}, mode = "c") {
  return {
    teams: normalizePaidArenaTeams(slot.teams, mode).map((team) => team.map((character) => character?.id || null)),
    universalCharges: normalizePaidArenaUniversalCharges(slot.universalCharges, mode),
    chargeSpeeds: normalizePaidArenaChargeSpeeds(slot.chargeSpeeds, mode),
    rosannaSacrificeFrames: normalizePaidArenaRosannaSacrificeFrames(slot.rosannaSacrificeFrames, mode),
    activeRowIndex: Math.max(0, Math.min((PAID_ARENA_TEAM_COUNTS[mode] || 1) - 1, Number(slot.activeRowIndex) || 0)),
  };
}

function normalizePaidArenaLineupSlots(savedSlots = [], mode = "c") {
  return Array.from({ length: LINEUP_SLOT_COUNT }, (_, index) => normalizePaidArenaLineupSlot(savedSlots?.[index], mode));
}

function ensurePaidArenaLineupSlots(mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  if (!Array.isArray(state.paidArenaLineupSlots?.[normalizedMode])) {
    state.paidArenaLineupSlots[normalizedMode] = normalizePaidArenaLineupSlots([], normalizedMode);
  }
  state.paidArenaLineupSlots[normalizedMode] = normalizePaidArenaLineupSlots(state.paidArenaLineupSlots[normalizedMode], normalizedMode);
  return state.paidArenaLineupSlots[normalizedMode];
}

function getPaidArenaActiveLineupIndex(mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  return Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(state.paidArenaActiveLineupIndex?.[normalizedMode]) || 0));
}

function saveCurrentPaidArenaLineupSlot(mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return;
  ensurePaidArenaLineupSlots(normalizedMode)[getPaidArenaActiveLineupIndex(normalizedMode)] = serializePaidArenaLineupSlot(normalizedMode);
}

function loadPaidArenaLineupSlot(mode = state.paidArenaMode, index = getPaidArenaActiveLineupIndex(mode)) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return;
  const slots = ensurePaidArenaLineupSlots(normalizedMode);
  const slot = normalizePaidArenaLineupSlot(slots[index], normalizedMode);
  state.paidArenaTeams[normalizedMode] = normalizePaidArenaTeams(slot.teams, normalizedMode);
  state.paidArenaUniversalCharges[normalizedMode] = normalizePaidArenaUniversalCharges(slot.universalCharges, normalizedMode);
  state.paidArenaChargeSpeeds[normalizedMode] = normalizePaidArenaChargeSpeeds(slot.chargeSpeeds, normalizedMode);
  state.paidArenaRosannaSacrificeFrames[normalizedMode] = normalizePaidArenaRosannaSacrificeFrames(slot.rosannaSacrificeFrames, normalizedMode);
  state.paidArenaActiveRowIndex = slot.activeRowIndex;
}

function getPaidArenaLineupSlotCount(slot = {}) {
  return [
    ...(slot.teams || []).flat().filter(Boolean),
    ...(slot.universalCharges || []).flat().filter((charge) => sanitizeUniversalCharge(charge) > 0),
  ].length;
}

function getPaidArenaDataTeamKey() {
  return normalizeTeamKey(state.paidArenaDataTeamKey);
}

function getPaidArenaSelectedDataTeamKey() {
  return getPaidArenaDataTeamKey();
}

function getPaidArenaTeamChargeSpeeds(team, dataTeamKey = getPaidArenaDataTeamKey()) {
  return Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
    const character = team?.[slotIndex];
    return character ? getSavedCharacterChargeSpeed(character, dataTeamKey) : 0;
  });
}

function syncPaidArenaChargeSpeedsFromSavedData(mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return;
  const dataTeamKey = getPaidArenaDataTeamKey();
  const teams = getPaidArenaTeams(normalizedMode);
  teams.forEach((team, rowIndex) => {
    getPaidArenaChargeSpeeds(normalizedMode)[rowIndex] = getPaidArenaTeamChargeSpeeds(team, dataTeamKey);
  });
}

function setPaidArenaDataTeamKey(teamKey) {
  state.paidArenaDataTeamKey = normalizeTeamKey(teamKey);
  syncPaidArenaChargeSpeedsFromSavedData();
  openSlotSettings = null;
  saveTeam();
  render();
}

function simulatePaidArenaBurst(team, chargeSpeeds = [], universalCharges = [], sacrificeFrames = Array(TEAM_SIZE).fill(null)) {
  const dataTeamKey = getPaidArenaDataTeamKey();
  const previousChargeSpeeds = state.chargeSpeeds;
  const previousDefenseChargeSpeeds = state.defenseChargeSpeeds;
  const previousQuantumCubes = state.characterQuantumCubes.attack;
  const previousDefenseQuantumCubes = state.characterQuantumCubes.defense;
  const previousMagazines = state.characterMagazines.attack;
  const previousDefenseMagazines = state.characterMagazines.defense;
  const previousRedHoodPierceCounts = state.characterRedHoodPierceCounts.attack;
  const previousDefenseRedHoodPierceCounts = state.characterRedHoodPierceCounts.defense;
  const normalizedChargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(chargeSpeeds[index]));
  if (dataTeamKey === "defense") {
    state.defenseChargeSpeeds = normalizedChargeSpeeds;
  } else {
    state.chargeSpeeds = normalizedChargeSpeeds;
  }
  state.characterQuantumCubes[dataTeamKey] = getCharacterQuantumCubeMemory(dataTeamKey);
  state.characterMagazines[dataTeamKey] = getCharacterMagazineMemory(dataTeamKey);
  state.characterRedHoodPierceCounts[dataTeamKey] = getCharacterRedHoodPierceCountMemory(dataTeamKey);
  try {
    return simulateBurst(team, dataTeamKey, [], [], [], [], null, universalCharges, [], sacrificeFrames);
  } finally {
    state.chargeSpeeds = previousChargeSpeeds;
    state.defenseChargeSpeeds = previousDefenseChargeSpeeds;
    state.characterQuantumCubes.attack = previousQuantumCubes;
    state.characterQuantumCubes.defense = previousDefenseQuantumCubes;
    state.characterMagazines.attack = previousMagazines;
    state.characterMagazines.defense = previousDefenseMagazines;
    state.characterRedHoodPierceCounts.attack = previousRedHoodPierceCounts;
    state.characterRedHoodPierceCounts.defense = previousDefenseRedHoodPierceCounts;
  }
}

function getPaidArenaPickedIds(mode = state.paidArenaMode) {
  return new Set(getPaidArenaTeams(mode).flat().filter(Boolean).map((character) => character.id));
}

function findPaidArenaCharacter(character, mode = state.paidArenaMode) {
  if (!character) return null;
  const teams = getPaidArenaTeams(mode);
  for (let rowIndex = 0; rowIndex < teams.length; rowIndex += 1) {
    const slotIndex = teams[rowIndex].findIndex((member) => member && member.id === character.id);
    if (slotIndex !== -1) return { rowIndex, slotIndex };
  }
  return null;
}

function getLocalPaidInferenceSignature() {
  return JSON.stringify(getLocalPaidInferencePayload());
}

function formatPaidInferenceMatch(match, key) {
  const values = match.displayValues?.length ? match.displayValues.join(" / ") : (match[key] || []).join(" / ");
  return `P${match.attackPosition} ${match.attackCharacterName} 第${match.shotNumber}发：${values || "无匹配"}`;
}

function scheduleLocalPaidInferenceRefresh() {
  if (!state.testMode || !hasLocalPaidDevAccess()) return;
  const signature = getLocalPaidInferenceSignature();
  if (signature === localPaidInferenceState.requestSignature && (localPaidInferenceState.loading || localPaidInferenceState.result || localPaidInferenceState.error)) return;
  if (localPaidInferenceState.refreshTimer) clearTimeout(localPaidInferenceState.refreshTimer);
  localPaidInferenceState.refreshTimer = setTimeout(() => {
    localPaidInferenceState.refreshTimer = null;
    localPaidInferenceState.requestSignature = signature;
    refreshLocalPaidInference();
  }, 0);
}

async function refreshLocalPaidInference() {
  localPaidInferenceState.loading = true;
  localPaidInferenceState.error = "";
  localPaidInferenceState.result = null;
  renderTeam();
  try {
    const response = await fetch(LOCAL_PAID_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer dev-paid-token",
      },
      body: JSON.stringify(getLocalPaidInferencePayload()),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || `Pro 后端返回 ${response.status}`);
    }
    localPaidInferenceState.result = data.data;
  } catch (error) {
    localPaidInferenceState.error = `无法连接本地 Pro 后端。请确认 http://localhost:8787 已启动。${error?.message ? ` (${error.message})` : ""}`;
  } finally {
    localPaidInferenceState.loading = false;
    renderTeam();
  }
}

function getPaidCandidateLines(candidateType, valueKey) {
  const candidate = localPaidInferenceState.result?.candidates?.find((item) => item.type === candidateType);
  if (localPaidInferenceState.loading) return ["计算中..."];
  if (localPaidInferenceState.error) return [localPaidInferenceState.error];
  if (!candidate?.matches?.length) return ["无匹配"];
  return candidate.matches.map((match) => formatPaidInferenceMatch(match, valueKey));
}

function renderTestDefenseRow() {
  const row = document.createElement("section");
  row.className = `team-row test-defense-row${state.activeTeamKey === "defense" ? " is-active" : ""}`;
  row.dataset.teamKey = "defense";
  row.addEventListener("click", () => {
    const wasActive = state.activeTeamKey === "defense";
    setActiveTeam("defense");
    if (!wasActive) render();
  });
  row.setAttribute("aria-label", "空枪反推候选");
  row.innerHTML = '<div class="test-candidates-row"></div>';
  const slotsRow = row.querySelector(".test-candidates-row");
  const candidates = [
    {
      character: getCharacterById(12),
      lines: getPaidCandidateLines("noah-charge-speed", "chargeSpeeds"),
      hasMatch: Boolean(localPaidInferenceState.result?.candidates?.find((candidate) => candidate.type === "noah-charge-speed")?.matches?.length),
    },
    {
      character: getCharacterById(37),
      lines: getPaidCandidateLines("scarlet-magazine", "magazines"),
      hasMatch: Boolean(localPaidInferenceState.result?.candidates?.find((candidate) => candidate.type === "scarlet-magazine")?.matches?.length),
    },
  ];

  candidates.forEach((candidate) => {
    const slot = document.createElement("div");
    slot.className = `test-candidate${candidate.hasMatch ? " has-test-match" : ""}${localPaidInferenceState.error ? " is-error" : ""}`;
    slot.innerHTML = `
      <span class="test-candidate-avatar" aria-label="${escapeHtml(candidate.character?.name || "")}">
        <span class="team-avatar">${candidate.character ? getAvatarMarkup(candidate.character) : ""}</span>
      </span>
      <span class="test-candidate-result">
        ${candidate.lines.map((line) => `<strong>${escapeHtml(line)}</strong>`).join("")}
      </span>
    `;
    slotsRow.append(slot);
  });

  return row;
}

function createPaidFeatureModal(title = "空枪反推") {
  const backdrop = document.createElement("div");
  backdrop.className = "paid-modal-backdrop";
  backdrop.setAttribute("role", "presentation");
  backdrop.innerHTML = `
    <section class="paid-modal" role="dialog" aria-modal="true" aria-label="功能提示">
      <div class="paid-modal-head">
        <div>
          <span class="paid-modal-kicker">Pro</span>
          <strong>${escapeHtml(title)}</strong>
        </div>
        <button class="paid-modal-close" type="button" aria-label="关闭">X</button>
      </div>
      <div class="paid-modal-content">
        <p>该功能正在开发中！</p>
      </div>
      <div class="paid-modal-actions">
        <button class="paid-modal-confirm" type="button">知道了</button>
      </div>
    </section>
  `;
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closePaidFeatureModal();
  });
  backdrop.querySelector(".paid-modal").addEventListener("click", (event) => event.stopPropagation());
  backdrop.querySelector(".paid-modal-close").addEventListener("click", closePaidFeatureModal);
  backdrop.querySelector(".paid-modal-confirm").addEventListener("click", closePaidFeatureModal);
  return backdrop;
}

function setPaidTestMode(enabled) {
  state.testMode = Boolean(enabled);
  if (state.testMode) state.paidArenaMode = "normal";
  if (!state.testMode) {
    localPaidInferenceState.result = null;
    localPaidInferenceState.error = "";
    localPaidInferenceState.loading = false;
    localPaidInferenceState.requestSignature = "";
  } else {
    localPaidInferenceState.result = null;
    localPaidInferenceState.error = "";
    localPaidInferenceState.loading = false;
    localPaidInferenceState.requestSignature = "";
  }
  setActiveTeam("attack");
  hideChartTooltip();
  render();
}

function openPaidInferenceFeature() {
  if (hasLocalPaidDevAccess()) {
    closePaidFeatureModal();
    setPaidTestMode(!state.testMode);
    return;
  }
  closePaidFeatureModal();
  document.body.append(createPaidFeatureModal("空枪反推"));
}

function getPaidArenaFeatureTitle(mode) {
  return mode === "c" ? "冠军竞技场" : "特殊竞技场";
}

function getPaidArenaModeLabel(mode = state.paidArenaMode) {
  return mode === "c" ? "冠军竞技场" : mode === "p" ? "特殊竞技场" : "";
}

function setPaidArenaMode(mode) {
  const nextMode = normalizePaidArenaMode(mode);
  if (isPaidArenaModeActive()) saveCurrentPaidArenaLineupSlot(state.paidArenaMode);
  state.paidArenaMode = nextMode;
  if (isPaidArenaModeActive()) {
    state.paidArenaActiveLineupIndex[nextMode] = getPaidArenaActiveLineupIndex(nextMode);
    loadPaidArenaLineupSlot(nextMode, state.paidArenaActiveLineupIndex[nextMode]);
    state.testMode = false;
    state.paidArenaActiveRowIndex = Math.max(
      0,
      Math.min(getPaidArenaTeams().length - 1, Number(state.paidArenaActiveRowIndex) || 0),
    );
    syncPaidArenaChargeSpeedsFromSavedData();
  }
  openSlotSettings = null;
  hideChartTooltip();
  saveTeam();
  render();
}

function openPaidArenaFeature(mode) {
  const nextMode = normalizePaidArenaMode(mode);
  if (nextMode === "normal") return;
  closePaidFeatureModal();
  setPaidArenaMode(state.paidArenaMode === nextMode ? "normal" : nextMode);
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
  if (isPaidArenaModeActive()) {
    els.lineupSlots.hidden = false;
    const mode = state.paidArenaMode;
    const activeIndex = getPaidArenaActiveLineupIndex(mode);
    const fragment = document.createDocumentFragment();
    ensurePaidArenaLineupSlots(mode).forEach((slot, index) => {
      const count = getPaidArenaLineupSlotCount(slot);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `lineup-slot-button${index === activeIndex ? " is-active" : ""}${count ? " has-lineup" : ""}`;
      button.dataset.paidArenaLineupIndex = index;
      button.textContent = String(index + 1);
      button.title = `${getPaidArenaModeLabel(mode)}方案 ${index + 1}${count ? ` · ${count}` : " · 空"}`;
      fragment.append(button);
    });
    els.lineupSlots.replaceChildren(fragment);
    return;
  }
  els.lineupSlots.hidden = false;
  const fragment = document.createDocumentFragment();
  state.lineupSlots.forEach((slot, index) => {
    const count = getLineupSlotCount(slot);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lineup-slot-button${index === state.activeLineupIndex ? " is-active" : ""}${count ? " has-lineup" : ""}`;
    button.dataset.lineupIndex = index;
    button.draggable = true;
    button.textContent = String(index + 1);
    button.title = `方案 ${index + 1}${count ? ` · ${count}/10` : " · 空"}，可拖动复制到其他方案`;
    button.addEventListener("dragstart", (event) => {
      draggedLineupIndex = index;
      button.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", String(index));
    });
    button.addEventListener("dragend", () => {
      draggedLineupIndex = null;
      els.lineupSlots.querySelectorAll(".lineup-slot-button").forEach((slotButton) => {
        slotButton.classList.remove("is-dragging", "is-drop-target");
      });
    });
    button.addEventListener("dragover", (event) => {
      const sourceIndex = getDraggedLineupSourceIndex(event);
      if (sourceIndex === null || sourceIndex === index) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      button.classList.add("is-drop-target");
    });
    button.addEventListener("dragleave", () => {
      button.classList.remove("is-drop-target");
    });
    button.addEventListener("drop", (event) => {
      event.preventDefault();
      const sourceIndex = getDraggedLineupSourceIndex(event);
      button.classList.remove("is-drop-target");
      suppressLineupClick = true;
      setTimeout(() => {
        suppressLineupClick = false;
      }, 0);
      if (sourceIndex === null) return;
      copyLineupSlotTo(sourceIndex, index);
    });
    fragment.append(button);
  });
  els.lineupSlots.replaceChildren(fragment);
}

function syncPaidFeatureButtons() {
  if (els.paidInferenceButton) {
    els.paidInferenceButton.classList.toggle("is-active", state.testMode);
    els.paidInferenceButton.setAttribute("aria-pressed", String(state.testMode));
  }
  if (els.paidCModeButton) {
    els.paidCModeButton.classList.toggle("is-active", state.paidArenaMode === "c");
    els.paidCModeButton.setAttribute("aria-pressed", String(state.paidArenaMode === "c"));
  }
  if (els.paidPModeButton) {
    els.paidPModeButton.classList.toggle("is-active", state.paidArenaMode === "p");
    els.paidPModeButton.setAttribute("aria-pressed", String(state.paidArenaMode === "p"));
  }
}

function getPaidArenaResultText(team, universalCharges, chargeSpeeds = [], result = null, sacrificeFrames = Array(TEAM_SIZE).fill(null)) {
  const rowResult = result || simulatePaidArenaBurst(team, chargeSpeeds, universalCharges, sacrificeFrames);
  if (!rowResult) return "未配置";
  if (rowResult.error) return rowResult.error;
  const frame = rowResult.fullFrame;
  return `等于${formatNumber(frame / 76, 2)}RL(${frame}F)等于${formatNumber(frame / 42 + 1, 2)}SG`;
}

function createPaidArenaDataSourceBar() {
  const dataTeamKey = getPaidArenaSelectedDataTeamKey();
  const bar = document.createElement("div");
  bar.className = "paid-arena-data-source-bar";
  bar.innerHTML = `
    <span>使用角色已保存的${dataTeamKey === "defense" ? "防守" : "进攻"}数据；在此修改会同步回该数据。</span>
    <div class="paid-arena-data-source-actions" role="group" aria-label="选择角色设置数据来源">
      <button class="${dataTeamKey === "attack" ? "is-active" : ""}" type="button" data-paid-data-source="attack">进攻数据</button>
      <button class="${dataTeamKey === "defense" ? "is-active" : ""}" type="button" data-paid-data-source="defense">防守数据</button>
    </div>
  `;
  bar.querySelectorAll("[data-paid-data-source]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setPaidArenaDataTeamKey(button.dataset.paidDataSource);
    });
  });
  return bar;
}

function renderPaidArenaTeams() {
  const fragment = document.createDocumentFragment();
  const teams = getPaidArenaTeams();
  const universalChargeRows = getPaidArenaUniversalCharges();
  const sacrificeRows = getPaidArenaRosannaSacrificeFrames();
  const dataTeamKey = getPaidArenaDataTeamKey();
  state.paidArenaActiveRowIndex = Math.max(0, Math.min(teams.length - 1, Number(state.paidArenaActiveRowIndex) || 0));
  fragment.append(createPaidArenaDataSourceBar());

  teams.forEach((team, rowIndex) => {
    const universalCharges = universalChargeRows[rowIndex] || Array(TEAM_SIZE).fill(0);
    const sacrificeFrames = sacrificeRows[rowIndex] || Array(TEAM_SIZE).fill(null);
    const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, dataTeamKey);
    const result = simulatePaidArenaBurst(team, chargeSpeeds, universalCharges, sacrificeFrames);
    const finishingPositions = new Set(result && !result.error ? result.finishingPositionIndices : []);
    const tauntTargetPositionIndex = getTauntTargetState(team, dataTeamKey, chargeSpeeds)?.positionIndex ?? null;
    const teamHasRosanna = team.some((member) => member && isRosanna(member));
    const hasSacrificeTarget = team.some(
      (member, index) => member && !isRosanna(member) && sanitizeSacrificeFrame(sacrificeFrames[index]) !== null,
    );
    const row = document.createElement("section");
    row.className = `team-row paid-arena-row${state.paidArenaActiveRowIndex === rowIndex ? " is-active" : ""}`;
    row.dataset.paidArenaRowIndex = String(rowIndex);
    row.setAttribute("aria-label", `${getPaidArenaModeLabel()}第${rowIndex + 1}队`);
    row.innerHTML = '<div class="team-slots-row"></div><div class="paid-arena-result-bar"></div>';
    row.addEventListener("click", (event) => {
      if (event.target.closest(".universal-charge-field")) return;
      state.paidArenaActiveRowIndex = rowIndex;
      saveTeam();
      render();
    });

    const slotsRow = row.querySelector(".team-slots-row");
    team.forEach((character, slotIndex) => {
      const universalChargeValue = sanitizeUniversalCharge(universalCharges[slotIndex]);
      const chargeSpeedValue = sanitizeChargeSpeed(chargeSpeeds[slotIndex]);
      const isSettingsOpen =
        character &&
        openSlotSettings?.paidArenaMode === state.paidArenaMode &&
        Number(openSlotSettings.rowIndex) === rowIndex &&
        Number(openSlotSettings.index) === slotIndex;
      const isFinisher = finishingPositions.has(slotIndex) && canShowFinishMarker(character);
      const isTauntTarget = character && slotIndex === tauntTargetPositionIndex;
      const sacrificeFrame = sanitizeSacrificeFrame(sacrificeFrames[slotIndex]);
      const isSacrificedTarget =
        character && teamHasRosanna && !isRosanna(character) && sacrificeFrame !== null;
      const displayMagazine = character ? getDisplayMagazine(character, dataTeamKey) : null;
      const sideBadgeText =
        character && canEditChargeSpeed(character) && chargeSpeedValue > 0
          ? `${chargeSpeedValue}%`
          : displayMagazine
            ? String(displayMagazine)
            : "";
      const cubeIconSrc = character ? getCubeIconSrc(getSavedCharacterCubeType(character, dataTeamKey)) : "";
      const slot = document.createElement("div");
      slot.className = `team-slot paid-arena-slot${character ? " filled" : ""}${!character && universalChargeValue > 0 ? " has-universal" : ""}${getTeamSlotRarityClass(character)}${isFinisher ? " is-finisher" : ""}`;
      slot.dataset.paidArenaRowIndex = String(rowIndex);
      slot.dataset.slotIndex = String(slotIndex);
      slot.draggable = Boolean(character);
      slot.innerHTML = character
        ? `
          <button class="slot-remove" type="button" aria-label="移除 ${escapeHtml(character.name)}">
            <span class="team-avatar">${getAvatarMarkup(character)}</span>
          </button>
        `
        : `
          <div class="slot-empty">
            <span class="position">P${slotIndex + 1}</span>
            <label class="universal-charge-field" aria-label="P${slotIndex + 1}万能充能值">
              <span class="universal-charge-label">充</span>
              <input type="text" inputmode="decimal" value="${universalChargeValue || ""}" placeholder="0" data-paid-arena-universal-index="${slotIndex}" />
            </label>
          </div>
        `;

      if (character) {
        const removeButton = slot.querySelector(".slot-remove");
        const copyLayer = document.createElement("span");
        copyLayer.className = "slot-copy";
        copyLayer.setAttribute("aria-hidden", "true");
        copyLayer.innerHTML = `
          ${isTauntTarget ? '<span class="taunt-mark">嘲</span>' : ""}
          ${isSacrificedTarget ? getSacrificeMarkMarkup(sacrificeFrame) : ""}
          ${isFinisher ? '<span class="finish-mark">定</span>' : ""}
          ${cubeIconSrc ? `<span class="slot-cube-badge"><img src="${cubeIconSrc}" alt="" /></span>` : ""}
          ${sideBadgeText ? `<span class="slot-speed-badge">${sideBadgeText}</span>` : ""}
        `;
        removeButton?.append(copyLayer);

        const settingsButton = document.createElement("button");
        settingsButton.className = `slot-settings-toggle${isSettingsOpen ? " is-open" : ""}`;
        settingsButton.type = "button";
        settingsButton.setAttribute("aria-label", `设置 ${character.name}`);
        settingsButton.title = "设置";
        settingsButton.innerHTML = '<img src="assets/icons/ui/settings.svg" alt="" aria-hidden="true" />';
        slot.append(settingsButton);

        if (isRosanna(character)) {
          const sacrificeButton = document.createElement("button");
          sacrificeButton.className = `slot-sacrifice-toggle${
            isPaidArenaRosannaSacrificeSettingsOpen(state.paidArenaMode, rowIndex, slotIndex) || hasSacrificeTarget ? " is-active" : ""
          }`;
          sacrificeButton.type = "button";
          sacrificeButton.setAttribute("aria-label", `设置 ${character.name} 献祭`);
          sacrificeButton.title = "罗珊娜献祭";
          sacrificeButton.innerHTML = '<img src="assets/icons/ui/pierce.svg" alt="" aria-hidden="true" />';
          slot.append(sacrificeButton);
        }
      }

      slot.addEventListener("click", (event) => {
        event.stopPropagation();
        if (event.target.closest(".universal-charge-field")) return;
        if (suppressTeamSlotClick) return;
        state.paidArenaActiveRowIndex = rowIndex;
        saveTeam();
        render();
      });

      slot.addEventListener("dragstart", (event) => {
        if (!character || isTeamSlotDragControl(event.target)) {
          event.preventDefault();
          return;
        }
        draggedTeamIndex = slotIndex;
        draggedTeamKey = "paidArena";
        draggedPaidArenaRowIndex = rowIndex;
        slot.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", `paidArena:${rowIndex}:${slotIndex}`);
        setTeamSlotDragImage(event, slot);
      });

      slot.addEventListener("dragend", () => {
        draggedTeamIndex = null;
        draggedTeamKey = null;
        draggedPaidArenaRowIndex = null;
        els.teamSlots.querySelectorAll(".team-slot").forEach((teamSlot) => {
          teamSlot.classList.remove("is-dragging", "is-drop-target");
        });
      });

      slot.addEventListener("dragover", (event) => {
        if (draggedTeamIndex === null) return;
        if (draggedTeamKey === "paidArena" && draggedPaidArenaRowIndex === rowIndex && draggedTeamIndex === slotIndex) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        slot.classList.add("is-drop-target");
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("is-drop-target");
      });

      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        slot.classList.remove("is-drop-target");
        const [, sourceRowText, sourceIndexText] = String(
          event.dataTransfer.getData("text/plain") || `paidArena:${draggedPaidArenaRowIndex}:${draggedTeamIndex}`,
        ).split(":");
        movePaidArenaSlot(Number(sourceRowText), Number(sourceIndexText), rowIndex, slotIndex);
      });

      slot.addEventListener("pointerdown", (event) =>
        handleTeamSlotPointerDown(event, slot, character, "paidArena", slotIndex, { paidArena: true, rowIndex }),
      );
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
          removePaidArenaCharacter(rowIndex, slotIndex);
        });
        slot.querySelector(".slot-remove").addEventListener("pointerdown", handleCopyContextPointerDown);
        slot.querySelector(".slot-remove").addEventListener("contextmenu", handleCopyContextMenu);
        slot.querySelector(".slot-settings-toggle")?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          state.paidArenaActiveRowIndex = rowIndex;
          openSlotSettings = isSettingsOpen
            ? null
            : {
                paidArenaMode: state.paidArenaMode,
                rowIndex,
                index: slotIndex,
              };
          saveTeam();
          render();
        });
        slot.querySelector(".slot-settings-toggle")?.addEventListener("pointerdown", (event) => event.stopPropagation());
        slot.querySelector(".slot-settings-toggle")?.addEventListener("dragstart", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        slot.querySelector(".slot-sacrifice-toggle")?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          state.paidArenaActiveRowIndex = rowIndex;
          togglePaidArenaRosannaSacrificeSettings(state.paidArenaMode, rowIndex, slotIndex);
          saveTeam();
          render();
        });
        slot.querySelector(".slot-sacrifice-toggle")?.addEventListener("pointerdown", (event) => event.stopPropagation());
        slot.querySelector(".slot-sacrifice-toggle")?.addEventListener("dragstart", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
      } else {
        const universalInput = slot.querySelector("[data-paid-arena-universal-index]");
        universalInput.addEventListener("pointerdown", (event) => event.stopPropagation());
        universalInput.addEventListener("mousedown", (event) => event.stopPropagation());
        universalInput.addEventListener("touchstart", (event) => event.stopPropagation(), { passive: true });
        universalInput.addEventListener("click", (event) => event.stopPropagation());
        universalInput.addEventListener("focus", (event) => {
          event.stopPropagation();
          event.target.select();
        });
        universalInput.addEventListener("input", (event) => {
          event.stopPropagation();
          state.paidArenaActiveRowIndex = rowIndex;
          universalCharges[slotIndex] = sanitizeUniversalCharge(event.target.value);
          slot.classList.toggle("has-universal", universalCharges[slotIndex] > 0);
          resultBar.textContent = getPaidArenaResultText(team, universalCharges, chargeSpeeds, null, sacrificeFrames);
        });
        universalInput.addEventListener("keydown", (event) => {
          event.stopPropagation();
          if (event.key !== "Enter") return;
          event.preventDefault();
          event.target.blur();
        });
        universalInput.addEventListener("blur", (event) => {
          const value = sanitizeUniversalCharge(event.target.value);
          universalCharges[slotIndex] = value;
          event.target.value = value || "";
          slot.classList.toggle("has-universal", value > 0);
          resultBar.textContent = getPaidArenaResultText(team, universalCharges, chargeSpeeds, null, sacrificeFrames);
          saveTeam();
        });
      }
      slotsRow.append(slot);
    });

    const resultBar = row.querySelector(".paid-arena-result-bar");
    resultBar.textContent = getPaidArenaResultText(team, universalCharges, chargeSpeeds, result, sacrificeFrames);

    fragment.append(row);
  });

  const settingsModal = createSlotSettingsModal();
  if (settingsModal) fragment.append(settingsModal);
  const sacrificeModal = createRosannaSacrificeModal();
  if (sacrificeModal) fragment.append(sacrificeModal);

  els.teamSlots.replaceChildren(fragment);
}

function renderTeam(battleResults = getBattleResultsSnapshot()) {
  const fragment = document.createDocumentFragment();
  const { attackResult, defenseResult } = battleResults;
  syncPaidFeatureButtons();
  if (isPaidArenaModeActive()) {
    renderPaidArenaTeams();
    return;
  }
  const resultsByTeam = new Map([
    ["defense", defenseResult],
    ["attack", attackResult],
  ]);

  ["defense", "attack"].forEach((teamKey) => {
    if (state.testMode && teamKey === "defense") {
      fragment.append(renderTestDefenseRow());
      return;
    }
    const team = getTeamState(teamKey);
    const chargeSpeeds = getChargeSpeedState(teamKey);
    const universalCharges = getUniversalChargeState(teamKey);
    const redHoodPierceCounts = getRedHoodPierceCountState(teamKey);
    const scarletCounterEnabled = getScarletCounterEnabledState(teamKey);
    const rosannaSacrificeFrames = getRosannaSacrificeFrameState(teamKey);
    const teamHasRosanna = team.some((member) => member && isRosanna(member));
    const hasSacrificeTarget = team.some(
      (member, index) => member && !isRosanna(member) && sanitizeSacrificeFrame(rosannaSacrificeFrames[index]) !== null,
    );
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
    const tauntTargetPositionIndex =
      getTauntTargetState(teamKey === "defense" ? state.defenseTeam : state.team, teamKey, chargeSpeeds)?.positionIndex ?? null;
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
      const sacrificeFrame = sanitizeSacrificeFrame(rosannaSacrificeFrames[index]);
      const isSacrificedTarget =
        character && teamHasRosanna && !isRosanna(character) && sacrificeFrame !== null;
      const isTauntTarget = character && index === tauntTargetPositionIndex;
      const sideBadgeText =
        character && canEditChargeSpeed(character) && chargeSpeedValue > 0
          ? `${chargeSpeedValue}%`
          : displayMagazine
            ? String(displayMagazine)
            : "";
      const cubeIconSrc = character ? getCubeIconSrc(getSavedCharacterCubeType(character, teamKey)) : "";
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
              ${isTauntTarget ? '<span class="taunt-mark">嘲</span>' : ""}
              ${isSacrificedTarget ? getSacrificeMarkMarkup(sacrificeFrame) : ""}
              ${isFinisher ? '<span class="finish-mark">定</span>' : ""}
              ${cubeIconSrc ? `<span class="slot-cube-badge"><img src="${cubeIconSrc}" alt="" /></span>` : ""}
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
            isRosanna(character)
              ? `
                <button class="slot-sacrifice-toggle${isRosannaSacrificeSettingsOpen(teamKey, index) || hasSacrificeTarget ? " is-active" : ""}" type="button" aria-label="设置 ${escapeHtml(character.name)} 献祭" title="罗珊娜献祭">
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
        slot.querySelector(".slot-remove").addEventListener("pointerdown", handleCopyContextPointerDown);
        slot.querySelector(".slot-remove").addEventListener("contextmenu", handleCopyContextMenu);
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
        const sacrificeToggle = slot.querySelector(".slot-sacrifice-toggle");
        if (sacrificeToggle) {
          sacrificeToggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setActiveTeam(teamKey);
            toggleRosannaSacrificeSettings(teamKey, index);
            render();
          });
          sacrificeToggle.addEventListener("pointerdown", (event) => event.stopPropagation());
          sacrificeToggle.addEventListener("dragstart", (event) => {
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
  const sacrificeModal = createRosannaSacrificeModal();
  if (sacrificeModal) fragment.append(sacrificeModal);

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
  const tauntPositionsByTeam = new Map([
    ["defense", getTauntTargetState(state.defenseTeam, "defense", state.defenseChargeSpeeds)?.positionIndex ?? null],
    ["attack", getTauntTargetState(state.team, "attack", state.chargeSpeeds)?.positionIndex ?? null],
  ]);

  els.teamSlots.querySelectorAll(".team-slot").forEach((slot) => {
    const teamKey = slot.dataset.teamKey || "attack";
    const index = Number(slot.dataset.slotIndex);
    const finishingPositions = finishingPositionsByTeam.get(teamKey) || new Set();
    const tauntPositionIndex = tauntPositionsByTeam.get(teamKey);
    const character = getTeamState(teamKey)[index];
    const isFinisher = finishingPositions.has(index) && canShowFinishMarker(character);
    const isTauntTarget = character && index === tauntPositionIndex;
    slot.classList.toggle("is-finisher", isFinisher);

    const slotCopy = slot.querySelector(".slot-copy");
    if (!slotCopy) return;

    const existingTauntMark = slotCopy.querySelector(".taunt-mark");
    if (isTauntTarget && !existingTauntMark) {
      const mark = document.createElement("span");
      mark.className = "taunt-mark";
      mark.textContent = "嘲";
      slotCopy.prepend(mark);
    }
    if (!isTauntTarget && existingTauntMark) {
      existingTauntMark.remove();
    }

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
        const chargePerLink = getBaseChargeUnit(member.character);
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
      const chargePerLink = getBaseChargeUnit(member.character);
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
  const defenseTauntTarget = getTauntTargetState(state.defenseTeam, "defense", state.defenseChargeSpeeds);
  const attackTauntTarget = getTauntTargetState(state.team, "attack", state.chargeSpeeds);
  let attackResult = simulateBurst(state.team, "attack", [], [], [], attackStunWindows, defenseTauntTarget, null, state.defenseTeam);
  let defenseResult = simulateBurst(
    state.defenseTeam,
    "defense",
    [],
    [],
    [],
    defenseStunWindows,
    attackTauntTarget,
    null,
    state.team,
  );

  for (let index = 0; index < 8; index += 1) {
    const attackSpecials = getSpecialChargeEventsForTeam(attackResult, defenseResult);
    const defenseSpecials = getSpecialChargeEventsForTeam(defenseResult, attackResult);
    const nextAttackResult = simulateBurst(
      state.team,
      "attack",
      attackSpecials,
      defenseResult?.reloadTimeline || [],
      defenseResult?.turnDodgeTimeline || [],
      attackStunWindows,
      defenseTauntTarget,
      null,
      state.defenseTeam,
    );
    const nextDefenseResult = simulateBurst(
      state.defenseTeam,
      "defense",
      defenseSpecials,
      attackResult?.reloadTimeline || [],
      attackResult?.turnDodgeTimeline || [],
      defenseStunWindows,
      attackTauntTarget,
      null,
      state.team,
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
    region: state.filters.region,
    defenseTeam: state.defenseTeam.map((character) => character?.id || null),
    defenseChargeSpeeds: [...state.defenseChargeSpeeds],
    defenseUniversalCharges: [...state.defenseUniversalCharges],
    team: state.team.map((character) => character?.id || null),
    chargeSpeeds: [...state.chargeSpeeds],
    universalCharges: [...state.universalCharges],
    characterQuantumCubes: state.characterQuantumCubes,
    characterMagazines: state.characterMagazines,
    jackalLinks: state.jackalLinks,
    allowMissedShots: state.allowMissedShots,
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
  if (isPaidArenaModeActive()) {
    state.battleResults = computeBattleResults();
    return;
  }
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

function getActivePaidArenaChartResult() {
  if (!isPaidArenaModeActive()) return null;
  const mode = state.paidArenaMode;
  const teams = getPaidArenaTeams(mode);
  if (!teams.length) return null;
  const rowIndex = Math.max(0, Math.min(teams.length - 1, Number(state.paidArenaActiveRowIndex) || 0));
  const team = teams[rowIndex] || [];
  const universalCharges = getPaidArenaUniversalCharges(mode)[rowIndex] || Array(TEAM_SIZE).fill(0);
  const sacrificeFrames = getPaidArenaRosannaSacrificeFrames(mode)[rowIndex] || Array(TEAM_SIZE).fill(null);
  const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, getPaidArenaDataTeamKey());
  return simulatePaidArenaBurst(team, chargeSpeeds, universalCharges, sacrificeFrames);
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
  const visibleDodgeEvents = state.allowMissedShots
    ? chartResults.flatMap((item) => {
        const displayEndFrame = getBurstDisplayEndFrame(item.result);
        return [
          ...(item.result.reloadTimeline || []).map((reload) => ({
            ...reload,
            type: "reload",
            startFrame: reload.startFrame,
            endFrame: Math.min(reload.endFrame, reload.startFrame + MISS_DODGE_WINDOW_FRAMES),
            durationFrames: Math.min(reload.reloadFrames || MISS_DODGE_WINDOW_FRAMES, MISS_DODGE_WINDOW_FRAMES),
            teamKey: item.teamKey,
            displayEndFrame,
          })),
          ...(item.result.turnDodgeTimeline || []).map((turn) => ({
            ...turn,
            type: "turn",
            endFrame: Math.min(turn.endFrame, turn.startFrame + MISS_DODGE_WINDOW_FRAMES),
            durationFrames: Math.min(turn.dodgeFrames || MISS_DODGE_WINDOW_FRAMES, MISS_DODGE_WINDOW_FRAMES),
            teamKey: item.teamKey,
            displayEndFrame,
          })),
        ].filter((window) => window.startFrame <= Math.min(CHART_MAX_FRAME, displayEndFrame));
      })
    : [];
  const visibleMissedEvents = chartResults.flatMap((item) => {
    const displayEndFrame = getBurstDisplayEndFrame(item.result);
    return (item.result.missedTimeline || [])
      .filter((miss) => miss.frame <= Math.min(CHART_MAX_FRAME, displayEndFrame))
      .map((miss) => ({ ...miss, teamKey: item.teamKey, displayEndFrame }));
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
  const rosannaSacrificeGroups = chartResults
    .map((item) => {
      const timeline = item.result.timeline
        .map((entry) => {
          const contributions = entry.contributions.filter(
            (contribution) => contribution.showOnMember === false && contribution.labels.some((label) => label.includes("罗珊娜献祭")),
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
        groupKey: `${item.teamKey}-rosanna-sacrifice`,
        label: "罗珊娜献祭",
        timeline,
      };
    })
    .filter(Boolean);
  const specialChargeGroups = [...universalChargeGroups, ...rosannaSacrificeGroups];
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
      ...getAvailableBurstMarkers(item.result).map((marker) => marker.frame),
      ...visibleDodgeEvents
        .filter((entry) => entry.teamKey === item.teamKey)
        .map((entry) => Math.min(entry.endFrame, CHART_MAX_FRAME, displayEndFrame)),
      ...(item.result.missedTimeline || []).map((entry) => Math.min(entry.frame, CHART_MAX_FRAME, displayEndFrame)),
    ];
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
    ...specialChargeGroups.map((group) => group.label),
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
  const defenseUniversalGroups = specialChargeGroups.filter((group) => group.teamKey === "defense");
  const attackUniversalGroups = specialChargeGroups.filter((group) => group.teamKey === "attack");
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
          if (shotFrames.length === 0) {
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
      const groupMisses = visibleMissedEvents
        .filter((miss) => miss.teamKey === group.teamKey && miss.positionIndex === group.member.positionIndex)
        .map((miss) => {
          const previousFrame = group.frames.filter((frame) => frame < miss.frame).at(-1);
          return previousFrame === undefined
            ? null
            : {
                startFrame: previousFrame,
                endFrame: miss.frame,
              };
        })
        .filter(Boolean);
      return getTrackSegments(firstFrame, lastFrame, [...groupReloads, ...groupMisses, ...groupStuns]).map(
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
      const dodgeEndFrame = Math.min(reload.endFrame, reload.startFrame + MISS_DODGE_WINDOW_FRAMES);
      const visibleDodgeEndFrame = Math.min(dodgeEndFrame, maxFrame, reload.displayEndFrame);
      const tooltip = escapeHtml(
        `${reload.characterName}\n换弹：${reload.startFrame}F → ${reload.endFrame}F\n可空判定：${reload.startFrame}F → ${dodgeEndFrame}F`,
      );
      const lines = [];
      if (visibleDodgeEndFrame > startFrame) {
        lines.push(
          `<line class="chart-dodge-track chart-dodge-reload-window team-${reload.teamKey}" x1="${xForFrame(startFrame)}" y1="${y}" x2="${xForFrame(visibleDodgeEndFrame)}" y2="${y}" data-tooltip="${tooltip}"></line>`,
        );
      }
      if (endFrame > visibleDodgeEndFrame) {
        lines.push(
          `<line class="chart-dodge-track chart-dodge-reload-duration team-${reload.teamKey}" x1="${xForFrame(visibleDodgeEndFrame)}" y1="${y}" x2="${xForFrame(endFrame)}" y2="${y}" data-tooltip="${tooltip}"></line>`,
        );
      }
      return lines;
    })
    .join("");
  const dodgeTracks = visibleDodgeEvents
    .filter((window) => window.type !== "reload")
    .map((window) => {
      const y = yForGroup(`${window.teamKey}-${window.positionIndex}`);
      const startFrame = Math.min(window.startFrame, maxFrame);
      const endFrame = Math.min(window.endFrame, maxFrame, window.displayEndFrame);
      if (endFrame <= startFrame) return "";
      const label = window.type === "reload" ? "换弹可空" : "转身可空";
      const tooltip = escapeHtml(`${window.characterName}\n${label}：${window.startFrame}F → ${window.endFrame}F\n判定：${window.durationFrames}F`);
      return `<line class="chart-dodge-track chart-dodge-${window.type} team-${window.teamKey}" x1="${xForFrame(startFrame)}" y1="${y}" x2="${xForFrame(endFrame)}" y2="${y}" data-tooltip="${tooltip}"></line>`;
    })
    .join("");
  const missedPoints = visibleMissedEvents
    .map((miss) => {
      const y = yForGroup(`${miss.teamKey}-${miss.positionIndex}`);
      const dodgeLabel = miss.dodgeType === "reload" ? "换弹可空" : "转身可空";
      const tooltip = escapeHtml(
        `${miss.characterName}\n时间：${miss.frame} F\n结果：空枪，未命中\n${dodgeLabel}：${miss.dodgeStartFrame}F → ${miss.dodgeEndFrame}F`,
      );
      return `<circle class="chart-missed-point" cx="${xForFrame(miss.frame)}" cy="${y}" r="5" data-tooltip="${tooltip}"></circle>`;
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
  const universalChargePoints = specialChargeGroups
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
        const rosannaSacrificeTotal = getSpecialContributionTotal(group.result, entry.frame, "罗珊娜献祭");
        const characterChargeLines = getCumulativeContributionLines(group.result, entry.frame);
        const tooltip = formatTooltipLines([
          `${group.label} · ${entry.frame}F`,
          `累计总充能：${formatNumber(entry.totalCharge, 2)}%`,
          ...(universalChargeTotal > BURST_EPSILON ? [`万能充能：${formatNumber(universalChargeTotal, 2)}%`] : []),
          ...(rosannaSacrificeTotal > BURST_EPSILON ? [`罗珊娜献祭充能：${formatNumber(rosannaSacrificeTotal, 2)}%`] : []),
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
  const universalChargeLabels = specialChargeGroups
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
      ${reloadDurationTracks}
      ${dodgeTracks}
      ${scarletCounterTracks}
      ${chargeTotalTrack}
      ${burstTotalTrack}
      ${universalChargePoints}
      ${pointMarks}
      ${missedPoints}
      ${stunPoints}
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

function showNearestChartTooltip(event, options = {}) {
  if (!options.force && !canUseHoverTooltip()) {
    hideChartTooltip();
    return;
  }
  if (!Number.isFinite(event?.clientX) || !Number.isFinite(event?.clientY)) return;
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

function showChartTooltipByInteraction(event) {
  showNearestChartTooltip(event, { force: true });
}

function hideChartTooltip() {
  const tooltip = els.chargeChart.querySelector(".chart-hover-tooltip");
  if (tooltip) tooltip.classList.remove("show");
  els.chargeChart.querySelectorAll(".chart-hover-guide-x, .chart-hover-guide-y").forEach((line) => line.classList.remove("show"));
}

function sanitizeBattlePowerBase(value) {
  const numeric = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.floor(numeric);
}

function formatBattlePower(value) {
  return String(Math.max(0, Math.round(value))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderBattlePowerStrip() {
  const base = sanitizeBattlePowerBase(state.battlePowerBase);
  const ratio = 1 - BATTLE_POWER_ADVANTAGE_RATE;
  if (els.battlePowerBaseInput && document.activeElement !== els.battlePowerBaseInput) {
    els.battlePowerBaseInput.value = base ? String(base) : "0";
  }
  if (els.battlePowerDefense) {
    els.battlePowerDefense.textContent = `可防 ${formatBattlePower(base * ratio)}`;
  }
  if (els.battlePowerAttack) {
    els.battlePowerAttack.textContent = `可攻 ${formatBattlePower(base / ratio)}`;
  }
}

function renderSummaryStrip(attackResult, defenseResult) {
  const entries = [
    { teamKey: "defense", result: defenseResult },
    { teamKey: "attack", result: attackResult },
  ].filter((entry) => entry.result && !entry.result.error);

  if (entries.length === 0) {
    els.summaryStrip.textContent = "队伍为空，选择角色后开始计算";
    els.summaryStrip.onpointerdown = null;
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

  els.summaryStrip.onpointerdown = handleCopyContextPointerDown;
  els.summaryStrip.oncontextmenu = handleCopyContextMenu;
}

function renderResults(battleResults = getBattleResultsSnapshot()) {
  if (isPaidArenaModeActive()) {
    const teams = getPaidArenaTeams();
    const pickedCount = teams.flat().filter(Boolean).length;
    els.summaryStrip.textContent = `${getPaidArenaModeLabel()}：${pickedCount}/${teams.length * TEAM_SIZE}，共用妮姬不可重复\n移动端长按，桌面端右键可复制队伍图片`;
    els.resultPanel.innerHTML = "";
    renderChargeChart(getActivePaidArenaChartResult(), null);
    return null;
  }
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
  renderBattlePowerStrip();
  invalidateBattleResults();
  const battleResults = getBattleResultsSnapshot();
  renderTeam(battleResults);
  renderLineupSlots();
  renderResults(battleResults);
  scheduleLocalPaidInferenceRefresh();
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
  state.rosannaSacrificeFrames = Array(TEAM_SIZE).fill(null);
  saveTeam();
  render();
}

function addPaidArenaCharacter(character) {
  const existing = findPaidArenaCharacter(character);
  if (existing) {
    removePaidArenaCharacter(existing.rowIndex, existing.slotIndex);
    return;
  }
  const teams = getPaidArenaTeams();
  if (!teams.length) return;
  const rowIndex = Math.max(0, Math.min(teams.length - 1, Number(state.paidArenaActiveRowIndex) || 0));
  const team = teams[rowIndex];
  const universalCharges = getPaidArenaUniversalCharges()[rowIndex] || Array(TEAM_SIZE).fill(0);
  const chargeSpeeds = getPaidArenaChargeSpeeds()[rowIndex] || Array(TEAM_SIZE).fill(0);
  const sacrificeFrames = getPaidArenaRosannaSacrificeFrames()[rowIndex] || Array(TEAM_SIZE).fill(null);
  const emptyIndex = team.findIndex((member) => !member);
  if (emptyIndex === -1) {
    showToast(`${getPaidArenaModeLabel()}第${rowIndex + 1}队已满，请先移除一个槽位。`);
    return;
  }
  team[emptyIndex] = character;
  universalCharges[emptyIndex] = 0;
  chargeSpeeds[emptyIndex] = getSavedCharacterChargeSpeed(character, getPaidArenaDataTeamKey());
  sacrificeFrames[emptyIndex] = null;
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function removePaidArenaCharacter(rowIndex, slotIndex) {
  const teams = getPaidArenaTeams();
  const universalCharges = getPaidArenaUniversalCharges();
  const chargeSpeeds = getPaidArenaChargeSpeeds();
  const sacrificeRows = getPaidArenaRosannaSacrificeFrames();
  const team = teams[rowIndex];
  if (!team || slotIndex < 0 || slotIndex >= TEAM_SIZE) return;
  team[slotIndex] = null;
  if (universalCharges[rowIndex]) universalCharges[rowIndex][slotIndex] = 0;
  if (chargeSpeeds[rowIndex]) chargeSpeeds[rowIndex][slotIndex] = 0;
  if (sacrificeRows[rowIndex]) sacrificeRows[rowIndex][slotIndex] = null;
  state.paidArenaActiveRowIndex = Math.max(0, Math.min(teams.length - 1, Number(rowIndex) || 0));
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function movePaidArenaSlot(fromRowIndex, fromIndex, toRowIndex, toIndex) {
  const teams = getPaidArenaTeams();
  const universalRows = getPaidArenaUniversalCharges();
  const speedRows = getPaidArenaChargeSpeeds();
  const sacrificeRows = getPaidArenaRosannaSacrificeFrames();
  const fromTeam = teams[fromRowIndex];
  const toTeam = teams[toRowIndex];
  if (
    !fromTeam ||
    !toTeam ||
    (fromRowIndex === toRowIndex && fromIndex === toIndex) ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= TEAM_SIZE ||
    toIndex >= TEAM_SIZE ||
    !fromTeam[fromIndex]
  ) {
    return;
  }

  const fromCharacter = fromTeam[fromIndex];
  const fromUniversalCharge = universalRows[fromRowIndex]?.[fromIndex] || 0;
  const fromSpeed = speedRows[fromRowIndex]?.[fromIndex] || 0;
  const fromSacrificeFrame = sacrificeRows[fromRowIndex]?.[fromIndex] ?? null;

  if (toTeam[toIndex]) {
    [fromTeam[fromIndex], toTeam[toIndex]] = [toTeam[toIndex], fromTeam[fromIndex]];
    [universalRows[fromRowIndex][fromIndex], universalRows[toRowIndex][toIndex]] = [
      universalRows[toRowIndex][toIndex],
      universalRows[fromRowIndex][fromIndex],
    ];
    [speedRows[fromRowIndex][fromIndex], speedRows[toRowIndex][toIndex]] = [
      speedRows[toRowIndex][toIndex],
      speedRows[fromRowIndex][fromIndex],
    ];
    [sacrificeRows[fromRowIndex][fromIndex], sacrificeRows[toRowIndex][toIndex]] = [
      sacrificeRows[toRowIndex][toIndex],
      sacrificeRows[fromRowIndex][fromIndex],
    ];
  } else {
    toTeam[toIndex] = fromCharacter;
    universalRows[toRowIndex][toIndex] = fromUniversalCharge;
    speedRows[toRowIndex][toIndex] = fromSpeed;
    sacrificeRows[toRowIndex][toIndex] = fromSacrificeFrame;
    fromTeam[fromIndex] = null;
    universalRows[fromRowIndex][fromIndex] = 0;
    speedRows[fromRowIndex][fromIndex] = 0;
    sacrificeRows[fromRowIndex][fromIndex] = null;
  }

  state.paidArenaActiveRowIndex = Math.max(0, Math.min(teams.length - 1, Number(toRowIndex) || 0));
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function addCharacter(character) {
  if (isPaidArenaModeActive()) {
    addPaidArenaCharacter(character);
    return;
  }
  const team = getTeamState();
  const chargeSpeeds = getChargeSpeedState();
  const universalCharges = getUniversalChargeState();
  const redHoodPierceCounts = getRedHoodPierceCountState();
  const scarletCounterEnabled = getScarletCounterEnabledState();
  const sacrificeFrames = getRosannaSacrificeFrameState();
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
  sacrificeFrames[emptyIndex] = null;
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function toggleCharacter(character) {
  if (isPaidArenaModeActive()) {
    const existing = findPaidArenaCharacter(character);
    if (existing) {
      removePaidArenaCharacter(existing.rowIndex, existing.slotIndex);
      return;
    }
    addPaidArenaCharacter(character);
    return;
  }
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
  const sacrificeFrames = getRosannaSacrificeFrameState(teamKey);
  team[index] = null;
  chargeSpeeds[index] = 0;
  universalCharges[index] = 0;
  redHoodPierceCounts[index] = 0;
  scarletCounterEnabled[index] = true;
  sacrificeFrames[index] = null;
  normalizeJackalLink(teamKey);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
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
  const fromSacrificeFrames = getRosannaSacrificeFrameState(fromTeamKey);
  const toSacrificeFrames = getRosannaSacrificeFrameState(toTeamKey);

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
  const fromSacrificeFrame = fromSacrificeFrames[fromIndex];

  if (toTeam[toIndex]) {
    [fromTeam[fromIndex], toTeam[toIndex]] = [toTeam[toIndex], fromTeam[fromIndex]];
    [fromSpeeds[fromIndex], toSpeeds[toIndex]] = [toSpeeds[toIndex], fromSpeeds[fromIndex]];
    [fromUniversalCharges[fromIndex], toUniversalCharges[toIndex]] = [toUniversalCharges[toIndex], fromUniversalCharges[fromIndex]];
    [fromPierceCounts[fromIndex], toPierceCounts[toIndex]] = [toPierceCounts[toIndex], fromPierceCounts[fromIndex]];
    [fromCounterEnabled[fromIndex], toCounterEnabled[toIndex]] = [toCounterEnabled[toIndex], fromCounterEnabled[fromIndex]];
    [fromSacrificeFrames[fromIndex], toSacrificeFrames[toIndex]] = [toSacrificeFrames[toIndex], fromSacrificeFrames[fromIndex]];
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
    toSacrificeFrames[toIndex] = fromSacrificeFrame;
    fromTeam[fromIndex] = null;
    fromSpeeds[fromIndex] = 0;
    fromUniversalCharges[fromIndex] = 0;
    fromPierceCounts[fromIndex] = 0;
    fromCounterEnabled[fromIndex] = true;
    fromSacrificeFrames[fromIndex] = null;
    rememberTeamSlotChargeSpeed(toTeamKey, toIndex);
    rememberTeamSlotRedHoodPierceCount(toTeamKey, toIndex);
  }

  setActiveTeam(toTeamKey);
  normalizeJackalLink(fromTeamKey);
  normalizeJackalLink(toTeamKey);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function clearTeam() {
  if (isPaidArenaModeActive()) {
    state.paidArenaTeams[state.paidArenaMode] = createEmptyPaidArenaTeams(state.paidArenaMode);
    state.paidArenaUniversalCharges[state.paidArenaMode] = createEmptyPaidArenaUniversalCharges(state.paidArenaMode);
    state.paidArenaChargeSpeeds[state.paidArenaMode] = createEmptyPaidArenaChargeSpeeds(state.paidArenaMode);
    state.paidArenaRosannaSacrificeFrames[state.paidArenaMode] = createEmptyPaidArenaRosannaSacrificeFrames(state.paidArenaMode);
    state.paidArenaActiveRowIndex = 0;
    openSlotSettings = null;
    openRosannaSacrificeSettings = null;
    saveTeam();
    render();
    return;
  }
  state.defenseTeam = Array(TEAM_SIZE).fill(null);
  state.defenseChargeSpeeds = Array(TEAM_SIZE).fill(0);
  state.defenseUniversalCharges = Array(TEAM_SIZE).fill(0);
  state.defenseRedHoodPierceCounts = Array(TEAM_SIZE).fill(0);
  state.defenseScarletCounterEnabled = Array(TEAM_SIZE).fill(true);
  state.defenseRosannaSacrificeFrames = Array(TEAM_SIZE).fill(null);
  state.team = Array(TEAM_SIZE).fill(null);
  state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
  state.universalCharges = Array(TEAM_SIZE).fill(0);
  state.redHoodPierceCounts = Array(TEAM_SIZE).fill(0);
  state.scarletCounterEnabled = Array(TEAM_SIZE).fill(true);
  state.rosannaSacrificeFrames = Array(TEAM_SIZE).fill(null);
  normalizeJackalLinks();
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
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
  [state.defenseRosannaSacrificeFrames, state.rosannaSacrificeFrames] = [state.rosannaSacrificeFrames, state.defenseRosannaSacrificeFrames];
  [state.jackalLinks.defense, state.jackalLinks.attack] = [state.jackalLinks.attack, state.jackalLinks.defense];

  applySavedTeamChargeSpeeds("defense");
  applySavedTeamChargeSpeeds("attack");
  applySavedTeamRedHoodPierceCounts("defense");
  applySavedTeamRedHoodPierceCounts("attack");
  normalizeJackalLinks();
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
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
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function switchPaidArenaLineupSlot(index) {
  if (!isPaidArenaModeActive()) return;
  const mode = state.paidArenaMode;
  const nextIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(index) || 0));
  if (nextIndex === getPaidArenaActiveLineupIndex(mode)) return;
  saveCurrentPaidArenaLineupSlot(mode);
  state.paidArenaActiveLineupIndex[mode] = nextIndex;
  loadPaidArenaLineupSlot(mode, nextIndex);
  syncPaidArenaChargeSpeedsFromSavedData(mode);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function copyLineupSlotTo(sourceIndex, targetIndex) {
  const normalizedSourceIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(sourceIndex) || 0));
  const normalizedTargetIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(targetIndex) || 0));
  if (normalizedSourceIndex === normalizedTargetIndex) return;

  saveCurrentLineupSlot();
  const sourceSlot = cloneLineupSlot(state.lineupSlots[normalizedSourceIndex]);
  if (getLineupSlotCount(sourceSlot) === 0) {
    showToast(`方案 ${normalizedSourceIndex + 1} 为空，无法复制`);
    renderLineupSlots();
    return;
  }
  const targetSlot = normalizeLineupSlot(state.lineupSlots[normalizedTargetIndex]);
  const targetCount = getLineupSlotCount(targetSlot);

  if (targetCount > 0) {
    const confirmed = window.confirm(`方案 ${normalizedTargetIndex + 1} 已有队伍，是否覆盖？`);
    if (!confirmed) {
      renderLineupSlots();
      return;
    }
  }

  state.lineupSlots[normalizedTargetIndex] = sourceSlot;
  state.activeLineupIndex = normalizedTargetIndex;
  loadLineupSlot(normalizedTargetIndex);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  showToast(`已将方案 ${normalizedSourceIndex + 1} 复制到方案 ${normalizedTargetIndex + 1}`);
  render();
}

function getDraggedLineupSourceIndex(event) {
  const dataValue = event?.dataTransfer?.getData("text/plain");
  const candidate = dataValue === "" || dataValue === null || dataValue === undefined ? draggedLineupIndex : Number(dataValue);
  if (!Number.isInteger(candidate) || candidate < 0 || candidate >= LINEUP_SLOT_COUNT) return null;
  return candidate;
}

function normalizeSavedCharacterChargeSpeeds(savedSpeeds = {}) {
  return Object.fromEntries(
    Object.entries(savedSpeeds || {})
      .map(([characterId, speed]) => [characterId, sanitizeChargeSpeed(speed)])
      .filter(([characterId]) => getCharacterById(characterId)),
  );
}

function normalizeSavedCharacterChargeSpeedEntries(savedEntries = {}) {
  return Object.fromEntries(
    Object.entries(savedEntries || {})
      .map(([characterId, entries]) => [characterId, normalizeChargeSpeedEntries(entries)])
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

function normalizeSavedCharacterCubeTypes(savedCubeTypes = {}, savedQuantumFlags = {}) {
  const characterIds = new Set([...Object.keys(savedCubeTypes || {}), ...Object.keys(savedQuantumFlags || {})]);
  return Object.fromEntries(
    [...characterIds]
      .map((characterId) => {
        const cubeType = Object.prototype.hasOwnProperty.call(savedCubeTypes || {}, characterId)
          ? sanitizeCubeType(savedCubeTypes[characterId])
          : Boolean(savedQuantumFlags?.[characterId])
            ? CUBE_TYPE_QUANTUM
            : CUBE_TYPE_NONE;
        return [characterId, cubeType];
      })
      .filter(([characterId, cubeType]) => getCharacterById(characterId) && cubeType !== CUBE_TYPE_NONE),
  );
}

function normalizeSavedCharacterMagazines(savedMagazines = {}) {
  return Object.fromEntries(
    Object.entries(savedMagazines || {})
      .map(([characterId, magazine]) => [characterId, sanitizeMagazine(magazine)])
      .filter(([characterId, magazine]) => getCharacterById(characterId) && magazine > 0),
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
  if (isPaidArenaModeActive()) saveCurrentPaidArenaLineupSlot(state.paidArenaMode);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      defenseTeam: state.defenseTeam.map((character) => character?.id || null),
      defenseChargeSpeeds: state.defenseChargeSpeeds,
      defenseUniversalCharges: [...state.defenseUniversalCharges],
      defenseRedHoodPierceCounts: [...state.defenseRedHoodPierceCounts],
      defenseScarletCounterEnabled: [...state.defenseScarletCounterEnabled],
      defenseRosannaSacrificeFrames: [...state.defenseRosannaSacrificeFrames],
      team: state.team.map((character) => character?.id || null),
      chargeSpeeds: state.chargeSpeeds,
      universalCharges: [...state.universalCharges],
      redHoodPierceCounts: [...state.redHoodPierceCounts],
      scarletCounterEnabled: [...state.scarletCounterEnabled],
      rosannaSacrificeFrames: [...state.rosannaSacrificeFrames],
      characterChargeSpeeds: state.characterChargeSpeeds,
      characterChargeSpeedEntries: state.characterChargeSpeedEntries,
      characterCubeTypes: state.characterCubeTypes,
      characterQuantumCubes: state.characterQuantumCubes,
      characterMagazines: state.characterMagazines,
      characterRedHoodPierceCounts: state.characterRedHoodPierceCounts,
      activeLineupIndex: state.activeLineupIndex,
      lineupSlots: state.lineupSlots,
      paidArenaMode: state.paidArenaMode,
      paidArenaActiveLineupIndex: state.paidArenaActiveLineupIndex,
      paidArenaLineupSlots: state.paidArenaLineupSlots,
      paidArenaActiveRowIndex: state.paidArenaActiveRowIndex,
      paidArenaDataTeamKey: state.paidArenaDataTeamKey,
      paidArenaTeams: {
        c: serializePaidArenaTeams("c"),
        p: serializePaidArenaTeams("p"),
      },
      paidArenaUniversalCharges: {
        c: serializePaidArenaUniversalCharges("c"),
        p: serializePaidArenaUniversalCharges("p"),
      },
      paidArenaChargeSpeeds: {
        c: serializePaidArenaChargeSpeeds("c"),
        p: serializePaidArenaChargeSpeeds("p"),
      },
      paidArenaRosannaSacrificeFrames: {
        c: serializePaidArenaRosannaSacrificeFrames("c"),
        p: serializePaidArenaRosannaSacrificeFrames("p"),
      },
      jackalLinks: state.jackalLinks,
      allowMissedShots: state.allowMissedShots,
      battlePowerBase: state.battlePowerBase,
      compactAvatarIcons: state.compactAvatarIcons,
      filters: state.filters,
      activeTeamKey: state.activeTeamKey,
    }),
  );
  scheduleLocalPaidInferenceRefresh();
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
      state.defenseRosannaSacrificeFrames = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeSacrificeFrame(saved.defenseRosannaSacrificeFrames?.[index]));
      state.team = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(saved.team?.[index]));
      state.chargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => Number(saved.chargeSpeeds?.[index]) || 0);
      state.universalCharges = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(saved.universalCharges?.[index]));
      state.redHoodPierceCounts = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(saved.redHoodPierceCounts?.[index]));
      state.scarletCounterEnabled = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(saved.scarletCounterEnabled?.[index]));
      state.rosannaSacrificeFrames = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeSacrificeFrame(saved.rosannaSacrificeFrames?.[index]));
      state.characterChargeSpeeds = {
        defense: normalizeSavedCharacterChargeSpeeds(saved.characterChargeSpeeds?.defense),
        attack: normalizeSavedCharacterChargeSpeeds(saved.characterChargeSpeeds?.attack),
      };
      state.characterChargeSpeedEntries = {
        defense: normalizeSavedCharacterChargeSpeedEntries(saved.characterChargeSpeedEntries?.defense),
        attack: normalizeSavedCharacterChargeSpeedEntries(saved.characterChargeSpeedEntries?.attack),
      };
      state.characterCubeTypes = {
        defense: normalizeSavedCharacterCubeTypes(saved.characterCubeTypes?.defense, saved.characterQuantumCubes?.defense),
        attack: normalizeSavedCharacterCubeTypes(saved.characterCubeTypes?.attack, saved.characterQuantumCubes?.attack),
      };
      state.characterQuantumCubes = {
        defense: normalizeSavedCharacterFlags(saved.characterQuantumCubes?.defense),
        attack: normalizeSavedCharacterFlags(saved.characterQuantumCubes?.attack),
      };
      state.characterMagazines = {
        defense: normalizeSavedCharacterMagazines(saved.characterMagazines?.defense),
        attack: normalizeSavedCharacterMagazines(saved.characterMagazines?.attack),
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
      state.paidArenaDataTeamKey = normalizeTeamKey(saved.paidArenaDataTeamKey || "attack");
      state.paidArenaTeams = {
        c: normalizePaidArenaTeams(saved.paidArenaTeams?.c, "c"),
        p: normalizePaidArenaTeams(saved.paidArenaTeams?.p, "p"),
      };
      state.paidArenaUniversalCharges = {
        c: normalizePaidArenaUniversalCharges(saved.paidArenaUniversalCharges?.c, "c"),
        p: normalizePaidArenaUniversalCharges(saved.paidArenaUniversalCharges?.p, "p"),
      };
      state.paidArenaChargeSpeeds = {
        c: normalizePaidArenaChargeSpeeds(saved.paidArenaChargeSpeeds?.c, "c"),
        p: normalizePaidArenaChargeSpeeds(saved.paidArenaChargeSpeeds?.p, "p"),
      };
      state.paidArenaRosannaSacrificeFrames = {
        c: normalizePaidArenaRosannaSacrificeFrames(saved.paidArenaRosannaSacrificeFrames?.c, "c"),
        p: normalizePaidArenaRosannaSacrificeFrames(saved.paidArenaRosannaSacrificeFrames?.p, "p"),
      };
      state.paidArenaLineupSlots = {
        c: normalizePaidArenaLineupSlots(saved.paidArenaLineupSlots?.c, "c"),
        p: normalizePaidArenaLineupSlots(saved.paidArenaLineupSlots?.p, "p"),
      };
      if (!Array.isArray(saved.paidArenaLineupSlots?.c)) {
        state.paidArenaLineupSlots.c[0] = serializePaidArenaLineupSlot("c");
      }
      if (!Array.isArray(saved.paidArenaLineupSlots?.p)) {
        state.paidArenaLineupSlots.p[0] = serializePaidArenaLineupSlot("p");
      }
      state.paidArenaActiveLineupIndex = {
        c: Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(saved.paidArenaActiveLineupIndex?.c) || 0)),
        p: Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(saved.paidArenaActiveLineupIndex?.p) || 0)),
      };
      state.paidArenaMode = normalizePaidArenaMode(saved.paidArenaMode);
      const hasSavedActivePaidArenaLineup = isPaidArenaModeActive() && Array.isArray(saved.paidArenaLineupSlots?.[state.paidArenaMode]);
      if (isPaidArenaModeActive()) loadPaidArenaLineupSlot(state.paidArenaMode, getPaidArenaActiveLineupIndex(state.paidArenaMode));
      state.paidArenaActiveRowIndex = Math.max(
        0,
        Math.min(getPaidArenaTeams().length - 1, Number(hasSavedActivePaidArenaLineup ? state.paidArenaActiveRowIndex : saved.paidArenaActiveRowIndex) || 0),
      );
      if (isPaidArenaModeActive()) syncPaidArenaChargeSpeedsFromSavedData();
      state.allowMissedShots = typeof saved.allowMissedShots === "boolean" ? saved.allowMissedShots : true;
      state.battlePowerBase = sanitizeBattlePowerBase(saved.battlePowerBase);
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
    state.defenseRosannaSacrificeFrames = Array(TEAM_SIZE).fill(null);
    state.team = Array(TEAM_SIZE).fill(null);
    state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
    state.universalCharges = Array(TEAM_SIZE).fill(0);
    state.redHoodPierceCounts = Array(TEAM_SIZE).fill(0);
    state.scarletCounterEnabled = Array(TEAM_SIZE).fill(true);
    state.rosannaSacrificeFrames = Array(TEAM_SIZE).fill(null);
    state.characterChargeSpeeds = { defense: {}, attack: {} };
    state.characterChargeSpeedEntries = { defense: {}, attack: {} };
    state.characterCubeTypes = { defense: {}, attack: {} };
    state.characterQuantumCubes = { defense: {}, attack: {} };
    state.characterMagazines = { defense: {}, attack: {} };
    state.activeLineupIndex = 0;
    state.lineupSlots = Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyLineupSlot());
    state.paidArenaMode = "normal";
    state.paidArenaActiveRowIndex = 0;
    state.paidArenaActiveLineupIndex = { c: 0, p: 0 };
    state.paidArenaDataTeamKey = "attack";
    state.paidArenaTeams = {
      c: createEmptyPaidArenaTeams("c"),
      p: createEmptyPaidArenaTeams("p"),
    };
    state.paidArenaUniversalCharges = {
      c: createEmptyPaidArenaUniversalCharges("c"),
      p: createEmptyPaidArenaUniversalCharges("p"),
    };
    state.paidArenaChargeSpeeds = {
      c: createEmptyPaidArenaChargeSpeeds("c"),
      p: createEmptyPaidArenaChargeSpeeds("p"),
    };
    state.paidArenaRosannaSacrificeFrames = {
      c: createEmptyPaidArenaRosannaSacrificeFrames("c"),
      p: createEmptyPaidArenaRosannaSacrificeFrames("p"),
    };
    state.paidArenaLineupSlots = {
      c: Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyPaidArenaLineupSlot("c")),
      p: Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyPaidArenaLineupSlot("p")),
    };
    state.jackalLinks = {
      defense: { enabled: false, ownerId: null, targetIds: [] },
      attack: { enabled: false, ownerId: null, targetIds: [] },
    };
    state.allowMissedShots = true;
    state.battlePowerBase = 0;
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

function getInlineSvgStyles() {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

function inlineComputedSvgStyles(sourceSvg, targetSvg) {
  const sourceElements = [sourceSvg, ...sourceSvg.querySelectorAll("*")];
  const targetElements = [targetSvg, ...targetSvg.querySelectorAll("*")];
  const properties = [
    "fill",
    "stroke",
    "stroke-width",
    "stroke-dasharray",
    "stroke-linecap",
    "stroke-linejoin",
    "font-size",
    "font-weight",
    "font-family",
    "opacity",
  ];

  sourceElements.forEach((sourceElement, index) => {
    const targetElement = targetElements[index];
    if (!targetElement) return;
    const computed = getComputedStyle(sourceElement);
    properties.forEach((property) => {
      const value = computed.getPropertyValue(property);
      if (value) targetElement.style.setProperty(property, value);
    });
  });
}

function getSvgViewBoxSize(svg) {
  const viewBox = svg.viewBox?.baseVal;
  if (viewBox?.width && viewBox?.height) {
    return {
      width: Math.ceil(viewBox.width),
      height: Math.ceil(viewBox.height),
    };
  }

  const rect = svg.getBoundingClientRect();
  return {
    width: Math.ceil(rect.width || 1200),
    height: Math.ceil(rect.height || 420),
  };
}

function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("failed to render chart image"));
      }
    }, "image/png");
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function getChargeChartPngBlob() {
  const svg = els.chargeChart?.querySelector("svg");
  if (!svg) throw new Error("charge chart is not rendered");

  const { width, height } = getSvgViewBoxSize(svg);
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);
  clone.style.setProperty("--accent", "#e43f4f");
  clone.style.setProperty("--blue", "#4da3ff");
  clone.style.setProperty("--cyan", "#47c8d4");
  clone.style.setProperty("--gold", "#f0c45c");
  clone.style.setProperty("--text", "#f2f5fa");
  inlineComputedSvgStyles(svg, clone);

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = getInlineSvgStyles();
  clone.insertBefore(style, clone.firstChild);

  const svgText = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = await loadImageFromUrl(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#0b0e14";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return await canvasToPngBlob(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function getCanvasRoundedRectPath(context, x, y, width, height, radius) {
  const corner = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + corner, y);
  context.lineTo(x + width - corner, y);
  context.quadraticCurveTo(x + width, y, x + width, y + corner);
  context.lineTo(x + width, y + height - corner);
  context.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
  context.lineTo(x + corner, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - corner);
  context.lineTo(x, y + corner);
  context.quadraticCurveTo(x, y, x + corner, y);
  context.closePath();
}

async function loadExportImage(src) {
  if (!src) return null;
  const absoluteUrl = new URL(src, window.location.href).href;
  try {
    if (window.location.protocol === "file:") {
      return await loadImageFromUrl(absoluteUrl);
    }
    const response = await fetch(absoluteUrl);
    if (!response.ok) throw new Error(`asset request failed: ${response.status}`);
    const dataUrl = await blobToDataUrl(await response.blob());
    return await loadImageFromUrl(dataUrl);
  } catch {
    return null;
  }
}

function getPaidArenaSlotBadgeText(character, chargeSpeed, dataTeamKey) {
  if (!character) return "";
  if (canEditChargeSpeed(character) && sanitizeChargeSpeed(chargeSpeed) > 0) return `${sanitizeChargeSpeed(chargeSpeed)}%`;
  const magazine = getDisplayMagazine(character, dataTeamKey);
  return magazine ? String(magazine) : "";
}

function drawCanvasText(context, text, x, y, options = {}) {
  context.save();
  context.fillStyle = options.color || "#f2f5fa";
  context.font = `${options.weight || 500} ${options.size || 18}px Arial, "Microsoft YaHei", sans-serif`;
  context.textAlign = options.align || "left";
  context.textBaseline = options.baseline || "middle";
  context.fillText(String(text || ""), x, y);
  context.restore();
}

function getExportSiteUrl() {
  const fallbackUrl = "https://nikke.skyxmoon.workers.dev";
  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") return fallbackUrl;
  return window.location.origin;
}

function drawExportSiteUrl(context, width, padding, y) {
  drawCanvasText(context, getExportSiteUrl(), width - padding, y, {
    align: "right",
    size: 17,
    weight: 700,
    color: "#7f8a99",
  });
}

function drawPaidArenaSlot(context, slot, x, y, size) {
  const { character, universalCharge, image, isFinisher, isTauntTarget, isSacrificedTarget, sacrificeFrame, badgeText } = slot;
  const radius = 7;
  context.save();
  context.fillStyle = character ? "#111821" : "#15191f";
  getCanvasRoundedRectPath(context, x, y, size, size, radius);
  context.fill();
  const rarityColor = character?.rarity === "SR" ? "#a65cff" : character ? "#f0c45c" : "#3a4655";
  context.lineWidth = 3;
  context.strokeStyle = rarityColor;
  context.stroke();

  if (image) {
    context.save();
    getCanvasRoundedRectPath(context, x + 4, y + 4, size - 8, size - 8, radius - 2);
    context.clip();
    const scale = Math.max((size - 8) / image.width, (size - 8) / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    context.drawImage(image, x + 4 + (size - 8 - drawWidth) / 2, y + 4 + (size - 8 - drawHeight) / 2, drawWidth, drawHeight);
    context.restore();
  } else if (character) {
    drawCanvasText(context, character.name, x + size / 2, y + size * 0.43, {
      align: "center",
      size: 15,
      weight: 700,
      color: "#dfe7f3",
    });
    drawCanvasText(context, character.weapon, x + size / 2, y + size * 0.64, {
      align: "center",
      size: 13,
      weight: 700,
      color: "#8f9aaa",
    });
  } else {
    drawCanvasText(context, `P${slot.index + 1}`, x + size / 2, y + size * 0.36, {
      align: "center",
      size: 18,
      weight: 700,
      color: "#7d8796",
    });
    if (universalCharge > 0) {
      drawCanvasText(context, `充 ${formatNumber(universalCharge, 2)}`, x + size / 2, y + size * 0.68, {
        align: "center",
        size: 17,
        weight: 700,
        color: "#ff5f63",
      });
    }
  }

  if (character) {
    if (isTauntTarget) {
      context.fillStyle = "#ff5f63";
      context.fillRect(x + 5, y + 5, 22, 22);
      drawCanvasText(context, "嘲", x + 16, y + 16, { align: "center", size: 15, weight: 800, color: "#ffffff" });
    }
    if (isSacrificedTarget) {
      const frameText = `${sanitizeSacrificeFrame(sacrificeFrame)}F`;
      context.fillStyle = "#d9354a";
      getCanvasRoundedRectPath(context, x + 5, y + 5, 32, 34, 5);
      context.fill();
      drawCanvasText(context, "祭", x + 21, y + 16, { align: "center", size: 14, weight: 800, color: "#ffffff" });
      drawCanvasText(context, frameText, x + 21, y + 30, { align: "center", size: 9, weight: 800, color: "#ffffff" });
    }
    if (isFinisher) {
      context.fillStyle = "#ff4f5f";
      context.fillRect(x + 5, y + size - 27, 22, 22);
      drawCanvasText(context, "定", x + 16, y + size - 16, { align: "center", size: 15, weight: 800, color: "#ffffff" });
    }
    if (badgeText) {
      const badgeWidth = Math.max(30, Math.min(44, String(badgeText).length * 8 + 14));
      context.fillStyle = "rgba(0, 0, 0, 0.72)";
      getCanvasRoundedRectPath(context, x + size - badgeWidth - 5, y + size - 25, badgeWidth, 20, 4);
      context.fill();
      drawCanvasText(context, badgeText, x + size - badgeWidth / 2 - 5, y + size - 15, {
        align: "center",
        size: 13,
        weight: 800,
        color: "#f2f5fa",
      });
    }
  }
  context.restore();
}

async function paidArenaToPngBlob() {
  const mode = state.paidArenaMode;
  const teams = getPaidArenaTeams(mode);
  const universalRows = getPaidArenaUniversalCharges(mode);
  const sacrificeRows = getPaidArenaRosannaSacrificeFrames(mode);
  const dataTeamKey = getPaidArenaDataTeamKey();
  const dataSourceLabel = getPaidArenaSelectedDataTeamKey() === "defense" ? "防守数据" : "进攻数据";
  const title = `${getPaidArenaModeLabel(mode)}（${dataSourceLabel}）`;
  const padding = 28;
  const slotSize = 76;
  const slotGap = 12;
  const teamLabelWidth = 96;
  const teamSlotsWidth = TEAM_SIZE * slotSize + (TEAM_SIZE - 1) * slotGap;
  const rowInnerRightPadding = 24;
  const width = padding * 2 + teamLabelWidth + teamSlotsWidth + rowInnerRightPadding;
  const rowGap = 22;
  const headerHeight = 56;
  const resultHeight = 28;
  const rowHeight = slotSize + resultHeight + 14;
  const height = padding * 2 + headerHeight + teams.length * rowHeight + Math.max(0, teams.length - 1) * rowGap;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#0b0e14";
  context.fillRect(0, 0, width, height);
  drawCanvasText(context, title, padding, padding + 18, { size: 24, weight: 800, color: "#f0c45c" });
  drawExportSiteUrl(context, width, padding, padding + 18);

  const imageCache = new Map();
  const loadCharacterImage = async (character) => {
    const avatarUrl = getCharacterAvatarUrl(character);
    if (!avatarUrl) return null;
    if (!imageCache.has(avatarUrl)) imageCache.set(avatarUrl, loadExportImage(avatarUrl));
    return imageCache.get(avatarUrl);
  };

  let y = padding + headerHeight;
  for (const [rowIndex, team] of teams.entries()) {
    const universalCharges = universalRows[rowIndex] || Array(TEAM_SIZE).fill(0);
    const sacrificeFrames = sacrificeRows[rowIndex] || Array(TEAM_SIZE).fill(null);
    const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, dataTeamKey);
    const result = simulatePaidArenaBurst(team, chargeSpeeds, universalCharges, sacrificeFrames);
    const finishingPositions = new Set(result && !result.error ? result.finishingPositionIndices : []);
    const tauntTargetPositionIndex = getTauntTargetState(team, dataTeamKey, chargeSpeeds)?.positionIndex ?? null;
    const teamHasRosanna = team.some((member) => member && isRosanna(member));
    const rowX = padding;
    const rowWidth = width - padding * 2;

    context.fillStyle = "#111821";
    getCanvasRoundedRectPath(context, rowX, y - 10, rowWidth, rowHeight + 12, 8);
    context.fill();
    context.strokeStyle = "#263140";
    context.lineWidth = 1;
    context.stroke();
    drawCanvasText(context, `第${rowIndex + 1}队`, rowX + 18, y + slotSize / 2, { size: 18, weight: 800, color: "#dfe7f3" });

    const slotsStartX = rowX + teamLabelWidth;
    for (let slotIndex = 0; slotIndex < TEAM_SIZE; slotIndex += 1) {
      const character = team[slotIndex];
      const chargeSpeed = chargeSpeeds[slotIndex];
      const sacrificeFrame = sanitizeSacrificeFrame(sacrificeFrames[slotIndex]);
      const slot = {
        index: slotIndex,
        character,
        universalCharge: sanitizeUniversalCharge(universalCharges[slotIndex]),
        image: await loadCharacterImage(character),
        isFinisher: finishingPositions.has(slotIndex) && canShowFinishMarker(character),
        isTauntTarget: character && slotIndex === tauntTargetPositionIndex,
        isSacrificedTarget: character && teamHasRosanna && !isRosanna(character) && sacrificeFrame !== null,
        sacrificeFrame,
        badgeText: getPaidArenaSlotBadgeText(character, chargeSpeed, dataTeamKey),
      };
      drawPaidArenaSlot(context, slot, slotsStartX + slotIndex * (slotSize + slotGap), y, slotSize);
    }

    const resultText = getPaidArenaResultText(team, universalCharges, chargeSpeeds, result, sacrificeFrames);
    const resultY = y + slotSize + 19;
    context.fillStyle = "#17202b";
    getCanvasRoundedRectPath(context, slotsStartX, resultY - 13, teamSlotsWidth, 26, 5);
    context.fill();
    drawCanvasText(context, resultText, slotsStartX + 12, resultY, { size: 16, weight: 700, color: "#f2f5fa" });
    y += rowHeight + rowGap;
  }

  return canvasToPngBlob(canvas);
}

function getNormalArenaResultLabel(result) {
  if (!result || result.error) return "未完成";
  return `${getStandardChargeBand(result.fullFrame)}（${result.fullFrame}F）`;
}

async function normalArenaToPngBlob() {
  const battleResults = getBattleResultsSnapshot();
  const { defenseResult, attackResult } = battleResults;
  const defenseTeam = state.defenseTeam;
  const attackTeam = state.team;
  const defenseUniversalCharges = state.defenseUniversalCharges;
  const attackUniversalCharges = state.universalCharges;
  const defenseChargeSpeeds = state.defenseChargeSpeeds;
  const attackChargeSpeeds = state.chargeSpeeds;
  const defenseFinishers = new Set(defenseResult && !defenseResult.error ? defenseResult.finishingPositionIndices : []);
  const attackFinishers = new Set(attackResult && !attackResult.error ? attackResult.finishingPositionIndices : []);
  const defenseTauntTarget = getTauntTargetState(defenseTeam, "defense", defenseChargeSpeeds)?.positionIndex ?? null;
  const attackTauntTarget = getTauntTargetState(attackTeam, "attack", attackChargeSpeeds)?.positionIndex ?? null;
  const padding = 36;
  const slotSize = 104;
  const slotGap = 14;
  const teamWidth = TEAM_SIZE * slotSize + (TEAM_SIZE - 1) * slotGap;
  const vsWidth = 96;
  const contentWidth = teamWidth * 2 + vsWidth;
  const chartBlob = await getChargeChartPngBlob();
  const chartImage = await loadImageFromUrl(await blobToDataUrl(chartBlob));
  const chartHeight = Math.round(contentWidth * (chartImage.height / chartImage.width));
  const chartY = padding;
  const infoY = chartY + chartHeight + 36;
  const infoHeight = 58;
  const teamsY = infoY + infoHeight + 38;
  const labelY = teamsY - 18;
  const height = teamsY + slotSize + padding;
  const width = contentWidth + padding * 2;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#0b0e14";
  context.fillRect(0, 0, width, height);
  drawExportSiteUrl(context, width, padding, Math.max(18, padding - 12));

  context.drawImage(chartImage, padding, chartY, contentWidth, chartHeight);

  const defenseX = padding;
  const attackX = padding + teamWidth + vsWidth;
  const vsX = padding + teamWidth + vsWidth / 2;

  const drawInfoPill = (x, teamKey, result) => {
    const color = teamKey === "defense" ? "#4da3ff" : "#e43f4f";
    context.fillStyle = teamKey === "defense" ? "rgba(77, 163, 255, 0.14)" : "rgba(228, 63, 79, 0.14)";
    getCanvasRoundedRectPath(context, x, infoY, teamWidth, infoHeight, 7);
    context.fill();
    context.strokeStyle = teamKey === "defense" ? "rgba(77, 163, 255, 0.58)" : "rgba(228, 63, 79, 0.58)";
    context.lineWidth = 1;
    context.stroke();
    drawCanvasText(context, TEAM_LABELS[teamKey], x + 18, infoY + 19, { size: 17, weight: 800, color });
    drawCanvasText(context, getNormalArenaResultLabel(result), x + 18, infoY + 40, { size: 21, weight: 800, color: "#f2f5fa" });
  };

  drawInfoPill(defenseX, "defense", defenseResult);
  drawCanvasText(context, "VS", vsX, infoY + infoHeight / 2, { align: "center", size: 32, weight: 900, color: "#f0c45c" });
  drawInfoPill(attackX, "attack", attackResult);

  drawCanvasText(context, "防守队", defenseX, labelY, { size: 20, weight: 900, color: "#9dccff" });
  drawCanvasText(context, "VS", vsX, teamsY + slotSize / 2, { align: "center", size: 36, weight: 900, color: "#f0c45c" });
  drawCanvasText(context, "进攻队", attackX + teamWidth, labelY, { align: "right", size: 20, weight: 900, color: "#ff9ba5" });

  const imageCache = new Map();
  const loadCharacterImage = async (character) => {
    const avatarUrl = getCharacterAvatarUrl(character);
    if (!avatarUrl) return null;
    if (!imageCache.has(avatarUrl)) imageCache.set(avatarUrl, loadExportImage(avatarUrl));
    return imageCache.get(avatarUrl);
  };

  const drawTeam = async (team, teamKey, x, universalCharges, chargeSpeeds, finishers, tauntTarget) => {
    const sacrificeFrames = getRosannaSacrificeFrameState(teamKey);
    const teamHasRosanna = team.some((member) => member && isRosanna(member));
    for (let index = 0; index < TEAM_SIZE; index += 1) {
      const character = team[index];
      const sacrificeFrame = sanitizeSacrificeFrame(sacrificeFrames[index]);
      const slot = {
        index,
        character,
        universalCharge: sanitizeUniversalCharge(universalCharges[index]),
        image: await loadCharacterImage(character),
        isFinisher: finishers.has(index) && canShowFinishMarker(character),
        isTauntTarget: character && index === tauntTarget,
        isSacrificedTarget: character && teamHasRosanna && !isRosanna(character) && sacrificeFrame !== null,
        sacrificeFrame,
        badgeText: getPaidArenaSlotBadgeText(character, sanitizeChargeSpeed(chargeSpeeds[index]), teamKey),
      };
      drawPaidArenaSlot(context, slot, x + index * (slotSize + slotGap), teamsY, slotSize);
    }
  };

  await drawTeam(defenseTeam, "defense", defenseX, defenseUniversalCharges, defenseChargeSpeeds, defenseFinishers, defenseTauntTarget);
  await drawTeam(attackTeam, "attack", attackX, attackUniversalCharges, attackChargeSpeeds, attackFinishers, attackTauntTarget);

  return canvasToPngBlob(canvas);
}

async function copyBattleResultsWithChart(text) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    throw new Error("rich clipboard is not supported");
  }

  const imageBlob = await getChargeChartPngBlob();
  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": imageBlob,
    }),
  ]);
}

function copyFormValuesForExport(root) {
  root.querySelectorAll("input").forEach((input) => {
    if (input.type === "checkbox" || input.type === "radio") {
      if (input.checked) {
        input.setAttribute("checked", "");
      } else {
        input.removeAttribute("checked");
      }
      return;
    }
    input.setAttribute("value", input.value || "");
  });
}

function getExportStyles() {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || []).map((rule) => rule.cssText).join("\n");
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

function absolutizeExportAssetUrls(root) {
  root.querySelectorAll("img").forEach((image) => {
    const src = image.getAttribute("src");
    if (!src) return;
    image.setAttribute("src", new URL(src, window.location.href).href);
  });
  root.querySelectorAll("image").forEach((image) => {
    const href = image.getAttribute("href") || image.getAttribute("xlink:href");
    if (!href) return;
    const absoluteHref = new URL(href, window.location.href).href;
    image.setAttribute("href", absoluteHref);
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", absoluteHref);
  });
}

async function inlineExportAssetUrls(root) {
  const transparentImageDataUrl =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";
  const inlineImage = async (element, value, applyValue) => {
    if (!value || value.startsWith("data:")) return;
    try {
      const response = await fetch(new URL(value, window.location.href).href);
      if (!response.ok) throw new Error(`asset request failed: ${response.status}`);
      applyValue(await blobToDataUrl(await response.blob()));
    } catch {
      applyValue(transparentImageDataUrl);
    }
  };
  const tasks = [
    ...Array.from(root.querySelectorAll("img")).map((image) =>
      inlineImage(image, image.getAttribute("src"), (value) => image.setAttribute("src", value)),
    ),
    ...Array.from(root.querySelectorAll("image")).map((image) =>
      inlineImage(image, image.getAttribute("href") || image.getAttribute("xlink:href"), (value) => {
        image.setAttribute("href", value);
        image.setAttributeNS("http://www.w3.org/1999/xlink", "href", value);
      }),
    ),
  ];
  await Promise.all(tasks);
}

function createExportBlock(title, elements = []) {
  const block = document.createElement("div");
  block.className = "copy-image-export";
  block.style.position = "fixed";
  block.style.left = "-10000px";
  block.style.top = "0";
  block.style.width = `${Math.max(720, Math.ceil(Math.max(...elements.map((element) => element?.scrollWidth || element?.getBoundingClientRect?.().width || 0), 0)))}px`;
  block.innerHTML = `<div class="copy-image-title">${escapeHtml(title)}</div>`;
  elements.filter(Boolean).forEach((element) => {
    const clone = element.cloneNode(true);
    clone.querySelectorAll(".chart-hover-tooltip, .chart-hover-guide-x, .chart-hover-guide-y, .slot-settings-backdrop").forEach((node) => node.remove());
    clone.classList.add("copy-image-section");
    clone.style.width = "100%";
    copyFormValuesForExport(clone);
    absolutizeExportAssetUrls(clone);
    block.append(clone);
  });
  document.body.append(block);
  return block;
}

async function elementToPngBlob(element) {
  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));
  const renderClone = element.cloneNode(true);
  renderClone.style.position = "static";
  renderClone.style.left = "auto";
  renderClone.style.top = "auto";
  absolutizeExportAssetUrls(renderClone);
  await inlineExportAssetUrls(renderClone);
  const html = new XMLSerializer().serializeToString(renderClone);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>${getExportStyles()}</style>
          ${html}
        </div>
      </foreignObject>
    </svg>
  `;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = await loadImageFromUrl(url);
    const scale = Math.min(2, window.devicePixelRatio || 1);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const context = canvas.getContext("2d");
    context.scale(scale, scale);
    context.fillStyle = "#0b0e14";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return await canvasToPngBlob(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function textToPngBlob(title, text) {
  const lines = [title, ...String(text || "").split(/\r?\n/)];
  const width = 960;
  const lineHeight = 30;
  const padding = 28;
  const height = Math.max(160, padding * 2 + lines.length * lineHeight);
  const escapeSvgText = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const svgText = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#0b0e14"/>
      ${lines
        .map((line, index) => {
          const isTitle = index === 0;
          return `<text x="${padding}" y="${padding + (index + 1) * lineHeight}" fill="${isTitle ? "#f0c45c" : "#f2f5fa"}" font-size="${isTitle ? 22 : 18}" font-family="Arial, Microsoft YaHei, sans-serif">${escapeSvgText(line)}</text>`;
        })
        .join("")}
    </svg>
  `;
  const url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = await loadImageFromUrl(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);
    return await canvasToPngBlob(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function isTaintedCanvasError(error) {
  return error?.name === "SecurityError" || /tainted canvases/i.test(String(error?.message || error));
}

async function copyRichImageToClipboard(imageBlobOrPromise) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    throw new Error("rich clipboard is not supported");
  }
  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": Promise.resolve(imageBlobOrPromise),
    }),
  ]);
}

async function copyCurrentArenaImage() {
  const isPaid = isPaidArenaModeActive();
  return isPaid ? paidArenaToPngBlob() : normalArenaToPngBlob();
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
    await copyBattleResultsWithChart(text);
    showToast("已复制时间轴图片和双方队伍信息");
  } catch {
    try {
      await copyTextToClipboard(text);
      showToast("已复制文字，时间轴图片复制失败");
    } catch {
      showToast("复制失败，请检查浏览器剪切板权限");
    }
  }
}

async function copyArenaImageSummary() {
  const text = getArenaCopyText();
  if (!text && !isPaidArenaModeActive()) {
    showToast("队伍为空，无法复制结果");
    return;
  }
  try {
    const imageBlobPromise = copyCurrentArenaImage();
    await copyRichImageToClipboard(imageBlobPromise);
    showToast(isPaidArenaModeActive() ? "已复制竞技场队伍图片" : "已复制时间轴和双方队伍图片");
  } catch (error) {
    console.error("copy arena image failed", error);
    try {
      await copyTextToClipboard(text);
      showToast("图片复制失败，已复制文字信息");
    } catch {
      showToast("复制失败，请检查浏览器剪贴板权限");
    }
  }
}

async function shareArenaImageSummary() {
  const text = getArenaCopyText();
  if (!text && !isPaidArenaModeActive()) {
    showToast("队伍为空，无法分享结果");
    return;
  }
  try {
    const imageBlob = await copyCurrentArenaImage();
    const file = new File([imageBlob], `nikke-pvp-${Date.now()}.png`, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "NIKKE PVP",
      });
      showToast("已打开分享");
      return;
    }
    await copyRichImageToClipboard(imageBlob);
    showToast("当前浏览器不支持分享，已复制图片");
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error("share arena image failed", error);
    try {
      await copyArenaImageSummary();
    } catch {
      showToast("分享失败，请检查浏览器权限");
    }
  }
}

function handleCopyButtonClick() {
  if (isMobileCopyChoiceRuntime()) {
    shareArenaImageSummary();
    return;
  }
  copyArenaImageSummary();
}

function handleCopyContextPointerDown(event) {
  if (event.button !== 2) return;
  event.preventDefault();
  event.stopPropagation();
  copyArenaImageSummary();
}

function handleCopyContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  if (isMobileCopyChoiceRuntime()) {
    shareArenaImageSummary();
  }
}

function suppressContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
}

function bindEvents() {
  els.helpButton?.addEventListener("click", openHelpModal);
  els.sidebarMenuButton?.addEventListener("click", () => setSidebarOpen(true));
  els.sidebarCloseButton?.addEventListener("click", () => setSidebarOpen(false));
  els.appSidebarBackdrop?.addEventListener("click", () => setSidebarOpen(false));
  els.changelogButton?.addEventListener("click", () => {
    setSidebarOpen(false);
    openChangelogModal();
  });
  els.sidebarHelpButton?.addEventListener("click", () => {
    setSidebarOpen(false);
    openHelpModal();
  });
  els.themeToggleButton?.addEventListener("click", toggleTheme);
  els.appVersion?.addEventListener("click", toggleLocalPaidDevAccess);
  els.appVersion?.addEventListener("keydown", (event) => {
    if (!isLocalDevRuntime() || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    toggleLocalPaidDevAccess();
  });
  els.paidInferenceButton?.addEventListener("click", openPaidInferenceFeature);
  els.paidCModeButton?.addEventListener("click", () => openPaidArenaFeature("c"));
  els.paidPModeButton?.addEventListener("click", () => openPaidArenaFeature("p"));
  els.clearTeamButton.addEventListener("click", clearTeam);
  els.copyTeamButton.addEventListener("click", handleCopyButtonClick);
  els.swapTeamButton.addEventListener("click", swapBattleTeams);
  els.allowMissedShotsToggle.addEventListener("change", (event) => {
    state.allowMissedShots = event.target.checked;
    saveTeam();
    render();
  });
  els.battlePowerBaseInput?.addEventListener("focus", (event) => {
    event.target.select();
  });
  els.battlePowerBaseInput?.addEventListener("input", (event) => {
    state.battlePowerBase = sanitizeBattlePowerBase(event.target.value);
    saveTeam();
    renderBattlePowerStrip();
  });
  els.battlePowerBaseInput?.addEventListener("blur", () => {
    renderBattlePowerStrip();
  });
  els.lineupSlots.addEventListener("click", (event) => {
    if (suppressLineupClick) {
      event.preventDefault();
      return;
    }
    const paidButton = event.target.closest("[data-paid-arena-lineup-index]");
    if (paidButton) {
      switchPaidArenaLineupSlot(Number(paidButton.dataset.paidArenaLineupIndex));
      return;
    }
    const button = event.target.closest("[data-lineup-index]");
    if (!button) return;
    switchLineupSlot(Number(button.dataset.lineupIndex));
  });
  els.chargeChart.addEventListener("mousemove", showNearestChartTooltip);
  els.chargeChart.addEventListener("pointerdown", showChartTooltipByInteraction);
  els.chargeChart.addEventListener("click", showChartTooltipByInteraction);
  els.chargeChart.addEventListener("mouseleave", hideChartTooltip);
  document.addEventListener("touchstart", hideFloatingTooltips, { capture: true, passive: true });
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType && event.pointerType !== "mouse") hideFloatingTooltips();
    },
    { capture: true, passive: true },
  );
  window.addEventListener("scroll", hideFloatingTooltips, { passive: true });
  window.addEventListener("orientationchange", hideFloatingTooltips);
  window.addEventListener("resize", scheduleResponsiveRender);
  window.addEventListener("resize", hideFloatingTooltips);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isHelpModalOpen) closeHelpModal();
    if (event.key === "Escape") closeChangelogModal();
    if (event.key === "Escape") setSidebarOpen(false);
    if (event.key === "Escape") closePaidFeatureModal();
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
  els.compactAvatarToggle?.addEventListener("change", (event) => {
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
  if (els.compactAvatarToggle) {
    els.compactAvatarToggle.checked = state.compactAvatarIcons;
  }
  els.stageFilterButtons.forEach((button) => {
    const isActive = normalizeStageFilter(state.filters.stage) === button.dataset.stageFilter;
    button.setAttribute("aria-pressed", String(isActive));
  });
  els.searchInput.value = state.filters.search;
  updateSortSummary();
}

async function bootstrap() {
  initTheme();
  await loadCharacterData();
  bindEvents();
  loadTeam();
  els.allowMissedShotsToggle.checked = state.allowMissedShots;
  syncFilterControls();
  syncLocalPaidDevAccessControl();
  render();
  showInitialHelpIntro();
}

bootstrap().catch((error) => {
  console.error(error);
  els.toast.textContent = error?.message || "初始化失败";
  els.toast.classList.add("show");
});
