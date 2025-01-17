import Phaser from 'phaser';
import ComponentStore from './engine/core/ComponentStore';
import { Position } from './engine/components/Position';
import { Rotation } from './engine/components/Rotation';
import EntityStore from './engine/core/EntityStore';

class MainScene extends Phaser.Scene {
  private entityStore = new EntityStore();
  private componentStore = new ComponentStore();
  constructor() {
    super('MainScene');

  }

  preload() {
    // Load assets
  }

  create() {
    // Initialize game objects

    const entity1 = this.entityStore.newEntity();
    const entity2 = this.entityStore.newEntity();

    this.componentStore.registerComponent(Position);
    this.componentStore.registerComponent(Rotation);

    this.componentStore.addComponent(1, new Position(10, 10));
    this.componentStore.addComponent(1, new Rotation(10));

    this.componentStore.addComponent(2, new Position(20, 20));

    const archetype = this.componentStore.getEntitiesWithArchetype(Position, Rotation);
    
    console.log(archetype);

    
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
