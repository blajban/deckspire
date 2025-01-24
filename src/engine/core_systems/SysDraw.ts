import Component, { ComponentID } from '../core/Component';
import Scene from '../core/Scene';
import System from '../core/System';
import World from '../core/World';
import CompDrawable from '../core_components/CompDrawable';

export abstract class DrawSubSystem {
  constructor(private archetype: ComponentID<Component>[]) {}

  update(
    world: World,
    scene: Scene,
    cache: GraphicsCacheObject,
    time: number,
    delta: number,
    entity: number,
  ) {
    throw new Error('Update method not implemented in DrawSubSystem.');
  }
  public applicable_archetype(): ComponentID<Component>[] {
    return this.archetype;
  }
}

export default class SysDraw extends System {
  private sub_systems: Array<DrawSubSystem> = [];
  private graphics_cache = new GraphicsCache();

  constructor(private scene: Scene) {
    super();
  }

  public add_sub_system(sub_system: DrawSubSystem) {
    this.sub_systems.push(sub_system);
  }

  public update(world: World, time: number, delta: number) {
    this.sub_systems.forEach((sub_system) => {
      world
        .getEntitiesWithArchetype(...sub_system.applicable_archetype())
        .forEach((entity) => {
          const drawable = world.getComponent(entity, CompDrawable)!;
          sub_system.update(
            world,
            this.scene,
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
}
