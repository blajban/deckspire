import System from '../engine/core/System';
import { Context } from '../engine/core/Engine';
import Scene from '../engine/core/Scene';
import CompTransform from '../components/CompTransform';
import CompRotate from '../engine/core_components/CompRotate';

export default class SysRotate extends System {
  constructor() {
    super([[CompTransform, CompRotate]]);
  }

  update(scene: Scene, context: Context, time: number, delta: number): void {

    const entities = this.allMatchingEntities(scene);

    entities.forEach((entity) => {
      const transform = scene.ecs.getComponent(entity, CompTransform)!;
      const rotation = scene.ecs.getComponent(entity, CompRotate)!;

      if (!rotation.playing) return;

      rotation.elapsed += delta;

      const progress = this._progress(rotation.elapsed, rotation.duration);
      transform.rotation = rotation.start_value + (rotation.end_value - rotation.start_value) * progress;


      const maxDuration = Math.max(
        rotation.duration || 0
      );

      if (rotation.elapsed >= maxDuration) {
        if (!rotation.loop) {
          rotation.playing = false;
        } else {
          rotation.elapsed = 0;
        }
      }
    });
  }

  _progress(elapsed: number, duration: number): number {
    return Math.min(elapsed / duration, 1);
  }
}
