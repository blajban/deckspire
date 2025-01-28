import Phaser from 'phaser';
import Scene from './Scene';

export default class Engine extends Phaser.Scene {
  private _width: number;
  private _height: number;
  private _phaser_context: Phaser.Game;
  private _registered_scenes: Map<string, Scene> = new Map();
  private _active_scenes: Map<string, Scene> = new Map();

  // Asset store
  // System store
  // How to handle global objects

  constructor(width: number, height: number) {
    super('Engine');
    this._width = width;
    this._height = height;
    
    this._phaser_context = new Phaser.Game({
      type: Phaser.AUTO,
      width: this._width,
      height: this._height,
      scene: [this],
    });
  }

  add_scene(key: string, scene: Scene) {
    if (!this._registered_scenes.has(key)) {
      scene.initialize(this);
      this._registered_scenes.set(key, scene);
    }
  }

  start_scene(key: string) {
    const scene = this._registered_scenes.get(key);
    if (scene) {
      scene.on_start();
      this._active_scenes.set(key, scene);
    }
  }

  stop_scene(key: string) {
    const scene = this._active_scenes.get(key);
    if (scene) {
      scene.on_exit();
      this._active_scenes.delete(key);
    }
  }

  preload() {
    
  }

  create() {

  }

  update(time: number, delta: number) {
    this._active_scenes.forEach((scene) => {
      scene.on_update(time, delta);
    })
  }



}