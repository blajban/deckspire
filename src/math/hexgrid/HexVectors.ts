import { Vector2D, Vector2DLike } from '../Vector2D';

const sqrt3over2 = 0.5 * Math.sqrt(3);

/**
 * @property {Horizontal} - Hexes have horizontal top and bottom edges and the r-axis is aligned with the y-axis.
 * @property {Vertical} - Hexes have vertical side edges and the q-axis is aligned with the x-axis.
 */
export enum HexLayout {
  Horizontal,
  Vertical,
}

function from_vertical_into_horizontal_vector2d(vec2d: Vector2DLike): Vector2D {
  return new Vector2D(
    sqrt3over2 * vec2d.x + 0.5 * vec2d.y,
    -0.5 * vec2d.x + sqrt3over2 * vec2d.y,
  );
}

function from_horizontal_into_vertical_vector2d(vec2d: Vector2DLike): Vector2D {
  return new Vector2D(
    sqrt3over2 * vec2d.x - 0.5 * vec2d.y,
    0.5 * vec2d.x + sqrt3over2 * vec2d.y,
  );
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

/** Maps the vertical direction to the corresponding direction in the relatively
 *  rotated horizontal reference frame */
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
 * A vector pointing at a specific hex identified by the first two cube
 * coordinates: q and r. Internally, the VectorHex always assumes as horizontal
 * layout and unit distance between hexes, only when interacting with outside
 * vectors does the hex grid orientation matter.
 */
class HexGeneric {
  q: number = 0;
  r: number = 0;

  /**
   * @returns {number} - The coordinate of the third axis, which is inferred from the first two coordinates.
   */
  protected s(): number {
    return -this.q - this.r;
  }

  /**
   * @param {number} [q=0] - The first hex coordinate.
   * @param {number} [r=0] - The second hex coordinate.
   * @returns {HexGeneric} - A new VectorHex.
   * @throws if the coordinates are not integral.
   */
  public constructor(q: number, r: number) {
    if (!(Number.isInteger(q) && Number.isInteger(r))) {
      throw new Error('Hex coordinates must be integers.');
    }
    this.q = q;
    this.r = r;
  }
}

export class HexDistance extends HexGeneric {
  /**
   * Calculates vector pointing from one hex to another.
   * @param {HexPosition} [vec1] - Starting hex.
   * @param {HexPosition} [vec2] - Ending hex.
   * @returns {HexDistance} - A vector pointing from hex1 to hex2
   */
  public constructor(q: number, r: number);
  public constructor(vec1: HexPosition, vec2: HexPosition);
  public constructor(arg1: HexPosition | number, arg2: HexPosition | number) {
    if (arg1 instanceof HexPosition && arg2 instanceof HexPosition) {
      super(arg2.q - arg1.q, arg2.r - arg1.r);
    } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      super(arg1, arg2);
    }
  }

  /**
   * @returns {HexDistance} - A new identical VectorHex.
   */
  public clone(): HexDistance {
    return new HexDistance(this.q, this.r);
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
      vec2d = from_horizontal_into_vertical_vector2d(vec2d);
    }
    return vec2d;
  }

  /**
   * Adds two distances.
   * @param {HexDistance} [dist1] - A distance.
   * @param {HexDistance} [dist2] - Another distance.
   * @returns {HexDistance} - The total distance.
   */
  public static sum(dist1: HexDistance, dist2: HexDistance): HexDistance {
    return new HexDistance(dist1.q + dist2.q, dist1.r + dist2.r);
  }

  /**
   * Subtracts two distances.
   * @param {HexDistance} [dist1] - A distance.
   * @param {HexDistance} [dist2] - Another distance.
   * @returns {HexDistance} - The total distance.
   */
  public static difference(
    dist1: HexDistance,
    dist2: HexDistance,
  ): HexDistance {
    return new HexDistance(dist1.q - dist2.q, dist1.r - dist2.r);
  }

  /**
   * Adds another distance to the vector.
   * @param {HexDistance} [distance] - Distance to add.
   * @returns {HexPosition} - The vector after the addition.
   */
  public add(distance: HexDistance): HexDistance {
    this.q += distance.q;
    this.r += distance.r;
    return this;
  }

  /**
   * Subtracts another distance from the vector.
   * @param {HexDistance} [distance] - Distance to add.
   * @returns {HexPosition} - The vector after the addition.
   */
  public subtract(distance: HexDistance): HexDistance {
    this.q -= distance.q;
    this.r -= distance.r;
    return this;
  }

  /**
   * @returns {number} - The number of steps needed to traverse the represented distance.
   */
  public manhattan(): number {
    return Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.s()));
  }
}

export class HexPosition extends HexGeneric {
  public constructor(q: number, r: number) {
    super(q, r);
  }

  /**
   * @returns {HexPosition} - A new identical VectorHex.
   */
  public clone(): HexPosition {
    return new HexPosition(this.q, this.r);
  }

  /**
   * @param {Vector2DLike} vec - Any object with a x- and y-coordinate.
   * @returns {HexPosition} - Hex coordinates of the hex that (x,y) is inside.
   * @throws if an invalid hex grid orientation is supplied.
   */
  public static from_vector2D(
    vec: Vector2DLike,
    orientation: HexLayout = HexLayout.Horizontal,
    size = 1,
  ): HexPosition {
    let vec_horizontal = new Vector2D(vec.x / size, vec.y / size);
    if (orientation === HexLayout.Vertical) {
      vec_horizontal = from_vertical_into_horizontal_vector2d(vec_horizontal);
    }
    const fractional_q = vec_horizontal.x / sqrt3over2;
    const fractional_r = vec_horizontal.y - 0.5 * fractional_q;
    return HexPosition.from_fractional_coordinates(fractional_q, fractional_r);
  }

  private static from_fractional_coordinates(
    fractional_q: number,
    fractional_r: number,
  ): HexPosition {
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
    return new HexPosition(q, r);
  }

  /**
   * Calculates vector pointing from this hex to another hex.
   * @param {HexPosition} [hex] - The other hex.
   * @returns {HexDistance} - A vector pointing from this hex to the other.
   */
  public distance_to(hex: HexPosition): HexDistance {
    return new HexDistance(hex.q - this.q, hex.r - this.r);
  }

  /**
   * Calculates vector pointing from the origin hex to this one.
   * @returns {HexDistance} - A vector pointing from hex1 to hex2
   */
  public distance_from_origin(): HexDistance {
    return new HexDistance(this.q, this.r);
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
   * @param {HexDirection} [direction] - An index identifying the direction. Indices start at 0 indicating north-east (horizontal orientation) or east (vertical orientation).
   * @param {number} [number] - The number of steps to take.
   * @returns {HexPosition} - The vector after stepping.
   * @throws if an invalid axis number is found.
   */
  public step_in_direction(
    direction: HexDirection,
    steps: number = 1,
    layout: HexLayout = HexLayout.Horizontal,
  ): HexPosition {
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
   * @returns {HexPosition} - The vector after rotation.
   * @throws if the number of sector rotations is not integral.
   */
  public wedge_rotation(n: number): HexPosition {
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
   * @returns {HexPosition} - The vector after rotation.
   * @throws if the number of steps is not integral.
   */
  public step_rotation(n: number) {
    if (!Number.isInteger(n)) {
      throw new Error('Number of steps must be integral.');
    }
    if (n === 0) return;
    const hexes_per_sector = this.distance_from_origin().manhattan();
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

  /** Rotates counter clockwise until either a corner is reached or max_steps
   * steps has been taken */
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
