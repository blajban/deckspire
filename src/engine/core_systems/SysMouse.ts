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
    scene.input.addListener('pointermove', this.on_pointer_move, this);
    scene.input.setPollAlways();
  }

  private on_pointer_move(pointer: Phaser.Input.Pointer) {
    this.context.last_position = pointer.position.clone();
    this.context.time_since_last_event =
      pointer.time - this.context.timestamp_of_last_event;
    this.context.timestamp_of_last_event = pointer.time;
    this.context.unhandled = true;
  }

  public update(world: World, scene: Scene, time: number, delta: number) {
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
  constructor(
    public unhandled = false,
    public last_position: Vector2D = new Vector2D(0, 0),
    public time_since_last_event: number = 0,
    public timestamp_of_last_event: number = 0,
    public on_top: boolean = false,
  ) {}
}
