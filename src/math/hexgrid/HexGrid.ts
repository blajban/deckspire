export type HexGridGuard = (q: number, r: number) => boolean;

export class HexGrid{
  /**
   * Represents a hex grid.
   * @param boundaries - A function that returns true if a hex is part of the grid. Default is an infinite grid.
   */
  constructor(
    public boundaries: HexGridGuard = (q: number, r: number) => true,
  ) {}
}
