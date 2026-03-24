import { Route } from './Route';

export interface RouteComparison {
  baselineRouteId: string;
  comparisonRouteId: string;
  baselineGhg: number;
  comparisonGhg: number;
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonResult {
  baseline: Route;
  comparisons: RouteComparison[];
}
