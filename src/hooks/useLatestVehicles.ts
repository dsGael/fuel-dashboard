import { useEffect, useState } from 'react';
import { getLatestVehicles } from '../api/client';
import type { VehicleLatest } from '../types';

export function useLatestVehicles(pollMs = 15000) {
  const [vehicles, setVehicles] = useState<VehicleLatest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const data = await getLatestVehicles();
        if (active) setVehicles(data);
      } catch {
        if (active) setError('No se pudo cargar la flota');
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, pollMs);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [pollMs]);

  return { vehicles, loading, error };
}