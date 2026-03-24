import { RouteUseCases } from '@core/application/use-cases/RouteUseCases';
import { IRouteRepository } from '@core/ports/outbound/IRouteRepository';
import { Route } from '@core/domain/Route';

const makeRoute = (overrides: Partial<Route> = {}): Route => ({
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
  ...overrides,
});

function createMockRepo(): jest.Mocked<IRouteRepository> {
  return {
    findAll: jest.fn(),
    findByRouteId: jest.fn(),
    findBaseline: jest.fn(),
    setBaseline: jest.fn(),
  };
}

describe('RouteUseCases', () => {
  let repo: jest.Mocked<IRouteRepository>;
  let service: RouteUseCases;

  beforeEach(() => {
    repo = createMockRepo();
    service = new RouteUseCases(repo);
  });

  describe('getAllRoutes', () => {
    it('calls findAll with correct filters', async () => {
      const routes = [makeRoute()];
      repo.findAll.mockResolvedValue(routes);

      const result = await service.getAllRoutes({ vesselType: 'Container' });

      expect(repo.findAll).toHaveBeenCalledWith({ vesselType: 'Container' });
      expect(result).toEqual(routes);
    });
  });

  describe('setBaseline', () => {
    it('calls findByRouteId then setBaseline on repo', async () => {
      repo.findByRouteId.mockResolvedValue(makeRoute({ routeId: 'R004' }));
      repo.setBaseline.mockResolvedValue(undefined);

      await service.setBaseline('R004');

      expect(repo.findByRouteId).toHaveBeenCalledWith('R004');
      expect(repo.setBaseline).toHaveBeenCalledWith('R004');
    });

    it('throws "not found" if repo returns null', async () => {
      repo.findByRouteId.mockResolvedValue(null);

      await expect(service.setBaseline('R999')).rejects.toThrow('Route R999 not found');
    });
  });

  describe('getComparison', () => {
    it('throws if no baseline set', async () => {
      repo.findBaseline.mockResolvedValue(null);

      await expect(service.getComparison()).rejects.toThrow('No baseline route set');
    });

    it('returns correct RouteComparison[] with percentDiff and compliant fields', async () => {
      const baseline = makeRoute({
        routeId: 'R004',
        ghgIntensity: 89.2,
        isBaseline: true,
      });
      const r001 = makeRoute({ routeId: 'R001', ghgIntensity: 91.0 });
      const r002 = makeRoute({ routeId: 'R002', ghgIntensity: 88.0 });

      repo.findBaseline.mockResolvedValue(baseline);
      repo.findAll.mockResolvedValue([baseline, r001, r002]);

      const { baseline: b, comparisons } = await service.getComparison();

      expect(b.routeId).toBe('R004');
      expect(comparisons).toHaveLength(2);

      const c1 = comparisons.find((c) => c.comparisonRouteId === 'R001')!;
      expect(c1.percentDiff).toBeCloseTo(2.018, 2);
      expect(c1.compliant).toBe(false);

      const c2 = comparisons.find((c) => c.comparisonRouteId === 'R002')!;
      expect(c2.percentDiff).toBeCloseTo(-1.345, 2);
      expect(c2.compliant).toBe(true);
    });
  });
});
