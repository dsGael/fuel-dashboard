import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';

export interface GpsRecord {
  imei: string;
  recorded_at: string;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  fuel: number | null; 
  s_analogo: number | null; 
  ignicion: boolean | null; 
  odometro_total: number | null;
  odometro_viaje: number | null;
  movimiento: boolean | null; 
  satellites: number | null;
  voltaje: number | null;
  litros_totales: number | null; 
  io_data: Record<string, any> | null;
}

interface RecordsTableProps {
  records: GpsRecord[];
  loading: boolean;
  error: string | null;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records, loading, error }) => {
  // --- ESTADOS DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100; // Cambia este número si quieres mostrar más o menos filas

  // Si los datos cambian (ej. al refrescar), volvemos a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  if (loading) {
    return <div className="p-4 text-center text-sm text-slate-500">Cargando registros...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-sm font-medium text-accent-red">{error}</div>;
  }

  // --- LÓGICA DE PAGINACIÓN ---
  const totalPages = Math.ceil(records.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  
  // Extraemos solo los registros de la página actual
  const currentRecords = records.slice(startIndex, endIndex);

  return (
    <Card title={`Historial de registros GPS (${records.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-slate-400">
              <th className="py-2 pr-4">IMEI</th>
              <th className="py-2 pr-4">Fecha y hora</th>
              <th className="py-2 pr-4">Lat / lng</th>
              <th className="py-2 pr-4">Velocidad</th>
              <th className="py-2 pr-4">Litros en Tanque</th>
              <th className="py-2 pr-4">Voltaje</th>
              <th className="py-2 pr-4">Ignición</th>
              <th className="py-2 pr-4">Movimiento</th>
              <th className="py-2 pr-4">Odómetro Total</th>
              <th className="py-2 pr-4">Odómetro Viaje</th>
              <th className="py-2 pr-4">Sensor Análogo</th>
              <th className="py-2 pr-4">Sensor Externo</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-4 text-center text-slate-500">
                  No hay registros en la base de datos.
                </td>
              </tr>
            ) : (
              currentRecords.map((record, index) => (
                <tr
                  key={`${record.imei}-${record.recorded_at}-${index}`}
                  className="border-b border-border/50 hover:bg-white/5"
                >
                  <td className="py-2 pr-4 font-medium text-slate-200">{record.imei}</td>
                  <td className="whitespace-nowrap py-2 pr-4 text-slate-400">
                    {new Date(record.recorded_at).toLocaleString('es-MX')}
                  </td>
                  <td className="py-2 pr-4">
                    {record.latitude !== null && record.longitude !== null
                      ? `${record.latitude.toFixed(5)}, ${record.longitude.toFixed(5)}`
                      : 'N/A'}
                  </td>
                  <td className="py-2 pr-4">
                    {record.speed !== null ? `${record.speed} km/h` : '-'}
                  </td>
                  <td className="py-2 pr-4 font-semibold text-accent-blue">
                    {record.litros_totales !== null ? `${record.litros_totales} L` : '-'}
                  </td>
                  <td className="py-2 pr-4">
                    {record.voltaje !== null ? `${record.voltaje} V` : '-'}
                  </td>
                  <td className="py-2 pr-4">
                    {record.ignicion !== null 
                      ? (record.ignicion === true ? 'Encendido' : 'Apagado') 
                      : '-'}
                  </td>
                  <td className="py-2 pr-4">
                    {record.movimiento !== null 
                      ? (record.movimiento === true ? 'Sí' : 'No') 
                      : '-'}
                  </td>
                  <td className="py-2 pr-4">
                    {record.odometro_total !== null ? record.odometro_total : '-'}
                  </td>
                  <td className="py-2 pr-4">
                    {record.odometro_viaje !== null ? record.odometro_viaje : '-'}
                  </td>
                  <td className="py-2 pr-4">
                    {record.s_analogo !== null ? record.s_analogo : '-'}
                  </td>
                  <td className="py-2 pr-4 text-slate-400">
                    {record.fuel !== null ? record.fuel : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
      {records.length > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
          <span className="text-slate-400">
            Mostrando {startIndex + 1} a {Math.min(endIndex, records.length)} de {records.length} registros
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-border bg-slate-800/50 px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-border bg-slate-800/50 px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RecordsTable;