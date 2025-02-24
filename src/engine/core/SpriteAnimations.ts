import AssetStore, { AssetId, AssetKey } from './AssetStore';
import PhaserContext from './PhaserContext';

export type AnimKey = string;

export interface AnimConfig {
  key: AnimKey;
  shouldLoop: boolean;
  isPlaying: boolean;
  assetKey: AssetKey;
  startFrame: number;
  numFrames: number;
  frameRate: number;
}

export class AnimState {
  private _anim: AnimConfig;
  private _asset_id: AssetId | null = null;
  public elapsed: number = 0;

  constructor(asset_store: AssetStore, anim: AnimConfig) {
    this._anim = anim;

    this._asset_id = asset_store.getAssetId(this._anim.assetKey);
    asset_store.useAsset(this._asset_id);
  }

  get key(): AnimKey {
    return this._anim.key;
  }
  get should_loop(): boolean {
    return this._anim.shouldLoop;
  }
  set should_loop(should_loop: boolean) {
    this._anim.shouldLoop = should_loop;
  }
  get is_playing(): boolean {
    return this._anim.isPlaying;
  }
  set is_playing(should_play: boolean) {
    this._anim.isPlaying = should_play;
  }
  get asset_id(): AssetId | null {
    return this._asset_id;
  }
  get start_frame(): number {
    return this._anim.startFrame;
  }
  get num_frames(): number {
    return this._anim.numFrames;
  }
  get frame_rate(): number {
    return this._anim.frameRate;
  }
}

export default class AnimStates {
  public current_state: AnimState;
  private _states: Map<AnimKey, AnimState> = new Map();

  constructor(
    asset_store: AssetStore,
    animations: AnimConfig[],
    default_state: AnimKey,
  ) {
    animations.forEach((anim) => {
      const state = new AnimState(asset_store, anim);
      this._states.set(state.key, state);
    });

    this.current_state = this.getState(default_state);
  }

  getState(key: AnimKey): AnimState {
    if (!this._states.has(key)) {
      throw new Error(`Animation state ${key} does not exist.`);
    }

    return this._states.get(key) as AnimState;
  }

  switchState(new_state: AnimKey): void {
    if (this.current_state.key === new_state) {
      return;
    }

    this.current_state = this.getState(new_state);
  }

  releaseAssets(phaser_scene: PhaserContext, asset_store: AssetStore): void {
    this._states.forEach((state) => {
      if (state.asset_id) {
        asset_store.releaseAsset(phaser_scene, state.asset_id);
      }
    });
  }
}
