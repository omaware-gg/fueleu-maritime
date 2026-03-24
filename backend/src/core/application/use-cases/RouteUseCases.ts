import { IRouteRepository, RouteFilters } from '../../ports/outbound/IRouteRepository';
import { IRouteService } from '../../ports/inbound/IRouteService';
import { Route } from '../../domain/Route';
import { RouteComparison, computeComparison } from '../../domain/Comparison';

export class RouteUseCases implements IRouteService {
  constructor(private readonly routeRepo: IRouteRepository) {}

  async getAllRoutes(filters?: RouteFilters): Promise<Route[]> {
    return this.routeRepo.findAll(filters);
  }

  async setBaseline(routeId: string): Promise<void> {
    const route = await this.routeRepo.findByRouteId(routeId);
    if (!route) throw new Error(`Route ${routeId} not found`);
    await this.routeRepo.setBaseline(routeId);
  }

  async getComparison(): Promise<{ baseline: Route; comparisons: RouteComparison[] }> {
    const baseline = await this.routeRepo.findBaseline();
    if (!baseline) throw new Error('No baseline route set. Use POST /routes/:id/baseline first.');

    const allRoutes = await this.routeRepo.findAll();
    const others = allRoutes.filter((r) => r.routeId !== baseline.routeId);

    const comparisons: RouteComparison[] = others.map((route) => {
      const { percentDiff, compliant } = computeComparison(
        baseline.ghgIntensity,
        route.ghgIntensity,
      );
      return {
        baselineRouteId: baseline.routeId,
        comparisonRouteId: route.routeId,
        baselineGhg: baseline.ghgIntensity,
        comparisonGhg: route.ghgIntensity,
        percentDiff,
        compliant,
      };
    });

    return { baseline, comparisons };
  }
}
