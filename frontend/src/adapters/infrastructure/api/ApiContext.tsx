import React, { createContext, useContext } from 'react';
import { IRoutePort } from '@core/ports/IRoutePort';
import { ICompliancePort, IBankingPort, IPoolPort } from '@core/ports/ICompliancePort';
import {
  RouteApiAdapter,
  ComplianceApiAdapter,
  BankingApiAdapter,
  PoolApiAdapter,
} from './apiClient';

interface ApiContextValue {
  routePort: IRoutePort;
  compliancePort: ICompliancePort;
  bankingPort: IBankingPort;
  poolPort: IPoolPort;
}

const ApiContext = createContext<ApiContextValue | null>(null);

const adapters: ApiContextValue = {
  routePort: new RouteApiAdapter(),
  compliancePort: new ComplianceApiAdapter(),
  bankingPort: new BankingApiAdapter(),
  poolPort: new PoolApiAdapter(),
};

export function ApiProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return <ApiContext.Provider value={adapters}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used inside <ApiProvider>');
  return ctx;
}
