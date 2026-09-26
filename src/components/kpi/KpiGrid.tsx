import { Fuel, Gauge, RefreshCcw, ShieldAlert, MapPin } from 'lucide-react';
import { KpiCard } from './KpiCard';
import type { FleetSummary } from '../../types';

export function KpiGrid({ summary }: { summary: FleetSummary | null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KpiCard label="Combustible total" value={`${summary?.totalFuel ?? 0}%`} icon={Fuel} color="blue" />
      <KpiCard
        label="Rendimiento promedio"
        value={`${summary?.avgPerformance ?? 0} ${summary?.performanceUnit ?? ''}`}
        icon={Gauge}
        color="green"
      />
      <KpiCard label="Cargas hoy" value={`${summary?.refillsToday ?? 0}`} icon={RefreshCcw} color="orange" />
      <KpiCard label="Alertas activas" value={`${summary?.activeAlerts ?? 0}`} icon={ShieldAlert} color="red" />
      <KpiCard
        label="Unidades activas"
        value={`${summary?.activeUnits ?? 0} / ${summary?.totalUnits ?? 0}`}
        icon={MapPin}
        color="purple"
      />
    </div>
  );
}