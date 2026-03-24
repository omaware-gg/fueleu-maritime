import { bankSurplus, applyBanked } from '@core/domain/Banking';

describe('bankSurplus', () => {
  it('returns amount when CB is positive', () => expect(bankSurplus(500)).toBe(500));
  it('throws when CB is 0', () => expect(() => bankSurplus(0)).toThrow());
  it('throws when CB is negative', () => expect(() => bankSurplus(-100)).toThrow());
});

describe('applyBanked', () => {
  it('applies full deficit when banked > |deficit|', () => {
    const { applied, cbAfter } = applyBanked(200, -150);
    expect(applied).toBe(150);
    expect(cbAfter).toBe(0);
  });

  it('applies partial when banked < |deficit|', () => {
    const { applied, cbAfter } = applyBanked(100, -150);
    expect(applied).toBe(100);
    expect(cbAfter).toBe(-50);
  });

  it('throws when no banked surplus', () => {
    expect(() => applyBanked(0, -100)).toThrow();
  });

  it('throws when CB is not in deficit', () => {
    expect(() => applyBanked(200, 50)).toThrow();
  });
});
