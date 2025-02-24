import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompSelectorHex from '../components/CompSelectorHex';
import CompTransform from '../engine/core_components/CompTransform';
import EcsManager from '../engine/core/EcsManager';
import { Entity } from '../engine/core/Entity';
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
import PhaserContext from '../engine/core/PhaserContext';
import Archetype from '../engine/core/Archetype';

export default class SysSelectHexInHexGrid extends System {
  private readonly _mouse_event_archetype = new Archetype(
    CompMouseEvent,
    CompMouseState,
  );
  private readonly _hex_grid_archetype = new Archetype(
    CompHexGrid,
    CompSelectorHex,
    CompMouseSensitive,
    CompTransform,
  );

  update(
    ecs: EcsManager,
    _phaser_context: PhaserContext,
    _time: number,
    _delta: number,
  ): void {
    ecs
      .getComponentsForEntitiesWithArchetype(this._mouse_event_archetype)
      .forEach(([_mouse_event, mouse_state_comp], _mouse_event_entity) => {
        const mouse_state = mouse_state_comp.mouse_state;
        ecs
          .getEntitiesWithArchetype(this._hex_grid_archetype)
          .forEach((hexgrid_entity) => {
            const mouse_sensitive = ecs.getComponent(
              hexgrid_entity,
              CompMouseSensitive,
            )!;
            const transform = ecs.getComponent(hexgrid_entity, CompTransform)!;

            const hexgrid = ecs.getComponent(
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
              ecs,
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
  ecs: EcsManager,
  hexgrid_entity: Entity,
  is_visible: boolean,
  hex_coordinates: HexCoordinates,
  color: number,
): void {
  // Find the selected hex entity
  const children = ecs.getComponent(hexgrid_entity, CompParent)?.children;
  let selected_hex: Entity | undefined = undefined;
  children?.forEach((child) => {
    if (ecs.getComponent(child, CompNamed)?.name === 'The Selected Hex') {
      selected_hex = child;
    }
  });
  if (!selected_hex) {
    selected_hex = ecs.newEntity();
    ecs.addComponents(
      selected_hex,
      new CompHex(hex_coordinates),
      new CompDrawable(1, true),
      new CompLineStyle(5, 0xff0000, 0.5),
      new CompNamed('The Selected Hex'),
    );
    ecs.addParentChildRelationship(hexgrid_entity, selected_hex);
  }
  ecs.getComponent(selected_hex!, CompHex)!.coordinates = hex_coordinates;
  ecs.getComponent(selected_hex, CompDrawable)!.is_visible = is_visible;
  const line_style = ecs.getComponent(selected_hex!, CompLineStyle)!;
  line_style.color = color;
}
