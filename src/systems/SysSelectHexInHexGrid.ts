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

export default class SysSelectHexInHexGrid extends System {
  private readonly _mouse_event_archetype: Archetype;
  private readonly _hex_grid_archetype: Archetype;
  constructor() {
    const hex_grid_archetype = new Archetype(
      CompHexGrid,
      CompSelectorHex,
      CompMouseSensitive,
      CompTransform,
    );
    const mouse_event_archetype = new Archetype(CompMouseEvent, CompMouseState);
    super(hex_grid_archetype, mouse_event_archetype);
    this._hex_grid_archetype = hex_grid_archetype;
    this._mouse_event_archetype = mouse_event_archetype;
  }

  update(context: GameContext, _time: number, _delta: number): void {
    context.ecs_manager
      .getEntitiesWithArchetype(this._mouse_event_archetype)
      .forEach((mouse_event) => {
        const mouse_state = context.ecs_manager.getComponent(
          mouse_event,
          CompMouseState,
        )!.mouse_state;
        context.ecs_manager
          .getEntitiesWithArchetype(this._hex_grid_archetype)
          .forEach((hexgrid_entity) => {
            const mouse_sensitive = context.ecs_manager.getComponent(
              hexgrid_entity,
              CompMouseSensitive,
            )!;
            const transform = context.ecs_manager.getComponent(
              hexgrid_entity,
              CompTransform,
            )!;

            const hexgrid = context.ecs_manager.getComponent(
              hexgrid_entity,
              CompHexGrid,
            )!.hexgrid;
            const hex_coordinates = hexgrid.hexCoordinatesFromVector2D(
              transform.getLocalCoordinates(mouse_state.position),
            );

            let color;
            if (mouse_state.mouseButtonState(0) === MouseButtonStatus.Held) {
              color = 0x0000ff;
            } else {
              color = 0xff0000;
            }
            updateSelectedHex(
              context,
              hexgrid_entity,
              mouse_sensitive.is_pointed_at && mouse_sensitive.is_top_entity,
              hex_coordinates,
              color,
            );
          });
      });
  }
}

function updateSelectedHex(
  context: GameContext,
  hexgrid_entity: Entity,
  is_visible: boolean,
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
  context.ecs_manager.getComponent(selected_hex, CompDrawable)!.is_visible =
    is_visible;
  const line_style = context.ecs_manager.getComponent(
    selected_hex!,
    CompLineStyle,
  )!;
  line_style.color = color;
}
