interface TabNavProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function TabNav({ tabs, active, onChange }: TabNavProps): JSX.Element {
  return (
    <nav className="flex space-x-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
            tab === active
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
