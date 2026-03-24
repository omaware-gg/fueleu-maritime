import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@adapters/infrastructure/api/ApiContext';
import { BankEntry, BankingResult } from '@core/domain/Compliance';

export function useBanking(shipId: string, year: number) {
  const { compliancePort, bankingPort } = useApi();
  const [cb, setCb] = useState<number | null>(null);
  const [energyMj, setEnergyMj] = useState<number | null>(null);
  const [records, setRecords] = useState<BankEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<BankingResult | null>(null);

  const fetchData = useCallback(async () => {
    if (!shipId || !year) return;
    setLoading(true);
    setError(null);
    try {
      const [cbResult, bankRecords] = await Promise.all([
        compliancePort.getCB(shipId, year),
        bankingPort.getRecords(shipId, year),
      ]);
      setCb(cbResult.cb);
      setEnergyMj(cbResult.energyMj);
      setRecords(bankRecords);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch banking data');
    } finally {
      setLoading(false);
    }
  }, [compliancePort, bankingPort, shipId, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBankSurplus = useCallback(
    async (amount: number) => {
      setError(null);
      try {
        const result = await bankingPort.bankSurplus(shipId, year, amount);
        setActionResult(result);
        await fetchData();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to bank surplus');
      }
    },
    [bankingPort, shipId, year, fetchData],
  );

  const handleApplyBanked = useCallback(
    async (amount: number) => {
      setError(null);
      try {
        const result = await bankingPort.applyBanked(shipId, year, amount);
        setActionResult(result);
        await fetchData();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to apply banked surplus');
      }
    },
    [bankingPort, shipId, year, fetchData],
  );

  return {
    cb,
    energyMj,
    records,
    loading,
    error,
    actionResult,
    bankSurplus: handleBankSurplus,
    applyBanked: handleApplyBanked,
    refresh: fetchData,
  };
}
