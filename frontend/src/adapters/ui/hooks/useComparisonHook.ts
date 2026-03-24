import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@adapters/infrastructure/api/ApiContext';
import { Route } from '@core/domain/Route';
import { RouteComparison } from '@core/domain/Comparison';

export function useComparison() {
  const { routePort } = useApi();
  const [baseline, setBaseline] = useState<Route | null>(null);
  const [comparisons, setComparisons] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await routePort.getComparison();
      setBaseline(result.baseline);
      setComparisons(result.comparisons);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch comparison');
    } finally {
      setLoading(false);
    }
  }, [routePort]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  return { baseline, comparisons, loading, error, refresh: fetchComparison };
}
