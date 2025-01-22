import { World } from './World';

export abstract class System {
  update(world: World, time: number, delta: number) {
    throw new Error('Each system needs to implement the update method');
  }
}
