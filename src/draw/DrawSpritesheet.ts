import CompTransform from '../components/CompTransform';
import { Context } from '../engine/core/Engine';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import CompDrawable from '../engine/core_components/CompDrawable';
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

    let image_asset;
    if (spritesheet?.animate !== null) {
      image_asset = context.assetStore!.getAsset(spritesheet!.animate.current_state.asset_id!);
    } else {
      image_asset = context.assetStore!.getAsset(spritesheet!.asset_id!);
    }

    if (!cache.draw_object) {
      cache.draw_object = context.phaserContext!.add.sprite(
        transform.position.x,
        transform.position.y,
        image_asset!,
        spritesheet?.current_frame,
      );
    }

    const phaser_sprite = cache.get<Phaser.GameObjects.Sprite>()!;

    if (spritesheet?.animate !== null) {
      const current_state = spritesheet!.animate.current_state;

      if (!current_state.playing) return;

      if (!context.phaserContext!.anims.exists(current_state!.anim_key)) {
        context.phaserContext!.anims.create({
          key: current_state?.anim_key,
          frames: phaser_sprite.anims.generateFrameNumbers(context.assetStore!.getAsset(current_state!.asset_id), {
            start: current_state?.start_frame,
            end: current_state!.start_frame + current_state!.num_frames - 1,
          }),
          frameRate: current_state!.frame_rate,
          repeat: current_state!.loop ? -1 : 0,
        });
      }
  
      if (!phaser_sprite.anims.isPlaying || phaser_sprite.anims.currentAnim?.key !== current_state?.anim_key) {
        phaser_sprite.play(current_state!.anim_key);
      }

      if (!current_state.loop) {
        phaser_sprite.once('animationcomplete', (anim: Phaser.Animations.Animation) => {
          if (anim.key === current_state.anim_key) {
            current_state.playing = false;
          }
        });
      }
  
    } else {
      phaser_sprite.setFrame(spritesheet!.current_frame);
    }
    
    phaser_sprite.setDepth(drawable.depth);
    phaser_sprite.setPosition(transform.position.x, transform.position.y);
    phaser_sprite.setRotation(transform.rotation);
    phaser_sprite.setScale(transform.scale.x, transform.scale.y);
  }
}
