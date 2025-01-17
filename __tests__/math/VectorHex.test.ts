import { VectorHex } from '../../src/math/VectorHex';

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