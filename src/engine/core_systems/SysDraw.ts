import { Archetype } from '../core/ComponentStore';
import Scene from '../core/Scene';
import System, { HasApplicableArchetypes } from '../core/System';
import World from '../core/World';
import CompDrawable from '../core_components/CompDrawable';

export abstract class DrawSubSystem implements HasApplicableArchetypes {
  constructor(public readonly archetypes: Archetype[]) {}

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
}

export default class SysDraw extends System {
  private sub_systems: Array<DrawSubSystem> = [];
  private graphics_cache = new GraphicsCache();

  constructor() {
    super([[CompDrawable]]);
  }

  public add_sub_system(sub_system: DrawSubSystem) {
    this.sub_systems.push(sub_system);
  }

  public update(world: World, scene: Scene, time: number, delta: number) {
    this.sub_systems.forEach((sub_system) => {
      sub_system.archetypes.forEach((archetype) => {
        world.getEntitiesWithArchetype(...archetype).forEach((entity) => {
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
