import {
  HexLayout,
  HexDirection,
  VectorHex,
} from '../../../src/math/hexgrid/VectorHex';

const FLOAT_DIGITS: number = 8;

describe('Creating VectorHex', () => {
  test('Default ctor', () => {
    const vec = new VectorHex();
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
  });
  test('From coordinates', () => {
    const vec = new VectorHex(3, 7);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(7);
  });
  test('From non-integer coordinates', () => {
    expect(() => new VectorHex(3.2, 7.9)).toThrow(
      'Hex coordinates must be integers.',
    );
  });
  test('From Vector2D', () => {
    let vec;
    vec = VectorHex.from_vector2D({ x: 0, y: 0 });
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
    vec = VectorHex.from_vector2D({ x: 0.5, y: 0.5 });
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(0);
    vec = VectorHex.from_vector2D({ x: -0.5, y: -0.5 });
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(0);
    vec = VectorHex.from_vector2D({ x: -0.5, y: 0.5 });
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(1);
    vec = VectorHex.from_vector2D({ x: 0.5, y: -0.5 });
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-1);
    vec = VectorHex.from_vector2D({
      x: (1 / Math.sqrt(3)) * Math.cos(Math.PI / 3) - 0.001,
      y: (1 / Math.sqrt(3)) * Math.sin(Math.PI / 3) + 0.001,
    });
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(1);
    vec = VectorHex.from_vector2D({
      x: 1.001 * 0.5 * Math.cos(Math.PI / 6),
      y: 1.001 * 0.5 * Math.sin(Math.PI / 6),
    });
    expect(vec.q === 1).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
    vec = VectorHex.from_vector2D({
      x: 0.999 * 0.5 * Math.cos(Math.PI / 6),
      y: 0.999 * 0.5 * Math.sin(Math.PI / 6),
    });
    expect(vec.q === 0).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
    vec = VectorHex.from_vector2D({
      x: 2 * Math.cos(Math.PI / 3),
      y: 2 * Math.sin(Math.PI / 3),
    });
    expect(vec.q === 1).toBeTruthy();
    expect(vec.r === 1).toBeTruthy();
    vec = VectorHex.from_vector2D(
      {
        x: 2 * Math.cos(Math.PI / 3),
        y: 2 * Math.sin(Math.PI / 3),
      },
      HexLayout.Vertical,
    );
    expect(vec.q === 2).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
  });
  test('From clone', () => {
    const vec = new VectorHex(3, 7);
    const clone = vec.clone();
    expect(clone.q).toBe(3);
    expect(clone.r).toBe(7);
  });
});

describe('Converting VectorHex', () => {
  test('Horizontal hex into Vector2D', () => {
    let vec;
    vec = new VectorHex(0, 0).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = new VectorHex(1, 0).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
    vec = new VectorHex(0, 1).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
    vec = new VectorHex(-1, 1).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
    vec = new VectorHex(-1, 0).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
    vec = new VectorHex(0, -1).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-1, FLOAT_DIGITS);
    vec = new VectorHex(1, -1).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
  });
  test('Vertical hex into Vector2D', () => {
    let vec;
    vec = new VectorHex(0, 0).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = new VectorHex(1, 0).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = new VectorHex(0, 1).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = new VectorHex(-1, 1).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = new VectorHex(-1, 0).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = new VectorHex(0, -1).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = new VectorHex(1, -1).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
  });
  test('Hex to Vector2D with scaling', () => {
    expect(() =>
      new VectorHex(1, 0).into_vector2d(HexLayout.Horizontal, 0),
    ).toThrow('Hex size must be positive.');
    let vec;
    vec = new VectorHex(1, 0).into_vector2d(HexLayout.Horizontal, 2);
    expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
    vec = new VectorHex(1, 0).into_vector2d(HexLayout.Vertical, 2);
    expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
  });
});

describe('Arithmetics', () => {
  test('Addition using static method', () => {
    const hex1 = new VectorHex(3, 5);
    const hex2 = new VectorHex(4, 7);
    const hex3 = VectorHex.sum(hex1, hex2);
    expect(hex3.q).toBe(7);
    expect(hex3.r).toBe(12);
    expect(hex3.into_vector2d().x).toBeCloseTo(
      hex1.into_vector2d().x + hex2.into_vector2d().x,
      FLOAT_DIGITS,
    );
    expect(hex3.into_vector2d().y).toBeCloseTo(
      hex1.into_vector2d().y + hex2.into_vector2d().y,
      FLOAT_DIGITS,
    );
  });
  test('Addition using non-static method', () => {
    const hex1 = new VectorHex(3, 5);
    const hex2 = new VectorHex(4, 7);
    const hex3 = hex1.clone();
    hex3.add(hex2);
    expect(hex3.q).toBe(7);
    expect(hex3.r).toBe(12);
    expect(hex3.into_vector2d().x).toBeCloseTo(
      hex1.into_vector2d().x + hex2.into_vector2d().x,
      FLOAT_DIGITS,
    );
    expect(hex3.into_vector2d().y).toBeCloseTo(
      hex1.into_vector2d().y + hex2.into_vector2d().y,
      FLOAT_DIGITS,
    );
  });
  test('Subtraction using static method', () => {
    const hex1 = new VectorHex(3, 5);
    const hex2 = new VectorHex(4, 7);
    const hex3 = VectorHex.delta(hex1, hex2);
    expect(hex3.q).toBe(1);
    expect(hex3.r).toBe(2);
    expect(hex3.into_vector2d().x).toBeCloseTo(
      hex2.into_vector2d().x - hex1.into_vector2d().x,
      FLOAT_DIGITS,
    );
    expect(hex3.into_vector2d().y).toBeCloseTo(
      hex2.into_vector2d().y - hex1.into_vector2d().y,
      FLOAT_DIGITS,
    );
  });
  test('Subtraction using non-static method', () => {
    const hex1 = new VectorHex(3, 5);
    const hex2 = new VectorHex(4, 7);
    const hex3 = hex1.clone();
    hex3.subtract(hex2);
    expect(hex3.q).toBe(-1);
    expect(hex3.r).toBe(-2);
    expect(hex3.into_vector2d().x).toBeCloseTo(
      hex1.into_vector2d().x - hex2.into_vector2d().x,
      FLOAT_DIGITS,
    );
    expect(hex3.into_vector2d().y).toBeCloseTo(
      hex1.into_vector2d().y - hex2.into_vector2d().y,
      FLOAT_DIGITS,
    );
  });
});

describe('Hex grid operations and calculations.', () => {
  test('Manhattan distance', () => {
    const hex1 = new VectorHex(3, -1);
    const hex2 = new VectorHex(-2, 1);
    expect(VectorHex.delta(hex1, hex2).manhattan()).toBe(5);
  });
  test('Hex wedge', () => {
    expect(new VectorHex(1, -1).wedge()).toBe(HexDirection.East);
    expect(new VectorHex(1, 0).wedge()).toBe(HexDirection.NorthEast);
    expect(new VectorHex(0, 1).wedge()).toBe(HexDirection.NorthWest);
    expect(new VectorHex(-1, 1).wedge()).toBe(HexDirection.West);
    expect(new VectorHex(-1, 0).wedge()).toBe(HexDirection.SouthWest);
    expect(new VectorHex(0, -1).wedge()).toBe(HexDirection.SouthEast);
    expect(new VectorHex(1, -1).wedge(HexLayout.Vertical)).toBe(
      HexDirection.NorthEast,
    );
    expect(new VectorHex(1, 0).wedge(HexLayout.Vertical)).toBe(
      HexDirection.North,
    );
    expect(new VectorHex(0, 1).wedge(HexLayout.Vertical)).toBe(
      HexDirection.NorthWest,
    );
    expect(new VectorHex(-1, 1).wedge(HexLayout.Vertical)).toBe(
      HexDirection.SouthWest,
    );
    expect(new VectorHex(-1, 0).wedge(HexLayout.Vertical)).toBe(
      HexDirection.South,
    );
    expect(new VectorHex(0, -1).wedge(HexLayout.Vertical)).toBe(
      HexDirection.SouthEast,
    );
  });
  test('Single steps in horizontal orientation directions', () => {
    expect(() =>
      new VectorHex(0, 0).step_in_direction(HexDirection.North, 0.5),
    ).toThrow('must be integral');
    expect(() =>
      new VectorHex(0, 0).step_in_direction(HexDirection.East),
    ).toThrow('Invalid');
    expect(() =>
      new VectorHex(0, 0).step_in_direction(
        HexDirection.North,
        1,
        HexLayout.Vertical,
      ),
    ).toThrow('Invalid');
    const vec = new VectorHex(0, 0);
    vec.step_in_direction(HexDirection.North, 1);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(1);
    vec.step_in_direction(HexDirection.SouthEast, 1);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(0);
    vec.step_in_direction(HexDirection.SouthWest, 1);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
    vec.step_in_direction(HexDirection.SouthEast, -1);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(1);
    vec.step_in_direction(HexDirection.North, -1);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(0);
    vec.step_in_direction(HexDirection.SouthWest, -1);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
  });
  test('Single steps in vertical orientation directions', () => {
    const vec = new VectorHex(0, 0);
    vec.step_in_direction(HexDirection.East, 1, HexLayout.Vertical);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-1);
    vec.step_in_direction(HexDirection.NorthWest, 1, HexLayout.Vertical);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(0);
    vec.step_in_direction(HexDirection.SouthWest, 1, HexLayout.Vertical);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
    vec.step_in_direction(HexDirection.NorthWest, -1, HexLayout.Vertical);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(-1);
    vec.step_in_direction(HexDirection.SouthWest, -1, HexLayout.Vertical);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-1);
    vec.step_in_direction(HexDirection.East, -1, HexLayout.Vertical);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
  });
  test('Multiple steps in horizontal directions', () => {
    const vec = new VectorHex(3, -3);
    vec.step_in_direction(HexDirection.SouthEast, -2);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-1);
    vec.step_in_direction(HexDirection.North, 5);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(4);
  });
  test('Multiple steps in vertical directions', () => {
    const vec = new VectorHex(2, 2);
    vec.step_in_direction(HexDirection.West, 2, HexLayout.Vertical);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(4);
    vec.step_in_direction(HexDirection.SouthEast, 5, HexLayout.Vertical);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(-1);
    vec.step_in_direction(HexDirection.NorthEast, 4, HexLayout.Vertical);
    expect(vec.q).toBe(4);
    expect(vec.r).toBe(-1);
  });
});

describe('Rotations', () => {
  test('Wedge rotation', () => {
    expect(() => new VectorHex(0, 0).wedge_rotation(0.5)).toThrow(
      'must be integral',
    );
    let vec;
    (vec = new VectorHex(3, -2)).wedge_rotation(0);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-2);
    (vec = new VectorHex(3, -2)).wedge_rotation(1);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
    (vec = new VectorHex(3, -2)).wedge_rotation(2);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(3);
    (vec = new VectorHex(3, -2)).wedge_rotation(-3);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(2);
    (vec = new VectorHex(3, -2)).wedge_rotation(7);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
  });
  test('Step rotation', () => {
    expect(() => new VectorHex(0, 0).step_rotation(0.5)).toThrow(
      'must be integral',
    );
    let vec;
    (vec = new VectorHex(3, -2)).step_rotation(0);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-2);
    (vec = new VectorHex(3, -2)).step_rotation(1);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-1);
    (vec = new VectorHex(3, -2)).step_rotation(2);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(0);
    (vec = new VectorHex(3, -2)).step_rotation(3);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
    (vec = new VectorHex(3, -2)).step_rotation(4);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(2);
    (vec = new VectorHex(-1, 3)).step_rotation(1);
    expect(vec.q).toBe(-2);
    expect(vec.r).toBe(3);
    (vec = new VectorHex(-3, 2)).step_rotation(1);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(1);
    (vec = new VectorHex(-2, -1)).step_rotation(1);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(-2);
    (vec = new VectorHex(1, -3)).step_rotation(1);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(-3);
    (vec = new VectorHex(3, -2)).step_rotation(15);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-3);
    (vec = new VectorHex(3, -2)).step_rotation(24);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(3);
    (vec = new VectorHex(3, -2)).step_rotation(-10);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(3);
  });
});
