import Engine from '../core/Engine';
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
    engine: Engine,
    cache: GraphicsCacheObject,
    time: number,
    delta: number,
    entity: Entity,
  ): void;
}

/**
 * Owns and handles sub systems, that does the actual drawing.
 */
export default class SysDraw extends SystemWithSubsystems<DrawSubSystem> {
  private _graphics_cache = new GraphicsCache();

  constructor() {
    super([[CompDrawable]]);
  }

  public update(
    scene: Scene,
    engine: Engine,
    time: number,
    delta: number,
  ): void {
    this.sub_systems.forEach((sub_system) => {
      sub_system.allMatchingEntities(scene).forEach((entity) => {
        const drawable = scene.world.getComponent(entity, CompDrawable)!;
        sub_system.update(
          scene,
          engine,
          this._graphics_cache.getComponentCache(drawable),
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
    const component_cache = this._graphics_cache.getComponentCache(drawable);
    if (!component_cache) {
      return;
    }
    component_cache.graphics_object?.destroy();
    this._graphics_cache.deleteCache(drawable);
  }

  public cleanupAll(): void {
    this._graphics_cache.deleteAllCache();
  }
}

export class GraphicsCacheObject {
  /* This is a reference to the Phaser object that will be drawn by Phaser.
   * We might need to add options for other classes in the future. */
  public graphics_object: Phaser.GameObjects.Graphics | null = null;
}

export class GraphicsCache {
  private _component_caches = new Map<CompDrawable, GraphicsCacheObject>();

  public getComponentCache(drawable: CompDrawable): GraphicsCacheObject {
    let cache = this._component_caches.get(drawable);
    if (!cache) {
      cache = new GraphicsCacheObject();
      this._component_caches.set(drawable, cache);
    }
    return cache;
  }

  public deleteCache(drawable: CompDrawable): void {
    this._component_caches.delete(drawable);
  }

  public deleteAllCache(): void {
    this._component_caches.forEach((cache, drawable) => {
      if (cache?.graphics_object) {
        cache.graphics_object.destroy();
        cache.graphics_object = null;
      }
  
      this._component_caches.delete(drawable);
    })
  }

  public get size(): number {
    return this._component_caches.size;
  }
}
