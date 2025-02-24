import { HexDistance, HexCoordinates } from './HexVectors';
import Vector2D, { Vector2dLike } from '../Vector2D';

const sqrt3over2 = 0.5 * Math.sqrt(3);

export type HexGridConstraint = (hex: HexCoordinates) => boolean;

/** One step in all possible directions in a horizontal hex grid. */
export class HorizontalLayout {
  /* eslint-disable @typescript-eslint/naming-convention */
  public static readonly NE = new HexDistance(1, 0);
  public static readonly N = new HexDistance(0, 1);
  public static readonly NW = new HexDistance(-1, 1);
  public static readonly SW = new HexDistance(-1, 0);
  public static readonly S = new HexDistance(0, -1);
  public static readonly SE = new HexDistance(1, -1);
  /* eslint-enable @typescript-eslint/naming-convention */
}
/** One step in all possible directions in a vertical hex grid. */
export class VerticalLayout {
  /* eslint-disable @typescript-eslint/naming-convention */
  public static readonly E = new HexDistance(1, -1);
  public static readonly NE = new HexDistance(1, 0);
  public static readonly NW = new HexDistance(0, 1);
  public static readonly S = new HexDistance(-1, 1);
  public static readonly SW = new HexDistance(-1, 0);
  public static readonly SE = new HexDistance(0, -1);
  /* eslint-enable @typescript-eslint/naming-convention */
}

export default class HexGrid {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public readonly ALL_UNIT_DISTANCES = [
    HorizontalLayout.NE,
    HorizontalLayout.N,
    HorizontalLayout.NW,
    HorizontalLayout.SW,
    HorizontalLayout.S,
    HorizontalLayout.SE,
  ];

  private _constraints: HexGridConstraint[] = [];
  private _max_radius: number;
  private _hex_size: number = 0; // Will be set in ctor.
  private _layout: HorizontalLayout | VerticalLayout;

  /**
   * Represents a hex grid.
   * @param {number} max_radius - The maximum Manhattan radius of the grid.
   * @param {number} hex_size - The distance between two adjacent hexes.
   * @param {HorizontalLayout | VerticalLayout} [layout=HorizontalLayout] - The orientation of the hex grid.
   */
  constructor(
    max_radius: number,
    hex_size: number,
    layout: HorizontalLayout | VerticalLayout = HorizontalLayout,
  ) {
    this._max_radius = max_radius;
    this._layout = layout;
    this.size = hex_size;
  }

  public get size(): number {
    return this._hex_size;
  }

  public set size(hex_size: number) {
    if (hex_size <= 0) {
      throw new Error('Hex size must be positive.');
    }
    this._hex_size = hex_size;
  }

  /**
   * Eliminates any hex from the grid, for which the grid constraint returns false.
   * @param grid_guard - A function that returns true if a hex is part of the grid.
   */
  public addConstraint(constraint: HexGridConstraint): void {
    this._constraints.push(constraint);
  }

  /**
   * Checks whether a hex is in the grid.
   * @param hex
   * @returns true if the hex coordinates is part of the grid.
   */
  public isHexInGrid(hex: HexCoordinates): boolean {
    if (hex.distanceFromOrigin().manhattan() > this._max_radius) {
      return false;
    }
    for (const constraint of this._constraints) {
      if (!constraint(hex)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {Vector2dLike} vec - Vector pointing from the origin.
   * @param {number} [scale=1] - The distance between two adjacent hexes.
   * @returns {HexCoordinates} - Hex coordinates of the hex that (x,y) is inside.
   * @throws if an invalid hex grid orientation is supplied.
   */
  public hexCoordinatesFromVector2D(vec: Vector2dLike): HexCoordinates {
    let vec2d = new Vector2D(vec.x / this._hex_size, vec.y / this._hex_size);

    if (this._layout === VerticalLayout) {
      vec2d = new Vector2D(
        sqrt3over2 * vec2d.x + 0.5 * vec2d.y,
        -0.5 * vec2d.x + sqrt3over2 * vec2d.y,
      );
    }
    const fractional_q = vec2d.x / sqrt3over2;
    const fractional_r = vec2d.y - 0.5 * fractional_q;
    return HexCoordinates.fromFractionalCoordinates(fractional_q, fractional_r);
  }

  /**
   * Calculates a normal vector from a distance given in hex coordinates
   * @param {HexDistance} distance - Distance in hex coordinates.
   * @param {number} [scale=1] - The distance between two adjacent hexes.
   * @returns {Vector2D} - A vector pointing from the origin to the center of the hex.
   * @throws if the size is not positive or an invalid orientation is supplied.
   */
  public vector2dFromHexDistance(distance: HexDistance): Vector2D {
    let vec2d = new Vector2D(
      this._hex_size * sqrt3over2 * distance.q,
      this._hex_size * (0.5 * distance.q + distance.r),
    );
    if (this._layout === VerticalLayout) {
      vec2d = new Vector2D(
        sqrt3over2 * vec2d.x - 0.5 * vec2d.y,
        0.5 * vec2d.x + sqrt3over2 * vec2d.y,
      );
    }
    return vec2d;
  }

  /**
   * Returns all hexes in the grid.
   * @returns an array of all hexes in the grid.
   */
  public get all_hexes(): HexCoordinates[] {
    return this.hexesWithinManhattanRadius(
      new HexCoordinates(0, 0),
      this._max_radius,
    );
  }

  /**
   * Returns the hexes within a manhattan radius.
   * @param center - the hex from which to measure the radius.
   * @param range - the manhattan radius.
   * @returns an array of hexes within the manhattan radius.
   */
  public hexesWithinManhattanRadius(
    center: HexCoordinates,
    range: number,
  ): HexCoordinates[] {
    const results: HexCoordinates[] = [];
    for (let dq = -range; dq <= range; dq++) {
      for (
        let dr = Math.max(-range, -range - dq);
        dr <= Math.min(range, range - dq);
        dr++
      ) {
        const hex = HexCoordinates.translate(center, new HexDistance(dq, dr));
        if (this.isHexInGrid(hex)) {
          results.push(hex);
        }
      }
    }
    return results;
  }

  /**
   * Return all hexes reachable within a number of steps including the starting hex.
   * @param center - the starting coordinates.
   * @param steps - How many steps to take.
   * @returns an array of hexes within the step limit.
   */
  public hexesWithinSteps(
    center: HexCoordinates,
    steps: number,
  ): HexCoordinates[] {
    steps = Math.trunc(steps);
    const results: HexCoordinates[] = [center.clone()];
    const visited: HexCoordinates[] = [center];
    const path_heads: HexCoordinates[][] = [];
    path_heads.push([center]);
    while (steps-- > 0) {
      path_heads.push([]);
      for (const path_head of path_heads[path_heads.length - 2]) {
        for (const direction of this.ALL_UNIT_DISTANCES) {
          const hex = HexCoordinates.translate(path_head, direction);
          if (visited.some((h) => h.equals(hex))) {
            continue;
          }
          visited.push(hex);
          if (this.isHexInGrid(hex)) {
            path_heads[path_heads.length - 1].push(hex);
            results.push(hex);
          }
        }
      }
    }
    return results;
  }
}
