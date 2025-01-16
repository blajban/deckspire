import {Vector2D, Vector2DLike} from './Vector2D'

const sqrt3over2: number = 0.8660254038;

enum HexGridOrientation {
    Horizontal, // Hexes have horizontal top and bottom edges.
    Vertical    // Hexes have vertical side edges.
}

class VectorHex {
    q: number = 0;
    r: number = 0;
    // The third parameter s is inferred by q and r (s = -q - r)

    public constructor();
    public constructor(q: number, r: number)
    public constructor(r?: number, q?: number) {
        this.q = r ?? 0;
        this.r = q ?? 0;
    };

    public from_vector2(vec2: Vector2DLike): VectorHex {
        return new VectorHex(vec2.x, vec2.y);
    };

    public into_vector2(): Vector2D {
        return new Vector2D(sqrt3over2 * this.q, this.q + this.r / 2);
    }
}