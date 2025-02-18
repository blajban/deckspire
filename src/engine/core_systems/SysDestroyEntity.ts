import { Archetype } from '../core/ComponentStore';
import EcsManager from '../core/EcsManager';
import System from '../core/System';
import { CompDestroyMe } from '../core_components/CompDestroy';

export default class SysDestroyEntity extends System {
  constructor() {
    super(new Archetype(CompDestroyMe));
  }

  override update(ecs: EcsManager, _time: number, _delta: number): void {
    ecs.getEntitiesWithArchetype(this.archetypes[0]).forEach((entity) => {
      ecs.removeEntity(entity);
    });
  }
}
