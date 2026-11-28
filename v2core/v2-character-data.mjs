/** V2 的数据加载层：角色库、技能文本、任意 JSON。Worker 与主线程共用一份。
 *
 *  为什么单独一个模块：计算在 `v2-worker.mjs` 里跑，但主线程的珍藏品阶段面板也要
 *  读同一个角色库。抄第二份必然漂移——少判一个 `characterFiles` 分支就会让某个角色
 *  静默变成 `undefined`，界面上只表现为那个角色不参与计算。而且主线程只是读一个
 *  下拉列表，不该为了它把整条计算链（charge-engine → shooting → driver）拉进来，
 *  所以这里只放数据加载，不 import 任何计算模块，也不碰 three / GLB / DOM。
 */

import { decodeCharacter } from '../simulator/src/core/db-codec.js';

const dataCache = new Map();

export async function loadJson(url) {
  if (!dataCache.has(url)) dataCache.set(url, fetch(url).then(response => {
    if (!response.ok) throw new Error(`V2资源加载失败 ${response.status} ${url}`);
    return response.json();
  }).catch(error => { dataCache.delete(url); throw error; }));
  return dataCache.get(url);
}

/** Character data for the requested ids, borrowing the other region when needed.
 *
 *  Two on-disk shapes have to behave the same: the published build writes an index
 *  (`characterFiles`) with one file per character, while the source tree keeps the
 *  same rows inline. The published per-character files are `db-codec` partitions —
 *  the same encoder the mini program bundle uses, so there is one format and one
 *  decoder, and only the packaging differs (one `{v,d}` payload per character here,
 *  one `{v,t,c}` document per region there; the string table lives in this index).
 *  `decodeCharacter` also returns a non-encoded row untouched, which is why the
 *  inline source shape needs no special case. A team may legitimately mix rosters
 *  (a player comparing the two clients) and the regions do not share a character
 *  list (CN 161, global 213), so a missing id falls back to the other region's file
 *  instead of leaving `undefined` behind — which used to take the whole calculation down.
 *  The returned map is exact, because everything region-bound downstream (shot
 *  profile, muzzle bake, arena model) has to follow the same source.
 */
export async function loadCharacterData(region, resourceIds) {
  const other = region === 'cn' ? 'global' : 'cn';
  const fileFor = r => `/simulator/data/characters${r === 'cn' ? '.cn' : ''}.json`;
  const ids = [...new Set(resourceIds)];
  const primary = await loadJson(fileFor(region));
  const has = (doc, id) => (doc?.characterFiles ? !!doc.characterFiles[id] : !!doc?.[id]);
  const read = async (doc, id) => {
    if (!doc?.characterFiles) return doc?.[id];
    if (!doc.characterFiles[id]) return undefined;
    return decodeCharacter(await loadJson(doc.characterFiles[id]), doc.t);
  };
  const missing = ids.filter(id => !has(primary, id));
  const fallback = missing.length ? await loadJson(fileFor(other)) : null;
  const crossRegion = new Map();
  const rows = await Promise.all(ids.map(async id => {
    if (has(primary, id)) return [id, await read(primary, id)];
    if (!has(fallback, id)) return [id, undefined];
    crossRegion.set(String(id), other);
    return [id, await read(fallback, id)];
  }));
  return { db: Object.fromEntries(rows), crossRegion };
}

/** Player-facing skill text, keyed by resource id.
 *
 *  The calculator reports charge against the native skill entity id (`1471110`),
 *  which says nothing to a player. `tools/export_skill_text.py` renders the real
 *  name and description, and also records which id prefix belongs to which slot,
 *  because that numbering is per-character (471 uses `14711` for skill 1, 011 uses
 *  `1011` for skill 2). A borrowed character keeps its own region's text.
 */
export async function loadSkillText(region, resourceIds) {
  const fileFor = r => `/simulator/data/skill-text${r === 'cn' ? '.cn' : ''}.json`;
  const primary = await loadJson(fileFor(region));
  if (resourceIds.every(id => primary[id])) return primary;
  return { ...(await loadJson(fileFor(region === 'cn' ? 'global' : 'cn'))), ...primary };
}
