import Engine from './Engine';
import Scene from './Scene';

export default class SceneManager {
  private _registered_scenes: Map<string, Scene> = new Map();
  private _active_scenes: Map<string, Scene> = new Map();
  private _engine: Engine;

  constructor(engine: Engine) {
    this._engine = engine;
  }

  registerScene(key: string, scene: Scene): void {
    if (!this._registered_scenes.has(key)) {
      scene.initialize(this._engine);
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

  updateActiveScenes(time: number, delta: number): void {
    this._active_scenes.forEach((scene) => {
      scene.onUpdate(time, delta);
    });
  }
}
