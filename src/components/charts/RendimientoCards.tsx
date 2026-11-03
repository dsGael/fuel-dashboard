import { Card } from '../ui/Card';
import type { FuelRendimiento } from '../../types';

interface RendimientoCardsProps {
  data: FuelRendimiento[];
  loading?: boolean;
  error?: string | null;
}

const TZ = 'America/Hermosillo';
const fmtDate = (v: string | null) =>
  v ? new Date(v).toLocaleString('es-MX', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' }) : '—';
const fmtNum = (v: number | null) => (v === null ? '—' : v.toLocaleString('es-MX', { maximumFractionDigits: 2 }));

export function RendimientoCards({ data, loading, error }: Readonly<RendimientoCardsProps>) {
  return (
    <Card title="Rendimiento (km/L)" className="w-fit">
      {error && <div className="mb-2 text-[13px] text-accent-red">{error}</div>}
      {!loading && !error && data.length === 0 && <p className="text-sm text-slate-500">Sin cálculos de rendimiento</p>}

      <div className={`flex w-fit gap-5  ${loading ? 'opacity-70' : ''}`}>
        {data.map((r) => (
          <div key={r.idautobus} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-md font-medium text-slate-200">{r.numero_economico ?? r.idautobus}</span>
              <span className="text-[12px] text-slate-300">Calculado {fmtDate(r.calculado_en)}</span>
            </div>

            <div>
              <span className="text-4xl font-semibold text-accent-orange">{fmtNum(r.rendimiento_km_l)}</span>
              <span className="ml-1 text-xl text-slate-400">km/L</span>
              {r.error_pct !== null && <span className="ml-2 text-xs text-slate-500">±{fmtNum(r.error_pct)}%</span>}
            </div>

            {r.motivo && <p className="text-xs text-amber-400">{r.motivo}</p>}

            <dl className="grid grid-cols-2  gap-y-1 text-md">
              <dt className="text-slate-100">Km</dt>
              <dd className="text-right text-slate-100">{fmtNum(r.km)}</dd>
              <dt className="text-slate-100">Litros</dt>
              <dd className="text-right text-slate-100">{fmtNum(r.litros)}</dd>
              <dt className="text-slate-100">Puntos / segmentos</dt>
              <dd className="text-right text-slate-210">
                {fmtNum(r.puntos)} / {fmtNum(r.segmentos)}
              </dd>
              <dt className="text-slate-100">Desde</dt>
              <dd className="text-right text-slate-100">{fmtDate(r.desde)}</dd>
              <dt className="text-slate-100">Hasta</dt>
              <dd className="text-right text-slate-100">{fmtDate(r.hasta)}</dd>
            </dl>
          </div>
        ))}
      </div>
    </Card>
  );
}
