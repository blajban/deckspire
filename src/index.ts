import ComponentStore from './engine/core/ComponentStore';
import EntityStore from './engine/core/EntityStore';
import World from './engine/core/World';
import { loadJsonFile } from './engine/util/file';
import ParentChildExampleSystem from './systems/ParentChildExampleSystem';
import CompDrawable from './engine/core_components/CompDrawable';
import CompHex from './components/CompHex';
import CompHexGrid from './components/CompHexGrid';
import CompTransform from './components/CompTransform';
import HexGrid, { HorizontalLayout } from './math/hexgrid/HexGrid';
import { HexCoordinates } from './math/hexgrid/HexVectors';
import Vector2D from './math/Vector2D';
import { DrawHex, DrawHexGrid } from './draw/DrawHexes';
import Scene from './engine/core/Scene';
import CompLineStyle from './engine/core_components/CompLineStyle';
import CompFillStyle from './engine/core_components/CompFillStyle';
import { SysPointingAtHexgrid } from './systems/SysPointingAtHexgrid';
import CompMouseSensitive from './engine/core_components/CompMouseSensitive';
import CompNamed from './engine/core_components/CompNamed';

class MainScene extends Scene {
  private entityStore = new EntityStore();
  private componentStore = new ComponentStore();
  private parentChildExampleSystem = new ParentChildExampleSystem();
  private world: World;

  constructor() {
    super('MainScene');
    this.world = new World(this, this.entityStore, this.componentStore);
  }

  preload() {
    // Load assets
    this.world.registerComponent(CompHex);
    this.world.registerComponent(CompHexGrid);
    this.world.registerComponent(CompTransform);

    this.world.addMouse();
    this.world.getMouseSystem()!.add_sub_system(new SysPointingAtHexgrid());

    this.world.addDraw();
    this.world.getDrawSystem()!.add_sub_system(new DrawHexGrid());
    this.world.getDrawSystem()!.add_sub_system(new DrawHex());

    loadJsonFile('/world.json')
      .then((data) => {
        console.log('Loaded JSON:', data);
        this.world.deserialize(JSON.stringify(data));
      })
      .catch((error) => console.error('Error:', error));
  }

  create() {
    // Initialize game objects
    const hex_grid = this.world.newEntity();
    this.world.addComponents(
      hex_grid,
      new CompNamed('The Hex Grid'),
      new CompHexGrid(new HexGrid(3, 50, HorizontalLayout)),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompDrawable(0),
      new CompLineStyle(5, 0x000000, 1),
      new CompFillStyle(0x888888, 1),
      new CompMouseSensitive(0,true,false,true,true),
    );
    // This grid blocks the mouse events from reaching the other hex grid due to being higher up
    const partly_blocking_grid = this.world.newEntity();
    this.world.addComponents(
      partly_blocking_grid,
      new CompNamed('The Blocking Grid'),
      new CompHexGrid(new HexGrid(2, 50, HorizontalLayout)),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompMouseSensitive(1, false),
    );
  }

  update(time: number, delta: number) {
    console.log(`FPS: ${game.loop.actualFps}`);
    this.world.getMouseSystem()?.update(this.world, this, time, delta);
    this.world.getDrawSystem()?.update(this.world, this, time, delta);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainScene],
};

const game = new Phaser.Game(config);
