export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  year: number;
  members: PoolMember[];
  createdAt: Date;
}

/**
 * FuelEU Article 21 — Pooling validation.
 * Rule: sum of all CBs in the pool must be >= 0
 */
export function validatePool(
  members: { shipId: string; cb: number }[],
): { valid: boolean; reason?: string } {
  if (members.length < 2) {
    return { valid: false, reason: 'Pool must have at least 2 members' };
  }
  const sum = members.reduce((acc, m) => acc + m.cb, 0);
  if (sum < 0) {
    return { valid: false, reason: `Pool sum CB is ${sum.toFixed(2)} — must be >= 0` };
  }
  return { valid: true };
}

/**
 * Greedy allocation per FuelEU Article 21:
 * 1. Sort members descending by CB (surplus first)
 * 2. Transfer surplus to deficits one by one
 *
 * Enforcement rules (both checked explicitly):
 * - Surplus ship (cbBefore >= 0) CANNOT exit with cbAfter < 0
 * - Deficit ship (cbBefore < 0) CANNOT exit worse than it entered (cbAfter < cbBefore)
 */
export function allocatePool(
  members: { shipId: string; cb: number }[],
): PoolMember[] {
  const validation = validatePool(members);
  if (!validation.valid) throw new Error(validation.reason);

  const sorted = [...members].sort((a, b) => b.cb - a.cb);
  const result: PoolMember[] = sorted.map((m) => ({
    shipId: m.shipId,
    cbBefore: m.cb,
    cbAfter: m.cb,
  }));

  for (let i = 0; i < result.length; i++) {
    for (let j = result.length - 1; j > i; j--) {
      if (result[i].cbAfter > 0 && result[j].cbAfter < 0) {
        const transfer = Math.min(result[i].cbAfter, Math.abs(result[j].cbAfter));
        result[i].cbAfter -= transfer;
        result[j].cbAfter += transfer;
      }
    }
  }

  for (const m of result) {
    if (m.cbBefore >= 0 && m.cbAfter < 0) {
      throw new Error(
        `Invalid pool: ship ${m.shipId} had surplus (${m.cbBefore}) but exits negative (${m.cbAfter})`,
      );
    }
  }

  for (const m of result) {
    if (m.cbBefore < 0 && m.cbAfter < m.cbBefore) {
      throw new Error(
        `Invalid pool: ship ${m.shipId} deficit worsened from ${m.cbBefore} to ${m.cbAfter}`,
      );
    }
  }

  return result;
}
