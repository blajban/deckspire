import Ecs from './Ecs';
import EntityStore from './EntityStore';
import ComponentStore from './ComponentStore';
import { Context } from './Engine';

export default abstract class Scene {
  private _ecs!: Ecs;

  protected context!: Context;

  initialize(context: Context): void {
    this.context = context;
    this._ecs = new Ecs(
      new EntityStore(),
      new ComponentStore(),
      context.asset_store!,
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
