import Engine from '../../src/engine/core/Engine';
import Scene from '../../src/engine/core/Scene';

jest.mock('../../src/engine/core/SceneManager');

describe('Engine', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine(800, 600);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with the correct width and height', () => {
    expect(engine).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((engine as any)._width).toBe(800);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((engine as any)._height).toBe(600);
  });

  test('should integrate with SceneManager correctly', () => {
    const mock_scene_manager = engine['_scene_manager'];
    const mock_register_scene = jest.spyOn(mock_scene_manager, 'registerScene');

    const mock_scene = new (class extends Scene {
      buildScene(): void {}
      destroyScene(): void {}
    })();

    mock_scene_manager.registerScene('TestScene', mock_scene);

    expect(mock_register_scene).toHaveBeenCalledWith('TestScene', mock_scene);
  });
});
