interface TabNavProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function TabNav({ tabs, active, onChange }: TabNavProps): JSX.Element {
  return (
    <nav role="tablist" aria-label="Dashboard sections" className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={tab === active}
          onClick={() => onChange(tab)}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
            tab === active
              ? 'bg-white/80 text-slate-900 shadow-sm'
              : 'text-slate-500 hover:bg-white/40 hover:text-slate-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
