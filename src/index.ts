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
import { DrawSubSystem } from './engine/core_systems/SysDraw';
import HexGrid, { HorizontalLayout } from './math/hexgrid/HexGrid';
import Vector2D from './math/Vector2D';
import { SysPointingAtHexgrid } from './systems/SysPointingAtHexgrid';


class MyScene extends Scene {
  on_register(): void {
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

  on_start(): void {
    console.log('Starting MyScene!');

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

  on_exit(): void {
    console.log('Exiting MyScene!');
  }

  on_update(time: number, delta: number): void {
    this.world.getMouseSystem()?.update(this.world, this.engine, time, delta);
    this.world.getDrawSystem()?.update(this.world, this.engine, time, delta);
  }
}



const game = new Engine(800, 600);

game.register_scene('My_scene', new MyScene());

game.start_scene('My_scene');





