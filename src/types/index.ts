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
  ralenti: boolean | null;
  inclinacion_horizontal: number | null;
  inclinacion_vertical: number | null;
  numero_economico?: string | null; 
  
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface Autobus {
  idautobus: number;
  numero_economico: string | number | null;
  imei: string;
}

export interface FuelPoint {
  imei: string;
  numero_economico: string | number | null;
  recorded_at: string;
  fuel: number | null;
  inclinacion_horizontal?: number | null;
  inclinacion_vertical?: number | null;
}

// Respuesta paginada de la API (ApiResponse + total)
export interface PagedResponse<T> extends ApiResponse<T> {
  count: number;
  total: number;
  limit: number;
  offset: number;
}

// Fila de GET /api/fuel/processed (fuel_windows + idautobus y numero_economico)
export interface FuelProcessedRecord {
  id: string;
  imei: string;
  ventana_inicio: string;
  ventana_fin: string;
  muestras_totales: number | null;
  muestras_validas: number | null;
  sensor_mediana: number | null;
  sensor_promedio: number | null;
  sensor_min: number | null;
  sensor_max: number | null;
  inclinacion_mediana: number | null;
  angulo_corregido: number | null;
  porcentaje_angulo_valido: number | null;
  velocidad_promedio: number | null;
  ignicion_dominante: boolean | null;
  odometro_total: number | null;
  calidad_ventana: string | null;
  motivo_calidad: string | null;
  created_at: string;
  litros: number | null;
  estado_calibracion: string | null;
  idautobus: string | null;
  numero_economico?: string | number | null;
  litros_calculados: number | null;
}

export interface FuelProcessedQuery {
  limit?: number;
  offset?: number;
  imei?: string;
  idautobus?: string | number;
  startDate?: string; // YYYY-MM-DD (endDate inclusivo) o ISO
  endDate?: string;
}