import { Archetype } from '../core/ComponentStore';
import { GameContext } from '../core/GameContext';
import System from '../core/System';
import { CompDestroyMe } from '../core_components/CompDestroy';

export default class SysTerminator extends System {
  constructor() {
    super(new Archetype(CompDestroyMe));
  }
  update(context: GameContext, _time: number, _delta: number): void {
    context.ecs_manager
      .getEntitiesWithArchetype(this.archetypes[0])
      .forEach((entity) => {
        context.ecs_manager.removeEntity(entity);
      });
  }
}
