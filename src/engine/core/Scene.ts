import EcsManager from './EcsManager';

export default abstract class Scene {
  private _preload_promise: Promise<void[]> = Promise.resolve([]);
  public preloadScene(_ecs: EcsManager): Promise<void> {
    return Promise.resolve();
  }
  async makePreloadPromise(promise: Promise<void[]>): Promise<void> {
    this._preload_promise = promise;
    return Promise.resolve();
  }
  public readyPreload(): Promise<void[]> {
    return this._preload_promise!;
  }
  abstract loadScene(ecs: EcsManager): Promise<void>;
  abstract unloadScene(ecs: EcsManager): void;
}
