import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import { PhaserContext } from '../engine/core/Engine';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompLineStyle from '../engine/core_components/CompLineStyle';
import CompMouseSensitive from '../engine/core_components/CompMouseSensitive';
import CompNamed from '../engine/core_components/CompNamed';
import {
  MouseButtonStatus,
  MouseEvent,
  MouseSubSystem,
} from '../engine/core_systems/SysMouse';

export class SysPointingAtHexgrid extends MouseSubSystem {
  private _pointed_at_hex: Entity | null = null;

  constructor() {
    super([[CompHexGrid, CompMouseSensitive, CompTransform]]);
  }

  public isEntityPointedAt(
    scene: Scene,
    phaser_context: PhaserContext,
    event: MouseEvent,
    time: number,
    delta: number,
    entity: Entity,
  ): boolean {
    const hex_grid = scene.ecs.getComponent(entity, CompHexGrid)!.hexgrid;
    const transform = scene.ecs.getComponent(entity, CompTransform)!;
    const hex_coordinates = hex_grid.hexCoordinatesFromVector2D(
      event.last_position
        .clone()
        .subtract(transform.position)
        .rotate(-transform.rotation),
    );
    return hex_grid.isHexInGrid(hex_coordinates);
  }

  public onMouseEvent(
    scene: Scene,
    phaser_context: PhaserContext,
    event: MouseEvent,
    time: number,
    delta: number,
    entity: Entity,
  ): void {
    const hex_grid = scene.ecs.getComponent(entity, CompHexGrid)!.hexgrid;
    const transform = scene.ecs.getComponent(entity, CompTransform)!;
    const vec2d = event.last_position.clone();
    const hex_coordinates = hex_grid.hexCoordinatesFromVector2D(
      vec2d.subtract(transform.position).rotate(-transform.rotation),
    );
    if (this._pointed_at_hex === null) {
      this._pointed_at_hex = scene.ecs.newEntity();
      scene.ecs.addComponents(
        this._pointed_at_hex,
        new CompNamed('The Selected Hex'),
        new CompDrawable(10),
        new CompHex(hex_coordinates),
        new CompLineStyle(5, 0xff0000, 0.5),
      );
      scene.ecs.addParentChildRelationship(entity, this._pointed_at_hex);
    } else {
      scene.ecs.getComponent(this._pointed_at_hex, CompHex)!.coordinates =
        hex_coordinates;
    }
    const line_style = scene.ecs.getComponent(
      this._pointed_at_hex,
      CompLineStyle,
    )!;
    if (event.mouseButtonState(0) === MouseButtonStatus.Held) {
      line_style.color = 0x0000ff;
    } else {
      line_style.color = 0xff0000;
    }
  }
}
