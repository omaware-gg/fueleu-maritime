import { useState } from 'react';
import { ApiProvider } from '@adapters/infrastructure/api/ApiContext';
import TabNav from '@adapters/ui/components/shared/TabNav';
import RoutesTab from '@adapters/ui/components/RoutesTab';
import CompareTab from '@adapters/ui/components/CompareTab';
import BankingTab from '@adapters/ui/components/BankingTab';
import PoolingTab from '@adapters/ui/components/PoolingTab';

const TABS = ['Routes', 'Compare', 'Banking', 'Pooling'];

export default function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState('Routes');

  return (
    <ApiProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">FuelEU Maritime Dashboard</h1>
          <p className="text-sm text-gray-500">Compliance Balance · Banking · Pooling</p>
        </header>
        <div className="border-b border-gray-200 bg-white px-6">
          <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>
        <main className="px-6 py-6">
          {activeTab === 'Routes' && <RoutesTab />}
          {activeTab === 'Compare' && <CompareTab />}
          {activeTab === 'Banking' && <BankingTab />}
          {activeTab === 'Pooling' && <PoolingTab />}
        </main>
      </div>
    </ApiProvider>
  );
}
