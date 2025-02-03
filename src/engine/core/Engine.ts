import Phaser from 'phaser';
import SceneManager from './SceneManager';
import EcsManager from './EcsManager';
import Scene from './Scene';

export class PhaserScene extends Phaser.Scene {
  private _ready_promise: Promise<void>;
  private _ready_resolver: (() => void) | null = null;

  constructor(private _on_update: (time: number, delta: number) => void) {
    super('Engine');
    this._ready_promise = new Promise((resolve) => {
      this._ready_resolver = resolve;
    });
  }

  public create(): void {
    if (this._ready_resolver) {
      this._ready_resolver();
    }
  }

  public ready(): Promise<void> {
    return this._ready_promise;
  }

  public update(time: number, delta: number): void {
    this._on_update(time, delta);
  }
}

export class Context {
  public readonly phaser_scene: PhaserScene;
  public readonly ecs_manager;
  constructor(phaser_scene: PhaserScene, ecs_manager: EcsManager) {
    this.phaser_scene = phaser_scene;
    this.ecs_manager = ecs_manager;
  }
}

export default class Engine {
  private _width: number;
  private _height: number;
  private _phaser_game: Phaser.Game;
  private _phaser_scene = new PhaserScene((time, delta) =>
    this._update(time, delta),
  );
  private _esc_manager = new EcsManager();
  private _context = new Context(this._phaser_scene, this._esc_manager);
  private _scene_manager = new SceneManager();

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;

    this._phaser_game = new Phaser.Game({
      type: Phaser.AUTO,
      width: this._width,
      height: this._height,
      scene: [this._context.phaser_scene],
      banner: false, // Clutters test outputs
    });
  }

  ready(): Promise<void> {
    return this._context.phaser_scene.ready();
  }

  private _update(time: number, delta: number): void {
    this._context.ecs_manager.update(this._context, time, delta);
  }

  public registerScene(key: string, scene: Scene): void {
    this._scene_manager.registerScene(key, scene);
  }

  public buildScenes(scene_keys: string[]): void {
    this.ready().then(() => {
      scene_keys.forEach((key) => {
        this._scene_manager.buildScene(this._context, key);
      });
    });
  }
}
