import { Component } from './Component';
import { Entity } from './Entity';

/**
 * Manages components of a specific type for entities.
 */
export default class ComponentMap<T extends Component> {
  private components: Map<Entity, T> = new Map();
  private componentType: string;
  private cachedEntities: Entity[] | null = null;

  constructor(componentType: string) {
    if (!componentType) {
      throw new Error('Component type must be defined.');
    }
    this.componentType = componentType;
  }

  /**
   * Adds a component to the map for a specific entity.
   * @param entity - The entity.
   * @param component - The component to add.
   * @param allowOverwrite - If true, overwrites an existing component.
   * @throws Will throw an error if the entity already has a component and `allowOverwrite` is false.
   */
  add(entity: Entity, component: T, allowOverwrite: boolean = false) {
    if (!component) {
      throw new Error(`Invalid component provided for entity ${entity}.`);
    }

    if (this.has(entity) && !allowOverwrite) {
      throw new Error(
        `Could not add component to entity ${entity} (entity already has component of type ${this.componentType}).`,
      );
    }
    this.components.set(entity, component);
    this.cachedEntities = null;
  }

  /**
   * Checks if an entity has a component of this type.
   * @param entity - The entity.
   * @returns `true` if the entity has the component, otherwise `false`.
   */
  has(entity: Entity): boolean {
    return this.components.has(entity);
  }

  /**
   * Retrieves the component for a specific entity.
   * @param entity - The entity.
   * @returns The component associated with the entity, or `undefined` if it does not exist.
   */
  get(entity: Entity): T | undefined {
    return this.components.get(entity);
  }

  /**
   * Removes the component associated with an entity.
   * @param entity - The entity.
   * @throws Will throw an error if the entity does not have this component type.
   */
  delete(entity: Entity) {
    if (!this.has(entity)) {
      throw new Error(
        `Could not delete component of type ${this.componentType} for entity ${entity} (component does not exist).`,
      );
    }
    this.components.delete(entity);
    this.cachedEntities = null;
  }

  /**
   * Removes all components from the map.
   */
  clear(): void {
    this.components.clear();
    this.cachedEntities = null;
  }

  /**
   * Checks if the map contains any components.
   * @returns `true` if the map is empty, otherwise `false`.
   */
  isEmpty(): boolean {
    return this.components.size === 0;
  }

  /**
   * Get the number of components in the map.
   * @returns the size of the map.
   */
  size(): number {
    return this.components.size;
  }

  /**
   * Retrieves all entities with this component type.
   * @returns a cloned array of entities.
   */
  getEntities(): Entity[] {
    if (!this.cachedEntities) {
      this.cachedEntities = Array.from(this.components.keys());
    }
    return [...this.cachedEntities];
  }

  /**
   * Retrieves all components in the map.
   * @returns An array of components.
   */
  getComponents(): T[] {
    return Array.from(this.components.values());
  }
}
