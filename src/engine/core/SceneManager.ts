import { CompDestroyWithScene } from '../core_components/CompDestroy';
import { Context } from './Engine';
import Scene from './Scene';

export default class SceneManager {
  private _registered_scenes: Map<string, Scene> = new Map();
  private _built_scenes: Map<string, Scene> = new Map();

  constructor() {}

  registerScene(key: string, scene: Scene): void {
    if (!this._registered_scenes.has(key)) {
      this._registered_scenes.set(key, scene);
    } else {
      throw new Error(`Key: ${key} is already in use by another scene.`);
    }
  }

  buildScene(context: Context, key: string): void {
    const scene = this._registered_scenes.get(key);
    if (!scene) {
      throw new Error(`Cannot build scene ${key}, it is not registered.`);
    }

    if (this._built_scenes.has(key)) {
      throw new Error(`Scene ${key} has already been built.`);
    }

    scene.buildScene(context);
    this._built_scenes.set(key, scene);
  }

  destroyScene(context: Context, key: string): void {
    const scene = this._built_scenes.get(key);
    if (!scene) {
      throw new Error(`Scene ${key} has not been built.`);
    }

    scene.destroyScene(context);

    context.ecs_manager
      .getEntitiesAndComponents(CompDestroyWithScene)
      .forEach((component, entity) => {
        if (component.scene === scene) {
          context.ecs_manager.removeEntity(entity);
        }
      });
    this._built_scenes.delete(key);
  }
}
