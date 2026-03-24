import { Route } from '../../domain/Route';
import { RouteComparison } from '../../domain/Comparison';
import { RouteFilters } from '../outbound/IRouteRepository';

export interface IRouteService {
  getAllRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<{ baseline: Route; comparisons: RouteComparison[] }>;
}
