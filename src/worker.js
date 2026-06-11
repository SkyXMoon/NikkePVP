import { CHARACTERS, DATA_SOURCES } from "../.worker-build/generated/data.mjs";
import { computeBattleResultsFromPayload } from "./simulator.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

const TEXT_CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
]);

function normalizeAssetResponseCharset(requestUrl, response) {
  const url = new URL(requestUrl);
  const contentType = response.headers.get("content-type") || "";
  const baseHeaders = new Headers(response.headers);
  if (url.pathname === "/sw.js") {
    baseHeaders.set("cache-control", "no-cache");
  }
  if (/^image\/svg\+xml/i.test(contentType.trim()) && !/; *charset=/i.test(contentType)) {
    const imageSvgHeaders = new Headers(baseHeaders);
    imageSvgHeaders.set("content-type", "image/svg+xml; charset=utf-8");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: imageSvgHeaders,
    });
  }
  const ext = url.pathname.toLowerCase().match(/\.([a-z0-9]+)(?:\?.*)?$/)?.[0] || "";
  const expected = TEXT_CONTENT_TYPES.get(ext);
  if (!expected) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: baseHeaders,
    });
  }
  if (/;\s*charset=/.test(contentType.toLowerCase())) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: baseHeaders,
    });
  }

  const headers = new Headers(baseHeaders);
  headers.set("content-type", expected);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

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
    const response = await env.ASSETS.fetch(request);
    return normalizeAssetResponseCharset(request.url, response);
  },
};
