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
const MG_SUSTAIN_START_FRAME = 182;
const MG_SUSTAIN_INTERVAL_FRAMES = 2;

const state = {
  team: Array(TEAM_SIZE).fill(null),
  chargeSpeeds: Array(TEAM_SIZE).fill(0),
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
  if (fasterThan.length === standards.length) return `快过${standards[0].label}`;
  if (slowerThan.length === standards.length) return `慢于${standards.at(-1).label}`;
  return `快过${fasterThan[0].label}`;
}

function applyChargeSpeedFrames(baseFrames, chargeSpeedPercent = 0) {
  if (!baseFrames) return baseFrames;
  const speed = Number(chargeSpeedPercent) || 0;
  if (speed <= 0) return baseFrames;
  return Math.floor((baseFrames / 2) / (1 + speed / 100)) * 2;
}

function getChargeFrames(character, positionIndex) {
  const speed = Number(character.chargeSpeedPercent) || 0;

  if (character.timing?.firstFrame !== null && character.timing?.intervalFrames !== null) {
    const baseChargeFrames = character.timing.chargeFrames ?? 0;
    const chargeFrames = applyChargeSpeedFrames(baseChargeFrames, speed);
    const intervalBase = character.timing.turnFrames != null ? chargeFrames + character.timing.turnFrames : character.timing.intervalFrames;

    if (character.weapon === "RL" && character.timing.projectileFlightFramesByPosition) {
      const positionKey = `P${positionIndex + 1}`;
      const flightFrames = character.timing.projectileFlightFramesByPosition[positionKey] ?? 0;
      return {
        firstFrame: character.firstFrameOverride ?? chargeFrames + flightFrames,
        interval: character.attackIntervalFrames || intervalBase,
        chargeFrames,
      };
    }

    if (["SR", "RL"].includes(character.weapon)) {
      return {
        firstFrame: character.firstFrameOverride ?? chargeFrames,
        interval: character.attackIntervalFrames || intervalBase,
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
  if (character.weapon === "MG") return { firstFrame: MG_WARMUP_EVENTS[0].frame, interval: MG_SUSTAIN_INTERVAL_FRAMES, chargeFrames: 0 };
  if (character.weapon === "SR") {
    const turnFrames = character.turnFrames ?? 16;
    return {
      firstFrame: character.firstFrameOverride ?? chargeFrames,
      interval: character.attackIntervalFrames || chargeFrames + turnFrames,
      chargeFrames,
    };
  }
  if (character.weapon === "RL") {
    const flightFrames = character.projectileFlightFrames ?? (positionIndex <= 1 ? 16 : 14);
    const turnFrames = character.turnFrames ?? 16;
    return {
      firstFrame: character.firstFrameOverride ?? chargeFrames + flightFrames,
      interval: character.attackIntervalFrames || chargeFrames + turnFrames,
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

function characterForSlot(character, positionIndex) {
  if (!character) return null;
  return {
    ...character,
    chargeSpeedPercent: Number(state.chargeSpeeds[positionIndex]) || character.chargeSpeedPercent || 0,
  };
}

function simulateBurst(team) {
  const members = team
    .map((character, positionIndex) => ({ character: characterForSlot(character, positionIndex), positionIndex }))
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

  while (totalCharge < 100 - BURST_EPSILON && currentFrame <= 10000) {
    const nextAttackFrame = Math.min(...events.map((event) => event.nextFrame));
    const nextExtraFrame = pendingExtraEvents.length ? Math.min(...pendingExtraEvents.map((event) => event.frame)) : Infinity;
    currentFrame = Math.min(nextAttackFrame, nextExtraFrame);

    const activeExtras = pendingExtraEvents.filter((event) => event.frame === currentFrame);
    pendingExtraEvents = pendingExtraEvents.filter((event) => event.frame !== currentFrame);
    activeExtras.forEach((extra) => {
      totalCharge += extra.chargeValue;
      const owner = events.find((event) => event.character.id === extra.character.id);
      if (owner) owner.totalCharge += extra.chargeValue;
    });

    const activeEvents = events.filter((event) => event.nextFrame === currentFrame);
    activeEvents.forEach((event) => {
      const shotCount = getAttackShotCount(event);
      const chargeValue = event.chargeValue * shotCount;
      totalCharge += chargeValue;
      event.totalCharge += chargeValue;
      event.hits += shotCount;
      event.hitFrames.push(shotCount > 1 ? `${currentFrame}×${shotCount}` : currentFrame);
      const hitCountExtraCharge = getHitCountExtraCharge(event);
      totalCharge += hitCountExtraCharge;
      event.totalCharge += hitCountExtraCharge;
      pendingExtraEvents.push(...getDelayedExtraEvents(event, currentFrame));
      advanceAttackEvent(event);
    });
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
  const pickedIds = new Set(state.team.filter(Boolean).map((character) => character.id));
  const fragment = document.createDocumentFragment();
  const characters = getFilteredCharacters();
  els.listCount.textContent = `${characters.length} 名角色`;

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

function renderTeam() {
  const fragment = document.createDocumentFragment();

  state.team.forEach((character, index) => {
    const slot = document.createElement("div");
    slot.className = `team-slot${character ? " filled" : ""}`;
    slot.dataset.slotIndex = index;
    slot.draggable = Boolean(character);
    slot.innerHTML = character
      ? `
        <button class="slot-remove" type="button" aria-label="移除 ${escapeHtml(character.name)}">
          <span class="position">P${index + 1}</span>
          <span class="avatar small">${getAvatarMarkup(character)}</span>
          <span class="slot-copy">
            <strong>${escapeHtml(character.name)}</strong>
            <span>${escapeHtml(character.weapon)} · 单发 ${getChargeValue(character).toFixed(2)}%</span>
          </span>
        </button>
        <label class="speed-control">
          <span>蓄速</span>
          <input type="number" min="0" max="100" step="1" value="${Number(state.chargeSpeeds[index]) || 0}" data-speed-index="${index}" />
          <span>%</span>
        </label>
      `
      : `
        <div class="slot-empty">
          <span class="position">P${index + 1}</span>
          <span>
            <strong>等待加入</strong>
            <span>点击角色填入第一个空位</span>
          </span>
        </div>
      `;

    slot.addEventListener("dragstart", (event) => {
      if (!character) {
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
      const speedInput = slot.querySelector("[data-speed-index]");
      speedInput.addEventListener("pointerdown", (event) => event.stopPropagation());
      speedInput.addEventListener("dragstart", (event) => event.stopPropagation());
      speedInput.addEventListener("input", (event) => {
        state.chargeSpeeds[index] = Math.max(0, Number(event.target.value) || 0);
        saveTeam();
        renderResults();
      });
    }
    fragment.append(slot);
  });

  els.teamSlots.replaceChildren(fragment);
}

function renderResults() {
  const result = simulateBurst(state.team);

  if (!result) {
    els.summaryStrip.textContent = "队伍为空，选择角色后开始计算";
    els.resultPanel.innerHTML = '<p class="empty-result">当前队伍为空。按 P1 到 P5 的顺序加入角色，即可查看充满帧、爆裂开启帧和每名角色的充能明细。</p>';
    return;
  }

  if (result.error) {
    els.summaryStrip.textContent = result.error;
    els.resultPanel.innerHTML = `<p class="empty-result">${escapeHtml(result.error)}</p>`;
    return;
  }

  els.summaryStrip.textContent = `充满 ${result.fullFrame} 帧，爆裂1 ${result.burst1Frame} 帧`;
  els.resultPanel.innerHTML = `
    <div class="result-main">
      <div class="metric primary">
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
}

function render() {
  renderCharacters();
  renderTeam();
  renderResults();
}

function addCharacter(character) {
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

function toggleCharacter(character) {
  const pickedIndex = state.team.findIndex((member) => member && member.id === character.id);
  if (pickedIndex !== -1) {
    removeCharacter(pickedIndex);
    return;
  }

  addCharacter(character);
}

function removeCharacter(index) {
  state.team[index] = null;
  state.chargeSpeeds[index] = 0;
  saveTeam();
  render();
}

function moveTeamSlot(fromIndex, toIndex) {
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

function clearTeam() {
  state.team = Array(TEAM_SIZE).fill(null);
  state.chargeSpeeds = Array(TEAM_SIZE).fill(0);
  saveTeam();
  render();
}

function saveTeam() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      team: state.team.map((character) => character?.id || null),
      chargeSpeeds: state.chargeSpeeds,
    }),
  );
}

function loadTeam() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.team = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(saved.team?.[index]));
      state.chargeSpeeds = Array.from({ length: TEAM_SIZE }, (_, index) => Number(saved.chargeSpeeds?.[index]) || 0);
      return;
    }

    const legacyIds = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "[]");
    if (Array.isArray(legacyIds)) {
      state.team = Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(legacyIds[index]));
    }
  } catch {
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
