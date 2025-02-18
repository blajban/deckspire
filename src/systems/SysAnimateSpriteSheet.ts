import { Archetype } from '../engine/core/ComponentStore';
import EcsManager from '../engine/core/EcsManager';
import System from '../engine/core/System';
import CompAnimation from '../engine/core_components/CompAnimation';
import CompSpritesheet from '../engine/core_components/CompSpritesheet';

export default class SysAnimateSpriteSheet extends System {
  constructor() {
    super(new Archetype(CompSpritesheet, CompAnimation));
  }

  update(ecs: EcsManager, _time: number, delta: number): void {
    ecs.getEntitiesWithArchetype(this.archetypes[0]).forEach((entity) => {
      const spritesheet = ecs.getComponent(entity, CompSpritesheet)!;
      const animation = ecs.getComponent(entity, CompAnimation)!;

      animation.seconds_since_last_frame += delta;
      const frames = Math.trunc(
        animation.seconds_since_last_frame * animation.frames_per_second,
      );
      if (frames > 1) {
        spritesheet.current_frame += frames;
        spritesheet.current_frame %= spritesheet.number_of_frames;
        animation.seconds_since_last_frame %= animation.seconds_per_frame;
      }
    });
  }
}
