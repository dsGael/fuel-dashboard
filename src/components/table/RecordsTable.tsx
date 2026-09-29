import React, { useEffect, useState } from 'react';
import { getRecords } from '../../api/client';
import { Card } from '../ui/Card';
// Si prefieres, puedes mover esta interfaz a tu archivo types.ts
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
  io_data: Record<string, any> | null;
}

const RecordsTable: React.FC = () => {
  const [records, setRecords] = useState<GpsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // Llama a la nueva función de tu cliente API
        const data = await getRecords({ limit: 100 });
        setRecords(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al obtener los registros de la base de datos');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-sm text-slate-500">Cargando registros...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-sm font-medium text-accent-red">{error}</div>;
  }

  return (
    <Card title={`Historial de registros GPS (${records.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left text-xs">
          <thead>
            <tr className="border-b border-border text-slate-400">
              <th className="py-2 pr-4">IMEI</th>
              <th className="py-2 pr-4">Fecha y hora</th>
              <th className="py-2 pr-4">Lat / lng</th>
              <th className="py-2 pr-4">Velocidad</th>
              <th className="py-2 pr-4">Combustible</th>
              <th className="py-2 pr-4">Sensor Analogo</th>
              <th className="py-2 pr-4">IO data</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-slate-500">
                  No hay registros en la base de datos.
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
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
                  <td className="py-2 pr-4">{record.speed !== null ? `${record.speed} km/h` : '-'}</td>
                  <td className="py-2 pr-4 font-semibold text-accent-blue">
                    {record.fuel !== null ? record.fuel : '-'}
                  </td>
                  <td className="py-2 pr-4">{record.s_analogo !== null ? record.s_analogo : '-'}</td>
                  <td
                    className="max-w-xs truncate py-2 pr-4 text-slate-500"
                    title={JSON.stringify(record.io_data)}
                  >
                    {record.io_data ? JSON.stringify(record.io_data) : '{}'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecordsTable;