import { TARGET_GHG_INTENSITY } from './Compliance';

export interface RouteComparison {
  baselineRouteId: string;
  comparisonRouteId: string;
  baselineGhg: number;
  comparisonGhg: number;
  percentDiff: number;
  compliant: boolean;
}

/**
 * percentDiff = ((comparison / baseline) - 1) * 100
 * compliant = comparisonGhg <= TARGET (89.3368 gCO₂e/MJ)
 */
export function computeComparison(
  baselineGhg: number,
  comparisonGhg: number,
): { percentDiff: number; compliant: boolean } {
  if (baselineGhg === 0) throw new Error('Baseline GHG intensity cannot be zero');
  const percentDiff = ((comparisonGhg / baselineGhg) - 1) * 100;
  const compliant = comparisonGhg <= TARGET_GHG_INTENSITY;
  return { percentDiff, compliant };
}
