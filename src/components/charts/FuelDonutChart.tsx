import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import type { VehicleLatest } from '../../types';

interface FuelDonutChartProps {
  vehicles: VehicleLatest[];
}

const BUCKETS = [
  { label: '> 75%', min: 75, max: 101, color: '#22C55E' },
  { label: '50% - 75%', min: 50, max: 75, color: '#3B82F6' },
  { label: '25% - 50%', min: 25, max: 50, color: '#F59E0B' },
  { label: '< 25%', min: -1, max: 25, color: '#EF4444' },
];

export function FuelDonutChart({ vehicles }: FuelDonutChartProps) {
  const totalFuel = vehicles.reduce((acc, v) => acc + (v.fuel ?? 0), 0);

  const data = BUCKETS.map((b) => ({
    ...b,
    count: vehicles.filter((v) => v.fuel >= b.min && v.fuel < b.max).length,
  }));

  return (
    <Card title="Nivel de combustible de la flota">
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="count" innerRadius={50} outerRadius={70} paddingAngle={2}>
                {data.map((d) => (
                  <Cell key={d.label} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold">{totalFuel.toFixed(0)} L</span>
            <span className="text-[10px] text-slate-400">Total en flota</span>
          </div>
        </div>
        <ul className="flex-1 space-y-2">
          {data.map((d) => (
            <li key={d.label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.label}
              </span>
              <span className="text-slate-400">{d.count} unidades</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}