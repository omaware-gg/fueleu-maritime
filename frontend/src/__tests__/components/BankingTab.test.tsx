import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BankingTab from '@adapters/ui/components/BankingTab';

const mockCompliancePort = {
  getCB: vi.fn(),
  getAdjustedCB: vi.fn(),
};

const mockBankingPort = {
  getRecords: vi.fn().mockResolvedValue([]),
  bankSurplus: vi.fn(),
  applyBanked: vi.fn(),
};

vi.mock('@adapters/infrastructure/api/ApiContext', () => ({
  useApi: () => ({
    routePort: {},
    compliancePort: mockCompliancePort,
    bankingPort: mockBankingPort,
    poolPort: {},
  }),
}));

async function loadShip(shipId: string, year = 2024) {
  const user = userEvent.setup();
  render(<BankingTab />);

  const shipInput = screen.getByPlaceholderText('e.g. R002');
  await user.clear(shipInput);
  await user.type(shipInput, shipId);

  const yearInput = screen.getByDisplayValue('2024');
  if (year !== 2024) {
    await user.clear(yearInput);
    await user.type(yearInput, String(year));
  }

  const loadBtn = screen.getByText('Load');
  await user.click(loadBtn);
  return user;
}

describe('BankingTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBankingPort.getRecords.mockResolvedValue([]);
  });

  it('deficit ship (R001): "Bank Surplus" button is disabled', async () => {
    mockCompliancePort.getCB.mockResolvedValue({ cb: -340_240_000, energyMj: 205_000_000 });

    await loadShip('R001');

    await waitFor(() => {
      expect(screen.getByText('Deficit')).toBeInTheDocument();
    });

    const bankBtn = screen.getByRole('button', { name: 'Bank Surplus' });
    expect(bankBtn).toBeDisabled();
  });

  it('surplus ship (R002): "Bank Surplus" button is enabled', async () => {
    mockCompliancePort.getCB.mockResolvedValue({ cb: 57_360_000, energyMj: 196_800_000 });

    await loadShip('R002');

    await waitFor(() => {
      expect(screen.getByText('Surplus')).toBeInTheDocument();
    });

    const bankBtn = screen.getByRole('button', { name: 'Bank Surplus' });
    expect(bankBtn).not.toBeDisabled();
  });

  it('available banked = 0: "Apply to Deficit" button is disabled', async () => {
    mockCompliancePort.getCB.mockResolvedValue({ cb: -340_240_000, energyMj: 205_000_000 });
    mockBankingPort.getRecords.mockResolvedValue([]);

    await loadShip('R001');

    await waitFor(() => {
      expect(screen.getByText('Apply to Deficit')).toBeInTheDocument();
    });

    const applyBtn = screen.getByText('Apply to Deficit');
    expect(applyBtn).toBeDisabled();
  });

  it('bankSurplus success: shows cbBefore, banked, cbAfter cards', async () => {
    mockCompliancePort.getCB.mockResolvedValue({ cb: 57_360_000, energyMj: 196_800_000 });
    mockBankingPort.bankSurplus.mockResolvedValue({
      cbBefore: 57_360_000,
      banked: 1_000_000,
      cbAfter: 56_360_000,
    });

    const user = await loadShip('R002');

    await waitFor(() => {
      expect(screen.getByText('Surplus')).toBeInTheDocument();
    });

    const amountInput = screen.getAllByDisplayValue(/57/)[0];
    await user.clear(amountInput);
    await user.type(amountInput, '1000000');

    const bankBtn = screen.getByRole('button', { name: 'Bank Surplus' });
    await user.click(bankBtn);

    await waitFor(() => {
      expect(screen.getByText('CB Before')).toBeInTheDocument();
      expect(screen.getByText('Banked')).toBeInTheDocument();
      expect(screen.getByText('CB After')).toBeInTheDocument();
    });
  });
});
