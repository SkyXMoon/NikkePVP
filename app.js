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
const BURST_COVERAGE_START_DELAY_FRAMES = 6;
const NOAH_BURST_COVERAGE_DURATION_FRAMES = 3 * FRAMES_PER_SECOND;
const BLANC_BURST_COVERAGE_DURATION_FRAMES = 10 * FRAMES_PER_SECOND;
// 暂存爆裂覆盖逻辑，当前先不在总充能轴上显示，后续确认方案后再开启。
const SHOW_BURST_COVERAGE_ON_TOTAL_CHARGE = false;
const STORAGE_KEY = "nikke-arena-charge-team-v2";
const TEAM_PRESETS_STORAGE_KEY = "nikke-arena-team-presets-v1";
const LEGACY_STORAGE_KEY = "nikke-arena-charge-team-v1";
const TEAM_SHARE_URL_PARAM = "team";
const TEAM_SHARE_PAYLOAD_TYPE = "team-preset";
const TEAM_SHARE_PAYLOAD_VERSION = 1;
const THEME_STORAGE_KEY = "nikke-arena-theme";
const LANGUAGE_STORAGE_KEY = "nikke-arena-language";
const HELP_INTRO_STORAGE_KEY = "nikke-help-intro-seen-v1";
const HELP_CENTER_SHARE_URL_PARAM = "help";
const RECOMMENDATION_SHARE_URL_PARAM = "recommendation";
const GUIDED_TOUR_STORAGE_KEY = "nikke-guided-tour-seen-v1";
// 重置密码会话跨刷新保持，用于压制新手引导，密码更新成功后清除。
const PASSWORD_RECOVERY_STORAGE_KEY = "nikke-password-recovery-pending-v1";
const ANNOUNCEMENT_DISMISSED_STORAGE_KEY = "nikke-announcement-dismissed-version";
const CHAMPION_WINRATE_MODEL_CACHE_STORAGE_KEY = "nikke-champion-winrate-model-cache-v1";
const CHAMPION_WINRATE_MODEL_CACHE_SCHEMA_VERSION = 1;
const CHAMPION_WINRATE_MODEL_VERSION = 1;
const AUTH_SESSION_STORAGE_KEY = "nikke-supabase-auth-session-v1";
const INVITE_CODE_STORAGE_KEY = "nikke-pending-invite-code-v1";
const DEVICE_ID_STORAGE_KEY = "nikke-device-id-v1";
const INVITE_PANEL_CACHE_STORAGE_PREFIX = "nikke-invite-panel-cache-v1";
const INVITE_PANEL_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const EXTERNAL_API_KEY_PANEL_CACHE_STORAGE_PREFIX = "nikke-external-api-key-panel-cache-v1";
const PENDING_ARCA_KEY_STORAGE_KEY = "nikke-pending-arca-key-v1";
const EXTERNAL_API_KEY_PANEL_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_SUPABASE_PROJECT_URL = "https://xjdyqxkryqtkiroylygp.supabase.co";
const DEFAULT_SUPABASE_FUNCTIONS_BASE_URL = `${DEFAULT_SUPABASE_PROJECT_URL}/functions/v1`;
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_b5uqRu8YvXZSYoOJu-qScw_VKXtGlYD";
const LOCAL_FALLBACK_SUPABASE_PROJECT_URL = "http://127.0.0.1:54321";
const LOCAL_FALLBACK_SUPABASE_FUNCTIONS_BASE_URL = `${LOCAL_FALLBACK_SUPABASE_PROJECT_URL}/functions/v1`;
const LOCAL_FALLBACK_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
const SUPABASE_PROJECT_URL = getSupabaseProjectUrl();
const SUPABASE_PUBLISHABLE_KEY = getSupabasePublishableKey();
const SUPABASE_CHAMPION_MATCHES_ENDPOINT = getSupabaseChampionMatchesEndpoint();
const SUPABASE_ATTACK_RECOMMENDATIONS_ENDPOINT = getConfiguredFunctionEndpoint("attack-recommendations");
const SUPABASE_QQ_BINDING_TOKEN_ENDPOINT = getConfiguredFunctionEndpoint("qq-binding-token");
const SUPABASE_WECHAT_BINDING_TOKEN_ENDPOINT = getConfiguredFunctionEndpoint("wechat-binding-token");
const SUPABASE_ACCOUNT_STATUS_ENDPOINT = getSupabaseAccountStatusEndpoint();
const SUPABASE_TAPTAP_USER_INFO_ENDPOINT = getSupabaseTapTapUserInfoEndpoint();
const SUPABASE_USER_INVITES_ENDPOINT = getSupabaseUserInvitesEndpoint();
const SUPABASE_ADMIN_USERS_ENDPOINT = getSupabaseAdminUsersEndpoint();
const SUPABASE_EXTERNAL_API_KEY_ENDPOINT = getSupabaseExternalApiKeyEndpoint();
const SUPABASE_EQUIPMENT_SYNC_ENDPOINT = getSupabaseEquipmentSyncEndpoint();
const SUPABASE_HELP_CENTER_ENDPOINT = getSupabaseHelpCenterEndpoint();
const EXTERNAL_EQUIPMENT_PROVIDER = "equipment";
const EXTERNAL_EQUIPMENT_CACHE_STORAGE_PREFIX = "nikke-equipment-cache-v1";
const TAPTAP_AUTO_SYNC_STORAGE_PREFIX = "nikke-taptap-auto-sync-v1";
const AUTO_SYNC_DATE_TIME_ZONE = "Asia/Shanghai";
const THIRD_PARTY_DATA_REGIONS = Object.freeze(["cn", "global"]);
const THIRD_PARTY_EQUIPMENT_STAT_URL = "https://pinkuro.top:9984/third/bot/nikke/v1/getUserInfo";
const THIRD_PARTY_USER_INFO_URL = "https://pinkuro.top:9984/third/bot/nikke/v1/getUserInfo";
const THIRD_PARTY_UPDATE_USER_INFO_URL = "https://pinkuro.top:9984/third/bot/nikke/v1/updateUserInfo";
const THIRD_PARTY_UPDATE_USER_CHARACTER_URL = "https://pinkuro.top:9984/third/bot/nikke/v2/updateUserCharacter";
const FRONTEND_ADMIN_EMAILS = new Set(["307919309@qq.com"]);
const CHARACTER_DETAIL_LONG_PRESS_DELAY_MS = 550;
const CHARACTER_DETAIL_ASSET_TIMEOUT_MS = 3500;
const CHARACTER_DETAIL_LEVEL_MAX = 1400;
const APP_VERSION = "V1.80.1125";
let arcaWorkspace=null,arcaWorkspacePromise=null;
let privateHelpClientPromise=null;
let pendingPrivateHelpOptions=null;
const APP_MODULE_VERSION_PARAM = `v=${encodeURIComponent(APP_VERSION)}`;
const FAVORITE_CHARACTERS_STORAGE_KEY = "nikke-favorite-character-ids-v1";
const FEATURE_HINT_STORAGE_KEY = "nikke-feature-hints-seen-v1";

function importAppModule(modulePath) {
  return import(`${modulePath}?${APP_MODULE_VERSION_PARAM}`);
}

function getImmutableAssetUrl(value) {
  const resolver = globalThis.__NIKKE_IMMUTABLE_ASSET_URL__;
  return typeof resolver === "function" ? resolver(value) : value;
}

// beforeinstallprompt 只能可靠地捕获一次，必须在懒加载 PWA 模块前同步监听。
let pwaInstallModulePromise = null;
let pendingPwaInstallPromptEvent = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  pendingPwaInstallPromptEvent = event;
  void pwaInstallModulePromise?.then((module) => module.setPwaInstallPromptEvent?.(event));
});
window.addEventListener("appinstalled", () => {
  pendingPwaInstallPromptEvent = null;
  void pwaInstallModulePromise?.then((module) => module.handlePwaInstalled?.());
});

const FEATURE_HINTS = [
  {
    key: "ocr-parallel-clipboard-v1",
    elementId: "ocrUploadButton",
    textZh: "NEW",
    textEn: "NEW",
    titleZh: "支持粘贴图片和分栏并行识别",
    titleEn: "Supports pasted images and parallel split OCR",
  },
  {
    key: "help-center-v1",
    elementId: "helpCenterButton",
    textZh: "NEW",
    textEn: "NEW",
    titleZh: "新增竞技场求助与解法",
    titleEn: "New arena help and solutions",
  },
  {
    key: "champion-stats-v1",
    elementId: "championDataButton",
    textZh: "NEW",
    textEn: "NEW",
    titleZh: "冠军竞技场赛季数据与胜率统计",
    titleEn: "Champion season data and win-rate stats",
  },
  {
    key: "season-fab-v1",
    elementId: "seasonDataFab",
    textZh: "NEW",
    textEn: "NEW",
    titleZh: "快速打开赛季数据",
    titleEn: "Quick access to season data",
  },
];
let capturedInviteCodeOnLoad = "";
let capturedHelpCenterRequestIdOnLoad = "";
let capturedRecommendationGuideIdOnLoad = "";
const FEATURE_KEYS = {
  seasonData: "season_data",
};
const externalApiKeyPanelCache = {
  cacheKey: "",
  data: null,
  promise: null,
};
const UI_TEXTS = {
  zh: {
    appTitle: "NIKKE 竞技场充能计算器",
    sidebarMenuButtonLabel: "打开侧边栏",
    sidebarMenuButtonTitle: "打开侧边栏",
    sidebarCloseButtonLabel: "关闭侧边栏",
    changelogLabel: "更新日志",
    helpLabel: "使用说明",
    championDataLabel: "冠军竞技场赛季数据",
    pveLabel: "NIKKE PVE",
    accountLabel: "账号",
    suggestionLabel: "关于&建议",
    themeToggleDarkLabel: "切换为黑色主题",
    themeToggleLightLabel: "切换为白色主题",
    languageLabelToEn: "切换为英文",
    languageLabelToZh: "切换为中文",
    languageButtonText: "En",
    searchPlaceholder: "角色名（首字母）/ 英文名",
    teamPanelTitle: "队伍",
    battlePower: {
      defense: "可防",
      attack: "可攻",
      summaryEmpty: "队伍为空，选择角色后开始计算",
      baseLabel: "战压基准值",
    },
    sidebarHelp: "打开页面说明",
    shareButton: "分享",
    shareImageButton: "分享队伍图片",
    recognizeButton: "识别图片填充队伍",
    missShotToggle: "计算空枪",
    sortSummaryLabel: "",
    sortSummaryBy: "充能从高到低",
    filterCommon: "常",
    filterCommonSummary: "常用",
    filterRegionCN: "国",
    filterRegionCNSummary: "国服",
    filterRegionGlobal: "国际服",
    filterFavorite: "\u2605",
    filterFavoriteSummary: "\u6536\u85cf",
    filterBurst: "爆裂",
    summaryTeamLabels: {
      defense: "防守队",
      attack: "进攻队",
    },
    filterTitle: "筛选",
    listCountSuffix: "名角色",
    helpModalTitle: "使用说明",
    paidInference: "空枪反推",
    paidCMode: "冠军竞技场",
    paidPMode: "特殊竞技场",
    swapTeam: "切换进攻防守队伍",
    clearTeam: "清空双方队伍",
  },
  en: {
    appTitle: "NIKKE Arena Charge Calculator",
    sidebarMenuButtonLabel: "Open sidebar",
    sidebarMenuButtonTitle: "Open sidebar",
    sidebarCloseButtonLabel: "Close sidebar",
    changelogLabel: "Changelog",
    helpLabel: "Help",
    championDataLabel: "Champion Arena Season Data",
    pveLabel: "NIKKE PVE",
    accountLabel: "Account",
    suggestionLabel: "About & Feedback",
    themeToggleDarkLabel: "Switch to dark theme",
    themeToggleLightLabel: "Switch to light theme",
    languageLabelToEn: "Switch to English",
    languageLabelToZh: "Switch to Chinese",
    languageButtonText: "中",
    searchPlaceholder: "Name / initials / English",
    teamPanelTitle: "Team",
    battlePower: {
      defense: "Defense",
      attack: "Attack",
      summaryEmpty: "Team is empty. Select members to calculate.",
      baseLabel: "Power threshold",
    },
    sidebarHelp: "Open help panel",
    shareButton: "Share",
    shareImageButton: "Share team image",
    recognizeButton: "Recognize image",
    missShotToggle: "Enable missed-shot calculation",
    sortSummaryLabel: "",
    sortSummaryBy: "Charge high to low",
    filterCommon: "PVP",
    filterCommonSummary: "PVP",
    filterRegionCN: "CN",
    filterRegionCNSummary: "CN",
    filterRegionGlobal: "Global",
    filterFavorite: "\u2605",
    filterFavoriteSummary: "Favorites",
    filterBurst: "Burst ",
    summaryTeamLabels: {
      defense: "Defense",
      attack: "Attack",
    },
    filterTitle: "Filters",
    listCountSuffix: "characters",
    helpModalTitle: "Help",
    paidInference: "Missed shots estimate",
    paidCMode: "Championship",
    paidPMode: "Special",
    swapTeam: "Swap attack/defense",
    clearTeam: "Clear both teams",
  saveTeamPreset: "Save team",
  loadTeamPreset: "Load team",
  teamPresetModalTitle: "Team snapshots",
  teamPresetModalKicker: "Local",
  teamPresetListEmpty: "No saved teams",
  teamPresetDuplicateNotice: "Team already exists",
  teamPresetLoadButton: "Load",
  teamPresetDeleteButton: "Delete",
  teamPresetSavedToast: "Team snapshot saved",
  teamPresetLoadedToast: "Team loaded",
  teamPresetDeletedToast: "Snapshot deleted",
  teamPresetPaidWarning: "Please switch to normal mode before using this feature",
  },
};
const WEAPON_ORDER = ["SMG", "AR", "SG", "MG", "SR", "RL"];
const TEST_NOAH_ID = 12;
const TEST_SCARLET_ID = 37;
const TEST_SCARLET_MAGAZINES = Array.from({ length: 69 }, (_, index) => index + 20);
const DEFAULT_AUTO_TEST_SHOTS = 3;
const OCR_MAX_RETRY_COUNT = 5;
const OCR_MAX_CROP_SELECTIONS = 2;
const OCR_RAW_SPECIAL_NAME_MATCHES = new Set(["A2", "2B"]);
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
  { frame: 126, shots: 9 },
];
const STANDARD_TIMELINE_EVENTS = [
  {
    label: "罗珊娜",
    getTooltip: () => localize("罗珊娜（96F）消除BUFF", "Rosanna (96F) removes buffs"),
    frame: 96,
  },
];
const ROSANNA_BUFF_REMOVE_FRAME = 96;
const LITTLE_MERMAID_STUN_FRAME = 196;
const LITTLE_MERMAID_STUN_DURATION_FRAMES = 180;
const LITTLE_MERMAID_STUN_TARGET_INDEX = 0;
const LITTLE_MERMAID_TIMELINE_EVENT = {
  label: "小美人鱼",
  getTooltip: () => localize("小美人鱼（196F）晕眩P1，持续3秒", "Little Mermaid (196F) stuns P1 for 3 seconds"),
  frame: LITTLE_MERMAID_STUN_FRAME,
};
const VESTI_TACTICAL_HIT_OFFSETS = [0, 22, 44, 66];
const CINDERELLA_INITIAL_SPLASH_SEQUENCE = [true, false, false, false, true, true];
const CINDERELLA_LOOP_SPLASH_SEQUENCE = [false, false, false, false, true, true];
const DEFAULT_CHARGE_WEAPON_CHARGE_FRAMES = 60;
const CHART_MAX_FRAME = 600;
const CHART_WIDTH = 1800;
const CHART_HEIGHT = 660;
const CHART_MIN_WIDTH = 320;
const CHART_LABEL_VISIBLE_WIDTH = 55;
const CHART_LABEL_GUTTER = 71;
const CHART_LABEL_PADDING_LEFT = 6;
const CHART_RIGHT_GUTTER = 24;
const SHARE_EXPORT_CHART_SIZE = { width: 378, height: 460 };
const SCARLET_COUNTER_PROBABILITY = 0.3;
const JACKAL_LINK_HIT_THRESHOLD = 10;
const JACKAL_LINK_CHARGE_DELAY_FRAMES = 6;
const ROSANNA_SACRIFICE_CHARGE = 36.54;
const RED_HOOD_CHARGE_SPEED_PER_ATTACK = 3.81;
const RED_HOOD_MAX_CHARGE_SPEED_STACKS = 10;
const EMILIA_CHARGE_SPEED_AFTER_FIRST_SHOT = 13.01;
const TURN_DODGE_WINDOW_FRAMES = 6;
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
const CUBE_TYPE_ADJUTANT = "adjutant";
const CUBE_TYPE_QUANTUM = "quantum";
const CUBE_TYPE_RESILIENCE = "resilience";
const CUBE_TYPE_BASTION = "bastion";
const CUBE_TYPE_WINGMAN = "wingman";
const CUBE_TYPE_ASSAULT = "assault";
const CUBE_TYPE_ONSLAUGHT = "onslaught";
const CUBE_TYPE_VIGOR = "vigor";
const CUBE_TYPE_ENDURANCE = "endurance";
const CUBE_TYPE_HEALING = "healing";
const CUBE_TYPE_TEMPERING = "tempering";
const CUBE_TYPE_ASSIST = "assist";
const CUBE_TYPE_DESTRUCTION = "destruction";
const CUBE_TYPE_PIERCING = "piercing";
const CHARGE_SPEED_CUBE_VALUE = 2.12;
const CUBE_TYPE_META = Object.freeze({
  [CUBE_TYPE_CHARGE_SPEED]: { zh: "\u84c4\u529b\u901f\u5ea6\u9b54\u65b9", en: "Adjutant Cube", icon: "adjutant.webp" },
  [CUBE_TYPE_QUANTUM]: { zh: "\u91cf\u5b50\u9b54\u65b9", en: "Quantum Cube", icon: "quantum.webp" },
  [CUBE_TYPE_RESILIENCE]: { zh: "\u56de\u5f39\u9b54\u65b9", en: "Resilience Cube", icon: "resilience.webp" },
  [CUBE_TYPE_BASTION]: { zh: "\u5f39\u4e38\u8865\u5145\u9b54\u65b9", en: "Bastion Cube", icon: "bastion.webp" },
  [CUBE_TYPE_WINGMAN]: { zh: "\u547d\u4e2d\u7387\u589e\u5f3a\u9b54\u65b9", en: "Wingman Cube", icon: "wingman.webp" },
  [CUBE_TYPE_ASSAULT]: { zh: "\u653b\u51fb\u589e\u5f3a\u9b54\u65b9", en: "Assault Cube", icon: "assault.webp" },
  [CUBE_TYPE_ONSLAUGHT]: { zh: "\u7206\u51fb\u9b54\u65b9", en: "Onslaught Cube", icon: "onslaught.webp" },
  [CUBE_TYPE_VIGOR]: { zh: "\u4f53\u529b\u589e\u5f3a\u9b54\u65b9", en: "Vigor Cube", icon: "vigor.webp" },
  [CUBE_TYPE_ENDURANCE]: { zh: "\u9632\u5fa1\u589e\u5f3a\u9b54\u65b9", en: "Endurance Cube", icon: "endurance.webp" },
  [CUBE_TYPE_HEALING]: { zh: "\u6cbb\u7597\u9b54\u65b9", en: "Healing Cube", icon: "healing.webp" },
  [CUBE_TYPE_TEMPERING]: { zh: "\u575a\u97e7\u9b54\u65b9", en: "Tempering Cube", icon: "tempering.webp" },
  [CUBE_TYPE_ASSIST]: { zh: "\u652f\u63f4\u9b54\u65b9", en: "Assist Cube", icon: "assist.webp" },
  [CUBE_TYPE_ADJUTANT]: { zh: "\u84c4\u529b\u901f\u5ea6\u9b54\u65b9", en: "Adjutant Cube", icon: "adjutant.webp" },
  [CUBE_TYPE_DESTRUCTION]: { zh: "\u7834\u574f\u9b54\u65b9", en: "Destruction Cube", icon: "destruction.webp" },
  [CUBE_TYPE_PIERCING]: { zh: "\u8d2f\u901a\u9b54\u65b9", en: "Piercing Cube", icon: "piercing.webp" },
});
const TEAM_CUBE_TYPE_IDS = Object.freeze({
  [CUBE_TYPE_CHARGE_SPEED]: 1,
  [CUBE_TYPE_QUANTUM]: 2,
  [CUBE_TYPE_RESILIENCE]: 3,
  [CUBE_TYPE_BASTION]: 4,
  [CUBE_TYPE_ENDURANCE]: 5,
  [CUBE_TYPE_TEMPERING]: 6,
  [CUBE_TYPE_VIGOR]: 7,
  [CUBE_TYPE_ASSIST]: 8,
});
const TEAM_CUBE_OPTIONS = Object.entries(TEAM_CUBE_TYPE_IDS).map(([type, id]) => {
  const meta = CUBE_TYPE_META[type];
  return {
    id,
    type,
    name: meta?.zh || "",
    enName: meta?.en || "",
    icon: meta?.icon || "",
  };
});
const TEAM_CUBE_TYPES = TEAM_CUBE_OPTIONS.map((option) => option.type);
const TEAM_CUBE_TYPE_BY_ID = new Map(TEAM_CUBE_OPTIONS.map((option) => [String(option.id), option.type]));
const TEAM_CUBE_ID_BY_TYPE = new Map(TEAM_CUBE_OPTIONS.map((option) => [option.type, option.id]));
const LEGACY_TEAM_CUBE_SHARE_TYPES_BY_CODE = {
  s: CUBE_TYPE_CHARGE_SPEED,
  q: CUBE_TYPE_QUANTUM,
  r: CUBE_TYPE_RESILIENCE,
  b: CUBE_TYPE_BASTION,
  v: CUBE_TYPE_VIGOR,
  e: CUBE_TYPE_ENDURANCE,
  t: CUBE_TYPE_TEMPERING,
  i: CUBE_TYPE_ASSIST,
};
const MG_SUSTAIN_START_FRAME = 128;
const MG_SUSTAIN_INTERVAL_FRAMES = 2;
const CHAMPION_ALL_SEASONS_KEY = "all";
const CHAMPION_STAGE_OPTIONS = [
  { value: "unknown", zh: "未知", en: "Unknown" },
  { value: "qualifier", zh: "晋级赛", en: "Qualifier" },
  { value: "top64", zh: "64强", en: "Top 64" },
  { value: "top32", zh: "32强", en: "Top 32" },
  { value: "top16", zh: "16强", en: "Top 16" },
  { value: "top8", zh: "8强", en: "Top 8" },
  { value: "top4", zh: "4强", en: "Top 4" },
  { value: "final", zh: "决赛", en: "Final" },
];
const QUANTUM_RELIC_CUBE_MULTIPLIER = 1.0466;
const ANIS_SUPERSTAR_CHARGE_SUPPLEMENT_RATE = 0.06;
const ANIS_SUPERSTAR_CHARACTER_NAMES = new Set([
  "阿妮斯:超级巨星",
  "阿妮斯：超级巨星",
  "阿妮斯-超级巨星",
  "阿妮斯超级巨星",
]);

async function loadCharacterData() {
  if (typeof CHARACTERS !== "undefined" && Array.isArray(CHARACTERS)) return;
  const dataReady = globalThis.__NIKKE_CHARACTER_DATA_READY__;
  if (dataReady && typeof dataReady.then === "function") {
    await dataReady;
  }
  if (typeof CHARACTERS !== "undefined" && Array.isArray(CHARACTERS)) return;
  throw new Error("角色数据加载失败：本地数据文件未正确加载");
}

function canUseServiceWorkerForAvatarCache() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") return false;
  return window.isSecureContext || ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

async function loadCharacterAssets() {
  if (typeof CHARACTER_ASSETS !== "undefined" && Array.isArray(CHARACTER_ASSETS.linked)) return CHARACTER_ASSETS;
  const loader = globalThis.__NIKKE_LOAD_CHARACTER_ASSETS__;
  if (typeof loader !== "function") {
    throw new Error("角色资产加载器不可用");
  }
  const assets = await loader();
  if (!assets || !Array.isArray(assets.linked)) {
    throw new Error("角色资产加载失败：本地资产映射文件未正确加载");
  }
  return assets;
}

function isPrivateIpv4Hostname(hostname = "") {
  const parts = String(hostname).split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  if (parts[0] === 10) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  return false;
}

function isLocalDevHostname(hostname = window.location.hostname) {
  return ["localhost", "127.0.0.1", "::1"].includes(hostname) || isPrivateIpv4Hostname(hostname);
}

function getLocalSupabaseUrl(path = "") {
  const hostname = typeof window !== "undefined" && isLocalDevHostname() ? window.location.hostname : "127.0.0.1";
  const host = hostname === "::1" ? "[::1]" : hostname;
  return `http://${host}:54321${path}`;
}

function getNikkeRuntimeConfig() {
  const config = globalThis.__NIKKE_CONFIG__;
  return config && typeof config === "object" ? config : {};
}

function getConfiguredSupabaseUrl() {
  const configUrl = String(getNikkeRuntimeConfig().supabaseUrl || "").trim();
  if (configUrl) return configUrl.replace(/\/+$/, "");
  return isLocalDevHostname() ? getLocalSupabaseUrl("") : DEFAULT_SUPABASE_PROJECT_URL;
}

function getConfiguredFunctionsBaseUrl() {
  const configUrl = String(getNikkeRuntimeConfig().functionsBaseUrl || "").trim();
  if (configUrl) return configUrl.replace(/\/+$/, "");
  return isLocalDevHostname() ? LOCAL_FALLBACK_SUPABASE_FUNCTIONS_BASE_URL : DEFAULT_SUPABASE_FUNCTIONS_BASE_URL;
}

function getConfiguredPublishableKey() {
  const configKey = String(getNikkeRuntimeConfig().publishableKey || "").trim();
  if (configKey) return configKey;
  return isLocalDevHostname() ? LOCAL_FALLBACK_SUPABASE_PUBLISHABLE_KEY : DEFAULT_SUPABASE_PUBLISHABLE_KEY;
}

function getConfiguredFunctionEndpoint(name) {
  return `${getConfiguredFunctionsBaseUrl()}/${name}`;
}

function getSupabaseProjectUrl() {
  const override = globalThis.__NIKKE_SUPABASE_PROJECT_URL__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return getConfiguredSupabaseUrl();
}

function getSupabasePublishableKey() {
  const override = globalThis.__NIKKE_SUPABASE_PUBLISHABLE_KEY__;
  if (typeof override === "string" && override.trim()) return override.trim();
  return getConfiguredPublishableKey();
}

function getSupabaseChampionMatchesEndpoint() {
  const override = globalThis.__NIKKE_CHAMPION_MATCHES_ENDPOINT__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return getConfiguredFunctionEndpoint("champion-matches");
}

function getSupabaseAccountStatusEndpoint() {
  const override = globalThis.__NIKKE_ACCOUNT_STATUS_ENDPOINT__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return getConfiguredFunctionEndpoint("account-status");
}

function getSupabaseTapTapUserInfoEndpoint() {
  const override = globalThis.__NIKKE_TAPTAP_USER_INFO_ENDPOINT__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return "https://home.skyxmoon.cn:5678/v1/taptap";
}

function getSupabaseUserInvitesEndpoint() {
  const override = globalThis.__NIKKE_USER_INVITES_ENDPOINT__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return getConfiguredFunctionEndpoint("user-invites");
}

function getSupabaseAdminUsersEndpoint() {
  const override = globalThis.__NIKKE_ADMIN_USERS_ENDPOINT__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return getConfiguredFunctionEndpoint("admin-users");
}

function getSupabaseExternalApiKeyEndpoint() {
  const override = globalThis.__NIKKE_EXTERNAL_API_KEY_ENDPOINT__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return getConfiguredFunctionEndpoint("external-api-key");
}

function getSupabaseEquipmentSyncEndpoint() {
  const override = globalThis.__NIKKE_EQUIPMENT_SYNC_ENDPOINT__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return getConfiguredFunctionEndpoint("equipment-sync");
}

function getSupabaseHelpCenterEndpoint() {
  const override = globalThis.__NIKKE_HELP_CENTER_ENDPOINT__;
  if (typeof override === "string" && override.startsWith("http")) return override;
  return getConfiguredFunctionEndpoint("help-center");
}

async function warmAvatarCacheInServiceWorker() {
  if (!canUseServiceWorkerForAvatarCache()) return;
  try {
    let isReloadingForServiceWorkerUpdate = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (isReloadingForServiceWorkerUpdate) return;
      isReloadingForServiceWorkerUpdate = true;
      window.location.reload();
    });

    const registration = await navigator.serviceWorker.register(`./sw.js?${APP_MODULE_VERSION_PARAM}`, { scope: "./", updateViaCache: "none" });
    const requestWaitingWorkerActivation = () => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    };

    registration.addEventListener("updatefound", () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;
      installingWorker.addEventListener("statechange", () => {
        if (installingWorker.state === "installed") requestWaitingWorkerActivation();
      });
    });

    requestWaitingWorkerActivation();
    await registration.update();
  } catch (error) {
    console.warn("头像缓存初始化失败，已跳过本地缓存：", error);
  }
}

const state = {
  arcaChargeParameters: {},
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
  paidArenaDisplayMode: "side",
  paidArenaDataTeamKey: "attack",
  championStage: "unknown",
  paidArenaTeams: {
    c: createEmptyPaidArenaTeamsBySide("c"),
    p: createEmptyPaidArenaTeamsBySide("p"),
  },
  paidArenaLineupSlots: {
    c: Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyPaidArenaLineupSlot("c")),
    p: Array.from({ length: LINEUP_SLOT_COUNT }, () => createEmptyPaidArenaLineupSlot("p")),
  },
  paidArenaUniversalCharges: {
    c: createEmptyPaidArenaUniversalChargesBySide("c"),
    p: createEmptyPaidArenaUniversalChargesBySide("p"),
  },
  paidArenaChargeSpeeds: {
    c: createEmptyPaidArenaChargeSpeedsBySide("c"),
    p: createEmptyPaidArenaChargeSpeedsBySide("p"),
  },
  paidArenaRosannaSacrificeFrames: {
    c: createEmptyPaidArenaRosannaSacrificeFramesBySide("c"),
    p: createEmptyPaidArenaRosannaSacrificeFramesBySide("p"),
  },
  paidArenaRedHoodPierceCounts: {
    c: createEmptyPaidArenaRedHoodPierceCountsBySide("c"),
    p: createEmptyPaidArenaRedHoodPierceCountsBySide("p"),
  },
  paidArenaScarletCounterEnabled: {
    c: createEmptyPaidArenaScarletCounterEnabledBySide("c"),
    p: createEmptyPaidArenaScarletCounterEnabledBySide("p"),
  },
  paidArenaJackalLinks: {
    c: createEmptyPaidArenaJackalLinksBySide("c"),
    p: createEmptyPaidArenaJackalLinksBySide("p"),
  },
  allowMissedShots: true,
  battlePowerBase: 0,
  testMode: false,
  compactAvatarIcons: true,
  activeTeamKey: "defense",
  teamPresets: [],
  authSession: null,
  authRecoveryPending: false,
  accountProfile: null,
  entitlements: new Map(),
  entitlementLoaded: false,
  isAdmin: false,
  language: "zh",
  filters: {
    common: "common",
    weapon: "all",
    company: "all",
    stage: "all",
    region: "cn",
    search: "",
    favorite: false,
  },
  helpCenter: {
    loading: false,
    error: "",
    requests: [],
    selectedId: "",
    detail: null,
    mode: "list",
    actionPending: "",
    filters: { status: "all", arenaMode: "all", region: "all", sort: "latest", scope: "all" },
    reports: [],
    reportStatus: "open",
    nextCursor: "",
    solveRequestId: "",
    solveRequestTitle: "",
    solveRequestRegion: "",
    solveWorkspace: null,
    solveDrafts: new Map(),
    startOnSelect: false,
  },
  battleResults: null,
};


const els = {
  characterGrid: document.querySelector("#characterGrid"),
  teamSlots: document.querySelector("#teamSlots"),
  resultPanel: document.querySelector("#resultPanel"),
  chargeChart: document.querySelector("#chargeChart"),
  lineupSlots: document.querySelector("#lineupSlots"),
  appVersion: document.querySelector("#appVersion"),
  teamPanelTitle: document.querySelector("#teamPanelTitle"),
  battlePowerStrip: document.querySelector(".battle-power-strip"),
  paidInferenceButton: document.querySelector("#paidInferenceButton"),
  paidCModeButton: document.querySelector("#paidCModeButton"),
  paidPModeButton: document.querySelector("#paidPModeButton"),
  teamShareButton: document.querySelector("#teamShareButton"),
  teamHelpButton: document.querySelector("#teamHelpButton"),
  saveTeamPresetButton: document.querySelector("#saveTeamPresetButton"),
  loadTeamPresetButton: document.querySelector("#loadTeamPresetButton"),
  clearTeamButton: document.querySelector("#clearTeamButton"),
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
  championDataButton: document.querySelector("#championDataButton"),
  helpCenterButton: document.querySelector("#helpCenterButton"),
  pveButton: document.querySelector("#pveButton"),
  adminPageButton: document.querySelector("#adminPageButton"),
  accountButton: document.querySelector("#accountButton"),
  sidebarSuggestionButton: document.querySelector("#sidebarSuggestionButton"),
  themeToggleButton: document.querySelector("#themeToggleButton"),
  languageToggleButton: document.querySelector("#languageToggleButton"),
  helpButton: document.querySelector("#helpButton"),
  mobileShareFab: document.querySelector("#mobileShareFab"),
  helpSolveModeBar: document.querySelector("#helpSolveModeBar"),
  helpSolveModeText: document.querySelector("#helpSolveModeText"),
  helpSolveCancelButton: document.querySelector("#helpSolveCancelButton"),
  helpSolveSubmitButton: document.querySelector("#helpSolveSubmitButton"),
  seasonDataFab: document.querySelector("#seasonDataFab"),
  ocrUploadButton: document.querySelector("#ocrUploadButton"),
  ocrUploadInput: document.querySelector("#ocrUploadInput"),
  announcementBar: document.querySelector("#announcementBar"),
  announcementTrack: document.querySelector("#announcementTrack"),
  announcementLevel: document.querySelector("#announcementLevel"),
  announcementText: document.querySelector("#announcementText"),
  announcementAction: document.querySelector("#announcementAction"),
  announcementCloseButton: document.querySelector("#announcementCloseButton"),
  toast: document.querySelector("#toast"),
  summaryStrip: document.querySelector("#summaryStrip"),
  sortSummary: document.querySelector("#sortSummary"),
  listCount: document.querySelector("#listCount"),
};

let draggedTeamIndex = null;
let draggedTeamKey = null;
let draggedPaidArenaRowIndex = null;
let draggedPaidArenaTeamKey = null;
let draggedLineupIndex = null;
let draggedPaidArenaLineupIndex = null;
let pointerTeamDrag = null;
let pointerPaidArenaRowDrag = null;
let characterDetailLongPress = null;
let isTeamSlotDragActive = false;
let suppressTeamSlotClick = false;
let suppressCharacterDetailClick = false;
let suppressLineupClick = false;
let characterDetailPanelDraft = null;
let characterDetailPanelSyncPromise = null;
let characterDetailPanelRegion = null;
let characterDetailPanelHasLocalEdits = false;
let resizeRenderId = null;
let openSlotSettings = null;
let openRosannaSacrificeSettings = null;
let isHelpModalOpen = false;
let isGuidedTourActive = false;
let guidedTourModulePromise = null;
let isSidebarOpen = false;
let featureHintSeenKeys = new Set();
let favoriteCharacterIds = new Set();
const localPaidInferenceState = {
  result: null,
  error: "",
  loading: false,
  requestSignature: "",
  refreshTimer: null,
};
const championDataState = {
  rows: null,
  rowsByFile: {},
  statsBySeasonSide: {},
  sourceSets: null,
  loading: false,
  loadingMode: "",
  error: "",
  cacheSignature: "",
  selectedServerRegion: "cn",
  selectedFile: "",
  selectedSeason: "",
  selectedModule: "matches",
  selectedStatSide: "combined",
  selectedStatRankType: "recommend",
  selectedMatchupTeamKey: "",
  expandedStatRound: null,
  selectedDivision: "champion",
  selectedGroup: "",
  selectedMatchNo: null,
  selectedPlayerName: "",
};
const championWinrateModelState = {
  model: null,
  loading: false,
  error: "",
  promise: null,
};
const attackRecommendationState = {
  contextKey: "",
  solutions: [],
  communityCount: 0,
  clicks: 0,
  selected: null,
  selectedIndex: -1,
  loading: false,
  error: "",
};


const TEAM_LABELS = {
  zh: {
    defense: "防守队",
    attack: "进攻队",
  },
  en: {
    defense: "Defense",
    attack: "Attack",
  },
};

function getTeamLabel(teamKey) {
  const labels = TEAM_LABELS[state?.language] || TEAM_LABELS.zh;
  return labels[teamKey] || TEAM_LABELS.zh[teamKey] || teamKey;
}

function sanitizeTeamPresetSlotId(raw) {
  const value = String(raw || "").trim();
  return value || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeTeamPresetRawSlot(rawSlots = []) {
  return Array.from({ length: TEAM_SIZE }, (_, index) => {
    const characterId = Number(rawSlots?.[index]);
    if (!Number.isFinite(characterId) || !getCharacterById(characterId)) return null;
    return characterId;
  });
}

function normalizeTeamPresetTeam(rawPreset = {}) {
  if (!rawPreset || typeof rawPreset !== "object") {
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      arenaMode: "normal",
      rowIndex: 0,
      teamKey: state.activeTeamKey,
      createdAt: Date.now(),
      team: Array(TEAM_SIZE).fill(null),
      chargeSpeeds: Array(TEAM_SIZE).fill(0),
      universalCharges: Array(TEAM_SIZE).fill(0),
      redHoodPierceCounts: Array(TEAM_SIZE).fill(0),
      scarletCounterEnabled: Array(TEAM_SIZE).fill(true),
      rosannaSacrificeFrames: Array(TEAM_SIZE).fill(null),
      cubeTypes: Array(TEAM_SIZE).fill(CUBE_TYPE_NONE),
      magazines: Array(TEAM_SIZE).fill(0),
      useArca: Array(TEAM_SIZE).fill(null),
      jackalLinks: {
        defense: {
          enabled: false,
          ownerId: null,
          targetIds: [],
        },
        attack: {
          enabled: false,
          ownerId: null,
          targetIds: [],
        },
      },
    };
  }
  const rawJackalLinks = rawPreset.jackalLinks || {};
  return {
    id: sanitizeTeamPresetSlotId(rawPreset.id),
    arenaMode: normalizePaidArenaMode(rawPreset.arenaMode),
    rowIndex: Math.max(0, Number(rawPreset.rowIndex) || 0),
    teamKey: normalizeTeamKey(rawPreset.teamKey),
    createdAt: Number.isFinite(Number(rawPreset.createdAt)) ? Number(rawPreset.createdAt) : Date.now(),
    team: normalizeTeamPresetRawSlot(rawPreset.team),
    chargeSpeeds: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(rawPreset.chargeSpeeds?.[index])),
    universalCharges: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(rawPreset.universalCharges?.[index])),
    redHoodPierceCounts: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(rawPreset.redHoodPierceCounts?.[index])),
    scarletCounterEnabled: Array.from(
      { length: TEAM_SIZE },
      (_, index) => sanitizeScarletCounterEnabled(rawPreset.scarletCounterEnabled?.[index]),
    ),
    rosannaSacrificeFrames: Array.from(
      { length: TEAM_SIZE },
      (_, index) => sanitizeSacrificeFrame(rawPreset.rosannaSacrificeFrames?.[index]),
    ),
    cubeTypes: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeCubeType(rawPreset.cubeTypes?.[index])),
    magazines: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeMagazine(rawPreset.magazines?.[index])),
    useArca: Array.from({length:TEAM_SIZE},(_,index)=>typeof rawPreset.useArca?.[index]==='boolean'?rawPreset.useArca[index]:null),
    jackalLinks: {
      defense: normalizeTeamPresetJackalLink(rawJackalLinks.defense),
      attack: normalizeTeamPresetJackalLink(rawJackalLinks.attack),
    },
  };
}

function serializeCurrentTeamAsPreset(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  const currentTeam = getTeamState(normalizedTeamKey);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    teamKey: normalizedTeamKey,
    createdAt: Date.now(),
    team: currentTeam.map((member) => member?.id || null),
    chargeSpeeds: [...getChargeSpeedState(normalizedTeamKey)],
    universalCharges: [...getUniversalChargeState(normalizedTeamKey)],
    redHoodPierceCounts: [...getRedHoodPierceCountState(normalizedTeamKey)],
    scarletCounterEnabled: [...getScarletCounterEnabledState(normalizedTeamKey)],
    rosannaSacrificeFrames: [...getRosannaSacrificeFrameState(normalizedTeamKey)],
    cubeTypes: currentTeam.map((member) => getSavedCharacterCubeType(member, normalizedTeamKey)),
    magazines: currentTeam.map((member) => getSavedCharacterMagazine(member, normalizedTeamKey)),
    useArca: currentTeam.map(member=>typeof member?.useArca==='boolean'?member.useArca:null),
    jackalLinks: {
      defense: { ...normalizeJackalLink("defense"), targetIds: [...normalizeJackalLink("defense").targetIds] },
      attack: { ...normalizeJackalLink("attack"), targetIds: [...normalizeJackalLink("attack").targetIds] },
    },
  };
}

function getActivePaidArenaPresetContext() {
  const mode = normalizePaidArenaMode(state.paidArenaMode);
  if (mode === "normal") return null;
  const teamKey = getPaidArenaDataTeamKey();
  const teams = getPaidArenaTeams(mode, teamKey);
  const rowIndex = Math.max(0, Math.min(teams.length - 1, Number(state.paidArenaActiveRowIndex) || 0));
  return { mode, teamKey, rowIndex, team: teams[rowIndex] || Array(TEAM_SIZE).fill(null) };
}

function serializeCurrentPaidArenaTeamAsPreset() {
  const context = getActivePaidArenaPresetContext();
  if (!context) return null;
  const { mode, teamKey, rowIndex, team } = context;
  const universalCharges = getPaidArenaUniversalCharges(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(0);
  const chargeSpeeds = getPaidArenaChargeSpeeds(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(0);
  const redHoodPierceCounts = getPaidArenaRedHoodPierceCounts(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(0);
  const scarletCounterEnabled = getPaidArenaScarletCounterEnabled(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(true);
  const rosannaSacrificeFrames = getPaidArenaRosannaSacrificeFrames(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(null);
  const jackalLink = normalizePaidArenaLinkForTeam(team, getPaidArenaJackalLinks(mode, teamKey)[rowIndex]);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    arenaMode: mode,
    rowIndex,
    teamKey,
    createdAt: Date.now(),
    team: team.map((member) => member?.id || null),
    chargeSpeeds: [...chargeSpeeds],
    universalCharges: [...universalCharges],
    redHoodPierceCounts: [...redHoodPierceCounts],
    scarletCounterEnabled: [...scarletCounterEnabled],
    rosannaSacrificeFrames: [...rosannaSacrificeFrames],
    cubeTypes: team.map((member) => getSavedCharacterCubeType(member, teamKey)),
    magazines: team.map((member) => getSavedCharacterMagazine(member, teamKey)),
    useArca: team.map(member=>typeof member?.useArca==='boolean'?member.useArca:null),
    jackalLinks: {
      defense: createEmptyJackalLinkState(),
      attack: createEmptyJackalLinkState(),
      [teamKey]: { ...jackalLink, targetIds: [...(jackalLink.targetIds || [])] },
    },
  };
}

function serializeCurrentTeamPreset() {
  if (isPaidArenaModeActive()) return serializeCurrentPaidArenaTeamAsPreset();
  return serializeCurrentTeamAsPreset(state.activeTeamKey);
}

function encodeTeamShareTeamIds(team = []) {
  return Array.from({ length: TEAM_SIZE }, (_, index) => team[index]?.id || team[index] || 0).join("-");
}

function decodeTeamShareTeamIds(value = "") {
  const ids = String(value || "").split("-");
  return Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(ids[index]) || null);
}

function encodeTeamShareSlotValues(values = [], encodeValue = (value) => String(value || 0)) {
  return Array.from({ length: TEAM_SIZE }, (_, index) => encodeValue(values[index], index)).join("-");
}

function decodeTeamShareSlotValues(value = "", decodeValue = (slot) => slot) {
  const slots = String(value || "").split("-");
  return Array.from({ length: TEAM_SIZE }, (_, index) => decodeValue(slots[index] ?? "", index));
}

function getCubeTypeId(cubeType = CUBE_TYPE_NONE) {
  const text = String(cubeType ?? "");
  if (/^\d+$/.test(text)) {
    const id = Number(text);
    return TEAM_CUBE_TYPE_BY_ID.has(String(id)) ? id : 0;
  }
  return TEAM_CUBE_ID_BY_TYPE.get(sanitizeCubeType(text)) || 0;
}

function getCubeTypeById(cubeId = 0) {
  return sanitizeCubeType(TEAM_CUBE_TYPE_BY_ID.get(String(Number(cubeId) || 0)) || CUBE_TYPE_NONE);
}

function encodeTeamShareCubeType(cubeType = CUBE_TYPE_NONE) {
  return String(getCubeTypeId(cubeType));
}

function decodeTeamShareCubeType(value = "0") {
  const text = String(value || "0");
  if (/^\d+$/.test(text)) return getCubeTypeById(text);
  return sanitizeCubeType(LEGACY_TEAM_CUBE_SHARE_TYPES_BY_CODE[text] || text);
}

function encodeTeamShareLink(link = {}) {
  const safeLink = normalizeTeamPresetJackalLink(link);
  if (!safeLink.enabled && !safeLink.ownerId && !safeLink.targetIds.length) return "";
  return [
    safeLink.enabled ? "1" : "0",
    safeLink.ownerId || "0",
    safeLink.targetIds.join(".") || "0",
  ].join("-");
}

function decodeTeamShareLink(value = "") {
  const [enabled, ownerId, targets] = String(value || "").split("-");
  const owner = ownerId && ownerId !== "0" ? getCharacterById(ownerId) : null;
  const targetIds = targets && targets !== "0"
    ? targets.split(".").map((id) => getCharacterById(id)?.id).filter(Boolean)
    : [];
  return normalizeTeamPresetJackalLink({
    enabled: enabled === "1",
    ownerId: owner?.id || null,
    targetIds,
  });
}

function hasTeamShareMembers(team = []) {
  return Array.from({ length: TEAM_SIZE }, (_, index) => Boolean(team[index])).some(Boolean);
}

function pushTeamShareArrayParam(params, key, values = [], hasValue, encodeValue) {
  if (!Array.from({ length: TEAM_SIZE }, (_, index) => values[index]).some(hasValue)) return;
  params.push([key, encodeTeamShareSlotValues(values, encodeValue)]);
}

function pushTeamShareSideRowParams(params, side, rowNumber, rowData = {}) {
  const team = rowData.team || [];
  if (hasTeamShareMembers(team)) params.push([`${side}team${rowNumber}`, encodeTeamShareTeamIds(team)]);
  pushTeamShareArrayParam(params, `${side}speed${rowNumber}`, rowData.chargeSpeeds, (value) => sanitizeChargeSpeed(value) > 0, sanitizeChargeSpeed);
  pushTeamShareArrayParam(params, `${side}charge${rowNumber}`, rowData.universalCharges, (value) => sanitizeUniversalCharge(value) > 0, sanitizeUniversalCharge);
  pushTeamShareArrayParam(params, `${side}pierce${rowNumber}`, rowData.redHoodPierceCounts, (value) => sanitizeRedHoodPierceCount(value) > 0, sanitizeRedHoodPierceCount);
  pushTeamShareArrayParam(params, `${side}counter${rowNumber}`, rowData.scarletCounterEnabled, (value) => value === false, (value) => value === false ? 0 : 1);
  pushTeamShareArrayParam(params, `${side}rosanna${rowNumber}`, rowData.rosannaSacrificeFrames, (value) => sanitizeSacrificeFrame(value) !== null, (value) => {
    const frame = sanitizeSacrificeFrame(value);
    return frame === null ? "x" : frame;
  });
  pushTeamShareArrayParam(params, `${side}cube${rowNumber}`, rowData.cubeTypes, (value) => sanitizeCubeType(value) !== CUBE_TYPE_NONE, encodeTeamShareCubeType);
  pushTeamShareArrayParam(params, `${side}magazine${rowNumber}`, rowData.magazines, (value) => Number(value) > 0,
    (value) => Number(value) > 0 ? sanitizeMagazine(value) : 0);
  const link = encodeTeamShareLink(rowData.jackalLink);
  if (link) params.push([`${side}link${rowNumber}`, link]);
}

function getTeamShareSideRowParams(params, side, rowNumber) {
  return {
    team: decodeTeamShareTeamIds(params.get(`${side}team${rowNumber}`) || ""),
    chargeSpeeds: params.has(`${side}speed${rowNumber}`) ? decodeTeamShareSlotValues(params.get(`${side}speed${rowNumber}`), sanitizeChargeSpeed) : Array(TEAM_SIZE).fill(0),
    universalCharges: params.has(`${side}charge${rowNumber}`) ? decodeTeamShareSlotValues(params.get(`${side}charge${rowNumber}`), sanitizeUniversalCharge) : Array(TEAM_SIZE).fill(0),
    redHoodPierceCounts: params.has(`${side}pierce${rowNumber}`) ? decodeTeamShareSlotValues(params.get(`${side}pierce${rowNumber}`), sanitizeRedHoodPierceCount) : Array(TEAM_SIZE).fill(0),
    scarletCounterEnabled: params.has(`${side}counter${rowNumber}`) ? decodeTeamShareSlotValues(params.get(`${side}counter${rowNumber}`), (slot) => slot !== "0") : Array(TEAM_SIZE).fill(true),
    rosannaSacrificeFrames: params.has(`${side}rosanna${rowNumber}`) ? decodeTeamShareSlotValues(params.get(`${side}rosanna${rowNumber}`), (slot) => slot === "x" || slot === "" ? null : sanitizeSacrificeFrame(slot)) : Array(TEAM_SIZE).fill(null),
    cubeTypes: params.has(`${side}cube${rowNumber}`) ? decodeTeamShareSlotValues(params.get(`${side}cube${rowNumber}`), decodeTeamShareCubeType) : Array(TEAM_SIZE).fill(CUBE_TYPE_NONE),
    magazines: params.has(`${side}magazine${rowNumber}`) ? decodeTeamShareSlotValues(params.get(`${side}magazine${rowNumber}`),
      (value) => Number(value) > 0 ? sanitizeMagazine(value) : 0) : Array(TEAM_SIZE).fill(0),
    jackalLink: params.has(`${side}link${rowNumber}`) ? decodeTeamShareLink(params.get(`${side}link${rowNumber}`)) : createEmptyJackalLinkState(),
  };
}

function getTeamShareModeForUrl() {
  const mode = normalizePaidArenaMode(state.paidArenaMode);
  return mode === "c" || mode === "p" ? mode : "n";
}

function getTeamShareModeFromUrl(value = "n") {
  return value === "c" || value === "p" ? value : "normal";
}

function getCurrentTeamShareParams() {
  const params = [];
  const modeCode = getTeamShareModeForUrl();
  params.push(["mode", modeCode]);
  params.push(["region", state.filters.region]);
  if (modeCode === "n") {
    pushTeamShareSideRowParams(params, "attack", 1, {
      team: state.team,
      chargeSpeeds: state.chargeSpeeds,
      universalCharges: state.universalCharges,
      redHoodPierceCounts: state.redHoodPierceCounts,
      scarletCounterEnabled: state.scarletCounterEnabled,
      rosannaSacrificeFrames: state.rosannaSacrificeFrames,
      cubeTypes: state.team.map((member) => getSavedCharacterCubeType(member, "attack")),
      magazines: state.team.map((member) => getSavedCharacterMagazine(member, "attack")),
      jackalLink: state.jackalLinks.attack,
    });
    pushTeamShareSideRowParams(params, "defence", 1, {
      team: state.defenseTeam,
      chargeSpeeds: state.defenseChargeSpeeds,
      universalCharges: state.defenseUniversalCharges,
      redHoodPierceCounts: state.defenseRedHoodPierceCounts,
      scarletCounterEnabled: state.defenseScarletCounterEnabled,
      rosannaSacrificeFrames: state.defenseRosannaSacrificeFrames,
      cubeTypes: state.defenseTeam.map((member) => getSavedCharacterCubeType(member, "defense")),
      magazines: state.defenseTeam.map((member) => getSavedCharacterMagazine(member, "defense")),
      jackalLink: state.jackalLinks.defense,
    });
    return params;
  }
  const mode = getTeamShareModeFromUrl(modeCode);
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  const attackRows = getPaidArenaTeams(mode, "attack");
  const defenseRows = getPaidArenaTeams(mode, "defense");
  const attackSpeeds = getPaidArenaChargeSpeeds(mode, "attack");
  const defenseSpeeds = getPaidArenaChargeSpeeds(mode, "defense");
  const attackCharges = getPaidArenaUniversalCharges(mode, "attack");
  const defenseCharges = getPaidArenaUniversalCharges(mode, "defense");
  const attackPierceCounts = getPaidArenaRedHoodPierceCounts(mode, "attack");
  const defensePierceCounts = getPaidArenaRedHoodPierceCounts(mode, "defense");
  const attackCounters = getPaidArenaScarletCounterEnabled(mode, "attack");
  const defenseCounters = getPaidArenaScarletCounterEnabled(mode, "defense");
  const attackSacrifices = getPaidArenaRosannaSacrificeFrames(mode, "attack");
  const defenseSacrifices = getPaidArenaRosannaSacrificeFrames(mode, "defense");
  const attackLinks = getPaidArenaJackalLinks(mode, "attack");
  const defenseLinks = getPaidArenaJackalLinks(mode, "defense");
  for (let index = 0; index < teamCount; index += 1) {
    const attackTeam = attackRows[index] || [];
    const defenseTeam = defenseRows[index] || [];
    pushTeamShareSideRowParams(params, "attack", index + 1, {
      team: attackTeam,
      chargeSpeeds: attackSpeeds[index],
      universalCharges: attackCharges[index],
      redHoodPierceCounts: attackPierceCounts[index],
      scarletCounterEnabled: attackCounters[index],
      rosannaSacrificeFrames: attackSacrifices[index],
      cubeTypes: attackTeam.map((member) => getSavedCharacterCubeType(member, "attack")),
      magazines: attackTeam.map((member) => getSavedCharacterMagazine(member, "attack")),
      jackalLink: attackLinks[index],
    });
    pushTeamShareSideRowParams(params, "defence", index + 1, {
      team: defenseTeam,
      chargeSpeeds: defenseSpeeds[index],
      universalCharges: defenseCharges[index],
      redHoodPierceCounts: defensePierceCounts[index],
      scarletCounterEnabled: defenseCounters[index],
      rosannaSacrificeFrames: defenseSacrifices[index],
      cubeTypes: defenseTeam.map((member) => getSavedCharacterCubeType(member, "defense")),
      magazines: defenseTeam.map((member) => getSavedCharacterMagazine(member, "defense")),
      jackalLink: defenseLinks[index],
    });
  }
  return params;
}

function getCurrentTeamShareUrl() {
  const shareParams = getCurrentTeamShareParams();
  if (!shareParams.some(([key]) => key !== "mode" && key !== "region")) return "";
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("v");
  url.searchParams.delete("v2phase");
  url.searchParams.delete("region");
  clearTeamShareParams(url.searchParams);
  const existingSearch = url.searchParams.toString();
  const shareSearch = shareParams.map(([key, value]) => `${key}=${value}`).join("&");
  return `${url.origin}${url.pathname}${existingSearch ? `?${existingSearch}&${shareSearch}` : `?${shareSearch}`}`;
}

function clearTeamShareParams(params) {
  params.delete("mode");
  params.delete(TEAM_SHARE_URL_PARAM);
  const suffixes = ["team", "speed", "charge", "pierce", "counter", "rosanna", "cube", "magazine", "link"];
  for (let index = 1; index <= PAID_ARENA_TEAM_COUNTS.c; index += 1) {
    suffixes.forEach((suffix) => {
      params.delete(`attack${suffix}${index}`);
      params.delete(`defence${suffix}${index}`);
    });
  }
}

function getTeamShareTeamParam(params, side, index) {
  return params.get(`${side}team${index}`) || "";
}

function hasTeamShareParams(params) {
  if (!params.has("mode")) return false;
  for (let index = 1; index <= PAID_ARENA_TEAM_COUNTS.c; index += 1) {
    if (getTeamShareTeamParam(params, "attack", index) || getTeamShareTeamParam(params, "defence", index)) return true;
  }
  return false;
}

function clearTeamShareUrlParamFromLocation() {
  if (!window.history?.replaceState) return;
  const url = new URL(window.location.href);
  if (!hasTeamShareParams(url.searchParams) && !url.searchParams.has(TEAM_SHARE_URL_PARAM)) return;
  clearTeamShareParams(url.searchParams);
  window.history.replaceState(null, document.title, `${url.pathname}${url.search}${url.hash}`);
}

function applyTeamSharePresetFromLocation() {
  const params = new URLSearchParams(window.location.search);
  if (!hasTeamShareParams(params)) return false;
  const mode = getTeamShareModeFromUrl(params.get("mode"));
  if (["cn", "global"].includes(params.get("region"))) state.filters.region = params.get("region");
  clearTeamShareUrlParamFromLocation();
  if (mode === "normal") {
    const attackRow = getTeamShareSideRowParams(params, "attack", 1);
    const defenseRow = getTeamShareSideRowParams(params, "defence", 1);
    state.paidArenaMode = "normal";
    state.team = attackRow.team;
    state.defenseTeam = defenseRow.team;
    state.chargeSpeeds = attackRow.chargeSpeeds;
    state.defenseChargeSpeeds = defenseRow.chargeSpeeds;
    state.universalCharges = attackRow.universalCharges;
    state.defenseUniversalCharges = defenseRow.universalCharges;
    state.redHoodPierceCounts = attackRow.redHoodPierceCounts;
    state.defenseRedHoodPierceCounts = defenseRow.redHoodPierceCounts;
    state.scarletCounterEnabled = attackRow.scarletCounterEnabled;
    state.defenseScarletCounterEnabled = defenseRow.scarletCounterEnabled;
    state.rosannaSacrificeFrames = attackRow.rosannaSacrificeFrames;
    state.defenseRosannaSacrificeFrames = defenseRow.rosannaSacrificeFrames;
    state.jackalLinks = {
      defense: defenseRow.jackalLink,
      attack: attackRow.jackalLink,
    };
    attackRow.team.forEach((character, index) => {
      saveCharacterCubeType(character, attackRow.cubeTypes[index], "attack");
      if (character && attackRow.magazines[index] > 0) saveCharacterMagazine(character, attackRow.magazines[index], "attack");
      if (character) saveCharacterChargeSpeed(character, attackRow.chargeSpeeds[index], "attack");
      if (isRedHood(character)) saveCharacterRedHoodPierceCount(character, attackRow.redHoodPierceCounts[index], "attack");
    });
    defenseRow.team.forEach((character, index) => {
      saveCharacterCubeType(character, defenseRow.cubeTypes[index], "defense");
      if (character && defenseRow.magazines[index] > 0) saveCharacterMagazine(character, defenseRow.magazines[index], "defense");
      if (character) saveCharacterChargeSpeed(character, defenseRow.chargeSpeeds[index], "defense");
      if (isRedHood(character)) saveCharacterRedHoodPierceCount(character, defenseRow.redHoodPierceCounts[index], "defense");
    });
    setActiveTeam("defense");
  } else {
    const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
    state.paidArenaMode = mode;
    state.paidArenaDataTeamKey = "attack";
    state.paidArenaActiveRowIndex = 0;
    state.paidArenaTeams[mode] = createEmptyPaidArenaTeamsBySide(mode);
    state.paidArenaUniversalCharges[mode] = createEmptyPaidArenaUniversalChargesBySide(mode);
    state.paidArenaChargeSpeeds[mode] = createEmptyPaidArenaChargeSpeedsBySide(mode);
    state.paidArenaRosannaSacrificeFrames[mode] = createEmptyPaidArenaRosannaSacrificeFramesBySide(mode);
    state.paidArenaRedHoodPierceCounts[mode] = createEmptyPaidArenaRedHoodPierceCountsBySide(mode);
    state.paidArenaScarletCounterEnabled[mode] = createEmptyPaidArenaScarletCounterEnabledBySide(mode);
    state.paidArenaJackalLinks[mode] = createEmptyPaidArenaJackalLinksBySide(mode);
    for (let index = 0; index < teamCount; index += 1) {
      const attackRow = getTeamShareSideRowParams(params, "attack", index + 1);
      const defenseRow = getTeamShareSideRowParams(params, "defence", index + 1);
      state.paidArenaTeams[mode].attack[index] = attackRow.team;
      state.paidArenaTeams[mode].defense[index] = defenseRow.team;
      state.paidArenaChargeSpeeds[mode].attack[index] = attackRow.chargeSpeeds;
      state.paidArenaChargeSpeeds[mode].defense[index] = defenseRow.chargeSpeeds;
      state.paidArenaUniversalCharges[mode].attack[index] = attackRow.universalCharges;
      state.paidArenaUniversalCharges[mode].defense[index] = defenseRow.universalCharges;
      state.paidArenaRedHoodPierceCounts[mode].attack[index] = attackRow.redHoodPierceCounts;
      state.paidArenaRedHoodPierceCounts[mode].defense[index] = defenseRow.redHoodPierceCounts;
      state.paidArenaScarletCounterEnabled[mode].attack[index] = attackRow.scarletCounterEnabled;
      state.paidArenaScarletCounterEnabled[mode].defense[index] = defenseRow.scarletCounterEnabled;
      state.paidArenaRosannaSacrificeFrames[mode].attack[index] = attackRow.rosannaSacrificeFrames;
      state.paidArenaRosannaSacrificeFrames[mode].defense[index] = defenseRow.rosannaSacrificeFrames;
      state.paidArenaJackalLinks[mode].attack[index] = normalizePaidArenaLinkForTeam(attackRow.team, attackRow.jackalLink);
      state.paidArenaJackalLinks[mode].defense[index] = normalizePaidArenaLinkForTeam(defenseRow.team, defenseRow.jackalLink);
      attackRow.team.forEach((character, slotIndex) => {
        saveCharacterCubeType(character, attackRow.cubeTypes[slotIndex], "attack");
        if (character && attackRow.magazines[slotIndex] > 0) saveCharacterMagazine(character, attackRow.magazines[slotIndex], "attack");
        if (character) saveCharacterChargeSpeed(character, attackRow.chargeSpeeds[slotIndex], "attack");
        if (isRedHood(character)) saveCharacterRedHoodPierceCount(character, attackRow.redHoodPierceCounts[slotIndex], "attack");
      });
      defenseRow.team.forEach((character, slotIndex) => {
        saveCharacterCubeType(character, defenseRow.cubeTypes[slotIndex], "defense");
        if (character && defenseRow.magazines[slotIndex] > 0) saveCharacterMagazine(character, defenseRow.magazines[slotIndex], "defense");
        if (character) saveCharacterChargeSpeed(character, defenseRow.chargeSpeeds[slotIndex], "defense");
        if (isRedHood(character)) saveCharacterRedHoodPierceCount(character, defenseRow.redHoodPierceCounts[slotIndex], "defense");
      });
    }
  }
  saveTeam();
  showToast(localize("\u5df2\u8bfb\u53d6\u5206\u4eab\u961f\u4f0d", "Shared team loaded"));
  return true;
}

function normalizeHelpCenterRequestId(value) {
  const text = String(value || "").trim();
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(text)) return "";
  return text;
}

function captureHelpCenterRequestIdFromLocation() {
  try {
    const url = new URL(window.location.href);
    capturedHelpCenterRequestIdOnLoad = normalizeHelpCenterRequestId(url.searchParams.get(HELP_CENTER_SHARE_URL_PARAM));
    capturedRecommendationGuideIdOnLoad = normalizeHelpCenterRequestId(url.searchParams.get(RECOMMENDATION_SHARE_URL_PARAM));
    return capturedHelpCenterRequestIdOnLoad;
  } catch {
    capturedHelpCenterRequestIdOnLoad = "";
    capturedRecommendationGuideIdOnLoad = "";
    return "";
  }
}

function getArenaShareFallbackText(baseText = getArenaCopyText()) {
  const shareUrl = getCurrentTeamShareUrl();
  return [baseText, shareUrl].filter(Boolean).join("\n\n");
}

function normalizeTeamPresetJackalLink(link = {}) {
  return {
    enabled: Boolean(link?.enabled),
    ownerId: link?.ownerId || null,
    targetIds: Array.isArray(link?.targetIds) ? Array.from(new Set(link.targetIds.filter((id) => Boolean(getCharacterById(id))))) : [],
  };
}

function normalizeTeamPresetsFromStorage(rawPresets) {
  if (!Array.isArray(rawPresets)) return [];
  return rawPresets.map(normalizeTeamPresetTeam).filter(Boolean);
}

function loadTeamPresetsFromStorage() {
  const raw = localStorage.getItem(TEAM_PRESETS_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return normalizeTeamPresetsFromStorage(Array.isArray(parsed) ? parsed : parsed?.presets);
  } catch {
    return [];
  }
}

function saveTeamPresetsToStorage() {
  localStorage.setItem(TEAM_PRESETS_STORAGE_KEY, JSON.stringify(state.teamPresets));
}

function getTeamPresetUniqueKey(preset = {}) {
  const safePreset = normalizeTeamPresetTeam(preset);
  const linkBySide = {
    defense: normalizeTeamPresetJackalLink(safePreset.jackalLinks?.defense),
    attack: normalizeTeamPresetJackalLink(safePreset.jackalLinks?.attack),
  };
  return JSON.stringify({
    team: safePreset.team,
    chargeSpeeds: safePreset.chargeSpeeds,
    universalCharges: safePreset.universalCharges,
    redHoodPierceCounts: safePreset.redHoodPierceCounts,
    scarletCounterEnabled: safePreset.scarletCounterEnabled,
    rosannaSacrificeFrames: safePreset.rosannaSacrificeFrames,
    cubeTypes: safePreset.cubeTypes,
    magazines: safePreset.magazines,
    jackalLinks: {
      defense: {
        enabled: linkBySide.defense.enabled,
        ownerId: linkBySide.defense.ownerId,
        targetIds: [...linkBySide.defense.targetIds].sort(),
      },
      attack: {
        enabled: linkBySide.attack.enabled,
        ownerId: linkBySide.attack.ownerId,
        targetIds: [...linkBySide.attack.targetIds].sort(),
      },
    },
  });
}

function hasTeamPresetContent(preset = {}) {
  const safePreset = normalizeTeamPresetTeam(preset);
  return (
    safePreset.team.some((characterId) => Boolean(characterId)) ||
    safePreset.universalCharges.some((charge) => sanitizeUniversalCharge(charge) > 0)
  );
}

function applyTeamPresetToTeamState(teamKey, preset = {}) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  const safePreset = normalizeTeamPresetTeam(preset);
  const teamState = getTeamState(normalizedTeamKey);
  const chargeSpeeds = getChargeSpeedState(normalizedTeamKey);
  const universalCharges = getUniversalChargeState(normalizedTeamKey);
  const redHoodPierceCounts = getRedHoodPierceCountState(normalizedTeamKey);
  const scarletCounterEnabled = getScarletCounterEnabledState(normalizedTeamKey);
  const rosannaSacrificeFrames = getRosannaSacrificeFrameState(normalizedTeamKey);

  for (let index = 0; index < TEAM_SIZE; index += 1) {
    const characterId = safePreset.team[index];
    const character = getCharacterById(characterId);
    teamState[index] = character&&typeof safePreset.useArca?.[index]==='boolean'?{...character,useArca:safePreset.useArca[index]}:character;
    chargeSpeeds[index] = safePreset.chargeSpeeds[index] || 0;
    saveCharacterCubeType(character, safePreset.cubeTypes[index] || CUBE_TYPE_NONE, normalizedTeamKey);
    if (character && safePreset.magazines[index] > 0) {
      saveCharacterMagazine(character, safePreset.magazines[index], normalizedTeamKey);
    }
    universalCharges[index] = safePreset.universalCharges[index] || 0;
    redHoodPierceCounts[index] = isRedHood(character) ? safePreset.redHoodPierceCounts[index] || 0 : 0;
    scarletCounterEnabled[index] = safePreset.scarletCounterEnabled[index] !== false;
    rosannaSacrificeFrames[index] = safePreset.rosannaSacrificeFrames[index];
    if (character) {
      saveCharacterChargeSpeed(character, chargeSpeeds[index], normalizedTeamKey);
      if (isRedHood(character)) {
        saveCharacterRedHoodPierceCount(character, redHoodPierceCounts[index], normalizedTeamKey);
      }
    }
  }
  state.jackalLinks[normalizedTeamKey] = {
    ...safePreset.jackalLinks[normalizedTeamKey],
    targetIds: [...(safePreset.jackalLinks[normalizedTeamKey]?.targetIds || [])],
  };
  normalizeJackalLinks();
}

function applyTeamPresetToPaidArenaActiveRow(preset = {}) {
  const context = getActivePaidArenaPresetContext();
  if (!context) return false;
  const { mode, teamKey, rowIndex } = context;
  const safePreset = normalizeTeamPresetTeam(preset);
  const teams = getPaidArenaTeams(mode, teamKey);
  const chargeSpeeds = getPaidArenaChargeSpeeds(mode, teamKey);
  const universalCharges = getPaidArenaUniversalCharges(mode, teamKey);
  const redHoodPierceCounts = getPaidArenaRedHoodPierceCounts(mode, teamKey);
  const scarletCounterEnabled = getPaidArenaScarletCounterEnabled(mode, teamKey);
  const rosannaSacrificeFrames = getPaidArenaRosannaSacrificeFrames(mode, teamKey);
  const jackalLinks = getPaidArenaJackalLinks(mode, teamKey);

  teams[rowIndex] = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(safePreset.team[index]));
  chargeSpeeds[rowIndex] = Array.from({ length: TEAM_SIZE }, (_, index) => safePreset.chargeSpeeds[index] || 0);
  universalCharges[rowIndex] = Array.from({ length: TEAM_SIZE }, (_, index) => safePreset.universalCharges[index] || 0);
  redHoodPierceCounts[rowIndex] = Array.from({ length: TEAM_SIZE }, (_, index) => {
    const character = teams[rowIndex][index];
    return isRedHood(character) ? safePreset.redHoodPierceCounts[index] || 0 : 0;
  });
  scarletCounterEnabled[rowIndex] = Array.from(
    { length: TEAM_SIZE },
    (_, index) => safePreset.scarletCounterEnabled[index] !== false,
  );
  rosannaSacrificeFrames[rowIndex] = Array.from({ length: TEAM_SIZE }, (_, index) => safePreset.rosannaSacrificeFrames[index]);

  const rowTeam = teams[rowIndex];
  for (let index = 0; index < TEAM_SIZE; index += 1) {
    if(rowTeam[index])rowTeam[index]={...rowTeam[index],useArca:typeof safePreset.useArca?.[index]==='boolean'?safePreset.useArca[index]:undefined};
    const character = rowTeam[index];
    saveCharacterCubeType(character, safePreset.cubeTypes[index] || CUBE_TYPE_NONE, teamKey);
    if (character && safePreset.magazines[index] > 0) {
      saveCharacterMagazine(character, safePreset.magazines[index], teamKey);
    }
    if (character) {
      saveCharacterChargeSpeed(character, chargeSpeeds[rowIndex][index], teamKey);
      if (isRedHood(character)) {
        saveCharacterRedHoodPierceCount(character, redHoodPierceCounts[rowIndex][index], teamKey);
      }
    }
  }

  jackalLinks[rowIndex] = normalizePaidArenaLinkForTeam(rowTeam, safePreset.jackalLinks[teamKey]);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  return true;
}

function saveCurrentTeamPreset() {
  const preset = serializeCurrentTeamPreset();
  if (!preset) return;
  const normalizedPreset = normalizeTeamPresetTeam(preset);
  if (!hasTeamPresetContent(normalizedPreset)) {
    showToast(localize("空队伍不能保存", "Empty teams cannot be saved"));
    return;
  }
  const candidateTeamKey = getTeamPresetUniqueKey(normalizedPreset);
  const hasSameTeam = state.teamPresets.some((entry) => getTeamPresetUniqueKey(entry) === candidateTeamKey);
  const ui = getCurrentLanguageText();
  if (hasSameTeam) {
    showToast(ui.teamPresetDuplicateNotice || localize("队伍已经存在", "Team already exists"));
    return;
  }
  state.teamPresets.unshift(normalizedPreset);
  saveTeamPresetsToStorage();
  saveTeam();
  showToast(ui.teamPresetSavedToast || localize("队伍快照已保存", "Team snapshot saved"));
}

function deleteTeamPreset(presetId) {
  const targetId = String(presetId || "");
  const before = state.teamPresets.length;
  state.teamPresets = state.teamPresets.filter((preset) => String(preset?.id) !== targetId);
  if (state.teamPresets.length !== before) {
    saveTeamPresetsToStorage();
    const ui = getCurrentLanguageText();
    showToast(ui.teamPresetDeletedToast || localize("快照已删除", "Snapshot deleted"));
    return true;
  }
  return false;
}

function loadTeamPresetById(presetId, targetTeamKey = state.activeTeamKey) {
  const preset = state.teamPresets.find((entry) => String(entry?.id) === String(presetId));
  if (!preset) {
    showToast(localize("读取的队伍快照不存在", "Saved team snapshot not found"));
    return false;
  }
  const destination = isPaidArenaModeActive() ? getPaidArenaDataTeamKey() : targetTeamKey;
  if (isHelpCenterLockedDefenseSide(destination)) {
    showHelpCenterLockedDefenseToast();
    return false;
  }
  if (isPaidArenaModeActive()) {
    if (!applyTeamPresetToPaidArenaActiveRow(preset)) return false;
  } else {
    applyTeamPresetToTeamState(targetTeamKey, preset);
  }
  saveTeam();
  render();
  const ui = getCurrentLanguageText();
  showToast(ui.teamPresetLoadedToast || localize("队伍已读取", "Team loaded"));
  return true;
}

let teamPresetUiModulePromise = null;
let teamPresetUiModuleInstance = null;

function getTeamPresetUiApi() {
  return {
    state,
    teamSize: TEAM_SIZE,
    getCurrentLanguageText,
    localize,
    escapeHtml,
    normalizeTeamPresetTeam,
    normalizeTeamPresetRawSlot,
    getCharacterById,
    getTeamSlotRarityClass,
    normalizeTeamKey,
    sanitizeChargeSpeed,
    sanitizeUniversalCharge,
    sanitizeCubeType,
    sanitizeMagazine,
    getCubeIconSrc,
    getEffectiveLinkOwnerForTeam,
    isEffectiveLinkEnabledForTeam,
    getAutoFullTeamLinkOwner,
    getEffectiveLinkTargetIdsForTeam,
    isLinkProvider,
    isJackal,
    isRedHood,
    isScarlet,
    isRosanna,
    sanitizeRedHoodPierceCount,
    sanitizeScarletCounterEnabled,
    sanitizeSacrificeFrame,
    canEditChargeSpeed,
    formatChargeNumber,
    getCharacterLocalizedName,
    getAvatarMarkup,
    getSacrificeMarkMarkup,
    deleteTeamPreset,
    loadTeamPresetById,
  };
}

async function loadTeamPresetUiModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!teamPresetUiModulePromise) {
    teamPresetUiModulePromise = runtime.loadAppModule("team-preset-ui", () => importAppModule("./modules/team-preset-ui.js"));
  }
  const module = await teamPresetUiModulePromise;
  teamPresetUiModuleInstance = module;
  module.setTeamPresetUiApi(getTeamPresetUiApi());
  return module;
}

function openTeamPresetModal() {
  void loadTeamPresetUiModule()
    .then((module) => module.openTeamPresetModal())
    .catch((error) => {
      console.warn("[TeamPreset] ui module failed", error);
      showToast(localize("\u961f\u4f0d\u5feb\u7167\u754c\u9762\u52a0\u8f7d\u5931\u8d25", "Failed to load team snapshots."));
    });
}

function closeTeamPresetModal() {
  if (teamPresetUiModuleInstance?.closeTeamPresetModal) {
    teamPresetUiModuleInstance.closeTeamPresetModal();
    return;
  }
  document.querySelector(".team-preset-backdrop")?.remove();
}

function normalizeLanguage(language = "zh") {
  return language === "en" ? "en" : "zh";
}

function getBrowserPreferredLanguage() {
  try {
    const candidates = Array.isArray(navigator?.languages) && navigator.languages.length ? navigator.languages : [navigator?.language];
    for (const candidate of candidates) {
      const normalized = String(candidate || "").toLowerCase();
      if (!normalized) continue;
      if (normalized === "zh" || normalized.startsWith("zh-")) return "zh";
      return "en";
    }
  } catch {
    // ignore and fallback below
  }
  return "zh";
}

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage) return normalizeLanguage(storedLanguage);
  return getBrowserPreferredLanguage();
}

function getCurrentLanguageText() {
  return UI_TEXTS[normalizeLanguage(state.language)] || UI_TEXTS.zh;
}

function isEnglishLanguage() {
  return normalizeLanguage(state.language) === "en";
}

function isChineseLanguage() {
  return normalizeLanguage(state.language) === "zh";
}

function loadFeatureHintSeenKeys() {
  try {
    const raw = JSON.parse(localStorage.getItem(FEATURE_HINT_STORAGE_KEY) || "[]");
    featureHintSeenKeys = new Set(Array.isArray(raw) ? raw.map((entry) => String(entry || "")) : []);
  } catch {
    featureHintSeenKeys = new Set();
  }
}

function saveFeatureHintSeenKeys() {
  localStorage.setItem(FEATURE_HINT_STORAGE_KEY, JSON.stringify([...featureHintSeenKeys]));
}

function normalizeFavoriteCharacterId(value) {
  const raw = value && typeof value === "object" ? value.id : value;
  const numericId = Number(raw);
  if (Number.isFinite(numericId) && numericId > 0) return String(Math.trunc(numericId));
  return String(raw || "").trim();
}

function loadFavoriteCharacters() {
  try {
    const raw = JSON.parse(localStorage.getItem(FAVORITE_CHARACTERS_STORAGE_KEY) || "[]");
    favoriteCharacterIds = new Set(
      Array.isArray(raw)
        ? raw.map(normalizeFavoriteCharacterId).filter(Boolean)
        : [],
    );
  } catch {
    favoriteCharacterIds = new Set();
  }
}

function saveFavoriteCharacters() {
  localStorage.setItem(FAVORITE_CHARACTERS_STORAGE_KEY, JSON.stringify([...favoriteCharacterIds]));
}

function isFavoriteCharacter(character) {
  return favoriteCharacterIds.has(normalizeFavoriteCharacterId(character));
}

function setFavoriteCharacter(character, shouldFavorite) {
  const characterId = normalizeFavoriteCharacterId(character);
  if (!characterId) return false;
  if (shouldFavorite) favoriteCharacterIds.add(characterId);
  else favoriteCharacterIds.delete(characterId);
  saveFavoriteCharacters();
  return favoriteCharacterIds.has(characterId);
}

function toggleFavoriteCharacter(character) {
  return setFavoriteCharacter(character, !isFavoriteCharacter(character));
}

function markFeatureHintSeen(key) {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey || featureHintSeenKeys.has(normalizedKey)) return;
  featureHintSeenKeys.add(normalizedKey);
  saveFeatureHintSeenKeys();
  renderFeatureHintBadges();
}

function createFeatureHintBadge(hint) {
  const badge = document.createElement("span");
  badge.className = "feature-new-badge";
  badge.dataset.featureHintBadge = hint.key;
  badge.textContent = isEnglishLanguage() ? hint.textEn : hint.textZh;
  badge.setAttribute("aria-label", isEnglishLanguage() ? hint.titleEn : hint.titleZh);
  badge.title = isEnglishLanguage() ? hint.titleEn : hint.titleZh;
  return badge;
}

function renderFeatureHintBadges() {
  document.querySelectorAll("[data-feature-hint-badge]").forEach((badge) => badge.remove());
  FEATURE_HINTS.forEach((hint) => {
    const target = document.getElementById(hint.elementId);
    if (!target) return;
    target.classList.toggle("has-feature-new-badge", !featureHintSeenKeys.has(hint.key));
    if (featureHintSeenKeys.has(hint.key)) return;
    target.append(createFeatureHintBadge(hint));
  });
}

function markFeatureHintSeenByElementId(elementId) {
  FEATURE_HINTS
    .filter((hint) => hint.elementId === elementId)
    .forEach((hint) => markFeatureHintSeen(hint.key));
}

function renderFeatureTouchCard(key, title, description) {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey || featureHintSeenKeys.has(normalizedKey)) return "";
  return `
    <aside class="feature-touch-card" data-feature-touch-card="${escapeHtml(normalizedKey)}">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(description)}</p>
      </div>
      <button type="button" data-feature-touch-dismiss="${escapeHtml(normalizedKey)}">${escapeHtml(localize("\u77e5\u9053\u4e86", "Got it"))}</button>
    </aside>
  `;
}

function bindFeatureTouchCards(root = document) {
  root.querySelectorAll("[data-feature-touch-dismiss]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.featureTouchDismiss || "";
      markFeatureHintSeen(key);
      button.closest("[data-feature-touch-card]")?.remove();
    });
  });
}

function localize(zhText, enText) {
  return isEnglishLanguage() ? enText : zhText;
}

let announcementBarModulePromise = null;
let announcementBarModuleInstance = null;

function getAnnouncementBarApi() {
  return {
    els,
    storageKey: ANNOUNCEMENT_DISMISSED_STORAGE_KEY,
    localize,
    isEnglishLanguage,
    openSuggestionModal,
  };
}

async function loadAnnouncementBarModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!announcementBarModulePromise) {
    announcementBarModulePromise = runtime.loadAppModule("announcement-bar", () => importAppModule("./modules/announcement-bar.js"));
  }
  const module = await announcementBarModulePromise;
  announcementBarModuleInstance = module;
  module.setAnnouncementBarApi(getAnnouncementBarApi());
  return module;
}

function loadAnnouncementBar() {
  void loadAnnouncementBarModule()
    .then((module) => module.loadAnnouncementBar())
    .catch((error) => console.warn("[Announcement] module failed", error));
}

function dismissAnnouncementBar() {
  if (announcementBarModuleInstance?.dismissAnnouncementBar) {
    announcementBarModuleInstance.dismissAnnouncementBar();
    return;
  }
  void loadAnnouncementBarModule().then((module) => module.dismissAnnouncementBar());
}

function handleAnnouncementAction() {
  if (announcementBarModuleInstance?.handleAnnouncementAction) {
    announcementBarModuleInstance.handleAnnouncementAction();
    return;
  }
  void loadAnnouncementBarModule().then((module) => module.handleAnnouncementAction());
}

function syncAnnouncementBar() {
  if (announcementBarModuleInstance?.syncAnnouncementBar) {
    announcementBarModuleInstance.syncAnnouncementBar();
  }
}

function getCharacterLocalizedName(character) {
  if (!character) return "";
  return isEnglishLanguage() && character.enName ? character.enName : character.name;
}

function getLocalizedCharacterNameByName(name) {
  const rawName = String(name || "");
  if (!rawName || !isEnglishLanguage()) return rawName;
  const characterList = (() => {
    try {
      if (Array.isArray(CHARACTERS)) return CHARACTERS;
    } catch {
      // Fallback below.
    }
    return Array.isArray(globalThis.CHARACTERS) ? globalThis.CHARACTERS : [];
  })();
  const matchedCharacter = characterList.find(
    (character) => character && (character.name === rawName || character.enName === rawName || character.slug === rawName),
  );
  return matchedCharacter?.enName || rawName;
}

function getLocalizedContributionCharacterName(contribution) {
  if (!contribution) return "";
  const character = getCharacterById(contribution.characterId);
  if (character) return getCharacterLocalizedName(character);
  return getLocalizedCharacterNameByName(contribution.characterName);
}

function applyLanguage(language) {
  state.language = normalizeLanguage(language);
  const ui = getCurrentLanguageText();
  document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";
  document.documentElement.dataset.language = state.language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
  document.title = ui.appTitle;

  if (els.sidebarMenuButton) {
    els.sidebarMenuButton.setAttribute("aria-label", ui.sidebarMenuButtonLabel);
    els.sidebarMenuButton.setAttribute("title", ui.sidebarMenuButtonTitle);
  }
  if (els.sidebarCloseButton) {
    els.sidebarCloseButton.setAttribute("aria-label", ui.sidebarCloseButtonLabel);
  }
  if (els.changelogButton) {
    els.changelogButton.textContent = ui.changelogLabel;
  }
  if (els.sidebarHelpButton) {
    els.sidebarHelpButton.textContent = ui.helpLabel;
  }
  if (els.championDataButton) {
    els.championDataButton.textContent = ui.championDataLabel;
  }
  if (els.helpCenterButton) {
    els.helpCenterButton.textContent = isEnglishLanguage() ? "Solutions" : "解题";
  }
  if (els.pveButton) {
    els.pveButton.textContent = ui.pveLabel;
  }
  if (els.accountButton) {
    els.accountButton.textContent = getAccountButtonText();
    els.accountButton.setAttribute("aria-label", ui.accountLabel || localize("账号", "Account"));
    els.accountButton.setAttribute("title", ui.accountLabel || localize("账号", "Account"));
    syncAccountFeatureVisibility();
  }
  if (els.sidebarSuggestionButton) {
    els.sidebarSuggestionButton.textContent = ui.suggestionLabel;
  }
  if (els.themeToggleButton) {
    const isLightTheme = document.documentElement.dataset.theme === "light";
    els.themeToggleButton.setAttribute("aria-label", isLightTheme ? ui.themeToggleDarkLabel : ui.themeToggleLightLabel);
    els.themeToggleButton.setAttribute("title", isLightTheme ? ui.themeToggleDarkLabel : ui.themeToggleLightLabel);
  }
  if (els.languageToggleButton) {
    els.languageToggleButton.textContent = ui.languageButtonText;
    const nextLabel = state.language === "zh" ? ui.languageLabelToEn : ui.languageLabelToZh;
    els.languageToggleButton.setAttribute("aria-label", nextLabel);
    els.languageToggleButton.setAttribute("title", nextLabel);
  }
  syncAnnouncementBar();
  if (els.paidInferenceButton) els.paidInferenceButton.setAttribute("title", ui.paidInference);
  if (els.paidCModeButton) els.paidCModeButton.setAttribute("title", ui.paidCMode);
  if (els.paidPModeButton) els.paidPModeButton.setAttribute("title", ui.paidPMode);
  els.paidInferenceButton?.querySelector(".team-action-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "Test" : "测试"));
  els.paidCModeButton?.querySelector(".team-action-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "C" : "冠军"));
  els.paidPModeButton?.querySelector(".team-action-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "P" : "特殊"));
  const missShotLabel = els.allowMissedShotsToggle?.closest("label");
  if (missShotLabel) {
    missShotLabel.setAttribute("aria-label", ui.missShotToggle);
    missShotLabel.setAttribute("title", ui.missShotToggle);
    missShotLabel.querySelector(".team-action-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "Miss" : "空枪"));
  }
  els.teamShareButton?.querySelector(".team-action-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "Share" : "分享"));
  if (els.saveTeamPresetButton) {
    els.saveTeamPresetButton.querySelector(".team-action-text")?.replaceChildren(
      document.createTextNode(ui.saveTeamPreset || (isEnglishLanguage() ? "Save" : "保存")),
    );
  }
  if (els.loadTeamPresetButton) {
    els.loadTeamPresetButton.querySelector(".team-action-text")?.replaceChildren(
      document.createTextNode(ui.loadTeamPreset || (isEnglishLanguage() ? "Load" : "读取")),
    );
  }
  els.swapTeamButton?.querySelector(".team-action-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "Swap" : "交换"));
  els.clearTeamButton?.querySelector(".team-action-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "Clear" : "清除"));
  els.commonToggle?.closest("label")?.querySelector("span")?.replaceChildren(document.createTextNode(ui.filterCommon));
  els.regionToggle?.closest("label")?.querySelector("span")?.replaceChildren(document.createTextNode(ui.filterRegionCN));
  els.mobileShareFab?.querySelector(".share-fab-text")?.replaceChildren(document.createTextNode(ui.shareButton));
  els.ocrUploadButton?.querySelector(".share-fab-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "OCR" : "识别"));
  if (els.mobileShareFab) {
    els.mobileShareFab.setAttribute("aria-label", ui.shareButton);
    els.mobileShareFab.setAttribute("title", ui.shareButton);
  }
  if (els.ocrUploadButton) {
    els.ocrUploadButton.setAttribute("aria-label", ui.recognizeButton);
    els.ocrUploadButton.setAttribute("title", ui.recognizeButton);
  }
  if (els.teamPanelTitle) els.teamPanelTitle.textContent = ui.teamPanelTitle;
  if (els.teamShareButton) {
    els.teamShareButton.setAttribute("aria-label", ui.shareImageButton);
    els.teamShareButton.setAttribute("title", ui.shareImageButton);
  }
  if (els.teamHelpButton) {
    const helpLabel = localize("解题中心", "Solution Center");
    els.teamHelpButton.querySelector(".team-action-text")?.replaceChildren(document.createTextNode(isEnglishLanguage() ? "Solutions" : "解题"));
    els.teamHelpButton.setAttribute("aria-label", helpLabel);
    els.teamHelpButton.setAttribute("title", helpLabel);
  }
  if (els.saveTeamPresetButton) {
    els.saveTeamPresetButton.setAttribute("aria-label", ui.saveTeamPreset || localize("保存", "Save team"));
    els.saveTeamPresetButton.setAttribute("title", ui.saveTeamPreset || localize("保存", "Save team"));
  }
  if (els.loadTeamPresetButton) {
    els.loadTeamPresetButton.setAttribute("aria-label", ui.loadTeamPreset || localize("读取队伍", "Load team"));
    els.loadTeamPresetButton.setAttribute("title", ui.loadTeamPreset || localize("读取队伍", "Load team"));
  }
  if (els.swapTeamButton) els.swapTeamButton.setAttribute("title", ui.swapTeam);
  if (els.clearTeamButton) els.clearTeamButton.setAttribute("title", ui.clearTeam);
  if (els.searchInput) els.searchInput.placeholder = ui.searchPlaceholder;
  if (els.helpButton) {
    els.helpButton.setAttribute("aria-label", ui.sidebarHelp);
    els.helpButton.setAttribute("title", ui.sidebarHelp);
  }
  if (els.summaryStrip && state.paidArenaMode === "normal") {
    renderSummaryStrip(getBattleResultsSnapshot()?.attackResult || null, getBattleResultsSnapshot()?.defenseResult || null);
  }
  if (els.sortSummary) {
    updateSortSummary();
  }
  if (els.battlePowerDefense) {
    const base = sanitizeBattlePowerBase(state.battlePowerBase);
    const ratio = 1 - BATTLE_POWER_ADVANTAGE_RATE;
    els.battlePowerDefense.textContent = `${ui.battlePower.defense} ${formatBattlePower(base * ratio)}`;
  }
  if (els.battlePowerAttack) {
    const base = sanitizeBattlePowerBase(state.battlePowerBase);
    const ratio = 1 - BATTLE_POWER_ADVANTAGE_RATE;
    els.battlePowerAttack.textContent = `${ui.battlePower.attack} ${formatBattlePower(base / ratio)}`;
  }
  if (els.teamSlots) {
    renderTeam(getBattleResultsSnapshot());
  }
  renderFeatureHintBadges();
}

function toggleLanguage() {
  applyLanguage(state.language === "zh" ? "en" : "zh");
  render();
}

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
  if (maxDigits <= 0) return String(Math.round(number));
  return number
    .toFixed(maxDigits)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

function formatChargeNumber(value) {
  const rawNumber = Number(value) || 0;
  const number = Math.round(rawNumber * 1e10) / 1e10;
  const sign = number < 0 ? -1 : 1;
  const rounded = (Math.round(Math.abs(number) * 10000) / 10000) * sign;
  return rounded
    .toFixed(4)
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
  return isEnglishLanguage() ? `equals ${formattedRlValue} RL` : `等于${formattedRlValue}RL`;
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

function isA2(character) {
  return character?.id === 32 || character?.name === "A2" || character?.slug === "a2";
}

function isScarletShadow(character) {
  return character?.id === 56 || character?.slug === "红莲-暗影" || character?.name === "红莲:暗影";
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
  const lines = [localize(`蓄力时间：${formatSeconds(seconds)}s（${frames}F）`, `Charge time: ${formatSeconds(seconds)}s (${frames}F)`)];
  const releaseFrames = getAttackReleaseFrames(character);
  if (releaseFrames > 0) {
    lines.push(localize(`出手帧：${releaseFrames}F（不受蓄速影响）`, `Release: ${releaseFrames}F (not affected by charge speed)`));
  }
  return lines;
}

function isAnyBurstStageCharacter(character) {
  return character?.name === "小红帽" || character?.slug === "小红帽" || String(character?.burstStage || "").trim() === "Λ";
}

function isRedHood(character) {
  return character?.id === 111 || character?.name === "小红帽" || character?.slug === "小红帽";
}

function isRapiRedHood(character) {
  return character?.id === 181 || character?.name === "拉毗:小红帽" || character?.slug === "拉毗-小红帽";
}

const BURST_STAGE_ORDER = Object.freeze(["B1", "B2", "B3"]);

function getBurstStageTokens(character) {
  if (isAnyBurstStageCharacter(character)) return [...BURST_STAGE_ORDER];
  return String(character?.burstStage || "")
    .split("/")
    .map((stage) => stage.trim())
    .filter((stage) => BURST_STAGE_ORDER.includes(stage));
}

function getCharacterBurstStages(character) {
  const stages = getBurstStageTokens(character);
  // 拉毗：小红帽没有其他 B1 时会临时作为 B1，否则按本体 B3 处理。
  return isRapiRedHood(character) ? [...new Set([...stages, "B1"])] : [...new Set(stages)];
}

function getNaturalNextBurstStage(stage) {
  const index = BURST_STAGE_ORDER.indexOf(stage);
  return index >= 0 && index < BURST_STAGE_ORDER.length - 1 ? BURST_STAGE_ORDER[index + 1] : null;
}

function getBurstMemberCharacter(member) {
  return member?.character || member || null;
}

function normalizeBurstMembers(members = []) {
  return members
    .map((member, fallbackPositionIndex) => {
      const character = getBurstMemberCharacter(member);
      if (!character) return null;
      const rawPositionIndex = Number(member?.positionIndex);
      return {
        character,
        positionIndex: Number.isInteger(rawPositionIndex) ? rawPositionIndex : fallbackPositionIndex,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.positionIndex - b.positionIndex);
}

function getResolvedBurstStageOptions(character, members = [], positionIndex = null) {
  if (isAnyBurstStageCharacter(character)) return [...BURST_STAGE_ORDER];
  if (!isRapiRedHood(character)) return getBurstStageTokens(character);

  const hasOtherBurstOne = normalizeBurstMembers(members).some(
    (member) => member.positionIndex !== positionIndex && getBurstStageTokens(member.character).includes("B1"),
  );
  return [hasOtherBurstOne ? "B3" : "B1"];
}

function hasBurstStageAfterPosition(members, positionIndex, stage) {
  return normalizeBurstMembers(members).some(
    (member) => member.positionIndex > positionIndex && getBurstStageTokens(member.character).includes(stage),
  );
}

function getBurstStageRule(character, members = [], positionIndex = null, requiredStage = null) {
  const resolvedStages = getResolvedBurstStageOptions(character, members, positionIndex);
  const staticStages = getBurstStageTokens(character);
  const stage = requiredStage && resolvedStages.includes(requiredStage) ? requiredStage : resolvedStages[0] || null;
  if (!stage) return { stage: null, nextStage: null };

  let nextStage = staticStages[1] || getNaturalNextBurstStage(stage);
  if (isAnyBurstStageCharacter(character)) nextStage = getNaturalNextBurstStage(stage);
  if (isRapiRedHood(character)) nextStage = getNaturalNextBurstStage(stage);

  // 阿妮斯：超级巨星本体是 B1；只有她站在另一个 B1 前面时才按 B1→B1。
  if (isAnisSuperstar(character) && stage === "B1" && hasBurstStageAfterPosition(members, positionIndex, "B1")) {
    nextStage = "B1";
  }

  return { stage, nextStage };
}

function getBurstCandidateSortWeight(character) {
  // 优先消耗固定阶段角色，把全阶段角色留给后续更适合的阶段。
  return isAnyBurstStageCharacter(character) ? 1 : 0;
}

function getBurstSequence(members = []) {
  const normalizedMembers = normalizeBurstMembers(members);
  const findBestSequence = (requiredStage, usedPositions, releaseIndex) => {
    if (!BURST_STAGE_ORDER.includes(requiredStage) || releaseIndex >= normalizedMembers.length) return [];

    const candidates = normalizedMembers
      .filter((member) => !usedPositions.has(member.positionIndex))
      .map((member) => ({
        ...member,
        rule: getBurstStageRule(member.character, normalizedMembers, member.positionIndex, requiredStage),
      }))
      .filter((candidate) => candidate.rule.stage === requiredStage)
      .sort(
        (a, b) =>
          getBurstCandidateSortWeight(a.character) - getBurstCandidateSortWeight(b.character) ||
          a.positionIndex - b.positionIndex,
      );

    let bestSequence = [];
    for (const candidate of candidates) {
      const nextUsedPositions = new Set(usedPositions);
      nextUsedPositions.add(candidate.positionIndex);
      const tail = findBestSequence(candidate.rule.nextStage, nextUsedPositions, releaseIndex + 1);
      const sequence = [
        {
          character: candidate.character,
          characterId: candidate.character.id,
          characterName: candidate.character.name,
          positionIndex: candidate.positionIndex,
          stage: candidate.rule.stage,
          nextStage: candidate.rule.nextStage,
        },
        ...tail,
      ];
      if (sequence.length > bestSequence.length) bestSequence = sequence;
    }
    return bestSequence;
  };

  return findBestSequence("B1", new Set(), 0).map((entry, index) => ({
    ...entry,
    sequenceIndex: index + 1,
  }));
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
  return getBurstSequence(members).length;
}

function getAvailableBurstMarkers(result) {
  if (!result || result.error) return [];
  if (Array.isArray(result.burstSequence)) {
    return result.burstSequence
      .map((entry, index) => ({
        label: getBurstMarkerLabel(entry.stage),
        frame: entry.frame,
        stage: entry.stage,
        sequenceIndex: entry.sequenceIndex || index + 1,
        characterId: entry.characterId,
        characterName: entry.characterName,
        positionIndex: entry.positionIndex,
      }))
      .filter((marker) => Number.isFinite(marker.frame));
  }
  return [
    { label: "爆裂1", frame: result.burst1Frame, stage: "B1" },
    { label: "爆裂2", frame: result.burst2Frame, stage: "B2" },
    { label: "爆裂3", frame: result.burst3Frame, stage: "B3" },
  ]
    .slice(0, Number.isFinite(result.availableBurstLevel) ? result.availableBurstLevel : 3)
    .filter((marker) => Number.isFinite(marker.frame));
}

function getBurstMarkerLabel(stage) {
  const stageNumber = String(stage || "").replace("B", "");
  return isEnglishLanguage() ? `Burst ${stageNumber}` : `爆裂${stageNumber}`;
}

function getBurstDisplayEndFrame(result) {
  const markers = getAvailableBurstMarkers(result);
  return markers.length ? markers.at(-1).frame : result?.fullFrame ||
    (result?.engine === "v2" ? result.calculationEndFrame : 0) || 0;
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
    .map((entry) => `${getTeamLabel(entry.teamKey)}\n${getResultCopyText(entry.result, entry.teamKey)}`)
    .join("\n\n");
}

function getPaidArenaCopyText() {
  if (!isPaidArenaModeActive()) return "";
  const teams = getPaidArenaTeams();
  const universalRows = getPaidArenaUniversalCharges();
  const sacrificeRows = getPaidArenaRosannaSacrificeFrames();
  const redHoodPierceRows = getPaidArenaRedHoodPierceCounts();
  const scarletCounterRows = getPaidArenaScarletCounterEnabled();
  const jackalLinkRows = getPaidArenaJackalLinks();
  const dataTeamKey = getPaidArenaDataTeamKey();
  const dataSourceLabel = getPaidArenaSelectedDataTeamKey() === "defense" ? localize("防守队伍", "Defense teams") : localize("进攻队伍", "Attack teams");
  const rows = teams.map((team, rowIndex) => {
    const universalCharges = universalRows[rowIndex] || Array(TEAM_SIZE).fill(0);
    const sacrificeFrames = sacrificeRows[rowIndex] || Array(TEAM_SIZE).fill(null);
    const redHoodPierceCounts = redHoodPierceRows[rowIndex] || Array(TEAM_SIZE).fill(0);
    const scarletCounterEnabled = scarletCounterRows[rowIndex] || Array(TEAM_SIZE).fill(true);
    const jackalLink = normalizePaidArenaLinkForTeam(team, jackalLinkRows[rowIndex]);
    const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, dataTeamKey);
    const members = Array.from({ length: TEAM_SIZE }, (_, index) => {
      const character = team[index];
      const universalCharge = sanitizeUniversalCharge(universalCharges[index]);
      if (character) {
        const chargeSpeed = sanitizeChargeSpeed(chargeSpeeds[index]);
        if (chargeSpeed > 0 && canEditChargeSpeed(character)) return `${character.name}(${chargeSpeed})`;
        return character.name;
      }
      return universalCharge > 0 ? `${localize("充", "Charge")} ${formatChargeNumber(universalCharge)}%` : localize("空", "Empty");
    }).join(localize("，", ", "));
    return `${localize(`第${rowIndex + 1}队`, `Team ${rowIndex + 1}`)}: ${members}\n${getPaidArenaResultText(
      team,
      universalCharges,
      chargeSpeeds,
      null,
      sacrificeFrames,
      redHoodPierceCounts,
      scarletCounterEnabled,
      jackalLink,
    )}`;
  });
  return [`${getPaidArenaModeLabel()}：${dataSourceLabel}`, ...rows].join("\n\n");
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

function resetOpenSlotSettings() {
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
}

let ocrFillModulePromise = null;

async function loadOcrFillModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!ocrFillModulePromise) {
    ocrFillModulePromise = runtime.loadAppModule("ocr-fill", () => importAppModule("./modules/ocr-fill.js"));
  }
  const module = await ocrFillModulePromise;
  module.setOcrFillApi({
    state,
    characters: CHARACTERS,
    teamSize: TEAM_SIZE,
    refreshAppRuntimeContext,
    startProgressToast,
    stopProgressToast,
    showToast,
    localize,
    escapeHtml,
    renderFeatureTouchCard,
    bindFeatureTouchCards,
    isChineseLanguage,
    isHelpCenterLockedDefenseSide,
    showHelpCenterLockedDefenseToast,
    getTeamLabel,
    normalizeTeamKey,
    getTeamState,
    getChargeSpeedState,
    getUniversalChargeState,
    getRedHoodPierceCountState,
    getScarletCounterEnabledState,
    getRosannaSacrificeFrameState,
    getSavedCharacterChargeSpeed,
    isRedHood,
    getSavedCharacterRedHoodPierceCount,
    normalizeJackalLink,
    saveTeam,
    render,
    normalizePaidArenaMode,
    getPaidArenaTeams,
    normalizePaidArenaTeams,
    normalizePaidArenaUniversalCharges,
    normalizePaidArenaRedHoodPierceCounts,
    normalizePaidArenaScarletCounterEnabled,
    normalizePaidArenaRosannaSacrificeFrames,
    normalizePaidArenaJackalLinks,
    getPaidArenaTeamChargeSpeeds,
    normalizePaidArenaLinkForTeam,
    getPaidArenaDataTeamKey,
    getPaidArenaModeLabel,
    isImageFile,
    resetOpenSlotSettings,
    getOcrUploadContext,
    getClipboardImageFileFromData,
    getAuthErrorMessage,
  });
  return module;
}

async function handleOcrFill(teamKey, startIndex, files) {
  return (await loadOcrFillModule()).handleOcrFill(teamKey, startIndex, files);
}

async function handlePaidArenaOcrFill(mode, rowIndex, startIndex, files) {
  return (await loadOcrFillModule()).handlePaidArenaOcrFill(mode, rowIndex, startIndex, files);
}

async function fillTeamSlotsWithOcrResult(teamKey, startIndex, files) {
  return (await loadOcrFillModule()).fillTeamSlotsWithOcrResult(teamKey, startIndex, files);
}

async function fillPaidArenaSlotsWithOcrResult(rowIndex, startIndex, files) {
  return (await loadOcrFillModule()).fillPaidArenaSlotsWithOcrResult(rowIndex, startIndex, files);
}

function getTransferFiles(event) {
  const dataTransfer = event?.dataTransfer;
  if (!dataTransfer) return [];

  const files = [...(dataTransfer.files || [])];
  if (files.length > 0) return files;

  if (dataTransfer.items && dataTransfer.items.length > 0) {
    return [...dataTransfer.items]
      .map((item) => (typeof item.getAsFile === "function" ? item.getAsFile() : null))
      .filter(Boolean);
  }

  return [];
}

function isTransferWithFiles(event) {
  const dataTransfer = event?.dataTransfer;
  if (!dataTransfer) return false;

  const files = getTransferFiles(event);
  if (files.length > 0) return files.some(isImageFile);

  const types = [...(dataTransfer.types || [])].map((item) => String(item || "").toLowerCase());
  return types.includes("files") || types.includes("file");
}

function isChargeChartDropZone(event) {
  const target = event?.target;
  if (!els.chargeChart) return false;
  if (target instanceof Element) {
    if (target.closest?.(".charge-chart")) return true;
    if (target.closest?.(".charge-chart-panel")) return true;
  }
  const rect = els.chargeChart.getBoundingClientRect();
  if (!Number.isFinite(event?.clientX) || !Number.isFinite(event?.clientY)) return false;
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
}

function isInternalTeamSlotDrag(event) {
  const dataTransfer = event?.dataTransfer;
  if (!dataTransfer) return false;
  const types = [...(dataTransfer.types || [])].map((item) => String(item || "").toLowerCase());
  if (types.includes("application/x-nyk-team-slot-drag")) return true;

  if (
    isTeamSlotDragActive ||
    draggedTeamIndex !== null ||
    draggedTeamKey !== null ||
    draggedPaidArenaRowIndex !== null ||
    draggedPaidArenaTeamKey !== null ||
    pointerTeamDrag?.active
  ) {
    return true;
  }

  const plain = String(dataTransfer.getData?.("text/plain") || "").trim();
  if (!plain) return false;
  if (/^\d+$/.test(plain)) return true;
  if (/^[a-zA-Z-]+:\d+:\d+$/.test(plain)) return true;
  if (/^[a-zA-Z-]+:\d+$/.test(plain)) return true;

  return false;
}

function getOcrDropSlotContext(event) {
  const targetSlot =
    (event?.target instanceof Element ? event.target.closest(".team-slot") : null) ||
    (event?.clientX != null && event?.clientY != null ? getTeamSlotAtPoint(event.clientX, event.clientY) : null);
  if (!targetSlot) return null;
  if (targetSlot.dataset.paidArenaRowIndex !== undefined && targetSlot.dataset.paidArenaRowIndex !== null) {
    const rowIndex = Number(targetSlot.dataset.paidArenaRowIndex);
    const slotIndex = Number(targetSlot.dataset.slotIndex);
    if (!Number.isFinite(rowIndex) || !Number.isFinite(slotIndex)) return null;
    return { mode: "paid", rowIndex, slotIndex, teamKey: normalizeTeamKey(targetSlot.dataset.paidArenaTeamKey) };
  }

  const teamKey = normalizeTeamKey(targetSlot.dataset.teamKey);
  const slotIndex = Number(targetSlot.dataset.slotIndex);
  if (!teamKey || !Number.isFinite(slotIndex)) return null;
  return { mode: "normal", teamKey, slotIndex };
}

function getOcrFallbackContext(event) {
  const paidMode = isPaidArenaModeActive();
  if (paidMode) {
    const activeRow = Number(state.paidArenaActiveRowIndex || 0);
    return { mode: "paid", rowIndex: activeRow, slotIndex: 0, teamKey: getPaidArenaDataTeamKey() };
  }
  return { mode: "normal", teamKey: state.activeTeamKey, slotIndex: 0 };
}

function getOcrUploadContext() {
  return getOcrFallbackContext();
}

function openOcrUploadDialog() {
  if (!els.ocrUploadInput) return;
  if (!isChineseLanguage()) {
    showToast(localize("OCR仅限简体中文可用", "OCR is only available in Simplified Chinese mode"));
    return;
  }
  els.ocrUploadInput.value = "";
  els.ocrUploadInput.click();
}

function handleOcrUploadFiles(files) {
  void loadOcrFillModule().then((module) => module.handleOcrUploadFiles(files));
}

async function handleGlobalOcrPaste(event) {
  return (await loadOcrFillModule()).handleGlobalOcrPaste(event);
}

function isImageFile(file) {
  const type = String(file?.type || "").toLowerCase();
  const name = String(file?.name || "").toLowerCase();
  if (type.startsWith("image/")) return true;
  if (!name) return false;
  return /\.(png|jpg|jpeg|gif|webp|bmp|tiff?|avif)$/i.test(name);
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
    defenseUseArca: state.defenseTeam.map(c=>typeof c?.useArca==='boolean'?c.useArca:null),
    defenseUniversalCharges: [...state.defenseUniversalCharges],
    defenseRedHoodPierceCounts: [...state.defenseRedHoodPierceCounts],
    defenseScarletCounterEnabled: [...state.defenseScarletCounterEnabled],
    defenseRosannaSacrificeFrames: [...state.defenseRosannaSacrificeFrames],
    team: state.team.map((character) => character?.id || null),
    attackUseArca: state.team.map(c=>typeof c?.useArca==='boolean'?c.useArca:null),
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
    defenseUseArca: Array.from({length:TEAM_SIZE},(_,i)=>typeof slot.defenseUseArca?.[i]==='boolean'?slot.defenseUseArca[i]:null),
    defenseUniversalCharges: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(slot.defenseUniversalCharges?.[index])),
    defenseRedHoodPierceCounts: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(slot.defenseRedHoodPierceCounts?.[index])),
    defenseScarletCounterEnabled: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(slot.defenseScarletCounterEnabled?.[index])),
    defenseRosannaSacrificeFrames: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeSacrificeFrame(slot.defenseRosannaSacrificeFrames?.[index])),
    team: Array.from({ length: TEAM_SIZE }, (_, index) => slot.team?.[index] ?? empty.team[index]),
    attackUseArca: Array.from({length:TEAM_SIZE},(_,i)=>typeof slot.attackUseArca?.[i]==='boolean'?slot.attackUseArca[i]:null),
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
  if (state.helpCenter.solveWorkspace) return;
  state.lineupSlots[state.activeLineupIndex] = serializeLineupSlot();
}

function loadLineupSlot(index) {
  const slot = normalizeLineupSlot(state.lineupSlots[index]);
  state.defenseTeam = Array.from({ length: TEAM_SIZE }, (_, slotIndex) => restoreArcaMember(slot.defenseTeam[slotIndex],slot.defenseUseArca?.[slotIndex]));
  state.defenseUniversalCharges = [...slot.defenseUniversalCharges];
  state.defenseRedHoodPierceCounts = [...slot.defenseRedHoodPierceCounts];
  state.defenseScarletCounterEnabled = [...slot.defenseScarletCounterEnabled];
  state.defenseRosannaSacrificeFrames = [...slot.defenseRosannaSacrificeFrames];
  state.team = Array.from({ length: TEAM_SIZE }, (_, slotIndex) => restoreArcaMember(slot.team[slotIndex],slot.attackUseArca?.[slotIndex]));
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
  return Math.min(100, Math.max(0, Number(value) || 0));
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
  if (value === null || value === undefined || value === "") return CUBE_TYPE_NONE;
  const text = String(value);
  if (/^\d+$/.test(text)) return getCubeTypeById(text);
  return TEAM_CUBE_TYPES.includes(text) ? text : CUBE_TYPE_NONE;
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
  if (magazine < 20) return 20;
  return Math.min(88, magazine);
}

function parseCompleteMagazine(value) {
  const magazine = Math.floor(Number(value));
  if (!Number.isFinite(magazine)) return null;
  if (magazine >= 20 && magazine <= 88) return magazine;
  return null;
}

function usesArcaParameters(character, teamKey = state.activeTeamKey) {
  const borrowed = state.helpCenter.solveWorkspace?.privateHelp;
  if (borrowed) return typeof character?.useArca === 'boolean' ? character.useArca : normalizeTeamKey(teamKey) === borrowed.item.purpose;
  return typeof character?.useArca === 'boolean' ? character.useArca : normalizeTeamKey(teamKey) === 'attack';
}
function getArcaChargeParameters(character, teamKey = state.activeTeamKey) {
  const borrowed = state.helpCenter.solveWorkspace?.privateHelp;
  if (borrowed) return character?.id && usesArcaParameters(character,teamKey) ? borrowed.parameters[character.id] || null : null;
  return character?.id && usesArcaParameters(character,teamKey) ? state.arcaChargeParameters?.[character.id] || null : null;
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
  const option = TEAM_CUBE_OPTIONS.find((item) => item.type === normalizedCubeType);
  if (option) return getImmutableAssetUrl(`assets/icons/ui/detail-cubes/${option.icon}`);
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
  const arca = getArcaChargeParameters(character, teamKey);
  if (arca) return arca.magazine;
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
  if (isHelpCenterLockedDefenseSide(teamKey)) {
    state.activeTeamKey = "attack";
    return;
  }
  state.activeTeamKey = normalizeTeamKey(teamKey);
}

function applyChargeSpeedFrames(baseFrames, chargeSpeedPercent = 0) {
  if (!baseFrames) return baseFrames;
  const speed = Math.round(Number(chargeSpeedPercent) || 0);
  if (speed <= 0) return baseFrames;
  if (baseFrames === 60 && speed <= 25 && FIXED_CHARGE_SPEED_FRAMES_60.has(speed)) {
    return FIXED_CHARGE_SPEED_FRAMES_60.get(speed);
  }
  return Math.floor((baseFrames / 2) * (1 - speed / 100)) * 2;
}

function applyChargeSpeedTotalFrames(baseFrames, chargeSpeedPercent = 0) {
  if (!baseFrames) return baseFrames;
  const speed = Math.round(Number(chargeSpeedPercent) || 0);
  if (speed <= 0) return baseFrames;
  if (baseFrames === 60 && speed <= 25 && FIXED_CHARGE_SPEED_FRAMES_60.has(speed)) {
    return FIXED_CHARGE_SPEED_FRAMES_60.get(speed);
  }
  return Math.floor((baseFrames / 2) * (1 - speed / 100)) * 2;
}

function applyChargeSpeedIntervalFrames(baseChargeFrames, fixedFrames, chargeSpeedPercent = 0) {
  return applyChargeSpeedFrames(baseChargeFrames, chargeSpeedPercent) + (Number(fixedFrames) || 0);
}

function isCinderella(character) {
  return character?.name === "灰姑娘" || character?.slug === "灰姑娘";
}

function isLiberalio(character) {
  return character?.id === 26 || character?.name === "莉贝雷利奥" || character?.slug === "莉贝雷利奥" || character?.enName === "Liberalio";
}

function isCinderellaName(characterName = "") {
  return characterName === "灰姑娘" || characterName === "Cinderella";
}

function isLaplace(character) {
  return character?.id === 33 || character?.name === "拉普拉斯" || character?.slug === "拉普拉斯";
}

function isLaplaceUltimateHero(character) {
  return Number.parseInt(String(character?.id), 10) === 213 || String(character?.enName || "").includes("Laplace Ultimate");
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
  const localizedNames = [character?.name, character?.slug, character?.nameCodeName]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  return (
    Number(character?.id) === 2 ||
    character?.enName === "Anis: Star" ||
    localizedNames.some((name) => ANIS_SUPERSTAR_CHARACTER_NAMES.has(name))
  );
}

function isEmilia(character) {
  return character?.id === 11 || character?.enName === "Emilia" || character?.name === "爱蜜莉雅" || character?.slug === "爱蜜莉雅";
}

function getAnisSuperstarSupplementValue(team = []) {
  const anis = team.find((member) => member && isAnisSuperstar(member));
  if (!anis) return 0;
  return Math.round((Number(anis.burstGen) || 0) * ANIS_SUPERSTAR_CHARGE_SUPPLEMENT_RATE * 1e10) / 1e10;
}

function getRlProjectileFlightBaseFrames(character) {
  if (Number.isFinite(character.projectileFlightBaseFrames)) return character.projectileFlightBaseFrames;
  return character.timing?.projectileFlightFramesByPosition?.P1 ?? 16;
}

function getRlProjectileFlightReduction(positionIndex, teamKey = "attack", arenaMode = state.paidArenaMode) {
  if (arenaMode === "c") return positionIndex <= 2 ? 0 : 2;
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
    !isSnowWhiteHeavyArms(character) &&
    targetPositionIndex === ENEMY_TEAM_SIZE - 1 &&
    isCinderella(opponentTeam?.[targetPositionIndex])
  );
}

function getRlTargetHitMultiplier(character, positionIndex, targetPositionIndex, opponentTeam = []) {
  // 阿妮斯：超级巨星的爆炸波及不会命中灰姑娘的诱饵；其他 RL 保留原有计算。
  if (
    isCinderella(opponentTeam?.[positionIndex]) &&
    (!isAnisSuperstar(character) || positionIndex === targetPositionIndex)
  ) return 3;
  return 2;
}

function doesCinderellaShotSplash(shotNumber = 1) {
  const normalizedShotNumber = Math.max(1, Math.floor(Number(shotNumber) || 1));
  if (normalizedShotNumber <= CINDERELLA_INITIAL_SPLASH_SEQUENCE.length) {
    return CINDERELLA_INITIAL_SPLASH_SEQUENCE[normalizedShotNumber - 1];
  }
  const loopIndex = (normalizedShotNumber - CINDERELLA_INITIAL_SPLASH_SEQUENCE.length - 1) % CINDERELLA_LOOP_SPLASH_SEQUENCE.length;
  return CINDERELLA_LOOP_SPLASH_SEQUENCE[loopIndex];
}

function getCinderellaBodyHits(targetPositionIndex = DEFAULT_RL_TARGET_INDEX, shotCount = 1, shotNumber = 1) {
  const hitCount = shotCount * (doesCinderellaShotSplash(shotNumber) ? 2 : 1);
  return [[targetPositionIndex, hitCount]];
}

function getRlProjectileFlightFrames(character, positionIndex, teamKey = "attack") {
  // 有站位数据或基础飞行帧时，优先按站位补正；顶层 projectileFlightFrames 仅作为旧数据兜底。
  if (character?.timing?.projectileFlightFramesByPosition || Number.isFinite(character.projectileFlightBaseFrames)) {
    return Math.max(0, getRlProjectileFlightBaseFrames(character) - getRlProjectileFlightReduction(positionIndex, teamKey));
  }
  if (Number.isFinite(character.projectileFlightFrames)) return character.projectileFlightFrames;
  return Math.max(0, getRlProjectileFlightBaseFrames(character) - getRlProjectileFlightReduction(positionIndex, teamKey));
}

function getAttackReleaseFrames(character) {
  // 连射型武器的出手帧属于固定动作，不参与蓄速压缩。
  const rawFrames = character?.attackReleaseFrames ?? character?.timing?.attackReleaseFrames;
  const releaseFrames = Number(rawFrames);
  return Number.isFinite(releaseFrames) ? Math.max(0, Math.round(releaseFrames)) : 0;
}

function getChargeFrames(character, positionIndex, teamKey = "attack") {
  const speed = canApplyChargeSpeed(character) ? Number(character.chargeSpeedPercent) || 0 : 0;
  const attackReleaseFrames = getAttackReleaseFrames(character);

  if (isAnisSuperstar(character)) {
    const baseChargeFrames = 60;
    const fixedIntervalFrames = attackReleaseFrames;
    const chargeFrames = applyChargeSpeedFrames(baseChargeFrames, speed);
    const flightFrames = getRlProjectileFlightFrames(character, positionIndex, teamKey);
    return {
      firstFrame: chargeFrames + attackReleaseFrames + flightFrames,
      interval: chargeFrames + fixedIntervalFrames,
      reloadInterval: null,
      chargeFrames,
      baseChargeFrames,
      baseIntervalFrames: baseChargeFrames + fixedIntervalFrames,
      projectileFlightFrames: flightFrames,
      attackReleaseFrames,
    };
  }

  if (isRaven(character)) {
    const baseChargeFrames = 60;
    const chargeFrameOffset = 14;
    const flightFrames = 2;
    const fixedIntervalFrames = 60 + attackReleaseFrames;
    return {
      firstFrame: applyChargeSpeedFrames(baseChargeFrames, speed) + chargeFrameOffset + attackReleaseFrames + flightFrames,
      interval: applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, speed),
      chargeFrames: applyChargeSpeedFrames(baseChargeFrames, speed) + chargeFrameOffset,
      baseChargeFrames,
      baseIntervalFrames: baseChargeFrames + fixedIntervalFrames,
      projectileFlightFrames: flightFrames,
      attackReleaseFrames,
    };
  }

  if (isA2(character)) {
    const baseChargeFrames = 86;
    const baseIntervalFrames = 124;
    const speedReduction = Math.floor(Math.max(0, Math.round(Number(speed) || 0) / 2));
    const chargeFrames = Math.max(0, baseChargeFrames - speedReduction);
    return {
      firstFrame: chargeFrames + 2,
      interval: Math.max(0, baseIntervalFrames - speedReduction),
      reloadInterval: null,
      chargeFrames,
      baseChargeFrames,
      baseIntervalFrames,
      projectileFlightFrames: 2,
    };
  }

  if (character.weapon === "MG") {
    return {
      firstFrame: MG_WARMUP_EVENTS[0].frame,
      interval: MG_SUSTAIN_INTERVAL_FRAMES,
      chargeFrames: 0,
    };
  }

  if (character.timing?.firstFrame !== null && character.timing?.intervalFrames !== null) {
    const baseChargeFrames = character.timing.chargeFrames ?? 0;
    const chargeFrames = applyChargeSpeedFrames(baseChargeFrames, speed);
    const baseIntervalFrames =
      character.timing.turnFrames != null
        ? baseChargeFrames + attackReleaseFrames + character.timing.turnFrames
        : character.timing.intervalFrames;
    const fixedIntervalFrames = Math.max(0, baseIntervalFrames - baseChargeFrames);
    const intervalFrames = applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, speed);

    if (
      character.weapon === "RL" &&
      (isLaplaceUltimateHero(character) ||
        character.timing.projectileFlightFramesByPosition ||
        Number.isFinite(character.projectileFlightFrames) ||
        Number.isFinite(character.projectileFlightBaseFrames))
    ) {
      const flightFrames = getRlProjectileFlightFrames(character, positionIndex, teamKey);
      if (isVestiTacticalUpgrade(character)) {
        return {
          firstFrame: chargeFrames + attackReleaseFrames + flightFrames,
          interval: chargeFrames + attackReleaseFrames + VESTI_TACTICAL_HIT_OFFSETS.at(-1),
          reloadInterval: null,
          chargeFrames,
          baseChargeFrames,
          baseIntervalFrames,
          projectileFlightFrames: flightFrames,
          attackReleaseFrames,
        };
      }
      const firstFrame = character.firstFrameOverride ?? chargeFrames + attackReleaseFrames + flightFrames;
      return {
        firstFrame,
        interval: character.attackIntervalFrames || intervalFrames,
        reloadInterval: isCinderella(character) ? firstFrame : null,
        chargeFrames,
        baseChargeFrames,
        baseIntervalFrames,
        projectileFlightFrames: flightFrames,
        attackReleaseFrames,
      };
    }

    if (["SR", "RL"].includes(character.weapon)) {
      if (character.weapon === "SR" && isLiberalio(character)) {
        const customIntervalFrames = Number(character.attackIntervalFrames);
        const srFixedIntervalFrames = Number.isFinite(customIntervalFrames)
          ? Math.max(0, customIntervalFrames - baseChargeFrames + attackReleaseFrames)
          : Math.max(0, baseIntervalFrames - baseChargeFrames);
        return {
          firstFrame: character.firstFrameOverride ?? chargeFrames + attackReleaseFrames,
          interval: applyChargeSpeedIntervalFrames(baseChargeFrames, srFixedIntervalFrames, speed),
          chargeFrames,
          baseChargeFrames,
          baseIntervalFrames: baseChargeFrames + srFixedIntervalFrames,
          attackReleaseFrames,
        };
      }
      return {
        firstFrame: character.firstFrameOverride ?? chargeFrames + attackReleaseFrames,
        interval: character.attackIntervalFrames || intervalFrames,
        chargeFrames,
        baseChargeFrames,
        baseIntervalFrames,
        attackReleaseFrames,
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
    if (isLiberalio(character)) {
      const customIntervalFrames = Number(character.attackIntervalFrames);
      const fixedIntervalFrames = Number.isFinite(customIntervalFrames)
        ? Math.max(0, customIntervalFrames - baseChargeFrames + attackReleaseFrames)
        : turnFrames + attackReleaseFrames;
      return {
        firstFrame: character.firstFrameOverride ?? applyChargeSpeedFrames(baseChargeFrames, speed) + attackReleaseFrames,
        interval: applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, speed),
        chargeFrames,
        baseChargeFrames,
        baseIntervalFrames: baseChargeFrames + fixedIntervalFrames,
        attackReleaseFrames,
      };
    }
    const fixedIntervalFrames = turnFrames + attackReleaseFrames;
    return {
      firstFrame: character.firstFrameOverride ?? applyChargeSpeedFrames(baseChargeFrames, speed) + attackReleaseFrames,
      interval: applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, speed),
      chargeFrames,
      baseChargeFrames,
      baseIntervalFrames: baseChargeFrames + fixedIntervalFrames,
      attackReleaseFrames,
    };
  }
  if (character.weapon === "RL") {
    const flightFrames = getRlProjectileFlightFrames(character, positionIndex, teamKey);
    const turnFrames = character.turnFrames ?? 16;
    const baseChargeFrames = sheetChargeFrames ?? 60;
    return {
      firstFrame: character.firstFrameOverride ?? applyChargeSpeedFrames(baseChargeFrames, speed) + attackReleaseFrames + flightFrames,
      interval: character.attackIntervalFrames || applyChargeSpeedIntervalFrames(baseChargeFrames, turnFrames + attackReleaseFrames, speed),
      chargeFrames,
      baseChargeFrames,
      baseIntervalFrames: baseChargeFrames + turnFrames + attackReleaseFrames,
      projectileFlightFrames: flightFrames,
      attackReleaseFrames,
    };
  }

  throw new Error(`未知武器类型：${character.weapon}`);
}

function getRlHitSegments(character) {
  if (isCinderella(character)) return 1;
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

function hasBodyOnlyExtraDamage(character) {
  return hasEffectiveExtraDamage(character) && character?.extraDamageTargetMode === "body";
}

function hasEffectiveExtraChargeEffect(character) {
  return Boolean(character.hasExtraChargeEffect);
}

function hasEffectiveExtraChargeMultiplier(character) {
  if (hasBodyOnlyExtraDamage(character)) return false;
  return hasEffectiveExtraDamage(character) || hasEffectiveExtraChargeEffect(character);
}

function getExtraChargeLabel(character) {
  if (hasEffectiveExtraDamage(character)) return localize("额外伤害", "extra damage");
  if (hasEffectiveExtraChargeEffect(character)) return localize("额外效果", "extra effect");
  return "";
}

function getChargeHitMultiplier(character, shotNumber = null) {
  if (character.chargeTargetHitCount === 2) return 2;
  if (isCinderella(character)) return getHitProfileTargetHitCount({ targetHits: getCinderellaBodyHits(DEFAULT_RL_TARGET_INDEX, 1, shotNumber) });
  if (character.widePierceTargetCount === 3 && character.hasPenetration) return 6;
  if (character.weapon === "RL") return getRlHitSegments(character);
  if (character.weapon === "SG") return 10;
  return 1;
}

function getChargeFormulaTargetCount(character, shotNumber = null) {
  if (isCinderella(character)) return 1;
  if (character.widePierceTargetCount === 3 && character.hasPenetration) return 3;
  if (character.weapon === "RL") {
    const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
    const start = Math.max(0, DEFAULT_RL_TARGET_INDEX - range);
    const end = Math.min(ENEMY_TEAM_SIZE - 1, DEFAULT_RL_TARGET_INDEX + range);
    return end - start + 1;
  }
  return 1;
}

function getChargeFormulaText(character, shotNumber = null) {
  const targetCount = Math.max(1, getChargeFormulaTargetCount(character, shotNumber));
  const hitMultiplier = getChargeHitMultiplier(character, shotNumber);
  const bodyOnlyExtraMultiplier = getBodyOnlyExtraDamageHitMultiplier(character, shotNumber);
  const extraMultiplier = hasEffectiveExtraChargeMultiplier(character) ? 2 : 1;
  const equivalentHits = (hitMultiplier + bodyOnlyExtraMultiplier) * extraMultiplier;
  const hitPerTarget = equivalentHits / targetCount;
  return `${formatChargeNumber(getBaseChargeUnit(character))} × ${formatChargeNumber(hitPerTarget)} hit × ${targetCount}人`;
}

function getBodyOnlyExtraDamageHitMultiplier(character, shotNumber = null) {
  if (!hasBodyOnlyExtraDamage(character)) return 0;
  if (isCinderella(character)) return getHitProfileBodyHitCount({ bodyHits: getCinderellaBodyHits(DEFAULT_RL_TARGET_INDEX, 1, shotNumber) });
  if (character.weapon === "RL") {
    const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
    const start = Math.max(0, DEFAULT_RL_TARGET_INDEX - range);
    const end = Math.min(ENEMY_TEAM_SIZE - 1, DEFAULT_RL_TARGET_INDEX + range);
    return end - start + 1;
  }
  return 1;
}

function getChargeHitLabel(character, hitMultiplier = getChargeHitMultiplier(character), shotNumber = null) {
  if (isCinderella(character)) return localize("命中+额外伤害", "hit + extra damage");
  const extraChargeLabel = getExtraChargeLabel(character);
  const extraText = extraChargeLabel ? `+${extraChargeLabel}` : "";
  if (character.weapon === "RL") return `${localize("爆炸命中", "explosion hit")}${extraText}`;
  if (getPenetrationExtraHitCount(character, shotNumber) > 0) return `${localize("命中+穿透", "hit + pierce")}${extraText}`;
  return `${localize("命中", "hit")}${extraText}`;
}

function getChargeValue(character, shotNumber = null) {
  const coverMultiplier = getChargeHitMultiplier(character, shotNumber);
  const bodyOnlyExtraMultiplier = getBodyOnlyExtraDamageHitMultiplier(character, shotNumber);
  const extraMultiplier = hasEffectiveExtraChargeMultiplier(character) ? 2 : 1;
  return getBaseChargeUnit(character) * (coverMultiplier + bodyOnlyExtraMultiplier) * extraMultiplier + (character.flatBurstBonus || 0);
}

function getDelayedExtraChargeTotal(character) {
  if (isHarran(character)) return 0;
  const extraMultiplier = hasEffectiveExtraChargeMultiplier(character) ? 2 : 1;
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
  if (!hitProfile) return getChargeValue(character, shotNumber) * shotCount;
  const actualHitMultiplier = getHitProfileTargetHitCount(hitProfile);
  const bodyOnlyExtraMultiplier = hasBodyOnlyExtraDamage(character) ? getHitProfileBodyHitCount(hitProfile) : 0;
  const extraMultiplier = hitProfile.p5CinderellaDecoy ? 1 : hasEffectiveExtraChargeMultiplier(character) ? 2 : 1;
  const flatBonus = (character.flatBurstBonus || 0) * shotCount;
  return getBaseChargeUnit(character) * (actualHitMultiplier + bodyOnlyExtraMultiplier) * extraMultiplier + flatBonus;
}

function getHitProfileTargetHitCount(hitProfile = null) {
  return (hitProfile?.targetHits || []).reduce((sum, [, hitCount]) => sum + (Number(hitCount) || 0), 0);
}

function getHitProfileBodyHitCount(hitProfile = null) {
  return (hitProfile?.bodyHits || []).reduce((sum, [, hitCount]) => sum + (Number(hitCount) || 0), 0);
}

function getHitProfileChargeSegmentCount(character, hitProfile = null) {
  const actualHitMultiplier = getHitProfileTargetHitCount(hitProfile);
  const bodyOnlyExtraMultiplier = hasBodyOnlyExtraDamage(character) ? getHitProfileBodyHitCount(hitProfile) : 0;
  const extraMultiplier = hitProfile?.p5CinderellaDecoy ? 1 : hasEffectiveExtraChargeMultiplier(character) ? 2 : 1;
  return (actualHitMultiplier + bodyOnlyExtraMultiplier) * extraMultiplier;
}

function getDelayedExtraLabel(character) {
  if (character?.id === 231 || character?.slug === "红莲-弑神") return localize("居合追加", "Iaido follow-up");
  return character?.id === 57 || character?.slug === "哈兰" || character?.name === "哈兰"
    ? localize("中毒充能", "Poison charge")
    : localize("延迟额外", "Delayed extra");
}

function isHarran(character) {
  return character?.id === 57 || character?.slug === "哈兰" || character?.name === "哈兰";
}

function isRavenPoison(character) {
  return isRaven(character);
}

function getHarranPoisonChargeValue(character) {
  return getBaseChargeUnit(character);
}

function getHarranPoisonTargetPositions(hitProfile = null) {
  const targetHits = Array.isArray(hitProfile?.targetHits) ? hitProfile.targetHits : [];
  return [...new Set(targetHits.map(([positionIndex]) => positionIndex).filter((positionIndex) => Number.isInteger(positionIndex)))];
}

function getRavenPrimaryPoisonTargetPosition(hitProfile = null) {
  return Number.isInteger(hitProfile?.targetPositionIndex)
    ? hitProfile.targetPositionIndex
    : Array.isArray(hitProfile?.bodyHits)
      ? hitProfile.bodyHits?.[0]?.[0]
      : Array.isArray(hitProfile?.targetHits)
        ? hitProfile.targetHits?.[0]?.[0]
        : undefined;
}

function getHarranPoisonEvents(event, currentFrame, hitProfile = null) {
  if (!isHarran(event.character)) return [];
  if (!(event.poisonChargeTargets instanceof Set)) event.poisonChargeTargets = new Set();
  return getHarranPoisonTargetPositions(hitProfile)
    .filter((targetPositionIndex) => !event.poisonChargeTargets.has(targetPositionIndex))
    .map((targetPositionIndex) => {
      event.poisonChargeTargets.add(targetPositionIndex);
      const targetLabel = `P${targetPositionIndex + 1}`;
      return {
        character: event.character,
        positionIndex: event.positionIndex,
        targetPositionIndex,
        frame: currentFrame + 2,
        chargeValue: getHarranPoisonChargeValue(event.character),
        positionHits: [[targetPositionIndex, 1]],
        targetHits: [[targetPositionIndex, 1]],
        source: "harran-poison",
        label: `中毒充能：${targetLabel}`,
        repeatFrames: 60,
      };
    });
}

function getRavenPoisonEvents(event, currentFrame, hitProfile = null) {
  if (!isRavenPoison(event.character)) return [];
  if (!(event.ravenPoisonNextTickByTarget instanceof Map)) event.ravenPoisonNextTickByTarget = new Map();
  const primaryTargetPositionIndex = getRavenPrimaryPoisonTargetPosition(hitProfile);
  if (!Number.isInteger(primaryTargetPositionIndex)) return [];
  const nextTickFrame = event.ravenPoisonNextTickByTarget.get(primaryTargetPositionIndex);
  const poisonTickFrame = currentFrame + 10;
  if (Number.isFinite(nextTickFrame) && nextTickFrame > poisonTickFrame) return [];
  const repeatFrames = Number.isFinite(nextTickFrame) && nextTickFrame === poisonTickFrame ? 0 : 60;
  const targetLabel = `P${primaryTargetPositionIndex + 1}`;
  return [
    {
      character: event.character,
      positionIndex: event.positionIndex,
      targetPositionIndex: primaryTargetPositionIndex,
      frame: poisonTickFrame,
      chargeValue: getHarranPoisonChargeValue(event.character),
      positionHits: [[primaryTargetPositionIndex, 1]],
      targetHits: [[primaryTargetPositionIndex, 1]],
      source: "raven-poison",
      label: `中毒充能：${targetLabel}`,
      repeatFrames: repeatFrames,
    },
  ];
}

function getChargeBreakdown(character) {
  const bodyOnlyExtraMultiplier = getBodyOnlyExtraDamageHitMultiplier(character);
  const extraMultiplier = hasEffectiveExtraChargeMultiplier(character) ? 2 : 1;
  const baseChargeUnit = getBaseChargeUnit(character);
  const effectiveBurstGen = getEffectiveBurstGen(character);
  const flatBonus = character.flatBurstBonus || 0;
  const superstarSupplementValue = character.superstarChargeSupplementValue || 0;
  const rawBaseChargeUnit = character.weapon === "SG" ? effectiveBurstGen / 10 : effectiveBurstGen;
  const delayedExtraChargeTotal = getDelayedExtraChargeTotal(character);
  const fixedSequenceChargeTotal = getFixedSequenceChargeTotal(character);
  const fixedSequenceMultiplier = isVestiTacticalUpgrade(character) ? VESTI_TACTICAL_HIT_OFFSETS.length : 1;
  const mainChargeFormula = `${getChargeFormulaText(character)}${
    fixedSequenceMultiplier > 1 ? ` × ${fixedSequenceMultiplier}` : ""
  }`;
  const chargeFormulaParts = [
    mainChargeFormula,
    ...(flatBonus ? [formatChargeNumber(flatBonus)] : []),
    ...(delayedExtraChargeTotal ? [formatChargeNumber(delayedExtraChargeTotal)] : []),
    ...(fixedSequenceChargeTotal && fixedSequenceMultiplier === 1 ? [formatChargeNumber(fixedSequenceChargeTotal)] : []),
  ];
  const chargeCalculationLabel = localize("充能计算", "Charge formula");
  const baseLabel = localize("基础", "Base");
  const compositionLabel = localize("充能组成", "Charge source");
  const superAnisLabel = localize("超阿补充", "Anis: Superstar bonus");
  const quantumText = localize("；", "; ");
  const lines = [
    `${chargeCalculationLabel}: ${chargeFormulaParts.join(" + ")} = ${formatChargeNumber(getSingleShotChargeValue(character))}%`,
    `${baseLabel}: ${formatChargeNumber(baseChargeUnit)}%${
      character.quantumRelicCubeEnabled || superstarSupplementValue
        ? `${localize("（", " (")}${formatChargeNumber(rawBaseChargeUnit)}${superstarSupplementValue ? ` + ${formatChargeNumber(superstarSupplementValue)} ${superAnisLabel}` : ""}${
            character.quantumRelicCubeEnabled ? `${quantumText}${formatChargeNumber(character.burstGen)} × 1.0466` : ""
          }${localize("）", ")")}`
        : ""
    }`,
    `${compositionLabel}: ${getChargeHitLabel(character)}`,
  ];

  const extraChargeLabel = getExtraChargeLabel(character);
  if (extraChargeLabel) {
    if (bodyOnlyExtraMultiplier) {
      lines.push(`${extraChargeLabel}: ${localize("仅本体，已计入 hit", "body only, included in hit")}`);
    } else {
      lines.push(`${extraChargeLabel}: ${localize("已计入 hit", "included in hit")}`);
    }
  }
  if (superstarSupplementValue) lines.push(`${superAnisLabel}: ${localize("基础", "base")} +${formatChargeNumber(superstarSupplementValue)}%`);
  if (isRedHood(character)) {
    lines.push(
      localize(
        `攻击蓄速：每次攻击 +${formatNumber(RED_HOOD_CHARGE_SPEED_PER_ATTACK, 2)}%，最多 ${RED_HOOD_MAX_CHARGE_SPEED_STACKS} 层`,
        `Attack charge speed: +${formatNumber(RED_HOOD_CHARGE_SPEED_PER_ATTACK, 2)}% per attack, max ${RED_HOOD_MAX_CHARGE_SPEED_STACKS} stacks`,
      ),
    );
  }
  if (isEmilia(character)) {
    lines.push(
      localize(
        `蓄速变化：第二发起 +${formatChargeNumber(EMILIA_CHARGE_SPEED_AFTER_FIRST_SHOT)}%`,
        `Charge speed change: +${formatChargeNumber(EMILIA_CHARGE_SPEED_AFTER_FIRST_SHOT)}% from 2nd shot`,
      ),
    );
  }
  if (flatBonus) lines.push(localize(`固定补充 +${formatChargeNumber(flatBonus)}%`, `Fixed bonus +${formatChargeNumber(flatBonus)}%`));
  if (character.hitCountExtraEvents?.length) {
    lines.push(
      `${localize("攻击追加", "Attack extra")}: ${character.hitCountExtraEvents
        .map((event) => {
          const triggerText = event.every
            ? localize(`每${event.every}发`, `every ${event.every} shots`)
            : localize(`第${event.hit}次`, `hit ${event.hit}`);
          const delayText = event.delayFrames ? localize(`${event.delayFrames}帧后 `, `${event.delayFrames}F later `) : "";
          return `${triggerText}${delayText} +${formatChargeNumber(baseChargeUnit * event.segments * extraMultiplier)}%`;
        })
        .join(localize("，", ", "))}`,
    );
  }
  if (character.magazineEmptyExtraCharge) {
    lines.push(
      localize(
        `尾弹追加：打完弹夹后${Number(character.magazineEmptyExtraDelayFrames) || 12}帧 +${formatChargeNumber(character.magazineEmptyExtraCharge)}%`,
        `Tail shot bonus: ${Number(character.magazineEmptyExtraDelayFrames) || 12}F after magazine empty +${formatChargeNumber(character.magazineEmptyExtraCharge)}%`,
      ),
    );
  }
  if (isHarran(character)) {
    lines.push(
      localize(
        `中毒充能：命中新目标后2F首次触发，之后每60F +${formatChargeNumber(getHarranPoisonChargeValue(character))}%`,
        `Poison charge: first tick 2F after hitting a new target, then every 60F +${formatChargeNumber(getHarranPoisonChargeValue(character))}%`,
      ),
    );
  } else if (isRavenPoison(character)) {
    lines.push(
      localize(
        `中毒充能：命中后10F首次触发，之后每60F +${formatChargeNumber(getHarranPoisonChargeValue(character))}%`,
        `Poison charge: first tick 10F after hit, then every 60F +${formatChargeNumber(getHarranPoisonChargeValue(character))}%`,
      ),
    );
  } else if (character.delayedExtraHits?.length) {
    const delayedLabel = getDelayedExtraLabel(character);
    lines.push(
      `${delayedLabel}: ${character.delayedExtraHits
        .map((event) => localize(`${event.delayFrames}帧后 +${formatChargeNumber(baseChargeUnit * event.segments * extraMultiplier)}%`, `${event.delayFrames}F later +${formatChargeNumber(baseChargeUnit * event.segments * extraMultiplier)}%`))
        .join(localize("，", ", "))}`,
    );
  }
  if (fixedSequenceChargeTotal) {
    lines.push(
      localize(
        `引导连射：蓄力后引导共计${VESTI_TACTICAL_HIT_OFFSETS.length}发`,
        `Guided burst: ${VESTI_TACTICAL_HIT_OFFSETS.length} guided shots after charge`,
      ),
    );
  }

  if (character?.id === 231 || character?.slug === "红莲-弑神") lines.push(localize("临时对照序列：按60FPS轴使用4F/16F起、42F一轮，原始帧率与实验条件待校准。", "Provisional 60 FPS sequence: 4F/16F start, 42F cycles; source frame rate and test conditions remain unverified."));
  return lines.join("\n");
}

function getCharacterDetailText(character) {
  return [
    `${getCharacterDisplayName(character)}${localize("（", " (")}${character.rarity || "SSR"}${localize("）（", ") (")}${character.weapon || "-"}${localize("）", ")")}`,
    localize(`最终单发充能：${formatChargeNumber(getSingleShotChargeValue(character))}%`, `Final charge per shot: ${formatChargeNumber(getSingleShotChargeValue(character))}%`),
    ...getChargeWeaponDetailLines(character),
    getChargeBreakdown(character),
  ].join("\n");
}

function getCharacterDetailShareFileName(character, extension = "png") {
  const rawName = getCharacterLocalizedName(character) || character?.name || "character";
  const safeName = String(rawName).replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "") || "character";
  return `nikke-detail-${safeName}-${Date.now()}.${extension}`;
}

let characterDetailExportModulePromise = null;

function getCharacterDetailExportApi() {
  return {
    copyRichImageToClipboard,
    getCharacterDetailShareFileName,
    getCharacterLocalizedName,
    isMobileCopyChoiceRuntime,
    localize,
    openShareImagePreview,
    showToast,
    startProgressToast,
    stopProgressToast,
  };
}

async function loadCharacterDetailExportModule() {
  const runtime = await refreshAppRuntimeContext();
  const module = await runtime.loadAppModule("character-detail-export", () => importAppModule("./modules/character-detail-export.js"));
  module.setCharacterDetailExportApi(getCharacterDetailExportApi());
  characterDetailExportModulePromise = Promise.resolve(module);
  return module;
}

function clearCharacterDetailExportCache() {
  if (!characterDetailExportModulePromise) return;
  void characterDetailExportModulePromise.then((module) => module.clearCharacterDetailExportCache());
}

function markCharacterDetailPanelDirty() {
  characterDetailPanelHasLocalEdits = true;
  clearCharacterDetailExportCache();
}

function scheduleCharacterDetailExportPreload(character) {
  void loadCharacterDetailExportModule().then((module) => {
    module.setCharacterDetailExportApi(getCharacterDetailExportApi());
    module.scheduleCharacterDetailExportPreload(character);
  }).catch((error) => console.warn("character detail export preload module failed", error));
}

function closeCharacterDetailExportPreview() {
  document.querySelector(".character-detail-export-preview-backdrop")?.remove();
  if (!characterDetailExportModulePromise) return;
  void characterDetailExportModulePromise.then((module) => module.closeCharacterDetailExportPreview());
}

async function shareCharacterDetailImage(character) {
  const module = await loadCharacterDetailExportModule();
  module.setCharacterDetailExportApi(getCharacterDetailExportApi());
  return module.shareCharacterDetailImage(character);
}

const SEARCH_KEYWORD_SEPARATOR = /\s+/;
const CHINESE_NAME_CHAR_PATTERN = /[\u4e00-\u9fff]/;
const CHINESE_PINYIN_INITIALS_BY_CHAR_EXTRA = { "黑": "h", "火": "h", "布": "b", "狐": "h", "狸": "l", "糖": "t", "草": "c", "莓": "m", "圣": "s", "产": "c", "品": "p" };
const APP_CHINESE_PINYIN_INITIALS_BY_CHAR = globalThis.CHINESE_PINYIN_INITIALS_BY_CHAR || {"海":"h","伦":"l","珍":"z","藏":"c","阿":"a","妮":"n","斯":"s","超":"c","级":"j","巨":"j","星":"x","白":"b","雪":"x","公":"g","主":"z","重":"z","型":"x","武":"w","装":"z","特":"t","蕾":"l","娜":"n","豺":"c","狼":"l","桑":"s","迪":"d","鲁":"l","玛":"m","爱":"a","蜜":"m","莉":"l","雅":"y","诺":"n","帕":"p","卡":"k","梅":"m","登":"d","冰":"b","玫":"m","瑰":"g","德":"d","雷":"l","克":"k","毒":"d","蛇":"s","尼":"n","恩":"e","亚":"y","尔":"e","佩":"p","珀":"p","舒":"s","格":"g","索":"s","达":"d","闪":"s","亮":"l","兔":"t","女":"n","郎":"l","拉":"l","普":"p","贝":"b","利":"l","奥":"a","水":"s","母":"m","米":"m","地":"d","伙":"h","伴":"b","茨":"c","瓦":"w","伊":"y","希":"x","塔":"t","长":"c","发":"f","塞":"s","冬":"d","日":"r","甜":"t","心":"x","维":"w","红":"h","莲":"l","安":"a","天":"t","真":"z","的":"d","仆":"p","奇":"q","迹":"j","仙":"x","蒂":"d","饼":"b","干":"g","基":"j","里":"l","劳":"l","艾":"a","王":"w","耀":"y","夏":"x","吉":"j","儿":"e","华":"h","泰":"t","暗":"a","影":"y","哈":"h","兰":"l","渡":"d","鸦":"y","丽":"l","不":"b","友":"y","善":"s","提":"t","瑟":"s","波":"b","莱":"l","昂":"a","纳":"n","律":"l","恰":"q","那":"n","嘉":"j","夫":"f","桃":"t","乐":"l","丝":"s","机":"j","缘":"y","巧":"q","遇":"y","莎":"s","林":"l","霜":"s","车":"c","票":"p","之":"z","旅":"l","布":"b","静":"j","默":"m","轨":"g","道":"d","命":"m","运":"y","侣":"l","坎":"k","西":"x","乌":"w","明":"m","香":"x","零":"l","二":"e","期":"q","牡":"m","丹":"d","潘":"p","托":"t","姆":"m","战":"z","术":"s","升":"s","姬":"j","野":"y","露":"l","银":"y","逃":"t","生":"s","洛":"l","杨":"y","尤":"y","因":"y","杀":"s","手":"s","妻":"q","子":"z","可":"k","朵":"d","甲":"j","谢":"x","芙":"f","麦":"m","威":"w","罗":"l","樱":"y","花":"h","绽":"z","放":"f","小":"x","帽":"m","纯":"c","洁":"j","典":"d","理":"l","务":"w","漾":"y","薇":"w","泷":"l","奈":"n","鹤":"h","湾":"w","神":"s","琳":"l","蓝":"l","宝":"b","石":"s","富":"f","旺":"w","萝":"l","婷":"t","寒":"h","毗":"p","菲":"f","购":"g","物":"w","狂":"k","珊":"s","高":"g","洋":"y","莫":"m","森":"s","比":"b","涅":"n","境":"j","马":"m","美":"m","沃":"w","纶":"l","人":"r","鱼":"y","由":"y","千":"q","束":"s","罚":"f","灵":"l","魂":"h","锁":"s","链":"l","羁":"j","绊":"b","灰":"h","姑":"g","娘":"n","皇":"h","冠":"g","一":"y","浪":"l","漫":"m","色":"s","与":"y","惊":"j","吓":"x","怪":"g","盗":"d","忍":"r","者":"z","年":"n","代":"d","透":"t","视":"s","眼":"y","敏":"m","婴":"y","宁":"n"};
const CHARACTER_SEARCH_ALIAS_RULES = [
  { names: ["布兰儿"], aliases: ["白兔"] },
  { names: ["诺雅尔", "诺亚尔"], aliases: ["黑兔"] },
  { names: ["阿妮斯:闪耀夏日", "阿妮斯：闪耀夏日", "阿妮斯-闪耀夏日", "阿妮斯闪耀夏日"], aliases: ["水阿"] },
  { names: ["婴宁"], aliases: ["狐狸"] },
  { names: ["迪塞尔:冬日甜心", "迪塞尔：冬日甜心", "迪塞尔-冬日甜心", "迪塞尔冬日甜心"], aliases: ["草莓糖", "火糖"] },
  { names: ["安妮:奇迹仙女", "安妮：奇迹仙女", "安妮-奇迹仙女", "安妮奇迹仙女"], aliases: ["圣安"] },
  { names: ["红莲:暗影", "红莲：暗影", "红莲-暗影", "红莲暗影"], aliases: ["黑莲"] },
  { names: ["索达:闪亮兔女郎", "索达：闪亮兔女郎", "索达-闪亮兔女郎", "索达闪亮兔女郎"], aliases: ["兔索"] },
  { names: ["布丽德:静默轨道", "布丽德：静默轨道", "布丽德-静默轨道", "布丽德静默轨道"], aliases: ["火布"] },
  { names: ["索林:霜雪车票", "索林：霜之旅票", "索林-霜雪车票", "索林霜雪车票"], aliases: ["冬索"] },
];

function normalizeSearchInput(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .trim();
}

function getSearchSourceVariants(value) {
  const normalized = normalizeSearchInput(value);
  if (!normalized) return [];
  const compact = getCharacterAliasKey(normalized);
  return [...new Set([normalized, compact].filter(Boolean))];
}

function getSearchKeywords(value) {
  return normalizeSearchInput(value).split(SEARCH_KEYWORD_SEPARATOR).filter(Boolean);
}

function getCharacterSearchInitials(text = "") {
  const normalizedText = String(text || "");
  if (!normalizedText) return "";
  let initials = "";
  for (const character of normalizedText) {
    if (/\s/.test(character)) continue;
    if (/^[A-Za-z0-9]$/.test(character)) {
      initials += character.toLowerCase();
      continue;
    }
    if (!CHINESE_NAME_CHAR_PATTERN.test(character)) continue;
    const initial = APP_CHINESE_PINYIN_INITIALS_BY_CHAR[character] || CHINESE_PINYIN_INITIALS_BY_CHAR_EXTRA[character];
    if (initial) initials += initial;
  }
  return initials;
}

function getCharacterEnglishName(character) {
  const englishName = String(character?.enName || "").trim();
  if (!englishName || englishName === character?.name) return "";
  return englishName;
}

function getCharacterDisplayName(character) {
  const englishName = getCharacterEnglishName(character);
  if (!englishName) return character.name;
  return isEnglishLanguage() ? `${englishName} (${character.name})` : `${character.name}（${englishName}）`;
}

function getCharacterSearchText(character) {
  const rawFields = [character.name, character.enName, character.slug, character.nameCodeName]
    .filter(Boolean)
    .flatMap((value) => getSearchSourceVariants(value));
  const aliasCandidates = getCharacterSearchAliases(character);
  const searchSources = [...rawFields, ...aliasCandidates.flatMap((value) => getSearchSourceVariants(value))];
  const initialCandidates = searchSources.flatMap((value) => {
    const initial = getCharacterSearchInitials(value);
    if (!initial) return [];
    const compactValue = value.replace(/[:\-：\s]/g, "");
    const compactInitial = getCharacterSearchInitials(compactValue);
    return compactInitial && compactInitial !== initial ? [initial, compactInitial] : [initial];
  });

  return [...new Set([...searchSources, ...initialCandidates])]
    .filter(Boolean)
    .join(" ");
}

function getCharacterAliasKey(value) {
  return normalizeSearchInput(value).replace(/[\s:：\-—–_]/g, "");
}

function getCharacterSearchAliases(character) {
  const aliases = [];
  const directAliases = Array.isArray(character?.searchAliases) ? character.searchAliases : [];

  for (const alias of directAliases) {
    const normalizedAlias = normalizeSearchInput(alias);
    if (normalizedAlias) aliases.push(normalizedAlias);
  }
  const targets = [character?.name, character?.enName, character?.slug, character?.nameCodeName]
    .filter(Boolean)
    .map((value) => getCharacterAliasKey(value));
  const targetSet = new Set(targets);

  for (const rule of CHARACTER_SEARCH_ALIAS_RULES) {
    const ruleNames = (rule.names || []).map((value) => getCharacterAliasKey(value));
    const hasMatch = ruleNames.some((name) => name && targetSet.has(name));
    if (!hasMatch) continue;

    for (const alias of rule.aliases || []) {
      const normalizedAlias = normalizeSearchInput(alias);
      if (normalizedAlias) aliases.push(normalizedAlias);
    }
  }

  return [...new Set(aliases)];
}

function matchesSearchKeyword(searchText, keyword) {
  if (!keyword) return false;
  const tokens = searchText.split(/\s+/).filter(Boolean);
  return tokens.some((token) => {
    if (!token) return false;
    if (keyword.length <= 2) {
      return token.startsWith(keyword);
    }
    return token.includes(keyword);
  });
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
      <span>${escapeHtml(localize("右键详情", "Right-click details"))}</span>
    </div>
    <div class="character-tooltip-meta">
      #${index + 1} · ${escapeHtml(character.rarity || "SSR")} · ${escapeHtml(character.weapon)} · ${escapeHtml(character.burstStage)} · ${escapeHtml(getRegionLabel(character))}
    </div>
    <div class="character-tooltip-main">${escapeHtml(localize("最终单发", "Final per shot"))} ${formatChargeNumber(getSingleShotChargeValue(character))}%</div>
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

function getCharacterDetailPanel() {
  if (!document.querySelector(".character-detail-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "character-detail-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.append(backdrop);
  }
  let panel = document.querySelector(".character-detail-panel");
  if (!panel) {
    panel = document.createElement("aside");
    panel.className = "character-detail-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    document.body.append(panel);
  }
  return panel;
}

function closeCharacterDetailPanel() {
  if (characterDetailPanelDraft?.region !== "global") {
    void syncCharacterDetailPanelChanges();
  }
  document.querySelector(".character-detail-panel")?.classList.remove("show");
  document.querySelector(".character-detail-backdrop")?.classList.remove("show");
  document.body.classList.remove("has-character-detail-panel");
  characterDetailPanelDraft = null;
  characterDetailPanelRegion = null;
  characterDetailPanelHasLocalEdits = false;
  clearCharacterDetailExportCache();
}

function normalizeThirdPartyDataRegion(region = null) {
  const candidate = region || characterDetailPanelRegion || state.filters?.region || "cn";
  return String(candidate).toLowerCase() === "global" ? "global" : "cn";
}

function isRegionalStorageValue(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value)
    && (Object.prototype.hasOwnProperty.call(value, "cn") || Object.prototype.hasOwnProperty.call(value, "global")));
}

function readJsonStorageValue(storageKey, fallback = {}) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (error) {
    console.error("[ThirdPartySync] regional storage read exception", { storageKey, error });
    return fallback;
  }
}

function getRegionalObjectStorageValue(storageKey, region = null) {
  const normalizedRegion = normalizeThirdPartyDataRegion(region);
  const parsed = readJsonStorageValue(storageKey, {});
  if (isRegionalStorageValue(parsed)) {
    const value = parsed[normalizedRegion];
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }
  return normalizedRegion === "cn" && parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

function saveRegionalObjectStorageValue(storageKey, value, region = null) {
  const normalizedRegion = normalizeThirdPartyDataRegion(region);
  const parsed = readJsonStorageValue(storageKey, {});
  const scoped = isRegionalStorageValue(parsed) ? { ...parsed } : { cn: parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}, global: {} };
  scoped[normalizedRegion] = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  try {
    localStorage.setItem(storageKey, JSON.stringify(scoped));
  } catch (error) {
    console.error("[ThirdPartySync] regional storage write exception", { storageKey, region: normalizedRegion, error });
  }
}

function getRegionalScalarStorageValue(storageKey, region = null, fallback = undefined) {
  const normalizedRegion = normalizeThirdPartyDataRegion(region);
  const parsed = readJsonStorageValue(storageKey, fallback);
  if (isRegionalStorageValue(parsed)) return parsed[normalizedRegion] ?? fallback;
  return normalizedRegion === "cn" ? parsed : fallback;
}

function saveRegionalScalarStorageValue(storageKey, value, region = null) {
  const normalizedRegion = normalizeThirdPartyDataRegion(region);
  const parsed = readJsonStorageValue(storageKey, null);
  const scoped = isRegionalStorageValue(parsed) ? { ...parsed } : { cn: parsed, global: null };
  scoped[normalizedRegion] = value;
  try {
    localStorage.setItem(storageKey, JSON.stringify(scoped));
  } catch (error) {
    console.error("[ThirdPartySync] regional storage write exception", { storageKey, region: normalizedRegion, error });
  }
}

function sanitizeThirdPartyResearchLevel(value) {
  const level = Number.parseInt(value, 10);
  if (!Number.isFinite(level)) return 1;
  return Math.max(0, level);
}

function sanitizeThirdPartyLevelValue(value) {
  const level = Math.floor(Number.parseInt(value, 10));
  if (!Number.isFinite(level) || level <= 0) return null;
  return Math.min(CHARACTER_DETAIL_LEVEL_MAX, level);
}

function normalizeThirdPartyCharacterName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[\u200b-\u200d]/g, "")
    .replace(/：/g, ":")
    .replace(/\+$/, "")
    .replace(/\u85cf\u62ef|\u85cf/g, "")
    .replace(/[\(\)\[\]\-_=,.]/g, "");
}

function splitThirdPartyBreakthroughLevel(value) {
  const level = Math.floor(Number.parseInt(value, 10));
  if (!Number.isFinite(level) || level < 0) return null;
  if (level <= 3) return { breakthroughCount: level, coreEnhanceLevel: 0 };
  return {
    breakthroughCount: 3,
    coreEnhanceLevel: Math.min(7, Math.max(0, level - 3)),
  };
}

function composeThirdPartyBreakthroughLevel(breakthroughCount, coreEnhanceLevel = 0) {
  const normalizedBreakthrough = Math.max(0, Math.floor(Number(breakthroughCount) || 0));
  const normalizedCore = Math.max(0, Math.floor(Number(coreEnhanceLevel) || 0));
  if (normalizedBreakthrough >= 3) return 3 + normalizedCore;
  return normalizedBreakthrough;
}

function collectThirdPartyPayloadNodes(payload) {
  const normalized = normalizeThirdPartyPayload(payload);
  const nodes = [];
  const queue = [normalized];
  const seen = new Set();

  while (queue.length && nodes.length < 8) {
    const current = queue.shift();
    if (!current || typeof current !== "object") continue;
    if (seen.has(current)) continue;
    seen.add(current);

    if (Array.isArray(current)) {
      current.forEach((item) => {
        if (item && typeof item === "object") {
          queue.push(item);
        }
      });
      continue;
    }

    nodes.push(current);

    const nestedPayload = normalizeThirdPartyPayload(current.payload);
    const nestedData = normalizeThirdPartyPayload(current.data);
    const nestedResult = normalizeThirdPartyPayload(current.result);
    const nestedCharacters = normalizeThirdPartyPayload(current.characters);
    const nestedCharacterList = normalizeThirdPartyPayload(current.characterList);
    const nestedCharacterInfos = normalizeThirdPartyPayload(current.characterInfos);
    if (nestedPayload && !Array.isArray(nestedPayload) && typeof nestedPayload === "object") {
      queue.push(nestedPayload);
    }
    if (nestedData && !Array.isArray(nestedData) && typeof nestedData === "object") {
      queue.push(nestedData);
    }
    if (nestedResult && !Array.isArray(nestedResult) && typeof nestedResult === "object") {
      queue.push(nestedResult);
    }
    if (nestedCharacters && !Array.isArray(nestedCharacters) && typeof nestedCharacters === "object") {
      queue.push(nestedCharacters);
    }
    if (nestedCharacterList && !Array.isArray(nestedCharacterList) && typeof nestedCharacterList === "object") {
      queue.push(nestedCharacterList);
    }
    if (nestedCharacterInfos && !Array.isArray(nestedCharacterInfos) && typeof nestedCharacterInfos === "object") {
      queue.push(nestedCharacterInfos);
    }

    Object.values(current).forEach((value) => {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item && typeof item === "object") {
            queue.push(item);
          }
        });
        return;
      }
      queue.push(value);
    });
  }

  return nodes;
}

function resolveThirdPartyPayloadContainer(payload) {
  if (Array.isArray(payload)) return payload;
  const nodes = collectThirdPartyPayloadNodes(payload);
  for (const node of nodes) {
    if (Array.isArray(node?.payload)) return node.payload;
    if (Array.isArray(node?.data)) return node.data;
    if (Array.isArray(node?.characterList)) return node.characterList;
    if (Array.isArray(node?.characters)) return node.characters;
    if (Array.isArray(node?.characterInfos)) return node.characterInfos;
    if (Array.isArray(node?.result)) return node.result;
    if (Array.isArray(node?.result?.data)) return node.result.data;
    if (Array.isArray(node?.result?.characterList)) return node.result.characterList;
    if (Array.isArray(node?.items)) return node.items;
  }
  return nodes[0] || {};
}

function resolveThirdPartyObjectPayload(payload) {
  const candidateFields = [
    "synchronizerLevel",
    "characterLevel",
    "fireType",
    "defenseType",
    "supportType",
    "elysionCorp",
    "missilisCorp",
    "tetraCorp",
    "pilgrimCorp",
    "abnormalCorp",
    "breakthroughLevel",
    "collectionRarity",
    "collectionLv",
    "skill1Lv",
    "skill2Lv",
    "ultiSkillLv",
    "characterName",
    "characterId",
    "level",
  ];
  const candidates = collectThirdPartyPayloadNodes(payload);
  for (const candidate of candidates) {
    const normalized = normalizeThirdPartyPayload(candidate);
    if (!normalized || Array.isArray(normalized) || typeof normalized !== "object") continue;
    if (candidateFields.some((field) => Object.prototype.hasOwnProperty.call(normalized, field))) {
      return normalized;
    }
  }
  for (const candidate of candidates) {
    const normalized = normalizeThirdPartyPayload(candidate);
    if (!normalized || Array.isArray(normalized) || typeof normalized !== "object") continue;
    return normalized;
  }
  return {};
}

function extractThirdPartyCharacterList(payload) {
  if (Array.isArray(payload)) return payload;
  const nodes = collectThirdPartyPayloadNodes(payload);
  for (const node of nodes) {
    if (Array.isArray(node)) return node;
    if (Array.isArray(node?.characterList)) return node.characterList;
    if (Array.isArray(node?.data?.characterList)) return node.data.characterList;
    if (Array.isArray(node?.result?.characterList)) return node.result.characterList;
    if (Array.isArray(node?.result?.data)) return node.result.data;
    if (Array.isArray(node?.characters)) return node.characters;
    if (Array.isArray(node?.characterInfos)) return node.characterInfos;
    if (Array.isArray(node?.payload) && Array.isArray(node.payload.characterList)) return node.payload.characterList;
    if (Array.isArray(node?.payload) && Array.isArray(node.payload.data)) return node.payload.data;
    if (Array.isArray(node?.payload?.data)) return node.payload.data;
    if (Array.isArray(node?.data)) return node.data;
  }
  return [];
}

function resolveThirdPartyField(payload, field) {
  const nodes = collectThirdPartyPayloadNodes(payload);
  for (const node of nodes) {
    if (node?.[field] != null) return node[field];
  }
  return undefined;
}

function findCharacterByThirdPartyName(characterName, characterId = "", fallbackNames = []) {
  if (characterId) {
    const byId = getCharacterById(characterId);
    if (byId) return byId;
  }
  const targetNames = [characterName, ...fallbackNames]
    .map((name) => normalizeThirdPartyCharacterName(name))
    .filter(Boolean);
  if (!targetNames.length) return null;
  return (
    CHARACTERS.find((character) => {
      const candidateNames = [
        character.name,
        character.enName,
        character.slug,
        getExternalEquipmentCharacterName(character),
        String(getStandardCharacterAssetEntry(character)?.assetName || ""),
      ].map((entry) => normalizeThirdPartyCharacterName(entry));
      return targetNames.some((targetName) => candidateNames.includes(targetName));
    }) || null
  );
}

function applyThirdPartyUserInfoToLocalState(syncData, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const rootKeys = Array.isArray(syncData)
    ? ["[array]", `len=${syncData.length}`]
    : syncData && typeof syncData === "object"
      ? Object.keys(syncData)
      : [];

  const root = normalizeThirdPartyPayload(syncData);
  const payloadContainer = resolveThirdPartyPayloadContainer(root);
  const payload = resolveThirdPartyObjectPayload(root);
  const payloadKeys = payload && typeof payload === "object" ? Object.keys(payload) : [];
  console.log("[ThirdPartySync] apply payload", {
    rootKeys,
    payloadKeys,
    payloadContainerType: Array.isArray(payloadContainer) ? "array" : typeof payloadContainer,
    payloadContainerLength: Array.isArray(payloadContainer) ? payloadContainer.length : undefined,
  });
  const globalLevel = sanitizeThirdPartyLevelValue(resolveThirdPartyField(payload, "synchronizerLevel"));
  const userCharacterLevel = sanitizeThirdPartyLevelValue(resolveThirdPartyField(payload, "characterLevel"));
  const userInfoLevel = Number.isFinite(globalLevel) ? globalLevel : userCharacterLevel;
  const hasLevelAnchor = Number.isFinite(userInfoLevel);
  console.log("[ThirdPartySync] resolved user info level", {
    globalLevel,
    userCharacterLevel,
    resolvedUserInfoLevel: userInfoLevel,
    hasLevelAnchor,
  });
  if (Number.isFinite(userInfoLevel)) saveCharacterDetailLevel(userInfoLevel, dataRegion);

  const classResearchPayloadMap = {
    fireType: "class:\u706b\u529b",
    defenseType: "class:\u9632\u5fa1",
    supportType: "class:\u8d21\u52a9",
    elysionCorp: "company:\u6781\u4e50\u51c0\u571f",
    missilisCorp: "company:\u7c73\u897f\u5229\u65af",
    tetraCorp: "company:\u6cf0\u7279\u62c9",
    pilgrimCorp: "company:\u671d\u5723\u8005",
    abnormalCorp: "company:\u53cd\u5e38",
  };
  Object.entries(classResearchPayloadMap).forEach(([field, researchKey]) => {
    const value = sanitizeThirdPartyLevelValue(resolveThirdPartyField(payload, field));
    if (Number.isFinite(value)) setResearchLevel(researchKey, value, dataRegion);
  });

  const characterList = extractThirdPartyCharacterList(payloadContainer);
  console.log("[ThirdPartySync] resolved character list", {
    count: Array.isArray(characterList) ? characterList.length : 0,
    hasCharacterList: Array.isArray(characterList),
  });
  if (!Array.isArray(characterList) || !characterList.length) {
    console.warn("[ThirdPartySync] no character records to apply", { rootKeys, payloadKeys });
    return;
  }
  let matchedCount = 0;
  let appliedCount = 0;
  const unmatchedSamples = [];
  const matchedSamples = [];
  const issues = [];
  const warnings = [];

  characterList.forEach((record, index) => {
    try {
    const character = findCharacterByThirdPartyName(record?.characterName, record?.characterId || record?.id);
    if (!character) {
      unmatchedSamples.push({
        index,
        name: record?.characterName,
        id: record?.characterId || record?.id,
      });
      issues.push({
        code: "character-name-unmatched",
        index,
        name: record?.characterName,
        id: record?.characterId || record?.id,
      });
      console.warn("[ThirdPartySync] character name match failed", unmatchedSamples[unmatchedSamples.length - 1]);
      return;
    }
    matchedCount += 1;
    const matchedName = record?.characterName || record?.characterId || record?.id;
    matchedSamples.push({
      index,
      sourceName: record?.characterName,
      sourceId: record?.characterId || record?.id,
      characterId: character.id,
      characterName: character.name,
    });
    if (!hasLevelAnchor) {
      const level = sanitizeThirdPartyLevelValue(record?.level ?? record?.characterLevel);
      if (Number.isFinite(level)) {
        saveCharacterDetailLevel(level, dataRegion);
      }
    }

    const breakthrough = splitThirdPartyBreakthroughLevel(record?.breakthroughLevel);
    if (record?.breakthroughLevel != null && !breakthrough) {
      issues.push({ code: "invalid-breakthrough-level", name: matchedName, value: record.breakthroughLevel });
      console.warn("[ThirdPartySync] breakthrough level could not be applied", { name: matchedName, value: record.breakthroughLevel });
    }
    if (breakthrough) saveCharacterBreakthroughCoreDetail(character, breakthrough, dataRegion);

    if (record?.collectionRarity != null || record?.collectionLv != null) {
      const existingCollectible = getCharacterCollectibleDetail(character, dataRegion);
      const rawRarity = String(record?.collectionRarity || "").trim().toUpperCase();
      if (rawRarity === "SSR") {
        warnings.push({ code: "collection-rarity-ssr-fallback", name: matchedName, from: "SSR", to: "SR" });
        console.warn("[ThirdPartySync] collection rarity SSR fallback to SR", { name: matchedName });
      } else if (rawRarity && !["R", "SR"].includes(rawRarity)) {
        issues.push({ code: "invalid-collection-rarity", name: matchedName, value: record.collectionRarity });
        console.warn("[ThirdPartySync] collection rarity could not be applied", { name: matchedName, value: record.collectionRarity });
      }
      if (record?.collectionLv != null && !Number.isFinite(Number(record.collectionLv))) {
        issues.push({ code: "invalid-collection-level", name: matchedName, value: record.collectionLv });
        console.warn("[ThirdPartySync] collection level could not be applied", { name: matchedName, value: record.collectionLv });
      }
      saveCharacterCollectibleDetail(character, {
        rarity: record?.collectionRarity != null
          ? sanitizeCollectibleRarity(record.collectionRarity)
          : existingCollectible.rarity,
        level: record?.collectionLv != null
          ? sanitizeCollectibleLevel(record.collectionLv)
          : existingCollectible.level,
      }, dataRegion);
    }

    const skill1Lv = sanitizeCharacterSkillLevel(record?.skill1Lv);
    const skill2Lv = sanitizeCharacterSkillLevel(record?.skill2Lv);
    const ultiSkillLv = sanitizeCharacterSkillLevel(record?.ultiSkillLv);
    const hasRecordSkill = record?.skill1Lv != null || record?.skill2Lv != null || record?.ultiSkillLv != null;
    if (hasRecordSkill) {
      saveCharacterSkillLevels(character, { skill1: skill1Lv, skill2: skill2Lv, burst: ultiSkillLv }, dataRegion);
    }
    const cubeApplied = applyThirdPartyCharacterCube(character, record, { issues }, dataRegion);
    const equipmentLevelsApplied = applyThirdPartyCharacterEquipmentLevels(character, record, { issues }, dataRegion);
    if (Number.isFinite(Number(record?.level ?? record?.characterLevel)) || record?.breakthroughLevel != null || record?.collectionRarity != null || record?.collectionLv != null || hasRecordSkill || cubeApplied || equipmentLevelsApplied) {
      appliedCount += 1;
    }
    } catch (error) {
      issues.push({
        code: "character-apply-exception",
        index,
        name: record?.characterName,
        id: record?.characterId || record?.id,
      });
      console.error("[ThirdPartySync] character apply exception", {
        index,
        name: record?.characterName,
        id: record?.characterId || record?.id,
        error,
      });
    }
  });
  console.log("[ThirdPartySync] apply summary", {
    totalRecords: characterList.length,
    matchedCount,
    appliedCount,
    matchedSamples,
    unmatchedCount: unmatchedSamples.length,
    unmatchedSamples,
    issueCount: issues.length,
    issues,
    warningCount: warnings.length,
    warnings,
  });
  }


function getCharacterDetailUserInfoSnapshot(region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const classResearchPayloadMap = {
    "class:火力": "fireType",
    "class:防御": "defenseType",
    "class:辅助": "supportType",
  };
  const companyResearchPayloadMap = {
    "company:极乐净土": "elysionCorp",
    "company:米西利斯": "missilisCorp",
    "company:泰特拉": "tetraCorp",
    "company:朝圣者": "pilgrimCorp",
    "company:反常": "abnormalCorp",
  };
  const classResearch = getResearchLevelDefinitions().reduce((acc, item) => {
    const key = item.key;
    if (!key.startsWith("class:")) return acc;
    const payloadKey = classResearchPayloadMap[key];
    if (!payloadKey) return acc;
    acc[payloadKey] = sanitizeThirdPartyResearchLevel(getStoredResearchLevels(dataRegion)[key]);
    return acc;
  }, {});
  const companyResearch = getResearchLevelDefinitions().reduce((acc, item) => {
    const key = item.key;
    if (!key.startsWith("company:")) return acc;
    const payloadKey = companyResearchPayloadMap[key];
    if (!payloadKey) return acc;
    acc[payloadKey] = sanitizeThirdPartyResearchLevel(getStoredResearchLevels(dataRegion)[key]);
    return acc;
  }, {});
  return {
    ...classResearch,
    ...companyResearch,
    synchronizerLevel: sanitizeCharacterDetailLevel(getStoredCharacterLevels(dataRegion)),
  };
}

function getCharacterDetailCharacterSnapshot(character, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const skills = getCharacterSkillLevels(character, dataRegion);
  const breakthrough = getCharacterBreakthroughCoreDetail(character, dataRegion);
  const collectible = getCharacterCollectibleDetail(character, dataRegion);
  const cube = getCharacterDetailCube(character, dataRegion);
  return {
    characterName: getExternalEquipmentCharacterName(character),
    breakthroughLevel: composeThirdPartyBreakthroughLevel(
      breakthrough?.breakthroughCount,
      breakthrough?.coreEnhanceLevel,
    ),
    collectionRarity: sanitizeCollectibleRarity(collectible?.rarity),
    collectionLv: sanitizeCollectibleLevel(collectible?.level),
    skill1Lv: sanitizeCharacterSkillLevel(skills?.skill1),
    skill2Lv: sanitizeCharacterSkillLevel(skills?.skill2),
    ultiSkillLv: sanitizeCharacterSkillLevel(skills?.burst),
    cubeName: getThirdPartyCubeName(cube),
    cubeLv: sanitizeDetailCubeLevel(cube?.level),
  };
}

function getThirdPartyCubeName(cube) {
  const level = sanitizeDetailCubeLevel(cube?.level);
  const type = normalizeCharacterDetailCubeType(cube?.type);
  return level > 0 && getCharacterDetailCubeOption(type) ? type.toUpperCase() : "";
}

function normalizeThirdPartyCubeType(value) {
  const raw = String(value ?? "").trim();
  if (!raw || /^(?:0|none|null|无魔方)$/i.test(raw)) return "";
  const normalized = normalizeCharacterDetailCubeType(raw);
  return getCharacterDetailCubeOption(normalized) ? normalized : "";
}

function applyThirdPartyCharacterCube(character, record, diagnostics = null, region = null) {
  if (record?.cubeName == null && record?.cubeLv == null) return false;
  const rawLevel = record?.cubeLv;
  if (rawLevel === null || rawLevel === undefined || rawLevel === "" || !Number.isFinite(Number(rawLevel))) {
    diagnostics?.issues?.push({ code: "invalid-cube-level", name: record?.characterName || "", value: rawLevel, message: "魔方等级无法解析" });
    console.warn("[ThirdPartySync] cube level could not be applied", { name: record?.characterName || "", cubeName: record?.cubeName, cubeLv: rawLevel });
    return false;
  }
  const level = sanitizeDetailCubeLevel(rawLevel);
  if (level <= 0) {
    const currentCube = getCharacterDetailCube(character, region);
    saveCharacterDetailCube(character, { type: currentCube.type, level: 0 }, region);
    return true;
  }
  const type = normalizeThirdPartyCubeType(record?.cubeName);
  if (!type) {
    diagnostics?.issues?.push({ code: "invalid-cube-name", name: record?.characterName || "", value: record?.cubeName, message: "魔方名称无法匹配本地魔方" });
    console.warn("[ThirdPartySync] cube name could not be applied", { name: record?.characterName || "", cubeName: record?.cubeName, cubeLv: rawLevel });
    return false;
  }
  saveCharacterDetailCube(character, { type, level }, region);
  return true;
}

function applyThirdPartyCharacterEquipmentLevels(character, record, diagnostics = null, region = null) {
  if (!Array.isArray(record?.equipmentInfos)) return false;
  const partsBySlotNo = ["头", "衣", "手", "鞋"];
  let applied = false;
  record.equipmentInfos.forEach((item) => {
    const slotNo = getExternalEquipmentSlotNo(item);
    const rawLevel = item?.lv;
    // getUserInfo 当前可能只返回装备词条，不返回装备等级；缺少等级时沿用本站默认值/本地保存值。
    if (rawLevel === null || rawLevel === undefined || rawLevel === "") return;
    if (slotNo === null || !Number.isFinite(Number(rawLevel))) {
      diagnostics?.issues?.push({ code: "invalid-equipment-level", name: record?.characterName || "", slotNo: item?.slotNo, value: rawLevel, message: "装备部位或等级无法解析" });
      console.warn("[ThirdPartySync] equipment level could not be applied", { name: record?.characterName || "", slotNo: item?.slotNo, lv: rawLevel });
      return;
    }
    saveCharacterEquipmentLevel(character, partsBySlotNo[slotNo], rawLevel, region);
    applied = true;
  });
  return applied;
}

function captureCharacterDetailPanelDraft(character, region = null) {
  if (!character?.id) {
    characterDetailPanelDraft = null;
    characterDetailPanelHasLocalEdits = false;
    return;
  }
  const dataRegion = normalizeThirdPartyDataRegion(region);
  characterDetailPanelHasLocalEdits = false;
  characterDetailPanelDraft = {
    characterId: String(character.id),
    region: dataRegion,
    userInfo: getCharacterDetailUserInfoSnapshot(dataRegion),
    character: getCharacterDetailCharacterSnapshot(character, dataRegion),
  };
}

function normalizeThirdPartyPayload(payload) {
  return payload && typeof payload === "object" ? payload : {};
}

function isPayloadEqual(left, right) {
  return JSON.stringify(left || null) === JSON.stringify(right || null);
}

async function syncCharacterDetailPanelChanges() {
  const draft = characterDetailPanelDraft;
  if (!draft?.characterId) return;
  if (draft.region === "global") return;
  if (characterDetailPanelSyncPromise) return characterDetailPanelSyncPromise;
  const character = getCharacterById(Number(draft.characterId));
  if (!character) return;
  const dataRegion = normalizeThirdPartyDataRegion(draft.region);
  const task = (async () => {
    const nextUserInfo = getCharacterDetailUserInfoSnapshot(dataRegion);
    const nextCharacter = getCharacterDetailCharacterSnapshot(character, dataRegion);
    const characterChanged = !isPayloadEqual(draft.character, nextCharacter);
    const userInfoChanged = !isPayloadEqual(draft.userInfo, nextUserInfo);
    if (!characterChanged && !userInfoChanged) {
      return;
    }
    const requests = [];
    if (characterChanged) {
      const characterName = nextCharacter.characterName || draft.character?.characterName;
      if (characterName) {
        requests.push(updateThirdPartyUserCharacter([nextCharacter]));
      }
    }
    if (userInfoChanged) {
      requests.push(updateThirdPartyUserInfo(nextUserInfo));
    }
    if (!requests.length) return;
    const results = await Promise.allSettled(requests);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.warn(index === 0 ? "[CharacterDetailSync] character update failed" : "[CharacterDetailSync] user info update failed", result.reason);
      }
    });
  })().finally(() => {
    if (characterDetailPanelSyncPromise === task) characterDetailPanelSyncPromise = null;
  });
  characterDetailPanelSyncPromise = task;
  return task;
}

function positionCharacterDetailPanel(panel) {
  const width = Math.min(520, Math.max(320, window.innerWidth - 24));
  panel.style.width = `${width}px`;
  const height = Math.min(panel.scrollHeight || 680, window.innerHeight - 24);
  const left = Math.max((window.innerWidth - width) / 2, 12);
  const top = Math.max((window.innerHeight - height) / 2, 12);
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function getDetailIconHexMarkup() {
  return `
    <svg class="character-detail-icon-bg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="detailIconHexBg" cx="50%" cy="34%" r="62%">
          <stop offset="0" stop-color="#4c586d"></stop>
          <stop offset=".62" stop-color="#242c3a"></stop>
          <stop offset="1" stop-color="#111722"></stop>
        </radialGradient>
      </defs>
      <polygon points="50,2 93,26 93,74 50,98 7,74 7,26" fill="url(#detailIconHexBg)" stroke="#ffffff" stroke-opacity=".66" stroke-width="5"></polygon>
    </svg>
  `;
}

function getDetailStarSvgMarkup(className = "", fill = "#d0d5df") {
  return `
    <svg class="character-detail-star-svg${className ? ` ${escapeHtml(className)}` : ""}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <polygon points="50,0 62,36 100,50 62,64 50,100 38,64 0,50 38,36" fill="${escapeHtml(fill)}" transform="rotate(45 50 50)"></polygon>
    </svg>
  `;
}

function getCharacterDetailIconChip(src, label, extraClass = "") {
  const isPlain = String(extraClass || "").split(/\s+/).includes("is-plain");
  return `
    <span class="character-detail-icon-chip${extraClass ? ` ${escapeHtml(extraClass)}` : ""}" title="${escapeHtml(label)}">
      ${isPlain ? "" : getDetailIconHexMarkup()}
      <img src="${escapeHtml(src)}" alt="${escapeHtml(label)}" loading="lazy" />
    </span>
  `;
}

function getCharacterDetailResearchChip(src, label, researchKey, level, readOnly = false) {
  const readOnlyAttributes = readOnly ? ' data-third-party-read-only aria-disabled="true"' : "";
  return `
    <button class="character-detail-research-chip" type="button" data-research-level-trigger="${escapeHtml(researchKey)}" title="${escapeHtml(label)}"${readOnlyAttributes}>
      <span class="character-detail-icon-chip">
        ${getDetailIconHexMarkup()}
        <img src="${escapeHtml(src)}" alt="${escapeHtml(label)}" loading="lazy" />
        <small>LV.${escapeHtml(level)}</small>
      </span>
    </button>
  `;
}

function getNikkeDetailIconPath(fileName) {
  return getImmutableAssetUrl(`assets/icons/ui/nikke-detail/${encodeURIComponent(fileName)}`);
}

function getDetailWeaponIcon(character) {
  const weapon = String(character?.weapon || "AR").trim();
  return getNikkeDetailIconPath(`nikke-${weapon.toLowerCase() || "ar"}.webp`);
}

function getDetailBurstIcon(character) {
  const firstStage = isAnyBurstStageCharacter(character) ? "B1" : String(character?.burstStage || "B0").split("/")[0];
  const burstIconMap = {
    B1: "1",
    B2: "2",
    B3: "3",
    "Λ": "all",
  };
  return getNikkeDetailIconPath(`nikke-${burstIconMap[firstStage] || "1"}.webp`);
}

function getDetailElementIcon(character) {
  const elementIconMap = {
    燃烧: "fire",
    风压: "wind",
    铁甲: "iron",
    电击: "electric",
    水冷: "water",
  };
  return getNikkeDetailIconPath(`nikke-${elementIconMap[character?.element] || "fire"}.svg`);
}

function getDetailCompanyIcon(character) {
  const companyIconMap = {
    极乐净土: "elysion",
    米西利斯: "missilis",
    泰特拉: "tetra",
    朝圣者: "pilgrim",
    反常: "abnormal",
  };
  return getNikkeDetailIconPath(`nikke-${companyIconMap[character?.company] || "elysion"}.webp`);
}

function getDetailClassIcon(character) {
  const classType = String(character?.classType || "火力").replace(/型$/, "") || "火力";
  const classIconMap = {
    火力: "attacker",
    防御: "defender",
    辅助: "supporter",
  };
  return getNikkeDetailIconPath(`nikke-${classIconMap[classType] || "attacker"}.webp`);
}

function getEquipmentIconPath(character, equipmentPart) {
  const classType = String(character?.classType || "火力").replace(/型$/, "") || "火力";
  return getImmutableAssetUrl(`assets/icons/ui/equipment/${encodeURIComponent(`${classType}${equipmentPart}.webp`)}`);
}

function getEquipmentLevelStorageKey() {
  return "nikke-character-equipment-levels-v1";
}

function getStoredEquipmentLevels(region = null) {
  return getRegionalObjectStorageValue(getEquipmentLevelStorageKey(), region);
}

function saveStoredEquipmentLevels(levels, region = null) {
  saveRegionalObjectStorageValue(getEquipmentLevelStorageKey(), levels, region);
}

function sanitizeEquipmentLevel(value) {
  const level = Math.max(0, Math.floor(Number(value) || 0));
  return Math.min(5, level);
}

function getCharacterEquipmentLevel(character, part, fallback = 5, region = null) {
  if (!character?.id || !part) return sanitizeEquipmentLevel(fallback);
  const saved = getStoredEquipmentLevels(region)[character.id]?.[part];
  return saved === undefined ? sanitizeEquipmentLevel(fallback) : sanitizeEquipmentLevel(saved);
}

function saveCharacterEquipmentLevel(character, part, value, region = null) {
  if (!character?.id || !part) return;
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const levels = getStoredEquipmentLevels(dataRegion);
  levels[character.id] = {
    ...(levels[character.id] && typeof levels[character.id] === "object" ? levels[character.id] : {}),
    [part]: sanitizeEquipmentLevel(value),
  };
  saveStoredEquipmentLevels(levels, dataRegion);
}

function getRarityIconPath(character) {
  const rarity = String(character?.rarity || "SSR").trim().toLowerCase();
  return getImmutableAssetUrl(`assets/icons/ui/rarity/${encodeURIComponent(["r", "sr", "ssr"].includes(rarity) ? rarity : "ssr")}.png`);
}

function getResearchLevelStorageKey() {
  return "nikke-research-levels-v1";
}

function getResearchLevelDefinitions() {
  const classResearchIconMap = {
    "class:\u706b\u529b": "attacker",
    "class:\u9632\u5fa1": "defender",
    "class:\u8f85\u52a9": "supporter",
  };
  const companyResearchIconMap = {
    "company:\u6781\u4e50\u51c0\u571f": "elysion",
    "company:\u7c73\u897f\u5229\u65af": "missilis",
    "company:\u6cf0\u7279\u62c9": "tetra",
    "company:\u671d\u5723\u8005": "pilgrim",
    "company:\u53cd\u5e38": "abnormal",
  };

  return [
    { key: "general", label: localize("通用研究", "General research") },
    {
      key: "class:火力",
      label: localize("职业研究-火力型", "Class research - Attacker"),
      icon: getNikkeDetailIconPath(`nikke-${classResearchIconMap["class:火力"] || "attacker"}.webp`),
    },
    {
      key: "class:防御",
      label: localize("职业研究-防御型", "Class research - Defender"),
      icon: getNikkeDetailIconPath(`nikke-${classResearchIconMap["class:防御"] || "defender"}.webp`),
    },
    {
      key: "class:辅助",
      label: localize("职业研究-辅助型", "Class research - Supporter"),
      icon: getNikkeDetailIconPath(`nikke-${classResearchIconMap["class:辅助"] || "supporter"}.webp`),
    },
    {
      key: "company:极乐净土",
      label: localize("企业研究-极乐净土", "Manufacturer research - Elysion"),
      icon: getNikkeDetailIconPath(`nikke-${companyResearchIconMap["company:极乐净土"] || "elysion"}.webp`),
    },
    {
      key: "company:米西利斯",
      label: localize("企业研究-米西利斯", "Manufacturer research - Missilis"),
      icon: getNikkeDetailIconPath(`nikke-${companyResearchIconMap["company:米西利斯"] || "missilis"}.webp`),
    },
    {
      key: "company:泰特拉",
      label: localize("企业研究-泰特拉", "Manufacturer research - Tetra"),
      icon: getNikkeDetailIconPath(`nikke-${companyResearchIconMap["company:泰特拉"] || "tetra"}.webp`),
    },
    {
      key: "company:朝圣者",
      label: localize("企业研究-朝圣者", "Manufacturer research - Pilgrim"),
      icon: getNikkeDetailIconPath(`nikke-${companyResearchIconMap["company:朝圣者"] || "pilgrim"}.webp`),
    },
    {
      key: "company:反常",
      label: localize("企业研究-反常", "Manufacturer research - Abnormal"),
      icon: getNikkeDetailIconPath(`nikke-${companyResearchIconMap["company:反常"] || "abnormal"}.webp`),
    },
  ];
}

function getStoredResearchLevels(region = null) {
  return getRegionalObjectStorageValue(getResearchLevelStorageKey(), region);
}

function saveStoredResearchLevels(levels, region = null) {
  saveRegionalObjectStorageValue(getResearchLevelStorageKey(), levels, region);
}

function sanitizeResearchLevel(value) {
  const level = Math.max(1, Math.floor(Number(value) || 1));
  return Math.min(999, level);
}

function getAutoGeneralResearchLevel(region = null) {
  const level = sanitizeCharacterDetailLevel(getCharacterDetailLevel(region));
  if (level < 400) return 1;
  return 180 + Math.floor((level - 400) / 20) * 10;
}

function getResearchLevel(key, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  if (dataRegion === "cn") {
    const tapTapField = TAPTAP_COMMON_RESEARCH_FIELDS[key];
    if (tapTapField) {
      const tapTapLevel = getTapTapNumericOverride(tapTapField);
      if (tapTapLevel !== null) return sanitizeResearchLevel(tapTapLevel);
    }
  }
  if (key === "general") return Math.min(999, getAutoGeneralResearchLevel(dataRegion));
  return sanitizeResearchLevel(getStoredResearchLevels(dataRegion)[key]);
}

function setResearchLevel(key, value, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const levels = getStoredResearchLevels(dataRegion);
  levels[key] = sanitizeResearchLevel(value);
  saveStoredResearchLevels(levels, dataRegion);
}

function getCharacterClassResearchKey(character) {
  const classType = String(character?.classType || "火力").replace(/型$/, "") || "火力";
  return `class:${classType}`;
}

function getCharacterCompanyResearchKey(character) {
  return `company:${String(character?.company || "极乐净土").trim() || "极乐净土"}`;
}

function closeResearchLevelModal() {
  document.querySelector(".research-level-modal-backdrop")?.remove();
}

let characterDetailModalsModulePromise = null;

async function loadCharacterDetailModalsModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!characterDetailModalsModulePromise) {
    characterDetailModalsModulePromise = runtime.loadAppModule("character-detail-modals", () => importAppModule("./modules/character-detail-modals.js"));
  }
  const module = await characterDetailModalsModulePromise;
  module.setCharacterDetailModalsApi({
    escapeHtml,
    localize,
    getResearchLevelDefinitions,
    getResearchLevel,
    setResearchLevel,
    getCharacterDetailCube,
    sanitizeDetailCubeType,
    sanitizeDetailCubeLevel,
    saveCharacterDetailCube,
    getCharacterDetailCubeLevelByType,
    getCharacterDetailCubeIconPath,
    getCharacterCollectibleDetail,
    saveCharacterCollectibleDetail,
    sanitizeCollectibleLevel,
    getCharacterEquipmentLevel,
    saveCharacterEquipmentLevel,
    sanitizeEquipmentLevel,
    getCharacterBondLevel,
    getCharacterMaxBondLevel,
    saveCharacterBondLevel,
    getCharacterDetailLevel,
    getCharacterDetailLevelMax,
    saveCharacterDetailLevel,
    markCharacterDetailPanelDirty,
    getCharacterBreakthroughCoreDetail,
    sanitizeBreakthroughCount,
    sanitizeCoreEnhanceLevel,
    saveCharacterBreakthroughCoreDetail,
    getCharacterDetailCubeOptions,
  });
  return module;
}

function getCharacterDetailCubeOptions() {
  return CHARACTER_DETAIL_CUBE_OPTIONS;
}

function getCharacterDetailLevelMax() {
  return CHARACTER_DETAIL_LEVEL_MAX;
}

async function openResearchLevelModal() {
  return (await loadCharacterDetailModalsModule()).openResearchLevelModal();
}

function normalizeExternalEquipmentText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[：:\-\s_()[\]【】]/g, "");
}

function getExternalEquipmentPayload(region = null) {
  const cached = getCachedExternalEquipment(EXTERNAL_EQUIPMENT_PROVIDER, region);
  const data = cached?.data || cached;
  return data?.payload || data?.data?.payload || data?.result || data?.data || data || null;
}

function getExternalEquipmentCharacterName(character) {
  const assetName = getStandardCharacterAssetEntry(character)?.assetName;
  return String(assetName || character?.name || "")
    .trim()
    .replace(/\s*\u73cd\u85cf$/, "")
    .replace(/\s*\+$/, "");
}

function findExternalCharacterEquipmentRecord(character, region = null) {
  const payload = getExternalEquipmentPayload(region);
  const records = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const characterName = getExternalEquipmentCharacterName(character);
  if (!characterName) return null;
  return records.find((record) => String(record?.characterName || "").trim() === characterName) || null;
}

function getExternalEquipmentArray(record) {
  return Array.isArray(record?.equipmentInfos) ? record.equipmentInfos : [];
}

function getExternalEquipmentSlotNo(item) {
  const slotNo = Number(item?.slotNo);
  return Number.isInteger(slotNo) && slotNo >= 0 && slotNo <= 3 ? slotNo : null;
}
function getExternalAffixArray(item) {
  return Array.isArray(item?.statInfos) ? item.statInfos : [];
}
function formatExternalAffixValue(value) {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "number") return `${formatNumber(value, 2)}%`;
  return String(value);
}

function normalizeExternalAffix(raw) {
  if (!raw || typeof raw !== "object") return null;
  const name = raw.statShortName || raw.statName;
  const value = raw.statValue;
  const tier = raw.statValueLevel;
  const statNo = raw.statNo;
  const position = Number(raw.index);
  if (!name && value === undefined) return null;
  const numericTier = Number(tier);
  const numericValue = Number(value);
  const statKeyMap = {
    0: "elemental",
    1: "hitRate",
    2: "ammo",
    3: "attack",
    4: "chargeDamage",
    5: "chargeSpeed",
    6: "critRate",
    7: "critDamage",
  };
  const numericStatNo = Number(statNo);
  return {
    name: String(name || localize("\u8bcd\u6761", "Affix")),
    value: Number.isFinite(numericValue) ? `${formatNumber(numericValue / 100, 2)}%` : formatExternalAffixValue(value),
    statNo: Number.isFinite(numericStatNo) ? numericStatNo : null,
    statKey: Number.isFinite(numericStatNo) ? statKeyMap[numericStatNo] || "" : "",
    numericPercent: Number.isFinite(numericValue) ? numericValue / 100 : null,
    numericTier: Number.isFinite(numericTier) && numericTier > 0 ? numericTier : 0,
    tier: Number.isFinite(numericTier) && numericTier > 0 ? numericTier : "-",
    position: Number.isInteger(position) && position >= 1 && position <= 3 ? position : null,
    highlight: Number.isFinite(numericTier) && numericTier >= 12,
    highlightLevel: Number.isFinite(numericTier) && numericTier >= 14 ? "black" : Number.isFinite(numericTier) && numericTier >= 12 ? "blue" : "",
  };
}
function getEquipmentAffixAt(affixes, index) {
  if (!Array.isArray(affixes)) return null;
  const hasPosition = affixes.some((affix) => Number.isInteger(affix?.position));
  if (hasPosition) return affixes.find((affix) => affix?.position === index + 1) || null;
  return affixes[index] || null;
}

function getExternalCharacterEquipmentDetail(character, region = null) {
  const record = findExternalCharacterEquipmentRecord(character, region);
  if (!record) return null;
  const externalItems = getExternalEquipmentArray(record);
  if (!externalItems.length) return null;
  const slots = [
    { slot: localize("头部", "Head"), part: "头" },
    { slot: localize("身体", "Body"), part: "衣" },
    { slot: localize("手部", "Arms"), part: "手" },
    { slot: localize("脚部", "Legs"), part: "鞋" },
  ];
  return slots.map((slot) => {
    const item = externalItems.find((entry) => getExternalEquipmentSlotNo(entry) === slots.indexOf(slot)) || null;
    const affixes = getExternalAffixArray(item).map(normalizeExternalAffix).filter(Boolean).slice(0, 3);
    return {
      ...slot,
      icon: getEquipmentIconPath(character, slot.part),
      level: 5,
      affixes,
      emptyText: localize("未获得效果", "Effect not acquired"),
    };
  });
}

function getCharacterEquipmentDetail(character, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  return (getExternalCharacterEquipmentDetail(character, dataRegion) || []).map((item) => ({
    ...item,
    level: getCharacterEquipmentLevel(character, item.part, item.level, dataRegion),
  }));
}

function getExternalCharacterPower(character, region = null) {
  const record = findExternalCharacterEquipmentRecord(character, region);
  const number = Number(String(record?.power ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(number) && number > 0 ? Math.round(number) : null;
}
function getExternalCharacterLevel(character, region = null) {
  const record = findExternalCharacterEquipmentRecord(character, region);
  const level = Number(record?.level);
  return Number.isFinite(level) && level > 0 ? Math.round(level) : null;
}

function getCharacterDetailLevelStorageKey() {
  return "nikke-character-levels-v1";
}

function sanitizeCharacterDetailLevel(value) {
  const level = Math.max(1, Math.floor(Number(value) || 400));
  return Math.min(CHARACTER_DETAIL_LEVEL_MAX, level);
}

function getStoredCharacterLevels(region = null) {
  return sanitizeCharacterDetailLevel(getRegionalScalarStorageValue(getCharacterDetailLevelStorageKey(), region, undefined));
}

function saveStoredCharacterLevels(value, region = null) {
  const normalized = sanitizeCharacterDetailLevel(value);
  saveRegionalScalarStorageValue(getCharacterDetailLevelStorageKey(), normalized, region);
}

function getCharacterDetailLevel(region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  if (dataRegion === "cn") {
    const tapTapLevel = getTapTapNumericOverride("synchronizerLevel", CHARACTER_DETAIL_LEVEL_MAX);
    if (tapTapLevel !== null) return sanitizeCharacterDetailLevel(tapTapLevel);
  }
  return getStoredCharacterLevels(dataRegion);
}

function saveCharacterDetailLevel(value, region = null) {
  saveStoredCharacterLevels(value, region);
}

function getCharacterSkillLevelStorageKey() {
  return "nikke-character-skill-levels-v1";
}

function getStoredCharacterSkillLevels(region = null) {
  return getRegionalObjectStorageValue(getCharacterSkillLevelStorageKey(), region);
}

function saveStoredCharacterSkillLevels(levels, region = null) {
  saveRegionalObjectStorageValue(getCharacterSkillLevelStorageKey(), levels, region);
}

function sanitizeCharacterSkillLevel(value) {
  const level = Math.max(1, Math.floor(Number(value) || 10));
  return Math.min(10, level);
}

function getCharacterSkillLevels(character, region = null) {
  const saved = character?.id ? getStoredCharacterSkillLevels(region)[character.id] || {} : {};
  return {
    skill1: sanitizeCharacterSkillLevel(saved.skill1),
    skill2: sanitizeCharacterSkillLevel(saved.skill2),
    burst: sanitizeCharacterSkillLevel(saved.burst),
  };
}

function saveCharacterSkillLevels(character, levels, region = null) {
  if (!character?.id) return;
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const allLevels = getStoredCharacterSkillLevels(dataRegion);
  allLevels[character.id] = {
    skill1: sanitizeCharacterSkillLevel(levels?.skill1),
    skill2: sanitizeCharacterSkillLevel(levels?.skill2),
    burst: sanitizeCharacterSkillLevel(levels?.burst),
  };
  saveStoredCharacterSkillLevels(allLevels, dataRegion);
}

function getCharacterBreakthroughCoreStorageKey() {
  return "nikke-character-breakthrough-core-v1";
}

function getStoredCharacterBreakthroughCore(region = null) {
  return getRegionalObjectStorageValue(getCharacterBreakthroughCoreStorageKey(), region);
}

function saveStoredCharacterBreakthroughCore(values, region = null) {
  saveRegionalObjectStorageValue(getCharacterBreakthroughCoreStorageKey(), values, region);
}

function sanitizeBreakthroughCount(value) {
  const count = Math.max(0, Math.floor(Number(value) || 0));
  return Math.min(3, count);
}

function sanitizeCoreEnhanceLevel(value, breakthroughCount = 3) {
  if (sanitizeBreakthroughCount(breakthroughCount) < 3) return 0;
  const level = Math.max(0, Math.floor(Number(value) || 0));
  return Math.min(7, level);
}

function getCharacterBreakthroughCoreDetail(character, region = null) {
  const saved = getStoredCharacterBreakthroughCore(region)[character?.id] || {};
  const breakthroughCount = sanitizeBreakthroughCount(saved.breakthroughCount);
  return {
    breakthroughCount,
    coreEnhanceLevel: sanitizeCoreEnhanceLevel(saved.coreEnhanceLevel, breakthroughCount),
  };
}

function saveCharacterBreakthroughCoreDetail(character, detail, region = null) {
  if (!character?.id) return;
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const allValues = getStoredCharacterBreakthroughCore(dataRegion);
  const breakthroughCount = sanitizeBreakthroughCount(detail?.breakthroughCount);
  allValues[character.id] = {
    breakthroughCount,
    coreEnhanceLevel: sanitizeCoreEnhanceLevel(detail?.coreEnhanceLevel, breakthroughCount),
  };
  saveStoredCharacterBreakthroughCore(allValues, dataRegion);
}

function getCharacterBreakthroughStarsMarkup(detail) {
  const breakthroughCount = sanitizeBreakthroughCount(detail?.breakthroughCount);
  const coreEnhanceLevel = sanitizeCoreEnhanceLevel(detail?.coreEnhanceLevel, breakthroughCount);
  const stars = Array.from({ length: 3 }, (_, index) => {
    const isActive = index < breakthroughCount;
    return `<span class="${isActive ? "is-active" : ""}">${getDetailStarSvgMarkup("", isActive ? "#f6aa28" : "#d0d5df")}</span>`;
  }).join("");
  return `${stars}${coreEnhanceLevel > 0 ? `<em><i>${getDetailStarSvgMarkup("is-core", "#b72ac4")}</i><b></b><strong>${escapeHtml(String(coreEnhanceLevel).padStart(2, "0"))}</strong></em>` : ""}`;
}

function getCollectibleStorageKey() {
  return "nikke-character-collectibles-v1";
}

function getStoredCollectibles(region = null) {
  return getRegionalObjectStorageValue(getCollectibleStorageKey(), region);
}

function saveStoredCollectibles(collectibles, region = null) {
  saveRegionalObjectStorageValue(getCollectibleStorageKey(), collectibles, region);
}

function sanitizeCollectibleRarity(value) {
  const rarity = String(value || "R").trim().toUpperCase();
  return rarity === "SR" || rarity === "SSR" ? "SR" : "R";
}

function sanitizeCollectibleLevel(value) {
  const level = Math.max(0, Math.floor(Number(value) || 0));
  return Math.min(15, level);
}

function getCharacterCollectibleIconPath(character) {
  const weapon = String(character?.weapon || "").trim().toUpperCase();
  const iconByWeapon = {
    AR: "ar-cooking-doll.webp",
    MG: "mg-shopping-doll.webp",
    RL: "rl-sports-doll.webp",
    SG: "sg-battle-doll.webp",
    SMG: "smg-coffee-doll.webp",
    SR: "sr-nap-doll.webp",
  };
  return getNikkeDetailIconPath(`collection-dolls/${iconByWeapon[weapon] || iconByWeapon.AR}`);
}

function getCharacterCollectibleDetail(character, region = null) {
  const saved = getStoredCollectibles(region)[character?.id] || {};
  return {
    name: localize("收藏品", "Collectible"),
    icon: getCharacterCollectibleIconPath(character),
    rarity: sanitizeCollectibleRarity(saved.rarity),
    level: sanitizeCollectibleLevel(saved.level),
  };
}

function saveCharacterCollectibleDetail(character, detail, region = null) {
  if (!character?.id) return;
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const collectibles = getStoredCollectibles(dataRegion);
  collectibles[character.id] = {
    rarity: sanitizeCollectibleRarity(detail?.rarity),
    level: sanitizeCollectibleLevel(detail?.level),
  };
  saveStoredCollectibles(collectibles, dataRegion);
}

function getDetailCubeStorageKey() {
  return "nikke-character-detail-cubes-v1";
}

function getDetailCubeLevelStorageKey() {
  return "nikke-character-detail-cube-levels-v1";
}

function getStoredDetailCubes(region = null) {
  return getRegionalObjectStorageValue(getDetailCubeStorageKey(), region);
}

function saveStoredDetailCubes(cubes, region = null) {
  saveRegionalObjectStorageValue(getDetailCubeStorageKey(), cubes, region);
}

function getStoredDetailCubeLevels(region = null) {
  return getRegionalObjectStorageValue(getDetailCubeLevelStorageKey(), region);
}

function saveStoredDetailCubeLevels(levels, region = null) {
  saveRegionalObjectStorageValue(getDetailCubeLevelStorageKey(), levels, region);
}

function sanitizeDetailCubeLevel(value) {
  const level = Math.floor(Number(value) || 0);
  return Math.max(0, Math.min(15, level));
}

const CHARACTER_DETAIL_CUBE_TYPES = Object.freeze({
  RESILIENCE: CUBE_TYPE_RESILIENCE,
  BASTION: CUBE_TYPE_BASTION,
  WINGMAN: CUBE_TYPE_WINGMAN,
  ASSAULT: CUBE_TYPE_ASSAULT,
  ONSLAUGHT: CUBE_TYPE_ONSLAUGHT,
  QUANTUM: CUBE_TYPE_QUANTUM,
  ADJUTANT: CUBE_TYPE_ADJUTANT,
  VIGOR: CUBE_TYPE_VIGOR,
  ENDURANCE: CUBE_TYPE_ENDURANCE,
  HEALING: CUBE_TYPE_HEALING,
  TEMPERING: CUBE_TYPE_TEMPERING,
  ASSIST: CUBE_TYPE_ASSIST,
  DESTRUCTION: CUBE_TYPE_DESTRUCTION,
  PIERCING: CUBE_TYPE_PIERCING,
});

const CHARACTER_DETAIL_CUBE_TYPE_IDS = Object.freeze({
  [CHARACTER_DETAIL_CUBE_TYPES.RESILIENCE]: 1,
  [CHARACTER_DETAIL_CUBE_TYPES.BASTION]: 2,
  [CHARACTER_DETAIL_CUBE_TYPES.WINGMAN]: 3,
  [CHARACTER_DETAIL_CUBE_TYPES.ASSAULT]: 4,
  [CHARACTER_DETAIL_CUBE_TYPES.ONSLAUGHT]: 5,
  [CHARACTER_DETAIL_CUBE_TYPES.QUANTUM]: 6,
  [CHARACTER_DETAIL_CUBE_TYPES.ADJUTANT]: 7,
  [CHARACTER_DETAIL_CUBE_TYPES.VIGOR]: 8,
  [CHARACTER_DETAIL_CUBE_TYPES.ENDURANCE]: 9,
  [CHARACTER_DETAIL_CUBE_TYPES.HEALING]: 10,
  [CHARACTER_DETAIL_CUBE_TYPES.TEMPERING]: 11,
  [CHARACTER_DETAIL_CUBE_TYPES.ASSIST]: 12,
  [CHARACTER_DETAIL_CUBE_TYPES.DESTRUCTION]: 13,
  [CHARACTER_DETAIL_CUBE_TYPES.PIERCING]: 14,
});

const CHARACTER_DETAIL_CUBE_ID_TO_TYPE = Object.freeze(
  Object.fromEntries(Object.entries(CHARACTER_DETAIL_CUBE_TYPE_IDS).map(([type, id]) => [id, type]))
);

const CHARACTER_DETAIL_CUBE_OPTIONS = Object.values(CHARACTER_DETAIL_CUBE_TYPES).map((type) => {
  const meta = CUBE_TYPE_META[type];
  return {
    id: CHARACTER_DETAIL_CUBE_TYPE_IDS[type],
    type,
    name: meta?.zh || "",
    enName: meta?.en || "",
    icon: meta?.icon || "",
  };
});

const CHARACTER_DETAIL_DEFAULT_CUBE_TYPE = CHARACTER_DETAIL_CUBE_OPTIONS[0].type;

function getCharacterDetailCubeOption(type) {
  const normalizedType = normalizeCharacterDetailCubeType(type);
  if (!normalizedType) return null;
  return CHARACTER_DETAIL_CUBE_OPTIONS.find((option) => option.type === normalizedType) || null;
}

function normalizeCharacterDetailCubeType(type) {
  const text = String(type || "").trim().toLowerCase();
  if (!text) return "";
  if (/^\d+$/.test(text) && CHARACTER_DETAIL_CUBE_ID_TO_TYPE[text]) {
    return CHARACTER_DETAIL_CUBE_ID_TO_TYPE[text];
  }
  return text;
}

function getCharacterDetailCubeTypeId(type) {
  const normalizedType = normalizeCharacterDetailCubeType(type);
  return normalizedType ? CHARACTER_DETAIL_CUBE_TYPE_IDS[normalizedType] || 0 : 0;
}

function sanitizeDetailCubeType(value) {
  return getCharacterDetailCubeOption(value)?.type || CHARACTER_DETAIL_DEFAULT_CUBE_TYPE;
}

function getCharacterDetailCubeIconPath(type) {
  const option = getCharacterDetailCubeOption(type);
  return option ? getImmutableAssetUrl(`assets/icons/ui/detail-cubes/${option.icon}`) : "";
}

function getCharacterDetailCubeName(type) {
  const option = getCharacterDetailCubeOption(type);
  return option ? localize(option.name, option.enName) : localize("\u9b54\u65b9", "Cube");
}

function getCharacterDetailCubeButtonContent(cube) {
  const level = sanitizeDetailCubeLevel(cube?.level);
  if (level <= 0) {
    return `
      <span>${escapeHtml(localize("\u9b54\u65b9", "Cube"))}</span>
      <strong>${escapeHtml(localize("\u65e0\u9b54\u65b9", "None"))}</strong>
    `;
  }
  const type = sanitizeDetailCubeType(cube?.type);
  const icon = getCharacterDetailCubeIconPath(type);
  return `
    ${icon ? `<img src="${escapeHtml(icon)}" alt="" aria-hidden="true" loading="lazy" />` : ""}
    <span>${escapeHtml(getCharacterDetailCubeName(type))}</span>
    <strong>${escapeHtml(`Lv.${level}`)}</strong>
  `;
}

function getCharacterDetailCubeLevelByType(type, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const levels = getStoredDetailCubeLevels(dataRegion);
  const normalizedType = normalizeCharacterDetailCubeType(type);
  if (!normalizedType) return 0;
  const id = getCharacterDetailCubeTypeId(normalizedType);
  if (Object.prototype.hasOwnProperty.call(levels, String(id))) {
    return sanitizeDetailCubeLevel(levels[String(id)]);
  }
  return sanitizeDetailCubeLevel(levels[normalizedType]);
}

function getCharacterDetailCube(character, region = null) {
  if (!character?.id) return { type: CHARACTER_DETAIL_DEFAULT_CUBE_TYPE, level: 0 };
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const savedCubes = getStoredDetailCubes(dataRegion);
  if (!Object.prototype.hasOwnProperty.call(savedCubes, character.id)) {
    return { type: CHARACTER_DETAIL_DEFAULT_CUBE_TYPE, level: 0 };
  }
  const saved = savedCubes[character.id];
  const type = sanitizeDetailCubeType(saved?.type);
  const level = getCharacterDetailCubeLevelByType(type, dataRegion);
  const legacyLevel = sanitizeDetailCubeLevel(saved?.level);
  if (level <= 0 && legacyLevel > 0) {
    const levels = getStoredDetailCubeLevels(dataRegion);
    levels[getCharacterDetailCubeTypeId(type)] = legacyLevel;
    saveStoredDetailCubeLevels(levels, dataRegion);
    return { type, level: legacyLevel };
  }
  return {
    type,
    level,
  };
}

function saveCharacterDetailCube(character, detail, region = null) {
  if (!character?.id) return;
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const normalizedType = sanitizeDetailCubeType(detail?.type);
  const typeId = getCharacterDetailCubeTypeId(normalizedType);
  const cubes = getStoredDetailCubes(dataRegion);
  const level = sanitizeDetailCubeLevel(detail?.level);
  if (level <= 0) delete cubes[character.id];
  else cubes[character.id] = { type: normalizedType };
  saveStoredDetailCubes(cubes, dataRegion);

  const levels = getStoredDetailCubeLevels(dataRegion);
  if (level > 0) {
    levels[String(typeId)] = level;
  }
  saveStoredDetailCubeLevels(levels, dataRegion);
}

function closeCollectibleModal() {
  document.querySelector(".collectible-modal-backdrop")?.remove();
}

function closeDetailCubeModal() {
  document.querySelector(".detail-cube-modal-backdrop")?.remove();
}

async function openDetailCubeModal(character, onChange = null) {
  return (await loadCharacterDetailModalsModule()).openDetailCubeModal(character, onChange);
}

async function openCollectibleModal(character, onChange = null) {
  return (await loadCharacterDetailModalsModule()).openCollectibleModal(character, onChange);
}

function getBondLevelStorageKey() {
  return "nikke-character-bond-levels-v1";
}

function getStoredBondLevels() {
  try {
    const parsed = JSON.parse(localStorage.getItem(getBondLevelStorageKey()) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveStoredBondLevels(levels) {
  try {
    localStorage.setItem(getBondLevelStorageKey(), JSON.stringify(levels || {}));
  } catch {
    // Bond levels are optional UI data; ignore storage failures.
  }
}

function getCharacterMaxBondLevel(character) {
  const star = getCharacterBreakthroughCoreDetail(character).breakthroughCount;
  if (star <= 0) return 10;
  if (star === 1) return 20;
  if (star === 2) return 30;
  if (star >= 3) return character?.company === "朝圣者" || isRapiRedHood(character) ? 40 : 30;
  return 30;
}

function sanitizeBondLevel(character, value) {
  const level = Math.max(1, Math.floor(Number(value) || 1));
  return Math.min(getCharacterMaxBondLevel(character), level);
}

function getCharacterBondLevel(character) {
  if (!character) return 1;
  return getCharacterMaxBondLevel(character);
}

function saveCharacterBondLevel(character, value) {
  if (!character?.id) return;
  const levels = getStoredBondLevels();
  if (Object.hasOwn(levels, character.id)) {
    delete levels[character.id];
    saveStoredBondLevels(levels);
  }
}

function closeBondLevelModal() {
  document.querySelector(".bond-level-modal-backdrop")?.remove();
}

function closeCharacterLevelModal() {
  document.querySelector(".character-level-modal-backdrop")?.remove();
}

function closeEquipmentLevelModal() {
  document.querySelector(".equipment-level-modal-backdrop")?.remove();
}

function closeBreakthroughCoreModal() {
  document.querySelector(".breakthrough-core-modal-backdrop")?.remove();
}

async function openEquipmentLevelModal(character, equipment, onChange = null) {
  return (await loadCharacterDetailModalsModule()).openEquipmentLevelModal(character, equipment, onChange);
}

async function openBondLevelModal(character, onChange = null) {
  return (await loadCharacterDetailModalsModule()).openBondLevelModal(character, onChange);
}

async function openCharacterLevelModal(onChange = null) {
  return (await loadCharacterDetailModalsModule()).openCharacterLevelModal(onChange);
}

async function openBreakthroughCoreModal(character, onChange = null) {
  return (await loadCharacterDetailModalsModule()).openBreakthroughCoreModal(character, onChange);
}

let characterDetailPanelModulePromise = null;

async function loadCharacterDetailPanelModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!characterDetailPanelModulePromise) {
    characterDetailPanelModulePromise = runtime.loadAppModule("character-detail-panel", () => importAppModule("./modules/character-detail-panel.js"));
  }
  const module = await characterDetailPanelModulePromise;
  module.setCharacterDetailPanelApi({
    state,
    getCharacterEquipmentDetail,
    escapeHtml,
    localize,
    formatNumber,
    formatFrameCount,
    canApplyChargeSpeed,
    applyChargeSpeedFrames,
    isFavoriteCharacter,
    sanitizeEquipmentLevel,
    getCharacterDetailLevel,
    getCharacterClassResearchKey,
    getCharacterCompanyResearchKey,
    getCharacterDetailCube,
    getCharacterCollectibleDetail,
    sanitizeCollectibleLevel,
    getCharacterBondLevel,
    getCharacterSkillLevels,
    getCharacterBreakthroughCoreDetail,
    findExternalCharacterEquipmentRecord,
    getExternalEquipmentArray,
    getExternalAffixArray,
    getExternalCharacterPower,
    getSingleShotChargeValue,
    getCharacterDetailPortraitUrl,
    getCharacterDetailPanel,
    getCharacterDisplayName,
    getRarityIconPath,
    getCharacterBreakthroughStarsMarkup,
    getCharacterDetailIconChip,
    getDetailElementIcon,
    getDetailWeaponIcon,
    getCharacterDetailResearchChip,
    getDetailClassIcon,
    getResearchLevel,
    getDetailCompanyIcon,
    getDetailBurstIcon,
    getCharacterDetailCubeButtonContent,
    getEquipmentAffixAt,
    openResearchLevelModal,
    closeCharacterDetailPanel,
    openCollectibleModal,
    openDetailCubeModal,
    openBondLevelModal,
    openCharacterLevelModal,
    openBreakthroughCoreModal,
    openAccountModal,
    sanitizeCharacterSkillLevel,
    saveCharacterSkillLevels,
    openEquipmentLevelModal,
    markCharacterDetailPanelDirty,
    shareCharacterDetailImage,
    toggleFavoriteCharacter,
    renderCharacters,
    openCharacterEquipmentUploadModal,
    uploadCharacterEquipmentImage,
    ensureExternalEquipmentApiKeyBeforeUpload,
    canEditThirdPartyCharacterData,
    showThirdPartyReadOnlyNotice,
    scheduleCharacterDetailExportPreload,
  });
  return module;
}

async function renderCharacterDetailPanel(character) {
  await loadCharacterAssets();
  return (await loadCharacterDetailPanelModule()).renderCharacterDetailPanel(character);
}

async function refreshVisibleCharacterDetailPanelAfterSync() {
  const panel = document.querySelector(".character-detail-panel.show");
  const draft = characterDetailPanelDraft;
  if (!panel || !draft?.characterId || characterDetailPanelHasLocalEdits) return;
  if (document.querySelector(".research-level-modal-backdrop, .collectible-modal-backdrop, .bond-level-modal-backdrop, .equipment-level-modal-backdrop, .character-level-modal-backdrop, .breakthrough-core-modal-backdrop, .detail-cube-modal-backdrop")) return;
  const character = getCharacterById(Number(draft.characterId));
  if (!character) return;
  await renderCharacterDetailPanel(character);
  panel.classList.add("show");
  positionCharacterDetailPanel(panel);
  captureCharacterDetailPanelDraft(character, draft.region);
}

async function showCharacterDetailPanel(character) {
  if (state.helpCenter.solveWorkspace?.privateHelp) { showToast('本次使用发起者的阿卡资料，可在队伍角色齿轮中查看参数。');return; }
  if(arcaWorkspace?.isEnabled())return arcaWorkspace.open(character,state.filters.region);
  hideCharacterTooltip();
  characterDetailPanelRegion = normalizeThirdPartyDataRegion(state.filters.region);
  const dataRegion = characterDetailPanelRegion;
  const syncIdentity = getExternalEquipmentSessionIdentity();
  if (syncIdentity && externalEquipmentAutoSyncState.lastSyncedIdentity !== syncIdentity) {
    console.warn("[ThirdPartySync] character detail opened before user info sync completed", {
      characterName: getExternalEquipmentCharacterName(character),
      syncRunning: externalEquipmentAutoSyncState.running,
      syncIdentity,
      lastSyncedIdentity: externalEquipmentAutoSyncState.lastSyncedIdentity,
    });
  }
  captureCharacterDetailPanelDraft(character, dataRegion);
  const panel = await renderCharacterDetailPanel(character);
  document.body.classList.add("has-character-detail-panel");
  document.querySelector(".character-detail-backdrop")?.classList.add("show");
  panel.classList.add("show");
  positionCharacterDetailPanel(panel);
}

function canUseHoverTooltip() {
  return window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? true;
}

function canUseCharacterDetailLongPress(event) {
  if (!event || event.button !== 0) return false;
  return event.pointerType ? event.pointerType !== "mouse" : isMobileCopyChoiceRuntime();
}

function suppressNextCharacterDetailClick() {
  suppressCharacterDetailClick = true;
  setTimeout(() => {
    suppressCharacterDetailClick = false;
  }, 350);
}

function clearCharacterDetailLongPress() {
  if (characterDetailLongPress?.timer) clearTimeout(characterDetailLongPress.timer);
  characterDetailLongPress = null;
}

function isCharacterDetailLongPressTriggered(pointerId) {
  return characterDetailLongPress?.pointerId === pointerId && characterDetailLongPress.triggered;
}

function startCharacterDetailLongPress(event, character) {
  if (!character || !canUseCharacterDetailLongPress(event)) return;
  if (event.target instanceof Element && isTeamSlotDragControl(event.target)) return;
  clearCharacterDetailLongPress();
  const press = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    character,
    triggered: false,
    timer: null,
  };
  press.timer = setTimeout(() => {
    if (characterDetailLongPress !== press) return;
    press.triggered = true;
    suppressNextCharacterDetailClick();
    hideCharacterTooltip();
    showCharacterDetailPanel(character);
  }, CHARACTER_DETAIL_LONG_PRESS_DELAY_MS);
  characterDetailLongPress = press;
}

function moveCharacterDetailLongPress(event) {
  if (!characterDetailLongPress || event.pointerId !== characterDetailLongPress.pointerId) return;
  if (characterDetailLongPress.triggered) {
    event.preventDefault();
    return;
  }
  const distance = Math.hypot(event.clientX - characterDetailLongPress.startX, event.clientY - characterDetailLongPress.startY);
  if (distance >= CHARACTER_DETAIL_LONG_PRESS_MOVE_TOLERANCE) clearCharacterDetailLongPress();
}

function finishCharacterDetailLongPress(event) {
  if (!characterDetailLongPress || event.pointerId !== characterDetailLongPress.pointerId) return false;
  const wasTriggered = characterDetailLongPress.triggered;
  clearCharacterDetailLongPress();
  if (!wasTriggered) return false;
  event.preventDefault();
  suppressNextCharacterDetailClick();
  return true;
}

function bindCharacterDetailLongPress(element, character) {
  if (!element || !character) return;
  element.addEventListener("pointerdown", (event) => startCharacterDetailLongPress(event, character));
  element.addEventListener("pointermove", moveCharacterDetailLongPress);
  element.addEventListener("pointerup", finishCharacterDetailLongPress);
  element.addEventListener("pointercancel", finishCharacterDetailLongPress);
  element.addEventListener("pointerleave", (event) => {
    if (characterDetailLongPress?.pointerId === event.pointerId && !characterDetailLongPress.triggered) clearCharacterDetailLongPress();
  });
  element.addEventListener(
    "click",
    (event) => {
      if (!suppressCharacterDetailClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    { capture: true },
  );
  element.addEventListener("contextmenu", (event) => {
    if (!isMobileCopyChoiceRuntime()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, { capture: true });
}

function hideFloatingTooltips() {
  hideCharacterTooltip();
  hideChartTooltip();
}

function isCharacterDetailChildModalTarget(target) {
  return target instanceof Element && Boolean(target.closest(".research-level-modal-backdrop, .collectible-modal-backdrop, .bond-level-modal-backdrop, .equipment-level-modal-backdrop, .character-level-modal-backdrop, .breakthrough-core-modal-backdrop, .detail-cube-modal-backdrop"));
}

function getDelayedExtraPositionHits(extra, hitProfile = null) {
  const segments = Math.max(0, Number(extra?.segments) || 0);
  if (segments <= 0) return [];
  if (extra?.targetMode === "all") {
    return Array.from({ length: ENEMY_TEAM_SIZE }, (_, positionIndex) => [positionIndex, 1]);
  }
  const primaryTarget = extra?.targetMode === "primary" && Number.isInteger(hitProfile?.targetPositionIndex)
    ? hitProfile.targetPositionIndex : null;
  const targetPositionIndex = primaryTarget ?? hitProfile?.bodyHits?.[0]?.[0] ?? hitProfile?.targetHits?.[0]?.[0] ?? DEFAULT_RL_TARGET_INDEX;
  return [[targetPositionIndex, segments]];
}

function getDelayedExtraEvents(event, currentFrame, hitProfile = null) {
  if (isHarran(event.character) || isRaven(event.character)) return [];
  return (event.character.delayedExtraHits || []).map((extra) => {
    const positionHits = getDelayedExtraPositionHits(extra, hitProfile);
    return {
      character: event.character,
      positionIndex: event.positionIndex,
      frame: currentFrame + extra.delayFrames,
      chargeValue: getBaseChargeUnit(event.character) * extra.segments * (hasEffectiveExtraChargeMultiplier(event.character) ? 2 : 1),
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
    displayExtraBodyHits: hitProfile?.bodyHits || [],
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
  const eventHits = Number.isFinite(Number(event?.hits)) ? Math.trunc(Number(event.hits)) : 0;
  return (event.character.hitCountExtraEvents || []).filter((extra) => {
    const exactHit = Number.isFinite(Number(extra?.hit)) ? Math.trunc(Number(extra.hit)) : 0;
    if (exactHit > 0) return exactHit === eventHits;
    const every = Number.isFinite(Number(extra?.every)) ? Math.trunc(Number(extra.every)) : 0;
    return every > 1 && eventHits > 0 && eventHits % every === 0;
  });
}

function getHitCountExtraChargeValue(event, extra) {
  const extraMultiplier = hasEffectiveExtraChargeMultiplier(event.character) ? 2 : 1;
  return getBaseChargeUnit(event.character) * extra.segments * extraMultiplier;
}

function getHitCountExtraCharge(event) {
  if (isScarletShadow(event.character)) return 0;
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
      label: extra.label || (isScarletShadow(event.character) ? localize("额外伤害", "extra damage") : "尾弹追加"),
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
  if (isHarran(character) && Number.isFinite(Number(shotNumber)) && Number(shotNumber) <= 1) return 0;
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
    const bodyHits = getCinderellaBodyHits(targetPositionIndex, shotCount, shotNumber);
    const bodyHitCount = getHitProfileBodyHitCount({ bodyHits });
    return {
      totalHits: shotHits * bodyHitCount,
      bodyHits,
      targetPositionIndex,
      targetHits: bodyHits,
      p5CinderellaDecoy: false,
      cinderellaReceivedBodyHits: [[targetPositionIndex, shotCount]],
      cinderellaChargeSegments: bodyHitCount * 2,
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
      targetPositionIndex,
      targetHits: bodyHits.map(([positionIndex, hitCount]) => [
        positionIndex,
        hitCount * getRlTargetHitMultiplier(character, positionIndex, targetPositionIndex, opponentTeam),
      ]),
      p5CinderellaDecoy: false,
    };
  }

  if (character.widePierceTargetCount === 3 && character.hasPenetration) {
    const start = Math.min(Math.max(0, targetPositionIndex - 1), ENEMY_TEAM_SIZE - 3);
    const bodyHits = Array.from({ length: 3 }, (_, offset) => [start + offset, shotCount]);
    return {
      totalHits: shotHits * 6,
      bodyHits,
      targetHits: bodyHits.map(([positionIndex, hitCount]) => [positionIndex, hitCount * 2]),
      targetPositionIndex,
      p5CinderellaDecoy: false,
    };
  }

  const penetrationExtraHits = getPenetrationExtraHitCount(character, shotNumber);
  if (penetrationExtraHits > 0) {
    const effectivePenetrationExtraHits = p5CinderellaDecoy ? 0 : penetrationExtraHits;
    // 白雪公主：重型武装直击灰姑娘时，除本体和掩体外，还会命中诱饵。
    const snowWhiteHeavyArmsCinderellaDecoyHit =
      isSnowWhiteHeavyArms(character) &&
      targetPositionIndex === ENEMY_TEAM_SIZE - 1 &&
      isCinderella(opponentTeam?.[targetPositionIndex])
        ? 1
        : 0;
    const totalTargetHits = shotCount * (1 + effectivePenetrationExtraHits + snowWhiteHeavyArmsCinderellaDecoyHit);
    return {
      totalHits: shotHits * (1 + effectivePenetrationExtraHits + snowWhiteHeavyArmsCinderellaDecoyHit),
      bodyHits: [[targetPositionIndex, shotCount]],
      targetHits: [[targetPositionIndex, totalTargetHits]],
      targetPositionIndex,
      p5CinderellaDecoy,
    };
  }

  return {
    totalHits: shotHits,
    bodyHits: [[targetPositionIndex, shotHits]],
    targetHits: [[targetPositionIndex, shotHits]],
    targetPositionIndex,
    p5CinderellaDecoy,
  };
}

function getAttackContributionLabel(character, shotCount = 1, shotNumber = null, hitProfile = null) {
  const supplementLabel = character.superstarChargeSupplementValue ? `+${localize("超阿补充", "Anis: Superstar bonus")}` : "";
  if (hitProfile?.p5CinderellaDecoy) {
    const actualHitMultiplier = getHitProfileTargetHitCount(hitProfile);
    return `${localize("命中", "Hit")}: ${actualHitMultiplier} hit${supplementLabel}`;
  }
  if (isCinderella(character) && hitProfile) {
    return `${getChargeHitLabel(character, 1, shotNumber)}${supplementLabel}`;
  }
  if (character.weapon === "MG" && shotCount > 1) return `${localize("命中", "hit")}${supplementLabel}`;
  return `${getChargeHitLabel(character, getChargeHitMultiplier(character, shotNumber), shotNumber)}${supplementLabel}`;
}

function isReloadingAtFrame(positionIndex, frame, reloadTimeline = []) {
  return reloadTimeline.some(
    (reload) => reload.positionIndex === positionIndex && reload.startFrame < frame && reload.endFrame > frame,
  );
}

function applyReceivedExtraDamageHits(character, positionHits = []) {
  const multiplier = hasEffectiveExtraDamage(character) ? 2 : 1;
  if (multiplier === 1) return positionHits;
  return positionHits.map(([positionIndex, hitCount]) => [positionIndex, hitCount * multiplier]);
}

function applyDisplayedExtraDamageHits(character, targetHits = [], bodyHits = []) {
  if (!hasEffectiveExtraDamage(character)) return targetHits;
  const mergedHits = new Map(targetHits.map(([positionIndex, hitCount]) => [positionIndex, Number(hitCount) || 0]));
  bodyHits.forEach(([positionIndex, hitCount]) => {
    mergedHits.set(positionIndex, (mergedHits.get(positionIndex) || 0) + (Number(hitCount) || 0));
  });
  return [...mergedHits.entries()].sort((a, b) => a[0] - b[0]);
}

function getReceivedPositionHits(character, hitProfile, frame, opponentReloadTimeline = []) {
  if (isCinderella(character)) {
    return applyReceivedExtraDamageHits(character, hitProfile.cinderellaReceivedBodyHits || hitProfile.bodyHits);
  }
  const bodyHits =
    character.weapon === "RL"
      ? hitProfile.bodyHits
      : hitProfile.bodyHits.filter(([positionIndex]) => !isReloadingAtFrame(positionIndex, frame, opponentReloadTimeline));
  return applyReceivedExtraDamageHits(character, bodyHits);
}

function isNoah(character) {
  return character?.id === 12 || character?.name === "诺雅" || character?.slug === "诺雅";
}

function isBlanc(character) {
  return character?.id === 128 || character?.name === "布兰儿" || character?.slug === "布兰儿" || character?.enName === "Blanc";
}

function getBurstCoverageDefinition(character) {
  if (isNoah(character)) {
    return {
      durationFrames: NOAH_BURST_COVERAGE_DURATION_FRAMES,
      effectZh: "无敌",
      effectEn: "Invincibility",
    };
  }
  if (isBlanc(character)) {
    return {
      durationFrames: BLANC_BURST_COVERAGE_DURATION_FRAMES,
      effectZh: "不屈",
      effectEn: "Indomitable",
    };
  }
  return null;
}

function getBurstCoverageEvents(result) {
  if (!Array.isArray(result?.burstSequence)) return [];
  return result.burstSequence.flatMap((entry) => {
    const definition = getBurstCoverageDefinition(entry.character);
    const burstFrame = entry.frame;
    if (!definition || !Number.isFinite(burstFrame)) return [];
    const startFrame = burstFrame + BURST_COVERAGE_START_DELAY_FRAMES;
    return [{
      ...entry,
      startFrame,
      endFrame: startFrame + definition.durationFrames,
      effectZh: definition.effectZh,
      effectEn: definition.effectEn,
    }];
  });
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
      };
    })
    .filter(Boolean);
  if (!candidates.length) return null;
  candidates.sort(
    (a, b) =>
      b.chargeFrames - a.chargeFrames ||
      b.positionIndex - a.positionIndex,
  );
  return candidates[0];
}

function getTauntBuffSourceKey(entry) {
  const characterId = Number(entry?.characterId);
  if (Number.isFinite(characterId)) return `character:${characterId}`;
  if (entry?.characterName) return `name:${entry.characterName}`;
  return `position:${entry?.positionIndex}`;
}

function getLatestTauntTimelineTarget(tauntTimeline = [], currentFrame = 0) {
  if (!Array.isArray(tauntTimeline)) return null;
  const tauntBuffOrder = [];
  const latestTauntBySource = new Map();
  tauntTimeline
    .filter((entry) => Number.isInteger(entry?.positionIndex) && Number.isInteger(entry?.tauntCenterPositionIndex) && Number(entry.frame) <= currentFrame)
    .sort((a, b) =>
      Number(a.frame) - Number(b.frame) ||
      Number(a.sequence || 0) - Number(b.sequence || 0) ||
      a.positionIndex - b.positionIndex
    )
    .forEach((entry) => {
      const sourceKey = getTauntBuffSourceKey(entry);
      if (!latestTauntBySource.has(sourceKey)) {
        tauntBuffOrder.push(sourceKey);
      }
      latestTauntBySource.set(sourceKey, entry);
    });
  for (let index = tauntBuffOrder.length - 1; index >= 0; index -= 1) {
    const entry = latestTauntBySource.get(tauntBuffOrder[index]);
    if (entry) return entry;
  }
  return null;
}

function getTauntedTargetPositionIndex(event, attackSequenceNumber, currentFrame, opponentTauntTimeline = []) {
  const opponentTauntTarget = getLatestTauntTimelineTarget(opponentTauntTimeline, currentFrame);
  if (!Number.isInteger(opponentTauntTarget?.positionIndex)) return null;
  if (!event || Math.abs(event.positionIndex - opponentTauntTarget.tauntCenterPositionIndex) > 1) return null;
  if (attackSequenceNumber < 2) return null;
  return opponentTauntTarget.positionIndex;
}

function hasActualPositionHit(positionHits = []) {
  return positionHits.some(([, hitCount]) => Number(hitCount) > 0);
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
  const arca = getArcaChargeParameters(character, teamKey);
  if (arca) return {...character.stats, magazine: arca.magazine, reloadSeconds: arca.reloadSeconds};
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

function getEmiliaFollowUpInterval(event) {
  const baseChargeFrames = event.baseChargeFrames || event.chargeFrames || 0;
  const fixedIntervalFrames = Math.max(0, (event.baseIntervalFrames || event.interval) - baseChargeFrames);
  const baseSpeed = Number(event.character.chargeSpeedPercent) || 0;
  return applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, baseSpeed + EMILIA_CHARGE_SPEED_AFTER_FIRST_SHOT);
}

const LAPLACE_ULTIMATE_HERO_CHARGE_SPEED_INCREMENT = 10;

function getLaplaceUltimateHeroStackedInterval(event) {
  const baseChargeFrames = event.baseChargeFrames || event.chargeFrames || 0;
  const fixedIntervalFrames = Math.max(0, (event.baseIntervalFrames || event.interval) - baseChargeFrames);
  const baseSpeed = Number(event.character.chargeSpeedPercent) || 0;
  const rawStackCount = Math.max(0, Math.trunc(Number(event.hits) || 0));
  const stackCount = Math.min(5, rawStackCount);
  const chargeSpeedPercent = baseSpeed + stackCount * LAPLACE_ULTIMATE_HERO_CHARGE_SPEED_INCREMENT;
  return applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, chargeSpeedPercent);
}

function getBaseNextAttackFrame(event, currentFrame, shotCount = 1) {
  if (event.character.weapon !== "MG") {
    if (isRedHood(event.character)) {
      return currentFrame + getRedHoodStackedInterval(event, getRedHoodChargeSpeedStacksAfterAttack(event, shotCount));
    }
    if (isLaplaceUltimateHero(event.character) && event.hits > 0) {
      return currentFrame + getLaplaceUltimateHeroStackedInterval(event);
    }
    if (isEmilia(event.character) && event.hits > 0) {
      return currentFrame + getEmiliaFollowUpInterval(event);
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
  if (isA2(event.character)) return 0;
  if (isVestiTacticalUpgrade(event.character) || isRaven(event.character)) return 0;
  const turnFrames = Number(event.character.timing?.turnFrames ?? event.character.turnFrames ?? 0) || 0;
  return Math.min(TURN_DODGE_WINDOW_FRAMES, Math.max(0, turnFrames));
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
  return flightStartFrame < window.startFrame && window.startFrame < hitFrame && hitFrame < window.endFrame;
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
  if (isCinderella(event.character)) return false;
  if (event.character.weapon !== "RL" || event.projectileFlightFrames <= 0) return false;
  const targetPositionIndex = Number.isInteger(targetPositionIndexOverride)
    ? Math.max(0, Math.min(ENEMY_TEAM_SIZE - 1, targetPositionIndexOverride))
    : getTargetPositionIndex(event.character, teamKey);
  const flightStartFrame = Math.max(0, currentFrame - event.projectileFlightFrames);
  return [
    ...opponentReloadTimeline.map((window) => ({ ...window, type: "reload" })),
    ...opponentTurnDodgeTimeline.map((window) => ({ ...window, type: "turn" })),
  ].find((window) =>
    !isCinderellaName(window.characterName) &&
    isMissedByDodgeWindow(targetPositionIndex, flightStartFrame, currentFrame, window)
  );
}

function characterForSlot(character, positionIndex, teamKey = "attack", team = []) {
  if (!character) return null;
  const chargeSpeeds = getChargeSpeedState(teamKey);
  const redHoodPierceCounts = getRedHoodPierceCountState(teamKey);
  const scarletCounterEnabled = getScarletCounterEnabledState(teamKey);
  const superstarChargeSupplementValue = getAnisSuperstarSupplementValue(team);
  const chargeSpeedPercent = canApplyChargeSpeed(character)
    ? getArcaChargeParameters(character, teamKey)?.chargeSpeed ?? (Number(chargeSpeeds[positionIndex]) || character.chargeSpeedPercent || 0)
    : 0;
  return {
    ...character,
    hasPenetration: isRedHood(character) ? false : character.hasPenetration,
    stats: getEffectiveCharacterStats(character, teamKey),
    chargeSpeedPercent,
    quantumRelicCubeEnabled: getArcaChargeParameters(character, teamKey) ? getArcaChargeParameters(character, teamKey).cubeType === CUBE_TYPE_QUANTUM : getSavedCharacterQuantumCube(character, teamKey),
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
  stunDodgeEvents = [],
  options = {},
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
      poisonChargeTargets: new Set(),
      ravenPoisonNextTickByTarget: new Map(),
    };
  });

  let totalCharge = 0;
  let currentFrame = 0;
  let fullFrame = null;
  let fullCharge = 0;
  let finishingPositionIndices = [];
  const continueUntilFrame = Number.isFinite(Number(options.continueUntilFrame))
    ? Math.max(0, Number(options.continueUntilFrame))
    : null;
  let pendingExtraEvents = [];
  let sacrificeEvents = getRosannaSacrificeEventsForTeam(team, teamKey, sacrificeFrameOverride);
  let currentFrameContributors = new Set(universalMembers.map((member) => member.positionIndex));
  const tauntTimeline = [];
  let tauntSequence = 0;
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
    if (totalCharge >= 100 - BURST_EPSILON) {
      fullFrame = 0;
      fullCharge = totalCharge;
      finishingPositionIndices = [...currentFrameContributors].sort((a, b) => a - b);
    }
  }

  while ((totalCharge < 100 - BURST_EPSILON || (continueUntilFrame !== null && currentFrame < continueUntilFrame)) && currentFrame <= 10000) {
    const activeAttackEvents = events.filter((event) => !event.sacrificed);
    if (activeAttackEvents.length === 0 && pendingExtraEvents.length === 0 && specialChargeEvents.length === 0 && sacrificeEvents.length === 0) break;
    const nextAttackFrame = activeAttackEvents.length ? Math.min(...activeAttackEvents.map((event) => event.nextFrame)) : Infinity;
    const nextExtraFrame = pendingExtraEvents.length ? Math.min(...pendingExtraEvents.map((event) => event.frame)) : Infinity;
    const nextSpecialFrame = specialChargeEvents.length ? Math.min(...specialChargeEvents.map((event) => event.frame)) : Infinity;
    const nextSacrificeFrame = sacrificeEvents.length ? Math.min(...sacrificeEvents.map((event) => event.frame)) : Infinity;
    currentFrame = Math.min(nextAttackFrame, nextExtraFrame, nextSpecialFrame, nextSacrificeFrame);
    if (!Number.isFinite(currentFrame)) break;
    if (totalCharge >= 100 - BURST_EPSILON && continueUntilFrame !== null && currentFrame > continueUntilFrame) break;
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
    const addTargetHits = (event, targetHits, bodyHits = []) => {
      const current = contributions.get(getContributionKey(event, true));
      if (!current) return;
      applyDisplayedExtraDamageHits(event.character, targetHits, bodyHits).forEach(([positionIndex, hitCount]) => {
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
      if (extra.source === "raven-poison" && Number.isInteger(extra.targetPositionIndex)) {
        if (!(owner.ravenPoisonNextTickByTarget instanceof Map)) owner.ravenPoisonNextTickByTarget = new Map();
        if (Number.isFinite(extra.repeatFrames) && extra.repeatFrames > 0) {
          owner.ravenPoisonNextTickByTarget.set(extra.targetPositionIndex, extra.frame + extra.repeatFrames);
        }
      }
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
      addTargetHits(owner, extra.targetHits || [], extra.displayExtraBodyHits || []);
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
            dodgeEndFrame: missDodgeWindow.endFrame,
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
      if (isTauntCharacter(event.character) && hasActualPositionHit(receivedPositionHits)) {
        const tauntCenterPositionIndex = hitProfile.targetPositionIndex ?? receivedPositionHits.find(([, hitCount]) => Number(hitCount) > 0)?.[0];
        if (!Number.isInteger(tauntCenterPositionIndex)) return;
        tauntSequence += 1;
        tauntTimeline.push({
          frame: currentFrame,
          sequence: tauntSequence,
          positionIndex: event.positionIndex,
          tauntCenterPositionIndex,
          characterId: event.character.id,
          characterName: event.character.name,
        });
      }
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
      addTargetHits(event, hitProfile.targetHits, hitProfile.bodyHits);
      const hitCountExtraCharge = getHitCountExtraCharge(event);
      totalCharge += hitCountExtraCharge;
      event.totalCharge += hitCountExtraCharge;
      event.attackChargeTotal += hitCountExtraCharge;
      addContribution(event, hitCountExtraCharge, "额外触发");
      pendingExtraEvents.push(...getDelayedHitCountExtraEvents(event, currentFrame));
      pendingExtraEvents.push(...getHarranPoisonEvents(event, currentFrame, hitProfile));
      pendingExtraEvents.push(...getRavenPoisonEvents(event, currentFrame, hitProfile));
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
          characterId: contribution.character.id,
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
      if (fullFrame === null && totalCharge >= 100 - BURST_EPSILON) {
        fullFrame = currentFrame;
        fullCharge = totalCharge;
        finishingPositionIndices = [...currentFrameContributors].sort((a, b) => a - b);
      }
    }
  }

  if (fullFrame === null) {
    return {
      error: "超过 10000 帧仍未充满，请检查角色数据。",
      members: events,
    };
  }

  const burstSequence = getBurstSequence(events).map((entry, index) => ({
    ...entry,
    frame: getBurstStageFrame(fullFrame, index + 1),
  }));
  const availableBurstLevel = burstSequence.length;

  return {
    teamKey,
    fullFrame,
    burstSequence,
    burst1Frame: burstSequence[0]?.frame ?? null,
    burst2Frame: burstSequence[1]?.frame ?? null,
    burst3Frame: burstSequence[2]?.frame ?? null,
    availableBurstLevel,
    canFullBurst: burstSequence.some((entry) => entry.stage === "B3"),
    totalCharge,
    fullCharge,
    calculationEndFrame: currentFrame,
    chargePerSecond: fullFrame === 0 ? fullCharge * FRAMES_PER_SECOND : (fullCharge / fullFrame) * FRAMES_PER_SECOND,
    finishingPositionIndices,
    timeline,
    tauntTimeline,
    reloadTimeline: events.flatMap((event) => event.reloadEvents),
    turnDodgeTimeline: events.flatMap((event) => event.turnDodgeEvents),
    flightTimeline: events.flatMap((event) => event.flightEvents),
    missedTimeline: events.flatMap((event) => event.missedShotEvents),
    stunTimeline: stunWindows,
    stunDodgeTimeline: stunDodgeEvents,
    members: events,
  };
}

function getCharacterById(id) {
  if (id === null || id === undefined) return null;
  const normalizedId = String(id);
  return CHARACTERS.find((character) => String(character.id) === normalizedId) || null;
}

function getStandardCharacterAssetEntry(character) {
  if (!character || typeof CHARACTER_ASSETS === "undefined" || !Array.isArray(CHARACTER_ASSETS.linked)) return null;
  const normalizedId = String(character.id);
  return CHARACTER_ASSETS.linked.find((entry) => String(entry.legacyId) === normalizedId) || null;
}

function isFavoriteItemCharacter(character) {
  const rawName = `${character?.name || ""} ${character?.slug || ""} ${character?.enName || ""}`;
  return /珍藏|\+/.test(rawName);
}

function getDefaultStandardAssetVariant(entry) {
  if (!entry || !Array.isArray(entry.variants) || !entry.variants.length) return null;
  const preferredVariant = entry.defaultVariant || "00";
  return entry.variants.find((variant) => String(variant.variant) === String(preferredVariant)) || entry.variants[0] || null;
}

function getDefaultFavoriteItemAssetVariant(entry) {
  if (!entry || !Array.isArray(entry.favoriteItemScenes) || !entry.favoriteItemScenes.length) return null;
  return entry.favoriteItemScenes.find((variant) => String(variant.variant) === "00") || entry.favoriteItemScenes[0] || null;
}

function getStandardCharacterAssetUrl(character, kind, options = {}) {
  const entry = getStandardCharacterAssetEntry(character);
  if (!entry) return "";
  if (options.preferFavoriteItem && isFavoriteItemCharacter(character)) {
    const favoriteVariant = getDefaultFavoriteItemAssetVariant(entry);
    const favoriteUrl = favoriteVariant?.assets?.[kind] || "";
    if (favoriteUrl) return getImmutableAssetUrl(favoriteUrl);
  }
  const variant = getDefaultStandardAssetVariant(entry);
  return getImmutableAssetUrl(variant?.assets?.[kind] || "");
}

function getRegionLabel(character) {
  if (character.regions.includes("cn") && character.regions.includes("global")) return localize("国际 / 国服", "Global / CN");
  if (character.regions.includes("cn")) return localize("国服", "CN");
  return localize("国际服", "Global");
}

function getAvatarMarkup(character) {
  const avatarUrl = getCharacterAvatarUrl(character);
  if (avatarUrl) {
    const avatarClass = isStandardCharacterAssetUrl(avatarUrl) ? ` class="is-standard-character-avatar"` : "";
    return `<img${avatarClass} src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(character.name)}" loading="lazy" referrerpolicy="no-referrer" />`;
  }
  return `
    <span class="avatar-fallback">
      <span class="avatar-fallback-name">${escapeHtml(character.name)}</span>
      <span class="avatar-fallback-weapon">${escapeHtml(character.weapon)}</span>
    </span>
  `;
}

function getCharacterAvatarUrl(character) {
  if (character?.standardAvatarUrl) return getImmutableAssetUrl(character.standardAvatarUrl);
  const avatarUrl = character?.avatarUrl || "";
  if (typeof avatarUrl === "string" && /^https?:\/\//i.test(avatarUrl)) return "";
  return getImmutableAssetUrl(avatarUrl || character?.nameCodeAvatarUrl || "");
}

function getCharacterDetailPortraitUrl(character) {
  return getStandardCharacterAssetUrl(character, "half", { preferFavoriteItem: true }) || getCharacterAvatarUrl(character);
}

function isStandardCharacterAssetUrl(url) {
  const path = String(url || "").split(/[?#]/, 1)[0];
  return /(?:^|\/)assets\/characters\/standard\//.test(path)
    || /(?:^|\/)assets\/immutable\/avatar\//.test(path);
}

function getTimingLabel(character) {
  if (character.weapon === "MG") {
    return localize(
      "暖机 96F×12 / 126F×9 / 128F后每2F",
      "Warm-up 96F x12 / 126F x9 / every 2F after 128F",
    );
  }
  if (character.weapon === "RL") {
    const timing = character.timing || {};
    const flight = timing.projectileFlightFrames ?? timing.projectileFlightFramesByPosition?.P1 ?? character.projectileFlightFrames ?? 16;
    const releaseFrames = getAttackReleaseFrames(character);
    const releaseLabelZh = releaseFrames > 0 ? ` / 出手 ${releaseFrames}F` : "";
    const releaseLabelEn = releaseFrames > 0 ? ` / Release ${releaseFrames}F` : "";
    if (isCinderella(character)) {
      const cinderellaTiming = getChargeFrames(character, 0);
      return localize(
        `蓄力 ${cinderellaTiming.chargeFrames ?? timing.chargeFrames ?? "-"}F${releaseLabelZh} / 飞行 ${flight}F / 间隔 ${cinderellaTiming.interval ?? "-"}F`,
        `Charge ${cinderellaTiming.chargeFrames ?? timing.chargeFrames ?? "-"}F${releaseLabelEn} / Flight ${flight}F / Interval ${cinderellaTiming.interval ?? "-"}F`,
      );
    }
    return localize(
      `蓄力 ${timing.chargeFrames ?? "-"}F${releaseLabelZh} / 飞行 ${flight}F / 转身 ${timing.turnFrames ?? character.turnFrames ?? 16}F`,
      `Charge ${timing.chargeFrames ?? "-"}F${releaseLabelEn} / Flight ${flight}F / Turn ${timing.turnFrames ?? character.turnFrames ?? 16}F`,
    );
  }
  if (character.weapon === "SR") {
    return localize(
      `蓄力 ${character.timing?.chargeFrames ?? "-"}F / 转身 ${character.timing?.turnFrames ?? 16}F`,
      `Charge ${character.timing?.chargeFrames ?? "-"}F / Turn ${character.timing?.turnFrames ?? 16}F`,
    );
  }
  return localize(`间隔 ${getChargeFrames(character, 0).interval}F`, `Interval ${getChargeFrames(character, 0).interval}F`);
}
function getChargeSpeedPreviewTiming(character, positionIndex = 0, teamKey = "attack", chargeSpeed = 0, inputSource) {
  if (!character || !canEditChargeSpeed(character)) return null;
  const previewCharacter = {
    ...character,
    chargeSpeedPercent: sanitizeChargeSpeed(chargeSpeed),
    chargeSpeedInputSource: inputSource,
  };
  const timing = getChargeFrames(previewCharacter, positionIndex, teamKey);
  const frames = Number.isFinite(timing.chargeFrames) ? timing.chargeFrames : timing.firstFrame;
  return { frames: timing.v2ChargeTicks != null ? timing.v2ChargeTicks * 2 : frames,
    seconds: timing.v2ChargeSeconds ?? frames / FRAMES_PER_SECOND };
}

function getChargeSpeedPreviewFrame(character, positionIndex = 0, teamKey = "attack", chargeSpeed = 0) {
  return getChargeSpeedPreviewTiming(character, positionIndex, teamKey, chargeSpeed)?.frames ?? null;
}

function getChargeSpeedPreviewLabel(character, positionIndex, teamKey, chargeSpeed, inputSource) {
  const timing = getChargeSpeedPreviewTiming(character, positionIndex, teamKey, chargeSpeed, inputSource);
  if (!timing || !Number.isFinite(timing.frames) || !Number.isFinite(timing.seconds)) return "—";
  return `${formatNumber(timing.seconds, 3)}s（${formatFrameCount(timing.frames)}F）`;
}

function getTagMarkup(character) {
  const tags = [];
  if (character.hasPenetration && !isRedHood(character)) tags.push("穿透");
  const extraChargeLabel = getExtraChargeLabel(character);
  if (extraChargeLabel) tags.push(extraChargeLabel);
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

  if (pointerTeamDrag.paidArena && normalizeTeamKey(targetSlot.dataset.paidArenaTeamKey) !== normalizeTeamKey(pointerTeamDrag.paidArenaTeamKey)) {
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
  draggedPaidArenaTeamKey = pointerTeamDrag.paidArenaTeamKey ?? null;
  isTeamSlotDragActive = true;
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
    paidArenaTeamKey: options.paidArenaTeamKey ? normalizeTeamKey(options.paidArenaTeamKey) : null,
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
  if (isCharacterDetailLongPressTriggered(event.pointerId)) {
    event.preventDefault();
    return;
  }
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
  const wasDetailLongPress = isCharacterDetailLongPressTriggered(event.pointerId);
  pointerTeamDrag = null;
  drag.slot?.releasePointerCapture?.(event.pointerId);
  clearPointerTeamDragClasses();
  draggedTeamIndex = null;
  draggedTeamKey = null;
  draggedPaidArenaRowIndex = null;
  draggedPaidArenaTeamKey = null;
  isTeamSlotDragActive = false;

  if (wasDetailLongPress) {
    suppressTeamSlotClick = true;
    setTimeout(() => {
      suppressTeamSlotClick = false;
    }, 350);
    return;
  }
  if (!drag.active) return;
  suppressTeamSlotClick = true;
  setTimeout(() => {
    suppressTeamSlotClick = false;
  }, 0);
  if (!drag.target) return;
  if (drag.paidArena) {
    if (normalizeTeamKey(drag.target.dataset.paidArenaTeamKey) !== normalizeTeamKey(drag.paidArenaTeamKey)) return;
    state.paidArenaDataTeamKey = normalizeTeamKey(drag.paidArenaTeamKey);
    movePaidArenaSlot(drag.rowIndex, drag.index, Number(drag.target.dataset.paidArenaRowIndex), Number(drag.target.dataset.slotIndex));
  } else {
    moveTeamSlot(drag.teamKey, drag.index, drag.target.dataset.teamKey, Number(drag.target.dataset.slotIndex));
  }
}

function getPaidArenaRowAtPoint(x, y) {
  const rows = [...els.teamSlots.querySelectorAll(".paid-arena-row")];
  const containingRow = rows.find((row) => {
    const rect = row.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });
  if (containingRow) return containingRow;
  return rows
    .map((row) => {
      const rect = row.getBoundingClientRect();
      const xDistance = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
      const yDistance = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
      return { row, distance: Math.hypot(xDistance, yDistance) };
    })
    .filter((entry) => entry.distance <= 48)
    .sort((a, b) => a.distance - b.distance)[0]?.row || null;
}

function clearPointerPaidArenaRowDragClasses() {
  els.teamSlots.querySelectorAll(".paid-arena-row, .paid-arena-result-bar").forEach((element) => {
    element.classList.remove("is-row-drop-target", "is-row-dragging", "is-drop-target", "is-dragging");
  });
}

function updatePointerPaidArenaRowDragTarget(clientX, clientY) {
  if (!pointerPaidArenaRowDrag?.active) return;
  const targetRow = getPaidArenaRowAtPoint(clientX, clientY);
  els.teamSlots.querySelectorAll(".paid-arena-row.is-row-drop-target").forEach((row) => {
    if (row !== targetRow) row.classList.remove("is-row-drop-target");
  });
  els.teamSlots.querySelectorAll(".paid-arena-result-bar.is-drop-target").forEach((bar) => {
    if (!targetRow || !targetRow.contains(bar)) bar.classList.remove("is-drop-target");
  });

  if (
    !targetRow ||
    (normalizeTeamKey(targetRow.dataset.paidArenaTeamKey) === pointerPaidArenaRowDrag.teamKey &&
      Number(targetRow.dataset.paidArenaRowIndex) === pointerPaidArenaRowDrag.rowIndex)
  ) {
    pointerPaidArenaRowDrag.target = null;
    return;
  }

  targetRow.classList.add("is-row-drop-target");
  targetRow.querySelector(".paid-arena-result-bar")?.classList.add("is-drop-target");
  pointerPaidArenaRowDrag.target = targetRow;
}

function startPointerPaidArenaRowDrag(event) {
  if (!pointerPaidArenaRowDrag || pointerPaidArenaRowDrag.active) return;
  pointerPaidArenaRowDrag.active = true;
  pointerPaidArenaRowDrag.row?.classList.add("is-row-dragging");
  pointerPaidArenaRowDrag.resultBar?.classList.add("is-dragging");
  updatePointerPaidArenaRowDragTarget(event.clientX, event.clientY);
}

function handlePaidArenaResultPointerDown(event, row, resultBar, dataTeamKey, rowIndex) {
  if (event.pointerType === "mouse") return;
  event.preventDefault();
  pointerPaidArenaRowDrag = {
    pointerId: event.pointerId,
    row,
    resultBar,
    teamKey: normalizeTeamKey(dataTeamKey),
    rowIndex: Number(rowIndex),
    startX: event.clientX,
    startY: event.clientY,
    active: false,
    target: null,
  };
  try {
    resultBar.setPointerCapture?.(event.pointerId);
  } catch {
    // Synthetic or interrupted touch pointers may not be capturable.
  }
}

function handlePaidArenaResultPointerMove(event) {
  if (!pointerPaidArenaRowDrag || event.pointerId !== pointerPaidArenaRowDrag.pointerId) return;
  const distance = Math.hypot(event.clientX - pointerPaidArenaRowDrag.startX, event.clientY - pointerPaidArenaRowDrag.startY);
  if (!pointerPaidArenaRowDrag.active && distance >= 8) startPointerPaidArenaRowDrag(event);
  if (!pointerPaidArenaRowDrag.active) return;
  event.preventDefault();
  updatePointerPaidArenaRowDragTarget(event.clientX, event.clientY);
}

function finishPointerPaidArenaRowDrag(event) {
  if (!pointerPaidArenaRowDrag || event.pointerId !== pointerPaidArenaRowDrag.pointerId) return;
  const drag = pointerPaidArenaRowDrag;
  pointerPaidArenaRowDrag = null;
  try {
    drag.resultBar?.releasePointerCapture?.(event.pointerId);
  } catch {
    // The pointer may already be released/cancelled on mobile browsers.
  }
  clearPointerPaidArenaRowDragClasses();
  if (!drag.active) return;
  suppressTeamSlotClick = true;
  setTimeout(() => {
    suppressTeamSlotClick = false;
  }, 0);
  if (!drag.target) return;
  swapPaidArenaRows(
    state.paidArenaMode,
    drag.teamKey,
    drag.rowIndex,
    normalizeTeamKey(drag.target.dataset.paidArenaTeamKey),
    Number(drag.target.dataset.paidArenaRowIndex),
  );
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
  return getImmutableAssetUrl(`assets/icons/ui/weapons/${weaponIconMap[character.weapon] || "1"}.png`);
}

function getBurstIcon(character) {
  const firstStage = isAnyBurstStageCharacter(character) ? "B1" : String(character.burstStage || "B0").split("/")[0];
  const burstIconMap = {
    B0: "0",
    B1: "1",
    B2: "2",
    B3: "3",
  };
  return getImmutableAssetUrl(`assets/icons/ui/bursts/${burstIconMap[firstStage] || "0"}.png`);
}

function getElementIcon(character) {
  const elementIconMap = {
    燃烧: "1",
    风压: "2",
    铁甲: "3",
    电击: "4",
    水冷: "5",
  };
  return getImmutableAssetUrl(`assets/icons/ui/elements/${elementIconMap[character.element] || "1"}.png`);
}

function getIconMarkup(src, label, className) {
  return `<span class="tile-icon ${className}"><img src="${escapeHtml(src)}" alt="${escapeHtml(label)}" loading="lazy" /></span>`;
}

function getSacrificeMarkMarkup(frame) {
  const sacrificeFrame = sanitizeSacrificeFrame(frame);
  if (sacrificeFrame === null) return "";
  return `<span class="sacrifice-mark"><img src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" aria-hidden="true" /><small>${sacrificeFrame}F</small></span>`;
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

function isPaidArenaRosannaSacrificeSettingsOpen(mode, rowIndex, index, teamKey = getPaidArenaDataTeamKey()) {
  return (
    openRosannaSacrificeSettings?.paidArenaMode === normalizePaidArenaMode(mode) &&
    normalizeTeamKey(openRosannaSacrificeSettings.teamKey) === normalizeTeamKey(teamKey) &&
    Number(openRosannaSacrificeSettings.rowIndex) === Number(rowIndex) &&
    Number(openRosannaSacrificeSettings.index) === Number(index)
  );
}

function togglePaidArenaRosannaSacrificeSettings(mode, rowIndex, index) {
  const teamKey = getPaidArenaDataTeamKey();
  openRosannaSacrificeSettings = isPaidArenaRosannaSacrificeSettingsOpen(mode, rowIndex, index, teamKey)
    ? null
    : { paidArenaMode: normalizePaidArenaMode(mode), teamKey, rowIndex, index };
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

function getAutoFullTeamLinkOwner(team = []) {
  const jackal = team.find((character) => character && isJackal(character));
  const poli = team.find((character) => character && isPoli(character));
  return jackal && poli ? jackal : null;
}

function getEffectiveLinkOwnerForTeam(team = [], linkState = createEmptyJackalLinkState()) {
  const autoOwner = getAutoFullTeamLinkOwner(team);
  if (autoOwner) return autoOwner;
  return team.find((character) => character && isLinkProvider(character) && character.id === linkState.ownerId) || null;
}

function getEffectiveLinkTargetIdsForTeam(team = [], linkState = createEmptyJackalLinkState()) {
  const autoOwner = getAutoFullTeamLinkOwner(team);
  if (autoOwner) {
    return team
      .filter((character) => character && character.id !== autoOwner.id)
      .map((character) => character.id);
  }
  const owner = getEffectiveLinkOwnerForTeam(team, linkState);
  if (!owner || !linkState.enabled) return [];
  const availableTargetIds = new Set(
    team
      .filter((character) => character && character.id !== owner.id)
      .map((character) => character.id),
  );
  return [...new Set(linkState.targetIds || [])].filter((id) => availableTargetIds.has(id)).slice(0, 2);
}

function isEffectiveLinkEnabledForTeam(team = [], linkState = createEmptyJackalLinkState()) {
  if (getAutoFullTeamLinkOwner(team)) return true;
  return Boolean(linkState.enabled && getEffectiveLinkOwnerForTeam(team, linkState));
}

function getTeamLinkProvider(teamKey = state.activeTeamKey) {
  const linkState = getJackalLinkState(teamKey);
  const team = getTeamState(teamKey);
  return getEffectiveLinkOwnerForTeam(team, linkState);
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
  const linkState = normalizeJackalLink(teamKey);
  return getEffectiveLinkTargetIdsForTeam(getTeamState(teamKey), linkState);
}

function isJackalLinkEnabled(teamKey = state.activeTeamKey) {
  const linkState = normalizeJackalLink(teamKey);
  return isEffectiveLinkEnabledForTeam(getTeamState(teamKey), linkState);
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

function togglePaidArenaRedHoodPierceCount(rowIndex, slotIndex, character, teamKey = getPaidArenaDataTeamKey()) {
  if (!character || !isRedHood(character)) return;
  const counts = getPaidArenaRedHoodPierceCounts(state.paidArenaMode, teamKey);
  const row = counts[rowIndex];
  if (!row) return;
  row[slotIndex] = (sanitizeRedHoodPierceCount(row[slotIndex]) + 1) % 3;
  saveCharacterRedHoodPierceCount(character, row[slotIndex], teamKey);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function togglePaidArenaScarletCounter(rowIndex, slotIndex, teamKey = getPaidArenaDataTeamKey()) {
  const rows = getPaidArenaScarletCounterEnabled(state.paidArenaMode, teamKey);
  const row = rows[rowIndex];
  if (!row) return;
  row[slotIndex] = !sanitizeScarletCounterEnabled(row[slotIndex]);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function togglePaidArenaJackalLink(rowIndex, owner, teamKey = getPaidArenaDataTeamKey()) {
  if (!owner || !isLinkProvider(owner)) return;
  const teams = getPaidArenaTeams(state.paidArenaMode, teamKey);
  const links = getPaidArenaJackalLinks(state.paidArenaMode, teamKey);
  const team = teams[rowIndex] || [];
  const linkState = normalizePaidArenaLinkForTeam(team, links[rowIndex]);
  const isSameOwner = linkState.enabled && linkState.ownerId === owner.id;
  links[rowIndex] = {
    enabled: !isSameOwner,
    ownerId: !isSameOwner ? owner.id : null,
    targetIds: !isSameOwner ? linkState.targetIds : [],
  };
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function togglePaidArenaJackalLinkTarget(rowIndex, character, teamKey = getPaidArenaDataTeamKey()) {
  const teams = getPaidArenaTeams(state.paidArenaMode, teamKey);
  const links = getPaidArenaJackalLinks(state.paidArenaMode, teamKey);
  const team = teams[rowIndex] || [];
  const linkState = normalizePaidArenaLinkForTeam(team, links[rowIndex]);
  if (!linkState.enabled || !character || character.id === linkState.ownerId) return;
  const targetSet = new Set(linkState.targetIds || []);
  if (targetSet.has(character.id)) {
    targetSet.delete(character.id);
  } else if (targetSet.size < 2) {
    targetSet.add(character.id);
  }
  links[rowIndex] = {
    ...linkState,
    targetIds: [...targetSet].slice(0, 2),
  };
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function getFilteredCharacters() {
  const keywords = getSearchKeywords(state.filters.search);
  return CHARACTERS.filter((character) => {
    if (character.isHidden) return false;
    const searchText = getCharacterSearchText(character);
    const matchesSearch = !keywords.length || keywords.some((keyword) => matchesSearchKeyword(searchText, keyword));
    const matchesCommon = state.filters.common === "all" || character.isCommon;
    const matchesRegion = character.regions.includes(state.filters.region);
    const stageFilter = normalizeStageFilter(state.filters.stage);
    const matchesStage = stageFilter === "all" || getCharacterBurstStages(character).includes(stageFilter);
    if (keywords.length) return matchesSearch;
    return matchesCommon && matchesRegion && matchesStage && matchesSearch;
  }).sort((a, b) => {
    const chargeDiff = getSingleShotChargeValue(b) - getSingleShotChargeValue(a);
    const weaponDiff = WEAPON_ORDER.indexOf(a.weapon) - WEAPON_ORDER.indexOf(b.weapon);
    return chargeDiff || weaponDiff || a.name.localeCompare(b.name, "zh-CN");
  });
}

async function loadArcaWorkspace() {
  if(!arcaWorkspacePromise)arcaWorkspacePromise=(async()=>{
    await loadCharacterAssets();
    const {createArcaWorkspace}=await importAppModule('./modules/arca-workspace.js');
    arcaWorkspace=createArcaWorkspace({
      characters:CHARACTERS,
      presentation:Object.fromEntries(CHARACTERS.map(c=>[String(c.id),{...c,primaryName:c.name,assetName:getExternalEquipmentCharacterName(c)}])),
      getScope:()=>getExternalEquipmentSessionIdentity(),getRegion:()=>state.filters.region,
      getKey:async refresh=>{
        if(!refresh)return getExternalApiKeyPanelData();
        const identity=getExternalEquipmentSessionIdentity();
        const data=await externalApiKeyRequest('GET');
        if(identity!==getExternalEquipmentSessionIdentity())throw new Error('账号已改变，请重新操作。');
        setExternalApiKeyPanelCache(data);return data;
      },
      readProfile:region=>{const payload=getExternalEquipmentPayload(region);return payload?{data:{characterList:extractThirdPartyCharacterList(payload)}}:null;},
      refreshProfile:async region=>{const identity=getExternalEquipmentSessionIdentity();const data=await syncThirdPartyUserInfo(EXTERNAL_EQUIPMENT_PROVIDER,region);if(identity!==getExternalEquipmentSessionIdentity())throw new Error('账号已改变，请重新操作。');saveCachedExternalEquipment(data,EXTERNAL_EQUIPMENT_PROVIDER,region);},
      convertImage:convertThirdPartyEquipmentImageToJpeg,
      escapeHtml,showToast,openAccount:()=>openAccountModal(),preview:openShareImagePreview,
      onChange:()=>{
        const button=document.querySelector('#arcaToggle');button?.setAttribute('aria-pressed',String(arcaWorkspace?.isEnabled()||false));
        state.arcaChargeParameters=arcaWorkspace?.parameters(state.filters.region)||{};
        invalidateBattleResults();
        render();
      },
    });return arcaWorkspace;
  })().catch(error=>{arcaWorkspacePromise=null;throw error;});
  return arcaWorkspacePromise;
}

function renderCharacters() {
  const borrowed = state.helpCenter.solveWorkspace?.privateHelp;
  document.querySelector('#arcaToggle')?.setAttribute('aria-pressed',String(!!borrowed||!!arcaWorkspace?.isEnabled()));
  const arcaMarks=borrowed?.marks || arcaWorkspace?.marks(state.filters.region);
  const pickedIds = isPaidArenaModeActive()
    ? getPaidArenaPickedIds()
    : new Set(getTeamState().filter(Boolean).map((character) => character.id));
  const fragment = document.createDocumentFragment();
  const characters = getFilteredCharacters();
  updateSortSummary();
  const visibleCharacterCount = state.filters.search
    ? CHARACTERS.filter((character) => !character.isHidden).length
    : CHARACTERS.filter((character) => !character.isHidden && character.regions.includes(state.filters.region)).length;
  els.listCount.textContent = `${characters.length}/${visibleCharacterCount} ${getCurrentLanguageText().listCountSuffix}`;

  characters.forEach((character, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `character-tile rarity-${getRarityClass(character)}${pickedIds.has(character.id) ? " is-picked" : ""}${isFavoriteCharacter(character) ? " is-favorite" : ""}`;
    if(arcaMarks&&!arcaMarks.has(borrowed ? borrowed.characterKey(character) : arcaWorkspace.characterKey(character)))tile.classList.add('is-arca-missing');
    tile.setAttribute(
      "aria-label",
      localize(
        `加入 ${character.name}，${character.weapon}，单发 ${formatChargeNumber(getSingleShotChargeValue(character))}%`,
        `Add ${getCharacterLocalizedName(character)}, ${character.weapon}, ${formatChargeNumber(getSingleShotChargeValue(character))}% per shot`,
      ),
    );
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
      <span class="tile-charge">${formatChargeNumber(getSingleShotChargeValue(character))}</span>
      ${isFavoriteCharacter(character) ? '<span class="tile-favorite" aria-hidden="true">\u2605</span>' : ""}
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
      if (isMobileCopyChoiceRuntime()) return;
      showCharacterDetailPanel(character);
    });
    bindCharacterDetailLongPress(tile, character);
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
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            name="legacy-speed-${index}"
            id="legacy-speed-${index}"
            value="${Number(state.chargeSpeeds[index]) || 0}"
            data-speed-index="${index}"
          />
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
    isTeamSlotDragActive = true;
    slot.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
    event.dataTransfer.setData("application/x-nyk-team-slot-drag", "1");
    setTeamSlotDragImage(event, slot);
  });

    slot.addEventListener("dragend", () => {
      draggedTeamIndex = null;
      isTeamSlotDragActive = false;
      els.teamSlots.querySelectorAll(".team-slot").forEach((teamSlot) => {
        teamSlot.classList.remove("is-dragging", "is-drop-target");
      });
    });

      slot.addEventListener("dragover", (event) => {
        const isInternalDrag = isInternalTeamSlotDrag(event);
        if (isInternalDrag) {
          if (draggedTeamIndex === null || draggedTeamIndex === index) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          slot.classList.add("is-drop-target");
          return;
        }
        if (isTransferWithFiles(event)) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          slot.classList.add("is-drop-target");
          return;
        }
      });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("is-drop-target");
    });

      slot.addEventListener("drop", (event) => {
        event.preventDefault();
        slot.classList.remove("is-drop-target");
        if (isInternalTeamSlotDrag(event)) {
          const sourceIndex = Number(event.dataTransfer.getData("text/plain") || draggedTeamIndex);
          moveTeamSlot(sourceIndex, index);
          return;
        }
        const files = getTransferFiles(event);
        if (isTransferWithFiles(event)) {
          handleOcrFill(state.activeTeamKey, index, files);
          return;
        }
        const sourceIndex = Number(event.dataTransfer.getData("text/plain") || draggedTeamIndex);
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
        state.chargeSpeeds[index] = sanitizeChargeSpeed(event.target.value);
        event.target.value = state.chargeSpeeds[index];
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
    const paidTeamKey = normalizeTeamKey(openSlotSettings.teamKey || getPaidArenaDataTeamKey());
    const rowIndex = Number(openSlotSettings.rowIndex);
    const index = Number(openSlotSettings.index);
    const teams = getPaidArenaTeams(mode, paidTeamKey);
    const team = teams[rowIndex];
    const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, paidTeamKey);
    const character = team?.[index] || null;
    if (!character || !chargeSpeeds) return null;
    return {
      character,
      chargeSpeeds,
      index,
      teamKey: paidTeamKey,
      simulationTeamKey: paidTeamKey,
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
    title: `${getTeamLabel(teamKey)} P${index + 1}`,
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
  const useArca=usesArcaParameters(character,teamKey);
  const hasArca = !!state.helpCenter.solveWorkspace?.privateHelp || arcaWorkspace?.isEnabled();
  const switchMarkup=hasArca?`<label class="settings-field arca-slot-choice"><span>使用阿卡数据</span><input class="slot-settings-arca" type="checkbox" role="switch" ${useArca?'checked':''} /></label>`:'';
  const bindArcaSwitch=host=>{host.querySelector('.slot-settings-arca')?.addEventListener('change',event=>{
    const team=context.isPaidArena?getPaidArenaTeams(openSlotSettings.paidArenaMode,teamKey)[Number(openSlotSettings.rowIndex)]:getTeamState(teamKey);
    team[index]={...team[index],useArca:event.target.checked};saveTeam();render();
  });};
  const locked=!!hasArca&&useArca,arca=getArcaChargeParameters(character,teamKey);
  const chargeSpeedValue = sanitizeChargeSpeed(getArcaChargeParameters(character, teamKey)?.chargeSpeed ?? chargeSpeeds[index]);
  const chargeSpeedEntries = arca?.speedEntries || getSavedCharacterChargeSpeedEntries(character, teamKey);
  const showChargeSpeedSettings = canEditChargeSpeed(character);
  const chargeSpeedPreviewLabel = getChargeSpeedPreviewLabel(character, index, simulationTeamKey, chargeSpeedValue);
  const settingsFieldScope = `${teamKey}-${index}`;
  const chargeSpeedEntryOptions = CHARGE_SPEED_ENTRY_OPTIONS.map(
    (option) => `<option value="${option.toFixed(2)}">${formatChargeSpeedEntry(option)}</option>`,
  ).join("");
  const chargeSpeedEntrySelects = chargeSpeedEntries
    .map(
      (entry, entryIndex) => `
        <select
          class="slot-settings-speed-entry"
          data-speed-entry-index="${entryIndex}"
          name="speed-entry-${settingsFieldScope}-${entryIndex}"
          id="speed-entry-${settingsFieldScope}-${entryIndex}"
          aria-label="${escapeHtml(localize("蓄力速度词条", "Charge speed line"))} ${entryIndex + 1}"
        >
          ${CHARGE_SPEED_ENTRY_OPTIONS.includes(entry)?chargeSpeedEntryOptions.replace(`value="${entry.toFixed(2)}"`, `value="${entry.toFixed(2)}" selected`):`<option selected value="${entry.toFixed(2)}">${formatChargeSpeedEntry(entry)}</option>`+chargeSpeedEntryOptions}
        </select>
      `,
    )
    .join("");
  const cubeType = arca?.displayCubeType || getSavedCharacterCubeType(character, teamKey);
  const cubeOptionsMarkup = TEAM_CUBE_OPTIONS.map((option) => {
    const isChargeSpeedCube = option.type === CUBE_TYPE_CHARGE_SPEED;
    const isDisabled = isChargeSpeedCube && !showChargeSpeedSettings;
    const title = `${localize(option.name, option.enName)}${isChargeSpeedCube ? ` +${CHARGE_SPEED_CUBE_VALUE.toFixed(2)}%` : ""}`;
    return `
      <label class="settings-cube-option is-icon-only${isDisabled ? " is-disabled" : ""}" title="${escapeHtml(title)}">
        <input class="slot-settings-cube-type" type="radio" name="cube-type-${settingsFieldScope}" value="${escapeHtml(option.type)}"${cubeType === option.type ? " checked" : ""}${isDisabled ? " disabled" : ""} />
        <img class="settings-check-icon" src="${escapeHtml(getCubeIconSrc(option.type))}" alt="${escapeHtml(localize(option.name, option.enName))}" loading="lazy" />
      </label>
    `;
  }).join("");
  const isScarletSettings = state.allowMissedShots && isScarlet(character);
  const magazineValue = arca?.magazine ?? (isScarletSettings ? getSavedCharacterMagazine(character, teamKey) || sanitizeMagazine(character.stats?.magazine) : Number(character.stats?.magazine)||0);
  const reloadValue=arca?.reloadSeconds ?? (Number(character.stats?.reloadSeconds)||0);
  const backdrop = document.createElement("div");
  backdrop.className = "slot-settings-backdrop";
  backdrop.setAttribute("role", "presentation");
  backdrop.innerHTML = `
    <section class="slot-settings-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(localize("设置", "Settings"))} ${escapeHtml(getCharacterLocalizedName(character))}">
      <div class="slot-settings-modal-head">
        <div>
          <span class="slot-settings-team">${escapeHtml(context.title)}</span>
          <strong>${escapeHtml(getCharacterDisplayName(character))}</strong>
        </div>
        <button class="slot-settings-close" type="button" aria-label="${escapeHtml(localize("关闭设置", "Close settings"))}">X</button>
      </div>
      ${switchMarkup}
      ${locked&&!arca?'<div class="settings-field">阿卡资料缺失，使用原设置</div>':''}
      ${
        showChargeSpeedSettings
          ? `
            <div class="settings-field settings-speed-entries">
              <span>${escapeHtml(localize("蓄速", "Speed"))}</span>
              <div class="slot-settings-speed-entry-list">
                ${chargeSpeedEntrySelects}
              </div>
              <input class="slot-settings-speed-total" type="number" min="0" max="100" step="1" name="speed-total-${settingsFieldScope}" id="speed-total-${settingsFieldScope}" value="${chargeSpeedValue}" aria-label="${escapeHtml(localize("最终蓄力速度", "Final charge speed"))}" />
              <span class="slot-settings-frame-preview" title="${escapeHtml(localize('蓄力时间与60FPS帧数', 'Charge time and frames at 60 FPS'))}">${chargeSpeedPreviewLabel}</span>
            </div>
          `
          : ""
      }
      ${
        magazineValue > 0
          ? `
            <label class="settings-field">
              <span>${escapeHtml(localize("弹容", "Ammo"))}</span>
              <input class="slot-settings-magazine" type="number" min="20" max="88" step="1" name="magazine-${settingsFieldScope}" id="magazine-${settingsFieldScope}" value="${magazineValue}" />
              <span>${escapeHtml(localize("发", "shots"))}</span>
            </label>
          `
          : ""
      }
      <div class="settings-field"><span>换弹</span><input type="text" disabled value="${formatNumber(reloadValue,3)}" aria-label="换弹时间" /><span>秒</span></div>
      <div class="settings-cube-field" role="radiogroup" aria-label="${escapeHtml(localize("魔方选择", "Cube selection"))}">
        <span>${escapeHtml(localize("魔方", "Cube"))}${locked&&arca?.cubeLv?` Lv.${arca.cubeLv}`:""}</span>
        <label class="settings-cube-option is-none">
          <input class="slot-settings-cube-type" type="radio" name="cube-type-${settingsFieldScope}" value="${CUBE_TYPE_NONE}"${cubeType === CUBE_TYPE_NONE ? " checked" : ""} />
          <span>${escapeHtml(localize("无", "None"))}</span>
        </label>
        ${cubeOptionsMarkup}
      </div>
      <button class="slot-settings-reset" type="button">${escapeHtml(localize("重置默认", "Reset default"))}</button>
    </section>
  `;

  bindArcaSwitch(backdrop);
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

  if(locked){backdrop.querySelectorAll('input,select,button').forEach(node=>{if(!node.classList.contains('slot-settings-arca')&&!node.classList.contains('slot-settings-close'))node.disabled=true;});return backdrop;}
  if(!isScarletSettings){const input=backdrop.querySelector('.slot-settings-magazine');if(input)input.disabled=true;}
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
        speedFramePreview.textContent = getChargeSpeedPreviewLabel(character, index, simulationTeamKey, speed);
      }
    };
    const updateManualSpeedFramePreview = () => {
      if (!speedFramePreview) return;
      const speed = sanitizeChargeSpeed(speedTotal?.value);
      speedFramePreview.textContent = getChargeSpeedPreviewLabel(character, index, simulationTeamKey, speed, 'total');
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
  if (magazineInput && isScarletSettings) {
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
  const teamKey = normalizeTeamKey(openRosannaSacrificeSettings.teamKey);
  const rowIndex = Number(openRosannaSacrificeSettings.rowIndex) || 0;
  const index = Number(openRosannaSacrificeSettings.index);
  const team = (isPaidArena ? getPaidArenaTeams(paidArenaMode, teamKey)[rowIndex] : getTeamState(teamKey)) || [];
  const rosanna = team[index];
  if (!rosanna || !isRosanna(rosanna)) {
    openRosannaSacrificeSettings = null;
    return null;
  }

  const sacrificeFrames = isPaidArena
    ? getPaidArenaRosannaSacrificeFrames(paidArenaMode, teamKey)[rowIndex]
    : getRosannaSacrificeFrameState(teamKey);
  if (!sacrificeFrames) {
    openRosannaSacrificeSettings = null;
    return null;
  }
  sacrificeFrames[index] = null;
  const sacrificeScope = `${teamKey}-${rowIndex}-${index}`;
  const targetRows = team
    .map((character, positionIndex) => ({ character, positionIndex }))
    .filter((entry) => entry.character && entry.positionIndex !== index);
  const backdrop = document.createElement("div");
  backdrop.className = "slot-settings-backdrop";
  backdrop.setAttribute("role", "presentation");
  backdrop.innerHTML = `
    <section class="slot-settings-modal rosanna-sacrifice-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(localize("罗珊娜献祭设置", "Rosanna sacrifice settings"))}">
      <div class="slot-settings-modal-head">
        <div>
          <span class="slot-settings-team">${escapeHtml(isPaidArena ? `${getPaidArenaModeLabel(paidArenaMode)} P${rowIndex + 1}` : getTeamLabel(teamKey))}</span>
          <strong>${escapeHtml(localize("罗珊娜献祭", "Rosanna sacrifice"))}</strong>
        </div>
        <button class="slot-settings-close" type="button" aria-label="${escapeHtml(localize("关闭献祭设置", "Close sacrifice settings"))}">X</button>
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
                      <span class="rosanna-sacrifice-name">P${positionIndex + 1} ${escapeHtml(getCharacterLocalizedName(character))}</span>
                    <input
                      class="rosanna-sacrifice-frame"
                      type="number"
                      min="0"
                      max="${CHART_MAX_FRAME}"
                      step="1"
                      name="rosanna-sacrifice-${sacrificeScope}-${positionIndex}"
                      id="rosanna-sacrifice-${sacrificeScope}-${positionIndex}"
                      value="${frame ?? ""}"
                      placeholder="${escapeHtml(localize("空", "None"))}"
                      data-sacrifice-index="${positionIndex}"
                    />
                      <span>F</span>
                    </label>
                  `;
                })
                .join("")
            : `<p class="rosanna-sacrifice-empty">${escapeHtml(localize("暂无可献祭角色", "No available sacrifice targets"))}</p>`
        }
      </div>
      <button class="slot-settings-reset rosanna-sacrifice-reset" type="button">${escapeHtml(localize("重置默认", "Reset default"))}</button>
    </section>
  `;

  const close = () => {
    openRosannaSacrificeSettings = null;
    saveTeam();
    render();
  };
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

function closeInlineSlotMenus() {
  if (!openSlotSettings && !openRosannaSacrificeSettings) return false;
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
  return true;
}

function hasSeenHelpIntro() {
  return localStorage.getItem(HELP_INTRO_STORAGE_KEY) === "1";
}

let helpContentModule = null;

function getHelpContentApi() {
  return {
    escapeHtml,
    helpButton: els.helpButton,
    isEnglishLanguage,
    localize,
  };
}

async function loadHelpContentModule() {
  const runtime = await refreshAppRuntimeContext();
  const module = await runtime.loadAppModule("help-content", () => importAppModule("./modules/help-content.js"));
  module.setHelpContentApi(getHelpContentApi());
  helpContentModule = module;
  return module;
}

function closeHelpModal() {
  if (helpContentModule) return helpContentModule.closeHelpModal();
  document.querySelector(".help-modal-backdrop:not(.changelog-modal-backdrop):not(.suggestion-modal-backdrop):not(.legal-modal-backdrop)")?.remove();
  return undefined;
}

function openHelpModal(options = {}) {
  if (!GUIDANCE_ENABLED) return Promise.resolve();
  return loadHelpContentModule()
    .then((module) => module.openHelpModal(options))
    .catch((error) => console.warn("help module failed", error));
}

function showInitialHelpIntro() {
  if (hasSeenHelpIntro()) return;
  window.requestAnimationFrame(() => openHelpModal({ intro: true }));
}

function closeChangelogModal() {
  if (helpContentModule) return helpContentModule.closeChangelogModal();
  document.querySelector(".changelog-modal-backdrop")?.remove();
  return undefined;
}

function openChangelogModal() {
  return loadHelpContentModule()
    .then((module) => module.openChangelogModal())
    .catch((error) => console.warn("changelog module failed", error));
}

function closeSuggestionModal() {
  if (helpContentModule) return helpContentModule.closeSuggestionModal();
  document.querySelector(".suggestion-modal-backdrop")?.remove();
  return undefined;
}

function openSuggestionModal() {
  return loadHelpContentModule()
    .then((module) => module.openSuggestionModal())
    .catch((error) => console.warn("suggestion module failed", error));
}

function hasSeenGuidedTour() {
  return localStorage.getItem(GUIDED_TOUR_STORAGE_KEY) === "1";
}

// 邮件里的重置密码链接携带 recovery 会话；此时必须让用户看到改密表单，
// 不能被新手引导遮罩抢占，否则无法输入新密码。
// 页面加载后 Service Worker 接管会触发一次重载，重载会丢掉 URL 里的 hash，
// 所以这里以带时效的标记为准，而不是只看当前 URL。
const PASSWORD_RECOVERY_TTL_MS = 60 * 60 * 1000;

function rememberPasswordRecovery() {
  try {
    sessionStorage.setItem(PASSWORD_RECOVERY_STORAGE_KEY, String(Date.now()));
  } catch {
    // 隐私模式下无法写入时仍依赖内存状态，至少本次引导会被跳过。
  }
}

function isPasswordRecoveryPending() {
  if (state.authRecoveryPending) return true;
  try {
    const raw = sessionStorage.getItem(PASSWORD_RECOVERY_STORAGE_KEY);
    if (!raw) return false;
    // 兼容早期写入的 "1" 标记：视为仍待处理，由 1 小时时效兜底。
    if (raw === "1") return true;
    const at = Number(raw);
    if (!Number.isFinite(at) || at <= 0) return false;
    return Date.now() - at < PASSWORD_RECOVERY_TTL_MS;
  } catch {
    return false;
  }
}

// 密码更新成功后由 account-modal 清除同名 sessionStorage 标记。


function getGuidedTourApi() {
  return {
    escapeHtml,
    isEnglishLanguage,
    localize,
    setGuidedTourActive: (active) => {
      isGuidedTourActive = Boolean(active);
    },
  };
}

async function loadGuidedTourModule() {
  const runtime = await refreshAppRuntimeContext();
  const module = await runtime.loadAppModule("guided-tour", () => importAppModule("./modules/guided-tour.js"));
  module.setGuidedTourApi(getGuidedTourApi());
  guidedTourModulePromise = Promise.resolve(module);
  return module;
}

const GUIDANCE_ENABLED = false;

function startGuidedTour() {
  if (!GUIDANCE_ENABLED) return;
  if (isGuidedTourActive || hasSeenGuidedTour()) return;
  // 双保险：即便引导判断被绕过，只要处于恢复会话或账号弹窗已打开，都不启动引导。
  if (isPasswordRecoveryPending() || document.querySelector(".account-modal-backdrop")) return;
  void loadGuidedTourModule()
    .then((module) => {
      if (isPasswordRecoveryPending() || document.querySelector(".account-modal-backdrop")) return;
      module.startGuidedTour();
    })
    .catch((error) => console.warn("guided tour module failed", error));
}

// 打开改密表单前，先移除可能已经渲染的引导遮罩，避免两层叠加。
function dismissGuidedTourOverlay() {
  const overlay = document.querySelector(".guided-tour-backdrop");
  if (overlay) overlay.remove();
  document.body.classList.remove("is-guided-tour");
  isGuidedTourActive = false;
}

function completeGuidedTour() {
  if (!guidedTourModulePromise) {
    localStorage.setItem(GUIDED_TOUR_STORAGE_KEY, "1");
    isGuidedTourActive = false;
    return;
  }
  void guidedTourModulePromise
    .then((module) => module.completeGuidedTour())
    .catch((error) => console.warn("guided tour close failed", error));
}

let legalContentModule = null;

function getLegalContentApi() {
  return {
    escapeHtml,
    isEnglishLanguage,
    localize,
  };
}

async function loadLegalContentModule() {
  const runtime = await refreshAppRuntimeContext();
  const module = await runtime.loadAppModule("legal-content", () => importAppModule("./modules/legal-content.js"));
  module.setLegalContentApi(getLegalContentApi());
  legalContentModule = module;
  return module;
}

function closeLegalModal() {
  if (legalContentModule) return legalContentModule.closeLegalModal();
  document.querySelector(".legal-modal-backdrop")?.remove();
  return undefined;
}

function openLegalModal(type = "terms") {
  return loadLegalContentModule()
    .then((module) => module.openLegalModal(type))
    .catch((error) => console.warn("legal module failed", error));
}

function normalizeInviteCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32);
}

function captureInviteCodeFromLocation() {
  try {
    const url = new URL(window.location.href);
    const inviteCode = normalizeInviteCode(url.searchParams.get("invite"));
    if (!inviteCode) return "";
    capturedInviteCodeOnLoad = inviteCode;
    localStorage.setItem(INVITE_CODE_STORAGE_KEY, inviteCode);
    url.searchParams.delete("invite");
    if (window.history?.replaceState) {
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState(null, document.title, nextUrl || window.location.pathname);
    }
    return inviteCode;
  } catch {
    return "";
  }
}

function getPendingInviteCode() {
  try {
    return normalizeInviteCode(localStorage.getItem(INVITE_CODE_STORAGE_KEY));
  } catch {
    return "";
  }
}

function clearPendingInviteCode() {
  try {
    localStorage.removeItem(INVITE_CODE_STORAGE_KEY);
  } catch {
    // ignore storage failure
  }
}

function getDeviceId() {
  try {
    const existing = String(localStorage.getItem(DEVICE_ID_STORAGE_KEY) || "").trim();
    if (existing) return existing;
    const next = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, next);
    return next;
  } catch {
    return "";
  }
}

function getAuthRedirectUrl() {
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    return `${window.location.origin}${window.location.pathname}`;
  }
  return "https://nikke.skyxmoon.cn/";
}

function getStoredAuthSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AUTH_SESSION_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object" || !parsed.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveAuthSession(session, options = {}) {
  const previousExternalKeyCacheKey = getExternalApiKeyAccountCacheKey();
  const previousUserId = state.authSession?.user?.id || state.authSession?.email || "";
  const leavingPrivateWorkspace=!!state.helpCenter.solveWorkspace?.privateHelp&&previousUserId!==(session?.user?.id||session?.email||'');
  state.authSession = session || null;
  if(previousUserId!==(session?.user?.id||session?.email||'')){
    if(state.helpCenter.solveWorkspace?.privateHelp)clearHelpCenterSolveDraft();
    for(const [key,draft] of state.helpCenter.solveDrafts)if(draft.privateHelp)state.helpCenter.solveDrafts.delete(key);
    document.querySelector('.private-help-backdrop')?.dispatchEvent(new Event('help-dismiss'));
  }
  if(previousUserId!==(session?.user?.id||session?.email||''))arcaWorkspace?.reset();
  if (!session) {
    clearTapTapAutoSyncData();
  }
  const nextExternalKeyCacheKey = getExternalApiKeyAccountCacheKey();
  if (!session || previousExternalKeyCacheKey !== nextExternalKeyCacheKey) clearExternalApiKeyPanelCache();
  if (!session || previousUserId !== (session.user?.id || session.email || "")) clearAccountStatus();
  try {
    if (options.persist === false) {
      // A storage event adopts another tab's session without writing it back.
    } else if (session) {
      localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    }
  } catch {
    // Auth still works for the current page even if localStorage is unavailable.
  }
  syncAccountButton();
  syncChampionDataFeatureVisibility();
  if(leavingPrivateWorkspace)render();
}

function clearAccountStatus() {
  state.accountProfile = null;
  state.entitlements = new Map();
  state.entitlementLoaded = false;
  state.isAdmin = false;
  syncAdminPageButtonVisibility();
}

function getAuthFailureCode(payload) {
  return String(payload?.code || payload?.error_code || payload?.error || "").trim().toUpperCase();
}

function isRejectedAuthSessionResponse(response, payload) {
  const status = Number(response?.status || 0);
  const code = getAuthFailureCode(payload);
  if (status === 401 || code === "UNAUTHENTICATED" || code === "JWT_EXPIRED" || code === "INVALID_JWT") return true;
  if (status !== 403) return false;
  const raw = `${code} ${payload?.message || ""} ${payload?.msg || ""} ${payload?.error_description || ""}`;
  return /AUTH|JWT|TOKEN|SESSION|EXPIRED|INVALID/i.test(raw);
}

function handleRejectedAuthSessionResponse(response, payload, options = {}) {
  if (!isRejectedAuthSessionResponse(response, payload)) return false;
  // Protected requests retry through the shared session manager. A rejected
  // access token is not evidence that the persisted refresh token is invalid.
  if ((state.authSession || getStoredAuthSession())?.refreshToken) return true;
  const hadSession = Boolean(state.authSession?.accessToken || getStoredAuthSession()?.accessToken);
  saveAuthSession(null);
  if (hadSession && options.toast !== false) {
    showToast(localize("\u767b\u5f55\u72b6\u6001\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55", "Sign-in expired. Please sign in again."));
  }
  return true;
}

function getAuthSessionEmail(session = state.authSession) {
  return session?.user?.email || session?.email || "";
}

function isFrontendKnownAdminEmail(email) {
  return FRONTEND_ADMIN_EMAILS.has(String(email || "").trim().toLowerCase());
}

function getAuthSessionUsername(session = state.authSession) {
  const metadata = session?.user?.user_metadata || session?.user?.raw_user_meta_data || {};
  return normalizeUsername(
    metadata.username || metadata.display_name || metadata.name || session?.username || session?.displayName || "",
  );
}

function getAccountProfileDisplayName() {
  return normalizeUsername(state.accountProfile?.display_name || "");
}

function getAccountProfileTapTapUid() {
  return String(state.accountProfile?.taptap_uid || state.accountProfile?.taptapUid || "").trim();
}

function getAccountProfileDisplayNameChangedAt(profile = state.accountProfile) {
  return String(profile?.display_name_changed_at || profile?.metadata?.display_name_changed_at || "");
}

function hasAccountProfileChangedEffectiveDisplayName(profile = state.accountProfile) {
  const changedAt = getAccountProfileDisplayNameChangedAt(profile);
  if (!changedAt) return false;
  const displayName = normalizeUsername(profile?.display_name || "");
  const email = normalizeUsername(getAuthSessionEmail());
  return Boolean(displayName && displayName !== email);
}

function syncAuthSessionDisplayName(displayName) {
  const username = normalizeUsername(displayName);
  if (!username || !state.authSession) return;
  const currentUser = state.authSession.user || {};
  const currentMetadata = currentUser.user_metadata || currentUser.raw_user_meta_data || {};
  saveAuthSession({
    ...state.authSession,
    username,
    displayName: username,
    user: {
      ...currentUser,
      user_metadata: {
        ...currentMetadata,
        username,
        display_name: username,
        name: username,
      },
    },
  });
}

function isAuthSessionExpiring(session, marginSeconds = 60) {
  if (!session?.expiresAt) return false;
  return Number(session.expiresAt) <= Math.floor(Date.now() / 1000) + marginSeconds;
}

function normalizeSupabaseAuthSession(payload) {
  if (!payload?.access_token) return null;
  const expiresIn = Number(payload.expires_in || 3600);
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token || "",
    tokenType: payload.token_type || "bearer",
    expiresAt: Number(payload.expires_at || Math.floor(Date.now() / 1000) + expiresIn),
    user: payload.user || null,
    email: payload.user?.email || "",
    username: getAuthSessionUsername({ user: payload.user || null }),
    displayName: getAuthSessionUsername({ user: payload.user || null }),
  };
}

function consumeSupabaseAuthCallbackFromLocation() {
  if (!window.location.hash) return false;
  const raw = window.location.hash.slice(1);
  const params = new URLSearchParams(raw);
  const accessToken = params.get("access_token");
  const callbackError = params.get("error") || params.get("error_code") || "";
  // 重置邮件链接只能使用一次；再次点击或链接过期时，Supabase 会回跳成
  // #error=access_denied&error_code=otp_expired，此时没有 access_token。
  // 只要带着回调错误参数，就说明用户来自认证流程，不能按普通首次访问处理。
  if (!accessToken) {
    if (!callbackError) return false;
    state.authCallbackError = params.get("error_description") || params.get("error") || callbackError;
    if (window.history?.replaceState) {
      window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
    }
    return true;
  }
  const payload = {
    access_token: accessToken,
    refresh_token: params.get("refresh_token") || "",
    expires_in: Number(params.get("expires_in") || 3600),
    token_type: params.get("token_type") || "bearer",
    user: null,
  };
  saveAuthSession(normalizeSupabaseAuthSession(payload));
  state.authRecoveryPending = params.get("type") === "recovery";
  if (state.authRecoveryPending) rememberPasswordRecovery();
  if (window.history?.replaceState) {
    window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
  }
  return state.authRecoveryPending;
}

function getSupabaseAuthUrl(path) {
  return `${SUPABASE_PROJECT_URL}${path}`;
}

async function supabaseAuthRequest(path, options = {}) {
  const { method = "POST", body = null, accessToken = "" } = options;
  const headers = {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const response = await fetch(getSupabaseAuthUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }
  if (!response.ok) {
    const message = payload?.error_description || payload?.msg || payload?.message || payload?.error || `Auth request failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload || {};
}

let authSessionManagerPromise = null;

function getAuthSessionManager() {
  if (!authSessionManagerPromise) {
    authSessionManagerPromise = importAppModule("./modules/auth-session.js").then(({ createAuthSessionManager }) => createAuthSessionManager({
      storageKey: AUTH_SESSION_STORAGE_KEY,
      getSession: () => state.authSession,
      saveSession: saveAuthSession,
      requestAuth: supabaseAuthRequest,
      normalizeSession: normalizeSupabaseAuthSession,
      getUnavailableMessage: () => localize("登录续期暂时失败，请检查网络后重试，无需重新登录", "Session refresh failed temporarily. Check your connection and try again; no need to sign in again."),
      getVerificationMessage: () => localize("登录验证暂时失败，请稍后重试，无需重新登录", "Session verification failed temporarily. Please try again; no need to sign in again."),
      getSignInMessage: () => localize("请先登录账号", "Please sign in first."),
      getSessionChangedMessage: () => localize("登录账号已改变，请重试当前操作", "The signed-in account changed. Please try again."),
      onResume: (session) => {
        if (session?.accessToken && !state.entitlementLoaded) {
          void refreshAccountStatus().then((data) => {
            if (data) void syncAccountDataOncePerPage();
          }).catch(() => null);
        }
      },
    })).catch((error) => {
      authSessionManagerPromise = null;
      throw error;
    });
  }
  return authSessionManagerPromise;
}

async function refreshAuthSessionIfNeeded(options = {}) {
  return (await getAuthSessionManager()).refresh(options);
}

async function authenticatedFetch(url, options = {}, authOptions = {}) {
  return (await getAuthSessionManager()).request((accessToken) => {
    const headers = new Headers(options.headers);
    headers.delete("Authorization");
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(url, { ...options, headers });
  }, authOptions);
}

async function hydrateAuthSessionUserIfNeeded() {
  const session = state.authSession || getStoredAuthSession();
  if (!session?.accessToken || getAuthSessionUsername(session)) {
    syncAccountButton();
    return session;
  }
  try {
    const response = await authenticatedFetch(getSupabaseAuthUrl("/auth/v1/user"), {
      method: "GET",
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      handleRejectedAuthSessionResponse(response, payload, { toast: false });
      return state.authSession;
    }
    const currentSession = state.authSession;
    if (!currentSession || (session.user?.id && session.user.id !== currentSession.user?.id)) return currentSession;
    const nextSession = {
      ...currentSession,
      user: payload || session.user,
      email: payload?.email || session.email || "",
      username: getAuthSessionUsername({ user: payload || null, username: session.username, displayName: session.displayName }),
      displayName: getAuthSessionUsername({ user: payload || null, username: session.username, displayName: session.displayName }),
    };
    saveAuthSession(nextSession);
    return nextSession;
  } catch {
    syncAccountButton();
    return state.authSession;
  }
}

async function getAuthenticatedAccessToken() {
  const session = await refreshAuthSessionIfNeeded();
  return session?.accessToken || "";
}

const externalEquipmentAutoSyncState = {
  running: false,
  lastSyncedIdentity: "",
};

function getExternalEquipmentCacheKey(provider = EXTERNAL_EQUIPMENT_PROVIDER, region = null) {
  const authUserId = state.authSession?.user?.id || state.accountProfile?.auth_user_id || "anonymous";
  return `${EXTERNAL_EQUIPMENT_CACHE_STORAGE_PREFIX}:${authUserId}:${provider}:${normalizeThirdPartyDataRegion(region)}`;
}

function canEditThirdPartyCharacterData(region = null) {
  return normalizeThirdPartyDataRegion(region) === "cn";
}

function showThirdPartyReadOnlyNotice() {
  showToast(localize("国际服禁用修改功能", "Editing is disabled on the global server."), { duration: 3000 });
}

function getCachedExternalEquipment(provider = EXTERNAL_EQUIPMENT_PROVIDER, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  try {
    const currentKey = getExternalEquipmentCacheKey(provider, dataRegion);
    const legacyKey = `${EXTERNAL_EQUIPMENT_CACHE_STORAGE_PREFIX}:${state.authSession?.user?.id || state.accountProfile?.auth_user_id || "anonymous"}:${provider}`;
    const raw = localStorage.getItem(currentKey) || (dataRegion === "cn" ? localStorage.getItem(legacyKey) : null);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    console.error("[ThirdPartySync] third-party data cache read exception", { provider, region: dataRegion, error });
    return null;
  }
}

function saveCachedExternalEquipment(data, provider = EXTERNAL_EQUIPMENT_PROVIDER, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region || data?.region);
  try {
    localStorage.setItem(getExternalEquipmentCacheKey(provider, dataRegion), JSON.stringify({
      provider,
      region: dataRegion,
      syncedAt: new Date().toISOString(),
      data,
    }));
    arcaWorkspace?.profileChanged();
    return true;
  } catch (error) {
    console.error("[ThirdPartySync] third-party data cache write exception", { provider, region: dataRegion, error });
    return false;
  }
}

function getExternalEquipmentSessionIdentity(provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  const session = state.authSession || getStoredAuthSession();
  const authUserId = session?.user?.id || session?.user?.email || session?.email || "";
  if (!session?.accessToken || !authUserId) return "";
  return `${authUserId}:${provider}`;
}

async function syncExternalEquipmentOncePerSession(provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  const identity = getExternalEquipmentSessionIdentity(provider);
  if (!identity) {
    console.warn("[ThirdPartySync] auto-sync skipped: missing authenticated identity");
    return false;
  }
  if (externalEquipmentAutoSyncState.running) {
    console.warn("[ThirdPartySync] auto-sync skipped: another sync is already running");
    return false;
  }
  if (externalEquipmentAutoSyncState.lastSyncedIdentity === identity) {
    return false;
  }

  try {
    const keyData = await getExternalApiKeyPanelData(provider);
    if (!keyData?.apiKey) {
      console.warn("[ThirdPartySync] auto-sync skipped: missing third-party API key", { provider });
      return false;
    }
  } catch (error) {
    console.error("[ThirdPartySync] external API key lookup exception", { provider, error });
    return false;
  }

  externalEquipmentAutoSyncState.running = true;
  let allRegionsSynced = true;
  try {
    for (const region of THIRD_PARTY_DATA_REGIONS) {
      try {
        const data = await syncThirdPartyUserInfo(provider, region);
        const cacheSaved = saveCachedExternalEquipment(data, provider, region);
        if (!cacheSaved) {
          allRegionsSynced = false;
          console.error("[ThirdPartySync] user info cache persistence failed", { provider, region });
        }
      } catch (error) {
        allRegionsSynced = false;
        console.error("[ThirdPartySync] auto-sync region exception", { provider, region, identity, error });
      }
    }
    if (allRegionsSynced) externalEquipmentAutoSyncState.lastSyncedIdentity = identity;
    return allRegionsSynced;
  } catch (error) {
    console.error("[ThirdPartySync] auto-sync exception after getUserInfo response", { provider, identity, error });
    return false;
  } finally {
    externalEquipmentAutoSyncState.running = false;
  }
}

function cloneJsonData(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function getMutableExternalEquipmentCacheData(provider = EXTERNAL_EQUIPMENT_PROVIDER, region = null) {
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const cached = getCachedExternalEquipment(provider, dataRegion);
  const data = cloneJsonData(cached?.data, null) || {
    provider,
    region: dataRegion,
    keyHint: "",
    syncedAt: new Date().toISOString(),
    source: "local.imageRecognition",
    payload: { success: true, data: [] },
  };
  if (!data.payload || typeof data.payload !== "object") data.payload = { success: true, data: [] };
  if (!Array.isArray(data.payload.data)) data.payload.data = [];
  data.provider = data.provider || provider;
  data.syncedAt = new Date().toISOString();
  data.source = "local.imageRecognition";
  data.region = dataRegion;
  return data;
}

function getExternalEquipmentSlotLabel(slotNo) {
  return [localize("\u5934", "Head"), localize("\u8863", "Body"), localize("\u624b", "Arms"), localize("\u978b", "Legs")][Number(slotNo)] || localize("\u88c5\u5907", "Equipment");
}

function applyRecognizedEquipmentToCharacter(character, equipmentInfo, provider = EXTERNAL_EQUIPMENT_PROVIDER, region = null) {
  const slotNo = getExternalEquipmentSlotNo(equipmentInfo);
  if (slotNo === null) return false;
  const dataRegion = normalizeThirdPartyDataRegion(region);
  const data = getMutableExternalEquipmentCacheData(provider, dataRegion);
  const characterName = getExternalEquipmentCharacterName(character);
  if (!characterName) return false;
  let record = data.payload.data.find((item) => String(item?.characterName || "").trim() === characterName);
  if (!record) {
    record = { characterName, equipmentInfos: [] };
    data.payload.data.push(record);
  }
  if (!Array.isArray(record.equipmentInfos)) record.equipmentInfos = [];
  const nextEquipment = {
    slotNo,
    slotName: equipmentInfo?.slotName || getExternalEquipmentSlotLabel(slotNo),
    ...(equipmentInfo?.lv != null ? { lv: equipmentInfo.lv } : {}),
    statInfos: getExternalAffixArray(equipmentInfo).map((affix, index) => ({
      index: Number.isFinite(Number(affix?.index)) ? Number(affix.index) : index + 1,
      statNo: Number.isFinite(Number(affix?.statNo)) ? Number(affix.statNo) : affix?.statNo,
      statName: affix?.statName || "",
      statShortName: affix?.statShortName || affix?.statName || "",
      statValue: Number.isFinite(Number(affix?.statValue)) ? Number(affix.statValue) : affix?.statValue,
      statValueLevel: Number.isFinite(Number(affix?.statValueLevel)) ? Number(affix.statValueLevel) : affix?.statValueLevel,
    })),
  };
  const existingIndex = record.equipmentInfos.findIndex((item) => getExternalEquipmentSlotNo(item) === slotNo);
  if (existingIndex >= 0) record.equipmentInfos[existingIndex] = nextEquipment;
  else record.equipmentInfos.push(nextEquipment);
  applyThirdPartyCharacterEquipmentLevels(character, { equipmentInfos: [nextEquipment] }, null, dataRegion);
  return saveCachedExternalEquipment(data, provider, dataRegion);
}

async function identifyEquipmentImagesAndUpdate(character, files, provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  const fileList = Array.from(files || []).filter((file) => file?.type?.startsWith("image/"));
  if (!fileList.length) {
    throw new Error(localize("\u8bf7\u9009\u62e9\u88c5\u5907\u8bcd\u6761\u56fe\u7247", "Please select equipment affix images."));
  }
  const characterName = getExternalEquipmentCharacterName(character);
  if (!characterName) {
    throw new Error(localize("\u5f53\u524d\u89d2\u8272\u65e0\u6cd5\u5bf9\u9f50\u7b2c\u4e09\u65b9\u88c5\u5907\u6570\u636e", "The current character cannot be matched to third-party equipment data."));
  }
  const keyData = await getExternalApiKeyPanelData(provider);
  const apiKey = String(keyData?.apiKey || "").trim();
  if (!apiKey) throw new Error(localize("\u8bf7\u5148\u4fdd\u5b58\u7b2c\u4e09\u65b9 API Key", "Please save the third-party API key first."));
  const formData = new FormData();
  const jpegFiles = await Promise.all(fileList.map((file) => convertThirdPartyEquipmentImageToJpeg(file)));
  jpegFiles.forEach((file) => {
    if (file) formData.append("files", file);
  });
  const url = `https://pinkuro.top:9984/third/bot/nikke/v2/identifyStatImageAndUpdate?characterName=${encodeURIComponent(characterName)}`;
  console.log("[ThirdPartyAPI] identifyStatImageAndUpdate request", {
    characterName,
    files: jpegFiles.map((file) => ({ name: file?.name || "", type: file?.type || "", size: file?.size || 0 })),
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "X-API-KEY": apiKey,
    },
    body: formData,
  });
  const payload = await response.json().catch(() => null);
  const data = payload?.data;
  const failReason = typeof data?.failReason === "string" ? data.failReason.trim() : "";
  console.log("[ThirdPartyAPI] identifyStatImageAndUpdate response", {
    status: response.status,
    success: payload?.success,
    equipmentCount: Array.isArray(data?.equipmentInfos) ? data.equipmentInfos.length : 0,
    hasFailureReason: Boolean(failReason),
  });
  if (!response.ok || payload?.success === false) {
    const code = payload?.code || response.status;
    throw new Error(failReason || payload?.message || `${localize("\u88c5\u5907\u56fe\u7247\u8bc6\u522b\u5e76\u66f4\u65b0\u5931\u8d25", "Equipment image recognition and update failed")}: ${code}`);
  }
  if (!Array.isArray(data?.equipmentInfos)) {
    throw new Error(failReason || localize("装备识别返回格式不正确，请稍后重试。", "Invalid equipment recognition response. Please try again later."));
  }
  if (!data.equipmentInfos.length) {
    throw new Error(failReason || localize("未识别到装备词条，请检查图片后重试。", "No equipment affixes recognized. Check the images and try again."));
  }
  return { equipmentInfos: data.equipmentInfos, failReason };
}

function getClipboardImageFileFromData(clipboardData) {
  const items = Array.from(clipboardData?.items || []);
  const imageItem = items.find((item) => item.kind === "file" && String(item.type || "").startsWith("image/"));
  const file = imageItem?.getAsFile?.() || null;
  if (!file) return null;
  return new File([file], file.name || "equipment-clipboard.png", { type: file.type || "image/png" });
}

async function readClipboardImageFile() {
  if (!navigator.clipboard?.read) {
    throw new Error(localize("\u5f53\u524d\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u8bfb\u53d6\u526a\u8d34\u677f\u56fe\u7247", "This browser does not support reading clipboard images."));
  }
  const clipboardItems = await navigator.clipboard.read();
  for (const item of clipboardItems) {
    const imageType = item.types?.find((type) => String(type).startsWith("image/"));
    if (!imageType) continue;
    const blob = await item.getType(imageType);
    const ext = imageType.split("/")[1] || "png";
    return new File([blob], `equipment-clipboard.${ext}`, { type: imageType });
  }
  throw new Error(localize("\u526a\u8d34\u677f\u91cc\u6ca1\u6709\u53ef\u8bc6\u522b\u7684\u56fe\u7247", "No recognizable image was found in the clipboard."));
}

async function recognizeAndApplyCharacterEquipmentImages(character, files) {
  const fileList = Array.from(files || []).filter(Boolean);
  if (!fileList.length) return;
  if (fileList.some((file) => !file.type.startsWith("image/"))) {
    showToast(localize("\u8bf7\u9009\u62e9\u88c5\u5907\u8bcd\u6761\u56fe\u7247", "Please select equipment affix images."));
    return;
  }
  showToast(localize("\u6b63\u5728\u8bc6\u522b\u5e76\u540c\u6b65\u88c5\u5907\u56fe\u7247...", "Recognizing and syncing equipment images..."), { duration: 1800 });
  const { equipmentInfos, failReason } = await identifyEquipmentImagesAndUpdate(character, fileList);
  equipmentInfos.forEach((equipmentInfo) => applyRecognizedEquipmentToCharacter(character, equipmentInfo));
  const successMessage = localize(`\u5df2\u66f4\u65b0${equipmentInfos.length}\u4ef6\u88c5\u5907\u8bcd\u6761`, `Updated ${equipmentInfos.length} equipment affix item(s).`);
  showToast(failReason ? `${successMessage}；${localize("部分图片未完成", "Some images were not processed")}: ${failReason}` : successMessage, { duration: failReason ? 5200 : 3000 });
  showCharacterDetailPanel(character);
  return equipmentInfos;
}

let characterEquipmentUploadModulePromise = null;

function getCharacterEquipmentUploadApi() {
  return {
    escapeHtml,
    getAuthErrorMessage,
    getClipboardImageFileFromData,
    localize,
    openShareImagePreview,
    readClipboardImageFile,
    recognizeAndApplyCharacterEquipmentImages,
    showToast,
  };
}

async function loadCharacterEquipmentUploadModule() {
  const runtime = await refreshAppRuntimeContext();
  const module = await runtime.loadAppModule("character-equipment-upload", () => importAppModule("./modules/character-equipment-upload.js"));
  module.setCharacterEquipmentUploadApi(getCharacterEquipmentUploadApi());
  characterEquipmentUploadModulePromise = Promise.resolve(module);
  return module;
}

async function uploadCharacterEquipmentImage(character, fileInput) {
  try {
    const module = await loadCharacterEquipmentUploadModule();
    return module.uploadCharacterEquipmentImage(character, fileInput);
  } catch (error) {
    showToast(getAuthErrorMessage(error), { duration: 5200 });
    return null;
  }
}

function closeCharacterEquipmentUploadModal() {
  const backdrop = document.querySelector(".character-equipment-upload-backdrop");
  if (!backdrop) return;
  const cleanup = backdrop._characterEquipmentUploadCleanup;
  if (typeof cleanup === "function") cleanup();
  backdrop.remove();
  if (characterEquipmentUploadModulePromise) {
    void characterEquipmentUploadModulePromise.then((module) => module.closeCharacterEquipmentUploadModal()).catch(() => {});
  }
}

function closeTopmostModalLayer() {
  const closeEntries = [
    [".character-equipment-upload-backdrop", closeCharacterEquipmentUploadModal],
    [".character-detail-export-preview-backdrop", closeCharacterDetailExportPreview],
    [".research-level-modal-backdrop", closeResearchLevelModal],
    [".collectible-modal-backdrop", closeCollectibleModal],
    [".detail-cube-modal-backdrop", closeDetailCubeModal],
    [".bond-level-modal-backdrop", closeBondLevelModal],
    [".equipment-level-modal-backdrop", closeEquipmentLevelModal],
    [".character-level-modal-backdrop", closeCharacterLevelModal],
    [".breakthrough-core-modal-backdrop", closeBreakthroughCoreModal],
    [".champion-player-detail-backdrop", closeChampionPlayerDetailModal],
    [".help-workflow-backdrop", () => document.querySelector(".help-workflow-backdrop")?.dispatchEvent(new Event("help-back"))],
    [".help-center-modal-backdrop", () => document.querySelector(".help-center-modal-backdrop")?.dispatchEvent(new Event("help-back"))],
    [".character-detail-panel.show", closeCharacterDetailPanel],
    [".slot-settings-backdrop", closeInlineSlotMenus],
    [".team-preset-backdrop", closeTeamPresetModal],
    [".account-modal-backdrop", closeAccountModal],
    [".legal-modal-backdrop", closeLegalModal],
    [".champion-data-modal-backdrop", closeChampionDataModal],
    [".paid-modal-backdrop", closePaidFeatureModal],
    [".changelog-modal-backdrop", closeChangelogModal],
    [".suggestion-modal-backdrop", closeSuggestionModal],
    [".help-modal-backdrop", closeHelpModal],
  ];
  const entry = closeEntries.find(([selector]) => document.querySelector(selector));
  if (!entry) return false;
  entry[1]();
  return true;
}

async function openCharacterEquipmentUploadModal(character, fileInput) {
  try {
    const module = await loadCharacterEquipmentUploadModule();
    return module.openCharacterEquipmentUploadModal(character, fileInput);
  } catch (error) {
    showToast(getAuthErrorMessage(error), { duration: 5200 });
    return null;
  }
}

function loadThirdPartyEquipmentImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(localize("图片加载失败", "Unable to load image.")));
    };
    image.src = url;
  });
}

function canvasToThirdPartyEquipmentBlob(canvas, type = "image/png", quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error(localize("图片转换失败", "Unable to convert image.")));
    }, type, quality);
  });
}

async function convertThirdPartyEquipmentImageToJpeg(file, quality = 1) {
  const image = await loadThirdPartyEquipmentImageFromFile(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width || 1;
  canvas.height = image.naturalHeight || image.height || 1;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(localize("\u65e0\u6cd5\u521b\u5efa\u56fe\u7247\u5e73\u53d8\u5f62", "Unable to create image canvas."));
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await canvasToThirdPartyEquipmentBlob(canvas, "image/jpeg", quality);
  const fileName = `${String(file?.name || "equipment-image").replace(/\.[^.]+$/, "")}.jpg`;
  return new File([blob], fileName, { type: "image/jpeg" });
}

function getExternalApiKeyAccountCacheKey(provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  const session = state.authSession || getStoredAuthSession();
  const accountId = session?.user?.id || session?.user?.email || session?.email || "anonymous";
  return `${accountId}:${provider}`;
}

function getExternalApiKeyPanelStorageKey(provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  return `${EXTERNAL_API_KEY_PANEL_CACHE_STORAGE_PREFIX}:${getExternalApiKeyAccountCacheKey(provider)}`;
}

function clearExternalApiKeyPanelCache() {
  externalApiKeyPanelCache.cacheKey = "";
  externalApiKeyPanelCache.data = null;
  externalApiKeyPanelCache.promise = null;
}

function setExternalApiKeyPanelCache(data, provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  externalApiKeyPanelCache.cacheKey = getExternalApiKeyAccountCacheKey(provider);
  externalApiKeyPanelCache.data = data || null;
  externalApiKeyPanelCache.promise = null;
  try {
    localStorage.setItem(getExternalApiKeyPanelStorageKey(provider), JSON.stringify({
      cachedAt: Date.now(),
      data: data || null,
    }));
  } catch {
    // Cache is optional.
  }
}

function getStoredExternalApiKeyPanelCache(provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  try {
    const raw = localStorage.getItem(getExternalApiKeyPanelStorageKey(provider));
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object" || !parsed.data) return null;
    const cachedAt = Number(parsed.cachedAt || 0);
    if (!Number.isFinite(cachedAt) || Date.now() - cachedAt > EXTERNAL_API_KEY_PANEL_CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

let externalApiKeyServiceModulePromise = null;

async function loadExternalApiKeyServiceModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!externalApiKeyServiceModulePromise) {
    externalApiKeyServiceModulePromise = runtime.loadAppModule("external-api-key-service", () => importAppModule("./modules/external-api-key-service.js"));
  }
  const module = await externalApiKeyServiceModulePromise;
  module.setExternalApiKeyServiceApi({
    provider: EXTERNAL_EQUIPMENT_PROVIDER,
    cache: externalApiKeyPanelCache,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
    externalApiKeyEndpoint: SUPABASE_EXTERNAL_API_KEY_ENDPOINT,
    thirdPartyEquipmentStatUrl: THIRD_PARTY_EQUIPMENT_STAT_URL,
    thirdPartyUserInfoUrl: THIRD_PARTY_USER_INFO_URL,
    thirdPartyUpdateUserInfoUrl: THIRD_PARTY_UPDATE_USER_INFO_URL,
    thirdPartyUpdateUserCharacterUrl: THIRD_PARTY_UPDATE_USER_CHARACTER_URL,
    authenticatedFetch,
    getAuthenticatedAccessToken,
    handleRejectedAuthSessionResponse,
    getExternalApiKeyAccountCacheKey,
    getStoredExternalApiKeyPanelCache,
    setExternalApiKeyPanelCache,
    maskExternalApiKey,
    localize,
  });
  return module;
}

async function getExternalApiKeyPanelData(provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  return (await loadExternalApiKeyServiceModule()).getExternalApiKeyPanelData(provider);
}

async function externalApiKeyRequest(method = "GET", body = null) {
  return (await loadExternalApiKeyServiceModule()).externalApiKeyRequest(method, body);
}

let pendingArcaBinding = null;
function getPendingArcaKey() {
  try { return localStorage.getItem(PENDING_ARCA_KEY_STORAGE_KEY) || window.__NIKKE_PENDING_ARCA_KEY__ || ""; }
  catch { return window.__NIKKE_PENDING_ARCA_KEY__ || ""; }
}
function clearPendingArcaKey(key) {
  try { if (localStorage.getItem(PENDING_ARCA_KEY_STORAGE_KEY) === key) localStorage.removeItem(PENDING_ARCA_KEY_STORAGE_KEY); } catch { /* Ignore unavailable storage. */ }
  if (window.__NIKKE_PENDING_ARCA_KEY__ === key) delete window.__NIKKE_PENDING_ARCA_KEY__;
}
async function bindPendingArcaKey() {
  const apiKey = getPendingArcaKey();
  if (!apiKey || !state.authSession?.accessToken || isPasswordRecoveryPending()) return;
  if (pendingArcaBinding) return pendingArcaBinding;
  const accountId = state.authSession.user?.id || state.authSession.email || "";
  pendingArcaBinding = (async () => {
    try {
      // PUT is insert-only. Older servers reject it instead of replacing an existing key.
      const data = await externalApiKeyRequest("PUT", { provider: EXTERNAL_EQUIPMENT_PROVIDER, apiKey });
      if (typeof data?.created !== "boolean") throw new Error("INVALID_BINDING_RESPONSE");
      clearPendingArcaKey(apiKey);
      if (data.created && accountId === (state.authSession?.user?.id || state.authSession?.email || "")) {
        setExternalApiKeyPanelCache(data, EXTERNAL_EQUIPMENT_PROVIDER);
        showToast(localize("阿卡 Key 已绑定", "Arca key connected."));
      }
    } catch {
      showToast(localize("阿卡 Key 暂未绑定，请稍后重新登录重试。", "Could not connect the Arca key. Please sign in again later."));
    }
  })().finally(() => { pendingArcaBinding = null; });
  return pendingArcaBinding;
}

async function syncThirdPartyUserInfo(provider = EXTERNAL_EQUIPMENT_PROVIDER, region = "cn") {
  try {
    const identity=getExternalEquipmentSessionIdentity(provider);
    const dataRegion = normalizeThirdPartyDataRegion(region);
    const data = await (await loadExternalApiKeyServiceModule()).syncThirdPartyUserInfo(provider, dataRegion);
    if(identity!==getExternalEquipmentSessionIdentity(provider))throw new Error('账号已改变，请重新操作。');
    applyThirdPartyUserInfoToLocalState(data?.payload, dataRegion);
    return data;
  } catch (error) {
    console.error("[ThirdPartySync] getUserInfo sync or local apply exception", { provider, region, error });
    throw error;
  }
}
async function syncThirdPartyUserInfoForAllRegions(provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  const regions = [];
  let allSucceeded = true;
  for (const region of THIRD_PARTY_DATA_REGIONS) {
    try {
      const data = await syncThirdPartyUserInfo(provider, region);
      const cacheSaved = saveCachedExternalEquipment(data, provider, region);
      if (!cacheSaved) allSucceeded = false;
      regions.push({ region, data, cacheSaved });
    } catch (error) {
      allSucceeded = false;
      regions.push({ region, error });
    }
  }
  if (!allSucceeded) {
    const error = new Error(localize("部分第三方区服数据同步失败", "Some third-party region data failed to sync."));
    error.regions = regions;
    throw error;
  }
  return { provider, syncedAt: new Date().toISOString(), regions };
}
async function fetchThirdPartyUserInfo(provider = EXTERNAL_EQUIPMENT_PROVIDER, region = "cn") {
  return (await loadExternalApiKeyServiceModule()).fetchThirdPartyUserInfo(provider, normalizeThirdPartyDataRegion(region));
}
async function updateThirdPartyUserInfo(payload = {}, provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  return (await loadExternalApiKeyServiceModule()).updateThirdPartyUserInfo(payload, provider);
}
async function updateThirdPartyUserCharacter(payload = [], provider = EXTERNAL_EQUIPMENT_PROVIDER) {
  return (await loadExternalApiKeyServiceModule()).updateThirdPartyUserCharacter(payload, provider);
}
function maskExternalApiKey(apiKey) {
  const text = String(apiKey || "").trim();
  if (!text) return "";
  if (text.length <= 8) return `${"*".repeat(Math.max(0, text.length - 2))}${text.slice(-2)}`;
  return `${text.slice(0, 3)}***${text.slice(-4)}`;
}

function formatLocalDateTime(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return String(value || "");
  return new Date(timestamp).toLocaleString(state.language === "en" ? "en-US" : "zh-CN", { hour12: false });
}

let externalApiKeyPanelModulePromise = null;

function getExternalApiKeyPanelApi() {
  return {
    provider: EXTERNAL_EQUIPMENT_PROVIDER,
    getExternalApiKeyPanelData,
    externalApiKeyRequest,
    syncThirdPartyUserInfo,
    syncThirdPartyUserInfoForAllRegions,
    syncExternalEquipmentOncePerSession,
    setExternalApiKeyPanelCache,
    saveCachedExternalEquipment,
    getCachedExternalEquipment,
    maskExternalApiKey,
    formatLocalDateTime,
    getAuthErrorMessage,
    localize,
    showToast,
  };
}

async function loadExternalApiKeyPanel(root) {
  const panel = root?.querySelector("[data-external-api-key-panel]");
  if (!panel) return;
  try {
    const runtime = await refreshAppRuntimeContext();
    if (!externalApiKeyPanelModulePromise) {
      externalApiKeyPanelModulePromise = runtime.loadAppModule("external-api-key-panel", () => importAppModule("./modules/external-api-key-panel.js"));
    }
    const module = await externalApiKeyPanelModulePromise;
    module.setExternalApiKeyPanelApi(getExternalApiKeyPanelApi());
    await module.loadExternalApiKeyPanel(root);
  } catch (error) {
    panel.hidden = false;
    const status = panel.querySelector("[data-external-api-key-status]");
    if (status) status.textContent = getAuthErrorMessage(error);
  }
}
let inviteServiceModulePromise = null;

async function loadInviteServiceModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!inviteServiceModulePromise) {
    inviteServiceModulePromise = runtime.loadAppModule("invite-service", () => importAppModule("./modules/invite-service.js"));
  }
  const module = await inviteServiceModulePromise;
  module.setInviteServiceApi({
    state,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
    userInvitesEndpoint: SUPABASE_USER_INVITES_ENDPOINT,
    authenticatedFetch,
    getAuthenticatedAccessToken,
    getDeviceId,
    handleRejectedAuthSessionResponse,
    normalizeInviteCode,
    getPendingInviteCode,
    clearPendingInviteCode,
    getAuthErrorMessage,
    localize,
    showToast,
  });
  return module;
}

async function userInviteRequest(method = "GET", body = null) {
  return (await loadInviteServiceModule()).userInviteRequest(method, body);
}

async function acceptPendingInviteIfNeeded(explicitInviteCode = "") {
  return (await loadInviteServiceModule()).acceptPendingInviteIfNeeded(explicitInviteCode);
}

async function acceptInviteCode(inviteCode) {
  return (await loadInviteServiceModule()).acceptInviteCode(inviteCode);
}

let invitePanelModulePromise = null;

function getInvitePanelApi() {
  return {
    state,
    getStoredAuthSession,
    escapeHtml,
    localize,
    formatLocalDateTime,
    normalizeInviteCode,
    getPendingInviteCode,
    clearPendingInviteCode,
    userInviteRequest,
    acceptInviteCode,
    showToast,
    getAuthErrorMessage,
  };
}

async function loadInvitePanel(root) {
  const panel = root?.querySelector("[data-invite-panel]");
  if (!panel) return;
  try {
    const runtime = await refreshAppRuntimeContext();
    if (!invitePanelModulePromise) {
      invitePanelModulePromise = runtime.loadAppModule("invite-panel", () => importAppModule("./modules/invite-panel.js"));
    }
    const module = await invitePanelModulePromise;
    module.setInvitePanelApi(getInvitePanelApi());
    await module.loadInvitePanel(root);
  } catch (error) {
    const status = panel.querySelector("[data-invite-status]");
    if (status) status.textContent = getAuthErrorMessage(error);
  }
}
let accountStatusServiceModulePromise = null;

let tapTapUserInfoServiceModulePromise = null;

async function loadTapTapUserInfoServiceModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!tapTapUserInfoServiceModulePromise) {
    tapTapUserInfoServiceModulePromise = runtime.loadAppModule("taptap-user-info-service", () => importAppModule("./modules/taptap-user-info-service.js"));
  }
  const module = await tapTapUserInfoServiceModulePromise;
  module.setTapTapUserInfoServiceApi({
    endpoint: SUPABASE_TAPTAP_USER_INFO_ENDPOINT,
    authenticatedFetch,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
    getAuthenticatedAccessToken,
    handleRejectedAuthSessionResponse,
    localize,
  });
  return module;
}

async function fetchTapTapUserInfo(taptapUid) {
  return (await loadTapTapUserInfoServiceModule()).fetchTapTapUserInfo(taptapUid);
}

const tapTapAutoSyncState = {
  running: false,
  lastSyncedIdentity: "",
  lastSyncedAt: "",
  data: null,
  dataIdentity: "",
};

const TAPTAP_COMMON_RESEARCH_FIELDS = Object.freeze({
  general: "general",
  "class:火力": "fireType",
  "class:防御": "defenseType",
  "class:辅助": "supportType",
  "company:极乐净土": "elysionCorp",
  "company:米西利斯": "missilisCorp",
  "company:泰特拉": "tetraCorp",
  "company:朝圣者": "pilgrimCorp",
  "company:反常": "abnormalCorp",
});

function getTapTapAutoSyncIdentity() {
  const session = state.authSession || getStoredAuthSession();
  const authUserId = session?.user?.id || session?.user?.email || session?.email || "";
  const taptapUid = getAccountProfileTapTapUid();
  if (!session?.accessToken || !authUserId || !taptapUid) return "";
  return `${authUserId}:${taptapUid}`;
}

function getAutoSyncDateKey() {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: AUTO_SYNC_DATE_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  } catch (error) {
    console.error("[TapTapSync] date key exception", { error });
    return new Date().toISOString().slice(0, 10);
  }
}

function getTapTapAutoSyncStorageKey(identity) {
  return `${TAPTAP_AUTO_SYNC_STORAGE_PREFIX}:${encodeURIComponent(String(identity || ""))}`;
}

function readTapTapAutoSyncRecord(identity) {
  if (!identity) return null;
  const storageKey = getTapTapAutoSyncStorageKey(identity);
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error("[TapTapSync] daily record read exception", { storageKey, error });
    return null;
  }
}

function claimTapTapAutoSyncAttempt(identity) {
  if (!identity) return false;
  const storageKey = getTapTapAutoSyncStorageKey(identity);
  const dateKey = getAutoSyncDateKey();
  const existing = readTapTapAutoSyncRecord(identity);
  if (existing?.dateKey === dateKey) return false;
  const attemptId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      dateKey,
      syncedAt: "",
      data: null,
      status: "running",
      attemptId,
    }));
    return readTapTapAutoSyncRecord(identity)?.attemptId === attemptId;
  } catch (error) {
    console.error("[TapTapSync] daily attempt claim exception", { storageKey, error });
    return true;
  }
}

async function runTapTapAutoSyncWithCrossPageLock(identity, callback) {
  const lockName = `nikke-taptap-auto-sync:${identity}`;
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    let acquired = false;
    let value = null;
    await navigator.locks.request(lockName, { ifAvailable: true }, async (lock) => {
      if (!lock) return;
      acquired = true;
      value = await callback();
    });
    return { acquired, value };
  }
  return { acquired: true, value: await callback() };
}

function saveTapTapAutoSyncRecord(identity, data) {
  if (!identity || !data || typeof data !== "object" || Array.isArray(data)) return false;
  const storageKey = getTapTapAutoSyncStorageKey(identity);
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      dateKey: getAutoSyncDateKey(),
      syncedAt: new Date().toISOString(),
      data: cloneJsonData(data, null),
      status: "success",
    }));
    return true;
  } catch (error) {
    console.error("[TapTapSync] daily record write exception", { storageKey, error });
    return false;
  }
}

function isTapTapAutoSyncCompletedToday(identity) {
  return readTapTapAutoSyncRecord(identity)?.dateKey === getAutoSyncDateKey();
}

function getActiveTapTapUserInfo() {
  if (!tapTapAutoSyncState.data || !tapTapAutoSyncState.dataIdentity) return null;
  if (tapTapAutoSyncState.dataIdentity !== getTapTapAutoSyncIdentity()) return null;
  return tapTapAutoSyncState.data;
}

function clearTapTapAutoSyncData() {
  tapTapAutoSyncState.lastSyncedIdentity = "";
  tapTapAutoSyncState.lastSyncedAt = "";
  tapTapAutoSyncState.data = null;
  tapTapAutoSyncState.dataIdentity = "";
}

function getCachedTapTapAutoSyncData(identity) {
  const record = readTapTapAutoSyncRecord(identity);
  const data = record?.data;
  return data && typeof data === "object" && !Array.isArray(data) ? cloneJsonData(data, null) : null;
}

function restoreCachedTapTapAutoSyncData(identity) {
  const record = readTapTapAutoSyncRecord(identity);
  const data = getCachedTapTapAutoSyncData(identity);
  if (!data) return null;
  tapTapAutoSyncState.lastSyncedIdentity = identity;
  tapTapAutoSyncState.lastSyncedAt = String(record?.syncedAt || "");
  tapTapAutoSyncState.data = data;
  tapTapAutoSyncState.dataIdentity = identity;
  return tapTapAutoSyncState.data;
}

function getTapTapAutoSyncLastSyncedAt() {
  const identity = getTapTapAutoSyncIdentity();
  if (!identity) return "";
  if (tapTapAutoSyncState.dataIdentity === identity && tapTapAutoSyncState.lastSyncedAt) {
    return tapTapAutoSyncState.lastSyncedAt;
  }
  return String(readTapTapAutoSyncRecord(identity)?.syncedAt || "");
}

function getTapTapNumericOverride(field, maxValue = 999) {
  const value = Number(getActiveTapTapUserInfo()?.[field]);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.min(maxValue, Math.floor(value));
}

function applyTapTapUserInfoToLocalState() {
  const data = getActiveTapTapUserInfo();
  if (!data) return false;
  const appliedFields = [];
  if (getTapTapNumericOverride("synchronizerLevel", CHARACTER_DETAIL_LEVEL_MAX) !== null) {
    appliedFields.push("synchronizerLevel");
  }
  Object.entries(TAPTAP_COMMON_RESEARCH_FIELDS).forEach(([researchKey, field]) => {
    if (getTapTapNumericOverride(field) !== null) appliedFields.push(researchKey);
  });
  if (!appliedFields.length) return false;
  console.log("[TapTapSync] applied common overrides", {
    taptapUid: getAccountProfileTapTapUid(),
    fields: appliedFields,
  });
  document.dispatchEvent(new CustomEvent("nikke:character-detail-refresh"));
  render();
  void refreshVisibleCharacterDetailPanelAfterSync();
  return true;
}

async function syncTapTapUserInfoToThirdParty(data, source = "auto") {
  const { buildTapTapArcaPayload } = await import(`./modules/taptap-arca-payload.js?${APP_MODULE_VERSION_PARAM}`);
  const payload = buildTapTapArcaPayload(data);
  const fields = Object.keys(payload);
  if (!fields.length) return { ok: false, skipped: true, reason: "no-supported-fields" };

  try {
    const keyData = await getExternalApiKeyPanelData(EXTERNAL_EQUIPMENT_PROVIDER);
    if (!String(keyData?.apiKey || "").trim()) {
      return { ok: false, skipped: true, reason: "missing-third-party-api-key" };
    }
  } catch (error) {
    console.error("[TapTapSync] third-party mirror key lookup failed", { source, fields, error });
    return { ok: false, error };
  }

  try {
    await updateThirdPartyUserInfo(payload, EXTERNAL_EQUIPMENT_PROVIDER);
    console.info("[TapTapSync] mirrored supported fields to third-party", { source, fields });
    return { ok: true, fields };
  } catch (error) {
    console.error("[TapTapSync] third-party mirror update failed", { source, fields, error });
    return { ok: false, error };
  }
}

async function syncTapTapUserInfoOncePerPage() {
  const session = state.authSession || getStoredAuthSession();
  const authUserId = session?.user?.id || session?.user?.email || session?.email || "";
  const taptapUid = getAccountProfileTapTapUid();
  if (!session?.accessToken || !authUserId) {
    clearTapTapAutoSyncData();
    console.info("[TapTapSync] auto-fetch skipped: missing authenticated account");
    return null;
  }
  if (!taptapUid) {
    clearTapTapAutoSyncData();
    console.info("[TapTapSync] auto-fetch skipped: no saved TapTap UID");
    return null;
  }
  const identity = `${authUserId}:${taptapUid}`;
  if (tapTapAutoSyncState.dataIdentity && tapTapAutoSyncState.dataIdentity !== identity) {
    clearTapTapAutoSyncData();
  }
  if (tapTapAutoSyncState.running) {
    console.info("[TapTapSync] auto-fetch skipped: another request is already running");
    return null;
  }
  if (tapTapAutoSyncState.lastSyncedIdentity === identity) return null;
  const syncResult = await runTapTapAutoSyncWithCrossPageLock(identity, async () => {
    if (isTapTapAutoSyncCompletedToday(identity)) {
      const cachedData = restoreCachedTapTapAutoSyncData(identity);
      console.info("[TapTapSync] auto-fetch skipped: daily limit", {
        authUserId,
        taptapUid,
        dateKey: getAutoSyncDateKey(),
        restored: Boolean(cachedData),
      });
      return cachedData;
    }
    if (!claimTapTapAutoSyncAttempt(identity)) {
      const record = readTapTapAutoSyncRecord(identity);
      const cachedData = restoreCachedTapTapAutoSyncData(identity);
      console.info("[TapTapSync] auto-fetch skipped: another page claimed today's attempt", {
        authUserId,
        taptapUid,
        dateKey: getAutoSyncDateKey(),
        status: record?.status || "running",
        restored: Boolean(cachedData),
      });
      return cachedData;
    }

    tapTapAutoSyncState.running = true;
    try {
      const data = await fetchTapTapUserInfo(taptapUid);
      tapTapAutoSyncState.lastSyncedIdentity = identity;
      tapTapAutoSyncState.lastSyncedAt = new Date().toISOString();
      tapTapAutoSyncState.data = data && typeof data === "object" ? data : null;
      tapTapAutoSyncState.dataIdentity = identity;
      const dailyRecordSaved = saveTapTapAutoSyncRecord(identity, tapTapAutoSyncState.data);
      if (!dailyRecordSaved) {
        console.warn("[TapTapSync] daily limit record could not be persisted", { authUserId, taptapUid });
      }
      return data;
    } catch (error) {
      if (tapTapAutoSyncState.dataIdentity === identity) {
        tapTapAutoSyncState.data = null;
        tapTapAutoSyncState.dataIdentity = "";
      }
      console.error("[TapTapSync] auto-fetch failed", { authUserId, taptapUid, error });
      return null;
    } finally {
      tapTapAutoSyncState.running = false;
    }
  });
  if (!syncResult.acquired) {
    console.info("[TapTapSync] auto-fetch skipped: another page is running today's attempt", {
      authUserId,
      taptapUid,
      dateKey: getAutoSyncDateKey(),
    });
    return null;
  }
  return syncResult.value;
}

async function syncTapTapUserInfoManually() {
  const session = state.authSession || getStoredAuthSession();
  const authUserId = session?.user?.id || session?.user?.email || session?.email || "";
  const taptapUid = getAccountProfileTapTapUid();
  if (!session?.accessToken || !authUserId) {
    throw new Error(localize("请先登录账号", "Please sign in first."));
  }
  if (!taptapUid) {
    throw new Error(localize("请先保存 TapTap UID", "Please save a TapTap UID first."));
  }
  const identity = `${authUserId}:${taptapUid}`;
  if (tapTapAutoSyncState.running) {
    throw new Error(localize("TapTap 数据正在同步，请稍候", "TapTap data is already syncing. Please wait."));
  }
  tapTapAutoSyncState.running = true;
  try {
    const data = await fetchTapTapUserInfo(taptapUid);
    tapTapAutoSyncState.lastSyncedIdentity = identity;
    tapTapAutoSyncState.lastSyncedAt = new Date().toISOString();
    tapTapAutoSyncState.data = data && typeof data === "object" ? data : null;
    tapTapAutoSyncState.dataIdentity = identity;
    const dailyRecordSaved = saveTapTapAutoSyncRecord(identity, tapTapAutoSyncState.data);
    if (!dailyRecordSaved) {
      console.warn("[TapTapSync] daily limit record could not be persisted", { authUserId, taptapUid });
    }
    applyTapTapUserInfoToLocalState();
    await syncTapTapUserInfoToThirdParty(data, "manual");
    return data;
  } catch (error) {
    console.error("[TapTapSync] manual fetch failed", { authUserId, taptapUid, error });
    throw error;
  } finally {
    tapTapAutoSyncState.running = false;
  }
}

async function syncAccountDataOncePerPage() {
  const [tapTapResult, thirdPartyResult] = await Promise.allSettled([
    syncTapTapUserInfoOncePerPage(),
    syncExternalEquipmentOncePerSession(),
  ]);
  const tapTapData = tapTapResult.status === "fulfilled" ? tapTapResult.value : null;
  if (tapTapResult.status === "rejected") {
    console.error("[TapTapSync] coordinated fetch failed", tapTapResult.reason);
  }
  if (thirdPartyResult.status === "rejected") {
    console.error("[ThirdPartySync] coordinated fetch failed", thirdPartyResult.reason);
  }
  if (tapTapData || getActiveTapTapUserInfo()) applyTapTapUserInfoToLocalState();
  const tapTapMirrorResult = tapTapData
    ? await syncTapTapUserInfoToThirdParty(tapTapData, "auto")
    : null;
  return {
    tapTap: tapTapResult,
    thirdParty: thirdPartyResult,
    tapTapMirror: tapTapMirrorResult,
  };
}

async function loadAccountStatusServiceModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!accountStatusServiceModulePromise) {
    accountStatusServiceModulePromise = runtime.loadAppModule("account-status-service", () => importAppModule("./modules/account-status-service.js"));
  }
  const module = await accountStatusServiceModulePromise;
  module.setAccountStatusServiceApi({
    state,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
    accountStatusEndpoint: SUPABASE_ACCOUNT_STATUS_ENDPOINT,
    authenticatedFetch,
    getStoredAuthSession,
    clearAccountStatus,
    refreshAuthSessionIfNeeded,
    handleRejectedAuthSessionResponse,
    syncAuthSessionDisplayName,
    syncChampionDataFeatureVisibility,
    syncAdminPageButtonVisibility,
    syncAccountButton,
    localize,
    isAuthSessionExpiring,
  });
  return module;
}

async function refreshAccountStatus() {
  const result = await (await loadAccountStatusServiceModule()).refreshAccountStatus();
  if (state.authSession?.accessToken && getPendingArcaKey()) await bindPendingArcaKey();
  return result;
}

async function updateAccountDisplayName(displayName) {
  return (await loadAccountStatusServiceModule()).updateAccountDisplayName(displayName);
}

async function updateAccountTapTapUid(taptapUid) {
  const data = await (await loadAccountStatusServiceModule()).updateAccountTapTapUid(taptapUid);
  clearTapTapAutoSyncData();
  return data;
}

function canUseFeature(featureKey, options = {}) {
  const key = String(featureKey || "").trim();
  if (!key) return true;
  if (options.requireLogin && !state.authSession?.accessToken) return false;
  return state.entitlements instanceof Map && state.entitlements.has(key);
}

function canUseSeasonDataFeature() {
  return canUseFeature(FEATURE_KEYS.seasonData, { requireLogin: true });
}

function getAccountButtonText() {
  const username = getAccountProfileDisplayName() || getAuthSessionUsername();
  const email = getAuthSessionEmail();
  if (!username && !email) return localize("账号", "Account");
  return username || localize("已登录", "Signed in");
}

function syncAccountButton() {
  if (!els.accountButton) return;
  els.accountButton.textContent = getAccountButtonText();
}

function getAuthErrorMessage(error) {
  const raw = String(error?.message || error || "");
  if (!raw) return localize("操作失败，请稍后再试", "Request failed. Please try again later.");
  if (/invalid login credentials/i.test(raw)) return localize("邮箱或密码不正确", "Email or password is incorrect.");
  if (/email not confirmed/i.test(raw)) return localize("邮箱尚未验证，请先查看邮箱确认邮件", "Email is not confirmed. Please check your inbox.");
  if (/user already registered|already registered|email already registered/i.test(raw)) {
    return localize("该邮箱已注册，请直接登录或使用忘记密码", "This email is already registered. Please sign in or reset your password.");
  }
  if (/password/i.test(raw) && /6|8|weak|short/i.test(raw)) return localize("密码强度不足，请至少输入8位并包含字母和数字", "Password is too weak. Use at least 8 characters with letters and numbers.");
  // 浏览器网络层的原始报错（Failed to fetch / Load failed 等）对用户没有意义，
  // 统一换成可操作提示；常见成因是被网络、代理或广告拦截插件阻断。
  if (/failed to fetch|networkerror|network error|load failed|fetch failed|network request failed|err_internet_disconnected|err_name_not_resolved|err_connection|err_timed_out/i.test(raw)) {
    return localize("无法连接账号服务，请检查网络；若已开启代理或广告拦截，请先关闭后重试", "Cannot reach the account service. Check your network, and disable any proxy or ad blocker before retrying.");
  }
  return raw;
}

function isExistingEmailSignupPayload(payload) {
  const user = payload?.user || payload;
  if (!user || typeof user !== "object") return false;
  if (Array.isArray(user.identities) && user.identities.length === 0) return true;
  if (Array.isArray(payload?.identities) && payload.identities.length === 0) return true;
  return false;
}

function normalizeUsername(value) {
  return String(value || "").trim();
}

function validateUsername(value) {
  const username = normalizeUsername(value);
  if (username.length < 2 || username.length > 16) {
    return localize("用户名需要为2-16个字符", "Username must be 2-16 characters.");
  }
  if (!/^[\u4e00-\u9fa5A-Za-z0-9_]+$/.test(username)) {
    return localize("用户名只允许中文、英文、数字和下划线", "Username may only contain Chinese, letters, numbers, and underscores.");
  }
  return "";
}

function validateAccountPassword(value) {
  const password = String(value || "");
  const normalized = password.toLowerCase();
  const commonWeakPasswords = new Set([
    "12345678",
    "123456789",
    "1234567890",
    "password",
    "password1",
    "qwerty123",
    "abc123456",
    "11111111",
    "00000000",
  ]);
  if (password.length < 8) {
    return localize("密码至少需要8位", "Password must be at least 8 characters.");
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return localize("密码需要同时包含字母和数字", "Password must contain both letters and numbers.");
  }
  if (commonWeakPasswords.has(normalized)) {
    return localize("该密码过于常见，请更换更安全的密码", "This password is too common. Please choose a safer password.");
  }
  return "";
}

let accountModalModulePromise = null;

function closeAccountModal() {
  document.querySelector(".account-modal-backdrop")?.remove();
}

async function requestQqBindingToken() {
  const response = await authenticatedFetch(SUPABASE_QQ_BINDING_TOKEN_ENDPOINT, {
    method: "POST", cache: "no-store",
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new Error(response.status === 401
      ? localize("登录已失效，请重新登录", "Your session expired. Please sign in again.")
      : localize("申请短 Token 失败，请稍后重试", "Failed to request a short token. Please try again."));
  }
  if (!/^[A-HJ-NP-Z2-9]{12}$/.test(payload.token || "") || !Number.isFinite(Date.parse(payload.expiresAt))) {
    throw new Error(localize("短 Token 返回格式异常", "Invalid short-token response."));
  }
  return { token: payload.token, expiresAt: payload.expiresAt };
}

async function requestWechatBindingToken() {
  const response = await authenticatedFetch(SUPABASE_WECHAT_BINDING_TOKEN_ENDPOINT, {
    method: "POST", cache: "no-store", headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new Error(response.status === 401
      ? localize("登录已失效，请重新登录", "Your session expired. Please sign in again.")
      : localize("申请微信绑定码失败，请稍后重试", "Failed to request a WeChat binding code. Please try again."));
  }
  return { token: payload.token, expiresAt: payload.expiresAt };
}

function getAccountModalApi() {
  return {
    state,
    getAuthSessionEmail,
    getAccountProfileDisplayName,
    getAccountProfileTapTapUid,
    getAuthSessionUsername,
    hasAccountProfileChangedEffectiveDisplayName,
    escapeHtml,
    localize,
    getPendingInviteCode,
    loadExternalApiKeyPanel,
    loadInvitePanel,
    openLegalModal,
    supabaseAuthRequest,
    saveAuthSession,
    showToast,
    normalizeUsername,
    validateUsername,
    updateAccountDisplayName,
    updateAccountTapTapUid,
    requestQqBindingToken,
    requestWechatBindingToken,
    getAuthErrorMessage,
    validateAccountPassword,
    getAuthRedirectUrl,
    isExistingEmailSignupPayload,
    normalizeSupabaseAuthSession,
    refreshAccountStatus,
    acceptPendingInviteIfNeeded,
    hydrateAuthSessionUserIfNeeded,
    normalizeInviteCode,
    canUseAccountFeature,
    syncTapTapUserInfoOncePerPage,
    syncTapTapUserInfoManually,
    getTapTapAutoSyncLastSyncedAt,
    syncExternalEquipmentOncePerSession,
    syncAccountDataOncePerPage,
    onSignedIn:()=>{if(pendingPrivateHelpOptions){const options=pendingPrivateHelpOptions;pendingPrivateHelpOptions=null;void openPrivateHelpModal(options);}},
    closeAccountModal,
  };
}

async function loadAccountModalModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!accountModalModulePromise) {
    accountModalModulePromise = runtime.loadAppModule("account-modal", () => importAppModule("./modules/account-modal.js"));
  }
  const module = await accountModalModulePromise;
  module.setAccountModalApi(getAccountModalApi());
  return module;
}

function openAccountModal(mode = "login") {
  return loadAccountModalModule()
    .then((module) => module.openAccountModal(mode))
    .catch((error) => showToast(getAuthErrorMessage(error), { duration: 3600 }));
}

function focusExternalApiKeyPanelWhenReady(attempt = 0) {
  const panel = document.querySelector("[data-external-api-key-panel]");
  const input = panel?.querySelector("[data-external-api-key-input]");
  if (panel && input && panel.hidden !== true) {
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
    input.focus({ preventScroll: true });
    return;
  }
  if (attempt >= 12) return;
  window.setTimeout(() => focusExternalApiKeyPanelWhenReady(attempt + 1), 120);
}

async function guideToExternalEquipmentApiKey(message) {
  closeCharacterEquipmentUploadModal();
  closeCharacterDetailPanel();
  await openAccountModal("login");
  focusExternalApiKeyPanelWhenReady();
  showToast(message || localize("请先保存第三方 API Key，再上传装备图。", "Save the third-party API key before uploading equipment images."), { duration: 4200 });
}

async function ensureExternalEquipmentApiKeyBeforeUpload() {
  if (!state.authSession?.accessToken) {
    await guideToExternalEquipmentApiKey(localize("请先登录并保存第三方 API Key，再上传装备图。", "Sign in and save the third-party API key before uploading equipment images."));
    return false;
  }
  try {
    const data = await getExternalApiKeyPanelData(EXTERNAL_EQUIPMENT_PROVIDER);
    if (data?.exists || String(data?.apiKey || "").trim()) return true;
    await guideToExternalEquipmentApiKey();
    return false;
  } catch (error) {
    await guideToExternalEquipmentApiKey(getAuthErrorMessage(error));
    return false;
  }
}
function setSidebarOpen(open) {
  isSidebarOpen = Boolean(open);
  els.appSidebar?.classList.toggle("is-open", isSidebarOpen);
  if (els.appSidebar) {
    els.appSidebar.toggleAttribute("inert", !isSidebarOpen);
  }
  if (els.appSidebarBackdrop) els.appSidebarBackdrop.hidden = !isSidebarOpen;
  if (isSidebarOpen) {
    els.appSidebar?.querySelector(".app-sidebar-close")?.focus();
  }
}

function normalizeTheme(theme) {
  return theme === "light" ? "light" : "dark";
}

function applyTheme(theme) {
  const nextTheme = normalizeTheme(theme);
  const ui = getCurrentLanguageText();
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  els.themeToggleButton?.querySelector(".theme-sun")?.classList.toggle("is-active", nextTheme === "light");
  els.themeToggleButton?.querySelector(".theme-moon")?.classList.toggle("is-active", nextTheme === "dark");
  els.themeToggleButton?.setAttribute("aria-label", nextTheme === "light" ? ui.themeToggleDarkLabel : ui.themeToggleLightLabel);
  els.themeToggleButton?.setAttribute("title", nextTheme === "light" ? ui.themeToggleDarkLabel : ui.themeToggleLightLabel);
}

function initTheme() {
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "dark");
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
}

function getExportThemePalette() {
  const isLight = normalizeTheme(document.documentElement.dataset.theme) === "light";
  return isLight
    ? {
        mode: "light",
        page: "#f4f7fb",
        panel: "#ffffff",
        panelSoft: "#edf3f9",
        slot: "#f8fbff",
        emptySlot: "#eef3f8",
        border: "rgba(84, 103, 126, 0.24)",
        softBorder: "rgba(84, 103, 126, 0.18)",
        text: "#17202c",
        muted: "#5f6f82",
        subtle: "#7d8c9d",
        title: "#b47a10",
        site: "#5f6f82",
        badge: "rgba(23, 32, 44, 0.76)",
        chartBg: "#f7faff",
        chartGrid: "rgba(84, 103, 126, 0.26)",
        chartText: "#314154",
        chartLine: "rgba(49, 65, 84, 0.24)",
        chartSeparator: "rgba(84, 103, 126, 0.38)",
        chartDodge: "rgba(23, 32, 44, 0.82)",
      }
    : {
        mode: "dark",
        page: "#0b0e14",
        panel: "#111821",
        panelSoft: "#15191f",
        slot: "#111821",
        emptySlot: "#15191f",
        border: "rgba(242, 245, 250, 0.12)",
        softBorder: "rgba(242, 245, 250, 0.18)",
        text: "#f2f5fa",
        muted: "#8f9aaa",
        subtle: "#7d8796",
        title: "#f0c45c",
        site: "#7f8a99",
        badge: "rgba(0, 0, 0, 0.72)",
        chartBg: "#0b0e14",
        chartGrid: "rgba(92, 109, 132, 0.38)",
        chartText: "#d8dee9",
        chartLine: "rgba(255, 255, 255, 0.14)",
        chartSeparator: "rgba(242, 245, 250, 0.42)",
        chartDodge: "rgba(255, 255, 255, 0.94)",
      };
}

function getExportSvgThemeStyles() {
  const theme = getExportThemePalette();
  return `
    .chart-bg { fill: ${theme.chartBg} !important; }
    .chart-grid line { stroke: ${theme.chartGrid} !important; }
    .chart-grid text, .chart-name, .chart-axis-label { fill: ${theme.chartText} !important; }
    .chart-grid.is-full text, .chart-standard.is-full text { fill: ${theme.mode === "light" ? "#c63d4e" : "#ffd9dc"} !important; }
    .chart-standard text, .chart-standard-label, .chart-standard-name { fill: ${theme.mode === "light" ? "#7b5715" : "#fff7d7"} !important; }
    .chart-position-line { stroke: ${theme.chartLine} !important; }
    .chart-team-separator { stroke: ${theme.chartSeparator} !important; }
    .chart-dodge-track, .chart-dodge-track.team-defense, .chart-dodge-track.team-attack, .chart-dodge-turn { stroke: ${theme.chartDodge} !important; }
    .chart-burst-label.team-defense, .chart-total-name.team-defense, .chart-scarlet-counter-name.team-defense { fill: ${theme.mode === "light" ? "#226fc6" : "#9bcfff"} !important; }
    .chart-burst-label.team-attack, .chart-total-name.team-attack, .chart-scarlet-counter-name.team-attack { fill: ${theme.mode === "light" ? "#d9354a" : "#ff9ca6"} !important; }
  `;
}

function isWechatMiniProgramRuntime() {
  return window.__wxjs_environment === "miniprogram" || Boolean(window.wx?.miniProgram);
}

function isLocalDevRuntime() {
  const { protocol, hostname } = window.location;
  return protocol === "file:" || isLocalDevHostname(hostname);
}

function canUseAccountFeature() {
  return true;
}

function syncAccountFeatureVisibility() {
  if (!els.accountButton) return;
  const enabled = canUseAccountFeature();
  els.accountButton.hidden = !enabled;
  els.accountButton.setAttribute("aria-hidden", enabled ? "false" : "true");
}

function syncChampionDataFeatureVisibility() {
  if (!els.championDataButton) return;
  els.championDataButton.hidden = false;
  els.championDataButton.setAttribute("aria-hidden", "false");
  const hasSession = Boolean(state.authSession?.accessToken);
  const enabled = canUseSeasonDataFeature();
  const title = enabled
    ? localize("查看冠军竞技场赛季数据", "View champion arena season data")
    : hasSession
      ? localize("需要权限：冠军竞技场赛季数据", "Required permission: Champion Arena Season Data")
      : localize("需要登录并拥有权限：冠军竞技场赛季数据", "Sign in and permission required: Champion Arena Season Data");
  els.championDataButton.classList.toggle("is-locked", !enabled);
  els.championDataButton.setAttribute("aria-disabled", enabled ? "false" : "true");
  els.championDataButton.setAttribute("title", title);
}

function syncAdminPageButtonVisibility() {
  if (!els.adminPageButton) return;
  const canShowAdminEntry = state.isAdmin || isFrontendKnownAdminEmail(getAuthSessionEmail());
  els.adminPageButton.hidden = !canShowAdminEntry;
  els.adminPageButton.setAttribute("aria-hidden", canShowAdminEntry ? "false" : "true");
}

async function refreshAdminStatus() {
  syncAdminPageButtonVisibility();
  return state.isAdmin;
}

function syncLocalAccountEntryControl() {
  if (!els.appVersion) return;
  els.appVersion.textContent = APP_VERSION;
  els.appVersion.removeAttribute("role");
  els.appVersion.removeAttribute("tabindex");
  els.appVersion.removeAttribute("title");
  syncAccountFeatureVisibility();
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

function sanitizeMissShot(value) {
  const shot = Math.floor(Number(value) || 0);
  return Math.max(0, Math.min(DEFAULT_AUTO_TEST_SHOTS, shot));
}

function getTestAttackCharacter(character, positionIndex, chargeSpeeds = []) {
  if (!character) return null;
  return {
    ...character,
    chargeSpeedPercent: sanitizeChargeSpeed(chargeSpeeds[positionIndex]) || character.chargeSpeedPercent || 0,
  };
}

function getAttackRlShotWindow(character, positionIndex, shotNumber, chargeSpeeds = []) {
  if (!character || character.weapon !== "RL" || shotNumber <= 0) return null;
  const attackCharacter = getTestAttackCharacter(character, positionIndex, chargeSpeeds);
  const timing = getChargeFrames(attackCharacter, positionIndex, "attack");
  const flightFrames = Number(timing.projectileFlightFrames) || 0;
  if (flightFrames <= 0) return null;
  const hitFrame = timing.firstFrame + (shotNumber - 1) * timing.interval;
  return {
    positionIndex,
    characterId: character.id,
    characterName: character.name,
    shotNumber,
    launchFrame: hitFrame - flightFrames,
    hitFrame,
    flightFrames,
  };
}

function getAttackRlShotWindows(character, positionIndex, chargeSpeeds = [], maxShots = DEFAULT_AUTO_TEST_SHOTS) {
  const shotCount = Math.max(1, Math.min(DEFAULT_AUTO_TEST_SHOTS, Math.floor(Number(maxShots) || DEFAULT_AUTO_TEST_SHOTS)));
  return Array.from({ length: shotCount }, (_, index) =>
    getAttackRlShotWindow(character, positionIndex, index + 1, chargeSpeeds),
  ).filter(Boolean);
}

function matchesDodgeWindow(attackWindow, dodgeStartFrame, dodgeFrames) {
  return isMissedByDodgeWindow(
    attackWindow.targetPositionIndex ?? 0,
    attackWindow.launchFrame,
    attackWindow.hitFrame,
    {
      positionIndex: attackWindow.targetPositionIndex ?? 0,
      startFrame: dodgeStartFrame,
      endFrame: dodgeStartFrame + dodgeFrames,
    },
  );
}

function groupNumberRanges(values = []) {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  const ranges = [];
  sorted.forEach((value) => {
    const last = ranges.at(-1);
    if (last && value === last.end + 1) {
      last.end = value;
    } else {
      ranges.push({ start: value, end: value });
    }
  });
  return ranges.map((range) => (range.start === range.end ? String(range.start) : `${range.start}-${range.end}`));
}

function formatInferenceValues(values = [], suffix = "") {
  if (!values.length) return [];
  return groupNumberRanges(values).map((value) => `${value}${suffix}`);
}

function getAllLauncherInferenceValues(attackWindows = [], matches = [], key) {
  const launcherKeys = [
    ...new Set(attackWindows.map((window) => `${window.positionIndex}:${window.characterId}`)),
  ];
  if (launcherKeys.length <= 1) return [];
  const valueSetsByLauncher = new Map(launcherKeys.map((launcherKey) => [launcherKey, new Set()]));
  matches.forEach((match) => {
    const window = match.attackWindow;
    const launcherKey = window ? `${window.positionIndex}:${window.characterId}` : "";
    if (!valueSetsByLauncher.has(launcherKey)) return;
    (match[key] || []).forEach((value) => valueSetsByLauncher.get(launcherKey).add(value));
  });
  if ([...valueSetsByLauncher.values()].some((valueSet) => valueSet.size === 0)) return [];
  const [firstSet, ...restSets] = [...valueSetsByLauncher.values()];
  return [...firstSet].filter((value) => restSets.every((valueSet) => valueSet.has(value))).sort((a, b) => a - b);
}

function getNoahChargeSpeedsForAttackWindow(attackWindow) {
  const noah = getCharacterById(TEST_NOAH_ID);
  if (!noah || !attackWindow) return [];
  return [...FIXED_CHARGE_SPEED_FRAMES_60.keys()]
    .filter((speed) => speed >= 0 && speed <= 26)
    .filter((speed) => {
      const defenseNoah = { ...noah, chargeSpeedPercent: speed };
      const timing = getChargeFrames(defenseNoah, 0, "defense");
      const flightFrames = Number(timing.projectileFlightFrames) || 0;
      const intervalFrames = Number(timing.interval) || 0;
      const turnFrames = Math.min(TURN_DODGE_WINDOW_FRAMES, Math.max(0, Number(noah.timing?.turnFrames ?? noah.turnFrames ?? 0) || 0));
      const firstTurnFrame = timing.firstFrame - flightFrames;
      if (intervalFrames <= 0) return false;
      const maxFrame = attackWindow.hitFrame + intervalFrames;
      for (let turnFrame = firstTurnFrame; turnFrame <= maxFrame; turnFrame += intervalFrames) {
        if (matchesDodgeWindow(attackWindow, turnFrame, turnFrames)) return true;
      }
      return false;
    });
}

function getScarletReloadStarts(magazine, maxFrame) {
  const scarlet = getCharacterById(TEST_SCARLET_ID);
  const intervalFrames = 6;
  const reloadFrames = getReloadFrames(scarlet);
  const starts = [];
  let reloadStart = (magazine - 1) * intervalFrames;
  while (reloadStart <= maxFrame) {
    starts.push(reloadStart);
    reloadStart += reloadFrames + magazine * intervalFrames;
  }
  return starts;
}

function getScarletMagazinesForAttackWindow(attackWindow) {
  if (!attackWindow) return [];
  const maxFrame = attackWindow.hitFrame + 240;
  const scarlet = getCharacterById(TEST_SCARLET_ID);
  const reloadFrames = getReloadFrames(scarlet);
  return TEST_SCARLET_MAGAZINES.filter((magazine) =>
    getScarletReloadStarts(magazine, maxFrame).some((reloadStart) =>
      matchesDodgeWindow(attackWindow, reloadStart, reloadFrames),
    ),
  );
}

function inferMissCandidates(payload = {}) {
  const attackIds = payload.attackTeam || payload.team || [];
  const chargeSpeeds = payload.attackChargeSpeeds || payload.chargeSpeeds || [];
  const missShots = payload.missShots || payload.attackMissShots || [];
  const maxAutoShots = Math.max(1, Math.min(DEFAULT_AUTO_TEST_SHOTS, Math.floor(Number(payload.maxAutoShots) || DEFAULT_AUTO_TEST_SHOTS)));
  const attackTeam = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(attackIds[index]));
  const normalizedChargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(chargeSpeeds[index]));
  const normalizedMissShots = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeMissShot(missShots[index]));
  const hasManualMissShots = normalizedMissShots.some((shotNumber) => shotNumber > 0);
  const attackWindows = attackTeam.flatMap((character, positionIndex) =>
    hasManualMissShots
      ? [getAttackRlShotWindow(character, positionIndex, normalizedMissShots[positionIndex], normalizedChargeSpeeds)].filter(Boolean)
      : getAttackRlShotWindows(character, positionIndex, normalizedChargeSpeeds, maxAutoShots),
  );
  const noah = getCharacterById(TEST_NOAH_ID);
  const scarlet = getCharacterById(TEST_SCARLET_ID);
  const noahMatches = attackWindows
    .map((attackWindow) => ({ attackWindow, values: getNoahChargeSpeedsForAttackWindow(attackWindow) }))
    .filter((entry) => entry.values.length > 0);
  const scarletMatches = attackWindows
    .map((attackWindow) => ({ attackWindow, values: getScarletMagazinesForAttackWindow(attackWindow) }))
    .filter((entry) => entry.values.length > 0);
  const noahAllLauncherValues = getAllLauncherInferenceValues(
    attackWindows,
    noahMatches.map((entry) => ({ attackWindow: entry.attackWindow, chargeSpeeds: entry.values })),
    "chargeSpeeds",
  );
  const scarletAllLauncherValues = getAllLauncherInferenceValues(
    attackWindows,
    scarletMatches.map((entry) => ({ attackWindow: entry.attackWindow, magazines: entry.values })),
    "magazines",
  );

  return {
    attackWindows,
    candidates: [
      {
        type: "noah-charge-speed",
        characterId: noah?.id ?? TEST_NOAH_ID,
        characterName: noah?.name ?? "诺雅",
        allLauncherValues: noahAllLauncherValues,
        allLauncherDisplayValues: formatInferenceValues(noahAllLauncherValues, "%"),
        matches: noahMatches.map((entry) => ({
          attackPosition: entry.attackWindow.positionIndex + 1,
          attackCharacterName: entry.attackWindow.characterName,
          shotNumber: entry.attackWindow.shotNumber,
          chargeSpeeds: entry.values,
          displayValues: formatInferenceValues(entry.values, "%"),
        })),
      },
      {
        type: "scarlet-magazine",
        characterId: scarlet?.id ?? TEST_SCARLET_ID,
        characterName: scarlet?.name ?? "红莲",
        allLauncherValues: scarletAllLauncherValues,
        allLauncherDisplayValues: formatInferenceValues(scarletAllLauncherValues),
        matches: scarletMatches.map((entry) => ({
          attackPosition: entry.attackWindow.positionIndex + 1,
          attackCharacterName: entry.attackWindow.characterName,
          shotNumber: entry.attackWindow.shotNumber,
          magazines: entry.values,
          displayValues: formatInferenceValues(entry.values),
        })),
      },
    ],
  };
}

function createEmptyPaidArenaTeams(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(null));
}

function createPaidArenaSideRows(createRows, mode) {
  return {
    defense: createRows(mode),
    attack: createRows(mode),
  };
}

function createEmptyPaidArenaTeamsBySide(mode) {
  return createPaidArenaSideRows(createEmptyPaidArenaTeams, mode);
}

function createEmptyPaidArenaUniversalCharges(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(0));
}

function createEmptyPaidArenaUniversalChargesBySide(mode) {
  return createPaidArenaSideRows(createEmptyPaidArenaUniversalCharges, mode);
}

function createEmptyPaidArenaChargeSpeeds(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(0));
}

function createEmptyPaidArenaChargeSpeedsBySide(mode) {
  return createPaidArenaSideRows(createEmptyPaidArenaChargeSpeeds, mode);
}

function createEmptyPaidArenaRosannaSacrificeFrames(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(null));
}

function createEmptyPaidArenaRosannaSacrificeFramesBySide(mode) {
  return createPaidArenaSideRows(createEmptyPaidArenaRosannaSacrificeFrames, mode);
}

function createEmptyPaidArenaRedHoodPierceCounts(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(0));
}

function createEmptyPaidArenaRedHoodPierceCountsBySide(mode) {
  return createPaidArenaSideRows(createEmptyPaidArenaRedHoodPierceCounts, mode);
}

function createEmptyPaidArenaScarletCounterEnabled(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => Array(TEAM_SIZE).fill(true));
}

function createEmptyPaidArenaScarletCounterEnabledBySide(mode) {
  return createPaidArenaSideRows(createEmptyPaidArenaScarletCounterEnabled, mode);
}

function createEmptyJackalLinkState() {
  return { enabled: false, ownerId: null, targetIds: [] };
}

function createEmptyPaidArenaJackalLinks(mode) {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, () => createEmptyJackalLinkState());
}

function createEmptyPaidArenaJackalLinksBySide(mode) {
  return createPaidArenaSideRows(createEmptyPaidArenaJackalLinks, mode);
}

function createEmptyPaidArenaLineupSlot(mode) {
  return {
    teams: createEmptyPaidArenaTeamsBySide(mode),
    universalCharges: createEmptyPaidArenaUniversalChargesBySide(mode),
    chargeSpeeds: createEmptyPaidArenaChargeSpeedsBySide(mode),
    rosannaSacrificeFrames: createEmptyPaidArenaRosannaSacrificeFramesBySide(mode),
    redHoodPierceCounts: createEmptyPaidArenaRedHoodPierceCountsBySide(mode),
    scarletCounterEnabled: createEmptyPaidArenaScarletCounterEnabledBySide(mode),
    jackalLinks: createEmptyPaidArenaJackalLinksBySide(mode),
    activeRowIndex: 0,
    activeTeamKey: "attack",
  };
}

function normalizePaidArenaMode(mode) {
  return mode === "c" || mode === "p" ? mode : "normal";
}

function normalizePaidArenaDisplayMode(mode) {
  return mode === "round" ? "round" : "side";
}

function getPaidArenaDisplayMode() {
  return normalizePaidArenaDisplayMode(state.paidArenaDisplayMode);
}

function setPaidArenaDisplayMode(mode) {
  state.paidArenaDisplayMode = normalizePaidArenaDisplayMode(mode);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function isPaidArenaModeActive() {
  return state.paidArenaMode === "c" || state.paidArenaMode === "p";
}

function getPaidArenaTeams(mode = state.paidArenaMode, teamKey = getPaidArenaDataTeamKey()) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  state.paidArenaTeams[normalizedMode] = normalizePaidArenaTeams(state.paidArenaTeams[normalizedMode], normalizedMode);
  return state.paidArenaTeams[normalizedMode][normalizeTeamKey(teamKey)];
}

function getPaidArenaUniversalCharges(mode = state.paidArenaMode, teamKey = getPaidArenaDataTeamKey()) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  state.paidArenaUniversalCharges[normalizedMode] = normalizePaidArenaUniversalCharges(
    state.paidArenaUniversalCharges[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaUniversalCharges[normalizedMode][normalizeTeamKey(teamKey)];
}

function getPaidArenaChargeSpeeds(mode = state.paidArenaMode, teamKey = getPaidArenaDataTeamKey()) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  state.paidArenaChargeSpeeds[normalizedMode] = normalizePaidArenaChargeSpeeds(
    state.paidArenaChargeSpeeds[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaChargeSpeeds[normalizedMode][normalizeTeamKey(teamKey)];
}

function getPaidArenaRosannaSacrificeFrames(mode = state.paidArenaMode, teamKey = getPaidArenaDataTeamKey()) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  state.paidArenaRosannaSacrificeFrames[normalizedMode] = normalizePaidArenaRosannaSacrificeFrames(
    state.paidArenaRosannaSacrificeFrames[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaRosannaSacrificeFrames[normalizedMode][normalizeTeamKey(teamKey)];
}

function getPaidArenaRedHoodPierceCounts(mode = state.paidArenaMode, teamKey = getPaidArenaDataTeamKey()) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  state.paidArenaRedHoodPierceCounts[normalizedMode] = normalizePaidArenaRedHoodPierceCounts(
    state.paidArenaRedHoodPierceCounts[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaRedHoodPierceCounts[normalizedMode][normalizeTeamKey(teamKey)];
}

function getPaidArenaScarletCounterEnabled(mode = state.paidArenaMode, teamKey = getPaidArenaDataTeamKey()) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  state.paidArenaScarletCounterEnabled[normalizedMode] = normalizePaidArenaScarletCounterEnabled(
    state.paidArenaScarletCounterEnabled[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaScarletCounterEnabled[normalizedMode][normalizeTeamKey(teamKey)];
}

function getPaidArenaJackalLinks(mode = state.paidArenaMode, teamKey = getPaidArenaDataTeamKey()) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return [];
  state.paidArenaJackalLinks[normalizedMode] = normalizePaidArenaJackalLinks(
    state.paidArenaJackalLinks[normalizedMode],
    normalizedMode,
  );
  return state.paidArenaJackalLinks[normalizedMode][normalizeTeamKey(teamKey)];
}

function normalizePaidArenaSideRows(savedRows, mode, normalizeRows, createRows) {
  if (Array.isArray(savedRows)) {
    return {
      defense: createRows(mode),
      attack: normalizeRows(savedRows, mode),
    };
  }
  return {
    defense: normalizeRows(savedRows?.defense, mode),
    attack: normalizeRows(savedRows?.attack, mode),
  };
}

function restoreArcaMember(value, flag = value?.useArca) {
  const c=getCharacterById(value?.id??value);return c&&typeof flag==='boolean'?{...c,useArca:flag}:c;
}
function serializeArcaMember(character) {
  return character&&typeof character.useArca==='boolean'?{id:character.id,useArca:character.useArca}:character?.id||null;
}
function normalizePaidArenaTeamRows(savedTeams = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
      const savedValue = savedTeams?.[rowIndex]?.[slotIndex] ?? null;
      if (typeof savedValue === "string" || typeof savedValue === "number") return getCharacterById(savedValue);
      return savedValue?.id ? restoreArcaMember(savedValue) : null;
    }),
  );
}

function normalizePaidArenaTeams(savedTeams = [], mode = "c") {
  return normalizePaidArenaSideRows(savedTeams, mode, normalizePaidArenaTeamRows, createEmptyPaidArenaTeams);
}

function normalizePaidArenaUniversalChargeRows(savedCharges = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => sanitizeUniversalCharge(savedCharges?.[rowIndex]?.[slotIndex])),
  );
}

function normalizePaidArenaUniversalCharges(savedCharges = [], mode = "c") {
  return normalizePaidArenaSideRows(savedCharges, mode, normalizePaidArenaUniversalChargeRows, createEmptyPaidArenaUniversalCharges);
}

function normalizePaidArenaChargeSpeedRows(savedSpeeds = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => sanitizeChargeSpeed(savedSpeeds?.[rowIndex]?.[slotIndex])),
  );
}

function normalizePaidArenaChargeSpeeds(savedSpeeds = [], mode = "c") {
  return normalizePaidArenaSideRows(savedSpeeds, mode, normalizePaidArenaChargeSpeedRows, createEmptyPaidArenaChargeSpeeds);
}

function normalizePaidArenaRosannaSacrificeFrameRows(savedFrames = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => sanitizeSacrificeFrame(savedFrames?.[rowIndex]?.[slotIndex])),
  );
}

function normalizePaidArenaRosannaSacrificeFrames(savedFrames = [], mode = "c") {
  return normalizePaidArenaSideRows(savedFrames, mode, normalizePaidArenaRosannaSacrificeFrameRows, createEmptyPaidArenaRosannaSacrificeFrames);
}

function normalizePaidArenaRedHoodPierceCountRows(savedCounts = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => sanitizeRedHoodPierceCount(savedCounts?.[rowIndex]?.[slotIndex])),
  );
}

function normalizePaidArenaRedHoodPierceCounts(savedCounts = [], mode = "c") {
  return normalizePaidArenaSideRows(savedCounts, mode, normalizePaidArenaRedHoodPierceCountRows, createEmptyPaidArenaRedHoodPierceCounts);
}

function normalizePaidArenaScarletCounterEnabledRows(savedValues = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) =>
    Array.from({ length: TEAM_SIZE }, (_, slotIndex) => sanitizeScarletCounterEnabled(savedValues?.[rowIndex]?.[slotIndex])),
  );
}

function normalizePaidArenaScarletCounterEnabled(savedValues = [], mode = "c") {
  return normalizePaidArenaSideRows(savedValues, mode, normalizePaidArenaScarletCounterEnabledRows, createEmptyPaidArenaScarletCounterEnabled);
}

function normalizePaidArenaJackalLink(link = {}) {
  return {
    enabled: Boolean(link?.enabled),
    ownerId: link?.ownerId || null,
    targetIds: Array.isArray(link?.targetIds) ? [...link.targetIds].slice(0, 2) : [],
  };
}

function normalizePaidArenaJackalLinkRows(savedLinks = [], mode = "c") {
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  return Array.from({ length: teamCount }, (_, rowIndex) => normalizePaidArenaJackalLink(savedLinks?.[rowIndex]));
}

function normalizePaidArenaJackalLinks(savedLinks = [], mode = "c") {
  return normalizePaidArenaSideRows(savedLinks, mode, normalizePaidArenaJackalLinkRows, createEmptyPaidArenaJackalLinks);
}

function normalizePaidArenaLinkForTeam(team = [], link = createEmptyJackalLinkState()) {
  const normalizedLink = normalizePaidArenaJackalLink(link);
  const owner = team.find((character) => character && isLinkProvider(character) && character.id === normalizedLink.ownerId);
  if (normalizedLink.enabled && !owner) {
    const defaultOwner = team.find((character) => character && isLinkProvider(character));
    normalizedLink.ownerId = defaultOwner?.id || null;
  }
  const activeOwner = team.find((character) => character && isLinkProvider(character) && character.id === normalizedLink.ownerId);
  if (!activeOwner) return createEmptyJackalLinkState();
  const availableTargetIds = new Set(
    team
      .filter((character) => character && character.id !== activeOwner.id)
      .map((character) => character.id),
  );
  normalizedLink.targetIds = [...new Set(normalizedLink.targetIds || [])].filter((id) => availableTargetIds.has(id)).slice(0, 2);
  return normalizedLink;
}

function serializePaidArenaBySide(mode, serializeRows) {
  return {
    defense: serializeRows("defense"),
    attack: serializeRows("attack"),
  };
}

function serializePaidArenaTeamsFromNormalized(teamsBySide) {
  return {
    defense: (teamsBySide?.defense || []).map((team) => team.map((character) => serializeArcaMember(character))),
    attack: (teamsBySide?.attack || []).map((team) => team.map((character) => serializeArcaMember(character))),
  };
}

function serializePaidArenaTeams(mode) {
  return serializePaidArenaBySide(mode, (teamKey) => getPaidArenaTeams(mode, teamKey).map((team) => team.map((character) => serializeArcaMember(character))));
}

function serializePaidArenaUniversalCharges(mode) {
  return serializePaidArenaBySide(mode, (teamKey) => getPaidArenaUniversalCharges(mode, teamKey).map((teamCharges) => [...teamCharges]));
}

function serializePaidArenaChargeSpeeds(mode) {
  return serializePaidArenaBySide(mode, (teamKey) => getPaidArenaChargeSpeeds(mode, teamKey).map((teamSpeeds) => [...teamSpeeds]));
}

function serializePaidArenaRosannaSacrificeFrames(mode) {
  return serializePaidArenaBySide(mode, (teamKey) => getPaidArenaRosannaSacrificeFrames(mode, teamKey).map((teamFrames) => [...teamFrames]));
}

function serializePaidArenaRedHoodPierceCounts(mode) {
  return serializePaidArenaBySide(mode, (teamKey) => getPaidArenaRedHoodPierceCounts(mode, teamKey).map((teamCounts) => [...teamCounts]));
}

function serializePaidArenaScarletCounterEnabled(mode) {
  return serializePaidArenaBySide(mode, (teamKey) => getPaidArenaScarletCounterEnabled(mode, teamKey).map((teamValues) => [...teamValues]));
}

function serializePaidArenaJackalLinks(mode) {
  return serializePaidArenaBySide(mode, (teamKey) => getPaidArenaJackalLinks(mode, teamKey).map((link) => ({ ...link, targetIds: [...(link.targetIds || [])] })));
}

function serializePaidArenaLineupSlot(mode) {
  return {
    teams: serializePaidArenaTeams(mode),
    universalCharges: serializePaidArenaUniversalCharges(mode),
    chargeSpeeds: serializePaidArenaChargeSpeeds(mode),
    rosannaSacrificeFrames: serializePaidArenaRosannaSacrificeFrames(mode),
    redHoodPierceCounts: serializePaidArenaRedHoodPierceCounts(mode),
    scarletCounterEnabled: serializePaidArenaScarletCounterEnabled(mode),
    jackalLinks: serializePaidArenaJackalLinks(mode),
    activeRowIndex: Math.max(0, Math.min((PAID_ARENA_TEAM_COUNTS[mode] || 1) - 1, Number(state.paidArenaActiveRowIndex) || 0)),
    activeTeamKey: getPaidArenaDataTeamKey(),
  };
}

function normalizePaidArenaLineupSlot(slot = {}, mode = "c") {
  return {
    teams: serializePaidArenaTeamsFromNormalized(normalizePaidArenaTeams(slot.teams, mode)),
    universalCharges: normalizePaidArenaUniversalCharges(slot.universalCharges, mode),
    chargeSpeeds: normalizePaidArenaChargeSpeeds(slot.chargeSpeeds, mode),
    rosannaSacrificeFrames: normalizePaidArenaRosannaSacrificeFrames(slot.rosannaSacrificeFrames, mode),
    redHoodPierceCounts: normalizePaidArenaRedHoodPierceCounts(slot.redHoodPierceCounts, mode),
    scarletCounterEnabled: normalizePaidArenaScarletCounterEnabled(slot.scarletCounterEnabled, mode),
    jackalLinks: normalizePaidArenaJackalLinks(slot.jackalLinks, mode),
    activeRowIndex: Math.max(0, Math.min((PAID_ARENA_TEAM_COUNTS[mode] || 1) - 1, Number(slot.activeRowIndex) || 0)),
    activeTeamKey: normalizeTeamKey(slot.activeTeamKey || slot.dataTeamKey || "attack"),
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
  if (state.helpCenter.solveWorkspace) return;
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
  state.paidArenaRedHoodPierceCounts[normalizedMode] = normalizePaidArenaRedHoodPierceCounts(slot.redHoodPierceCounts, normalizedMode);
  state.paidArenaScarletCounterEnabled[normalizedMode] = normalizePaidArenaScarletCounterEnabled(slot.scarletCounterEnabled, normalizedMode);
  state.paidArenaJackalLinks[normalizedMode] = normalizePaidArenaJackalLinks(slot.jackalLinks, normalizedMode);
  state.paidArenaActiveRowIndex = slot.activeRowIndex;
  state.paidArenaDataTeamKey = normalizeTeamKey(slot.activeTeamKey || state.paidArenaDataTeamKey);
}

function getPaidArenaLineupSlotCount(slot = {}, mode = state.paidArenaMode) {
  const normalizedMode = normalizePaidArenaMode(mode) === "normal" ? "c" : normalizePaidArenaMode(mode);
  const teamsBySide = normalizePaidArenaTeams(slot.teams, normalizedMode);
  const universalBySide = normalizePaidArenaUniversalCharges(slot.universalCharges, normalizedMode);
  return [
    ...["defense", "attack"].flatMap((teamKey) => (teamsBySide[teamKey] || []).flat().filter(Boolean)),
    ...["defense", "attack"].flatMap((teamKey) => (universalBySide[teamKey] || []).flat().filter((charge) => sanitizeUniversalCharge(charge) > 0)),
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
    getPaidArenaRedHoodPierceCounts(normalizedMode)[rowIndex] = Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
      const character = team?.[slotIndex];
      return character && isRedHood(character) ? getSavedCharacterRedHoodPierceCount(character, dataTeamKey) : 0;
    });
  });
}

function setPaidArenaDataTeamKey(teamKey) {
  if (isHelpCenterLockedDefenseSide(teamKey)) {
    state.paidArenaDataTeamKey = "attack";
    showHelpCenterLockedDefenseToast();
    return;
  }
  state.paidArenaDataTeamKey = normalizeTeamKey(teamKey);
  syncPaidArenaChargeSpeedsFromSavedData();
  openSlotSettings = null;
  saveTeam();
  render();
}

function swapPaidArenaSides() {
  const normalizedMode = normalizePaidArenaMode(state.paidArenaMode);
  if (normalizedMode === "normal") return;
  const swapSideRows = (store) => {
    if (!store?.[normalizedMode]) return;
    const entry = store[normalizedMode];
    [entry.defense, entry.attack] = [entry.attack, entry.defense];
  };
  swapSideRows(state.paidArenaTeams);
  swapSideRows(state.paidArenaUniversalCharges);
  swapSideRows(state.paidArenaChargeSpeeds);
  swapSideRows(state.paidArenaRosannaSacrificeFrames);
  swapSideRows(state.paidArenaRedHoodPierceCounts);
  swapSideRows(state.paidArenaScarletCounterEnabled);
  swapSideRows(state.paidArenaJackalLinks);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function simulatePaidArenaBurst(
  team,
  chargeSpeeds = [],
  universalCharges = [],
  sacrificeFrames = Array(TEAM_SIZE).fill(null),
  redHoodPierceCounts = Array(TEAM_SIZE).fill(0),
  scarletCounterEnabled = Array(TEAM_SIZE).fill(true),
  jackalLink = createEmptyJackalLinkState(),
  teamKey = getPaidArenaDataTeamKey(),
) {
  const dataTeamKey = normalizeTeamKey(teamKey);
  const previousTeam = state.team;
  const previousDefenseTeam = state.defenseTeam;
  const previousChargeSpeeds = state.chargeSpeeds;
  const previousDefenseChargeSpeeds = state.defenseChargeSpeeds;
  const previousRedHoodCounts = state.redHoodPierceCounts;
  const previousDefenseRedHoodCounts = state.defenseRedHoodPierceCounts;
  const previousScarletCounterEnabled = state.scarletCounterEnabled;
  const previousDefenseScarletCounterEnabled = state.defenseScarletCounterEnabled;
  const previousJackalLinks = state.jackalLinks;
  const previousQuantumCubes = state.characterQuantumCubes.attack;
  const previousDefenseQuantumCubes = state.characterQuantumCubes.defense;
  const previousMagazines = state.characterMagazines.attack;
  const previousDefenseMagazines = state.characterMagazines.defense;
  const previousRedHoodPierceCounts = state.characterRedHoodPierceCounts.attack;
  const previousDefenseRedHoodPierceCounts = state.characterRedHoodPierceCounts.defense;
  const normalizedChargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(chargeSpeeds[index]));
  const normalizedRedHoodCounts = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(redHoodPierceCounts[index]));
  const normalizedScarletCounterEnabled = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(scarletCounterEnabled[index]));
  const normalizedJackalLink = normalizePaidArenaJackalLink(jackalLink);
  if (dataTeamKey === "defense") {
    state.defenseTeam = [...team];
    state.defenseChargeSpeeds = normalizedChargeSpeeds;
    state.defenseRedHoodPierceCounts = normalizedRedHoodCounts;
    state.defenseScarletCounterEnabled = normalizedScarletCounterEnabled;
  } else {
    state.team = [...team];
    state.chargeSpeeds = normalizedChargeSpeeds;
    state.redHoodPierceCounts = normalizedRedHoodCounts;
    state.scarletCounterEnabled = normalizedScarletCounterEnabled;
  }
  state.jackalLinks = {
    ...state.jackalLinks,
    [dataTeamKey]: { ...normalizedJackalLink, targetIds: [...normalizedJackalLink.targetIds] },
  };
  normalizeJackalLink(dataTeamKey);
  state.characterQuantumCubes[dataTeamKey] = getCharacterQuantumCubeMemory(dataTeamKey);
  state.characterMagazines[dataTeamKey] = getCharacterMagazineMemory(dataTeamKey);
  state.characterRedHoodPierceCounts[dataTeamKey] = getCharacterRedHoodPierceCountMemory(dataTeamKey);
  try {
    return simulateBurst(team, dataTeamKey, [], [], [], [], null, universalCharges, [], sacrificeFrames);
  } finally {
    state.team = previousTeam;
    state.defenseTeam = previousDefenseTeam;
    state.chargeSpeeds = previousChargeSpeeds;
    state.defenseChargeSpeeds = previousDefenseChargeSpeeds;
    state.redHoodPierceCounts = previousRedHoodCounts;
    state.defenseRedHoodPierceCounts = previousDefenseRedHoodCounts;
    state.scarletCounterEnabled = previousScarletCounterEnabled;
    state.defenseScarletCounterEnabled = previousDefenseScarletCounterEnabled;
    state.jackalLinks = previousJackalLinks;
    state.characterQuantumCubes.attack = previousQuantumCubes;
    state.characterQuantumCubes.defense = previousDefenseQuantumCubes;
    state.characterMagazines.attack = previousMagazines;
    state.characterMagazines.defense = previousDefenseMagazines;
    state.characterRedHoodPierceCounts.attack = previousRedHoodPierceCounts;
    state.characterRedHoodPierceCounts.defense = previousDefenseRedHoodPierceCounts;
  }
}

function getPaidArenaSimulationContext(mode, teamKey, rowIndex = state.paidArenaActiveRowIndex) {
  const normalizedMode = normalizePaidArenaMode(mode);
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  const teams = getPaidArenaTeams(normalizedMode, normalizedTeamKey);
  const normalizedRowIndex = Math.max(0, Math.min(teams.length - 1, Number(rowIndex) || 0));
  const team = teams[normalizedRowIndex] || Array(TEAM_SIZE).fill(null);
  const universalCharges = getPaidArenaUniversalCharges(normalizedMode, normalizedTeamKey)[normalizedRowIndex] || Array(TEAM_SIZE).fill(0);
  const sacrificeFrames = getPaidArenaRosannaSacrificeFrames(normalizedMode, normalizedTeamKey)[normalizedRowIndex] || Array(TEAM_SIZE).fill(null);
  const redHoodPierceCounts = getPaidArenaRedHoodPierceCounts(normalizedMode, normalizedTeamKey)[normalizedRowIndex] || Array(TEAM_SIZE).fill(0);
  const scarletCounterEnabled = getPaidArenaScarletCounterEnabled(normalizedMode, normalizedTeamKey)[normalizedRowIndex] || Array(TEAM_SIZE).fill(true);
  const jackalLink = normalizePaidArenaLinkForTeam(team, getPaidArenaJackalLinks(normalizedMode, normalizedTeamKey)[normalizedRowIndex]);
  const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, normalizedTeamKey);
  return {
    mode: normalizedMode,
    teamKey: normalizedTeamKey,
    rowIndex: normalizedRowIndex,
    team,
    universalCharges,
    sacrificeFrames,
    redHoodPierceCounts,
    scarletCounterEnabled,
    jackalLink,
    chargeSpeeds,
    result: null,
  };
}

function withPaidArenaSimulationState(attackContext, defenseContext, callback) {
  const previousTeam = state.team;
  const previousDefenseTeam = state.defenseTeam;
  const previousChargeSpeeds = state.chargeSpeeds;
  const previousDefenseChargeSpeeds = state.defenseChargeSpeeds;
  const previousRedHoodCounts = state.redHoodPierceCounts;
  const previousDefenseRedHoodCounts = state.defenseRedHoodPierceCounts;
  const previousScarletCounterEnabled = state.scarletCounterEnabled;
  const previousDefenseScarletCounterEnabled = state.defenseScarletCounterEnabled;
  const previousJackalLinks = state.jackalLinks;
  const previousQuantumCubes = state.characterQuantumCubes.attack;
  const previousDefenseQuantumCubes = state.characterQuantumCubes.defense;
  const previousMagazines = state.characterMagazines.attack;
  const previousDefenseMagazines = state.characterMagazines.defense;
  const previousRedHoodPierceCounts = state.characterRedHoodPierceCounts.attack;
  const previousDefenseRedHoodPierceCounts = state.characterRedHoodPierceCounts.defense;

  state.team = [...(attackContext?.team || [])];
  state.defenseTeam = [...(defenseContext?.team || [])];
  state.chargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(attackContext?.chargeSpeeds?.[index]));
  state.defenseChargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(defenseContext?.chargeSpeeds?.[index]));
  state.redHoodPierceCounts = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(attackContext?.redHoodPierceCounts?.[index]));
  state.defenseRedHoodPierceCounts = Array.from({ length: TEAM_SIZE }, (_, index) =>
    sanitizeRedHoodPierceCount(defenseContext?.redHoodPierceCounts?.[index]),
  );
  state.scarletCounterEnabled = Array.from({ length: TEAM_SIZE }, (_, index) =>
    sanitizeScarletCounterEnabled(attackContext?.scarletCounterEnabled?.[index]),
  );
  state.defenseScarletCounterEnabled = Array.from({ length: TEAM_SIZE }, (_, index) =>
    sanitizeScarletCounterEnabled(defenseContext?.scarletCounterEnabled?.[index]),
  );
  state.jackalLinks = {
    ...state.jackalLinks,
    attack: {
      ...(attackContext?.jackalLink || createEmptyJackalLinkState()),
      targetIds: [...(attackContext?.jackalLink?.targetIds || [])],
    },
    defense: {
      ...(defenseContext?.jackalLink || createEmptyJackalLinkState()),
      targetIds: [...(defenseContext?.jackalLink?.targetIds || [])],
    },
  };
  normalizeJackalLink("attack");
  normalizeJackalLink("defense");
  state.characterQuantumCubes.attack = getCharacterQuantumCubeMemory("attack");
  state.characterQuantumCubes.defense = getCharacterQuantumCubeMemory("defense");
  state.characterMagazines.attack = getCharacterMagazineMemory("attack");
  state.characterMagazines.defense = getCharacterMagazineMemory("defense");
  state.characterRedHoodPierceCounts.attack = getCharacterRedHoodPierceCountMemory("attack");
  state.characterRedHoodPierceCounts.defense = getCharacterRedHoodPierceCountMemory("defense");

  try {
    return callback();
  } finally {
    state.team = previousTeam;
    state.defenseTeam = previousDefenseTeam;
    state.chargeSpeeds = previousChargeSpeeds;
    state.defenseChargeSpeeds = previousDefenseChargeSpeeds;
    state.redHoodPierceCounts = previousRedHoodCounts;
    state.defenseRedHoodPierceCounts = previousDefenseRedHoodCounts;
    state.scarletCounterEnabled = previousScarletCounterEnabled;
    state.defenseScarletCounterEnabled = previousDefenseScarletCounterEnabled;
    state.jackalLinks = previousJackalLinks;
    state.characterQuantumCubes.attack = previousQuantumCubes;
    state.characterQuantumCubes.defense = previousDefenseQuantumCubes;
    state.characterMagazines.attack = previousMagazines;
    state.characterMagazines.defense = previousDefenseMagazines;
    state.characterRedHoodPierceCounts.attack = previousRedHoodPierceCounts;
    state.characterRedHoodPierceCounts.defense = previousDefenseRedHoodPierceCounts;
  }
}

function computePaidArenaBattleResultsForRow(rowIndex = state.paidArenaActiveRowIndex) {
  if (!isPaidArenaModeActive()) return { attackResult: null, defenseResult: null };
  const mode = state.paidArenaMode;
  const attackContext = getPaidArenaSimulationContext(mode, "attack", rowIndex);
  const defenseContext = getPaidArenaSimulationContext(mode, "defense", rowIndex);
  return withPaidArenaSimulationState(attackContext, defenseContext, () => {
    let attackStunWindows = getStunWindowsForTeam("attack");
    let defenseStunWindows = getStunWindowsForTeam("defense");
    let attackStunDodgeEvents = [];
    let defenseStunDodgeEvents = [];
    let attackResult = simulateBurst(
      state.team,
      "attack",
      [],
      [],
      [],
      attackStunWindows,
      [],
      attackContext.universalCharges,
      state.defenseTeam,
      attackContext.sacrificeFrames,
      attackStunDodgeEvents,
    );
    let defenseResult = simulateBurst(
      state.defenseTeam,
      "defense",
      [],
      [],
      [],
      defenseStunWindows,
      [],
      defenseContext.universalCharges,
      state.team,
      defenseContext.sacrificeFrames,
      defenseStunDodgeEvents,
    );

    for (let index = 0; index < 8; index += 1) {
      attackStunWindows = getStunWindowsForTeam("attack", attackResult?.reloadTimeline || []);
      defenseStunWindows = getStunWindowsForTeam("defense", defenseResult?.reloadTimeline || []);
      attackStunDodgeEvents = getDodgedStunEventsForTeam("attack", attackResult?.reloadTimeline || []);
      defenseStunDodgeEvents = getDodgedStunEventsForTeam("defense", defenseResult?.reloadTimeline || []);
      const attackSpecials = getSpecialChargeEventsForTeam(attackResult, defenseResult);
      const defenseSpecials = getSpecialChargeEventsForTeam(defenseResult, attackResult);
      const continueUntilFrame = getSharedBattleCalculationEndFrame(attackResult, defenseResult);
      const nextAttackResult = simulateBurst(
        state.team,
        "attack",
        attackSpecials,
        defenseResult?.reloadTimeline || [],
        defenseResult?.turnDodgeTimeline || [],
        attackStunWindows,
        defenseResult?.tauntTimeline || [],
        attackContext.universalCharges,
        state.defenseTeam,
        attackContext.sacrificeFrames,
        attackStunDodgeEvents,
        { continueUntilFrame },
      );
      const nextDefenseResult = simulateBurst(
        state.defenseTeam,
        "defense",
        defenseSpecials,
        attackResult?.reloadTimeline || [],
        attackResult?.turnDodgeTimeline || [],
        defenseStunWindows,
        attackResult?.tauntTimeline || [],
        defenseContext.universalCharges,
        state.team,
        defenseContext.sacrificeFrames,
        defenseStunDodgeEvents,
        { continueUntilFrame },
      );
      const stable =
        getResultSignature(nextAttackResult) === getResultSignature(attackResult) &&
        getResultSignature(nextDefenseResult) === getResultSignature(defenseResult);
      attackResult = nextAttackResult;
      defenseResult = nextDefenseResult;
      if (stable) break;
    }

    return { attackResult, defenseResult, attackContext, defenseContext };
  });
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

function findPaidArenaFillRowIndex(teams, startRowIndex = state.paidArenaActiveRowIndex) {
  if (!Array.isArray(teams) || !teams.length) return -1;
  const normalizedStart = Math.max(0, Math.min(teams.length - 1, Number(startRowIndex) || 0));
  for (let rowIndex = normalizedStart; rowIndex < teams.length; rowIndex += 1) {
    if ((teams[rowIndex] || []).some((member) => !member)) return rowIndex;
  }
  return -1;
}

function findNextPaidArenaFillRowIndex(teams, currentRowIndex) {
  if (!Array.isArray(teams) || !teams.length) return -1;
  const start = Math.max(0, Math.min(teams.length - 1, Number(currentRowIndex) || 0)) + 1;
  for (let rowIndex = start; rowIndex < teams.length; rowIndex += 1) {
    if ((teams[rowIndex] || []).some((member) => !member)) return rowIndex;
  }
  return currentRowIndex;
}

function getLocalPaidInferenceSignature() {
  return JSON.stringify(getLocalPaidInferencePayload());
}

function formatPaidInferenceMatch(match, key) {
  const values = match.displayValues?.length ? match.displayValues.join(" / ") : (match[key] || []).join(" / ");
  return `P${match.attackPosition} ${match.attackCharacterName} 第${match.shotNumber}发：${values || "无匹配"}`;
}

function createPaidCandidateLine(text, highlight = false) {
  return { text: String(text || ""), highlight: Boolean(highlight) };
}

function scheduleLocalPaidInferenceRefresh() {
  if (!state.testMode) return;
  const signature = getLocalPaidInferenceSignature();
  if (signature === localPaidInferenceState.requestSignature && (localPaidInferenceState.loading || localPaidInferenceState.result || localPaidInferenceState.error)) return;
  if (localPaidInferenceState.refreshTimer) clearTimeout(localPaidInferenceState.refreshTimer);
  localPaidInferenceState.refreshTimer = setTimeout(() => {
    localPaidInferenceState.refreshTimer = null;
    localPaidInferenceState.requestSignature = signature;
    refreshLocalPaidInference();
  }, 0);
}

function refreshLocalPaidInference() {
  localPaidInferenceState.loading = false;
  localPaidInferenceState.error = "";
  localPaidInferenceState.result = null;
  try {
    localPaidInferenceState.result = inferMissCandidates(getLocalPaidInferencePayload());
  } catch (error) {
    localPaidInferenceState.error = `空枪反推计算失败${error?.message ? `：${error.message}` : ""}`;
  }
  renderTeam();
}

function getPaidCandidateLines(candidateType, valueKey) {
  const candidate = localPaidInferenceState.result?.candidates?.find((item) => item.type === candidateType);
  if (localPaidInferenceState.loading) return [createPaidCandidateLine("计算中...")];
  if (localPaidInferenceState.error) return [createPaidCandidateLine(localPaidInferenceState.error)];
  if (!candidate?.matches?.length) return [createPaidCandidateLine("无匹配")];
  const allLauncherValues = candidate.allLauncherDisplayValues?.length ? candidate.allLauncherDisplayValues.join(" / ") : "";
  return [
    ...(allLauncherValues ? [createPaidCandidateLine(`全发射器：${allLauncherValues}`, true)] : []),
    ...candidate.matches.map((match) => createPaidCandidateLine(formatPaidInferenceMatch(match, valueKey))),
  ];
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
        ${candidate.lines.map((line) => `<strong${line.highlight ? ' class="is-all-launcher-match"' : ""}>${escapeHtml(line.text)}</strong>`).join("")}
      </span>
    `;
    slotsRow.append(slot);
  });

  return row;
}

function createPaidFeatureModal(title = "空枪反推") {
  const modalTitle = isEnglishLanguage() && title === "空枪反推" ? "Missed-shot inference" : title;
  const backdrop = document.createElement("div");
  backdrop.className = "paid-modal-backdrop";
  backdrop.setAttribute("role", "presentation");
  backdrop.innerHTML = `
    <section class="paid-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(localize("功能提示", "Feature notice"))}">
      <div class="paid-modal-head">
        <div>
          <span class="paid-modal-kicker">Pro</span>
          <strong>${escapeHtml(modalTitle)}</strong>
        </div>
        <button class="paid-modal-close" type="button" aria-label="${escapeHtml(localize("关闭", "Close"))}">X</button>
      </div>
      <div class="paid-modal-content">
        <p>${escapeHtml(localize("该功能正在开发中！", "This feature is under development."))}</p>
      </div>
      <div class="paid-modal-actions">
        <button class="paid-modal-confirm" type="button">${escapeHtml(localize("知道了", "Got it"))}</button>
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
  if (state.helpCenter.solveWorkspace) {
    showToast(localize("临时解题中不能切换竞技场模式", "Cannot change arena mode while solving."));
    return;
  }
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
  closePaidFeatureModal();
  setPaidTestMode(!state.testMode);
}

function getPaidArenaFeatureTitle(mode) {
  return mode === "c" ? localize("冠军竞技场", "Champion Arena") : localize("特殊竞技场", "Special Arena");
}

function getPaidArenaModeLabel(mode = state.paidArenaMode) {
  return mode === "c" ? localize("冠军竞技场", "Champion Arena") : mode === "p" ? localize("特殊竞技场", "Special Arena") : "";
}

function sanitizeChampionStage(value) {
  const normalized = String(value || "unknown");
  return CHAMPION_STAGE_OPTIONS.some((option) => option.value === normalized) ? normalized : "unknown";
}

function getChampionStageLabel(value = state.championStage) {
  const option = CHAMPION_STAGE_OPTIONS.find((item) => item.value === sanitizeChampionStage(value)) || CHAMPION_STAGE_OPTIONS[0];
  return localize(option.zh, option.en);
}

function setPaidArenaMode(mode) {
  if (isHelpCenterSolveActive()) {
    showToast(localize("\u4e92\u52a9\u89e3\u9898\u4e2d\u4e0d\u80fd\u5207\u6362\u7ade\u6280\u573a\u6a21\u5f0f", "Cannot switch arena mode while solving a help request."));
    return;
  }
  const nextMode = normalizePaidArenaMode(mode);
  if (isPaidArenaModeActive()) saveCurrentPaidArenaLineupSlot(state.paidArenaMode);
  state.paidArenaMode = nextMode;
  if (isPaidArenaModeActive()) {
    state.paidArenaActiveLineupIndex[nextMode] = getPaidArenaActiveLineupIndex(nextMode);
    loadPaidArenaLineupSlot(nextMode, state.paidArenaActiveLineupIndex[nextMode]);
    state.testMode = false;
    state.paidArenaDisplayMode = "side";
    state.paidArenaDataTeamKey = "attack";
    state.paidArenaActiveRowIndex = 0;
    syncPaidArenaChargeSpeedsFromSavedData();
  } else {
    setActiveTeam("defense");
  }
  openSlotSettings = null;
  hideChartTooltip();
  saveTeam();
  render();
}

function openPaidArenaFeature(mode) {
  if (isHelpCenterSolveActive()) {
    showToast(localize("\u4e92\u52a9\u89e3\u9898\u4e2d\u4e0d\u80fd\u5207\u6362\u7ade\u6280\u573a\u6a21\u5f0f", "Cannot switch arena mode while solving a help request."));
    return;
  }
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
  if (state.helpCenter.solveWorkspace) {
    els.lineupSlots.hidden = true;
    els.lineupSlots.replaceChildren();
    return;
  }
  if (isPaidArenaModeActive()) {
    els.lineupSlots.hidden = false;
    const mode = state.paidArenaMode;
    const activeIndex = getPaidArenaActiveLineupIndex(mode);
    const fragment = document.createDocumentFragment();
    ensurePaidArenaLineupSlots(mode).forEach((slot, index) => {
      const count = getPaidArenaLineupSlotCount(slot, mode);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `lineup-slot-button${index === activeIndex ? " is-active" : ""}${count ? " has-lineup" : ""}`;
      button.draggable = true;
      button.dataset.paidArenaLineupIndex = index;
      button.textContent = String(index + 1);
      button.title = `${getPaidArenaModeLabel(mode)} ${localize("方案", "Plan")} ${index + 1}${count ? ` · ${count}` : ` · ${localize("空", "Empty")}`}`;
      button.addEventListener("dragstart", (event) => {
        draggedPaidArenaLineupIndex = index;
        button.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("text/plain", String(index));
        event.dataTransfer.setData("application/x-nyk-paid-arena-lineup-drag", "1");
      });
      button.addEventListener("dragend", () => {
        draggedPaidArenaLineupIndex = null;
        els.lineupSlots.querySelectorAll(".lineup-slot-button").forEach((slotButton) => {
          slotButton.classList.remove("is-dragging", "is-drop-target");
        });
      });
      button.addEventListener("dragover", (event) => {
        const sourceIndex = getDraggedPaidArenaLineupSourceIndex(event, mode);
        if (sourceIndex === null || sourceIndex === index) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "copy";
        button.classList.add("is-drop-target");
      });
      button.addEventListener("dragleave", () => {
        button.classList.remove("is-drop-target");
      });
      button.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const sourceIndex = getDraggedPaidArenaLineupSourceIndex(event, mode);
        button.classList.remove("is-drop-target");
        suppressLineupClick = true;
        setTimeout(() => {
          suppressLineupClick = false;
        }, 0);
        if (sourceIndex === null) return;
        copyPaidArenaLineupSlotTo(sourceIndex, index, mode);
      });
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
    button.title = localize(
      `方案 ${index + 1}${count ? ` · ${count}/10` : " · 空"}，可拖动复制到其他方案`,
      `Plan ${index + 1}${count ? ` · ${count}/10` : " · Empty"}, drag to copy to another plan`,
    );
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

function simulateBattle(...args) {
  try {
    return computePaidArenaBattleResultsForRow(...args);
  } catch {
    return { attackResult: null, defenseResult: null };
  }
}

function getPaidArenaResultText(
  team,
  universalCharges,
  chargeSpeeds = [],
  result = null,
  sacrificeFrames = Array(TEAM_SIZE).fill(null),
  redHoodPierceCounts = Array(TEAM_SIZE).fill(0),
  scarletCounterEnabled = Array(TEAM_SIZE).fill(true),
  jackalLink = createEmptyJackalLinkState(),
  teamKey = getPaidArenaDataTeamKey(),
) {
  const rowResult =
    result || simulatePaidArenaBurst(team, chargeSpeeds, universalCharges, sacrificeFrames, redHoodPierceCounts, scarletCounterEnabled, jackalLink, teamKey);
  if (!rowResult) return localize("未配置", "Not configured");
  if (rowResult.error) return rowResult.error;
  const frame = rowResult.fullFrame;
  return localize(
    `等于${formatNumber(frame / 76, 2)}RL(${frame}F)等于${formatNumber(frame / 42 + 1, 2)}SG`,
    `equals ${formatNumber(frame / 76, 2)} RL (${frame}F), equals ${formatNumber(frame / 42 + 1, 2)} SG`,
  );
}

function createPaidArenaDataSourceBar() {
  const dataTeamKey = getPaidArenaSelectedDataTeamKey();
  const bar = document.createElement("div");
  bar.className = "paid-arena-data-source-bar";
  const attackLabel = localize("进攻队伍", "Attack teams");
  const defenseLabel = localize("防守队伍", "Defense teams");
  const swapLabel = localize("交换", "Swap");
  bar.innerHTML = `
    <div class="paid-arena-data-source-actions" role="group" aria-label="${escapeHtml(localize("选择显示队伍", "Choose team side"))}">
      <button class="paid-arena-side-button is-attack${dataTeamKey === "attack" ? " is-active" : ""}" type="button" data-paid-data-source="attack">${escapeHtml(attackLabel)}</button>
      <button class="paid-arena-side-button is-swap" type="button" data-paid-side-swap="1">${escapeHtml(swapLabel)}</button>
      <button class="paid-arena-side-button is-defense${dataTeamKey === "defense" ? " is-active" : ""}" type="button" data-paid-data-source="defense">${escapeHtml(defenseLabel)}</button>
    </div>
  `;
  bar.querySelectorAll("[data-paid-data-source]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setPaidArenaDataTeamKey(button.dataset.paidDataSource);
    });
  });
  bar.querySelector("[data-paid-side-swap]")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    swapPaidArenaSides();
  });
  return bar;
}

function createPaidArenaDisplayModeBar() {
  const displayMode = getPaidArenaDisplayMode();
  const bar = document.createElement("div");
  bar.className = "paid-arena-display-mode-bar";
  bar.innerHTML = `
    <div class="paid-arena-display-mode-actions" role="group" aria-label="${escapeHtml(localize("显示模式", "Display mode"))}">
      <button class="${displayMode === "side" ? "is-active" : ""}" type="button" data-paid-display-mode="side">${escapeHtml(localize("攻防显示", "Side view"))}</button>
      <button class="${displayMode === "round" ? "is-active" : ""}" type="button" data-paid-display-mode="round">${escapeHtml(localize("ROUND显示", "Round view"))}</button>
    </div>
  `;
  bar.querySelectorAll("[data-paid-display-mode]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setPaidArenaDisplayMode(button.dataset.paidDisplayMode);
    });
  });
  return bar;
}

function createPaidArenaRoundBar(teamCount) {
  const normalizedCount = Math.max(0, Number(teamCount) || 0);
  const activeIndex = Math.max(0, Math.min(normalizedCount - 1, Number(state.paidArenaActiveRowIndex) || 0));
  const bar = document.createElement("div");
  bar.className = "paid-arena-round-bar";
  const buttons = Array.from({ length: normalizedCount }, (_, index) => `
    <button class="${index === activeIndex ? "is-active" : ""}" type="button" data-paid-round-index="${index}">R${index + 1}</button>
  `).join("");
  bar.innerHTML = `<div class="paid-arena-round-actions" role="group" aria-label="${escapeHtml(localize("ROUND选择", "Round selection"))}">${buttons}</div>`;
  bar.querySelectorAll("[data-paid-round-index]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      state.paidArenaActiveRowIndex = Math.max(0, Math.min(normalizedCount - 1, Number(button.dataset.paidRoundIndex) || 0));
      saveTeam();
      render();
    });
  });
  return bar;
}

function createChampionStageBar() {
  const activeStage = sanitizeChampionStage(state.championStage);
  const bar = document.createElement("div");
  bar.className = "champion-stage-bar";
  const buttons = CHAMPION_STAGE_OPTIONS.map((option) => `
    <button class="${option.value === activeStage ? "is-active" : ""}" type="button" data-champion-stage="${escapeHtml(option.value)}">
      ${escapeHtml(localize(option.zh, option.en))}
    </button>
  `).join("");
  bar.innerHTML = `
    <div class="champion-stage-actions" role="group" aria-label="${escapeHtml(localize("冠军阶段", "Champion stage"))}">
      ${buttons}
    </div>
  `;
  bar.querySelectorAll("[data-champion-stage]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      state.championStage = sanitizeChampionStage(button.dataset.championStage);
      saveTeam();
      render();
    });
  });
  return bar;
}

function getPaidArenaDisplayRows() {
  const mode = state.paidArenaMode;
  const teamCount = PAID_ARENA_TEAM_COUNTS[mode] || 0;
  if (teamCount <= 0) return [];
  state.paidArenaActiveRowIndex = Math.max(0, Math.min(teamCount - 1, Number(state.paidArenaActiveRowIndex) || 0));

  const createRow = (teamKey, rowIndex) => {
    const teams = getPaidArenaTeams(mode, teamKey);
    const team = teams[rowIndex] || Array(TEAM_SIZE).fill(null);
    return {
      dataTeamKey: normalizeTeamKey(teamKey),
      rowIndex,
      team,
      universalCharges: getPaidArenaUniversalCharges(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(0),
      sacrificeFrames: getPaidArenaRosannaSacrificeFrames(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(null),
      redHoodPierceCounts: getPaidArenaRedHoodPierceCounts(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(0),
      scarletCounterEnabled: getPaidArenaScarletCounterEnabled(mode, teamKey)[rowIndex] || Array(TEAM_SIZE).fill(true),
      jackalLinkState: normalizePaidArenaLinkForTeam(team, getPaidArenaJackalLinks(mode, teamKey)[rowIndex]),
    };
  };

  if (getPaidArenaDisplayMode() === "round") {
    const rowIndex = state.paidArenaActiveRowIndex;
    return [createRow("defense", rowIndex), createRow("attack", rowIndex)];
  }

  const dataTeamKey = getPaidArenaDataTeamKey();
  return getPaidArenaTeams(mode, dataTeamKey).map((team, rowIndex) => createRow(dataTeamKey, rowIndex));
}

function parsePaidArenaDragPayload(event, fallbackTeamKey, fallbackRowIndex, fallbackSlotIndex) {
  const raw = String(event?.dataTransfer?.getData("text/plain") || "").trim();
  const parts = raw.split(":");
  if (parts[0] === "paidArena" && parts.length >= 4) {
    return {
      teamKey: normalizeTeamKey(parts[1]),
      rowIndex: Number(parts[2]),
      slotIndex: Number(parts[3]),
    };
  }
  if (parts[0] === "paidArena" && parts.length >= 3) {
    return {
      teamKey: normalizeTeamKey(draggedPaidArenaTeamKey || fallbackTeamKey),
      rowIndex: Number(parts[1]),
      slotIndex: Number(parts[2]),
    };
  }
  return {
    teamKey: normalizeTeamKey(draggedPaidArenaTeamKey || fallbackTeamKey),
    rowIndex: Number(fallbackRowIndex),
    slotIndex: Number(fallbackSlotIndex),
  };
}

function parsePaidArenaRowDragPayload(event) {
  const raw = String(event?.dataTransfer?.getData("text/plain") || "").trim();
  const parts = raw.split(":");
  if (parts[0] !== "paidArenaRow" || parts.length < 4) return null;
  return {
    mode: normalizePaidArenaMode(parts[1]),
    teamKey: normalizeTeamKey(parts[2]),
    rowIndex: Number(parts[3]),
  };
}

function isPaidArenaRowDrag(event) {
  const types = Array.from(event?.dataTransfer?.types || []);
  return types.includes("application/x-nyk-paid-arena-row-drag") || Boolean(parsePaidArenaRowDragPayload(event));
}

function renderPaidArenaTeams() {
  const fragment = document.createDocumentFragment();
  const teamCount = PAID_ARENA_TEAM_COUNTS[state.paidArenaMode] || 0;
  state.paidArenaActiveRowIndex = Math.max(0, Math.min(teamCount - 1, Number(state.paidArenaActiveRowIndex) || 0));
  const displayRows = getPaidArenaDisplayRows();
  fragment.append(createPaidArenaDisplayModeBar());
  if (getPaidArenaDisplayMode() === "round") {
    fragment.append(createPaidArenaRoundBar(teamCount));
  } else {
    fragment.append(createPaidArenaDataSourceBar());
  }

  displayRows.forEach((rowEntry) => {
    const { dataTeamKey, rowIndex, team, universalCharges, sacrificeFrames, redHoodPierceCounts, scarletCounterEnabled, jackalLinkState } = rowEntry;
    const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, dataTeamKey);
    const result = getPaidArenaChartResultForTeam(dataTeamKey, rowIndex);
    const finishingPositions = new Set(result && !result.error ? result.finishingPositionIndices : []);
    const tauntTargetPositionIndex = getTauntTargetState(team, dataTeamKey, chargeSpeeds)?.positionIndex ?? null;
    const teamHasRosanna = team.some((member) => member && isRosanna(member));
    const effectiveLinkOwner = getEffectiveLinkOwnerForTeam(team, jackalLinkState);
    const isAutoFullTeamLink = Boolean(getAutoFullTeamLinkOwner(team));
    const isJackalConnecting = isEffectiveLinkEnabledForTeam(team, jackalLinkState);
    const jackalTargetIds = new Set(getEffectiveLinkTargetIdsForTeam(team, jackalLinkState));
    const linkOwner = effectiveLinkOwner;
    const linkOwnerName = linkOwner
      ? isJackal(linkOwner)
        ? localize("豺狼链接", "Jackal link")
        : localize("波莉链接", "Poli link")
      : localize("链接", "Link");
    const hasSacrificeTarget = team.some(
      (member, index) => member && !isRosanna(member) && sanitizeSacrificeFrame(sacrificeFrames[index]) !== null,
    );
    const isLockedRow = isHelpCenterLockedDefenseSide(dataTeamKey);
    const row = document.createElement("section");
    row.className = `team-row paid-arena-row ${dataTeamKey === "defense" ? "is-defense-side" : "is-attack-side"}${state.paidArenaActiveRowIndex === rowIndex ? " is-active" : ""}${isLockedRow ? " is-help-solve-locked" : ""}`;
    row.dataset.paidArenaRowIndex = String(rowIndex);
    row.dataset.paidArenaTeamKey = dataTeamKey;
    row.setAttribute(
      "aria-label",
      `${getPaidArenaModeLabel()} ${dataTeamKey === "defense" ? getTeamLabel("defense") : getTeamLabel("attack")} ${rowIndex + 1}`,
    );
    row.innerHTML = '<div class="team-slots-row"></div><div class="paid-arena-result-bar"></div>';
    row.addEventListener("click", (event) => {
      if (isLockedRow) {
        showHelpCenterLockedDefenseToast();
        return;
      }
      if (event.target.closest(".universal-charge-field")) return;
      if (suppressTeamSlotClick) return;
      state.paidArenaActiveRowIndex = rowIndex;
      state.paidArenaDataTeamKey = dataTeamKey;
      saveTeam();
      render();
    });

    const slotsRow = row.querySelector(".team-slots-row");
    team.forEach((character, slotIndex) => {
      const universalChargeValue = sanitizeUniversalCharge(universalCharges[slotIndex]);
      const chargeSpeedValue = sanitizeChargeSpeed(getArcaChargeParameters(character, dataTeamKey)?.chargeSpeed ?? chargeSpeeds[slotIndex]);
      const isSettingsOpen =
        character &&
        openSlotSettings?.paidArenaMode === state.paidArenaMode &&
        normalizeTeamKey(openSlotSettings.teamKey) === dataTeamKey &&
        Number(openSlotSettings.rowIndex) === rowIndex &&
        Number(openSlotSettings.index) === slotIndex;
      const isFinisher = finishingPositions.has(slotIndex) && canShowFinishMarker(character);
      const isTauntTarget = character && slotIndex === tauntTargetPositionIndex;
      const sacrificeFrame = sanitizeSacrificeFrame(sacrificeFrames[slotIndex]);
      const cubeIconSrc = character ? getCubeIconSrc(getArcaChargeParameters(character, dataTeamKey)?.displayCubeType ?? getArcaChargeParameters(character, dataTeamKey)?.cubeType ?? getSavedCharacterCubeType(character, dataTeamKey)) : "";
      const isSacrificedTarget =
        character && teamHasRosanna && !isRosanna(character) && sacrificeFrame !== null;
      const displayMagazine = character ? getDisplayMagazine(character, dataTeamKey) : null;
      const redHoodPierceCount = character && isRedHood(character) ? sanitizeRedHoodPierceCount(redHoodPierceCounts[slotIndex]) : 0;
      const isScarletCounterEnabled = character && isScarlet(character) ? sanitizeScarletCounterEnabled(scarletCounterEnabled[slotIndex]) : false;
      const sideBadgeText =
        character && canEditChargeSpeed(character) && chargeSpeedValue > 0
          ? `${chargeSpeedValue}%`
          : displayMagazine
            ? String(displayMagazine)
            : "";
      const isJackalOwner = character && isLinkProvider(character) && (!isAutoFullTeamLink || effectiveLinkOwner?.id === character.id);
      const isActiveLinkOwner = character && isJackalConnecting && effectiveLinkOwner?.id === character.id;
      const isJackalTarget = character && jackalTargetIds.has(character.id);
      const canSelectJackalTarget =
        character && character.id !== effectiveLinkOwner?.id && isJackalConnecting && (isJackalTarget || jackalTargetIds.size < 2);
      const slot = document.createElement("div");
      slot.className = `team-slot paid-arena-slot${character ? " filled" : ""}${!character && universalChargeValue > 0 ? " has-universal" : ""}${getTeamSlotRarityClass(character)}${isFinisher ? " is-finisher" : ""}`;
      slot.dataset.paidArenaRowIndex = String(rowIndex);
      slot.dataset.paidArenaTeamKey = dataTeamKey;
      slot.dataset.slotIndex = String(slotIndex);
      slot.draggable = Boolean(character) && !isLockedRow;
      slot.innerHTML = character
        ? `
          <button class="slot-remove" type="button" aria-label="${escapeHtml(localize("移除", "Remove"))} ${escapeHtml(getCharacterLocalizedName(character))}">
            <span class="team-avatar">${getAvatarMarkup(character)}</span>
          </button>
        `
        : `
          <div class="slot-empty">
            <span class="position">P${slotIndex + 1}</span>
            <label class="universal-charge-field" aria-label="P${slotIndex + 1} ${escapeHtml(localize("万能充能值", "universal charge value"))}">
              <span class="universal-charge-label">${escapeHtml(localize("充", "C"))}</span>
              <input
                type="text"
                inputmode="decimal"
                name="paid-universal-${state.paidArenaMode}-${rowIndex}-${slotIndex}"
                id="paid-universal-${state.paidArenaMode}-${rowIndex}-${slotIndex}"
                value="${universalChargeValue || ""}"
                placeholder="0"
                data-paid-arena-universal-index="${slotIndex}"
              />
            </label>
          </div>
        `;

      if (character) {
        const removeButton = slot.querySelector(".slot-remove");
        const copyLayer = document.createElement("span");
        copyLayer.className = "slot-copy";
        copyLayer.setAttribute("aria-hidden", "true");
        copyLayer.innerHTML = `
          ${isTauntTarget ? `<span class="taunt-mark">${escapeHtml(localize("嘲", "T"))}</span>` : ""}
          ${isSacrificedTarget ? getSacrificeMarkMarkup(sacrificeFrame) : ""}
          ${isFinisher ? `<span class="finish-mark">${escapeHtml(localize("定", "F"))}</span>` : ""}
          ${cubeIconSrc ? `<span class="slot-cube-badge"><img src="${cubeIconSrc}" alt="" /></span>` : ""}
          ${sideBadgeText ? `<span class="slot-speed-badge">${sideBadgeText}</span>` : ""}
        `;
        removeButton?.append(copyLayer);

        const settingsButton = document.createElement("button");
        settingsButton.className = `slot-settings-toggle${isSettingsOpen ? " is-open" : ""}`;
        settingsButton.type = "button";
        settingsButton.setAttribute("aria-label", `${localize("设置", "Settings")} ${getCharacterLocalizedName(character)}`);
        settingsButton.title = localize("设置", "Settings");
        settingsButton.innerHTML = '<img src="assets/immutable/icons/ui/settings.46ca2edb23d9.svg" alt="" aria-hidden="true" />';
        slot.append(settingsButton);

        if (isRosanna(character)) {
          const sacrificeButton = document.createElement("button");
          sacrificeButton.className = `slot-sacrifice-toggle${
            isPaidArenaRosannaSacrificeSettingsOpen(state.paidArenaMode, rowIndex, slotIndex, dataTeamKey) || hasSacrificeTarget ? " is-active" : ""
          }`;
          sacrificeButton.type = "button";
          sacrificeButton.setAttribute("aria-label", `${localize("设置", "Set")} ${getCharacterLocalizedName(character)} ${localize("献祭", "sacrifice")}`);
          sacrificeButton.title = localize("罗珊娜献祭", "Rosanna sacrifice");
          sacrificeButton.innerHTML = '<img src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" aria-hidden="true" />';
          slot.append(sacrificeButton);
        }
        if (isRedHood(character)) {
          const pierceButton = document.createElement("button");
          pierceButton.className = `slot-pierce-count${redHoodPierceCount > 0 ? " is-active" : ""}`;
          pierceButton.type = "button";
          pierceButton.dataset.pierceCount = String(redHoodPierceCount);
          pierceButton.setAttribute("aria-label", `${localize("设置", "Set")} ${getCharacterLocalizedName(character)} ${localize("穿透次数", "pierce count")}: ${redHoodPierceCount}`);
          pierceButton.title = `${localize("穿透次数", "Pierce count")} ${redHoodPierceCount}`;
          pierceButton.innerHTML = `
            <img class="slot-pierce-icon" src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" aria-hidden="true" />
            ${redHoodPierceCount > 0 ? `<span class="slot-pierce-value">${redHoodPierceCount}</span>` : ""}
          `;
          slot.append(pierceButton);
        }
        if (isScarlet(character)) {
          const counterButton = document.createElement("button");
          counterButton.className = `slot-counter-toggle${isScarletCounterEnabled ? " is-active" : ""}`;
          counterButton.type = "button";
          counterButton.setAttribute("aria-label", `${isScarletCounterEnabled ? localize("关闭", "Disable") : localize("开启", "Enable")} ${getCharacterLocalizedName(character)} ${localize("反击", "counter")}`);
          counterButton.title = `${localize("红莲反击", "Scarlet counter")}: ${isScarletCounterEnabled ? localize("开启", "On") : localize("关闭", "Off")}`;
          counterButton.innerHTML = '<img src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" aria-hidden="true" />';
          slot.append(counterButton);
        }
        if (isJackalOwner) {
          const linkButton = document.createElement("button");
          linkButton.className = `slot-link-toggle${isActiveLinkOwner ? " is-active" : ""}`;
          linkButton.type = "button";
          linkButton.setAttribute(
            "aria-label",
            `${isActiveLinkOwner ? localize("关闭", "Disable") : localize("开启", "Enable")}${isJackal(character) ? localize("豺狼链接", "Jackal link") : localize("波莉链接", "Poli link")}`,
          );
          linkButton.title = isJackal(character) ? localize("豺狼链接", "Jackal link") : localize("波莉链接", "Poli link");
          linkButton.innerHTML = '<img src="assets/immutable/icons/ui/link.4c6f6b125df1.svg" alt="" aria-hidden="true" />';
          slot.append(linkButton);
        }
        if (canSelectJackalTarget) {
          const linkTargetButton = document.createElement("button");
          linkTargetButton.className = `slot-link-target${isJackalTarget ? " is-selected" : ""}`;
          linkTargetButton.type = "button";
          linkTargetButton.setAttribute(
            "aria-label",
            `${isJackalTarget ? localize("取消", "Cancel") : localize("选择", "Select")}${linkOwnerName}${localize("目标", " target")} ${getCharacterLocalizedName(character)}`,
          );
          linkTargetButton.title = isJackalTarget ? localize("取消链接", "Cancel link") : localize("链接目标", "Link target");
          linkTargetButton.innerHTML = isJackalTarget ? '<img src="assets/immutable/icons/ui/link.4c6f6b125df1.svg" alt="" aria-hidden="true" />' : "<span>+</span>";
          slot.append(linkTargetButton);
        }
      }

      slot.addEventListener("click", (event) => {
        event.stopPropagation();
        if (isLockedRow) {
          showHelpCenterLockedDefenseToast();
          return;
        }
        if (event.target.closest(".universal-charge-field")) return;
        if (suppressTeamSlotClick) return;
        state.paidArenaActiveRowIndex = rowIndex;
        state.paidArenaDataTeamKey = dataTeamKey;
        saveTeam();
        render();
      });

      slot.addEventListener("dragstart", (event) => {
      if (isLockedRow) {
        event.preventDefault();
        return;
      }
      if (!character || isTeamSlotDragControl(event.target)) {
        event.preventDefault();
        return;
      }
      draggedTeamIndex = slotIndex;
      draggedTeamKey = "paidArena";
      draggedPaidArenaRowIndex = rowIndex;
      draggedPaidArenaTeamKey = dataTeamKey;
      isTeamSlotDragActive = true;
      slot.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", `paidArena:${dataTeamKey}:${rowIndex}:${slotIndex}`);
      event.dataTransfer.setData("application/x-nyk-team-slot-drag", "1");
      setTeamSlotDragImage(event, slot);
    });

    slot.addEventListener("dragend", () => {
      draggedTeamIndex = null;
      draggedTeamKey = null;
      draggedPaidArenaRowIndex = null;
      draggedPaidArenaTeamKey = null;
      isTeamSlotDragActive = false;
      els.teamSlots.querySelectorAll(".team-slot").forEach((teamSlot) => {
        teamSlot.classList.remove("is-dragging", "is-drop-target");
      });
    });

      slot.addEventListener("dragover", (event) => {
        if (isLockedRow) return;
        const isInternalDrag = isInternalTeamSlotDrag(event);
        if (isInternalDrag) {
          if (draggedTeamIndex === null) return;
          if (normalizeTeamKey(draggedPaidArenaTeamKey || dataTeamKey) !== dataTeamKey) return;
          if (draggedTeamKey === "paidArena" && draggedPaidArenaRowIndex === rowIndex && draggedTeamIndex === slotIndex) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          slot.classList.add("is-drop-target");
          return;
        }
        if (isTransferWithFiles(event)) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          slot.classList.add("is-drop-target");
          return;
        }
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("is-drop-target");
      });

      slot.addEventListener("drop", (event) => {
        if (isLockedRow) return;
        if (isPaidArenaRowDrag(event)) return;
        event.preventDefault();
        slot.classList.remove("is-drop-target");
        if (isInternalTeamSlotDrag(event)) {
          const source = parsePaidArenaDragPayload(event, dataTeamKey, draggedPaidArenaRowIndex, draggedTeamIndex);
          if (source.teamKey !== dataTeamKey) {
            showToast(localize("ROUND显示下请在同一侧队伍内拖动", "In Round view, drag within the same side only"));
            return;
          }
          state.paidArenaDataTeamKey = dataTeamKey;
          movePaidArenaSlot(source.rowIndex, source.slotIndex, rowIndex, slotIndex);
          return;
        }
        const files = getTransferFiles(event);
        if (isTransferWithFiles(event)) {
          const targetRow = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          handlePaidArenaOcrFill(state.paidArenaMode, targetRow, slotIndex, files).catch(() => {
            showToast(localize("OCR识别失败，请重试", "OCR failed. Please try again."));
          });
          return;
        }

        const source = parsePaidArenaDragPayload(event, dataTeamKey, draggedPaidArenaRowIndex, draggedTeamIndex);
        if (source.teamKey !== dataTeamKey) return;
        state.paidArenaDataTeamKey = dataTeamKey;
        movePaidArenaSlot(source.rowIndex, source.slotIndex, rowIndex, slotIndex);
      });

      slot.addEventListener("pointerdown", (event) =>
        isLockedRow ? event.preventDefault() : handleTeamSlotPointerDown(event, slot, character, "paidArena", slotIndex, { paidArena: true, rowIndex, paidArenaTeamKey: dataTeamKey }),
      );
      slot.addEventListener("pointermove", handleTeamSlotPointerMove);
      slot.addEventListener("pointerup", finishPointerTeamDrag);
      slot.addEventListener("pointercancel", finishPointerTeamDrag);

      if (character) {
        slot.querySelector(".slot-remove").addEventListener("click", (event) => {
          event.stopPropagation();
          if (isLockedRow) {
            event.preventDefault();
            showHelpCenterLockedDefenseToast();
            return;
          }
          if (suppressTeamSlotClick) {
            event.preventDefault();
            return;
          }
          state.paidArenaDataTeamKey = dataTeamKey;
          removePaidArenaCharacter(rowIndex, slotIndex);
        });
        slot.querySelector(".slot-settings-toggle")?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (isLockedRow) {
            showHelpCenterLockedDefenseToast();
            return;
          }
          state.paidArenaActiveRowIndex = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          openSlotSettings = isSettingsOpen
            ? null
            : {
                paidArenaMode: state.paidArenaMode,
                teamKey: dataTeamKey,
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
          if (isLockedRow) {
            showHelpCenterLockedDefenseToast();
            return;
          }
          state.paidArenaActiveRowIndex = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          togglePaidArenaRosannaSacrificeSettings(state.paidArenaMode, rowIndex, slotIndex);
          saveTeam();
          render();
        });
        slot.querySelector(".slot-sacrifice-toggle")?.addEventListener("pointerdown", (event) => event.stopPropagation());
        slot.querySelector(".slot-sacrifice-toggle")?.addEventListener("dragstart", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        slot.querySelector(".slot-pierce-count")?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (isLockedRow) {
            showHelpCenterLockedDefenseToast();
            return;
          }
          state.paidArenaActiveRowIndex = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          togglePaidArenaRedHoodPierceCount(rowIndex, slotIndex, character, dataTeamKey);
        });
        slot.querySelector(".slot-pierce-count")?.addEventListener("pointerdown", (event) => event.stopPropagation());
        slot.querySelector(".slot-pierce-count")?.addEventListener("dragstart", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        slot.querySelector(".slot-counter-toggle")?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (isLockedRow) {
            showHelpCenterLockedDefenseToast();
            return;
          }
          state.paidArenaActiveRowIndex = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          togglePaidArenaScarletCounter(rowIndex, slotIndex, dataTeamKey);
        });
        slot.querySelector(".slot-counter-toggle")?.addEventListener("pointerdown", (event) => event.stopPropagation());
        slot.querySelector(".slot-counter-toggle")?.addEventListener("dragstart", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        slot.querySelector(".slot-link-toggle")?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (isLockedRow) {
            showHelpCenterLockedDefenseToast();
            return;
          }
          state.paidArenaActiveRowIndex = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          togglePaidArenaJackalLink(rowIndex, character, dataTeamKey);
        });
        slot.querySelector(".slot-link-toggle")?.addEventListener("pointerdown", (event) => event.stopPropagation());
        slot.querySelector(".slot-link-toggle")?.addEventListener("dragstart", (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        slot.querySelector(".slot-link-target")?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (isLockedRow) {
            showHelpCenterLockedDefenseToast();
            return;
          }
          state.paidArenaActiveRowIndex = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          togglePaidArenaJackalLinkTarget(rowIndex, character, dataTeamKey);
        });
        slot.querySelector(".slot-link-target")?.addEventListener("pointerdown", (event) => event.stopPropagation());
        slot.querySelector(".slot-link-target")?.addEventListener("dragstart", (event) => {
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
          if (isLockedRow) return;
          state.paidArenaActiveRowIndex = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          universalCharges[slotIndex] = sanitizeUniversalCharge(event.target.value);
          slot.classList.toggle("has-universal", universalCharges[slotIndex] > 0);
          updatePaidArenaResultBar(
            getPaidArenaResultText(
              team,
              universalCharges,
              chargeSpeeds,
              null,
              sacrificeFrames,
              redHoodPierceCounts,
              scarletCounterEnabled,
              jackalLinkState,
              dataTeamKey,
            ),
          );
        });
        universalInput.addEventListener("keydown", (event) => {
          event.stopPropagation();
          if (event.key !== "Enter") return;
          event.preventDefault();
          event.target.blur();
        });
        universalInput.addEventListener("blur", (event) => {
          const value = sanitizeUniversalCharge(event.target.value);
          state.paidArenaActiveRowIndex = rowIndex;
          state.paidArenaDataTeamKey = dataTeamKey;
          universalCharges[slotIndex] = value;
          event.target.value = value || "";
          slot.classList.toggle("has-universal", value > 0);
          updatePaidArenaResultBar(
            getPaidArenaResultText(
              team,
              universalCharges,
              chargeSpeeds,
              null,
              sacrificeFrames,
              redHoodPierceCounts,
              scarletCounterEnabled,
              jackalLinkState,
              dataTeamKey,
            ),
          );
          saveTeam();
        });
      }
      slotsRow.append(slot);
    });

    const resultBar = row.querySelector(".paid-arena-result-bar");
    const updatePaidArenaResultBar = (text) => {
      resultBar.innerHTML = `
        <span class="paid-arena-row-drag-hint" draggable="true">${escapeHtml(localize("拖动此处交换队伍", "Drag here to swap teams"))}</span>
        <span class="paid-arena-result-text">${escapeHtml(text)}</span>
      `;
    };
    const resultText = getPaidArenaResultText(
      team,
      universalCharges,
      chargeSpeeds,
      result,
      sacrificeFrames,
      redHoodPierceCounts,
      scarletCounterEnabled,
      jackalLinkState,
      dataTeamKey,
    );
    resultBar.dataset.paidArenaRowIndex = String(rowIndex);
    resultBar.dataset.paidArenaTeamKey = dataTeamKey;
    updatePaidArenaResultBar(resultText);
    const rowDragHandle = resultBar.querySelector(".paid-arena-row-drag-hint");
    rowDragHandle.dataset.paidArenaRowIndex = String(rowIndex);
    rowDragHandle.dataset.paidArenaTeamKey = dataTeamKey;
    resultBar.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isLockedRow) {
        showHelpCenterLockedDefenseToast();
        return;
      }
      if (event.target.closest(".paid-arena-row-drag-hint")) return;
      if (suppressTeamSlotClick) return;
      state.paidArenaActiveRowIndex = rowIndex;
      state.paidArenaDataTeamKey = dataTeamKey;
      saveTeam();
      render();
    });
    resultBar.addEventListener("dragstart", (event) => {
      if (isLockedRow) {
        event.preventDefault();
        return;
      }
      if (!event.target.closest(".paid-arena-row-drag-hint")) {
        event.preventDefault();
        return;
      }
      event.stopPropagation();
      resultBar.classList.add("is-dragging");
      row.classList.add("is-row-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", `paidArenaRow:${state.paidArenaMode}:${dataTeamKey}:${rowIndex}`);
      event.dataTransfer.setData("application/x-nyk-paid-arena-row-drag", "1");
      setTeamSlotDragImage(event, row);
    });
    resultBar.addEventListener("dragend", () => {
      els.teamSlots.querySelectorAll(".paid-arena-result-bar, .paid-arena-row").forEach((element) => {
        element.classList.remove("is-dragging", "is-drop-target", "is-row-drop-target");
      });
    });
    const handlePaidArenaRowDragOver = (event) => {
      if (isLockedRow) return;
      if (!isPaidArenaRowDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      resultBar.classList.add("is-drop-target");
      row.classList.add("is-row-drop-target");
    };
    const clearPaidArenaRowDropTarget = () => {
      resultBar.classList.remove("is-drop-target");
      row.classList.remove("is-row-drop-target");
    };
    const handlePaidArenaRowDrop = (event) => {
      const payload = parsePaidArenaRowDragPayload(event);
      if (!payload) return;
      event.preventDefault();
      event.stopPropagation();
      clearPaidArenaRowDropTarget();
      if (payload.mode !== state.paidArenaMode) return;
      if (isHelpCenterLockedDefenseSide(payload.teamKey) || isLockedRow) {
        showHelpCenterLockedDefenseToast();
        return;
      }
      swapPaidArenaRows(state.paidArenaMode, payload.teamKey, payload.rowIndex, dataTeamKey, rowIndex);
    };
    row.addEventListener("dragover", handlePaidArenaRowDragOver);
    row.addEventListener("dragleave", (event) => {
      if (row.contains(event.relatedTarget)) return;
      clearPaidArenaRowDropTarget();
    });
    row.addEventListener("drop", handlePaidArenaRowDrop);
    resultBar.addEventListener("dragover", handlePaidArenaRowDragOver);
    resultBar.addEventListener("dragleave", clearPaidArenaRowDropTarget);
    resultBar.addEventListener("drop", handlePaidArenaRowDrop);
    resultBar.addEventListener("pointerdown", (event) => {
      if (isLockedRow) return;
      handlePaidArenaResultPointerDown(event, row, resultBar, dataTeamKey, rowIndex);
    });
    resultBar.addEventListener("pointermove", handlePaidArenaResultPointerMove);
    resultBar.addEventListener("pointerup", finishPointerPaidArenaRowDrag);
    resultBar.addEventListener("pointercancel", finishPointerPaidArenaRowDrag);

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
    const isLockedRow = isHelpCenterLockedDefenseSide(teamKey);
    const row = document.createElement("section");
    row.className = `team-row${state.activeTeamKey === teamKey ? " is-active" : ""}${isLockedRow ? " is-help-solve-locked" : ""}`;
    row.dataset.teamKey = teamKey;
    row.setAttribute("aria-label", getTeamLabel(teamKey));
    row.innerHTML = '<div class="team-slots-row"></div>';
    row.addEventListener("click", () => {
      if (isLockedRow) {
        showHelpCenterLockedDefenseToast();
        return;
      }
      const wasActive = state.activeTeamKey === teamKey;
      setActiveTeam(teamKey);
      if (!wasActive) render();
    });

    const slotsRow = row.querySelector(".team-slots-row");
    const jackalLinkState = normalizeJackalLink(teamKey);
    const isJackalConnecting = isJackalLinkEnabled(teamKey);
    const isAutoFullTeamLink = Boolean(getAutoFullTeamLinkOwner(team));
    const jackalTargetIds = new Set(getJackalLinkTargetIds(teamKey));
    const linkOwner = getTeamLinkProvider(teamKey);
    const linkOwnerName = linkOwner
      ? isJackal(linkOwner)
        ? localize("豺狼链接", "Jackal link")
        : localize("波莉链接", "Poli link")
      : localize("链接", "Link");
    const tauntTargetPositionIndex =
      getTauntTargetState(teamKey === "defense" ? state.defenseTeam : state.team, teamKey, chargeSpeeds)?.positionIndex ?? null;
    team.forEach((character, index) => {
      const teamResult = resultsByTeam.get(teamKey);
      const finishingPositions = new Set(teamResult && !teamResult.error ? teamResult.finishingPositionIndices : []);
      const isFinisher = finishingPositions.has(index) && canShowFinishMarker(character);
      const isSettingsOpen = character && isSlotSettingsOpen(teamKey, index);
      const chargeSpeedValue = sanitizeChargeSpeed(getArcaChargeParameters(character, teamKey)?.chargeSpeed ?? chargeSpeeds[index]);
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
      const cubeIconSrc = character ? getCubeIconSrc(getArcaChargeParameters(character, teamKey)?.displayCubeType ?? getArcaChargeParameters(character, teamKey)?.cubeType ?? getSavedCharacterCubeType(character, teamKey)) : "";
      const isJackalOwner = character && isLinkProvider(character) && (!isAutoFullTeamLink || linkOwner?.id === character.id);
      const isActiveLinkOwner = character && isJackalConnecting && linkOwner?.id === character.id;
      const isJackalTarget = character && jackalTargetIds.has(character.id);
      const canSelectJackalTarget =
        character && character.id !== linkOwner?.id && isJackalConnecting && (isJackalTarget || jackalTargetIds.size < 2);
      const slot = document.createElement("div");
      slot.className = `team-slot${character ? " filled" : ""}${getTeamSlotRarityClass(character)}${!character && universalChargeValue > 0 ? " has-universal" : ""}${isFinisher ? " is-finisher" : ""}`;
      slot.dataset.slotIndex = index;
      slot.dataset.teamKey = teamKey;
      slot.draggable = Boolean(character) && !isLockedRow;
      slot.innerHTML = character
        ? `
          <button class="slot-remove" type="button" aria-label="${escapeHtml(localize("移除", "Remove"))} ${escapeHtml(getCharacterLocalizedName(character))}">
            <span class="team-avatar">${getAvatarMarkup(character)}</span>
            <span class="slot-copy" aria-hidden="true">
              ${isTauntTarget ? `<span class="taunt-mark">${escapeHtml(localize("嘲", "T"))}</span>` : ""}
              ${isSacrificedTarget ? getSacrificeMarkMarkup(sacrificeFrame) : ""}
              ${isFinisher ? `<span class="finish-mark">${escapeHtml(localize("定", "F"))}</span>` : ""}
              ${cubeIconSrc ? `<span class="slot-cube-badge"><img src="${cubeIconSrc}" alt="" /></span>` : ""}
              ${sideBadgeText ? `<span class="slot-speed-badge">${sideBadgeText}</span>` : ""}
            </span>
          </button>
          <button class="slot-settings-toggle${isSettingsOpen ? " is-open" : ""}" type="button" aria-label="${escapeHtml(localize("设置", "Settings"))} ${escapeHtml(getCharacterLocalizedName(character))}" title="${escapeHtml(localize("设置", "Settings"))}">
            <img src="assets/immutable/icons/ui/settings.46ca2edb23d9.svg" alt="" aria-hidden="true" />
          </button>
          ${
            isRedHood(character)
              ? `
                <button class="slot-pierce-count${redHoodPierceCount > 0 ? " is-active" : ""}" type="button" data-pierce-count="${redHoodPierceCount}" aria-label="${escapeHtml(localize("设置", "Set"))} ${escapeHtml(getCharacterLocalizedName(character))} ${escapeHtml(localize("穿透次数", "pierce count"))}: ${redHoodPierceCount}" title="${escapeHtml(localize("穿透次数", "Pierce count"))} ${redHoodPierceCount}">
                  <img class="slot-pierce-icon" src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" aria-hidden="true" />
                  ${redHoodPierceCount > 0 ? `<span class="slot-pierce-value">${redHoodPierceCount}</span>` : ""}
                </button>
              `
              : ""
          }
          ${
            isScarlet(character)
              ? `
                <button class="slot-counter-toggle${isScarletCounterEnabled ? " is-active" : ""}" type="button" aria-label="${escapeHtml(isScarletCounterEnabled ? localize("关闭", "Disable") : localize("开启", "Enable"))} ${escapeHtml(getCharacterLocalizedName(character))} ${escapeHtml(localize("反击", "counter"))}" title="${escapeHtml(localize("红莲反击", "Scarlet counter"))}: ${escapeHtml(isScarletCounterEnabled ? localize("开启", "On") : localize("关闭", "Off"))}">
                  <img src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" aria-hidden="true" />
                </button>
              `
              : ""
          }
          ${
            isRosanna(character)
              ? `
                <button class="slot-sacrifice-toggle${isRosannaSacrificeSettingsOpen(teamKey, index) || hasSacrificeTarget ? " is-active" : ""}" type="button" aria-label="${escapeHtml(localize("设置", "Set"))} ${escapeHtml(getCharacterLocalizedName(character))} ${escapeHtml(localize("献祭", "sacrifice"))}" title="${escapeHtml(localize("罗珊娜献祭", "Rosanna sacrifice"))}">
                  <img src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" aria-hidden="true" />
                </button>
              `
              : ""
          }
          ${
            isJackalOwner
              ? `
                <button class="slot-link-toggle${isActiveLinkOwner ? " is-active" : ""}" type="button" aria-label="${escapeHtml(isActiveLinkOwner ? localize("关闭", "Disable") : localize("开启", "Enable"))}${escapeHtml(isJackal(character) ? localize("豺狼链接", "Jackal link") : localize("波莉链接", "Poli link"))}" title="${escapeHtml(isJackal(character) ? localize("豺狼链接", "Jackal link") : localize("波莉链接", "Poli link"))}">
                  <img src="assets/immutable/icons/ui/link.4c6f6b125df1.svg" alt="" aria-hidden="true" />
                </button>
              `
              : ""
          }
          ${
            canSelectJackalTarget
              ? `
                <button class="slot-link-target${isJackalTarget ? " is-selected" : ""}" type="button" aria-label="${escapeHtml(isJackalTarget ? localize("取消", "Cancel") : localize("选择", "Select"))}${escapeHtml(linkOwnerName)}${escapeHtml(localize("目标", " target"))} ${escapeHtml(getCharacterLocalizedName(character))}" title="${escapeHtml(isJackalTarget ? localize("取消链接", "Cancel link") : localize("链接目标", "Link target"))}">
                  ${isJackalTarget ? '<img src="assets/immutable/icons/ui/link.4c6f6b125df1.svg" alt="" aria-hidden="true" />' : '<span>+</span>'}
                </button>
              `
              : ""
          }
        `
        : `
          <div class="slot-empty">
            <span class="position">P${index + 1}</span>
            <label class="universal-charge-field" aria-label="P${index + 1} ${escapeHtml(localize("充能值", "charge value"))}">
              <span class="universal-charge-label">${escapeHtml(localize("充", "C"))}</span>
              <input
                type="text"
                inputmode="decimal"
                name="universal-${teamKey}-${index}"
                id="universal-${teamKey}-${index}"
                value="${universalChargeValue || ""}"
                placeholder="0"
                data-universal-index="${index}"
              />
            </label>
          </div>
        `;

      slot.addEventListener("click", () => {
        if (isLockedRow) {
          showHelpCenterLockedDefenseToast();
          return;
        }
        if (state.activeTeamKey !== teamKey) {
          setActiveTeam(teamKey);
          render();
        }
      });

      slot.addEventListener("dragstart", (event) => {
        if (isLockedRow) {
          event.preventDefault();
          return;
        }
        if (!character || isTeamSlotDragControl(event.target)) {
          event.preventDefault();
          return;
        }
      draggedTeamIndex = index;
      draggedTeamKey = teamKey;
      isTeamSlotDragActive = true;
      slot.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", `${teamKey}:${index}`);
      event.dataTransfer.setData("application/x-nyk-team-slot-drag", "1");
      setTeamSlotDragImage(event, slot);
    });

      slot.addEventListener("dragend", () => {
        draggedTeamIndex = null;
        draggedTeamKey = null;
        isTeamSlotDragActive = false;
        els.teamSlots.querySelectorAll(".team-slot").forEach((teamSlot) => {
          teamSlot.classList.remove("is-dragging", "is-drop-target");
        });
      });

      slot.addEventListener("dragover", (event) => {
        if (isLockedRow) return;
        const isInternalDrag = isInternalTeamSlotDrag(event);
        if (isInternalDrag) {
          if (draggedTeamIndex === null || (draggedTeamKey === teamKey && draggedTeamIndex === index)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          slot.classList.add("is-drop-target");
          return;
        }
        if (isTransferWithFiles(event)) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          slot.classList.add("is-drop-target");
          return;
        }
      });

      slot.addEventListener("dragleave", () => {
        slot.classList.remove("is-drop-target");
      });

      slot.addEventListener("drop", (event) => {
        if (isLockedRow) return;
        event.preventDefault();
        slot.classList.remove("is-drop-target");
        if (isInternalTeamSlotDrag(event)) {
          const [sourceTeamKey, sourceIndexText] = String(
            event.dataTransfer.getData("text/plain") || `${draggedTeamKey}:${draggedTeamIndex}`,
          ).split(":");
          if (sourceTeamKey && sourceIndexText) {
            moveTeamSlot(sourceTeamKey, Number(sourceIndexText), teamKey, index);
          }
          return;
        }
        const files = getTransferFiles(event);
        if (isTransferWithFiles(event)) {
          handleOcrFill(teamKey, index, files).catch(() => {
            showToast(localize("OCR识别失败，请重试", "OCR failed. Please try again."));
          });
          return;
        }
        const [sourceTeamKey, sourceIndexText] = String(event.dataTransfer.getData("text/plain") || `${draggedTeamKey}:${draggedTeamIndex}`).split(":");
        moveTeamSlot(sourceTeamKey, Number(sourceIndexText), teamKey, index);
      });

      slot.addEventListener("pointerdown", (event) => {
        if (isLockedRow) {
          event.preventDefault();
          return;
        }
        handleTeamSlotPointerDown(event, slot, character, teamKey, index);
      });
      slot.addEventListener("pointermove", handleTeamSlotPointerMove);
      slot.addEventListener("pointerup", finishPointerTeamDrag);
      slot.addEventListener("pointercancel", finishPointerTeamDrag);

      if (character) {
        slot.querySelector(".slot-remove").addEventListener("click", (event) => {
          event.stopPropagation();
          if (isLockedRow) {
            event.preventDefault();
            showHelpCenterLockedDefenseToast();
            return;
          }
          if (suppressTeamSlotClick) {
            event.preventDefault();
            return;
          }
          setActiveTeam(teamKey);
          removeCharacter(teamKey, index);
        });
        const settingsToggle = slot.querySelector(".slot-settings-toggle");
        settingsToggle.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (isLockedRow) {
            showHelpCenterLockedDefenseToast();
            return;
          }
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
            if (isLockedRow) {
              showHelpCenterLockedDefenseToast();
              return;
            }
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
            if (isLockedRow) {
              showHelpCenterLockedDefenseToast();
              return;
            }
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
            if (isLockedRow) {
              showHelpCenterLockedDefenseToast();
              return;
            }
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
            if (isLockedRow) {
              showHelpCenterLockedDefenseToast();
              return;
            }
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
            if (isLockedRow) {
              showHelpCenterLockedDefenseToast();
              return;
            }
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
          if (isLockedRow) return;
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

function getChartGroupLabel(label) {
  const labels = {
    红莲反击: localize("红莲反击", "Scarlet counter"),
    豺狼链接: localize("豺狼链接", "Jackal link"),
    万能充能: localize("万能充能", "Universal charge"),
    罗珊娜献祭: localize("罗珊娜献祭", "Rosanna sacrifice"),
    总充能: localize("总充能", "Total charge"),
  };
  return labels[label] || label;
}

function getLocalizedContributionLabel(label) {
  const text = String(label || "");
  if (!text) return "";
  const hitMatch = text.match(/^(?:命中|Hit)[：:]\s*([\d.]+)\s*hit/i);
  if (hitMatch) return `${localize("命中", "Hit")}: ${hitMatch[1]} hit`;
  if (text.includes("+")) {
    return text
      .split("+")
      .map((part) => getLocalizedContributionLabel(part.trim()))
      .filter(Boolean)
      .join(" + ");
  }
  const simpleLabels = {
    命中: localize("命中", "Hit"),
    hit: localize("命中", "Hit"),
    爆炸命中: localize("爆炸命中", "Explosion hit"),
    "命中+穿透": localize("命中+穿透", "Hit + pierce"),
    "命中+额外伤害": localize("命中+额外伤害", "Hit + extra damage"),
    额外伤害: localize("额外伤害", "Extra damage"),
    额外效果: localize("额外效果", "Extra effect"),
    额外触发: localize("额外触发", "Extra trigger"),
    中毒充能: localize("中毒充能", "Poison charge"),
    延迟额外: localize("延迟额外", "Delayed extra"),
    万能充能: localize("万能充能", "Universal charge"),
    红莲反击: localize("红莲反击", "Scarlet counter"),
    豺狼链接: localize("豺狼链接", "Jackal link"),
    罗珊娜献祭: localize("罗珊娜献祭", "Rosanna sacrifice"),
    剩余累计: localize("剩余累计", "Remaining accumulated"),
  };
  if (simpleLabels[text]) return simpleLabels[text];
  if (text.includes("额外触发")) return text.replace("额外触发", localize("额外触发", "Extra trigger"));
  if (text.includes("中毒充能")) return text.replace("中毒充能", localize("中毒充能", "Poison charge"));
  if (text.includes("万能充能")) return text.replace("万能充能", localize("万能充能", "Universal charge"));
  if (text.includes("罗珊娜献祭")) return text.replace("罗珊娜献祭", localize("罗珊娜献祭", "Rosanna sacrifice"));
  return getChartGroupLabel(text);
}

function formatContributionSourceLabels(labels = []) {
  const normalizedLabels = labels
    .map(getLocalizedContributionLabel)
    .filter(Boolean);
  return [...new Set(normalizedLabels)].join(" + ");
}

function getContributionLabelHitCount(labels = []) {
  const hitLabel = labels.find((label) => String(label).startsWith("命中：") || String(label).startsWith("Hit:"));
  const match = String(hitLabel || "").match(/(?:命中：|Hit:)\s*([\d.]+)\s*hit/i);
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
  return targets.length ? `${localize("命中目标", "Hit targets")}: ${targets.join(", ")}` : null;
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

function isFrameInReloadDodgeWindow(positionIndex, frame, reloadTimeline = []) {
  if (!state.allowMissedShots) return false;
  return reloadTimeline.some((reload) => {
    if (reload.positionIndex !== positionIndex) return false;
    return reload.startFrame < frame && frame < reload.endFrame;
  });
}

function getStunWindowsForTeam(teamKey = "attack", targetReloadTimeline = []) {
  const opponentTeam = normalizeTeamKey(teamKey) === "attack" ? state.defenseTeam : state.team;
  if (!teamHasLittleMermaid(opponentTeam)) return [];
  if (isFrameInReloadDodgeWindow(LITTLE_MERMAID_STUN_TARGET_INDEX, LITTLE_MERMAID_STUN_FRAME, targetReloadTimeline)) return [];
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
  const resultTeam = result.members.map((member) => member.character);
  const linkOwner = getEffectiveLinkOwnerForTeam(resultTeam, linkState);
  if (!linkOwner || !isEffectiveLinkEnabledForTeam(resultTeam, linkState)) return [];
  if (Array.isArray(linkState.fixedLinkedPositionIndices)) {
    return [...new Set(linkState.fixedLinkedPositionIndices)]
      .map((index) => Number(index))
      .filter((index) => Number.isInteger(index) && index >= 0 && index < TEAM_SIZE && result.members.some((member) => member.positionIndex === index))
      .sort((a, b) => a - b);
  }
  const targetIds = new Set(getEffectiveLinkTargetIdsForTeam(resultTeam, linkState));
  const linkedPositions = result.members
    .filter((member) => member.character.id === linkOwner.id || targetIds.has(member.character.id))
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

function getPositionHitSources(entry, targetPositionIndices) {
  const targetPositions = new Set(targetPositionIndices);
  if (targetPositions.size === 0) return [];
  return entry.contributions
    .map((contribution) => {
      if (!Array.isArray(contribution.positionHits)) return null;
      const hits = contribution.positionHits
        .filter((positionHit) => targetPositions.has(positionHit.positionIndex) && Number(positionHit.hitCount) > 0)
        .sort((a, b) => a.positionIndex - b.positionIndex);
      const hitCount = hits.reduce((sum, positionHit) => sum + Number(positionHit.hitCount), 0);
      if (hitCount <= 0) return null;
      return {
        frame: entry.frame,
        attackerPositionIndex: contribution.positionIndex,
        characterId: contribution.characterId,
        characterName: getLocalizedContributionCharacterName(contribution),
        hits,
        hitCount,
      };
    })
    .filter(Boolean);
}

function formatJackalHitSources(sources = []) {
  const groupedSources = new Map();
  sources
    .filter((source) => source && Number(source.hitCount) > 0)
    .forEach((source) => {
      const key = source.attackerPositionIndex < 0 ? "previous" : `${source.frame}`;
      groupedSources.set(key, [...(groupedSources.get(key) || []), source]);
    });
  return [...groupedSources.entries()]
    .flatMap(([key, frameSources]) => {
      if (key === "previous") {
        const total = frameSources.reduce((sum, source) => sum + Number(source.hitCount), 0);
        return [`${localize("前序累计", "Previous accumulated")}: ${formatNumber(total, 2)} hit`];
      }
      return frameSources.map((source) => {
        const hitTargets = source.hits
          .map((hit) => `P${hit.positionIndex + 1} ${formatNumber(Number(hit.hitCount), 2)} hit`)
          .join(", ");
        return `${key}F: ${localize("敌方", "Enemy")} P${source.attackerPositionIndex + 1} ${getLocalizedContributionCharacterName(source)} -> ${hitTargets}`;
      });
    })
    .filter(Boolean);
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

function getScarletCounterTriggerSources(result, member, entry, opponentResult = null) {
  const linkedPositionIndices = getJackalLinkedPositionIndices(result);
  if (linkedPositionIndices.includes(member.positionIndex) && !isLinkSuppressedByRosanna(opponentResult, entry.frame)) {
    return getPositionHitSources(entry, linkedPositionIndices);
  }
  return getPositionHitSources(entry, [member.positionIndex]);
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
            const triggerSources = getScarletCounterTriggerSources(item.result, member, entry, opponentResult);
            const charge = chargePerCounter * triggerCount;
            if (charge <= BURST_EPSILON) return null;
            cumulativeCharge += charge;
            return {
              frame: entry.frame,
              triggerCount,
              triggerSources,
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

function getScarletCounterHitEntriesForTarget(targetResult, opponentResult, targetTimeline = null) {
  if (!targetResult || targetResult.error || !opponentResult || opponentResult.error) return [];
  const timeline = targetTimeline || targetResult.timeline || [];
  if (!timeline.length) return [];
  const entriesByFrame = new Map();

  opponentResult.members
    .filter((member) => isScarlet(member.character) && member.character.scarletCounterEnabled !== false)
    .forEach((member) => {
      timeline.forEach((entry) => {
        const triggerSources = getScarletCounterTriggerSources(opponentResult, member, entry, targetResult);
        triggerSources.forEach((source) => {
          const targetPositionIndex = Number(source.attackerPositionIndex);
          const hitCount = (Number(source.hitCount) || 0) * SCARLET_COUNTER_PROBABILITY;
          if (!Number.isInteger(targetPositionIndex) || targetPositionIndex < 0 || targetPositionIndex >= TEAM_SIZE || hitCount <= BURST_EPSILON) return;
          if (!entriesByFrame.has(entry.frame)) {
            entriesByFrame.set(entry.frame, {
              frame: entry.frame,
              contributionsByKey: new Map(),
            });
          }
          const frameEntry = entriesByFrame.get(entry.frame);
          const contributionKey = `${member.positionIndex}:${member.character.id}`;
          if (!frameEntry.contributionsByKey.has(contributionKey)) {
            frameEntry.contributionsByKey.set(contributionKey, {
              positionIndex: member.positionIndex,
              characterId: member.character.id,
              characterName: member.character.name,
              labels: ["红莲反击"],
              positionHitsByIndex: new Map(),
              targetHits: [],
              counterHits: 0,
              showOnMember: false,
            });
          }
          const contribution = frameEntry.contributionsByKey.get(contributionKey);
          contribution.positionHitsByIndex.set(
            targetPositionIndex,
            (contribution.positionHitsByIndex.get(targetPositionIndex) || 0) + hitCount,
          );
          contribution.counterHits += hitCount;
        });
      });
    });

  return [...entriesByFrame.values()]
    .map((entry) => ({
      frame: entry.frame,
      contributions: [...entry.contributionsByKey.values()].map((contribution) => ({
        positionIndex: contribution.positionIndex,
        characterId: contribution.characterId,
        characterName: contribution.characterName,
        labels: contribution.labels,
        positionHits: [...contribution.positionHitsByIndex.entries()].map(([positionIndex, hitCount]) => ({ positionIndex, hitCount })),
        targetHits: contribution.targetHits,
        counterHits: contribution.counterHits,
        showOnMember: contribution.showOnMember,
      })),
    }))
    .sort((a, b) => a.frame - b.frame);
}

function getJackalLinkGroups(chartResults, visibleTimelineByTeam) {
  return chartResults.flatMap((item) => {
    const opponentTeamKey = item.teamKey === "defense" ? "attack" : "defense";
    const opponentResult = chartResults.find((resultItem) => resultItem.teamKey === opponentTeamKey)?.result || null;
    const opponentTimeline = [
      ...(visibleTimelineByTeam.get(opponentTeamKey) || []),
      ...getScarletCounterHitEntriesForTarget(item.result, opponentResult, visibleTimelineByTeam.get(item.teamKey) || []),
    ].sort((a, b) => a.frame - b.frame);
    const linkOwner = getTeamLinkProvider(item.teamKey);
    const linkedPositionIndices = getJackalLinkedPositionIndices(item.result);
    if (!isJackal(linkOwner) || linkedPositionIndices.length === 0 || opponentTimeline.length === 0) return [];

    return item.result.members
      .filter((member) => member.character.id === linkOwner.id)
      .map((member) => {
        const chargePerLink = getBaseChargeUnit(member.character);
        let accumulatedHits = 0;
        let triggeredLinks = 0;
        let pendingTriggerHits = 0;
        let pendingTriggerSources = [];
        let pendingTriggerStartFrame = null;
        let previousSuppressedByRosanna = false;
        let cumulativeCharge = 0;
        const timeline = opponentTimeline
          .map((entry) => {
            const suppressedByRosanna = isLinkSuppressedByRosanna(
              opponentResult,
              entry.frame,
            );
            if (suppressedByRosanna && !previousSuppressedByRosanna) {
              accumulatedHits = 0;
              triggeredLinks = 0;
              pendingTriggerHits = 0;
              pendingTriggerSources = [];
              pendingTriggerStartFrame = null;
            }
            previousSuppressedByRosanna = suppressedByRosanna;
            const hitCount = suppressedByRosanna
              ? getPositionHitCount(entry, member.positionIndex)
              : getJackalLinkedHitCount(entry, linkedPositionIndices);
            const hitSources = suppressedByRosanna
              ? getPositionHitSources(entry, [member.positionIndex])
              : getPositionHitSources(entry, linkedPositionIndices);
            if (hitCount > 0 && pendingTriggerStartFrame === null) pendingTriggerStartFrame = entry.frame;
            accumulatedHits += hitCount;
            pendingTriggerHits += hitCount;
            pendingTriggerSources.push(...hitSources);
            const nextTriggeredLinks = Math.floor(accumulatedHits / JACKAL_LINK_HIT_THRESHOLD);
            const triggerCount = nextTriggeredLinks - triggeredLinks;
            if (triggerCount <= 0) return null;
            const stageStartFrame = pendingTriggerStartFrame ?? entry.frame;
            const stageEndFrame = entry.frame;
            const triggerHitCount = pendingTriggerHits;
            const triggerSources = [...pendingTriggerSources];
            triggeredLinks = nextTriggeredLinks;
            const remainingHits = accumulatedHits - triggeredLinks * JACKAL_LINK_HIT_THRESHOLD;
            pendingTriggerHits = remainingHits;
            pendingTriggerSources =
              remainingHits > 0
                ? [{ hitCount: remainingHits, characterName: localize("剩余累计", "Remaining accumulated"), attackerPositionIndex: -1, hits: [] }]
                : [];
            pendingTriggerStartFrame = remainingHits > 0 ? entry.frame : null;
            const charge = chargePerLink * triggerCount;
            const frame = entry.frame + JACKAL_LINK_CHARGE_DELAY_FRAMES;
            cumulativeCharge += charge;
            return {
              frame,
              stageStartFrame,
              stageEndFrame,
              hitCount,
              accumulatedHits,
              triggerHitCount,
              triggerSources,
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
  const groupLabel = getChartGroupLabel(group.label);
  if (group.type === "jackalLink") {
    const sourceLines = formatJackalHitSources(entry.triggerSources || []);
    return [
      groupLabel,
      `${localize("阶段", "Stage")}: ${entry.stageStartFrame ?? entry.frame}F-${entry.stageEndFrame ?? entry.frame}F`,
      `${localize("触发帧", "Trigger frame")}: ${entry.frame} F`,
      `${localize("本次触发", "This trigger")}: ${formatNumber(entry.triggerHitCount || entry.hitCount, 2)} hit`,
      ...(sourceLines.length ? [`${localize("触发来源", "Trigger sources")}:`, ...sourceLines] : []),
      `${localize("受击累计", "Accumulated hits")}: ${entry.accumulatedHits} hit`,
      `${localize("连接触发", "Link trigger")}: ${entry.triggerCount} × ${formatChargeNumber(group.chargePerLink)}% = ${formatChargeNumber(entry.charge)}%`,
      `${localize("累计充能", "Cumulative")}: ${formatChargeNumber(entry.cumulativeCharge)}%`,
    ];
  }

  const sourceLines = group.type === "scarletCounter" ? formatJackalHitSources(entry.triggerSources || []) : [];
  return [
    groupLabel,
    `${localize("时间", "Time")}: ${entry.frame} F`,
    ...(sourceLines.length ? [`${localize("反击来源", "Counter sources")}:`, ...sourceLines] : []),
    `${localize("期望反击", "Expected counter")}: ${entry.triggerCount} × ${formatChargeNumber(group.chargePerCounter)}% = ${formatChargeNumber(entry.charge)}%`,
    `${localize("累计充能", "Cumulative")}: ${formatChargeNumber(entry.cumulativeCharge)}%`,
  ];
}

function getDodgedStunEventsForTeam(teamKey = "attack", targetReloadTimeline = []) {
  const opponentTeam = normalizeTeamKey(teamKey) === "attack" ? state.defenseTeam : state.team;
  if (!teamHasLittleMermaid(opponentTeam)) return [];
  const dodgeWindow = targetReloadTimeline.find((reload) => {
    if (reload.positionIndex !== LITTLE_MERMAID_STUN_TARGET_INDEX) return false;
    return reload.startFrame < LITTLE_MERMAID_STUN_FRAME && LITTLE_MERMAID_STUN_FRAME < reload.endFrame;
  });
  if (!dodgeWindow) return [];
  return [
    {
      source: "小美人鱼",
      label: "小美人鱼晕眩被规避",
      positionIndex: LITTLE_MERMAID_STUN_TARGET_INDEX,
      frame: LITTLE_MERMAID_STUN_FRAME,
      dodgeType: "reload",
      dodgeStartFrame: dodgeWindow.startFrame,
      dodgeEndFrame: dodgeWindow.endFrame,
      dodgerName: dodgeWindow.characterName,
    },
  ];
}

function getOpponentSacrificeDeathCountByFrame(opponentResult) {
  const deathCountByFrame = new Map();
  if (!opponentResult || opponentResult.error) return deathCountByFrame;
  (opponentResult.timeline || []).forEach((entry) => {
    const deathCount = (entry.contributions || []).filter(
      (contribution) => {
        const contributionCharacter = contribution.character || getCharacterById(contribution.characterId);
        return (
          contribution.showOnMember === false &&
          !isRosanna(contributionCharacter) &&
          (contribution.labels || []).some((label) => String(label).includes("罗珊娜献祭"))
        );
      },
    ).length;
    if (deathCount <= 0) return;
    deathCountByFrame.set(entry.frame, (deathCountByFrame.get(entry.frame) || 0) + deathCount);
  });
  return deathCountByFrame;
}

function getSpecialChargeEventsForTeam(targetResult, opponentResult) {
  if (!targetResult || targetResult.error || !opponentResult || opponentResult.error) return [];
  const opponentTimeline = opponentResult.timeline || [];
  const opponentHitsWithCounters = [
    ...opponentTimeline,
    ...getScarletCounterHitEntriesForTarget(targetResult, opponentResult, targetResult.timeline || []),
  ].sort((a, b) => a.frame - b.frame);
  if (opponentHitsWithCounters.length === 0) return [];
  const events = [];
  const opponentSacrificeDeathCountByFrame = getOpponentSacrificeDeathCountByFrame(opponentResult);

  targetResult.members.forEach((member) => {
    if (isRosanna(member.character)) {
      opponentSacrificeDeathCountByFrame.forEach((deathCount, frame) => {
        events.push({
          frame,
          positionIndex: member.positionIndex,
          chargeValue: ROSANNA_SACRIFICE_CHARGE * deathCount,
          label: "罗珊娜献祭",
        });
      });
    }

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
      let previousSuppressedByRosanna = false;
      opponentHitsWithCounters.forEach((entry) => {
        const suppressedByRosanna = isLinkSuppressedByRosanna(opponentResult, entry.frame);
        if (suppressedByRosanna && !previousSuppressedByRosanna) {
          accumulatedHits = 0;
          triggeredLinks = 0;
        }
        previousSuppressedByRosanna = suppressedByRosanna;
        const hitCount = suppressedByRosanna
          ? getPositionHitCount(entry, member.positionIndex)
          : getJackalLinkedHitCount(entry, linkedPositionIndices);
        accumulatedHits += hitCount;
        const nextTriggeredLinks = Math.floor(accumulatedHits / JACKAL_LINK_HIT_THRESHOLD);
        const triggerCount = nextTriggeredLinks - triggeredLinks;
        if (triggerCount <= 0) return;
        triggeredLinks = nextTriggeredLinks;
        events.push({
          frame: entry.frame + JACKAL_LINK_CHARGE_DELAY_FRAMES,
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
  const tauntSignature = (result.tauntTimeline || [])
    .map((entry) => `${entry.frame}:${entry.positionIndex}:${entry.tauntCenterPositionIndex}:${entry.sequence || 0}`)
    .join(",");
  return `${result.fullFrame}:${result.calculationEndFrame || result.fullFrame}:${result.finishingPositionIndices.join(",")}:${result.timeline.length}:${result.totalCharge.toFixed(3)}:${tauntSignature}`;
}

function getSharedBattleCalculationEndFrame(attackResult, defenseResult) {
  const frames = [attackResult?.fullFrame, defenseResult?.fullFrame]
    .map((frame) => Number(frame))
    .filter((frame) => Number.isFinite(frame) && frame >= 0);
  return frames.length ? Math.max(...frames) : null;
}

function computeBattleResults() {
  let attackStunWindows = getStunWindowsForTeam("attack");
  let defenseStunWindows = getStunWindowsForTeam("defense");
  let attackStunDodgeEvents = [];
  let defenseStunDodgeEvents = [];
  let attackResult = simulateBurst(state.team, "attack", [], [], [], attackStunWindows, [], null, state.defenseTeam, null, attackStunDodgeEvents);
  let defenseResult = simulateBurst(
    state.defenseTeam,
    "defense",
    [],
    [],
    [],
    defenseStunWindows,
    [],
    null,
    state.team,
    null,
    defenseStunDodgeEvents,
  );

  for (let index = 0; index < 8; index += 1) {
    attackStunWindows = getStunWindowsForTeam("attack", attackResult?.reloadTimeline || []);
    defenseStunWindows = getStunWindowsForTeam("defense", defenseResult?.reloadTimeline || []);
    attackStunDodgeEvents = getDodgedStunEventsForTeam("attack", attackResult?.reloadTimeline || []);
    defenseStunDodgeEvents = getDodgedStunEventsForTeam("defense", defenseResult?.reloadTimeline || []);
    const attackSpecials = getSpecialChargeEventsForTeam(attackResult, defenseResult);
    const defenseSpecials = getSpecialChargeEventsForTeam(defenseResult, attackResult);
    const continueUntilFrame = getSharedBattleCalculationEndFrame(attackResult, defenseResult);
    const nextAttackResult = simulateBurst(
      state.team,
      "attack",
      attackSpecials,
      defenseResult?.reloadTimeline || [],
      defenseResult?.turnDodgeTimeline || [],
      attackStunWindows,
      defenseResult?.tauntTimeline || [],
      null,
      state.defenseTeam,
      null,
      attackStunDodgeEvents,
      { continueUntilFrame },
    );
    const nextDefenseResult = simulateBurst(
      state.defenseTeam,
      "defense",
      defenseSpecials,
      attackResult?.reloadTimeline || [],
      attackResult?.turnDodgeTimeline || [],
      defenseStunWindows,
      attackResult?.tauntTimeline || [],
      null,
      state.team,
      null,
      defenseStunDodgeEvents,
      { continueUntilFrame },
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

function getBattleResultsSnapshot() {
  if (state.battleResults) return state.battleResults;
  const results = computeBattleResults();
  state.battleResults = results;
  return results;
}

function refreshBattleResults() {
  state.battleResults = computeBattleResults();
}

function invalidateBattleResults() {
  state.battleResults = null;
}

function getPaidArenaChartResultForTeam(teamKey, rowIndex = state.paidArenaActiveRowIndex) {
  if (!isPaidArenaModeActive()) return null;
  const mode = state.paidArenaMode;
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  const teams = getPaidArenaTeams(mode, normalizedTeamKey);
  if (!teams.length) return null;
  const normalizedRowIndex = Math.max(0, Math.min(teams.length - 1, Number(rowIndex) || 0));
  const team = teams[normalizedRowIndex] || [];
  const universalCharges = getPaidArenaUniversalCharges(mode, normalizedTeamKey)[normalizedRowIndex] || Array(TEAM_SIZE).fill(0);
  const sacrificeFrames = getPaidArenaRosannaSacrificeFrames(mode, normalizedTeamKey)[normalizedRowIndex] || Array(TEAM_SIZE).fill(null);
  const redHoodPierceCounts = getPaidArenaRedHoodPierceCounts(mode, normalizedTeamKey)[normalizedRowIndex] || Array(TEAM_SIZE).fill(0);
  const scarletCounterEnabled = getPaidArenaScarletCounterEnabled(mode, normalizedTeamKey)[normalizedRowIndex] || Array(TEAM_SIZE).fill(true);
  const jackalLink = normalizePaidArenaLinkForTeam(team, getPaidArenaJackalLinks(mode, normalizedTeamKey)[normalizedRowIndex]);
  const chargeSpeeds = getPaidArenaTeamChargeSpeeds(team, normalizedTeamKey);
  return simulatePaidArenaBurst(
    team,
    chargeSpeeds,
    universalCharges,
    sacrificeFrames,
    redHoodPierceCounts,
    scarletCounterEnabled,
    jackalLink,
    normalizedTeamKey,
  );
}

function getActivePaidArenaChartResults() {
  if (!isPaidArenaModeActive()) return { attackResult: null, defenseResult: null };
  const mode = state.paidArenaMode;
  const teams = getPaidArenaTeams(mode);
  const rowIndex = Math.max(0, Math.min(teams.length - 1, Number(state.paidArenaActiveRowIndex) || 0));
  const { attackResult, defenseResult } = computePaidArenaBattleResultsForRow(rowIndex);
  return { attackResult, defenseResult };
}

function estimateChartLabelWidth(label) {
  return [...String(label)].reduce((width, char) => width + (char.charCodeAt(0) > 255 ? 12.5 : 7), 0);
}

function getChartAxisLabelMarkup(label, className, y, visibleWidth = CHART_LABEL_VISIBLE_WIDTH) {
  const safeLabel = escapeHtml(label);
  const estimatedWidth = estimateChartLabelWidth(label);
  const overflow = Math.max(0, Math.ceil(estimatedWidth - visibleWidth - 2));
  const animation = overflow > 1
    ? `<animateTransform attributeName="transform" type="translate" values="0 0; 0 0; -${overflow} 0; -${overflow} 0; 0 0" keyTimes="0;0.22;0.48;0.78;1" dur="10s" repeatCount="indefinite" />`
    : "";
  return `
    <svg class="chart-name-window" x="${CHART_LABEL_PADDING_LEFT}" y="${y - 12}" width="${visibleWidth}" height="20" overflow="hidden">
      <text class="${className}" x="0" y="16" text-anchor="start">${safeLabel}${animation}</text>
    </svg>
  `;
}

function getCumulativeDealtHitMap(result, frame = 0) {
  const hitsByPosition = new Map();
  if (!result || result.error) return hitsByPosition;

  const getContributionDisplayHits = (contribution) => {
    if (Array.isArray(contribution.positionHits) && contribution.positionHits.length > 0) {
      return contribution.positionHits;
    }
    if (Array.isArray(contribution.targetHits) && contribution.targetHits.length > 0) {
      return contribution.targetHits;
    }
    return [];
  };

  result.timeline
    .filter((entry) => entry.frame <= frame)
    .forEach((entry) => {
      entry.contributions.forEach((contribution) => {
        const hits = getContributionDisplayHits(contribution);
        if (!Array.isArray(hits) || hits.length === 0) return;
        const attackerPositionIndex = Number(contribution.positionIndex);
        if (!Number.isInteger(attackerPositionIndex)) return;
        hits.forEach((positionHit) => {
          const targetPositionIndex = Number(positionHit.positionIndex);
          const hitCount = Number(positionHit.hitCount) || 0;
          if (!Number.isInteger(targetPositionIndex) || hitCount <= 0) return;
          const current = hitsByPosition.get(attackerPositionIndex) || {
            total: 0,
            byTarget: new Map(),
          };
          current.total += hitCount;
          current.byTarget.set(targetPositionIndex, (current.byTarget.get(targetPositionIndex) || 0) + hitCount);
          hitsByPosition.set(attackerPositionIndex, current);
        });
      });
    });
  return hitsByPosition;
}

function formatDealtHitSummary(hitItem) {
  if (!hitItem || hitItem.total <= 0) return "";
  return [...hitItem.byTarget.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([targetPositionIndex, hitCount]) => `P${targetPositionIndex + 1}: ${formatNumber(hitCount, 2)} hit`)
    .join(localize("，", ", "));
}

function getCumulativeContributionLines(result, frame) {
  const cumulativeByPosition = new Map();
  const dealtHitMap = getCumulativeDealtHitMap(result, frame);
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
      const dealtHitText = formatDealtHitSummary(dealtHitMap.get(member.positionIndex));
      return `${getCharacterLocalizedName(member.character)}: ${formatChargeNumber(cumulative)}%${dealtHitText ? ` ${localize("（", "(")}${dealtHitText}${localize("）", ")")}` : ""}`;
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

function getShareExportChartHeight(width) {
  return Math.round(width * (SHARE_EXPORT_CHART_SIZE.height / SHARE_EXPORT_CHART_SIZE.width));
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
  const margin = { top: 30, right: CHART_RIGHT_GUTTER, bottom: 42, left: 0 };
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
    if (!state.allowMissedShots) return [];
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
            endFrame: reload.endFrame,
            durationFrames: reload.reloadFrames || Math.max(0, reload.endFrame - reload.startFrame),
            teamKey: item.teamKey,
            displayEndFrame,
          })),
          ...(item.result.turnDodgeTimeline || []).map((turn) => ({
            ...turn,
            type: "turn",
            endFrame: turn.endFrame,
            durationFrames: turn.dodgeFrames || Math.max(0, turn.endFrame - turn.startFrame),
            teamKey: item.teamKey,
            displayEndFrame,
          })),
        ].filter((window) => window.startFrame <= Math.min(CHART_MAX_FRAME, displayEndFrame));
      })
    : [];
  const visibleMissedEvents = chartResults.flatMap((item) => {
    if (!state.allowMissedShots && item.result.engine !== "v2") return [];
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
  const visibleStunDodgeEvents = chartResults.flatMap((item) => {
    const displayEndFrame = getBurstDisplayEndFrame(item.result);
    return (item.result.stunDodgeTimeline || [])
      .filter((stun) => stun.frame <= Math.min(CHART_MAX_FRAME, displayEndFrame))
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
  const burstCoverageEvents = SHOW_BURST_COVERAGE_ON_TOTAL_CHARGE
    ? chartResults.flatMap((item) =>
      getBurstCoverageEvents(item.result).map((event) => ({
        ...event,
        teamKey: item.teamKey,
      })),
    )
    : [];
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
  resultFrameCandidates.push(...burstCoverageEvents.flatMap((event) => [event.startFrame, event.endFrame]));
  const counterFrameCandidates = scarletCounterGroups.flatMap((group) => group.timeline.map((entry) => entry.frame));
  const maxFrame = Math.min(CHART_MAX_FRAME, Math.max(...resultFrameCandidates, ...counterFrameCandidates, chartResults.length ? 1 : CHART_MAX_FRAME));
  const rlStandards = Array.from({ length: Math.floor(maxFrame / 76) }, (_, index) => ({
    label: `${index + 1}RL`,
    tooltip: localize(`${index + 1}RL · ${(index + 1) * 76} F`, `${index + 1} RL · ${(index + 1) * 76} F`),
    frame: (index + 1) * 76,
  }));
  const standardEvents = [
    ...(hasRosanna ? STANDARD_TIMELINE_EVENTS : []),
    ...(hasLittleMermaid ? [LITTLE_MERMAID_TIMELINE_EVENT] : []),
  ]
    .map((event) => ({
      ...event,
      label:
        event.label === "罗珊娜"
          ? localize("罗珊娜", "Rosanna")
          : event.label === "小美人鱼"
            ? localize("小美人鱼", "Little Mermaid")
            : event.label,
    }))
    .filter((event) => event.frame <= maxFrame);
  const standardMarkers = [...rlStandards, ...standardEvents].sort((a, b) => a.frame - b.frame);
  const tickStep = maxFrame <= 180 ? 20 : maxFrame <= 320 ? 40 : 60;
  const tickFrames = Array.from({ length: Math.floor(maxFrame / tickStep) + 1 }, (_, index) => index * tickStep);
  if (!tickFrames.includes(maxFrame)) tickFrames.push(maxFrame);
  const finishingPositionsByTeam = new Map(chartResults.map((item) => [item.teamKey, new Set(item.result.finishingPositionIndices)]));
  const labelGap = 10;
  const labelGutter = measuredLabelGutter ?? CHART_LABEL_GUTTER;
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
      const frameLabel = `${frame}F`;
      const secondLabel = `${frameToSeconds(frame)}s`;
      return `
        <g class="${isFullFrame ? "chart-grid is-full" : "chart-grid"}">
          <line x1="${x}" y1="${margin.top}" x2="${x}" y2="${height - margin.bottom}" />
          <text x="${x}" y="${height - 14}" text-anchor="middle">
            <tspan class="chart-axis-value chart-axis-value-frame" x="${x}" dy="0">${escapeHtml(frameLabel)}</tspan>
            <tspan class="chart-axis-value chart-axis-value-second" x="${x}" dy="0">${escapeHtml(secondLabel)}</tspan>
          </text>
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
      const tooltipText = typeof standard.getTooltip === "function" ? standard.getTooltip() : standard.tooltip;
      const tooltip = escapeHtml(tooltipText || `${standard.label} · ${standard.frame} F`);
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
  const getFinisherChargeAtFullFrame = (result, positionIndex) => {
    const fullFrameEntry = result.timeline.find((entry) => entry.frame === result.fullFrame);
    if (!fullFrameEntry) return 0;
    return fullFrameEntry.contributions
      .filter((contribution) => contribution.positionIndex === positionIndex && contribution.showOnMember !== false)
      .reduce((sum, contribution) => sum + (Number(contribution.charge) || 0), 0);
  };
  const getFinisherHighlightRange = (teamKey, result, positionIndex) => {
    const timeline = visibleTimelineByTeam.get(teamKey) || [];
    const finisherCharge = getFinisherChargeAtFullFrame(result, positionIndex);
    const fallbackPreviousFrame = timeline.filter((entry) => entry.frame < result.fullFrame).at(-1)?.frame;
    const fallbackRange =
      Number.isFinite(fallbackPreviousFrame) && result.fullFrame > fallbackPreviousFrame
        ? { start: fallbackPreviousFrame, end: result.fullFrame }
        : null;
    if (!(finisherCharge > BURST_EPSILON)) return fallbackRange;

    const threshold = Math.max(0, 100 - finisherCharge - BURST_EPSILON);
    const thresholdEntry = timeline
      .filter((entry) => entry.frame < result.fullFrame && entry.totalCharge >= threshold)
      .sort((a, b) => a.frame - b.frame)[0];
    if (!thresholdEntry || result.fullFrame <= thresholdEntry.frame) return fallbackRange;
    return { start: thresholdEntry.frame, end: result.fullFrame };
  };
  const finisherHighlightRangeByGroupKey = new Map(
    memberPointGroups.map((group) => [
      group.groupKey,
      (finishingPositionsByTeam.get(group.teamKey) || new Set()).has(group.member.positionIndex)
        ? getFinisherHighlightRange(group.teamKey, group.result, group.member.positionIndex)
        : null,
    ]),
  );
  const tracks = memberPointGroups
    .flatMap((group) => {
      const y = yForGroup(group.groupKey);
      const isFinisherTrack =
        (finishingPositionsByTeam.get(group.teamKey) || new Set()).has(group.member.positionIndex) &&
        canShowFinishMarker(group.member.character);
      const makeTrackLine = (startFrame, endFrame) => {
        const baseLine = `<line class="chart-track team-${group.teamKey}" x1="${xForFrame(startFrame)}" y1="${y}" x2="${xForFrame(endFrame)}" y2="${y}" />`;
        const highlightRange = finisherHighlightRangeByGroupKey.get(group.groupKey);
        if (!isFinisherTrack || !highlightRange) return baseLine;
        const highlightStart = Math.max(startFrame, highlightRange.start);
        const highlightEnd = Math.min(endFrame, highlightRange.end);
        if (highlightEnd <= highlightStart) return baseLine;
        const speedupFrames = Math.max(0, highlightRange.end - highlightRange.start);
        const tooltip = escapeHtml(localize(`可提速帧 ${speedupFrames}F`, `Speed-up window ${speedupFrames}F`));
        return `${baseLine}<line class="chart-track team-${group.teamKey} chart-track-finisher-final" x1="${xForFrame(highlightStart)}" y1="${y}" x2="${xForFrame(highlightEnd)}" y2="${y}" data-tooltip="${tooltip}" />`;
      };

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
            const segments = group.frames.slice(1).filter((frame, index) => frame > group.frames[index]).map((frame, index) => [group.frames[index], frame]);
            return segments.map((segment, index) => makeTrackLine(segment[0], segment[1], index === segments.length - 1)).filter(Boolean);
          }

          const segments = shotFrames
            .slice(1)
            .map((shot, index) => {
              if (shot.missed || (group.result.engine === "v2" && shotFrames[index].missed)) return null;
              const previousFrame = shotFrames[index].frame;
              return shot.frame > previousFrame ? [previousFrame, shot.frame] : null;
            })
            .filter(Boolean);
          return segments.map((segment, index) => makeTrackLine(segment[0], segment[1], index === segments.length - 1)).filter(Boolean);
        }

        return group.frames
          .slice(1)
          .map((frame, index) => {
            const previousFrame = group.frames[index];
            return frame > previousFrame ? [previousFrame, frame] : null;
          })
          .filter(Boolean)
          .map((segment, index, segments) => makeTrackLine(segment[0], segment[1], index === segments.length - 1))
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
      return getTrackSegments(firstFrame, lastFrame, [...groupReloads, ...groupMisses, ...groupStuns]).map((segment, index, segments) =>
        makeTrackLine(segment.start, segment.end, index === segments.length - 1),
      );
    })
    .flat()
    .join("");
  const burstCoverageTracks = burstCoverageEvents
    .map((event) => {
      const y = yForTeamTotal(event.teamKey);
      const activeStartFrame = Math.min(event.startFrame, maxFrame);
      const activeEndFrame = Math.min(event.endFrame, maxFrame);
      if (activeEndFrame <= activeStartFrame) return "";
      const characterName = getCharacterLocalizedName(event.character || getCharacterById(event.characterId));
      const tooltip = formatTooltipLines([
        characterName,
        `${getBurstMarkerLabel(event.stage)} · ${event.frame} F`,
        `${localize("生效", "Active")}: ${event.startFrame} F → ${event.endFrame} F`,
        `${localize("效果", "Effect")}: ${localize(event.effectZh, event.effectEn)}`,
      ]);
      return `<line class="chart-track chart-burst-coverage-active team-${event.teamKey}" x1="${xForFrame(activeStartFrame)}" y1="${y}" x2="${xForFrame(activeEndFrame)}" y2="${y}" data-tooltip="${tooltip}" />`;
    })
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
          tooltip: `${getTeamLabel(stun.teamKey)} P${stun.positionIndex + 1}\n${localize("时间", "Time")}: ${stun.startFrame} F\n${localize("状态", "Status")}: ${localize("被晕眩", "Stunned")}`,
        },
      ];
      if (endFrame >= stun.endFrame) {
        markers.push({
          frame: endFrame,
          tooltip: `${getTeamLabel(stun.teamKey)} P${stun.positionIndex + 1}\n${localize("时间", "Time")}: ${stun.endFrame} F\n${localize("状态", "Status")}: ${localize("晕眩解除", "Stun ended")}`,
        });
      }
      return markers.map(
        (marker) =>
          `<circle class="chart-stun-point team-${stun.teamKey}" cx="${xForFrame(marker.frame)}" cy="${y}" r="4" data-tooltip="${escapeHtml(marker.tooltip)}"></circle>`,
      );
    })
    .join("");
  const stunDodgePoints = visibleStunDodgeEvents
    .map((stun) => {
      const groupKey = `${stun.teamKey}-${stun.positionIndex}`;
      if (!laneByGroupKey.has(groupKey)) return "";
      const y = yForGroup(groupKey);
      const tooltip = escapeHtml(
        `${getTeamLabel(stun.teamKey)} P${stun.positionIndex + 1}\n${localize("时间", "Time")}: ${stun.frame} F\n${localize("状态", "Status")}: ${localize("晕眩被规避", "Stun dodged")}\n${localize("来源", "Source")}: ${localize("小美人鱼晕眩", "Little Mermaid stun")}\n${localize("换弹窗口", "Reload window")}: ${stun.dodgeStartFrame}F → ${stun.dodgeEndFrame}F`,
      );
      return `<circle class="chart-stun-dodge-point team-${stun.teamKey}" cx="${xForFrame(stun.frame)}" cy="${y}" r="4" data-tooltip="${tooltip}"></circle>`;
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
      const dodgeEndFrame = reload.endFrame;
      const visibleDodgeEndFrame = Math.min(dodgeEndFrame, endFrame, maxFrame, reload.displayEndFrame);
      const tooltip = escapeHtml(
        `${getLocalizedCharacterNameByName(reload.characterName)}\n${localize("换弹", "Reload")}: ${reload.startFrame}F → ${reload.endFrame}F\n${localize("可空判定", "Miss window")}: ${reload.startFrame}F → ${dodgeEndFrame}F`,
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
      const label = window.source === "v2-collider-pose"
        ? localize("Hide碰撞窗口", "Hide collider window")
        : window.type === "reload" ? localize("换弹可空", "Reload miss window") : localize("转身可空", "Turn miss window");
      const tooltip = escapeHtml(`${getLocalizedCharacterNameByName(window.characterName)}\n${label}: ${window.startFrame}F → ${window.endFrame}F\n${localize("判定", "Window")}: ${window.durationFrames}F`);
      return `<line class="chart-dodge-track chart-dodge-${window.type} team-${window.teamKey}" x1="${xForFrame(startFrame)}" y1="${y}" x2="${xForFrame(endFrame)}" y2="${y}" data-tooltip="${tooltip}"></line>`;
    })
    .join("");
  const missedPoints = visibleMissedEvents
    .map((miss) => {
      const y = yForGroup(`${miss.teamKey}-${miss.positionIndex}`);
      const dodgeLabel = miss.dodgeType === "reload" ? localize("换弹可空", "Reload miss window") : localize("转身可空", "Turn miss window");
      const dodgerLine = miss.dodgerName
        ? `\n${localize("目标", "Target")}: P${Number(miss.dodgerPositionIndex) + 1} ${getLocalizedCharacterNameByName(miss.dodgerName)}`
        : "";
      const detail = miss.source === "v2-projectile"
        ? `\n${localize("发射", "Fired")}: ${miss.flightStartFrame}F\n${localize("充能", "Charge")}: 0`
        : `\n${dodgeLabel}: ${miss.dodgeStartFrame}F → ${miss.dodgeEndFrame}F`;
      const tooltip = escapeHtml(
        `${getLocalizedCharacterNameByName(miss.characterName)}\n${localize("时间", "Time")}: ${miss.frame} F\n${localize("结果", "Result")}: ${localize("空枪，未命中", "Missed shot")}${dodgerLine}${detail}`,
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
          getChartGroupLabel(group.label),
          `${localize("时间", "Time")}: ${entry.frame} F`,
          `${localize("充能", "Charge")}: ${formatChargeNumber(entry.charge)}%`,
          `${localize("组成", "Breakdown")}:`,
          ...entry.contributions.map((contribution) => `${getLocalizedContributionCharacterName(contribution)}: ${formatChargeNumber(contribution.charge)}%`),
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
            getLocalizedContributionCharacterName(contribution),
            `${localize("时间", "Time")}: ${point.frame} F`,
            `${localize("充能", "Charge")}: ${formatChargeNumber(contribution.charge)}%`,
            `${localize("累积充能", "Cumulative")}: ${formatChargeNumber(contribution.cumulativeCharge)}%`,
            `${localize("充能组成", "Charge source")}: ${formatContributionSourceLabels(contribution.labels)}`,
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
      group.timeline.filter((entry) => entry.frame <= group.result.fullFrame).map((entry) => {
        const x = xForFrame(entry.frame);
        const y = yForTeamTotal(group.teamKey);
        const jackalLinkTotal = getSpecialContributionTotal(group.result, entry.frame, "豺狼链接");
        const scarletCounterTotal = getSpecialContributionTotal(group.result, entry.frame, "红莲反击");
        const universalChargeTotal = getSpecialContributionTotal(group.result, entry.frame, "万能充能");
        const rosannaSacrificeTotal = getSpecialContributionTotal(group.result, entry.frame, "罗珊娜献祭");
        const characterChargeLines = getCumulativeContributionLines(group.result, entry.frame);
        const tooltip = formatTooltipLines([
          `${getChartGroupLabel(group.label)} · ${entry.frame}F`,
          `${localize("累计总充能", "Total charge")}: ${formatChargeNumber(entry.totalCharge)}%`,
          ...(universalChargeTotal > BURST_EPSILON ? [`${localize("万能充能", "Universal charge")}: ${formatChargeNumber(universalChargeTotal)}%`] : []),
          ...(rosannaSacrificeTotal > BURST_EPSILON ? [`${localize("罗珊娜献祭充能", "Rosanna sacrifice charge")}: ${formatChargeNumber(rosannaSacrificeTotal)}%`] : []),
          ...(jackalLinkTotal > BURST_EPSILON ? [`${localize("豺狼链接充能", "Jackal link charge")}: ${formatChargeNumber(jackalLinkTotal)}%`] : []),
          ...(scarletCounterTotal > BURST_EPSILON ? [`${localize("红莲反击充能", "Scarlet counter charge")}: ${formatChargeNumber(scarletCounterTotal)}%`] : []),
          ...(characterChargeLines.length ? [`${localize("各角色充能", "Character charge")}:`, ...characterChargeLines] : []),
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
          const markerLabel = getBurstMarkerLabel(marker.stage);
          const tooltip = escapeHtml(`${getTeamLabel(group.teamKey)} ${markerLabel} · ${marker.frame} F`);
          return `<circle class="chart-burst-point team-${group.teamKey}" cx="${x}" cy="${y}" r="5" data-tooltip="${tooltip}"></circle><text class="chart-burst-label team-${group.teamKey}" x="${x}" y="${y - 10}" text-anchor="middle">${escapeHtml(markerLabel)}</text>`;
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
    return getChartAxisLabelMarkup(prefix + getCharacterLocalizedName(group.member.character), "chart-name", y + 4);
  }).join("");
  const scarletCounterLabels = scarletCounterGroups
    .map((group) =>
      getChartAxisLabelMarkup(
        getChartGroupLabel(group.label),
        `chart-name chart-scarlet-counter-name team-${group.teamKey}`,
        yForCounterGroup(group.groupKey) + 4,
      ),
    )
    .join("");
  const universalChargeLabels = specialChargeGroups
    .map((group) =>
      getChartAxisLabelMarkup(
        getChartGroupLabel(group.label),
        `chart-name chart-universal-name team-${group.teamKey}`,
        yForUniversalGroup(group.groupKey) + 4,
      ),
    )
    .join("");
  const standardLabel = getChartAxisLabelMarkup(localize("标准轴", "Standard"), "chart-name chart-standard-name", yForStandard() + 4);
  const totalLabels = totalGroups
    .map((group) =>
      getChartAxisLabelMarkup(
        getChartGroupLabel(group.label),
        `chart-name chart-total-name team-${group.teamKey}`,
        yForTeamTotal(group.teamKey) + 4,
      ),
    )
    .join("");

  // Paint every outline before any colored center so dense nodes cannot erase
  // the preceding node's fill. Keep tooltips only on the original fill layer.
  const markerMarkup = [standardPoints, universalChargePoints, pointMarks, missedPoints, stunPoints, stunDodgePoints, scarletCounterPoints, totalPoints, burstPoints].join("");
  const markerCircles = markerMarkup.match(/<circle\b[^>]*><\/circle>/g) || [];
  const markerOutlines = markerCircles.map((circle) => circle.replace(/ data-tooltip="[^"]*"/, "").replace("<circle ", '<circle style="fill:none" pointer-events="none" ')).join("");
  const markerFills = markerCircles.map((circle) => circle.replace("<circle ", '<circle style="stroke:none" ')).join("");
  const markerLabels = markerMarkup.replace(/<circle\b[^>]*><\/circle>/g, "");
  return `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMinYMin meet" data-label-gap="${labelGap}" data-label-gutter="${labelGutter}" role="img" aria-label="${escapeHtml(localize("队伍充能关键帧图表", "Team charge timeline chart"))}">
      <rect class="chart-bg" x="0" y="0" width="${width}" height="${height}" rx="8" />
      ${gridLines}
      ${standardLines}
      ${positionLines}
      ${teamSeparatorLine}
      ${standardReferenceLines}
      ${standardTrack}
      ${tracks}
      ${reloadDurationTracks}
      ${dodgeTracks}
      ${scarletCounterTracks}
      ${chargeTotalTrack}
      ${burstTotalTrack}
      ${burstCoverageTracks}
      <g class="chart-marker-outlines">${markerOutlines}</g>
      <g class="chart-marker-fills">${markerFills}</g>
      ${markerLabels}
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

  const currentGutter = Number(svg.dataset.labelGutter) || 0;
  if (Math.abs(CHART_LABEL_GUTTER - currentGutter) > 1) {
    els.chargeChart.innerHTML = getChargeChartMarkup(result, CHART_LABEL_GUTTER, defenseResult);
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

let hasIntentionalChartTooltipInteraction = false;

function showNearestChartTooltip(event, options = {}) {
  if (!options.force && !hasIntentionalChartTooltipInteraction) return;
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
  hasIntentionalChartTooltipInteraction = true;
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
  const ui = getCurrentLanguageText();
  if (els.battlePowerStrip) {
    const shouldHide = isPaidArenaModeActive();
    els.battlePowerStrip.hidden = shouldHide;
    if (shouldHide) {
      return;
    }
  }

  const base = sanitizeBattlePowerBase(state.battlePowerBase);
  const ratio = 1 - BATTLE_POWER_ADVANTAGE_RATE;
  if (els.battlePowerBaseInput && document.activeElement !== els.battlePowerBaseInput) {
    els.battlePowerBaseInput.value = base ? String(base) : "0";
  }
  if (els.battlePowerDefense) {
    els.battlePowerDefense.textContent = `${ui.battlePower.defense} ${formatBattlePower(base * ratio)}`;
  }
  if (els.battlePowerAttack) {
    els.battlePowerAttack.textContent = `${ui.battlePower.attack} ${formatBattlePower(base / ratio)}`;
  }
}

function renderSummaryStrip(attackResult, defenseResult) {
  const ui = getCurrentLanguageText();
  const entries = [
    { teamKey: "defense", result: defenseResult },
    { teamKey: "attack", result: attackResult },
  ].filter((entry) => entry.result && !entry.result.error);

  const recommendationMarkup = getAttackRecommendationMarkup();
  if (entries.length === 0 && !recommendationMarkup) {
    els.summaryStrip.textContent = ui.battlePower.summaryEmpty;
    return;
  }

  els.summaryStrip.innerHTML = `${entries
    .map(
      (entry, index) => `
        ${index > 0 ? '<span class="summary-vs">VS</span>' : ""}
        <span class="summary-team summary-${entry.teamKey}">
          <span>${getTeamLabel(entry.teamKey)}</span>
          <strong>${entry.result.fullFrame}F</strong>
        </span>
      `,
    )
    .join("")}${recommendationMarkup}`;
  bindAttackRecommendationActions();

}

function renderResults(battleResults = getBattleResultsSnapshot()) {
  if (isPaidArenaModeActive()) {
    const teams = getPaidArenaTeams();
    const pickedCount = teams.flat().filter(Boolean).length;
    const activeSide = getPaidArenaDataTeamKey();
    const activeSideLabel = activeSide === "defense" ? localize("防守队伍", "Defense teams") : localize("进攻队伍", "Attack teams");
    els.summaryStrip.textContent = localize(
      `${getPaidArenaModeLabel()}：${activeSideLabel} ${pickedCount}/${teams.length * TEAM_SIZE}，共用妮姬不可重复`,
      `${getPaidArenaModeLabel()}: ${activeSideLabel} ${pickedCount}/${teams.length * TEAM_SIZE}, shared Nikkes cannot repeat`,
    );
    els.resultPanel.innerHTML = "";
    const { attackResult, defenseResult } = getActivePaidArenaChartResults();
    renderChargeChart(attackResult, defenseResult);
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
  const engineSwitch = document.getElementById('calculatorEngineSwitch');
  if (engineSwitch && !engineSwitch.dataset.bound) {
    engineSwitch.dataset.bound = 'true';
    engineSwitch.addEventListener('click', event => {
      event.preventDefault();
      const url = new URL(getCurrentTeamShareUrl() || location.href);
      url.pathname = engineSwitch.getAttribute('href');
      url.searchParams.delete('v');
      if (url.pathname === '/') url.searchParams.delete('v2phase');
      location.assign(url.href);
    });
  }
  if (state.arcaParameterRegion !== state.filters.region) {state.arcaParameterRegion=state.filters.region;state.arcaChargeParameters=arcaWorkspace?.parameters(state.filters.region)||{};}
  renderCharacters();
  renderBattlePowerStrip();
  invalidateBattleResults();
  const battleResults = getBattleResultsSnapshot();
  renderTeam(battleResults);
  renderLineupSlots();
  renderResults(battleResults);
  syncFilterControls();
  refreshHelpCenterSolveSubmitButton();
  scheduleLocalPaidInferenceRefresh();
  refreshBattleResults();
}

function addCharacterLegacy(character) {
  if (state.team.some((member) => member && member.id === character.id)) {
    showToast(localize(`${character.name} 已在队伍中，不能重复加入。`, `${getCharacterLocalizedName(character)} is already in the team and cannot be added again.`));
    return;
  }

  const emptyIndex = state.team.findIndex((member) => !member);
  if (emptyIndex === -1) {
    showToast(localize("队伍已满，请先移除一个槽位。", "Team is full. Remove a slot first."));
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
  if (isHelpCenterLockedDefenseSide(getPaidArenaDataTeamKey())) {
    state.paidArenaDataTeamKey = "attack";
    showHelpCenterLockedDefenseToast();
    return;
  }
  const existing = findPaidArenaCharacter(character);
  if (existing) {
    removePaidArenaCharacter(existing.rowIndex, existing.slotIndex);
    return;
  }
  const teams = getPaidArenaTeams();
  if (!teams.length) return;
  const rowIndex = Math.max(0, Math.min(teams.length - 1, Number(state.paidArenaActiveRowIndex) || 0));
  const team = teams[rowIndex];
  const emptyIndex = team.findIndex((member) => !member);
  if (emptyIndex === -1) {
    showToast(localize(`${getPaidArenaModeLabel()}${getTeamLabel(getPaidArenaDataTeamKey())}当前队伍已满，请先移除一个槽位。`, `${getPaidArenaModeLabel()} ${getTeamLabel(getPaidArenaDataTeamKey())} current team is full. Remove a slot first.`));
    return;
  }
  const universalCharges = getPaidArenaUniversalCharges()[rowIndex] || Array(TEAM_SIZE).fill(0);
  const chargeSpeeds = getPaidArenaChargeSpeeds()[rowIndex] || Array(TEAM_SIZE).fill(0);
  const sacrificeFrames = getPaidArenaRosannaSacrificeFrames()[rowIndex] || Array(TEAM_SIZE).fill(null);
  const redHoodPierceCounts = getPaidArenaRedHoodPierceCounts()[rowIndex] || Array(TEAM_SIZE).fill(0);
  const scarletCounterEnabled = getPaidArenaScarletCounterEnabled()[rowIndex] || Array(TEAM_SIZE).fill(true);
  team[emptyIndex] = character;
  universalCharges[emptyIndex] = 0;
  chargeSpeeds[emptyIndex] = getSavedCharacterChargeSpeed(character, getPaidArenaDataTeamKey());
  sacrificeFrames[emptyIndex] = null;
  redHoodPierceCounts[emptyIndex] = isRedHood(character) ? getSavedCharacterRedHoodPierceCount(character, getPaidArenaDataTeamKey()) : 0;
  scarletCounterEnabled[emptyIndex] = true;
  state.paidArenaActiveRowIndex = rowIndex;
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function removePaidArenaCharacter(rowIndex, slotIndex) {
  if (isHelpCenterLockedDefenseSide(getPaidArenaDataTeamKey())) {
    showHelpCenterLockedDefenseToast();
    return;
  }
  const teams = getPaidArenaTeams();
  const universalCharges = getPaidArenaUniversalCharges();
  const chargeSpeeds = getPaidArenaChargeSpeeds();
  const sacrificeRows = getPaidArenaRosannaSacrificeFrames();
  const redHoodPierceRows = getPaidArenaRedHoodPierceCounts();
  const scarletCounterRows = getPaidArenaScarletCounterEnabled();
  const jackalLinkRows = getPaidArenaJackalLinks();
  const team = teams[rowIndex];
  if (!team || slotIndex < 0 || slotIndex >= TEAM_SIZE) return;
  team[slotIndex] = null;
  if (universalCharges[rowIndex]) universalCharges[rowIndex][slotIndex] = 0;
  if (chargeSpeeds[rowIndex]) chargeSpeeds[rowIndex][slotIndex] = 0;
  if (sacrificeRows[rowIndex]) sacrificeRows[rowIndex][slotIndex] = null;
  if (redHoodPierceRows[rowIndex]) redHoodPierceRows[rowIndex][slotIndex] = 0;
  if (scarletCounterRows[rowIndex]) scarletCounterRows[rowIndex][slotIndex] = true;
  if (jackalLinkRows[rowIndex]) jackalLinkRows[rowIndex] = normalizePaidArenaLinkForTeam(team, jackalLinkRows[rowIndex]);
  state.paidArenaActiveRowIndex = Math.max(0, Math.min(teams.length - 1, Number(rowIndex) || 0));
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function movePaidArenaSlot(fromRowIndex, fromIndex, toRowIndex, toIndex) {
  if (isHelpCenterLockedDefenseSide(getPaidArenaDataTeamKey())) {
    showHelpCenterLockedDefenseToast();
    return;
  }
  const teams = getPaidArenaTeams();
  const universalRows = getPaidArenaUniversalCharges();
  const speedRows = getPaidArenaChargeSpeeds();
  const sacrificeRows = getPaidArenaRosannaSacrificeFrames();
  const redHoodPierceRows = getPaidArenaRedHoodPierceCounts();
  const scarletCounterRows = getPaidArenaScarletCounterEnabled();
  const jackalLinkRows = getPaidArenaJackalLinks();
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
  const fromRedHoodPierceCount = redHoodPierceRows[fromRowIndex]?.[fromIndex] || 0;
  const fromScarletCounterEnabled = sanitizeScarletCounterEnabled(scarletCounterRows[fromRowIndex]?.[fromIndex]);

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
    [redHoodPierceRows[fromRowIndex][fromIndex], redHoodPierceRows[toRowIndex][toIndex]] = [
      redHoodPierceRows[toRowIndex][toIndex],
      redHoodPierceRows[fromRowIndex][fromIndex],
    ];
    [scarletCounterRows[fromRowIndex][fromIndex], scarletCounterRows[toRowIndex][toIndex]] = [
      scarletCounterRows[toRowIndex][toIndex],
      scarletCounterRows[fromRowIndex][fromIndex],
    ];
  } else {
    toTeam[toIndex] = fromCharacter;
    universalRows[toRowIndex][toIndex] = fromUniversalCharge;
    speedRows[toRowIndex][toIndex] = fromSpeed;
    sacrificeRows[toRowIndex][toIndex] = fromSacrificeFrame;
    redHoodPierceRows[toRowIndex][toIndex] = fromRedHoodPierceCount;
    scarletCounterRows[toRowIndex][toIndex] = fromScarletCounterEnabled;
    fromTeam[fromIndex] = null;
    universalRows[fromRowIndex][fromIndex] = 0;
    speedRows[fromRowIndex][fromIndex] = 0;
    sacrificeRows[fromRowIndex][fromIndex] = null;
    redHoodPierceRows[fromRowIndex][fromIndex] = 0;
    scarletCounterRows[fromRowIndex][fromIndex] = true;
  }
  jackalLinkRows[fromRowIndex] = normalizePaidArenaLinkForTeam(fromTeam, jackalLinkRows[fromRowIndex]);
  jackalLinkRows[toRowIndex] = normalizePaidArenaLinkForTeam(toTeam, jackalLinkRows[toRowIndex]);

  state.paidArenaActiveRowIndex = Math.max(0, Math.min(teams.length - 1, Number(toRowIndex) || 0));
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function swapPaidArenaRows(mode, fromTeamKey, fromRowIndex, toTeamKey, toRowIndex) {
  const normalizedMode = normalizePaidArenaMode(mode);
  const sourceTeamKey = normalizeTeamKey(fromTeamKey);
  const targetTeamKey = normalizeTeamKey(toTeamKey);
  if (isHelpCenterLockedDefenseSide(sourceTeamKey) || isHelpCenterLockedDefenseSide(targetTeamKey)) {
    showHelpCenterLockedDefenseToast();
    return;
  }
  const sourceRowIndex = Number(fromRowIndex);
  const targetRowIndex = Number(toRowIndex);
  if (
    normalizedMode === "normal" ||
    !Number.isInteger(sourceRowIndex) ||
    !Number.isInteger(targetRowIndex) ||
    sourceRowIndex < 0 ||
    targetRowIndex < 0 ||
    (sourceTeamKey === targetTeamKey && sourceRowIndex === targetRowIndex)
  ) {
    return;
  }
  const stores = [
    state.paidArenaTeams,
    state.paidArenaUniversalCharges,
    state.paidArenaChargeSpeeds,
    state.paidArenaRosannaSacrificeFrames,
    state.paidArenaRedHoodPierceCounts,
    state.paidArenaScarletCounterEnabled,
    state.paidArenaJackalLinks,
  ];
  const sourceRows = getPaidArenaTeams(normalizedMode, sourceTeamKey);
  const targetRows = getPaidArenaTeams(normalizedMode, targetTeamKey);
  if (!sourceRows[sourceRowIndex] || !targetRows[targetRowIndex]) return;
  stores.forEach((store) => {
    const source = store?.[normalizedMode]?.[sourceTeamKey];
    const target = store?.[normalizedMode]?.[targetTeamKey];
    if (!Array.isArray(source) || !Array.isArray(target) || !source[sourceRowIndex] || !target[targetRowIndex]) return;
    [source[sourceRowIndex], target[targetRowIndex]] = [target[targetRowIndex], source[sourceRowIndex]];
  });
  const links = state.paidArenaJackalLinks?.[normalizedMode];
  const teams = state.paidArenaTeams?.[normalizedMode];
  if (links && teams) {
    links[sourceTeamKey][sourceRowIndex] = normalizePaidArenaLinkForTeam(teams[sourceTeamKey][sourceRowIndex], links[sourceTeamKey][sourceRowIndex]);
    links[targetTeamKey][targetRowIndex] = normalizePaidArenaLinkForTeam(teams[targetTeamKey][targetRowIndex], links[targetTeamKey][targetRowIndex]);
  }
  state.paidArenaActiveRowIndex = Math.max(0, Math.min((PAID_ARENA_TEAM_COUNTS[normalizedMode] || 1) - 1, targetRowIndex));
  state.paidArenaDataTeamKey = targetTeamKey;
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
  if (isHelpCenterLockedDefenseSide(state.activeTeamKey)) {
    setActiveTeam("attack");
  }
  const team = getTeamState();
  const chargeSpeeds = getChargeSpeedState();
  const universalCharges = getUniversalChargeState();
  const redHoodPierceCounts = getRedHoodPierceCountState();
  const scarletCounterEnabled = getScarletCounterEnabledState();
  const sacrificeFrames = getRosannaSacrificeFrameState();
  if (team.some((member) => member && member.id === character.id)) {
    showToast(localize(`${character.name} 已在${getTeamLabel(state.activeTeamKey)}中`, `${getCharacterLocalizedName(character)} is already in ${getTeamLabel(state.activeTeamKey)}`));
    return;
  }

  const emptyIndex = team.findIndex((member) => !member);
  if (emptyIndex === -1) {
    showToast(localize(`${getTeamLabel(state.activeTeamKey)}已满，请先移除一个槽位`, `${getTeamLabel(state.activeTeamKey)} is full. Remove a slot first.`));
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
  if (isHelpCenterLockedDefenseSide(teamKey)) {
    showHelpCenterLockedDefenseToast();
    return;
  }
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
  if (isHelpCenterLockedDefenseSide(fromTeamKey) || isHelpCenterLockedDefenseSide(toTeamKey)) {
    showHelpCenterLockedDefenseToast();
    return;
  }
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
    if (isHelpCenterSolveActive()) {
      state.paidArenaTeams[state.paidArenaMode].attack = createEmptyPaidArenaTeams(state.paidArenaMode);
      state.paidArenaUniversalCharges[state.paidArenaMode].attack = createEmptyPaidArenaUniversalCharges(state.paidArenaMode);
      state.paidArenaChargeSpeeds[state.paidArenaMode].attack = createEmptyPaidArenaChargeSpeeds(state.paidArenaMode);
      state.paidArenaRosannaSacrificeFrames[state.paidArenaMode].attack = createEmptyPaidArenaRosannaSacrificeFrames(state.paidArenaMode);
      state.paidArenaRedHoodPierceCounts[state.paidArenaMode].attack = createEmptyPaidArenaRedHoodPierceCounts(state.paidArenaMode);
      state.paidArenaScarletCounterEnabled[state.paidArenaMode].attack = createEmptyPaidArenaScarletCounterEnabled(state.paidArenaMode);
      state.paidArenaJackalLinks[state.paidArenaMode].attack = createEmptyPaidArenaJackalLinks(state.paidArenaMode);
      state.paidArenaDataTeamKey = "attack";
      state.paidArenaActiveRowIndex = 0;
      openSlotSettings = null;
      openRosannaSacrificeSettings = null;
      saveTeam();
      render();
      return;
    }
    state.paidArenaTeams[state.paidArenaMode] = createEmptyPaidArenaTeamsBySide(state.paidArenaMode);
    state.paidArenaUniversalCharges[state.paidArenaMode] = createEmptyPaidArenaUniversalChargesBySide(state.paidArenaMode);
    state.paidArenaChargeSpeeds[state.paidArenaMode] = createEmptyPaidArenaChargeSpeedsBySide(state.paidArenaMode);
    state.paidArenaRosannaSacrificeFrames[state.paidArenaMode] = createEmptyPaidArenaRosannaSacrificeFramesBySide(state.paidArenaMode);
    state.paidArenaRedHoodPierceCounts[state.paidArenaMode] = createEmptyPaidArenaRedHoodPierceCountsBySide(state.paidArenaMode);
    state.paidArenaScarletCounterEnabled[state.paidArenaMode] = createEmptyPaidArenaScarletCounterEnabledBySide(state.paidArenaMode);
    state.paidArenaJackalLinks[state.paidArenaMode] = createEmptyPaidArenaJackalLinksBySide(state.paidArenaMode);
    state.paidArenaActiveRowIndex = 0;
    openSlotSettings = null;
    openRosannaSacrificeSettings = null;
    saveTeam();
    render();
    return;
  }
  if (isHelpCenterSolveActive()) {
    state.team = Array(TEAM_SIZE).fill(null);
    state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
    state.universalCharges = Array(TEAM_SIZE).fill(0);
    state.redHoodPierceCounts = Array(TEAM_SIZE).fill(0);
    state.scarletCounterEnabled = Array(TEAM_SIZE).fill(true);
    state.rosannaSacrificeFrames = Array(TEAM_SIZE).fill(null);
    state.jackalLinks.attack = createEmptyJackalLinkState();
    setActiveTeam("attack");
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
  if (isHelpCenterSolveActive()) {
    showToast(localize("\u4e92\u52a9\u89e3\u9898\u4e2d\u9632\u5b88\u5df2\u9501\u5b9a\uff0c\u4e0d\u80fd\u4ea4\u6362\u653b\u9632", "Defense is locked while solving, so sides cannot be swapped."));
    return;
  }
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
  if (isHelpCenterSolveActive()) {
    showToast(localize("\u4e92\u52a9\u89e3\u9898\u4e2d\u4e0d\u80fd\u5207\u6362\u961f\u4f0d\u65b9\u6848", "Cannot switch lineup plans while solving a help request."));
    return;
  }
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
  if (isHelpCenterSolveActive()) {
    showToast(localize("\u4e92\u52a9\u89e3\u9898\u4e2d\u4e0d\u80fd\u5207\u6362\u961f\u4f0d\u65b9\u6848", "Cannot switch lineup plans while solving a help request."));
    return;
  }
  const mode = state.paidArenaMode;
  const nextIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(index) || 0));
  if (nextIndex === getPaidArenaActiveLineupIndex(mode)) return;
  const currentDataTeamKey = getPaidArenaDataTeamKey();
  saveCurrentPaidArenaLineupSlot(mode);
  state.paidArenaActiveLineupIndex[mode] = nextIndex;
  loadPaidArenaLineupSlot(mode, nextIndex);
  state.paidArenaDataTeamKey = currentDataTeamKey;
  syncPaidArenaChargeSpeedsFromSavedData(mode);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  render();
}

function copyLineupSlotTo(sourceIndex, targetIndex) {
  if (state.helpCenter.solveWorkspace) return;
  const normalizedSourceIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(sourceIndex) || 0));
  const normalizedTargetIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(targetIndex) || 0));
  if (normalizedSourceIndex === normalizedTargetIndex) return;

  saveCurrentLineupSlot();
  const sourceSlot = cloneLineupSlot(state.lineupSlots[normalizedSourceIndex]);
  if (getLineupSlotCount(sourceSlot) === 0) {
    showToast(localize(`方案 ${normalizedSourceIndex + 1} 为空，无法复制`, `Plan ${normalizedSourceIndex + 1} is empty and cannot be copied`));
    renderLineupSlots();
    return;
  }
  const targetSlot = normalizeLineupSlot(state.lineupSlots[normalizedTargetIndex]);
  const targetCount = getLineupSlotCount(targetSlot);

  if (targetCount > 0) {
    const confirmed = window.confirm(localize(`方案 ${normalizedTargetIndex + 1} 已有队伍，是否覆盖？`, `Plan ${normalizedTargetIndex + 1} already has teams. Overwrite?`));
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
  showToast(localize(`已将方案 ${normalizedSourceIndex + 1} 复制到方案 ${normalizedTargetIndex + 1}`, `Copied plan ${normalizedSourceIndex + 1} to plan ${normalizedTargetIndex + 1}`));
  render();
}

function copyPaidArenaLineupSlotTo(sourceIndex, targetIndex, mode = state.paidArenaMode) {
  if (state.helpCenter.solveWorkspace) return;
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return;
  const normalizedSourceIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(sourceIndex) || 0));
  const normalizedTargetIndex = Math.max(0, Math.min(LINEUP_SLOT_COUNT - 1, Number(targetIndex) || 0));
  if (normalizedSourceIndex === normalizedTargetIndex) return;

  saveCurrentPaidArenaLineupSlot(normalizedMode);
  const slots = ensurePaidArenaLineupSlots(normalizedMode);
  const modeLabel = getPaidArenaModeLabel(normalizedMode);
  const sourceSlot = normalizePaidArenaLineupSlot(slots[normalizedSourceIndex], normalizedMode);
  const sourceCount = getPaidArenaLineupSlotCount(sourceSlot, normalizedMode);
  if (sourceCount === 0) {
    showToast(
      localize(
        `${modeLabel}方案 ${normalizedSourceIndex + 1} 为空，无法复制`,
        `${modeLabel} plan ${normalizedSourceIndex + 1} is empty and cannot be copied`,
      ),
    );
    renderLineupSlots();
    return;
  }

  const targetSlot = normalizePaidArenaLineupSlot(slots[normalizedTargetIndex], normalizedMode);
  const targetCount = getPaidArenaLineupSlotCount(targetSlot, normalizedMode);
  if (targetCount > 0) {
    const confirmed = window.confirm(
      localize(
        `${modeLabel}方案 ${normalizedTargetIndex + 1} 已有内容，是否覆盖？`,
        `${modeLabel} plan ${normalizedTargetIndex + 1} already has teams. Overwrite?`,
      ),
    );
    if (!confirmed) {
      renderLineupSlots();
      return;
    }
  }

  slots[normalizedTargetIndex] = normalizePaidArenaLineupSlot(sourceSlot, normalizedMode);
  state.paidArenaActiveLineupIndex[normalizedMode] = normalizedTargetIndex;
  loadPaidArenaLineupSlot(normalizedMode, normalizedTargetIndex);
  openSlotSettings = null;
  openRosannaSacrificeSettings = null;
  saveTeam();
  showToast(
    localize(
      `已将${modeLabel}方案 ${normalizedSourceIndex + 1} 复制到方案 ${normalizedTargetIndex + 1}`,
      `Copied ${modeLabel} plan ${normalizedSourceIndex + 1} to plan ${normalizedTargetIndex + 1}`,
    ),
  );
  render();
}

function getDraggedLineupSourceIndex(event) {
  const dataValue = event?.dataTransfer?.getData("text/plain");
  const candidate = dataValue === "" || dataValue === null || dataValue === undefined ? draggedLineupIndex : Number(dataValue);
  if (!Number.isInteger(candidate) || candidate < 0 || candidate >= LINEUP_SLOT_COUNT) return null;
  return candidate;
}

function getDraggedPaidArenaLineupSourceIndex(event, mode) {
  const normalizedMode = normalizePaidArenaMode(mode);
  if (normalizedMode === "normal") return null;
  const dataValue = event?.dataTransfer?.getData("text/plain");
  const candidate = dataValue === "" || dataValue === null || dataValue === undefined ? draggedPaidArenaLineupIndex : Number(dataValue);
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
  if (state.helpCenter.solveWorkspace) return;
  normalizeJackalLinks();
  saveCurrentLineupSlot();
  if (isPaidArenaModeActive()) saveCurrentPaidArenaLineupSlot(state.paidArenaMode);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      defenseTeam: state.defenseTeam.map((character) => character?.id || null),
    defenseUseArca: state.defenseTeam.map(c=>typeof c?.useArca==='boolean'?c.useArca:null),
      defenseChargeSpeeds: state.defenseChargeSpeeds,
      defenseUniversalCharges: [...state.defenseUniversalCharges],
      defenseRedHoodPierceCounts: [...state.defenseRedHoodPierceCounts],
      defenseScarletCounterEnabled: [...state.defenseScarletCounterEnabled],
      defenseRosannaSacrificeFrames: [...state.defenseRosannaSacrificeFrames],
      team: state.team.map((character) => character?.id || null),
    attackUseArca: state.team.map(c=>typeof c?.useArca==='boolean'?c.useArca:null),
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
      paidArenaDisplayMode: getPaidArenaDisplayMode(),
      championStage: sanitizeChampionStage(state.championStage),
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
      paidArenaRedHoodPierceCounts: {
        c: serializePaidArenaRedHoodPierceCounts("c"),
        p: serializePaidArenaRedHoodPierceCounts("p"),
      },
      paidArenaScarletCounterEnabled: {
        c: serializePaidArenaScarletCounterEnabled("c"),
        p: serializePaidArenaScarletCounterEnabled("p"),
      },
      paidArenaJackalLinks: {
        c: serializePaidArenaJackalLinks("c"),
        p: serializePaidArenaJackalLinks("p"),
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
  state.teamPresets = loadTeamPresetsFromStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.defenseTeam = Array.from({ length: TEAM_SIZE }, (_, index) => restoreArcaMember(saved.defenseTeam?.[index],saved.defenseUseArca?.[index]));
      state.defenseChargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(saved.defenseChargeSpeeds?.[index]));
      state.defenseUniversalCharges = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(saved.defenseUniversalCharges?.[index]));
      state.defenseRedHoodPierceCounts = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(saved.defenseRedHoodPierceCounts?.[index]));
      state.defenseScarletCounterEnabled = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(saved.defenseScarletCounterEnabled?.[index]));
      state.defenseRosannaSacrificeFrames = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeSacrificeFrame(saved.defenseRosannaSacrificeFrames?.[index]));
      state.team = Array.from({ length: TEAM_SIZE }, (_, index) => restoreArcaMember(saved.team?.[index],saved.attackUseArca?.[index]));
      state.chargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(saved.chargeSpeeds?.[index]));
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
      state.paidArenaRedHoodPierceCounts = {
        c: normalizePaidArenaRedHoodPierceCounts(saved.paidArenaRedHoodPierceCounts?.c, "c"),
        p: normalizePaidArenaRedHoodPierceCounts(saved.paidArenaRedHoodPierceCounts?.p, "p"),
      };
      state.paidArenaScarletCounterEnabled = {
        c: normalizePaidArenaScarletCounterEnabled(saved.paidArenaScarletCounterEnabled?.c, "c"),
        p: normalizePaidArenaScarletCounterEnabled(saved.paidArenaScarletCounterEnabled?.p, "p"),
      };
      state.paidArenaJackalLinks = {
        c: normalizePaidArenaJackalLinks(saved.paidArenaJackalLinks?.c, "c"),
        p: normalizePaidArenaJackalLinks(saved.paidArenaJackalLinks?.p, "p"),
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
      state.paidArenaDisplayMode = "side";
      state.championStage = sanitizeChampionStage(saved.championStage);
      const hasSavedActivePaidArenaLineup = isPaidArenaModeActive() && Array.isArray(saved.paidArenaLineupSlots?.[state.paidArenaMode]);
      if (isPaidArenaModeActive()) loadPaidArenaLineupSlot(state.paidArenaMode, getPaidArenaActiveLineupIndex(state.paidArenaMode));
      if (isPaidArenaModeActive()) {
        state.paidArenaDataTeamKey = "attack";
        state.paidArenaActiveRowIndex = 0;
      }
      state.paidArenaActiveRowIndex = Math.max(
        0,
        Math.min(
          getPaidArenaTeams().length - 1,
          Number(isPaidArenaModeActive() ? 0 : hasSavedActivePaidArenaLineup ? state.paidArenaActiveRowIndex : saved.paidArenaActiveRowIndex) || 0,
        ),
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
        favorite: false,
      };
      rememberLoadedTeamChargeSpeeds("defense");
      rememberLoadedTeamChargeSpeeds("attack");
      rememberLoadedTeamRedHoodPierceCounts("defense");
      rememberLoadedTeamRedHoodPierceCounts("attack");
      normalizeJackalLinks();
      setActiveTeam(isPaidArenaModeActive() ? saved.activeTeamKey || "attack" : "defense");
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
    state.paidArenaDisplayMode = "side";
    state.championStage = "unknown";
    state.paidArenaActiveRowIndex = 0;
    state.paidArenaActiveLineupIndex = { c: 0, p: 0 };
    state.paidArenaDataTeamKey = "attack";
    state.paidArenaTeams = {
      c: createEmptyPaidArenaTeamsBySide("c"),
      p: createEmptyPaidArenaTeamsBySide("p"),
    };
    state.paidArenaUniversalCharges = {
      c: createEmptyPaidArenaUniversalChargesBySide("c"),
      p: createEmptyPaidArenaUniversalChargesBySide("p"),
    };
    state.paidArenaChargeSpeeds = {
      c: createEmptyPaidArenaChargeSpeedsBySide("c"),
      p: createEmptyPaidArenaChargeSpeedsBySide("p"),
    };
    state.paidArenaRosannaSacrificeFrames = {
      c: createEmptyPaidArenaRosannaSacrificeFramesBySide("c"),
      p: createEmptyPaidArenaRosannaSacrificeFramesBySide("p"),
    };
    state.paidArenaRedHoodPierceCounts = {
      c: createEmptyPaidArenaRedHoodPierceCountsBySide("c"),
      p: createEmptyPaidArenaRedHoodPierceCountsBySide("p"),
    };
    state.paidArenaScarletCounterEnabled = {
      c: createEmptyPaidArenaScarletCounterEnabledBySide("c"),
      p: createEmptyPaidArenaScarletCounterEnabledBySide("p"),
    };
    state.paidArenaJackalLinks = {
      c: createEmptyPaidArenaJackalLinksBySide("c"),
      p: createEmptyPaidArenaJackalLinksBySide("p"),
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
let progressToastTimer = null;
function showToast(message, options = {}) {
  const { persistent = false, duration = 2200 } = options;
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  if (!persistent && duration > 0) {
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), duration);
  }
}

function getPwaInstallPromptApi() {
  return {
    escapeHtml,
    localize,
    showToast,
  };
}

async function loadPwaInstallModule() {
  const runtime = await refreshAppRuntimeContext();
  const module = await runtime.loadAppModule("pwa-install", () => importAppModule("./modules/pwa-install.js"));
  module.setPwaInstallPromptApi(getPwaInstallPromptApi());
  pwaInstallModulePromise = Promise.resolve(module);
  if (pendingPwaInstallPromptEvent) module.setPwaInstallPromptEvent?.(pendingPwaInstallPromptEvent);
  return module;
}

function initPwaInstallPrompt() {
  void loadPwaInstallModule()
    .then((module) => module.initPwaInstallPrompt())
    .catch((error) => console.warn("PWA install module failed", error));
}

function startProgressToast(message) {
  stopProgressToast({ keepVisible: true });
  let dotCount = 0;
  const update = () => {
    dotCount = (dotCount % 3) + 1;
    showToast(`${message}${".".repeat(dotCount)}`, { persistent: true });
  };
  update();
  progressToastTimer = setInterval(update, 450);
}

function stopProgressToast(options = {}) {
  const { keepVisible = false } = options;
  if (progressToastTimer) {
    clearInterval(progressToastTimer);
    progressToastTimer = null;
  }
  if (!keepVisible) els.toast.classList.remove("show");
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
  textarea.name = "clipboard-fallback-text";
  textarea.id = "clipboard-fallback-text";
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

let teamShareExportModulePromise = null;
const PAID_ARENA_SHARE_MODE_CURRENT = "current-team";
const PAID_ARENA_SHARE_MODE_PAIR = "pair-teams";
const PAID_ARENA_SHARE_MODE_FULL = "full";

function getTeamShareExportApi() {
  return {
    els,
    state,
    getExportThemePalette,
    getInlineSvgStyles,
    getExportSvgThemeStyles,
    getChargeChartMarkup,
    isPaidArenaModeActive,
    getActivePaidArenaChartResults,
    getBattleResultsSnapshot,
    getShareExportChartHeight,
    getPaidArenaModeLabel,
    getPaidArenaDataTeamKey,
    computePaidArenaBattleResultsForRow,
    normalizeTeamKey,
    getPaidArenaResultText,
    getTauntTargetState,
    getEffectiveLinkOwnerForTeam,
    isEffectiveLinkEnabledForTeam,
    getEffectiveLinkTargetIdsForTeam,
    isRosanna,
    sanitizeSacrificeFrame,
    getCubeIconSrc,
    getSavedCharacterCubeType,
    sanitizeUniversalCharge,
    canShowFinishMarker,
    isRedHood,
    sanitizeRedHoodPierceCount,
    isScarlet,
    sanitizeScarletCounterEnabled,
    getCharacterAvatarUrl,
    isStandardCharacterAssetUrl,
    formatChargeNumber,
    localize,
    canEditChargeSpeed,
    sanitizeChargeSpeed,
    getDisplayMagazine,
    isLocalDevRuntime,
    getStandardChargeBand,
    getTeamLabel,
    getRosannaSacrificeFrameState,
    getRedHoodPierceCountState,
    getScarletCounterEnabledState,
    normalizeJackalLink,
    getCharacterById,
    getCubeTypeById,
    getHelpCenterPayloadChargeLabel,
  };
}

async function loadTeamShareExportModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!teamShareExportModulePromise) {
    teamShareExportModulePromise = runtime.loadAppModule("team-share-export", () => importAppModule("./modules/team-share-export.js"));
  }
  const module = await teamShareExportModulePromise;
  module.setTeamShareExportApi(getTeamShareExportApi());
  return module;
}

async function loadImageFromUrl(url) {
  return (await loadTeamShareExportModule()).loadImageFromUrl(url);
}

async function canvasToPngBlob(canvas) {
  return (await loadTeamShareExportModule()).canvasToPngBlob(canvas);
}

async function blobToDataUrl(blob) {
  return (await loadTeamShareExportModule()).blobToDataUrl(blob);
}

async function getChargeChartPngBlob(chartSize = null, chartResults = null) {
  return (await loadTeamShareExportModule()).getChargeChartPngBlob(chartSize, chartResults);
}

async function normalArenaToPngBlob() {
  return (await loadTeamShareExportModule()).normalArenaToPngBlob();
}

async function paidArenaToPngBlob(options = {}) {
  return (await loadTeamShareExportModule()).paidArenaToPngBlob(options);
}

async function recommendationGuideToPngBlob(guide) {
  return (await loadTeamShareExportModule()).recommendationGuideToPngBlob(guide);
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

let shareUiModulePromise = null;

async function loadShareUiModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!shareUiModulePromise) {
    shareUiModulePromise = runtime.loadAppModule("share-ui", () => importAppModule("./modules/share-ui.js"));
  }
  const module = await shareUiModulePromise;
  module.setShareUiApi({
    normalizeTheme,
    escapeHtml,
    localize,
    getExportThemePalette,
    loadImageFromUrl,
    canvasToPngBlob,
    blobToDataUrl,
    normalArenaToPngBlob,
    paidArenaToPngBlob,
    isPaidArenaModeActive,
  });
  return module;
}

async function copyRichImageToClipboard(imageBlobOrPromise) {
  return (await loadShareUiModule()).copyRichImageToClipboard(imageBlobOrPromise);
}

async function copyCurrentArenaImage(options = {}) {
  return (await loadShareUiModule()).copyCurrentArenaImage(options);
}

async function choosePaidArenaShareMode() {
  return (await loadShareUiModule()).choosePaidArenaShareMode();
}

async function openShareImagePreview(imageBlob, title = "NIKKE PVP") {
  return (await loadShareUiModule()).openShareImagePreview(imageBlob, title);
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

function closeChampionDataModal() {
  document.querySelector(".champion-data-modal-backdrop")?.remove();
}

function closeChampionPlayerDetailModal() {
  document.querySelector(".champion-player-detail-backdrop")?.remove();
}

function normalizeChampionCharacterName(name) {
  return String(name || "")
    .replace(/：/g, ":")
    .replace(/\s+/g, "")
    .trim();
}

function getChampionCharacterList() {
  try {
    if (typeof CHARACTERS !== "undefined" && Array.isArray(CHARACTERS)) return CHARACTERS;
  } catch {
    // Some runtimes only expose API-loaded data on globalThis.
  }
  return Array.isArray(globalThis.CHARACTERS) ? globalThis.CHARACTERS : [];
}

function getChampionCharacterAliasTarget(name) {
  const normalizedName = normalizeChampionCharacterName(name);
  if (normalizedName === "海伦") return "海伦珍藏";
  return normalizedName;
}

function resolveChampionCharacterId(id) {
  const character = getCharacterById(id);
  if (!character) return id;
  if (normalizeChampionCharacterName(character.name) !== "海伦") return id;
  const favoriteHelm = getChampionCharacterByName("海伦 珍藏");
  return favoriteHelm?.id ?? id;
}

function getChampionCharacterByName(name) {
  const normalizedName = getChampionCharacterAliasTarget(name);
  const characters = getChampionCharacterList();
  if (!normalizedName || !characters.length) return null;
  return characters.find((character) => {
    const names = [character.name, character.nameCodeName, character.slug, character.enName].filter(Boolean);
    return names.some((candidate) => normalizeChampionCharacterName(candidate) === normalizedName);
  }) || null;
}

function getChampionCharacterForMember(member = {}) {
  const characterId = resolveChampionCharacterId(member?.character_id ?? member?.characterId ?? member?.id);
  return getCharacterById(characterId) || getChampionCharacterByName(member?.name || "");
}

function getChampionTeamCharacters(team = []) {
  return Array.from({ length: TEAM_SIZE }, (_, index) => getChampionCharacterForMember(team[index] || null) || null);
}

function getChampionTeamSavedChargeSpeeds(team = [], teamKey = "attack") {
  return Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
    const character = team?.[slotIndex];
    return character ? getSavedCharacterChargeSpeed(character, teamKey) : 0;
  });
}

function getChampionTeamSavedRedHoodPierceCounts(team = [], teamKey = "attack") {
  return Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
    const character = team?.[slotIndex];
    return character && isRedHood(character) ? getSavedCharacterRedHoodPierceCount(character, teamKey) : 0;
  });
}

function getChampionTeamSavedScarletCounterEnabled(team = [], teamKey = "attack") {
  const scarletEnabled = getScarletCounterEnabledState(teamKey);
  return Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
    const character = team?.[slotIndex];
    if (!character || !isScarlet(character)) return true;
    return scarletEnabled[slotIndex] !== false;
  });
}

function getChampionTeamSavedRosannaSacrificeFrames(team = [], teamKey = "attack") {
  const frames = getRosannaSacrificeFrameState(teamKey);
  return Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
    const character = team?.[slotIndex];
    return character && isRosanna(character) ? frames[slotIndex] || null : null;
  });
}

function getChampionRows() {
  if (championDataState.selectedFile && championDataState.rowsByFile?.[championDataState.selectedFile]) {
    return championDataState.rowsByFile[championDataState.selectedFile];
  }
  return Array.isArray(championDataState.rows) ? championDataState.rows : [];
}

function createChampionRowsSignature(rows = []) {
  if (!Array.isArray(rows)) return "";
  return `${rows.length}:${rows.map((row) => `${row?.source_file || ""}#${row?.source_row || ""}#${row?.source_label || ""}#${row?.winner || ""}`).join("|")}`;
}

function getChampionSourceKey(rowOrSource = {}) {
  return String(rowOrSource?.source_key || rowOrSource?.sourceKey || rowOrSource?.source_file || "");
}


function isChampionStatsPayload(value) {
  return value
    && typeof value === "object"
    && Array.isArray(value.topByRate)
    && Array.isArray(value.topByGames)
    && Array.isArray(value.bestByRound)
    && (!value.ranking || (typeof value.ranking === "object" && Array.isArray(value.ranking.recommendations) && Array.isArray(value.ranking.characters) && Array.isArray(value.ranking.cores)));
}

function getChampionStatsSignature(stats) {
  return typeof stats?.signature === "string" && stats.signature ? stats.signature : "";
}


function isChampionWinrateModelPayload(value) {
  return value
    && typeof value === "object"
    && Number(value.version) === CHAMPION_WINRATE_MODEL_VERSION
    && typeof value.sourceSignature === "string"
    && value.matchups && typeof value.matchups === "object"
    && value.setMatchups && typeof value.setMatchups === "object"
    && value.recommendations && typeof value.recommendations === "object"
    && value.characters && typeof value.characters === "object";
}

function readChampionWinrateModelCache() {
  try {
    const raw = localStorage.getItem(CHAMPION_WINRATE_MODEL_CACHE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed
      || parsed.schemaVersion !== CHAMPION_WINRATE_MODEL_CACHE_SCHEMA_VERSION
      || !isChampionWinrateModelPayload(parsed.model)
    ) return null;
    return {
      signature: String(parsed.model.sourceSignature || ""),
      model: parsed.model,
    };
  } catch {
    return null;
  }
}

function writeChampionWinrateModelCache(model) {
  if (!isChampionWinrateModelPayload(model)) return;
  try {
    localStorage.setItem(CHAMPION_WINRATE_MODEL_CACHE_STORAGE_KEY, JSON.stringify({
      schemaVersion: CHAMPION_WINRATE_MODEL_CACHE_SCHEMA_VERSION,
      cachedAt: new Date().toISOString(),
      model,
    }));
  } catch {
    // Prediction still works from memory when persistent storage is unavailable.
  }
}

async function fetchChampionWinrateModel() {
  const cached = readChampionWinrateModelCache();
  const params = new URLSearchParams({
    winrateModel: "1",
    version: String(CHAMPION_WINRATE_MODEL_VERSION),
  });
  if (cached?.signature) params.set("signature", cached.signature);
  const response = await authenticatedFetch(`${SUPABASE_CHAMPION_MATCHES_ENDPOINT}?${params.toString()}`, {
    headers: await getChampionDataRequestHeaders(),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (response.ok && payload?.ok && payload?.notModified && cached?.model) {
    return cached.model;
  }
  if (!response.ok || !isChampionWinrateModelPayload(payload)) {
    throw new Error(getChampionDataFetchErrorMessage(response, payload, localize("胜率预测模型读取失败", "Failed to load win-rate prediction model")));
  }
  writeChampionWinrateModelCache(payload);
  return payload;
}

function scheduleChampionWinrateModelLoad() {
  if (championWinrateModelState.model || championWinrateModelState.loading || championWinrateModelState.promise) return;
  championWinrateModelState.loading = true;
  championWinrateModelState.error = "";
  championWinrateModelState.promise = fetchChampionWinrateModel()
    .then((model) => {
      championWinrateModelState.model = model;
      championWinrateModelState.error = "";
    })
    .catch((error) => {
      championWinrateModelState.error = error?.message || localize("胜率预测模型读取失败", "Failed to load win-rate prediction model");
    })
    .finally(() => {
      championWinrateModelState.loading = false;
      championWinrateModelState.promise = null;
      if (!isPaidArenaModeActive()) renderResults(getBattleResultsSnapshot());
    });
}

function getChampionPredictionTeamIds(team = []) {
  if (!Array.isArray(team) || team.length !== TEAM_SIZE || team.some((member) => !member?.id)) return [];
  return team.map((member) => String(resolveChampionCharacterId(member.id))).filter(Boolean);
}

function getChampionPredictionTeamKey(team = []) {
  const ids = getChampionPredictionTeamIds(team);
  return ids.length === TEAM_SIZE ? ids.join("|") : "";
}

function getChampionPredictionTeamSetKey(team = []) {
  const ids = getChampionPredictionTeamIds(team);
  return ids.length === TEAM_SIZE ? ids.slice().sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)).join("|") : "";
}

function getChampionPredictionCombinationKeys(ids = [], size = 4) {
  const sortedIds = ids.slice().sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
  const result = [];
  const walk = (start, picked) => {
    if (picked.length === size) {
      result.push(picked.join("|"));
      return;
    }
    for (let index = start; index <= sortedIds.length - (size - picked.length); index += 1) {
      walk(index + 1, [...picked, sortedIds[index]]);
    }
  };
  walk(0, []);
  return result;
}

function getChampionPredictionStat(map, key) {
  return key && map && typeof map === "object" ? map[key] || null : null;
}

function getAdjustedPredictionRate(stat, priorGames = 8) {
  const games = Number(stat?.g) || 0;
  const wins = Number(stat?.w) || 0;
  if (games <= 0) return 0.5;
  return (wins + 0.5 * priorGames) / (games + priorGames);
}

function getPredictionLogit(rate) {
  const clamped = Math.min(0.95, Math.max(0.05, Number(rate) || 0.5));
  return Math.log(clamped / (1 - clamped));
}

function getBestChampionPredictionCoreStat(model, ids, size) {
  const map = size === 4 ? model?.cores4 : null;
  let best = null;
  for (const key of getChampionPredictionCombinationKeys(ids, size)) {
    const stat = getChampionPredictionStat(map, key);
    if (!stat) continue;
    if (!best || Number(stat.score || 0) > Number(best.score || 0) || Number(stat.g || 0) > Number(best.g || 0)) {
      best = stat;
    }
  }
  return best;
}

function getChampionPredictionTeamScore(model, team, ids) {
  const teamKey = getChampionPredictionTeamKey(team);
  const setKey = getChampionPredictionTeamSetKey(team);
  const recommendation = getChampionPredictionStat(model?.recommendations, teamKey);
  const teamStat = getChampionPredictionStat(model?.teams, teamKey);
  const teamSet = getChampionPredictionStat(model?.teamSets, setKey);
  const core4 = getBestChampionPredictionCoreStat(model, ids, 4);
  const characterStats = ids.map((id) => getChampionPredictionStat(model?.characters, id)).filter(Boolean);
  let score = 0;
  const evidence = [];
  if (recommendation) {
    score += getPredictionLogit(getAdjustedPredictionRate(recommendation, 10)) * 0.35 + (Number(recommendation.score) || 0) * 0.25;
    evidence.push({ type: "recommendation", games: Number(recommendation.g) || 0 });
  }
  if (teamStat) {
    score += getPredictionLogit(getAdjustedPredictionRate(teamStat, 10)) * 0.22;
    evidence.push({ type: "team", games: Number(teamStat.g) || 0 });
  }
  if (teamSet) {
    score += getPredictionLogit(getAdjustedPredictionRate(teamSet, 14)) * 0.18 + (Number(teamSet.score) || 0) * 0.08;
    evidence.push({ type: "teamSet", games: Number(teamSet.g) || 0 });
  }
  if (core4) {
    score += getPredictionLogit(getAdjustedPredictionRate(core4, 18)) * 0.14 + (Number(core4.score) || 0) * 0.08;
    evidence.push({ type: "core4", games: Number(core4.g) || 0 });
  }
  if (characterStats.length) {
    const averageRate = characterStats.reduce((sum, stat) => sum + getAdjustedPredictionRate(stat, 30), 0) / characterStats.length;
    score += getPredictionLogit(averageRate) * 0.06;
    evidence.push({ type: "characters", games: Math.round(characterStats.reduce((sum, stat) => sum + (Number(stat.g) || 0), 0) / characterStats.length) });
  }
  return { score, evidence, recommendation, teamStat, teamSet, core4 };
}

function clampPredictionScore(value, min, max) {
  const number = Number(value) || 0;
  return Math.max(min, Math.min(max, number));
}

function getChampionWinratePrediction(attackResult, defenseResult) {
  if (!attackResult || !defenseResult || attackResult.error || defenseResult.error) return null;
  const attackIds = getChampionPredictionTeamIds(state.team);
  const defenseIds = getChampionPredictionTeamIds(state.defenseTeam);
  if (attackIds.length !== TEAM_SIZE || defenseIds.length !== TEAM_SIZE) return null;
  if (!state.authSession?.accessToken && !getStoredAuthSession()?.accessToken) {
    return {
      status: "login",
      label: localize("去登录", "Sign in"),
      tooltip: localize("登录后即可使用普通竞技场胜率预测。", "Sign in to use arena win-rate prediction."),
    };
  }
  if (!championWinrateModelState.model) {
    scheduleChampionWinrateModelLoad();
    return {
      status: championWinrateModelState.error ? "error" : "loading",
      label: championWinrateModelState.error ? localize("模型不可用", "Model unavailable") : localize("加载中", "Loading"),
      tooltip: championWinrateModelState.error || localize("正在读取已鉴权的本地胜率预测模型。", "Loading the authorized local win-rate prediction model."),
    };
  }
  const model = championWinrateModelState.model;
  const attackKey = getChampionPredictionTeamKey(state.team);
  const defenseKey = getChampionPredictionTeamKey(state.defenseTeam);
  const attackSetKey = getChampionPredictionTeamSetKey(state.team);
  const defenseSetKey = getChampionPredictionTeamSetKey(state.defenseTeam);
  const direct = getChampionPredictionStat(model.matchups, `${attackKey}>${defenseKey}`);
  const setMatchup = direct ? null : getChampionPredictionStat(model.setMatchups, `${attackSetKey}>${defenseSetKey}`);
  let score = 0;
  const basis = [];
  let sampleGames = 0;
  let matchupKind = "";
  const sampleBreakdown = [];
  if (direct || setMatchup) {
    const matchup = direct || setMatchup;
    matchupKind = direct ? "direct" : "set";
    const rate = getAdjustedPredictionRate(matchup, direct ? 8 : 12);
    score += getPredictionLogit(rate) * (direct ? 1 : 0.7);
    sampleGames = Math.max(sampleGames, Number(matchup.g) || 0);
    const wins = Number(matchup.w) || 0;
    const games = Number(matchup.g) || 0;
    if (!direct) {
      sampleBreakdown.push(localize("完整站位对局：0 场", "Exact-position matchup: 0 games"));
    }
    sampleBreakdown.push(direct
      ? localize(`完整站位对局：${games} 场（进攻 ${wins} 胜）`, `Exact-position matchup: ${games} games, attack won ${wins}`)
      : localize(`不分站位对局：${games} 场（进攻 ${wins} 胜）`, `Position-agnostic matchup: ${games} games, attack won ${wins}`));
    basis.push(direct
      ? localize(`命中历史完整站位对局 ${games} 场，进攻 ${wins} 胜`, `Exact historical matchup: ${games} games, attack won ${wins}`)
      : localize(`命中不分站位对局 ${games} 场，进攻 ${wins} 胜`, `Position-agnostic matchup: ${games} games, attack won ${wins}`));
    if (!direct) {
      basis.push(localize("样本已按不分站位规则保守平滑。", "Sample is conservatively smoothed by position-agnostic rules."));
    } else if (games < 10) {
      basis.push(localize("完整站位样本较少，结果已保守平滑。", "Exact-position sample is small and conservatively smoothed."));
    }
  }
  const attackTeamScore = getChampionPredictionTeamScore(model, state.team, attackIds);
  const defenseTeamScore = getChampionPredictionTeamScore(model, state.defenseTeam, defenseIds);
  const teamScoreDiff = attackTeamScore.score - defenseTeamScore.score;
  if (matchupKind === "direct" && sampleGames >= 10) {
    score += clampPredictionScore(teamScoreDiff, -0.22, 0.22);
  } else if (matchupKind === "direct") {
    score += clampPredictionScore(teamScoreDiff, -0.38, 0.38);
  } else if (matchupKind === "set") {
    score += clampPredictionScore(teamScoreDiff, -0.55, 0.55);
  } else {
    score += teamScoreDiff;
  }
  const teamEvidence = [...attackTeamScore.evidence, ...defenseTeamScore.evidence];
  const teamReferenceGames = Math.max(...teamEvidence.map((item) => Number(item.games) || 0), 0);
  sampleGames = Math.max(sampleGames, teamReferenceGames, 0);
  if (!direct && !setMatchup) {
    sampleBreakdown.push(localize("直接对局：0 场", "Direct matchup: 0 games"));
  }
  if (teamReferenceGames > 0) {
    sampleBreakdown.push(localize(`队伍/体系历史最大样本：${teamReferenceGames} 场（非直接交手）`, `Largest team/system history sample: ${teamReferenceGames} games (not direct matches)`));
  }
  if (teamEvidence.some((item) => item.type === "recommendation")) basis.push(localize("命中完整队伍推荐统计", "Matched full-team recommendation stats"));
  if (teamEvidence.some((item) => item.type === "core4")) basis.push(localize("命中 4 人核心体系", "Matched 4-member core systems"));
  if (teamEvidence.some((item) => item.type === "characters")) basis.push(localize("使用角色榜表现补充", "Used character performance as fallback"));
  if (!basis.length) {
    return {
      status: "empty",
      label: localize("样本不足", "Insufficient"),
      tooltip: localize("当前双方队伍没有命中可用的历史对局、完整队伍、核心或角色统计。", "No usable historical matchup, team, core, or character stats matched these teams."),
    };
  }
  const attackFrame = Number(attackResult.fullFrame);
  const defenseFrame = Number(defenseResult.fullFrame);
  if (Number.isFinite(attackFrame) && Number.isFinite(defenseFrame)) {
    const frameDiff = defenseFrame - attackFrame;
    const frameScore = Math.max(-0.5, Math.min(0.5, frameDiff / 120));
    score += frameScore * 0.3;
    if (Math.abs(frameDiff) >= 6) {
      basis.push(frameDiff > 0
        ? localize(`进攻快 ${Math.round(frameDiff)}F，小幅提高预测`, `Attack is ${Math.round(frameDiff)}F faster, slightly raising prediction`)
        : localize(`进攻慢 ${Math.round(Math.abs(frameDiff))}F，小幅降低预测`, `Attack is ${Math.round(Math.abs(frameDiff))}F slower, slightly lowering prediction`));
    }
  }
  const winRate = 1 / (1 + Math.exp(-score));
  const percent = Math.round(Math.min(0.95, Math.max(0.05, winRate)) * 100);
  let confidence = "low";
  let confidenceText = localize("低", "Low");
  if (direct && sampleGames >= 10) {
    confidence = "high";
    confidenceText = localize("高", "High");
  } else if (direct || setMatchup || sampleGames >= 30 || teamEvidence.some((item) => item.type === "recommendation" || item.type === "core4")) {
    confidence = "medium";
    confidenceText = localize("中", "Medium");
  }
  return {
    status: "ready",
    percent,
    confidence,
    confidenceText,
    label: `${percent}%`,
    tooltip: [
      localize(`置信度：${confidenceText}`, `Confidence: ${confidenceText}`),
      ...sampleBreakdown,
      ...basis.slice(0, 4),
    ].join("\n"),
  };
}

function getAttackRecommendationContext() {
  const defenseKey = getChampionPredictionTeamKey(state.defenseTeam);
  if (!defenseKey) return null;
  const region = normalizeThirdPartyDataRegion(state.filters.region);
  return { defenseKey, region, season: "all", key: `${region}|all|${defenseKey}` };
}

function syncAttackRecommendationContext(context) {
  if (attackRecommendationState.contextKey === context.key) return;
  attackRecommendationState.contextKey = context.key;
  attackRecommendationState.solutions = [];
  attackRecommendationState.communityCount = 0;
  attackRecommendationState.clicks = 0;
  attackRecommendationState.selected = null;
  attackRecommendationState.selectedIndex = -1;
  attackRecommendationState.loading = false;
  attackRecommendationState.error = "";
}

function getAttackRecommendationMarkup() {
  const context = getAttackRecommendationContext();
  if (!context) return "";
  syncAttackRecommendationContext(context);
  const loggedIn = Boolean(state.authSession?.accessToken || getStoredAuthSession()?.accessToken);
  const selected = attackRecommendationState.selected;
  const selectedIsVisible = selected && getChampionPredictionTeamKey(state.team) === selected.attack_key;
  const status = selectedIsVisible
    ? (selected.community
      ? localize(`社区解法 · ${attackRecommendationState.selectedIndex + 1}/${attackRecommendationState.solutions.length}`, `Community · ${attackRecommendationState.selectedIndex + 1}/${attackRecommendationState.solutions.length}`)
      : localize(`${Math.round(Number(selected.win_rate) * 100)}% · ${selected.wins}胜${selected.losses}负 · ${selected.games}场 · ${attackRecommendationState.selectedIndex + 1}/${attackRecommendationState.solutions.length}`, `${Math.round(Number(selected.win_rate) * 100)}% · ${selected.wins}W ${selected.losses}L · ${selected.games} games · ${attackRecommendationState.selectedIndex + 1}/${attackRecommendationState.solutions.length}`))
    : attackRecommendationState.error || "";
  return `
    <span class="summary-winrate-prediction${attackRecommendationState.error ? " is-error" : ""}">
      ${!loggedIn
        ? `<button class="summary-winrate-login" type="button" data-winrate-login>${escapeHtml(localize("去登录", "Sign in"))}</button>`
        : `<button class="summary-winrate-login" type="button" data-attack-recommend ${attackRecommendationState.loading ? "disabled" : ""}>${escapeHtml(attackRecommendationState.loading ? localize("查询中", "Loading") : localize("推荐进攻", "Recommend attack"))}</button>`}
      ${status ? `<span class="summary-attack-recommend-status" role="status">${escapeHtml(status)}</span>` : ""}
    </span>
  `;
}

async function fetchAttackRecommendations(context) {
  const params = new URLSearchParams({ region: context.region, season: context.season, defenseKey: context.defenseKey });
  const response = await authenticatedFetch(`${SUPABASE_ATTACK_RECOMMENDATIONS_ENDPOINT}?${params}`, {
    headers: await getChampionDataRequestHeaders(),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok || !Array.isArray(payload.solutions)) {
    throw new Error(getChampionDataFetchErrorMessage(response, payload, localize("进攻解法读取失败", "Failed to load attack solutions")));
  }
  const solutions = payload.solutions.filter((row) => Number(row?.wins) > 0 && /^\d+(\|\d+){4}$/.test(String(row?.attack_key || ""))).slice(0, 5);
  // 与小程序同源的社区解法：历史战绩之后追加，供同一按钮轮换。
  const communitySolutions = (Array.isArray(payload.communitySolutions) ? payload.communitySolutions : [])
    .map((row) => String(row?.attack_key || ""))
    .filter((key) => /^\d+(\|\d+){4}$/.test(key))
    .map((attack_key) => ({ attack_key, community: true }));
  return { solutions, communitySolutions };
}

async function applyNextAttackRecommendation() {
  const context = getAttackRecommendationContext();
  if (!context || attackRecommendationState.loading) return;
  syncAttackRecommendationContext(context);
  // 至少轮完当前全部历史和社区解法，再重新查询；少于五条时保留原来的刷新频率。
  if (attackRecommendationState.clicks === 0 || attackRecommendationState.clicks >= Math.max(5, attackRecommendationState.solutions.length)) {
    attackRecommendationState.loading = true;
    attackRecommendationState.error = "";
    renderResults(getBattleResultsSnapshot());
    try {
      const { solutions, communitySolutions } = await fetchAttackRecommendations(context);
      if (getAttackRecommendationContext()?.key !== context.key) return;
      attackRecommendationState.solutions = [...solutions, ...communitySolutions];
      attackRecommendationState.communityCount = communitySolutions.length;
      attackRecommendationState.clicks = 0;
      if (!attackRecommendationState.solutions.length) {
        attackRecommendationState.error = localize("暂无该防守站位的历史解法或社区解法", "No historical or community solution for this defense lineup");
        return;
      }
    } catch (error) {
      if (getAttackRecommendationContext()?.key === context.key) {
        attackRecommendationState.error = error?.message || localize("进攻解法读取失败", "Failed to load attack solutions");
      }
      return;
    } finally {
      if (getAttackRecommendationContext()?.key === context.key) {
        attackRecommendationState.loading = false;
        renderResults(getBattleResultsSnapshot());
      }
    }
  }
  if (!attackRecommendationState.solutions.length) return;
  const index = attackRecommendationState.clicks % attackRecommendationState.solutions.length;
  const solution = attackRecommendationState.solutions[index];
  const characters = solution.attack_key.split("|").map((id) => getCharacterById(id));
  if (characters.length !== TEAM_SIZE || characters.some((character) => !character)) {
    attackRecommendationState.error = localize("推荐队伍包含未识别角色", "Recommended team contains an unknown character");
    renderResults(getBattleResultsSnapshot());
    return;
  }
  state.team = characters;
  applySavedTeamChargeSpeeds("attack");
  applySavedTeamRedHoodPierceCounts("attack");
  state.universalCharges = Array(TEAM_SIZE).fill(0);
  state.scarletCounterEnabled = Array(TEAM_SIZE).fill(true);
  state.rosannaSacrificeFrames = Array(TEAM_SIZE).fill(null);
  state.jackalLinks.attack = createEmptyJackalLinkState();
  attackRecommendationState.selected = solution;
  attackRecommendationState.selectedIndex = index;
  attackRecommendationState.clicks++;
  attackRecommendationState.error = "";
  saveTeam();
  render();
}

function bindAttackRecommendationActions() {
  els.summaryStrip?.querySelector("[data-winrate-login]")?.addEventListener("click", () => openAccountModal("login"));
  els.summaryStrip?.querySelector("[data-attack-recommend]")?.addEventListener("click", () => void applyNextAttackRecommendation());
}


function getUniqueChampionValues(rows, key) {
  return [...new Set(rows.map((row) => row?.[key]).filter((value) => value !== null && value !== undefined && value !== ""))];
}

function getChampionSeasonFromFile(file = "") {
  const match = String(file || "").match(/(?:^|[-_\s])S(\d+)(?=[^-_\s]*|[-_\s])/i) || String(file || "").match(/S(\d+)/i);
  return match ? `S${Number(match[1])}` : localize("未知赛季", "Unknown season");
}

function getChampionSeason(rowOrFile = "") {
  if (rowOrFile && typeof rowOrFile === "object" && rowOrFile.season) return String(rowOrFile.season);
  return getChampionSeasonFromFile(rowOrFile);
}

function getChampionNameFromFile(file = "") {
  const baseName = String(file || "").replace(/\.xlsx?$/i, "");
  const seasonMatch = baseName.match(/S\d+/i);
  const rawName = seasonMatch ? baseName.slice(seasonMatch.index + seasonMatch[0].length) : baseName;
  return rawName
    .replace(/^[-_\s]+/, "")
    .replace(/\(\d+\)$/g, "")
    .replace(/[-_\s]+$/g, "")
    .trim() || baseName;
}

function getChampionNameFromRows(rows = []) {
  if (!Array.isArray(rows) || !rows.length) return "";
  const championRows = rows.filter((row) => getChampionDivision(row) === "champion");
  const candidateRows = championRows.length ? championRows : rows;
  const matchGroups = getChampionMatchGroups(candidateRows);
  const finalGroups = getChampionRowsByStageRank(matchGroups, 3);
  const finalWinner = getChampionMatchWinnerName(finalGroups[0]?.rows || []);
  if (finalWinner) return finalWinner;
  const rankedGroups = [...matchGroups].sort((a, b) => {
    const rankDiff = getChampionStageRank(b.rows[0]) - getChampionStageRank(a.rows[0]);
    if (rankDiff) return rankDiff;
    return (b.matchNo || 0) - (a.matchNo || 0);
  });
  for (const group of rankedGroups) {
    const winner = getChampionMatchWinnerName(group.rows);
    if (winner) return winner;
  }
  const first = candidateRows[0] || {};
  return first.attack_player || first.defense_player || "";
}

function getChampionDisplayNameForFile(rows = [], file = "") {
  const fileRows = rows.filter((row) => getChampionSourceKey(row) === file);
  const backendChampionName = fileRows.find((row) => row.champion_name)?.champion_name;
  return backendChampionName || getChampionNameFromRows(fileRows) || getChampionNameFromFile(file);
}

function sortChampionSeasons(seasons = []) {
  return [...seasons].sort((a, b) => {
    const left = Number(String(a).match(/\d+/)?.[0] || 0);
    const right = Number(String(b).match(/\d+/)?.[0] || 0);
    return right - left || String(b).localeCompare(String(a));
  });
}

function getChampionDivision(row) {
  if (row?.bracket_type === "champion") return "champion";
  if (row?.bracket_type === "qualifier") return "qualifier";
  const label = String(row?.stage_label || row?.source_label || "");
  return label.includes("冠军争霸赛") ? "champion" : "qualifier";
}

function getChampionStageBaseLabel(row) {
  return String(row?.stage_label || row?.source_label || "")
    .replace(/\s*G\d+\s*$/i, "")
    .trim();
}

function getChampionStageRank(label) {
  if (label && typeof label === "object" && Number.isFinite(Number(label.stage_rank))) return Number(label.stage_rank);
  const text = String(label || "");
  if (text.includes("8进4")) return 1;
  if (text.includes("4进2")) return 2;
  if (text.includes("2进1")) return 3;
  return 9;
}

function getChampionGameNo(row) {
  const direct = Number(row?.game_no);
  if (Number.isInteger(direct) && direct > 0) return direct;
  const match = String(row?.source_label || row?.stage_label || "").match(/G(\d+)/i);
  return match ? Number(match[1]) : null;
}

function getChampionMatchKey(row) {
  const stageLabel = getChampionStageBaseLabel(row);
  const matchNo = Number(row?.match_no);
  if (Number.isInteger(matchNo) && matchNo > 0) return `${stageLabel}::M${matchNo}`;
  return `${stageLabel}::FINAL`;
}

function getChampionMatchDisplay(row) {
  const stageLabel = getChampionStageBaseLabel(row);
  const matchNo = Number(row?.match_no);
  if (Number.isInteger(matchNo) && matchNo > 0) return { stageLabel, matchLabel: `M${matchNo}`, matchNo };
  return { stageLabel, matchLabel: "FINAL", matchNo: 999 };
}

function getChampionFilteredRows() {
  return getChampionRows().filter((row) => {
    if (championDataState.selectedFile && getChampionSourceKey(row) !== championDataState.selectedFile) return false;
    if (getChampionDivision(row) !== championDataState.selectedDivision) return false;
    if (championDataState.selectedDivision === "qualifier" && championDataState.selectedGroup && String(row.stage_group || "") !== String(championDataState.selectedGroup)) return false;
    return true;
  });
}

function getChampionMatchGroups(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const key = getChampionMatchKey(row);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  });
  return [...map.entries()]
    .map(([key, matchRows]) => {
      const display = getChampionMatchDisplay(matchRows[0]);
      return {
        key,
        ...display,
        rows: matchRows.sort((a, b) => (getChampionGameNo(a) || 0) - (getChampionGameNo(b) || 0)),
      };
    })
    .sort((a, b) => {
      const stageDiff = getChampionStageRank(a.rows[0]) - getChampionStageRank(b.rows[0]);
      if (stageDiff) return stageDiff;
      return (a.matchNo || 0) - (b.matchNo || 0);
    });
}

function getChampionMatchSummary(matchRows = []) {
  const attackWins = matchRows.filter((row) => row.winner === "attack").length;
  const defenseWins = matchRows.filter((row) => row.winner === "defense").length;
  const first = matchRows[0] || {};
  return {
    attackWins,
    defenseWins,
    winner: attackWins > defenseWins ? "attack" : defenseWins > attackWins ? "defense" : "unknown",
    attackPlayer: first.attack_player || localize("攻方", "Attack"),
    defensePlayer: first.defense_player || localize("守方", "Defense"),
    label: first.source_label || "",
  };
}

function getChampionMatchWinnerName(matchRows = []) {
  const summary = getChampionMatchSummary(matchRows);
  if (summary.winner === "attack") return summary.attackPlayer;
  if (summary.winner === "defense") return summary.defensePlayer;
  return "";
}

function getChampionMatchLoserName(matchRows = []) {
  const summary = getChampionMatchSummary(matchRows);
  if (summary.winner === "attack") return summary.defensePlayer;
  if (summary.winner === "defense") return summary.attackPlayer;
  return "";
}

function getChampionPlayerRows(rows = [], playerName = "") {
  const normalizedPlayer = String(playerName || "");
  if (!normalizedPlayer) return [];
  return rows
    .filter((row) => row.attack_player === normalizedPlayer || row.defense_player === normalizedPlayer)
    .sort((a, b) => {
      const stageDiff = getChampionStageRank(getChampionStageBaseLabel(a)) - getChampionStageRank(getChampionStageBaseLabel(b));
      if (stageDiff) return stageDiff;
      const matchDiff = (Number(a.match_no) || 999) - (Number(b.match_no) || 999);
      if (matchDiff) return matchDiff;
      return (getChampionGameNo(a) || 0) - (getChampionGameNo(b) || 0);
    });
}

function getChampionRowsByMatchKey(rows = [], matchKey = "") {
  const normalizedKey = String(matchKey || "");
  if (!normalizedKey) return [];
  return rows
    .filter((row) => getChampionMatchKey(row) === normalizedKey)
    .sort((a, b) => (getChampionGameNo(a) || 0) - (getChampionGameNo(b) || 0));
}

function getChampionRowsByStageRank(matchGroups = [], rank) {
  return matchGroups
    .filter((group) => getChampionStageRank(group.rows[0]) === rank)
    .sort((a, b) => (a.matchNo || 0) - (b.matchNo || 0));
}

function getChampionEntrantNodes(round1Groups = []) {
  return round1Groups.flatMap((group) => {
    const first = group.rows[0] || {};
    return [
      {
        playerName: first.attack_player || "",
        matchKey: group.key,
        side: "attack",
        stageLabel: group.stageLabel,
        scoreText: "",
        isWinner: getChampionMatchWinnerName(group.rows) === first.attack_player,
      },
      {
        playerName: first.defense_player || "",
        matchKey: group.key,
        side: "defense",
        stageLabel: group.stageLabel,
        scoreText: "",
        isWinner: getChampionMatchWinnerName(group.rows) === first.defense_player,
      },
    ];
  }).filter((node) => node.playerName);
}

function getChampionWinnerNodes(groups = []) {
  return groups.map((group) => {
    const summary = getChampionMatchSummary(group.rows);
    return {
      playerName: getChampionMatchWinnerName(group.rows),
      loserName: getChampionMatchLoserName(group.rows),
      matchKey: group.key,
      side: summary.winner,
      stageLabel: group.stageLabel,
      scoreText: `${summary.attackWins}:${summary.defenseWins}`,
      isWinner: true,
    };
  }).filter((node) => node.playerName);
}

let championDataUiModulePromise = null;

async function loadChampionDataUiModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!championDataUiModulePromise) {
    championDataUiModulePromise = runtime.loadAppModule("champion-data-ui", () => importAppModule("./modules/champion-data-ui.js"));
  }
  const module = await championDataUiModulePromise;
  module.setChampionDataUiApi({
    state,
    championDataState,
    teamSize: TEAM_SIZE,
    paidArenaTeamCounts: PAID_ARENA_TEAM_COUNTS,
    championAllSeasonsKey: CHAMPION_ALL_SEASONS_KEY,
    escapeHtml,
    localize,
    resolveChampionCharacterId,
    getCharacterById,
    getChampionCharacterByName,
    getTeamSlotRarityClass,
    getAvatarMarkup,
    getImmutableAssetUrl,
    getCharacterLocalizedName,
    getTeamLabel,
    getChampionRowsByMatchKey,
    getChampionFilteredRows,
    getChampionMatchSummary,
    getChampionMatchWinnerName,
    getChampionMatchLoserName,
    getChampionStageRank,
    getChampionStageBaseLabel,
    getChampionGameNo,
    getChampionRows,
    getChampionSourceKey,
    getChampionSeason,
    sortChampionSeasons,
    getChampionDisplayNameForFile,
    loadChampionFileRows,
    loadChampionTeamStats,
    refreshChampionMatchRows,
    isChampionStatsPayload,
    getChampionDivision,
    getUniqueChampionValues,
    getChampionMatchGroups,
    getChampionRowsByStageRank,
    closeChampionPlayerDetailModal,
    getChargeChartSize,
    getChampionTeamCharacters,
    getChampionTeamSavedChargeSpeeds,
    getChampionTeamSavedRedHoodPierceCounts,
    getChampionTeamSavedScarletCounterEnabled,
    getChampionTeamSavedRosannaSacrificeFrames,
    simulateBattle,
    getChargeChartMarkup,
    formatFrame,
    getPaidArenaModeLabel,
    getPaidArenaDataTeamKey,
    computePaidArenaBattleResultsForRow,
    normalizeTeamKey,
    getPaidArenaResultText,
    getTauntTargetState,
    getEffectiveLinkOwnerForTeam,
    isEffectiveLinkEnabledForTeam,
    getEffectiveLinkTargetIdsForTeam,
    isRosanna,
    sanitizeSacrificeFrame,
    getCubeIconSrc,
    getSavedCharacterCubeType,
    sanitizeUniversalCharge,
    canShowFinishMarker,
    isRedHood,
    sanitizeRedHoodPierceCount,
    isScarlet,
    sanitizeScarletCounterEnabled,
    formatChargeNumber,
    formatNumber,
    canEditChargeSpeed,
    sanitizeChargeSpeed,
    getDisplayMagazine,
    isLocalDevRuntime,
    getStandardChargeBand,
    getRosannaSacrificeFrameState,
    getRedHoodPierceCountState,
    getScarletCounterEnabledState,
    normalizeJackalLink,
    getSavedCharacterChargeSpeed,
    getSavedCharacterRedHoodPierceCount,
    createEmptyJackalLinkState,
    isJackal,
    isLinkProvider,
    createEmptyPaidArenaLineupSlot,
    normalizePaidArenaLineupSlot,
    isPaidArenaModeActive,
    saveCurrentPaidArenaLineupSlot,
    ensurePaidArenaLineupSlots,
    getPaidArenaLineupSlotCount,
    loadPaidArenaLineupSlot,
    syncPaidArenaChargeSpeedsFromSavedData,
    closeChampionDataModal,
    hideChartTooltip,
    saveTeam,
    render,
    showToast,
    clearOpenSettings: () => {
      openSlotSettings = null;
      openRosannaSacrificeSettings = null;
    },
    withPaidArenaSimulationState,
    getStunWindowsForTeam,
    getDodgedStunEventsForTeam,
    simulateBurst,
    getSpecialChargeEventsForTeam,
    getSharedBattleCalculationEndFrame,
    getResultSignature,
  });
  return module;
}

function openChampionPlayerDetailModal(playerName, matchKey = "", detailMode = "match", alternateMatchKey = "", alternateMatchLabel = "") {
  void loadChampionDataUiModule().then((module) => module.openChampionPlayerDetailModal(playerName, matchKey, detailMode, alternateMatchKey, alternateMatchLabel));
}

function renderChampionDataModalContent(backdrop) {
  void loadChampionDataUiModule().then((module) => module.renderChampionDataModalContent(backdrop));
}

async function getChampionDataRequestHeaders() {
  const session = await refreshAuthSessionIfNeeded();
  if (!session?.accessToken) {
    throw new Error(localize("\u51a0\u519b\u7ade\u6280\u573a\u8d5b\u5b63\u6570\u636e\u9700\u8981\u767b\u5f55\u540e\u67e5\u770b", "Champion arena season data requires sign-in."));
  }
  return {
    accept: "application/json",
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${session.accessToken}`,
  };
}

function getChampionDataFetchErrorMessage(response, payload, fallbackMessage) {
  if (response?.status === 401 || payload?.code === "UNAUTHENTICATED") {
    handleRejectedAuthSessionResponse(response, payload);
    return localize("\u51a0\u519b\u7ade\u6280\u573a\u8d5b\u5b63\u6570\u636e\u9700\u8981\u767b\u5f55\u540e\u67e5\u770b", "Champion arena season data requires sign-in.");
  }
  if (response?.status === 403 || payload?.code === "SEASON_DATA_REQUIRED") {
    return localize("\u5f53\u524d\u8d26\u53f7\u6ca1\u6709\u51a0\u519b\u7ade\u6280\u573a\u8d5b\u5b63\u6570\u636e\u6743\u9650", "This account does not have champion arena season data access.");
  }
  const code = payload?.code ? `: ${payload.code}` : "";
  return `${fallbackMessage}${code}`;
}
let championDataServiceModulePromise = null;

async function loadChampionDataServiceModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!championDataServiceModulePromise) {
    championDataServiceModulePromise = runtime.loadAppModule("champion-data-service", () => importAppModule("./modules/champion-data-service.js"));
  }
  const module = await championDataServiceModulePromise;
  module.setChampionDataServiceApi({
    endpoint: SUPABASE_CHAMPION_MATCHES_ENDPOINT,
    authenticatedFetch,
    getChampionDataRequestHeaders,
    getChampionDataFetchErrorMessage,
    localize,
    championDataState,
    renderChampionDataModalContent,
    isChampionStatsPayload,
    getChampionStatsSignature,
  });
  return module;
}

async function fetchChampionMatchRows(sourceFile) {
  return (await loadChampionDataServiceModule()).fetchChampionMatchRows(sourceFile);
}

async function fetchChampionMatchRowsMeta() {
  return (await loadChampionDataServiceModule()).fetchChampionMatchRowsMeta();
}

async function fetchChampionTeamStats(season, side, currentSignature = "", teamKey = "") {
  return (await loadChampionDataServiceModule()).fetchChampionTeamStats(season, side, currentSignature, teamKey);
}
async function loadChampionFileRows(backdrop, sourceFile = championDataState.selectedFile) {
  return (await loadChampionDataServiceModule()).loadChampionFileRows(backdrop, sourceFile);
}

async function loadChampionTeamStats(backdrop, season = championDataState.selectedSeason, side = championDataState.selectedStatSide) {
  return (await loadChampionDataServiceModule()).loadChampionTeamStats(backdrop, season, side);
}

async function refreshChampionMatchRows(backdrop) {
  return (await loadChampionDataServiceModule()).refreshChampionMatchRows(backdrop);
}

async function openChampionDataModal() {
  const storedSession = state.authSession || getStoredAuthSession();
  const hasSession = Boolean(storedSession?.accessToken);
  const shouldRefreshAccountStatus = hasSession && !canUseSeasonDataFeature();
  if (!hasSession && !canUseSeasonDataFeature()) {
    showToast(localize("\u51a0\u519b\u7ade\u6280\u573a\u8d5b\u5b63\u6570\u636e\u9700\u8981\u767b\u5f55\u540e\u67e5\u770b", "Champion arena season data requires sign-in."));
    openAccountModal("login");
    return;
  }
  closeChampionDataModal();
  championDataState.selectedSeason = "";
  championDataState.selectedServerRegion = "cn";
  championDataState.selectedFile = "";
  championDataState.selectedModule = "matches";
  championDataState.selectedStatSide = "combined";
  championDataState.selectedStatRankType = "recommend";
  championDataState.selectedDivision = "champion";
  championDataState.selectedGroup = "";
  championDataState.selectedMatchNo = null;
  championDataState.selectedPlayerName = "";
  championDataState.loading = shouldRefreshAccountStatus;
  championDataState.loadingMode = shouldRefreshAccountStatus ? "meta" : "";
  championDataState.error = "";
  const backdrop = document.createElement("div");
  backdrop.className = "help-modal-backdrop champion-data-modal-backdrop";
  backdrop.innerHTML = `
    <section class="help-modal champion-data-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(localize("\u51a0\u519b\u7ade\u6280\u573a\u8d5b\u5b63\u6570\u636e", "Champion Arena Season Data"))}">
      <div class="help-modal-head">
        <div>
          <span class="help-modal-kicker">Champion</span>
          <strong>${escapeHtml(localize("\u51a0\u519b\u7ade\u6280\u573a\u8d5b\u5b63\u6570\u636e", "Champion Arena Season Data"))}</strong>
        </div>
        <button class="help-modal-close" type="button" aria-label="${escapeHtml(localize("\u5173\u95ed", "Close"))}">X</button>
      </div>
      <div class="help-modal-content champion-data-content"></div>
    </section>
  `;
  document.body.append(backdrop);
  backdrop.querySelector(".help-modal-close")?.addEventListener("click", closeChampionDataModal);
  renderChampionDataModalContent(backdrop);
  if (shouldRefreshAccountStatus) {
    await refreshAccountStatus().catch(() => null);
    championDataState.loading = false;
    championDataState.loadingMode = "";
    if (!canUseSeasonDataFeature()) {
      closeChampionDataModal();
      showToast(localize("\u5f53\u524d\u8d26\u53f7\u7f3a\u5c11\u6743\u9650\uff1a\u51a0\u519b\u7ade\u6280\u573a\u8d5b\u5b63\u6570\u636e", "Current account lacks permission: Champion Arena Season Data."));
      return;
    }
  }
  void refreshChampionMatchRows(backdrop);
}
async function copyCharacterDetails(character) {
  try {
    await copyTextToClipboard(getCharacterDetailText(character));
    showToast(localize(`已复制 ${character.name} 的详细信息`, `Copied details for ${getCharacterLocalizedName(character)}`));
  } catch {
    showToast(localize("复制失败，请检查浏览器剪切板权限", "Copy failed. Please check clipboard permission."));
  }
}

let teamShareActionsModulePromise = null;

async function loadTeamShareActionsModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!teamShareActionsModulePromise) {
    teamShareActionsModulePromise = runtime.loadAppModule("team-share-actions", () => importAppModule("./modules/team-share-actions.js"));
  }
  const module = await teamShareActionsModulePromise;
  module.setTeamShareActionsApi({
    getBattleResultsCopyText,
    showToast,
    localize,
    copyBattleResultsWithChart,
    copyTextToClipboard,
    getArenaCopyText,
    isPaidArenaModeActive,
    choosePaidArenaShareMode,
    copyCurrentArenaImage,
    copyRichImageToClipboard,
    startProgressToast,
    stopProgressToast,
    getArenaShareFallbackText,
    isMobileCopyChoiceRuntime,
    openShareImagePreview,
    getCurrentTeamShareUrl,
    openHelpWorkflowPreview,
    canRequestTeamHelp: () => isHelpCenterSolvableArenaMode(getCurrentHelpCenterArenaMode()),
    escapeHtml,
  });
  return module;
}

async function copyBattleResultsSummary() {
  return (await loadTeamShareActionsModule()).copyBattleResultsSummary();
}

async function copyArenaImageSummary(options = {}) {
  return (await loadTeamShareActionsModule()).copyArenaImageSummary(options);
}

async function shareArenaImageSummary() {
  return (await loadTeamShareActionsModule()).shareArenaImageSummary();
}

async function shareCurrentTeamUrl() {
  return (await loadTeamShareActionsModule()).shareCurrentTeamUrl();
}

async function handleCopyButtonClick() {
  return (await loadTeamShareActionsModule()).handleCopyButtonClick();
}
function suppressContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
}

let floatingControlsModalModulePromise = null;

async function loadFloatingControlsModalModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!floatingControlsModalModulePromise) {
    floatingControlsModalModulePromise = runtime.loadAppModule("floating-controls-modal", () => importAppModule("./modules/floating-controls-modal.js"));
  }
  return floatingControlsModalModulePromise;
}

function updateFloatingControlsModalState() {
  void loadFloatingControlsModalModule().then((module) => module.updateFloatingControlsModalState());
}

function initFloatingControlsModalObserver() {
  void loadFloatingControlsModalModule().then((module) => module.initFloatingControlsModalObserver());
}
let helpCenterUiModulePromise = null;
let helpCenterUiModuleInstance = null;

function getHelpCenterUiApi() {
  return {
    state,
    els,
    endpoint: SUPABASE_HELP_CENTER_ENDPOINT,
    getPrivateHelpRows: async scope => (await getPrivateHelpClient()).list(scope),
    openPrivateHelp: options => void openPrivateHelpModal(options),
    shareUrlParam: HELP_CENTER_SHARE_URL_PARAM,
    teamSize: TEAM_SIZE,
    localize,
    escapeHtml,
    showToast,
    handleRejectedAuthSessionResponse,
    getHelpCenterHeaders,
    authenticatedFetch,
    buildHelpCenterPayload,
    openHelpWorkflowPreview,
    isHelpCenterSolvableArenaMode,
    hasHelpCenterSideMembers,
    findSolvedHelpCenterRequestForDefense,
    toHelpCenterProtocolPayload,
    getHelpCenterPayloadForRequestMode,
    getHelpCenterExportPayload,
    beginHelpCenterSolveWorkspace,
    getHelpCenterSolveDraft,
    discardHelpCenterSolveDraft,
    clearHelpCenterSolveDraft,
    render,
    getHelpCenterModeLabel,
    getHelpCenterRegionLabel,
    getHelpCenterRows,
    getHelpCenterPayloadChargeLabel,
    getCharacterById,
    getCharacterLocalizedName,
    getAvatarMarkup,
    getTeamSlotRarityClass,
    renderHelpCenterTeamSlot,
    recommendationGuideToPngBlob,
    copyRichImageToClipboard,
    isMobileCopyChoiceRuntime,
    openShareImagePreview,
    startProgressToast,
    stopProgressToast,
    recommendationShareUrlParam: RECOMMENDATION_SHARE_URL_PARAM,
    renderFeatureTouchCard,
    bindFeatureTouchCards,
    requireHelpCenterLogin,
    enterRecommendationCaptureWorkspace,
    copyTextToClipboard,
    normalizeHelpCenterRequestId,
  };
}

async function loadHelpCenterUiModule() {
  const runtime = await refreshAppRuntimeContext();
  if (!helpCenterUiModulePromise) {
    helpCenterUiModulePromise = runtime.loadAppModule("help-center-ui", () => importAppModule("./modules/help-center-ui.js"));
  }
  const module = await helpCenterUiModulePromise;
  helpCenterUiModuleInstance = module;
  module.setHelpCenterUiApi(getHelpCenterUiApi());
  return module;
}

function closeHelpCenterModal() {
  if (helpCenterUiModuleInstance?.closeHelpCenterModal) {
    helpCenterUiModuleInstance.closeHelpCenterModal();
    return;
  }
  document.querySelector(".help-center-modal-backdrop")?.remove();
}

async function getPrivateHelpClient() {
  if(!privateHelpClientPromise)privateHelpClientPromise=importAppModule('./modules/private-help-service.js').then(({createPrivateHelpClient})=>createPrivateHelpClient({endpoint:SUPABASE_HELP_CENTER_ENDPOINT,headers:()=>getHelpCenterHeaders(false),getScope:()=>state.authSession?.user?.id||state.authSession?.accessToken||'',request:(...args)=>authenticatedFetch(...args,{requireAuth:false})})).catch(error=>{privateHelpClientPromise=null;throw error;});
  return privateHelpClientPromise;
}

function applyPrivateHelpTeamPayload(raw, sides = ['defense','attack']) {
  const payload=getHelpCenterPayloadForRequestMode(raw,raw.mode),paid=payload.mode==='special';
  for(const side of sides)for(let row=0;row<(paid?3:1);row++){
    const values=field=>payload[field]?.[side]?.[row]||[];
    const team=values('teams').map((id,i)=>{const c=getCharacterById(id);return c?{...c,useArca:raw.useArca?.[side]?.[row]?.[i]===true}:null;});
    const settings={team,chargeSpeeds:values('chargeSpeeds'),universalCharges:values('universalCharges'),redHoodPierceCounts:values('redHoodPierceCounts'),scarletCounterEnabled:values('scarletCounterEnabled'),rosannaSacrificeFrames:values('rosannaSacrificeFrames'),cubeTypes:values('cubeTypes'),magazines:values('magazines'),jackalLink:payload.jackalLinks?.[side]?.[row]||createEmptyJackalLinkState()};
    if(paid){
      for(const [store,field] of [['paidArenaTeams','team'],['paidArenaChargeSpeeds','chargeSpeeds'],['paidArenaUniversalCharges','universalCharges'],['paidArenaRedHoodPierceCounts','redHoodPierceCounts'],['paidArenaScarletCounterEnabled','scarletCounterEnabled'],['paidArenaRosannaSacrificeFrames','rosannaSacrificeFrames'],['paidArenaJackalLinks','jackalLink']])state[store].p[side][row]=settings[field];
    }else{
      const prefix=side==='defense'?'defense':'';
      state[side==='defense'?'defenseTeam':'team']=team;
      for(const field of ['chargeSpeeds','universalCharges','redHoodPierceCounts','scarletCounterEnabled','rosannaSacrificeFrames'])state[prefix?prefix+field[0].toUpperCase()+field.slice(1):field]=settings[field];
      state.jackalLinks[side]=settings.jackalLink;
    }
    rememberHelpCenterShareRowSettings(settings,side);
  }
}

function materializePrivateHelpResult(item, draft) {
  const payload=getHelpCenterPayloadForRequestMode(draft.payload,item.arenaMode),borrowed=draft.privateHelp;
  if(!borrowed)return payload;
  const side=item.purpose;
  payload.useArca={};
  for(const targetSide of ['defense','attack'])payload.useArca[targetSide]=payload.teams[targetSide].map((row,r)=>row.map((_id,i)=>{
    const member=item.arenaMode==='special'?draft.snapshot.paidArenaTeams.p[targetSide][r][i]:draft.snapshot[targetSide==='defense'?'defenseTeam':'team'][i];
    return typeof member?.useArca==='boolean'?member.useArca:targetSide===side;
  }));
  payload.teams[side].forEach((row,r)=>row.forEach((id,i)=>{
    const member=item.arenaMode==='special'?draft.snapshot.paidArenaTeams.p[side][r][i]:draft.snapshot[side==='defense'?'defenseTeam':'team'][i];
    const value=member?.useArca===false?null:borrowed.parameters[id];
    if(!value)return;
    payload.chargeSpeeds[side][r][i]=value.chargeSpeed;
    payload.magazines[side][r][i]=value.magazine;
    payload.cubeTypes[side][r][i]=value.displayCubeType||value.cubeType;
    payload.cubeIds[side][r][i]=getCubeTypeId(value.displayCubeType||value.cubeType);
  }));
  delete payload.shareParams;
  return payload;
}

async function openPrivateHelpModal(options) {
  pendingPrivateHelpOptions=null;
  if(state.helpCenter.solveWorkspace){if(!parkHelpCenterSolveWorkspace())return;render();}
  try{
    const [client,ui,legacy]=await Promise.all([getPrivateHelpClient(),importAppModule('./modules/private-help-ui.js'),loadHelpCenterUiModule()]);
    closeHelpCenterModal();
    await ui.openPrivateHelp({client,escapeHtml,showToast,copy:copyTextToClipboard,
      openAccount:()=>{pendingPrivateHelpOptions={...options};void openAccountModal();},
      renderShell:legacy.renderHelpCenterModalShell,
      renderLayout:legacy.renderHelpCenterDetailLayout,
      renderCard:legacy.renderHelpCenterDisplayCard,
      getDraft:id=>getHelpCenterSolveDraft(id,{privateHelp:true,round:client.get(id)?.round}),
      prepareResult:materializePrivateHelpResult,
      finish:id=>{discardHelpCenterSolveDraft(id,{privateHelp:true,round:client.get(id)?.round});clearHelpCenterSolveDraft(id);render();},
      openHub:()=>openHelpCenterModal({view:'list',scope:client.get(options.id)?.isMine?'mine':'solutions',resetFilters:true}),
      start:async(item,profile,isCurrent=()=>true)=>{
        const [{createArcaIdentityTools},{createArcaDetailTools},{arcaChargeParameters}]=await Promise.all([importAppModule('./modules/arca-character-identity.js'),importAppModule('./modules/arca-character-data.js'),importAppModule('./modules/arca-charge-parameters.js')]);
        const presentation=Object.fromEntries(CHARACTERS.map(c=>[String(c.id),{...c,primaryName:c.name,assetName:getExternalEquipmentCharacterName(c)}]));
        const identity=createArcaIdentityTools(presentation),record={data:{characterList:extractThirdPartyCharacterList({data:profile})}};
        if(!record.data.characterList.length)throw Error('发起者的阿卡角色列表为空，暂时无法配队。');
        const lookup=createArcaDetailTools(identity).createRecordLookup(CHARACTERS,record),parameters={},marks=new Set();
        for(const c of CHARACTERS){const row=lookup(c);if(row){marks.add(identity.arcaCharacterKey(c));const value=arcaChargeParameters(c,row);if(value)parameters[c.id]=value;}}
        const privateHelp={item,parameters,marks,characterKey:identity.arcaCharacterKey};
        if(!isCurrent())return false;
        if(!beginHelpCenterSolveWorkspace({id:item.id,title:item.description,arenaMode:item.arenaMode,region:item.region,defensePayload:item.payload},{privateHelp}))throw Error('邀请队伍无法载入，请刷新邀请。');
        if(item.purpose==='defense'){if(item.arenaMode==='normal')setActiveTeam('defense');else state.paidArenaDataTeamKey='defense';}
        render();els.teamSlots?.scrollIntoView({behavior:'smooth',block:'start'});return true;
      },
      importResult:async(item,payload,slot)=>{
        if(state.helpCenter.solveWorkspace){if(!parkHelpCenterSolveWorkspace())throw Error('请先返回解题。');}
        if(payload.useArca?.[item.purpose]?.some(row=>row.some(Boolean))){
          const arca=await loadArcaWorkspace();
          if(!await arca.setEnabled(true))throw Error('请先登录并保存自己的阿卡 Key 后导入。');
        }
        saveTeam();state.filters.region=item.region;
        if(item.arenaMode==='normal'){state.paidArenaMode='normal';state.activeLineupIndex=slot;loadLineupSlot(slot);}
        else{state.paidArenaMode='p';state.paidArenaActiveLineupIndex.p=slot;loadPaidArenaLineupSlot('p',slot);}
        applyPrivateHelpTeamPayload(payload,item.purpose==='defense'?['defense']:['defense','attack']);
        saveTeam();invalidateBattleResults();render();
      },
    },options);
  }catch(error){showToast(error.message||'私人求助加载失败，请重试。');}
}

async function openHelpWorkflowPreview(options = {}) {
  if (state.helpCenter.solveWorkspace) {
    if (!parkHelpCenterSolveWorkspace()) return;
    render();
  }
  if (!options.requestId && !isHelpCenterSolvableArenaMode(getCurrentHelpCenterArenaMode())) {
    showToast(localize("求助仅支持普通和特殊竞技场", "Help is available for Normal and Special Arena only."));
    return;
  }
  try {
    const [preview, legacy] = await Promise.all([
      importAppModule("./modules/help-workflow-preview.js"),
      loadHelpCenterUiModule(),
    ]);
    closeHelpCenterModal();
    const currentPayload = buildHelpCenterPayload();
    const hasTargetDefense = getHelpCenterRows(currentPayload, "defense").some(row => row.some(Boolean));
    preview.openHelpWorkflowPreview({
      buildPayload: () => currentPayload,
      createPrivate: async body => {
        if (!getHelpCenterAuthSession()?.accessToken) {
          document.querySelector('.help-workflow-backdrop')?.dispatchEvent(new Event('help-close'));
          requireHelpCenterLogin();throw Error('请登录后再创建私人求助。');
        }
        return (await getPrivateHelpClient()).create(body);
      },
      openPrivate: id => void openPrivateHelpModal({id}),
      getWorkspacePayload: buildHelpCenterPayload,
      escapeHtml,
      renderTeams: (payload, side) => legacy.renderHelpCenterTeamRows(payload, side),
      preparePayload: (payload) => getHelpCenterPayloadForRequestMode(payload, payload.mode),
      getCharacters: (region) => CHARACTERS.filter(character => !character.isHidden && character.regions.includes(region)),
      getCharacterById,
      getAvatarMarkup,
      getCharacterLocalizedName,
      getChargeLabel: getHelpCenterPayloadChargeLabel,
      sharePreviewImage: (detail) => legacy.shareHelpCenterImage(detail, { preview: true }),
      getPreviewSolveDraft: (id) => getHelpCenterSolveDraft(id, { preview: true }),
      startPreviewSolve: (item, recipient) => {
        const request = { id: item.id, title: item.description || "竞技场解题", arenaMode: item.payload.mode, region: item.payload.region, defensePayload: item.payload, isMine: !recipient };
        if (!beginHelpCenterSolveWorkspace(request, { preview: true, recipient })) {
          showToast(localize("题目队伍数据异常，无法载入", "Topic team data is invalid."));
          return false;
        }
        render();
        els.teamSlots?.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      },
      finishPreviewSolve: (id) => { discardHelpCenterSolveDraft(id, { preview: true }); clearHelpCenterSolveDraft(id); render(); },
      showToast,
      openHub: (scope) => openHelpCenterModal({ view: "list", scope, resetFilters: true }),
    }, { ...options, purpose: options.purpose || (hasTargetDefense ? "attack" : "defense") });
  } catch (error) {
    console.warn("[HelpWorkflow] preview failed", error);
    showToast("互助预览加载失败，请重试");
  }
}

function openHelpCenterModal(options = {}) {
  if (state.helpCenter.solveWorkspace) {
    if (!parkHelpCenterSolveWorkspace()) return;
    render();
    if (!options.requestId) options = { ...options, startOnSelect: true };
  }
  void loadHelpCenterUiModule()
    .then((module) => module.openHelpCenterModal(options))
    .catch((error) => {
      console.warn("[HelpCenter] ui module failed", error);
      showToast(localize("\u4e92\u52a9\u754c\u9762\u52a0\u8f7d\u5931\u8d25", "Failed to load help center."));
    });
}

function getHelpCenterModeLabel(mode) {
  if (mode === "champion") return localize("\u51a0\u519b", "Champion");
  if (mode === "special") return localize("\u7279\u6b8a", "Special");
  return localize("\u666e\u901a", "Normal");
}

function normalizeHelpCenterRegion(region) {
  return region === "global" ? "global" : "cn";
}

function getHelpCenterRegionLabel(region) {
  return normalizeHelpCenterRegion(region) === "global"
    ? localize("\u56fd\u9645\u670d", "Global")
    : localize("\u56fd\u670d", "CN");
}

function getCurrentHelpCenterArenaMode() {
  if (state.paidArenaMode === "c") return "champion";
  if (state.paidArenaMode === "p") return "special";
  return "normal";
}

function getHelpCenterRegion() {
  return state.filters.region === "global" ? "global" : "cn";
}

function getHelpCenterShareParamsObject() {
  return Object.fromEntries(getCurrentTeamShareParams().map(([key, value]) => [key, String(value)]));
}

function getHelpCenterPayloadModeFromShareParams(shareParams = {}) {
  const mode = getTeamShareModeFromUrl(shareParams.mode || "n");
  if (mode === "c") return "champion";
  if (mode === "p") return "special";
  return "normal";
}

function buildHelpCenterRowsFromShareParams(shareParams = {}) {
  const params = new URLSearchParams();
  Object.entries(shareParams || {}).forEach(([key, value]) => params.set(key, String(value)));
  const modeCode = shareParams.mode || "n";
  const mode = getTeamShareModeFromUrl(modeCode);
  const teamCount = mode === "normal" ? 1 : PAID_ARENA_TEAM_COUNTS[mode] || 0;
  const rows = {
    teams: { defense: [], attack: [] },
    chargeSpeeds: { defense: [], attack: [] },
    universalCharges: { defense: [], attack: [] },
    redHoodPierceCounts: { defense: [], attack: [] },
    scarletCounterEnabled: { defense: [], attack: [] },
    rosannaSacrificeFrames: { defense: [], attack: [] },
    cubeTypes: { defense: [], attack: [] },
    cubeIds: { defense: [], attack: [] },
    magazines: { defense: [], attack: [] },
    jackalLinks: { defense: [], attack: [] },
  };
  for (let index = 1; index <= teamCount; index += 1) {
    const attackRow = getTeamShareSideRowParams(params, "attack", index);
    const defenseRow = getTeamShareSideRowParams(params, "defence", index);
    rows.teams.attack.push(attackRow.team.map((member) => member?.id || null));
    rows.teams.defense.push(defenseRow.team.map((member) => member?.id || null));
    rows.chargeSpeeds.attack.push([...attackRow.chargeSpeeds]);
    rows.chargeSpeeds.defense.push([...defenseRow.chargeSpeeds]);
    rows.universalCharges.attack.push([...attackRow.universalCharges]);
    rows.universalCharges.defense.push([...defenseRow.universalCharges]);
    rows.redHoodPierceCounts.attack.push([...attackRow.redHoodPierceCounts]);
    rows.redHoodPierceCounts.defense.push([...defenseRow.redHoodPierceCounts]);
    rows.scarletCounterEnabled.attack.push([...attackRow.scarletCounterEnabled]);
    rows.scarletCounterEnabled.defense.push([...defenseRow.scarletCounterEnabled]);
    rows.rosannaSacrificeFrames.attack.push([...attackRow.rosannaSacrificeFrames]);
    rows.rosannaSacrificeFrames.defense.push([...defenseRow.rosannaSacrificeFrames]);
    rows.cubeTypes.attack.push([...attackRow.cubeTypes]);
    rows.cubeTypes.defense.push([...defenseRow.cubeTypes]);
    rows.cubeIds.attack.push(attackRow.cubeTypes.map(getCubeTypeId));
    rows.cubeIds.defense.push(defenseRow.cubeTypes.map(getCubeTypeId));
    rows.magazines.attack.push([...attackRow.magazines]);
    rows.magazines.defense.push([...defenseRow.magazines]);
    rows.jackalLinks.attack.push({ ...attackRow.jackalLink, targetIds: [...(attackRow.jackalLink.targetIds || [])] });
    rows.jackalLinks.defense.push({ ...defenseRow.jackalLink, targetIds: [...(defenseRow.jackalLink.targetIds || [])] });
  }
  return rows;
}

function buildHelpCenterPayload() {
  saveTeam();
  if (isPaidArenaModeActive()) saveCurrentPaidArenaLineupSlot(state.paidArenaMode);
  const shareParams = getHelpCenterShareParamsObject();
  const mode = getHelpCenterPayloadModeFromShareParams(shareParams);
  const base = {
    version: 1,
    mode,
    region: getHelpCenterRegion(),
    shareParams,
    appVersion: APP_VERSION,
    createdAt: new Date().toISOString(),
  };
  return { ...base, ...buildHelpCenterRowsFromShareParams(shareParams) };
}

function toHelpCenterProtocolPayload(payload = {}) {
  const protocolPayload = JSON.parse(JSON.stringify(payload || {}));
  ["defense", "attack"].forEach((side) => {
    const cubeTypes = protocolPayload.cubeTypes?.[side];
    if (!protocolPayload.cubeIds) protocolPayload.cubeIds = { defense: [], attack: [] };
    if (!Array.isArray(protocolPayload.cubeIds[side]) && Array.isArray(cubeTypes)) {
      protocolPayload.cubeIds[side] = cubeTypes.map((row) => (
        Array.isArray(row) ? row.map(getCubeTypeId) : Array(TEAM_SIZE).fill(0)
      ));
    }
  });
  delete protocolPayload.cubeTypes;
  return protocolPayload;
}

function getHelpCenterTeamCountForMode(mode) {
  if (mode === "special") return PAID_ARENA_TEAM_COUNTS.p || 3;
  return 1;
}

function cloneHelpCenterRowsForMode(rows = [], count = 1, fillValue = null) {
  return Array.from({ length: count }, (_, index) => (
    Array.isArray(rows[index]) ? [...rows[index]] : Array(TEAM_SIZE).fill(fillValue)
  ));
}

function sanitizeHelpCenterMagazine(value) {
  const magazine = Math.floor(Number(value) || 0);
  return magazine > 0 ? sanitizeMagazine(magazine) : 0;
}

function getHelpCenterPayloadForRequestMode(payload, requestMode) {
  const mode = isHelpCenterSolvableArenaMode(requestMode) ? requestMode : "normal";
  const count = getHelpCenterTeamCountForMode(mode);
  const nextPayload = {
    ...payload,
    mode,
    teams: { defense: [], attack: [] },
    chargeSpeeds: { defense: [], attack: [] },
    universalCharges: { defense: [], attack: [] },
    redHoodPierceCounts: { defense: [], attack: [] },
    scarletCounterEnabled: { defense: [], attack: [] },
    rosannaSacrificeFrames: { defense: [], attack: [] },
    cubeTypes: { defense: [], attack: [] },
    cubeIds: { defense: [], attack: [] },
    magazines: { defense: [], attack: [] },
    jackalLinks: { defense: [], attack: [] },
  };
  ["defense", "attack"].forEach((side) => {
    nextPayload.teams[side] = cloneHelpCenterRowsForMode(payload?.teams?.[side], count);
    nextPayload.chargeSpeeds[side] = cloneHelpCenterRowsForMode(payload?.chargeSpeeds?.[side], count, 0).map((row) => row.map(sanitizeChargeSpeed));
    nextPayload.universalCharges[side] = cloneHelpCenterRowsForMode(payload?.universalCharges?.[side], count, 0).map((row) => row.map(sanitizeUniversalCharge));
    nextPayload.redHoodPierceCounts[side] = cloneHelpCenterRowsForMode(payload?.redHoodPierceCounts?.[side], count, 0).map((row) => row.map(sanitizeRedHoodPierceCount));
    nextPayload.scarletCounterEnabled[side] = cloneHelpCenterRowsForMode(payload?.scarletCounterEnabled?.[side], count, true).map((row) => row.map(sanitizeScarletCounterEnabled));
    nextPayload.rosannaSacrificeFrames[side] = cloneHelpCenterRowsForMode(payload?.rosannaSacrificeFrames?.[side], count).map((row) => row.map(sanitizeSacrificeFrame));
    nextPayload.cubeTypes[side] = cloneHelpCenterRowsForMode(payload?.cubeTypes?.[side], count, CUBE_TYPE_NONE).map((row) => row.map(sanitizeCubeType));
    const sourceCubeIds = payload?.cubeIds?.[side] || nextPayload.cubeTypes[side].map((row) => row.map(getCubeTypeId));
    nextPayload.cubeIds[side] = cloneHelpCenterRowsForMode(sourceCubeIds, count, 0).map((row) => row.map((value) => getCubeTypeId(value)));
    if (!payload?.cubeTypes?.[side]) nextPayload.cubeTypes[side] = nextPayload.cubeIds[side].map((row) => row.map(getCubeTypeById));
    nextPayload.magazines[side] = cloneHelpCenterRowsForMode(payload?.magazines?.[side], count, 0).map((row) => row.map(sanitizeHelpCenterMagazine));
    nextPayload.jackalLinks[side] = Array.from({ length: count }, (_, index) => normalizeTeamPresetJackalLink(payload?.jackalLinks?.[side]?.[index]));
  });
  return nextPayload;
}

function getHelpCenterPayloadForDisplay(payload = {}) {
  const displayPayload = { ...payload };
  if (!displayPayload.cubeTypes && displayPayload.cubeIds) {
    displayPayload.cubeTypes = { defense: [], attack: [] };
    ["defense", "attack"].forEach((side) => {
      displayPayload.cubeTypes[side] = cloneHelpCenterRowsForMode(displayPayload.cubeIds?.[side], getHelpCenterTeamCountForMode(displayPayload.mode), 0)
        .map((row) => row.map(getCubeTypeById));
    });
  }
  return displayPayload;
}

function getHelpCenterExportPayload(payload = {}, requestMode = "normal") {
  const mode = isHelpCenterSolvableArenaMode(requestMode) ? requestMode : "normal";
  const count = getHelpCenterTeamCountForMode(mode);
  const fallback = payload?.shareParams
    ? buildHelpCenterRowsFromShareParams({ ...payload.shareParams, mode: getHelpCenterModeCode(mode) === "p" ? "p" : "n" })
    : {};
  const result = { ...payload, mode };
  for (const field of ["teams", "chargeSpeeds", "universalCharges", "redHoodPierceCounts", "scarletCounterEnabled", "rosannaSacrificeFrames", "cubeTypes", "cubeIds", "magazines", "jackalLinks"]) {
    result[field] = {};
    for (const side of ["defense", "attack"]) {
      result[field][side] = Array.from({ length: count }, (_, index) => {
        const current = payload?.[field]?.[side]?.[index];
        const saved = fallback?.[field]?.[side]?.[index];
        if (field === "teams" && Array.isArray(saved) && saved.some(Boolean) && (!Array.isArray(current) || !current.some(Boolean))) return saved;
        return current ?? saved ?? (field === "jackalLinks" ? {} : []);
      });
    }
  }
  for (const side of ["defense", "attack"]) {
    result.cubeIds[side] = result.cubeIds[side].map((row, index) => {
      const explicitIds = payload?.cubeIds?.[side]?.[index];
      const explicitTypes = payload?.cubeTypes?.[side]?.[index];
      if (!Array.isArray(explicitIds) && Array.isArray(explicitTypes)) return explicitTypes.map(getCubeTypeId);
      return row.length ? row : result.cubeTypes[side][index].map(getCubeTypeId);
    });
  }
  return result;
}

function getHelpCenterModeCode(mode) {
  if (mode === "champion") return "c";
  if (mode === "special") return "p";
  return "normal";
}

function getHelpCenterPayloadShareParams(payload = {}, modeCode = "normal") {
  if (!payload?.shareParams || typeof payload.shareParams !== "object") return null;
  const params = new URLSearchParams();
  Object.entries(payload.shareParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) params.set(key, String(value));
  });
  params.set("mode", modeCode === "normal" ? "n" : modeCode);
  return params;
}

function createEmptyHelpCenterShareRow() {
  return {
    team: Array(TEAM_SIZE).fill(null),
    chargeSpeeds: Array(TEAM_SIZE).fill(0),
    universalCharges: Array(TEAM_SIZE).fill(0),
    redHoodPierceCounts: Array(TEAM_SIZE).fill(0),
    scarletCounterEnabled: Array(TEAM_SIZE).fill(true),
    rosannaSacrificeFrames: Array(TEAM_SIZE).fill(null),
    jackalLink: createEmptyJackalLinkState(),
  };
}

function rememberHelpCenterShareRowSettings(row, teamKey) {
  row.team.forEach((character, index) => {
    if (!character) return;
    saveCharacterCubeType(character, row.cubeTypes?.[index], teamKey);
    if (row.magazines?.[index] > 0) saveCharacterMagazine(character, row.magazines[index], teamKey);
    saveCharacterChargeSpeed(character, row.chargeSpeeds?.[index] || 0, teamKey);
    if (isRedHood(character)) saveCharacterRedHoodPierceCount(character, row.redHoodPierceCounts?.[index] || 0, teamKey);
  });
}

const HELP_SOLVE_ISOLATED_FIELDS = [
  "defenseTeam", "defenseChargeSpeeds", "defenseUniversalCharges", "defenseRedHoodPierceCounts", "defenseScarletCounterEnabled", "defenseRosannaSacrificeFrames",
  "team", "chargeSpeeds", "universalCharges", "redHoodPierceCounts", "scarletCounterEnabled", "rosannaSacrificeFrames",
  "characterChargeSpeeds", "characterChargeSpeedEntries", "characterQuantumCubes", "characterCubeTypes", "characterMagazines", "characterRedHoodPierceCounts",
  "jackalLinks", "activeTeamKey", "activeLineupIndex", "lineupSlots", "paidArenaMode", "paidArenaActiveRowIndex", "paidArenaActiveLineupIndex", "paidArenaDisplayMode", "paidArenaDataTeamKey",
  "paidArenaTeams", "paidArenaLineupSlots", "paidArenaUniversalCharges", "paidArenaChargeSpeeds", "paidArenaRosannaSacrificeFrames", "paidArenaRedHoodPierceCounts", "paidArenaScarletCounterEnabled", "paidArenaJackalLinks",
  "filters", "testMode", "allowMissedShots", "battlePowerBase", "compactAvatarIcons",
];

function getHelpCenterSolveDraftKey(requestId, options = {}) {
  const owner = state.authSession?.user?.id || state.authSession?.userId || state.authSession?.accessToken || "guest";
  const source=options.privateHelp?`private:${options.privateHelp.item?.round || options.round || 1}`:options.preview?'preview':'public';
  return `${source}:${owner}:${requestId}`;
}

function getHelpCenterSolveDraft(requestId, options = {}) {
  return state.helpCenter.solveDrafts.get(getHelpCenterSolveDraftKey(requestId, options)) || null;
}

function discardHelpCenterSolveDraft(requestId, options = {}) {
  const key = options.expectedDraft?.key || getHelpCenterSolveDraftKey(requestId, options);
  if (!options.expectedDraft || state.helpCenter.solveDrafts.get(key) === options.expectedDraft) state.helpCenter.solveDrafts.delete(key);
}

function parkHelpCenterSolveWorkspace() {
  const workspace = state.helpCenter.solveWorkspace;
  const requestId = state.helpCenter.solveRequestId;
  if (!workspace || !requestId) return null;
  try {
    const draft = {
      key: workspace.draftKey,
      payload: buildHelpCenterPayload(),
      snapshot: Object.fromEntries(HELP_SOLVE_ISOLATED_FIELDS.map(key => [key, state[key]])),
      preview: workspace.preview,
      recipient: workspace.recipient,
      privateHelp: workspace.privateHelp,
      description: state.helpCenter.solveDrafts.get(workspace.draftKey)?.description || "",
    };
    state.helpCenter.solveDrafts.set(workspace.draftKey, draft);
    clearHelpCenterSolveDraft(requestId);
    return draft;
  } catch (error) {
    console.warn("[HelpCenter] could not preserve temporary plan", error);
    showToast(localize("临时方案暂时无法保存，请重试", "Could not preserve the temporary plan. Please retry."));
    return null;
  }
}

function beginHelpCenterSolveWorkspace(request, options = {}) {
  if (!request?.id || !isHelpCenterSolvableArenaMode(request.arenaMode)) return false;
  const draftKey = getHelpCenterSolveDraftKey(request.id, options);
  if (state.helpCenter.solveWorkspace?.draftKey === draftKey) return true;
  const mode = getHelpCenterModeCode(request.arenaMode);
  const region = normalizeHelpCenterRegion(request.region || request.defensePayload?.region);
  const source = getHelpCenterExportPayload(request.defensePayload, request.arenaMode);
  const count = getHelpCenterTeamCountForMode(request.arenaMode);
  let missingCharacter = false;
  const defenseRows = Array.from({ length: count }, (_, rowIndex) => {
    const values = (field) => source?.[field]?.defense?.[rowIndex] || [];
    const team = Array.from({ length: TEAM_SIZE }, (_, index) => {
      const item = values("teams")[index];
      const id = String(item?.id || item || "") === "0" ? null : item?.id || item;
      const character = id ? getCharacterById(id) : null;
      if (id && !character) missingCharacter = true;
      return character;
    });
    return {
      team,
      chargeSpeeds: Array.from({ length: TEAM_SIZE }, (_, i) => sanitizeChargeSpeed(values("chargeSpeeds")[i])),
      universalCharges: Array.from({ length: TEAM_SIZE }, (_, i) => sanitizeUniversalCharge(values("universalCharges")[i])),
      redHoodPierceCounts: Array.from({ length: TEAM_SIZE }, (_, i) => sanitizeRedHoodPierceCount(values("redHoodPierceCounts")[i])),
      scarletCounterEnabled: Array.from({ length: TEAM_SIZE }, (_, i) => values("scarletCounterEnabled")[i] !== false),
      rosannaSacrificeFrames: Array.from({ length: TEAM_SIZE }, (_, i) => sanitizeSacrificeFrame(values("rosannaSacrificeFrames")[i])),
      cubeTypes: Array.from({ length: TEAM_SIZE }, (_, i) => values("cubeTypes")[i] ?? getCubeTypeById(values("cubeIds")[i])),
      magazines: Array.from({ length: TEAM_SIZE }, (_, i) => sanitizeHelpCenterMagazine(values("magazines")[i])),
      jackalLink: source?.jackalLinks?.defense?.[rowIndex] || createEmptyJackalLinkState(),
    };
  });
  if (missingCharacter || (!options.privateHelp && !defenseRows.some(row => row.team.some(Boolean)))) return false;

  if (state.helpCenter.solveWorkspace) {
    if (!parkHelpCenterSolveWorkspace()) return false;
  } else if (state.helpCenter.solveRequestId) {
    helpCenterUiModuleInstance?.cancelRecommendationCapture?.();
    clearHelpCenterSolveDraft();
  }
  const previousDraft = state.helpCenter.solveDrafts.get(draftKey);
  const canResume = previousDraft?.payload?.mode === request.arenaMode && normalizeHelpCenterRegion(previousDraft.payload.region) === region;
  const useCurrentAttack = !options.privateHelp && Boolean(request.isMine) && getCurrentHelpCenterArenaMode() === request.arenaMode && getHelpCenterRegion() === region;
  saveTeam();
  const original = Object.fromEntries(HELP_SOLVE_ISOLATED_FIELDS.map(key => [key, state[key]]));
  let detached;
  try { detached = structuredClone(canResume ? previousDraft.snapshot : original); }
  catch (error) { console.warn("[HelpCenter] could not prepare temporary workspace", error); return false; }
  Object.assign(state, detached);
  state.helpCenter.solveWorkspace = { original, draftKey, preview: Boolean(options.preview), recipient: Boolean(options.recipient), privateHelp: options.privateHelp || previousDraft?.privateHelp };
  state.helpCenter.solveRequestId = request.id;
  state.helpCenter.solveRequestTitle = request.title || "";
  state.helpCenter.solveRequestRegion = region;

  try {
    if (canResume) {
      document.body.classList.remove("help-preview-only");
      return true;
    }
    state.filters.region = region;
    state.testMode = false;
    if(options.privateHelp){
      for(const field of ['characterChargeSpeeds','characterChargeSpeedEntries','characterQuantumCubes','characterCubeTypes','characterMagazines','characterRedHoodPierceCounts'])state[field]={defense:{},attack:{}};
    }
    if (mode === "normal") {
      const attack = useCurrentAttack ? { team: state.team, chargeSpeeds: state.chargeSpeeds, universalCharges: state.universalCharges, redHoodPierceCounts: state.redHoodPierceCounts, scarletCounterEnabled: state.scarletCounterEnabled, rosannaSacrificeFrames: state.rosannaSacrificeFrames, jackalLink: state.jackalLinks.attack } : createEmptyHelpCenterShareRow();
      const defense = defenseRows[0];
      state.paidArenaMode = "normal";
      state.paidArenaDisplayMode = "side";
      state.team = attack.team;
      state.chargeSpeeds = attack.chargeSpeeds;
      state.universalCharges = attack.universalCharges;
      state.redHoodPierceCounts = attack.redHoodPierceCounts;
      state.scarletCounterEnabled = attack.scarletCounterEnabled;
      state.rosannaSacrificeFrames = attack.rosannaSacrificeFrames;
      state.defenseTeam = defense.team;
      state.defenseChargeSpeeds = defense.chargeSpeeds;
      state.defenseUniversalCharges = defense.universalCharges;
      state.defenseRedHoodPierceCounts = defense.redHoodPierceCounts;
      state.defenseScarletCounterEnabled = defense.scarletCounterEnabled;
      state.defenseRosannaSacrificeFrames = defense.rosannaSacrificeFrames;
      state.jackalLinks = { attack: normalizeTeamPresetJackalLink(attack.jackalLink), defense: normalizeTeamPresetJackalLink(defense.jackalLink) };
      rememberHelpCenterShareRowSettings(defense, "defense");
      setActiveTeam(options.privateHelp?.item.purpose || "attack");
    } else {
      const stores = ["paidArenaTeams", "paidArenaUniversalCharges", "paidArenaChargeSpeeds", "paidArenaRosannaSacrificeFrames", "paidArenaRedHoodPierceCounts", "paidArenaScarletCounterEnabled", "paidArenaJackalLinks"];
      const attack = useCurrentAttack ? Object.fromEntries(stores.map(key => [key, state[key].p.attack])) : null;
      state.paidArenaMode = "p";
      state.paidArenaDisplayMode = "round";
      state.paidArenaDataTeamKey = options.privateHelp?.item.purpose || "attack";
      state.paidArenaActiveRowIndex = 0;
      state.paidArenaTeams.p = createEmptyPaidArenaTeamsBySide("p");
      state.paidArenaUniversalCharges.p = createEmptyPaidArenaUniversalChargesBySide("p");
      state.paidArenaChargeSpeeds.p = createEmptyPaidArenaChargeSpeedsBySide("p");
      state.paidArenaRosannaSacrificeFrames.p = createEmptyPaidArenaRosannaSacrificeFramesBySide("p");
      state.paidArenaRedHoodPierceCounts.p = createEmptyPaidArenaRedHoodPierceCountsBySide("p");
      state.paidArenaScarletCounterEnabled.p = createEmptyPaidArenaScarletCounterEnabledBySide("p");
      state.paidArenaJackalLinks.p = createEmptyPaidArenaJackalLinksBySide("p");
      if (attack) stores.forEach(key => { state[key].p.attack = attack[key]; });
      defenseRows.forEach((row, index) => {
        state.paidArenaTeams.p.defense[index] = row.team;
        state.paidArenaChargeSpeeds.p.defense[index] = row.chargeSpeeds;
        state.paidArenaUniversalCharges.p.defense[index] = row.universalCharges;
        state.paidArenaRedHoodPierceCounts.p.defense[index] = row.redHoodPierceCounts;
        state.paidArenaScarletCounterEnabled.p.defense[index] = row.scarletCounterEnabled;
        state.paidArenaRosannaSacrificeFrames.p.defense[index] = row.rosannaSacrificeFrames;
        state.paidArenaJackalLinks.p.defense[index] = normalizePaidArenaLinkForTeam(row.team, row.jackalLink);
        rememberHelpCenterShareRowSettings(row, "defense");
      });
    }
    openSlotSettings = null;
    openRosannaSacrificeSettings = null;
    document.body.classList.remove("help-preview-only");
    return true;
  } catch (error) {
    console.warn("[HelpCenter] failed to initialize temporary workspace", error);
    clearHelpCenterSolveDraft(request.id);
    return false;
  }
}

function clearHelpCenterSolveDraft(requestId = "") {
  if (!requestId || state.helpCenter.solveRequestId === requestId) {
    const workspace = state.helpCenter.solveWorkspace;
    if (workspace) Object.assign(state, workspace.original);
    state.helpCenter.solveWorkspace = null;
    state.helpCenter.solveRequestId = "";
    state.helpCenter.solveRequestTitle = "";
    state.helpCenter.solveRequestRegion = "";
    if (workspace && els.allowMissedShotsToggle) els.allowMissedShotsToggle.checked = state.allowMissedShots;
    refreshHelpCenterSolveSubmitButton();
  }
}

function refreshHelpCenterSolveSubmitButton() {
  if (els.teamHelpButton) els.teamHelpButton.hidden = !isHelpCenterSolvableArenaMode(getCurrentHelpCenterArenaMode());
  const button = els.helpSolveSubmitButton;
  const hasDraft = Boolean(state.helpCenter.solveRequestId);
  if (els.helpSolveModeBar) els.helpSolveModeBar.hidden = !hasDraft;
  if (els.helpSolveModeText && hasDraft) {
    const regionText = getHelpCenterRegionLabel(state.helpCenter.solveRequestRegion || state.filters.region);
    const isRecommendationDefenseCapture = state.helpCenter.solveRequestId === "recommendation-defense-capture";
    const modeText = state.helpCenter.solveWorkspace
      ? state.helpCenter.solveWorkspace.privateHelp
        ? `临时方案 · ${regionText} · 发起者阿卡 · ${state.helpCenter.solveWorkspace.privateHelp.item.purpose === 'defense' ? '防守配队' : '防守已锁定'}`
        : localize(`临时方案 · ${regionText} · 防守已锁定`, `Temporary plan · ${regionText} · defense locked`)
      : isRecommendationDefenseCapture
      ? localize(`\u4e00\u56fe\u6d41\u9632\u5b88\u961f\u91c7\u96c6\u6a21\u5f0f\uff1a${regionText}\uff0c\u8bf7\u8c03\u6574\u9632\u5b88\u961f\u540e\u70b9\u51fb\u8fd4\u56de\u91c7\u96c6`, `Recommendation defense capture: ${regionText}. Edit the defense team, then return to collect it.`)
      : isPaidArenaModeActive()
      ? localize(`\u4e92\u52a9\u89e3\u9898\u6a21\u5f0f\uff1a${regionText}\uff0c\u9632\u5b88\u5df2\u9501\u5b9a\uff0c\u53ea\u80fd\u8c03\u6574\u8fdb\u653b\u961f\u4f0d`, `Help solving mode: ${regionText}. Defense is locked. Edit attack teams only.`)
      : localize(`\u4e92\u52a9\u89e3\u9898\u6a21\u5f0f\uff1a${regionText}\uff0c\u9632\u5b88\u5df2\u9501\u5b9a\uff0c\u53ea\u80fd\u8c03\u6574\u8fdb\u653b\u961f\u4f0d`, `Help solving mode: ${regionText}. Defense is locked. Edit attack team only.`);
    els.helpSolveModeText.replaceChildren(document.createTextNode(modeText));
  }
  if (els.helpSolveCancelButton) {
    els.helpSolveCancelButton.hidden = Boolean(state.helpCenter.solveWorkspace);
    els.helpSolveCancelButton.textContent = localize("\u9000\u51fa", "Exit");
  }
  if (!button) return;
  button.hidden = !hasDraft;
  if (!hasDraft) return;
  const isRecommendationCapture = state.helpCenter.solveRequestId === "recommendation-capture";
  const isRecommendationDefenseCapture = state.helpCenter.solveRequestId === "recommendation-defense-capture";
  const text = isRecommendationCapture
    ? localize("\u8fd4\u56de\u4e00\u56fe\u6d41\u91c7\u96c6", "Return to recommendation capture")
    : isRecommendationDefenseCapture
      ? localize("\u8fd4\u56de\u4e00\u56fe\u6d41\u91c7\u96c6", "Return to recommendation capture")
      : localize("返回解题", "Return to solutions");
  button.replaceChildren(document.createTextNode(text));
  button.setAttribute("aria-label", text);
  button.setAttribute("title", state.helpCenter.solveRequestTitle || text);
}

function isHelpCenterSolveActive() {
  return Boolean(state.helpCenter.solveRequestId);
}

function isHelpCenterSolvableArenaMode(mode) {
  return mode === "normal" || mode === "special";
}

function isHelpCenterLockedDefenseSide(teamKey) {
  const borrowed=state.helpCenter.solveWorkspace?.privateHelp;
  if(borrowed)return normalizeTeamKey(teamKey)!==borrowed.item.purpose;
  return state.helpCenter.solveRequestId !== "recommendation-defense-capture" && isHelpCenterSolveActive() && normalizeTeamKey(teamKey) === "defense";
}

function showHelpCenterLockedDefenseToast() {
  showToast(localize("\u4e92\u52a9\u89e3\u9898\u4e2d\u9632\u5b88\u961f\u4f0d\u5df2\u9501\u5b9a", "Defense is locked while solving a help request."));
}

function showHelpCenterLockedRegionToast() {
  showToast(localize("\u4e92\u52a9\u89e3\u9898\u4e2d\u5df2\u9501\u5b9a\u6c42\u52a9\u670d\u533a\uff0c\u9000\u51fa\u89e3\u9898\u540e\u53ef\u5207\u6362", "The request region is locked while solving. Exit solving mode to switch region."));
}

function applyHelpCenterRequestToSolveWorkspace(request) {
  const modeCode = getHelpCenterModeCode(request?.arenaMode);
  const params = getHelpCenterPayloadShareParams(request?.defensePayload, modeCode);
  if (!params) return false;
  state.filters.region = normalizeHelpCenterRegion(request?.region || request?.defensePayload?.region);
  if (isPaidArenaModeActive()) saveCurrentPaidArenaLineupSlot(state.paidArenaMode);
  if (modeCode === "normal") {
    const defenseRow = getTeamShareSideRowParams(params, "defence", 1);
    const emptyRow = createEmptyHelpCenterShareRow();
    state.paidArenaMode = "normal";
    state.paidArenaDisplayMode = "side";
    state.team = emptyRow.team;
    state.defenseTeam = defenseRow.team;
    state.chargeSpeeds = emptyRow.chargeSpeeds;
    state.defenseChargeSpeeds = defenseRow.chargeSpeeds;
    state.universalCharges = emptyRow.universalCharges;
    state.defenseUniversalCharges = defenseRow.universalCharges;
    state.redHoodPierceCounts = emptyRow.redHoodPierceCounts;
    state.defenseRedHoodPierceCounts = defenseRow.redHoodPierceCounts;
    state.scarletCounterEnabled = emptyRow.scarletCounterEnabled;
    state.defenseScarletCounterEnabled = defenseRow.scarletCounterEnabled;
    state.rosannaSacrificeFrames = emptyRow.rosannaSacrificeFrames;
    state.defenseRosannaSacrificeFrames = defenseRow.rosannaSacrificeFrames;
    state.jackalLinks = { attack: emptyRow.jackalLink, defense: normalizeTeamPresetJackalLink(defenseRow.jackalLink) };
    rememberHelpCenterShareRowSettings(defenseRow, "defense");
    setActiveTeam("attack");
  } else {
    const teamCount = PAID_ARENA_TEAM_COUNTS[modeCode] || 0;
    state.paidArenaMode = modeCode;
    state.paidArenaDisplayMode = "round";
    state.paidArenaDataTeamKey = "attack";
    state.paidArenaActiveRowIndex = 0;
    state.paidArenaActiveLineupIndex[modeCode] = 0;
    state.paidArenaTeams[modeCode] = createEmptyPaidArenaTeamsBySide(modeCode);
    state.paidArenaUniversalCharges[modeCode] = createEmptyPaidArenaUniversalChargesBySide(modeCode);
    state.paidArenaChargeSpeeds[modeCode] = createEmptyPaidArenaChargeSpeedsBySide(modeCode);
    state.paidArenaRosannaSacrificeFrames[modeCode] = createEmptyPaidArenaRosannaSacrificeFramesBySide(modeCode);
    state.paidArenaRedHoodPierceCounts[modeCode] = createEmptyPaidArenaRedHoodPierceCountsBySide(modeCode);
    state.paidArenaScarletCounterEnabled[modeCode] = createEmptyPaidArenaScarletCounterEnabledBySide(modeCode);
    state.paidArenaJackalLinks[modeCode] = createEmptyPaidArenaJackalLinksBySide(modeCode);
    for (let index = 0; index < teamCount; index += 1) {
      const defenseRow = getTeamShareSideRowParams(params, "defence", index + 1);
      state.paidArenaTeams[modeCode].defense[index] = defenseRow.team;
      state.paidArenaChargeSpeeds[modeCode].defense[index] = defenseRow.chargeSpeeds;
      state.paidArenaUniversalCharges[modeCode].defense[index] = defenseRow.universalCharges;
      state.paidArenaRedHoodPierceCounts[modeCode].defense[index] = defenseRow.redHoodPierceCounts;
      state.paidArenaScarletCounterEnabled[modeCode].defense[index] = defenseRow.scarletCounterEnabled;
      state.paidArenaRosannaSacrificeFrames[modeCode].defense[index] = defenseRow.rosannaSacrificeFrames;
      state.paidArenaJackalLinks[modeCode].defense[index] = normalizePaidArenaLinkForTeam(defenseRow.team, defenseRow.jackalLink);
      rememberHelpCenterShareRowSettings(defenseRow, "defense");
    }
    saveCurrentPaidArenaLineupSlot(modeCode);
  }
  saveTeam();
  return true;
}

function enterRecommendationCaptureWorkspace(recommendation, captureTarget = "attack") {
  const isDefenseCapture = captureTarget === "defense";
  if (isDefenseCapture) {
    state.helpCenter.solveRequestId = "recommendation-defense-capture";
    state.helpCenter.solveRequestTitle = localize("\u4e00\u56fe\u6d41\u9632\u5b88\u961f\u586b\u5145", "Recommendation defense fill");
    state.helpCenter.solveRequestRegion = recommendation?.region || "";
    setActiveTeam("defense");
    refreshHelpCenterSolveSubmitButton();
    render();
    els.teamSlots?.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast(localize("\u8bf7\u586b\u5145\u6216\u8c03\u6574\u9632\u5b88\u961f\uff0c\u7136\u540e\u70b9\u5e95\u90e8\u6309\u94ae\u8fd4\u56de\u91c7\u96c6", "Fill or adjust the defense team, then use the bottom button to return."));
    return true;
  }
  const applied = applyHelpCenterRequestToSolveWorkspace({
    arenaMode: "normal",
    region: recommendation?.region,
    defensePayload: recommendation?.defensePayload,
  });
  if (!applied) return false;
  state.helpCenter.solveRequestId = "recommendation-capture";
  state.helpCenter.solveRequestTitle = localize("\u4e00\u56fe\u6d41\u8fdb\u653b\u961f\u586b\u5145", "Recommendation attack fill");
  state.helpCenter.solveRequestRegion = recommendation?.region || "";
  refreshHelpCenterSolveSubmitButton();
  render();
  els.teamSlots?.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(localize("\u9632\u5b88\u5df2\u9501\u5b9a\uff0c\u8bf7\u586b\u5145\u8fdb\u653b\u961f\uff0c\u7136\u540e\u70b9\u5e95\u90e8\u6309\u94ae\u8fd4\u56de\u91c7\u96c6", "Defense is locked. Fill an attack team, then use the bottom button to return."));
  return true;
}

function getHelpCenterRows(payload, side) {
  payload = getHelpCenterPayloadForDisplay(payload);
  const rows = payload?.teams?.[side];
  if (Array.isArray(rows) && rows.some((row) => Array.isArray(row) && row.some(Boolean))) return rows;
  const mode = isHelpCenterSolvableArenaMode(payload?.mode) ? payload.mode : "normal";
  const params = getHelpCenterPayloadShareParams(payload, getHelpCenterModeCode(mode));
  const shareSide = side === "defense" ? "defence" : "attack";
  if (params) {
    const fallbackRows = Array.from({ length: getHelpCenterTeamCountForMode(mode) }, (_, index) => {
      const row = getTeamShareSideRowParams(params, shareSide, index + 1);
      return row.team.map((member) => member?.id || null);
    });
    if (fallbackRows.some((row) => row.some(Boolean))) return fallbackRows;
  }
  return Array.isArray(rows) ? rows : [];
}

function getHelpCenterSlotValue(payload, field, side, rowIndex, slotIndex, fallback = null) {
  const row = payload?.[field]?.[side]?.[rowIndex];
  return Array.isArray(row) && row[slotIndex] !== undefined ? row[slotIndex] : fallback;
}

const helpCenterPayloadChargeLabelCache = new Map();

function getHelpCenterPayloadChargeLabel(payload, side, rowIndex = 0) {
  const displayPayload = getHelpCenterPayloadForDisplay(payload);
  const cacheKey = `${side}:${rowIndex}:${JSON.stringify(displayPayload?.shareParams || displayPayload)}`;
  if (helpCenterPayloadChargeLabelCache.has(cacheKey)) return helpCenterPayloadChargeLabelCache.get(cacheKey);
  const ids = getHelpCenterRows(displayPayload, side)?.[rowIndex] || [];
  const team = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(ids[index]));
  if (!team.some(Boolean)) return "?RL";
  const chargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeChargeSpeed(getHelpCenterSlotValue(displayPayload, "chargeSpeeds", side, rowIndex, index, 0)));
  const universalCharges = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(getHelpCenterSlotValue(displayPayload, "universalCharges", side, rowIndex, index, 0)));
  const sacrificeFrames = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeSacrificeFrame(getHelpCenterSlotValue(displayPayload, "rosannaSacrificeFrames", side, rowIndex, index, null)));
  const redHoodPierceCounts = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeRedHoodPierceCount(getHelpCenterSlotValue(displayPayload, "redHoodPierceCounts", side, rowIndex, index, 0)));
  const scarletCounterEnabled = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeScarletCounterEnabled(getHelpCenterSlotValue(displayPayload, "scarletCounterEnabled", side, rowIndex, index, true)));
  const cubeIds = Array.from({ length: TEAM_SIZE }, (_, index) => getHelpCenterSlotValue(displayPayload, "cubeIds", side, rowIndex, index, 0));
  const magazines = Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeMagazine(getHelpCenterSlotValue(displayPayload, "magazines", side, rowIndex, index, 0)));
  const link = displayPayload?.jackalLinks?.[side]?.[rowIndex] || createEmptyJackalLinkState();
  const previousCubeTypes = state.characterCubeTypes[side];
  const previousQuantumCubes = state.characterQuantumCubes[side];
  const previousMagazines = state.characterMagazines[side];
  state.characterCubeTypes[side] = {};
  state.characterQuantumCubes[side] = {};
  state.characterMagazines[side] = {};
  team.forEach((character, index) => {
    if (!character) return;
    const cubeType = getCubeTypeById(cubeIds[index]);
    if (cubeType !== CUBE_TYPE_NONE) state.characterCubeTypes[side][character.id] = cubeType;
    if (magazines[index] > 0) state.characterMagazines[side][character.id] = magazines[index];
  });
  try {
    const result = simulatePaidArenaBurst(team, chargeSpeeds, universalCharges, sacrificeFrames, redHoodPierceCounts, scarletCounterEnabled, link, side);
    if (result?.engine === 'v2' && result.error) return result.error.includes('计算中') ? '计算中…' : '?RL';
    const label = result && !result.error && Number.isFinite(result.fullFrame) ? `${formatNumber(result.fullFrame / 76, 2)}RL` : "?RL";
    helpCenterPayloadChargeLabelCache.set(cacheKey, label);
    return label;
  } catch {
    return "?RL";
  } finally {
    state.characterCubeTypes[side] = previousCubeTypes;
    state.characterQuantumCubes[side] = previousQuantumCubes;
    state.characterMagazines[side] = previousMagazines;
  }
}

function renderHelpCenterTeamSlot(payload, side, rowIndex, slotIndex) {
  const displayPayload = getHelpCenterPayloadForDisplay(payload);
  const character = getCharacterById(getHelpCenterRows(displayPayload, side)?.[rowIndex]?.[slotIndex]);
  if (!character) return `<span class="team-slot help-center-slot-snapshot"><span class="slot-empty"><span class="position">P${slotIndex + 1}</span></span></span>`;
  const chargeSpeed = sanitizeChargeSpeed(getHelpCenterSlotValue(displayPayload, "chargeSpeeds", side, rowIndex, slotIndex, 0));
  const savedMagazine = getHelpCenterSlotValue(displayPayload, "magazines", side, rowIndex, slotIndex, null);
  const magazine = savedMagazine === null || savedMagazine === undefined || Number(savedMagazine) <= 0
    ? null
    : sanitizeMagazine(savedMagazine);
  const cubeIconSrc = getCubeIconSrc(getCubeTypeById(getHelpCenterSlotValue(displayPayload, "cubeIds", side, rowIndex, slotIndex, 0)));
  const pierceCount = isRedHood(character) ? sanitizeRedHoodPierceCount(getHelpCenterSlotValue(displayPayload, "redHoodPierceCounts", side, rowIndex, slotIndex, 0)) : 0;
  const counterEnabled = isScarlet(character) && sanitizeScarletCounterEnabled(getHelpCenterSlotValue(displayPayload, "scarletCounterEnabled", side, rowIndex, slotIndex, false));
  const sacrificeFrame = sanitizeSacrificeFrame(getHelpCenterSlotValue(displayPayload, "rosannaSacrificeFrames", side, rowIndex, slotIndex, null));
  const team = getHelpCenterRows(displayPayload, side)?.[rowIndex] || [];
  const hasRosanna = team.some((id) => isRosanna(getCharacterById(id)));
  const hasSacrificeTarget = team.some((id, index) => {
    const member = getCharacterById(id);
    return member && !isRosanna(member) && sanitizeSacrificeFrame(getHelpCenterSlotValue(displayPayload, "rosannaSacrificeFrames", side, rowIndex, index, null)) !== null;
  });
  const link = displayPayload?.jackalLinks?.[side]?.[rowIndex] || {};
  const linkEnabled = Boolean(link.enabled);
  const isLinkOwner = linkEnabled && isLinkProvider(character) && String(link.ownerId || "") === String(character.id);
  const isLinkTarget = linkEnabled && Array.isArray(link.targetIds) && link.targetIds.map(String).includes(String(character.id));
  const badgeText = canEditChargeSpeed(character) && chargeSpeed > 0
    ? `${chargeSpeed}%`
    : isScarlet(character)
      ? String(magazine || sanitizeMagazine(character.stats?.magazine))
      : "";
  return `<span class="team-slot filled help-center-slot-snapshot${getTeamSlotRarityClass(character)}" title="${escapeHtml(getCharacterLocalizedName(character))}">
    <span class="slot-remove"><span class="team-avatar">${getAvatarMarkup(character)}</span><span class="slot-copy" aria-hidden="true">${hasRosanna && !isRosanna(character) && sacrificeFrame !== null ? getSacrificeMarkMarkup(sacrificeFrame) : ""}${cubeIconSrc ? `<span class="slot-cube-badge"><img src="${escapeHtml(cubeIconSrc)}" alt="" /></span>` : ""}${badgeText ? `<span class="slot-speed-badge">${escapeHtml(badgeText)}</span>` : ""}</span></span>
    ${isRedHood(character) ? `<span class="slot-pierce-count${pierceCount > 0 ? " is-active" : ""}"><img class="slot-pierce-icon" src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" />${pierceCount > 0 ? `<span class="slot-pierce-value">${pierceCount}</span>` : ""}</span>` : ""}
    ${isScarlet(character) ? `<span class="slot-counter-toggle${counterEnabled ? " is-active" : ""}"><img src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" /></span>` : ""}
    ${isRosanna(character) && hasSacrificeTarget ? `<span class="slot-sacrifice-toggle is-active"><img src="assets/immutable/icons/ui/pierce.8a4bbe163152.svg" alt="" /></span>` : ""}
    ${isLinkOwner ? `<span class="slot-link-toggle is-active"><img src="assets/immutable/icons/ui/link.4c6f6b125df1.svg" alt="" /></span>` : ""}
    ${isLinkTarget ? `<span class="slot-link-target is-selected"><img src="assets/immutable/icons/ui/link.4c6f6b125df1.svg" alt="" /></span>` : ""}
  </span>`;
}

function hasHelpCenterSideMembers(payload, side) {
  return getHelpCenterRows(payload, side).some((row) => Array.isArray(row) && row.some(Boolean));
}

function getHelpCenterDefenseSignature(payload) {
  const mode = isHelpCenterSolvableArenaMode(payload?.mode) ? payload.mode : "normal";
  const rows = getHelpCenterRows(payload, "defense");
  const count = getHelpCenterTeamCountForMode(mode);
  const normalizedRows = Array.from({ length: count }, (_, rowIndex) => {
    const row = Array.isArray(rows[rowIndex]) ? rows[rowIndex] : [];
    return Array.from({ length: TEAM_SIZE }, (_, slotIndex) => {
      const member = row[slotIndex];
      if (!member) return "0";
      if (typeof member === "object") return String(member.id || member.characterId || "0");
      return String(member);
    }).join(",");
  });
  return `${mode}|${normalizedRows.join(";")}`;
}

async function findSolvedHelpCenterRequestForDefense(defensePayload) {
  const signature = getHelpCenterDefenseSignature(defensePayload);
  if (!signature.includes("|") || signature.endsWith("|0,0,0,0,0")) return null;
  const localMatch = (state.helpCenter.requests || []).find((request) => (
    request?.status === "closed" &&
    Number(request.solutionCount || 0) > 0 &&
    request.arenaMode === defensePayload.mode &&
    request.region === defensePayload.region &&
    getHelpCenterDefenseSignature(request.defensePayload) === signature
  ));
  if (localMatch) return localMatch;
  const params = new URLSearchParams({
    limit: "50",
    status: "closed",
    mode: defensePayload.mode,
    region: defensePayload.region,
    sort: "solved",
  });
  const response = await authenticatedFetch(`${SUPABASE_HELP_CENTER_ENDPOINT}?${params.toString()}`, {
    headers: await getHelpCenterHeaders(false),
  }, { requireAuth: false });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok || !Array.isArray(payload.data)) {
    handleRejectedAuthSessionResponse(response, payload);
    return null;
  }
  return payload.data.find((request) => (
    Number(request.solutionCount || 0) > 0 &&
    getHelpCenterDefenseSignature(request.defensePayload) === signature
  )) || null;
}

function getHelpCenterAuthSession() {
  const session = state.authSession || getStoredAuthSession();
  state.authSession = session;
  return session;
}

function requireHelpCenterLogin() {
  const session = getHelpCenterAuthSession();
  if (session?.accessToken) return true;
  showToast(localize("\u8bf7\u5148\u767b\u5f55\u540e\u518d\u4f7f\u7528\u6c42\u52a9\u529f\u80fd", "Please sign in before using help requests."));
  closeHelpCenterModal();
  openAccountModal("login");
  return false;
}

async function getHelpCenterHeaders(requireAuth = false) {
  const session = await refreshAuthSessionIfNeeded();
  if (requireAuth && !session?.accessToken) {
    openAccountModal("login");
    throw new Error(localize("\u8bf7\u5148\u767b\u5f55\u540e\u518d\u4f7f\u7528\u6c42\u52a9\u529f\u80fd", "Please sign in before using help requests."));
  }
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    apikey: SUPABASE_PUBLISHABLE_KEY,
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
  };
}



function shouldFocusCharacterSearchFromTyping(event) {
  if (!els.searchInput || event.defaultPrevented || event.isComposing || event.ctrlKey || event.altKey || event.metaKey) return false;
  if (typeof event.key !== "string" || event.key.length !== 1 || !/[^\s]/u.test(event.key)) return false;
  if (document.querySelector('[role="dialog"][aria-modal="true"], .ocr-crop-backdrop, .share-preview-backdrop, .share-mode-backdrop')) return false;

  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest('input, textarea, select, button, a, [contenteditable="true"], [role="textbox"]')) return false;

  const activeElement = document.activeElement;
  return !activeElement || activeElement === document.body || activeElement === document.documentElement;
}

function bindEvents() {
  els.helpButton?.addEventListener("click", openHelpModal);
  els.announcementCloseButton?.addEventListener("click", dismissAnnouncementBar);
  els.announcementAction?.addEventListener("click", handleAnnouncementAction);
  els.sidebarMenuButton?.addEventListener("click", () => setSidebarOpen(true));
  els.sidebarCloseButton?.addEventListener("click", () => setSidebarOpen(false));
  els.appSidebarBackdrop?.addEventListener("click", () => setSidebarOpen(false));
  els.changelogButton?.addEventListener("click", () => {
    setSidebarOpen(false);
    openChangelogModal();
  });
  els.championDataButton?.addEventListener("click", () => {
    markFeatureHintSeenByElementId("championDataButton");
    setSidebarOpen(false);
    void openChampionDataModal();
  });
  els.helpCenterButton?.addEventListener("click", () => {
    markFeatureHintSeenByElementId("helpCenterButton");
    setSidebarOpen(false);
    openHelpCenterModal();
  });
  els.accountButton?.addEventListener("click", () => {
    setSidebarOpen(false);
    openAccountModal();
  });
  els.sidebarSuggestionButton?.addEventListener("click", () => {
    setSidebarOpen(false);
    openSuggestionModal();
  });
  els.sidebarHelpButton?.addEventListener("click", () => {
    setSidebarOpen(false);
    openHelpModal();
  });
  els.themeToggleButton?.addEventListener("click", toggleTheme);
  els.languageToggleButton?.addEventListener("click", toggleLanguage);
  els.paidInferenceButton?.addEventListener("click", openPaidInferenceFeature);
  els.paidCModeButton?.addEventListener("click", () => openPaidArenaFeature("c"));
  els.paidPModeButton?.addEventListener("click", () => openPaidArenaFeature("p"));
  els.saveTeamPresetButton?.addEventListener("click", saveCurrentTeamPreset);
  els.loadTeamPresetButton?.addEventListener("click", openTeamPresetModal);
  els.clearTeamButton.addEventListener("click", clearTeam);
  els.teamShareButton?.addEventListener("click", handleCopyButtonClick);
  els.teamHelpButton?.addEventListener("click", () => {
    markFeatureHintSeenByElementId("helpCenterButton");
    openHelpCenterModal();
  });
  els.helpSolveSubmitButton?.addEventListener("click", () => {
    if (["recommendation-capture", "recommendation-defense-capture"].includes(state.helpCenter.solveRequestId)) {
      clearHelpCenterSolveDraft(state.helpCenter.solveRequestId);
      openHelpCenterModal();
      return;
    }
    if (state.helpCenter.solveWorkspace && state.helpCenter.solveRequestId) {
      const requestId = state.helpCenter.solveRequestId;
      const { preview, recipient } = state.helpCenter.solveWorkspace;
      const privateHelp = state.helpCenter.solveWorkspace.privateHelp;
      if (!parkHelpCenterSolveWorkspace()) return;
      render();
      if (privateHelp) void openPrivateHelpModal({id:requestId});
      else if (preview) void openHelpWorkflowPreview({ requestId, recipient, submitDraft: true });
      else openHelpCenterModal({ requestId });
      return;
    }
    if (state.helpCenter.solveRequestId) openHelpCenterModal({ requestId: state.helpCenter.solveRequestId });
  });
  els.helpSolveCancelButton?.addEventListener("click", () => {
    clearHelpCenterSolveDraft();
    render();
  });
  els.mobileShareFab?.addEventListener("click", handleCopyButtonClick);
  els.seasonDataFab?.addEventListener("click", () => {
    markFeatureHintSeenByElementId("seasonDataFab");
    markFeatureHintSeenByElementId("championDataButton");
    void openChampionDataModal();
  });
  els.ocrUploadButton?.addEventListener("click", () => {
    markFeatureHintSeenByElementId("ocrUploadButton");
    openOcrUploadDialog();
  });
  els.ocrUploadInput?.addEventListener("change", (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    handleOcrUploadFiles(files);
  });
  document.addEventListener("paste", (event) => {
    void handleGlobalOcrPaste(event);
  }, { capture: true });
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
  els.chargeChart?.addEventListener("dragover", (event) => {
    if (!isChargeChartDropZone(event) || !isTransferWithFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });
  els.chargeChart?.addEventListener("drop", (event) => {
    if (!isChargeChartDropZone(event) || !isTransferWithFiles(event)) return;
    const files = getTransferFiles(event);
    event.preventDefault();

    const directContext = getOcrDropSlotContext(event);
    if (directContext) return;

    const context = getOcrFallbackContext(event);
    if (!context) return;

    if (context.mode === "paid") {
      if (context.teamKey && isHelpCenterLockedDefenseSide(context.teamKey)) {
        showHelpCenterLockedDefenseToast();
        return;
      }
      if (context.teamKey) state.paidArenaDataTeamKey = normalizeTeamKey(context.teamKey);
      handlePaidArenaOcrFill(state.paidArenaMode, context.rowIndex, context.slotIndex, files).catch(() => {
        showToast(localize("OCR识别失败，请重试", "OCR failed. Please try again."));
      });
      return;
    }

    if (isHelpCenterLockedDefenseSide(context.teamKey)) {
      showHelpCenterLockedDefenseToast();
      return;
    }
    handleOcrFill(context.teamKey, context.slotIndex, files).catch(() => {
      showToast(localize("OCR识别失败，请重试", "OCR failed. Please try again."));
    });
  });
  document.addEventListener("touchstart", (event) => {
    if (isCharacterDetailChildModalTarget(event.target)) return;
    hideFloatingTooltips();
  }, { capture: true, passive: true });
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (isCharacterDetailChildModalTarget(event.target)) return;
      const panel = document.querySelector(".character-detail-panel.show");
      const isOutsidePanel = panel && !panel.contains(event.target);
      if (event.pointerType && event.pointerType !== "mouse" && !panel) hideFloatingTooltips();
    },
    { capture: true, passive: true },
  );
  window.addEventListener("scroll", hideFloatingTooltips, { passive: true });
  window.addEventListener("orientationchange", hideFloatingTooltips);
  window.addEventListener("resize", scheduleResponsiveRender);
  window.addEventListener("resize", hideFloatingTooltips);
  window.addEventListener("keydown", (event) => {
    if (isGuidedTourActive) {
      event.preventDefault();
      if (event.key === "Escape") {
        completeGuidedTour();
      }
      return;
    }
    if (event.key === "Escape") {
      if (document.querySelector('.share-preview-backdrop, .share-mode-backdrop')) return;
      if (closeTopmostModalLayer()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      setSidebarOpen(false);
    }
    if (shouldFocusCharacterSearchFromTyping(event)) {
      els.searchInput.focus({ preventScroll: true });
    }
  }, { capture: true });
  els.commonToggle.addEventListener("change", (event) => {
    state.filters.common = event.target.checked ? "common" : "all";
    saveTeam();
    renderCharacters();
  });
  document.querySelector('#arcaToggle')?.addEventListener('click',async()=>{
    if(state.helpCenter.solveWorkspace?.privateHelp){showToast('当前正在使用发起者的阿卡资料，返回解题后可切回自己的资料。');return;}
    try{const arca=await loadArcaWorkspace();await arca.setEnabled(!arca.isEnabled());}
    catch(error){showToast(error.message||'阿卡数据加载失败，请重试。');}
  });
  els.regionToggle.addEventListener("change", (event) => {
    if (isHelpCenterSolveActive()) {
      event.target.checked = state.filters.region === "cn";
      showHelpCenterLockedRegionToast();
      return;
    }
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
  const ui = getCurrentLanguageText();
  const filters = [];
  const stage = normalizeStageFilter(state.filters.stage);
  if (stage !== "all") filters.push(`${ui.filterBurst || "爆裂"}${stage.replace("B", "")}`);
  if (state.filters.common === "common") filters.push(ui.filterCommonSummary || ui.filterCommon);
  if (state.filters.region === "cn") filters.push(ui.filterRegionCNSummary || ui.filterRegionCN);
  if (state.filters.region === "global") filters.push(ui.filterRegionGlobal);
  if(state.helpCenter.solveWorkspace?.privateHelp)filters.push('发起者阿卡');
  else if(arcaWorkspace?.isEnabled())filters.push(state.language==='en'?'Arca':'阿卡');
  const full=state.helpCenter.solveWorkspace?.privateHelp ? '本次使用发起者的阿卡资料，队伍齿轮可切换参数' : localize('点击「卡」加载阿卡数据，长按或右键查看详情／编辑。','Click Arca to load data; long-press or right-click to view/edit.');
  let condition=els.sortSummary.querySelector('.picker-summary-filters');
  if(!condition){
    condition=document.createElement('span');condition.className='picker-summary-filters';
    const help=document.createElement('span');help.className='picker-summary-help';
    const desktop=document.createElement('span');desktop.className='picker-help-full';
    const compact=document.createElement('span');compact.className='picker-help-compact';
    help.append(desktop,compact);els.sortSummary.replaceChildren(condition,help);
  }
  condition.textContent=filters.join(' · ');
  els.sortSummary.querySelector('.picker-help-full').textContent=full;
  els.sortSummary.querySelector('.picker-help-compact').textContent=localize('点卡加载，长按查看/编辑','Arca: load, hold to view/edit');
  els.sortSummary.title=condition.textContent+' | '+full;
}

function syncFilterControls() {
  els.commonToggle.checked = state.filters.common === "common";
  els.regionToggle.checked = state.filters.region === "cn";
  els.regionToggle.disabled = isHelpCenterSolveActive();
  els.regionToggle.closest("label")?.classList.toggle("is-disabled", isHelpCenterSolveActive());
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

function hideBootLoading() {
  if (window.__NIKKE_BOOT_LOADING_TIMER__) {
    clearTimeout(window.__NIKKE_BOOT_LOADING_TIMER__);
    window.__NIKKE_BOOT_LOADING_TIMER__ = null;
  }
  const root = document.getElementById("appBootLoading");
  if (!root) return;
  root.classList.add("is-ready");
  root.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    if (root.parentNode) root.parentNode.removeChild(root);
  }, 280);
}

function showBootLoadingError(message) {
  if (window.__NIKKE_BOOT_LOADING_TIMER__) {
    clearTimeout(window.__NIKKE_BOOT_LOADING_TIMER__);
    window.__NIKKE_BOOT_LOADING_TIMER__ = null;
  }
  const root = document.getElementById("appBootLoading");
  if (!root) return;
  root.classList.add("is-slow");
  const text = root.querySelector("[data-boot-loading-text]");
  if (text) text.textContent = message || localize("\u521d\u59cb\u5316\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u91cd\u8bd5\u3002", "Initialization failed. Please refresh and try again.");
}

let appRuntimeModulePromise = null;

async function loadAppRuntimeModule() {
  if (!appRuntimeModulePromise) appRuntimeModulePromise = importAppModule("./modules/runtime.js");
  return appRuntimeModulePromise;
}

async function refreshAppRuntimeContext() {
  const runtime = await loadAppRuntimeModule();
  runtime.setAppRuntimeContext({
    copyRichImageToClipboard,
    getCharacterDetailShareFileName,
    getCharacterLocalizedName,
    isMobileCopyChoiceRuntime,
    localize,
    openShareImagePreview,
    showToast,
    startProgressToast,
    state,
    stopProgressToast,
  });
  return runtime;
}

function schedulePostBootModulePreload() {
  void refreshAppRuntimeContext().then((runtime) => {
    runtime.scheduleIdleAppModuleQueue([
      { moduleName: "share-ui", importFactory: () => importAppModule("./modules/share-ui.js") },
      { moduleName: "team-share-actions", importFactory: () => importAppModule("./modules/team-share-actions.js") },
      { moduleName: "help-center-service", importFactory: () => importAppModule("./modules/help-center-service.js") },
      { moduleName: "account-status-service", importFactory: () => importAppModule("./modules/account-status-service.js") },
      { moduleName: "pwa-install", importFactory: () => importAppModule("./modules/pwa-install.js") },
    ], { initialDelayMs: 1800, gapMs: 900, timeout: 5000 });
    runtime.scheduleIdleAppModuleQueue([
      { moduleName: "help-center-ui", importFactory: () => importAppModule("./modules/help-center-ui.js") },
      { moduleName: "account-modal", importFactory: () => importAppModule("./modules/account-modal.js") },
      { moduleName: "character-detail-stats", importFactory: () => importAppModule("./modules/character-detail-stats.js") },
      { moduleName: "character-detail-panel", importFactory: () => importAppModule("./modules/character-detail-panel.js") },
      { moduleName: "character-detail-modals", importFactory: () => importAppModule("./modules/character-detail-modals.js") },
      { moduleName: "ocr-service", importFactory: () => importAppModule("./modules/ocr-service.js") },
    ], { initialDelayMs: 6500, gapMs: 1400, timeout: 7000 });
  }).catch((error) => console.warn("post boot module preload failed", error));
}

async function bootstrap() {
  const previewParams = new URLSearchParams(location.search);
  if (previewParams.get("view") === "help" && previewParams.get("standalone") === "1") {
    document.body.classList.add("help-preview-only");
  }
  captureInviteCodeFromLocation();
  const sharedHelpRequestId = captureHelpCenterRequestIdFromLocation();
  const sharedRecommendationGuideId = capturedRecommendationGuideIdOnLoad;
  getDeviceId();
  loadFeatureHintSeenKeys();
  loadFavoriteCharacters();
  initTheme();
  applyLanguage(getInitialLanguage());
  initPwaInstallPrompt();
  // 恢复链接会因 Service Worker 接管触发重载而丢掉 hash，因此标记也要参与判断。
  const shouldOpenPasswordRecovery = consumeSupabaseAuthCallbackFromLocation() || isPasswordRecoveryPending();
  state.authSession = getStoredAuthSession();
  syncAccountButton();
  syncAdminPageButtonVisibility();
  await loadCharacterData();
  void warmAvatarCacheInServiceWorker();
  bindEvents();
  void loadAnnouncementBar();
  initFloatingControlsModalObserver();
  setSidebarOpen(false);
  loadTeam();
  applyTeamSharePresetFromLocation();
  els.allowMissedShotsToggle.checked = state.allowMissedShots;
  syncFilterControls();
  syncLocalAccountEntryControl();
  render();
  hideBootLoading();
  schedulePostBootModulePreload();
  if (previewParams.get('privateHelp')) void openPrivateHelpModal({id:previewParams.get('privateHelp'),inviteToken:previewParams.get('invite')});
  else if (sharedHelpRequestId) openHelpCenterModal({ requestId: sharedHelpRequestId });
  else if (sharedRecommendationGuideId) openHelpCenterModal({ recommendationId: sharedRecommendationGuideId });
  else if (new URLSearchParams(location.search).get("view") === "help") openHelpCenterModal({ view: "list" });
  void (async () => {
    await refreshAuthSessionIfNeeded();
    await hydrateAuthSessionUserIfNeeded();
    if (state.authSession?.accessToken) {
      await refreshAccountStatus();
      void syncAccountDataOncePerPage();
    }
    syncAccountButton();
    syncAdminPageButtonVisibility();
    syncChampionDataFeatureVisibility();
    if (shouldOpenPasswordRecovery) { dismissGuidedTourOverlay(); openAccountModal("update-password"); }
    else if (capturedInviteCodeOnLoad && state.authSession?.accessToken) openAccountModal("login");
    else if (capturedInviteCodeOnLoad && !state.authSession?.accessToken) openAccountModal("register");
    else if (getPendingArcaKey() && !state.authSession?.accessToken) {
      showToast(localize("注册或登录后即可绑定阿卡 Key。", "Register or sign in to connect your Arca key."));
      openAccountModal("register");
    }
  })().catch(() => {
    // The shared manager logs a safe failure category and retains credentials.
    syncAccountButton();
    // 会话刷新失败也要给出改密入口，否则用户点邮件后既无引导也无表单。
    if (shouldOpenPasswordRecovery) { dismissGuidedTourOverlay(); openAccountModal("update-password"); }
  });
  if (GUIDANCE_ENABLED && !sharedHelpRequestId && !sharedRecommendationGuideId && !isPasswordRecoveryPending()) {
    if (hasSeenGuidedTour()) {
      showInitialHelpIntro();
    } else {
      startGuidedTour();
    }
  }
}

bootstrap().catch((error) => {
  console.error(error);
  els.toast.textContent = error?.message || localize("\u521d\u59cb\u5316\u5931\u8d25", "Initialization failed");
  els.toast.classList.add("show");
});
