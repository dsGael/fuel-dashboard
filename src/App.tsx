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
import { useEffect, useState } from 'react';
import { getRecords } from './api/client';
import GpsMap from './components/maps/GpsMap';

function Dashboard() {
  const { imeis } = useVehicleSelection();
  const { summary } = useFleetSummary();
  const { data: perf } = usePerformanceSeries(imeis);
  const { data: consumption } = useConsumption(imeis);
  const { events } = useFleetEvents(imeis);
  const { loads } = useFuelLoads(imeis);
  const { units } = useLowPerformance();

  const [records, setRecords] = useState<GpsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getRecords({ limit: 1000 });
        setRecords(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al obtener los registros de la base de datos');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);


  // --- NUEVO: FILTRO PARA "HOY" ---
  // Obtenemos la fecha actual en formato texto simple (ej. "Wed Sep 30 2026")
  const todayString = new Date().toDateString();
  
  // Filtramos el arreglo de records
  const recordsDeHoy = records.filter(record => {
    const recordDate = new Date(record.recorded_at);
    return recordDate.toDateString() === todayString;
  });


  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard General</h1>
          <p className="text-sm text-slate-400">Resumen de tu flota en tiempo real</p>
        </div>
        <VehicleSelector />
      </header>

    {!loading && !error && (
        <GpsMap records={recordsDeHoy} />
      )}
      <RecordsTable records={records} loading={loading} error={error} />      


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
    <VehicleSelectionProvider>
      <Dashboard />
    </VehicleSelectionProvider>
  );
}

export default App;