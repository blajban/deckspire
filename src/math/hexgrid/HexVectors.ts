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

  public static fromFractionalCoordinates(
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
  public distanceTo(hex: HexCoordinates): HexDistance {
    return new HexDistance(hex.q - this.q, hex.r - this.r);
  }

  /**
   * Calculates vector pointing from the origin hex to this one.
   * @returns {HexDistance} - A vector pointing from hex1 to hex2
   */
  public distanceFromOrigin(): HexDistance {
    return new HexDistance(this.q, this.r);
  }
  /**
   * Which direction does the current wedge's edge go in?
   * @returns {[HexDistance, number]} - The direction of the wedge edge and how many steps are left to reach the next corner counter clockwise.
   */
  private _wedgeEdge(): [HexDistance, number] {
    let hex_wedge;
    let steps_left_to_corner;
    if (
      Math.abs(this.q) >= Math.abs(this.r) &&
      Math.abs(this.q) > Math.abs(this.s())
    ) {
      hex_wedge = this.q >= 0 ? new HexDistance(0, 1) : new HexDistance(0, -1);
      steps_left_to_corner = Math.abs(this.r);
    } else if (Math.abs(this.r) >= Math.abs(this.s())) {
      hex_wedge = this.r > 0 ? new HexDistance(-1, 0) : new HexDistance(1, 0);
      steps_left_to_corner = Math.abs(this.s());
    } else {
      hex_wedge =
        this.s() > 0 ? new HexDistance(1, -1) : new HexDistance(-1, 1);
      steps_left_to_corner = Math.abs(this.q);
    }
    return [hex_wedge, steps_left_to_corner];
  }

  /**
   * Rotates the hex around the origin n times 60 degrees counter clockwise.
   * @param {number} [n] - The number of 60 degree rotations (can be negative).
   * @returns {HexCoordinates} - The hex after rotation.
   * @throws if the number of sector rotations is not integral.
   */
  public hexSectorRotation(n: number): HexCoordinates {
    if (!Number.isInteger(n)) {
      throw new Error('Number of wedges must be integral.');
    }
    n %= 6;
    if (n === 0) {
      return this;
    }
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
  public stepRotation(n: number): HexCoordinates {
    if (!Number.isInteger(n)) {
      throw new Error('Number of steps must be integral.');
    }
    if (n === 0) {
      return this;
    }
    const hexes_per_sector = this.distanceFromOrigin().manhattan();
    if (hexes_per_sector === 0) {
      return this;
    }
    const circumference = 6 * hexes_per_sector;
    n %= circumference;
    n = n < 0 ? n + circumference : n; // 0 <= n < circumference
    n -= this._rotateToCorner(n);
    const sector_rotations = Math.trunc(n / hexes_per_sector);
    this.hexSectorRotation(sector_rotations);
    n -= sector_rotations * hexes_per_sector;
    const [wedge_edge, _steps] = this._wedgeEdge();
    this.translate(wedge_edge.multiply(n));
    return this;
  }

  /** Rotates counter clockwise until either a corner is reached or max_steps
   * steps has been taken */
  private _rotateToCorner(max_steps: number): number {
    // Rotate hex wise until a corner is reached
    const [direction, steps_left_to_corner] = this._wedgeEdge();
    const steps = Math.min(max_steps, steps_left_to_corner);
    direction.multiply(steps);
    this.translate(direction);
    return steps;
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

  /**
   * @returns {HexDistance} - A new identical VectorHex.
   */
  public clone(): HexDistance {
    return new HexDistance(this.q, this.r);
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
