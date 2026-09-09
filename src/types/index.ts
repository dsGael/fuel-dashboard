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