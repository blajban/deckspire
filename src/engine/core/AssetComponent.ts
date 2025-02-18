import AssetStore, { AssetId, AssetKey } from './AssetStore';
import Component from './Component';

export default abstract class AssetComponent extends Component {
  private _asset_id: AssetId;

  constructor(asset_store: AssetStore, asset_key: AssetKey) {
    super();
    this._asset_id = asset_store.getAssetId(asset_key);
    asset_store.useAsset(this._asset_id);
  }

  get asset_id(): AssetId {
    return this._asset_id;
  }
}
