const AVATAR_CACHE_NAME = "nikke-avatar-cache-v1";
const AVATAR_PATH_SNIPPET = "/assets/avatars/";
const ICON_PATH_SNIPPET = "/assets/icons/";
const MAX_CONCURRENT_CACHE_REQUESTS = 6;

function isAvatarRequestUrl(url) {
  try {
    const requestUrl = new URL(url);
    if (requestUrl.protocol !== "http:" && requestUrl.protocol !== "https:") return false;
    const lowerPath = requestUrl.pathname.toLowerCase();
    const lowerHost = requestUrl.hostname.toLowerCase();
    const isLocalAvatar = requestUrl.origin === self.location.origin && (lowerPath.includes(AVATAR_PATH_SNIPPET) || lowerPath.includes(ICON_PATH_SNIPPET));
    const isKnownRemoteAvatarHost = /gamekee\.com|img\.nga\.178\.com|cloudflare\.com/i.test(lowerHost);
    const hasImageExt = /\.(png|webp|jpe?g|gif|avif|bmp)$/i.test(lowerPath);
    return (isLocalAvatar || isKnownRemoteAvatarHost) && hasImageExt;
  } catch {
    return false;
  }
}

async function cacheResponse(cache, request, response) {
  if (!response) return;
  if (response.ok || response.type === "opaque") {
    try {
      await cache.put(request, response);
    } catch {
      // cache.put may fail for immutable bodies in some runtimes.
    }
  }
}

async function getCachedOrFetch(event) {
  const cache = await caches.open(AVATAR_CACHE_NAME);
  const request = event.request;

  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;

  const response = await fetch(request);
  await cacheResponse(cache, request, response.clone());
  return response;
}

async function cacheAvatarUrls(rawUrls) {
  if (!Array.isArray(rawUrls) || rawUrls.length === 0) return;
  const unique = Array.from(new Set(rawUrls.filter(Boolean)));
  const queue = unique.filter(isAvatarRequestUrl);
  const cache = await caches.open(AVATAR_CACHE_NAME);

  let index = 0;
  const runners = Array.from({ length: Math.min(MAX_CONCURRENT_CACHE_REQUESTS, Math.max(1, queue.length)) }, () =>
    (async function worker() {
      while (index < queue.length) {
        const current = index;
        index += 1;
        const rawUrl = queue[current];
        try {
          const request = new Request(rawUrl, {
            mode: "cors",
            credentials: "omit",
            cache: "force-cache",
          });
          const existing = await cache.match(request);
          if (existing) continue;
          const response = await fetch(request);
          await cacheResponse(cache, request, response);
        } catch {
          // ignore
        }
      }
    })()
  );

  await Promise.all(runners);
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!isAvatarRequestUrl(event.request.url)) return;

  event.respondWith(
    getCachedOrFetch(event).catch(async () => {
      const cache = await caches.open(AVATAR_CACHE_NAME);
      return cache.match(event.request);
    }),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type !== "CACHE_AVATARS") return;
  const urls = Array.isArray(data.urls) ? data.urls : [];
  event.waitUntil(cacheAvatarUrls(urls));
});
