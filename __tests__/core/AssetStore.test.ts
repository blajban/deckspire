import AssetStore, { AssetData, AssetType } from '../../src/engine/core/AssetStore';
import Engine from '../../src/engine/core/Engine';

// TEST asset counting (increasing, decreasing etc), unload only when no components is using
  
describe('AssetStore', () => {
  let assetStore: AssetStore;
  let mockEngine: Engine;

  beforeEach(() => {
    mockEngine = {
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
    } as unknown as Engine;

    assetStore = new AssetStore(mockEngine);
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
    const assetId = assetStore.registerAsset(testImageAsset);
    expect(assetId).toBeDefined();
    expect(assetStore.getAssetId(testImageAsset.key)).toBe(assetId);
  });

   test('should throw an error if the same asset is registered twice', () => {
    assetStore.registerAsset(testImageAsset);
    expect(() => assetStore.registerAsset(testImageAsset)).toThrow(
      `Asset ${testImageAsset.key} is already registered.`
    );
  });


  test('should retrieve an asset ID by key', () => {
    const assetId = assetStore.registerAsset(testImageAsset);
    expect(assetStore.getAssetId(testImageAsset.key)).toBe(assetId);
  });

  test('should throw an error when retrieving an unregistered asset ID', () => {
    expect(() => assetStore.getAssetId('unknown-key')).toThrow(
      "Asset with key 'unknown-key' is not registered."
    );
  });

  test('should preload assets by key', () => {
    assetStore.registerAsset(testImageAsset);
    assetStore.preloadAssets([testImageAsset.key]);

    expect(mockEngine.load.image).toHaveBeenCalledWith(
      testImageAsset.key,
      testImageAsset.path
    );
  });

  test('should load spritesheet with frameConfig', () => {
    assetStore.registerAsset(testSpritesheetAsset);
    assetStore.preloadAssets([testSpritesheetAsset.key]);

    expect(mockEngine.load.spritesheet).toHaveBeenCalledWith(
      testSpritesheetAsset.key,
      testSpritesheetAsset.path,
      testSpritesheetAsset.frameConfig
    );
  });

  test('should track loaded assets', () => {
    const assetId = assetStore.registerAsset(testAudioAsset);
    assetStore.preloadAssets([testAudioAsset.key]);

    expect(assetStore.isAssetLoaded(assetId)).toBe(true);
  });

  test('should throw an error when releasing an asset that was not used', () => {
    const assetId = assetStore.registerAsset(testAudioAsset);
    expect(() => assetStore.releaseAsset(assetId)).toThrow(
      `Attempted to release non-existent asset ID ${assetId}`
    );
  });

  test('should unload an asset properly', () => {
    const assetId = assetStore.registerAsset(testImageAsset);
    assetStore.preloadAssets([testImageAsset.key]);
    assetStore.unloadAsset(assetId);

    expect(mockEngine.textures.remove).toHaveBeenCalledWith(testImageAsset.key);
    expect(assetStore.isAssetLoaded(assetId)).toBe(false);
  });

  test('should not unload an asset that is not loaded', () => {
    const assetId = assetStore.registerAsset(testImageAsset);
    assetStore.unloadAsset(assetId);
    expect(assetStore.isAssetLoaded(assetId)).toBe(false);
  });

  test('should register multiple assets at once', () => {
    const assets = [testImageAsset, testSpritesheetAsset, testAudioAsset];
    assetStore.registerAssets(assets);

    assets.forEach((asset) => {
      expect(assetStore.getAssetId(asset.key)).toBeDefined();
    });
  });

  test('should throw an error if registering duplicate assets in batch', () => {
    assetStore.registerAsset(testImageAsset);
    expect(() => assetStore.registerAssets([testImageAsset])).toThrow(
      `Asset ${testImageAsset.key} is already registered.`
    );
  });

  test('should throw an error when getting asset with an invalid ID', () => {
    expect(() => assetStore.getAsset(999)).toThrow(
      `Asset with id 999 must be registered first.`
    );
  });

  test('should throw an error when releasing an asset that was not used', () => {
    const assetId = assetStore.registerAsset(testAudioAsset);
    expect(() => assetStore.releaseAsset(assetId)).toThrow();
  });

  test('should not allow duplicate asset registrations', () => {
    assetStore.registerAsset(testImageAsset);
    expect(() => assetStore.registerAsset(testImageAsset)).toThrow();
  });
});
