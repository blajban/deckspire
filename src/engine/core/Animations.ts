

import AssetStore, { AssetId, AssetKey } from '../core/AssetStore';

export type AnimKey = string;

export enum AnimType {
  Spritesheet = 'spritesheet',
  Transform = 'transform',
}

export interface AnimConfigSpritesheet {
  asset_key: AssetKey;
  start_frame: number;
  num_frames: number;
  frame_rate: number;
}

export interface AnimConfigTransformData {
  duration: number,
  start_value: number,
  end_value: number,
}

export interface AnimConfigTransform {
  scale_x: AnimConfigTransformData | null,
  scale_y: AnimConfigTransformData | null,
  rotation: AnimConfigTransformData | null,
}

export type AnimConfig =
  | AnimConfigSpritesheet
  | AnimConfigTransform;

export interface AnimBaseData {
  key: AnimKey;
  loop: boolean;
  playing: boolean;
}

export interface Animation {
  type: AnimType,
  base: AnimBaseData,
  config: AnimConfig,
}

export class AnimState {
  private _anim: Animation;
  private _asset_id: AssetId | null = null;
  public elapsed: number = 0;

  constructor(
    asset_store: AssetStore | null,
    anim: Animation,
  ) {
    this._anim = anim;

    if (asset_store && this._anim.type === AnimType.Spritesheet) {
      this._asset_id = asset_store.getAssetId((this._anim.config as AnimConfigSpritesheet).asset_key);
      asset_store.useAsset(this._asset_id);
    }
  }

  get asset_id(): AssetId | null { return this._asset_id; }
  get anim_key(): AnimKey { return this._anim.base.key; }

  get loop(): boolean { return this._anim.base.loop; }
  set loop(new_val: boolean) { this._anim.base.loop = new_val; }
  
  get playing(): boolean { return this._anim.base.playing; }
  set playing(new_val: boolean) { this._anim.base.playing = new_val; }

  get config(): AnimConfigSpritesheet | AnimConfigTransform { return this._anim.config; }
}

export default class AnimStates {
  public current_state: AnimState;
  private _states: Map<AnimKey, AnimState> = new Map();

  constructor(asset_store: AssetStore | null, animations: Animation[], default_state: AnimKey) {
    animations.forEach((anim) => {
      const state = new AnimState(asset_store, anim);
      this._states.set(state.anim_key, state);
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
    if (this.current_state.anim_key === new_state) return;
  
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
