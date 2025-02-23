import System from '../engine/core/System';
import { Context } from '../engine/core/Engine';
import Scene from '../engine/core/Scene';
import CompTransform from '../components/CompTransform';
import CompScaleChange from '../engine/core_components/CompScaleChange';

export default class SysScaleChange extends System {
  constructor() {
    super([[CompTransform, CompScaleChange]]);
  }

  update(scene: Scene, context: Context, time: number, delta: number): void {

    const entities = this.allMatchingEntities(scene);

    entities.forEach((entity) => {
      const transform = scene.ecs.getComponent(entity, CompTransform)!;
      const scale_change = scene.ecs.getComponent(entity, CompScaleChange)!;


      if (!scale_change.playing) return;

      scale_change.elapsed += delta;


        const progress_x = this._progress(scale_change.elapsed, scale_change.duration);
        transform.scale.x = scale_change.start_value.x + (scale_change.end_value.x - scale_change.start_value.x) * progress_x;


        const progress_y = this._progress(scale_change.elapsed, scale_change.duration);
        transform.scale.y = scale_change.start_value.y + (scale_change.end_value.y - scale_change.start_value.y) * progress_y;


      const maxDuration = Math.max(
        scale_change.duration || 0
      );

      if (scale_change.elapsed >= maxDuration) {
        if (!scale_change.loop) {
          scale_change.playing = false;
        } else {
          scale_change.elapsed = 0;
        }
      }
    });
  }

  _progress(elapsed: number, duration: number): number {
    return Math.min(elapsed / duration, 1);
  }
}
