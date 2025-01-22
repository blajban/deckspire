import { HexDistance, HexDirection, HexCoordinates } from './HexVectors';

export type HexGridGuard = (hex: HexCoordinates) => boolean;

export default class HexGrid{
  /**
   * Represents a hex grid.
   * @param grid_guard - A function that returns true if a hex is part of the grid. Default is an infinite grid.
   */
  constructor(
    public grid_guard: HexGridGuard = (hex: HexCoordinates) => true,
  ) {}

  public is_hex_in_grid(hex: HexCoordinates): boolean {
    return this.grid_guard(hex);
  }

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
