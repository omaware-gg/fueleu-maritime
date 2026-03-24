import { render, screen, waitFor } from '@testing-library/react';
import CompareTab from '@adapters/ui/components/CompareTab';

const MOCK_COMPARISON = {
  baseline: {
    id: 'b1',
    routeId: 'R004',
    vesselType: 'RoRo',
    fuelType: 'HFO',
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distanceKm: 11800,
    totalEmissions: 4300,
    isBaseline: true,
  },
  comparisons: [
    {
      baselineRouteId: 'R004',
      comparisonRouteId: 'R001',
      baselineGhg: 89.2,
      comparisonGhg: 91.0,
      percentDiff: 2.018,
      compliant: false,
    },
    {
      baselineRouteId: 'R004',
      comparisonRouteId: 'R002',
      baselineGhg: 89.2,
      comparisonGhg: 88.0,
      percentDiff: -1.345,
      compliant: true,
    },
  ],
};

vi.mock('@adapters/infrastructure/api/ApiContext', () => ({
  useApi: () => ({
    routePort: {
      getRoutes: vi.fn(),
      setBaseline: vi.fn(),
      getComparison: vi.fn().mockResolvedValue(MOCK_COMPARISON),
    },
    compliancePort: {},
    bankingPort: {},
    poolPort: {},
  }),
}));

vi.mock('recharts', async () => {
  const original = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

describe('CompareTab', () => {
  it('shows R001 as Non-compliant', async () => {
    render(<CompareTab />);
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      const nonCompliantBadges = screen.getAllByText('Non-compliant');
      expect(nonCompliantBadges.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows R002 as Compliant', async () => {
    render(<CompareTab />);
    await waitFor(() => {
      expect(screen.getByText('R002')).toBeInTheDocument();
      const compliantBadges = screen.getAllByText('Compliant');
      expect(compliantBadges.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('baseline card shows ghgIntensity 89.2000', async () => {
    render(<CompareTab />);
    await waitFor(() => {
      expect(screen.getByText('89.2000')).toBeInTheDocument();
    });
  });

  it('percentDiff for R001 is formatted starting with +', async () => {
    render(<CompareTab />);
    await waitFor(() => {
      expect(screen.getByText('+2.02%')).toBeInTheDocument();
    });
  });
});
