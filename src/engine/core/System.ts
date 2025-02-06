import { ClassType } from '../util/ClassType';
import { Archetype } from './ComponentStore';
import { GameContext } from './GameContext';

export type SystemClass = ClassType<System>;

export default abstract class System {
  public readonly archetypes: Archetype[];
  constructor(...archetypes: Archetype[]) {
    this.archetypes = archetypes;
  }
  abstract update(context: GameContext, time: number, delta: number): void;
}
