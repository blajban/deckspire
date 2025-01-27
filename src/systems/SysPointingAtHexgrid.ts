import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import World from '../engine/core/World';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompLineStyle from '../engine/core_components/CompLineStyle';
import CompMouseSensitive from '../engine/core_components/CompMouseSensitive';
import CompNamed from '../engine/core_components/CompNamed';
import { MouseButtonStatus, MouseEvent, MouseSubSystem } from '../engine/core_systems/SysMouse';

export class SysPointingAtHexgrid extends MouseSubSystem {
  private pointed_at_hex: Entity | null = null;

  constructor() {
    super([[CompHexGrid, CompMouseSensitive, CompTransform]]);
  }

  public is_entity_pointed_at(
    world: World,
    scene: Scene,
    event: MouseEvent,
    time: number,
    delta: number,
    entity: Entity,
  ): boolean {
    const hex_grid = world.getComponent(entity, CompHexGrid)!.hexgrid;
    const transform = world.getComponent(entity, CompTransform)!;
    const hex_coordinates = hex_grid.hex_coordinates_from_vector2d(
      event.last_position
        .clone()
        .subtract(transform.position)
        .rotate(-transform.rotation),
    );
    return hex_grid.is_hex_in_grid(hex_coordinates);
  }

  public on_mouse_event(
    world: World,
    scene: Scene,
    event: MouseEvent,
    time: number,
    delta: number,
    entity: Entity,
  ): void {
    const hex_grid = world.getComponent(entity, CompHexGrid)!.hexgrid;
    const transform = world.getComponent(entity, CompTransform)!;
    const vec2d = event.last_position.clone();
    const hex_coordinates = hex_grid.hex_coordinates_from_vector2d(
      vec2d.subtract(transform.position).rotate(-transform.rotation),
    );
    if (this.pointed_at_hex === null) {
      this.pointed_at_hex = world.newEntity();
      world.addComponents(
        this.pointed_at_hex,
        new CompNamed('The Selected Hex'),
        new CompDrawable(10),
        new CompHex(hex_coordinates),
        new CompLineStyle(5, 0xff0000, 0.5),
      );
      world.addParentChildRelationship(entity, this.pointed_at_hex);
    } else {
      world.getComponent(this.pointed_at_hex, CompHex)!.coordinates =
        hex_coordinates;
    }
    let line_style = world.getComponent(this.pointed_at_hex, CompLineStyle)!;
    if( event.mouse_button_state(0) === MouseButtonStatus.Held){
      line_style.color = 0x0000ff;
    }
    else{
      line_style.color = 0xff0000;
    }
  }
}
