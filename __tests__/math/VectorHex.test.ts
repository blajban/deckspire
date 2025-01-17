import { HexGridOrientation, HorizontalOrientationEdge, VectorHex, VerticalOrientationEdge } from '../../src/math/VectorHex';
import { Vector2D } from '../../src/math/Vector2D';

const FLOAT_DIGITS: number = 8;

describe('Creating VectorHex', () => {
    test('Default ctor', () => {
        let vec = new VectorHex();
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(0);
    });
    test('From coordinates', () => {
        let vec = new VectorHex(3, 7);
        expect(vec.q).toBe(3);
        expect(vec.r).toBe(7);
    });
    test('From non-integer coordinates', () => {
        expect(() => new VectorHex(3.2, 7.9)).toThrow('Hex coordinates must be integers.');
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
        vec = VectorHex.from_vector2D({ x: 1.001 * Math.cos(Math.PI / 6) / Math.sqrt(2), y: 1.001 * Math.sin(Math.PI / 6) / Math.sqrt(2) });
        expect(vec.q).toBe(1);
        expect(vec.r).toBe(0);
        vec = VectorHex.from_vector2D({ x: 0.999 * Math.cos(Math.PI / 6) / Math.sqrt(2), y: 0.999 * Math.sin(Math.PI / 6) / Math.sqrt(2) });
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(0);
    });
    test('From clone', () => {
        let vec = new VectorHex(3, 7);
        let clone = vec.clone();
        expect(clone.q).toBe(3);
        expect(clone.r).toBe(7);
    });
});

describe('Converting VectorHex', () => {
    test('Horizontal hex into Vector2D', () => {
        let vec;
        vec = (new VectorHex(0, 0)).into_vector2d(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
        vec = (new VectorHex(1, 0)).into_vector2d(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
        vec = (new VectorHex(0, 1)).into_vector2d(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
        vec = (new VectorHex(-1, 1)).into_vector2d(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
        vec = (new VectorHex(-1, 0)).into_vector2d(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
        vec = (new VectorHex(0, -1)).into_vector2d(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-1, FLOAT_DIGITS);
        vec = (new VectorHex(1, -1)).into_vector2d(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
    });
    test('Vertical hex into Vector2D', () => {
        let vec;
        vec = (new VectorHex(0, 0)).into_vector2d(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
        vec = (new VectorHex(1, 0)).into_vector2d(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
        vec = (new VectorHex(0, 1)).into_vector2d(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
        vec = (new VectorHex(-1, 1)).into_vector2d(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-1, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
        vec = (new VectorHex(-1, 0)).into_vector2d(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
        vec = (new VectorHex(0, -1)).into_vector2d(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
        vec = (new VectorHex(1, -1)).into_vector2d(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    });
    test('Hex to Vector2D with scaling', () => {
        expect(() => new VectorHex(1, 0).into_vector2d(HexGridOrientation.Horizontal, 0)).toThrow("Hex size must be positive.");
        let vec;
        vec = (new VectorHex(1, 0)).into_vector2d(HexGridOrientation.Horizontal, 2);
        expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
        vec = (new VectorHex(1, 0)).into_vector2d(HexGridOrientation.Vertical, 2);
        expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
    });
});

describe('Arithmetics', () => {
    test('Addition using static method', () => {
        let hex1 = new VectorHex(3, 5);
        let hex2 = new VectorHex(4, 7);
        let hex3 = VectorHex.sum(hex1, hex2);
        expect(hex3.q).toBe(7);
        expect(hex3.r).toBe(12);
        expect(hex3.into_vector2d().x).toBeCloseTo(hex1.into_vector2d().x + hex2.into_vector2d().x, FLOAT_DIGITS);
        expect(hex3.into_vector2d().y).toBeCloseTo(hex1.into_vector2d().y + hex2.into_vector2d().y, FLOAT_DIGITS);
    });
    test('Addition using non-static method', () => {
        let hex1 = new VectorHex(3, 5);
        let hex2 = new VectorHex(4, 7);
        let hex3 = hex1.clone();
        hex3.add(hex2);
        expect(hex3.q).toBe(7);
        expect(hex3.r).toBe(12);
        expect(hex3.into_vector2d().x).toBeCloseTo(hex1.into_vector2d().x + hex2.into_vector2d().x, FLOAT_DIGITS);
        expect(hex3.into_vector2d().y).toBeCloseTo(hex1.into_vector2d().y + hex2.into_vector2d().y, FLOAT_DIGITS);
    });
    test('Subtraction using static method', () => {
        let hex1 = new VectorHex(3, 5);
        let hex2 = new VectorHex(4, 7);
        let hex3 = VectorHex.delta(hex1, hex2);
        expect(hex3.q).toBe(1);
        expect(hex3.r).toBe(2);
        expect(hex3.into_vector2d().x).toBeCloseTo(hex2.into_vector2d().x - hex1.into_vector2d().x, FLOAT_DIGITS);
        expect(hex3.into_vector2d().y).toBeCloseTo(hex2.into_vector2d().y - hex1.into_vector2d().y, FLOAT_DIGITS);
    });
    test('Subtraction using non-static method', () => {
        let hex1 = new VectorHex(3, 5);
        let hex2 = new VectorHex(4, 7);
        let hex3 = hex1.clone();
        hex3.subtract(hex2);
        expect(hex3.q).toBe(-1);
        expect(hex3.r).toBe(-2);
        expect(hex3.into_vector2d().x).toBeCloseTo(hex1.into_vector2d().x - hex2.into_vector2d().x, FLOAT_DIGITS);
        expect(hex3.into_vector2d().y).toBeCloseTo(hex1.into_vector2d().y - hex2.into_vector2d().y, FLOAT_DIGITS);
    });
});

describe('Hex grid operations and calculations.', () => {
    test('Manhattan distance', () => {
        let hex1 = new VectorHex(3, -1);
        let hex2 = new VectorHex(-2, 1);
        expect(VectorHex.delta(hex1, hex2).manhattan()).toBe(5);
    });
    test('Sector', () => {
        expect((new VectorHex(1, -1)).sector()).toBe(0);
        expect((new VectorHex(1, 0)).sector()).toBe(1);
        expect((new VectorHex(0, 1)).sector()).toBe(2);
        expect((new VectorHex(-1, 1)).sector()).toBe(3);
        expect((new VectorHex(-1, 0)).sector()).toBe(4);
        expect((new VectorHex(0, -1)).sector()).toBe(5);
    });
    test('Single steps in horizontal orientation directions', () => {
        let vec = new VectorHex(0, 0);
        vec.step_in_direction(HorizontalOrientationEdge.North, 1);
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(1);
        vec.step_in_direction(HorizontalOrientationEdge.SouthEast, 1);
        expect(vec.q).toBe(1);
        expect(vec.r).toBe(0);
        vec.step_in_direction(HorizontalOrientationEdge.SouthWest, 1);
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(0);
        vec.step_in_direction(HorizontalOrientationEdge.SouthEast, -1);
        expect(vec.q).toBe(-1);
        expect(vec.r).toBe(1);
        vec.step_in_direction(HorizontalOrientationEdge.SouthWest, -1);
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(1);
        vec.step_in_direction(HorizontalOrientationEdge.North, -1);
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(0);
    });
    test('Single steps in vertical orientation directions', () => {
        let vec = new VectorHex(0, 0);
        vec.step_in_direction(VerticalOrientationEdge.East, 1);
        expect(vec.q).toBe(1);
        expect(vec.r).toBe(-1);
        vec.step_in_direction(VerticalOrientationEdge.NorthWest, 1);
        expect(vec.q).toBe(1);
        expect(vec.r).toBe(0);
        vec.step_in_direction(VerticalOrientationEdge.SouthWest, 1);
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(0);
        vec.step_in_direction(VerticalOrientationEdge.NorthWest, -1);
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(-1);
        vec.step_in_direction(VerticalOrientationEdge.SouthWest, -1);
        expect(vec.q).toBe(1);
        expect(vec.r).toBe(-1);
        vec.step_in_direction(VerticalOrientationEdge.East, -1);
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(0);
    });
    test('Multiple steps in horizontal directions', () => {
        let vec = new VectorHex(3, -3);
        vec.step_in_direction(HorizontalOrientationEdge.SouthEast, -2);
        expect(vec.q).toBe(1);
        expect(vec.r).toBe(-1);
        vec.step_in_direction(HorizontalOrientationEdge.North, 5);
        expect(vec.q).toBe(1);
        expect(vec.r).toBe(4);
    });
    test('Multiple steps in vertical directions', () => {
        let vec = new VectorHex(3, -3);
        vec.step_in_direction(VerticalOrientationEdge.NorthWest, 2);
        expect(vec.q).toBe(3);
        expect(vec.r).toBe(-1);
        vec.step_in_direction(VerticalOrientationEdge.SouthWest, 5);
        expect(vec.q).toBe(-2);
        expect(vec.r).toBe(-1);
    });
});

describe('Rotations', () => {
    test('60 degree rotation', () => {
        let vec;
        (vec = new VectorHex(3, -2)).sector_rotation(0);
        expect(vec.q).toBe(3);
        expect(vec.r).toBe(-2);
        (vec = new VectorHex(3, -2)).sector_rotation(1);
        expect(vec.q).toBe(2);
        expect(vec.r).toBe(1);
        (vec = new VectorHex(3, -2)).sector_rotation(2);
        expect(vec.q).toBe(-1);
        expect(vec.r).toBe(3);
        (vec = new VectorHex(3, -2)).sector_rotation(-3);
        expect(vec.q).toBe(-3);
        expect(vec.r).toBe(2);
        (vec = new VectorHex(3, -2)).sector_rotation(7);
        expect(vec.q).toBe(2);
        expect(vec.r).toBe(1);
    });
    test('Step rotation', () => {
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
    })
});