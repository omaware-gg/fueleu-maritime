import { validatePool, allocatePool } from '@core/domain/Pool';

describe('validatePool', () => {
  it('valid when sum >= 0', () => {
    expect(
      validatePool([
        { shipId: 'A', cb: 100 },
        { shipId: 'B', cb: -50 },
      ]).valid,
    ).toBe(true);
  });

  it('invalid when sum < 0', () => {
    const r = validatePool([
      { shipId: 'A', cb: 50 },
      { shipId: 'B', cb: -200 },
    ]);
    expect(r.valid).toBe(false);
    expect(r.reason).toContain('must be >= 0');
  });

  it('invalid with fewer than 2 members', () => {
    expect(validatePool([{ shipId: 'A', cb: 100 }]).valid).toBe(false);
  });
});

describe('allocatePool', () => {
  it('transfers surplus to deficit correctly', () => {
    const result = allocatePool([
      { shipId: 'S', cb: 200 },
      { shipId: 'D', cb: -100 },
    ]);
    const surplus = result.find((m) => m.shipId === 'S')!;
    const deficit = result.find((m) => m.shipId === 'D')!;
    expect(deficit.cbAfter).toBe(0);
    expect(surplus.cbAfter).toBe(100);
  });

  it('surplus ship does not exit negative', () => {
    const result = allocatePool([
      { shipId: 'S', cb: 100 },
      { shipId: 'D', cb: -50 },
    ]);
    const s = result.find((m) => m.shipId === 'S')!;
    expect(s.cbAfter).toBeGreaterThanOrEqual(0);
  });

  it('throws when pool sum < 0', () => {
    expect(() =>
      allocatePool([
        { shipId: 'A', cb: 50 },
        { shipId: 'B', cb: -200 },
      ]),
    ).toThrow();
  });
});
