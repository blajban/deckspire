import CompHex from './components/CompHex';
import CompHexGrid from './components/CompHexGrid';
import CompTransform from './components/CompTransform';
import { DrawHex, DrawHexGrid } from './draw/DrawHexes';
import Engine, { Context } from './engine/core/Engine';
import Scene from './engine/core/Scene';
import { CompDestroyWithScene } from './engine/core_components/CompDestroy';
import CompDrawable from './engine/core_components/CompDrawable';
import CompFillStyle from './engine/core_components/CompFillStyle';
import CompLineStyle from './engine/core_components/CompLineStyle';
import CompMouseSensitive from './engine/core_components/CompMouseSensitive';
import CompNamed from './engine/core_components/CompNamed';
import HexGrid, { HorizontalLayout } from './math/hexgrid/HexGrid';
import Vector2D from './math/Vector2D';
import { SysPointingAtHexgrid } from './systems/SysPointingAtHexgrid';

const game = new Engine(800, 600);

game.ready().then(() => {
  game.registerScene('MyScene', new MyScene());
  game.registerScene('AnotherScene', new AnotherScene());
  game.buildScenes(['MyScene']);
});

class AnotherScene extends Scene {
  onRegister(): void {
    console.log('Registering AnotherScene!');
  }

  buildScene(): void {
    console.log('Building AnotherScene!');
  }

  destroyScene(): void {
    console.log('Destroying AnotherScene!');
  }
}

class MyScene extends Scene {
  onRegister(): void {
    console.log('Registering MyScene!');
  }

  buildScene(context: Context): void {
    console.log('Building MyScene!');

    context.ecs_manager.registerComponent(CompHex);
    context.ecs_manager.registerComponent(CompHexGrid);
    context.ecs_manager.registerComponent(CompTransform);

    context.ecs_manager.addMouse();
    context.ecs_manager
      .getMouseSystem()!
      .addSubSystem(new SysPointingAtHexgrid());

    context.ecs_manager.addDraw();
    context.ecs_manager.getDrawSystem()!.addSubSystem(new DrawHexGrid());
    context.ecs_manager.getDrawSystem()!.addSubSystem(new DrawHex());

    const hex_grid = context.ecs_manager.newEntity();
    context.ecs_manager.addComponents(
      hex_grid,
      new CompNamed('The Hex Grid'),
      new CompHexGrid(new HexGrid(3, 50, HorizontalLayout)),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompDrawable(0),
      new CompLineStyle(5, 0x000000, 1),
      new CompFillStyle(0x888888, 1),
      new CompMouseSensitive(0, true, false, true, true),
      new CompDestroyWithScene(this),
    );
    // This grid blocks the mouse events from reaching the other hex grid due to being higher up
    const partially_blocking_grid = context.ecs_manager.newEntity();
    context.ecs_manager.addComponents(
      partially_blocking_grid,
      new CompNamed('The Blocking Grid'),
      new CompHexGrid(new HexGrid(2, 50, HorizontalLayout)),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompMouseSensitive(1, false),
      new CompDestroyWithScene(this),
    );
  }

  destroyScene(_context: Context): void {
    console.log('Destroying MyScene!');
  }
}
