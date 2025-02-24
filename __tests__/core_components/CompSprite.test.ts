import CompSprite from '../../src/engine/core_components/CompSprite';
import AssetStore, { AssetKey, AssetId } from '../../src/engine/core/AssetStore';


describe('CompSprite', () => {
  let mock_asset_store: AssetStore;

  beforeEach(() => {
    mock_asset_store = {
      getAssetId: jest.fn((key: AssetKey) => 1 as AssetId),
      useAsset: jest.fn(),
      releaseAsset: jest.fn(),
    } as unknown as AssetStore;
  });

  test('should initialize with a valid asset key', () => {
    const assetKey: AssetKey = 'test_sprite';
    const sprite = new CompSprite(mock_asset_store, assetKey);

    expect(mock_asset_store.getAssetId).toHaveBeenCalledWith(assetKey);
    expect(mock_asset_store.useAsset).toHaveBeenCalledWith(1);
    expect(sprite.frame).toBeUndefined();
  });

  test('should initialize with a frame number if provided', () => {
    const assetKey: AssetKey = 'test_sprite';
    const frame = 5;
    const sprite = new CompSprite(mock_asset_store, assetKey, frame);

    expect(mock_asset_store.getAssetId).toHaveBeenCalledWith(assetKey);
    expect(mock_asset_store.useAsset).toHaveBeenCalledWith(1);
    expect(sprite.frame).toBe(frame);
  });

  test('should correctly store the asset id', () => {
    const assetKey: AssetKey = 'sprite_asset';
    const sprite = new CompSprite(mock_asset_store, assetKey);

    expect(sprite.asset_id).toBe(1);
  });
});
