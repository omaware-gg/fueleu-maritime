import { useState } from 'react';
import { usePool } from '@adapters/ui/hooks/usePoolHook';
import ErrorBanner from './shared/ErrorBanner';

function validationReason(memberCount: number, poolSum: number): string | null {
  if (memberCount < 2) return 'Pool must have at least 2 members';
  if (poolSum < 0) return `Pool sum CB is ${poolSum.toFixed(2)} — must be ≥ 0`;
  return null;
}

export default function PoolingTab(): JSX.Element {
  const {
    members,
    poolSum,
    isValid,
    poolResult,
    loading,
    error,
    addMember,
    removeMember,
    createPool,
  } = usePool();

  const [year, setYear] = useState(2025);
  const [shipInput, setShipInput] = useState('');
  const [cbInput, setCbInput] = useState('');

  const poolCreated = poolResult !== null;
  const reason = validationReason(members.length, poolSum);

  const handleAdd = () => {
    const cbVal = Number(cbInput);
    if (!shipInput.trim() || isNaN(cbVal)) return;
    if (members.some((m) => m.shipId === shipInput.trim())) return;
    addMember(shipInput.trim(), cbVal);
    setShipInput('');
    setCbInput('');
  };

  const getCbAfter = (shipId: string): number | null => {
    if (!poolResult) return null;
    const member = poolResult.members.find((m) => m.shipId === shipId);
    return member?.cbAfter ?? null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Pooling</h2>
        <p className="mt-0.5 text-sm text-slate-400">FuelEU Article 21 — Pooling</p>
      </div>

      {/* Year selector */}
      <div>
        <label htmlFor="pool-year" className="mb-1 block text-xs font-medium text-slate-500">Pool Year</label>
        <input
          id="pool-year"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          disabled={poolCreated}
          className="glass-input w-28"
        />
      </div>

      {/* Add member form */}
      <form
        className="glass inline-flex flex-wrap items-end gap-3 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <div>
          <label htmlFor="pool-ship" className="mb-1 block text-xs font-medium text-slate-500">Ship ID</label>
          <input
            id="pool-ship"
            type="text"
            value={shipInput}
            onChange={(e) => setShipInput(e.target.value)}
            placeholder="e.g. S1"
            disabled={poolCreated}
            className="glass-input w-32"
          />
        </div>
        <div>
          <label htmlFor="pool-cb" className="mb-1 block text-xs font-medium text-slate-500">CB Value (tCO₂e)</label>
          <input
            id="pool-cb"
            type="number"
            value={cbInput}
            onChange={(e) => setCbInput(e.target.value)}
            placeholder="e.g. -100"
            disabled={poolCreated}
            className="glass-input w-36"
          />
        </div>
        <button
          type="submit"
          disabled={poolCreated || !shipInput.trim() || isNaN(Number(cbInput))}
          className="btn-primary"
        >
          Add Member
        </button>
      </form>

      {/* Members table */}
      {members.length > 0 && (
        <div className="glass overflow-x-auto animate-fade-in">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60">
                {['Ship ID', 'CB Before', 'CB After', 'Action'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {members.map((m) => {
                const cbAfter = getCbAfter(m.shipId);
                return (
                  <tr key={m.shipId} className="transition-colors hover:bg-white/40">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {m.shipId}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 font-mono font-medium ${
                        m.cb >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {m.cb.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 font-mono font-medium ${
                        cbAfter === null
                          ? 'text-slate-300'
                          : cbAfter >= 0
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                      }`}
                    >
                      {cbAfter === null
                        ? '—'
                        : cbAfter.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => removeMember(m.shipId)}
                        disabled={poolCreated}
                        className="text-xs text-rose-500 transition-colors hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pool summary bar */}
      {members.length > 0 && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 backdrop-blur-sm transition-colors ${
            poolSum >= 0
              ? 'border-emerald-200/60 bg-emerald-50/50 text-emerald-700'
              : 'border-rose-200/60 bg-rose-50/50 text-rose-700'
          }`}
        >
          <span className="text-sm font-medium">
            Pool Sum CB:{' '}
            <span className="font-mono">
              {poolSum.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>{' '}
            tCO₂e
          </span>
          <span className="text-xs">
            {poolSum >= 0 && members.length >= 2
              ? '✓ Valid pool'
              : `✗ Invalid — ${reason}`}
          </span>
        </div>
      )}

      {/* Create pool button */}
      <div>
        <button
          onClick={() => createPool(year)}
          disabled={!isValid || loading || poolCreated}
          className="btn-primary px-6 py-2.5"
        >
          {loading ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Creating…
            </span>
          ) : (
            'Create Pool'
          )}
        </button>
        {!isValid && !poolCreated && reason && (
          <p className="mt-1.5 text-xs text-amber-500">{reason}</p>
        )}
      </div>

      {/* Success banner */}
      {poolCreated && (
        <div className="animate-slide-up rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-700 backdrop-blur-sm">
          <span className="mr-1">✓</span> Pool created · ID:{' '}
          <span className="font-mono font-medium">{poolResult.id}</span>
        </div>
      )}

      {/* Error banner */}
      {error && <ErrorBanner message={error} />}
    </div>
  );
}
