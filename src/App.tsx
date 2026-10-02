import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { VehicleSelectionProvider, useVehicleSelection } from './context/VehicleSelectionContext';
import { VehicleSelector } from './components/controls/VehicleSelector';
import { KpiGrid } from './components/kpi/KpiGrid';
import { MultiLineChartCard } from './components/charts/MultiLineChartCard';
import { ConsumptionChartCard } from './components/charts/ConsumptionChartCard';
import { EventsPanel } from './components/events/EventsPanel';
import { FuelLoadsTable } from './components/table/FuelLoadsTable';
import { LowPerformanceTable } from './components/table/LowPerformanceTable';
import { useFleetSummary } from './hooks/useFleetSummary';
import { usePerformanceSeries } from './hooks/usePerformanceSeries';
import { useConsumption } from './hooks/useConsumption';
import { useFleetEvents } from './hooks/useFleetEvents';
import { useFuelLoads } from './hooks/useFuelLoads';
import { useLowPerformance } from './hooks/useLowPerformance';
import RecordsTable from './components/table/RecordsTable';
import type { GpsRecord } from './types';
import { getRecords } from './api/client';
import GpsMap from './components/maps/GpsMap';

// 1. Instanciamos el cliente de React Query fuera de los componentes
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
  const { summary } = useFleetSummary();
  const { data: perf } = usePerformanceSeries(imeis);
  const { data: consumption } = useConsumption(imeis);
  const { events } = useFleetEvents(imeis);
  const { loads } = useFuelLoads(imeis);
  const { units } = useLowPerformance();

  // 2. Reemplazamos useState y useEffect con useQuery
  const { 
    data: records = [], 
    isLoading, 
    error 
  } = useQuery<GpsRecord[]>({
    queryKey: ['gps_records'],
    queryFn: () => getRecords({ limit: 2000 }),
    refetchInterval: 30000, // Recarga automática cada 30 segundos
  });

  // Filtro para "hoy"
  const todayString = new Date().toDateString();
  const recordsDeHoy = records.filter(record => {
    const recordDate = new Date(record.recorded_at);
    return recordDate.toDateString() === todayString;
  });

  // Parseamos el error a string si existe para pasarlo a la tabla
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard General</h1>
          <p className="text-sm text-slate-400">Resumen de tu flota en tiempo real</p>
        </div>
        <VehicleSelector />
      </header>

      {!isLoading && !errorMessage && (
        <GpsMap records={recordsDeHoy} />
      )}
      
      <RecordsTable 
        records={records} 
        loading={isLoading} 
        error={errorMessage} 
      />      

      <KpiGrid summary={summary} />

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
    </div>
  );
}

function App() {
  return (
    // 3. Envolvemos la aplicación con el Provider
    <QueryClientProvider client={queryClient}>
      <VehicleSelectionProvider>
        <Dashboard />
      </VehicleSelectionProvider>
    </QueryClientProvider>
  );
}

export default App; 