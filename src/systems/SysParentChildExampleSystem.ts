import CompParent from '../engine/core_components/CompParent';
import System from '../engine/core/System';
import { Archetype } from '../engine/core/ComponentStore';
import EcsManager from '../engine/core/EcsManager';

export default class SysParentChildExampleSystem extends System {
  private _last_update: number = 0;

  constructor() {
    super(new Archetype(CompParent));
  }

  override update(ecs: EcsManager, time: number, _delta: number): void {
    if (time - this._last_update > 10000) {
      this._last_update = time;
      const parents = ecs.getEntitiesWithArchetype(this.archetypes[0]);
      for (const parent of parents) {
        const parent_comp = ecs.getComponent(parent, CompParent);
        console.log(`Parent #${parent} has children:`);
        parent_comp?.children.forEach((child) => {
          console.log(`Child #${child}`);
        });
      }
    }
  }
}
