export const TARGET_GHG_INTENSITY = 89.3368;
export const LCV_MJ_PER_TONNE = 41_000;

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  energyMj: number;
}

/**
 * Compliance Balance = (Target − Actual) × (fuelConsumption × LCV)
 * Positive → surplus (compliant), Negative → deficit (non-compliant)
 */
export function computeCB(ghgIntensity: number, fuelConsumptionTonnes: number): number {
  const energyMj = fuelConsumptionTonnes * LCV_MJ_PER_TONNE;
  return (TARGET_GHG_INTENSITY - ghgIntensity) * energyMj;
}

export function computeEnergyMj(fuelConsumptionTonnes: number): number {
  return fuelConsumptionTonnes * LCV_MJ_PER_TONNE;
}
