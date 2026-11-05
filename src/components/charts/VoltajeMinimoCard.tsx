import { Battery, BatteryCharging, BatteryLow } from 'lucide-react';
import { Card } from '../ui/Card';
import type { GpsRecord } from '../../types';

interface VoltajeMinimoCardProps {
  data: GpsRecord[];
  loading?: boolean;
}

const TZ = 'America/Hermosillo';
const fmtDate = (v: string) =>
  new Date(v).toLocaleString('es-MX', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' });
const fmt = (v: number) => v.toLocaleString('es-MX', { maximumFractionDigits: 2 });

export function VoltajeMinimoCard({ data, loading }: Readonly<VoltajeMinimoCardProps>) {
  // Registro con el voltaje más bajo del rango, por unidad
  const minimos: Record<string, GpsRecord> = {};
  const sumas: Record<string, { total: number; n: number }> = {};
  data.forEach((r) => {
    if (r.voltaje == null) return;
    sumas[r.imei] ??= { total: 0, n: 0 };
    sumas[r.imei].total += Number(r.voltaje);
    sumas[r.imei].n += 1;
    const actual = minimos[r.imei];
    if (!actual || Number(r.voltaje) < Number(actual.voltaje)) minimos[r.imei] = r;
  });

  const items = Object.values(minimos);

  return (
    <Card title="Voltaje mínimo de batería" className="w-fit">
      {!loading && items.length === 0 && <p className="text-sm text-slate-500">Sin datos de voltaje</p>}

      <div className={`flex w-fit gap-5 ${loading ? 'opacity-70' : ''}`}>
        {items.map((r) => {
          // normalizeRecord convierte null a 0, así que 0,0 = sin ubicación
          const conUbicacion = Boolean(r.latitude && r.longitude);
          return (
            <div key={r.imei} className="rounded-lg border border-border p-4 space-y-3">
              <span className="text-md font-medium text-slate-200">{r.numero_economico ?? r.imei}</span>

              <div className="flex items-center gap-4">
                <Battery className="h-10 w-8 shrink-0" />
                <span className="text-4xl font-semibold text-accent-orange">
                  {fmt(Number(r.voltaje) / 1000 /* el GPS reporta mV */)}
                  <span className="ml-1 text-xl font-normal text-slate-400">V</span>
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-md">
                <dt className="text-slate-100">Promedio</dt>
                <dd className="text-right text-slate-100">
                  {fmt(sumas[r.imei].total / sumas[r.imei].n / 1000)} V
                </dd>
                <dt className="text-slate-100">Fecha</dt>
                <dd className="text-right text-slate-100">{fmtDate(r.recorded_at)}</dd>
                <dt className="text-slate-100">Ubicación</dt>
                <dd className="text-right">
                  {conUbicacion ? (
                    <a
                      href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 hover:underline"
                    >
                      {`${Number(r.latitude).toFixed(5)}, ${Number(r.longitude).toFixed(5)}`}
                    </a>
                  ) : (
                    <span className="text-slate-100">N/A</span>
                  )}
                </dd>
                <dt className="text-slate-100">Ignición</dt>
                <dd className="text-right text-slate-100">
                  {r.ignicion == null ? '—' : r.ignicion ? 'Encendido' : 'Apagado'}
                </dd>
                <dt className="text-slate-100">Velocidad</dt>
                <dd className="text-right text-slate-100">{r.speed == null ? '—' : `${fmt(r.speed)} km/h`}</dd>
              </dl>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
