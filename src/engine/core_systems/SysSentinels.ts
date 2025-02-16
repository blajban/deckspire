import { GameContext } from '../core/GameContext';
import System from '../core/System';

class SysSentinel extends System {
  override init(_context: GameContext): void {}
  override update(_context: GameContext, _time: number, _delta: number): void {}
  override terminate(_context: GameContext): void {}
}

// Sentinel systems are systems that do nothing, but are used to ensure that other systems are run in a specific order.
export class SysInitBegin extends SysSentinel {}
export class SysInitEnd extends SysSentinel {}
export class SysInputBegin extends SysSentinel {}
export class SysInputEnd extends SysSentinel {}
export class SysDrawBegin extends SysSentinel {}
export class SysDrawEnd extends SysSentinel {}
export class SysCleanupBegin extends SysSentinel {}
export class SysCleanupEnd extends SysSentinel {}
