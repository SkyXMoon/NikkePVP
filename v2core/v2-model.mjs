/** Give each calculation its own transforms while sharing immutable decoded resources. */
export function cloneCalculationModel(template) {
  const scene = template.scene.clone(true);
  const originals = [], copies = [];
  template.scene.traverse(node => originals.push(node));
  scene.traverse(node => copies.push(node));
  const nodes = new Map(originals.map((node, position) => [node, copies[position]]));
  // Animation tracks may address unnamed nodes by UUID. Mixers are isolated per actor.
  for (const [original, copy] of nodes) copy.uuid = original.uuid;
  return { scene, animations: template.animations, parser: {
    json: template.parser.json,
    async getDependency(type, position) {
      const original = await template.parser.getDependency(type, position);
      const copy = nodes.get(original);
      if (!copy) throw new Error(`V2计算节点不在场景中 ${position}`);
      return copy;
    },
  } };
}
