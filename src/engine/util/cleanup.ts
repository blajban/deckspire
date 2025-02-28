import AssetComponent from '../core/AssetComponent';
import Component, { ComponentClass } from '../core/Component';
import EcsManager from '../core/EcsManager';
import { Entity } from '../core/Entity';
import GraphicsCache from '../core/GraphicsCache';
import PhaserContext from '../core/PhaserContext';
import CompAnimatedSprite from '../core_components/CompAnimatedSprite';
import CompChild from '../core_components/CompChild';
import {
  CompDestroyMe,
  CompDestroyWithLastChild,
  CompDestroyWithParent,
} from '../core_components/CompDestroy';
import CompDrawable from '../core_components/CompDrawable';
import CompParent from '../core_components/CompParent';

/**
 * Since we are using Phaser the graphics objects need to be
 *  de-registered from Phaser as the componenet is removed.
 */
export function cleanupGraphicsCache(
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

export function cleanupAfterParent(
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

export function cleanupAfterChild(
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

export function cleanupAfterAssetComponent(
  ecs: EcsManager,
  phaser_context: PhaserContext,
  component: AssetComponent,
): void {
  ecs.asset_store.releaseAsset(phaser_context, component.asset_id);
}

export function cleanupAfterAnimatedSprite(
  ecs: EcsManager,
  phaser_context: PhaserContext,
  component: CompAnimatedSprite,
): void {
  component.states.getAssetIdsUsed().forEach((id) => {
    ecs.asset_store.releaseAsset(phaser_context, id);
  });
}

export function destroyComponent(
  ecs: EcsManager,
  phaser_context: PhaserContext,
  entity: Entity,
  component: Component,
): void {
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
  if (component instanceof CompAnimatedSprite) {
    cleanupAfterAnimatedSprite(
      ecs,
      phaser_context,
      component as CompAnimatedSprite,
    );
  }
  if (component instanceof AssetComponent) {
    cleanupAfterAssetComponent(
      ecs,
      phaser_context,
      component as AssetComponent,
    );
  }
  ecs.removeComponent(entity, component.constructor as ComponentClass);
}

export function destroyEntity(
  ecs: EcsManager,
  phaser_context: PhaserContext,
  entity: Entity,
): void {
  const components = ecs.getComponentsForEntity(entity);
  for (const component of components) {
    destroyComponent(ecs, phaser_context, entity, component);
  }
  ecs.removeEntity(entity);
}
