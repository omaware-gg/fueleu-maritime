import { IBankingService } from '../../ports/inbound/IBankingService';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankingRepository } from '../../ports/outbound/IBankingRepository';
import { BankEntry, bankSurplus, applyBanked } from '../../domain/Banking';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { computeCB } from '../../domain/Compliance';

export class BankingUseCases implements IBankingService {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly complianceRepo: IComplianceRepository,
    private readonly bankingRepo: IBankingRepository,
  ) {}

  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.bankingRepo.getRecords(shipId, year);
  }

  async bankSurplus(
    shipId: string,
    year: number,
    amount: number,
  ): Promise<{ cbBefore: number; banked: number; cbAfter: number }> {
    const route = await this.routeRepo.findByRouteId(shipId);
    if (!route) throw new Error(`Route/ship ${shipId} not found`);

    const cbBefore = computeCB(route.ghgIntensity, route.fuelConsumption);

    bankSurplus(cbBefore);

    if (amount > cbBefore) {
      throw new Error(`Cannot bank ${amount}: exceeds available surplus of ${cbBefore.toFixed(4)}`);
    }

    await this.bankingRepo.save({ shipId, year, amountGco2eq: amount, type: 'banked' });

    return { cbBefore, banked: amount, cbAfter: cbBefore - amount };
  }

  async applyBanked(
    shipId: string,
    year: number,
    amount: number,
  ): Promise<{ cbBefore: number; applied: number; cbAfter: number }> {
    const route = await this.routeRepo.findByRouteId(shipId);
    if (!route) throw new Error(`Route/ship ${shipId} not found`);

    const cbBefore = computeCB(route.ghgIntensity, route.fuelConsumption);
    const totalBanked = await this.bankingRepo.getTotalByType(shipId, year, 'banked');
    const totalApplied = await this.bankingRepo.getTotalByType(shipId, year, 'applied');
    const availableBanked = totalBanked - totalApplied;

    if (amount > availableBanked) {
      throw new Error(
        `Cannot apply ${amount}: only ${availableBanked.toFixed(4)} available in bank`,
      );
    }

    const { applied, cbAfter } = applyBanked(availableBanked, cbBefore);
    const actualApplied = Math.min(amount, applied);

    await this.bankingRepo.save({ shipId, year, amountGco2eq: actualApplied, type: 'applied' });

    return { cbBefore, applied: actualApplied, cbAfter: cbBefore + actualApplied };
  }
}
