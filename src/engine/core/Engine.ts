import Phaser from 'phaser';
import SceneManager from './SceneManager';
import AssetStore from './AssetStore';

export default class Engine extends Phaser.Scene {
  private _width: number;
  private _height: number;
  private _phaser_context: Phaser.Game;
  private _ready_resolver: (() => void) | null = null;
  private _ready_promise: Promise<void>;

  private _asset_store: AssetStore = new AssetStore(this);
  private _scene_manager: SceneManager = new SceneManager(this);

  constructor(width: number, height: number) {
    super('Engine');
    this._width = width;
    this._height = height;

    this._ready_promise = new Promise((resolve) => {
      this._ready_resolver = resolve;
    });

    this._phaser_context = new Phaser.Game({
      type: Phaser.AUTO,
      width: this._width,
      height: this._height,
      scene: [this],
    });
  }

  ready(): Promise<void> {
    return this._ready_promise;
  }

  getAssetStore(): AssetStore {
    return this._asset_store;
  }

  getSceneManager(): SceneManager {
    return this._scene_manager;
  }

  preload(): void {}

  create(): void {
    if (this._ready_resolver) {
      this._ready_resolver();
    }
  }

  update(time: number, delta: number): void {
    this._scene_manager.updateActiveScenes(time, delta);
  }
}
