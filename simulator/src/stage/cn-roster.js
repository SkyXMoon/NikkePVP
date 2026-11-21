/** The same resource ID may represent multiple site variants. */
export function requireCnResource(roster, resourceId) {
  const id=String(Number(resourceId));
  const matches=roster.characters.filter(c=>c.resourceId===id);
  if (!matches.length) throw new Error(`角色 ${id} 不在国服目录`);
  if (!matches.some(c=>c.hasCnTable)) throw new Error(`角色 ${id} 缺少国服原始表数据`);
}

/** CN-first shooting profiles: a CN character's own shot table wins over the
 *  international one, so the simulated client is the one the player is on.
 *
 *  The CN table has no arena-specific columns (`PreferTargetArena`), so a CN row
 *  carries no arena override at all. Borrowing the international column here would
 *  put a global-only rule (SlotOrder / ReverseSlotOrder) onto a CN character, which
 *  is precisely the cross-region mixing this split exists to stop. Absence is
 *  recorded as `arenaOverrideUnknown` instead of a silent 0 or a silent borrow.
 *
 *  `foreignIds` are characters that only the other region has. Their data file was
 *  borrowed from that region, so their `nativeProfile` is that region's table and
 *  must not be relabelled as a CN shot table; they keep the merged profile.
 *  A missing entry (`undefined`) is skipped rather than thrown on: the caller
 *  decides how to degrade, and one absent character must not take the whole team
 *  down.
 */
export function addCnShootingProfiles(native, data, foreignIds = new Set()) {
  const weapons={...native.weapons};
  for (const [id, character] of Object.entries(data)) {
    if (!character) continue;
    if (foreignIds.has(String(id))) continue;
    const profile=character.shot?.nativeProfile;
    if (!profile || profile.shotId!==character.shotId) continue;
    const {preferTargetArena, ...cnProfile}=profile;
    weapons[id]={...cnProfile,arenaOverrideUnknown:true,source:'cn-shot-table'};
  }
  // CN native GetColliderByIndex rejects index 0 (0x41097E6), while
  // SetColliderList registers body/cover first in their own entity lists.
  return {...native,weapons,projectileTargetBinding:{
    minimumColliderIndex:1,colliderIndices:{character:0,cover:0},
  }};
}

export function selectableCnCharacters(roster, data, index, native) {
  const models = new Set(index.characters.map(c=>c.code));
  const seen = new Set();
  return roster.characters.filter(entry=>{
    if (seen.has(entry.resourceId)) return false;
    seen.add(entry.resourceId);
    const code = `c${entry.resourceId.padStart(3,'0')}`;
    const character=data[entry.resourceId], weapon=native.weapons[entry.resourceId];
    if (!entry.hasCnTable || !character || !models.has(code) ||
        !native.bindings?.[code]?.muzzles?.length || !weapon || weapon.shotId!==character.shotId)
      return false;
    const shot=character.shot;
    if (shot.penetration || ![1,2,3,4].includes(shot.fireType)) return false;
    if (shot.fireType===2 || shot.fireType===4) {
      const script=`${shot.fireType===2?'curve':'homing'}_${(weapon.homingScript??'').toLowerCase()}`;
      if (!native.scripts[script]) return false;
    }
    return true;
  }).map(entry=>({code:`c${entry.resourceId.padStart(3,'0')}`,name:entry.name}));
}

/**
 * 只校验「攻守各 5 名」这一件事。
 *
 * 角色是否真的能演练，交给舞台逐个判断：缺角色表、缺枪口绑定、缺模型都只降级那一个
 * 位置并在状态栏点名，不能因为其中一个 code 不认识就让整页打不开。`allowed` 参数保留
 * 给调试页的候选列表用，这里不再据此拦截。
 */
export function readLineup(params, fallback, _allowed) {
  const red=params.get('red'), blue=params.get('blue');
  if (!red && !blue) return fallback;
  const lineup={red:(red??'').split(','),blue:(blue??'').split(',')};
  if (lineup.red.length!==5 || lineup.blue.length!==5)
    throw new Error('攻守两侧各需要 5 名角色');
  return lineup;
}
