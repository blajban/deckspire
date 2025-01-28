import CompChild from '../../src/engine/core_components/CompChild';
import CompParent from '../../src/engine/core_components/CompParent';
import Component from '../../src/engine/core/Component';
import ComponentStore from '../../src/engine/core/ComponentStore';
import EntityStore from '../../src/engine/core/EntityStore';
import World from '../../src/engine/core/World';

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
    const entity_store = new EntityStore();
    const component_store = new ComponentStore();
    world = new World(entity_store, component_store);

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
    const parent_entity = world.newEntity();
    const child_entity1 = world.newEntity();
    const child_entity2 = world.newEntity();

    world.addParentChildRelationship(parent_entity, child_entity1);
    world.addParentChildRelationship(parent_entity, child_entity2);

    world.removeEntity(parent_entity, true);

    expect(world.entityExists(parent_entity)).toBe(false);
    expect(world.entityExists(child_entity1)).toBe(false);
    expect(world.entityExists(child_entity2)).toBe(false);
  });

  test('removes parent entity but orphans children when removeChildren is false', () => {
    const parent_entity = world.newEntity();
    const child_entity = world.newEntity();

    world.addParentChildRelationship(parent_entity, child_entity);

    world.removeEntity(parent_entity, false);

    expect(world.entityExists(parent_entity)).toBe(false);
    expect(world.entityExists(child_entity)).toBe(true);
    const orphaned_child = world.getComponent(child_entity, CompChild);
    expect(orphaned_child).toBeUndefined();
  });

  test('removes child entity and updates parent children list', () => {
    const parent_entity = world.newEntity();
    const child_entity = world.newEntity();

    world.addParentChildRelationship(parent_entity, child_entity);

    world.removeEntity(child_entity);

    expect(world.entityExists(child_entity)).toBe(false);
    const parent_comp = world.getComponent(parent_entity, CompParent);
    expect(parent_comp?.children).not.toContain(child_entity);
  });

  test('should add and retrieve components for an entity', () => {
    const entity = world.newEntity();
    const position = new MockComponent(10);

    world.addComponent(entity, position);
    const retrieved_position = world.getComponent(entity, MockComponent);

    expect(retrieved_position).toBe(position);
    expect(retrieved_position?.value).toBe(10);
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
      'Add CompParent through the addParentChildRelationship() function.',
    );

    expect(() => {
      world.addComponent(entity, new CompChild(1));
    }).toThrow(
      'Add CompChild through the addParentChildRelationship() function.',
    );
  });

  test('removes parent component and orphans its children', () => {
    const parent_entity = world.newEntity();
    const child_entity = world.newEntity();

    world.addParentChildRelationship(parent_entity, child_entity);

    world.removeComponent(parent_entity, CompParent);

    const parent_comp = world.getComponent(parent_entity, CompParent);
    expect(parent_comp).toBeUndefined();
    const orphaned_child = world.getComponent(child_entity, CompChild);
    expect(orphaned_child).toBeUndefined();
    expect(world.entityExists(child_entity)).toBeTruthy();
  });

  test('removes child component but keeps child entity intact', () => {
    const parent_entity = world.newEntity();
    const child_entity = world.newEntity();

    world.addParentChildRelationship(parent_entity, child_entity);

    world.removeComponent(child_entity, CompChild);

    const parent_comp = world.getComponent(parent_entity, CompParent);
    expect(parent_comp?.children).toHaveLength(0);
    const child_comp = world.getComponent(child_entity, CompChild);
    expect(child_comp).toBeUndefined();
    expect(world.entityExists(child_entity)).toBeTruthy();
  });

  test('should retrieve all entities with a specific component', () => {
    const entity1 = world.newEntity();
    const entity2 = world.newEntity();

    world.addComponent(entity1, new MockComponent(10));
    world.addComponent(entity2, new AnotherMockComponent(5));

    const entities_with_position =
      world.getEntitiesWithComponent(MockComponent);
    expect(entities_with_position).toContain(entity1);
    expect(entities_with_position).not.toContain(entity2);
  });

  test('should retrieve all entities matching an archetype', () => {
    const entity1 = world.newEntity();
    const entity2 = world.newEntity();
    const entity3 = world.newEntity();

    world.addComponent(entity1, new MockComponent(10));
    world.addComponent(entity1, new AnotherMockComponent(5));

    world.addComponent(entity2, new MockComponent(15));

    world.addComponent(entity3, new AnotherMockComponent(10));

    const entities_with_archetype = world.getEntitiesWithArchetype(
      MockComponent,
      AnotherMockComponent,
    );
    expect(entities_with_archetype).toContain(entity1);
    expect(entities_with_archetype).not.toContain(entity2);
    expect(entities_with_archetype).not.toContain(entity3);
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
    const all_entities = world.getAllEntities();

    expect(all_entities).toContain(entity1);
    expect(all_entities).toContain(entity2);
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
