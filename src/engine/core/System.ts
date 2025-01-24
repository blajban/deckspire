import { Archetype } from './ComponentStore';
import Scene from './Scene';
import World from './World';

export interface HasApplicableArchetypes {
  readonly archetypes: Archetype[];
}

export default abstract class System implements HasApplicableArchetypes {
  constructor(public readonly archetypes: Archetype[]) {}

  update(world: World, scene: Scene, time: number, delta: number) {
    throw new Error('Each system needs to implement the update method');
  }
}
