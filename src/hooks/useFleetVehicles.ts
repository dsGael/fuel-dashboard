import { useEffect, useState } from 'react';
import { getFleetVehicles } from '../api/client';
import type { FleetVehicle } from '../types';

export function useFleetVehicles(pollMs = 15000) {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = () => {
      getFleetVehicles()
        .then((data) => active && setVehicles(data))
        .finally(() => active && setLoading(false));
    };
    fetchData();
    const interval = setInterval(fetchData, pollMs);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [pollMs]);

  return { vehicles, loading };
}