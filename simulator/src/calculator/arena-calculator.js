/** Arena computation with skeleton sampling only: no renderer, canvas or particles. */
import * as THREE from 'three';
import { createArenaShooting } from '../stage/shooting.js';
import { applyPose, extractShotEvents, bindNativeMuzzles, muzzleWorldAtPose } from '../stage/animation.js';
import { applyCharacterPlacement, applyModelFacing, assignCovers, validateArenaContract, toGltf } from '../stage/geometry.js';
import { runChargeCalculation } from './charge-calculator.js';
import { requireBinding } from '../stage/native-data.js';

/**
 * models is a Map<character instance ID, decoded GLTF> owned by this calculator.
 * Reuse existing decoded game resources, without loading stage visuals or effects.
 * Projectile fire types require exported skeleton/Shot marker/muzzle paths.
 * Instant fire types use the native aim ray and do not require a model.
 */
export async function createArenaCalculator({ arena, characters, native, models }) {
  validateArenaContract(arena);
  const placements = assignCovers(arena.covers, characters);
  const samplers = new Map();
  const rayOrigins = new Map();
  for (const cfg of characters) {
    if (cfg.calculationTarget) continue;
    if ([1,19,21].includes(cfg.fireType)) {
      // Hitscan contacts are resolved from the native aim ray before muzzle FX.
      // They need no skeleton sample. Keep their recorded origin on that ray.
      const placement=placements.get(cfg.id);
      if(!placement)throw new Error(`缺少场地站位：${cfg.id}`);
      rayOrigins.set(cfg.id,new THREE.Vector3(...toGltf(placement.aim_position)));
      continue;
    }
    const code = cfg.assetCode ?? cfg.id;
    const glb = models.get(cfg.id);
    if (!glb || !placements.has(cfg.id)) throw new Error(`缺少角色模型或场地站位：${cfg.id}`);
    const root = new THREE.Group(), model = new THREE.Group();
    root.add(model); model.add(glb.scene); model.updateMatrix();
    const mixer = new THREE.AnimationMixer(glb.scene);
    const clip = glb.animations.find(c => c.name === `${code}_cover_shot`);
    const shotTime = extractShotEvents(glb, code).cover_shot;
    if (!clip || !Number.isFinite(shotTime)) throw new Error(`缺少原始 Shot 动画事件：${cfg.id}`);
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true;
    const sampler = { root, model, base: model.matrix.clone(), mixer,
      actions: { cover_shot: action }, shotTime,
      nativeMuzzles: await bindNativeMuzzles(glb, requireBinding(native, code)) };
    applyCharacterPlacement(root, placements.get(cfg.id));
    samplers.set(cfg.id, sampler);
  }
  return {
    calculate({ totalTicks = 900, seed = 1, burstCharges = null, stopWhenTeamsReady = [], passiveEvents = [] } = {}) {
      const shooting = createArenaShooting({ arena, characters, native,
        muzzleAt(id, tick, point, index) {
          if(rayOrigins.has(id))return rayOrigins.get(id).clone();
          const sampler = samplers.get(id);
          applyPose(sampler, { clip: 'cover_shot', t: sampler.shotTime });
          applyModelFacing(sampler.model, sampler.base, { point: point.toArray() });
          return muzzleWorldAtPose(sampler, index);
        } });
      const calculation = runChargeCalculation({ characters, shooting, totalTicks, seed, burstCharges, stopWhenTeamsReady, passiveEvents });
      return { ...calculation, shots: shooting.shots, stanceEvents: shooting.stanceEvents };
    },
  };
}
