import { setDifferenceInPlace } from '../util/setUtilityFunctions';
import EcsManager from './EcsManager';
import PhaserContext from './PhaserContext';
import System, { SystemClass } from './System';

export default class SystemManager {
  private _system_priorities = new Map<SystemClass, Set<SystemClass>>();
  private _registered_systems = new Set<SystemClass>();
  private _active_systems = new Set<SystemClass>();
  private _system_order = new Array<SystemClass>();
  private _system_instances = new Map<SystemClass, System>();
  private _ordered_systems = new Array<System>();
  private _is_sorting_needed = false;

  public registerSystem(
    system_class: SystemClass,
    execute_after: SystemClass[],
    execute_before: SystemClass[],
  ): void {
    if (this._registered_systems.has(system_class)) {
      throw new Error(`Trying to re-register ${system_class.name}.`);
    }
    if (!this._system_priorities.has(system_class)) {
      this._system_priorities.set(system_class, new Set());
    }
    const stored_after = this._system_priorities.get(system_class)!;
    execute_after.forEach((other_system_class) => {
      if (!this._system_priorities.has(other_system_class)) {
        this._system_priorities.set(other_system_class, new Set());
      }
      stored_after.add(other_system_class);
    });
    execute_before.forEach((other_system_class) => {
      let other_after = this._system_priorities.get(other_system_class);
      if (other_after === undefined) {
        other_after = new Set();
        this._system_priorities.set(other_system_class, other_after);
      }
      other_after.add(system_class);
    });
    this._is_sorting_needed = true;
  }

  public activateSystem(ecs: EcsManager, system_class: SystemClass): void {
    if (this._registered_systems.has(system_class)) {
      throw new Error(
        `System ${system_class.name} cannot be activated as it is not registered.`,
      );
    }
    if (!this._system_instances.has(system_class)) {
      const system = new system_class();
      system.init(ecs);
      this._system_instances.set(system_class, system);
    }
    this._active_systems.add(system_class);
    if (this._is_sorting_needed) {
      this._sortSystems();
    }
    this._updateActiveSystemOrder();

    console.debug(
      `System ${system_class.name} activated.\nActive systems:\n${this._activeSystemsAsString()}`,
    );
  }

  private _updateActiveSystemOrder(): void {
    this._ordered_systems = this._system_order
      .filter((system_class) => {
        return this._active_systems.has(system_class);
      })
      .map((system_class) => this._system_instances.get(system_class)!);
  }

  private _sortSystems(): void {
    this._system_order.length = 0;
    // Deep copy the priorities
    const priorities = new Map();
    this._system_priorities.forEach((afters, system_class) => {
      priorities.set(system_class, new Set(afters));
    });

    while (priorities.size > 0) {
      const to_add = new Set<SystemClass>();
      priorities.forEach((afters, system_class) => {
        if (afters.size === 0) {
          to_add.add(system_class);
        }
      });
      if (to_add.size === 0) {
        throw new Error('Cannot fulfill impossible system order contraints.');
      }
      priorities.forEach((afters) => {
        setDifferenceInPlace(afters, to_add);
      });
      to_add.forEach((system_class) => {
        this._system_order.push(system_class);
        priorities.delete(system_class);
      });
    }
    this._is_sorting_needed = false;

    console.debug(`System order updated.\n${this._systemOrderAsString()}`);
  }

  private _systemOrderAsString(): string {
    let order = 0;
    return this._system_order
      .map((system_class) =>
        (++order).toString().concat(' ', system_class.name),
      )
      .join('\n');
  }

  private _activeSystemsAsString(): string {
    let order = 0;
    return this._ordered_systems
      .map((system_class) =>
        (++order).toString().concat(' ', system_class.constructor.name),
      )
      .join('\n');
  }

  public deactivateSystem(ecs: EcsManager, system_class: SystemClass): void {
    if (!this._registered_systems.has(system_class)) {
      throw new Error(
        `System ${system_class.name} cannot be deactivated as it is not registered.`,
      );
    }
    const system = this._system_instances.get(system_class);
    if (system !== undefined) {
      system.terminate(ecs);
    }
    this._active_systems.delete(system_class);
    this._system_instances.delete(system_class);

    console.log(
      `System ${system_class.name} deactivated.\nActive systems:\n${this._activeSystemsAsString()}`,
    );
  }

  public update(
    ecs: EcsManager,
    phaser_context: PhaserContext,
    time: number,
    delta: number,
  ): void {
    this._ordered_systems.forEach((system) => {
      system.update(ecs, phaser_context, time, delta);
    });
  }
}
