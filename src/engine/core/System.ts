import { set_union } from '../util/set_utility_functions';
import { Archetype } from './ComponentStore';
import { Entity } from './Entity';
import Scene from './Scene';
import World from './World';

abstract class HasApplicableArchetypes {
  constructor(public readonly archetypes: Archetype[]) {}
  
  public all_matching_entities(world: World): Set<Entity> {
    const entity_sets = new Array<Set<Entity>>();
    this.archetypes.forEach((archetype) => {
      entity_sets.push(world.getEntitiesWithArchetype(...archetype));
    });
    return set_union(...entity_sets);
  }
}

export default abstract class System extends HasApplicableArchetypes {
  abstract update(
    world: World,
    scene: Scene,
    time: number,
    delta: number,
  ): void;
}

export abstract class SubSystem extends HasApplicableArchetypes {
}

export abstract class SystemWithSubsystems<T extends SubSystem> extends System {
  protected sub_systems: T[] = [];

  public add_sub_system(sub_system: T) {
    this.sub_systems.push(sub_system);
  }
}
