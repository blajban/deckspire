import Engine from '../../src/engine/core/Engine';
import Scene from '../../src/engine/core/Scene';
import SceneManager from '../../src/engine/core/SceneManager';

class MockScene extends Scene {
  public events: string[] = [];

  onRegister(): void {
    this.events.push('onRegister');
  }

  onStart(): void {
    this.events.push('onStart');
  }

  onExit(): void {
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
  let mock_scene1: MockScene;
  let mock_scene2: MockScene;

  beforeEach(() => {
    engine = new Engine(800, 600);
    scene_manager = new SceneManager(engine);
    mock_scene1 = new MockScene();
    mock_scene2 = new MockScene();
  });

  test('should register a scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    expect(mock_scene1.events).toContain('onRegister');
    expect(() =>
      scene_manager.registerScene('Scene1', mock_scene1),
    ).not.toThrow();
  });

  test('should start a registered scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    scene_manager.startScene('Scene1');
    expect(mock_scene1.events).toContain('onStart');
  });

  test('should not start an unregistered scene', () => {
    expect(() => scene_manager.startScene('UnknownScene')).toThrow(
      'Cannot start scene UnknownScene, it is not registered.',
    );
  });

  test('should not start an already active scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    scene_manager.startScene('Scene1');

    expect(() => scene_manager.startScene('Scene1')).toThrow(
      'Scene Scene1 is already active.',
    );
  });

  test('should stop an active scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    scene_manager.startScene('Scene1');
    scene_manager.stopScene('Scene1');
    expect(mock_scene1.events).toContain('onExit');
  });

  test('should not stop an inactive scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    expect(() => scene_manager.stopScene('Scene1')).toThrowError(
      'Scene Scene1 is not active.',
    );
  });

  test('should pause an active scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    scene_manager.startScene('Scene1');
    scene_manager.pauseScene('Scene1');
    expect(mock_scene1.events).toContain('onPause');
  });

  test('should not pause an inactive scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    expect(() => scene_manager.pauseScene('Scene1')).toThrowError(
      'Scene Scene1 is not active and cannot be paused.',
    );
  });

  test('should resume a paused scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    scene_manager.startScene('Scene1');
    scene_manager.pauseScene('Scene1');
    scene_manager.resumeScene('Scene1');
    expect(mock_scene1.events).toContain('onResume');
  });

  test('should not resume an already active scene', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    scene_manager.startScene('Scene1');
    expect(() => scene_manager.resumeScene('Scene1')).toThrowError(
      'Scene Scene1 is already active.',
    );
  });

  test('should not resume an unregistered scene', () => {
    expect(() => scene_manager.resumeScene('UnknownScene')).toThrowError(
      'Cannot resume scene UnknownScene, it is not registered.',
    );
  });

  test('should update active scenes', () => {
    scene_manager.registerScene('Scene1', mock_scene1);
    scene_manager.registerScene('Scene2', mock_scene2);
    scene_manager.startScene('Scene1');
    scene_manager.startScene('Scene2');

    scene_manager.updateActiveScenes(100, 16);

    expect(mock_scene1.events).toContain('onUpdate(100, 16)');
    expect(mock_scene2.events).toContain('onUpdate(100, 16)');
  });
});
