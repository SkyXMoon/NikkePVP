/** 净数值充能引擎：不碰 GLB、不碰 three、不碰 DOM，只吃 JSON。
 *
 *  与 `arena-calculator.js` 的分工：那个是**站点**用的，靠 GLB 骨骼采样枪口世界坐标
 *  （`muzzleWorldAtPose`），所以它必须带 three 的动画与矩阵；这里是**小程序分包**
 *  用的，同一个 `createArenaShooting` + 同一个 `runChargeCalculation`，只把「枪口
 *  从哪来」换成 `data/muzzle-bake.json` 里烘焙好的 root 局部偏移，配
 *  `geometry.muzzleWorld` 按目标世界 yaw 旋转得到发射点。
 *
 *  两条链共用射击几何、驱动器和充能投影，差异只有发射点来源——这不是第二套算法。
 *  发射点保真度的证据是 `tools/muzzle-bake-parity.mjs`（烘焙偏移 vs 直接采样 GLB
 *  骨骼，容差 5e-3）；数学保真度是 `tests/math3.test.js`（与 three 逐算子 1e-12）。
 *
 *  调用方负责传齐五份数据，本模块不读文件、不 fetch：
 *    arena       竞技场 JSON（covers）
 *    characters  已 `toRunnerConfig` 过的角色配置数组
 *    native      `mergeNativeData` 合并后的原生表（碰撞盒 / 武器 / 弹道脚本）
 *    muzzleBake  `data/muzzle-bake.json` 解析结果
 */
import { createArenaShooting } from '../stage/shooting.js';
import { runChargeCalculation } from './charge-calculator.js';
import { assignCovers, toGltf, validateArenaContract, muzzleWorld } from '../stage/geometry.js';
import { setMuzzleBakeTable, bakeMuzzles } from '../stage/muzzle-table.js';
import { Vector3 } from '../core/math3.js';

/** `FireType` 1/19/21 是 hitscan：命中在开火那一刻沿瞄准射线解出，不需要模型，
 *  发射点固定在 `aim_position`（与 arena-calculator 一致）。 */
const HITSCAN = new Set([1, 19, 21]);

export function createChargeEngine({ arena, characters, native, muzzleBake }) {
  validateArenaContract(arena);
  setMuzzleBakeTable(muzzleBake ?? null);
  const placements = assignCovers(arena.covers, characters);
  const byId = new Map(characters.map(cfg => [cfg.id, cfg]));
  const rayOrigins = new Map();
  for (const cfg of characters) {
    if (cfg.calculationTarget) continue;
    if (!HITSCAN.has(cfg.fireType)) continue;
    const placement = placements.get(cfg.id);
    if (!placement) throw new Error(`缺少场地站位：${cfg.id}`);
    rayOrigins.set(cfg.id, new Vector3(...toGltf(placement.aim_position)));
  }
  // 缺表角色在这里显式回退为空位而不是抛整队失败：调用方拿去记缺口即可。
  const missingMuzzle = [];
  for (const cfg of characters) {
    if (cfg.calculationTarget || HITSCAN.has(cfg.fireType)) continue;
    if (!bakeMuzzles(cfg.assetCode ?? cfg.id)) missingMuzzle.push(cfg.id);
  }

  function muzzleAt(id, tick, point, index) {
    if (rayOrigins.has(id)) return rayOrigins.get(id).clone();
    const cfg = byId.get(id);
    const placement = placements.get(id);
    if (!cfg || !placement) return null;
    const baked = bakeMuzzles(cfg.assetCode ?? cfg.id);
    if (!baked) return null;
    const offset = baked[index % baked.length];
    // 与 GLB 采样同源：站位 + 挂点偏移按目标世界 yaw 旋转（geometry.muzzleWorld，
    // 忽略基准俯仰/翻滚，这是烘焙表已知的近似）。
    return new Vector3(...muzzleWorld(toGltf(placement.character_position), point.toArray(), offset));
  }

  return {
    missingMuzzle,
    placements,
    calculate({ totalTicks = 900, seed = 1, burstCharges = null, stopWhenTeamsReady = [],
      passiveEvents = [] } = {}) {
      // 每次计算都要一个新的射击实例：它会累积 shots / stance 状态。
      const shooting = createArenaShooting({ arena, characters, native, muzzleAt });
      const calculation = runChargeCalculation({ characters, shooting, totalTicks, seed,
        burstCharges, stopWhenTeamsReady, passiveEvents });
      return { ...calculation, shots: shooting.shots, stanceEvents: shooting.stanceEvents,
        unsupported: shooting.unsupported, colliderMotion: shooting.colliderMotion };
    },
  };
}
