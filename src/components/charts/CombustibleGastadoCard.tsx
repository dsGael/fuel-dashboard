import { AlertTriangle, FuelIcon } from 'lucide-react';
import type { ProcessedPoint } from './FuelProcessedChart';
import type { FuelEvento } from '../../types';

interface CombustibleGastadoCardProps {
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
}

const fmt = (v: number) => v.toLocaleString('es-MX', { maximumFractionDigits: 1 });

export function CombustibleGastadoCard({ data, eventos, loading }: Readonly<CombustibleGastadoCardProps>) {
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
    else if (e.evento === 'extraccion') r.extracciones += 1;
  });

  const items = Object.values(porUnidad);

  return (
    // Sin Card propia: se muestra como sección dentro de NivelCombustibleCard
    <div className="mt-5">
      <h3 className="mb-4 text-sm font-medium text-slate-200">Combustible gastado</h3>
      {!loading && items.length === 0 && <p className="text-sm text-slate-500">Sin datos en el rango</p>}

      <div className={`flex gap-5 ${loading ? 'opacity-70' : ''}`}>
        {items.map((r) => {
          const inicial = Number(r.inicio.litros_estimados);
          const final = Number(r.fin.litros_estimados);
          // Incluye extracciones: es todo lo que salió del tanque en el rango
          const gastado = inicial - final + r.cargas;
          return (
            <div key={r.unidad} className="flex flex-1 justify-between gap-6 rounded-lg border border-border p-4">
              <div className="space-y-3">
                <span className="text-md font-medium text-slate-200">{r.unidad}</span>

                <div className="flex items-center gap-6">

                  <FuelIcon className="h-10 w-8 shrink-0 " />
                  <span className="text-4xl font-semibold text-accent-orange">{fmt(gastado)}
                      <span className="ml-1 text-xl text-slate-400">L</span>

                  </span>
                </div>

                {r.extracciones > 0 && (
                  <p className="flex items-center gap-1 text-xs font-medium text-accent-red">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {r.extracciones === 1 ? 'Extracción detectada' : `${r.extracciones} extracciones detectadas`}
                  </p>
                )}
              </div>

              <dl className="text-sm center flex flex-col  gap-0.5 px-1 pl-2 ">
                <dt className="text-slate-400">Inicial</dt>
                <dd className="  text-slate-100">{fmt(inicial)} L</dd>
                <dt className="text-slate-400">Final</dt>
                <dd className=" text-slate-100">{fmt(final)} L</dd>
                <dt className="text-slate-400">Cargas</dt>
                <dd className=" text-slate-100">{fmt(r.cargas)} L</dd>
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
