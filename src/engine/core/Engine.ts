import Phaser from 'phaser';
import Scene from './Scene';

export default class Engine extends Phaser.Scene {
  private _width: number;
  private _height: number;
  private _phaser_context: Phaser.Game;
  private _registered_scenes: Map<string, Scene> = new Map();
  private _active_scenes: Map<string, Scene> = new Map();
  private _readyResolver: (() => void) | null = null;
  private _readyPromise: Promise<void>;

  // Make sure the phaser scene is ready before doing things in the Scene
  // Assets
  // Systems
  // Global objects
  // Scene transitions/fade in/fade out (handled manually for now)
  // Serialization
  // Testing
  // Comments
  // Remove scene entirely?

  constructor(width: number, height: number) {
    super('Engine');
    this._width = width;
    this._height = height;

    this._readyPromise = new Promise((resolve) => {
      this._readyResolver = resolve;
    });
    
    this._phaser_context = new Phaser.Game({
      type: Phaser.AUTO,
      width: this._width,
      height: this._height,
      scene: [this],
    });
  }

  ready(): Promise<void> {
    return this._readyPromise;
  }

  register_scene(key: string, scene: Scene) {
    if (!this._registered_scenes.has(key)) {
      scene.initialize(this);
      scene.on_register();
      this._registered_scenes.set(key, scene);
    }
  }

  start_scene(key: string) {
    const scene = this._registered_scenes.get(key);
    if (scene) {
      scene.on_start();
      this._active_scenes.set(key, scene);
    }
  }

  stop_scene(key: string) {
    const scene = this._active_scenes.get(key);
    if (scene) {
      scene.on_exit();
      this._active_scenes.delete(key);
    }
  }

  preload() {
    console.log('Engine preload() running');
  }

  create() {
    console.log('Engine create() running');

    if (this._readyResolver) {
      this._readyResolver();
    }
  }

  update(time: number, delta: number) {
    this._active_scenes.forEach((scene) => {
      scene.on_update(time, delta);
    })
  }



}