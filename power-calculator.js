const DEFAULT_POWER_VALUES = {
  atk: 0,
  def: 0,
  hp: 0,
  skill1: 0,
  skill2: 0,
  burst: 0,
  cubeLevel: 0,
  entryTotal: 0,
  relicMode: "R",
  relicLevel: 0,
};
const POWER_CALCULATOR_STORAGE_KEY = "nikke-power-calculator-state-v1";
const RELIC_DATA_URL = "relic-stats.json";
const CUBE_SKILL_TABLE = [
  [0, 0],
  [1, 0],
  [1, 0],
  [2, 0],
  [2, 0],
  [2, 1],
  [2, 1],
  [3, 1],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 4],
  [3, 5],
  [3, 5],
  [3, 6],
];
const elems = {
  atkInput: document.querySelector("#atkInput"),
  defInput: document.querySelector("#defInput"),
  hpInput: document.querySelector("#hpInput"),
  skill1Input: document.querySelector("#skill1Input"),
  skill2Input: document.querySelector("#skill2Input"),
  skillBurstInput: document.querySelector("#skillBurstInput"),
  cubeLevelInput: document.querySelector("#cubeLevelInput"),
  entryTotalInput: document.querySelector("#entryTotalInput"),
  relicModeSelect: document.querySelector("#relicModeSelect"),
  relicLevelSelect: document.querySelector("#relicLevelSelect"),
  powerInlineValue: document.querySelector("#powerInlineValue"),
  copyBtn: document.querySelector("#copyBtn"),
  resetBtn: document.querySelector("#resetBtn"),
};

let relicData = { R: [], SR: [] };

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toInteger(value, fallback = 0) {
  const n = toNumber(value, fallback);
  return Number.isInteger(n) ? n : Math.trunc(n);
}

function roundPower(value) {
  return Math.round(Number(value) || 0);
}

function formatInt(value) {
  return String(Math.max(0, roundPower(value))).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
}

function getCubeSkillsByLevel(level) {
  const n = toInteger(level, 0);
  return n < 0 || n >= CUBE_SKILL_TABLE.length ? [0, 0] : CUBE_SKILL_TABLE[n];
}

function getCubeCoefficient(level) {
  const [first, second] = getCubeSkillsByLevel(level);
  if (first <= 0 && second <= 0) return 0;
  return second > 0 ? (first + second - 2) * 1 + 2 + 4 : (first - 1) * 1 + 2;
}

function isValidRelicTable(value) {
  return Array.isArray(value?.R) && Array.isArray(value?.SR);
}

function normalizeRelicData(value) {
  const normalized = { R: [], SR: [] };
  ["R", "SR"].forEach((type) => {
    const list = Array.isArray(value?.[type]) ? value[type] : [];
    normalized[type] = list
      .map((item) => ({
        level: toInteger(item?.level, 0),
        hp: toNumber(item?.hp, 0),
        atk: toNumber(item?.atk, 0),
        def: toNumber(item?.def, 0),
        defBonus: toNumber(item?.defBonusPercent, 0),
        damageReduction: toNumber(item?.damageReductionPercent, 0),
        shieldHp: toNumber(item?.shieldHpPercent, 0),
      }))
      .filter((item) => Number.isFinite(item.level));
  });
  return normalized;
}

function getRelicLevels(type) {
  return (relicData[type] || [])
    .map((item) => Math.max(0, toInteger(item.level, 0)))
    .sort((a, b) => a - b);
}

function normalizeRelicLevel(type, level) {
  const levels = getRelicLevels(type);
  if (!levels.length) {
    return Math.max(0, Math.min(15, toInteger(level, 0)));
  }
  const current = Math.max(0, toInteger(level, 0));
  if (levels.includes(current)) return current;
  return levels.reduce((prev, v) => (v <= current && v > prev ? v : prev), levels[0]);
}

function renderRelicLevelOptions(type) {
  if (!elems.relicLevelSelect) return;
  const levels = getRelicLevels(type);
  elems.relicLevelSelect.innerHTML = "";
  if (!levels.length) {
    for (let i = 0; i <= 15; i += 1) {
      elems.relicLevelSelect.appendChild(new Option(String(i), String(i)));
    }
    return;
  }
  levels.forEach((level) => {
    elems.relicLevelSelect.appendChild(new Option(String(level), String(level)));
  });
}

function getRelicBonus(type, level) {
  const targetLevel = normalizeRelicLevel(type, level);
  const row = (relicData[type] || []).find((item) => toInteger(item.level, 0) === targetLevel);
  return row
    ? row
    : { level: targetLevel, hp: 0, atk: 0, def: 0, defBonus: 0, damageReduction: 0, shieldHp: 0 };
}

function loadSavedInputs() {
  try {
    const raw = localStorage.getItem(POWER_CALCULATOR_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      atk: Math.max(0, toNumber(parsed.atk, DEFAULT_POWER_VALUES.atk)),
      def: Math.max(0, toNumber(parsed.def, DEFAULT_POWER_VALUES.def)),
      hp: Math.max(0, toNumber(parsed.hp, DEFAULT_POWER_VALUES.hp)),
      skill1: Math.max(0, toInteger(parsed.skill1, DEFAULT_POWER_VALUES.skill1)),
      skill2: Math.max(0, toInteger(parsed.skill2, DEFAULT_POWER_VALUES.skill2)),
      burst: Math.max(0, toInteger(parsed.burst, DEFAULT_POWER_VALUES.burst)),
      cubeLevel: Math.max(0, toInteger(parsed.cubeLevel, DEFAULT_POWER_VALUES.cubeLevel)),
      entryTotal: parsed?.entryTotal === 0 ? 0 : Math.max(
        0,
        toNumber(parsed.entryTotal, DEFAULT_POWER_VALUES.entryTotal),
      ),
      relicMode: parsed.relicMode === "SR" ? "SR" : DEFAULT_POWER_VALUES.relicMode,
      relicLevel: Math.max(
        0,
        toInteger(
          Object.prototype.hasOwnProperty.call(parsed, "relicLevel")
            ? parsed.relicLevel
            : Object.prototype.hasOwnProperty.call(parsed, "relicR")
              ? parsed.relicR
              : DEFAULT_POWER_VALUES.relicLevel,
          DEFAULT_POWER_VALUES.relicLevel,
        ),
      ),
    };
  } catch {
    return null;
  }
}

function applyInputsFromSavedValues(state) {
  if (!state) return DEFAULT_POWER_VALUES.relicLevel;
  elems.atkInput.value = state.atk;
  elems.defInput.value = state.def;
  elems.hpInput.value = state.hp;
  elems.skill1Input.value = state.skill1;
  elems.skill2Input.value = state.skill2;
  elems.skillBurstInput.value = state.burst;
  elems.cubeLevelInput.value = state.cubeLevel;
  elems.entryTotalInput.value = state.entryTotal;
  elems.relicModeSelect.value = state.relicMode;

  const normalizedRelicLevel = normalizeRelicLevel(state.relicMode, state.relicLevel);
  renderRelicLevelOptions(state.relicMode);
  elems.relicLevelSelect.value = String(normalizedRelicLevel);
  return normalizedRelicLevel;
}

function saveInputs(state) {
  try {
    localStorage.setItem(POWER_CALCULATOR_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function calculatePower() {
  const atk = Math.max(0, toNumber(elems.atkInput?.value, DEFAULT_POWER_VALUES.atk));
  const def = Math.max(0, toNumber(elems.defInput?.value, DEFAULT_POWER_VALUES.def));
  const hp = Math.max(0, toNumber(elems.hpInput?.value, DEFAULT_POWER_VALUES.hp));
  const skill1 = Math.max(0, toInteger(elems.skill1Input?.value, DEFAULT_POWER_VALUES.skill1));
  const skill2 = Math.max(0, toInteger(elems.skill2Input?.value, DEFAULT_POWER_VALUES.skill2));
  const burst = Math.max(0, toInteger(elems.skillBurstInput?.value, DEFAULT_POWER_VALUES.burst));
  const cubeLevel = Math.max(0, toInteger(elems.cubeLevelInput?.value, DEFAULT_POWER_VALUES.cubeLevel));
  const entryTotal = Math.max(0, toNumber(elems.entryTotalInput?.value, DEFAULT_POWER_VALUES.entryTotal));
  const relicMode = elems.relicModeSelect?.value === "SR" ? "SR" : "R";
  const relicLevel = normalizeRelicLevel(
    relicMode,
    toInteger(elems.relicLevelSelect?.value, DEFAULT_POWER_VALUES.relicLevel),
  );
  const relicBonus = getRelicBonus(relicMode, relicLevel);
  const cubeCoeff = getCubeCoefficient(cubeLevel);

  const atkTotal = atk + relicBonus.atk;
  const defTotal = def + relicBonus.def;
  const hpTotal = hp + relicBonus.hp;

  const skillMultiplier = 0.01 * skill1 + 0.01 * skill2 + 0.02 * burst + 0.0092 * cubeCoeff + 0.0069 * entryTotal;
  const power = ((1.075 * atkTotal * 18 + (defTotal * 100 + hpTotal) * 0.7) * (1.3 + skillMultiplier)) / 100;
  const powerRounded = roundPower(power);

  elems.powerInlineValue && (elems.powerInlineValue.textContent = formatInt(powerRounded));
  saveInputs({
    atk,
    def,
    hp,
    skill1,
    skill2,
    burst,
    cubeLevel,
    entryTotal,
    relicMode,
    relicLevel,
  });

  return {
    atk: atkTotal,
    def: defTotal,
    hp: hpTotal,
    entryTotal,
    cubeCoeff,
    relicBonus,
    powerRounded,
    relicLevel,
  };
}

function syncText() {
  const result = calculatePower();
  return `最终战力 ${formatInt(result.powerRounded)}`;
}

function handleRelicTypeChange() {
  const relicMode = elems.relicModeSelect?.value === "SR" ? "SR" : "R";
  renderRelicLevelOptions(relicMode);
  calculatePower();
}

function bindEvents() {
  const inputElements = [
    elems.atkInput,
    elems.defInput,
    elems.hpInput,
    elems.skill1Input,
    elems.skill2Input,
    elems.skillBurstInput,
    elems.cubeLevelInput,
    elems.entryTotalInput,
    elems.relicLevelSelect,
  ];
  inputElements.forEach((elem) => {
    if (!elem) return;
    elem.addEventListener("input", calculatePower);
    elem.addEventListener("change", calculatePower);
  });
  elems.relicModeSelect?.addEventListener("change", handleRelicTypeChange);

  elems.resetBtn?.addEventListener("click", () => {
    elems.atkInput.value = DEFAULT_POWER_VALUES.atk;
    elems.defInput.value = DEFAULT_POWER_VALUES.def;
    elems.hpInput.value = DEFAULT_POWER_VALUES.hp;
    elems.skill1Input.value = DEFAULT_POWER_VALUES.skill1;
    elems.skill2Input.value = DEFAULT_POWER_VALUES.skill2;
    elems.skillBurstInput.value = DEFAULT_POWER_VALUES.burst;
    elems.cubeLevelInput.value = DEFAULT_POWER_VALUES.cubeLevel;
    elems.entryTotalInput.value = DEFAULT_POWER_VALUES.entryTotal;
    elems.relicModeSelect.value = DEFAULT_POWER_VALUES.relicMode;
    renderRelicLevelOptions(DEFAULT_POWER_VALUES.relicMode);
    elems.relicLevelSelect.value = String(DEFAULT_POWER_VALUES.relicLevel);
    calculatePower();
  });

  elems.copyBtn?.addEventListener("click", async () => {
    const text = syncText();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("clipboard-unavailable");
      }
    } catch {
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
    }
  });
}

async function loadRelicData() {
  const fallback = {
    R: [
      { level: 0, hp: 19400, atk: 638, def: 128, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 1, hp: 24750, atk: 809, def: 164, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 2, hp: 30050, atk: 980, def: 201, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 3, hp: 35400, atk: 1150, def: 237, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 4, hp: 40700, atk: 1321, def: 274, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 5, hp: 48700, atk: 1577, def: 328, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 6, hp: 56700, atk: 1833, def: 383, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 7, hp: 64700, atk: 2089, def: 438, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 8, hp: 72700, atk: 2346, def: 492, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 9, hp: 80650, atk: 2602, def: 547, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 10, hp: 91350, atk: 2943, def: 620, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 11, hp: 102000, atk: 3285, def: 692, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 12, hp: 112650, atk: 3626, def: 765, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 13, hp: 123300, atk: 3968, def: 838, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 14, hp: 133950, atk: 4309, def: 911, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 15, hp: 147250, atk: 4736, def: 1002, defBonusPercent: 37, damageReductionPercent: 17, shieldHpPercent: 30 },
    ],
    SR: [
      { level: 0, hp: 94000, atk: 3029, def: 638, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 1, hp: 104650, atk: 3370, def: 711, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 2, hp: 115300, atk: 3712, def: 783, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 3, hp: 125950, atk: 4053, def: 856, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 4, hp: 136600, atk: 4395, def: 929, defBonusPercent: 30, damageReductionPercent: 10, shieldHpPercent: 12 },
      { level: 5, hp: 149950, atk: 4821, def: 1020, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 6, hp: 163250, atk: 5248, def: 1111, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 7, hp: 176600, atk: 5675, def: 1202, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 8, hp: 189900, atk: 6102, def: 1293, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 9, hp: 203200, atk: 6529, def: 1384, defBonusPercent: 32, damageReductionPercent: 12, shieldHpPercent: 18 },
      { level: 10, hp: 219200, atk: 7041, def: 1494, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 11, hp: 235200, atk: 7554, def: 1603, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 12, hp: 251150, atk: 8066, def: 1712, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 13, hp: 267150, atk: 8578, def: 1821, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 14, hp: 283150, atk: 9090, def: 1931, defBonusPercent: 35, damageReductionPercent: 14, shieldHpPercent: 24 },
      { level: 15, hp: 301800, atk: 9688, def: 2058, defBonusPercent: 37, damageReductionPercent: 17, shieldHpPercent: 30 },
    ],
  };

  try {
    const response = await fetch(RELIC_DATA_URL, { cache: "no-cache" });
    if (!response.ok) {
      relicData = fallback;
      return;
    }
    const data = await response.json();
    if (isValidRelicTable(data)) {
      relicData = normalizeRelicData(data);
      return;
    }
    relicData = fallback;
  } catch {
    relicData = fallback;
  }
}

function init() {
  const savedInputs = loadSavedInputs();
  bindEvents();
  const initType = savedInputs?.relicMode || DEFAULT_POWER_VALUES.relicMode;
  renderRelicLevelOptions(initType);
  applyInputsFromSavedValues(savedInputs || {
    atk: DEFAULT_POWER_VALUES.atk,
    def: DEFAULT_POWER_VALUES.def,
    hp: DEFAULT_POWER_VALUES.hp,
    skill1: DEFAULT_POWER_VALUES.skill1,
    skill2: DEFAULT_POWER_VALUES.skill2,
    burst: DEFAULT_POWER_VALUES.burst,
    cubeLevel: DEFAULT_POWER_VALUES.cubeLevel,
    entryTotal: DEFAULT_POWER_VALUES.entryTotal,
    relicMode: DEFAULT_POWER_VALUES.relicMode,
    relicLevel: DEFAULT_POWER_VALUES.relicLevel,
  });
  loadRelicData().then(() => {
    const type = elems.relicModeSelect?.value === "SR" ? "SR" : "R";
    renderRelicLevelOptions(type);
    if (savedInputs) {
      const normalized = normalizeRelicLevel(type, savedInputs.relicLevel);
      elems.relicLevelSelect.value = String(normalized);
    } else {
      elems.relicLevelSelect.value = String(DEFAULT_POWER_VALUES.relicLevel);
    }
    calculatePower();
  });
}

window.addEventListener("DOMContentLoaded", init);
