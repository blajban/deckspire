import CompRotate from '../../src/engine/core_components/CompRotate';

describe('CompRotate', () => {
  let comp_rotate: CompRotate;

  beforeEach(() => {
    comp_rotate = new CompRotate(3000, 0, Math.PI, true, true);
  });

  test('should initialize with correct values', () => {
    expect(comp_rotate.duration).toBe(3000);
    expect(comp_rotate.start_value).toBe(0);
    expect(comp_rotate.end_value).toBe(Math.PI);
    expect(comp_rotate.should_loop).toBe(true);
    expect(comp_rotate.is_playing).toBe(true);
    expect(comp_rotate.elapsed).toBe(0);
  });
});
