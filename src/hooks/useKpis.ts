import { useEffect, useState } from 'react';
import { getKpis } from '../api/client';
import type { Kpis } from '../types';

export function useKpis(params?: { startDate?: string; endDate?: string; imei?: string }) {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getKpis(params)
      .then((data) => active && setKpis(data))
      .catch(() => active && setError('No se pudieron cargar los KPIs'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.startDate, params?.endDate, params?.imei]);

  return { kpis, loading, error };
}