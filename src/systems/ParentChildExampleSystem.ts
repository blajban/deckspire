import { CompParent } from '../engine/components/CompParent';
import { System } from '../engine/core/System';
import { World } from '../engine/core/World';

export default class ParentChildExampleSystem extends System {
  update(world: World, time: number, delta: number) {
    const parents = world.getEntitiesWithComponent(CompParent);

    for (const parent of parents) {
      const parentComp = world.getComponent(parent, CompParent);

      parentComp?.children.forEach((child) => {
        console.log(`Child #${child}`);
      });
    }
  }
}
