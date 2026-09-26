import { useEffect, useState } from 'react';
import { getFleetSummary } from '../api/client';
import type { FleetSummary } from '../types';

export function useFleetSummary() {
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getFleetSummary()
      .then((data) => active && setSummary(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { summary, loading };
}