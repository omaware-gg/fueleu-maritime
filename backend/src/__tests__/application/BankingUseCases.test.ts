import { BankingUseCases } from '@core/application/use-cases/BankingUseCases';
import { IRouteRepository } from '@core/ports/outbound/IRouteRepository';
import { IComplianceRepository } from '@core/ports/outbound/IComplianceRepository';
import { IBankingRepository } from '@core/ports/outbound/IBankingRepository';
import { Route } from '@core/domain/Route';
import { computeCB } from '@core/domain/Compliance';

const surplusRoute: Route = {
  id: 'uuid-2',
  routeId: 'R002',
  vesselType: 'BulkCarrier',
  fuelType: 'LNG',
  year: 2024,
  ghgIntensity: 88.0,
  fuelConsumption: 4800,
  distanceKm: 11500,
  totalEmissions: 4200,
  isBaseline: false,
};

const deficitRoute: Route = {
  id: 'uuid-1',
  routeId: 'R001',
  vesselType: 'Container',
  fuelType: 'HFO',
  year: 2024,
  ghgIntensity: 91.0,
  fuelConsumption: 5000,
  distanceKm: 12000,
  totalEmissions: 4500,
  isBaseline: false,
};

function createMocks() {
  const routeRepo: jest.Mocked<IRouteRepository> = {
    findAll: jest.fn(),
    findByRouteId: jest.fn(),
    findBaseline: jest.fn(),
    setBaseline: jest.fn(),
  };
  const complianceRepo: jest.Mocked<IComplianceRepository> = {
    save: jest.fn(),
    findByShipAndYear: jest.fn(),
  };
  const bankingRepo: jest.Mocked<IBankingRepository> = {
    save: jest.fn(),
    getTotalByType: jest.fn(),
    getRecords: jest.fn(),
  };
  return { routeRepo, complianceRepo, bankingRepo };
}

describe('BankingUseCases', () => {
  describe('bankSurplus', () => {
    it('calls bankingRepo.save with type="banked"', async () => {
      const { routeRepo, complianceRepo, bankingRepo } = createMocks();
      const service = new BankingUseCases(routeRepo, complianceRepo, bankingRepo);

      routeRepo.findByRouteId.mockResolvedValue(surplusRoute);
      bankingRepo.save.mockResolvedValue({
        id: 'entry-1',
        shipId: 'R002',
        year: 2024,
        amountGco2eq: 100,
        type: 'banked',
        createdAt: new Date(),
      });

      const cb = computeCB(surplusRoute.ghgIntensity, surplusRoute.fuelConsumption);
      const result = await service.bankSurplus('R002', 2024, 100);

      expect(bankingRepo.save).toHaveBeenCalledWith({
        shipId: 'R002',
        year: 2024,
        amountGco2eq: 100,
        type: 'banked',
      });
      expect(result.banked).toBe(100);
      expect(result.cbBefore).toBeCloseTo(cb, 0);
    });

    it('throws if amount > cb (surplus)', async () => {
      const { routeRepo, complianceRepo, bankingRepo } = createMocks();
      const service = new BankingUseCases(routeRepo, complianceRepo, bankingRepo);

      routeRepo.findByRouteId.mockResolvedValue(surplusRoute);
      const cb = computeCB(surplusRoute.ghgIntensity, surplusRoute.fuelConsumption);

      await expect(service.bankSurplus('R002', 2024, cb + 1)).rejects.toThrow('exceeds available');
    });
  });

  describe('applyBanked', () => {
    it('calls bankingRepo.save with type="applied"', async () => {
      const { routeRepo, complianceRepo, bankingRepo } = createMocks();
      const service = new BankingUseCases(routeRepo, complianceRepo, bankingRepo);

      routeRepo.findByRouteId.mockResolvedValue(deficitRoute);
      bankingRepo.getTotalByType.mockImplementation(
        async (_shipId: string, _year: number, type: 'banked' | 'applied') => {
          return type === 'banked' ? 500_000_000 : 0;
        },
      );
      bankingRepo.save.mockResolvedValue({
        id: 'entry-2',
        shipId: 'R001',
        year: 2024,
        amountGco2eq: 100,
        type: 'applied',
        createdAt: new Date(),
      });

      const result = await service.applyBanked('R001', 2024, 100);

      expect(bankingRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'applied' }),
      );
      expect(result.applied).toBeGreaterThan(0);
    });

    it('throws if amount > availableBanked', async () => {
      const { routeRepo, complianceRepo, bankingRepo } = createMocks();
      const service = new BankingUseCases(routeRepo, complianceRepo, bankingRepo);

      routeRepo.findByRouteId.mockResolvedValue(deficitRoute);
      bankingRepo.getTotalByType.mockImplementation(
        async (_shipId: string, _year: number, type: 'banked' | 'applied') => {
          return type === 'banked' ? 100 : 50;
        },
      );

      await expect(service.applyBanked('R001', 2024, 200)).rejects.toThrow(
        'only 50.0000 available',
      );
    });
  });
});
