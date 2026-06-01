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
const STANDARD_TIMELINE_EVENTS = [
  { label: "罗姗娜", tooltip: "罗姗娜（96F）消除BUFF", frame: 96 },
];
const CHART_MAX_FRAME = 600;
const CHART_WIDTH = 1800;
const CHART_HEIGHT = 660;
const CHART_MIN_WIDTH = 820;
const SCARLET_COUNTER_PROBABILITY = 0.3;
const JACKAL_LINK_HIT_THRESHOLD = 10;
const MG_SUSTAIN_START_FRAME = 182;
const MG_SUSTAIN_INTERVAL_FRAMES = 2;

const state = {
  defenseTeam: Array(TEAM_SIZE).fill(null),
  defenseChargeSpeeds: Array(TEAM_SIZE).fill(0),
  team: Array(TEAM_SIZE).fill(null),
  chargeSpeeds: Array(TEAM_SIZE).fill(0),
  characterChargeSpeeds: {
    defense: {},
    attack: {},
  },
  jackalLinks: {
    defense: { enabled: false, ownerId: null, targetIds: [] },
    attack: { enabled: false, ownerId: null, targetIds: [] },
  },
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
let resizeRenderId = null;
let openSlotSettings = null;

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

function getTeamPositionText(finishingPositionIndices = [], teamKey = "attack") {
  const finishingPositions = new Set(finishingPositionIndices);
  const team = getTeamState(teamKey);
  const chargeSpeeds = getChargeSpeedState(teamKey);
  return team
    .map((character, index) => {
      if (!character) return "空位";
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

function getResultCopyText(result, teamKey = "attack") {
  return `${getTeamPositionText(result.finishingPositionIndices, teamKey)}\n${getStandardChargeBand(result.fullFrame)}（${result.fullFrame}F）`;
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

function getCharacterChargeSpeedMemory(teamKey = state.activeTeamKey) {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  if (!state.characterChargeSpeeds[normalizedTeamKey]) {
    state.characterChargeSpeeds[normalizedTeamKey] = {};
  }
  return state.characterChargeSpeeds[normalizedTeamKey];
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

function rememberTeamSlotChargeSpeed(teamKey, index) {
  const character = getTeamState(teamKey)[index];
  if (!character) return;
  saveCharacterChargeSpeed(character, getChargeSpeedState(teamKey)[index], teamKey);
}

function setActiveTeam(teamKey) {
  state.activeTeamKey = normalizeTeamKey(teamKey);
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

function getCounterHitCount(character, shotCount = 1) {
  if (character.weapon === "SG") return shotCount * 10;
  return shotCount;
}

function getTargetPositionIndex(character, teamKey = "attack") {
  const rule = character.targetRule?.[normalizeTeamKey(teamKey)] || "↗";
  return rule === "↖" || rule === "↘" ? ENEMY_TEAM_SIZE - 1 : DEFAULT_RL_TARGET_INDEX;
}

function getAttackHitProfile(character, shotCount = 1, teamKey = "attack") {
  const shotHits = getCounterHitCount(character, shotCount);
  const targetPositionIndex = getTargetPositionIndex(character, teamKey);

  if (character.weapon === "RL") {
    const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
    const start = Math.max(0, targetPositionIndex - range);
    const end = Math.min(ENEMY_TEAM_SIZE - 1, targetPositionIndex + range);
    return {
      totalHits: shotHits,
      positionHits: Array.from({ length: end - start + 1 }, (_, offset) => [start + offset, shotCount]),
    };
  }

  if (character.hasPenetration) {
    return {
      totalHits: shotHits,
      positionHits: [
        [targetPositionIndex, shotCount],
        [targetPositionIndex === ENEMY_TEAM_SIZE - 1 ? targetPositionIndex - 1 : targetPositionIndex + 1, shotCount],
      ],
    };
  }

  return {
    totalHits: shotHits,
    positionHits: [[targetPositionIndex, shotHits]],
  };
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

function simulateBurst(team, teamKey = "attack", specialChargeEvents = []) {
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
    const nextSpecialFrame = specialChargeEvents.length ? Math.min(...specialChargeEvents.map((event) => event.frame)) : Infinity;
    currentFrame = Math.min(nextAttackFrame, nextExtraFrame, nextSpecialFrame);
    currentFrameContributors = new Set();
    const contributions = new Map();
    const addContribution = (event, value, label, counterHits = 1, showOnMember = true) => {
      if (!event || !value) return;
      currentFrameContributors.add(event.positionIndex);
      const current = contributions.get(event.positionIndex) || {
        positionIndex: event.positionIndex,
        character: event.character,
        charge: 0,
        cumulativeCharge: 0,
        labels: [],
        counterHits: 0,
        positionHits: new Map(),
        showOnMember: false,
      };
      current.charge += value;
      current.cumulativeCharge = event.totalCharge;
      current.labels.push(label);
      current.counterHits += Math.max(Number(counterHits) || 0, 0);
      current.showOnMember = current.showOnMember || showOnMember;
      contributions.set(event.positionIndex, current);
    };
    const addPositionHits = (event, positionHits) => {
      const current = contributions.get(event.positionIndex);
      if (!current) return;
      positionHits.forEach(([positionIndex, hitCount]) => {
        current.positionHits.set(positionIndex, (current.positionHits.get(positionIndex) || 0) + hitCount);
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
        addContribution(owner, extra.chargeValue, "延迟额外");
      }
    });

    const activeEvents = events.filter((event) => event.nextFrame === currentFrame);
    activeEvents.forEach((event) => {
      const shotCount = getAttackShotCount(event);
      const hitProfile = getAttackHitProfile(event.character, shotCount, teamKey);
      const chargeValue = event.chargeValue * shotCount;
      totalCharge += chargeValue;
      event.totalCharge += chargeValue;
      event.hits += shotCount;
      event.hitFrames.push(shotCount > 1 ? `${currentFrame}×${shotCount}` : currentFrame);
      addContribution(event, chargeValue, shotCount > 1 ? `${shotCount}发命中` : "命中");
      const currentContribution = contributions.get(event.positionIndex);
      if (currentContribution) {
        currentContribution.counterHits += hitProfile.totalHits - 1;
      }
      addPositionHits(event, hitProfile.positionHits);
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
          counterHits: contribution.counterHits,
          positionHits: [...contribution.positionHits.entries()].map(([positionIndex, hitCount]) => ({ positionIndex, hitCount })),
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

  const chartExtraTimeline = events
    .filter((event) => ["RL", "SR"].includes(event.character.weapon) && event.nextFrame <= CHART_MAX_FRAME)
    .map((event) => ({
      frame: event.nextFrame,
      totalCharge,
      isExtraKeyFrame: true,
      contributions: [
        {
          positionIndex: event.positionIndex,
          characterName: event.character.name,
          charge: event.chargeValue,
          cumulativeCharge: event.totalCharge + event.chargeValue,
          labels: ["下一发预览"],
        },
      ],
    }));

  return {
    teamKey,
    fullFrame: currentFrame,
    burst1Frame: currentFrame + 26,
    burst2Frame: currentFrame + 58,
    burst3Frame: currentFrame + 90,
    totalCharge,
    chargePerSecond: currentFrame === 0 ? totalCharge * FRAMES_PER_SECOND : (totalCharge / currentFrame) * FRAMES_PER_SECOND,
    finishingPositionIndices: [...currentFrameContributors].sort((a, b) => a - b),
    timeline,
    chartExtraTimeline,
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
    const isFinisher = finishingPositions.has(index) && canShowFinishMarker(character);
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
      <label class="settings-field">
        <span>蓄速</span>
        <input class="slot-settings-input" type="number" min="0" max="100" step="1" value="${chargeSpeedValue}" />
        <span>%</span>
      </label>
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
  speedInput.addEventListener("pointerdown", (event) => event.stopPropagation());
  speedInput.addEventListener("focus", (event) => event.target.select());
  speedInput.addEventListener("click", (event) => event.target.select());
  speedInput.addEventListener("dragstart", (event) => event.stopPropagation());
  speedInput.addEventListener("input", (event) => {
    chargeSpeeds[index] = sanitizeChargeSpeed(event.target.value);
    saveCharacterChargeSpeed(character, chargeSpeeds[index], teamKey);
    saveTeam();
    updateTeamFinishMarkers(renderResults());
  });

  return backdrop;
}

function renderTeam() {
  const fragment = document.createDocumentFragment();
  const { attackResult, defenseResult } = computeBattleResults();
  const resultsByTeam = new Map([
    ["defense", defenseResult],
    ["attack", attackResult],
  ]);

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
      const isJackalOwner = character && isLinkProvider(character);
      const isActiveLinkOwner = character && isJackalConnecting && jackalLinkState.ownerId === character.id;
      const isJackalTarget = character && jackalTargetIds.has(character.id);
      const canSelectJackalTarget =
        character && character.id !== jackalLinkState.ownerId && isJackalConnecting && (isJackalTarget || jackalTargetIds.size < 2);
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
              ${isFinisher ? '<span class="finish-mark">定</span>' : ""}
              ${chargeSpeedValue > 0 ? `<span class="slot-speed-badge">${chargeSpeedValue}%</span>` : ""}
            </span>
          </button>
          <button class="slot-settings-toggle${isSettingsOpen ? " is-open" : ""}" type="button" aria-label="设置 ${escapeHtml(character.name)}" title="设置">
            <img src="assets/icons/nikke-top/settings.svg" alt="" aria-hidden="true" />
          </button>
          ${
            isJackalOwner
              ? `
                <button class="slot-link-toggle${isActiveLinkOwner ? " is-active" : ""}" type="button" aria-label="${isActiveLinkOwner ? "关闭" : "开启"}${isJackal(character) ? "豺狼链接" : "波莉链接"}" title="${isJackal(character) ? "豺狼链接" : "波莉链接"}">
                  <img src="assets/icons/nikke-top/link.svg" alt="" aria-hidden="true" />
                </button>
              `
              : ""
          }
          ${
            canSelectJackalTarget
              ? `
                <button class="slot-link-target${isJackalTarget ? " is-selected" : ""}" type="button" aria-label="${isJackalTarget ? "取消" : "选择"}${linkOwnerName}目标 ${escapeHtml(character.name)}" title="${isJackalTarget ? "取消链接" : "链接目标"}">
                  ${isJackalTarget ? '<img src="assets/icons/nikke-top/link.svg" alt="" aria-hidden="true" />' : '<span>+</span>'}
                </button>
              `
              : ""
          }
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
        if (!character || event.target.closest(".slot-settings-toggle, .slot-link-toggle, .slot-link-target")) {
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
        slot.querySelector(".slot-remove").addEventListener("contextmenu", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const { attackResult: currentAttackResult, defenseResult: currentDefenseResult } = computeBattleResults();
          const result = teamKey === "defense" ? currentDefenseResult : currentAttackResult;
          if (result && !result.error) {
            copyResultSummary(result, teamKey);
          } else {
            showToast(result?.error || "队伍为空，无法复制结果");
          }
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
    const battleResults = computeBattleResults();
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

function getScarletCounterTriggerCount(result, member, entry) {
  const linkedPositionIndices = getJackalLinkedPositionIndices(result);
  if (linkedPositionIndices.includes(member.positionIndex)) {
    return getJackalLinkedHitCount(entry, linkedPositionIndices);
  }
  return getCounterTriggerCount(entry);
}

function getScarletCounterGroups(chartResults, visibleTimelineByTeam) {
  return chartResults.flatMap((item) => {
    const opponentTeamKey = item.teamKey === "defense" ? "attack" : "defense";
    const opponentTimeline = visibleTimelineByTeam.get(opponentTeamKey) || [];
    if (opponentTimeline.length === 0) return [];

    return item.result.members
      .filter((member) => isScarlet(member.character))
      .map((member) => {
        const chargePerCounter = getChargeValue(member.character) * SCARLET_COUNTER_PROBABILITY;
        let cumulativeCharge = 0;
        const timeline = opponentTimeline.map((entry) => {
          const triggerCount = getScarletCounterTriggerCount(item.result, member, entry);
          const charge = chargePerCounter * triggerCount;
          cumulativeCharge += charge;
          return {
            frame: entry.frame,
            triggerCount,
            charge,
            cumulativeCharge,
          };
        });

        return {
          teamKey: item.teamKey,
          groupKey: `${item.teamKey}-scarlet-counter-${member.positionIndex}`,
          label: `${TEAM_LABELS[item.teamKey]}-红莲反击充能`,
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
        const chargePerLink = member.character.burstGen;
        let accumulatedHits = 0;
        let triggeredLinks = 0;
        let cumulativeCharge = 0;
        const timeline = opponentTimeline
          .map((entry) => {
            const hitCount = getJackalLinkedHitCount(entry, linkedPositionIndices);
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
          label: `${TEAM_LABELS[item.teamKey]}-豺狼链接充能`,
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
      `连接触发：${entry.triggerCount} × ${group.chargePerLink.toFixed(2)}% = ${entry.charge.toFixed(2)}%`,
      `累计充能：${entry.cumulativeCharge.toFixed(2)}%`,
    ];
  }

  return [
    group.label,
    `时间：${entry.frame} F`,
    `期望反击：${entry.triggerCount} × ${group.chargePerCounter.toFixed(3)}% = ${entry.charge.toFixed(3)}%`,
    `累计充能：${entry.cumulativeCharge.toFixed(3)}%`,
  ];
}

function getSpecialChargeEventsForTeam(targetResult, opponentResult) {
  if (!targetResult || targetResult.error || !opponentResult || opponentResult.error) return [];
  const opponentTimeline = opponentResult.timeline || [];
  if (opponentTimeline.length === 0) return [];
  const events = [];

  targetResult.members.forEach((member) => {
    if (isScarlet(member.character)) {
      const chargePerCounter = getChargeValue(member.character) * SCARLET_COUNTER_PROBABILITY;
      opponentTimeline.forEach((entry) => {
        const triggerCount = getScarletCounterTriggerCount(targetResult, member, entry);
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
      const chargePerLink = member.character.burstGen;
      let accumulatedHits = 0;
      let triggeredLinks = 0;
      opponentTimeline.forEach((entry) => {
        const hitCount = getJackalLinkedHitCount(entry, linkedPositionIndices);
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
  let attackResult = simulateBurst(state.team, "attack");
  let defenseResult = simulateBurst(state.defenseTeam, "defense");

  for (let index = 0; index < 8; index += 1) {
    const attackSpecials = getSpecialChargeEventsForTeam(attackResult, defenseResult);
    const defenseSpecials = getSpecialChargeEventsForTeam(defenseResult, attackResult);
    const nextAttackResult = simulateBurst(state.team, "attack", attackSpecials);
    const nextDefenseResult = simulateBurst(state.defenseTeam, "defense", defenseSpecials);
    const stable =
      getResultSignature(nextAttackResult) === getResultSignature(attackResult) &&
      getResultSignature(nextDefenseResult) === getResultSignature(defenseResult);
    attackResult = nextAttackResult;
    defenseResult = nextDefenseResult;
    if (stable) break;
  }

  return { attackResult, defenseResult };
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
        cumulativeByPosition.set(contribution.positionIndex, contribution.cumulativeCharge);
      });
    });

  return result.members
    .map((member) => {
      const cumulative = cumulativeByPosition.get(member.positionIndex) || 0;
      if (cumulative <= BURST_EPSILON) return null;
      return `${member.character.name}：${cumulative.toFixed(2)}%`;
    })
    .filter(Boolean);
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
  const width = chartSize.width;
  const margin = { top: 30, right: 42, bottom: 42, left: 0 };
  const visibleTimelineByTeam = new Map(
    chartResults.map((item) => [
      item.teamKey,
      [...item.result.timeline, ...(item.result.chartExtraTimeline || [])].filter((entry) => entry.frame <= CHART_MAX_FRAME),
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
  const points = memberPointGroups.flatMap((group) =>
    group.frames.map((frame) => ({ frame, groupKey: group.groupKey, teamKey: group.teamKey, positionIndex: group.member.positionIndex, result: group.result })),
  );
  const scarletCounterGroups = [
    ...getScarletCounterGroups(chartResults, visibleTimelineByTeam),
    ...getJackalLinkGroups(chartResults, visibleTimelineByTeam),
  ];
  const totalGroups = chartResults.map((item) => ({
    teamKey: item.teamKey,
    result: item.result,
    timeline: item.result.timeline.filter((entry) => entry.frame <= CHART_MAX_FRAME),
    groupKey: `${item.teamKey}-total`,
    label: `${TEAM_LABELS[item.teamKey]}-总充能`,
  }));
  const primaryTotalGroup = totalGroups.find((group) => group.teamKey === "attack") || totalGroups[0];
  const visibleStandards = totalGroups
    .filter((group) => group.result.fullFrame <= CHART_MAX_FRAME)
    .map((group) => ({ label: "", frame: group.result.fullFrame, isFullFrame: true, teamKey: group.teamKey }));
  const resultFrameCandidates = chartResults.flatMap((item) => [
    item.result.fullFrame,
    item.result.burst1Frame,
    item.result.burst2Frame,
    item.result.burst3Frame,
    ...(item.result.chartExtraTimeline || []).map((entry) => entry.frame),
  ]);
  const counterFrameCandidates = scarletCounterGroups.flatMap((group) => group.timeline.map((entry) => entry.frame));
  const maxFrame = Math.min(CHART_MAX_FRAME, Math.max(...resultFrameCandidates, ...counterFrameCandidates, chartResults.length ? 1 : CHART_MAX_FRAME));
  const rlStandards = Array.from({ length: Math.floor(maxFrame / 76) }, (_, index) => ({
    label: `${index + 1}RL`,
    tooltip: `${index + 1}RL · ${(index + 1) * 76} F`,
    frame: (index + 1) * 76,
  }));
  const standardEvents = hasRosanna ? STANDARD_TIMELINE_EVENTS.filter((event) => event.frame <= maxFrame) : [];
  const standardMarkers = [...rlStandards, ...standardEvents].sort((a, b) => a.frame - b.frame);
  const tickStep = maxFrame <= 180 ? 20 : maxFrame <= 320 ? 40 : 60;
  const tickFrames = Array.from({ length: Math.floor(maxFrame / tickStep) + 1 }, (_, index) => index * tickStep);
  if (!tickFrames.includes(maxFrame)) tickFrames.push(maxFrame);
  const finishingPositionsByTeam = new Map(chartResults.map((item) => [item.teamKey, new Set(item.result.finishingPositionIndices)]));
  const labelGap = 10;
  const chartLabels = [
    "标准轴",
    ...totalGroups.map((group) => group.label),
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
  const hasTeamSeparator = defenseGroups.length > 0 && attackGroups.length > 0;
  const hasDefenseTotal = totalGroups.some((group) => group.teamKey === "defense");
  const firstMemberLaneIndex = 1;
  const firstDefenseCounterLaneIndex = firstMemberLaneIndex + defenseGroups.length;
  const defenseTotalLaneIndex = hasDefenseTotal ? firstDefenseCounterLaneIndex + defenseCounterGroups.length : null;
  const separatorLaneIndex = hasTeamSeparator ? firstDefenseCounterLaneIndex + defenseCounterGroups.length + (hasDefenseTotal ? 1 : 0) : null;
  const firstAttackLaneIndex =
    firstDefenseCounterLaneIndex + defenseCounterGroups.length + (hasDefenseTotal ? 1 : 0) + (hasTeamSeparator ? 1 : 0);
  const firstAttackCounterLaneIndex = firstAttackLaneIndex + attackGroups.length;
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
  const laneByTotalKey = new Map(
    totalGroups.map((group) => [group.teamKey, group.teamKey === "defense" ? defenseTotalLaneIndex : attackTotalLaneIndex]).filter(([, lane]) => lane !== null),
  );
  const yForLane = (index) => margin.top + (chartHeight / Math.max(laneCount, 1)) * index;
  const yForGroup = (groupKey) => yForLane(laneByGroupKey.get(groupKey) ?? attackTotalLaneIndex);
  const yForCounterGroup = (groupKey) => yForLane(laneByCounterGroupKey.get(groupKey) ?? attackTotalLaneIndex);
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
      return `<circle class="chart-standard-point" cx="${x}" cy="${y}" r="4" data-tooltip="${tooltip}"><title>${tooltip}</title></circle><text class="chart-standard-label" x="${x}" y="${y - 10}" text-anchor="middle">${escapeHtml(standard.label)}</text>`;
    })
    .join("");

  const tracks = memberPointGroups
    .map((group) => {
      if (group.frames.length < 2) return "";
      const y = yForGroup(group.groupKey);
      const firstFrame = Math.min(...group.frames);
      const lastFrame = Math.max(...group.frames);
      return `<line class="chart-track team-${group.teamKey}" x1="${xForFrame(firstFrame)}" y1="${y}" x2="${xForFrame(lastFrame)}" y2="${y}" />`;
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
            `充能：${contribution.charge.toFixed(2)}%`,
            `累积充能：${contribution.cumulativeCharge.toFixed(2)}%`,
            `充能组成：${contribution.labels.join(" + ")}`,
          ])
        : "";
      const isFinisher =
        point.frame === point.result.fullFrame &&
        (finishingPositionsByTeam.get(point.teamKey) || new Set()).has(point.positionIndex) &&
        canShowFinishMarker(point.result.members.find((member) => member.positionIndex === point.positionIndex)?.character);
      return `<circle class="${isFinisher ? `chart-point team-${point.teamKey} is-finisher` : `chart-point team-${point.teamKey}`}" cx="${x}" cy="${y}" r="${isFinisher ? 6 : 4}" data-tooltip="${tooltip}"><title>${tooltip}</title></circle>`;
    })
    .join("");

  const totalPoints = totalGroups
    .flatMap((group) =>
      group.timeline.map((entry) => {
        const x = xForFrame(entry.frame);
        const y = yForTeamTotal(group.teamKey);
        const cumulativeLines = getCumulativeContributionLines(group.result, entry.frame);
        const tooltip = formatTooltipLines([
          `${group.label} · ${entry.frame}F`,
          `累计总充能：${entry.totalCharge.toFixed(2)}%`,
          ...(cumulativeLines.length ? ["各角色累计贡献：", ...cumulativeLines] : []),
        ]);
        return `<circle class="chart-total-point team-${group.teamKey}" cx="${x}" cy="${y}" r="5" data-tooltip="${tooltip}"><title>${tooltip}</title></circle>`;
      }),
    )
    .join("");
  const scarletCounterPoints = scarletCounterGroups
    .flatMap((group) =>
      group.timeline.map((entry) => {
        const x = xForFrame(entry.frame);
        const y = yForCounterGroup(group.groupKey);
        const tooltip = formatTooltipLines(getSpecialChargeTooltipLines(group, entry));
        return `<circle class="chart-scarlet-counter-point team-${group.teamKey}" cx="${x}" cy="${y}" r="4" data-tooltip="${tooltip}"><title>${tooltip}</title></circle>`;
      }),
    )
    .join("");

  const burstPoints = totalGroups
    .flatMap((group) =>
      [
        { label: "爆裂1", frame: group.result.burst1Frame },
        { label: "爆裂2", frame: group.result.burst2Frame },
        { label: "爆裂3", frame: group.result.burst3Frame },
      ]
        .filter((marker) => marker.frame <= CHART_MAX_FRAME)
        .map((marker) => {
          const x = xForFrame(marker.frame);
          const y = yForTeamTotal(group.teamKey);
          const tooltip = escapeHtml(`${TEAM_LABELS[group.teamKey]} ${marker.label} · ${marker.frame} F`);
          return `<circle class="chart-burst-point team-${group.teamKey}" cx="${x}" cy="${y}" r="5" data-tooltip="${tooltip}"><title>${tooltip}</title></circle><text class="chart-burst-label team-${group.teamKey}" x="${x}" y="${y - 10}" text-anchor="middle">${escapeHtml(marker.label)}</text>`;
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
      const markers = [
        { label: "爆裂1", frame: group.result.burst1Frame },
        { label: "爆裂2", frame: group.result.burst2Frame },
        { label: "爆裂3", frame: group.result.burst3Frame },
      ].filter((marker) => marker.frame <= CHART_MAX_FRAME);
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
      ${scarletCounterTracks}
      ${chargeTotalTrack}
      ${burstTotalTrack}
      ${pointMarks}
      ${scarletCounterPoints}
      ${totalPoints}
      ${burstPoints}
      ${standardLabel}
      ${labels}
      ${scarletCounterLabels}
      ${totalLabels}
    </svg>
  `;
}

function renderChargeChart(result, defenseResult = simulateBurst(state.defenseTeam, "defense")) {
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
  const tooltipWidth = 250;
  const placeLeft = pointX + tooltipWidth + 18 > chartBox.width;
  tooltip.style.left = `${placeLeft ? Math.max(pointX - tooltipWidth - 14, 8) : pointX + 14}px`;
  tooltip.style.top = `${Math.min(Math.max(pointY - 18, 8), chartBox.height - 96)}px`;
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
    const copyEntry = entries.find((entry) => entry.teamKey === "attack") || entries[0];
    copyResultSummary(copyEntry.result, copyEntry.teamKey);
  };
}

function renderResults() {
  const { attackResult: result, defenseResult } = computeBattleResults();
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
  const chargeSpeeds = getChargeSpeedState();
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
  team[index] = null;
  chargeSpeeds[index] = 0;
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
    rememberTeamSlotChargeSpeed(fromTeamKey, fromIndex);
    rememberTeamSlotChargeSpeed(toTeamKey, toIndex);
  } else {
    toTeam[toIndex] = fromCharacter;
    toSpeeds[toIndex] = fromSpeed;
    fromTeam[fromIndex] = null;
    fromSpeeds[fromIndex] = 0;
    rememberTeamSlotChargeSpeed(toTeamKey, toIndex);
  }

  setActiveTeam(toTeamKey);
  normalizeJackalLink(fromTeamKey);
  normalizeJackalLink(toTeamKey);
  openSlotSettings = null;
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
  normalizeJackalLink(state.activeTeamKey);
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

function rememberLoadedTeamChargeSpeeds(teamKey) {
  getTeamState(teamKey).forEach((character, index) => {
    if (character) {
      saveCharacterChargeSpeed(character, getChargeSpeedState(teamKey)[index], teamKey);
    }
  });
}

function saveTeam() {
  normalizeJackalLinks();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      defenseTeam: state.defenseTeam.map((character) => character?.id || null),
      defenseChargeSpeeds: state.defenseChargeSpeeds,
      team: state.team.map((character) => character?.id || null),
      chargeSpeeds: state.chargeSpeeds,
      characterChargeSpeeds: state.characterChargeSpeeds,
      jackalLinks: state.jackalLinks,
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
      state.characterChargeSpeeds = {
        defense: normalizeSavedCharacterChargeSpeeds(saved.characterChargeSpeeds?.defense),
        attack: normalizeSavedCharacterChargeSpeeds(saved.characterChargeSpeeds?.attack),
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
      rememberLoadedTeamChargeSpeeds("defense");
      rememberLoadedTeamChargeSpeeds("attack");
      normalizeJackalLinks();
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
    state.characterChargeSpeeds = { defense: {}, attack: {} };
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

async function copyCharacterDetails(character) {
  try {
    await copyTextToClipboard(getCharacterDetailText(character));
    showToast(`已复制 ${character.name} 的详细信息`);
  } catch {
    showToast("复制失败，请检查浏览器剪切板权限");
  }
}

async function copyResultSummary(result, teamKey = "attack") {
  try {
    await copyTextToClipboard(getResultCopyText(result, teamKey));
    showToast("已复制充能结果");
  } catch {
    showToast("复制失败，请检查浏览器剪切板权限");
  }
}

function bindEvents() {
  els.clearTeamButton.addEventListener("click", clearTeam);
  els.chargeChart.addEventListener("mousemove", showNearestChartTooltip);
  els.chargeChart.addEventListener("mouseleave", hideChartTooltip);
  window.addEventListener("resize", () => {
    if (resizeRenderId) cancelAnimationFrame(resizeRenderId);
    resizeRenderId = requestAnimationFrame(() => {
      resizeRenderId = null;
      render();
    });
  });
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
