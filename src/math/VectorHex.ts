import { Vector2D, Vector2DLike } from './Vector2D';

const sqrt3 = Math.sqrt(3);
const sqrt3over2 = 0.5 * Math.sqrt(3);

/**
 * @property {Horizontal} - Hexes have horizontal top and bottom edges and the q-axis is aligned with x-axis.
 * @property {Vertical} - Hexes have vertical side edges and the r-axis is aligned with y-axis.
 */
export enum HexGridOrientation {
  Horizontal,
  Vertical,
}

export enum HorizontalOrientationEdge {
  North = 0,
  NorthWest = 1,
  SouthWest = 2,
  South = 3,
  SouthEast = 4,
  NorthEast = 5,
}

export enum VerticalOrientationEdge {
  NorthWest = 0,
  West = 1,
  SouthWest = 2,
  SouthEast = 3,
  East = 4,
  NorthEast = 5,
}

/**
 * A vector pointing at a specific hex identified by the first two cube coordinates: q and r.
 * Internally, the VectorHex always assumes as horizontal grid and a unit distance between hexes, only when interacting with outside vectors does the hex grid orientation matter.
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
   * @param {number} [q=0] - The first hex coordinate.
   * @param {number} [r=0] - The second hex coordinate.
   * @returns {VectorHex} - A new VectorHex.
   * @throws if the coordinates are not integral.
   */
  public constructor(q: number = 0, r: number = 0) {
    if (!(Number.isInteger(q) && Number.isInteger(r))) {
      throw new Error('Hex coordinates must be integers.');
    }
    this.q = q;
    this.r = r;
  }

  private static into_horizontal(vec2d: Vector2DLike): Vector2D {
    return new Vector2D(
      sqrt3over2 * vec2d.x + 0.5 * vec2d.y,
      -0.5 * vec2d.x + sqrt3over2 * vec2d.y,
    );
  }

  private static into_vertical(vec2d: Vector2DLike): Vector2D {
    return new Vector2D(
      sqrt3over2 * vec2d.x - 0.5 * vec2d.y,
      0.5 * vec2d.x + sqrt3over2 * vec2d.y,
    );
  }

  /**
   * @param {Vector2DLike} vec2d - Any object with a x- and y-coordinate.
   * @returns {VectorHex} - A vector pointing to the hex identified by (q=x, r=y).
   * @throws if an invalid hex grid orientation is supplied.
   */
  public static from_vector2D(
    vec2d: Vector2DLike,
    orientation: HexGridOrientation = HexGridOrientation.Horizontal,
    size = 1,
  ): VectorHex {
    if (
      orientation !== HexGridOrientation.Horizontal &&
      orientation !== HexGridOrientation.Vertical
    ) {
      throw new Error('Invalid hex grid orientation.');
    }
    if (orientation === HexGridOrientation.Vertical) {
      vec2d = VectorHex.into_horizontal(vec2d);
    }
    const q = vec2d.x / sqrt3over2;
    const r = vec2d.y - 0.5 * q;
    return new VectorHex(Math.trunc(q / size) >> 0, Math.trunc(r / size) >> 0);
  }

  /**
   * @returns {VectorHex} - A new identical VectorHex.
   */
  public clone(): VectorHex {
    return new VectorHex(this.q, this.r);
  }

  /**
   * @param {HexGridOrientation} orientation - Determines the hex grid axis alignment.
   * @param {number=1} [size=1] - The distance between two adjacent hexes.
   * @returns {Vector2D} - A vector pointing from the origin to the center of the hex.
   * @throws if the size is not positive or an invalid orientation is supplied.
   */
  public into_vector2d(
    orientation: HexGridOrientation = HexGridOrientation.Horizontal,
    size: number = 1,
  ): Vector2D {
    if (size <= 0) {
      throw new Error('Hex size must be positive.');
    }
    if (
      orientation !== HexGridOrientation.Horizontal &&
      orientation !== HexGridOrientation.Vertical
    ) {
      throw new Error('Invalid hex grid orientation.');
    }
    const horizontal_vec2d = new Vector2D(
      size * sqrt3over2 * this.q,
      size * (this.r + 0.5 * this.q),
    );
    if (orientation === HexGridOrientation.Horizontal) {
      return horizontal_vec2d;
    }
    return VectorHex.into_vertical(horizontal_vec2d);
  }

  /**
   * Calculates vector pointing from one hex to another.
   * @param {VectorHex} [vec1] - Starting hex.
   * @param {VectorHex} [vec2] - Ending hex.
   * @returns {VectorHex} - A vector pointing from hex1 to hex2
   */
  public static delta(vec1: VectorHex, vec2: VectorHex): VectorHex {
    return new VectorHex(vec2.q - vec1.q, vec2.r - vec1.r);
  }

  /**
   * Subtracts a vector from this one.
   * @param {VectorHex} [hex] - The vector to subtract
   * @returns {VectorHex} - The vector after subtraction.
   */
  public subtract(hex: VectorHex): VectorHex {
    this.q -= hex.q;
    this.r -= hex.r;
    return this;
  }

  /**
   * Vector sum.
   * @param {VectorHex} [origin] - Starting hex.
   * @param {VectorHex} [translation] - Translation to apply.
   * @returns {VectorHex} - The sum of the vectors.
   */
  public static sum(origin: VectorHex, translation: VectorHex): VectorHex {
    return new VectorHex(origin.q + translation.q, origin.r + translation.r);
  }

  /**
   * Translates the vector.
   * @param {VectorHex} [translation] - Translation to apply.
   * @returns {VectorHex} - The vector after translation.
   */
  public add(translation: VectorHex): VectorHex {
    this.q += translation.q;
    this.r += translation.r;
    return this;
  }

  /**
   * @returns {number} - The number of steps, from the origin, needed to reach the hex pointed to by this.
   */
  public manhattan(): number {
    return Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.s()));
  }

  /**
   * Which sector does the vector point to?
   * @returns {number} - An index >= 0 and < 6, identifying the sector. Indices start at 0 indicating the east sector (horizontal orientation) or the north-east sector (vertical orientation).
   */
  public sector(): number {
    if (
      Math.abs(this.q) >= Math.abs(this.r) &&
      Math.abs(this.q) > Math.abs(this.s())
    ) {
      return this.q >= 0 ? 0 : 3;
    } else if (Math.abs(this.r) >= Math.abs(this.s())) {
      return this.r > 0 ? 2 : 5;
    } else {
      return this.s() < 0 ? 1 : 4;
    }
  }

  /**
   * Translates the vector in the specified direction.
   * @param direction - An index identifying the direction. Indices start at 0 indicating north-east (horizontal orientation) or east (vertical orientation).
   * @param steps
   * @throws if an invalid axis number is found.
   */
  public step_in_direction(direction: number, steps: number = 1): VectorHex {
    if (!Number.isInteger(steps)) {
      throw new Error('Number of steps must be an integer.');
    }
    if (direction < 0 || direction >= 6) {
      throw new Error('Invalid direction, must be a positive integer < 6.');
    }
    if (direction > 2) {
      steps *= -1;
      direction -= 3;
    }
    switch (direction) {
      // North
      case 0:
        this.r += steps;
        break;
      case 1: // NorthWest
        this.q -= steps;
        this.r += steps;
        break;
      case 2: // SouthWest
        this.q -= steps;
        break;
    }
    return this;
  }

  /**
   * Rotates the vector n times 60 degrees counter clockwise.
   * @param {number} [n] - The number of 60 degree rotations (can be negative).
   * @throws if the number of sector rotations is not integral.
   */
  public sector_rotation(n: number) {
    if (!Number.isInteger(n)) {
      throw new Error('Number of sectors must be integral.');
    }
    n %= 6;
    if (n === 0) return;
    n = n < 0 ? n + 6 : n;
    const sign_shift = 1 - (n % 2) * 2;
    const coordinate_shift = n % 3;
    const coordinates: number[] = [this.q, this.r, this.s()];
    this.q = sign_shift * coordinates[coordinate_shift];
    this.r = sign_shift * coordinates[(1 + coordinate_shift) % 3];
  }

  /**
   * Rotates the vector n hexes counter clockwise.
   * @param {number} [n] - The number of counter clockwise steps (can be negative).
   * @throws if the number of steps is not integral.
   */
  public step_rotation(n: number) {
    if (!Number.isInteger(n)) {
      throw new Error('Number of steps must be integral.');
    }
    if (n === 0) return;
    const hexes_per_sector = this.manhattan();
    if (hexes_per_sector === 0) return;
    const circumference = 6 * hexes_per_sector;
    n %= circumference;
    n = n < 0 ? n + circumference : n; // 0 <= n < circumference
    n -= this.rotate_to_corner(n);
    const sector_rotations = Math.trunc(n / hexes_per_sector);
    this.sector_rotation(sector_rotations);
    n -= sector_rotations * hexes_per_sector;
    const sector = this.sector();
    const direction = sector;
    this.step_in_direction(direction, n);
  }

  private rotate_to_corner(max_steps: number): number {
    // Rotate hex wise until a corner is reached
    const current_sector: number = this.sector();
    let steps_taken: number = 0;
    switch (current_sector) {
      case HorizontalOrientationEdge.North:
      case HorizontalOrientationEdge.South:
        steps_taken = Math.min(Math.abs(this.r), max_steps);
        this.step_in_direction(current_sector, steps_taken);
        break;
      case HorizontalOrientationEdge.NorthWest:
      case HorizontalOrientationEdge.SouthEast:
        steps_taken = Math.min(Math.abs(this.q), max_steps);
        this.step_in_direction(current_sector, steps_taken);
        break;
      case HorizontalOrientationEdge.SouthWest:
      case HorizontalOrientationEdge.NorthEast:
        steps_taken = Math.min(Math.abs(this.s()), max_steps);
        this.step_in_direction(current_sector, steps_taken);
        break;
    }
    return steps_taken;
  }
}
