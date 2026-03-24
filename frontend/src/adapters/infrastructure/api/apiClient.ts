import axios from 'axios';
import { IRoutePort } from '@core/ports/IRoutePort';
import { ICompliancePort, IBankingPort, IPoolPort } from '@core/ports/ICompliancePort';
import { Route, RouteFilters } from '@core/domain/Route';
import { ComparisonResult } from '@core/domain/Comparison';
import { BankEntry, BankingResult, Pool } from '@core/domain/Compliance';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Unknown error';
    return Promise.reject(new Error(message));
  },
);

export class RouteApiAdapter implements IRoutePort {
  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    const params = Object.fromEntries(
      Object.entries(filters ?? {}).filter(([, v]) => v !== undefined && v !== 'All'),
    );
    const { data } = await http.get('/routes', { params });
    return data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await http.post(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<ComparisonResult> {
    const { data } = await http.get('/routes/comparison');
    return data;
  }
}

export class ComplianceApiAdapter implements ICompliancePort {
  async getCB(shipId: string, year: number): Promise<{ cb: number; energyMj: number }> {
    const { data } = await http.get('/compliance/cb', { params: { shipId, year } });
    return data;
  }

  async getAdjustedCB(
    shipId: string,
    year: number,
  ): Promise<{ adjustedCb: number; rawCb: number }> {
    const { data } = await http.get('/compliance/adjusted-cb', { params: { shipId, year } });
    return data;
  }
}

export class BankingApiAdapter implements IBankingPort {
  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const { data } = await http.get('/banking/records', { params: { shipId, year } });
    return data;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult> {
    const { data } = await http.post('/banking/bank', { shipId, year, amount });
    return data;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult> {
    const { data } = await http.post('/banking/apply', { shipId, year, amount });
    return data;
  }
}

export class PoolApiAdapter implements IPoolPort {
  async createPool(year: number, members: { shipId: string; cb: number }[]): Promise<Pool> {
    const { data } = await http.post('/pools', { year, members });
    return data;
  }
}
