import CompHex from './components/CompHex';
import CompHexGrid from './components/CompHexGrid';
import CompTransform from './components/CompTransform';
import { DrawHex, DrawHexGrid } from './draw/DrawHexes';
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

class AnotherScene extends Scene {
  onRegister(): void {
    console.log('Registering AnotherScene!');
  }

  onStart(): void {
    console.log('Starting AnotherScene!');

    this.engine.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown') {
        console.log('Arrow Up key was pressed!');
        this.engine.resumeScene('MyScene');
        this.engine.pauseScene('AnotherScene');
      }
    });
  }

  onExit(): void {
    console.log('Exiting AnotherScene!');
  }

  onUpdate(time: number, delta: number): void {
    console.log('Updating AnotherScene!');
  }
}

class MyScene extends Scene {
  onRegister(): void {
    console.log('Registering MyScene!');

    this.world.registerComponent(CompHex);
    this.world.registerComponent(CompHexGrid);
    this.world.registerComponent(CompTransform);

    this.world.addMouse();
    this.world.getMouseSystem()!.addSubSystem(new SysPointingAtHexgrid());

    this.world.addDraw();
    this.world.getDrawSystem()!.addSubSystem(new DrawHexGrid());
    this.world.getDrawSystem()!.addSubSystem(new DrawHex());
  }

  onStart(): void {
    console.log('Starting MyScene!');

    // Scene transition example (will get some errors due to using phaser input, this is just as an example)
    this.engine.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'ArrowUp') {
        this.engine.pauseScene('MyScene');
        this.engine.startScene('AnotherScene');
      }
    });

    const hex_grid = this.world.newEntity();
    this.world.addComponents(
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
    const partly_blocking_grid = this.world.newEntity();
    this.world.addComponents(
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
    console.log('Updating MyScene!');
    this.world.getMouseSystem()?.update(this.world, this.engine, time, delta);
    this.world.getDrawSystem()?.update(this.world, this.engine, time, delta);
  }
}

const game = new Engine(800, 600);

game.ready().then(() => {
  game.registerScene('MyScene', new MyScene());
  game.registerScene('AnotherScene', new AnotherScene());

  game.startScene('MyScene');
});
