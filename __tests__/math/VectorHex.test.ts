import { HexGridOrientation, VectorHex } from '../../src/math/VectorHex';
import { Vector2D } from '../../src/math/Vector2D';

const FLOAT_DIGITS: number = 8;

describe('Creating VectorHex', () => {
    test('Default ctor', () => {
        let vec: VectorHex = new VectorHex();
        expect(vec.q).toBe(0);
        expect(vec.r).toBe(0);
    });
    test('From coordinates', () => {
        let vec: VectorHex = new VectorHex(3, 7);
        expect(vec.q).toBe(3);
        expect(vec.r).toBe(7);
    });
    test('From non-integer coordinates', () => {
        expect(() => new VectorHex(3.2, 7.9)).toThrow('Hex coordinates must be integers.');
    });
    test('From Vector2D', () => {
        let vec2 = { x: 3, y: 7 };
        let vec: VectorHex = VectorHex.from_vector2(vec2);
        expect(vec.q).toBe(3);
        expect(vec.r).toBe(7);
    });
    test('From clone', () => {
        let vec: VectorHex = new VectorHex(3, 7);
        let clone = vec.clone();
        expect(clone.q).toBe(3);
        expect(clone.r).toBe(7);
    });
});

describe('Converting VectorHex', () => {
    test('Horizontal hex into Vector2D', () => {
        let vec: Vector2D;
        vec = (new VectorHex(0, 0)).into_vector2(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
        vec = (new VectorHex(1, 0)).into_vector2(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
        vec = (new VectorHex(0, 1)).into_vector2(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
        vec = (new VectorHex(-1, 1)).into_vector2(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
        vec = (new VectorHex(-1, 0)).into_vector2(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
        vec = (new VectorHex(0, -1)).into_vector2(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-1, FLOAT_DIGITS);
        vec = (new VectorHex(1, -1)).into_vector2(HexGridOrientation.Horizontal, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
    });
    test('Vertical hex into Vector2D', () => {
        let vec: Vector2D;
        vec = (new VectorHex(0, 0)).into_vector2(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
        vec = (new VectorHex(1, 0)).into_vector2(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
        vec = (new VectorHex(0, 1)).into_vector2(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
        vec = (new VectorHex(-1, 1)).into_vector2(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-1, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
        vec = (new VectorHex(-1, 0)).into_vector2(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
        vec = (new VectorHex(0, -1)).into_vector2(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
        vec = (new VectorHex(1, -1)).into_vector2(HexGridOrientation.Vertical, 1);
        expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    });
    test('Hex to Vector2D with scaling', () => {
        expect(() => new VectorHex(1, 0).into_vector2(HexGridOrientation.Horizontal, 0)).toThrow("Hex size must be positive.");
        let vec: Vector2D;
        vec = (new VectorHex(1, 0)).into_vector2(HexGridOrientation.Horizontal, 2);
        expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
        vec = (new VectorHex(1, 0)).into_vector2(HexGridOrientation.Vertical, 2);
        expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
        expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
        expect(vec.y).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
    });
});

describe('Arithmetics', () => {
    test('Addition using static method', () => {
        let hex1: VectorHex = new VectorHex(3, 5);
        let hex2: VectorHex = new VectorHex(4, 7);
        let hex3: VectorHex = VectorHex.add(hex1, hex2);
        expect(hex3.q).toBe(7);
        expect(hex3.r).toBe(12);
        expect(hex3.into_vector2().x).toBeCloseTo(hex1.into_vector2().x + hex2.into_vector2().x, FLOAT_DIGITS);
        expect(hex3.into_vector2().y).toBeCloseTo(hex1.into_vector2().y + hex2.into_vector2().y, FLOAT_DIGITS);
    });
    test('Addition using non-static method', () => {
        let hex1: VectorHex = new VectorHex(3, 5);
        let hex2: VectorHex = new VectorHex(4, 7);
        let hex3: VectorHex = hex1.clone();
        hex3.add(hex2);
        expect(hex3.q).toBe(7);
        expect(hex3.r).toBe(12);
        expect(hex3.into_vector2().x).toBeCloseTo(hex1.into_vector2().x + hex2.into_vector2().x, FLOAT_DIGITS);
        expect(hex3.into_vector2().y).toBeCloseTo(hex1.into_vector2().y + hex2.into_vector2().y, FLOAT_DIGITS);
    });
});