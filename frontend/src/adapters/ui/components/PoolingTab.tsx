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

  const inputClass =
    'rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Pooling</h2>
        <p className="text-sm text-gray-500">FuelEU Article 21 — Pooling</p>
      </div>

      {/* Year selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600">Pool Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          disabled={poolCreated}
          className={`mt-1 w-28 ${inputClass} disabled:bg-gray-100`}
        />
      </div>

      {/* Add member form */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600">Ship ID</label>
          <input
            type="text"
            value={shipInput}
            onChange={(e) => setShipInput(e.target.value)}
            placeholder="e.g. S1"
            disabled={poolCreated}
            className={`mt-1 w-32 ${inputClass} disabled:bg-gray-100`}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">CB Value (tCO₂e)</label>
          <input
            type="number"
            value={cbInput}
            onChange={(e) => setCbInput(e.target.value)}
            placeholder="e.g. -100"
            disabled={poolCreated}
            className={`mt-1 w-36 ${inputClass} disabled:bg-gray-100`}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={poolCreated || !shipInput.trim() || isNaN(Number(cbInput))}
          className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Member
        </button>
      </div>

      {/* Members table */}
      {members.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Ship ID', 'CB Before', 'CB After', 'Action'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-left font-medium text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((m, idx) => {
                const cbAfter = getCbAfter(m.shipId);
                return (
                  <tr key={m.shipId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                      {m.shipId}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 font-medium ${
                        m.cb >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {m.cb.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 font-medium ${
                        cbAfter === null
                          ? 'text-gray-400'
                          : cbAfter >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
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
                        className="text-sm text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-40"
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
          className={`flex items-center justify-between rounded-lg border p-4 ${
            poolSum >= 0
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <span className="font-medium">
            Pool Sum CB: {poolSum.toLocaleString(undefined, { maximumFractionDigits: 2 })} tCO₂e
          </span>
          <span className="text-sm">
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
          className="w-full rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <span className="inline-flex items-center">
              <span className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating…
            </span>
          ) : (
            'Create Pool'
          )}
        </button>
        {!isValid && !poolCreated && reason && (
          <p className="mt-1 text-xs text-amber-600">{reason}</p>
        )}
      </div>

      {/* Success banner */}
      {poolCreated && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          Pool created · ID: <span className="font-mono font-medium">{poolResult.id}</span>
        </div>
      )}

      {/* Error banner */}
      {error && <ErrorBanner message={error} />}
    </div>
  );
}
