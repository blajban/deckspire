import EcsManager from './EcsManager';
import PhaserContext from './PhaserContext';

export default abstract class Scene {
  private _preload_promise: Promise<void[]> = Promise.resolve([]);
  public preload(
    _ecs: EcsManager,
    _phaser_context: PhaserContext,
  ): Promise<void> {
    return Promise.resolve();
  }
  async makePreloadPromise(promise: Promise<void[]>): Promise<void> {
    this._preload_promise = promise;
    return Promise.resolve();
  }
  public readyPreload(): Promise<void[]> {
    return this._preload_promise!;
  }
  abstract load(ecs: EcsManager, phaser_context: PhaserContext): Promise<void>;
  abstract unload(ecs: EcsManager, phaser_context: PhaserContext): void;
}
