import Vector2D from '../../math/Vector2D';
import { Entity } from '../core/Entity';
import Scene from '../core/Scene';
import { SubSystem, SystemWithSubsystems } from '../core/System';
import World from '../core/World';
import CompMouseSensitive from '../core_components/CompMouseSensitive';
import { set_intersection } from '../util/set_utility_functions';

export default class SysMouse extends SystemWithSubsystems<MouseSubSystem> {
  // This event object is updated each call to update, if needed.
  private mouse_event = new MouseEvent();

  constructor() {
    super([[CompMouseSensitive]]);
  }

  /**
   * Checks all sub systems and corresponding matching entities, for entities
   * being pointed or clicked at. Also determines which entity is on top, and
   * then calls the sub systems handling that entity and any entity that is
   * mouse sensitive even if not on top.
   * @param {World} world
   * @param {Scene} scene
   * @param {number} time
   * @param {number} delta
   * @returns
   */
  public update(world: World, scene: Scene, time: number, delta: number) {
    this.mouse_event.update_mouse_status(scene, time);
    // No action if the mouse state was unchanged.
    if (!this.mouse_event.unhandled) {
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
      const sub_system_entities = sub_system.all_matching_entities(world);
      sub_system_entity_sets.set(sub_system, sub_system_entities);
      sub_system_entities.forEach((entity) => {
        // Checking whether entity is pointed at.
        if (
          sub_system.is_entity_pointed_at(
            world,
            scene,
            this.mouse_event,
            time,
            delta,
            entity,
          )
        ) {
          pointed_at_entities.add(entity);
          // Checking depth value
          const depth = world.getComponent(
            entity,
            CompMouseSensitive,
          )!.mouse_depth;
          if (top_depth < depth) {
            top_depth = depth;
            on_top_entity = entity;
          }
        }
      });
      this.mouse_event.entity_on_top = on_top_entity;
      /* Only activates the sub systems with the proper pointed at entities,
       * taking into account the properties of CompMouseSensitivity. */
      sub_system_entity_sets.forEach((set) => {
        set_intersection(set, pointed_at_entities).forEach((entity) => {
          const mouse_sensitivity = world.getComponent(
            entity,
            CompMouseSensitive,
          )!;
          if (
            mouse_sensitivity.activate &&
            (on_top_entity === entity ||
              mouse_sensitivity.activate_even_if_not_on_top)
          ) {
            if (
              (mouse_sensitivity.activate_on_move &&
                this.mouse_event.has_moved) ||
              (mouse_sensitivity.activate_on_click &&
                this.mouse_event.has_clicked)
            ) {
              sub_system.on_mouse_event(
                world,
                scene,
                this.mouse_event,
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
    this.mouse_event.unhandled = false;
  }

  private find_pointed_at_entities() {}
}

export abstract class MouseSubSystem extends SubSystem {
  public abstract is_entity_pointed_at(
    world: World,
    scene: Scene,
    context: MouseEvent,
    time: number,
    delta: number,
    entity: Entity,
  ): boolean;

  public abstract on_mouse_event(
    world: World,
    scene: Scene,
    context: MouseEvent,
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
  public unhandled = false;
  public has_moved = false;
  public has_clicked = false;
  private mouse_buttons_states: Map<number, MouseButtonStatus> = new Map();
  private mouse_buttons: number = 0;

  public update_mouse_status(scene: Scene, current_time: number): MouseEvent {
    const pointer = scene.input.activePointer;
    this.update_position(pointer.position);
    this.update_mouse_button_status(pointer.buttons);
    if (!this.has_moved && !this.has_clicked) {
      return this;
    }
    this.time_of_previous_event = this.time_of_event;
    this.time_of_event = current_time;
    this.unhandled = true;
    return this;
  }

  private update_position(position: Vector2D) {
    if (!position.equals(this.last_position)) {
      this.last_position = position.clone();
      this.has_moved = true;
    }
  }

  private update_mouse_button_status(buttons: number) {
    for (let n = 1; n <= 16; n *= 2) {
      let old_pressed = (this.mouse_buttons & n) > 0;
      let new_pressed = (buttons & n) > 0;
      let state;
      if (old_pressed && !new_pressed) {
        state = MouseButtonStatus.Up;
      } else if (!old_pressed && new_pressed) {
        state = MouseButtonStatus.Down;
      } else if (old_pressed && new_pressed) {
        state = MouseButtonStatus.Held;
      } else {
        state = MouseButtonStatus.None;
      }
      this.mouse_buttons_states.set(n, state);
    }
    if (this.mouse_buttons !== buttons) {
      this.mouse_buttons = buttons;
      this.has_clicked = true;
    }
  }

  /**
   * @param {number} button - Which button to get status for, starting at 0 for the left mouse button.
   * @returns - The status of the button or the None state if the button does not exist.
   */
  public mouse_button_state(button: number): MouseButtonStatus {
    return (
      this.mouse_buttons_states.get(Math.pow(2, button)) ??
      MouseButtonStatus.None
    );
  }
}
