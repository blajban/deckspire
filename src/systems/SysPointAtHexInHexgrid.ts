import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../engine/core_components/CompTransform';
import { Archetype } from '../engine/core/ComponentStore';
import EcsManager from '../engine/core/EcsManager';
import System from '../engine/core/System';
import {
  CompMouseEvent,
  CompMouseSensitive,
  CompMouseState,
} from '../engine/core_components/CompMouse';

export class SysPointAtHexInHexgrid extends System {
  private _mouse_event_archetype;
  private _hex_grid_archetype;

  constructor() {
    super(
      new Archetype(CompMouseEvent, CompMouseState),
      new Archetype(CompHexGrid, CompMouseSensitive, CompTransform),
    );
    this._mouse_event_archetype = this.archetypes[0];
    this._hex_grid_archetype = this.archetypes[1];
  }

  override update(ecs: EcsManager, _time: number, _delta: number): void {
    const mouse_event = ecs.getEntityWithArchetype(this._mouse_event_archetype);
    if (!mouse_event) {
      return;
    }
    const mouse_state = ecs.getComponent(
      mouse_event,
      CompMouseState,
    )!.mouse_state;
    ecs
      .getEntitiesWithArchetype(this._hex_grid_archetype)
      .forEach((hexgrid_entity) => {
        const hex_grid = ecs.getComponent(hexgrid_entity, CompHexGrid)!.hexgrid;
        const mouse_sensitive = ecs.getComponent(
          hexgrid_entity,
          CompMouseSensitive,
        )!;
        const transform = ecs.getComponent(hexgrid_entity, CompTransform)!;
        const object_position = transform.getLocalCoordinates(
          mouse_state.position,
        );
        const hex_coordinates =
          hex_grid.hexCoordinatesFromVector2D(object_position);
        mouse_sensitive.is_pointed_at = hex_grid.isHexInGrid(hex_coordinates);
      });
  }
}
