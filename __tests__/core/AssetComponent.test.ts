import AssetComponent from '../../src/engine/core/AssetComponent';
import AssetStore, { AssetData, AssetId, AssetType } from '../../src/engine/core/AssetStore';


// Create a mock AssetComponent class since it's abstract
class MockAssetComponent extends AssetComponent {}

describe('AssetComponent', () => {
  let assetStore: AssetStore;
  let mockAsset: AssetData;
  let assetId: AssetId;

  beforeEach(() => {
    assetStore = {
      getAssetId: jest.fn(),
      useAsset: jest.fn(),
      releaseAsset: jest.fn(),
    } as unknown as AssetStore;

    mockAsset = {
      key: 'test-asset',
      path: 'assets/test.png',
      type: AssetType.Image,
    };

    assetId = 1;
    (assetStore.getAssetId as jest.Mock).mockReturnValue(assetId);
  });

  test('should create an AssetComponent and retrieve the correct asset ID', () => {
    const component = new MockAssetComponent(assetStore, mockAsset.key);

    expect(component.asset_id).toBe(assetId);
    expect(assetStore.getAssetId).toHaveBeenCalledWith(mockAsset.key);
  });

  test('should call useAsset when an AssetComponent is created', () => {
    new MockAssetComponent(assetStore, mockAsset.key);

    expect(assetStore.useAsset).toHaveBeenCalledWith(assetId);
  });

  test('should throw an error if asset key is not registered', () => {
    (assetStore.getAssetId as jest.Mock).mockImplementation(() => {
      throw new Error(`Asset with key '${mockAsset.key}' is not registered.`);
    });

    expect(() => new MockAssetComponent(assetStore, mockAsset.key)).toThrow(
      `Asset with key '${mockAsset.key}' is not registered.`
    );
  });

  test('should return the correct asset ID', () => {
    const component = new MockAssetComponent(assetStore, mockAsset.key);
    expect(component.asset_id).toBe(assetId);
  });

});
