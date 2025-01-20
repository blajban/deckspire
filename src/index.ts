import Phaser from 'phaser';
import ComponentStore from './engine/core/ComponentStore';
import { Position } from './engine/components/Position';
import { Rotation } from './engine/components/Rotation';
import EntityStore from './engine/core/EntityStore';
import { World } from './engine/core/World';

class MainScene extends Phaser.Scene {
  private entityStore = new EntityStore();
  private componentStore = new ComponentStore();
  private world =  new World(this.entityStore, this.componentStore);
  constructor() {
    super('MainScene');

  }

  preload() {
    // Load assets
  }

  create() {
    // Initialize game objects

    const entity1 = this.world.newEntity();
    const entity2 = this.world.newEntity();

    this.world.registerComponent(Position);
    this.world.registerComponent(Rotation);

    this.world.addComponent(entity1, new Position(10, 10));
    this.world.addComponent(entity1, new Rotation(10));

    this.world.addComponent(entity2, new Position(20, 20));

    const archetype = this.world.getEntitiesWithArchetype(Position, Rotation);
    
    console.log(archetype);

    const component = this.world.getComponent(entity1, Position);
    const compJson = component?.toJSON();
    const jsonString = JSON.stringify(compJson);
    console.log(jsonString);


    this.world.removeEntity(1);
    
  }

  update(time: number, delta: number) {

  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [ MainScene ],
};

const game = new Phaser.Game(config);
