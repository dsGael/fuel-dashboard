import { Card } from '../ui/Card';
import type { VehicleLatest } from '../../types';

interface LatestVehiclesTableProps {
  vehicles: VehicleLatest[];
}

export function LatestVehiclesTable({ vehicles }: LatestVehiclesTableProps) {
  return (
    <Card title="Últimas posiciones reportadas">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-border">
              <th className="py-2 pr-4">IMEI</th>
              <th className="py-2 pr-4">Fecha</th>
              <th className="py-2 pr-4">Velocidad</th>
              <th className="py-2 pr-4">Combustible</th>
              <th className="py-2 pr-4">Satélites</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.imei} className="border-b border-border/50">
                <td className="py-2 pr-4 text-slate-200">{v.imei}</td>
                <td className="py-2 pr-4 text-slate-400">{new Date(v.recorded_at).toLocaleString()}</td>
                <td className="py-2 pr-4">{v.speed} km/h</td>
                <td className="py-2 pr-4">{v.fuel}%</td>
                <td className="py-2 pr-4">{v.satellites}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}