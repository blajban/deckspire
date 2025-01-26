import Vector2D from '../../math/Vector2D';
import { Entity } from '../core/Entity';
import Scene from '../core/Scene';
import { SubSystem, SystemWithSubsystems } from '../core/System';
import World from '../core/World';
import CompDrawable from '../core_components/CompDrawable';
import CompMouseSensitive from '../core_components/CompMouseSensitive';
import { set_intersection, set_union } from '../util/set_utility_functions';

export default class SysMouse extends SystemWithSubsystems<MouseSubSystem> {
  private context = new MouseEvent();

  constructor(scene: Scene) {
    // Need Drawable to get depth. Should probably be change to a separate component.
    super([[CompMouseSensitive, CompDrawable]]);
  }

  public update(world: World, scene: Scene, time: number, delta: number) {
    this.context.update_mouse_status(scene.input.activePointer.position, time);
    if (!this.context.unhandled) {
      return;
    }
    const pointed_at_entities = new Set<Entity>();
    const sub_system_entity_sets = new Map<SubSystem, Set<Entity>>();
    this.sub_systems.forEach((sub_system) => {
      const sub_system_entities = sub_system.all_matching_entities(world);
      sub_system_entity_sets.set(sub_system, sub_system_entities);
      sub_system_entities.forEach((entity) => {
        if (
          sub_system.is_entity_pointed_at(
            world,
            scene,
            this.context,
            time,
            delta,
            entity,
          )
        ) {
          pointed_at_entities.add(entity);
        }
      });
      sub_system_entity_sets.forEach((set) => {
        set_intersection(set, pointed_at_entities).forEach((entity) => {
          sub_system.on_mouse_event(
            world,
            scene,
            this.context,
            time,
            delta,
            entity,
          );
        });
      });
    });
    this.context.unhandled = false;
  }
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

export class MouseEvent {
  public last_position: Vector2D = new Vector2D(0, 0);
  public time_of_previous_event: number = 0;
  public time_of_event: number = 0;
  public on_top: boolean = false;
  public unhandled = false;

  public update_mouse_status(last_position: Vector2D, current_time: number): MouseEvent {
    if( last_position.equals(this.last_position)){
      return this;
    }
    this.last_position = last_position.clone();
    this.time_of_previous_event = this.time_of_event;
    this.time_of_event = current_time;
    this.unhandled = true;
    return this;
  }

  public set_item_is_on_top(on_top: boolean) : MouseEvent {
    this.on_top = on_top;
    return this;
  }

  public set_event_is_handled(handled: boolean): MouseEvent {
    this.unhandled = !handled;
    return this;
  }
}
