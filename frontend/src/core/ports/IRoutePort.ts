import { Route, RouteFilters } from '../domain/Route';
import { ComparisonResult } from '../domain/Comparison';

export interface IRoutePort {
  getRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<ComparisonResult>;
}
