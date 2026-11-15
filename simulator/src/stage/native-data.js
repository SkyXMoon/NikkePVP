/** Native arena shooting contract: three provenance layers, merged explicitly.
 *
 * `native-shooting.json` holds the client contract: shot physics, homing/curve
 * scripts and ray layers. `native-bindings.json` holds muzzle socket paths and
 * animation state speeds taken from the SD asset export. `native-colliders.<region>.json`
 * holds the arena collision boxes, which belong to one client build's prefab.
 *
 * All three used to live in one file, which made a build that shipped international
 * shot data with CN-era model bindings and CN-era collision boxes look like a single
 * contract; a character with no binding then failed far from the cause. Keep them
 * separate and merge here, so "this actor has no exported muzzle" and "this region's
 * collision boxes are borrowed" are named, testable states instead of `undefined`.
 */

/** Merge the client shot contract with asset bindings and arena collision boxes.
 *
 * `colliderDoc` may be a region document that owns no values but names a
 * `borrowedFrom` region; `fallbackColliderDoc` is that region's document. A borrow
 * is allowed but always reported through `colliderProvenance`, never silent.
 */
export function mergeNativeData(shooting, bindings, colliderDoc, fallbackColliderDoc) {
  const characters = bindings?.characters ?? {};
  const missing = Object.keys(shooting.weapons ?? {})
    .map((id) => `c${String(id).padStart(3, '0')}`)
    .filter((id) => !characters[id]?.muzzles?.length);

  let colliders = colliderDoc?.colliders ?? null;
  let colliderProvenance = colliders
    ? { region: colliderDoc.region ?? null, borrowedFor: null, reason: null }
    : null;
  if (!colliders && colliderDoc?.borrowedFrom && fallbackColliderDoc?.colliders) {
    colliders = fallbackColliderDoc.colliders;
    colliderProvenance = { region: fallbackColliderDoc.region ?? null,
      borrowedFor: colliderDoc.region ?? null,
      reason: colliderDoc.borrowReason ?? 'collider-bundle-missing' };
  }
  if (!colliders) {
    throw new Error(`缺少竞技场碰撞体：${colliderDoc?.region ?? '未知区服'} 没有本区资源，也没有可借用的区服`);
  }

  return { ...shooting, colliders, colliderProvenance, bindings: characters,
    bindingProvenance: bindings?.region ?? null,
    // Named, not silent: callers that need a muzzle must ask through requireBinding.
    missingBindings: missing };
}

/** The muzzle binding for an actor, or a named failure saying which layer lacked it. */
export function requireBinding(native, id) {
  const binding = native.bindings?.[id];
  if (binding?.muzzles?.length) return binding;
  throw new Error(`缺少枪口绑定：${id} 不在资产绑定表内（该表由 SD 资产导出，与射击物理表来源不同）`);
}

/** One line for the data-limit banner: whose collision boxes are actually in use. */
export function describeColliderProvenance(native) {
  const p = native.colliderProvenance;
  if (!p) return '竞技场碰撞体：来源未知';
  if (!p.borrowedFor) return `竞技场碰撞体：${p.region} 本区`;
  return `竞技场碰撞体：借用 ${p.region}（${p.borrowedFor} 本区资源包不在本机，${p.reason}）`;
}

/** Arena-specific target priority, else the base one. 0 is a real value (None), not "unset". */
export function resolvePreferTarget(profile) {
  const arena = profile?.preferTargetArena;
  // A CN row carries no arena column at all (`arenaOverrideUnknown`). Falling back to
  // its own base column is the honest answer; borrowing another region's arena column
  // would import a rule this build may not have.
  return Number.isInteger(arena) && arena !== 0 ? arena : (profile?.preferTarget ?? 0);
}
