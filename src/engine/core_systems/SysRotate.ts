import System from '../core/System';
import EcsManager from '../core/EcsManager';
import PhaserContext from '../core/PhaserContext';
import Archetype from '../core/Archetype';
import CompTransform from '../core_components/CompTransform';
import CompRotate from '../core_components/CompRotate';

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
      .forEach(([transform, rotate], entity) => {
        rotate.elapsed += delta;

        const progress = this._progress(rotate.elapsed, rotate.duration);
        transform.rotation =
          rotate.start_value +
          (rotate.end_value - rotate.start_value) * progress;

        const max_duration = Math.max(rotate.duration);

        if (rotate.elapsed >= max_duration) {
          if (!rotate.should_loop) {
            ecs.removeComponent(entity, CompRotate);
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
