import AssetStore, { AssetId, AssetKey } from './AssetStore';
import Component from './Component';

export default abstract class AssetComponent extends Component {
  private _asset_id: AssetId | null = null;

  constructor(asset_store: AssetStore, asset_key: AssetKey | null) {
    super();
    if (asset_key) {
      this._asset_id = asset_store.getAssetId(asset_key);
      asset_store.useAsset(this._asset_id);
    }
    
  }

  get asset_id(): AssetId | null {
    return this._asset_id;
  }

  onDestroy(asset_store: AssetStore): void {
    if (this.asset_id) {
      asset_store.releaseAsset(this._asset_id!);
    }
    
  }
}
