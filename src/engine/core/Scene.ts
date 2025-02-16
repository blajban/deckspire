import { GameContext } from './GameContext';

export default abstract class Scene {
  abstract buildScene(context: GameContext): void;
  abstract destroyScene(context: GameContext): void;
}
