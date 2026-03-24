import {
  computeCB,
  computeEnergyMj,
  TARGET_GHG_INTENSITY,
  LCV_MJ_PER_TONNE,
} from '@core/domain/Compliance';

describe('computeEnergyMj', () => {
  it('5000 tonnes * 41000 MJ/t = 205,000,000 MJ', () => {
    expect(computeEnergyMj(5000)).toBe(205_000_000);
  });
});

describe('computeCB', () => {
  it('returns 0 when ghgIntensity equals target', () => {
    expect(computeCB(TARGET_GHG_INTENSITY, 5000)).toBeCloseTo(0, 2);
  });

  it('returns negative (deficit) when ghgIntensity > target — R001 scenario', () => {
    const cb = computeCB(91.0, 5000);
    expect(cb).toBeLessThan(0);
    // (89.3368 - 91.0) * 205_000_000 = -340,956,000
    expect(cb).toBeCloseTo(-340_956_000, 0);
  });

  it('returns positive (surplus) when ghgIntensity < target — R002 scenario', () => {
    const cb = computeCB(88.0, 4800);
    expect(cb).toBeGreaterThan(0);
  });
});
