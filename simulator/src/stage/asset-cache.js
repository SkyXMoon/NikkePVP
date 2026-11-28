/**
 * 大模型的本地持久缓存（Cache Storage）。
 *
 * 为什么不用浏览器 HTTP 缓存：
 *   - 本地 serve.py 对静态文件返回 `no-store`，演练页在本地测一次拉一次；
 *   - 静态托管（Pages/CDN）的 `max-age` 只有十分钟量级，且用户清缓存/无痕就没了；
 *   - 一场演练要拉 20–30MB GLB，重复下载是纯浪费。
 * 这里显式存一份到 CacheStorage，键是完整 URL，命中就不再走网络。
 *
 * 失效策略：调用方在 URL 上带版本参数（角色用 index.json 的 bytes、场地用 arena
 * JSON 的 source_bundle 哈希）。版本变 → URL 变 → 缓存键变，自然重下，
 * 所以不需要在代码里维护资产版本号。
 */

const CACHE_NAME = 'nikke-sd-assets-v1';

/** CacheStorage 只在安全上下文（https / localhost）可用；不满足时整层降级为直连。 */
export function cacheSupported() {
  return typeof globalThis.caches !== 'undefined' && typeof globalThis.caches.open === 'function';
}

let opened = null;
function store() {
  if (!cacheSupported()) return null;
  if (!opened) {
    opened = globalThis.caches.open(CACHE_NAME).catch(() => null);
  }
  return opened;
}

/** 命中返回 ArrayBuffer，未命中返回 null；任何缓存异常都当未命中处理。 */
export async function readCachedAsset(url) {
  const cache = await store();
  if (!cache) return null;
  try {
    const hit = await cache.match(url);
    if (!hit) return null;
    return await hit.arrayBuffer();
  } catch {
    return null;
  }
}

/** 下载完成后异步落盘。配额不足、隐私模式等失败一律忽略，不影响本次演练。 */
export async function saveCachedAsset(url, response) {
  const cache = await store();
  if (!cache || !response) return;
  try {
    await cache.put(url, response);
  } catch {
    /* 存不下就算了，下次照旧走网络 */
  }
}

/** 调试用：清掉模型缓存（`await __sdPurgeCache()`）。 */
export async function purgeAssetCache() {
  if (!cacheSupported()) return false;
  try {
    return await globalThis.caches.delete(CACHE_NAME);
  } catch {
    return false;
  }
}
