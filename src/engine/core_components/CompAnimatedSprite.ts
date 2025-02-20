import AnimStates, { Animation, AnimKey } from '../core/Animations';
import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetKey } from '../core/AssetStore';

export default class CompAnimatedSprite extends AssetComponent {
  public states: AnimStates;

  constructor(
    asset_store: AssetStore,
    animations: Animation[],
    default_state_key: AnimKey
  ) {
    super(asset_store, null);
    this.states = new AnimStates(asset_store, animations, default_state_key);
  }

  onDestroy(asset_store: AssetStore): void {
    if (this.states) {
      this.states.releaseAssets(asset_store);
    }
  }
}
