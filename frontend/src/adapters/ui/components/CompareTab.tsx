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

  const allGhg = chartData.map((d) => d.ghg).concat(TARGET_GHG_INTENSITY);
  const chartMin = Math.floor(Math.min(...allGhg) - 2);
  const chartMax = Math.ceil(Math.max(...allGhg) + 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Compare</h2>
        <p className="mt-0.5 text-sm text-slate-400">
          Route GHG intensity comparison against baseline
        </p>
      </div>

      {/* Baseline info card */}
      <div className="glass p-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Baseline Route
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
          {[
            ['Route ID', baseline.routeId],
            ['Vessel', baseline.vesselType],
            ['Fuel', baseline.fuelType],
            ['Year', baseline.year],
          ].map(([lbl, val]) => (
            <div key={String(lbl)}>
              <span className="text-slate-400">{lbl}: </span>
              <span className="font-medium text-slate-800">{val}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-6 border-t border-slate-200/50 pt-3 text-sm">
          <div>
            <span className="text-slate-400">GHG Intensity: </span>
            <span className="font-mono font-semibold text-slate-900">
              {baseline.ghgIntensity.toFixed(4)}
            </span>
            <span className="ml-0.5 text-slate-400">gCO₂e/MJ</span>
          </div>
          <div>
            <span className="text-slate-400">Target: </span>
            <span className="font-mono font-semibold text-slate-900">{TARGET_GHG_INTENSITY}</span>
            <span className="ml-0.5 text-slate-400">gCO₂e/MJ</span>
          </div>
          <Badge compliant={baselineCompliant} />
        </div>
      </div>

      {/* Bar chart */}
      <div className="glass p-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[chartMin, chartMax]}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(226,232,240,0.6)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value} gCO₂e/MJ`, 'GHG Intensity']}
            />
            <ReferenceLine
              y={TARGET_GHG_INTENSITY}
              stroke="#f43f5e"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{ value: `Target ${TARGET_GHG_INTENSITY}`, fill: '#f43f5e', fontSize: 11 }}
            />
            <Bar dataKey="ghg" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={entry.name} fill={idx === 0 ? '#6366f1' : '#14b8a6'} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison table */}
      <div className="glass overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/60">
              {['Route ID', 'GHG Intensity', 'vs Baseline (%)', 'Compliant'].map((h) => (
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
            {/* Baseline row */}
            <tr className="bg-blue-50/30">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                {baseline.routeId}
                <span className="ml-2 inline-flex items-center rounded-md bg-blue-100/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                  Baseline
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-600">
                {baseline.ghgIntensity.toFixed(4)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-300">—</td>
              <td className="whitespace-nowrap px-4 py-3">
                <Badge compliant={baselineCompliant} />
              </td>
            </tr>

            {/* Comparison rows */}
            {comparisons.map((c) => {
              const positive = c.percentDiff > 0;
              return (
                <tr key={c.comparisonRouteId} className="transition-colors hover:bg-white/40">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                    {c.comparisonRouteId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-600">
                    {c.comparisonGhg.toFixed(4)}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-3 font-mono font-medium ${
                      positive ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {`${positive ? '+' : ''}${c.percentDiff.toFixed(2)}%`}
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
