import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PoolingTab from '@adapters/ui/components/PoolingTab';

const mockPoolPort = {
  createPool: vi.fn(),
};

vi.mock('@adapters/infrastructure/api/ApiContext', () => ({
  useApi: () => ({
    routePort: {},
    compliancePort: {},
    bankingPort: {},
    poolPort: mockPoolPort,
  }),
}));

async function addMember(user: ReturnType<typeof userEvent.setup>, shipId: string, cb: string) {
  const shipInput = screen.getByPlaceholderText('e.g. S1');
  const cbInput = screen.getByPlaceholderText('e.g. -100');

  await user.clear(shipInput);
  await user.type(shipInput, shipId);
  await user.clear(cbInput);
  await user.type(cbInput, cb);

  const addBtn = screen.getByText('Add Member');
  await user.click(addBtn);
}

describe('PoolingTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('"Create Pool" button disabled when no members', () => {
    render(<PoolingTab />);
    const createBtn = screen.getByText('Create Pool');
    expect(createBtn).toBeDisabled();
  });

  it('button still disabled with only 1 member', async () => {
    const user = userEvent.setup();
    render(<PoolingTab />);

    await addMember(user, 'S1', '200');

    const createBtn = screen.getByRole('button', { name: 'Create Pool' });
    expect(createBtn).toBeDisabled();
    expect(screen.getAllByText(/at least 2 members/).length).toBeGreaterThanOrEqual(1);
  });

  it('negative pool sum: button disabled', async () => {
    const user = userEvent.setup();
    render(<PoolingTab />);

    await addMember(user, 'R002', '50');
    await addMember(user, 'R003', '-200');

    const createBtn = screen.getByRole('button', { name: 'Create Pool' });
    expect(createBtn).toBeDisabled();
    expect(screen.getAllByText(/must be ≥ 0/).length).toBeGreaterThanOrEqual(1);
  });

  it('positive pool sum with >= 2 members: button enabled', async () => {
    const user = userEvent.setup();
    render(<PoolingTab />);

    await addMember(user, 'R002', '200');
    await addMember(user, 'R004', '-50');

    expect(screen.getByText('✓ Valid pool')).toBeInTheDocument();
    const createBtn = screen.getByText('Create Pool');
    expect(createBtn).not.toBeDisabled();
  });

  it('createPool success: fills CB After column and shows success banner', async () => {
    mockPoolPort.createPool.mockResolvedValue({
      id: 'pool-abc-123',
      year: 2025,
      members: [
        { shipId: 'R002', cbBefore: 200, cbAfter: 150 },
        { shipId: 'R004', cbBefore: -50, cbAfter: 0 },
      ],
      createdAt: '2025-01-01T00:00:00Z',
    });

    const user = userEvent.setup();
    render(<PoolingTab />);

    await addMember(user, 'R002', '200');
    await addMember(user, 'R004', '-50');

    const createBtn = screen.getByText('Create Pool');
    await user.click(createBtn);

    await waitFor(() => {
      expect(screen.getByText(/pool-abc-123/)).toBeInTheDocument();
    });

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('createPool API error: shows ErrorBanner', async () => {
    mockPoolPort.createPool.mockRejectedValue(new Error('Server exploded'));

    const user = userEvent.setup();
    render(<PoolingTab />);

    await addMember(user, 'R002', '200');
    await addMember(user, 'R004', '-50');

    const createBtn = screen.getByText('Create Pool');
    await user.click(createBtn);

    await waitFor(() => {
      expect(screen.getByText('Server exploded')).toBeInTheDocument();
    });
  });
});
