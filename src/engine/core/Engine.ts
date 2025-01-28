import Phaser from 'phaser';
import Scene from './Scene';

export default class Engine extends Phaser.Scene {
  private _width: number;
  private _height: number;
  private _phaser_context: Phaser.Game;
  private _registered_scenes: Map<string, Scene> = new Map();
  private _active_scenes: Map<string, Scene> = new Map();
  private _ready_resolver: (() => void) | null = null;
  private _ready_promise: Promise<void>;

  // [OK] Make sure the phaser scene is ready before doing things in the Scene
  // Assets
  // Systems
  // Global objects
  // Scene transitions/fade in/fade out (handled manually for now)
  // - Stop scene
  // - Pause scene
  // Add scene managager
  // Pass scene instead of world to systems
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

  registerScene(key: string, scene: Scene): void {
    if (!this._registered_scenes.has(key)) {
      scene.initialize(this);
      scene.onRegister();
      this._registered_scenes.set(key, scene);
    }
  }

  startScene(key: string): void {
    const scene = this._registered_scenes.get(key);
    if (!scene) {
      throw new Error(`Cannot start scene ${key}, it's not registered.`);
    }

    if (this._active_scenes.has(key)) {
      console.warn(`Scene ${key} is already active.`);
      return;
    }

    console.log(`Starting scene: ${key}`);
    scene.onStart();
    this._active_scenes.set(key, scene);
  }

  stopScene(key: string): void {
    const scene = this._active_scenes.get(key);
    if (!scene) {
      throw new Error(`Scene ${key} is not active.`);
    }

    console.log(`Stopping scene: ${key}`);
    scene.onExit();
    const drawSystem = scene.world.getDrawSystem();
    if (drawSystem) {
      drawSystem.cleanupAll();
    }
    this._active_scenes.delete(key);
  }

  pauseScene(key: string): void {
    const scene = this._active_scenes.get(key);
    if (!scene) {
      throw new Error(`Scene ${key} is not active and cannot be paused.`);
    }

    console.log(`Pausing scene: ${key}`);
    scene.onPause();
    const drawSystem = scene.world.getDrawSystem();
    if (drawSystem) {
      drawSystem.cleanupAll();
    }
    this._active_scenes.delete(key);
  }

  resumeScene(key: string): void {
    const scene = this._registered_scenes.get(key);
    if (!scene) {
      throw new Error(`Cannot resume scene ${key}, it's not registered.`);
    }

    if (this._active_scenes.has(key)) {
      throw new Error(`Scene ${key} is already active.`);
    }

    console.log(`Resuming scene: ${key}`);
    scene.onResume();
    this._active_scenes.set(key, scene);
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
    this._active_scenes.forEach((scene) => {
      scene.onUpdate(time, delta);
    });
  }
}
