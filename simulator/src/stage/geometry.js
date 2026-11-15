export const toGltf = (p) => [-p[0], p[1], p[2]];

export function assignCovers(coverList, cfgs) {
  const out = new Map();
  for (const team of ['Red', 'Blue']) {
    const covers = coverList.filter((c) => c.team === team).sort((a, b) => a.slot - b.slot);
    const members = cfgs.filter((c) => c.team === (team === 'Red' ? 0 : 1));
    members.forEach((c, i) => {
      const cover = c.slotIndex == null ? covers[i] : covers.find(p => p.slot === c.slotIndex + 1);
      if (cover) out.set(c.id, cover);
    });
  }
  return out;
}

export const toGltfRotation = ([x, y, z, w]) => [x, -y, -z, w];

export function toGltfMatrix(matrix) {
  // JSON 是按行嵌套的矩阵、使用列向量；S M S 同时变换世界和本地基，不是只反射一侧。
  const s = [-1, 1, 1, 1];
  return matrix.map((row, i) => row.map((v, j) => s[i] * v * s[j]));
}

const vector = (v, n) => Array.isArray(v) && v.length === n && v.every(Number.isFinite);
const incompatible = (detail) => new Error(`资产兼容性错误：${detail}；请重新导出场地，不推断角色朝向`);

export function characterPlacement(placement) {
  const t = placement.character_transform;
  const label = placement.name ?? '角色挂点';
  if (!t) throw incompatible(`${label} 缺少 character_transform`);
  if (!vector(t.world_rotation, 4) || Math.abs(Math.hypot(...t.world_rotation) - 1) > 1e-4) {
    throw incompatible(`${label} 缺少或无效的 character_transform.world_rotation（xyzw）`);
  }
  const m = t.world_matrix;
  if (!Array.isArray(m) || m.length !== 4 || !m.every((row) => vector(row, 4))
      || m[3].some((v, i) => Math.abs(v - (i === 3 ? 1 : 0)) > 1e-6)) {
    throw incompatible(`${label} 缺少或无效的 character_transform.world_matrix（4×4 行数组）`);
  }
  return { matrix: toGltfMatrix(m), rotation: toGltfRotation(t.world_rotation) };
}

export function validateArenaContract(arena) {
  const c = arena.coordinate_contract;
  if (!c || typeof c.json_space !== 'string' || !c.json_space.includes('Unity')
      || !c.json_space.includes('未做镜像') || typeof c.glb_space !== 'string'
      || !c.glb_space.includes('glTF') || !c.glb_space.includes('x 取反')
      || typeof c.conversion_layer !== 'string' || !c.conversion_layer.includes('网页消费')) {
    throw incompatible('缺少或不支持 coordinate_contract（需 JSON 原始 Unity、GLB 已转换的消费层契约）');
  }
  if (!Array.isArray(arena.covers)) throw incompatible('缺少 covers');
  for (const cover of arena.covers) characterPlacement(cover);
}

export function applyCharacterPlacement(root, placement, yOffset = 0, ground = null) {
  const { matrix, rotation } = characterPlacement(placement);
  root.matrixAutoUpdate = false;
  // Matrix4.set 接收行序；不能把 JSON 的行数组交给按列序读取的 fromArray。
  root.matrix.set(...matrix.flat());
  root.matrix.decompose(root.position, root.quaternion, root.scale);
  const expected = root.quaternion.clone().fromArray(rotation).normalize();
  const angle = root.quaternion.clone().normalize().angleTo(expected);
  if (!Number.isFinite(angle) || angle > 1e-4) {
    throw incompatible(`${placement.name ?? '角色挂点'} 的 world_rotation 与 world_matrix 不一致`);
  }
  if (ground) root.position.y = ground(root.position.x, root.position.z, root.position.y);
  root.position.y += yOffset;
  root.matrix.setPosition(root.position);
  root.matrixWorldNeedsUpdate = true;
}

export function applyModelFacing(model, baseMatrix, facing) {
  // 独立网页模型层不参与 Mixer 绑定；每帧从基准重建，逆向拖帧不继承历史 yaw。
  model.matrixAutoUpdate = false;
  model.matrix.copy(baseMatrix);
  model.matrixWorldNeedsUpdate = true;
  model.updateWorldMatrix(true, false);
  if (facing) {
    const world = model.matrixWorld.clone();
    const position = model.position.clone();
    const rotation = model.quaternion.clone();
    const scale = model.scale.clone();
    world.decompose(position, rotation, scale);
    const dx = facing.point[0] - position.x;
    const dz = facing.point[2] - position.z;
    if (dx !== 0 || dz !== 0) {
      // Unity 欧拉角按 Z→X→Y 组合；仅替换世界 y，保留基准世界 x/z。
      const euler = model.rotation.clone().setFromQuaternion(rotation, 'YXZ');
      euler.y = Math.atan2(dx, dz);
      world.compose(position, rotation.setFromEuler(euler), scale);
      // 用完整父矩阵逆变换；局部矩阵可含剪切，不以分解后的 TRS 重组覆盖它。
      model.matrix.copy(model.parent ? model.parent.matrixWorld.clone().invert().multiply(world) : world);
    }
  }
  model.matrix.decompose(model.position, model.quaternion, model.scale);
  model.matrixWorldNeedsUpdate = true;
  model.updateWorldMatrix(false, true);
}

/**
 * 发射点 = 站位 + 挂点偏移按目标世界 yaw 旋转。
 * offset 是 stage 层从角色 GLB 骨骼采样的 root 局部偏移（cover_shot@Shot 姿势的 socket_rifle）；
 * applyModelFacing 用世界 yaw=atan2(dx,dz) 覆盖模型朝向，这里按同一 yaw 旋转偏移（忽略基准俯仰/翻滚）。
 * aim_position 是相机演出挂点（camera_position 子节点，脚底高度、站位前约5.6单位），不是枪口；
 * 场地 JSON 的 forward_axis 契约也明确枪口轴由角色自身挂点决定。
 */
export function muzzleWorld(position, target, offset) {
  const yaw = Math.atan2(target[0] - position[0], target[2] - position[2]);
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return [
    position[0] + offset[0] * c + offset[2] * s,
    position[1] + offset[1],
    position[2] - offset[0] * s + offset[2] * c,
  ];
}

export function targetPointWorld(placement, offset) {
  const m = characterPlacement(placement).matrix;
  return [0, 1, 2].map(i => m[i][0]*offset[0] + m[i][1]*offset[1] + m[i][2]*offset[2] + m[i][3]);
}

export function buildArenaGeometry(covers, cfgs, resolve, muzzles = null, targetOffsets = null, heightOffset = () => 0) {
  const placements = assignCovers(covers, cfgs);
  const heights = new Map(cfgs.map(cfg => [cfg.id, heightOffset(placements.get(cfg.id))]));
  const adjusted = (point, id) => [point[0], point[1] + heights.get(id), point[2]];
  const positions = new Map(cfgs.map((cfg) => [cfg.id, adjusted(toGltf(placements.get(cfg.id).character_position), cfg.id)]));
  const geoByCode = new Map();
  for (const cfg of cfgs) {
    const pos = positions.get(cfg.id);
    const enemies = new Map(cfgs.filter((c) => c.team !== cfg.team).map((c) => [c.id, positions.get(c.id)]));
    // 目标按站位就近（旧实现按 aim 挂点就近；aim 是中庭相机演出挂点，见 stage.js 机位注释）。
    let best = null;
    for (const [id, p] of enemies) {
      const distance = Math.hypot(...p.map((v, i) => v - pos[i]));
      if (!best || distance < best.distance) best = { id, pos: p, distance };
    }
    if (!best) continue;
    const targetOffset = targetOffsets?.get(best.id);
    const targetPoint = targetOffset ? adjusted(targetPointWorld(placements.get(best.id), targetOffset), best.id) : best.pos;
    const enemyPoints = new Map([...enemies].map(([id, p]) => {
      const target = targetOffsets?.get(id);
      return [id, target ? adjusted(targetPointWorld(placements.get(id), target), id) : p];
    }));
    const offset = muzzles?.get(cfg.id);
    const from = offset ? muzzleWorld(pos, targetPoint, offset) : adjusted(toGltf(placements.get(cfg.id).aim_position), cfg.id);
    const result = resolve({
      from, to: targetPoint, fireType: cfg.fireType, projectileSpeed: cfg.projectileSpeed,
      explosionRange: cfg.explosionRange, enemies: enemyPoints,
    });
    geoByCode.set(cfg.id, {
      from, to: result.point, frames: result.frames, flightFrames: result.flightFrames, blocked: result.blocked,
      extras: result.extras, instances: result.instances, path: result.path ?? null, timeout: result.timeout ?? false,
      targetLabel: best.id,
    });
  }
  return { placements, geoByCode };
}
