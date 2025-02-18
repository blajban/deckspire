import Animate, { Anim, AnimKey } from '../core/Animations';
import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetKey } from '../core/AssetStore';

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
