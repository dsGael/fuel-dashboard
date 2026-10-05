import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useVehicleSelection, VehicleSelectionProvider } from './context/VehicleSelectionContext';
import { VehicleSelector } from './components/controls/VehicleSelector';
// import { KpiGrid } from './components/kpi/KpiGrid';
// import { MultiLineChartCard } from './components/charts/MultiLineChartCard';
// import { ConsumptionChartCard } from './components/charts/ConsumptionChartCard';
// import { EventsPanel } from './components/events/EventsPanel';
// import { FuelLoadsTable } from './components/table/FuelLoadsTable';
// import { LowPerformanceTable } from './components/table/LowPerformanceTable';
// import { useFleetSummary } from './hooks/useFleetSummary';
// import { usePerformanceSeries } from './hooks/usePerformanceSeries';
// import { useFleetEvents } from './hooks/useFleetEvents';
// import { useFuelLoads } from './hooks/useFuelLoads';
// import { useLowPerformance } from './hooks/useLowPerformance';
import RecordsTable from './components/table/RecordsTable';
import Fuel5MinTable from './components/table/Fuel5MinTable';
import GpsMap from './components/maps/GpsMap';

import type { Fuel5MinRecord, GpsRecord } from './types'; 
import { getRecords, getFuel5MinRecords } from './api/client';
import { ConsumptionChartCard } from './components/charts/ConsumptionChartCard';
import { useConsumption } from './hooks/useConsumption';
import { useState } from 'react';
import { DateRangePicker } from './components/controls/DateRangePicker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});

function Dashboard() {
   const { imeis } = useVehicleSelection();

const [dateRange, setDateRange] = useState(() => {
    const hoy = new Date();
    const hoyString = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    // Por defecto mostrará solo hoy, pero puedes cambiarlo a que muestre 
    // la última semana restando 7 días a la fecha de inicio
    return {
      start: hoyString,
      end: hoyString 
    };
    });

  const startDateTime = `${dateRange.start}T00:00:00.000`;
  const endDateTime = `${dateRange.end}T23:59:59.999`;
  
  // const { summary } = useFleetSummary();
  // const { data: perf } = usePerformanceSeries(imeis);
const { data: consumption = [], isLoading: isLoadingConsumption } = useConsumption(imeis, startDateTime, endDateTime);  // const { events } = useFleetEvents(imeis);
  // const { loads } = useFuelLoads(imeis);
  // const { units } = useLowPerformance();

  // 1. Query para los registros CRUDOS originales
  const { 
    data: records = [], 
    isFetching: isLoadingRecords, 
    error: errorRecords 
  } = useQuery<GpsRecord[]>({
    queryKey: ['gps_records'],
    queryFn: () => getRecords({ limit: 2000, startDate: startDateTime, endDate: endDateTime }),
    refetchInterval: 30000,
  });

  // 2. NUEVO Query para los registros PROCESADOS de 5 minutos
  const {
    data: fuel5MinRecords = [],
    isFetching: isLoadingFuel5Min,
    error: errorFuel5Min
  } = useQuery<Fuel5MinRecord[]>({
    queryKey: ['fuel_5min_records'],
    queryFn: () => getFuel5MinRecords({ limit: 1000, startDate: startDateTime, endDate: endDateTime }),
    refetchInterval: 30000,
  });

 
  // Parseo de errores
  const errorMessageRecords = errorRecords instanceof Error ? errorRecords.message : null;
  const errorMessageFuel5Min = errorFuel5Min instanceof Error ? errorFuel5Min.message : null;
return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard General</h1>
          <p className="text-sm text-slate-400">Resumen de tu flota</p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          {/* 5. Inyectamos tu nuevo componente */}
          <DateRangePicker 
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={(start, end) => setDateRange({ start, end })}
          />
          <VehicleSelector />
        </div>
      </header>
     


             {isLoadingConsumption ? (
          <div className="flex items-center justify-center h-[340px] rounded-2xl bg-slate-800/20 border border-border">
            <span className="text-sm text-slate-500">Cargando niveles de combustible...</span>
          </div>
        ) : (
          <ConsumptionChartCard data={consumption} />
        )}
        
      <Fuel5MinTable
        records={fuel5MinRecords}
        loading={isLoadingFuel5Min}
        error={errorMessageFuel5Min}
      />  
      
      <RecordsTable 
        records={records} 
        loading={isLoadingRecords} 
        error={errorMessageRecords} 
      />      

     {!isLoadingRecords && !errorMessageRecords && (
        <GpsMap records={records} />
                )}


      {/* <KpiGrid summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MultiLineChartCard
          title="Rendimiento de la flota"
          data={perf.series}
          seriesKeys={perf.imeis}
          yLabel="km / % fuel"
        />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FuelLoadsTable loads={loads} />
        </div>
        <EventsPanel events={events} />
      </div>

      <LowPerformanceTable units={units} />
      */}
    </div> 
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VehicleSelectionProvider>
        <Dashboard />
      </VehicleSelectionProvider>
    </QueryClientProvider>
  );
}

export default App;