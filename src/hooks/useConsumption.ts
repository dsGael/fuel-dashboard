// En hooks/useConsumption.ts
import { useQuery } from '@tanstack/react-query';
import { getConsumption, getConsumptionYARIS, getFuelProcessedChart } from '../api/client';

export function useConsumption(imeis: string[], startDate?: string, endDate?: string) {
  return useQuery({
    // Agregamos las fechas a la llave para que React Query recargue cuando cambien
    queryKey: ['fuel_consumption', imeis.join(','), startDate, endDate], 
    queryFn: () => getConsumption({ imeis, startDate, endDate }),
    refetchInterval: 30000,
  });
}

export function useConsumptionYARIS(imeis: string[], startDate?: string, endDate?: string) {
  return useQuery({
    // Agregamos las fechas a la llave para que React Query recargue cuando cambien
    queryKey: ['fuel_consumption_YARIS', imeis.join(','), startDate, endDate], 
    queryFn: () => getConsumptionYARIS({ imeis, startDate, endDate }),
    refetchInterval: 30000,
  });
}

export function useFuelProcessedChart(imeis: string[], startDate?: string, endDate?: string) {
  return useQuery({
    // Agregamos las fechas a la llave para que React Query recargue cuando cambien
    queryKey: ['fuel_processed_chart', imeis.join(','), startDate, endDate], 
    queryFn: () => getFuelProcessedChart({ imeis, startDate, endDate }),
    refetchInterval: 30000,
  });
  }