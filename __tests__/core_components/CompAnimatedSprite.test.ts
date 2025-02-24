import CompAnimatedSprite from '../../src/engine/core_components/CompAnimatedSprite';
import AnimStates, {
  AnimConfig,
  AnimKey,
} from '../../src/engine/core/SpriteAnimations';
import AssetStore, {
  AssetKey,
  AssetId,
} from '../../src/engine/core/AssetStore';
import PhaserContext, {
  PhaserScene,
} from '../../src/engine/core/PhaserContext';
import GraphicsCache from '../../src/engine/core/GraphicsCache';

describe('CompAnimatedSprite', () => {
  let mock_asset_store: AssetStore;
  let phaser_context: PhaserContext;
  let animations: AnimConfig[];
  let default_state_key: AnimKey;
  let animated_sprite: CompAnimatedSprite;

  beforeEach(() => {
    mock_asset_store = {
      getAssetId: jest.fn((_key: AssetKey) => 1 as AssetId),
      useAsset: jest.fn(),
      releaseAsset: jest.fn(),
    } as unknown as AssetStore;

    phaser_context = new PhaserContext(
      jest.fn() as unknown as PhaserScene,
      jest.fn() as unknown as GraphicsCache,
    );

    animations = [
      {
        key: 'idle',
        shouldLoop: true,
        isPlaying: true,
        assetKey: 'sprite_idle',
        startFrame: 0,
        numFrames: 10,
        frameRate: 10,
      },
      {
        key: 'run',
        shouldLoop: true,
        isPlaying: true,
        assetKey: 'sprite_run',
        startFrame: 0,
        numFrames: 8,
        frameRate: 15,
      },
    ];

    default_state_key = 'idle';
    animated_sprite = new CompAnimatedSprite(
      mock_asset_store,
      animations,
      default_state_key,
    );
  });

  test('should initialize with correct default state', () => {
    expect(animated_sprite.states).toBeInstanceOf(AnimStates);
    expect(animated_sprite.states.current_state.key).toBe(default_state_key);
  });

  test('should initialize animation states correctly', () => {
    expect(animated_sprite.states.getState('idle')).toBeDefined();
    expect(animated_sprite.states.getState('run')).toBeDefined();
    expect(() => animated_sprite.states.getState('jump')).toThrow();
  });

  test('should switch animation states correctly', () => {
    animated_sprite.states.switchState('run');
    expect(animated_sprite.states.current_state.key).toBe('run');

    animated_sprite.states.switchState('idle');
    expect(animated_sprite.states.current_state.key).toBe('idle');
  });

  test('should release assets on destroy', () => {
    const release_assets_spy = jest.spyOn(
      animated_sprite.states,
      'releaseAssets',
    );

    animated_sprite.onDestroy(phaser_context, mock_asset_store);

    expect(release_assets_spy).toHaveBeenCalledWith(
      phaser_context,
      mock_asset_store,
    );
  });
});
