interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

const variantStyles: Record<string, string> = {
  default: 'border-gray-200 text-gray-900',
  success: 'border-green-400 text-green-700',
  danger: 'border-red-400 text-red-700',
  warning: 'border-amber-400 text-amber-700',
};

export default function KPICard({
  label,
  value,
  unit,
  variant = 'default',
}: KPICardProps): JSX.Element {
  const styles = variantStyles[variant] ?? variantStyles.default;

  return (
    <div className={`rounded-lg border-2 bg-white p-4 ${styles}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">
        {value}
        {unit && <span className="ml-1 text-sm font-normal">{unit}</span>}
      </p>
    </div>
  );
}
