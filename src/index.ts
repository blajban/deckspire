import Phaser from 'phaser';
import ComponentStore from './engine/core/ComponentStore';
import { Position } from './engine/components/Position';
import { Rotation } from './engine/components/Rotation';

class MainScene extends Phaser.Scene {

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load assets
  }

  create() {
    // Initialize game objects

    const componentStore = new ComponentStore();

    componentStore.registerComponent(Position.type);
    componentStore.registerComponent(Rotation.type);

    componentStore.addComponent(1, new Position(10, 10));
    componentStore.addComponent(1, new Rotation(10));

    componentStore.addComponent(2, new Position(20, 20));

    

    const retrievedPosition = componentStore.getComponent(1, Position.type);
    const retrievedRotation = componentStore.getComponent(1, Rotation.type);
    console.log(retrievedPosition);
    console.log(retrievedRotation);

    const archetype = componentStore.getEntitiesWithArchetype(Position.type, Rotation.type);
    console.log(archetype);

    
  }

  update(time: number, delta: number) {

  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainScene],
};

const game = new Phaser.Game(config);
