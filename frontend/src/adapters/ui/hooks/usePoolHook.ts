import { useState, useCallback, useMemo } from 'react';
import { useApi } from '@adapters/infrastructure/api/ApiContext';
import { Pool } from '@core/domain/Compliance';

interface PoolMemberInput {
  shipId: string;
  cb: number;
}

export function usePool() {
  const { poolPort } = useApi();
  const [members, setMembers] = useState<PoolMemberInput[]>([]);
  const [poolResult, setPoolResult] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const poolSum = useMemo(() => members.reduce((s, m) => s + m.cb, 0), [members]);
  const isValid = useMemo(() => poolSum >= 0 && members.length >= 2, [poolSum, members.length]);

  const addMember = useCallback((shipId: string, cb: number) => {
    setMembers((prev) => [...prev, { shipId, cb }]);
  }, []);

  const removeMember = useCallback((shipId: string) => {
    setMembers((prev) => prev.filter((m) => m.shipId !== shipId));
  }, []);

  const handleCreatePool = useCallback(
    async (year: number) => {
      setError(null);
      setLoading(true);
      try {
        const result = await poolPort.createPool(year, members);
        setPoolResult(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create pool');
      } finally {
        setLoading(false);
      }
    },
    [poolPort, members],
  );

  return {
    members,
    poolSum,
    isValid,
    poolResult,
    loading,
    error,
    addMember,
    removeMember,
    createPool: handleCreatePool,
  };
}
