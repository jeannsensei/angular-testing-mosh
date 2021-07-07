import { compute } from './compute';

/**
 * describe // describe the suite
 * it //
 */

describe('compute', () => {
  it('should return 0 if input is negative', () => {
    const result = compute(-1);
    expect(result).toBe(0);
  });
  it('should increment the input if it is positive', () => {
    const result = compute(1);
    expect(result).toBe(2);
  });
});
