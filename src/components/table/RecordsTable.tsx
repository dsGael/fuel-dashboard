import React, { useEffect, useState } from 'react';

// Definimos la estructura de los datos que vienen de la base de datos
interface GpsRecord {
  id?: number;
  imei: string;
  recorded_at: string;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  fuel: number | null;
  satellites: number | null;
  io_data: Record<string, any> | null;
}

const RecordsTable: React.FC = () => {
  const [records, setRecords] = useState<GpsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // Llama a tu endpoint (ajusta el puerto/URL si lo publicas en producción)
        const response = await fetch('http://localhost:3002/api/records?limit=100');
        const result = await response.json();

        if (result.success) {
          setRecords(result.data);
        } else {
          setError(result.error || 'Error al obtener los registros');
        }
      } catch (err) {
        setError('Error de conexión con el servidor de base de datos');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Cargando registros...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Historial Crudo de Registros GPS ({records.length})
      </h2>
      
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3 border-b">IMEI</th>
            <th className="px-4 py-3 border-b">Fecha y Hora</th>
            <th className="px-4 py-3 border-b">Lat / Lng</th>
            <th className="px-4 py-3 border-b">Velocidad</th>
            <th className="px-4 py-3 border-b">Combustible</th>
            <th className="px-4 py-3 border-b">Sats</th>
            <th className="px-4 py-3 border-b">IO Data (Raw)</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                No hay registros en la base de datos.
              </td>
            </tr>
          ) : (
            records.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-3 font-medium text-gray-900">{record.imei}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(record.recorded_at).toLocaleString('es-MX')}
                </td>
                <td className="px-4 py-3">
                  {record.latitude !== null && record.longitude !== null 
                    ? `${record.latitude.toFixed(5)}, ${record.longitude.toFixed(5)}`
                    : 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {record.speed !== null ? `${record.speed} km/h` : '-'}
                </td>
                <td className="px-4 py-3 font-semibold text-blue-600">
                  {record.fuel !== null ? record.fuel : '-'}
                </td>
                <td className="px-4 py-3">{record.satellites ?? '-'}</td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate" title={JSON.stringify(record.io_data)}>
                  {record.io_data ? JSON.stringify(record.io_data) : '{}'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;