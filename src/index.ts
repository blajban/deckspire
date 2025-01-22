import Phaser from 'phaser';
import ComponentStore from './engine/core/ComponentStore';
import { CompPosition } from './engine/components/CompPosition';
import { CompRotation } from './engine/components/CompRotation';
import EntityStore from './engine/core/EntityStore';
import { World } from './engine/core/World';
import { loadJsonFile } from './engine/util/file';
import { CompParent } from './engine/components/CompParent';
import { CompChild } from './engine/components/CompChild';
import ParentChildExampleSystem from './systems/ParentChildExampleSystem';

class MainScene extends Phaser.Scene {
  private entityStore = new EntityStore();
  private componentStore = new ComponentStore();
  private world =  new World(this.entityStore, this.componentStore);

  private parentChildExampleSystem = new ParentChildExampleSystem();

  constructor() {
    super('MainScene');

  }

  preload() {
    // Load assets

    this.world.registerComponent(CompPosition);
    this.world.registerComponent(CompRotation);
    this.world.registerComponent(CompParent);
    this.world.registerComponent(CompChild);

    

    loadJsonFile('/world.json')
    .then((data) => {
      console.log('Loaded JSON:', data);
      this.world.deserialize(JSON.stringify(data));
    })
    .catch((error) => console.error('Error:', error));
  }

  create() {
    // Initialize game objects

    /* const entity1 = this.world.newEntity();
    const entity2 = this.world.newEntity(); */

    

    /* this.world.addComponent(entity1, new Position(10, 10));
    this.world.addComponent(entity1, new Rotation(10));

    this.world.addComponent(entity2, new Position(20, 20));

    const archetype = this.world.getEntitiesWithArchetype(Position, Rotation);
    
    console.log(archetype);

    const component = this.world.getComponent(entity1, Position);
    const compJson = component?.toJSON();
    const jsonString = JSON.stringify(compJson);
    console.log(jsonString);

    console.log(this.world.serialize());


    this.world.removeEntity(1); */

    
    //this.world.deserialize(jsonData);

    const parent = this.world.newEntity();
  
    const child1 = this.world.newEntity();
    this.world.addComponent(child1, new CompChild(parent));
    const child2 = this.world.newEntity();
    this.world.addComponent(child2, new CompChild(parent));
    const child3 = this.world.newEntity();
    this.world.addComponent(child3, new CompChild(parent));
    const child4 = this.world.newEntity();
    this.world.addComponent(child4, new CompChild(parent));

    
    this.world.addComponent(parent, new CompParent([
      child1,
      child2,
      child3,
      child4
    ]));


    
    
  }

  update(time: number, delta: number) {
    //console.log(this.world.getEntitiesWithArchetype(CompPosition));

    this.parentChildExampleSystem.update(this.world, time, delta);

    const children = this.world.getEntitiesWithComponent(CompChild);

    for (const child of children) {
      const childComp = this.world.getComponent(child, CompChild);

      console.log(`Child #${child} has parent ${childComp?.parent}`);
    }

  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [ MainScene ],
};

const game = new Phaser.Game(config);
