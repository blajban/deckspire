import Engine from '../../src/engine/core/Engine';
import SceneManager from '../../src/engine/core/SceneManager';
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

  test('should return a promise that resolves after create() is called', async () => {
    const ready_promise = engine.ready();

    engine['_phaser_scene'].create();

    await expect(ready_promise).resolves.toBeUndefined();
  });

  test('should resolve the ready promise only once', async () => {
    const ready_promise1 = engine.ready();
    const ready_promise2 = engine.ready();

    engine['_phaser_scene'].create();

    await expect(ready_promise1).resolves.toBeUndefined();
    await expect(ready_promise2).resolves.toBeUndefined();
  });

  test('should call create method and resolve the ready promise', () => {
    const ready_promise = engine.ready();

    engine['_phaser_scene'].create();

    return expect(ready_promise).resolves.toBeUndefined();
  });

  test('should call update on the SceneManager with correct arguments', () => {
    const mock_scene_manager = engine.getContext().sceneManager!;
    const mock_update_active_scenes = jest.spyOn(
      mock_scene_manager,
      'updateActiveScenes',
    );

    engine.update(100, 16);

    expect(mock_update_active_scenes).toHaveBeenCalledWith(100, 16);
  });

  test('should return the SceneManager instance', () => {
    const scene_manager = engine.getContext().sceneManager!;
    expect(scene_manager).toBeInstanceOf(SceneManager);
  });

  test('should integrate with SceneManager correctly', () => {
    const mock_scene_manager = engine.getContext().sceneManager!;
    const mock_register_scene = jest.spyOn(mock_scene_manager, 'registerScene');
    const mock_start_scene = jest.spyOn(mock_scene_manager, 'startScene');

    const mock_scene = new (class extends Scene {
      onRegister(): void {}
      onStart(): void {}
      onExit(): void {}
      onUpdate(): void {}
    })();

    mock_scene_manager.registerScene('TestScene', mock_scene);
    mock_scene_manager.startScene('TestScene');

    expect(mock_register_scene).toHaveBeenCalledWith('TestScene', mock_scene);
    expect(mock_start_scene).toHaveBeenCalledWith('TestScene');
  });
});
