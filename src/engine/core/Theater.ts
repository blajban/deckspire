import Phaser from 'phaser';
import SceneManager from './SceneManager';
import Scene from './Scene';
import CoreScene from './CoreScene';
import EcsManager from './EcsManager';
import PhaserContext, { PhaserScene } from './PhaserContext';
import GraphicsCache from './GraphicsCache';

export default class Theater {
  private _ready_promise: Promise<void>;
  private _width: number;
  private _height: number;
  private _phaser_game: Phaser.Game;
  private _scene_manager = new SceneManager();
  private _ecs_manager = new EcsManager();
  private _phaser_context = new PhaserContext(
    new PhaserScene((time: number, delta: number) => {
      this._ecs_manager.update(
        this._phaser_context,
        0.001 * time,
        0.001 * delta,
      );
    }),
    new GraphicsCache(),
  );

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
      scene: [this._phaser_context.phaser_scene],
      banner: false, // Clutters test outputs
    });

    this._phaser_context.phaser_scene.ready().then(() => {
      this.registerScene('core', new CoreScene());
      this.buildScenes(['core']);
      ready_resolver();
    });
  }

  public ready(): Promise<void> {
    return this._ready_promise;
  }

  public registerScene(key: string, scene: Scene): void {
    this._scene_manager.registerScene(key, scene);
  }

  public preloadScenes(scene_keys: string[]): void {
    scene_keys.forEach((key) => {
      this._scene_manager.preloadScene(
        this._ecs_manager,
        this._phaser_context,
        key,
      );
    });
  }

  public buildScenes(scene_keys: string[]): void {
    scene_keys.forEach((key) => {
      this._scene_manager.loadScene(
        this._ecs_manager,
        this._phaser_context,
        key,
      );
    });
  }
}
