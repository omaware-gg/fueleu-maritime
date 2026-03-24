import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoutesTab from '@adapters/ui/components/RoutesTab';

const MOCK_ROUTES = [
  {
    id: '1',
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distanceKm: 12000,
    totalEmissions: 4500,
    isBaseline: false,
  },
  {
    id: '2',
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
];

const mockRoutePort = {
  getRoutes: vi.fn().mockResolvedValue(MOCK_ROUTES),
  setBaseline: vi.fn().mockResolvedValue(undefined),
  getComparison: vi.fn(),
};

vi.mock('@adapters/infrastructure/api/ApiContext', () => ({
  useApi: () => ({
    routePort: mockRoutePort,
    compliancePort: {},
    bankingPort: {},
    poolPort: {},
  }),
  ApiProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RoutesTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoutePort.getRoutes.mockResolvedValue(MOCK_ROUTES);
  });

  it('renders route rows with R001 and R004', async () => {
    render(<RoutesTab />);
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('R004')).toBeInTheDocument();
    });
  });

  it('baseline row (R004) shows "✓ Baseline" pill', async () => {
    render(<RoutesTab />);
    await waitFor(() => {
      expect(screen.getByText('✓ Baseline')).toBeInTheDocument();
    });
  });

  it('non-baseline row shows "Set Baseline" button', async () => {
    render(<RoutesTab />);
    await waitFor(() => {
      expect(screen.getByText('Set Baseline')).toBeInTheDocument();
    });
  });

  it('clicking "Set Baseline" calls setBaseline with correct routeId', async () => {
    const user = userEvent.setup();
    render(<RoutesTab />);

    const btn = await screen.findByText('Set Baseline');
    await user.click(btn);

    expect(mockRoutePort.setBaseline).toHaveBeenCalledWith('R001');
  });

  it('filter dropdown change calls getRoutes with filter params', async () => {
    const user = userEvent.setup();
    render(<RoutesTab />);

    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
    });

    mockRoutePort.getRoutes.mockClear();

    const vesselSelect = screen.getByDisplayValue('All Vessel Types');
    await user.selectOptions(vesselSelect, 'Container');

    await waitFor(() => {
      expect(mockRoutePort.getRoutes).toHaveBeenCalledWith(
        expect.objectContaining({ vesselType: 'Container' }),
      );
    });
  });
});
