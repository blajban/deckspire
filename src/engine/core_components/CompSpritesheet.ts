import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetId, AssetKey } from '../core/AssetStore';
import Component from '../core/Component';

export type AnimKey = string;

export interface Anim {
  anim_key: AnimKey,
  frame_rate: number,
  loop: boolean,
  asset_key: AssetKey,
  start_frame: number,
  num_frames: number,
}

export class AnimState {
  private _asset_id: AssetId;
  public anim_key: AnimKey;
  public frame_rate: number;
  public loop: boolean;
  public start_frame: number;
  public num_frames: number;

  constructor(
    asset_store: AssetStore,
    anim: Anim,
  ) {
    this.anim_key = anim.anim_key;
    this.frame_rate = anim.frame_rate;
    this.loop = anim.loop;
    this.start_frame = anim.start_frame;
    this.num_frames = anim.num_frames;

    this._asset_id = asset_store.getAssetId(anim.asset_key);
    asset_store.useAsset(this._asset_id);
  }

  get asset_id(): AssetId {
    return this._asset_id;
  }
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
    this._states.forEach((state) => asset_store.releaseAsset(state.asset_id));
  }
}


export class Animate {
  public playing: boolean = true;
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

export default class CompSpritesheet extends AssetComponent {
  public animate: Animate | null = null;

  constructor(
    asset_store: AssetStore,
    asset_key: AssetKey,
    public current_frame: number,
    animations?: Anim[],
    default_state_key?: AnimKey
  ) {
    super(asset_store, asset_key);
    if (animations && default_state_key) {
      this.animate = new Animate(asset_store, animations, default_state_key);
    }
  }

  onDestroy(asset_store: AssetStore): void {
    if (this.animate) {
      this.animate.releaseAssets(asset_store);
    }

    asset_store.releaseAsset(this.asset_id);
  }
}
