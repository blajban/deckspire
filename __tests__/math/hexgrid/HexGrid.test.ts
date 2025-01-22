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

describe('Find hexes in grid', () => {
  it('should find hexes within radius', () => {
    const grid = new HexGrid();
    const center = new HexCoordinates(0, 0);
    const range = 1;
    const hexes = grid.hexes_within_manhattan_radius(center, range);
    expect(hexes.length).toBe(7);
  });

  it('should find non-excluded hexes within radius', () => {
    const grid = new HexGrid((hex) => hex.q != 1 || hex.r != 1);
    const center = new HexCoordinates(2, 0);
    const range = 2;
    const hexes = grid.hexes_within_manhattan_radius(center, range);
    expect(hexes.length).toBe(18);
  });

  it('should find hexes within radius in a finite grid', () => {
    const grid = new HexGrid((hex) => hex.q >= 0 && hex.r >= 0);
    const center = new HexCoordinates(0, 0);
    const range = 1;
    const hexes = grid.hexes_within_manhattan_radius(center, range);
    expect(hexes.length).toBe(3);
  });
  it('should find hexes within steps', () => {
    const grid = new HexGrid();
    const center = new HexCoordinates(0, 0);
    const range = 1;
    const hexes = grid.hexes_within_steps(center, range);
    expect(hexes.length).toBe(7);
  });

  it('should find non-excluded hexes within steps', () => {
    const grid = new HexGrid((hex) => hex.q != 0 || hex.r != 1);
    const center = new HexCoordinates(0, 0);
    const range = 2;
    const hexes = grid.hexes_within_steps(center, range);
    expect(hexes.length).toBe(17);
  });

  it('should find hexes within steps in a finite grid', () => {
    const grid = new HexGrid((hex) => hex.q >= 0 && hex.r >= 0);
    const center = new HexCoordinates(0, 0);
    const range = 2;
    const hexes = grid.hexes_within_steps(center, range);
    expect(hexes.length).toBe(6);
  });
});
