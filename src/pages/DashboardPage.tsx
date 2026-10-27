import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useVehicleSelection } from '../context/VehicleSelectionContext';
import RecordsTable from '../components/table/RecordsTable';
import { getRecords } from '../api/client';
import { ConsumptionChartCard } from '../components/charts/ConsumptionChartCard';
import { useConsumption, useFuelProcessedChart } from '../hooks/useConsumption';
import { VehicleSelector } from '../components/controls/VehicleSelector';
import { DateRangePicker } from '../components/controls/DateRangePicker';
import type { GpsRecord } from '../types';
import { ProcessedChartCard } from '../components/charts/FuelProcessedChart';
import { FuelProcessedTable } from '../components/table/FuelProcessedTable';
import { useFuelProcessed } from '../hooks/useFuelProcessed';

const PAGE_SIZE = 50;

export function DashboardPage() {
   const { selectedImei } = useVehicleSelection();

const [dateRange, setDateRange] = useState(() => {
    const hoy = new Date();
    const hoyString = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    return {
      start: hoyString,
      end: hoyString 
    };
    });

  const startDateTime = `${dateRange.start}T00:00:00.000`;
  const endDateTime = `${dateRange.end}T23:59:59.999`;
  
const { data: consumption = [],
   isLoading: isLoadingConsumption } = useConsumption(selectedImei, startDateTime, endDateTime);

   

  const { data: fuelProcessed = [],
   isLoading: isLoadingFuelProcessed } = useFuelProcessedChart(selectedImei, startDateTime, endDateTime);

  const { 
    data: records = [], 
    isFetching: isLoadingRecords, 
    error: errorRecords 
  } = useQuery<GpsRecord[]>({
    queryKey: ['gps_records', selectedImei, startDateTime, endDateTime],
    queryFn: () => getRecords({ limit: 2000, imei: selectedImei, startDate: startDateTime, endDate: endDateTime }),
    refetchInterval: 30000,
  });

  const [page, setPage] = useState(0);
  const [prevImei, setPrevImei] = useState(selectedImei);
  if (prevImei !== selectedImei) {
    setPrevImei(selectedImei);
    setPage(0);
  }
  const { rows, total, loading, error, refetch } = useFuelProcessed({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    ...(selectedImei ? { imei: selectedImei } : {}),
  });


 
  const errorMessageRecords = errorRecords instanceof Error ? errorRecords.message : null;
return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard General</h1>
          <p className="text-sm text-slate-400">Resumen de tu flota</p>
        </div>
        
        <div className="flex items-end gap-4 flex-wrap">
          <VehicleSelector />
          <DateRangePicker 
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={(start, end) => setDateRange({ start, end })}
          />
        </div>
      </header>
     
           EN LITROS
           {isLoadingFuelProcessed ? (
          <div className="flex items-center justify-center h-85 rounded-2xl bg-slate-800/20 border border-border">
            <span className="text-sm text-slate-500">Cargando niveles de combustible...</span>
          </div>
        ) : (
          <ProcessedChartCard data={fuelProcessed} selectedImei={selectedImei} yMax={65} yMin={0} />
        )}
        

         SENSOR CRUDO
             {isLoadingConsumption ? (
          <div className="flex items-center justify-center h-85 rounded-2xl bg-slate-800/20 border border-border">
            <span className="text-sm text-slate-500">Cargando niveles de combustible...</span>
          </div>
        ) : (
          <ConsumptionChartCard data={consumption} yMin={0} yMax={3000}  />
        )}



      <FuelProcessedTable
        rows={rows}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        loading={loading}
        error={error}
        onPageChange={setPage}
        onRefresh={refetch}
      />

      <RecordsTable 
        records={records} 
        loading={isLoadingRecords} 
        error={errorMessageRecords} 
      />      
    </div> 
  );
}
