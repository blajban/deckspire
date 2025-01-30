import { Entity } from './Entity';

/**
 * Manages creation, validation, and removal of entities.
 */
export default class EntityStore {
  private _entities: Set<Entity> = new Set();
  // Needs to be protected in case we go multithreaded in the future.
  private static _current_id: Entity = 0;

  /**
   * Generates the next entity ID.
   * @returns The next available entity ID.
   */
  private _nextId(): Entity {
    return EntityStore._current_id++;
  }

  /**
   * Creates a new entity and adds it to the store.
   * @returns The created entity ID.
   */
  newEntity(): Entity {
    const new_entity = this._nextId();
    this._entities.add(new_entity);
    return new_entity;
  }

  /**
   * Checks if an entity exists.
   * @param entity - The entity to check.
   * @returns `true` if the entity exists, otherwise `false`.
   */
  entityExists(entity: Entity): boolean {
    return this._entities.has(entity);
  }

  /**
   * Removes an entity from the store.
   * Throws an error if the entity does not exist.
   * @param entity - The entity to remove.
   * @throws Will throw an error if the entity does not exist in the store.
   */
  removeEntity(entity: Entity): void {
    if (!this._entities.has(entity)) {
      throw new Error(`Entity ${entity} does not exist.`);
    }
    this._entities.delete(entity);
  }

  /**
   * Retrieves all entities in the store.
   * @returns An array of all entities currently in the store.
   */
  getAllEntities(): Entity[] {
    return Array.from(this._entities);
  }
}
