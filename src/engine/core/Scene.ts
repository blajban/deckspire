import Ecs from './Ecs';
import EntityStore from './EntityStore';
import ComponentStore from './ComponentStore';
import { EnginePhaserScene } from './Engine';

export default abstract class Scene {
  private _ecs: Ecs = new Ecs(new EntityStore(), new ComponentStore());

  protected engine_phaser_scene!: EnginePhaserScene;

  initialize(engine_phaser_scene: EnginePhaserScene): void {
    this.engine_phaser_scene = engine_phaser_scene;
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
