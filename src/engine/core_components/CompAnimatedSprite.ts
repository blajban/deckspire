import AnimStates, { AnimConfig, AnimKey } from '../core/SpriteAnimations';
import AssetComponent from '../core/AssetComponent';
import AssetStore from '../core/AssetStore';
import PhaserContext from '../core/PhaserContext';

export default class CompAnimatedSprite extends AssetComponent {
  public states: AnimStates;

  constructor(
    asset_store: AssetStore,
    animations: AnimConfig[],
    default_state_key: AnimKey,
  ) {
    super(asset_store, null);
    this.states = new AnimStates(asset_store, animations, default_state_key);
  }
}
