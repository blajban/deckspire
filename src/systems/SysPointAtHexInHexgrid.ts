import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../engine/core_components/CompTransform';
import EcsManager from '../engine/core/EcsManager';
import System from '../engine/core/System';
import {
  CompMouseEvent,
  CompMouseSensitive,
  CompMouseState,
} from '../engine/core_components/CompMouse';
import PhaserContext from '../engine/core/PhaserContext';
import Archetype from '../engine/core/Archetype';

export class SysPointAtHexInHexgrid extends System {
  private _mouse_event_archetype = new Archetype(
    CompMouseEvent,
    CompMouseState,
  );
  private _hex_grid_archetype = new Archetype(
    CompHexGrid,
    CompMouseSensitive,
    CompTransform,
  );

  override update(
    ecs: EcsManager,
    _phaser_context: PhaserContext,
    _time: number,
    _delta: number,
  ): void {
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
