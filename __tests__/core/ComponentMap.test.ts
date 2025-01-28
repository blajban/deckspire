import Component from '../../src/engine/core/Component';
import ComponentMap from '../../src/engine/core/ComponentMap';
import { Entity } from '../../src/engine/core/Entity';

class MockComponent extends Component {
  constructor(public value: number) {
    super();
  }
}

describe('ComponentMap', () => {
  let component_map: ComponentMap<MockComponent>;

  beforeEach(() => {
    component_map = new ComponentMap<MockComponent>(MockComponent.name);
  });

  it('should throw an error if an invalid component is added', () => {
    const component_map = new ComponentMap<MockComponent>('MockComponent');
    const invalid_component = null as unknown as MockComponent;

    expect(() => {
      component_map.add(1, invalid_component);
    }).toThrow('Invalid component provided for entity 1.');
  });

  test('adds component to entitiy', () => {
    const entity: Entity = 1;
    const component = new MockComponent(10);

    component_map.add(entity, component);
    expect(component_map.has(entity)).toBe(true);
    expect(component_map.get(entity)).toBe(component);
  });

  test('allows overwriting components when specified', () => {
    const entity: Entity = 1;
    const component1 = new MockComponent(10);
    const component2 = new MockComponent(20);

    component_map.add(entity, component1);
    component_map.add(entity, component2, true);

    expect(component_map.get(entity)).toBe(component2);
  });

  test('throws error when adding component without overwrite', () => {
    const entity: Entity = 1;
    const component = new MockComponent(10);

    component_map.add(entity, component);

    expect(() => {
      component_map.add(entity, new MockComponent(20));
    }).toThrow(
      `Could not add component to entity ${entity} (entity already has component of type MockComponent).`,
    );
  });

  test('checks if an entity has a component', () => {
    const entity: Entity = 1;
    expect(component_map.has(entity)).toBe(false);

    component_map.add(entity, new MockComponent(10));
    expect(component_map.has(entity)).toBe(true);
  });

  test('retrieves a component for an entity', () => {
    const entity: Entity = 1;
    const component = new MockComponent(10);

    component_map.add(entity, component);
    expect(component_map.get(entity)).toBe(component);
  });

  test('returns undefined for nonexistent components', () => {
    const entity: Entity = 1;
    expect(component_map.get(entity)).toBeUndefined();
  });

  test('deletes a component for an entity', () => {
    const entity: Entity = 1;
    const component = new MockComponent(10);

    component_map.add(entity, component);
    component_map.delete(entity);

    expect(component_map.has(entity)).toBe(false);
  });

  test('clears all components', () => {
    component_map.add(1, new MockComponent(10));
    component_map.add(2, new MockComponent(20));

    component_map.clear();

    expect(component_map.isEmpty()).toBe(true);
    expect(component_map.size()).toBe(0);
    expect(component_map.getEntities()).toEqual(new Set());
    expect(component_map.getComponents()).toEqual([]);
  });

  test('checks if the map is empty', () => {
    expect(component_map.isEmpty()).toBe(true);

    component_map.add(1, new MockComponent(10));
    expect(component_map.isEmpty()).toBe(false);
  });

  test('gets the size of the map', () => {
    expect(component_map.size()).toBe(0);

    component_map.add(1, new MockComponent(10));
    expect(component_map.size()).toBe(1);

    component_map.add(2, new MockComponent(20));
    expect(component_map.size()).toBe(2);
  });

  test('retrieves all entities with components', () => {
    component_map.add(1, new MockComponent(10));
    component_map.add(2, new MockComponent(20));

    expect(component_map.getEntities()).toEqual(new Set([1, 2]));
  });

  test('retrieves all components', () => {
    const component1 = new MockComponent(10);
    const component2 = new MockComponent(20);

    component_map.add(1, component1);
    component_map.add(2, component2);

    expect(component_map.getComponents()).toEqual([component1, component2]);
  });

  test('updates cache on add and delete', () => {
    component_map.add(1, new MockComponent(10));
    expect(component_map.getEntities()).toEqual(new Set([1]));

    component_map.add(2, new MockComponent(20));
    expect(component_map.getEntities()).toEqual(new Set([1, 2]));

    component_map.delete(1);
    expect(component_map.getEntities()).toEqual(new Set([2]));
  });
});
