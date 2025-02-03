import { Context } from './Engine';
import System, { SystemClass } from './System';

export default class SystemManager {
  private _system_priorities = new Map<
    SystemClass<System>,
    Set<SystemClass<System>>
  >();
  private _registered_systems = new Set<SystemClass<System>>();
  private _active_systems = new Set<SystemClass<System>>();
  private _system_order = new Array<SystemClass<System>>();
  private _system_instances = new Map<SystemClass<System>, System>();
  private _ordered_systems = new Array<System>();
  private _is_sorting_needed = false;

  public registerSystem<T extends System>(
    system_class: SystemClass<T>,
    after: SystemClass<System>[] = [],
    before: SystemClass<System>[] = [],
  ): void {
    if (this._registered_systems.has(system_class)) {
      throw new Error(`Trying to re-register ${system_class.name}.`);
    }
    let stored_after = this._system_priorities.get(system_class);
    if (stored_after === undefined) {
      stored_after = new Set();
      this._system_priorities.set(system_class, stored_after);
    }
    after.forEach((other_system_class) => {
      stored_after.add(other_system_class);
    });
    before.forEach((other_system_class) => {
      let other_after = this._system_priorities.get(other_system_class);
      if (other_after === undefined) {
        other_after = new Set();
        this._system_priorities.set(other_system_class, other_after);
      }
      other_after.add(system_class);
    });
    this._is_sorting_needed = true;
  }

  public activateSystem<T extends System>(system_class: SystemClass<T>): void {
    if (this._registered_systems.has(system_class)) {
      throw new Error(
        `System ${system_class.name} cannot be activated as it is not registered.`,
      );
    }
    if (!this._system_instances.has(system_class)) {
      this._system_instances.set(system_class, new system_class());
    }
    this._active_systems.add(system_class);
    if (this._is_sorting_needed) {
      this._sortSystems();
    }
    this._ordered_systems = this._system_order
      .filter((system_class) => {
        return this._active_systems.has(system_class);
      })
      .map((system_class) => this._system_instances.get(system_class)!);
  }

  // TODO: Actual sorting!
  private _sortSystems(): void {
    this._system_order.length = 0;
    this._active_systems.forEach((system_class) => {
      this._system_order.push(system_class);
    });
  }

  public deactivateSystem<T extends System>(
    system_class: SystemClass<T>,
  ): void {
    if (!this._registered_systems.has(system_class)) {
      throw new Error(
        `System ${system_class.name} cannot be deactivated as it is not registered.`,
      );
    }
    this._active_systems.delete(system_class);
    this._system_instances.delete(system_class);
  }

  public update(context: Context, time: number, delta: number): void {
    this._ordered_systems.forEach((system) => {
      system.update(context, time, delta);
    });
  }
}
