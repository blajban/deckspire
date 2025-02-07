import Engine from '../../src/engine/core/Engine';
import { GameContext } from '../../src/engine/core/GameContext';
import Scene from '../../src/engine/core/Scene';
import SceneManager from '../../src/engine/core/SceneManager';

class MockScene extends Scene {
  public events: string[] = [];

  onRegister(): void {
    this.events.push('onRegister');
  }

  buildScene(): void {
    this.events.push('onStart');
  }

  destroyScene(): void {
    this.events.push('onExit');
  }

  onPause(): void {
    this.events.push('onPause');
  }

  onResume(): void {
    this.events.push('onResume');
  }

  onUpdate(time: number, delta: number): void {
    this.events.push(`onUpdate(${time}, ${delta})`);
  }
}

describe('SceneManager', () => {
  let engine: Engine;
  let scene_manager: SceneManager;
  let context: GameContext;
  let mock_scene: MockScene;

  beforeEach(() => {
    engine = new Engine(800, 600);
    scene_manager = engine['_scene_manager'];
    context = engine['_context'];
    mock_scene = new MockScene();
  });

  test('should register a scene', () => {
    scene_manager.registerScene('Scene1', mock_scene);
    expect(mock_scene.events).toContain('onRegister');
    expect(() =>
      scene_manager.registerScene('Scene1', mock_scene),
    ).not.toThrow();
  });

  test('should start a registered scene', () => {
    scene_manager.registerScene('Scene1', mock_scene);
    scene_manager.buildScene(context, 'Scene1');
    expect(mock_scene.events).toContain('onStart');
  });

  test('should not start an unregistered scene', () => {
    expect(() => scene_manager.buildScene(context, 'UnknownScene')).toThrow(
      'Cannot start scene UnknownScene, it is not registered.',
    );
  });

  test('should not start an already active scene', () => {
    scene_manager.registerScene('Scene1', mock_scene);
    scene_manager.buildScene(context, 'Scene1');

    expect(() => scene_manager.buildScene(context, 'Scene1')).toThrow(
      'Scene Scene1 is already active.',
    );
  });

  test('should stop an active scene', () => {
    scene_manager.registerScene('Scene1', mock_scene);
    scene_manager.buildScene(context, 'Scene1');
    scene_manager.destroyScene(context, 'Scene1');
    expect(mock_scene.events).toContain('onExit');
  });

  test('should not stop an inactive scene', () => {
    scene_manager.registerScene('Scene1', mock_scene);
    expect(() => scene_manager.destroyScene(context, 'Scene1')).toThrowError(
      'Scene Scene1 is not active.',
    );
  });
});
