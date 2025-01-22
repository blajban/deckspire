import { HexDistance, HexDirection, HexCoordinates } from './HexVectors';

export type HexGridGuard = (hex: HexCoordinates) => boolean;

export default class HexGrid {
  /**
   * Represents a hex grid.
   * @param grid_guard - A function that returns true if a hex is part of the grid. Default is an infinite grid.
   */
  constructor(
    public grid_guard: HexGridGuard = (hex: HexCoordinates) => true,
  ) {}

  /**
   * Checks whether a hex is in the grid.
   * @param hex
   * @returns true if the hex coordinates is part of the grid.
   */
  public is_hex_in_grid(hex: HexCoordinates): boolean {
    return this.grid_guard(hex);
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
        for (const direction of HexDistance.ALL_UNIT_DISTANCES) {
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
