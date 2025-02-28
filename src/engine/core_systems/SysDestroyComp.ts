import Archetype from '../core/Archetype';
import EcsManager from '../core/EcsManager';
import PhaserContext from '../core/PhaserContext';
import System from '../core/System';
import { CompDestroyComp } from '../core_components/CompDestroy';
import { destroyComponent } from '../util/cleanup';

export default class SysDestroyComp extends System {
  private _archetype = new Archetype(CompDestroyComp);

  override update(
    ecs: EcsManager,
    phaser_context: PhaserContext,
    _time: number,
    _delta: number,
  ): void {
    ecs
      .getComponentsForEntitiesWithArchetype(this._archetype)
      .forEach(([destroy], entity) => {
        destroy.components.forEach((component_class) => {
          const component = ecs.getComponent(entity, component_class);

          if (component) {
            destroyComponent(ecs, phaser_context, entity, component);
          }
        });

        ecs.removeComponent(entity, CompDestroyComp);
      });
  }
}
