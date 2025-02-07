import Phaser from 'phaser';
import SceneManager from './SceneManager';
import Scene from './Scene';
import { GameContext } from './GameContext';
import SysTerminator from '../core_systems/SysTerminator';
import SysInit from '../core_systems/SysInit';
import SysMouseEventGenerator from '../core_systems/SysMouse';
import SysDraw from '../core_systems/SysDraw';
import CompParent from '../core_components/CompParent';
import CompNamed from '../core_components/CompNamed';
import CompLineStyle from '../core_components/CompLineStyle';
import CompFillStyle from '../core_components/CompFillStyle';
import CompDrawable from '../core_components/CompDrawable';
import {
  CompDestroyMe,
  CompDestroyWithScene,
} from '../core_components/CompDestroy';
import CompChild from '../core_components/CompChild';
import {
  CompIsMouse,
  CompMouseEvent,
  CompMouseSensitive,
  CompMouseState,
} from '../core_components/CompMouse';

export default class Engine {
  private _ready_promise: Promise<void>;
  private _width: number;
  private _height: number;
  private _phaser_game: Phaser.Game;
  private _context = new GameContext((time, delta) => {
    this._update(time, delta);
  });
  private _scene_manager = new SceneManager();

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;

    let ready_resolver: () => void;
    this._ready_promise = new Promise((resolve) => {
      ready_resolver = resolve;
    });

    this._phaser_game = new Phaser.Game({
      type: Phaser.AUTO,
      width: this._width,
      height: this._height,
      scene: [this._context.phaser_scene],
      banner: false, // Clutters test outputs
    });

    console.log('before');

    this._context.phaser_scene.ready().then(() => {
      console.log('ready!');
      // Core components are always registered.
      this._registerCoreComponents();
      // Core systems are always registered.
      this._registerCoreSystems();
      ready_resolver();
    });
  }

  public ready(): Promise<void> {
    return this._ready_promise;
  }

  /**
   * Adds the core system for drawing entities to the ECS.
   */
  private _registerCoreSystems(): void {
    this._context.ecs_manager.registerSystem(SysInit, [], [SysTerminator]);
    this._context.ecs_manager.registerSystem(
      SysMouseEventGenerator,
      [SysInit],
      [SysDraw],
    );
    this._context.ecs_manager.registerSystem(
      SysDraw,
      [SysMouseEventGenerator],
      [SysTerminator],
    );
    this._context.ecs_manager.registerSystem(SysTerminator, [SysDraw], []);

    // this._system_manager.activateSystem(SysInit);
    // this._context.ecs_manager.activateSystem(SysMouse);
    // this._system_manager.activateSystem(SysDraw);
    this._context.ecs_manager.activateSystem(SysTerminator);
  }

  /**
   * Registers all core components.
   */
  private _registerCoreComponents(): void {
    this._context.ecs_manager.registerComponent(CompChild);
    this._context.ecs_manager.registerComponent(CompDestroyMe);
    this._context.ecs_manager.registerComponent(CompDestroyWithScene);
    this._context.ecs_manager.registerComponent(CompDrawable);
    this._context.ecs_manager.registerComponent(CompFillStyle);
    this._context.ecs_manager.registerComponent(CompLineStyle);
    this._context.ecs_manager.registerComponent(CompIsMouse);
    this._context.ecs_manager.registerComponent(CompMouseEvent);
    this._context.ecs_manager.registerComponent(CompMouseSensitive);
    this._context.ecs_manager.registerComponent(CompMouseState);
    this._context.ecs_manager.registerComponent(CompNamed);
    this._context.ecs_manager.registerComponent(CompParent);
  }

  private _update(time: number, delta: number): void {
    this._context.ecs_manager.update(this._context, time, delta);
  }

  public registerScene(key: string, scene: Scene): void {
    this._scene_manager.registerScene(key, scene);
  }

  public buildScenes(scene_keys: string[]): void {
    scene_keys.forEach((key) => {
      this._scene_manager.buildScene(this._context, key);
    });
  }
}
