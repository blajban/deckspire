import CompHex from './components/CompHex';
import CompHexGrid from './components/CompHexGrid';
import CompTransform from './engine/core_components/CompTransform';
import { DrawHex, SysDrawHexGrid } from './systems/SysDrawHexes';
import { AssetType } from './engine/core/AssetStore';
import Engine from './engine/core/Engine';
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
import EcsManager from './engine/core/EcsManager';
import CompSpritesheet from './engine/core_components/CompSpritesheet';
import CompSprite from './engine/core_components/CompSprite';
import { SysDrawSprite } from './systems/SysDrawSprite';
import { SysDrawSpritesheet } from './systems/SysDrawSpritesheet';

function main(): void {
  const theater = new Engine(800, 600);

  theater.ready().then(() => {
    theater.registerScene('HexScene', new HexScene());
    theater.registerScene('SamuraiScene', new SamuraiScene());
    theater.preloadScenes(['HexScene', 'SamuraiScene']);
    theater.buildScenes(['HexScene', 'SamuraiScene']);
  });
}

class SamuraiScene extends Scene {
  async preloadScene(ecs: EcsManager): Promise<void> {
    ecs.asset_store.registerAssets([
      { key: 'samurai', path: 'assets/IDLE.png', type: AssetType.Image },
      {
        key: 'samurai_two',
        path: 'assets/RUN.png',
        type: AssetType.Spritesheet,
        frameConfig: { frameWidth: 96, frameHeight: 96 },
      },
      {
        key: 'samurai_three',
        path: 'assets/HURT.png',
        type: AssetType.Spritesheet,
        frameConfig: { frameWidth: 96, frameHeight: 96 },
      },
    ]);
    this.makePreloadPromise(
      ecs.asset_store.preloadAssets(ecs.phaser_scene, [
        'samurai',
        'samurai_two',
        'samurai_three',
      ]),
    );
  }

  async loadScene(ecs: EcsManager): Promise<void> {
    await this.readyPreload();

    ecs.registerSystem(SysDrawSprite, [SysDrawBegin], [SysDrawEnd]);
    ecs.registerSystem(SysDrawSpritesheet, [SysDrawBegin], [SysDrawEnd]);

    ecs.activateSystem(SysDrawSprite);
    ecs.activateSystem(SysDrawSpritesheet);

    // Draw sprite example
    ecs.addComponents(
      ecs.newEntity(),
      new CompTransform(new Vector2D(100, 100), 0, new Vector2D(1.0, 1.0)),
      new CompDrawable(1),
      new CompSprite(ecs.asset_store, 'samurai'),
    );
    ecs.addComponents(
      ecs.newEntity(),
      new CompTransform(new Vector2D(100, 300), 0, new Vector2D(1.0, 1.0)),
      new CompDrawable(1),
      new CompSpritesheet(ecs.asset_store, 'samurai_two', 8),
    );
    ecs.addComponents(
      ecs.newEntity(),
      new CompTransform(new Vector2D(100, 500), 0, new Vector2D(1.0, 1.0)),
      new CompDrawable(1),
      new CompSpritesheet(ecs.asset_store, 'samurai_three', 1),
    );
  }

  public unloadScene(_ecs: EcsManager): void {}
}

class HexScene extends Scene {
  async preloadScene(): Promise<void> {}

  loadScene(ecs: EcsManager): Promise<void> {
    ecs.registerComponent(CompHex);
    ecs.registerComponent(CompHexGrid);
    ecs.registerComponent(CompSelectorHex);
    ecs.registerComponent(CompTransform);

    ecs.registerSystem(SysPointAtHexInHexgrid, [SysMouse], [SysInputEnd]);
    ecs.registerSystem(SysSelectHexInHexGrid, [SysMouseDepth], [SysDrawBegin]);
    ecs.registerSystem(SysDrawHexGrid, [SysDrawBegin], [SysDrawEnd]);
    ecs.registerSystem(DrawHex, [SysDrawBegin, SysDrawHexGrid], [SysDrawEnd]);

    ecs.activateSystem(SysPointAtHexInHexgrid);
    ecs.activateSystem(SysSelectHexInHexGrid);
    ecs.activateSystem(SysDrawHexGrid);
    ecs.activateSystem(DrawHex);

    const hex_grid = ecs.newEntity();
    ecs.addComponents(
      hex_grid,
      new CompNamed('The Hex Grid'),
      new CompHexGrid(new HexGrid(3, 50, HorizontalLayout)),
      new CompSelectorHex(),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompDrawable(0),
      new CompLineStyle(5, 0x000000, 1),
      new CompFillStyle(0x888888, 1),
      new CompMouseSensitive(1),
      new CompDestroyWithScene(this),
    );
    // This grid blocks the mouse events from reaching the other hex grid due to being higher up
    const partially_blocking_grid = ecs.newEntity();
    ecs.addComponents(
      partially_blocking_grid,
      new CompNamed('The Blocking Grid'),
      new CompHexGrid(new HexGrid(2, 50, HorizontalLayout)),
      new CompTransform(new Vector2D(400, 300), 0, new Vector2D(1.1, 0.9)),
      new CompMouseSensitive(0),
      new CompDestroyWithScene(this),
    );

    return Promise.resolve();
  }

  unloadScene(_ecs: EcsManager): void {}
}

main();
