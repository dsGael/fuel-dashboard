import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { VehicleSelectionProvider } from './context/VehicleSelectionContext';
import { VehicleSelector } from './components/controls/VehicleSelector';
// import { KpiGrid } from './components/kpi/KpiGrid';
// import { MultiLineChartCard } from './components/charts/MultiLineChartCard';
// import { ConsumptionChartCard } from './components/charts/ConsumptionChartCard';
// import { EventsPanel } from './components/events/EventsPanel';
// import { FuelLoadsTable } from './components/table/FuelLoadsTable';
// import { LowPerformanceTable } from './components/table/LowPerformanceTable';
// import { useFleetSummary } from './hooks/useFleetSummary';
// import { usePerformanceSeries } from './hooks/usePerformanceSeries';
// import { useConsumption } from './hooks/useConsumption';
// import { useFleetEvents } from './hooks/useFleetEvents';
// import { useFuelLoads } from './hooks/useFuelLoads';
// import { useLowPerformance } from './hooks/useLowPerformance';
import RecordsTable from './components/table/RecordsTable';
import Fuel5MinTable from './components/table/Fuel5MinTable';
import GpsMap from './components/maps/GpsMap';

import type { Fuel5MinRecord, GpsRecord } from './types'; 
import { getRecords, getFuel5MinRecords } from './api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});

function Dashboard() {
  // const { imeis } = useVehicleSelection();
  // const { summary } = useFleetSummary();
  // const { data: perf } = usePerformanceSeries(imeis);
  // const { data: consumption } = useConsumption(imeis);
  // const { events } = useFleetEvents(imeis);
  // const { loads } = useFuelLoads(imeis);
  // const { units } = useLowPerformance();

  // 1. Query para los registros CRUDOS originales
  const { 
    data: records = [], 
    isLoading: isLoadingRecords, 
    error: errorRecords 
  } = useQuery<GpsRecord[]>({
    queryKey: ['gps_records'],
    queryFn: () => getRecords({ limit: 2000 }),
    refetchInterval: 30000,
  });

  // 2. NUEVO Query para los registros PROCESADOS de 5 minutos
  const {
    data: fuel5MinRecords = [],
    isLoading: isLoadingFuel5Min,
    error: errorFuel5Min
  } = useQuery<Fuel5MinRecord[]>({
    queryKey: ['fuel_5min_records'],
    queryFn: () => getFuel5MinRecords({ limit: 1000 }),
    refetchInterval: 30000,
  });

  // Filtro para "hoy" en la tabla cruda
  const todayString = new Date().toDateString();
  const recordsDeHoy = records.filter(record => {
    const recordDate = new Date(record.recorded_at);
    return recordDate.toDateString() === todayString;
  });

  // Parseo de errores
  const errorMessageRecords = errorRecords instanceof Error ? errorRecords.message : null;
  const errorMessageFuel5Min = errorFuel5Min instanceof Error ? errorFuel5Min.message : null;

  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard General</h1>
          <p className="text-sm text-slate-400">Resumen de tu flota en tiempo real</p>
        </div>
        <VehicleSelector />
      </header>

     

      {/* AQUÍ INYECTAMOS LA DATA CORRECTA DE 5 MINUTOS */}
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
        <GpsMap records={recordsDeHoy} />
      )}

      {/* <KpiGrid summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MultiLineChartCard
          title="Rendimiento de la flota"
          data={perf.series}
          seriesKeys={perf.imeis}
          yLabel="km / % fuel"
        />
        <ConsumptionChartCard data={consumption} />
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