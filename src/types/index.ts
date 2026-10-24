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

export interface FuelProcessedRecord {
  id: string | number;
  ventana_id: string | number | null;
  ventana_inicio: string;
  fecha_proceso: string | null;
  imei: string;
  idautobus: number | null;
  numero_economico?: string | number | null;
  litros_calculados: number | null;
  litros_finales: number | null;
  ultimo_valor_confiable_anterior: number | null;
  diferencia_litros: number | null;
  km_desde_ultimo_confiable: number | null;
  rendimiento_usado: number | null;
  consumo_esperado: number | null;
  exceso_no_explicado: number | null;
  calibracion_version_usada: string | number | null;
  actualizo_final: boolean | null;
  estado_resultado: string | null;
  motivo: string | null;
}

export interface FuelProcessedQuery {
  limit?: number;
  offset?: number;
  imei?: string;
  idautobus?: string | number;
  startDate?: string; // YYYY-MM-DD (endDate inclusivo) o ISO
  endDate?: string;
}