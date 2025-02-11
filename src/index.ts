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
import { DrawSprite } from './draw/DrawSprite';
import CompSpritesheet from './engine/core_components/CompSpritesheet';
import { DrawSpritesheet } from './draw/DrawSpritesheet';

class AssetScene extends Scene {
  onRegister(): void {
    const asset_store = this.context.assetStore!;

    asset_store.registerAssets([
      { key: 'samurai', path: 'assets/IDLE.png', type: AssetType.Image },
      {
        key: 'samurai_two',
        path: 'assets/RUN.png',
        type: AssetType.Spritesheet,
        frameConfig: { frameWidth: 96, frameHeight: 96 },
      },
      { key: 'samurai_three', path: 'assets/HURT.png', type: AssetType.Spritesheet, frameConfig: { frameWidth: 96, frameHeight: 96 } },
    ]);
  }

  onStart(): void {}

  onExit(): void {}

  onUpdate(_time: number, _delta: number): void {}
}

class AnotherScene extends Scene {
  onRegister(): void {
    this.ecs.registerComponent(CompTransform);

    this.ecs.addDraw();
    this.ecs.getDrawSystem()!.addSubSystem(new DrawSprite());
    this.ecs.getDrawSystem()!.addSubSystem(new DrawSpritesheet());
  }

  async onPreload(): Promise<void> {
    console.log('PRELOADING!!');
    await this.context.assetStore!.preloadAssets([
      'samurai_three'
    ]);
  }

  onStart(): void {
    this.onPreload().then(() => {
      console.log('Starting AnotherScene!');
      const test_spritesheet = this.ecs.newEntity();
      this.ecs.addComponents(
        test_spritesheet,
        new CompTransform(new Vector2D(100, 500), 0, new Vector2D(1.0, 1.0)),
        new CompDrawable(1),
        new CompSpritesheet(this.context.assetStore!, 'samurai_three', 1),
      );

      this.context.phaserContext!.input.keyboard!.on(
        'keydown',
        (event: KeyboardEvent) => {
          if (event.code === 'ArrowDown') {
            console.log('Arrow Up key was pressed!');
            this.context.sceneManager!.resumeScene('MyScene');
            this.context.sceneManager!.pauseScene('AnotherScene');
          }
        },
      );
    }) 
    
  }

  onExit(): void {
    console.log('Exiting AnotherScene!');
  }

  onUpdate(time: number, delta: number): void {
    this.ecs.getDrawSystem()?.update(this, this.context, time, delta);
  }
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

    this.ecs.getDrawSystem()!.addSubSystem(new DrawSprite());
    this.ecs.getDrawSystem()!.addSubSystem(new DrawSpritesheet());

   
  }

  async onPreload(): Promise<void> {
    console.log('PRELOADING!!');
    await this.context.assetStore!.preloadAssets([
      'samurai',
      'samurai_two'
    ]);
  }

  onStart(): void {
    console.log('Starting MyScene!');

    // Scene transition example (will get some errors due to using phaser input, this is just as an example)
    this.context.phaserContext!.input.keyboard!.on(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.code === 'ArrowUp') {
          this.context.sceneManager!.pauseScene('MyScene');
          this.context.sceneManager!.startScene('AnotherScene');
        }
      },
    );

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

    // Draw sprite example
    const test_sprite = this.ecs.newEntity();
    this.ecs.addComponents(
      test_sprite,
      new CompTransform(new Vector2D(100, 100), 0, new Vector2D(1.0, 1.0)),
      new CompDrawable(1),
      new CompSprite(this.context.assetStore!, 'samurai'),
    );

    const test_spritesheet = this.ecs.newEntity();
    this.ecs.addComponents(
      test_spritesheet,
      new CompTransform(new Vector2D(100, 300), 0, new Vector2D(1.0, 1.0)),
      new CompDrawable(1),
      new CompSpritesheet(this.context.assetStore!, 'samurai_two', 8),
    );
  }

  onExit(): void {
    console.log('Exiting MyScene!');
  }

  onUpdate(time: number, delta: number): void {
    console.log('Updating MyScene!');
    this.ecs.getMouseSystem()?.update(this, this.context, time, delta);
    this.ecs.getDrawSystem()?.update(this, this.context, time, delta);
  }
}

const game = new Engine(800, 600);

game.ready().then(async () => {
  game.getContext().sceneManager!.registerScene('AssetScene', new AssetScene());
  game.getContext().sceneManager!.registerScene('MyScene', new MyScene());
  game
    .getContext()
    .sceneManager!.registerScene('AnotherScene', new AnotherScene());

  console.log('Before preloading!!');
  await game.getContext().sceneManager!.preloadScene('MyScene');
  console.log('After preloading!!');
  game.getContext().sceneManager!.startScene('MyScene');
});
