import AssetComponent from '../../src/engine/core/AssetComponent';
import AssetStore, {
  AssetData,
  AssetId,
  AssetType,
} from '../../src/engine/core/AssetStore';

// Create a mock AssetComponent class since it's abstract
class MockAssetComponent extends AssetComponent {}

describe('AssetComponent', () => {
  let asset_store: AssetStore;
  let mock_asset: AssetData;
  let asset_id: AssetId;

  beforeEach(() => {
    asset_store = {
      getAssetId: jest.fn(),
      useAsset: jest.fn(),
      releaseAsset: jest.fn(),
    } as unknown as AssetStore;

    mock_asset = {
      key: 'test-asset',
      path: 'assets/test.png',
      type: AssetType.Image,
    };

    asset_id = 1;
    (asset_store.getAssetId as jest.Mock).mockReturnValue(asset_id);
  });

  test('should create an AssetComponent and retrieve the correct asset ID', () => {
    const component = new MockAssetComponent(asset_store, mock_asset.key);

    expect(component.asset_id).toBe(asset_id);
    expect(asset_store.getAssetId).toHaveBeenCalledWith(mock_asset.key);
  });

  test('should call useAsset when an AssetComponent is created', () => {
    new MockAssetComponent(asset_store, mock_asset.key);

    expect(asset_store.useAsset).toHaveBeenCalledWith(asset_id);
  });

  test('should throw an error if asset key is not registered', () => {
    (asset_store.getAssetId as jest.Mock).mockImplementation(() => {
      throw new Error(`Asset with key '${mock_asset.key}' is not registered.`);
    });

    expect(() => new MockAssetComponent(asset_store, mock_asset.key)).toThrow(
      `Asset with key '${mock_asset.key}' is not registered.`,
    );
  });

  test('should return the correct asset ID', () => {
    const component = new MockAssetComponent(asset_store, mock_asset.key);
    expect(component.asset_id).toBe(asset_id);
  });
});
