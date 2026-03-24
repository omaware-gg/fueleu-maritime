import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useComparison } from '@adapters/ui/hooks/useComparisonHook';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorBanner from './shared/ErrorBanner';
import Badge from './shared/Badge';
import { TARGET_GHG_INTENSITY } from '@shared/constants';

export default function CompareTab(): JSX.Element {
  const { baseline, comparisons, loading, error } = useComparison();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!baseline) return <ErrorBanner message="No baseline route set. Set one in the Routes tab." />;

  const baselineCompliant = baseline.ghgIntensity <= TARGET_GHG_INTENSITY;

  const chartData = [
    { name: baseline.routeId, ghg: baseline.ghgIntensity },
    ...comparisons.map((c) => ({ name: c.comparisonRouteId, ghg: c.comparisonGhg })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Compare</h2>
        <p className="text-sm text-gray-500">Route GHG intensity comparison against baseline</p>
      </div>

      {/* Baseline info card */}
      <div className="rounded-lg border-2 border-blue-400 bg-white p-5">
        <p className="text-sm font-medium text-blue-600">Baseline Route</p>
        <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
          <div>
            <span className="text-gray-500">Route ID: </span>
            <span className="font-medium text-gray-900">{baseline.routeId}</span>
          </div>
          <div>
            <span className="text-gray-500">Vessel: </span>
            <span className="font-medium text-gray-900">{baseline.vesselType}</span>
          </div>
          <div>
            <span className="text-gray-500">Fuel: </span>
            <span className="font-medium text-gray-900">{baseline.fuelType}</span>
          </div>
          <div>
            <span className="text-gray-500">Year: </span>
            <span className="font-medium text-gray-900">{baseline.year}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
          <div>
            <span className="text-gray-500">GHG Intensity: </span>
            <span className="font-semibold text-gray-900">
              {baseline.ghgIntensity.toFixed(4)} gCO₂e/MJ
            </span>
          </div>
          <div>
            <span className="text-gray-500">Target: </span>
            <span className="font-semibold text-gray-900">{TARGET_GHG_INTENSITY} gCO₂e/MJ</span>
          </div>
          <div>
            <span className="text-gray-500">Status: </span>
            <Badge compliant={baselineCompliant} />
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[85, 96]}
              tick={{ fontSize: 12 }}
              label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} gCO₂e/MJ`, 'GHG Intensity']}
            />
            <ReferenceLine
              y={TARGET_GHG_INTENSITY}
              stroke="#EF4444"
              strokeDasharray="4 4"
              label={{ value: 'Target 89.34', fill: '#EF4444', fontSize: 12 }}
            />
            <Bar dataKey="ghg" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={entry.name} fill={idx === 0 ? '#3B82F6' : '#14B8A6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Route ID', 'GHG Intensity', 'vs Baseline (%)', 'Compliant'].map((h) => (
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
            {/* Baseline row */}
            <tr className="bg-blue-50">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                {baseline.routeId}
                <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  Baseline
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {baseline.ghgIntensity.toFixed(4)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-400">—</td>
              <td className="whitespace-nowrap px-4 py-3">
                <Badge compliant={baselineCompliant} />
              </td>
            </tr>

            {/* Comparison rows */}
            {comparisons.map((c, idx) => {
              const positive = c.percentDiff > 0;
              return (
                <tr key={c.comparisonRouteId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {c.comparisonRouteId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                    {c.comparisonGhg.toFixed(4)}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-3 font-medium ${
                      positive ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {positive ? '+' : ''}
                    {c.percentDiff.toFixed(2)}%
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge compliant={c.compliant} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
