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

/**
 * Enum of all possible directions.
 */
export enum HexDirection {
  E,
  NE,
  N,
  NW,
  W,
  SW,
  S,
  SE,
}

function wedge_edge_direction(wedge: HexDirection): HexDirection {
  switch (wedge) {
    case HexDirection.SE:
      return HexDirection.NE;
    case HexDirection.E:
      return HexDirection.N;
    case HexDirection.NE:
      return HexDirection.NW;
    case HexDirection.NW:
      return HexDirection.SW;
    case HexDirection.W:
      return HexDirection.S;
    case HexDirection.SW:
      return HexDirection.SE;
    default:
      throw new Error('Invalid horizontal wedge.');
  }
}

function horizontal_direction_to_hex_distance(
  direction: HexDirection,
): HexDistance {
  switch (direction) {
    case HexDirection.NE:
      return new HexDistance(1, 0);
    case HexDirection.N:
      return new HexDistance(0, 1);
    case HexDirection.NW:
      return new HexDistance(-1, 1);
    case HexDirection.SW:
      return new HexDistance(-1, 0);
    case HexDirection.S:
      return new HexDistance(0, -1);
    case HexDirection.SE:
      return new HexDistance(1, -1);
    default:
      throw new Error('Invalid horizontal direction');
  }
}

function vertical_direction_to_hex_distance(
  direction: HexDirection,
): HexDistance {
  switch (direction) {
    case HexDirection.E:
      return new HexDistance(1, -1);
    case HexDirection.NE:
      return new HexDistance(1, 0);
    case HexDirection.NW:
      return new HexDistance(0, 1);
    case HexDirection.W:
      return new HexDistance(-1, 1);
    case HexDirection.SW:
      return new HexDistance(-1, 0);
    case HexDirection.SE:
      return new HexDistance(0, -1);
    default:
      throw new Error('Invalid vertical direction');
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

  /**
   * Compares hexes by value.
   * @param hex - the other hex.
   * @returns - true if the coordinates are equal, false otherwise.
   */
  public equals(hex: HexGeneric): boolean {
    return this.q === hex.q && this.r === hex.r;
  }
}

/**
 * Coordinates pointing to a hex in a hex grid.
 */
export class HexCoordinates extends HexGeneric {
  public constructor(q: number, r: number) {
    super(q, r);
  }

  /**
   * @returns {HexCoordinates} - A new identical VectorHex.
   */
  public clone(): HexCoordinates {
    return new HexCoordinates(this.q, this.r);
  }

  /**
   * @param {Vector2DLike} vec - Any object with a x- and y-coordinate.
   * @returns {HexCoordinates} - Hex coordinates of the hex that (x,y) is inside.
   * @throws if an invalid hex grid orientation is supplied.
   */
  public static from_vector2D(
    vec: Vector2DLike,
    orientation: HexLayout = HexLayout.Horizontal,
    size = 1,
  ): HexCoordinates {
    let vec_horizontal = new Vector2D(vec.x / size, vec.y / size);
    if (orientation === HexLayout.Vertical) {
      vec_horizontal = from_vertical_into_horizontal_vector2d(vec_horizontal);
    }
    const fractional_q = vec_horizontal.x / sqrt3over2;
    const fractional_r = vec_horizontal.y - 0.5 * fractional_q;
    return HexCoordinates.from_fractional_coordinates(
      fractional_q,
      fractional_r,
    );
  }

  private static from_fractional_coordinates(
    fractional_q: number,
    fractional_r: number,
  ): HexCoordinates {
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
    return new HexCoordinates(q, r);
  }

  /**
   * @param {HexDistance} [translation] - How far to move the hex.
   * @returns {HexCoordinates} - The hex after translation.
   */
  public translate(translation: HexDistance): HexCoordinates {
    this.q += translation.q;
    this.r += translation.r;
    return this;
  }

  /**
   * Returns a new hex, translated a distance from the original hex.
   * @param {HexCoordinates} [center] - A distance.
   * @param {HexDistance} [translation] - Another distance.
   * @returns {HexCoordinates} - A new translated hex.
   */
  public static translate(
    center: HexCoordinates,
    translation: HexDistance,
  ): HexCoordinates {
    return center.clone().translate(translation);
  }

  /**
   * Calculates vector pointing from this hex to another hex.
   * @param {HexCoordinates} [hex] - The other hex.
   * @returns {HexDistance} - A vector pointing from this hex to the other.
   */
  public distance_to(hex: HexCoordinates): HexDistance {
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
  private wedge(): HexDirection {
    let hex_wedge;
    if (
      Math.abs(this.q) >= Math.abs(this.r) &&
      Math.abs(this.q) > Math.abs(this.s())
    ) {
      hex_wedge = this.q >= 0 ? HexDirection.E : HexDirection.W;
    } else if (Math.abs(this.r) >= Math.abs(this.s())) {
      hex_wedge = this.r > 0 ? HexDirection.NW : HexDirection.SE;
    } else {
      hex_wedge = this.s() > 0 ? HexDirection.SW : HexDirection.NE;
    }
    return hex_wedge;
  }

  /**
   * Rotates the hex around the origin n times 60 degrees counter clockwise.
   * @param {number} [n] - The number of 60 degree rotations (can be negative).
   * @returns {HexCoordinates} - The hex after rotation.
   * @throws if the number of sector rotations is not integral.
   */
  public hex_sector_rotation(n: number): HexCoordinates {
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
   * @returns {HexCoordinates} - The vector after rotation.
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
    this.hex_sector_rotation(sector_rotations);
    n -= sector_rotations * hexes_per_sector;
    this.translate(
      horizontal_direction_to_hex_distance(
        wedge_edge_direction(this.wedge()),
      ).multiply(n),
    );
  }

  /** Rotates counter clockwise until either a corner is reached or max_steps
   * steps has been taken */
  private rotate_to_corner(max_steps: number): number {
    // Rotate hex wise until a corner is reached
    const direction = wedge_edge_direction(this.wedge());
    let steps_taken: number = 0;
    switch (direction) {
      case HexDirection.NE:
      case HexDirection.SW:
        steps_taken = Math.min(Math.abs(this.s()), max_steps);
        break;
      case HexDirection.N:
      case HexDirection.S:
        steps_taken = Math.min(Math.abs(this.r), max_steps);
        break;
      case HexDirection.NW:
      case HexDirection.SE:
        steps_taken = Math.min(Math.abs(this.q), max_steps);
        break;
    }
    this.translate(
      horizontal_direction_to_hex_distance(direction).multiply(steps_taken),
    );
    return steps_taken;
  }
}

/**
 * A vector pointing from one hex to another.
 */
export class HexDistance extends HexGeneric {
  /**
   * @param {HexCoordinates} [vec1] - Starting hex.
   * @param {HexCoordinates} [vec2] - Ending hex.
   * @returns {HexDistance} - A vector pointing from hex1 to hex2
   */
  public constructor(q: number, r: number);
  public constructor(vec1: HexCoordinates, vec2: HexCoordinates);
  public constructor(
    arg1: HexCoordinates | number,
    arg2: HexCoordinates | number,
  ) {
    if (arg1 instanceof HexCoordinates && arg2 instanceof HexCoordinates) {
      super(arg2.q - arg1.q, arg2.r - arg1.r);
    } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      super(arg1, arg2);
    }
  }

  /** One step in all possible directions in a hex grid. */
  public static readonly ALL_UNIT_DISTANCES: HexDistance[] = [
    horizontal_direction_to_hex_distance(HexDirection.NE),
    horizontal_direction_to_hex_distance(HexDirection.N),
    horizontal_direction_to_hex_distance(HexDirection.NW),
    horizontal_direction_to_hex_distance(HexDirection.SW),
    horizontal_direction_to_hex_distance(HexDirection.S),
    horizontal_direction_to_hex_distance(HexDirection.SE),
  ];

  /**
   * @returns {HexDistance} - A new identical VectorHex.
   */
  public clone(): HexDistance {
    return new HexDistance(this.q, this.r);
  }

  /**
   * @param direction - A direction on the hex grid.
   * @param layout - The orientation of the hex grid.
   * @returns a distance of one hex corresponding to the direction.
   * @throws if the direction is invalid.
   */
  public static from_direction(
    direction: HexDirection,
    layout: HexLayout,
  ): HexDistance {
    if (layout === HexLayout.Vertical) {
      return vertical_direction_to_hex_distance(direction);
    }
    return horizontal_direction_to_hex_distance(direction);
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
   * @param {HexDistance} dist - Distance to negate.
   * @returns - minus the distance.
   */
  public static neg(dist: HexDistance): HexDistance {
    return new HexDistance(-dist.q, -dist.r);
  }

  /**
   * @returns {HexDistance} - The distance after negation.
   */
  public neg(): HexDistance {
    this.q = -this.q;
    this.r = -this.r;
    return this;
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
   * Multiplies a distance by a factor.
   * @param {HexDistance} [distance] - The distance to multiply.
   * @param {number} [factor] - The factor to multiply the distance by.
   * @returns {HexDistance} - A new distance.
   */
  public static multiply(distance: HexDistance, factor: number): HexDistance {
    if (!Number.isInteger(factor)) {
      throw new Error('Factor must be integral.');
    }
    return new HexDistance(distance.q * factor, distance.r * factor);
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
   * @returns {HexCoordinates} - The vector after the addition.
   */
  public add(distance: HexDistance): HexDistance {
    this.q += distance.q;
    this.r += distance.r;
    return this;
  }

  /**
   * Subtracts another distance from the vector.
   * @param {HexDistance} [distance] - Distance to add.
   * @returns {HexCoordinates} - The vector after the addition.
   */
  public subtract(distance: HexDistance): HexDistance {
    this.q -= distance.q;
    this.r -= distance.r;
    return this;
  }

  /**
   * Multiplies the distance by a factor.
   * @param {number} [factor] - The factor to multiply the distance by.
   * @returns {HexDistance} - The distance after multiplication.
   */
  public multiply(factor: number): HexDistance {
    if (!Number.isInteger(factor)) {
      throw new Error('Factor must be integral.');
    }
    this.q *= factor;
    this.r *= factor;
    return this;
  }

  /**
   * @returns {number} - The number of steps needed to traverse the represented distance.
   */
  public manhattan(): number {
    return Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.s()));
  }
}
