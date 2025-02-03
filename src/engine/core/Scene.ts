import { Context } from './Engine';

export default abstract class Scene {
  buildScene(_context: Context): void {}
  destroyScene(_context: Context): void {}
}
