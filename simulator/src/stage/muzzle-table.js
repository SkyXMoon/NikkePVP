/**
 * 枪口/剪辑数值表（data/muzzle-bake.json）。
 *
 * 模拟层只依赖这张表，不再从 GLB 骨骼采样：`muzzles` 是 glTF 空间下
 * `cover_shot@Shot` 姿势的 root 局部偏移，配 geometry.js 的 muzzleWorld 即可
 * 得到世界弹道起点；`durs`/`shotT` 替代运行时读 AnimationClip。
 *
 * 表按「角色码_皮肤号」建键（c010_00），查询按角色码（c010）匹配，同角色
 * 多皮肤共用一套骨架时取先出现的那条（按文件名排序即 _00 优先）。
 * 缺口角色（导出时无 socket_rifle 或无 cover_shot）查不到，调用方回退 GLB 采样
 * 或场地 aim_position，回退是显式的、可统计的。
 */
let doc = null;
const byCode = new Map();

export function setMuzzleBakeTable(next) {
  doc = next ?? null;
  byCode.clear();
  if (!doc?.characters) return;
  for (const [key, entry] of Object.entries(doc.characters)) {
    const code = key.replace(/_\d+$/, '');
    if (!byCode.has(code)) byCode.set(code, entry);
  }
}

export const muzzleBakeReady = () => !!doc;
export const muzzleBakeGaps = () => doc?.gaps ?? [];
export const muzzleBakeCount = () => byCode.size;

export function bakeEntry(code) {
  return byCode.get(code) ?? null;
}

/** 剪辑时长表；缺表返回 null，调用方继续用 GLB 的 clip.duration。 */
export function bakeDurations(code) {
  return bakeEntry(code)?.durs ?? null;
}

/** 剪辑内逻辑结算点（秒）；缺表或缺该剪辑返回 null。 */
export function bakeShotTime(code, clip = 'cover_shot') {
  const t = bakeEntry(code)?.shotT?.[clip];
  return Number.isFinite(t) ? t : null;
}

/** root 局部枪口偏移数组（glTF，x 已取反）；缺表返回 null。 */
export function bakeMuzzles(code) {
  const m = bakeEntry(code)?.muzzles;
  return Array.isArray(m) && m.length ? m : null;
}
