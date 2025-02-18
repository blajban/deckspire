import { Archetype } from '../core/ComponentStore';
import EcsManager from '../core/EcsManager';
import { Entity } from '../core/Entity';
import System from '../core/System';
import { CompMouseSensitive } from '../core_components/CompMouse';

export default class SysMouseDepth extends System {
  constructor() {
    super(new Archetype(CompMouseSensitive));
  }

  override update(ecs: EcsManager, _time: number, _delta: number): void {
    const mouse_sensitive_archetype = this.archetypes[0];
    let min_depth = Number.POSITIVE_INFINITY;
    let top_entity: Entity | undefined = undefined;

    ecs
      .getEntitiesWithArchetype(mouse_sensitive_archetype)
      .forEach((entity) => {
        const mouse_sensitive = ecs.getComponent(entity, CompMouseSensitive)!;
        mouse_sensitive.is_top_entity = false;
        if (
          mouse_sensitive.is_pointed_at &&
          mouse_sensitive.mouse_depth < min_depth
        ) {
          min_depth = mouse_sensitive.mouse_depth;
          top_entity = entity;
        }
      });
    if (top_entity !== undefined) {
      const mouse_sensitive = ecs.getComponent(top_entity, CompMouseSensitive)!;
      mouse_sensitive.is_top_entity = true;
    }
  }
}
