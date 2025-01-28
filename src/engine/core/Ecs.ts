import CompChild from '../core_components/CompChild';
import CompDrawable from '../core_components/CompDrawable';
import CompFillStyle from '../core_components/CompFillStyle';
import CompLineStyle from '../core_components/CompLineStyle';
import CompMouseSensitive from '../core_components/CompMouseSensitive';
import CompNamed from '../core_components/CompNamed';
import CompParent from '../core_components/CompParent';
import SysDraw from '../core_systems/SysDraw';
import SysMouse from '../core_systems/SysMouse';
import Component, { ComponentClass } from './Component';
import ComponentStore, { Archetype } from './ComponentStore';
import { Entity } from './Entity';
import EntityStore from './EntityStore';

export default class Ecs {
  private _system_draw: SysDraw | null = null;
  private _system_mouse: SysMouse | null = null;

  constructor(
    private _entity_store: EntityStore,
    private _component_store: ComponentStore,
  ) {
    // Core components are always registered.
    this._registerCoreComponents();
  }

  /**
   * Adds the core system for drawing entities to the ECS.
   */
  public addDraw(): void {
    if (!this._system_draw) {
      this._system_draw = new SysDraw();
    }
  }

  /**
   * Adds the core system for handling mouse input to the ECS,
   */
  public addMouse(): void {
    if (!this._system_mouse) {
      /* Do not move this to the constructor! The Engine.Input object will not
       * yet be instantiated and things will fail. */
      this._system_mouse = new SysMouse();
    }
  }

  /**
   * Registers all core components.
   */
  private _registerCoreComponents(): void {
    this.registerComponent(CompChild);
    this.registerComponent(CompDrawable);
    this.registerComponent(CompFillStyle);
    this.registerComponent(CompLineStyle);
    this.registerComponent(CompMouseSensitive);
    this.registerComponent(CompNamed);
    this.registerComponent(CompParent);
  }

  // Temporary until we have a system handler.
  /**
   * @returns {SysDraw | null} the draw system if it exists.
   */
  public getDrawSystem(): SysDraw | null {
    return this._system_draw;
  }

  /**
   * @returns {SysMouse | null} the mouse handling system if it exists.
   */
  public getMouseSystem(): SysMouse | null {
    return this._system_mouse;
  }

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
      this._system_draw?.cleanup(drawable);
    }

    // Remove all components
    const components = this._component_store.getComponentsForEntity(entity);

    for (const component of components) {
      const component_class =
        component.constructor as ComponentClass<Component>;
      this._component_store.removeComponent(entity, component_class);
    }

    this._entity_store.removeEntity(entity);
  }

  getAllEntities(): Entity[] {
    return this._entity_store.getAllEntities();
  }

  registerComponent<T extends Component>(
    component_class: ComponentClass<T>,
  ): void {
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
    component_class: ComponentClass<T>,
  ): T | undefined {
    return this._component_store.getComponent(entity, component_class);
  }

  removeComponent<T extends Component>(
    entity: Entity,
    component_class: ComponentClass<T>,
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

  getEntitiesWithComponent<T extends Component>(
    component_class: ComponentClass<T>,
  ): Set<Entity> {
    return this._component_store.getEntitiesWithComponent(component_class);
  }

  getEntitiesWithArchetype(...component_classes: Archetype): Set<Entity> {
    return this._component_store.getEntitiesWithArchetype(...component_classes);
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
