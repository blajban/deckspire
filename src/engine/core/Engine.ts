import Phaser from 'phaser';
import SceneManager from './SceneManager';
import AssetStore from './AssetStore';

export interface Context {
  phaser_context?: PhaserContext;
  asset_store?: AssetStore;
  scene_manager?: SceneManager;
}

export class PhaserContext extends Phaser.Scene {
  private _ready_promise: Promise<void>;
  private _ready_resolver: (() => void) | null = null;

  constructor(private _on_update: (time: number, delta: number) => void) {
    super('Engine');
    this._ready_promise = new Promise((resolve) => {
      this._ready_resolver = resolve;
    });
  }

  public create(): void {
    if (this._ready_resolver) {
      this._ready_resolver();
    }
  }

  public ready(): Promise<void> {
    return this._ready_promise;
  }

  public update(time: number, delta: number): void {
    this._on_update(time, delta);
  }
}

export default class Engine {
  private _width: number;
  private _height: number;
  private _phaser_scene: PhaserContext;
  private _phaser_game: Phaser.Game;
  private _scene_manager: SceneManager;
  private _asset_store: AssetStore;

  private _context: Context;

  constructor(width: number, height: number) {
    this._phaser_scene = new PhaserContext((time, delta) =>
      this.update(time, delta),
    );

    this._context = {
      phaser_context: this._phaser_scene,
    };

    this._scene_manager = new SceneManager(this._context);
    this._context.scene_manager = this._scene_manager;

    this._asset_store = new AssetStore(this._context);
    this._context.asset_store = this._asset_store;
    
    
    this._width = width;
    this._height = height;

    this._phaser_game = new Phaser.Game({
      type: Phaser.AUTO,
      width: this._width,
      height: this._height,
      scene: [this._phaser_scene],
      banner: false, // Clutters test outputs
    });

    
  }

  ready(): Promise<void> {
    return this._phaser_scene.ready();
  }

  getContext(): Context {
    return this._context;
  }

  /* getAssetStore(): AssetStore {
    return this._asset_store;
  }

  getSceneManager(): SceneManager {
    return this._scene_manager;
  }

  getPhaserContext(): PhaserContext {
    return this._phaser_scene;
  } */

  update(time: number, delta: number): void {
    this._scene_manager.updateActiveScenes(time, delta);
  }
}
