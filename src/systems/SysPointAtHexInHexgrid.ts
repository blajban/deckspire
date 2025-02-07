import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import { Archetype } from '../engine/core/ComponentStore';
import { Entity } from '../engine/core/Entity';
import { GameContext } from '../engine/core/GameContext';
import System from '../engine/core/System';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompLineStyle from '../engine/core_components/CompLineStyle';
import {
  CompIsMouse,
  CompMouseSensitive,
  CompMouseState,
} from '../engine/core_components/CompMouse';
import CompNamed from '../engine/core_components/CompNamed';
import { MouseButtonStatus } from '../engine/input/MouseState';

export class SysPointAtHexInHexgrid extends System {
  private _pointed_at_hex: Entity | null = null;
  private _mouse_archetype;
  private _hex_grid_archetype;

  constructor() {
    super(
      new Archetype(CompIsMouse, CompMouseState),
      new Archetype(CompHexGrid, CompMouseSensitive, CompTransform),
    );
    this._mouse_archetype = this.archetypes[0];
    this._hex_grid_archetype = this.archetypes[1];
  }

  update(context: GameContext, _time: number, _delta: number): void {
    const mouse_entity = context.ecs_manager.getEntityWithArchetype(
      this._mouse_archetype,
    );
    if (!mouse_entity) {
      return;
    }
    const mouse_state = context.ecs_manager.getComponent(
      mouse_entity,
      CompMouseState,
    )!.mouse_state;
    context.ecs_manager
      .getEntitiesWithArchetype(this._hex_grid_archetype)
      .forEach((entity) => {
        const hex_grid = context.ecs_manager.getComponent(
          entity,
          CompHexGrid,
        )!.hexgrid;
        const mouse_sensitive = context.ecs_manager.getComponent(
          entity,
          CompMouseSensitive,
        )!;
        const transform = context.ecs_manager.getComponent(
          entity,
          CompTransform,
        )!;
        const hex_coordinates = hex_grid.hexCoordinatesFromVector2D(
          mouse_state.position
            .clone()
            .subtract(transform.position)
            .rotate(-transform.rotation),
        );
        mouse_sensitive.is_pointed_at = hex_grid.isHexInGrid(hex_coordinates);
        if (mouse_sensitive.is_pointed_at) {
          if (this._pointed_at_hex === null) {
            this._pointed_at_hex = context.ecs_manager.newEntity();
            context.ecs_manager.addComponents(
              this._pointed_at_hex,
              new CompNamed('The Selected Hex'),
              new CompDrawable(10),
              new CompHex(hex_coordinates),
              new CompLineStyle(5, 0xff0000, 0.5),
            );
            context.ecs_manager.addParentChildRelationship(
              entity,
              this._pointed_at_hex,
            );
          } else {
            context.ecs_manager.getComponent(
              this._pointed_at_hex,
              CompHex,
            )!.coordinates = hex_coordinates;
          }
          const line_style = context.ecs_manager.getComponent(
            this._pointed_at_hex,
            CompLineStyle,
          )!;
          if (mouse_state.mouseButtonState(0) === MouseButtonStatus.Held) {
            line_style.color = 0x0000ff;
          } else {
            line_style.color = 0xff0000;
          }
        }
      });
  }
}
