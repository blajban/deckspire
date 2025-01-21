import { HexCoordinates } from "./HexVectors";

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
}
