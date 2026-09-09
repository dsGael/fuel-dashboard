import { useMemo } from 'react';
import { KpiGrid } from './components/kpi/KpiGrid';
import { FuelDonutChart } from './components/charts/FuelDonutChart';
import { LineChartCard } from './components/charts/LineChartCard';
import { useLatestVehicles } from './hooks/useLatestVehicles';
import { useKpis } from './hooks/useKpis';
import { useHistory } from './hooks/useHistory';
import { LatestVehiclesTable } from './components/table/LatestVechicleTable';

function App() {
  const { vehicles, loading: loadingVehicles } = useLatestVehicles();
  const { kpis } = useKpis();
  const firstImei = vehicles[0]?.imei ?? null;
  const { history } = useHistory(firstImei);

  const historyData = useMemo(
    () =>
      history.map((h) => ({
        time: new Date(h.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        speed: h.speed,
        fuel: h.fuel,
      })),
    [history]
  );

  return (
    <div className="min-h-screen bg-surface p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard General</h1>
        <p className="text-sm text-slate-400">Resumen de tu flota en tiempo real</p>
      </header>

      <KpiGrid kpis={kpis} vehicles={vehicles} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineChartCard
            title={`Histórico ${firstImei ? `— ${firstImei}` : ''}`}
            data={historyData}
            xKey="time"
            lines={[
              { key: 'speed', color: '#3B82F6', name: 'Velocidad' },
              { key: 'fuel', color: '#22C55E', name: 'Combustible' },
            ]}
          />
        </div>
        <FuelDonutChart vehicles={vehicles} />
      </div>

      {!loadingVehicles && <LatestVehiclesTable vehicles={vehicles} />}
    </div>
  );
}

export default App;