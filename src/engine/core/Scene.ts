import { GameContext } from './GameContext';

export default abstract class Scene {
  buildScene(_context: GameContext): void {}
  destroyScene(_context: GameContext): void {}
}
