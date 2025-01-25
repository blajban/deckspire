import CompHex from '../components/CompHex';
import CompHexGrid from '../components/CompHexGrid';
import CompTransform from '../components/CompTransform';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import World from '../engine/core/World';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompMouseSensitive from '../engine/core_components/CompMouseSensitive';
import { MouseContext, MouseSubSystem } from '../engine/core_systems/SysMouse';

export class SysPointedAtHex extends MouseSubSystem {
  private pointed_at_hex: Entity | null = null;

  constructor() {
    super([[CompHexGrid, CompMouseSensitive, CompTransform]]);
  }

  public is_entity_pointed_at(
    world: World,
    scene: Scene,
    context: MouseContext,
    time: number,
    delta: number,
    entity: Entity,
  ): boolean {
    const hex_grid = world.getComponent(entity, CompHexGrid)!.hexgrid;
    const transform = world.getComponent(entity, CompTransform)!;
    const mouse_sensitivity = world.getComponent(entity, CompMouseSensitive)!;
    if (mouse_sensitivity.activate && mouse_sensitivity.activate_on_motion) {
      const hex_coordinates = hex_grid.hex_coordinates_from_vector2d(
        context.last_position.clone()
          .subtract(transform.position)
          .rotate(-transform.rotation),
      );
      console.log(
        `Pointing at position: (${context.last_position.x}, ${context.last_position.y})`,
      );
      console.log(
        `Pointing at coords: (${hex_coordinates.q}, ${hex_coordinates.r})`,
      );
      return hex_grid.is_hex_in_grid(hex_coordinates);
    }
    return false;
  }

  public pointing_at(
    world: World,
    scene: Scene,
    context: MouseContext,
    time: number,
    delta: number,
    entity: Entity,
  ): void {
    const hex_grid = world.getComponent(entity, CompHexGrid)!.hexgrid;
    const transform = world.getComponent(entity, CompTransform)!;
    const vec2d = context.last_position.clone();
    const hex_coordinates = hex_grid.hex_coordinates_from_vector2d(
      vec2d.subtract(transform.position).rotate(-transform.rotation),
    );
    if (this.pointed_at_hex === null) {
      this.pointed_at_hex = world.newEntity();
      world.addComponents(
        this.pointed_at_hex,
        new CompDrawable(10),
        new CompHex(hex_coordinates),
      );
      world.addParentChildRelationship(entity, this.pointed_at_hex);
    } else {
      world.getComponent(this.pointed_at_hex, CompHex)!.coordinates =
        hex_coordinates;
    }
  }
}
