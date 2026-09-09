import { Fuel, Gauge, BatteryCharging, ShieldAlert, MapPin } from 'lucide-react';
import { KpiCard } from './KpiCard';
import type { Kpis, VehicleLatest } from '../../types';

interface KpiGridProps {
  kpis: Kpis | null;
  vehicles: VehicleLatest[];
}

export function KpiGrid({ kpis, vehicles }: KpiGridProps) {
  const totalFuel = vehicles.reduce((acc, v) => acc + (v.fuel ?? 0), 0);
  const activeVehicles = vehicles.filter((v) => v.speed > 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KpiCard label="Combustible total" value={`${totalFuel.toFixed(0)} L`} icon={Fuel} color="blue" />
      <KpiCard
        label="Velocidad promedio"
        value={`${(kpis?.avgSpeed ?? 0).toFixed(1)} km/h`}
        icon={Gauge}
        color="green"
      />
      <KpiCard label="Velocidad máxima" value={`${(kpis?.maxSpeed ?? 0).toFixed(1)} km/h`} icon={BatteryCharging} color="orange" />
      <KpiCard label="Registros totales" value={`${kpis?.totalRecords ?? 0}`} icon={ShieldAlert} color="red" />
      <KpiCard
        label="Unidades activas"
        value={`${activeVehicles} / ${vehicles.length}`}
        icon={MapPin}
        color="purple"
      />
    </div>
  );
}