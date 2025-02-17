import CompHex from './components/CompHex';
import CompHexGrid from './components/CompHexGrid';
import CompTransform from './components/CompTransform';
import { DrawHex, SysDrawHexGrid } from './systems/SysDrawHexes';
import Engine from './engine/core/Engine';
import { GameContext } from './engine/core/GameContext';
import Scene from './engine/core/Scene';
import { CompDestroyWithScene } from './engine/core_components/CompDestroy';
import CompDrawable from './engine/core_components/CompDrawable';
import CompFillStyle from './engine/core_components/CompFillStyle';
import CompLineStyle from './engine/core_components/CompLineStyle';
import CompNamed from './engine/core_components/CompNamed';
import HexGrid, { HorizontalLayout } from './math/hexgrid/HexGrid';
import Vector2D from './math/Vector2D';
import { CompMouseSensitive } from './engine/core_components/CompMouse';
import { SysPointAtHexInHexgrid } from './systems/SysPointAtHexInHexgrid';
import SysMouse from './engine/core_systems/SysMouse';
import {
  SysDrawBegin,
  SysDrawEnd,
  SysInputEnd,
} from './engine/core_systems/SysSentinels';
import CompSelectorHex from './components/CompSelectorHex';
import SysSelectHexInHexGrid from './systems/SysSelectHexInHexGrid';
import SysMouseDepth from './engine/core_systems/SysMouseDepth';

function main(): void {
  const game = new Engine(800, 600);

  game.ready().then(() => {
    game.registerScene('MyScene', new MyScene());
    game.registerScene('AnotherScene', new AnotherScene());
    game.buildScenes(['MyScene', 'AnotherScene']);
  });
}

class AnotherScene extends Scene {
  buildScene(context: GameContext): void {
    console.log('Building AnotherScene!');

    // This grid blocks the mouse events from reaching the other hex grid due to being higher up
    const partially_blocking_grid = context.ecs_manager.newEntity();
    context.ecs_manager.addComponents(
      partially_blocking_grid,
      new CompNamed('The Blocking Grid'),
      new CompHexGrid(new HexGrid(2, 50, HorizontalLayout)),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompMouseSensitive(1),
      new CompDestroyWithScene(this),
    );
  }

  destroyScene(_context: GameContext): void {
    console.log('Destroying AnotherScene!');
  }
}

class MyScene extends Scene {
  onRegister(): void {
    console.log('Registering MyScene!');
  }

  buildScene(context: GameContext): void {
    console.log('Building MyScene!');

    context.ecs_manager.registerComponent(CompHex);
    context.ecs_manager.registerComponent(CompHexGrid);
    context.ecs_manager.registerComponent(CompSelectorHex);
    context.ecs_manager.registerComponent(CompTransform);

    context.ecs_manager.registerSystem(
      SysPointAtHexInHexgrid,
      [SysMouse],
      [SysInputEnd],
    );
    context.ecs_manager.registerSystem(
      SysSelectHexInHexGrid,
      [SysMouseDepth],
      [SysDrawBegin],
    );
    context.ecs_manager.registerSystem(
      SysDrawHexGrid,
      [SysDrawBegin],
      [SysDrawEnd],
    );
    context.ecs_manager.registerSystem(
      DrawHex,
      [SysDrawBegin, SysDrawHexGrid],
      [SysDrawEnd],
    );

    context.ecs_manager.activateSystem(context, SysPointAtHexInHexgrid);
    context.ecs_manager.activateSystem(context, SysSelectHexInHexGrid);
    context.ecs_manager.activateSystem(context, SysDrawHexGrid);
    context.ecs_manager.activateSystem(context, DrawHex);

    const hex_grid = context.ecs_manager.newEntity();
    context.ecs_manager.addComponents(
      hex_grid,
      new CompNamed('The Hex Grid'),
      new CompHexGrid(new HexGrid(3, 50, HorizontalLayout)),
      new CompSelectorHex(),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompDrawable(0),
      new CompLineStyle(5, 0x000000, 1),
      new CompFillStyle(0x888888, 1),
      new CompMouseSensitive(0),
      new CompDestroyWithScene(this),
    );
  }

  destroyScene(_context: GameContext): void {
    console.log('Destroying MyScene!');
  }
}

main();
