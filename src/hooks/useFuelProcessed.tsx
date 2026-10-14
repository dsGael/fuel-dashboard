import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import type { FuelProcessedQuery, FuelProcessedRecord } from '../types';
import { getFuelProcessedRecords } from '../api/client';

export function useFuelProcessed(params: FuelProcessedQuery = {}) {
  const [rows, setRows] = useState<FuelProcessedRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Clave estable para no depender de la identidad del objeto params
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getFuelProcessedRecords(JSON.parse(paramsKey) as FuelProcessedQuery, controller.signal)
      .then((res) => {
        setRows(res.rows);
        setTotal(res.total);
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return;
        const apiMsg = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
        setError(apiMsg ?? (err instanceof Error ? err.message : 'Error desconocido'));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [paramsKey, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { rows, total, loading, error, refetch };
}