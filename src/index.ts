import CompHex from './components/CompHex';
import CompHexGrid from './components/CompHexGrid';
import CompTransform from './components/CompTransform';
import { DrawHex, DrawHexGrid } from './draw/DrawHexes';
import { AssetType } from './engine/core/AssetStore';
import Engine from './engine/core/Engine';
import Scene from './engine/core/Scene';
import CompDrawable from './engine/core_components/CompDrawable';
import CompFillStyle from './engine/core_components/CompFillStyle';
import CompLineStyle from './engine/core_components/CompLineStyle';
import CompMouseSensitive from './engine/core_components/CompMouseSensitive';
import CompNamed from './engine/core_components/CompNamed';
import HexGrid, { HorizontalLayout } from './math/hexgrid/HexGrid';
import Vector2D from './math/Vector2D';
import { SysPointingAtHexgrid } from './systems/SysPointingAtHexgrid';
import CompSprite from './engine/core_components/CompSprite';

class AssetScene extends Scene {
  onRegister(): void {
    const asset_store = this.engine.getAssetStore();

    asset_store.registerAssets([
      { key: 'Asset_A', path: 'a path', type: AssetType.Image },
      {
        key: 'Asset_B',
        path: 'a path',
        type: AssetType.Spritesheet,
        frameConfig: { frameWidth: 32, frameHeight: 32 },
      },
      { key: 'Asset_C', path: 'a path', type: AssetType.Audio },
      { key: 'Asset_D', path: 'a path', type: AssetType.Font },
      { key: 'Asset_E', path: 'a path', type: AssetType.Image },
    ]);

    asset_store.registerAsset({
      key: 'Asset F',
      path: 'a path',
      type: AssetType.Image,
    });

    asset_store.preloadAssets();
  }

  onStart(): void {}

  onExit(): void {}

  onUpdate(_time: number, _delta: number): void {}
}

class AnotherScene extends Scene {
  onRegister(): void {
    const asset_store = this.engine.getAssetStore();

    const entity1 = this.ecs.newEntity();
    const entity2 = this.ecs.newEntity();
    const entity3 = this.ecs.newEntity();
    const entity4 = this.ecs.newEntity();
    const entity5 = this.ecs.newEntity();
    const entity6 = this.ecs.newEntity();

    this.ecs.addComponent(entity1, new CompSprite(asset_store, 'Asset_B'));
    this.ecs.addComponent(entity2, new CompSprite(asset_store, 'Asset_B'));
    this.ecs.addComponent(entity3, new CompSprite(asset_store, 'Asset_B'));
    this.ecs.addComponent(entity4, new CompSprite(asset_store, 'Asset_B'));

    this.ecs.addComponent(entity5, new CompSprite(asset_store, 'Asset_A'));
    this.ecs.addComponent(entity6, new CompSprite(asset_store, 'Asset_C'));

    this.ecs.removeEntity(entity1);
    this.ecs.removeEntity(entity5);
  }

  onStart(): void {
    console.log('Starting AnotherScene!');

    this.engine.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown') {
        console.log('Arrow Up key was pressed!');
        this.engine.getSceneManager().resumeScene('MyScene');
        this.engine.getSceneManager().pauseScene('AnotherScene');
      }
    });
  }

  onExit(): void {
    console.log('Exiting AnotherScene!');
  }

  onUpdate(_time: number, _delta: number): void {}
}

class MyScene extends Scene {
  onRegister(): void {
    console.log('Registering MyScene!');

    this.ecs.registerComponent(CompHex);
    this.ecs.registerComponent(CompHexGrid);
    this.ecs.registerComponent(CompTransform);

    this.ecs.addMouse();
    this.ecs.getMouseSystem()!.addSubSystem(new SysPointingAtHexgrid());

    this.ecs.addDraw();
    this.ecs.getDrawSystem()!.addSubSystem(new DrawHexGrid());
    this.ecs.getDrawSystem()!.addSubSystem(new DrawHex());
  }

  onStart(): void {
    console.log('Starting MyScene!');

    // Scene transition example (will get some errors due to using phaser input, this is just as an example)
    this.engine.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'ArrowUp') {
        this.engine.getSceneManager().pauseScene('MyScene');
        this.engine.getSceneManager().startScene('AnotherScene');
      }
    });

    const hex_grid = this.ecs.newEntity();
    this.ecs.addComponents(
      hex_grid,
      new CompNamed('The Hex Grid'),
      new CompHexGrid(new HexGrid(3, 50, HorizontalLayout)),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompDrawable(0),
      new CompLineStyle(5, 0x000000, 1),
      new CompFillStyle(0x888888, 1),
      new CompMouseSensitive(0, true, false, true, true),
    );
    // This grid blocks the mouse events from reaching the other hex grid due to being higher up
    const partly_blocking_grid = this.ecs.newEntity();
    this.ecs.addComponents(
      partly_blocking_grid,
      new CompNamed('The Blocking Grid'),
      new CompHexGrid(new HexGrid(2, 50, HorizontalLayout)),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompMouseSensitive(1, false),
    );
  }

  onExit(): void {
    console.log('Exiting MyScene!');
  }

  onUpdate(time: number, delta: number): void {
    this.ecs.getMouseSystem()?.update(this, this.engine, time, delta);
    this.ecs.getDrawSystem()?.update(this, this.engine, time, delta);
  }
}

const game = new Engine(800, 600);

game.ready().then(() => {
  game.getSceneManager().registerScene('MyScene', new MyScene());
  game.getSceneManager().registerScene('AssetScene', new AssetScene());
  game.getSceneManager().registerScene('AnotherScene', new AnotherScene());

  game.getSceneManager().startScene('AnotherScene');
});
