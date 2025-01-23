import { HexDistance, HexCoordinates } from './HexVectors';
import Vector2D, { Vector2DLike } from '../Vector2D';

const sqrt3over2 = 0.5 * Math.sqrt(3);

export type HexGridConstraint = (hex: HexCoordinates) => boolean;

/** One step in all possible directions in a horizontal hex grid. */
export class HorizontalLayout {
  public static readonly NE = new HexDistance(1, 0);
  public static readonly N = new HexDistance(0, 1);
  public static readonly NW = new HexDistance(-1, 1);
  public static readonly SW = new HexDistance(-1, 0);
  public static readonly S = new HexDistance(0, -1);
  public static readonly SE = new HexDistance(1, -1);
}
/** One step in all possible directions in a vertical hex grid. */
export class VerticalLayout {
  public static readonly E = new HexDistance(1, -1);
  public static readonly NE = new HexDistance(1, 0);
  public static readonly NW = new HexDistance(0, 1);
  public static readonly S = new HexDistance(-1, 1);
  public static readonly SW = new HexDistance(-1, 0);
  public static readonly SE = new HexDistance(0, -1);
}

export default class HexGrid {
  public readonly ALL_UNIT_DISTANCES = [
    HorizontalLayout.NE,
    HorizontalLayout.N,
    HorizontalLayout.NW,
    HorizontalLayout.SW,
    HorizontalLayout.S,
    HorizontalLayout.SE,
  ];

  private constraints: HexGridConstraint[] = [];

  /**
   * Represents a hex grid.
   * @param {number} max_radius - The maximum Manhattan radius of the grid.
   * @param {HorizontalLayout | VerticalLayout} [layout=HorizontalLayout] - The orientation of the hex grid.
   */
  constructor(
    public max_radius: number,
    public layout: HorizontalLayout | VerticalLayout = HorizontalLayout,
  ) {}

  /**
   * Eliminates any hex from the grid, for which the grid constraint returns false.
   * @param grid_guard - A function that returns true if a hex is part of the grid.
   */
  public add_constraint(constraint: HexGridConstraint) {
    this.constraints.push(constraint);
  }

  /**
   * Checks whether a hex is in the grid.
   * @param hex
   * @returns true if the hex coordinates is part of the grid.
   */
  public is_hex_in_grid(hex: HexCoordinates): boolean {
    if (hex.distance_from_origin().manhattan() > this.max_radius) {
      return false;
    }
    for( let constraint of this.constraints) {
      if (!constraint(hex)) {
        return false;
      }
    };
    return true;
  }

  /**
   * @param {Vector2DLike} vec - Vector pointing from the origin.
   * @param {number} [scale=1] - The distance between two adjacent hexes.
   * @returns {HexCoordinates} - Hex coordinates of the hex that (x,y) is inside.
   * @throws if an invalid hex grid orientation is supplied.
   */
  public hex_coordinates_from_vector2d(
    vec: Vector2DLike,
    scale = 1,
  ): HexCoordinates {
    let vec2d = new Vector2D(vec.x / scale, vec.y / scale);

    if (this.layout === VerticalLayout) {
      vec2d = new Vector2D(
        sqrt3over2 * vec2d.x + 0.5 * vec2d.y,
        -0.5 * vec2d.x + sqrt3over2 * vec2d.y,
      );
    }
    const fractional_q = vec2d.x / sqrt3over2;
    const fractional_r = vec2d.y - 0.5 * fractional_q;
    return HexCoordinates.from_fractional_coordinates(
      fractional_q,
      fractional_r,
    );
  }

  /**
   * Calculates a normal vector from a distance given in hex coordinates
   * @param {HexDistance} distance - Distance in hex coordinates.
   * @param {number} [scale=1] - The distance between two adjacent hexes.
   * @returns {Vector2D} - A vector pointing from the origin to the center of the hex.
   * @throws if the size is not positive or an invalid orientation is supplied.
   */
  public vector2d_from_hex_distance(
    distance: HexDistance,
    scale: number = 1,
  ): Vector2D {
    if (scale <= 0) {
      throw new Error('Hex size must be positive.');
    }
    let vec2d = new Vector2D(
      scale * sqrt3over2 * distance.q,
      scale * (0.5 * distance.q + distance.r),
    );
    if (this.layout === VerticalLayout) {
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
  public all_hexes(): HexCoordinates[]{
    return this.hexes_within_manhattan_radius(new HexCoordinates(0, 0), this.max_radius);
  }

  /**
   * Returns the hexes within a manhattan radius.
   * @param center - the hex from which to measure the radius.
   * @param range - the manhattan radius.
   * @returns an array of hexes within the manhattan radius.
   */
  public hexes_within_manhattan_radius(
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
        let hex = HexCoordinates.translate(center, new HexDistance(dq, dr));
        if (this.is_hex_in_grid(hex)) {
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
  public hexes_within_steps(
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
          let hex = HexCoordinates.translate(path_head, direction);
          if (visited.some((h) => h.equals(hex))) {
            continue;
          }
          visited.push(hex);
          if (this.is_hex_in_grid(hex)) {
            path_heads[path_heads.length - 1].push(hex);
            results.push(hex);
          }
        }
      }
    }
    return results;
  }
}
