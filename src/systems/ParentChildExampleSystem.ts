import CompParent from '../engine/core_components/CompParent';
import System from '../engine/core/System';
import Engine from '../engine/core/Engine';
import Scene from '../engine/core/Scene';

export default class ParentChildExampleSystem extends System {
  constructor() {
    super([[CompParent]]);
  }

  private _last_update: number = 0;
  update(scene: Scene, engine: Engine, time: number, _delta: number): void {
    if (time - this._last_update > 10000) {
      this._last_update = time;
      const parents = scene.ecs.getEntitiesWithComponent(CompParent);
      for (const parent of parents) {
        const parent_comp = scene.ecs.getComponent(parent, CompParent);
        console.log(`Parent #${parent} has children:`);
        parent_comp?.children.forEach((child) => {
          console.log(`Child #${child}`);
        });
      }
    }
  }
}
