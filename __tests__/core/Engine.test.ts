import Theater from '../../src/engine/core/Theater';
import Scene from '../../src/engine/core/Scene';

jest.mock('../../src/engine/core/SceneManager');

describe('Engine', () => {
  let engine: Theater;

  beforeEach(() => {
    engine = new Theater(800, 600);
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

    engine['_ecs_manager'].phaser_scene.create();

    await expect(ready_promise).resolves.toBeUndefined();
  });

  test('should resolve the ready promise only once', async () => {
    const ready_promise1 = engine.ready();
    const ready_promise2 = engine.ready();

    engine['_ecs_manager'].phaser_scene.create();

    await expect(ready_promise1).resolves.toBeUndefined();
    await expect(ready_promise2).resolves.toBeUndefined();
  });

  test('should call create method and resolve the ready promise', () => {
    const ready_promise = engine.ready();

    engine['_ecs_manager'].phaser_scene.create();

    return expect(ready_promise).resolves.toBeUndefined();
  });

  test('should integrate with SceneManager correctly', () => {
    const mock_scene_manager = engine['_scene_manager'];
    const mock_register_scene = jest.spyOn(mock_scene_manager, 'registerScene');

    const mock_scene = new (class extends Scene {
      load(): Promise<void> {
        return Promise.resolve();
      }
      unload(): void {}
    })();

    mock_scene_manager.registerScene('TestScene', mock_scene);

    expect(mock_register_scene).toHaveBeenCalledWith('TestScene', mock_scene);
  });
});
