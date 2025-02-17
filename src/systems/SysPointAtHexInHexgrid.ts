import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import { Archetype } from '../engine/core/ComponentStore';
import { GameContext } from '../engine/core/GameContext';
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

  override update(context: GameContext, _time: number, _delta: number): void {
    const mouse_event = context.ecs_manager.getEntityWithArchetype(
      this._mouse_event_archetype,
    );
    if (!mouse_event) {
      return;
    }
    const mouse_state = context.ecs_manager.getComponent(
      mouse_event,
      CompMouseState,
    )!.mouse_state;
    context.ecs_manager
      .getEntitiesWithArchetype(this._hex_grid_archetype)
      .forEach((hexgrid_entity) => {
        const hex_grid = context.ecs_manager.getComponent(
          hexgrid_entity,
          CompHexGrid,
        )!.hexgrid;
        const mouse_sensitive = context.ecs_manager.getComponent(
          hexgrid_entity,
          CompMouseSensitive,
        )!;
        const transform = context.ecs_manager.getComponent(
          hexgrid_entity,
          CompTransform,
        )!;
        const object_position = transform.getLocalCoordinates(
          mouse_state.position,
        );
        const hex_coordinates =
          hex_grid.hexCoordinatesFromVector2D(object_position);
        mouse_sensitive.is_pointed_at = hex_grid.isHexInGrid(hex_coordinates);
      });
  }
}
