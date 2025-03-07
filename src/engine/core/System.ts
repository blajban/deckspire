import { ClassType } from '../util/ClassType';
import EcsManager from './EcsManager';
import PhaserContext from './PhaserContext';

export type SystemClass = ClassType<System>;

export default abstract class System {
  init(_ecs: EcsManager): void {}
  abstract update(
    ecs: EcsManager,
    phaser_context: PhaserContext,
    time: number,
    delta: number,
  ): void;
  terminate(_ecs: EcsManager): void {}
}
