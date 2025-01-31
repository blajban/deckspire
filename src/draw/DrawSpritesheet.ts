import CompTransform from '../components/CompTransform';
import { Context } from '../engine/core/Engine';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompSprite from '../engine/core_components/CompSprite';
import CompSpritesheet from '../engine/core_components/CompSpritesheet';
import { DrawCacheObject, DrawSubSystem } from '../engine/core_systems/SysDraw';

export class DrawSpritesheet extends DrawSubSystem {
  constructor() {
    super([[CompDrawable, CompSpritesheet, CompTransform]]);
  }

   update(
    scene: Scene,
    context: Context,
    cache: DrawCacheObject,
    time: number,
    delta: number,
    entity: Entity,
  ): void {
    const drawable = scene.ecs.getComponent(entity, CompDrawable)!;
    const spritesheet = scene.ecs.getComponent(entity, CompSpritesheet);
    const transform = scene.ecs.getComponent(entity, CompTransform)!;

    const image_asset = context.assetStore!.getAsset(spritesheet?.asset_id!);

    if (!image_asset) {
      return;
    }

    if (!cache.draw_object) {
      cache.draw_object = context.phaserContext!.add.sprite(
        transform.position.x, 
        transform.position.y, 
        image_asset,
        spritesheet?.current_frame,
      );
    }

    const phaser_sprite = cache.get<Phaser.GameObjects.Sprite>()!;
    
    phaser_sprite.setFrame(spritesheet?.current_frame!);
    phaser_sprite.setDepth(drawable.depth);
    phaser_sprite.setPosition(transform.position.x, transform.position.y);
    phaser_sprite.setRotation(transform.rotation);
    phaser_sprite.setScale(transform.scale.x, transform.scale.y);
  }
}
