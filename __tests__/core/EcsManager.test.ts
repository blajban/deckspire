import Component from '../../src/engine/core/Component';
import EcsManager from '../../src/engine/core/EcsManager';
import EntityStore from '../../src/engine/core/EntityStore';
import AssetStore from '../../src/engine/core/AssetStore';
import SystemManager from '../../src/engine/core/SystemManager';
import ComponentStore from '../../src/engine/core/ComponentStore';
import CoreScene from '../../src/engine/core/CoreScene';
import PhaserContext from '../../src/engine/core/PhaserContext';
import Archetype from '../../src/engine/core/Archetype';

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
    const asset_store = new AssetStore();
    const system_manager = new SystemManager();
    ecs = new EcsManager(
      entity_store,
      component_store,
      system_manager,
      asset_store,
    );

    const core_scene = new CoreScene();
    const mock_context = {} as unknown as PhaserContext;
    core_scene.load(ecs, mock_context);
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

  test('should retrieve all entities with a specific component', () => {
    const entity1 = ecs.newEntity();
    const entity2 = ecs.newEntity();

    ecs.addComponent(entity1, new MockComponent(10));
    ecs.addComponent(entity2, new AnotherMockComponent(5));

    const entities_with_position = ecs.getEntitiesAndComponents(MockComponent);
    expect(entities_with_position.keys()).toContain(entity1);
    expect(entities_with_position.keys()).not.toContain(entity2);
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
      new Archetype(MockComponent, AnotherMockComponent),
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
    const old_length = ecs.getAllEntities().length;
    const entity = ecs.newEntity();
    ecs.addComponent(entity, new MockComponent(10));
    ecs.addComponent(entity, new AnotherMockComponent(5));

    ecs.removeEntity(entity);
    expect(ecs.getAllEntities()).toHaveLength(old_length);
  });
});
