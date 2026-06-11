const ASSET_CACHE_NAME = "nikke-asset-cache-v1-25-172";
const OLD_CACHE_PREFIXES = ["nikke-app-cache-", "nikke-asset-cache-", "nikke-avatar-cache-"];
const AVATAR_PATH_SNIPPET = "/assets/avatars/";
const ICON_PATH_SNIPPET = "/assets/icons/";
const MAX_CONCURRENT_CACHE_REQUESTS = 6;

function isSameOriginHttpUrl(url) {
  try {
    const requestUrl = new URL(url);
    return (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") && requestUrl.origin === self.location.origin;
  } catch {
    return false;
  }
}

function isLocalAssetRequestUrl(url) {
  if (!isSameOriginHttpUrl(url)) return false;
  const lowerPath = new URL(url).pathname.toLowerCase();
  const isKnownAssetPath = lowerPath.includes(AVATAR_PATH_SNIPPET) || lowerPath.includes(ICON_PATH_SNIPPET);
  const hasCacheableExt = /\.(png|webp|jpe?g|gif|avif|bmp|svg)$/i.test(lowerPath);
  return isKnownAssetPath && hasCacheableExt;
}

function createCacheRequest(rawUrl, cacheMode = "force-cache") {
  return new Request(rawUrl, {
    mode: "cors",
    credentials: "omit",
    cache: cacheMode,
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

async function getCacheFirstAndRefresh(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  const refreshRequest = createCacheRequest(request.url, "reload");
  const refreshPromise = fetch(refreshRequest).then(async (response) => {
    await cacheResponse(cache, request, response.clone());
    return response;
  });
  if (cachedResponse) return cachedResponse;
  return refreshPromise;
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
          const request = createCacheRequest(rawUrl, "reload");
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
      if (cacheName === ASSET_CACHE_NAME) return undefined;
      return caches.delete(cacheName);
    }),
  );
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
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
  if (isLocalAssetRequestUrl(event.request.url)) {
    event.respondWith(getCacheFirstAndRefresh(event.request, ASSET_CACHE_NAME));
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
