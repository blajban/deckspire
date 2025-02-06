import EcsManager from './EcsManager';
import Phaser from 'phaser';

export class PhaserScene extends Phaser.Scene {
  private _ready_promise: Promise<void>;
  private _ready_resolver: (() => void) | null = null;

  constructor(private _on_update: (time: number, delta: number) => void) {
    super('Phaser Helper Scene');
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

export class GameContext {
  public readonly phaser_scene: PhaserScene;
  public readonly ecs_manager = new EcsManager();
  constructor(callback: (time: number, delta: number) => void) {
    this.phaser_scene = new PhaserScene(callback);
  }
}
