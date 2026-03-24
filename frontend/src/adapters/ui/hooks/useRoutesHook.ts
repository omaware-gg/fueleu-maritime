import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@adapters/infrastructure/api/ApiContext';
import { Route, RouteFilters } from '@core/domain/Route';

export function useRoutes() {
  const { routePort } = useApi();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await routePort.getRoutes(filters);
      setRoutes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  }, [routePort, filters]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const handleSetBaseline = useCallback(
    async (routeId: string) => {
      try {
        await routePort.setBaseline(routeId);
        await fetchRoutes();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to set baseline');
      }
    },
    [routePort, fetchRoutes],
  );

  return {
    routes,
    loading,
    error,
    filters,
    setFilters,
    setBaseline: handleSetBaseline,
    refresh: fetchRoutes,
  };
}
