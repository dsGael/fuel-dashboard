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

export interface VehicleLatest {
  imei: string;
  recorded_at: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  fuel: number;
  satellites: number;
}

export interface Kpis {
  totalRecords: number;
  maxSpeed: number;
  avgSpeed: number;
  maxFuel: number;
  minFuel: number;
}

export interface HistoryRecord {
  recorded_at: string;
  speed: number;
  fuel: number;
  latitude: number;
  longitude: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export type VehicleStatus = 'moving' | 'stopped' | 'no_comm';

export interface FleetVehicle extends VehicleLatest {
  status: VehicleStatus;
}

export interface FleetSummary {
  totalFuel: number;
  avgPerformance: number;
  performanceUnit: string;
  refillsToday: number;
  activeAlerts: number;
  activeUnits: number;
  totalUnits: number;
}

export interface PerformancePoint {
  date: string;
  [imei: string]: string | number;
}

export interface PerformanceSeriesResponse {
  series: PerformancePoint[];
  imeis: string[];
}

export interface ConsumptionPoint {
  date: string;
  consumo: number;
  rendimiento: number;
}

export type FleetEventType = 'refill' | 'sudden_drop' | 'no_comm';

export interface FleetEvent {
  type: FleetEventType;
  imei: string;
  recorded_at: string;
  fuel_before?: number;
  fuel_after?: number;
  delta?: number;
  minutes_since?: number;
  latitude: number;
  longitude: number;
}

export interface FuelLoad extends FleetEvent {
  liters_estimated: number | null;
}

export interface LowPerformanceUnit {
  imei: string;
  currentPerformance: number;
  previousPerformance: number;
  variationPct: number;
}

export type SelectionMode = 'single' | 'all';