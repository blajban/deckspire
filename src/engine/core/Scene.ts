import EcsManager from './EcsManager';

export default abstract class Scene {
  private _preload_promise: Promise<void[]> = Promise.resolve([]);
  public preload(_ecs: EcsManager): Promise<void> {
    return Promise.resolve();
  }
  async makePreloadPromise(promise: Promise<void[]>): Promise<void> {
    this._preload_promise = promise;
    return Promise.resolve();
  }
  public readyPreload(): Promise<void[]> {
    return this._preload_promise!;
  }
  abstract load(ecs: EcsManager): Promise<void>;
  abstract unload(ecs: EcsManager): void;
}
