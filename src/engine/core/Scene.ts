import Ecs from './Ecs';
import EntityStore from './EntityStore';
import ComponentStore from './ComponentStore';
import Engine from './Engine';

export default abstract class Scene {
  private _ecs!: Ecs;

  protected engine!: Engine;

  initialize(engine: Engine): void {
    this.engine = engine;
    this._ecs = new Ecs(
      new EntityStore(),
      new ComponentStore(),
      engine.getAssetStore(),
    );
  }

  get ecs(): Ecs {
    return this._ecs;
  }

  onRegister(): void {}
  onStart(): void {}
  abstract onUpdate(time: number, delta: number): void;
  onExit(): void {}
  onPause(): void {}
  onResume(): void {}
}
