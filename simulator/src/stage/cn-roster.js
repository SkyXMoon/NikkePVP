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
 */
export function addCnShootingProfiles(native, data) {
  const weapons={...native.weapons};
  for (const [id, character] of Object.entries(data)) {
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

export function readLineup(params, fallback, allowed) {
  const red=params.get('red'), blue=params.get('blue');
  if (!red && !blue) return fallback;
  const lineup={red:(red??'').split(','),blue:(blue??'').split(',')};
  const codes=[...lineup.red,...lineup.blue];
  if (lineup.red.length!==5 || lineup.blue.length!==5 ||
      new Set(codes).size!==10 || codes.some(code=>!allowed.has(code)))
    throw new Error('阵容必须包含十名不同的可用国服角色');
  return lineup;
}
