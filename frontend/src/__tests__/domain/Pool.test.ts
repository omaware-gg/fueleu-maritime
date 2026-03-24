import { VESSEL_TYPES, FUEL_TYPES, YEARS } from '@shared/constants';

describe('shared constants', () => {
  it('VESSEL_TYPES includes all expected types', () => {
    expect(VESSEL_TYPES).toContain('All');
    expect(VESSEL_TYPES).toContain('Container');
    expect(VESSEL_TYPES).toContain('BulkCarrier');
    expect(VESSEL_TYPES).toContain('Tanker');
    expect(VESSEL_TYPES).toContain('RoRo');
  });

  it('FUEL_TYPES includes all expected types', () => {
    expect(FUEL_TYPES).toContain('All');
    expect(FUEL_TYPES).toContain('HFO');
    expect(FUEL_TYPES).toContain('LNG');
    expect(FUEL_TYPES).toContain('MGO');
  });

  it('YEARS includes All, 2024, 2025', () => {
    expect(YEARS).toContain('All');
    expect(YEARS).toContain(2024);
    expect(YEARS).toContain(2025);
  });
});

describe('pool validation helper (frontend equivalent)', () => {
  function validationReason(memberCount: number, poolSum: number): string | null {
    if (memberCount < 2) return 'Pool must have at least 2 members';
    if (poolSum < 0) return `Pool sum CB is ${poolSum.toFixed(2)} — must be ≥ 0`;
    return null;
  }

  it('returns null for valid pool', () => {
    expect(validationReason(2, 100)).toBeNull();
  });

  it('returns reason when fewer than 2 members', () => {
    expect(validationReason(1, 100)).toBe('Pool must have at least 2 members');
  });

  it('returns reason when pool sum < 0', () => {
    expect(validationReason(3, -50)).toContain('must be ≥ 0');
  });
});
