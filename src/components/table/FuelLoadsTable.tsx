import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import type { FuelLoad } from '../../types';

const PAGE_SIZE = 8;

export function FuelLoadsTable({ loads }: { loads: FuelLoad[] }) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(loads.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => loads.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [loads, page]
  );

  // Si la lista cambia (nuevo filtro de camión) y la página actual queda fuera de rango, regresa a la 0
  if (page > 0 && page >= totalPages) {
    setPage(0);
  }

  return (
    <Card
      title="Últimas cargas de combustible"
      action={
        loads.length > PAGE_SIZE ? (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-6 h-6 flex items-center justify-center rounded border border-border disabled:opacity-30 hover:bg-white/5"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-6 h-6 flex items-center justify-center rounded border border-border disabled:opacity-30 hover:bg-white/5"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        ) : undefined
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-border">
              <th className="py-2 pr-4">Fecha</th>
              <th className="py-2 pr-4">Unidad</th>
              <th className="py-2 pr-4">Nivel antes</th>
              <th className="py-2 pr-4">Nivel después</th>
              <th className="py-2 pr-4">Cambio</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((l, i) => (
              <tr key={`${l.imei}-${l.recorded_at}-${i}`} className="border-b border-border/50">
                <td className="py-2 pr-4 text-slate-400">{new Date(l.recorded_at).toLocaleString()}</td>
                <td className="py-2 pr-4 text-slate-200">{l.imei}</td>
                <td className="py-2 pr-4">{l.fuel_before}%</td>
                <td className="py-2 pr-4">{l.fuel_after}%</td>
                <td className="py-2 pr-4 text-accent-green">+{l.delta}%</td>
              </tr>
            ))}
            {loads.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-slate-500">
                  Sin cargas registradas en este período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}