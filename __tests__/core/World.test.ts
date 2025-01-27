import CompChild from '../../src/engine/core_components/CompChild';
import CompParent from '../../src/engine/core_components/CompParent';
import Component from '../../src/engine/core/Component';
import ComponentStore from '../../src/engine/core/ComponentStore';
import EntityStore from '../../src/engine/core/EntityStore';
import World from '../../src/engine/core/World';
import Scene from '../../src/engine/core/Scene';

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

    world.registerComponent(CompParent);
    world.registerComponent(CompChild);
    world.registerComponent(MockComponent);
    world.registerComponent(AnotherMockComponent);
  });

  test('should create a new entity', () => {
    const entity = world.newEntity();
    expect(world.entityExists(entity)).toBe(true);
  });

  it('should add multiple components to an entity.', () => {
    const entity = world.newEntity();
    world.addComponents(
      entity,
      new MockComponent(2),
      new AnotherMockComponent(3),
    );
    expect(world.entityExists(entity)).toBeTruthy();
    expect(world.getComponent(entity, MockComponent)).toBeInstanceOf(
      MockComponent,
    );
    expect(world.getComponent(entity, AnotherMockComponent)).toBeInstanceOf(
      AnotherMockComponent,
    );
  });

  test('should remove an entity and its components', () => {
    const entity = world.newEntity();
    world.addComponent(entity, new MockComponent(10));
    world.addComponent(entity, new AnotherMockComponent(5));

    expect(world.entityExists(entity)).toBe(true);
    expect(world.getComponent(entity, MockComponent)).toBeInstanceOf(
      MockComponent,
    );
    expect(world.getComponent(entity, AnotherMockComponent)).toBeInstanceOf(
      AnotherMockComponent,
    );

    world.removeEntity(entity);

    expect(world.entityExists(entity)).toBe(false);
    expect(world.getComponent(entity, MockComponent)).toBeUndefined();
    expect(world.getComponent(entity, AnotherMockComponent)).toBeUndefined();
  });

  it('should not add a parent to a child that already has one.', () => {
    const parent1 = world.newEntity();
    const parent2 = world.newEntity();
    const child = world.newEntity();

    world.addParentChildRelationship(parent1, child);
    expect(() => world.addParentChildRelationship(parent2, child)).toThrow(
      'already has a parent',
    );
  });

  test('removes parent entity and its children when removeChildren is true', () => {
    const parentEntity = world.newEntity();
    const childEntity1 = world.newEntity();
    const childEntity2 = world.newEntity();

    world.addParentChildRelationship(parentEntity, childEntity1);
    world.addParentChildRelationship(parentEntity, childEntity2);

    world.removeEntity(parentEntity, true);

    expect(world.entityExists(parentEntity)).toBe(false);
    expect(world.entityExists(childEntity1)).toBe(false);
    expect(world.entityExists(childEntity2)).toBe(false);
  });

  test('removes parent entity but orphans children when removeChildren is false', () => {
    const parentEntity = world.newEntity();
    const childEntity = world.newEntity();

    world.addParentChildRelationship(parentEntity, childEntity);

    world.removeEntity(parentEntity, false);

    expect(world.entityExists(parentEntity)).toBe(false);
    expect(world.entityExists(childEntity)).toBe(true);
    const orphanedChild = world.getComponent(childEntity, CompChild);
    expect(orphanedChild).toBeUndefined();
  });

  test('removes child entity and updates parent children list', () => {
    const parentEntity = world.newEntity();
    const childEntity = world.newEntity();

    world.addParentChildRelationship(parentEntity, childEntity);

    world.removeEntity(childEntity);

    expect(world.entityExists(childEntity)).toBe(false);
    const parentComp = world.getComponent(parentEntity, CompParent);
    expect(parentComp?.children).not.toContain(childEntity);
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
    expect(world.getComponent(entity, MockComponent)).toBeInstanceOf(
      MockComponent,
    );

    world.removeComponent(entity, MockComponent);
    expect(world.getComponent(entity, MockComponent)).toBeUndefined();
  });

  test('should throw when adding a parent or child component directly', () => {
    const entity = world.newEntity();

    expect(() => {
      world.addComponent(entity, new CompParent([1]));
    }).toThrow(
      `Add CompParent through the addParentChildRelationship() function.`,
    );

    expect(() => {
      world.addComponent(entity, new CompChild(1));
    }).toThrow(
      `Add CompChild through the addParentChildRelationship() function.`,
    );
  });

  test('removes parent component and orphans its children', () => {
    const parentEntity = world.newEntity();
    const childEntity = world.newEntity();

    world.addParentChildRelationship(parentEntity, childEntity);

    world.removeComponent(parentEntity, CompParent);

    const parentComp = world.getComponent(parentEntity, CompParent);
    expect(parentComp).toBeUndefined();
    const orphanedChild = world.getComponent(childEntity, CompChild);
    expect(orphanedChild).toBeUndefined();
    expect(world.entityExists(childEntity)).toBeTruthy();
  });

  test('removes child component but keeps child entity intact', () => {
    const parentEntity = world.newEntity();
    const childEntity = world.newEntity();

    world.addParentChildRelationship(parentEntity, childEntity);

    world.removeComponent(childEntity, CompChild);

    const parentComp = world.getComponent(parentEntity, CompParent);
    expect(parentComp?.children).toHaveLength(0);
    const childComp = world.getComponent(childEntity, CompChild);
    expect(childComp).toBeUndefined();
    expect(world.entityExists(childEntity)).toBeTruthy();
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

    const entitiesWithArchetype = world.getEntitiesWithArchetype(
      MockComponent,
      AnotherMockComponent,
    );
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

  test('throws error when attempting to create a cyclic relationship', () => {
    const entity1 = world.newEntity();
    const entity2 = world.newEntity();

    world.addParentChildRelationship(entity1, entity2);

    expect(() => {
      world.addParentChildRelationship(entity2, entity1);
    }).toThrow(
      `Cannot add Entity ${entity1} as a child of Entity ${entity2}: it would create a cyclic relationship.`,
    );
  });

  test('should clear all entities and components', () => {
    const entity = world.newEntity();
    world.addComponent(entity, new MockComponent(10));
    world.addComponent(entity, new AnotherMockComponent(5));

    world.removeEntity(entity);
    expect(world.getAllEntities()).toHaveLength(0);
  });
});
