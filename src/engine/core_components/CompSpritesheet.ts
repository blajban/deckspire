import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetKey } from '../core/AssetStore';

export default class CompSpritesheet extends AssetComponent {
  constructor(
    asset_store: AssetStore,
    asset_key: AssetKey,
    public current_frame: number,
  ) {
    super(asset_store, asset_key);
  }
}
