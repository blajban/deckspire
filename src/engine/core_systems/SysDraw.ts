import { Context } from '../core/Engine';
import { Entity } from '../core/Entity';
import Scene from '../core/Scene';
import { SubSystem, SystemWithSubsystems } from '../core/System';
import CompDrawable from '../core_components/CompDrawable';

/**
 * Specialised class for drawing specific objects.
 */
export abstract class DrawSubSystem extends SubSystem {
  public abstract update(
    scene: Scene,
    context: Context,
    cache: DrawCacheObject,
    time: number,
    delta: number,
    entity: Entity,
  ): void;
}

/**
 * Owns and handles sub systems, that does the actual drawing.
 */
export default class SysDraw extends SystemWithSubsystems<DrawSubSystem> {
  private _draw_cache = new DrawCache();

  constructor() {
    super([[CompDrawable]]);
  }

  public update(
    scene: Scene,
    context: Context,
    time: number,
    delta: number,
  ): void {
    this.sub_systems.forEach((sub_system) => {
      sub_system.allMatchingEntities(scene).forEach((entity) => {
        const drawable = scene.ecs.getComponent(entity, CompDrawable)!;
        sub_system.update(
          scene,
          context,
          this._draw_cache.getComponentCache(drawable),
          time,
          delta,
          entity,
        );
      });
    });
  }

  /**
   * Since we are using Phaser the graphics objects need to be
   *  de-registered from Phaser as the componenet is removed.
   */
  public cleanup(drawable: CompDrawable): void {
    const component_cache = this._draw_cache.getComponentCache(drawable);
    if (!component_cache) {
      return;
    }
    component_cache.draw_object?.destroy();
    this._draw_cache.deleteCache(drawable);
  }

  public cleanupAll(): void {
    this._draw_cache.deleteAllCache();
  }
}

export class DrawCacheObject {
  /* This is a reference to the Phaser object that will be drawn by Phaser.
   * We might need to add options for other classes in the future. */
  public draw_object: Phaser.GameObjects.GameObject | null = null;

  public get<T extends Phaser.GameObjects.GameObject>(): T | null {
    return this.draw_object as T | null;
  }
}


export class DrawCache {
  private _component_caches = new Map<CompDrawable, DrawCacheObject>();

  public getComponentCache(drawable: CompDrawable): DrawCacheObject {
    let cache = this._component_caches.get(drawable);
    if (!cache) {
      cache = new DrawCacheObject();
      this._component_caches.set(drawable, cache);
    }
    return cache;
  }

  public deleteCache(drawable: CompDrawable): void {
    this._component_caches.delete(drawable);
  }

  public deleteAllCache(): void {
    this._component_caches.forEach((cache, drawable) => {
      if (cache?.draw_object) {
        cache.draw_object.destroy();
        cache.draw_object = null;
      }

      this._component_caches.delete(drawable);
    });
  }

  public get size(): number {
    return this._component_caches.size;
  }
}
