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
      throw new Error(`Cannot start scene ${key}, it is not registered.`);
    }

    if (this._active_scenes.has(key)) {
      throw new Error(`Scene ${key} is already active.`);
    }

    scene.onStart();
    this._active_scenes.set(key, scene);
  }

  stopScene(key: string): void {
    const scene = this._active_scenes.get(key);
    if (!scene) {
      throw new Error(`Scene ${key} is not active.`);
    }

    scene.onExit();
    const draw_system = scene.ecs.getDrawSystem();
    if (draw_system) {
      draw_system.cleanupAll();
    }
    this._active_scenes.delete(key);
  }

  pauseScene(key: string): void {
    const scene = this._active_scenes.get(key);
    if (!scene) {
      throw new Error(`Scene ${key} is not active and cannot be paused.`);
    }

    scene.onPause();
    const draw_system = scene.ecs.getDrawSystem();
    if (draw_system) {
      draw_system.cleanupAll();
    }
    this._active_scenes.delete(key);
  }

  resumeScene(key: string): void {
    const scene = this._registered_scenes.get(key);
    if (!scene) {
      throw new Error(`Cannot resume scene ${key}, it is not registered.`);
    }

    if (this._active_scenes.has(key)) {
      throw new Error(`Scene ${key} is already active.`);
    }

    scene.onResume();
    this._active_scenes.set(key, scene);
  }

  updateActiveScenes(time: number, delta: number): void {
    this._active_scenes.forEach((scene) => {
      scene.onUpdate(time, delta);
    });
  }
}
