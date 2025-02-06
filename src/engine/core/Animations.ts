

import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetId, AssetKey } from '../core/AssetStore';
import Component from '../core/Component';

export type AnimKey = string;

export enum AnimType {
  Spritesheet = 'spritesheet',
  Transform = 'transform',
}

export interface AnimConfigSpritesheet {
  type: AnimType;
  asset_key: AssetKey;
  start_frame: number;
  num_frames: number;
  frame_rate: number;
}

export interface AnimConfigTransform {
  type: AnimType;
}

export type AnimConfig =
  | AnimConfigSpritesheet
  | AnimConfigTransform;

export interface AnimBaseData {
  key: AnimKey;
  loop: boolean;
  playing: boolean;
}

export interface Anim {
  base: AnimBaseData,
  type_config: AnimConfig,
}

export class AnimState {
  private _anim: Anim;
  private _asset_id: AssetId | null = null;

  constructor(
    asset_store: AssetStore,
    anim: Anim,
  ) {
    this._anim = anim;

    if (this._anim.type_config.type === AnimType.Spritesheet) {
      this._asset_id = asset_store.getAssetId((this._anim.type_config as AnimConfigSpritesheet).asset_key);
      asset_store.useAsset(this._asset_id);
    }
  }

  get asset_id(): AssetId | null { return this._asset_id; }
  get anim_key(): AnimKey { return this._anim.base.key; }

  get loop(): boolean { return this._anim.base.loop; }
  set loop(new_val: boolean) { this._anim.base.loop = new_val; }
  
  get playing(): boolean { return this._anim.base.playing; }
  set playing(new_val: boolean) { this._anim.base.playing = new_val; }

  get type_config(): AnimConfigSpritesheet | AnimConfigTransform { return this._anim.type_config; }
}

export class AnimStates {
  private _states: Map<AnimKey, AnimState> = new Map();

  constructor(asset_store: AssetStore, animations: Anim[]) {
    animations.forEach((anim) => {
      const state = new AnimState(asset_store, anim);
      this._states.set(state.anim_key, state);
    })
  }

  getState(key: AnimKey): AnimState {
    if (!this._states.has(key)) {
      throw new Error(`Animation state ${key} does not exist.`)
    }

    return this._states.get(key) as AnimState;
  }

  releaseAssets(asset_store: AssetStore): void {
    this._states.forEach((state) => {
      if (state.asset_id) {
        asset_store.releaseAsset(state.asset_id)}
      }
    );
  }
}


export class Animate {
  public current_state: AnimState;
  private _animation_states: AnimStates;
  
  constructor(asset_store: AssetStore, animations: Anim[], default_state: AnimKey) {
    this._animation_states = new AnimStates(asset_store, animations);
    this.current_state = this._animation_states.getState(default_state);
  }

  switchState(new_state: AnimKey): void {
    if (this.current_state.anim_key === new_state) return;
  
    this.current_state = this._animation_states.getState(new_state);
  }

  releaseAssets(asset_store: AssetStore): void {
    this._animation_states.releaseAssets(asset_store);
  }
}






