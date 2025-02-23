import CompTransform from '../engine/core_components/CompTransform';
import EcsManager from '../engine/core/EcsManager';
import System from '../engine/core/System';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompSpritesheet from '../engine/core_components/CompSpritesheet';
import PhaserContext from '../engine/core/PhaserContext';
import Archetype from '../engine/core/Archetype';

export class SysDrawSpritesheet extends System {
  private _archetype = new Archetype(
    CompDrawable,
    CompSpritesheet,
    CompTransform,
  );

  update(
    ecs: EcsManager,
    phaser_context: PhaserContext,
    _time: number,
    _delta: number,
  ): void {
    ecs
      .getComponentsForEntitiesWithArchetype(this._archetype)
      .forEach(([drawable, spritesheet, transform], _entity) => {
        const image_asset = ecs.asset_store.getAsset(spritesheet.asset_id);

        const cache = phaser_context.graphics_cache.getComponentCache(drawable);
        if (!cache.graphics_object) {
          cache.graphics_object = phaser_context.phaser_scene.add.sprite(
            transform.position.x,
            transform.position.y,
            image_asset,
            spritesheet.current_frame,
          );
        }

        const phaser_sprite =
          cache.graphics_object as Phaser.GameObjects.Sprite;

        phaser_sprite.setFrame(spritesheet.current_frame);
        phaser_sprite.setDepth(drawable.depth);
        phaser_sprite.setPosition(transform.position.x, transform.position.y);
        phaser_sprite.setRotation(transform.rotation);
        phaser_sprite.setScale(transform.scale.x, transform.scale.y);
      });
  }
}
