import AssetStore, { AssetData, AssetType } from '../../src/engine/core/AssetStore';
import Engine, { Context } from '../../src/engine/core/Engine';

// TEST asset counting (increasing, decreasing etc), unload only when no components is using



describe('AssetStore', () => {
  let engine: Engine;
  let asset_store: AssetStore;
  let mock_context: Context
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

  const testImageAsset: AssetData = {
    key: 'test-image',
    path: 'assets/image.png',
    type: AssetType.Image,
  };

  const testSpritesheetAsset: AssetData = {
    key: 'test-spritesheet',
    path: 'assets/spritesheet.png',
    type: AssetType.Spritesheet,
    frameConfig: { frameWidth: 32, frameHeight: 32 },
  };

  const testAudioAsset: AssetData = {
    key: 'test-audio',
    path: 'assets/sound.mp3',
    type: AssetType.Audio,
  };

  test('should register an asset and return an AssetId', () => {
    const assetId = asset_store.registerAsset(testImageAsset);
    expect(assetId).toBeDefined();
    expect(asset_store.getAssetId(testImageAsset.key)).toBe(assetId);
  });



   test('should throw an error if the same asset is registered twice', () => {
    asset_store.registerAsset(testImageAsset);
    expect(() => asset_store.registerAsset(testImageAsset)).toThrow(
      `Asset ${testImageAsset.key} is already registered.`
    );
  });


  test('should retrieve an asset ID by key', () => {
    const assetId = asset_store.registerAsset(testImageAsset);
    expect(asset_store.getAssetId(testImageAsset.key)).toBe(assetId);
  });

  test('should throw an error when retrieving an unregistered asset ID', () => {
    expect(() => asset_store.getAssetId('unknown-key')).toThrow(
      "Asset with key 'unknown-key' is not registered."
    );
  });

  test('should preload assets by key', () => {
    asset_store.registerAsset(testImageAsset);
    asset_store.preloadAssets([testImageAsset.key]);

    expect(mock_context.phaser_context!.load.image).toHaveBeenCalledWith(
      testImageAsset.key,
      testImageAsset.path
    );
  });

  test('should load spritesheet with frameConfig', () => {
    asset_store.registerAsset(testSpritesheetAsset);
    asset_store.preloadAssets([testSpritesheetAsset.key]);

    expect(mock_context.phaser_context!.load.spritesheet).toHaveBeenCalledWith(
      testSpritesheetAsset.key,
      testSpritesheetAsset.path,
      testSpritesheetAsset.frameConfig
    );
  });

  test('should track loaded assets', () => {
    const assetId = asset_store.registerAsset(testAudioAsset);
    asset_store.preloadAssets([testAudioAsset.key]);

    expect(asset_store.isAssetLoaded(assetId)).toBe(true);
  });

  test('should throw an error when releasing an asset that was not used', () => {
    const assetId = asset_store.registerAsset(testAudioAsset);
    expect(() => asset_store.releaseAsset(assetId)).toThrow(
      `Attempted to release non-existent asset ID ${assetId}`
    );
  });

  test('should unload an asset properly', () => {
    const assetId = asset_store.registerAsset(testImageAsset);
    asset_store.preloadAssets([testImageAsset.key]);
    asset_store.unloadAsset(assetId);

    expect(mock_context.phaser_context!.textures.remove).toHaveBeenCalledWith(testImageAsset.key);
    expect(asset_store.isAssetLoaded(assetId)).toBe(false);
  });

  test('should not unload an asset that is not loaded', () => {
    const assetId = asset_store.registerAsset(testImageAsset);
    asset_store.unloadAsset(assetId);
    expect(asset_store.isAssetLoaded(assetId)).toBe(false);
  });

  test('should register multiple assets at once', () => {
    const assets = [testImageAsset, testSpritesheetAsset, testAudioAsset];
    asset_store.registerAssets(assets);

    assets.forEach((asset) => {
      expect(asset_store.getAssetId(asset.key)).toBeDefined();
    });
  });

  test('should throw an error if registering duplicate assets in batch', () => {
    asset_store.registerAsset(testImageAsset);
    expect(() => asset_store.registerAssets([testImageAsset])).toThrow(
      `Asset ${testImageAsset.key} is already registered.`
    );
  });

  test('should throw an error when getting asset with an invalid ID', () => {
    expect(() => asset_store.getAsset(999)).toThrow(
      `Asset with id 999 must be registered first.`
    );
  });

  test('should throw an error when releasing an asset that was not used', () => {
    const assetId = asset_store.registerAsset(testAudioAsset);
    expect(() => asset_store.releaseAsset(assetId)).toThrow();
  });

  test('should not allow duplicate asset registrations', () => {
    asset_store.registerAsset(testImageAsset);
    expect(() => asset_store.registerAsset(testImageAsset)).toThrow();
  });
});
