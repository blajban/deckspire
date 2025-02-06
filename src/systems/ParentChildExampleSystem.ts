import CompParent from '../engine/core_components/CompParent';
import System from '../engine/core/System';
import { Archetype } from '../engine/core/ComponentStore';
import { GameContext } from '../engine/core/GameContext';

export default class ParentChildExampleSystem extends System {
  constructor() {
    super(new Archetype(CompParent));
  }

  private _last_update: number = 0;
  update(context: GameContext, time: number, _delta: number): void {
    if (time - this._last_update > 10000) {
      this._last_update = time;
      const parents = context.ecs_manager.getEntitiesWithArchetype(
        this.archetypes[0],
      );
      for (const parent of parents) {
        const parent_comp = context.ecs_manager.getComponent(
          parent,
          CompParent,
        );
        console.log(`Parent #${parent} has children:`);
        parent_comp?.children.forEach((child) => {
          console.log(`Child #${child}`);
        });
      }
    }
  }
}
