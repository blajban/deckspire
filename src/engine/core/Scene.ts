import World from './World';
import EntityStore from './EntityStore';
import ComponentStore from './ComponentStore';
import Engine from './Engine';

export default abstract class Scene {
  private _world: World = new World(new EntityStore(), new ComponentStore());

  protected engine!: Engine;

  initialize(engine: Engine): void {
    this.engine = engine;
  }

  get world(): World {
    return this._world;
  }

  onRegister(): void {}
  onStart(): void {}
  abstract onUpdate(time: number, delta: number): void;
  onExit(): void {}
  onPause(): void {}
  onResume(): void {}
}
