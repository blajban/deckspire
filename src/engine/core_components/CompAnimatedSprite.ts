import AnimationStates, { AnimationConfig, AnimationKey } from '../core/SpriteAnimations';
import AssetComponent from '../core/AssetComponent';
import AssetStore from '../core/AssetStore';

export default class CompAnimatedSprite extends AssetComponent {
  public states: AnimationStates;

  constructor(
    asset_store: AssetStore,
    animations: AnimationConfig[],
    default_state_key: AnimationKey,
  ) {
    super(asset_store, null);
    this.states = new AnimationStates(asset_store, animations, default_state_key);
  }
}
