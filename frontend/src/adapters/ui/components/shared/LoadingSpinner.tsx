export default function LoadingSpinner(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
      <p className="text-xs font-medium text-slate-400">Loading…</p>
    </div>
  );
}
