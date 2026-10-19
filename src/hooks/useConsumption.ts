// En hooks/useConsumption.ts
import { useQuery } from '@tanstack/react-query';
import { getConsumption, getConsumptionYARIS, getFuelProcessedChart } from '../api/client';

export function useConsumption(imei: string | null, startDate?: string, endDate?: string) {
  return useQuery({
    // Agregamos las fechas a la llave para que React Query recargue cuando cambien
    queryKey: ['fuel_consumption', imei, startDate, endDate], 
    queryFn: () => getConsumption({ imei, startDate, endDate }),
    refetchInterval: 30000,
  });
}

export function useConsumptionYARIS(imei: string | null, startDate?: string, endDate?: string) {
  return useQuery({
    // Agregamos las fechas a la llave para que React Query recargue cuando cambien
    queryKey: ['fuel_consumption_YARIS', imei, startDate, endDate], 
    queryFn: () => getConsumptionYARIS({ imei, startDate, endDate }),
    refetchInterval: 30000,
  });
}

export function useFuelProcessedChart(imei: string | null, startDate?: string, endDate?: string) {
  return useQuery({
    // Agregamos las fechas a la llave para que React Query recargue cuando cambien
    queryKey: ['fuel_processed_chart', imei, startDate, endDate], 
    queryFn: () => getFuelProcessedChart({ imei, startDate, endDate }),
    refetchInterval: 30000,
  });
  }