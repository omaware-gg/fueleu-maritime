import React, { createContext, useContext } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { IRoutePort } from '@core/ports/IRoutePort';
import { ICompliancePort, IBankingPort, IPoolPort } from '@core/ports/ICompliancePort';

interface ApiContextValue {
  routePort: IRoutePort;
  compliancePort: ICompliancePort;
  bankingPort: IBankingPort;
  poolPort: IPoolPort;
}

const ApiContext = createContext<ApiContextValue | null>(null);

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used inside <ApiProvider>');
  return ctx;
}

export function createMockPorts(overrides?: Partial<ApiContextValue>): ApiContextValue {
  return {
    routePort: {
      getRoutes: vi.fn().mockResolvedValue([]),
      setBaseline: vi.fn().mockResolvedValue(undefined),
      getComparison: vi.fn().mockResolvedValue({ baseline: null, comparisons: [] }),
    },
    compliancePort: {
      getCB: vi.fn().mockResolvedValue({ cb: 0, energyMj: 0 }),
      getAdjustedCB: vi.fn().mockResolvedValue({ adjustedCb: 0, rawCb: 0 }),
    },
    bankingPort: {
      getRecords: vi.fn().mockResolvedValue([]),
      bankSurplus: vi.fn().mockResolvedValue({ cbBefore: 0, banked: 0, cbAfter: 0 }),
      applyBanked: vi.fn().mockResolvedValue({ cbBefore: 0, applied: 0, cbAfter: 0 }),
    },
    poolPort: {
      createPool: vi.fn().mockResolvedValue({ id: 'pool-1', year: 2025, members: [], createdAt: '' }),
    },
    ...overrides,
  };
}

export function MockApiProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ApiContextValue;
}): JSX.Element {
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function renderWithApi(
  ui: React.ReactElement,
  ports?: Partial<ApiContextValue>,
): RenderResult & { ports: ApiContextValue } {
  const mockPorts = createMockPorts(ports);
  const result = render(
    <MockApiProvider value={mockPorts}>{ui}</MockApiProvider>,
  );
  return { ...result, ports: mockPorts };
}
