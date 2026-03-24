export interface IComplianceService {
  getCB(shipId: string, year: number): Promise<{ cb: number; energyMj: number }>;
  getAdjustedCB(shipId: string, year: number): Promise<{ adjustedCb: number; rawCb: number }>;
}
