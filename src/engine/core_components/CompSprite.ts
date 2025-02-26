import AssetComponent from '../core/AssetComponent';
import AssetStore, { AssetKey } from '../core/AssetStore';

export default class CompSprite extends AssetComponent {
  constructor(
    asset_store: AssetStore,
    asset_key: AssetKey,
    public frame?: number,
  ) {
    super(asset_store, asset_key);
  }
}
