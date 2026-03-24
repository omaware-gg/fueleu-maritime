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
    try {
      await bankSurplus(Number(bankAmount));
    } finally {
      setBankPending(false);
    }
  };

  const handleApply = async () => {
    setApplyPending(true);
    try {
      await applyBanked(Number(applyAmount));
    } finally {
      setApplyPending(false);
    }
  };

  if (loading && cb === null) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
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
              value={cb > 0 ? 'Surplus' : cb === 0 ? 'Balanced' : 'Deficit'}
              variant={cb > 0 ? 'success' : cb === 0 ? 'default' : 'danger'}
            />
          </div>

          {/* Bank Surplus */}
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-slate-800">Bank Surplus</h3>
            <p className="mb-4 text-xs text-slate-400">
              Article 20.1 — Set aside surplus for future use
            </p>
            <div className="flex items-end gap-3">
              <div className="flex-1 max-w-[200px]">
                <label htmlFor="bank-amount" className="mb-1 block text-xs font-medium text-slate-500">
                  Amount (tCO₂e)
                </label>
                <input
                  id="bank-amount"
                  type="number"
                  value={bankAmount}
                  onChange={(e) => setBankAmount(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <div>
                <button
                  onClick={handleBank}
                  disabled={cb <= 0 || !bankAmount || Number(bankAmount) <= 0 || bankPending}
                  className="btn-primary"
                >
                  {bankPending ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Banking…
                    </span>
                  ) : (
                    'Bank Surplus'
                  )}
                </button>
                {cb <= 0 && (
                  <p className="mt-1 text-xs text-amber-500">CB must be positive to bank</p>
                )}
              </div>
            </div>

            {actionResult?.banked !== undefined && (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

          {/* Apply Banked Surplus */}
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-slate-800">Apply Banked Surplus</h3>
            <p className="mb-4 text-xs text-slate-400">
              Article 20.2 — Use banked surplus to offset a deficit
            </p>
            <div className="flex items-end gap-3">
              <div className="flex-1 max-w-[200px]">
                <label htmlFor="apply-amount" className="mb-1 block text-xs font-medium text-slate-500">
                  Amount (tCO₂e)
                </label>
                <input
                  id="apply-amount"
                  type="number"
                  value={applyAmount}
                  onChange={(e) => setApplyAmount(e.target.value)}
                  className="glass-input w-full"
                />
              </div>
              <button
                onClick={handleApply}
                disabled={availableBanked <= 0 || !applyAmount || Number(applyAmount) <= 0 || applyPending}
                className="btn-primary"
              >
                {applyPending ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Applying…
                  </span>
                ) : (
                  'Apply to Deficit'
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Available banked: <span className="font-medium text-slate-600">{formatCb(availableBanked)} tCO₂e</span>
            </p>

            {actionResult?.applied !== undefined && (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Banking</h2>
        <p className="mt-0.5 text-sm text-slate-400">FuelEU Article 20 — Banking</p>
      </div>

      {/* Ship selector */}
      <form
        className="glass inline-flex items-end gap-4 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (shipId) setLoaded(true);
        }}
      >
        <div>
          <label htmlFor="banking-ship" className="mb-1 block text-xs font-medium text-slate-500">Ship ID</label>
          <input
            id="banking-ship"
            type="text"
            value={shipId}
            onChange={(e) => {
              setShipId(e.target.value);
              setLoaded(false);
            }}
            placeholder="e.g. R002"
            className="glass-input w-36"
          />
        </div>
        <div>
          <label htmlFor="banking-year" className="mb-1 block text-xs font-medium text-slate-500">Year</label>
          <input
            id="banking-year"
            type="number"
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setLoaded(false);
            }}
            className="glass-input w-24"
          />
        </div>
        <button
          type="submit"
          disabled={!shipId}
          className="btn-primary"
        >
          Load
        </button>
      </form>

      {loaded && <BankingContent shipId={shipId} year={year} />}
    </div>
  );
}
