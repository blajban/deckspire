import { Vector2D, Vector2DLike } from './Vector2D';

const sqrt3over2 = 0.5 * Math.sqrt(3);

/**
 * @property {Horizontal} - Hexes have horizontal top and bottom edges and the r-axis is aligned with the y-axis.
 * @property {Vertical} - Hexes have vertical side edges and the q-axis is aligned with the x-axis.
 */
export enum HexLayout {
  Horizontal,
  Vertical,
}

export enum HexDirection {
  East,
  NorthEast,
  North,
  NorthWest,
  West,
  SouthWest,
  South,
  SouthEast,
}

// Currently not needed
/*function horizontal_direction_to_vertical_direction(
  direction: HexDirection,
): HexDirection {
  switch (direction) {
    case HexDirection.NorthEast:
      return HexDirection.NorthEast;
    case HexDirection.North:
      return HexDirection.NorthWest;
    case HexDirection.NorthWest:
      return HexDirection.West;
    case HexDirection.SouthWest:
      return HexDirection.SouthWest;
    case HexDirection.South:
      return HexDirection.SouthEast;
    case HexDirection.SouthEast:
      return HexDirection.East;
    default:
      throw new Error('Invalid direction for horizontal layout.');
  }
}*/

function vertical_direction_to_horizontal_direction(
  direction: HexDirection,
): HexDirection {
  switch (direction) {
    case HexDirection.East:
      return HexDirection.SouthEast;
    case HexDirection.NorthEast:
      return HexDirection.NorthEast;
    case HexDirection.NorthWest:
      return HexDirection.North;
    case HexDirection.West:
      return HexDirection.NorthWest;
    case HexDirection.SouthWest:
      return HexDirection.SouthWest;
    case HexDirection.SouthEast:
      return HexDirection.South;
    default:
      throw new Error('Invalid direction for vertical layout.');
  }
}

function horizontal_wedge_to_vertical_wedge(
  direction: HexDirection,
): HexDirection {
  switch (direction) {
    case HexDirection.East:
      return HexDirection.NorthEast;
    case HexDirection.NorthEast:
      return HexDirection.North;
    case HexDirection.NorthWest:
      return HexDirection.NorthWest;
    case HexDirection.West:
      return HexDirection.SouthWest;
    case HexDirection.SouthWest:
      return HexDirection.South;
    case HexDirection.SouthEast:
      return HexDirection.SouthEast;
    default:
      throw new Error('Invalid direction for horizontal wedge.');
  }
}

function wedge_edge_direction(wedge: HexDirection): HexDirection {
  switch (wedge) {
    case HexDirection.SouthEast:
      return HexDirection.NorthEast;
    case HexDirection.East:
      return HexDirection.North;
    case HexDirection.NorthEast:
      return HexDirection.NorthWest;
    case HexDirection.NorthWest:
      return HexDirection.SouthWest;
    case HexDirection.West:
      return HexDirection.South;
    case HexDirection.SouthWest:
      return HexDirection.SouthEast;
    default:
      throw new Error('Invalid horizontal wedge.');
  }
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
   * @param {Vector2DLike} vec - Any object with a x- and y-coordinate.
   * @returns {VectorHex} - A vector pointing to the hex identified by (q=x, r=y).
   * @throws if an invalid hex grid orientation is supplied.
   */
  public static from_vector2D(
    vec: Vector2DLike,
    orientation: HexLayout = HexLayout.Horizontal,
    size = 1,
  ): VectorHex {
    let vec_horizontal = new Vector2D(vec.x / size, vec.y / size);
    if (orientation === HexLayout.Vertical) {
      vec_horizontal = VectorHex.into_horizontal(vec_horizontal);
    }
    const fractional_q = vec_horizontal.x / sqrt3over2;
    const fractional_r = vec_horizontal.y - 0.5 * fractional_q;
    return VectorHex.from_fractional_coordinates(fractional_q, fractional_r);
  }

  private static from_fractional_coordinates(
    fractional_q: number,
    fractional_r: number,
  ): VectorHex {
    const fractional_s = -fractional_q - fractional_r;
    let q = Math.round(fractional_q) >> 0;
    let r = Math.round(fractional_r) >> 0;
    const s = Math.round(fractional_s) >> 0;
    const delta_q = Math.abs(fractional_q - q);
    const delta_r = Math.abs(fractional_r - r);
    const delta_s = Math.abs(fractional_s - s);
    if (delta_q > delta_r && delta_q > delta_s) {
      q = -r - s;
    } else if (delta_r > delta_s) {
      r = -q - s;
    }
    return new VectorHex(q, r);
  }

  /**
   * @returns {VectorHex} - A new identical VectorHex.
   */
  public clone(): VectorHex {
    return new VectorHex(this.q, this.r);
  }

  /**
   * @param {HexLayout} layout - Determines the hex grid axis alignment.
   * @param {number=1} [size=1] - The distance between two adjacent hexes.
   * @returns {Vector2D} - A vector pointing from the origin to the center of the hex.
   * @throws if the size is not positive or an invalid orientation is supplied.
   */
  public into_vector2d(
    layout: HexLayout = HexLayout.Horizontal,
    size: number = 1,
  ): Vector2D {
    if (size <= 0) {
      throw new Error('Hex size must be positive.');
    }
    let vec2d = new Vector2D(
      size * sqrt3over2 * this.q,
      size * (0.5 * this.q + this.r),
    );
    if (layout === HexLayout.Vertical) {
      vec2d = VectorHex.into_vertical(vec2d);
    }
    return vec2d;
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
   * Which wedge does the hex belong in?
   * @returns {HexDirection} - The direction of the wedge.
   */
  public wedge(layout: HexLayout = HexLayout.Horizontal): HexDirection {
    let hex_wedge;
    if (
      Math.abs(this.q) >= Math.abs(this.r) &&
      Math.abs(this.q) > Math.abs(this.s())
    ) {
      hex_wedge = this.q >= 0 ? HexDirection.East : HexDirection.West;
    } else if (Math.abs(this.r) >= Math.abs(this.s())) {
      hex_wedge = this.r > 0 ? HexDirection.NorthWest : HexDirection.SouthEast;
    } else {
      hex_wedge =
        this.s() > 0 ? HexDirection.SouthWest : HexDirection.NorthEast;
    }
    if (layout === HexLayout.Vertical) {
      hex_wedge = horizontal_wedge_to_vertical_wedge(hex_wedge);
    }
    return hex_wedge;
  }

  /**
   * Translates the vector in the specified direction.
   * @param direction - An index identifying the direction. Indices start at 0 indicating north-east (horizontal orientation) or east (vertical orientation).
   * @param steps
   * @throws if an invalid axis number is found.
   */
  public step_in_direction(
    direction: HexDirection,
    steps: number = 1,
    layout: HexLayout = HexLayout.Horizontal,
  ): VectorHex {
    if (!Number.isInteger(steps)) {
      throw new Error('Number of steps must be integral.');
    }
    if (layout === HexLayout.Vertical) {
      direction = vertical_direction_to_horizontal_direction(direction);
    }
    switch (direction) {
      case HexDirection.North:
        this.r += steps;
        break;
      case HexDirection.South:
        this.r -= steps;
        break;
      case HexDirection.NorthWest:
        this.q -= steps;
        this.r += steps;
        break;
      case HexDirection.SouthEast:
        this.q += steps;
        this.r -= steps;
        break;
      case HexDirection.NorthEast:
        this.q += steps;
        break;
      case HexDirection.SouthWest:
        this.q -= steps;
        break;
      default:
        throw new Error('Invalid horizontal direction');
    }
    return this;
  }

  /**
   * Rotates the vector n times 60 degrees counter clockwise.
   * @param {number} [n] - The number of 60 degree rotations (can be negative).
   * @throws if the number of sector rotations is not integral.
   */
  public wedge_rotation(n: number): VectorHex {
    if (!Number.isInteger(n)) {
      throw new Error('Number of wedges must be integral.');
    }
    n %= 6;
    if (n === 0) return this;
    n = n < 0 ? n + 6 : n;
    const sign_shift = 1 - (n % 2) * 2;
    const coordinate_shift = n % 3;
    const coordinates: number[] = [this.q, this.r, this.s()];
    this.q = sign_shift * coordinates[coordinate_shift];
    this.r = sign_shift * coordinates[(1 + coordinate_shift) % 3];
    return this;
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
    this.wedge_rotation(sector_rotations);
    n -= sector_rotations * hexes_per_sector;
    this.step_in_direction(wedge_edge_direction(this.wedge()), n);
  }

  private rotate_to_corner(max_steps: number): number {
    // Rotate hex wise until a corner is reached
    const direction = wedge_edge_direction(this.wedge());
    let steps_taken: number = 0;
    switch (direction) {
      case HexDirection.NorthEast:
      case HexDirection.SouthWest:
        steps_taken = Math.min(Math.abs(this.s()), max_steps);
        this.step_in_direction(direction, steps_taken);
        break;
      case HexDirection.North:
      case HexDirection.South:
        steps_taken = Math.min(Math.abs(this.r), max_steps);
        this.step_in_direction(direction, steps_taken);
        break;
      case HexDirection.NorthWest:
      case HexDirection.SouthEast:
        steps_taken = Math.min(Math.abs(this.q), max_steps);
        this.step_in_direction(direction, steps_taken);
        break;
    }
    return steps_taken;
  }
}
