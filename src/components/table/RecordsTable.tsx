import React, { useEffect, useState } from 'react';
import { getRecords } from '../../api/client';
import { Card } from '../ui/Card';

export interface GpsRecord {
  imei: string;
  recorded_at: string;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  fuel: number | null; // Sensor Externo
  s_analogo: number | null; // Sensor Análogo
  ignicion: boolean | null;
  odometro_total: number | null;
  odometro_viaje: number | null;
  movimiento: boolean | null;
  satellites: number | null;
  voltaje: number | null;
  litros_totales: number | null; // Litros en Tanque
  io_data: Record<string, any> | null;
}

const RecordsTable: React.FC = () => {
  const [records, setRecords] = useState<GpsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
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
            {records.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-4 text-center text-slate-500">
                  No hay registros en la base de datos.
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr
                  key={`${record.imei}-${record.recorded_at}-${index}`}
                  className="border-b border-border/50 hover:bg-white/5"
                >
                  {/* 1. IMEI */}
                  <td className="py-2 pr-4 font-medium text-slate-200">{record.imei}</td>
                  
                  {/* 2. Fecha y hora */}
                  <td className="whitespace-nowrap py-2 pr-4 text-slate-400">
                    {new Date(record.recorded_at).toLocaleString('es-MX')}
                  </td>
                  
                  {/* 3. Lat / lng */}
                  <td className="py-2 pr-4">
                    {record.latitude !== null && record.longitude !== null
                      ? `${record.latitude.toFixed(5)}, ${record.longitude.toFixed(5)}`
                      : 'N/A'}
                  </td>
                  
                  {/* 4. Velocidad */}
                  <td className="py-2 pr-4">
                    {record.speed !== null ? `${record.speed} km/h` : '-'}
                  </td>
                  
                  {/* 5. Litros en Tanque */}
                  <td className="py-2 pr-4 font-semibold text-accent-green">
                    {record.litros_totales !== null ? `${record.litros_totales} L` : '-'}
                  </td>
                  
                  {/* 6. Voltaje */}
                  <td className="py-2 pr-4">
                    {record.voltaje !== null ? `${record.voltaje/1000} V` : '-'}
                  </td>
                  
 {/* 7. Ignición */}
                  <td className="py-2 pr-4">
                    {record.ignicion !== null 
                      ? (record.ignicion === true ? 'Encendido' : 'Apagado') 
                      : '-'}
                  </td>
                  
                  {/* 8. Movimiento */}
                  <td className="py-2 pr-4">
                    {record.movimiento !== null 
                      ? (record.movimiento === true ? 'Sí' : 'No') 
                      : '-'}
                  </td>
                  
                  {/* 9. Odómetro Total */}
                  <td className="py-2 pr-4">
                    {record.odometro_total !== null ? record.odometro_total : '-'}
                  </td>
                  
                  {/* 10. Odómetro Viaje */}
                  <td className="py-2 pr-4">
                    {record.odometro_viaje !== null ? record.odometro_viaje : '-'}
                  </td>

                  {/* 11. Sensor Análogo */}
                  <td className="py-2 pr-4">
                    {record.s_analogo !== null ? record.s_analogo : '-'}
                  </td>
                  
                  {/* 12. Sensor Externo (Fuel) */}
                  <td className="py-2 pr-4 text-slate-400">
                    {record.fuel !== null ? record.fuel : '-'}
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