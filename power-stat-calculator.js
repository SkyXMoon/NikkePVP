const BASE_STAT_POWER_SYNC_KEY = "nikke-base-stat-sync-values-v1";
const BASE_STAT_SYNC_DEFAULT_TEXT = "鏈悓姝ワ紙鍏堝畬鎴愬熀纭€灞炴€ц绠楋級";
const BASE_STAT_SYNC_UNREADABLE_TEXT = "鍩虹灞炴€ф暟鎹笉鍙敤";
const RELIC_R_BONUS = 7.3333 - 1;
const RELIC_SR_SECOND_BONUS = 5.333333 - 1;
const CUBE_SKILL_TABLE = [
  [0, 0], [1, 0], [1, 0], [2, 0], [2, 0],
  [2, 1], [2, 1], [3, 1], [3, 1], [3, 2], [3, 3],
  [3, 4], [3, 4], [3, 5], [3, 5], [3, 5], [3, 5],
];

const powerElements = {
  baseHp: document.querySelector("#resultHp"),
  baseAtk: document.querySelector("#resultAtk"),
  baseDef: document.querySelector("#resultDef"),
  cubeLevelInput: document.querySelector("#cubeLevelInput"),
  relicTypeInput: document.querySelector("#relicTypeInput"),
  relicLevelInput: document.querySelector("#relicLevelInput"),
  skill1Input: document.querySelector("#powerSkill1Input"),
  skill2Input: document.querySelector("#powerSkill2Input"),
  burstInput: document.querySelector("#powerBurstInput"),
  entryInput: document.querySelector("#powerEntryInput"),
  calcBtn: document.querySelector("#powerCalcBtn"),
  copyBtn: document.querySelector("#powerCopyBtn"),
  resetBtn: document.querySelector("#powerResetBtn"),
  syncStatusText: document.querySelector("#powerSyncStatus"),
  modeText: document.querySelector("#powerModeText"),
  powerRoundOutput: document.querySelector("#powerRoundOutput"),
};

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toInteger(value, fallback = 0) {
  const n = Math.trunc(toNumber(value, fallback));
  return Number.isFinite(n) ? n : fallback;
}

function toClampedInt(value, fallback = 0, min = 0, max = Number.POSITIVE_INFINITY) {
  const n = toInteger(value, fallback);
  if (!Number.isFinite(n)) return Math.max(min, fallback);
  return Math.max(min, Math.min(n, max));
}

function syncInputInt(element, fallback = 0, min = 0, max = Number.POSITIVE_INFINITY) {
  if (!element) return toClampedInt(fallback, fallback, min, max);
  const currentValue = toClampedInt(element.value, fallback, min, max);
  if (String(element.value) !== String(currentValue)) {
    element.value = String(currentValue);
  }
  return currentValue;
}

function roundValue(value) {
  return Math.round(toNumber(value, 0));
}

function formatInt(value) {
  return String(Math.max(0, Math.round(toNumber(value, 0)))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatTime(value) {
  if (!Number.isFinite(value) || value <= 0) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.toLocaleDateString("zh-CN")} ${d.toLocaleTimeString("zh-CN", { hour12: false })}`;
}

function getCubeSkillsByLevel(level) {
  const index = toInteger(level, 0);
  if (index < 0 || index >= CUBE_SKILL_TABLE.length) return [0, 0];
  return CUBE_SKILL_TABLE[index];
}

function getCubeCoefficient(level) {
  const [q1, q2] = getCubeSkillsByLevel(level);
  if (q1 <= 0 && q2 <= 0) return 0;
  if (q2 > 0) return (q1 + q2 - 2) + 2 + 4;
  return (q1 - 1) + 2;
}

function getRelicCoefficientFromBase(type, level) {
  const relicLevel = toClampedInt(level, 0);
  if (type === "R") {
    return relicLevel + RELIC_R_BONUS;
  }
  if (type === "SR") {
    return relicLevel + RELIC_R_BONUS + RELIC_SR_SECOND_BONUS;
  }
  return 0;
}

function getBaseStatus() {
  try {
    const raw = localStorage.getItem(BASE_STAT_POWER_SYNC_KEY);
    if (!raw) {
      return {
        atk: 0,
        def: 0,
        hp: 0,
        valid: false,
        updatedAt: 0,
        statusText: BASE_STAT_SYNC_DEFAULT_TEXT,
      };
    }
    const data = JSON.parse(raw);
    const atk = Math.max(0, toNumber(data?.atk, 0));
    const def = Math.max(0, toNumber(data?.def, 0));
    const hp = Math.max(0, toNumber(data?.hp, 0));
    const updatedAt = toNumber(data?.updatedAt, 0);
    if (!Number.isFinite(atk) || !Number.isFinite(def) || !Number.isFinite(hp)) throw new Error("invalid");
    return {
      atk,
      def,
      hp,
      updatedAt,
      valid: atk > 0 || def > 0 || hp > 0,
      statusText: `鍩虹灞炴€у凡鍚屾 (${formatTime(updatedAt)})`,
    };
  } catch (err) {
    console.warn("[power merge] read base sync data failed", err);
    return {
      atk: 0,
      def: 0,
      hp: 0,
      updatedAt: 0,
      valid: false,
      statusText: BASE_STAT_SYNC_UNREADABLE_TEXT,
    };
  }
}

function getBaseStats() {
  const baseStatus = getBaseStatus();

  const hasBase = baseStatus.valid;

  return {
    atk: baseStatus.atk,
    def: baseStatus.def,
    hp: baseStatus.hp,
    hasBase,
    statusText: hasBase
      ? `鍩虹灞炴€у凡鍚屾 (${formatTime(baseStatus.updatedAt)})`
      : baseStatus.statusText,
  };
}

function calculatePower() {
  const base = getBaseStats();
  const atk = Math.max(0, toNumber(base.atk, 0));
  const def = Math.max(0, toNumber(base.def, 0));
  const hp = Math.max(0, toNumber(base.hp, 0));

  const skill1 = syncInputInt(powerElements.skill1Input, 1, 1, 10);
  const skill2 = syncInputInt(powerElements.skill2Input, 1, 1, 10);
  const burst = syncInputInt(powerElements.burstInput, 1, 1, 10);
  const entry = syncInputInt(powerElements.entryInput, 0, 0, 99999);
  const cubeLevel = syncInputInt(powerElements.cubeLevelInput, 0, 0, 15);
  const relicMode = powerElements.relicTypeInput?.value || "NONE";
  const relicLevel = syncInputInt(powerElements.relicLevelInput, 0, 0, 15);

  const cubeSkills = getCubeSkillsByLevel(cubeLevel);
  const cubeCoeff = getCubeCoefficient(cubeLevel);
  const relicCoeff = getRelicCoefficientFromBase(relicMode, relicLevel);
  const skillBonus = 0.01 * skill1 + 0.01 * skill2 + 0.02 * burst + 0.0092 * cubeCoeff + 0.0069 * entry + 0.0069 * relicCoeff;
  const rawPower = (1.075 * atk * 18 + (def * 100 + hp) * 0.7) * (1.3 + skillBonus) / 100;
  const rounded = roundValue(rawPower);

  if (powerElements.modeText) {
    powerElements.modeText.textContent = base.hasBase ? `鏉ユ簮锛?{base.statusText}锛岄瓟鏂?${cubeSkills[0]}/${cubeSkills[1]}` : "绛夊緟鍩虹灞炴€ц緭鍏ュ悗璁＄畻";
  }
  if (powerElements.syncStatusText) {
    powerElements.syncStatusText.textContent = base.statusText;
  }
  if (powerElements.powerRoundOutput) {
    powerElements.powerRoundOutput.textContent = base.hasBase ? formatInt(rounded) : "0";
  }

  return {
    atk,
    def,
    hp,
    skill1,
    skill2,
    burst,
    entry,
    cubeLevel,
    cubeCoeff,
    cubeSkills,
    relicMode,
    relicCoeff,
    skillBonus,
    rawPower,
    rounded,
    baseStatusText: base.statusText,
    hasBase: base.hasBase,
  };
}

function buildPowerCopyText() {
  const result = calculatePower();
  const lines = [
    "HP: " + formatInt(result.hp),
    "ATK: " + formatInt(result.atk),
    "DEF: " + formatInt(result.def),
    "1技能等级: " + result.skill1,
    "2技能等级: " + result.skill2,
    "爆裂技能: " + result.burst,
    `词条档位总和: ${result.entry ?? 0}`,
    `魔方技能 (${result.cubeSkills[0]}/${result.cubeSkills[1]})`,
    "收藏品类型: " + result.relicMode,
    "Skill: " + (result.skillBonus || 0).toFixed(4),
    "战力(原始值): " + (result.rawPower || 0).toFixed(4),
    "战力(四舍五入): " + formatInt(result.rounded),
    result.baseStatusText,
  ];
  return lines.join("\n");
}

function copyPowerText() {
  const text = buildPowerCopyText();
  return navigator.clipboard?.writeText(text).catch(() => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    return Promise.resolve();
  });
}

function resetPowerInputs() {
  if (powerElements.skill1Input) powerElements.skill1Input.value = "1";
  if (powerElements.skill2Input) powerElements.skill2Input.value = "1";
  if (powerElements.burstInput) powerElements.burstInput.value = "1";
  if (powerElements.entryInput) powerElements.entryInput.value = "0";
  calculatePower();
}

function bindEvents() {
  [
    powerElements.skill1Input,
    powerElements.skill2Input,
    powerElements.burstInput,
    powerElements.entryInput,
  ].forEach((element) => {
    if (!element) return;
    element.addEventListener("input", calculatePower);
    element.addEventListener("change", calculatePower);
    element.addEventListener("keyup", calculatePower);
    element.addEventListener("blur", calculatePower);
  });

  [
    "#levelInput",
    "#breakthroughCountInput",
    "#coreEnhanceLevelInput",
    "#affinityLevelInput",
    "#weaponTypeInput",
    "#cubeLevelInput",
    "#relicTypeInput",
    "#relicLevelInput",
    "#headEquipmentLevelInput",
    "#handEquipmentLevelInput",
    "#armorEquipmentLevelInput",
    "#bootEquipmentLevelInput",
    "#generalLoopLevelInput",
    "#careerLoopLevelInput",
    "#enterpriseLoopLevelInput",
  ].forEach((selector) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.addEventListener("input", calculatePower);
    element.addEventListener("change", calculatePower);
  });

  if (powerElements.relicTypeInput) {
    powerElements.relicTypeInput.addEventListener("change", calculatePower);
  }
  if (powerElements.relicLevelInput) {
    powerElements.relicLevelInput.addEventListener("change", calculatePower);
  }
  if (powerElements.calcBtn) {
    powerElements.calcBtn.addEventListener("click", calculatePower);
  }
  if (powerElements.resetBtn) {
    powerElements.resetBtn.addEventListener("click", resetPowerInputs);
  }
  if (powerElements.copyBtn) {
    powerElements.copyBtn.addEventListener("click", async () => {
      await copyPowerText();
    });
  }
}

function observeBaseResultChange() {
  const targets = [powerElements.baseHp, powerElements.baseAtk, powerElements.baseDef];
  const observer = new MutationObserver(() => {
    calculatePower();
  });
  targets.forEach((target) => {
    if (!target) return;
    observer.observe(target, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });
}

function initPowerMergeCalculator() {
  bindEvents();
  observeBaseResultChange();
  calculatePower();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPowerMergeCalculator);
} else {
  initPowerMergeCalculator();
}

