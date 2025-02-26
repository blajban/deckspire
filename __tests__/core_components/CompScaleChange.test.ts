import CompScaleChange from '../../src/engine/core_components/CompScaleChange';
import Vector2D from '../../src/math/Vector2D';

describe('CompScaleChange', () => {
  let comp_scale_change: CompScaleChange;

  beforeEach(() => {
    comp_scale_change = new CompScaleChange(
      3000,
      new Vector2D(1.0, 1.0),
      new Vector2D(2.0, 2.0),
      true,
    );
  });

  test('should initialize with correct values', () => {
    expect(comp_scale_change.duration).toBe(3000);
    expect(comp_scale_change.start_value.x).toBe(1.0);
    expect(comp_scale_change.start_value.y).toBe(1.0);
    expect(comp_scale_change.end_value.x).toBe(2.0);
    expect(comp_scale_change.end_value.x).toBe(2.0);
    expect(comp_scale_change.should_loop).toBe(true);
    expect(comp_scale_change.elapsed).toBe(0);
  });
});
