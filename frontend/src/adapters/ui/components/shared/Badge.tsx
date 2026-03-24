interface BadgeProps {
  compliant: boolean;
}

export default function Badge({ compliant }: BadgeProps): JSX.Element {
  return compliant ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/80 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/60">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Compliant
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50/80 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-200/60">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
      Non-compliant
    </span>
  );
}
