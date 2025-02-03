import CompChild from '../../src/engine/core_components/CompChild';
import CompParent from '../../src/engine/core_components/CompParent';
import Component from '../../src/engine/core/Component';
import ComponentStore from '../../src/engine/core/ComponentStore';
import EntityStore from '../../src/engine/core/EntityStore';
import EcsManager from '../../src/engine/core/EcsManager';

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

describe('ECS', () => {
  let ecs: EcsManager;

  beforeEach(() => {
    const entity_store = new EntityStore();
    const component_store = new ComponentStore();
    ecs = new EcsManager(entity_store, component_store);

    ecs.registerComponent(CompParent);
    ecs.registerComponent(CompChild);
    ecs.registerComponent(MockComponent);
    ecs.registerComponent(AnotherMockComponent);
  });

  test('should create a new entity', () => {
    const entity = ecs.newEntity();
    expect(ecs.entityExists(entity)).toBe(true);
  });

  it('should add multiple components to an entity.', () => {
    const entity = ecs.newEntity();
    ecs.addComponents(
      entity,
      new MockComponent(2),
      new AnotherMockComponent(3),
    );
    expect(ecs.entityExists(entity)).toBeTruthy();
    expect(ecs.getComponent(entity, MockComponent)).toBeInstanceOf(
      MockComponent,
    );
    expect(ecs.getComponent(entity, AnotherMockComponent)).toBeInstanceOf(
      AnotherMockComponent,
    );
  });

  test('should remove an entity and its components', () => {
    const entity = ecs.newEntity();
    ecs.addComponent(entity, new MockComponent(10));
    ecs.addComponent(entity, new AnotherMockComponent(5));

    expect(ecs.entityExists(entity)).toBe(true);
    expect(ecs.getComponent(entity, MockComponent)).toBeInstanceOf(
      MockComponent,
    );
    expect(ecs.getComponent(entity, AnotherMockComponent)).toBeInstanceOf(
      AnotherMockComponent,
    );

    ecs.removeEntity(entity);

    expect(ecs.entityExists(entity)).toBe(false);
    expect(ecs.getComponent(entity, MockComponent)).toBeUndefined();
    expect(ecs.getComponent(entity, AnotherMockComponent)).toBeUndefined();
  });

  it('should not add a parent to a child that already has one.', () => {
    const parent1 = ecs.newEntity();
    const parent2 = ecs.newEntity();
    const child = ecs.newEntity();

    ecs.addParentChildRelationship(parent1, child);
    expect(() => ecs.addParentChildRelationship(parent2, child)).toThrow(
      'already has a parent',
    );
  });

  test('removes parent entity and its children when removeChildren is true', () => {
    const parent_entity = ecs.newEntity();
    const child_entity1 = ecs.newEntity();
    const child_entity2 = ecs.newEntity();

    ecs.addParentChildRelationship(parent_entity, child_entity1);
    ecs.addParentChildRelationship(parent_entity, child_entity2);

    ecs.removeEntity(parent_entity, true);

    expect(ecs.entityExists(parent_entity)).toBe(false);
    expect(ecs.entityExists(child_entity1)).toBe(false);
    expect(ecs.entityExists(child_entity2)).toBe(false);
  });

  test('removes parent entity but orphans children when removeChildren is false', () => {
    const parent_entity = ecs.newEntity();
    const child_entity = ecs.newEntity();

    ecs.addParentChildRelationship(parent_entity, child_entity);

    ecs.removeEntity(parent_entity, false);

    expect(ecs.entityExists(parent_entity)).toBe(false);
    expect(ecs.entityExists(child_entity)).toBe(true);
    const orphaned_child = ecs.getComponent(child_entity, CompChild);
    expect(orphaned_child).toBeUndefined();
  });

  test('removes child entity and updates parent children list', () => {
    const parent_entity = ecs.newEntity();
    const child_entity = ecs.newEntity();

    ecs.addParentChildRelationship(parent_entity, child_entity);

    ecs.removeEntity(child_entity);

    expect(ecs.entityExists(child_entity)).toBe(false);
    const parent_comp = ecs.getComponent(parent_entity, CompParent);
    expect(parent_comp?.children).not.toContain(child_entity);
  });

  test('should add and retrieve components for an entity', () => {
    const entity = ecs.newEntity();
    const position = new MockComponent(10);

    ecs.addComponent(entity, position);
    const retrieved_position = ecs.getComponent(entity, MockComponent);

    expect(retrieved_position).toBe(position);
    expect(retrieved_position?.value).toBe(10);
  });

  test('should remove a specific component from an entity', () => {
    const entity = ecs.newEntity();
    ecs.addComponent(entity, new MockComponent(10));
    expect(ecs.getComponent(entity, MockComponent)).toBeInstanceOf(
      MockComponent,
    );

    ecs.removeComponent(entity, MockComponent);
    expect(ecs.getComponent(entity, MockComponent)).toBeUndefined();
  });

  test('should throw when adding a parent or child component directly', () => {
    const entity = ecs.newEntity();

    expect(() => {
      ecs.addComponent(entity, new CompParent([1]));
    }).toThrow(
      'Add CompParent through the addParentChildRelationship() function.',
    );

    expect(() => {
      ecs.addComponent(entity, new CompChild(1));
    }).toThrow(
      'Add CompChild through the addParentChildRelationship() function.',
    );
  });

  test('removes parent component and orphans its children', () => {
    const parent_entity = ecs.newEntity();
    const child_entity = ecs.newEntity();

    ecs.addParentChildRelationship(parent_entity, child_entity);

    ecs.removeComponent(parent_entity, CompParent);

    const parent_comp = ecs.getComponent(parent_entity, CompParent);
    expect(parent_comp).toBeUndefined();
    const orphaned_child = ecs.getComponent(child_entity, CompChild);
    expect(orphaned_child).toBeUndefined();
    expect(ecs.entityExists(child_entity)).toBeTruthy();
  });

  test('removes child component but keeps child entity intact', () => {
    const parent_entity = ecs.newEntity();
    const child_entity = ecs.newEntity();

    ecs.addParentChildRelationship(parent_entity, child_entity);

    ecs.removeComponent(child_entity, CompChild);

    const parent_comp = ecs.getComponent(parent_entity, CompParent);
    expect(parent_comp?.children).toHaveLength(0);
    const child_comp = ecs.getComponent(child_entity, CompChild);
    expect(child_comp).toBeUndefined();
    expect(ecs.entityExists(child_entity)).toBeTruthy();
  });

  test('should retrieve all entities with a specific component', () => {
    const entity1 = ecs.newEntity();
    const entity2 = ecs.newEntity();

    ecs.addComponent(entity1, new MockComponent(10));
    ecs.addComponent(entity2, new AnotherMockComponent(5));

    const entities_with_position = ecs.getEntitiesAndComponents(MockComponent);
    expect(entities_with_position).toContain(entity1);
    expect(entities_with_position).not.toContain(entity2);
  });

  test('should retrieve all entities matching an archetype', () => {
    const entity1 = ecs.newEntity();
    const entity2 = ecs.newEntity();
    const entity3 = ecs.newEntity();

    ecs.addComponent(entity1, new MockComponent(10));
    ecs.addComponent(entity1, new AnotherMockComponent(5));

    ecs.addComponent(entity2, new MockComponent(15));

    ecs.addComponent(entity3, new AnotherMockComponent(10));

    const entities_with_archetype = ecs.getEntitiesWithArchetype(
      MockComponent,
      AnotherMockComponent,
    );
    expect(entities_with_archetype).toContain(entity1);
    expect(entities_with_archetype).not.toContain(entity2);
    expect(entities_with_archetype).not.toContain(entity3);
  });

  test('should retrieve all components for an entity', () => {
    const entity = ecs.newEntity();
    ecs.addComponent(entity, new MockComponent(10));
    ecs.addComponent(entity, new AnotherMockComponent(5));

    const components = ecs.getComponentsForEntity(entity);
    expect(components).toHaveLength(2);
    expect(components).toContainEqual(expect.any(MockComponent));
    expect(components).toContainEqual(expect.any(AnotherMockComponent));
  });

  test('should retrieve all entities', () => {
    const entity1 = ecs.newEntity();
    const entity2 = ecs.newEntity();
    const all_entities = ecs.getAllEntities();

    expect(all_entities).toContain(entity1);
    expect(all_entities).toContain(entity2);
  });

  test('throws error when attempting to create a cyclic relationship', () => {
    const entity1 = ecs.newEntity();
    const entity2 = ecs.newEntity();

    ecs.addParentChildRelationship(entity1, entity2);

    expect(() => {
      ecs.addParentChildRelationship(entity2, entity1);
    }).toThrow(
      `Cannot add Entity ${entity1} as a child of Entity ${entity2}: it would create a cyclic relationship.`,
    );
  });

  test('should clear all entities and components', () => {
    const entity = ecs.newEntity();
    ecs.addComponent(entity, new MockComponent(10));
    ecs.addComponent(entity, new AnotherMockComponent(5));

    ecs.removeEntity(entity);
    expect(ecs.getAllEntities()).toHaveLength(0);
  });
});
