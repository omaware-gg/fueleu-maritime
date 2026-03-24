import { useState } from 'react';
import { ApiProvider } from '@adapters/infrastructure/api/ApiContext';
import ErrorBoundary from '@adapters/ui/components/shared/ErrorBoundary';
import TabNav from '@adapters/ui/components/shared/TabNav';
import RoutesTab from '@adapters/ui/components/RoutesTab';
import CompareTab from '@adapters/ui/components/CompareTab';
import BankingTab from '@adapters/ui/components/BankingTab';
import PoolingTab from '@adapters/ui/components/PoolingTab';

const TABS = ['Routes', 'Compare', 'Banking', 'Pooling'];

export default function App(): JSX.Element {
  const [activeTab, setActiveTab] = useState('Routes');

  return (
    <ErrorBoundary>
      <ApiProvider>
        <div className="min-h-screen">
          {/* Header */}
          <header className="glass sticky top-0 z-30 mx-auto rounded-none border-x-0 border-t-0">
            <div className="mx-auto max-w-7xl px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                    FuelEU Maritime
                  </h1>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Compliance Balance · Banking · Pooling
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="mx-auto max-w-7xl px-6 py-8">
            <div className="animate-fade-in">
              {activeTab === 'Routes' && <RoutesTab />}
              {activeTab === 'Compare' && <CompareTab />}
              {activeTab === 'Banking' && <BankingTab />}
              {activeTab === 'Pooling' && <PoolingTab />}
            </div>
          </main>
        </div>
      </ApiProvider>
    </ErrorBoundary>
  );
}
