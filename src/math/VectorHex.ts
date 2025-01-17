import { Vector2D, Vector2DLike } from './Vector2D';

const sqrt3over2: number = 0.8660254038;

/**
 * @property {Horizontal} - Hexes have horizontal top and bottom edges and the q-axis is aligned with x-axis.
 * @property {Vertical} - Hexes have vertical side edges and the r-axis is aligned with y-axis.
 */
export enum HexGridOrientation {
    Horizontal,
    Vertical
}

export enum HorizontalOrientationAxis {
    East = 0,
    NorthWest = 1,
    SouthWest = 2,
}

export enum HorizontalOrientationDirection {
    North = 0,
    SouthWest = 1,
    SouthEast = 2,
}

export enum VerticalOrientationAxis {
    NorthEast = 0,
    West = 1,
    SouthEast = 2
}

export enum VerticalOrientationDirection {
    NorthWest = 0,
    SouthWest = 1,
    East = 2
}

/**
 * @classdesc A vector pointing at a specific hex identified by the first two cube coordinates: q and r.
 */
export class VectorHex {
    q: number = 0;
    r: number = 0;

    /**
     * @returns {number} - The coordinate of the third axis, which is inferred from the first two coordinates.
     */
    private s(): number {
        return -this.q - this.r;
    }

    /**
     * @constructor
     * @param {number} [q=0] - The first hex coordinate.
     * @param {number} [r=0] - The second hex coordinate.
     * @returns {VectorHex} - A new @this.
     * @throws if the coordinates are not integers.
     */
    public constructor(q: number = 0, r: number = 0) {
        if( ! (Number.isInteger(q) && Number.isInteger(r)) ){
            throw new Error('Hex coordinates must be integers.');
        }
        this.q = q;
        this.r = r;
    };

    /** 
     * @param {Vector2DLike} vec2 - Any object with a x- and y-coordinate.
     * @returns {VectorHex} - A @this pointing to the hex identified by (q=x, r=y).
     */
    public static from_vector2(vec2: Vector2DLike): VectorHex {
        return new VectorHex(vec2.x, vec2.y);
    };

    /**
     * @returns {@this} - A new identical @this.
     */
    public clone(): VectorHex {
        return new VectorHex(this.q, this.r);
    }

    /**
     * @param {HexGridOrientation} orientation - Determines the hex grid axis alignment.
     * @param {number=1} [size=1] - The distance between two adjacent hexes.
     * @returns {Vector2D} - A vector pointing from the origin to the center of the hex.
     */
    public into_vector2(orientation: HexGridOrientation = HexGridOrientation.Horizontal, size: number = 1): Vector2D {
        if (orientation == HexGridOrientation.Horizontal) {
            return new Vector2D(this.q + 0.5 * this.r, sqrt3over2 * this.r);
        }
        else {
            return new Vector2D(sqrt3over2 * this.q, this.r + 0.5 * this.q);
        }
    }

    /** 
     * @returns {number} - The number of steps, from the origin, needed to reach the hex pointed to by this.
     */
    public manhattan(): number {
        return Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.s()));
    }

    /**
     * Vector subtraction.
     * @param {@this} [vec1] - Starting hex.
     * @param {@this} [vec2] - Ending hex.
     * @returns {@this} - A @this pointing from hex1 to hex2
     */
    public difference(vec1: VectorHex, vec2: VectorHex): VectorHex {
        return new VectorHex(vec2.q - vec1.q, vec2.r - vec1.r);
    }

    /**
     * Vector addition.
     * @param {@this} [origin] - Starting hex.
     * @param {@this} [translation] - Translation to apply.
     * @returns {@this} - A @this pointing from hex1 to hex2
     */
    public add(origin: VectorHex, translation: VectorHex): VectorHex {
        return new VectorHex(origin.q + translation.q, origin.r + translation.r);
    }

    /**
     * Which sector does the vector point to?
     * @returns {number} - An index identifying the sector. Indices start at 0 indicating the east sector (horizontal orientation) or the north-east sector (vertical orientation).
     */
    public sector(): number {
        if (Math.abs(this.q) >= Math.abs(this.r) && Math.abs(this.q) > Math.abs(this.s())) {
            return this.q >= 0 ? 0 : 3
        }
        else if (Math.abs(this.r) >= Math.abs(this.s())) {
            return this.r >= 0 ? 1 : 4
        }
        else {
            return this.s() >= 0 ? 2 : 5;
        }
    }

    /**
     * Translates the vector in the specified direction.
     * @param direction - An index identifying the direction. Indices start at 0 indicating north-east (horizontal orientation) or east (vertical orientation).
     * @param steps 
     * @throws if an invalid axis number is found.
     */
    public step_in_direction(direction: number, steps: number = 1) {
        if (direction < 0 || direction >= 3) {
            throw new Error("Invalid direction, must be a positive integer < 3.");
        }
        switch (direction) {
            // North / NorthWest
            case 0:
                this.r += steps;
                break;
            // SouthWest
            case 1:
                this.q -= steps;
                break;
            // SouthEast / East
            case 2:
                this.q += steps;
                this.r -= steps;
                break;
        }
    }

    /**
     * Rotates the vector n hexes counter clockwise.
     * @param {number} [n=1] - The number of clockwise steps (can be negative).
     */
    public step_rotation(n: number) {
        if (n == 0) return;
        const hexes_per_sector = this.manhattan();
        const circumference = 6 * hexes_per_sector;
        n %= circumference;
        n = n < 0 ? n + circumference : n; // 0 <= n < circumference

        n -= this.rotate_to_corner();
        const sector_rotations = (n / hexes_per_sector);
        this.sector_rotation(sector_rotations);
        n -= sector_rotations * hexes_per_sector;
        let sector = this.sector();
        let direction = sector % 3;
        let steps = sector < 3 ? n: -n;
        this.step_in_direction(steps, direction);
    }

    private rotate_to_corner(): number {
        // Rotate one hex at a time until a corner is reached
        let current_sector: number = this.sector();
        let steps_taken: number = 0;
        switch (current_sector) {
            case 0:
            case 3:
                steps_taken = Math.abs(this.r);
                this.r = 0;
                break;
            case 1:
            case 4:
                steps_taken = Math.abs(this.q);
                this.r += this.q;
                this.q = 0;
                break;
            case 2:
            case 5:
                steps_taken = Math.abs(this.s());
                this.q += this.s();
        }
        return steps_taken;
    }

    /**
     * Rotates the vector n times 60 degrees counter clockwise.
     * @param {number} [n] - The number of 60 degree rotations (can be negative).
     */
    public sector_rotation(n: number) {
        if (n == 0) return;
        n %= 6;
        n = n < 0 ? n + 6 : n;
        const sign_shift = 1 - (n % 2) * 2;
        const coordinate_shift = n % 3;
        const coordinates: number[] = [this.q, this.r, this.s()];
        this.q = sign_shift * coordinates[coordinate_shift];
        this.r = sign_shift * coordinates[1 + coordinate_shift];
    }
}