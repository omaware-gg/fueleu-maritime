import { useState, useEffect } from 'react';
import { useBanking } from '@adapters/ui/hooks/useBankingHook';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorBanner from './shared/ErrorBanner';
import KPICard from './shared/KPICard';

function formatMj(mj: number): string {
  return `${(mj / 1_000_000).toFixed(2)}M`;
}

function formatCb(val: number): string {
  return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function cbVariant(val: number): 'success' | 'danger' | 'default' {
  if (val > 0) return 'success';
  if (val < 0) return 'danger';
  return 'default';
}

function BankingContent({ shipId, year }: { shipId: string; year: number }): JSX.Element {
  const { cb, energyMj, records, loading, error, actionResult, bankSurplus, applyBanked } =
    useBanking(shipId, year);

  const [bankAmount, setBankAmount] = useState('');
  const [applyAmount, setApplyAmount] = useState('');
  const [bankPending, setBankPending] = useState(false);
  const [applyPending, setApplyPending] = useState(false);

  useEffect(() => {
    if (cb !== null && cb > 0) {
      setBankAmount(cb.toFixed(2));
    }
  }, [cb]);

  const totalBanked = records
    .filter((r) => r.type === 'banked')
    .reduce((s, r) => s + r.amountGco2eq, 0);
  const totalApplied = records
    .filter((r) => r.type === 'applied')
    .reduce((s, r) => s + r.amountGco2eq, 0);
  const availableBanked = totalBanked - totalApplied;

  const handleBank = async () => {
    setBankPending(true);
    await bankSurplus(Number(bankAmount));
    setBankPending(false);
  };

  const handleApply = async () => {
    setApplyPending(true);
    await applyBanked(Number(applyAmount));
    setApplyPending(false);
  };

  if (loading && cb === null) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} />}

      {cb !== null && energyMj !== null && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KPICard
              label="Current CB"
              value={formatCb(cb)}
              unit="tCO₂e"
              variant={cbVariant(cb)}
            />
            <KPICard label="Energy in Scope" value={formatMj(energyMj)} unit="MJ" />
            <KPICard
              label="Status"
              value={cb > 0 ? 'Surplus' : 'Deficit'}
              variant={cb > 0 ? 'success' : 'danger'}
            />
          </div>

          {/* Bank Surplus — Article 20.1 */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Bank Surplus</h3>
            <p className="mb-3 text-xs text-gray-500">Article 20.1 — Set aside surplus for future use</p>
            <div className="flex items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Amount (tCO₂e)</label>
                <input
                  type="number"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(e.target.value)}
                  className="mt-1 w-44 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={handleBank}
                  disabled={cb <= 0 || !bankAmount || Number(bankAmount) <= 0 || bankPending}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bankPending ? (
                    <>
                      <span className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Banking…
                    </>
                  ) : (
                    'Bank Surplus'
                  )}
                </button>
                {cb <= 0 && (
                  <p className="mt-1 text-xs text-amber-600">CB must be positive to bank</p>
                )}
              </div>
            </div>

            {actionResult?.banked !== undefined && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <KPICard label="CB Before" value={formatCb(actionResult.cbBefore)} unit="tCO₂e" />
                <KPICard
                  label="Banked"
                  value={formatCb(actionResult.banked)}
                  unit="tCO₂e"
                  variant="success"
                />
                <KPICard label="CB After" value={formatCb(actionResult.cbAfter)} unit="tCO₂e" />
              </div>
            )}
          </div>

          {/* Apply Banked Surplus — Article 20.2 */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Apply Banked Surplus</h3>
            <p className="mb-3 text-xs text-gray-500">
              Article 20.2 — Use banked surplus to offset a deficit
            </p>
            <div className="flex items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Amount (tCO₂e)</label>
                <input
                  type="number"
                  value={applyAmount}
                  onChange={(e) => setApplyAmount(e.target.value)}
                  className="mt-1 w-44 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleApply}
                disabled={availableBanked <= 0 || !applyAmount || Number(applyAmount) <= 0 || applyPending}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyPending ? (
                  <>
                    <span className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Applying…
                  </>
                ) : (
                  'Apply to Deficit'
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Available banked: {formatCb(availableBanked)} tCO₂e
            </p>

            {actionResult?.applied !== undefined && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <KPICard label="CB Before" value={formatCb(actionResult.cbBefore)} unit="tCO₂e" />
                <KPICard
                  label="Applied"
                  value={formatCb(actionResult.applied)}
                  unit="tCO₂e"
                  variant="success"
                />
                <KPICard label="CB After" value={formatCb(actionResult.cbAfter)} unit="tCO₂e" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function BankingTab(): JSX.Element {
  const [shipId, setShipId] = useState('');
  const [year, setYear] = useState(2024);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Banking</h2>
        <p className="text-sm text-gray-500">FuelEU Article 20 — Banking</p>
      </div>

      {/* Ship selector */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600">Ship ID</label>
          <input
            type="text"
            value={shipId}
            onChange={(e) => {
              setShipId(e.target.value);
              setLoaded(false);
            }}
            placeholder="e.g. R002"
            className="mt-1 w-36 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setLoaded(false);
            }}
            className="mt-1 w-28 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setLoaded(true)}
          disabled={!shipId}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Load
        </button>
      </div>

      {loaded && <BankingContent shipId={shipId} year={year} />}
    </div>
  );
}
