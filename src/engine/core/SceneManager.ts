import { CompDestroyWithScene } from '../core_components/CompDestroy';
import EcsManager from './EcsManager';
import Scene from './Scene';

export default class SceneManager {
  private _registered_scenes = new Map<string, Scene>();
  private _loaded_scenes = new Set<string>();
  private _preloaded_scenes = new Set<string>();

  constructor() {}

  registerScene(key: string, scene: Scene): void {
    if (!this._registered_scenes.has(key)) {
      this._registered_scenes.set(key, scene);
    } else {
      throw new Error(`Key: ${key} is already in use by another scene.`);
    }
  }

  async preloadScene(ecs: EcsManager, key: string): Promise<void> {
    const scene = this._registered_scenes.get(key);
    if (!scene) {
      throw new Error(`Cannot load scene ${key}, it is not registered.`);
    }

    if (this._preloaded_scenes.has(key)) {
      throw new Error(`Scene ${key} has already been preloaded.`);
    }

    await scene.preload(ecs);
  }

  loadScene(ecs: EcsManager, key: string): void {
    const scene = this._registered_scenes.get(key);
    if (!scene) {
      throw new Error(`Cannot load scene ${key}, it is not registered.`);
    }

    if (this._loaded_scenes.has(key)) {
      throw new Error(`Scene ${key} is already loaded.`);
    }

    scene.load(ecs);
    this._loaded_scenes.add(key);
  }

  unloadScene(ecs: EcsManager, key: string): void {
    if (!this._loaded_scenes.has(key)) {
      throw new Error(`Scene ${key} is not loaded.`);
    }
    const scene = this._registered_scenes.get(key)!;
    scene.unload(ecs);

    ecs
      .getEntitiesAndComponents(CompDestroyWithScene)
      .forEach((component, entity) => {
        if (component.scene === scene) {
          ecs.removeEntity(entity);
        }
      });
    this._loaded_scenes.delete(key);
  }
}
