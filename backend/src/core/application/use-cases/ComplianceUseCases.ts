import { IComplianceService } from '../../ports/inbound/IComplianceService';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankingRepository } from '../../ports/outbound/IBankingRepository';
import { computeCB, computeEnergyMj } from '../../domain/Compliance';

export class ComplianceUseCases implements IComplianceService {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly complianceRepo: IComplianceRepository,
    private readonly bankingRepo: IBankingRepository,
  ) {}

  async getCB(shipId: string, year: number): Promise<{ cb: number; energyMj: number }> {
    const route = await this.routeRepo.findByRouteId(shipId);
    if (!route) throw new Error(`Route/ship ${shipId} not found`);

    const cb = computeCB(route.ghgIntensity, route.fuelConsumption);
    const energyMj = computeEnergyMj(route.fuelConsumption);

    await this.complianceRepo.save({ shipId, year, cbGco2eq: cb, energyMj });

    return { cb, energyMj };
  }

  async getAdjustedCB(
    shipId: string,
    year: number,
  ): Promise<{ adjustedCb: number; rawCb: number }> {
    const { cb: rawCb } = await this.getCB(shipId, year);

    const totalBanked = await this.bankingRepo.getTotalByType(shipId, year, 'banked');
    const totalApplied = await this.bankingRepo.getTotalByType(shipId, year, 'applied');
    const adjustedCb = rawCb + totalApplied - totalBanked;

    return { adjustedCb, rawCb };
  }
}
