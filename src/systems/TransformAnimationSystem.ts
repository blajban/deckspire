import CompParent from '../engine/core_components/CompParent';
import System from '../engine/core/System';
import { Context } from '../engine/core/Engine';
import Scene from '../engine/core/Scene';
import CompTransform from '../components/CompTransform';
import { AnimConfigTransform } from '../engine/core/Animations';
import CompTransformAnimation from '../engine/core_components/CompTransformAnimation';

export default class TransformAnimationSystem extends System {
  constructor() {
    super([[CompTransform, CompTransformAnimation]]);
  }

  update(scene: Scene, context: Context, time: number, delta: number): void {

    const entities = this.allMatchingEntities(scene);

    entities.forEach((entity) => {
      const transform = scene.ecs.getComponent(entity, CompTransform)!;
      const animation = scene.ecs.getComponent(entity, CompTransformAnimation)!;

      const current_state = animation.animate.current_state;
      const config = current_state.config as AnimConfigTransform;

      if (!current_state.playing) return;

      current_state.elapsed += delta;

      if (config.rotation) {
        const progress = this._progress(current_state.elapsed, config.rotation.duration);
        transform.rotation = config.rotation.start_value + (config.rotation.end_value - config.rotation.start_value) * progress;
      }

      if (config.scale_x) {
        const progress = this._progress(current_state.elapsed, config.scale_x.duration);
        transform.scale.x = config.scale_x.start_value + (config.scale_x.end_value - config.scale_x.start_value) * progress;
      }

      if (config.scale_y) {
        const progress = this._progress(current_state.elapsed, config.scale_y.duration);
        transform.scale.y = config.scale_y.start_value + (config.scale_y.end_value - config.scale_y.start_value) * progress;
      }

      const maxDuration = Math.max(
        config.rotation?.duration || 0, 
        config.scale_x?.duration || 0, 
        config.scale_y?.duration || 0
      );

      if (current_state.elapsed >= maxDuration) {
        if (!current_state.loop) {
          current_state.playing = false;
        } else {
          current_state.elapsed = 0;
        }
      }
    });
  }

  _progress(elapsed: number, duration: number): number {
    return Math.min(elapsed / duration, 1);
  }
}
