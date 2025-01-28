import Component from './Component';
import { Entity } from './Entity';

/**
 * Manages components of a specific type for entities.
 */
export default class ComponentMap<T extends Component> {
  private _components: Map<Entity, T> = new Map();
  private _component_type: string;
  private _cached_entities: Set<Entity> | null = null;

  constructor(component_type: string) {
    if (!component_type) {
      throw new Error('Component type must be defined.');
    }
    this._component_type = component_type;
  }

  /**
   * Adds a component to the map for a specific entity.
   * @param entity - The entity.
   * @param component - The component to add.
   * @param can_overwrite - If true, overwrites an existing component.
   * @throws Will throw an error if the entity already has a component and `allowOverwrite` is false.
   */
  add(entity: Entity, component: T, can_overwrite: boolean = false): void {
    if (!component) {
      throw new Error(`Invalid component provided for entity ${entity}.`);
    }

    if (this.has(entity) && !can_overwrite) {
      throw new Error(
        `Could not add component to entity ${entity} (entity already has component of type ${this._component_type}).`,
      );
    }
    this._components.set(entity, component);
    this._cached_entities = null;
  }

  /**
   * Checks if an entity has a component of this type.
   * @param entity - The entity.
   * @returns `true` if the entity has the component, otherwise `false`.
   */
  has(entity: Entity): boolean {
    return this._components.has(entity);
  }

  /**
   * Retrieves the component for a specific entity.
   * @param entity - The entity.
   * @returns The component associated with the entity, or `undefined` if it does not exist.
   */
  get(entity: Entity): T | undefined {
    return this._components.get(entity);
  }

  /**
   * Removes the component associated with an entity.
   * @param entity - The entity.
   */
  delete(entity: Entity): void {
    this._components.delete(entity);
    this._cached_entities = null;
  }

  /**
   * Removes all components from the map.
   */
  clear(): void {
    this._components.clear();
    this._cached_entities = null;
  }

  /**
   * Checks if the map contains any components.
   * @returns `true` if the map is empty, otherwise `false`.
   */
  isEmpty(): boolean {
    return this._components.size === 0;
  }

  /**
   * Get the number of components in the map.
   * @returns the size of the map.
   */
  size(): number {
    return this._components.size;
  }

  /**
   * Retrieves all entities with this component type.
   * @returns a cloned array of entities.
   */
  getEntities(): Set<Entity> {
    if (!this._cached_entities) {
      this._cached_entities = new Set(this._components.keys());
    }
    return this._cached_entities;
  }

  /**
   * Retrieves all components in the map.
   * @returns An array of components.
   */
  getComponents(): T[] {
    return Array.from(this._components.values());
  }
}
