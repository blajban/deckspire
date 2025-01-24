import Component, { ComponentClass } from './Component';
import ComponentMap from './ComponentMap';
import { Entity } from './Entity';

/**
 * The ComponentStore manages all components.
 * It keeps a map of component types to their corresponding ComponentMaps.
 */
export default class ComponentStore {
  private componentMaps: Map<string, ComponentMap<Component>> = new Map();
  private componentRegistry: Map<string, ComponentClass<Component>> = new Map();

  /**
   * Registers a new component type.
   * This must be called before adding components of this type.
   * @param componentClass - The component class to be registered.
   */
  registerComponent<T extends Component>(componentClass: ComponentClass<T>) {
    const name = componentClass.name;

    if (!this.componentRegistry.has(name) && !this.componentMaps.has(name)) {
      this.componentRegistry.set(name, componentClass);
      this.componentMaps.set(name, new ComponentMap(name));
    }
  }

  /**
   * Retrieves the registered component class for a given type.
   * @param type - The string identifier of the component type.
   * @returns The constructor of the registered component class.
   * @throws Will throw an error if the specified component type is not registered.
   */
  getRegisteredComponentClass(type: string): ComponentClass<Component> {
    const componentClass = this.componentRegistry.get(type);
    if (!componentClass) {
      throw new Error(`Component type ${type} is not registered.`);
    }
    return componentClass;
  }

  /**
   * Adds a component to an entity.
   * @param entity - The entity to which the component will be added.
   * @param component - The component instance to add.
   * @throws Will throw an error if the component type has not been registered.
   */
  addComponent<T extends Component>(entity: Entity, component: T) {
    const componentType = component.constructor.name;
    const componentMap = this.componentMaps.get(
      componentType,
    ) as ComponentMap<T>;
    if (!componentMap) {
      throw new Error(
        `Component type ${componentType} must be registered first (add component)`,
      );
    }

    componentMap.add(entity, component);
  }

  /**
   * Retrieves a component of a specific type for a given entity.
   * @param entity - The entity whose component is being retrieved.
   * @param componentClass - The type of component to retrieve.
   * @returns The component if it exists, otherwise `undefined`.
   * @throws Will throw an error if the component type has not been registered.
   */
  getComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentClass<T>,
  ): T | undefined {
    const componentType = componentClass.name;
    const componentMap = this.componentMaps.get(componentType);
    if (!componentMap) {
      throw new Error(
        `Component type ${componentType} must be registered first (get component)`,
      );
    }
    return componentMap.get(entity) as T;
  }

  /**
   * Removes a component of a specific type from an entity.
   * @param entity - The entity whose component is being removed.
   * @param componentClass - The type of component to remove.
   * @throws Will throw an error if the component type has not been registered.
   */
  removeComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentClass<T>,
  ) {
    const componentType = componentClass.name;
    const componentMap = this.componentMaps.get(componentType);
    if (!componentMap) {
      throw new Error(
        `Component type ${componentType} must be registered first (remove component)`,
      );
    }

    componentMap.delete(entity);
  }

  /**
   * Retrieves all entities that have a specific component type.
   * @param componentClass - The type of the component to query.
   * @returns An array of entity IDs that have the specified component type.
   * @throws Will throw an error if the component type has not been registered.
   */
  getEntitiesWithComponent<T extends Component>(
    componentClass: ComponentClass<T>,
  ): Entity[] {
    const componentType = componentClass.name;
    const componentMap = this.componentMaps.get(componentType);
    if (!componentMap) {
      throw new Error(
        `Component type ${componentType} must be registered first (get entities with component)`,
      );
    }

    return componentMap.getEntities();
  }

  /**
   * Retrieves all entities that have all the specified component types.
   * @param componentClasses - Component types to query.
   * @returns An array of entities that have all the specified component types.
   * @throws Will throw an error if any of the component types have not been registered.
   */
  getEntitiesWithArchetype(
    ...componentClasses: Array<ComponentClass<Component>>
  ): Entity[] {
    if (componentClasses.length === 0) {
      return [];
    }

    const componentTypes = componentClasses.map((componentClass) => {
      return componentClass.name;
    });

    const entitySets = componentTypes.map((type) => {
      const componentMap = this.componentMaps.get(type);
      if (!componentMap) {
        throw new Error(
          `Component type ${type} must be registered first (get entities with archetype)`,
        );
      }
      return new Set(componentMap.getEntities());
    });

    entitySets.sort((a, b) => a.size - b.size);
    const [smallestSet, ...restSets] = entitySets;
    const intersection = Array.from(smallestSet).filter((entity) =>
      restSets.every((set) => set.has(entity)),
    );

    return intersection;
  }

  /**
   * Retrieves all components associated with a specific entity.
   * @param entity - The entity whose components are being retrieved.
   * @returns An array of components belonging to the specified entity.
   */
  getComponentsForEntity(entity: Entity): Component[] {
    const components: Component[] = [];
    for (const componentMap of this.componentMaps.values()) {
      const component = componentMap.get(entity);
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
  clear() {
    this.componentMaps.clear();
  }
}
