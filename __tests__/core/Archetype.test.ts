import Archetype from '../../src/engine/core/Archetype';
import Component from '../../src/engine/core/Component';
import ComponentStore from '../../src/engine/core/ComponentStore';
import { Entity } from '../../src/engine/core/Entity';
import EntityStore from '../../src/engine/core/EntityStore';

class CompA extends Component {}
class CompB extends Component {}
class CompC extends Component {}
class CompD extends Component {}

describe('Archetype', () => {
  const archetype_abcd = new Archetype(CompA, CompB, CompC, CompD);
  const archetype_badc = new Archetype(CompB, CompA, CompD, CompC);
  let estore: EntityStore;
  let cstore: ComponentStore;
  let entity_abcd: Entity;

  beforeEach(() => {
    estore = new EntityStore();
    cstore = new ComponentStore();
    cstore.registerComponent(CompA);
    cstore.registerComponent(CompB);
    cstore.registerComponent(CompC);
    cstore.registerComponent(CompD);

    entity_abcd = estore.newEntity();
    cstore.addComponent(entity_abcd, new CompA());
    cstore.addComponent(entity_abcd, new CompB());
    cstore.addComponent(entity_abcd, new CompC());
    cstore.addComponent(entity_abcd, new CompD());
  });

  it('Should return typed components in the right order.', () => {
    const map1 = cstore.getComponentsForEntitiesWithArchetype(archetype_abcd);
    expect(map1.get(entity_abcd)).toHaveLength(4);
    expect(map1.get(entity_abcd)?.[0]).toBeInstanceOf(CompA);
    expect(map1.get(entity_abcd)?.[1]).toBeInstanceOf(CompB);
    expect(map1.get(entity_abcd)?.[2]).toBeInstanceOf(CompC);
    expect(map1.get(entity_abcd)?.[3]).toBeInstanceOf(CompD);

    const map2 = cstore.getComponentsForEntitiesWithArchetype(archetype_badc);
    expect(map2.get(entity_abcd)).toHaveLength(4);
    expect(map2.get(entity_abcd)?.[0]).toBeInstanceOf(CompB);
    expect(map2.get(entity_abcd)?.[1]).toBeInstanceOf(CompA);
    expect(map2.get(entity_abcd)?.[2]).toBeInstanceOf(CompD);
    expect(map2.get(entity_abcd)?.[3]).toBeInstanceOf(CompC);
  });
});
