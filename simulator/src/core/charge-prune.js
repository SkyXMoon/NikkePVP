/** 充能数据裁剪：从完整角色表里取出「充能模拟真正会读」的那一部分。
 *
 *  用途是发布口径，不是生成口径：完整表照常导出、照常进私有仓库，只有站上的
 *  模拟器拿裁剪版。伤害 / 治疗 / 属性那一半不上线，等真做伤害结算再切回去。
 *
 *  判据不是 ft 白名单，而是「删掉它会不会改变充能结果」，一共四条边：
 *
 *  1. 种子：driver 会读取、且会改变充能或开火节奏的节点（`SEED_FTS`）。
 *  2. 反向闭包（connected 的逆边）：一个节点只有被父节点触发才能到达种子，
 *     所以能通向种子的父链必须整条保留。这条会自动保住「数值看着没用、但节点
 *     本身是链入口」的形状——银华 204201002 的 FT11 StatChargeDamage、
 *     尤妮的 FT15 StatDef 都靠它活下来，不需要单独写特例。
 *  3. 组连通块（双向）：节点在 status / status2 / trigger 里按 groupId 判
 *     「某个功能在不在场」，生产者与消费者必须同留。爱德：特工兔女郎
 *     231511002（FT140）是 FT54 状态闭包的 counter producer；樱花：夏日绽放
 *     228411002（FT168 DurationValueChange）读 1284202 再改它的持续时间，而
 *     1284202 每次落地都会加爆裂能量，少改这一下就等于多充能。
 *  4. FT134 的 connected 整组：原生 `nextFunctionCycleIndex(id, connected.length)`
 *     用数组长度做轮转取模，少一个兄弟节点就会让轮转错位。
 *  5. 建图门槛：裁剪后若「没有任何一行 skills 的 id 落在图的节点里」，driver 就
 *     不会为这张图建 FunctionProgram，剩下的节点全是死重量 → 整张图清空。反过来
 *     也一样：`pruneRow` 会给「还有节点但没有对应技能行」的图补回一行兜底技能行。
 *
 *  刻意不做的两件事：
 *  - 不做正向扩张。充能节点连出去的纯战术子节点删掉不影响充能，留着才是体积。
 *  - 不动 `entities`。`FunctionProgram.inertEntity()` 用它判断「引用了一个整张表
 *    都不可达的实体」，删实体等于把「不必报缺口」改判成「缺口」。
 */
import { groupRefs } from './function-program.js';

/** driver 会读取、且会改变充能或开火节奏的 FunctionType（按 driver 的读取点列举，
 *  不是按技能语义）：
 *    111 直接充能 · 102 首次爆发充能加速 · 61 蓄速 · 16/85 射速
 *    13/159 换弹 · 14/108 弹匣 · 27 补弹 · 6/31 眩晕与状态 · 54 穿透
 *    12 爆炸范围（满蓄射击分支）· 70 感染施加 · 146 满蓄命中重复 · 214 队伍弹药
 *    0 空程（图的直通节点）· 72/134/164/167/77/124 图控制
 *    64/75 伤害结果节点——它们**不是纯伤害**：`driver.js` 的 `onCommand` 在
 *      `[64,75].includes(node.ft)` 时调 `settle({perShot: burstEnergyBp,
 *      skillChargeOnly: true})`，这次触发本身会往爆裂槽里加能量，删节点等于少充能。
 *  FT202 DefIgnoreDamage 是纯伤害，不结算充能，只有连着充能输出时才被反向闭包拉进来。 */
export const SEED_FTS = new Set([0, 6, 12, 13, 14, 16, 27, 31, 54, 61, 64, 70, 72, 75, 77,
  85, 102, 108, 111, 124, 134, 146, 159, 164, 167, 177, 214]);

/** FT134 的 connected 必须整组保留（轮转按数组长度取模）。 */
const CYCLE_FT = 134;

/** `pickChargeRows` / `pickInfectionRows` / ft54 行会读到的 ft。 */
export const KEEP_SKILL_FTS = new Set([12, 13, 14, 16, 54, 61, 70, 75, 102, 108, 111, 146, 214]);

/** 一张图保留哪些节点 id。`extraSeeds` 是调用方指定必须保留的节点（建图门槛用）。 */
export function keepNodeIds(program, row = {}, extraSeeds = []) {
  const nodes = program.nodes ?? [];
  const byId = new Map(nodes.map(node => [String(node.id), node]));
  const inbound = new Map();
  for (const node of nodes) {
    for (const child of node.connected ?? []) {
      const list = inbound.get(String(child));
      if (list) list.push(String(node.id));
      else inbound.set(String(child), [String(node.id)]);
    }
  }
  const groupMembers = new Map();
  const addMember = (group, id) => {
    const key = String(group);
    const list = groupMembers.get(key);
    if (list) list.add(id);
    else groupMembers.set(key, new Set([id]));
  };
  for (const node of nodes) {
    const id = String(node.id);
    if (node.groupId != null) addMember(node.groupId, id);
    for (const group of groupRefs(node)) addMember(group, id);
  }

  const keep = new Set();
  for (const node of nodes) if (SEED_FTS.has(node.ft)) keep.add(String(node.id));
  for (const id of extraSeeds) if (byId.has(String(id))) keep.add(String(id));

  // 技能实体的命令入口：`FunctionProgram.phase()` 直接按 entity 的 commands 数组
  // invoke，不经过任何 root。实体本身不删，所以它的命令节点必须留。
  for (const entity of program.entities ?? []) {
    for (const ids of Object.values(entity.commands ?? {})) {
      for (const id of ids ?? []) if (byId.has(String(id))) keep.add(String(id));
    }
  }
  for (const id of Object.values(program.skillRoots ?? {})) {
    if (id != null && byId.has(String(id))) keep.add(String(id));
  }
  // binding 的激活行：图里的 id 与扁平 skills 行的 id 是同一套，激活节点必须在。
  for (const binding of row.chargeBindings ?? []) {
    for (const activation of binding.activations ?? []) {
      if (byId.has(String(activation.id))) keep.add(String(activation.id));
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const id of [...keep]) {
      for (const parent of inbound.get(id) ?? []) {
        if (keep.has(parent)) continue;
        keep.add(parent);
        changed = true;
      }
      const node = byId.get(id);
      // 两个方向都要走：节点自己引用别人的组（读），或者节点自己产一个组而别人
      // 在读/改它（被读）。少任何一边，FT168 这类「读一个组再改它的时长」的
      // 消费者就会从保留集里漏掉。
      const groups = new Set([...groupRefs(node),
        ...(node?.groupId != null ? [String(node.groupId)] : [])]);
      for (const group of groups) {
        for (const member of groupMembers.get(group) ?? []) {
          if (keep.has(member)) continue;
          keep.add(member);
          changed = true;
        }
      }
      if (node?.ft !== CYCLE_FT) continue;
      for (const child of node.connected ?? []) {
        if (keep.has(String(child))) continue;
        keep.add(String(child));
        changed = true;
      }
    }
  }
  return keep;
}

export function pruneProgram(program, row = {}) {
  // 建图门槛：`driver.js` 要求「至少一行 skills 的 id 与这张图的节点相交」，
  // 否则整张图都不建（不是少一个效果）。
  const skillIds = new Set((row.skills ?? []).map(skill => String(skill.id)));
  const gateIds = (program.nodes ?? []).filter(node => skillIds.has(String(node.id)))
    .map(node => String(node.id));
  let keep = keepNodeIds(program, row);
  if (gateIds.length && !gateIds.some(id => keep.has(id))) {
    const carriesSeed = (program.nodes ?? []).some(node => SEED_FTS.has(node.ft) && keep.has(String(node.id)));
    if (carriesSeed) {
      // 图里还有充能种子，只是门槛行本身是纯战术节点（罗珊娜：高雅海洋 283，
      // 门槛行是 FT112 PartsDamage / FT1 StatAtk）。把门槛行补回去，图照建，
      // 种子节点的行为与完整表一致——清空会把这几个种子一起变成死节点。
      keep = keepNodeIds(program, row, gateIds);
    } else {
      // 整张图只有属性/伤害节点（德尔塔 20、布丽德 70、爱德 310…），完整表里
      // 也不产生任何充能事件。清空整张图，和「不建图」等价，但省掉这些字节。
      // `tools/charge-prune-parity.mjs` 逐角色对拍全部一致，是这件事的证据。
      const empty = { ...program, nodes: [], roots: [] };
      if (program.rootsBySlot) {
        empty.rootsBySlot = Object.fromEntries(Object.keys(program.rootsBySlot).map(slot => [slot, []]));
      }
      return empty;
    }
  }
  const next = { ...program, nodes: (program.nodes ?? []).filter(node => keep.has(String(node.id))) };
  if (Array.isArray(program.roots)) next.roots = program.roots.filter(id => keep.has(String(id)));
  if (program.rootsBySlot) {
    next.rootsBySlot = Object.fromEntries(Object.entries(program.rootsBySlot)
      .map(([slot, ids]) => [slot, (ids ?? []).filter(id => keep.has(String(id)))]));
  }
  if (program.skillRoots) {
    // `skillRoots` 的值可能是实体 id 而不是节点 id（樱花：夏日绽放的
    // `skill2: "1284210"` 就是 entity 1284210，不是 nodes 里的任何一个）。
    // 按节点集过滤会把这种技能根整条抹掉，技能从此不派发。
    const entityIds = new Set((program.entities ?? []).map(entity => String(entity.id)));
    next.skillRoots = Object.fromEntries(Object.entries(program.skillRoots)
      .filter(([, id]) => id == null || keep.has(String(id)) || entityIds.has(String(id))));
  }
  return next;
}

/** 一个角色行 → 裁剪后的角色行。 */
export function pruneRow(row) {
  const programs = (row.chargeFunctionPrograms ?? []).map(program => pruneProgram(program, row));
  const activationIds = new Set((row.chargeBindings ?? [])
    .flatMap(binding => (binding.activations ?? []).map(a => String(a.id))));
  const extra = new Set();
  const keepSkill = skill => KEEP_SKILL_FTS.has(skill.ft) || activationIds.has(String(skill.id)) ||
    extra.has(String(skill.id));
  // 每张图至少要留一行「id 与节点相交」的技能行，否则 driver 那句
  // `skills.some(row => program.nodes.some(node => node.id === row.id))` 为假，
  // 整张图都不建——不是少一个效果，是这张图上的所有节点一起消失。诺雅 232
  // 就是这么丢的：她的技能行全是 FT42/1/4/37/15，按 ft 白名单会被清空，
  // 然后连 FT31 的图也不建了，事件流从 131 掉到 33。补一行就够，那个判断是 `.some()`。
  for (const program of programs) {
    const nodeIds = new Set((program.nodes ?? []).map(node => String(node.id)));
    if ((row.skills ?? []).some(skill => nodeIds.has(String(skill.id)) && keepSkill(skill))) continue;
    const fallback = (row.skills ?? []).find(skill => nodeIds.has(String(skill.id)));
    if (fallback) extra.add(String(fallback.id));
  }
  return { ...row, skills: (row.skills ?? []).filter(keepSkill), chargeFunctionPrograms: programs };
}

export function pruneDatabase(db) {
  const out = {};
  const stats = { nodesBefore: 0, nodesAfter: 0, skillsBefore: 0, skillsAfter: 0 };
  for (const [id, row] of Object.entries(db)) {
    out[id] = pruneRow(row);
    for (const program of row.chargeFunctionPrograms ?? []) stats.nodesBefore += program.nodes?.length ?? 0;
    for (const program of out[id].chargeFunctionPrograms ?? []) stats.nodesAfter += program.nodes?.length ?? 0;
    stats.skillsBefore += row.skills?.length ?? 0;
    stats.skillsAfter += out[id].skills?.length ?? 0;
  }
  return { data: out, stats };
}
