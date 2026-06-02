import { CHARACTERS, DATA_SOURCES } from "../.worker-build/generated/data.mjs";
import { computeBattleResultsFromPayload } from "./simulator.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {}),
    },
  });
}

function getPublicCharacter(character) {
  return {
    id: character.id,
    slug: character.slug,
    name: character.name,
    enName: character.enName,
    rarity: character.rarity,
    avatarUrl: character.avatarUrl,
    isCommon: character.isCommon,
    weapon: character.weapon,
    weaponCn: character.weaponCn,
    company: character.company,
    burstStage: character.burstStage,
    classType: character.classType,
    element: character.element,
    regions: character.regions,
  };
}

async function handleApi(request) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return json({ ok: true, service: "nikke-pvp-charge" });
  }

  if (url.pathname === "/api/characters") {
    const includePrivateData = url.searchParams.get("full") === "1";
    return json({
      sources: DATA_SOURCES,
      characters: includePrivateData ? CHARACTERS : CHARACTERS.map(getPublicCharacter),
    });
  }

  if (url.pathname === "/api/calculate") {
    if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, { status: 405 });
    const payload = await request.json();
    return json(computeBattleResultsFromPayload(payload, CHARACTERS));
  }

  return json({ error: "NOT_FOUND" }, { status: 404 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
