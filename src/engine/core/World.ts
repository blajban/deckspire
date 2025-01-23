import CompChild from '../core_components/CompChild';
import CompDrawable from '../core_components/CompDrawable';
import CompFillStyle from '../core_components/CompFillStyle';
import CompLineStyle from '../core_components/CompLineStyle';
import CompParent from '../core_components/CompParent';
import Component, { ComponentID } from './Component';
import ComponentStore from './ComponentStore';
import { Entity } from './Entity';
import EntityStore from './EntityStore';

export default class World {
  private entityStore: EntityStore;
  private componentStore: ComponentStore;

  constructor(entityStore: EntityStore, componentStore: ComponentStore) {
    this.entityStore = entityStore;
    this.componentStore = componentStore;
    // Core components are always registered.
    this.registerComponent(CompParent);
    this.registerComponent(CompChild);
    this.registerComponent(CompDrawable);
    this.registerComponent(CompLineStyle);
    this.registerComponent(CompFillStyle);
  }

  newEntity(): Entity {
    return this.entityStore.newEntity();
  }

  entityExists(entity: Entity): boolean {
    return this.entityStore.entityExists(entity);
  }

  removeEntity(entity: Entity, removeChildren: boolean = true) {
    // Handle children if entity is a parent.
    const parentComp = this.getComponent(entity, CompParent);
    if (parentComp) {
      for (const child of parentComp.children) {
        const childComp = this.getComponent(child, CompChild);
        if (childComp && childComp.parent === entity) {
          if (removeChildren) {
            this.removeEntity(child, true); // Remove the child
            continue;
          }

          this.removeComponent(child, CompChild); // Orphan the child.
        }
      }
    }

    // Remove the parent from its own parent's child list if it is a child.
    const childComp = this.getComponent(entity, CompChild);
    if (childComp) {
      const parent = childComp.parent;
      const parentComp = this.getComponent(parent, CompParent);
      if (parentComp) {
        parentComp.children = parentComp.children.filter((e) => e !== entity);
      }
    }

    // Clean up Phaser objects if the Drawable has created any.
    const drawable = this.getComponent(entity, CompDrawable);
    if (drawable && drawable.draw_object) {
      drawable.draw_object.destroy();
    }

    // Remove all components
    const components = this.componentStore.getComponentsForEntity(entity);

    for (const component of components) {
      const componentClass = component.constructor as ComponentID<Component>;
      this.componentStore.removeComponent(entity, componentClass);
    }

    this.entityStore.removeEntity(entity);
  }

  getAllEntities(): Entity[] {
    return this.entityStore.getAllEntities();
  }

  registerComponent<T extends Component>(componentClass: ComponentID<T>) {
    this.componentStore.registerComponent(componentClass);
  }

  addComponent<T extends Component>(entity: Entity, component: T) {
    const componentType = component.constructor.name;

    if (componentType === CompParent.name || componentType === CompChild.name) {
      throw new Error(
        `Add ${componentType} through the addParentChildRelationship() function.`,
      );
    }

    this.componentStore.addComponent(entity, component);
  }

  addComponents(entity: Entity, ...components: Component[]) {
    for (const component of components) {
      this.addComponent(entity, component);
    }
  }

  getComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentID<T>,
  ): T | undefined {
    return this.componentStore.getComponent(entity, componentClass);
  }

  removeComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentID<T>,
  ) {
    const componentType = this.componentStore.getRegisteredComponentClass(
      componentClass.name,
    );

    if (componentType == CompParent) {
      const parentComp = this.getComponent(entity, CompParent);
      if (parentComp) {
        for (const child of parentComp.children) {
          const childComp = this.getComponent(child, CompChild);
          if (childComp && childComp.parent === entity) {
            this.removeComponent(child, CompChild); // Orphan the child.
          }
        }
      }
    }

    if (componentType == CompChild) {
      const childComp = this.getComponent(entity, CompChild);
      if (childComp) {
        const parent = childComp.parent;
        const parentComp = this.getComponent(parent, CompParent);
        if (parentComp) {
          parentComp.children = parentComp.children.filter((e) => e !== entity);
        }
      }
    }

    this.componentStore.removeComponent(entity, componentClass);
  }

  getEntitiesWithComponent<T extends Component>(
    componentClass: ComponentID<T>,
  ): Entity[] {
    return this.componentStore.getEntitiesWithComponent(componentClass);
  }

  getEntitiesWithArchetype(
    ...componentClasses: Array<ComponentID<Component>>
  ): Entity[] {
    return this.componentStore.getEntitiesWithArchetype(...componentClasses);
  }

  getComponentsForEntity(entity: Entity): Component[] {
    return this.componentStore.getComponentsForEntity(entity);
  }

  /**
   * Adds a parent-child relationship between two entities.
   * - Adds the `childEntity` as a child of the `parentEntity`.
   * - Ensures no cyclic relationships are created in the hierarchy.
   * - Automatically adds the required `CompParent` and `CompChild` components if they don't exist.
   *
   * @param parentEntity - The entity to become the parent.
   * @param childEntity - The entity to become the child.
   * @throws Will throw an error if:
   * - Adding the relationship would create a cycle in the hierarchy.
   * - The `childEntity` already has a parent.
   */
  addParentChildRelationship(parentEntity: Entity, childEntity: Entity) {
    if (this.isAncestor(parentEntity, childEntity)) {
      throw new Error(
        `Cannot add Entity ${childEntity} as a child of Entity ${parentEntity}: it would create a cyclic relationship.`,
      );
    }

    let parentComp = this.getComponent(parentEntity, CompParent);
    if (!parentComp) {
      parentComp = new CompParent([]);
      this.componentStore.addComponent(parentEntity, parentComp);
    }

    parentComp.children.push(childEntity);

    const childComp = this.getComponent(childEntity, CompChild);
    if (childComp) {
      throw new Error(`Entity ${childEntity} already has a parent.`);
    }

    this.componentStore.addComponent(childEntity, new CompChild(parentEntity));
  }

  /**
   * Checks if `potentialAncestor` is an ancestor of `entity`.
   * @param entity - The entity being checked.
   * @param potentialAncestor - The potential ancestor entity.
   * @returns True if `potentialAncestor` is an ancestor of `entity`, false otherwise.
   */
  isAncestor(entity: Entity, potentialAncestor: Entity): boolean {
    let currentEntity: Entity | null = entity;

    while (currentEntity !== null) {
      const childComp: CompChild | undefined = this.getComponent(
        currentEntity,
        CompChild,
      );
      if (!childComp) return false;

      if (childComp.parent === potentialAncestor) return true;

      currentEntity = childComp.parent;
    }

    return false;
  }

  serialize(): string {
    const serializedWorld = this.getAllEntities().map((entity) => {
      const components = this.getComponentsForEntity(entity).map(
        (component) => {
          return {
            type: component.constructor.name,
            data: component.toJSON(),
          };
        },
      );

      return { components };
    });

    return JSON.stringify(serializedWorld);
  }

  deserialize(json: string): void {
    const parsedWorld = JSON.parse(json);

    for (const { components } of parsedWorld) {
      const entity = this.newEntity();

      for (const { type, data } of components) {
        const ComponentClass =
          this.componentStore.getRegisteredComponentClass(type);

        // Add validation(?). Proposed solution:
        // Add an optional static validate function on components.
        // The validate function throws error if invalid data.
        // Deserialize function could handle the error by logging and skipping component.
        const component = new ComponentClass(...Object.values(data));
        this.componentStore.addComponent(entity, component);
      }
    }
  }
}
