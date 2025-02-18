import AssetComponent from '../core/AssetComponent';
import { ComponentClass } from '../core/Component';
import { Archetype } from '../core/ComponentStore';
import EcsManager from '../core/EcsManager';
import { Entity } from '../core/Entity';
import GraphicsCache from '../core/GraphicsCache';
import System from '../core/System';
import CompChild from '../core_components/CompChild';
import {
  CompDestroyMe,
  CompDestroyWithLastChild,
  CompDestroyWithParent,
} from '../core_components/CompDestroy';
import CompDrawable from '../core_components/CompDrawable';
import CompParent from '../core_components/CompParent';

export default class SysDestroyEntity extends System {
  constructor() {
    super(new Archetype(CompDestroyMe));
  }

  override update(ecs: EcsManager, _time: number, _delta: number): void {
    ecs.getEntitiesWithArchetype(this.archetypes[0]).forEach((entity) => {
      destroyEntity(ecs, entity);
    });
  }
}

/**
 * Since we are using Phaser the graphics objects need to be
 *  de-registered from Phaser as the componenet is removed.
 */
function cleanupGraphicsCache(
  graphics_cache: GraphicsCache,
  drawable: CompDrawable,
): void {
  const component_cache = graphics_cache.getComponentCache(drawable);
  if (!component_cache) {
    return;
  }
  component_cache.graphics_object?.destroy();
  graphics_cache.deleteCache(drawable);
}

function cleanupAfterParent(ecs: EcsManager, entity: Entity): void {
  const parent_comp = ecs.getComponent(entity, CompParent)!;
  for (const child of parent_comp.children) {
    const child_comp = ecs.getComponent(child, CompChild);
    if (child_comp && child_comp.parent === entity) {
      ecs.removeComponent(child, CompChild); // Orphan the child.
      if (ecs.getComponent(child, CompDestroyWithParent) !== undefined) {
        // Only destroy if not already queued for destruction.
        if (ecs.getComponent(child, CompDestroyMe) === undefined) {
          destroyEntity(ecs, child);
        }
      }
    }
  }
}

function cleanupAfterChild(ecs: EcsManager, entity: Entity): void {
  const child_comp = ecs.getComponent(entity, CompChild)!;
  const parent = child_comp.parent;
  const parent_comp = ecs.getComponent(parent, CompParent);
  if (parent_comp) {
    parent_comp.children = parent_comp.children.filter((e) => e !== entity);
    if (parent_comp.children.length === 0) {
      if (ecs.getComponent(parent, CompDestroyWithLastChild) !== undefined) {
        // Only destroy if not already queued for destruction.
        if (ecs.getComponent(parent, CompDestroyMe) === undefined) {
          destroyEntity(ecs, parent);
        }
      }
    }
  }
}

function destroyEntity(ecs: EcsManager, entity: Entity): void {
  // Remove all components
  const components = ecs.getComponentsForEntity(entity);
  for (const component of components) {
    // Handle children if entity is a parent.
    if (component instanceof CompParent) {
      cleanupAfterParent(ecs, entity);
    }
    // Handle parent if entity is a child.
    if (component instanceof CompChild) {
      cleanupAfterChild(ecs, entity);
    }
    // Handle graphics cache if entity is a drawable.
    if (component instanceof CompDrawable) {
      cleanupGraphicsCache(ecs.graphics_cache, component);
    }
    if (component instanceof AssetComponent) {
      ecs.asset_store.releaseAsset(ecs.phaser_scene, component.asset_id);
    }
    ecs.removeComponent(entity, component.constructor as ComponentClass);
  }
  ecs.removeEntity(entity);
}
