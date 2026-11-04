import type { ReactNode } from 'react';
import { Fuel } from 'lucide-react';
import { Card } from '../ui/Card';
import type { ProcessedPoint } from './FuelProcessedChart';

interface NivelCombustibleCardProps {
  data: ProcessedPoint[];
  loading?: boolean;
  children?: ReactNode;
}

const TZ = 'America/Hermosillo';
const fmtDate = (v: string) =>
  new Date(v).toLocaleString('es-MX', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' });

export function NivelCombustibleCard({ data, loading, children }:Readonly<NivelCombustibleCardProps>) {
  // Último litros_estimados por unidad (misma clave de unidad que la gráfica)
  const ultimos: Record<string, ProcessedPoint> = {};
  data.forEach((p) => {
    if (p.litros_estimados == null) return;
    const unidad = String(p.numero_economico ?? p.idautobus);
    const prev = ultimos[unidad];
    if (!prev || new Date(p.ventana_inicio) > new Date(prev.ventana_inicio)) ultimos[unidad] = p;
  });
  const items = Object.entries(ultimos);

  return (
    <Card title="Nivel de combustible"  >
      {!loading && items.length === 0 && <p className="text-sm text-slate-500">Sin datos de nivel</p>}

      <div className={`flex gap-5 ${loading ? 'opacity-70' : ''}`}>
        {items.map(([unidad, p]) => (
          <div key={unidad} className="flex-1 rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-md font-medium text-slate-200">{unidad}</span>
              <span className="text-[12px] text-slate-300">{fmtDate(p.ventana_inicio)}</span>
            </div>
            <div className="flex items-center gap-6">
              <Fuel className="h-10 w-8 shrink-0 " />
              <span className="text-4xl font-semibold text-accent-orange">
                {Number(p.litros_estimados).toLocaleString('es-MX', { maximumFractionDigits: 1 })}              
                <span className="ml-1 text-xl text-slate-400">L</span>

              </span>
            </div>
          </div>
        ))}
      </div>
      {children}
    </Card>
  );
}
