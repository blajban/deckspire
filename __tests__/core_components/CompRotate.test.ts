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
  });

  test('should initialize elapsed time to zero', () => {
    expect(comp_rotate.elapsed).toBe(0);
  });

  test('should update elapsed time', () => {
    comp_rotate.elapsed += 100;
    expect(comp_rotate.elapsed).toBe(100);
  });

  test('should toggle playing state', () => {
    comp_rotate.is_playing = false;
    expect(comp_rotate.is_playing).toBe(false);

    comp_rotate.is_playing = true;
    expect(comp_rotate.is_playing).toBe(true);
  });

  test('should toggle loop state', () => {
    comp_rotate.should_loop = false;
    expect(comp_rotate.should_loop).toBe(false);

    comp_rotate.should_loop = true;
    expect(comp_rotate.should_loop).toBe(true);
  });
});
