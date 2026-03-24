import { useState } from 'react';
import { useRoutes } from '@adapters/ui/hooks/useRoutesHook';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorBanner from './shared/ErrorBanner';
import { VESSEL_TYPES, FUEL_TYPES, YEARS } from '@shared/constants';

const selectClass =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export default function RoutesTab(): JSX.Element {
  const { routes, loading, error, filters, setFilters, setBaseline } = useRoutes();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleSetBaseline = async (routeId: string) => {
    setPendingId(routeId);
    await setBaseline(routeId);
    setPendingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Routes</h2>
        <p className="text-sm text-gray-500">FuelEU route data</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          value={filters.vesselType ?? 'All'}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              vesselType: e.target.value === 'All' ? undefined : e.target.value,
            }))
          }
          className={selectClass}
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
          className={selectClass}
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
          className={selectClass}
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Route ID',
                  'Vessel Type',
                  'Fuel Type',
                  'Year',
                  'GHG Intensity (gCO₂e/MJ)',
                  'Fuel Consumption (t)',
                  'Distance (km)',
                  'Total Emissions (t)',
                  'Action',
                ].map((h) => (
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
              {routes.map((route, idx) => (
                <tr
                  key={route.id}
                  className={
                    route.isBaseline
                      ? 'bg-blue-50'
                      : idx % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50'
                  }
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {route.routeId}
                    {route.isBaseline && (
                      <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Baseline
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{route.vesselType}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{route.fuelType}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{route.year}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {route.ghgIntensity.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {route.fuelConsumption.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {route.distanceKm.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {route.totalEmissions.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {route.isBaseline ? (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                        ✓ Baseline
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetBaseline(route.routeId)}
                        disabled={pendingId === route.routeId}
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {pendingId === route.routeId ? (
                          <>
                            <span className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Setting…
                          </>
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
