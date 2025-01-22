import { Component } from '../../src/engine/core/Component';
import ComponentStore from '../../src/engine/core/ComponentStore';
import { Entity } from '../../src/engine/core/Entity';

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

describe('ComponentStore', () => {
  let store: ComponentStore;

  beforeEach(() => {
    store = new ComponentStore();
  });

  test('registerComponent should register a new component type', () => {
    expect(() => store.registerComponent(MockComponent)).not.toThrow();
  });

  test('registerComponent should handle duplicate registrations gracefully', () => {
    expect(() => {
      store.registerComponent(MockComponent);
      store.registerComponent(MockComponent);
    }).not.toThrow();
  });

  it('should return the registered component class when it exists', () => {
    store.registerComponent(MockComponent);
    const componentClass = store.getRegisteredComponentClass('MockComponent');

    expect(componentClass).toBe(MockComponent);
  });

  it('should throw an error if the component type is not registered', () => {
    expect(() => {
      store.getRegisteredComponentClass('NonExistentComponent');
    }).toThrow('Component type NonExistentComponent is not registered.');
  });

  it('should work with multiple registered components', () => {
    store.registerComponent(MockComponent);
    store.registerComponent(AnotherMockComponent);

    // Retrieve and assert both components
    const mockComponentClass =
      store.getRegisteredComponentClass('MockComponent');
    const anotherMockComponentClass = store.getRegisteredComponentClass(
      'AnotherMockComponent',
    );

    expect(mockComponentClass).toBe(MockComponent);
    expect(anotherMockComponentClass).toBe(AnotherMockComponent);
  });

  test('addComponent should add a component to an entity', () => {
    const entity: Entity = 1;
    store.registerComponent(MockComponent);

    const mockComponent = new MockComponent(10);
    expect(() => store.addComponent(entity, mockComponent)).not.toThrow();
  });

  test('addComponent should throw an error if the component type is not registered', () => {
    const entity: Entity = 1;
    const mockComponent = new MockComponent(10);

    expect(() => store.addComponent(entity, mockComponent)).toThrow(
      `Component type MockComponent must be registered first (add component)`,
    );
  });

  test('getComponent should retrieve a component for an entity', () => {
    const entity: Entity = 1;
    store.registerComponent(MockComponent);

    const mockComponent = new MockComponent(10);
    store.addComponent(entity, mockComponent);

    const retrieved = store.getComponent(entity, MockComponent);
    expect(retrieved).toBe(mockComponent);
  });

  test('getComponent should throw an error if the component type is not registered', () => {
    const entity: Entity = 1;

    expect(() => store.getComponent(entity, MockComponent)).toThrow(
      `Component type MockComponent must be registered first (get component)`,
    );
  });

  test('removeComponent should remove a component from an entity', () => {
    const entity: Entity = 1;
    store.registerComponent(MockComponent);

    const mockComponent = new MockComponent(10);
    store.addComponent(entity, mockComponent);

    expect(() => store.removeComponent(entity, MockComponent)).not.toThrow();
    expect(store.getComponent(entity, MockComponent)).toBeUndefined();
  });

  test('removeComponent should throw an error if the component type is not registered', () => {
    const entity: Entity = 1;

    expect(() => store.removeComponent(entity, MockComponent)).toThrow(
      `Component type MockComponent must be registered first (remove component)`,
    );
  });

  test('getEntitiesWithComponent should return entities with a specific component type', () => {
    const entity1: Entity = 1;
    const entity2: Entity = 2;

    store.registerComponent(MockComponent);

    store.addComponent(entity1, new MockComponent(10));
    store.addComponent(entity2, new MockComponent(30));

    const entities = store.getEntitiesWithComponent(MockComponent);
    expect(entities).toContain(entity1);
    expect(entities).toContain(entity2);
  });

  test('getEntitiesWithArchetype should return entities with all specified component types', () => {
    const entity1: Entity = 1;
    const entity2: Entity = 2;

    store.registerComponent(MockComponent);
    store.registerComponent(AnotherMockComponent);

    store.addComponent(entity1, new MockComponent(10));
    store.addComponent(entity1, new AnotherMockComponent(45));
    store.addComponent(entity2, new MockComponent(30));

    const archetypeEntities = store.getEntitiesWithArchetype(
      MockComponent,
      AnotherMockComponent,
    );
    expect(archetypeEntities).toContain(entity1);
    expect(archetypeEntities).not.toContain(entity2);
  });

  test("getEntitiesWithArchetype should throw when the component type isn't registered", () => {
    const entity: Entity = 1;

    store.registerComponent(MockComponent);
    store.addComponent(entity, new MockComponent(10));

    expect(() =>
      store.getEntitiesWithArchetype(MockComponent, AnotherMockComponent),
    ).toThrow(
      `Component type AnotherMockComponent must be registered first (get entities with archetype)`,
    );
  });

  test('getComponentsForEntity should return all components for an entity', () => {
    const entity: Entity = 1;

    store.registerComponent(MockComponent);
    store.registerComponent(AnotherMockComponent);

    const mockComponent = new MockComponent(10);
    const anotherMock = new AnotherMockComponent(45);

    store.addComponent(entity, mockComponent);
    store.addComponent(entity, anotherMock);

    const components = store.getComponentsForEntity(entity);
    expect(components).toContain(mockComponent);
    expect(components).toContain(anotherMock);
  });

  test('getEntitiesWithArchetype should return an empty array for no component types', () => {
    expect(store.getEntitiesWithArchetype()).toHaveLength(0);
  });

  test('clear should remove all components and registered component types', () => {
    const entity: Entity = 1;

    store.registerComponent(MockComponent);
    store.addComponent(entity, new MockComponent(10));

    store.clear();

    expect(() => store.getComponent(entity, MockComponent)).toThrow(
      `Component type MockComponent must be registered first (get component)`,
    );

    expect(() => store.getEntitiesWithComponent(MockComponent)).toThrow(
      `Component type MockComponent must be registered first (get entities with component)`,
    );
  });
});
