import { useEffect, useState } from 'react';
import { getLowPerformance } from '../api/client';
import type { LowPerformanceUnit } from '../types';

export function useLowPerformance() {
  const [units, setUnits] = useState<LowPerformanceUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getLowPerformance()
      .then((res) => active && setUnits(res))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { units, loading };
}