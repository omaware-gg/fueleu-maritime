import { IRoutePort } from '../ports/IRoutePort';
import { Route, RouteFilters } from '../domain/Route';
import { ComparisonResult } from '../domain/Comparison';

export async function getAllRoutes(port: IRoutePort, filters?: RouteFilters): Promise<Route[]> {
  return port.getRoutes(filters);
}

export async function setBaseline(port: IRoutePort, routeId: string): Promise<void> {
  return port.setBaseline(routeId);
}

export async function getComparison(port: IRoutePort): Promise<ComparisonResult> {
  return port.getComparison();
}
