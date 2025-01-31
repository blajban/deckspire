import AssetStore, {
  AssetData,
  AssetType,
} from '../../src/engine/core/AssetStore';
import { Context } from '../../src/engine/core/Engine';

// TEST asset counting (increasing, decreasing etc), unload only when no components is using

describe('AssetStore', () => {
  let asset_store: AssetStore;
  let mock_context: Context;
  beforeEach(() => {
    mock_context = {
      phaser_context: {
        load: {
          image: jest.fn(),
          spritesheet: jest.fn(),
          audio: jest.fn(),
          bitmapFont: jest.fn(),
        },
        textures: {
          remove: jest.fn(),
        },
        sound: {
          removeByKey: jest.fn(),
        },
      },
    } as unknown as Context;

    asset_store = new AssetStore(mock_context);
  });

  const test_image_asset: AssetData = {
    key: 'test-image',
    path: 'assets/image.png',
    type: AssetType.Image,
  };

  const test_spritesheet_asset: AssetData = {
    key: 'test-spritesheet',
    path: 'assets/spritesheet.png',
    type: AssetType.Spritesheet,
    frameConfig: { frameWidth: 32, frameHeight: 32 },
  };

  const test_audio_asset: AssetData = {
    key: 'test-audio',
    path: 'assets/sound.mp3',
    type: AssetType.Audio,
  };

  test('should register an asset and return an AssetId', () => {
    const asset_id = asset_store.registerAsset(test_image_asset);
    expect(asset_id).toBeDefined();
    expect(asset_store.getAssetId(test_image_asset.key)).toBe(asset_id);
  });

  test('should throw an error if the same asset is registered twice', () => {
    asset_store.registerAsset(test_image_asset);
    expect(() => asset_store.registerAsset(test_image_asset)).toThrow(
      `Asset ${test_image_asset.key} is already registered.`,
    );
  });

  test('should retrieve an asset ID by key', () => {
    const asset_id = asset_store.registerAsset(test_image_asset);
    expect(asset_store.getAssetId(test_image_asset.key)).toBe(asset_id);
  });

  test('should throw an error when retrieving an unregistered asset ID', () => {
    expect(() => asset_store.getAssetId('unknown-key')).toThrow(
      `Asset with key 'unknown-key' is not registered.`,
    );
  });

  test('should preload assets by key', () => {
    asset_store.registerAsset(test_image_asset);
    asset_store.preloadAssets([test_image_asset.key]);

    expect(mock_context.phaser_context!.load.image).toHaveBeenCalledWith(
      test_image_asset.key,
      test_image_asset.path,
    );
  });

  test('should load spritesheet with frameConfig', () => {
    asset_store.registerAsset(test_spritesheet_asset);
    asset_store.preloadAssets([test_spritesheet_asset.key]);

    expect(mock_context.phaser_context!.load.spritesheet).toHaveBeenCalledWith(
      test_spritesheet_asset.key,
      test_spritesheet_asset.path,
      test_spritesheet_asset.frameConfig,
    );
  });

  test('should track loaded assets', () => {
    const asset_id = asset_store.registerAsset(test_audio_asset);
    asset_store.preloadAssets([test_audio_asset.key]);

    expect(asset_store.isAssetLoaded(asset_id)).toBe(true);
  });

  test('should throw an error when releasing an asset that was not used', () => {
    const asset_id = asset_store.registerAsset(test_audio_asset);
    expect(() => asset_store.releaseAsset(asset_id)).toThrow(
      `Attempted to release non-existent asset ID ${asset_id}`,
    );
  });

  test('should unload an asset properly', () => {
    const asset_id = asset_store.registerAsset(test_image_asset);
    asset_store.preloadAssets([test_image_asset.key]);
    asset_store.unloadAsset(asset_id);

    expect(mock_context.phaser_context!.textures.remove).toHaveBeenCalledWith(
      test_image_asset.key,
    );
    expect(asset_store.isAssetLoaded(asset_id)).toBe(false);
  });

  test('should not unload an asset that is not loaded', () => {
    const asset_id = asset_store.registerAsset(test_image_asset);
    asset_store.unloadAsset(asset_id);
    expect(asset_store.isAssetLoaded(asset_id)).toBe(false);
  });

  test('should register multiple assets at once', () => {
    const assets = [test_image_asset, test_spritesheet_asset, test_audio_asset];
    asset_store.registerAssets(assets);

    assets.forEach((asset) => {
      expect(asset_store.getAssetId(asset.key)).toBeDefined();
    });
  });

  test('should throw an error if registering duplicate assets in batch', () => {
    asset_store.registerAsset(test_image_asset);
    expect(() => asset_store.registerAssets([test_image_asset])).toThrow(
      `Asset ${test_image_asset.key} is already registered.`,
    );
  });

  test('should throw an error when getting asset with an invalid ID', () => {
    expect(() => asset_store.getAsset(999)).toThrow(
      'Asset with id 999 must be registered first.',
    );
  });

  test('should throw an error when releasing an asset that was not used', () => {
    const asset_id = asset_store.registerAsset(test_audio_asset);
    expect(() => asset_store.releaseAsset(asset_id)).toThrow();
  });

  test('should not allow duplicate asset registrations', () => {
    asset_store.registerAsset(test_image_asset);
    expect(() => asset_store.registerAsset(test_image_asset)).toThrow();
  });
});
