import Component, { ComponentID } from '../engine/core/Component';
import System from '../engine/core/System';
import World from '../engine/core/World';

export abstract class DrawSubSystem {
  constructor(private archetype: ComponentID<Component>[]) {}

  update(world: World, time: number, delta: number, entity: number) {
    throw new Error('Update method not implemented in DrawSubSystem.');
  }
  public applicable_archetype(): ComponentID<Component>[] {
    return this.archetype;
  }
}

export default class SysDraw extends System {
  private sub_systems: Array<DrawSubSystem> = [];

  constructor(public scene: Phaser.Scene) {
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
          sub_system.update(world, time, delta, entity);
        });
    });
  }
}
