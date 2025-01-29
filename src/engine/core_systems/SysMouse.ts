import Vector2D from '../../math/Vector2D';
import { PhaserContext } from '../core/Engine';
import { Entity } from '../core/Entity';
import Scene from '../core/Scene';
import { SubSystem, SystemWithSubsystems } from '../core/System';
import CompMouseSensitive from '../core_components/CompMouseSensitive';
import { setIntersection } from '../util/setUtilityFunctions';

export default class SysMouse extends SystemWithSubsystems<MouseSubSystem> {
  // This event object is updated each call to update, if needed.
  private _mouse_event = new MouseEvent();

  constructor() {
    super([[CompMouseSensitive]]);
  }

  /**
   * Checks all sub systems and corresponding matching entities, for entities
   * being pointed or clicked at. Also determines which entity is on top, and
   * then calls the sub systems handling that entity and any entity that is
   * mouse sensitive even if not on top.
   * @param {Scene} scene
   * @param {PhaserContext} context
   * @param {number} time
   * @param {number} delta
   * @returns
   */
  public update(
    scene: Scene,
    context: PhaserContext,
    time: number,
    delta: number,
  ): void {
    this._mouse_event.updateMouseStatus(context, time);
    // No action if the mouse state was unchanged.
    if (!this._mouse_event.is_unhandled) {
      return;
    }
    /* The following code will do the following:
     * 1) Ask each subsystem if their corresponding entities are being pointed at or not.
     * 2) Determine which entity is one top of all the pointed at entities.
     * 3) Call the corresponding sub systems to take action on apropriate entities. */
    const pointed_at_entities = new Set<Entity>();
    const sub_system_entity_sets = new Map<SubSystem, Set<Entity>>();
    let top_depth = Number.NEGATIVE_INFINITY;
    let on_top_entity: Entity | undefined = undefined;
    this.sub_systems.forEach((sub_system) => {
      const sub_system_entities = sub_system.allMatchingEntities(scene);
      sub_system_entity_sets.set(sub_system, sub_system_entities);
      sub_system_entities.forEach((entity) => {
        // Checking whether entity is pointed at.
        if (
          sub_system.isEntityPointedAt(
            scene,
            context,
            this._mouse_event,
            time,
            delta,
            entity,
          )
        ) {
          pointed_at_entities.add(entity);
          // Checking depth value
          const depth = scene.ecs.getComponent(
            entity,
            CompMouseSensitive,
          )!.mouse_depth;
          if (top_depth < depth) {
            top_depth = depth;
            on_top_entity = entity;
          }
        }
      });
      this._mouse_event.entity_on_top = on_top_entity;
      /* Only activates the sub systems with the proper pointed at entities,
       * taking into account the properties of CompMouseSensitivity. */
      sub_system_entity_sets.forEach((set) => {
        setIntersection(set, pointed_at_entities).forEach((entity) => {
          const mouse_sensitivity = scene.ecs.getComponent(
            entity,
            CompMouseSensitive,
          )!;
          if (
            mouse_sensitivity.should_activate &&
            (on_top_entity === entity ||
              mouse_sensitivity.should_activate_even_if_not_on_top)
          ) {
            if (
              (mouse_sensitivity.should_activate_on_move &&
                this._mouse_event.has_moved) ||
              (mouse_sensitivity.should_activate_on_click &&
                this._mouse_event.has_clicked)
            ) {
              sub_system.onMouseEvent(
                scene,
                context,
                this._mouse_event,
                time,
                delta,
                entity,
              );
            }
          }
        });
      });
    });
    // Signals that the event has been handled and does not need to be processed again.
    this._mouse_event.is_unhandled = false;
  }
}

export abstract class MouseSubSystem extends SubSystem {
  public abstract isEntityPointedAt(
    scene: Scene,
    context: PhaserContext,
    mouse_event: MouseEvent,
    time: number,
    delta: number,
    entity: Entity,
  ): boolean;

  public abstract onMouseEvent(
    scene: Scene,
    context: PhaserContext,
    mouse_event: MouseEvent,
    time: number,
    delta: number,
    entity: Entity,
  ): void;
}

export enum MouseButtonStatus {
  None, // Neutral unpressed state
  Down, // Pressed state
  Held, // Pressed state and was Down or Helf last frame.
  Up, // Unpressed state, but was Down or Held last frame
}

export class MouseEvent {
  public last_position: Vector2D = new Vector2D(0, 0);
  public time_of_previous_event: number = 0;
  public time_of_event: number = 0;
  public entity_on_top: Entity | undefined = undefined;
  public is_unhandled = false;
  public has_moved = false;
  public has_clicked = false;
  private _mouse_buttons_states: Map<number, MouseButtonStatus> = new Map();
  private _mouse_buttons: number = 0;

  public updateMouseStatus(
    engine: PhaserContext,
    current_time: number,
  ): MouseEvent {
    const pointer = engine.input.activePointer;
    this._updatePosition(pointer.position);
    this._updateMouseButtonStatus(pointer.buttons);
    if (!this.has_moved && !this.has_clicked) {
      return this;
    }
    this.time_of_previous_event = this.time_of_event;
    this.time_of_event = current_time;
    this.is_unhandled = true;
    return this;
  }

  private _updatePosition(position: Vector2D): void {
    if (!position.equals(this.last_position)) {
      this.last_position = position.clone();
      this.has_moved = true;
    }
  }

  private _updateMouseButtonStatus(buttons: number): void {
    for (let n = 1; n <= 16; n *= 2) {
      const is_pressed_old = (this._mouse_buttons & n) > 0;
      const is_pressed_new = (buttons & n) > 0;
      let state;
      if (is_pressed_old && !is_pressed_new) {
        state = MouseButtonStatus.Up;
      } else if (!is_pressed_old && is_pressed_new) {
        state = MouseButtonStatus.Down;
      } else if (is_pressed_old && is_pressed_new) {
        state = MouseButtonStatus.Held;
      } else {
        state = MouseButtonStatus.None;
      }
      this._mouse_buttons_states.set(n, state);
    }
    if (this._mouse_buttons !== buttons) {
      this._mouse_buttons = buttons;
      this.has_clicked = true;
    }
  }

  /**
   * @param {number} button - Which button to get status for, starting at 0 for the left mouse button.
   * @returns - The status of the button or the None state if the button does not exist.
   */
  public mouseButtonState(button: number): MouseButtonStatus {
    return (
      this._mouse_buttons_states.get(Math.pow(2, button)) ??
      MouseButtonStatus.None
    );
  }
}
