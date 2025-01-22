import CompParent from '../engine/components/CompParent';
import System from '../engine/core/System';
import World from '../engine/core/World';

export default class ParentChildExampleSystem extends System {
  private last_update: number = 0;
  update(world: World, time: number, delta: number) {
    if (time - this.last_update > 10000) {
      this.last_update = time;
      const parents = world.getEntitiesWithComponent(CompParent);
      for (const parent of parents) {
        const parentComp = world.getComponent(parent, CompParent);
        console.log(`Parent #${parent} has children:`);
        parentComp?.children.forEach((child) => {
          console.log(`Child #${child}`);
        });
      }
    }
  }
}
