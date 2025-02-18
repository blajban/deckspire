import Phaser from 'phaser';

export default class PhaserScene extends Phaser.Scene {
  private _ready_promise: Promise<void>;
  private _ready_resolver!: () => void;

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
