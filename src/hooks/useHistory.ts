import { useEffect, useState } from 'react';
import { getHistory } from '../api/client';
import type { HistoryRecord } from '../types';

export function useHistory(imei: string | null, params?: { startDate?: string; endDate?: string }) {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imei) return;
    let active = true;
    setLoading(true);
    getHistory(imei, params)
      .then((data) => active && setHistory(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imei, params?.startDate, params?.endDate]);

  return { history, loading };
}