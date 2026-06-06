const FRAMES_PER_SECOND = 60;
const TEAM_SIZE = 5;
const ENEMY_TEAM_SIZE = 5;
const DEFAULT_RL_TARGET_INDEX = 0;
const BURST_EPSILON = 1e-6;
const SCARLET_COUNTER_PROBABILITY = 0.3;
const JACKAL_LINK_HIT_THRESHOLD = 10;
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
const MG_WARMUP_EVENTS = [
  { frame: 96, shots: 12 },
  { frame: 152, shots: 22 },
  { frame: 180, shots: 14 },
];
const MG_SUSTAIN_START_FRAME = 182;
const MG_SUSTAIN_INTERVAL_FRAMES = 2;
const QUANTUM_RELIC_CUBE_MULTIPLIER = 1.0466;
const ROSANNA_BUFF_REMOVE_FRAME = 96;
const LITTLE_MERMAID_STUN_FRAME = 196;
const LITTLE_MERMAID_STUN_DURATION_FRAMES = 180;
const LITTLE_MERMAID_STUN_TARGET_INDEX = 0;
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

let runtimeState = null;
let runtimeCharacters = [];

function normalizeTeamKey(teamKey = "attack") {
  return teamKey === "defense" ? "defense" : "attack";
}

function getTeamState(teamKey = "attack") {
  return normalizeTeamKey(teamKey) === "defense" ? runtimeState.defenseTeam : runtimeState.team;
}

function getChargeSpeedState(teamKey = "attack") {
  return normalizeTeamKey(teamKey) === "defense" ? runtimeState.defenseChargeSpeeds : runtimeState.chargeSpeeds;
}

function getUniversalChargeState(teamKey = "attack") {
  return normalizeTeamKey(teamKey) === "defense" ? runtimeState.defenseUniversalCharges : runtimeState.universalCharges;
}

function sanitizeUniversalCharge(value) {
  const charge = Number(value);
  if (!Number.isFinite(charge) || charge <= 0) return 0;
  return Math.min(100, Math.round(charge * 1000) / 1000);
}

function getCharacterById(id) {
  if (id === null || id === undefined) return null;
  const normalizedId = String(id);
  return runtimeCharacters.find((character) => String(character.id) === normalizedId) || null;
}

function getSavedCharacterQuantumCube(character, teamKey = "attack") {
  return Boolean(runtimeState.characterQuantumCubes?.[normalizeTeamKey(teamKey)]?.[character.id]);
}

function getSavedCharacterMagazine(character, teamKey = "attack") {
  const magazine = Number(runtimeState.characterMagazines?.[normalizeTeamKey(teamKey)]?.[character.id]);
  const normalizedMagazine = Math.floor(magazine);
  if (!Number.isFinite(normalizedMagazine)) return null;
  if (normalizedMagazine === 20) return 20;
  if (normalizedMagazine >= 26 && normalizedMagazine <= 88) return normalizedMagazine;
  return null;
}

function sanitizeRedHoodPierceCount(value) {
  const count = Math.floor(Number(value) || 0);
  if (count <= 0) return 0;
  if (count >= 2) return 2;
  return 1;
}

function getSavedCharacterRedHoodPierceCount(character, teamKey = "attack") {
  return sanitizeRedHoodPierceCount(runtimeState.characterRedHoodPierceCounts?.[normalizeTeamKey(teamKey)]?.[character.id]);
}

function isScarlet(character) {
  return character?.name === "红莲" || character?.slug === "红莲";
}

function isRedHood(character) {
  return character?.id === 111 || character?.name === "小红帽" || character?.slug === "小红帽";
}

function isSnowWhiteHeavyArms(character) {
  return character?.id === 3 || character?.enName === "Snow White: Heavy Arms";
}

function canApplyChargeSpeed(character) {
  return Boolean(character) && ["RL", "SR"].includes(character.weapon) && !isSnowWhiteHeavyArms(character);
}

function isJackal(character) {
  return character?.name === "豺狼" || character?.slug === "豺狼";
}

function isPoli(character) {
  return character?.name === "波莉" || character?.slug === "波莉" || character?.name === "波莉 珍藏" || character?.slug === "波莉-珍藏";
}

function isLinkProvider(character) {
  return isJackal(character) || isPoli(character);
}

function isRosanna(character) {
  return character?.name === "罗珊娜" || character?.slug === "罗珊娜";
}

function isLittleMermaid(character) {
  return character?.name === "小美人鱼" || character?.slug === "小美人鱼";
}

function isCinderella(character) {
  return character?.name === "灰姑娘" || character?.slug === "灰姑娘";
}

function isVestiTacticalUpgrade(character) {
  return character?.id === 87 || character?.enName === "Vesti: Tactical Upgrade" || String(character?.slug || "").includes("战术升级");
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

function resultHasRosanna(result) {
  return Boolean(result && !result.error && result.members.some((member) => isRosanna(member.character)));
}

function teamHasLittleMermaid(team = []) {
  return team.some((character) => isLittleMermaid(character));
}

function getStunWindowsForTeam(teamKey = "attack") {
  const opponentTeam = normalizeTeamKey(teamKey) === "attack" ? runtimeState.defenseTeam : runtimeState.team;
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

function getRlProjectileFlightFrames(character, positionIndex, teamKey = "attack") {
  if (isCinderella(character)) return CINDERELLA_PROJECTILE_FLIGHT_FRAMES;
  if (isVestiTacticalUpgrade(character)) return VESTI_TACTICAL_PROJECTILE_FLIGHT_FRAMES;
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
  const speed = canApplyChargeSpeed(character) ? Number(character.chargeSpeedPercent) || 0 : 0;

  if (character.weapon === "MG") {
    return {
      firstFrame: MG_WARMUP_EVENTS[0].frame,
      interval: MG_SUSTAIN_INTERVAL_FRAMES,
      chargeFrames: 0,
    };
  }

  if (character.timing?.firstFrame !== null && character.timing?.intervalFrames !== null) {
    const baseChargeFrames = isCinderella(character) ? CINDERELLA_INITIAL_CHARGE_FRAMES : character.timing.chargeFrames ?? 0;
    const chargeFrames = applyChargeSpeedFrames(baseChargeFrames, speed);
    const baseIntervalFrames = character.timing.turnFrames != null ? baseChargeFrames + character.timing.turnFrames : character.timing.intervalFrames;
    const fixedIntervalFrames = Math.max(0, baseIntervalFrames - baseChargeFrames);
    const intervalFrames = applyChargeSpeedIntervalFrames(baseChargeFrames, fixedIntervalFrames, speed);

    if (character.weapon === "RL" && character.timing.projectileFlightFramesByPosition) {
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

  const sheetChargeFrames = typeof character.stats?.chargeSeconds === "number" ? Math.round(character.stats.chargeSeconds * FRAMES_PER_SECOND) : null;
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

function getChargeValue(character, shotNumber = null) {
  const coverMultiplier = isCinderella(character)
    ? getCinderellaChargeMultiplier(shotNumber)
    : character.weapon === "RL"
      ? getRlHitSegments(character)
      : character.hasPenetration
        ? 2
        : 1;
  const extraMultiplier = character.hasExtraDamage ? 2 : 1;
  return getEffectiveBurstGen(character) * coverMultiplier * extraMultiplier + (character.flatBurstBonus || 0);
}

function getAttackChargeValue(character, shotNumber = null, hitProfile = null, shotCount = 1) {
  if (!hitProfile || isCinderella(character)) return getChargeValue(character, shotNumber) * shotCount;
  if (hitProfile.p5CinderellaDecoy && character.flatBurstBonus) return (character.flatBurstBonus || 0) * shotCount;
  const actualHitMultiplier = (hitProfile.targetHits || hitProfile.positionHits || []).reduce(
    (sum, [, hitCount]) => sum + (Number(hitCount) || 0),
    0,
  );
  const extraMultiplier = character.hasExtraDamage ? 2 : 1;
  return getEffectiveBurstGen(character) * actualHitMultiplier * extraMultiplier + (character.flatBurstBonus || 0) * shotCount;
}

function isHarran(character) {
  return character?.id === 57 || character?.slug === "哈兰" || character?.name === "哈兰";
}

function getHarranPoisonChargeValue(character) {
  return getEffectiveBurstGen(character) * (character.hasExtraDamage ? 2 : 1);
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

function getDelayedExtraPositionHits(extra, hitProfile = null) {
  const segments = Math.max(0, Number(extra?.segments) || 0);
  if (segments <= 0) return [];
  if (extra?.targetMode === "all") {
    return Array.from({ length: ENEMY_TEAM_SIZE }, (_, positionIndex) => [positionIndex, 1]);
  }
  const targetPositionIndex = hitProfile?.positionHits?.[0]?.[0] ?? hitProfile?.targetHits?.[0]?.[0] ?? DEFAULT_RL_TARGET_INDEX;
  return [[targetPositionIndex, segments]];
}

function getDelayedExtraEvents(event, currentFrame, hitProfile = null) {
  if (isHarran(event.character)) return [];
  return (event.character.delayedExtraHits || []).map((extra) => ({
    character: event.character,
    positionIndex: event.positionIndex,
    frame: currentFrame + extra.delayFrames,
    chargeValue: getEffectiveBurstGen(event.character) * extra.segments * (event.character.hasExtraDamage ? 2 : 1),
    positionHits: getDelayedExtraPositionHits(extra, hitProfile),
    source: "delayed",
    label: extra.label,
  }));
}

function getVestiTacticalFollowUpEvents(event, currentFrame, hitProfile = null) {
  if (!isVestiTacticalUpgrade(event.character)) return [];
  const chargeValue = getAttackChargeValue(event.character, null, hitProfile, 1);
  const positionHits = getReceivedPositionHits(event.character, hitProfile, currentFrame, []);
  return VESTI_TACTICAL_HIT_OFFSETS.slice(1).map((offset) => ({
    character: event.character,
    positionIndex: event.positionIndex,
    frame: currentFrame + offset,
    chargeValue,
    positionHits,
    source: "vesti-tactical-follow-up",
    label: getAttackContributionLabel(event.character, 1, null),
    countAsHitFrame: true,
    flightFrames: event.projectileFlightFrames,
  }));
}

function getAttackContributionLabel(character, shotCount = 1, shotNumber = null) {
  if (character.weapon === "RL") return `爆炸命中${character.hasExtraDamage ? "+额外伤害" : ""}`;
  if (getPenetrationExtraHitCount(character, shotNumber) > 0) return `命中+穿透${character.hasExtraDamage ? "+额外伤害" : ""}`;
  return `命中${character.hasExtraDamage ? "+额外伤害" : ""}`;
}

function getHitCountExtraCharge(event) {
  return (event.character.hitCountExtraEvents || [])
    .filter((extra) => extra.hit === event.hits)
    .reduce((sum, extra) => {
      const extraMultiplier = event.character.hasExtraDamage ? 2 : 1;
      return sum + getEffectiveBurstGen(event.character) * extra.segments * extraMultiplier;
    }, 0);
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
    if (Number.isFinite(Number(shotNumber))) return Number(shotNumber) > 0 && Number(shotNumber) <= pierceCount ? 1 : 0;
    return pierceCount > 0 ? 1 : 0;
  }
  return character.hasPenetration ? 1 : 0;
}

function getTargetPositionIndex(character, teamKey = "attack") {
  const rule = character.targetRule?.[normalizeTeamKey(teamKey)] || "→";
  return rule === "↖" || rule === "↘" ? ENEMY_TEAM_SIZE - 1 : DEFAULT_RL_TARGET_INDEX;
}

function getAttackHitProfile(character, shotCount = 1, teamKey = "attack", shotNumber = null, opponentTeam = []) {
  const shotHits = getCounterHitCount(character, shotCount);
  const targetPositionIndex = getTargetPositionIndex(character, teamKey);
  const p5CinderellaDecoy = isTargetingP5Cinderella(character, targetPositionIndex, opponentTeam);

  if (isCinderella(character)) {
    return {
      totalHits: shotHits,
      positionHits: [[targetPositionIndex, shotCount]],
      targetHits: [[targetPositionIndex, CINDERELLA_TARGET_HIT_COUNT]],
      p5CinderellaDecoy: false,
    };
  }

  if (character.weapon === "RL") {
    const range = Number.isFinite(character.rlExplosionRange) ? character.rlExplosionRange : 1;
    const start = Math.max(0, targetPositionIndex - range);
    const end = Math.min(ENEMY_TEAM_SIZE - 1, targetPositionIndex + range);
    const positionHits = Array.from({ length: end - start + 1 }, (_, offset) => [start + offset, shotCount]);
    return {
      totalHits: shotHits,
      positionHits,
      targetHits: positionHits.map(([positionIndex, hitCount]) => [positionIndex, hitCount * 2]),
      p5CinderellaDecoy: false,
    };
  }

  const penetrationExtraHits = getPenetrationExtraHitCount(character, shotNumber);
  if (penetrationExtraHits > 0) {
    if (p5CinderellaDecoy) {
      return {
        totalHits: shotHits,
        positionHits: [[targetPositionIndex, shotCount]],
        targetHits: [[targetPositionIndex, shotCount]],
        p5CinderellaDecoy,
      };
    }
    return {
      totalHits: shotHits * (1 + penetrationExtraHits),
      positionHits: [
        [targetPositionIndex, shotCount],
        [targetPositionIndex === ENEMY_TEAM_SIZE - 1 ? targetPositionIndex - 1 : targetPositionIndex + 1, shotCount],
      ],
      targetHits: [[targetPositionIndex, shotCount * (1 + penetrationExtraHits)]],
      p5CinderellaDecoy,
    };
  }

  return {
    totalHits: shotHits,
    positionHits: [[targetPositionIndex, shotHits]],
    targetHits: [[targetPositionIndex, shotHits]],
    p5CinderellaDecoy,
  };
}

function isReloadingAtFrame(positionIndex, frame, reloadTimeline = []) {
  return reloadTimeline.some((reload) => reload.positionIndex === positionIndex && reload.startFrame < frame && reload.endFrame > frame);
}

function getReceivedPositionHits(character, hitProfile, frame, opponentReloadTimeline = []) {
  if (character.weapon === "RL" || character.hasPenetration) return hitProfile.positionHits;
  return hitProfile.positionHits.filter(([positionIndex]) => !isReloadingAtFrame(positionIndex, frame, opponentReloadTimeline));
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
  const nextFrame = isRedHood(event.character) ? defaultNextFrame : isCinderella(event.character) ? reloadEndFrame + event.reloadInterval : defaultNextFrame;
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
    return;
  }

  event.nextFrame = getNextAttackFrameAfterStun(event, currentFrame, baseNextFrame, stunWindows);
}

function getTurnDodgeStartFrame(event, currentFrame) {
  return Math.max(0, currentFrame - (Number(event.projectileFlightFrames) || 0));
}

function getTurnDodgeFrames(event) {
  if (!isChargeWeapon(event.character)) return 0;
  if (isVestiTacticalUpgrade(event.character)) return 0;
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

function getRlShotMissDodgeWindow(event, currentFrame, teamKey, opponentReloadTimeline = [], opponentTurnDodgeTimeline = []) {
  if (!runtimeState.allowMissedShots) return false;
  if (event.character.weapon !== "RL" || event.projectileFlightFrames <= 0) return false;
  const targetPositionIndex = getTargetPositionIndex(event.character, teamKey);
  const flightStartFrame = Math.max(0, currentFrame - event.projectileFlightFrames);
  return [
    ...opponentReloadTimeline.map((window) => ({ ...window, type: "reload" })),
    ...opponentTurnDodgeTimeline.map((window) => ({ ...window, type: "turn" })),
  ].find((window) => isMissedByDodgeWindow(targetPositionIndex, flightStartFrame, currentFrame, window));
}

function characterForSlot(character, positionIndex, teamKey = "attack") {
  if (!character) return null;
  const chargeSpeeds = getChargeSpeedState(teamKey);
  const savedMagazine = isScarlet(character) ? getSavedCharacterMagazine(character, teamKey) : null;
  const chargeSpeedPercent = canApplyChargeSpeed(character)
    ? Number(chargeSpeeds[positionIndex]) || character.chargeSpeedPercent || 0
    : 0;
  return {
    ...character,
    hasPenetration: isRedHood(character) ? false : character.hasPenetration,
    stats: savedMagazine ? { ...character.stats, magazine: savedMagazine } : character.stats,
    chargeSpeedPercent,
    quantumRelicCubeEnabled: getSavedCharacterQuantumCube(character, teamKey),
    redHoodPierceCount: isRedHood(character) ? getSavedCharacterRedHoodPierceCount(character, teamKey) : 0,
  };
}

function getCharacterBurstStages(character) {
  return String(character?.burstStage || "")
    .split("/")
    .map((stage) => stage.trim())
    .filter((stage) => ["B1", "B2", "B3"].includes(stage));
}

function getAvailableBurstLevel(members = []) {
  const stageSet = new Set(members.flatMap((member) => getCharacterBurstStages(member.character || member)));
  if (!stageSet.has("B1")) return 0;
  if (!stageSet.has("B2")) return 1;
  if (!stageSet.has("B3")) return 2;
  return 3;
}

function simulateBurst(
  team,
  teamKey = "attack",
  specialChargeEvents = [],
  opponentReloadTimeline = [],
  opponentTurnDodgeTimeline = [],
  stunWindows = [],
  opponentTeam = [],
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
      missedShotEvents: [],
      turnDodgeEvents: [],
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
        showOnMember: false,
      };
    });
    timeline.push({ frame: 0, totalCharge, contributions });
  }

  while (totalCharge < 100 - BURST_EPSILON && currentFrame <= 10000) {
    if (events.length === 0 && pendingExtraEvents.length === 0 && specialChargeEvents.length === 0) break;
    const nextAttackFrame = Math.min(...events.map((event) => event.nextFrame));
    const nextExtraFrame = pendingExtraEvents.length ? Math.min(...pendingExtraEvents.map((event) => event.frame)) : Infinity;
    const nextSpecialFrame = specialChargeEvents.length ? Math.min(...specialChargeEvents.map((event) => event.frame)) : Infinity;
    currentFrame = Math.min(nextAttackFrame, nextExtraFrame, nextSpecialFrame);
    currentFrameContributors = new Set();
    const contributions = new Map();
    const getContributionKey = (event, showOnMember, label = "") => `${event.positionIndex}:${showOnMember ? "member" : `special:${label}`}`;
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
        addContribution(owner, extra.chargeValue, extra.label || "延迟额外");
        addPositionHits(owner, extra.positionHits || []);
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
      const missDodgeWindow = getRlShotMissDodgeWindow(
        event,
        currentFrame,
        teamKey,
        opponentReloadTimeline,
        opponentTurnDodgeTimeline,
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
        advanceAttackEvent(event, currentFrame, shotCount, stunWindows);
        return;
      }

      const hitProfile = getAttackHitProfile(event.character, shotCount, teamKey, chargeShotNumber, opponentTeam);
      const receivedPositionHits = getReceivedPositionHits(event.character, hitProfile, currentFrame, opponentReloadTimeline);
      const chargeValue = getAttackChargeValue(event.character, chargeShotNumber, hitProfile, shotCount);
      totalCharge += chargeValue;
      event.totalCharge += chargeValue;
      event.attackChargeTotal += chargeValue;
      addContribution(event, chargeValue, getAttackContributionLabel(event.character, shotCount, chargeShotNumber));
      const currentContribution = contributions.get(getContributionKey(event, true));
      if (currentContribution) currentContribution.counterHits += hitProfile.totalHits - 1;
      addPositionHits(event, receivedPositionHits);
      const hitCountExtraCharge = getHitCountExtraCharge(event);
      totalCharge += hitCountExtraCharge;
      event.totalCharge += hitCountExtraCharge;
      event.attackChargeTotal += hitCountExtraCharge;
      addContribution(event, hitCountExtraCharge, "额外触发");
      const harranPoisonEvent = getHarranPoisonEvent(event, currentFrame);
      if (harranPoisonEvent) pendingExtraEvents.push(harranPoisonEvent);
      pendingExtraEvents.push(...getDelayedExtraEvents(event, currentFrame, hitProfile));
      pendingExtraEvents.push(...getVestiTacticalFollowUpEvents(event, currentFrame, hitProfile));
      advanceAttackEvent(event, currentFrame, shotCount, stunWindows);
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
    return { error: "超过 10000 帧仍未充满，请检查角色数据。", members: events };
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
    turnDodgeTimeline: events.flatMap((event) => event.turnDodgeEvents),
    flightTimeline: events.flatMap((event) => event.flightEvents),
    missedTimeline: events.flatMap((event) => event.missedShotEvents),
    stunTimeline: stunWindows,
    members: events,
  };
}

function normalizeJackalLink(teamKey = "attack") {
  const normalizedTeamKey = normalizeTeamKey(teamKey);
  const link = runtimeState.jackalLinks?.[normalizedTeamKey] || { enabled: false, ownerId: null, targetIds: [] };
  return {
    enabled: Boolean(link.enabled),
    ownerId: link.ownerId || null,
    targetIds: Array.isArray(link.targetIds) ? link.targetIds : [],
  };
}

function getTeamLinkProvider(teamKey = "attack") {
  const team = getTeamState(teamKey);
  const linkState = normalizeJackalLink(teamKey);
  if (linkState.enabled && linkState.ownerId) return team.find((character) => character?.id === linkState.ownerId) || null;
  return team.find((character) => isLinkProvider(character)) || null;
}

function getJackalLinkTargetIds(teamKey = "attack") {
  return normalizeJackalLink(teamKey).targetIds;
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
    return sum + contribution.positionHits.reduce((positionSum, positionHit) => positionSum + (linkedPositions.has(positionHit.positionIndex) ? positionHit.hitCount : 0), 0);
  }, 0);
}

function getPositionHitCount(entry, positionIndex) {
  return entry.contributions.reduce((sum, contribution) => {
    if (!Array.isArray(contribution.positionHits)) return sum;
    return sum + contribution.positionHits.reduce((positionSum, positionHit) => positionSum + (positionHit.positionIndex === positionIndex ? positionHit.hitCount : 0), 0);
  }, 0);
}

function isLinkSuppressedByRosanna(opponentResult, frame) {
  return frame >= ROSANNA_BUFF_REMOVE_FRAME && resultHasRosanna(opponentResult);
}

function getScarletCounterTriggerCount(result, member, entry, opponentResult = null) {
  const linkedPositionIndices = getJackalLinkedPositionIndices(result);
  if (linkedPositionIndices.includes(member.positionIndex)) {
    if (isLinkSuppressedByRosanna(opponentResult, entry.frame)) return getPositionHitCount(entry, member.positionIndex);
    return getJackalLinkedHitCount(entry, linkedPositionIndices);
  }
  return getPositionHitCount(entry, member.positionIndex);
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
        const triggerCount = getScarletCounterTriggerCount(targetResult, member, entry, opponentResult);
        if (triggerCount <= 0) return;
        events.push({ frame: entry.frame, positionIndex: member.positionIndex, chargeValue: chargePerCounter * triggerCount, label: "红莲反击" });
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
        events.push({ frame: entry.frame, positionIndex: member.positionIndex, chargeValue: chargePerLink * triggerCount, label: "豺狼链接" });
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

function normalizePayload(payload = {}, characters = []) {
  runtimeCharacters = characters;
  return {
    defenseTeam: Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(payload.defenseTeam?.[index])),
    defenseChargeSpeeds: Array.from({ length: TEAM_SIZE }, (_, index) => Number(payload.defenseChargeSpeeds?.[index]) || 0),
    defenseUniversalCharges: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(payload.defenseUniversalCharges?.[index])),
    team: Array.from({ length: TEAM_SIZE }, (_, index) => getCharacterById(payload.team?.[index])),
    chargeSpeeds: Array.from({ length: TEAM_SIZE }, (_, index) => Number(payload.chargeSpeeds?.[index]) || 0),
    universalCharges: Array.from({ length: TEAM_SIZE }, (_, index) => sanitizeUniversalCharge(payload.universalCharges?.[index])),
    characterQuantumCubes: {
      defense: payload.characterQuantumCubes?.defense || {},
      attack: payload.characterQuantumCubes?.attack || {},
    },
    characterMagazines: {
      defense: payload.characterMagazines?.defense || {},
      attack: payload.characterMagazines?.attack || {},
    },
    jackalLinks: {
      defense: payload.jackalLinks?.defense || { enabled: false, ownerId: null, targetIds: [] },
      attack: payload.jackalLinks?.attack || { enabled: false, ownerId: null, targetIds: [] },
    },
    allowMissedShots: payload.allowMissedShots !== false,
  };
}

export function computeBattleResultsFromPayload(payload = {}, characters = []) {
  runtimeState = normalizePayload(payload, characters);
  const attackStunWindows = getStunWindowsForTeam("attack");
  const defenseStunWindows = getStunWindowsForTeam("defense");
  let attackResult = simulateBurst(runtimeState.team, "attack", [], [], [], attackStunWindows, runtimeState.defenseTeam);
  let defenseResult = simulateBurst(runtimeState.defenseTeam, "defense", [], [], [], defenseStunWindows, runtimeState.team);

  for (let index = 0; index < 8; index += 1) {
    const attackSpecials = getSpecialChargeEventsForTeam(attackResult, defenseResult);
    const defenseSpecials = getSpecialChargeEventsForTeam(defenseResult, attackResult);
    const nextAttackResult = simulateBurst(
      runtimeState.team,
      "attack",
      attackSpecials,
      defenseResult?.reloadTimeline || [],
      defenseResult?.turnDodgeTimeline || [],
      attackStunWindows,
      runtimeState.defenseTeam,
    );
    const nextDefenseResult = simulateBurst(
      runtimeState.defenseTeam,
      "defense",
      defenseSpecials,
      attackResult?.reloadTimeline || [],
      attackResult?.turnDodgeTimeline || [],
      defenseStunWindows,
      runtimeState.team,
    );
    const stable = getResultSignature(nextAttackResult) === getResultSignature(attackResult) && getResultSignature(nextDefenseResult) === getResultSignature(defenseResult);
    attackResult = nextAttackResult;
    defenseResult = nextDefenseResult;
    if (stable) break;
  }

  return { attackResult, defenseResult };
}
