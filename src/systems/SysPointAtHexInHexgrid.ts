import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompSelectorHex from '../components/CompSelectorHex';
import CompTransform from '../components/CompTransform';
import { Archetype } from '../engine/core/ComponentStore';
import { Entity } from '../engine/core/Entity';
import { GameContext } from '../engine/core/GameContext';
import System from '../engine/core/System';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompLineStyle from '../engine/core_components/CompLineStyle';
import {
  CompMouseEvent,
  CompMouseSensitive,
  CompMouseState,
} from '../engine/core_components/CompMouse';
import CompNamed from '../engine/core_components/CompNamed';
import CompParent from '../engine/core_components/CompParent';
import { MouseButtonStatus } from '../engine/input/MouseState';
import { HexCoordinates } from '../math/hexgrid/HexVectors';

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
        const hex_coordinates = hex_grid.hexCoordinatesFromVector2D(
          mouse_state.position
            .clone()
            .subtract(transform.position)
            .rotate(-transform.rotation),
        );
        mouse_sensitive.is_pointed_at = hex_grid.isHexInGrid(hex_coordinates);

        if (
          context.ecs_manager.getComponent(hexgrid_entity, CompSelectorHex) ===
          undefined
        ) {
          return;
        }

        let color;
        if (mouse_state.mouseButtonState(0) === MouseButtonStatus.Held) {
          color = 0x0000ff;
        } else {
          color = 0xff0000;
        }
        updateSelectedHex(
          context,
          hexgrid_entity,
          mouse_sensitive.is_pointed_at,
          hex_coordinates,
          color,
        );
      });
  }
}

function updateSelectedHex(
  context: GameContext,
  hexgrid_entity: Entity,
  is_pointed_at: boolean,
  hex_coordinates: HexCoordinates,
  color: number,
): void {
  // Find the selected hex entity
  const children = context.ecs_manager.getComponent(
    hexgrid_entity,
    CompParent,
  )?.children;
  let selected_hex: Entity | undefined = undefined;
  children?.forEach((child) => {
    if (
      context.ecs_manager.getComponent(child, CompNamed)?.name ===
      'The Selected Hex'
    ) {
      selected_hex = child;
    }
  });
  if (!selected_hex) {
    selected_hex = context.ecs_manager.newEntity();
    context.ecs_manager.addComponents(
      selected_hex,
      new CompHex(hex_coordinates),
      new CompDrawable(1, true),
      new CompLineStyle(5, 0xff0000, 0.5),
      new CompNamed('The Selected Hex'),
    );
    context.ecs_manager.addParentChildRelationship(
      hexgrid_entity,
      selected_hex,
    );
  }
  context.ecs_manager.getComponent(selected_hex!, CompHex)!.coordinates =
    hex_coordinates;
  context.ecs_manager.getComponent(selected_hex, CompDrawable)!.is_invisible =
    !is_pointed_at;
  const line_style = context.ecs_manager.getComponent(
    selected_hex!,
    CompLineStyle,
  )!;
  line_style.color = color;
}
