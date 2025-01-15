/**
 * Represents a unique identifier for an entity.
 */
export type Entity = number;

/**
 * Manages creation, validation, and removal of entities.
 */
export default class EntityStore {
  private entities: Set<Entity> = new Set();
  private currentId: Entity = 0;

   /**
   * Generates the next entity ID.
   * @returns The next available entity ID.
   */
  private nextId(): Entity {
    return this.currentId++;
  }

  /**
   * Creates a new entity and adds it to the store.
   * @returns The created entity ID.
   */
  newEntity(): Entity {
    const newEntity = this.nextId();
    this.entities.add(newEntity);
    return newEntity;
  }

  /**
   * Checks if an entity exists.
   * @param entity - The entity to check.
   * @returns `true` if the entity exists, otherwise `false`.
   */
  entityExists(entity: Entity): boolean {
    return this.entities.has(entity);
  }

  /**
   * Removes an entity from the store.
   * Throws an error if the entity does not exist.
   * @param entity - The entity to remove.
   * @throws Will throw an error if the entity does not exist in the store.
   */
  removeEntity(entity: Entity): void {
    if (!this.entities.has(entity)) {
      throw new Error(`Entity ${entity} does not exist.`);
    }
    this.entities.delete(entity);
  }

  /**
   * Retrieves all entities in the store.
   * @returns An array of all entities currently in the store.
   */
  getAllEntities(): Entity[] {
    return Array.from(this.entities);
  }
}