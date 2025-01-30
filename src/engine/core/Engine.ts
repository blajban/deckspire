import Phaser from 'phaser';
import SceneManager from './SceneManager';

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

  constructor(width: number, height: number) {
    this._phaser_scene = new PhaserContext((time, delta) =>
      this.update(time, delta),
    );
    this._scene_manager = new SceneManager(this._phaser_scene);
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

  getSceneManager(): SceneManager {
    return this._scene_manager;
  }

  update(time: number, delta: number): void {
    this._scene_manager.updateActiveScenes(time, delta);
  }
}
