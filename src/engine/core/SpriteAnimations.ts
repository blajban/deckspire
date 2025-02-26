import AssetStore, { AssetId, AssetKey } from './AssetStore';

export type AnimationKey = string;

export interface AnimationConfig {
  key: AnimationKey;
  shouldLoop: boolean;
  isPlaying: boolean;
  assetKey: AssetKey;
  startFrame: number;
  numFrames: number;
  frameRate: number;
}

export class AnimationState {
  private _anim: AnimationConfig;
  private _asset_id: AssetId;
  public elapsed: number = 0;

  constructor(asset_store: AssetStore, anim: AnimationConfig) {
    this._anim = anim;

    this._asset_id = asset_store.getAssetId(this._anim.assetKey);
    asset_store.useAsset(this._asset_id);
  }

  get key(): AnimationKey {
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

export default class AnimationStates {
  public current_state: AnimationState;
  private _states: Map<AnimationKey, AnimationState> = new Map();

  constructor(
    asset_store: AssetStore,
    animations: AnimationConfig[],
    default_state: AnimationKey,
  ) {
    animations.forEach((anim) => {
      const state = new AnimationState(asset_store, anim);
      this._states.set(state.key, state);
    });

    this.current_state = this.getState(default_state);
  }

  getState(key: AnimationKey): AnimationState {
    if (!this._states.has(key)) {
      throw new Error(`Animation state ${key} does not exist.`);
    }

    return this._states.get(key) as AnimationState;
  }

  switchState(new_state: AnimationKey): void {
    if (this.current_state.key === new_state) {
      return;
    }

    this.current_state = this.getState(new_state);
  }

  getAssetIdsUsed(): AssetId[] {
    const asset_ids: AssetId[] = [];
    this._states.forEach((state) => {
      if (state.asset_id) {
        asset_ids.push(state.asset_id);
      }
    });

    return asset_ids;
  }
}
