import Archetype from '../core/Archetype';
import EcsManager from '../core/EcsManager';
import PhaserContext from '../core/PhaserContext';
import System from '../core/System';
import { CompDestroyMe } from '../core_components/CompDestroy';
import { destroyEntity } from '../util/cleanup';

export default class SysDestroyEntity extends System {
  private _archetype = new Archetype(CompDestroyMe);

  override update(
    ecs: EcsManager,
    phaser_context: PhaserContext,
    _time: number,
    _delta: number,
  ): void {
    ecs.getEntitiesWithArchetype(this._archetype).forEach((entity) => {
      destroyEntity(ecs, phaser_context, entity);
    });
  }
}
