import CompChild from '../core_components/CompChild';
import CompDrawable from '../core_components/CompDrawable';
import CompParent from '../core_components/CompParent';
import { ClassType } from '../util/ClassType';
import Component, { ComponentClass } from './Component';
import ComponentStore, { Archetype } from './ComponentStore';
import { Entity } from './Entity';
import EntityStore from './EntityStore';
import { GameContext } from './GameContext';
import GraphicsCache from './GraphicsCache';
import { SystemClass } from './System';
import SystemManager from './SystemManager';

export default class EcsManager {
  private _entity_store = new EntityStore();
  private _component_store = new ComponentStore();
  private _system_manager = new SystemManager();
  private _graphics_cache = new GraphicsCache();

  newEntity(): Entity {
    return this._entity_store.newEntity();
  }

  entityExists(entity: Entity): boolean {
    return this._entity_store.entityExists(entity);
  }

  removeEntity(entity: Entity, should_remove_children: boolean = true): void {
    // Handle children if entity is a parent.
    const parent_comp = this.getComponent(entity, CompParent);
    if (parent_comp) {
      for (const child of parent_comp.children) {
        const child_comp = this.getComponent(child, CompChild);
        if (child_comp && child_comp.parent === entity) {
          if (should_remove_children) {
            this.removeEntity(child, true); // Remove the child
            continue;
          }

          this.removeComponent(child, CompChild); // Orphan the child.
        }
      }
    }

    // Remove the parent from its own parent's child list if it is a child.
    const child_comp = this.getComponent(entity, CompChild);
    if (child_comp) {
      const parent = child_comp.parent;
      const parent_comp = this.getComponent(parent, CompParent);
      if (parent_comp) {
        parent_comp.children = parent_comp.children.filter((e) => e !== entity);
      }
    }

    // Clean up Phaser objects if the Drawable has created any.
    const drawable = this.getComponent(entity, CompDrawable);
    if (drawable) {
      this._cleanUpAfterPhaser(drawable);
    }

    // Remove all components
    const components = this._component_store.getComponentsForEntity(entity);

    for (const component of components) {
      const component_class = component.constructor as ComponentClass;
      this._component_store.removeComponent(entity, component_class);
    }

    this._entity_store.removeEntity(entity);
  }

  getAllEntities(): Entity[] {
    return this._entity_store.getAllEntities();
  }

  registerComponent<T extends Component>(component_class: ClassType<T>): void {
    this._component_store.registerComponent(component_class);
  }

  addComponent<T extends Component>(entity: Entity, component: T): void {
    const component_type = component.constructor.name;

    if (
      component_type === CompParent.name ||
      component_type === CompChild.name
    ) {
      throw new Error(
        `Add ${component_type} through the addParentChildRelationship() function.`,
      );
    }

    this._component_store.addComponent(entity, component);
  }

  addComponents(entity: Entity, ...components: Component[]): void {
    for (const component of components) {
      this.addComponent(entity, component);
    }
  }

  getComponent<T extends Component>(
    entity: Entity,
    component_class: ClassType<T>,
  ): T | undefined {
    return this._component_store.getComponent(entity, component_class);
  }

  removeComponent<T extends Component>(
    entity: Entity,
    component_class: ClassType<T>,
  ): void {
    const component_type = this._component_store.getRegisteredComponentClass(
      component_class.name,
    );

    if (component_type === CompParent) {
      const parent_comp = this.getComponent(entity, CompParent);
      if (parent_comp) {
        for (const child of parent_comp.children) {
          const child_comp = this.getComponent(child, CompChild);
          if (child_comp && child_comp.parent === entity) {
            this.removeComponent(child, CompChild); // Orphan the child.
          }
        }
      }
    }

    if (component_type === CompChild) {
      const child_comp = this.getComponent(entity, CompChild);
      if (child_comp) {
        const parent = child_comp.parent;
        const parent_comp = this.getComponent(parent, CompParent);
        if (parent_comp) {
          parent_comp.children = parent_comp.children.filter(
            (e) => e !== entity,
          );
        }
      }
    }

    this._component_store.removeComponent(entity, component_class);
  }

  getEntitiesAndComponents<T extends Component>(
    component_class: ClassType<T>,
  ): Map<Entity, T> {
    return this._component_store.getEntitiesAndComponents(component_class);
  }

  getEntitiesWithArchetype(archetype: Archetype): Set<Entity> {
    return this._component_store.getEntitiesWithArchetype(archetype);
  }

  getEntityWithArchetype(archetype: Archetype): Entity | undefined {
    return this._component_store
      .getEntitiesWithArchetype(archetype)
      .keys()
      .next().value;
  }

  getComponentsForEntity(entity: Entity): Component[] {
    return this._component_store.getComponentsForEntity(entity);
  }

  /**
   * Adds a parent-child relationship between two entities.
   * - Adds the `childEntity` as a child of the `parentEntity`.
   * - Ensures no cyclic relationships are created in the hierarchy.
   * - Automatically adds the required `CompParent` and `CompChild` components if they don't exist.
   *
   * @param parent_entity - The entity to become the parent.
   * @param child_entity - The entity to become the child.
   * @throws Will throw an error if:
   * - Adding the relationship would create a cycle in the hierarchy.
   * - The `childEntity` already has a parent.
   */
  addParentChildRelationship(
    parent_entity: Entity,
    child_entity: Entity,
  ): void {
    if (this.isAncestor(parent_entity, child_entity)) {
      throw new Error(
        `Cannot add Entity ${child_entity} as a child of Entity ${parent_entity}: it would create a cyclic relationship.`,
      );
    }

    let parent_comp = this.getComponent(parent_entity, CompParent);
    if (!parent_comp) {
      parent_comp = new CompParent([]);
      this._component_store.addComponent(parent_entity, parent_comp);
    }

    parent_comp.children.push(child_entity);

    const child_comp = this.getComponent(child_entity, CompChild);
    if (child_comp) {
      throw new Error(`Entity ${child_entity} already has a parent.`);
    }

    this._component_store.addComponent(
      child_entity,
      new CompChild(parent_entity),
    );
  }

  /**
   * Checks if `potentialAncestor` is an ancestor of `entity`.
   * @param entity - The entity being checked.
   * @param potential_ancestor - The potential ancestor entity.
   * @returns True if `potentialAncestor` is an ancestor of `entity`, false otherwise.
   */
  isAncestor(entity: Entity, potential_ancestor: Entity): boolean {
    let current_entity: Entity | null = entity;

    while (current_entity !== null) {
      const child_comp: CompChild | undefined = this.getComponent(
        current_entity,
        CompChild,
      );
      if (!child_comp) {
        return false;
      }

      if (child_comp.parent === potential_ancestor) {
        return true;
      }

      current_entity = child_comp.parent;
    }

    return false;
  }

  public registerSystem(
    system_class: SystemClass,
    execute_after: SystemClass[],
    execute_before: SystemClass[] = [],
  ): void {
    this._system_manager.registerSystem(
      system_class,
      execute_after,
      execute_before,
    );
  }

  public activateSystem(system_class: SystemClass): void {
    this._system_manager.activateSystem(system_class);
  }

  public get graphics_cache(): GraphicsCache {
    return this._graphics_cache;
  }

  /**
   * Since we are using Phaser the graphics objects need to be
   *  de-registered from Phaser as the componenet is removed.
   */
  private _cleanUpAfterPhaser(drawable: CompDrawable): void {
    const component_cache = this._graphics_cache.getComponentCache(drawable);
    if (!component_cache) {
      return;
    }
    component_cache.graphics_object?.destroy();
    this._graphics_cache.deleteCache(drawable);
  }

  public update(context: GameContext, time: number, delta: number): void {
    this._system_manager.update(context, time, delta);
  }

  serialize(): string {
    const serialized_ecs = this.getAllEntities().map((entity) => {
      const components = this.getComponentsForEntity(entity).map(
        (component) => {
          return {
            type: component.constructor.name,
            data: component.toJson(),
          };
        },
      );

      return { components };
    });

    return JSON.stringify(serialized_ecs);
  }

  deserialize(json: string): void {
    const parsed_ecs = JSON.parse(json);

    for (const { components } of parsed_ecs) {
      const entity = this.newEntity();

      for (const { type, data } of components) {
        const component_class =
          this._component_store.getRegisteredComponentClass(type);

        // Add validation(?). Proposed solution:
        // Add an optional static validate function on components.
        // The validate function throws error if invalid data.
        // Deserialize function could handle the error by logging and skipping component.
        const component = new component_class(...Object.values(data));
        this._component_store.addComponent(entity, component);
      }
    }
  }
}
