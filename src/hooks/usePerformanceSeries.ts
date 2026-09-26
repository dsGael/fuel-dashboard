import { useEffect, useState } from 'react';
import { getPerformanceSeries } from '../api/client';
import type { PerformanceSeriesResponse } from '../types';

export function usePerformanceSeries(imeis: string[]) {
  const [data, setData] = useState<PerformanceSeriesResponse>({ series: [], imeis: [] });
  const [loading, setLoading] = useState(true);
  const key = imeis.join(',');

  useEffect(() => {
    if (!key) return;
    let active = true;
    setLoading(true);
    getPerformanceSeries({ imeis })
      .then((res) => active && setData(res))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading };
}