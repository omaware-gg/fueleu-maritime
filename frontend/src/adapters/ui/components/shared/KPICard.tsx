interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

const variantAccent: Record<string, string> = {
  default: 'text-slate-900',
  success: 'text-emerald-600',
  danger: 'text-rose-600',
  warning: 'text-amber-600',
};

const variantDot: Record<string, string> = {
  default: 'bg-slate-300',
  success: 'bg-emerald-400',
  danger: 'bg-rose-400',
  warning: 'bg-amber-400',
};

export default function KPICard({
  label,
  value,
  unit,
  variant = 'default',
}: KPICardProps): JSX.Element {
  const accent = variantAccent[variant] ?? variantAccent.default;
  const dot = variantDot[variant] ?? variantDot.default;

  return (
    <div className="glass-subtle p-4">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      </div>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${accent}`}>
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-slate-400">{unit}</span>}
      </p>
    </div>
  );
}
