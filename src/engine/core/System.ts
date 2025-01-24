import Component, { ComponentClass } from './Component';
import Scene from './Scene';
import World from './World';

export type Archetype = ComponentClass<Component>[];

export interface ApplicableArchetypes {
  readonly archetypes: Archetype[];
}

export default abstract class System implements ApplicableArchetypes {
  constructor(public readonly archetypes: Archetype[]) {}

  update(world: World, scene: Scene, time: number, delta: number) {
    throw new Error('Each system needs to implement the update method');
  }
}
