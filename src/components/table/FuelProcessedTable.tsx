import { useMemo } from 'react';
import { Card } from '../ui/Card';
import type { FuelProcessedRecord } from '../../types';

interface FuelProcessedTableProps {
  rows: FuelProcessedRecord[];
  total: number;
  page: number; // base 0
  pageSize: number;
  loading?: boolean;
  error?: string | null;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;
const TZ = 'America/Hermosillo';

// Columnas a mostrar, en el orden en que quieres verlas.
// Usa los nombres tal como los devuelve la API (p. ej. 'litros_calculados').
// Si el arreglo queda vacío, se muestran todas las columnas.
// Los nombres que no existan en la respuesta se ignoran sin error.
const VISIBLE_COLUMNS: string[] = ['numero_economico', 'recorded_at', 'ventana_inicio', 'ventana_fin', 'litros_calculados', 'litros_finales',  'diferencia_litros',  'consumo_esperado',  'actualizo_final', 'estado_resultado', 'motivo'];

function formatHeader(key: string) {
  return key.replaceAll('_', ' ');
}

function formatValue(value: FuelProcessedRecord[keyof FuelProcessedRecord]) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') return value.toLocaleString('es-MX', { maximumFractionDigits: 2 });
  if (ISO_DATE.test(value)) {
    return new Date(value).toLocaleString('es-MX', { timeZone: TZ });
  }
  return value;
}

const cellBase = 'px-3 py-2 whitespace-nowrap border-b border-border';

const buttonClass =
  'rounded-md border border-border bg-card px-3 py-1 text-xs text-slate-200 cursor-pointer disabled:text-slate-600 disabled:cursor-not-allowed';

export function FuelProcessedTable({
  rows,
  total,
  page,
  pageSize,
  loading,
  error,
  onPageChange,
  onRefresh,
}: Readonly<FuelProcessedTableProps>) {
  const columns = useMemo(() => {
    const keys = rows.length ? Object.keys(rows[0]) : [];
    if (VISIBLE_COLUMNS.length === 0) return keys;
    return VISIBLE_COLUMNS.filter((c) => keys.includes(c));
  }, [rows]);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  return (
    <Card title="Combustible procesado">
      {error && (
        <div className="mb-2 text-[13px] text-accent-red">
          {error}
          {onRefresh && (
            <button onClick={onRefresh} className={`${buttonClass} ml-2`}>
              Reintentar
            </button>
          )}
        </div>
      )}

      <div className={`overflow-auto max-h-105 ${loading ? 'opacity-60' : ''}`}>
        <table className="w-full border-collapse text-xs text-slate-200">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className={`${cellBase} sticky top-0 bg-card text-left text-[11px] uppercase text-slate-500`}
                >
                  {formatHeader(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col} className={cellBase}>
                    {formatValue(row[col as keyof FuelProcessedRecord])}
                  </td>
                ))}
              </tr>
            ))}
            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className={`${cellBase} text-center text-slate-500`}>
                  Sin registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          {from}–{to} de {total.toLocaleString('es-MX')}
        </span>
        <span className="flex items-center gap-2">
          <button className={buttonClass} disabled={page === 0} onClick={() => onPageChange(page - 1)}>
            Anterior
          </button>
          <span>
            Página {page + 1} / {totalPages}
          </span>
          <button className={buttonClass} disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
            Siguiente
          </button>
        </span>
      </div>
    </Card>
  );
}
