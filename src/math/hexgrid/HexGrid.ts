import { HexDistance, HexDirection, HexCoordinates } from './HexVectors';

export type HexGridGuard = (hex: HexCoordinates) => boolean;

export class HexGrid{
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
}
