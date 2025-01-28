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
  let sceneManager: SceneManager;
  let mockScene1: MockScene;
  let mockScene2: MockScene;

  beforeEach(() => {
    engine = new Engine(800, 600);
    sceneManager = new SceneManager(engine);
    mockScene1 = new MockScene();
    mockScene2 = new MockScene();
  });

  test('should register a scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    expect(mockScene1.events).toContain('onRegister');
    expect(() => sceneManager.registerScene('Scene1', mockScene1)).not.toThrow();
  });

  test('should start a registered scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    sceneManager.startScene('Scene1');
    expect(mockScene1.events).toContain('onStart');
  });

  test('should not start an unregistered scene', () => {
    expect(() => sceneManager.startScene('UnknownScene')).toThrow(
      'Cannot start scene UnknownScene, it\'s not registered.'
    );
  });

  test('should not start an already active scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    sceneManager.startScene('Scene1');

    expect(() => sceneManager.startScene('Scene1')).toThrow(
      'Scene Scene1 is already active.'
    );
  });

  test('should stop an active scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    sceneManager.startScene('Scene1');
    sceneManager.stopScene('Scene1');
    expect(mockScene1.events).toContain('onExit');
  });

  test('should not stop an inactive scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    expect(() => sceneManager.stopScene('Scene1')).toThrowError(
      'Scene Scene1 is not active.'
    );
  });

  test('should pause an active scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    sceneManager.startScene('Scene1');
    sceneManager.pauseScene('Scene1');
    expect(mockScene1.events).toContain('onPause');
  });

  test('should not pause an inactive scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    expect(() => sceneManager.pauseScene('Scene1')).toThrowError(
      'Scene Scene1 is not active and cannot be paused.'
    );
  });

  test('should resume a paused scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    sceneManager.startScene('Scene1');
    sceneManager.pauseScene('Scene1');
    sceneManager.resumeScene('Scene1');
    expect(mockScene1.events).toContain('onResume');
  });

  test('should not resume an already active scene', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    sceneManager.startScene('Scene1');
    expect(() => sceneManager.resumeScene('Scene1')).toThrowError(
      'Scene Scene1 is already active.'
    );
  });

  test('should not resume an unregistered scene', () => {
    expect(() => sceneManager.resumeScene('UnknownScene')).toThrowError(
      'Cannot resume scene UnknownScene, it\'s not registered.'
    );
  });

  test('should update active scenes', () => {
    sceneManager.registerScene('Scene1', mockScene1);
    sceneManager.registerScene('Scene2', mockScene2);
    sceneManager.startScene('Scene1');
    sceneManager.startScene('Scene2');

    sceneManager.updateActiveScenes(100, 16);

    expect(mockScene1.events).toContain('onUpdate(100, 16)');
    expect(mockScene2.events).toContain('onUpdate(100, 16)');
  });
});
