const FRAMES_PER_SECOND = 60;
const TEAM_SIZE = 5;
const ENEMY_TEAM_SIZE = 5;
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
const CHART_MAX_FRAME = 600;
const MG_SUSTAIN_START_FRAME = 182;
const MG_SUSTAIN_INTERVAL_FRAMES = 2;

const state = {
  defenseTeam: Array(TEAM_SIZE).fill(null),
  defenseChargeSpeeds: Array(TEAM_SIZE).fill(0),
  team: Array(TEAM_SIZE).fill(null),
  chargeSpeeds: Array(TEAM_SIZE).fill(0),
  activeTeamKey: "attack",
  filters: {
    common: "common",
    weapon: "all",
    company: "all",
    stage: "all",
    region: "cn",
    search: "",
  },
};

const els = {
  characterGrid: document.querySelector("#characterGrid"),
  teamSlots: document.querySelector("#teamSlots"),
  resultPanel: document.querySelector("#resultPanel"),
  chargeChart: document.querySelector("#chargeChart"),
  clearTeamButton: document.querySelector("#clearTeamButton"),
  commonFilter: document.querySelector("#commonFilter"),
  weaponFilter: document.querySelector("#weaponFilter"),
  companyFilter: document.querySelector("#companyFilter"),
  stageFilter: document.querySelector("#stageFilter"),
  regionFilter: document.querySelector("#regionFilter"),
  searchInput: document.querySelector("#searchInput"),
  toast: document.querySelector("#toast"),
  summaryStrip: document.querySelector("#summaryStrip"),
  listCount: document.querySelector("#listCount"),
};

let draggedTeamIndex = null;
let draggedTeamKey = null;

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
  return (frame / FRAMES_PER_SECOND).toFixed(2);
}

function formatFrame(frame) {
  return `${frame} 帧 / ${frameToSeconds(frame)} 秒`;
}

function getStandardChargeBand(frame) {
  const standards = [...STANDARD_CHARGE_FRAMES].sort((a, b) => a.frame - b.frame);
  const fasterThan = standards.filter((standard) => frame < standard.frame);
  const slowerThan = standards.filter((standard) => frame > standard.frame);
  const equalStandard = standards.find((standard) => frame === standard.frame);

  if (equalStandard) return `等于${equalStandard.label}`;
  if (fasterThan.length === standards.length) return `快于${standards[0].label}`;
  if (slowerThan.length === standards.length) return `慢于${standards.at(-1).label}`;
  return `快于${fasterThan[0].label}`;
}

function getTeamPositionText(finishingPositionIndices = []) {
  const finishingPositions = new Set(finishingPositionIndices);
  return state.team
    .map((character, index) => {
      if (!character) return "空位";
      const chargeSpeed = Number(state.chargeSpeeds[index]) || Number(character.chargeSpeedPercent) || 0;
      const isChargeWeapon = character.weapon === "RL" || character.weapon === "SR";
      const prefix = finishingPositions.has(index) ? "*" : "";
      const name = `${prefix}${character.name}`;
      return isChargeWeapon && chargeSpeed > 0 ? `${name}(${chargeSpeed})` : name;
    })
    .join("，");
}

function getResultCopyText(result) {
  return `${getTeamPositionText(result.finishingPositionIndices)}\n${getStandardChargeBand(result.fullFrame)}（${result.fullFrame}F）`;
}

function getTeamState(teamKey = state.activeTeamKey) {
  return teamKey === "defense" ? state.defenseTeam : state.team;
}

function getChargeSpeedState(teamKey = state.activeTeamKey) {
  return teamKey === "defense" ? state.defenseChargeSpeeds : state.chargeSpeeds;
}

function setActiveTeam(teamKey) {
  state.activeTeamKey = teamKey === "defense" ? "defense" : "attack";
}

function applyChargeSpeedFrames(baseFrames, chargeSpeedPercent = 0) {
  if (!baseFrames) return baseFrames;
  const speed = Number(chargeSpeedPercent) || 0;
  if (speed <= 0) return baseFrames;
  return Math.floor((baseFrames / 2) / (1 + speed / 100)) * 2;
}

function applyChargeSpeedTotalFrames(baseFrames, chargeSpeedPercent = 0) {
  if (!baseFrames) return baseFrames;
  const speed = Number(chargeSpeedPercent) || 0;
  if (speed <= 0) return baseFrames;
  return Math.floor(baseFrames / (1 + speed / 100) / 2) * 2;
}

function getChargeFrames(character, positionIndex) {
  const speed = Number(character.chargeSpeedPercent) || 0;

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
      character.timing.turnFrames != null ? baseChargeFrames + character.timing.turnFrames : character.timing.intervalFrames;
    const intervalFrames = applyChargeSpeedTotalFrames(baseIntervalFrames, speed);

    if (character.weapon === "RL" && character.timing.projectileFlightFramesByPosition) {
      const positionKey = `P${positionIndex + 1}`;
      const flightFrames = character.timing.projectileFlightFramesByPosition[positionKey] ?? 0;
      const baseFirstFrame = baseChargeFrames + flightFrames;
      return {
        firstFrame: character.firstFrameOverride ?? applyChargeSpeedTotalFrames(baseFirstFrame, speed),
        interval: character.attackIntervalFrames || intervalFrames,
        chargeFrames,
      };
    }

    if (["SR", "RL"].includes(character.weapon)) {
      return {
        firstFrame: character.firstFrameOverride ?? applyChargeSpeedTotalFrames(baseChargeFrames, speed),
        interval: character.attackIntervalFrames || intervalFrames,
        chargeFrames,
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
      firstFrame: character.firstFrameOverride ?? applyChargeSpeedTotalFrames(baseChargeFrames, speed),
      interval: character.attackIntervalFrames || applyChargeSpeedTotalFrames(baseChargeFrames + turnFrames, speed),
      chargeFrames,
    };
  }
  if (character.weapon === "RL") {
    const flightFrames = character.projectileFlightFrames ?? (positionIndex <= 1 ? 16 : 14);
    const turnFrames = character.turnFrames ?? 16;
    const baseChargeFrames = sheetChargeFrames ?? 60;
    return {
      firstFrame: character.firstFrameOverride ?? applyChargeSpeedTotalFrames(baseChargeFrames + flightFrames, speed),
      interval: character.attackIntervalFrames || applyChargeSpeedTotalFrames(baseChargeFrames + turnFrames, speed),
      chargeFrames,
    };
  }

  throw new Error(`未知武器类型：${character.weapon}`);
}

function getRlHitSegments(character) {
  const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
  const start = Math.max(0, DEFAULT_RL_TARGET_INDEX - range);
  const end = Math.min(ENEMY_TEAM_SIZE - 1, DEFAULT_RL_TARGET_INDEX + range);
  return (end - start + 1) * 2;
}

function getChargeValue(character) {
  const coverMultiplier = character.weapon === "RL" ? getRlHitSegments(character) : character.hasPenetration ? 2 : 1;
  const extraMultiplier = character.hasExtraDamage ? 2 : 1;
  return character.burstGen * coverMultiplier * extraMultiplier + (character.flatBurstBonus || 0);
}

function getChargeBreakdown(character) {
  const hitMultiplier = character.weapon === "RL" ? getRlHitSegments(character) : character.hasPenetration ? 2 : 1;
  const extraMultiplier = character.hasExtraDamage ? 2 : 1;
  const hitLabel = character.weapon === "RL" ? `RL命中 ${hitMultiplier} 段` : character.hasPenetration ? "穿透 2 段" : "命中 1 段";
  const baseCharge = character.burstGen * hitMultiplier * extraMultiplier;
  const flatBonus = character.flatBurstBonus || 0;
  const lines = [
    `充能组成：${character.burstGen.toFixed(2)} × ${hitMultiplier} × ${extraMultiplier}${flatBonus ? ` + ${flatBonus.toFixed(2)}` : ""} = ${getChargeValue(character).toFixed(2)}%`,
    `基础 ${character.burstGen.toFixed(2)}%`,
    hitLabel,
  ];

  if (character.hasExtraDamage) lines.push("额外伤害 ×2");
  if (flatBonus) lines.push(`固定补充 +${flatBonus.toFixed(2)}%`);
  if (character.hitCountExtraEvents?.length) {
    lines.push(
      `攻击次数追加：${character.hitCountExtraEvents
        .map((event) => `第${event.hit}次 +${(character.burstGen * event.segments * extraMultiplier).toFixed(2)}%`)
        .join("，")}`,
    );
  }
  if (character.delayedExtraHits?.length) {
    lines.push(
      `延迟追加：${character.delayedExtraHits
        .map((event) => `${event.delayFrames}帧后 +${(character.burstGen * event.segments * extraMultiplier).toFixed(2)}%`)
        .join("，")}`,
    );
  }

  return lines.join("\n");
}

function getCharacterDetailText(character) {
  return [
    `${character.name}（${character.rarity || "SSR"}）`,
    `最终单发充能：${getChargeValue(character).toFixed(2)}%`,
    getChargeBreakdown(character),
  ].join("\n");
}

function getDelayedExtraEvents(event, currentFrame) {
  return (event.character.delayedExtraHits || []).map((extra) => ({
    character: event.character,
    positionIndex: event.positionIndex,
    frame: currentFrame + extra.delayFrames,
    chargeValue: event.character.burstGen * extra.segments * (event.character.hasExtraDamage ? 2 : 1),
    source: "delayed",
  }));
}

function getHitCountExtraCharge(event) {
  return (event.character.hitCountExtraEvents || [])
    .filter((extra) => extra.hit === event.hits)
    .reduce((sum, extra) => {
      const extraMultiplier = event.character.hasExtraDamage ? 2 : 1;
      return sum + event.character.burstGen * extra.segments * extraMultiplier;
    }, 0);
}

function getAttackShotCount(event) {
  if (event.character.weapon !== "MG") return 1;
  return MG_WARMUP_EVENTS[event.mgWarmupIndex]?.shots ?? 1;
}

function advanceAttackEvent(event) {
  if (event.character.weapon !== "MG") {
    event.nextFrame += event.interval;
    return;
  }

  if (event.mgWarmupIndex < MG_WARMUP_EVENTS.length - 1) {
    event.mgWarmupIndex += 1;
    event.nextFrame = MG_WARMUP_EVENTS[event.mgWarmupIndex].frame;
    return;
  }

  event.mgWarmupIndex += 1;
  event.nextFrame = event.nextFrame < MG_SUSTAIN_START_FRAME ? MG_SUSTAIN_START_FRAME : event.nextFrame + MG_SUSTAIN_INTERVAL_FRAMES;
}

function characterForSlot(character, positionIndex, teamKey = "attack") {
  if (!character) return null;
  const chargeSpeeds = getChargeSpeedState(teamKey);
  return {
    ...character,
    chargeSpeedPercent: Number(chargeSpeeds[positionIndex]) || character.chargeSpeedPercent || 0,
  };
}

function simulateBurst(team, teamKey = "attack") {
  const members = team
    .map((character, positionIndex) => ({ character: characterForSlot(character, positionIndex, teamKey), positionIndex }))
    .filter((member) => member.character);

  if (members.length === 0) return null;

  const events = members.map((member) => {
    const timing = getChargeFrames(member.character, member.positionIndex);
    return {
      ...member,
      nextFrame: timing.firstFrame,
      interval: timing.interval,
      chargeFrames: timing.chargeFrames,
      chargeValue: getChargeValue(member.character),
      hits: 0,
      mgWarmupIndex: member.character.weapon === "MG" ? 0 : null,
      totalCharge: 0,
      hitFrames: [],
    };
  });

  let totalCharge = 0;
  let currentFrame = 0;
  let pendingExtraEvents = [];
  let currentFrameContributors = new Set();
  const timeline = [];

  while (totalCharge < 100 - BURST_EPSILON && currentFrame <= 10000) {
    const nextAttackFrame = Math.min(...events.map((event) => event.nextFrame));
    const nextExtraFrame = pendingExtraEvents.length ? Math.min(...pendingExtraEvents.map((event) => event.frame)) : Infinity;
    currentFrame = Math.min(nextAttackFrame, nextExtraFrame);
    currentFrameContributors = new Set();
    const contributions = new Map();
    const addContribution = (event, value, label) => {
      if (!event || !value) return;
      currentFrameContributors.add(event.positionIndex);
      const current = contributions.get(event.positionIndex) || {
        positionIndex: event.positionIndex,
        character: event.character,
        charge: 0,
        cumulativeCharge: 0,
        labels: [],
      };
      current.charge += value;
      current.cumulativeCharge = event.totalCharge;
      current.labels.push(label);
      contributions.set(event.positionIndex, current);
    };

    const activeExtras = pendingExtraEvents.filter((event) => event.frame === currentFrame);
    pendingExtraEvents = pendingExtraEvents.filter((event) => event.frame !== currentFrame);
    activeExtras.forEach((extra) => {
      totalCharge += extra.chargeValue;
      const owner = events.find((event) => event.character.id === extra.character.id);
      if (owner) {
        owner.totalCharge += extra.chargeValue;
        addContribution(owner, extra.chargeValue, "延迟额外");
      }
    });

    const activeEvents = events.filter((event) => event.nextFrame === currentFrame);
    activeEvents.forEach((event) => {
      const shotCount = getAttackShotCount(event);
      const chargeValue = event.chargeValue * shotCount;
      totalCharge += chargeValue;
      event.totalCharge += chargeValue;
      event.hits += shotCount;
      event.hitFrames.push(shotCount > 1 ? `${currentFrame}×${shotCount}` : currentFrame);
      addContribution(event, chargeValue, shotCount > 1 ? `${shotCount}发命中` : "命中");
      const hitCountExtraCharge = getHitCountExtraCharge(event);
      totalCharge += hitCountExtraCharge;
      event.totalCharge += hitCountExtraCharge;
      addContribution(event, hitCountExtraCharge, "额外触发");
      pendingExtraEvents.push(...getDelayedExtraEvents(event, currentFrame));
      advanceAttackEvent(event);
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

  return {
    fullFrame: currentFrame,
    burst1Frame: currentFrame + 26,
    burst2Frame: currentFrame + 58,
    burst3Frame: currentFrame + 90,
    totalCharge,
    chargePerSecond: currentFrame === 0 ? totalCharge * FRAMES_PER_SECOND : (totalCharge / currentFrame) * FRAMES_PER_SECOND,
    finishingPositionIndices: [...currentFrameContributors].sort((a, b) => a - b),
    timeline,
    members: events,
  };
}

function getCharacterById(id) {
  return CHARACTERS.find((character) => character.id === id) || null;
}

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function initFilters() {
  WEAPON_ORDER.forEach((weapon) => els.weaponFilter.append(createOption(weapon, WEAPON_LABELS[weapon] || weapon)));

  [...new Set(CHARACTERS.map((character) => character.company))]
    .sort((a, b) => a.localeCompare(b, "zh-CN"))
    .forEach((company) => els.companyFilter.append(createOption(company, company)));

  ["B1", "B2", "B3"].forEach((stage) => els.stageFilter.append(createOption(stage, STAGE_LABELS[stage] || stage)));
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

function getTagMarkup(character) {
  const tags = [];
  if (character.hasPenetration) tags.push("穿透");
  if (character.hasExtraDamage) tags.push("额外伤害");
  if (character.flatBurstBonus) tags.push(`固定 +${character.flatBurstBonus}`);
  if (character.weapon === "RL") tags.push(`RL ${getRlHitSegments(character)} 段`);
  return tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
}

function getRarityClass(character) {
  const rarity = String(character.rarity || "SSR").toLowerCase();
  return ["ssr", "sr", "r"].includes(rarity) ? rarity : "ssr";
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
  return `assets/icons/nikke-top/weapons/${weaponIconMap[character.weapon] || "1"}.png`;
}

function getBurstIcon(character) {
  const firstStage = String(character.burstStage || "B0").split("/")[0];
  const burstIconMap = {
    B0: "0",
    B1: "1",
    B2: "2",
    B3: "3",
  };
  return `assets/icons/nikke-top/bursts/${burstIconMap[firstStage] || "0"}.png`;
}

function getElementIcon(character) {
  const elementIconMap = {
    燃烧: "1",
    风压: "2",
    铁甲: "3",
    电击: "4",
    水冷: "5",
  };
  return `assets/icons/nikke-top/elements/${elementIconMap[character.element] || "1"}.png`;
}

function getIconMarkup(src, label, className) {
  return `<span class="tile-icon ${className}"><img src="${escapeHtml(src)}" alt="${escapeHtml(label)}" loading="lazy" /></span>`;
}

function getFilteredCharacters() {
  const keyword = state.filters.search.trim().toLowerCase();
  return CHARACTERS.filter((character) => {
    const matchesCommon = state.filters.common === "all" || character.isCommon;
    const matchesWeapon = state.filters.weapon === "all" || character.weapon === state.filters.weapon;
    const matchesCompany = state.filters.company === "all" || character.company === state.filters.company;
    const matchesStage = state.filters.stage === "all" || character.burstStage.split("/").includes(state.filters.stage);
    const matchesRegion = state.filters.region === "all" || character.regions.includes(state.filters.region);
    const matchesSearch =
      !keyword ||
      character.name.toLowerCase().includes(keyword) ||
      character.enName.toLowerCase().includes(keyword);
    return matchesCommon && matchesWeapon && matchesCompany && matchesStage && matchesRegion && matchesSearch;
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
  els.listCount.textContent = `${characters.length} / ${CHARACTERS.length} 名角色`;

  characters.forEach((character, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `character-tile rarity-${getRarityClass(character)}${pickedIds.has(character.id) ? " is-picked" : ""}`;
    tile.setAttribute("aria-label", `加入 ${character.name}，${character.weapon}，单发 ${getChargeValue(character).toFixed(2)}%`);
    tile.title = `#${index + 1} ${character.name}\n${character.rarity || "SSR"} · ${character.weapon} · ${character.burstStage} · ${getRegionLabel(character)}\n最终单发 ${getChargeValue(character).toFixed(2)}%\n${getChargeBreakdown(character)}`;
    tile.innerHTML = `
      <span class="tile-avatar">${getAvatarMarkup(character)}</span>
      ${getIconMarkup(getWeaponIcon(character), character.weapon, "weapon-icon")}
      ${getIconMarkup(getBurstIcon(character), character.burstStage, "burst-icon")}
      ${getIconMarkup(getElementIcon(character), character.element, "element-icon")}
      <span class="tile-charge">${getChargeValue(character).toFixed(1)}</span>
      <span class="tile-check" aria-hidden="true">✓</span>
    `;
    tile.addEventListener("click", () => toggleCharacter(character));
    tile.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      copyCharacterDetails(character);
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
    const isFinisher = finishingPositions.has(index);
    const slot = document.createElement("div");
    slot.className = `team-slot${character ? " filled" : ""}${isFinisher ? " is-finisher" : ""}`;
    slot.dataset.slotIndex = index;
    slot.draggable = Boolean(character);
    slot.innerHTML = character
      ? `
        <button class="slot-remove" type="button" aria-label="移除 ${escapeHtml(character.name)}">
          <span class="position">P${index + 1}</span>
          <span class="team-avatar">${getAvatarMarkup(character)}</span>
          <span class="slot-copy" aria-hidden="true">
            ${isFinisher ? '<span class="finish-mark">✓</span>' : ""}
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
        updateTeamFinishMarkers(renderResults());
      });
    }
    fragment.append(slot);
  });

  els.teamSlots.replaceChildren(fragment);
}

function renderTeam() {
  const fragment = document.createDocumentFragment();
  const result = simulateBurst(state.team, "attack");
  const finishingPositions = new Set(result && !result.error ? result.finishingPositionIndices : []);

  ["defense", "attack"].forEach((teamKey) => {
    const team = getTeamState(teamKey);
    const chargeSpeeds = getChargeSpeedState(teamKey);
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
    team.forEach((character, index) => {
      const isFinisher = teamKey === "attack" && finishingPositions.has(index);
      const slot = document.createElement("div");
      slot.className = `team-slot${character ? " filled" : ""}${isFinisher ? " is-finisher" : ""}`;
      slot.dataset.slotIndex = index;
      slot.dataset.teamKey = teamKey;
      slot.draggable = Boolean(character);
      slot.innerHTML = character
        ? `
          <button class="slot-remove" type="button" aria-label="移除 ${escapeHtml(character.name)}">
            <span class="team-avatar">${getAvatarMarkup(character)}</span>
            <span class="slot-copy" aria-hidden="true">
              ${isFinisher ? '<span class="finish-mark">✓</span>' : ""}
            </span>
          </button>
          <label class="speed-control">
            <span>蓄</span>
            <input type="number" min="0" max="100" step="1" value="${Number(chargeSpeeds[index]) || 0}" data-speed-index="${index}" />
            <span>%</span>
          </label>
        `
        : `
          <div class="slot-empty">
            <span class="position">P${index + 1}</span>
            <span class="team-avatar empty-avatar">+</span>
          </div>
        `;

      slot.addEventListener("click", () => {
        if (state.activeTeamKey !== teamKey) {
          setActiveTeam(teamKey);
          render();
        }
      });

      slot.addEventListener("dragstart", (event) => {
        if (!character || event.target.closest(".speed-control")) {
          event.preventDefault();
          return;
        }
        draggedTeamIndex = index;
        draggedTeamKey = teamKey;
        slot.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", `${teamKey}:${index}`);
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

      if (character) {
        slot.querySelector(".slot-remove").addEventListener("click", (event) => {
          event.stopPropagation();
          setActiveTeam(teamKey);
          removeCharacter(teamKey, index);
        });
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
          chargeSpeeds[index] = Math.max(0, Number(event.target.value) || 0);
          saveTeam();
          if (teamKey === "attack") updateTeamFinishMarkers(renderResults());
        });
      }
      slotsRow.append(slot);
    });

    fragment.append(row);
  });

  els.teamSlots.replaceChildren(fragment);
}

function updateTeamFinishMarkers(result = simulateBurst(state.team, "attack")) {
  const finishingPositions = new Set(result && !result.error ? result.finishingPositionIndices : []);

  els.teamSlots.querySelectorAll('.team-slot[data-team-key="attack"]').forEach((slot) => {
    const index = Number(slot.dataset.slotIndex);
    const isFinisher = finishingPositions.has(index);
    slot.classList.toggle("is-finisher", isFinisher);

    const slotCopy = slot.querySelector(".slot-copy");
    if (!slotCopy) return;

    const existingMark = slotCopy.querySelector(".finish-mark");
    if (isFinisher && !existingMark) {
      const mark = document.createElement("span");
      mark.className = "finish-mark";
      mark.textContent = "✓";
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

function estimateChartLabelWidth(label) {
  return [...String(label)].reduce((width, char) => width + (char.charCodeAt(0) > 255 ? 15 : 8), 0);
}

function getChargeChartMarkup(result, measuredLabelGutter = null) {
  if (!result || result.error) {
    return '<p class="empty-result">选择队伍后显示关键充能帧。</p>';
  }

  const width = 1800;
  const height = 440;
  const margin = { top: 30, right: 42, bottom: 42, left: 0 };
  const chartHeight = height - margin.top - margin.bottom;
  const memberByPosition = new Map(result.members.map((member) => [member.positionIndex, member]));
  const laneByPosition = new Map(result.members.map((member, index) => [member.positionIndex, index]));
  const visibleTimeline = result.timeline.filter((entry) => entry.frame <= CHART_MAX_FRAME);
  const timelineByFrame = new Map(visibleTimeline.map((entry) => [entry.frame, entry]));
  const pointByMemberFrame = new Map(
    visibleTimeline.flatMap((entry) =>
      entry.contributions.map((contribution) => [`${contribution.positionIndex}-${entry.frame}`, { entry, contribution }]),
    ),
  );
  const memberPointGroups = result.members.map((member) => ({
    member,
    frames: visibleTimeline
      .filter((entry) => entry.contributions.some((contribution) => contribution.positionIndex === member.positionIndex))
      .map((entry) => entry.frame),
  }));
  const points = memberPointGroups.flatMap((group) =>
    group.frames.map((frame) => ({ frame, positionIndex: group.member.positionIndex })),
  );
  const visibleStandards = result.fullFrame <= CHART_MAX_FRAME ? [{ label: "", frame: result.fullFrame, isFullFrame: true }] : [];
  const burstMarkers = [
    { label: "爆裂1", frame: result.burst1Frame },
    { label: "爆裂2", frame: result.burst2Frame },
    { label: "爆裂3", frame: result.burst3Frame },
  ].filter((marker) => marker.frame <= CHART_MAX_FRAME);
  const maxFrame = Math.min(
    CHART_MAX_FRAME,
    Math.max(result.fullFrame, result.burst1Frame, result.burst2Frame, result.burst3Frame, 1),
  );
  const maxBurstFrame = burstMarkers.length ? Math.max(...burstMarkers.map((marker) => marker.frame)) : maxFrame;
  const rlStandards = Array.from({ length: Math.floor(maxFrame / 76) }, (_, index) => ({
    label: `${index + 1}RL`,
    frame: (index + 1) * 76,
  }));
  const tickStep = maxFrame <= 180 ? 20 : maxFrame <= 320 ? 40 : 60;
  const tickFrames = Array.from({ length: Math.floor(maxFrame / tickStep) + 1 }, (_, index) => index * tickStep);
  if (!tickFrames.includes(maxFrame)) tickFrames.push(maxFrame);
  const finishingPositions = new Set(result.finishingPositionIndices);
  const labelGap = 10;
  const chartLabels = [
    "标准轴",
    "总充能",
    ...result.members.map((member) => `${finishingPositions.has(member.positionIndex) ? "*" : ""}${member.character.name}`),
  ];
  const labelGutter =
    measuredLabelGutter ?? Math.ceil(Math.max(...chartLabels.map(estimateChartLabelWidth), 0) + labelGap);
  const chartWidth = width - labelGutter - margin.right;
  const xForFrame = (frame) => labelGutter + (frame / maxFrame) * chartWidth;
  const standardLaneIndex = 0;
  const firstMemberLaneIndex = 1;
  const totalLaneIndex = result.members.length + 1;
  const laneCount = result.members.length + 2;
  const yForLane = (index) => margin.top + (laneCount === 1 ? chartHeight / 2 : (chartHeight / laneCount) * index);
  const yForPosition = (index) => yForLane((laneByPosition.get(index) ?? result.members.length) + firstMemberLaneIndex);
  const yForStandard = () => yForLane(standardLaneIndex);
  const yForTotal = () => yForLane(totalLaneIndex);

  const gridLines = tickFrames
    .map((frame) => {
      const x = xForFrame(frame);
      const isFullFrame = frame === result.fullFrame;
      return `
        <g class="${isFullFrame ? "chart-grid is-full" : "chart-grid"}">
          <line x1="${x}" y1="${margin.top}" x2="${x}" y2="${height - margin.bottom}" />
          <text x="${x}" y="${height - 14}" text-anchor="middle">${frame}F</text>
        </g>
      `;
    })
    .join("");

  const standardLines = visibleStandards
    .filter((standard, index, standards) => standards.findIndex((item) => item.label === standard.label && item.frame === standard.frame) === index)
    .map((standard) => {
      const x = xForFrame(standard.frame);
      const isFullFrame = standard.isFullFrame;
      const label = standard.label ? `<text x="${x}" y="${margin.top - 34}" text-anchor="middle">${escapeHtml(standard.label)}</text>` : "";
      return `
        <g class="${isFullFrame ? "chart-standard is-full" : "chart-standard"}">
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

  const standardReferenceLines = rlStandards
    .map((standard) => {
      const x = xForFrame(standard.frame);
      return `<line class="chart-standard-reference" x1="${x}" y1="${yForStandard()}" x2="${x}" y2="${height - margin.bottom}" />`;
    })
    .join("");
  const standardTrack = `<line class="chart-track chart-standard-track" x1="${xForFrame(0)}" y1="${yForStandard()}" x2="${xForFrame(maxFrame)}" y2="${yForStandard()}" />`;
  const standardPoints = rlStandards
    .map((standard) => {
      const x = xForFrame(standard.frame);
      const y = yForStandard();
      return `<circle class="chart-standard-point" cx="${x}" cy="${y}" r="5"><title>${escapeHtml(`${standard.label} · ${standard.frame} F`)}</title></circle><text class="chart-standard-label" x="${x}" y="${y - 12}" text-anchor="middle">${escapeHtml(standard.label)}</text>`;
    })
    .join("");

  const tracks = memberPointGroups
    .map((group) => {
      if (group.frames.length < 2) return "";
      const y = yForPosition(group.member.positionIndex);
      const firstFrame = Math.min(...group.frames);
      const lastFrame = Math.max(...group.frames);
      return `<line class="chart-track" x1="${xForFrame(firstFrame)}" y1="${y}" x2="${xForFrame(lastFrame)}" y2="${y}" />`;
    })
    .join("");

  const pointMarks = points
    .map((point) => {
      const x = xForFrame(point.frame);
      const y = yForPosition(point.positionIndex);
      const pointDetail = pointByMemberFrame.get(`${point.positionIndex}-${point.frame}`);
      const contribution = pointDetail?.contribution;
      const entry = pointDetail?.entry || timelineByFrame.get(point.frame);
      const tooltip = contribution
        ? formatTooltipLines([
            contribution.characterName,
            `时间：${point.frame} F`,
            `充能：${contribution.charge.toFixed(2)}%`,
            `累积充能：${contribution.cumulativeCharge.toFixed(2)}%`,
            `充能组成：${contribution.labels.join(" + ")}`,
          ])
        : "";
      const isFinisher = point.frame === result.fullFrame && finishingPositions.has(point.positionIndex);
      return `<circle class="${isFinisher ? "chart-point is-finisher" : "chart-point"}" cx="${x}" cy="${y}" r="${isFinisher ? 7 : 5}"><title>${tooltip}</title></circle>`;
    })
    .join("");

  const totalPoints = visibleTimeline
    .map((entry) => {
      const x = xForFrame(entry.frame);
      const y = yForTotal();
      const tooltip = formatTooltipLines([
        `总充能 · ${entry.frame}F`,
        `累计总充能：${entry.totalCharge.toFixed(2)}%`,
        ...entry.contributions.map(
          (contribution) => `${contribution.characterName}：+${contribution.charge.toFixed(2)}%（${contribution.labels.join(" + ")}）`,
        ),
      ]);
      const isFullFrame = entry.frame === result.fullFrame;
      return `<circle class="${isFullFrame ? "chart-total-point is-full" : "chart-total-point"}" cx="${x}" cy="${y}" r="${isFullFrame ? 7 : 5}"><title>${tooltip}</title></circle>`;
    })
    .join("");

  const burstPoints = burstMarkers
    .map((marker) => {
      const x = xForFrame(marker.frame);
      const y = yForTotal();
      return `<circle class="chart-burst-point" cx="${x}" cy="${y}" r="6"><title>${marker.frame} F</title></circle><text class="chart-burst-label" x="${x}" y="${y - 12}" text-anchor="middle">${escapeHtml(marker.label)}</text>`;
    })
    .join("");

  const chargeTotalTrack =
    visibleTimeline.length > 1
      ? `<line class="chart-track chart-total-track chart-total-charge-track" x1="${xForFrame(visibleTimeline[0].frame)}" y1="${yForTotal()}" x2="${xForFrame(Math.min(result.fullFrame, CHART_MAX_FRAME))}" y2="${yForTotal()}" />`
      : "";
  const burstTotalTrack =
    burstMarkers.length > 0
      ? `<line class="chart-track chart-total-track chart-total-burst-track" x1="${xForFrame(burstMarkers[0].frame)}" y1="${yForTotal()}" x2="${xForFrame(maxBurstFrame)}" y2="${yForTotal()}" />`
      : "";

  const labels = result.members.map((member) => {
    const y = yForPosition(member.positionIndex);
    const prefix = finishingPositions.has(member.positionIndex) ? "*" : "";
    return `<text class="chart-name" x="0" y="${y + 4}" text-anchor="start">${escapeHtml(prefix + member.character.name)}</text>`;
  }).join("");
  const standardLabel = `<text class="chart-name chart-standard-name" x="0" y="${yForStandard() + 4}" text-anchor="start">标准轴</text>`;
  const totalLabel = `<text class="chart-name chart-total-name" x="0" y="${yForTotal() + 4}" text-anchor="start">总充能</text>`;

  return `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" data-label-gap="${labelGap}" data-label-gutter="${labelGutter}" role="img" aria-label="队伍充能关键帧图表">
      <rect class="chart-bg" x="0" y="0" width="${width}" height="${height}" rx="8" />
      ${gridLines}
      ${standardLines}
      ${positionLines}
      ${standardReferenceLines}
      ${standardTrack}
      ${standardPoints}
      ${tracks}
      ${chargeTotalTrack}
      ${burstTotalTrack}
      ${pointMarks}
      ${totalPoints}
      ${burstPoints}
      ${standardLabel}
      ${labels}
      ${totalLabel}
    </svg>
  `;
}

function renderChargeChart(result) {
  els.chargeChart.innerHTML = getChargeChartMarkup(result);
  fitChargeChartLabels(result);
  requestAnimationFrame(() => fitChargeChartLabels(result));
}

function fitChargeChartLabels(result) {
  const svg = els.chargeChart.querySelector("svg");
  if (!svg || !result || result.error) return;

  const labels = [...svg.querySelectorAll(".chart-name")];
  if (labels.length === 0) return;

  try {
    const labelGap = Number(svg.dataset.labelGap) || 10;
    const currentGutter = Number(svg.dataset.labelGutter) || 0;
    const measuredGutter = Math.ceil(Math.max(...labels.map((label) => label.getBBox().width), 0) + labelGap);

    if (Math.abs(measuredGutter - currentGutter) > 1) {
      els.chargeChart.innerHTML = getChargeChartMarkup(result, measuredGutter);
    }
  } catch {
    // getBBox can fail while the SVG is detached; the estimated layout remains usable.
  }
}

function renderResults() {
  const result = simulateBurst(state.team, "attack");

  if (!result) {
    els.summaryStrip.textContent = "队伍为空，选择角色后开始计算";
    els.resultPanel.innerHTML = '<p class="empty-result">当前队伍为空。按 P1 到 P5 的顺序加入角色，即可查看充满帧、爆裂开启帧和每名角色的充能明细。</p>';
    renderChargeChart(null);
    return null;
  }

  if (result.error) {
    els.summaryStrip.textContent = result.error;
    els.resultPanel.innerHTML = `<p class="empty-result">${escapeHtml(result.error)}</p>`;
    renderChargeChart(result);
    return result;
  }

  renderChargeChart(result);
  els.summaryStrip.textContent = `充满 ${result.fullFrame} 帧，爆裂1 ${result.burst1Frame} 帧`;
  els.resultPanel.innerHTML = `
    <div class="result-main">
      <div class="metric primary result-copy-target" title="右键复制结果">
        <span>充满时间</span>
        <strong>${formatFrame(result.fullFrame)}</strong>
        <em>${getStandardChargeBand(result.fullFrame)}</em>
      </div>
      <div class="metric">
        <span>爆裂1开启</span>
        <strong>${formatFrame(result.burst1Frame)}</strong>
      </div>
    </div>
    <div class="sub-metrics">
      <div>爆裂2：${formatFrame(result.burst2Frame)}</div>
      <div>爆裂3：${formatFrame(result.burst3Frame)}</div>
      <div>总充能速度：${result.chargePerSecond.toFixed(2)}%/s</div>
      <div>溢出后总量：${result.totalCharge.toFixed(2)}%</div>
    </div>
    <details open>
      <summary>每人充能明细</summary>
      <div class="detail-list">
        ${result.members
          .map(
            (event) => `
              <div class="detail-item">
                <span>
                  P${event.positionIndex + 1} ${escapeHtml(event.character.name)} · ${event.hits} 发 · 单发 ${event.chargeValue.toFixed(2)}%
                  ${event.character.weapon === "RL" ? ` · ${getRlHitSegments(event.character)} 段` : ""}
                  ${event.character.chargeSpeedPercent ? ` · 蓄速 +${event.character.chargeSpeedPercent}%` : ""}
                </span>
                <strong>${event.totalCharge.toFixed(2)}%</strong>
                <small>${event.hitFrames.join(" / ") || "-"}</small>
              </div>
            `,
          )
          .join("")}
      </div>
    </details>
  `;

  const resultCopyTarget = els.resultPanel.querySelector(".result-copy-target");
  resultCopyTarget.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    copyResultSummary(result);
  });

  return result;
}

function render() {
  renderCharacters();
  renderTeam();
  renderResults();
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
  saveTeam();
  render();
}

function addCharacter(character) {
  const team = getTeamState();
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
  team[index] = null;
  chargeSpeeds[index] = 0;
  saveTeam();
  render();
}

function moveTeamSlot(fromTeamKey, fromIndex, toTeamKey, toIndex) {
  const fromTeam = getTeamState(fromTeamKey);
  const toTeam = getTeamState(toTeamKey);
  const fromSpeeds = getChargeSpeedState(fromTeamKey);
  const toSpeeds = getChargeSpeedState(toTeamKey);

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

  if (toTeam[toIndex]) {
    [fromTeam[fromIndex], toTeam[toIndex]] = [toTeam[toIndex], fromTeam[fromIndex]];
    [fromSpeeds[fromIndex], toSpeeds[toIndex]] = [toSpeeds[toIndex], fromSpeeds[fromIndex]];
  } else {
    toTeam[toIndex] = fromCharacter;
    toSpeeds[toIndex] = fromSpeed;
    fromTeam[fromIndex] = null;
    fromSpeeds[fromIndex] = 0;
  }

  setActiveTeam(toTeamKey);
  saveTeam();
  render();
}

function clearTeam() {
  if (state.activeTeamKey === "defense") {
    state.defenseTeam = Array(TEAM_SIZE).fill(null);
    state.defenseChargeSpeeds = Array(TEAM_SIZE).fill(0);
  } else {
    state.team = Array(TEAM_SIZE).fill(null);
    state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
  }
  saveTeam();
  render();
}

function saveTeam() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      defenseTeam: state.defenseTeam.map((character) => character?.id || null),
      defenseChargeSpeeds: state.defenseChargeSpeeds,
      team: state.team.map((character) => character?.id || null),
      chargeSpeeds: state.chargeSpeeds,
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
      state.team = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(saved.team?.[index]));
      state.chargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => Number(saved.chargeSpeeds?.[index]) || 0);
      setActiveTeam(saved.activeTeamKey || "attack");
      return;
    }

    const legacyIds = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "[]");
    if (Array.isArray(legacyIds)) {
      state.team = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(legacyIds[index]));
    }
  } catch {
    state.defenseTeam = Array(TEAM_SIZE).fill(null);
    state.defenseChargeSpeeds = Array(TEAM_SIZE).fill(0);
    state.team = Array(TEAM_SIZE).fill(null);
    state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
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

async function copyCharacterDetails(character) {
  try {
    await copyTextToClipboard(getCharacterDetailText(character));
    showToast(`已复制 ${character.name} 的详细信息`);
  } catch {
    showToast("复制失败，请检查浏览器剪切板权限");
  }
}

async function copyResultSummary(result) {
  try {
    await copyTextToClipboard(getResultCopyText(result));
    showToast("已复制充能结果");
  } catch {
    showToast("复制失败，请检查浏览器剪切板权限");
  }
}

function bindEvents() {
  els.clearTeamButton.addEventListener("click", clearTeam);
  els.commonFilter.addEventListener("change", (event) => {
    state.filters.common = event.target.value;
    renderCharacters();
  });
  els.weaponFilter.addEventListener("change", (event) => {
    state.filters.weapon = event.target.value;
    renderCharacters();
  });
  els.companyFilter.addEventListener("change", (event) => {
    state.filters.company = event.target.value;
    renderCharacters();
  });
  els.stageFilter.addEventListener("change", (event) => {
    state.filters.stage = event.target.value;
    renderCharacters();
  });
  els.regionFilter.addEventListener("change", (event) => {
    state.filters.region = event.target.value;
    renderCharacters();
  });
  els.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    renderCharacters();
  });
}

initFilters();
bindEvents();
loadTeam();
render();
