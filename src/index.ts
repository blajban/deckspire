import Phaser from 'phaser';
import ComponentStore from './engine/core/ComponentStore';
import EntityStore from './engine/core/EntityStore';
import World from './engine/core/World';
import { loadJsonFile } from './engine/util/file';
import ParentChildExampleSystem from './systems/ParentChildExampleSystem';
import CompDrawable from './engine/components/CompDrawable';
import CompHex from './engine/components/CompHex';
import CompHexGrid from './engine/components/CompHexGrid';
import CompTransform from './engine/components/CompTransform';
import HexGrid, { HorizontalLayout } from './math/hexgrid/HexGrid';
import { HexCoordinates } from './math/hexgrid/HexVectors';
import Vector2D from './math/Vector2D';
import CompChild from './engine/components/CompChild';
import CompParent from './engine/components/CompParent';

class MainScene extends Phaser.Scene {
  private entityStore = new EntityStore();
  private componentStore = new ComponentStore();
  private world = new World(this.entityStore, this.componentStore);
  private parentChildExampleSystem = new ParentChildExampleSystem();
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
    this.world.registerComponent(CompParent)

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
    const selected_hex = this.world.newEntity();
    this.world.addComponent(
      hex_grid,
      new CompHexGrid(
        new HexGrid(
          (hex) => hex.distance_from_origin().manhattan() <= 3,
          HorizontalLayout,
        ),
      ),
    );
    this.world.addComponent(
      hex_grid,
      new CompTransform(new Vector2D(0, 0), 0, 50),
    );
    this.world.addComponent(hex_grid, new CompDrawable(-1));
    this.world.addComponent(
      selected_hex,
      new CompHex(new HexCoordinates(0, 0)),
    );
    this.world.addComponent(selected_hex, new CompDrawable(1));
    this.world.addParentChildRelationship(hex_grid, selected_hex);

    const archetype = this.world.getEntitiesWithArchetype(
      CompHexGrid,
      CompTransform,
    );
    console.log(archetype);
  }

  update(time: number, delta: number) {
    this.parentChildExampleSystem.update(this.world, time, delta);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainScene],
};

const game = new Phaser.Game(config);
