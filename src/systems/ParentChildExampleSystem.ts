import CompParent from '../engine/core_components/CompParent';
import System from '../engine/core/System';
import World from '../engine/core/World';
import Scene from '../engine/core/Scene';

export default class ParentChildExampleSystem extends System {
  constructor() {
    super([[CompParent]]);
  }

  private last_update: number = 0;
  update(world: World, scene: Scene, time: number, delta: number) {
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
