import { useEffect, useState } from 'react';
import { getConsumption } from '../api/client';
import type { ConsumptionPoint } from '../types';

export function useConsumption(imeis: string[]) {
  const [data, setData] = useState<ConsumptionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const key = imeis.join(',');

  useEffect(() => {
    if (!key) return;
    let active = true;
    setLoading(true);
    getConsumption({ imeis })
      .then((res) => active && setData(res))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading };
}