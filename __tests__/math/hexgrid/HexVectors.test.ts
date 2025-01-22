import {
  HexLayout,
  HexDirection,
  HexDistance,
  HexCoordinates,
} from '../../../src/math/hexgrid/HexVectors';

const FLOAT_DIGITS: number = 8;

describe('Creating Hexes', () => {
  test('Using ctors', () => {
    const vec1 = new HexCoordinates(1, 2);
    expect(vec1.q).toBe(1);
    expect(vec1.r).toBe(2);
    const dist1 = new HexDistance(1, 2);
    expect(dist1.q).toBe(1);
    expect(dist1.r).toBe(2);
    const vec2 = new HexCoordinates(3, 5);
    const dist2 = new HexDistance(vec1, vec2);
    expect(dist2.q).toBe(2);
    expect(dist2.r).toBe(3);
    expect(() => new HexCoordinates(1.2, 2.9)).toThrow(
      'Hex coordinates must be integers.',
    );
    expect(() => new HexDistance(1.2, 2.9)).toThrow(
      'Hex coordinates must be integers.',
    );
  });
  test('By cloning', () => {
    const clone1 = new HexCoordinates(3, 7).clone();
    expect(clone1.q).toBe(3);
    expect(clone1.r).toBe(7);
    const clone2 = new HexDistance(3, 7).clone();
    expect(clone2.q).toBe(3);
    expect(clone2.r).toBe(7);
  });
  test('HexPosition from Vector2D', () => {
    let vec;
    vec = HexCoordinates.from_vector2D({ x: 0, y: 0 });
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
    vec = HexCoordinates.from_vector2D({ x: 0.5, y: 0.5 });
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(0);
    vec = HexCoordinates.from_vector2D({ x: -0.5, y: -0.5 });
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(0);
    vec = HexCoordinates.from_vector2D({ x: -0.5, y: 0.5 });
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(1);
    vec = HexCoordinates.from_vector2D({ x: 0.5, y: -0.5 });
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-1);
    vec = HexCoordinates.from_vector2D({
      x: (1 / Math.sqrt(3)) * Math.cos(Math.PI / 3) - 0.001,
      y: (1 / Math.sqrt(3)) * Math.sin(Math.PI / 3) + 0.001,
    });
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(1);
    vec = HexCoordinates.from_vector2D({
      x: 1.001 * 0.5 * Math.cos(Math.PI / 6),
      y: 1.001 * 0.5 * Math.sin(Math.PI / 6),
    });
    expect(vec.q === 1).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
    vec = HexCoordinates.from_vector2D({
      x: 0.999 * 0.5 * Math.cos(Math.PI / 6),
      y: 0.999 * 0.5 * Math.sin(Math.PI / 6),
    });
    expect(vec.q === 0).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
    vec = HexCoordinates.from_vector2D({
      x: 2 * Math.cos(Math.PI / 3),
      y: 2 * Math.sin(Math.PI / 3),
    });
    expect(vec.q === 1).toBeTruthy();
    expect(vec.r === 1).toBeTruthy();
    vec = HexCoordinates.from_vector2D(
      {
        x: 2 * Math.cos(Math.PI / 3),
        y: 2 * Math.sin(Math.PI / 3),
      },
      HexLayout.Vertical,
    );
    expect(vec.q === 2).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
  });
  test('HexDistance from HexPosition', () => {
    const hex1 = new HexCoordinates(1, 2);
    const hex2 = new HexCoordinates(3, 4);
    const distance = hex1.distance_to(hex2);
    expect(distance.q).toBe(2);
    expect(distance.r).toBe(2);
  });
  test('HexDistance from horizontal directions', () => {
    let vec;
    vec = HexDistance.from_direction(HexDirection.NE, HexLayout.Horizontal);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(0);
    vec = HexDistance.from_direction(HexDirection.N, HexLayout.Horizontal);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(1);
    vec = HexDistance.from_direction(HexDirection.NW, HexLayout.Horizontal);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(1);
    vec = HexDistance.from_direction(HexDirection.SW, HexLayout.Horizontal);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(0);
    vec = HexDistance.from_direction(HexDirection.S, HexLayout.Horizontal);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(-1);
    vec = HexDistance.from_direction(HexDirection.SE, HexLayout.Horizontal);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-1);
  });
  test('HexDistance from vertical directions', () => {
    let vec;
    vec = HexDistance.from_direction(HexDirection.E, HexLayout.Vertical);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-1);
    vec = HexDistance.from_direction(HexDirection.NE, HexLayout.Vertical);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(0);
    vec = HexDistance.from_direction(HexDirection.NW, HexLayout.Vertical);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(1);
    vec = HexDistance.from_direction(HexDirection.W, HexLayout.Vertical);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(1);
    vec = HexDistance.from_direction(HexDirection.SW, HexLayout.Vertical);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(0);
    vec = HexDistance.from_direction(HexDirection.SE, HexLayout.Vertical);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(-1);
  });
});

describe('Converting HexDistance into Vector2D', () => {
  test('HexDistance in horizontal layout into Vector2D', () => {
    let vec;
    vec = new HexDistance(0, 0).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = new HexDistance(1, 0).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
    vec = new HexDistance(0, 1).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
    vec = new HexDistance(-1, 1).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
    vec = new HexDistance(-1, 0).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
    vec = new HexDistance(0, -1).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-1, FLOAT_DIGITS);
    vec = new HexDistance(1, -1).into_vector2d(HexLayout.Horizontal, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
  });
  test('HexDistance in vertical layout into Vector2D', () => {
    let vec;
    vec = new HexDistance(0, 0).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = new HexDistance(1, 0).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = new HexDistance(0, 1).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = new HexDistance(-1, 1).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = new HexDistance(-1, 0).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = new HexDistance(0, -1).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = new HexDistance(1, -1).into_vector2d(HexLayout.Vertical, 1);
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
  });
  test('HexDistance to Vector2D with scaling', () => {
    expect(() =>
      new HexDistance(1, 0).into_vector2d(HexLayout.Horizontal, 0),
    ).toThrow('Hex size must be positive.');
    let vec;
    vec = new HexDistance(1, 0).into_vector2d(HexLayout.Horizontal, 2);
    expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
    vec = new HexDistance(1, 0).into_vector2d(HexLayout.Vertical, 2);
    expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
  });
});

describe('Arithmetics', () => {
  it('should negate a distance using static method', () => {
    const hex = new HexDistance(3, 5);
    const neg = HexDistance.neg(hex);
    expect(neg.q).toBe(-3);
    expect(neg.r).toBe(-5);
  });
  it('should negate a distance using non-static method', () => {
    const hex = new HexDistance(3, 5);
    hex.neg();
    expect(hex.q).toBe(-3);
    expect(hex.r).toBe(-5);
  });
  test('Addition of distances using static method', () => {
    const hex1 = new HexDistance(3, 5);
    const hex2 = new HexDistance(4, 7);
    const hex3 = HexDistance.sum(hex1, hex2);
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
  test('Addition of distances using non-static method', () => {
    const hex1 = new HexDistance(3, 5);
    const hex2 = new HexDistance(4, 7);
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
    const hex1 = new HexDistance(3, 5);
    const hex2 = new HexDistance(4, 7);
    const hex3 = HexDistance.difference(hex1, hex2);
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
  test('Subtraction using non-static method', () => {
    const hex1 = new HexDistance(3, 5);
    const hex2 = new HexDistance(4, 7);
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
  test('Multiplication by scalar using static method', () => {
    const hex1 = new HexDistance(3, 5);
    const hex2 = HexDistance.multiply(hex1, 2);
    expect(hex2.q).toBe(6);
    expect(hex2.r).toBe(10);
    expect(() => HexDistance.multiply(hex1, 0.5)).toThrow('must be integral');
  });
  test('Multiplication by scalar using non-static method', () => {
    const hex = new HexDistance(3, 5);
    hex.multiply(2);
    expect(hex.q).toBe(6);
    expect(hex.r).toBe(10);
    expect(() => hex.multiply(0.5)).toThrow('must be integral');
  });
});

describe('Hex grid operations and calculations.', () => {
  it('should return the Manhattan distance', () => {
    const hex1 = new HexCoordinates(3, -1);
    const hex2 = new HexCoordinates(-2, 1);
    expect(new HexDistance(hex1, hex2).manhattan()).toBe(5);
  });
  it('should translate a hex by a distance using static method', () => {
    const hex = new HexCoordinates(1, 2);
    const distance = new HexDistance(3, 4);
    const result = HexCoordinates.translate(hex, distance);
    expect(result.q).toBe(4);
    expect(result.r).toBe(6);
  });
  it('should translate a hex by a distance using non-static method', () => {
    const hex = new HexCoordinates(1, 2);
    const distance = new HexDistance(3, 4);
    hex.translate(distance);
    expect(hex.q).toBe(4);
    expect(hex.r).toBe(6);
  });
});

describe('Rotations', () => {
  test('Wedge rotation', () => {
    expect(() => new HexCoordinates(0, 0).hex_sector_rotation(0.5)).toThrow(
      'must be integral',
    );
    let vec;
    (vec = new HexCoordinates(3, -2)).hex_sector_rotation(0);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-2);
    (vec = new HexCoordinates(3, -2)).hex_sector_rotation(1);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
    (vec = new HexCoordinates(3, -2)).hex_sector_rotation(2);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(3);
    (vec = new HexCoordinates(3, -2)).hex_sector_rotation(-3);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(2);
    (vec = new HexCoordinates(3, -2)).hex_sector_rotation(7);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
  });
  test('Step rotation', () => {
    expect(() => new HexCoordinates(0, 0).step_rotation(0.5)).toThrow(
      'must be integral',
    );
    let vec;
    (vec = new HexCoordinates(3, -2)).step_rotation(0);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-2);
    (vec = new HexCoordinates(3, -2)).step_rotation(1);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-1);
    (vec = new HexCoordinates(3, -2)).step_rotation(2);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(0);
    (vec = new HexCoordinates(3, -2)).step_rotation(3);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
    (vec = new HexCoordinates(3, -2)).step_rotation(4);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(2);
    (vec = new HexCoordinates(-1, 3)).step_rotation(1);
    expect(vec.q).toBe(-2);
    expect(vec.r).toBe(3);
    (vec = new HexCoordinates(-3, 2)).step_rotation(1);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(1);
    (vec = new HexCoordinates(-2, -1)).step_rotation(1);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(-2);
    (vec = new HexCoordinates(1, -3)).step_rotation(1);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(-3);
    (vec = new HexCoordinates(3, -2)).step_rotation(15);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-3);
    (vec = new HexCoordinates(3, -2)).step_rotation(24);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(3);
    (vec = new HexCoordinates(3, -2)).step_rotation(-10);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(3);
  });
});
