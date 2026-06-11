const APP_CACHE_NAME = "nikke-app-cache-v1-25-165";
const ASSET_CACHE_NAME = "nikke-asset-cache-v1-25-165";
const OLD_CACHE_PREFIXES = ["nikke-app-cache-", "nikke-asset-cache-", "nikke-avatar-cache-"];
const AVATAR_PATH_SNIPPET = "/assets/avatars/";
const ICON_PATH_SNIPPET = "/assets/icons/";
const QRCODE_PATH_SNIPPET = "/assets/qrcodes/";
const MAX_CONCURRENT_CACHE_REQUESTS = 6;
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./app.js",
  "./data.js",
  "./styles.css",
  "./assets/icons/site/favicon.png",
  "./assets/qrcodes/qqqrcode.png",
];

function isSameOriginHttpUrl(url) {
  try {
    const requestUrl = new URL(url);
    return (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") && requestUrl.origin === self.location.origin;
  } catch {
    return false;
  }
}

function isAppShellRequestUrl(url) {
  if (!isSameOriginHttpUrl(url)) return false;
  const { pathname } = new URL(url);
  return pathname === "/" || pathname === "/index.html" || pathname === "/app.js" || pathname === "/data.js" || pathname === "/styles.css";
}

function isLocalAssetRequestUrl(url) {
  if (!isSameOriginHttpUrl(url)) return false;
  const lowerPath = new URL(url).pathname.toLowerCase();
  const isKnownAssetPath = lowerPath.includes(AVATAR_PATH_SNIPPET) || lowerPath.includes(ICON_PATH_SNIPPET) || lowerPath.includes(QRCODE_PATH_SNIPPET);
  const hasCacheableExt = /\.(png|webp|jpe?g|gif|avif|bmp|svg)$/i.test(lowerPath);
  return isKnownAssetPath && hasCacheableExt;
}

function createCacheRequest(rawUrl) {
  return new Request(rawUrl, {
    mode: "cors",
    credentials: "omit",
    cache: "force-cache",
  });
}

async function cacheResponse(cache, request, response) {
  if (!response) return;
  if (response.ok || response.type === "opaque") {
    try {
      await cache.put(request, response);
    } catch {
      // cache.put can fail for immutable bodies in some runtimes.
    }
  }
}

async function getCacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;

  const response = await fetch(request);
  await cacheResponse(cache, request, response.clone());
  return response;
}

async function getNetworkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    await cacheResponse(cache, request, response.clone());
    return response;
  } catch {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
    throw new Error("network unavailable and no cached response");
  }
}

async function precacheAppShell() {
  const cache = await caches.open(APP_CACHE_NAME);
  await Promise.all(
    PRECACHE_URLS.map(async (url) => {
      try {
        const request = createCacheRequest(new URL(url, self.location.href).href);
        const response = await fetch(request);
        await cacheResponse(cache, request, response);
      } catch {
        // Precache is a speed-up only. Runtime fetch will still work.
      }
    }),
  );
}

async function cacheAssetUrls(rawUrls) {
  if (!Array.isArray(rawUrls) || rawUrls.length === 0) return;
  const unique = Array.from(new Set(rawUrls.filter(Boolean)));
  const queue = unique.filter(isLocalAssetRequestUrl);
  const cache = await caches.open(ASSET_CACHE_NAME);

  let index = 0;
  const runners = Array.from({ length: Math.min(MAX_CONCURRENT_CACHE_REQUESTS, Math.max(1, queue.length)) }, () =>
    (async function worker() {
      while (index < queue.length) {
        const current = index;
        index += 1;
        const rawUrl = queue[current];
        try {
          const request = createCacheRequest(rawUrl);
          const existing = await cache.match(request);
          if (existing) continue;
          const response = await fetch(request);
          await cacheResponse(cache, request, response);
        } catch {
          // Ignore individual asset failures.
        }
      }
    })(),
  );

  await Promise.all(runners);
}

async function deleteOldCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((cacheName) => {
      const isManagedCache = OLD_CACHE_PREFIXES.some((prefix) => cacheName.startsWith(prefix));
      if (!isManagedCache) return undefined;
      if (cacheName === APP_CACHE_NAME || cacheName === ASSET_CACHE_NAME) return undefined;
      return caches.delete(cacheName);
    }),
  );
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(precacheAppShell());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await deleteOldCaches();
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (isAppShellRequestUrl(event.request.url)) {
    event.respondWith(getNetworkFirst(event.request, APP_CACHE_NAME));
    return;
  }
  if (isLocalAssetRequestUrl(event.request.url)) {
    event.respondWith(getCacheFirst(event.request, ASSET_CACHE_NAME));
  }
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type !== "CACHE_AVATARS") return;
  const urls = Array.isArray(data.urls) ? urlsWithSameOrigin(data.urls) : [];
  event.waitUntil(cacheAssetUrls(urls));
});

function urlsWithSameOrigin(rawUrls) {
  return rawUrls
    .map((rawUrl) => {
      try {
        return new URL(rawUrl, self.location.href).href;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}
