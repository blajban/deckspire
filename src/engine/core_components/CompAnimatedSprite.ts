import Animate, { Anim, AnimKey } from '../core/Animations';
import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetKey } from '../core/AssetStore';

export default class CompAnimatedSprite extends AssetComponent {
  public animate: Animate;

  constructor(
    asset_store: AssetStore,
    animations: Anim[],
    default_state_key: AnimKey
  ) {
    super(asset_store, null);
    this.animate = new Animate(asset_store, animations, default_state_key);
  }

  onDestroy(asset_store: AssetStore): void {
    if (this.animate) {
      this.animate.releaseAssets(asset_store);
    }
  }
}
