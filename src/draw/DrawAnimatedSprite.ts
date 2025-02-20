import CompTransform from '../components/CompTransform';
import { AnimConfigSpritesheet } from '../engine/core/Animations';
import { Context } from '../engine/core/Engine';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompSpritesheet from '../engine/core_components/CompAnimatedSprite';
import { DrawCacheObject, DrawSubSystem } from '../engine/core_systems/SysDraw';
import CompAnimatedSprite from '../engine/core_components/CompAnimatedSprite';

export class DrawAnimatedSprite extends DrawSubSystem {
  constructor() {
    super([[CompDrawable, CompAnimatedSprite, CompTransform]]);
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
    const sprite = scene.ecs.getComponent(entity, CompAnimatedSprite);
    const transform = scene.ecs.getComponent(entity, CompTransform)!;

    const image_asset = context.assetStore!.getAsset(sprite!.states.current_state.asset_id!);

    const current_state = sprite!.states.current_state;
    const config = current_state.config as AnimConfigSpritesheet;

    if (!cache.draw_object) {
      cache.draw_object = context.phaserContext!.add.sprite(
        transform.position.x,
        transform.position.y,
        image_asset!,
        config.start_frame,
      );
    }

    const phaser_sprite = cache.get<Phaser.GameObjects.Sprite>()!;

    phaser_sprite.setDepth(drawable.depth);
    phaser_sprite.setPosition(transform.position.x, transform.position.y);
    phaser_sprite.setRotation(transform.rotation);
    phaser_sprite.setScale(transform.scale.x, transform.scale.y);

    if (!current_state.playing) return;

    if (!context.phaserContext!.anims.exists(current_state!.anim_key)) {
      context.phaserContext!.anims.create({
        key: current_state?.anim_key,
        frames: phaser_sprite.anims.generateFrameNumbers(context.assetStore!.getAsset(current_state!.asset_id!), {
          start: config.start_frame,
          end: config.start_frame + config.num_frames - 1,
        }),
        frameRate: config.frame_rate,
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

  }
}
