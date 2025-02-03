import { ClassIdentifier } from '../util/ClassIdentifier';
import { Archetype } from './ComponentStore';
import { Context } from './Engine';

export type SystemClass<T extends System> = ClassIdentifier<T>;

abstract class HasApplicableArchetypes {
  constructor(public readonly archetypes: Archetype[]) {}
}

export default abstract class System extends HasApplicableArchetypes {
  abstract update(context: Context, time: number, delta: number): void;
}

export abstract class SubSystem extends HasApplicableArchetypes {}

export abstract class SystemWithSubsystems<T extends SubSystem> extends System {
  protected sub_systems: T[] = [];

  public addSubSystem(sub_system: T): void {
    this.sub_systems.push(sub_system);
  }
}
