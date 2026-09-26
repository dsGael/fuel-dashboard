import { ArrowDownRight } from 'lucide-react';
import { Card } from '../ui/Card';
import type { LowPerformanceUnit } from '../../types';

export function LowPerformanceTable({ units }: { units: LowPerformanceUnit[] }) {
  return (
    <Card title="Unidades con bajo rendimiento">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-border">
              <th className="py-2 pr-4">Unidad</th>
              <th className="py-2 pr-4">Rendimiento actual</th>
              <th className="py-2 pr-4">Promedio anterior</th>
              <th className="py-2 pr-4">Variación</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.imei} className="border-b border-border/50">
                <td className="py-2 pr-4 text-accent-blue">{u.imei}</td>
                <td className="py-2 pr-4">{u.currentPerformance} km/%</td>
                <td className="py-2 pr-4 text-slate-400">{u.previousPerformance} km/%</td>
                <td className="py-2 pr-4 flex items-center gap-1 text-accent-red">
                  <ArrowDownRight size={12} />
                  {u.variationPct}%
                </td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-500">
                  Todas las unidades están dentro de su rendimiento habitual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}