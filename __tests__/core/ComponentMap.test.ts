import { Component } from '../../src/engine/core/Component';
import ComponentMap from '../../src/engine/core/ComponentMap';
import { Entity } from '../../src/engine/core/Entity';

class MockComponent extends Component {
  constructor(public value: number) {
    super();
  }
}

describe('ComponentMap', () => {
  let componentMap: ComponentMap<MockComponent>;

  beforeEach(() => {
    componentMap = new ComponentMap<MockComponent>(MockComponent.name);
  });

  it('should throw an error if an invalid component is added', () => {
    const componentMap = new ComponentMap<MockComponent>('MockComponent');
    const invalidComponent = null as unknown as MockComponent;

    expect(() => {
      componentMap.add(1, invalidComponent);
    }).toThrow('Invalid component provided for entity 1.');
  });

  test('adds component to entitiy', () => {
    const entity: Entity = 1;
    const component = new MockComponent(10);

    componentMap.add(entity, component);
    expect(componentMap.has(entity)).toBe(true);
    expect(componentMap.get(entity)).toBe(component);
  });

  test('allows overwriting components when specified', () => {
    const entity: Entity = 1;
    const component1 = new MockComponent(10);
    const component2 = new MockComponent(20);

    componentMap.add(entity, component1);
    componentMap.add(entity, component2, true);

    expect(componentMap.get(entity)).toBe(component2);
  });

  test('throws error when adding component without overwrite', () => {
    const entity: Entity = 1;
    const component = new MockComponent(10);

    componentMap.add(entity, component);

    expect(() => {
      componentMap.add(entity, new MockComponent(20));
    }).toThrow(
      `Could not add component to entity ${entity} (entity already has component of type MockComponent).`,
    );
  });

  test('checks if an entity has a component', () => {
    const entity: Entity = 1;
    expect(componentMap.has(entity)).toBe(false);

    componentMap.add(entity, new MockComponent(10));
    expect(componentMap.has(entity)).toBe(true);
  });

  test('retrieves a component for an entity', () => {
    const entity: Entity = 1;
    const component = new MockComponent(10);

    componentMap.add(entity, component);
    expect(componentMap.get(entity)).toBe(component);
  });

  test('returns undefined for nonexistent components', () => {
    const entity: Entity = 1;
    expect(componentMap.get(entity)).toBeUndefined();
  });

  test('deletes a component for an entity', () => {
    const entity: Entity = 1;
    const component = new MockComponent(10);

    componentMap.add(entity, component);
    componentMap.delete(entity);

    expect(componentMap.has(entity)).toBe(false);
  });

  test('throws error when deleting a nonexistent component', () => {
    const entity: Entity = 1;

    expect(() => {
      componentMap.delete(entity);
    }).toThrow(
      `Could not delete component of type MockComponent for entity ${entity} (component does not exist).`,
    );
  });

  test('clears all components', () => {
    componentMap.add(1, new MockComponent(10));
    componentMap.add(2, new MockComponent(20));

    componentMap.clear();

    expect(componentMap.isEmpty()).toBe(true);
    expect(componentMap.size()).toBe(0);
    expect(componentMap.getEntities()).toEqual([]);
    expect(componentMap.getComponents()).toEqual([]);
  });

  test('checks if the map is empty', () => {
    expect(componentMap.isEmpty()).toBe(true);

    componentMap.add(1, new MockComponent(10));
    expect(componentMap.isEmpty()).toBe(false);
  });

  test('gets the size of the map', () => {
    expect(componentMap.size()).toBe(0);

    componentMap.add(1, new MockComponent(10));
    expect(componentMap.size()).toBe(1);

    componentMap.add(2, new MockComponent(20));
    expect(componentMap.size()).toBe(2);
  });

  test('retrieves all entities with components', () => {
    componentMap.add(1, new MockComponent(10));
    componentMap.add(2, new MockComponent(20));

    expect(componentMap.getEntities()).toEqual([1, 2]);
  });

  test('retrieves all components', () => {
    const component1 = new MockComponent(10);
    const component2 = new MockComponent(20);

    componentMap.add(1, component1);
    componentMap.add(2, component2);

    expect(componentMap.getComponents()).toEqual([component1, component2]);
  });

  test('updates cache on add and delete', () => {
    componentMap.add(1, new MockComponent(10));
    expect(componentMap.getEntities()).toEqual([1]);

    componentMap.add(2, new MockComponent(20));
    expect(componentMap.getEntities()).toEqual([1, 2]);

    componentMap.delete(1);
    expect(componentMap.getEntities()).toEqual([2]);
  });
});
