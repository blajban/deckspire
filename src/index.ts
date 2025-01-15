import Phaser from 'phaser';

class MainScene extends Phaser.Scene {

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load assets
  }

  create() {
    // Initialize game objects
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
