import { AlertTriangle, Fuel } from 'lucide-react';
import { Card } from '../ui/Card';
import type { ProcessedPoint } from './FuelProcessedChart';
import type { FuelEvento } from '../../types';

interface NivelCombustibleCardProps {
  data: ProcessedPoint[];
  eventos: FuelEvento[];
  loading?: boolean;
}

interface Resumen {
  unidad: string;
  inicio: ProcessedPoint;
  fin: ProcessedPoint;
  cargas: number;
  extracciones: number;
  litrosExtraidos: number;
}

const TZ = 'America/Hermosillo';
const fmtDate = (v: string) =>
  new Date(v).toLocaleString('es-MX', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' });
const fmt = (v: number) => v.toLocaleString('es-MX', { maximumFractionDigits: 1 });

export function NivelCombustibleCard({ data, eventos, loading }: Readonly<NivelCombustibleCardProps>) {
  // Primer y último litros_estimados del rango por unidad
  const porUnidad: Record<string, Resumen> = {};
  data.forEach((p) => {
    if (p.litros_estimados == null) return;
    const r = porUnidad[String(p.idautobus)];
    if (!r) {
      porUnidad[String(p.idautobus)] = {
        unidad: String(p.numero_economico ?? p.idautobus),
        inicio: p,
        fin: p,
        cargas: 0,
        extracciones: 0,
        litrosExtraidos: 0,
      };
      return;
    }
    if (p.ventana_inicio < r.inicio.ventana_inicio) r.inicio = p;
    if (p.ventana_inicio > r.fin.ventana_inicio) r.fin = p;
  });

  eventos.forEach((e) => {
    const r = porUnidad[String(e.idautobus)];
    if (!r) return;
    if (e.evento === 'carga') r.cargas += Number(e.cantidad ?? 0);
    else if (e.evento === 'extraccion') {
      r.extracciones += 1;
      r.litrosExtraidos += Number(e.cantidad ?? 0);
    }
  });

  const items = Object.values(porUnidad);

  return (
    <Card title="Nivel de combustible Actual" className="w-fit">
      {!loading && items.length === 0 && <p className="text-sm text-slate-500">Sin datos de nivel</p>}

      <div className={`flex w-fit gap-5 ${loading ? 'opacity-70' : ''}`}>
        {items.map((r) => {
          const inicial = Number(r.inicio.litros_estimados);
          const actual = Number(r.fin.litros_estimados);
          // Incluye extracciones: es todo lo que salió del tanque en el rango
          const gastado = inicial - actual + r.cargas;
          return (
            <div key={r.unidad} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-md font-medium text-slate-200">{r.unidad}</span>
                <span className="text-[12px] text-slate-300">Actualizado {fmtDate(r.fin.ventana_inicio)}</span>
              </div>

              <div className="flex items-center gap-4">
                <Fuel className="h-10 w-8 shrink-0" />
                <span className="text-4xl font-semibold text-accent-orange">
                  {fmt(actual)}
                  <span className="ml-1 text-xl font-normal text-slate-400">L</span>
                </span>
              </div>

              {r.extracciones > 0 && (
                <p className="flex items-center gap-1 text-xs font-medium text-accent-red">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {r.extracciones === 1 ? 'Extracción detectada' : `${r.extracciones} extracciones detectadas`}
                  {r.litrosExtraidos > 0 && `: ${fmt(r.litrosExtraidos)} L`}
                </p>
              )}

              <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-md">
                <dt className="text-slate-100">Gastado</dt>
                <dd className="text-right text-slate-100">{fmt(gastado)} L</dd>
                <dt className="text-slate-100">Inicial</dt>
                <dd className="text-right text-slate-100">{fmt(inicial)} L</dd>
                <dt className="text-slate-100">Cargas</dt>
                <dd className="text-right text-slate-100">{fmt(r.cargas)} L</dd>
                <dt className="text-slate-100">Desde</dt>
                <dd className="text-right text-slate-100">{fmtDate(r.inicio.ventana_inicio)}</dd>
                <dt className="text-slate-100">Hasta</dt>
                <dd className="text-right text-slate-100">{fmtDate(r.fin.ventana_fin)}</dd>
              </dl>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
