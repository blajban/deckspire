import { ClassType } from '../util/ClassType';
import { Archetype } from './ComponentStore';
import EcsManager from './EcsManager';

export type SystemClass = ClassType<System>;

export default abstract class System {
  public readonly archetypes: Archetype[];
  constructor(...archetypes: Archetype[]) {
    this.archetypes = archetypes;
  }
  init(_ecs: EcsManager): void {}
  abstract update(ecs: EcsManager, time: number, delta: number): void;
  terminate(_ecs: EcsManager): void {}
}
