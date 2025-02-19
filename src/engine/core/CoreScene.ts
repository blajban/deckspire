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
  SysUpdateBegin,
  SysUpdateEnd,
} from '../core_systems/SysSentinels';
import SysDestroyEntity from '../core_systems/SysDestroyEntity';
import Scene from './Scene';
import {
  CompDestroyMe,
  CompDestroyWithLastChild,
  CompDestroyWithParent,
  CompDestroyWithScene,
} from '../core_components/CompDestroy';
import SysMouseDepth from '../core_systems/SysMouseDepth';
import EcsManager from './EcsManager';
import CompTransform from '../core_components/CompTransform';
import CompSprite from '../core_components/CompSprite';
import CompSpritesheet from '../core_components/CompSpritesheet';
import CompAnimation from '../core_components/CompAnimation';
import PhaserContext from './PhaserContext';

export default class CoreScene extends Scene {
  override load(
    ecs: EcsManager,
    _phaser_context: PhaserContext,
  ): Promise<void> {
    this._registerCoreComponents(ecs);
    this._registerCoreSystems(ecs);

    ecs.activateSystem(SysMouse);
    ecs.activateSystem(SysMouseDepth);
    ecs.activateSystem(SysDestroyEntity);

    return Promise.resolve();
  }

  override unload(ecs: EcsManager, _phaser_context: PhaserContext): void {
    ecs.deactivateSystem(SysMouse);
  }

  /**
   * Adds the core system for drawing entities to the ECS.
   */
  private _registerCoreSystems(ecs: EcsManager): void {
    // Register sentinels first
    ecs.registerSystem(SysInitBegin, [], [SysInitEnd]);
    ecs.registerSystem(SysInitEnd, [SysInitBegin], [SysInputBegin]);
    ecs.registerSystem(SysInputBegin, [SysInitEnd], [SysInputEnd]);
    ecs.registerSystem(SysInputEnd, [SysInputBegin], [SysDrawBegin]);
    ecs.registerSystem(SysUpdateBegin, [SysInputEnd], [SysUpdateEnd]);
    ecs.registerSystem(SysUpdateEnd, [SysUpdateBegin], [SysDrawBegin]);
    ecs.registerSystem(SysDrawBegin, [SysInputEnd], [SysDrawEnd]);
    ecs.registerSystem(SysDrawEnd, [SysDrawBegin], [SysCleanupBegin]);
    ecs.registerSystem(SysCleanupBegin, [SysDrawEnd], [SysCleanupEnd]);
    ecs.registerSystem(SysCleanupEnd, [SysCleanupBegin], []);
    // Register actual systems
    ecs.registerSystem(SysMouse, [SysInputBegin], [SysInputEnd]);
    ecs.registerSystem(SysMouseDepth, [SysInputEnd], [SysDrawBegin]);
    ecs.registerSystem(SysDestroyEntity, [SysCleanupBegin], [SysCleanupEnd]);
  }

  /**
   * Registers all core components.
   */
  private _registerCoreComponents(ecs: EcsManager): void {
    ecs.registerComponent(CompAnimation);
    ecs.registerComponent(CompChild);
    ecs.registerComponent(CompDestroyMe);
    ecs.registerComponent(CompDestroyWithLastChild);
    ecs.registerComponent(CompDestroyWithParent);
    ecs.registerComponent(CompDestroyWithScene);
    ecs.registerComponent(CompDrawable);
    ecs.registerComponent(CompFillStyle);
    ecs.registerComponent(CompLineStyle);
    ecs.registerComponent(CompIsMouse);
    ecs.registerComponent(CompMouseEvent);
    ecs.registerComponent(CompMouseSensitive);
    ecs.registerComponent(CompMouseState);
    ecs.registerComponent(CompNamed);
    ecs.registerComponent(CompParent);
    ecs.registerComponent(CompSprite);
    ecs.registerComponent(CompSpritesheet);
    ecs.registerComponent(CompTransform);
  }
}
