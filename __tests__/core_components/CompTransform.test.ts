import CompTransform from '../../src/engine/core_components/CompTransform';
import Vector2D from '../../src/math/Vector2D';

describe('CompTransform', () => {
  test('should initialize with default values', () => {
    const transform = new CompTransform(new Vector2D(0, 0));

    expect(transform.position.x).toBe(0);
    expect(transform.position.y).toBe(0);
    expect(transform.rotation).toBe(0);
    expect(transform.scale.x).toBe(1);
    expect(transform.scale.y).toBe(1);
  });

  test('should initialize with custom values', () => {
    const transform = new CompTransform(new Vector2D(10, 20), Math.PI / 4, new Vector2D(2, 3));

    expect(transform.position.x).toBe(10);
    expect(transform.position.y).toBe(20);
    expect(transform.rotation).toBeCloseTo(Math.PI / 4);
    expect(transform.scale.x).toBe(2);
    expect(transform.scale.y).toBe(3);
  });

  test('should correctly compute local coordinates without rotation or scaling', () => {
    const transform = new CompTransform(new Vector2D(10, 10));
    const world_coordinates = new Vector2D(15, 15);
    const local_coords = transform.getLocalCoordinates(world_coordinates);

    expect(local_coords.x).toBe(5);
    expect(local_coords.y).toBe(5);
  });
});
