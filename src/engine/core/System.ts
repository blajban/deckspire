import { setUnion } from '../util/setUtilityFunctions';
import { Archetype } from './ComponentStore';
import { Entity } from './Entity';
import Scene from './Scene';
import World from './World';

abstract class HasApplicableArchetypes {
  constructor(public readonly ARCHETYPES: Archetype[]) {}

  public allMatchingEntities(world: World): Set<Entity> {
    const entity_sets = new Array<Set<Entity>>();
    this.ARCHETYPES.forEach((archetype) => {
      entity_sets.push(world.getEntitiesWithArchetype(...archetype));
    });
    return setUnion(...entity_sets);
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

export abstract class SubSystem extends HasApplicableArchetypes {}

export abstract class SystemWithSubsystems<T extends SubSystem> extends System {
  protected sub_systems: T[] = [];

  public addSubSystem(sub_system: T): void {
    this.sub_systems.push(sub_system);
  }
}
