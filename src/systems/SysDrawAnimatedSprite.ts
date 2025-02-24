import CompTransform from '../engine/core_components/CompTransform';
import EcsManager from '../engine/core/EcsManager';
import System from '../engine/core/System';
import CompDrawable from '../engine/core_components/CompDrawable';
import CompSprite from '../engine/core_components/CompSprite';
import PhaserContext from '../engine/core/PhaserContext';
import Archetype from '../engine/core/Archetype';
import CompAnimatedSprite from '../engine/core_components/CompAnimatedSprite';

export class SysDrawAnimatedSprite extends System {
  private _archetype = new Archetype(CompDrawable, CompAnimatedSprite, CompTransform);

  update(
    ecs: EcsManager,
    phaser_context: PhaserContext,
    _time: number,
    _delta: number,
  ): void {
    ecs
      .getComponentsForEntitiesWithArchetype(this._archetype)
      .forEach(([drawable, sprite, transform], _entity) => {
        const image_asset = ecs.asset_store!.getAsset(sprite!.states.current_state.asset_id!);

        const current_state = sprite!.states.current_state;

        const cache = phaser_context.graphics_cache.getComponentCache(drawable);
        if (!cache.graphics_object) {
          cache.graphics_object = phaser_context.phaser_scene.add.sprite(
            transform.position.x,
            transform.position.y,
            image_asset!,
            current_state.start_frame,
          );
        }

      const phaser_sprite =
        cache.graphics_object as Phaser.GameObjects.Sprite;

      phaser_sprite.setDepth(drawable.depth);
      phaser_sprite.setPosition(transform.position.x, transform.position.y);
      phaser_sprite.setRotation(transform.rotation);
      phaser_sprite.setScale(transform.scale.x, transform.scale.y);

      if (!current_state.playing) return;

      if (!phaser_context.phaser_scene.anims.exists(current_state!.key)) {
        phaser_context.phaser_scene!.anims.create({
          key: current_state?.key,
          frames: phaser_sprite.anims.generateFrameNumbers(ecs.asset_store!.getAsset(current_state!.asset_id!), {
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

    });

  }

}
