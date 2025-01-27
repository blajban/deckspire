import {
  HexDistance,
  HexCoordinates,
} from '../../../src/math/hexgrid/HexVectors';

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
  test('HexDistance from HexPosition', () => {
    const hex1 = new HexCoordinates(1, 2);
    const hex2 = new HexCoordinates(3, 4);
    const distance = hex1.distanceTo(hex2);
    expect(distance.q).toBe(2);
    expect(distance.r).toBe(2);
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
  });
  test('Addition of distances using non-static method', () => {
    const hex1 = new HexDistance(3, 5);
    const hex2 = new HexDistance(4, 7);
    const hex3 = hex1.clone();
    hex3.add(hex2);
    expect(hex3.q).toBe(7);
    expect(hex3.r).toBe(12);
  });
  test('Subtraction using static method', () => {
    const hex1 = new HexDistance(3, 5);
    const hex2 = new HexDistance(4, 7);
    const hex3 = HexDistance.difference(hex1, hex2);
    expect(hex3.q).toBe(-1);
    expect(hex3.r).toBe(-2);
  });
  test('Subtraction using non-static method', () => {
    const hex1 = new HexDistance(3, 5);
    const hex2 = new HexDistance(4, 7);
    const hex3 = hex1.clone();
    hex3.subtract(hex2);
    expect(hex3.q).toBe(-1);
    expect(hex3.r).toBe(-2);
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
    expect(() => new HexCoordinates(0, 0).hexSectorRotation(0.5)).toThrow(
      'must be integral',
    );
    let vec;
    (vec = new HexCoordinates(3, -2)).hexSectorRotation(0);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-2);
    (vec = new HexCoordinates(3, -2)).hexSectorRotation(1);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
    (vec = new HexCoordinates(3, -2)).hexSectorRotation(2);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(3);
    (vec = new HexCoordinates(3, -2)).hexSectorRotation(-3);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(2);
    (vec = new HexCoordinates(3, -2)).hexSectorRotation(7);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
  });
  test('Step rotation', () => {
    expect(() => new HexCoordinates(0, 0).stepRotation(0.5)).toThrow(
      'must be integral',
    );
    let vec;
    (vec = new HexCoordinates(3, -2)).stepRotation(0);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-2);
    (vec = new HexCoordinates(3, -2)).stepRotation(1);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(-1);
    (vec = new HexCoordinates(3, -2)).stepRotation(2);
    expect(vec.q).toBe(3);
    expect(vec.r).toBe(0);
    (vec = new HexCoordinates(3, -2)).stepRotation(3);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(1);
    (vec = new HexCoordinates(3, -2)).stepRotation(4);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(2);
    (vec = new HexCoordinates(-1, 3)).stepRotation(1);
    expect(vec.q).toBe(-2);
    expect(vec.r).toBe(3);
    (vec = new HexCoordinates(-3, 2)).stepRotation(1);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(1);
    (vec = new HexCoordinates(-2, -1)).stepRotation(1);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(-2);
    (vec = new HexCoordinates(1, -3)).stepRotation(1);
    expect(vec.q).toBe(2);
    expect(vec.r).toBe(-3);
    (vec = new HexCoordinates(0, 0)).stepRotation(255);
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
    (vec = new HexCoordinates(3, -2)).stepRotation(15);
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-3);
    (vec = new HexCoordinates(3, -2)).stepRotation(24);
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(3);
    (vec = new HexCoordinates(3, -2)).stepRotation(-10);
    expect(vec.q).toBe(-3);
    expect(vec.r).toBe(3);
  });
});
