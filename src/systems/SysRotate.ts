import System from '../engine/core/System';
import EcsManager from '../engine/core/EcsManager';
import PhaserContext from '../engine/core/PhaserContext';
import Archetype from '../engine/core/Archetype';
import CompTransform from '../engine/core_components/CompTransform';
import CompRotate from '../engine/core_components/CompRotate';

export default class SysRotate extends System {
  private _archetype = new Archetype(CompTransform, CompRotate);

  override update(
    ecs: EcsManager,
    _phaser_context: PhaserContext,
    _time: number,
    delta: number,
  ): void {
    ecs
      .getComponentsForEntitiesWithArchetype(this._archetype)
      .forEach(([transform, rotate], _entity) => {
        if (!rotate.is_playing) {
          return;
        }

        rotate.elapsed += delta;

        const progress = this._progress(rotate.elapsed, rotate.duration);
        transform.rotation =
          rotate.start_value +
          (rotate.end_value - rotate.start_value) * progress;

        const max_duration = Math.max(rotate.duration || 0);

        if (rotate.elapsed >= max_duration) {
          if (!rotate.should_loop) {
            rotate.is_playing = false;
          } else {
            rotate.elapsed = 0;
          }
        }
      });
  }

  private _progress(elapsed: number, duration: number): number {
    return Math.min(elapsed / duration, 1);
  }
}
