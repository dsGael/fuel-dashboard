import React from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // ¡Importante! Sin esto el mapa se ve roto
import type { GpsRecord } from '../../types';

interface GpsMapProps {
  records: GpsRecord[];
}

const GpsMap: React.FC<GpsMapProps> = ({ records }) => {
  // 1. Filtrar registros que sí tengan latitud y longitud válidas
  const validRecords = records.filter(
    (r) => r.latitude !== null && r.longitude !== null
  );

  if (validRecords.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-border bg-slate-900 text-slate-500">
        No hay coordenadas válidas para mostrar en el mapa.
      </div>
    );
  }

  // 2. Extraer solo las coordenadas para la línea de la ruta (Polyline)
  const routeCoordinates = validRecords.map((r) => [r.latitude!, r.longitude!] as [number, number]);

  // 3. Definir el centro del mapa (usaremos la ubicación más reciente / primer elemento)
  const center = routeCoordinates[0];

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-xl border border-border shadow-lg">
      <MapContainer center={center} zoom={14} className="h-full w-full">
        {/* Capa base del mapa (OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dibuja la línea que une todos los puntos del recorrido */}
        <Polyline positions={routeCoordinates} color="#3b82f6" weight={4} opacity={0.7} />

        {/* Dibuja un punto interactivo por cada registro */}
        {validRecords.map((record, index) => (
          <CircleMarker
            key={`${record.imei}-${record.recorded_at}-${index}`}
            center={[record.latitude!, record.longitude!]}
            radius={5}
            color={index === 0 ? '#10b981' : '#3b82f6'} // Verde para el último punto, azul para el resto
            fillColor={index === 0 ? '#10b981' : '#1e293b'}
            fillOpacity={1}
            weight={2}
          >
            <Popup className="text-xs">
              <div className="flex flex-col gap-1 font-sans">
                <strong className="text-slate-800">IMEI: {record.imei}</strong>
                <span>Fecha: {new Date(record.recorded_at).toLocaleString('es-MX')}</span>
                <span>Velocidad: {record.speed} km/h</span>
                {record.litros_totales !== null && (
                  <span>Combustible: {record.litros_totales} L</span>
                )}
                {record.ignicion !== null && (
                  <span>Motor: {record.ignicion ? 'Encendido' : 'Apagado'}</span>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GpsMap;