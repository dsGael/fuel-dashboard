import { Card } from '../ui/Card';
import type { FuelEvento } from '../../types';

interface FuelEventosTableProps {
  eventos: FuelEvento[];
  loading?: boolean;
  error?: string | null;
}

const TZ = 'America/Hermosillo';
const cellBase = 'px-3 py-2 whitespace-nowrap border-b border-border';
const headers = ['Fecha', 'Unidad', 'Evento', 'Cantidad', 'Ubicación'];

export function FuelEventosTable({ eventos, loading, error }: Readonly<FuelEventosTableProps>) {
  return (
    <Card title="Eventos">
      {error && <div className="mb-2 text-[13px] text-accent-red">{error}</div>}

      <div className={`overflow-auto max-h-105 ${loading ? 'opacity-60' : ''}`}>
        <table className="w-full border-collapse text-xs text-slate-200">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className={`${cellBase} sticky top-0 bg-card text-left text-[11px] uppercase text-slate-500`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {eventos.map((e) => (
              <tr key={e.id}>
                <td className={cellBase}>{new Date(e.fecha).toLocaleString('es-MX', { timeZone: TZ })}</td>
                <td className={cellBase}>{e.numero_economico ?? e.idautobus}</td>
                <td className={`${cellBase} capitalize`}>{e.evento.replaceAll('_', ' ')}</td>
                <td className={cellBase}>
                  {e.cantidad === null ? '—' : `${e.cantidad.toLocaleString('es-MX')} ${e.unidad ?? ''}`}
                </td>
                <td className={cellBase}>
                  {e.ubicacion ? (
                    <a
                      href={`https://www.google.com/maps?q=${e.ubicacion}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline"
                    >
                      {e.ubicacion}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
            {!loading && !error && eventos.length === 0 && (
              <tr>
                <td colSpan={headers.length} className={`${cellBase} text-center text-slate-500`}>
                  Sin eventos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
