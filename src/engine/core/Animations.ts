import AssetStore, { AssetId, AssetKey } from '../core/AssetStore';

export type AnimKey = string;

export interface AnimConfig {
  key: AnimKey;
  loop: boolean;
  playing: boolean;
  asset_key: AssetKey;
  start_frame: number;
  num_frames: number;
  frame_rate: number;
}

export class AnimState {
  private _anim: AnimConfig;
  private _asset_id: AssetId | null = null;
  public elapsed: number = 0;

  constructor(
    asset_store: AssetStore,
    anim: AnimConfig,
  ) {
    this._anim = anim;

    this._asset_id = asset_store.getAssetId(this._anim.asset_key);
    asset_store.useAsset(this._asset_id);

  }

  get key(): AnimKey { return this._anim.key; }
  get loop(): boolean { return this._anim.loop; }
  set loop(new_val: boolean) { this._anim.loop = new_val; }
  get playing(): boolean { return this._anim.playing; }
  set playing(new_val: boolean) { this._anim.playing = new_val; }
  get asset_id(): AssetId | null { return this._asset_id; }
  get start_frame(): number { return this._anim.start_frame; }
  get num_frames(): number { return this._anim.num_frames; }
  get frame_rate(): number { return this._anim.frame_rate; }
}

export default class AnimStates {
  public current_state: AnimState;
  private _states: Map<AnimKey, AnimState> = new Map();

  constructor(asset_store: AssetStore, animations: AnimConfig[], default_state: AnimKey) {
    animations.forEach((anim) => {
      const state = new AnimState(asset_store, anim);
      this._states.set(state.key, state);
    })

    this.current_state = this.getState(default_state);
  }

  getState(key: AnimKey): AnimState {
    if (!this._states.has(key)) {
      throw new Error(`Animation state ${key} does not exist.`)
    }

    return this._states.get(key) as AnimState;
  }

  switchState(new_state: AnimKey): void {
    if (this.current_state.key === new_state) return;
  
    this.current_state = this.getState(new_state);
  }

  releaseAssets(asset_store: AssetStore): void {
    this._states.forEach((state) => {
      if (state.asset_id) {
        asset_store.releaseAsset(state.asset_id)}
      }
    );
  }
}
