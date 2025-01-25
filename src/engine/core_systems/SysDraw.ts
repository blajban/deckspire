import { Archetype } from '../core/ComponentStore';
import { Entity } from '../core/Entity';
import Scene from '../core/Scene';
import { SubSystem, SystemWithSubsystems } from '../core/System';
import World from '../core/World';
import CompDrawable from '../core_components/CompDrawable';
import { set_union } from '../util/set_utility_functions';

export abstract class DrawSubSystem extends SubSystem {
  public abstract update(
    world: World,
    scene: Scene,
    cache: GraphicsCacheObject,
    time: number,
    delta: number,
    entity: number,
  ): void;
}

export default class SysDraw extends SystemWithSubsystems<DrawSubSystem> {
  private graphics_cache = new GraphicsCache();

  constructor() {
    super([[CompDrawable]]);
  }

  public update(world: World, scene: Scene, time: number, delta: number) {
    this.sub_systems.forEach((sub_system) => {
      sub_system.all_matching_entities(world).forEach((entity) => {
        const drawable = world.getComponent(entity, CompDrawable)!;
        sub_system.update(
          world,
          scene,
          this.graphics_cache.get_component_cache(drawable),
          time,
          delta,
          entity,
        );
      });
    });
  }

  public cleanup(drawable: CompDrawable) {
    const component_cache = this.graphics_cache.get_component_cache(drawable);
    if (!component_cache) {
      return;
    }
    component_cache.graphics_object?.destroy();
    this.graphics_cache.delete_cache(drawable);
  }
}

export class GraphicsCacheObject {
  // This is a reference to the Phaser object that will be drawn by Phaser. Might need to add options for other classes in the future.
  public graphics_object: Phaser.GameObjects.Graphics | null = null;
}

export class GraphicsCache {
  private component_caches = new Map<CompDrawable, GraphicsCacheObject>();

  public get_component_cache(drawable: CompDrawable): GraphicsCacheObject {
    let cache = this.component_caches.get(drawable);
    if (!cache) {
      cache = new GraphicsCacheObject();
      this.component_caches.set(drawable, cache);
    }
    return cache;
  }

  public delete_cache(drawable: CompDrawable) {
    this.component_caches.delete(drawable);
  }

  public size(): number{
    return this.component_caches.size;
  }
}
