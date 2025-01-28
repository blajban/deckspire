import World from './World';
import EntityStore from './EntityStore';
import ComponentStore from './ComponentStore';
import Engine from './Engine';

export default abstract class Scene {
  private _world: World = new World(new EntityStore(), new ComponentStore());

  protected engine!: Engine;

  initialize(engine: Engine) {
    this.engine = engine;
  }

  get world(): World { return this._world; }

  abstract on_load(): void;
  abstract on_update(time: number, delta: number): void;
  abstract on_exit(): void;
}




