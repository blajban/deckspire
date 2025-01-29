import Phaser from 'phaser';
import SceneManager from './SceneManager';

export default class Engine {
  private _width: number;
  private _height: number;
  private _phaser_scene: Phaser.Scene;
  private _phaser_context: Phaser.Game;
  private _ready_resolver: (() => void) | null = null;
  private _ready_promise: Promise<void>;

  private _scene_manager: SceneManager = new SceneManager(this);

  constructor(width: number, height: number) {
    this._phaser_scene = new Phaser.Scene('Engine');
    this._width = width;
    this._height = height;

    this._ready_promise = new Promise((resolve) => {
      this._ready_resolver = resolve;
    });

    this._phaser_context = new Phaser.Game({
      type: Phaser.AUTO,
      width: this._width,
      height: this._height,
      scene: [this._phaser_scene],
      banner: false, // Clutters test outputs
    });
  }

  get active_pointer(): Phaser.Input.Pointer {
    return this._phaser_scene.input.activePointer;
  }

  ready(): Promise<void> {
    return this._ready_promise;
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
