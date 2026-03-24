export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  type: 'banked' | 'applied';
  createdAt: Date;
}

/**
 * FuelEU Article 20 — Banking.
 * Validates that the CB is positive before banking.
 */
export function bankSurplus(cb: number): number {
  if (cb <= 0) throw new Error('Cannot bank: compliance balance is not positive (no surplus)');
  return cb;
}

/**
 * Apply banked surplus to offset a deficit.
 * applied = min(bankedAmount, |deficit|)
 * cbAfter = deficit + applied  (deficit is negative, so this moves toward 0)
 */
export function applyBanked(
  bankedAmount: number,
  deficit: number,
): { applied: number; cbAfter: number } {
  if (bankedAmount <= 0) throw new Error('No banked surplus available to apply');
  if (deficit >= 0) throw new Error('Cannot apply banked surplus: CB is not in deficit');
  const applied = Math.min(bankedAmount, Math.abs(deficit));
  const cbAfter = deficit + applied;
  return { applied, cbAfter };
}
