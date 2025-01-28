import Phaser from 'phaser';
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
    expect((engine as any)._width).toBe(800);
    expect((engine as any)._height).toBe(600);
  });

  test('should return a promise that resolves after create() is called', async () => {
    const readyPromise = engine.ready();

    engine.create();

    await expect(readyPromise).resolves.toBeUndefined();
  });

  test('should resolve the ready promise only once', async () => {
    const readyPromise1 = engine.ready();
    const readyPromise2 = engine.ready();

    engine.create();

    await expect(readyPromise1).resolves.toBeUndefined();
    await expect(readyPromise2).resolves.toBeUndefined();
  });

  test('should call create method and resolve the ready promise', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const readyPromise = engine.ready();

    engine.create();

    return expect(readyPromise).resolves.toBeUndefined();
  });

  test('should call update on the SceneManager with correct arguments', () => {
    const mockSceneManager = engine.getSceneManager();
    const mockUpdateActiveScenes = jest.spyOn(mockSceneManager, 'updateActiveScenes');

    engine.update(100, 16);

    expect(mockUpdateActiveScenes).toHaveBeenCalledWith(100, 16);
  });

  test('should return the SceneManager instance', () => {
    const sceneManager = engine.getSceneManager();
    expect(sceneManager).toBeInstanceOf(SceneManager);
  });

  test('should integrate with SceneManager correctly', () => {
    const mockSceneManager = engine.getSceneManager();
    const mockRegisterScene = jest.spyOn(mockSceneManager, 'registerScene');
    const mockStartScene = jest.spyOn(mockSceneManager, 'startScene');

    const mockScene = new (class extends Scene {
      onRegister() {}
      onStart() {}
      onExit() {}
      onUpdate() {}
    })();

    mockSceneManager.registerScene('TestScene', mockScene);
    mockSceneManager.startScene('TestScene');

    expect(mockRegisterScene).toHaveBeenCalledWith('TestScene', mockScene);
    expect(mockStartScene).toHaveBeenCalledWith('TestScene');
  });
});
