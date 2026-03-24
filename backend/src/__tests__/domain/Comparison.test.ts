import { computeComparison } from '@core/domain/Comparison';

describe('computeComparison', () => {
  it('returns negative percentDiff and compliant=true when comparison < baseline', () => {
    const result = computeComparison(91.0, 88.0);
    expect(result.percentDiff).toBeCloseTo(-3.296, 2);
    expect(result.compliant).toBe(true);
  });

  it('returns positive percentDiff and compliant=false when comparison > target', () => {
    const result = computeComparison(91.0, 93.5);
    expect(result.percentDiff).toBeCloseTo(2.747, 2);
    expect(result.compliant).toBe(false);
  });

  it('throws when baseline is 0', () => {
    expect(() => computeComparison(0, 88.0)).toThrow();
  });

  it('marks R004 (89.2) as compliant since 89.2 <= 89.3368', () => {
    const result = computeComparison(91.0, 89.2);
    expect(result.compliant).toBe(true);
  });
});
