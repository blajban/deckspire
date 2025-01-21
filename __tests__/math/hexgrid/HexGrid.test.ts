import HexGrid from '../../../src/math/hexgrid/HexGrid';
import { HexCoordinates } from '../../../src/math/hexgrid/HexVectors';

describe('HexGrid boundaries', () => {
  it('should create an infinite grid by default', () => {
    const grid = new HexGrid();
    expect(grid.grid_guard(new HexCoordinates(0, 0))).toBe(true);
    expect(grid.grid_guard(new HexCoordinates(1, 1))).toBe(true);
    expect(grid.grid_guard(new HexCoordinates(-1, -1))).toBe(true);
  });

  it('should create a finite grid with the given boundaries', () => {
    const grid = new HexGrid((hex) => hex.q >= 0 && hex.r >= 0);
    expect(grid.grid_guard(new HexCoordinates(0, 0))).toBe(true);
    expect(grid.grid_guard(new HexCoordinates(1, 1))).toBe(true);
    expect(grid.grid_guard(new HexCoordinates(-1, -1))).toBe(false);
  });

  it('should find out if the hex is in the grid', () => {
    const grid = new HexGrid((hex) => hex.q != 0);
    expect(grid.is_hex_in_grid(new HexCoordinates(0, 0))).toBe(false);
    expect(grid.is_hex_in_grid(new HexCoordinates(0, 1))).toBe(false);
    expect(grid.is_hex_in_grid(new HexCoordinates(1, 1))).toBe(true);
    expect(grid.is_hex_in_grid(new HexCoordinates(-1, -1))).toBe(true);
  });
});
