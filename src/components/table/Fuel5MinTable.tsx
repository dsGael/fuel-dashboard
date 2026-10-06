import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import type { Fuel5MinRecord } from '../../types';



interface Fuel5MinTableProps {
  records: Fuel5MinRecord[];
  loading: boolean;
  error: string | null;
}

const Fuel5MinTable: React.FC<Fuel5MinTableProps> = ({ records, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  if (loading) {
    return <div className="p-4 text-center text-sm text-slate-500">Cargando registros procesados...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-sm font-medium text-accent-red">{error}</div>;
  }

  const totalPages = Math.ceil(records.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  
  const currentRecords = records.slice(startIndex, endIndex);

  return (
    <Card title={`Bloques de Combustible 5 Minutos (${records.length})`}>
      <div className="">
        <table className="w-full min-w-max text-left text-xs">
          <thead className="bg-slate-800 text-slate-400 sticky top-0 z-10 px-5">
            <tr className="border-b border-border text-slate-400 text-center">
              <th className="py-2 pr-4 pl-2">Unidad</th>
              <th className="py-2 pr-4">Ventana Fin</th>
              <th className="py-2 pr-4">Litros (Mediana)</th>
              <th className="py-2 pr-4">Sensor (Mediana)</th>
              <th className="py-2 pr-4">Mín / Máx (Sensor)</th>
              <th className="py-2 pr-4">Muestras</th>
              <th className="py-2 pr-4">Odómetro</th>
              <th className="py-2 pr-4">Ignición</th>
              <th className="py-2 pr-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr className="border-b border-border/50 hover:bg-white/5">
                <td colSpan={9} className="py-4 text-center text-slate-500">
                  No hay bloques de 5 minutos generados aún.
                </td>
              </tr>
            ) : (
              currentRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-border/50 hover:bg-white/5 text-right"
                >
                  <td className="py-2 pr-4 pl-2 font-medium text-slate-200 text-center">
                    {record.numero_economico ? record.numero_economico : record.imei.slice(-4)}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-4 text-slate-400">
                    {new Date(record.ventana_fin).toLocaleString('es-MX')}
                  </td>
                  <td className="py-2 pr-4 font-semibold text-accent-green">
                    {record.litros_tanque !== null ? `${record.litros_tanque} L` : '-'}
                  </td>
                  <td className="py-2 pr-4 text-slate-300">
                    {record.sensor_mediana ?? '-'}
                  </td>
                  <td className="py-2 pr-4 text-slate-400">
                    {record.sensor_min !== null && record.sensor_max !== null 
                      ? `${record.sensor_min} / ${record.sensor_max}` 
                      : '-'}
                  </td>
                  <td className="py-2 pr-4 text-center">
                    {record.registros_usados}
                  </td>
                  <td className="py-2 pr-4">
                    {record.odometro_total ?? '-'}
                  </td>
                  <td className="py-2 pr-4 text-center">
                    {record.ignicion !== null 
                      ? (record.ignicion ? 'Encendido' : 'Apagado') 
                      : '-'}
                  </td>
                  <td className="py-2 pr-4 text-center">
                    {record.valido ? (
                      <span className="text-emerald-400">Válido</span>
                    ) : (
                      <span className="text-rose-400" title={record.observacion || ''}>Descartado</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
          <span className="text-slate-400">
            Mostrando {startIndex + 1} a {Math.min(endIndex, records.length)} de {records.length} bloques
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

export default Fuel5MinTable;