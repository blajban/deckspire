import AssetStore, {
  AssetData,
  AssetType,
} from '../../src/engine/core/AssetStore';
import EcsManager from '../../src/engine/core/EcsManager';

// TEST asset counting (increasing, decreasing etc), unload only when no components is using

describe('AssetStore', () => {
  let asset_store: AssetStore;
  let mock_ecs: EcsManager;
  beforeEach(() => {
    mock_ecs = {
      phaser_scene: {
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
    } as unknown as EcsManager;

    asset_store = new AssetStore();
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
      'Asset with key unknown-key is not registered.',
    );
  });

  test('should throw an error when releasing an asset that was not used', () => {
    const asset_id = asset_store.registerAsset(test_audio_asset);
    expect(() =>
      asset_store.releaseAsset(mock_ecs.phaser_scene, asset_id),
    ).toThrow(`Attempted to release non-existent asset ID ${asset_id}`);
  });

  test('should not unload an asset that is not loaded', () => {
    const asset_id = asset_store.registerAsset(test_image_asset);
    asset_store.unloadAsset(mock_ecs.phaser_scene, asset_id);
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

  test('should throw an error when releasing an asset that was not used', () => {
    const asset_id = asset_store.registerAsset(test_audio_asset);
    expect(() =>
      asset_store.releaseAsset(mock_ecs.phaser_scene, asset_id),
    ).toThrow();
  });

  test('should not allow duplicate asset registrations', () => {
    asset_store.registerAsset(test_image_asset);
    expect(() => asset_store.registerAsset(test_image_asset)).toThrow();
  });
});
