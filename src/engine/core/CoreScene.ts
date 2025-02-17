import CompChild from '../core_components/CompChild';
import CompDrawable from '../core_components/CompDrawable';
import CompFillStyle from '../core_components/CompFillStyle';
import CompLineStyle from '../core_components/CompLineStyle';
import {
  CompIsMouse,
  CompMouseEvent,
  CompMouseSensitive,
  CompMouseState,
} from '../core_components/CompMouse';
import CompNamed from '../core_components/CompNamed';
import CompParent from '../core_components/CompParent';
import SysMouse from '../core_systems/SysMouse';
import {
  SysCleanupBegin,
  SysCleanupEnd,
  SysDrawBegin,
  SysDrawEnd,
  SysInitBegin,
  SysInitEnd,
  SysInputBegin,
  SysInputEnd,
} from '../core_systems/SysSentinels';
import SysDestroyEntity from '../core_systems/SysDestroyEntity';
import { GameContext } from './GameContext';
import Scene from './Scene';
import {
  CompDestroyMe,
  CompDestroyWithScene,
} from '../core_components/CompDestroy';
import SysMouseDepth from '../core_systems/SysMouseDepth';

export default class CoreScene extends Scene {
  buildScene(context: GameContext): void {
    this._registerCoreComponents(context);
    this._registerCoreSystems(context);

    context.ecs_manager.activateSystem(context, SysMouse);
    context.ecs_manager.activateSystem(context, SysMouseDepth);
    context.ecs_manager.activateSystem(context, SysDestroyEntity);

    console.log('CoreScene built!');
  }

  destroyScene(context: GameContext): void {
    context.ecs_manager.deactivateSystem(context, SysMouse);

    console.log('CoreScene destroyed!');
  }

  /**
   * Adds the core system for drawing entities to the ECS.
   */
  private _registerCoreSystems(context: GameContext): void {
    // Register sentinels first
    context.ecs_manager.registerSystem(SysInitBegin, [], [SysInitEnd]);
    context.ecs_manager.registerSystem(
      SysInitEnd,
      [SysInitBegin],
      [SysInputBegin],
    );
    context.ecs_manager.registerSystem(
      SysInputBegin,
      [SysInitEnd],
      [SysInputEnd],
    );
    context.ecs_manager.registerSystem(
      SysInputEnd,
      [SysInputBegin],
      [SysDrawBegin],
    );
    context.ecs_manager.registerSystem(
      SysDrawBegin,
      [SysInputEnd],
      [SysDrawEnd],
    );
    context.ecs_manager.registerSystem(
      SysDrawEnd,
      [SysDrawBegin],
      [SysCleanupBegin],
    );
    context.ecs_manager.registerSystem(
      SysCleanupBegin,
      [SysDrawEnd],
      [SysCleanupEnd],
    );
    context.ecs_manager.registerSystem(SysCleanupEnd, [SysCleanupBegin], []);
    // Register actual systems
    context.ecs_manager.registerSystem(
      SysMouse,
      [SysInputBegin],
      [SysInputEnd],
    );
    context.ecs_manager.registerSystem(
      SysMouseDepth,
      [SysInputEnd],
      [SysDrawBegin],
    );
    context.ecs_manager.registerSystem(
      SysDestroyEntity,
      [SysCleanupBegin],
      [SysCleanupEnd],
    );
  }

  /**
   * Registers all core components.
   */
  private _registerCoreComponents(context: GameContext): void {
    context.ecs_manager.registerComponent(CompChild);
    context.ecs_manager.registerComponent(CompDestroyMe);
    context.ecs_manager.registerComponent(CompDestroyWithScene);
    context.ecs_manager.registerComponent(CompDrawable);
    context.ecs_manager.registerComponent(CompFillStyle);
    context.ecs_manager.registerComponent(CompLineStyle);
    context.ecs_manager.registerComponent(CompIsMouse);
    context.ecs_manager.registerComponent(CompMouseEvent);
    context.ecs_manager.registerComponent(CompMouseSensitive);
    context.ecs_manager.registerComponent(CompMouseState);
    context.ecs_manager.registerComponent(CompNamed);
    context.ecs_manager.registerComponent(CompParent);
  }
}
