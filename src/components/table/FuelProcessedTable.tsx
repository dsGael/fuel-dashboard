import { useMemo, type CSSProperties } from 'react';
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
  return key.replace(/_/g, ' ');
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

const cellBase: CSSProperties = {
  padding: '8px 12px',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid #232A3B',
};

const buttonStyle = (disabled: boolean): CSSProperties => ({
  background: '#161B29',
  color: disabled ? '#475569' : '#E2E8F0',
  border: '1px solid #232A3B',
  borderRadius: 6,
  padding: '4px 12px',
  fontSize: 12,
  cursor: disabled ? 'not-allowed' : 'pointer',
});

export function FuelProcessedTable({
  rows,
  total,
  page,
  pageSize,
  loading,
  error,
  onPageChange,
  onRefresh,
}: FuelProcessedTableProps) {
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
        <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>
          {error}
          {onRefresh && (
            <button onClick={onRefresh} style={{ ...buttonStyle(false), marginLeft: 8 }}>
              Reintentar
            </button>
          )}
        </div>
      )}

      <div style={{ overflowX: 'auto', maxHeight: 420, opacity: loading ? 0.6 : 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, color: '#E2E8F0' }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    ...cellBase,
                    position: 'sticky',
                    top: 0,
                    background: '#161B29',
                    color: '#64748B',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    fontSize: 11,
                  }}
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
                  <td key={col} style={cellBase}>
                    {formatValue(row[col as keyof FuelProcessedRecord])}
                  </td>
                ))}
              </tr>
            ))}
            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} style={{ ...cellBase, textAlign: 'center', color: '#64748B' }}>
                  Sin registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          fontSize: 12,
          color: '#64748B',
        }}
      >
        <span>
          {from}–{to} de {total.toLocaleString('es-MX')}
        </span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={buttonStyle(page === 0)} disabled={page === 0} onClick={() => onPageChange(page - 1)}>
            Anterior
          </button>
          <span>
            Página {page + 1} / {totalPages}
          </span>
          <button
            style={buttonStyle(page + 1 >= totalPages)}
            disabled={page + 1 >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </button>
        </span>
      </div>
    </Card>
  );
}