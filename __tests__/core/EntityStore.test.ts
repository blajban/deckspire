import EntityStore from '../../src/engine/core/EntityStore';

describe('EntityStore', () => {
  let store: EntityStore;

  beforeEach(() => {
    store = new EntityStore();
  });

  test('should create a new entity', () => {
    const entity = store.newEntity();
    expect(store.entityExists(entity)).toBe(true);
  });

  test('should create unique entities', () => {
    const entity1 = store.newEntity();
    const entity2 = store.newEntity();
    expect(entity1).not.toBe(entity2);
    expect(store.getAllEntities()).toEqual([entity1, entity2]);
  });

  test('should validate an existing entity', () => {
    const entity = store.newEntity();
    expect(store.entityExists(entity)).toBe(true);
    expect(store.entityExists(999)).toBe(false);
  });

  test('should remove an entity and invalidate it', () => {
    const entity = store.newEntity();
    store.removeEntity(entity);
    expect(store.entityExists(entity)).toBe(false);
    expect(store.getAllEntities()).not.toContain(entity);
  });

  test('should throw an error when removing a non-existent entity', () => {
    expect(() => store.removeEntity(999)).toThrow('Entity 999 does not exist.');
  });

  test('should get all entities', () => {
    const entity1 = store.newEntity();
    const entity2 = store.newEntity();
    expect(store.getAllEntities()).toEqual([entity1, entity2]);
  });

  test('should handle an empty entity store', () => {
    expect(store.getAllEntities()).toEqual([]);
  });
});
