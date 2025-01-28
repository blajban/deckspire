import Phaser from 'phaser';
import Scene from './Scene';
import SceneManager from './SceneManager';

export default class Engine extends Phaser.Scene {
  private _width: number;
  private _height: number;
  private _phaser_context: Phaser.Game;
  private _registered_scenes: Map<string, Scene> = new Map();
  private _active_scenes: Map<string, Scene> = new Map();
  private _ready_resolver: (() => void) | null = null;
  private _ready_promise: Promise<void>;

  private _scene_manager: SceneManager = new SceneManager(this);

  // [OK] Make sure the phaser scene is ready before doing things in the Scene
  // Assets
  // Systems
  // Global objects
  // [OK] Scene transitions/fade in/fade out (handled manually for now)
  // - Stop scene
  // - Pause scene
  // [OK] Add scene manager
  // [OK] Pass scene instead of world to systems
  // Serialization
  // Testing
  // Comments
  // Remove scene entirely?

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

  getSceneManager(): SceneManager {
    return this._scene_manager;
  }

  preload(): void {
    console.log('Engine preload() running');
  }

  create(): void {
    console.log('Engine create() running');

    if (this._ready_resolver) {
      this._ready_resolver();
    }
  }

  update(time: number, delta: number): void {
    this._scene_manager.updateActiveScenes(time, delta);
  }
}
