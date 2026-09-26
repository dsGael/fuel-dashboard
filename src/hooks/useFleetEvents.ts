import { useEffect, useState } from 'react';
import { getFleetEvents } from '../api/client';
import type { FleetEvent } from '../types';

export function useFleetEvents(imeis: string[], pollMs = 30000) {
  const [events, setEvents] = useState<FleetEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const key = imeis.join(',');

  useEffect(() => {
    if (!key) return;
    let active = true;
    const fetchData = () => {
      getFleetEvents({ imeis })
        .then((res) => active && setEvents(res))
        .finally(() => active && setLoading(false));
    };
    fetchData();
    const interval = setInterval(fetchData, pollMs);
    return () => {
      active = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, pollMs]);

  return { events, loading };
}