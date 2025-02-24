import Archetype from '../core/Archetype';
import AssetComponent from '../core/AssetComponent';
import { ComponentClass } from '../core/Component';
import EcsManager from '../core/EcsManager';
import { Entity } from '../core/Entity';
import GraphicsCache from '../core/GraphicsCache';
import PhaserContext from '../core/PhaserContext';
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
  private _archetype = new Archetype(CompDestroyMe);

  override update(
    ecs: EcsManager,
    phaser_context: PhaserContext,
    _time: number,
    _delta: number,
  ): void {
    ecs.getEntitiesWithArchetype(this._archetype).forEach((entity) => {
      destroyEntity(ecs, phaser_context, entity);
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

function cleanupAfterParent(
  ecs: EcsManager,
  phaser_context: PhaserContext,
  entity: Entity,
): void {
  const parent_comp = ecs.getComponent(entity, CompParent)!;
  for (const child of parent_comp.children) {
    const child_comp = ecs.getComponent(child, CompChild);
    if (child_comp && child_comp.parent === entity) {
      ecs.removeComponent(child, CompChild); // Orphan the child.
      if (ecs.getComponent(child, CompDestroyWithParent) !== undefined) {
        // Only destroy if not already queued for destruction.
        if (ecs.getComponent(child, CompDestroyMe) === undefined) {
          destroyEntity(ecs, phaser_context, child);
        }
      }
    }
  }
}

function cleanupAfterChild(
  ecs: EcsManager,
  phaser_context: PhaserContext,
  entity: Entity,
): void {
  const child_comp = ecs.getComponent(entity, CompChild)!;
  const parent = child_comp.parent;
  const parent_comp = ecs.getComponent(parent, CompParent);
  if (parent_comp) {
    parent_comp.children = parent_comp.children.filter((e) => e !== entity);
    if (parent_comp.children.length === 0) {
      if (ecs.getComponent(parent, CompDestroyWithLastChild) !== undefined) {
        // Only destroy if not already queued for destruction.
        if (ecs.getComponent(parent, CompDestroyMe) === undefined) {
          destroyEntity(ecs, phaser_context, parent);
        }
      }
    }
  }
}

function destroyEntity(
  ecs: EcsManager,
  phaser_context: PhaserContext,
  entity: Entity,
): void {
  // Remove all components
  const components = ecs.getComponentsForEntity(entity);
  for (const component of components) {
    // Handle children if entity is a parent.
    if (component instanceof CompParent) {
      cleanupAfterParent(ecs, phaser_context, entity);
    }
    // Handle parent if entity is a child.
    if (component instanceof CompChild) {
      cleanupAfterChild(ecs, phaser_context, entity);
    }
    // Handle graphics cache if entity is a drawable.
    if (component instanceof CompDrawable) {
      cleanupGraphicsCache(phaser_context.graphics_cache, component);
    }
    if (component instanceof AssetComponent && component.asset_id) {
      ecs.asset_store.releaseAsset(phaser_context, component.asset_id);
    }
    ecs.removeComponent(entity, component.constructor as ComponentClass);
  }
  ecs.removeEntity(entity);
}
