import CompTransform from '../components/CompTransform';
import { Context } from '../engine/core/Engine';
import { Entity } from '../engine/core/Entity';
import Scene from '../engine/core/Scene';
import CompDrawable from '../engine/core_components/CompDrawable';
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

    if (!cache.draw_object) {
      cache.draw_object = context.phaserContext!.add.sprite(
        transform.position.x,
        transform.position.y,
        image_asset!,
        current_state.start_frame,
      );
    }

    const phaser_sprite = cache.get<Phaser.GameObjects.Sprite>()!;

    phaser_sprite.setDepth(drawable.depth);
    phaser_sprite.setPosition(transform.position.x, transform.position.y);
    phaser_sprite.setRotation(transform.rotation);
    phaser_sprite.setScale(transform.scale.x, transform.scale.y);

    if (!current_state.playing) return;

    if (!context.phaserContext!.anims.exists(current_state!.key)) {
      context.phaserContext!.anims.create({
        key: current_state?.key,
        frames: phaser_sprite.anims.generateFrameNumbers(context.assetStore!.getAsset(current_state!.asset_id!), {
          start: current_state.start_frame,
          end: current_state.start_frame + current_state.num_frames - 1,
        }),
        frameRate: current_state.frame_rate,
        repeat: current_state!.loop ? -1 : 0,
      });
    }

    if (!phaser_sprite.anims.isPlaying || phaser_sprite.anims.currentAnim?.key !== current_state?.key) {
      phaser_sprite.play(current_state!.key);
    }

    if (!current_state.loop) {
      phaser_sprite.once('animationcomplete', (anim: Phaser.Animations.Animation) => {
        if (anim.key === current_state.key) {
          current_state.playing = false;
        }
      });
    }

  }
}
