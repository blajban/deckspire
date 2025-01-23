import Component, { ComponentID } from "../core/Component";
import Scene from "../core/Scene";
import System from "../core/System";
import World from "../core/World";

export abstract class DrawSubSystem {
  constructor(private archetype: ComponentID<Component>[]) {}

  update(
    world: World,
    scene: Scene,
    time: number,
    delta: number,
    entity: number,
  ) {
    throw new Error('Update method not implemented in DrawSubSystem.');
  }
  public applicable_archetype(): ComponentID<Component>[] {
    return this.archetype;
  }
}

export default class SysDraw extends System {
  private sub_systems: Array<DrawSubSystem> = [];

  constructor(private scene: Scene) {
    super();
  }

  public add_sub_system(sub_system: DrawSubSystem) {
    this.sub_systems.push(sub_system);
  }

  update(world: World, time: number, delta: number) {
    this.sub_systems.forEach((sub_system) => {
      world
        .getEntitiesWithArchetype(...sub_system.applicable_archetype())
        .forEach((entity) => {
          sub_system.update(world, this.scene, time, delta, entity);
        });
    });
  }
}
