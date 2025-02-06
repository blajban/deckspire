import { Archetype } from '../core/ComponentStore';
import { GameContext } from '../core/GameContext';
import System from '../core/System';
import { CompDestroyMe } from '../core_components/CompDestroy';
import {
  CompIsMouse,
  CompMouseState,
  CompMouseEvent,
} from '../core_components/CompMouse';
import { MouseState } from '../input/MouseState';

export default class SysMouseEventGenerator extends System {
  // This event object is updated each call to update, if needed.
  private _mouse_state = new MouseState();

  constructor() {
    super(new Archetype(CompIsMouse, CompMouseState));
  }

  /**
   * Checks all sub systems and corresponding matching entities, for entities
   * being pointed or clicked at. Also determines which entity is on top, and
   * then calls the sub systems handling that entity and any entity that is
   * mouse sensitive even if not on top.
   * @param {Scene} scene
   * @param {PhaserScene} context
   * @param {number} time
   * @param {number} delta
   * @returns
   */
  public update(context: GameContext, _time: number, _delta: number): void {
    // Update
    const [has_moved, has_clicked] =
      this._mouse_state.updateMouseStatus(context);
    // Find mouse entity
    const entities = context.ecs_manager.getEntitiesWithArchetype(
      this.archetypes[0],
    );
    if (entities.size === 0) {
      const entity = context.ecs_manager.newEntity();
      context.ecs_manager.addComponents(
        entity,
        new CompIsMouse(),
        new CompMouseState(this._mouse_state.clone()),
      );
      entities.add(entity);
    }
    entities.forEach((entity) => {
      const comp_mouse = context.ecs_manager.getComponent(
        entity,
        CompMouseState,
      )!;
      comp_mouse.mouse_state;
    });
    // No event if the mouse state was unchanged.
    if (!(has_moved || has_clicked)) {
      return;
    }
    // Send mouse event
    context.ecs_manager.addComponents(
      context.ecs_manager.newEntity(),
      new CompMouseState(this._mouse_state.clone()),
      new CompMouseEvent(has_moved, has_clicked),
      new CompDestroyMe(),
    );
  }
}
