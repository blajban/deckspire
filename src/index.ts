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
import CompChild from './engine/core_components/CompChild';
import CompParent from './engine/core_components/CompParent';
import SysDraw from './systems/SysDraw';
import { DrawHex, DrawHexGrid } from './draw/DrawHexes';
import Scene from './engine/core/Scene';
import CompLineStyle from './engine/core_components/CompLineStyle';
import CompFillStyle from './engine/core_components/CompFillStyle';

class MainScene extends Scene {
  private entityStore = new EntityStore();
  private componentStore = new ComponentStore();
  private world = new World(this.entityStore, this.componentStore);
  private parentChildExampleSystem = new ParentChildExampleSystem();
  private draw_everything = new SysDraw(this);

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load assets
    this.world.registerComponent(CompDrawable);
    this.world.registerComponent(CompHex);
    this.world.registerComponent(CompHexGrid);
    this.world.registerComponent(CompTransform);
    this.world.registerComponent(CompChild);
    this.world.registerComponent(CompParent);
    this.world.registerComponent(CompLineStyle);
    this.world.registerComponent(CompFillStyle);

    this.draw_everything.add_sub_system(new DrawHexGrid());
    this.draw_everything.add_sub_system(new DrawHex());

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
    const red_hex = this.world.newEntity();
    const green_hex = this.world.newEntity();
    const blue_hex = this.world.newEntity();
    this.world.addComponents(
      hex_grid,
      new CompHexGrid(
        new HexGrid(
          (hex) => hex.distance_from_origin().manhattan() <= 3,
          HorizontalLayout,
        ),
      ),
      new CompTransform(new Vector2D(400, 300), 0, 50),
      new CompDrawable(-1),
      new CompLineStyle(5, 0x000000, 1),
      new CompFillStyle(0x888888, 1),
    );
    this.world.addComponents(
      red_hex,
      new CompHex(new HexCoordinates(-1, 1)),
      new CompDrawable(1),
      new CompLineStyle(5, 0xff0000, 0.5),
    );
    this.world.addComponents(
      green_hex,
      new CompHex(new HexCoordinates(0, 0)),
      new CompDrawable(1),
      new CompLineStyle(5, 0x00ff00, 0.5),
    );
    this.world.addComponents(
      blue_hex,
      new CompHex(new HexCoordinates(1, 0)),
      new CompDrawable(1),
      new CompLineStyle(5, 0x0000ff, 0.5),
    );
    this.world.addParentChildRelationship(hex_grid, red_hex);
    this.world.addParentChildRelationship(hex_grid, green_hex);
    this.world.addParentChildRelationship(hex_grid, blue_hex);
  }

  update(time: number, delta: number) {
    this.parentChildExampleSystem.update(this.world, time, delta);
    this.draw_everything.update(this.world, time, delta);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainScene],
};

const game = new Phaser.Game(config);
