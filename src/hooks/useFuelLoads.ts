import { useEffect, useState } from 'react';
import { getFuelLoads } from '../api/client';
import type { FuelLoad } from '../types';

export function useFuelLoads(imeis: string[]) {
  const [loads, setLoads] = useState<FuelLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const key = imeis.join(',');

  useEffect(() => {
    if (!key) return;
    let active = true;
    setLoading(true);
    getFuelLoads({ imeis })
      .then((res) => active && setLoads(res))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { loads, loading };
}