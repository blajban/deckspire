import AssetStore, {
  AssetId,
  AssetKey,
} from '../../src/engine/core/AssetStore';
import AnimationStates, {
  AnimationConfig,
  AnimationState,
} from '../../src/engine/core/SpriteAnimations';
import PhaserContext from '../../src/engine/core/PhaserContext';

// Mock AssetStore
class MockAssetStore extends AssetStore {
  private _mock_asset_id = 1;

  override getAssetId(_key: AssetKey): AssetId {
    return this._mock_asset_id++;
  }

  override useAsset(_id: AssetId): void {}

  override releaseAsset(_phaser_scene: PhaserContext, _id: AssetId): void {}
}

describe('AnimState', () => {
  let asset_store: AssetStore;
  let anim_config: AnimationConfig;
  let anim_state: AnimationState;

  beforeEach(() => {
    asset_store = new MockAssetStore();
    anim_config = {
      key: 'idle',
      shouldLoop: true,
      isPlaying: true,
      assetKey: 'test_asset',
      startFrame: 0,
      numFrames: 10,
      frameRate: 15,
    };
    anim_state = new AnimationState(asset_store, anim_config);
  });

  test('should initialize with correct values', () => {
    expect(anim_state.key).toBe('idle');
    expect(anim_state.should_loop).toBe(true);
    expect(anim_state.is_playing).toBe(true);
    expect(anim_state.start_frame).toBe(0);
    expect(anim_state.num_frames).toBe(10);
    expect(anim_state.frame_rate).toBe(15);
    expect(anim_state.asset_id).not.toBeNull();
  });

  test('should allow toggling state', () => {
    anim_state.is_playing = false;
    expect(anim_state.is_playing).toBe(false);

    anim_state.is_playing = true;
    expect(anim_state.is_playing).toBe(true);
  });

  test('should allow toggling loop', () => {
    anim_state.should_loop = false;
    expect(anim_state.should_loop).toBe(false);

    anim_state.should_loop = true;
    expect(anim_state.should_loop).toBe(true);
  });
});

describe('AnimStates', () => {
  let asset_store: AssetStore;
  let animations: AnimationConfig[];
  let anim_states: AnimationStates;

  beforeEach(() => {
    asset_store = new MockAssetStore();
    animations = [
      {
        key: 'idle',
        shouldLoop: true,
        isPlaying: true,
        assetKey: 'test_asset',
        startFrame: 0,
        numFrames: 10,
        frameRate: 15,
      },
      {
        key: 'run',
        shouldLoop: false,
        isPlaying: true,
        assetKey: 'test_asset_run',
        startFrame: 0,
        numFrames: 15,
        frameRate: 20,
      },
    ];
    anim_states = new AnimationStates(asset_store, animations, 'idle');
  });

  test('should initialize with correct default state', () => {
    expect(anim_states.current_state.key).toBe('idle');
  });

  test('should switch to another animation state', () => {
    anim_states.switchState('run');
    expect(anim_states.current_state.key).toBe('run');
  });

  test('should not switch state if already in that state', () => {
    anim_states.switchState('idle');
    expect(anim_states.current_state.key).toBe('idle');
  });

  test('should throw error when switching to an unknown state', () => {
    expect(() => anim_states.switchState('jump')).toThrow(
      'Animation state jump does not exist.',
    );
  });
});
