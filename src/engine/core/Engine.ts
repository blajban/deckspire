import Phaser from 'phaser';
import SceneManager from './SceneManager';
import Scene from './Scene';
import { GameContext } from './GameContext';
import CoreScene from './CoreScene';

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

    this._context.phaser_scene.ready().then(() => {
      this.registerScene('core', new CoreScene());
      this.buildScenes(['core']);
      ready_resolver();
    });
  }

  public ready(): Promise<void> {
    return this._ready_promise;
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
