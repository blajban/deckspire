import Phaser from 'phaser';
import ComponentMap from './engine/ComponentMap';
import { Position, Rotation } from './engine/Component';
import ComponentStore from './engine/ComponentStore';

class MainScene extends Phaser.Scene {

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load assets
  }

  create() {
    // Initialize game objects

    const entity = 1;
    const componentStore = new ComponentStore();
    const position = new Position(10, 10);
    componentStore.addComponent(entity, position);

    componentStore.registerComponent(Rotation.type);
    
    console.log(componentStore);
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
