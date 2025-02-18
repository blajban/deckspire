import EcsManager from '../../src/engine/core/EcsManager';
import Theater from '../../src/engine/core/Theater';
import Scene from '../../src/engine/core/Scene';
import SceneManager from '../../src/engine/core/SceneManager';
import PhaserContext from '../../src/engine/core/PhaserContext';

class MockScene extends Scene {
  public events: string[] = [];

  preload(): Promise<void> {
    this.events.push('preload');
    return Promise.resolve();
  }

  load(): Promise<void> {
    this.events.push('load');
    return Promise.resolve();
  }

  unload(): void {
    this.events.push('unload');
  }
}

describe('SceneManager', () => {
  let engine: Theater;
  let scene_manager: SceneManager;
  let ecs: EcsManager;
  let mock_scene: MockScene;
  const mock_context = {} as unknown as PhaserContext;

  beforeEach(() => {
    engine = new Theater(800, 600);
    scene_manager = engine['_scene_manager'];
    ecs = engine['_ecs_manager'];
    mock_scene = new MockScene();
  });

  test('should load a registered scene', () => {
    scene_manager.registerScene('Scene1', mock_scene);
    scene_manager.loadScene(ecs, mock_context, 'Scene1');
    expect(mock_scene.events).toContain('load');
  });

  test('should not load an unregistered scene', () => {
    expect(() =>
      scene_manager.loadScene(ecs, mock_context, 'UnknownScene'),
    ).toThrow('Cannot load scene UnknownScene, it is not registered.');
  });

  test('should not load an already loaded scene', () => {
    scene_manager.registerScene('Scene1', mock_scene);
    scene_manager.loadScene(ecs, mock_context, 'Scene1');

    expect(() => scene_manager.loadScene(ecs, mock_context, 'Scene1')).toThrow(
      'Scene Scene1 is already loaded.',
    );
  });
});
