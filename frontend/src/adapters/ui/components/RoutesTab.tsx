import { useState } from 'react';
import { useRoutes } from '@adapters/ui/hooks/useRoutesHook';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorBanner from './shared/ErrorBanner';
import { VESSEL_TYPES, FUEL_TYPES, YEARS } from '@shared/constants';

export default function RoutesTab(): JSX.Element {
  const { routes, loading, error, filters, setFilters, setBaseline } = useRoutes();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleSetBaseline = async (routeId: string) => {
    setPendingId(routeId);
    try {
      await setBaseline(routeId);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Routes</h2>
        <p className="mt-0.5 text-sm text-slate-400">FuelEU route data</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.vesselType ?? 'All'}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              vesselType: e.target.value === 'All' ? undefined : e.target.value,
            }))
          }
          className="glass-select w-44"
        >
          {VESSEL_TYPES.map((v) => (
            <option key={v} value={v}>
              {v === 'All' ? 'All Vessel Types' : v}
            </option>
          ))}
        </select>

        <select
          value={filters.fuelType ?? 'All'}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              fuelType: e.target.value === 'All' ? undefined : e.target.value,
            }))
          }
          className="glass-select w-40"
        >
          {FUEL_TYPES.map((v) => (
            <option key={v} value={v}>
              {v === 'All' ? 'All Fuel Types' : v}
            </option>
          ))}
        </select>

        <select
          value={filters.year ?? 'All'}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              year: e.target.value === 'All' ? undefined : Number(e.target.value),
            }))
          }
          className="glass-select w-32"
        >
          {YEARS.map((v) => (
            <option key={v} value={v}>
              {v === 'All' ? 'All Years' : v}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} />}

      {!loading && !error && (
        <div className="glass overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60">
                {[
                  { label: 'Route ID', align: 'left' },
                  { label: 'Vessel Type', align: 'left' },
                  { label: 'Fuel Type', align: 'left' },
                  { label: 'Year', align: 'left' },
                  { label: 'GHG Intensity (gCO₂e/MJ)', align: 'right' },
                  { label: 'Fuel Consumption (t)', align: 'right' },
                  { label: 'Distance (km)', align: 'right' },
                  { label: 'Total Emissions (t)', align: 'right' },
                  { label: 'Action', align: 'left' },
                ].map((h) => (
                  <th
                    key={h.label}
                    className={`whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400 ${h.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {routes.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">
                    No routes found. Adjust your filters or add route data.
                  </td>
                </tr>
              )}
              {routes.map((route) => (
                <tr
                  key={route.id}
                  className={`transition-colors ${
                    route.isBaseline
                      ? 'bg-blue-50/40'
                      : 'hover:bg-white/40'
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                    {route.routeId}
                    {route.isBaseline && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-blue-100/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                        Baseline
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{route.vesselType}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{route.fuelType}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{route.year}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sm text-slate-600">
                    {route.ghgIntensity.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600">
                    {route.fuelConsumption.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600">
                    {route.distanceKm.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600">
                    {route.totalEmissions.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {route.isBaseline ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                        <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        ✓ Baseline
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetBaseline(route.routeId)}
                        disabled={pendingId === route.routeId}
                        className="btn-ghost py-1 text-xs"
                      >
                        {pendingId === route.routeId ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                            Setting…
                          </span>
                        ) : (
                          'Set Baseline'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
