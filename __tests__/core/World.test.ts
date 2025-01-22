import { Component } from '../../src/engine/core/Component';
import ComponentStore from '../../src/engine/core/ComponentStore';
import EntityStore from '../../src/engine/core/EntityStore';
import { World } from '../../src/engine/core/World';


class MockComponent extends Component {
  constructor(public value: number) {
    super();
  }
}

class AnotherMockComponent extends Component {
  constructor(public value: number) {
    super();
  }
}

describe('World', () => {
  let world: World;

  beforeEach(() => {
    const entityStore = new EntityStore();
    const componentStore = new ComponentStore();
    world = new World(entityStore, componentStore);

    world.registerComponent(MockComponent);
    world.registerComponent(AnotherMockComponent);
  });

  test('should create a new entity', () => {
    const entity = world.newEntity();
    expect(world.entityExists(entity)).toBe(true);
  });

  test('should remove an entity and its components', () => {
    const entity = world.newEntity();
    world.addComponent(entity, new MockComponent(10));
    world.addComponent(entity, new AnotherMockComponent(5));

    expect(world.entityExists(entity)).toBe(true);
    expect(world.getComponent(entity, MockComponent)).toBeInstanceOf(MockComponent);
    expect(world.getComponent(entity, AnotherMockComponent)).toBeInstanceOf(AnotherMockComponent);

    world.removeEntity(entity);

    expect(world.entityExists(entity)).toBe(false);
    expect(world.getComponent(entity, MockComponent)).toBeUndefined();
    expect(world.getComponent(entity, AnotherMockComponent)).toBeUndefined();
  });

  test('should add and retrieve components for an entity', () => {
    const entity = world.newEntity();
    const position = new MockComponent(10);

    world.addComponent(entity, position);
    const retrievedPosition = world.getComponent(entity, MockComponent);

    expect(retrievedPosition).toBe(position);
    expect(retrievedPosition?.value).toBe(10);
  });

  test('should remove a specific component from an entity', () => {
    const entity = world.newEntity();
    world.addComponent(entity, new MockComponent(10));
    expect(world.getComponent(entity, MockComponent)).toBeInstanceOf(MockComponent);

    world.removeComponent(entity, MockComponent);
    expect(world.getComponent(entity, MockComponent)).toBeUndefined();
  });

  test('should retrieve all entities with a specific component', () => {
    const entity1 = world.newEntity();
    const entity2 = world.newEntity();

    world.addComponent(entity1, new MockComponent(10));
    world.addComponent(entity2, new AnotherMockComponent(5));

    const entitiesWithPosition = world.getEntitiesWithComponent(MockComponent);
    expect(entitiesWithPosition).toContain(entity1);
    expect(entitiesWithPosition).not.toContain(entity2);
  });

  test('should retrieve all entities matching an archetype', () => {
    const entity1 = world.newEntity();
    const entity2 = world.newEntity();
    const entity3 = world.newEntity();

    world.addComponent(entity1, new MockComponent(10));
    world.addComponent(entity1, new AnotherMockComponent(5));

    world.addComponent(entity2, new MockComponent(15));

    world.addComponent(entity3, new AnotherMockComponent(10));

    const entitiesWithArchetype = world.getEntitiesWithArchetype(MockComponent, AnotherMockComponent);
    expect(entitiesWithArchetype).toContain(entity1);
    expect(entitiesWithArchetype).not.toContain(entity2);
    expect(entitiesWithArchetype).not.toContain(entity3);
  });

  test('should retrieve all components for an entity', () => {
    const entity = world.newEntity();
    world.addComponent(entity, new MockComponent(10));
    world.addComponent(entity, new AnotherMockComponent(5));

    const components = world.getComponentsForEntity(entity);
    expect(components).toHaveLength(2);
    expect(components).toContainEqual(expect.any(MockComponent));
    expect(components).toContainEqual(expect.any(AnotherMockComponent));
  });

  test('should retrieve all entities', () => {
    const entity1 = world.newEntity();
    const entity2 = world.newEntity();
    const allEntities = world.getAllEntities();

    expect(allEntities).toContain(entity1);
    expect(allEntities).toContain(entity2);
  });

  test('should clear all entities and components', () => {
    const entity = world.newEntity();
    world.addComponent(entity, new MockComponent(10));
    world.addComponent(entity, new AnotherMockComponent(5));

    world.removeEntity(entity);
    expect(world.getAllEntities()).toHaveLength(0);
  });
});
