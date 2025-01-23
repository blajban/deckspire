import HexGrid, { VerticalLayout } from '../../../src/math/hexgrid/HexGrid';
import {
  HexCoordinates,
  HexDistance,
} from '../../../src/math/hexgrid/HexVectors';

const FLOAT_DIGITS: number = 8;

describe('HexGrid boundaries', () => {
  it('should create an finite grid with a max radius', () => {
    const grid = new HexGrid(9);
    expect(grid.is_hex_in_grid(new HexCoordinates(0, 0))).toBe(true);
    expect(grid.is_hex_in_grid(new HexCoordinates(1, 1))).toBe(true);
    expect(grid.is_hex_in_grid(new HexCoordinates(-1, -1))).toBe(true);
    expect(grid.is_hex_in_grid(new HexCoordinates(10, 0))).toBe(false);
  });

  it('should create a finite grid with the given constraints.', () => {
    const grid = new HexGrid(9);
    grid.add_constraint((hex) => hex.q >= 0 && hex.r >= 0);
    expect(grid.is_hex_in_grid(new HexCoordinates(0, 0))).toBe(true);
    expect(grid.is_hex_in_grid(new HexCoordinates(1, 1))).toBe(true);
    expect(grid.is_hex_in_grid(new HexCoordinates(-1, -1))).toBe(false);
  });

  it('should find out if the hex is in the grid', () => {
    const grid = new HexGrid(9);
    grid.add_constraint((hex) => hex.q != 0);
    expect(grid.is_hex_in_grid(new HexCoordinates(0, 0))).toBe(false);
    expect(grid.is_hex_in_grid(new HexCoordinates(0, 1))).toBe(false);
    expect(grid.is_hex_in_grid(new HexCoordinates(1, 1))).toBe(true);
    expect(grid.is_hex_in_grid(new HexCoordinates(-1, -1))).toBe(true);
  });
});

describe('Conversions to and from Vector2D', () => {
  test('HexCoordinates from Vector2D', () => {
    const horizontal_grid = new HexGrid(9);
    let vec;
    vec = horizontal_grid.hex_coordinates_from_vector2d({ x: 0, y: 0 });
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(0);
    vec = horizontal_grid.hex_coordinates_from_vector2d({ x: 0.5, y: 0.5 });
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(0);
    vec = horizontal_grid.hex_coordinates_from_vector2d({ x: -0.5, y: -0.5 });
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(0);
    vec = horizontal_grid.hex_coordinates_from_vector2d({ x: -0.5, y: 0.5 });
    expect(vec.q).toBe(-1);
    expect(vec.r).toBe(1);
    vec = horizontal_grid.hex_coordinates_from_vector2d({ x: 0.5, y: -0.5 });
    expect(vec.q).toBe(1);
    expect(vec.r).toBe(-1);
    vec = horizontal_grid.hex_coordinates_from_vector2d({
      x: (1 / Math.sqrt(3)) * Math.cos(Math.PI / 3) - 0.001,
      y: (1 / Math.sqrt(3)) * Math.sin(Math.PI / 3) + 0.001,
    });
    expect(vec.q).toBe(0);
    expect(vec.r).toBe(1);
    vec = horizontal_grid.hex_coordinates_from_vector2d({
      x: 1.001 * 0.5 * Math.cos(Math.PI / 6),
      y: 1.001 * 0.5 * Math.sin(Math.PI / 6),
    });
    expect(vec.q === 1).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
    vec = horizontal_grid.hex_coordinates_from_vector2d({
      x: 0.999 * 0.5 * Math.cos(Math.PI / 6),
      y: 0.999 * 0.5 * Math.sin(Math.PI / 6),
    });
    expect(vec.q === 0).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
    vec = horizontal_grid.hex_coordinates_from_vector2d({
      x: 2 * Math.cos(Math.PI / 3),
      y: 2 * Math.sin(Math.PI / 3),
    });
    expect(vec.q === 1).toBeTruthy();
    expect(vec.r === 1).toBeTruthy();
    const vertical_grid = new HexGrid(9, VerticalLayout);
    vec = vertical_grid.hex_coordinates_from_vector2d({
      x: 2 * Math.cos(Math.PI / 3),
      y: 2 * Math.sin(Math.PI / 3),
    });
    expect(vec.q === 2).toBeTruthy();
    expect(vec.r === 0).toBeTruthy();
  });
  test('HexDistance in horizontal layout into Vector2D', () => {
    const grid = new HexGrid(9);
    let vec;
    vec = grid.vector2d_from_hex_distance(new HexDistance(0, 0));
    expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(1, 0));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(0, 1));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(-1, 1));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5, FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(-1, 0));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(0, -1));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-1, FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(1, -1));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5, FLOAT_DIGITS);
  });
  test('HexDistance in vertical layout into Vector2D', () => {
    const grid = new HexGrid(9, VerticalLayout);
    let vec;
    vec = grid.vector2d_from_hex_distance(new HexDistance(0, 0));
    expect(vec.length()).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(1, 0));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(0, 1));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(-1, 1));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(-1, 0));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(-0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(0, -1));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(0.5, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(-0.5 * Math.sqrt(3), FLOAT_DIGITS);
    vec = grid.vector2d_from_hex_distance(new HexDistance(1, -1));
    expect(vec.length()).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(0, FLOAT_DIGITS);
  });
  test('HexDistance to Vector2D with scaling', () => {
    const horizontal_grid = new HexGrid(9);
    expect(() =>
      horizontal_grid.vector2d_from_hex_distance(new HexDistance(0, 0), 0),
    ).toThrow('Hex size must be positive.');
    let vec;
    vec = horizontal_grid.vector2d_from_hex_distance(new HexDistance(1, 0), 2);
    expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(1, FLOAT_DIGITS);
    let vertical_grid = new HexGrid(9, VerticalLayout);
    vec = vertical_grid.vector2d_from_hex_distance(new HexDistance(1, 0), 2);
    expect(vec.length()).toBeCloseTo(2, FLOAT_DIGITS);
    expect(vec.x).toBeCloseTo(1, FLOAT_DIGITS);
    expect(vec.y).toBeCloseTo(Math.sqrt(3), FLOAT_DIGITS);
  });
});

describe('Find hexes in grid', () => {
  it('should find hexes within radius', () => {
    const grid = new HexGrid(9);
    const center = new HexCoordinates(0, 0);
    const range = 1;
    const hexes = grid.hexes_within_manhattan_radius(center, range);
    expect(hexes.length).toBe(7);
  });

  it('should find non-excluded hexes within radius', () => {
    const grid = new HexGrid(3);
    grid.add_constraint((hex) => hex.q != 1 || hex.r != 1);
    const center = new HexCoordinates(2, 0);
    const range = 2;
    const hexes = grid.hexes_within_manhattan_radius(center, range);
    expect(hexes.length).toBe(13);
    expect(grid.all_hexes().length).toBe(36);
  });

  it('should find hexes within radius in a finite grid', () => {
    const grid = new HexGrid(9);
    grid.add_constraint((hex) => hex.q >= 0 && hex.r >= 0);
    const center = new HexCoordinates(0, 0);
    const range = 1;
    const hexes = grid.hexes_within_manhattan_radius(center, range);
    expect(hexes.length).toBe(3);
  });
  it('should find hexes within steps', () => {
    const grid = new HexGrid(9);
    const center = new HexCoordinates(0, 0);
    const range = 1;
    const hexes = grid.hexes_within_steps(center, range);
    expect(hexes.length).toBe(7);
  });

  it('should find non-excluded hexes within steps', () => {
    const grid = new HexGrid(9);
    grid.add_constraint((hex) => hex.q != 0 || hex.r != 1);
    const center = new HexCoordinates(0, 0);
    const range = 2;
    const hexes = grid.hexes_within_steps(center, range);
    expect(hexes.length).toBe(17);
  });

  it('should find hexes within steps in a finite grid', () => {
    const grid = new HexGrid(9);
    grid.add_constraint((hex) => hex.q >= 0 && hex.r >= 0);
    const center = new HexCoordinates(0, 0);
    const range = 2;
    const hexes = grid.hexes_within_steps(center, range);
    expect(hexes.length).toBe(6);
  });
});
