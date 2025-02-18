import CompTransform from '../engine/core_components/CompTransform';
import { Archetype } from '../engine/core/ComponentStore';
import EcsManager from '../engine/core/EcsManager';
import System from '../engine/core/System';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompSprite from '../engine/core_components/CompSprite';

export class SysDrawSprite extends System {
  constructor() {
    super(new Archetype(CompDrawable, CompSprite, CompTransform));
  }

  update(ecs: EcsManager, _time: number, _delta: number): void {
    ecs.getEntitiesWithArchetype(this.archetypes[0]).forEach((entity) => {
      const drawable = ecs.getComponent(entity, CompDrawable)!;
      const sprite = ecs.getComponent(entity, CompSprite)!;
      const transform = ecs.getComponent(entity, CompTransform)!;

      const image_asset = ecs.asset_store.getAsset(sprite.asset_id);

      const cache = ecs.graphics_cache.getComponentCache(drawable);
      if (!cache.graphics_object) {
        cache.graphics_object = ecs.phaser_scene.add.sprite(
          transform.position.x,
          transform.position.y,
          image_asset,
        );
      }
      const phaser_sprite = cache.graphics_object as Phaser.GameObjects.Sprite;

      phaser_sprite.setDepth(drawable.depth);
      phaser_sprite.setPosition(transform.position.x, transform.position.y);
      phaser_sprite.setRotation(transform.rotation);
      phaser_sprite.setScale(transform.scale.x, transform.scale.y);
    });
  }
}
