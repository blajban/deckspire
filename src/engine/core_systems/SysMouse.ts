import { Archetype } from '../core/ComponentStore';
import { Entity } from '../core/Entity';
import { GameContext } from '../core/GameContext';
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
  private _mouse_entity: Entity | undefined;

  constructor() {
    super(new Archetype(CompIsMouse, CompMouseState));
  }

  override init(context: GameContext): void {
    context.ecs_manager.addComponents(
      context.ecs_manager.newEntity(),
      new CompIsMouse(),
      new CompMouseState(),
    );
  }

  override update(context: GameContext, _time: number, _delta: number): void {
    // Update
    const [has_moved, has_clicked] =
      this._mouse_state.updateMouseStatus(context);
    // Find mouse entity
    const entity = context.ecs_manager.getEntityWithArchetype(
      this.archetypes[0],
    )!;
    // Find mouse state component
    const comp_mouse_state = context.ecs_manager.getComponent(
      entity,
      CompMouseState,
    )!;
    comp_mouse_state.mouse_state = this._mouse_state.clone();
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

  public terminate(context: GameContext): void {
    const entities = context.ecs_manager.getEntitiesWithArchetype(
      this.archetypes[0],
    );
    for (const entity of entities) {
      context.ecs_manager.removeEntity(entity);
    }
  }
}
