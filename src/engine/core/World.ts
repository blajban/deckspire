import { CompChild } from '../components/CompChild';
import { CompParent } from '../components/CompParent';
import { Component } from './Component';
import ComponentStore from './ComponentStore';
import { Entity } from './Entity';
import EntityStore from './EntityStore';

export class World {
  private entityStore: EntityStore;
  private componentStore: ComponentStore;

  constructor(entityStore: EntityStore, componentStore: ComponentStore) {
    this.entityStore = entityStore;
    this.componentStore = componentStore;
  }

  newEntity(): Entity {
    return this.entityStore.newEntity();
  }

  entityExists(entity: Entity): boolean {
    return this.entityStore.entityExists(entity);
  }

  removeEntity(entity: Entity) {
    const components = this.componentStore.getComponentsForEntity(entity);

    for (const component of components) {
      const componentClass = component.constructor as new (
        ...args: any[]
      ) => Component;
      this.componentStore.removeComponent(entity, componentClass);
    }

    this.entityStore.removeEntity(entity);
  }

  getAllEntities(): Entity[] {
    return this.entityStore.getAllEntities();
  }

  registerComponent<T extends Component>(
    componentClass: new (...args: any[]) => T,
  ) {
    this.componentStore.registerComponent(componentClass);
  }

  addComponent<T extends Component>(entity: Entity, component: T) {
    this.componentStore.addComponent(entity, component);
  }

  getComponent<T extends Component>(
    entity: Entity,
    componentClass: new (...args: any[]) => T,
  ): T | undefined {
    return this.componentStore.getComponent(entity, componentClass);
  }

  removeComponent<T extends Component>(
    entity: Entity,
    componentClass: new (...args: any[]) => T,
  ) {
    this.componentStore.removeComponent(entity, componentClass);
  }

  getEntitiesWithComponent<T extends Component>(
    componentClass: new (...args: any[]) => T,
  ): Entity[] {
    return this.componentStore.getEntitiesWithComponent(componentClass);
  }

  getEntitiesWithArchetype(
    ...componentClasses: Array<new (...args: any[]) => Component>
  ): Entity[] {
    return this.componentStore.getEntitiesWithArchetype(...componentClasses);
  }

  getComponentsForEntity(entity: Entity): Component[] {
    return this.componentStore.getComponentsForEntity(entity);
  }

  addParentChildRelationship(parentEntity: Entity, childEntity: Entity) {
    let parentComp = this.getComponent(parentEntity, CompParent);
    if (!parentComp) {
      parentComp = new CompParent([]);
      this.addComponent(parentEntity, parentComp);
    }

    parentComp.children.push(childEntity);

    const childComp = this.getComponent(childEntity, CompChild);
    if (childComp) {
      throw new Error(`Entity ${childEntity} already has a parent.`)
    }

    this.addComponent(childEntity, new CompChild(parentEntity));
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
        this.addComponent(entity, component);
      }
    }
  }
}
