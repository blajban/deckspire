import Archetype from '../core/Archetype';
import EcsManager from '../core/EcsManager';
import PhaserContext from '../core/PhaserContext';
import System from '../core/System';
import { CompDestroyMe } from '../core_components/CompDestroy';
import {
  CompIsMouse,
  CompMouseState,
  CompMouseEvent,
} from '../core_components/CompMouse';
import { MouseState } from '../input/MouseState';

export default class SysMouse extends System {
  // This event object is updated each call to update, if needed.
  private _mouse_state = new MouseState();

  private _archetype = new Archetype(CompIsMouse, CompMouseState);

  override init(ecs: EcsManager): void {
    ecs.addComponents(ecs.newEntity(), new CompIsMouse(), new CompMouseState());
  }

  override update(
    ecs: EcsManager,
    phaser_context: PhaserContext,
    _time: number,
    _delta: number,
  ): void {
    // Update
    const [has_moved, has_clicked] =
      this._mouse_state.updateMouseStatus(phaser_context);
    // Find mouse entity
    const entity = ecs.getEntityWithArchetype(this._archetype)!;
    // Find mouse state component
    const comp_mouse_state = ecs.getComponent(entity, CompMouseState)!;
    comp_mouse_state.mouse_state = this._mouse_state.clone();
    // No event if the mouse state was unchanged.
    if (!(has_moved || has_clicked)) {
      return;
    }
    // Send mouse event
    ecs.addComponents(
      ecs.newEntity(),
      new CompMouseState(this._mouse_state.clone()),
      new CompMouseEvent(has_moved, has_clicked),
      new CompDestroyMe(),
    );
  }

  public terminate(ecs: EcsManager): void {
    const entities = ecs.getEntitiesWithArchetype(this._archetype);
    for (const entity of entities) {
      ecs.removeEntity(entity);
    }
  }
}
