import { ClassType } from '../util/ClassType';
import { setIntersection, setUnion } from '../util/setUtilityFunctions';
import Archetype from './Archetype';
import Component, { ComponentClass } from './Component';
import ComponentMap from './ComponentMap';
import { Entity } from './Entity';

/**
 * The ComponentStore manages all components.
 * It keeps a map of component types to their corresponding ComponentMaps.
 */
export default class ComponentStore {
  private _component_maps: Map<string, ComponentMap<Component>> = new Map();
  private _component_registry: Map<string, ComponentClass> = new Map();

  /**
   * Registers a new component type.
   * This must be called before adding components of this type.
   * @param component_class - The component class to be registered.
   */
  registerComponent<T extends Component>(component_class: ClassType<T>): void {
    const name = component_class.name;

    if (
      !this._component_registry.has(name) &&
      !this._component_maps.has(name)
    ) {
      this._component_registry.set(name, component_class);
      this._component_maps.set(name, new ComponentMap(component_class));
    }
  }

  /**
   * Retrieves the registered component class for a given type.
   * @param type - The string identifier of the component type.
   * @returns The constructor of the registered component class.
   * @throws Will throw an error if the specified component type is not registered.
   */
  getRegisteredComponentClass(type: string): ComponentClass {
    const component_class = this._component_registry.get(type);
    if (!component_class) {
      throw new Error(`Component type ${type} is not registered.`);
    }
    return component_class;
  }

  /**
   * Adds a component to an entity.
   * @param entity - The entity to which the component will be added.
   * @param component - The component instance to add.
   * @throws Will throw an error if the component type has not been registered.
   */
  addComponent<T extends Component>(entity: Entity, component: T): void {
    const component_type = component.constructor.name;
    const component_map = this._component_maps.get(
      component_type,
    ) as ComponentMap<T>;
    if (!component_map) {
      throw new Error(
        `Component type ${component_type} must be registered first (add component)`,
      );
    }

    component_map.add(entity, component);
  }

  /**
   * Retrieves a component of a specific type for a given entity.
   * @param entity - The entity whose component is being retrieved.
   * @param component_class - The type of component to retrieve.
   * @returns The component if it exists, otherwise `undefined`.
   * @throws Will throw an error if the component type has not been registered.
   */
  getComponent<T extends Component>(
    entity: Entity,
    component_class: ClassType<T>,
  ): T | undefined {
    const component_type = component_class.name;
    const component_map = this._component_maps.get(component_type);
    if (!component_map) {
      throw new Error(
        `Component type ${component_type} must be registered first (get component)`,
      );
    }
    return component_map.get(entity) as T;
  }

  /**
   * Removes a component of a specific type from an entity.
   * @param entity - The entity whose component is being removed.
   * @param component_class - The type of component to remove.
   * @throws Will throw an error if the component type has not been registered.
   */
  removeComponent<T extends Component>(
    entity: Entity,
    component_class: ClassType<T>,
  ): void {
    const component_type = component_class.name;
    const component_map = this._component_maps.get(component_type);
    if (!component_map) {
      throw new Error(
        `Component type ${component_type} must be registered first (remove component)`,
      );
    }

    component_map.delete(entity);
  }

  /**
   * Retrieves all entities that has any component.
   * @returns A set of entity IDs that have the specified component type.
   */
  public getAllEntities(): Set<Entity> {
    return setUnion(
      ...[...this._component_maps].map(([_, component_map]) => {
        return component_map.entities;
      }),
    );
  }

  /**
   * Retrieves all entities that have a specific archetype together with all the components.
   * @param component_class - The type of the component to query.
   * @returns A map of entities and the instances of the components specified in the archetype.
   * @throws Will throw an error if the component type has not been registered.
   */
  getComponentsForEntitiesWithArchetype<T extends Component[]>(
    archetype: Archetype<T>,
  ): Map<Entity, T> {
    const result = new Map();
    this.getEntitiesWithArchetype(archetype).forEach((entity) => {
      result.set(
        entity,
        archetype.component_classes.map((component_class) => {
          return this.getComponent(entity, component_class);
        }) as T,
      );
    });
    return result;
  }

  /**
   * Retrieves all entities that have a specific component type together with the components.
   * @param component_class - The type of the component to query.
   * @returns A map of entities and the instances of the specified component type.
   * @throws Will throw an error if the component type has not been registered.
   */
  getComponentsForEntitiesWithComponent<T extends Component>(
    component_class: ClassType<T>,
  ): Map<Entity, T> {
    const component_type = component_class.name;
    const component_map = this._component_maps.get(component_type);
    if (!component_map) {
      throw new Error(
        `Component type ${component_type} must be registered first.`,
      );
    }
    return component_map.map as Map<Entity, T>;
  }

  public getEntitiesWithComponent(
    component_class: ComponentClass,
  ): Set<Entity> {
    const component_map = this._component_maps.get(component_class.name);
    if (!component_map) {
      throw new Error(
        `Component type ${component_class} must be registered first.`,
      );
    }
    return component_map!.entities;
  }

  /**
   * Retrieves all entities that have all the specified component types.
   * @param archetype - Component types to query.
   * @returns An array of entities that have all the specified component types.
   * @throws Will throw an error if any of the component types have not been registered.
   */
  getEntitiesWithArchetype<T extends Component[]>(
    archetype: Archetype<T>,
  ): Set<Entity> {
    if (archetype.component_classes.length === 0) {
      throw new Error('Archetype cannot be empty.');
    }

    const component_types = archetype.component_classes.map(
      (component_class) => {
        return component_class.name;
      },
    );

    const entity_sets = component_types.map((type) => {
      const component_map = this._component_maps.get(type);
      if (!component_map) {
        throw new Error(`Component type ${type} must be registered first.`);
      }
      return new Set(component_map.entities);
    });

    return setIntersection(...entity_sets);
  }

  /**
   * Retrieves all components associated with a specific entity.
   * @param entity - The entity whose components are being retrieved.
   * @returns An array of components belonging to the specified entity.
   */
  getComponentsForEntity(entity: Entity): Component[] {
    const components: Component[] = [];
    for (const component_map of this._component_maps.values()) {
      const component = component_map.get(entity);
      if (component) {
        components.push(component);
      }
    }
    return components;
  }

  /**
   * Clears all components from the store.
   * This removes all registered component types and their associated data.
   */
  clear(): void {
    this._component_maps.clear();
  }
}
