import axios from 'axios';
import type { 
  ApiResponse, VehicleLatest, Kpis, HistoryRecord,
  FleetVehicle,
  FleetSummary,
  PerformanceSeriesResponse,
  ConsumptionPoint,
  FleetEvent,
  FuelLoad,
  LowPerformanceUnit,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3002/api',
});

interface RangeParams {
  startDate?: string;
  endDate?: string;
}

interface ImeiParams extends RangeParams {
  imeis?: string[]; // undefined = todos
}

function normalizeVehicle(v: any): FleetVehicle {
  return {
    ...v,
    latitude: Number(v.latitude),
    longitude: Number(v.longitude),
    speed: Number(v.speed),
    heading: Number(v.heading),
    fuel: Number(v.fuel),
    satellites: Number(v.satellites),
  };
}

export async function getFleetVehicles() {
  const { data } = await api.get<ApiResponse<any[]>>('/fleet/vehicles');
  return data.data.map(normalizeVehicle);
}

export async function getFleetSummary(params?: RangeParams) {
  const { data } = await api.get<ApiResponse<FleetSummary>>('/fleet/summary', { params });
  return data.data;
}

export async function getPerformanceSeries(params?: ImeiParams) {
  const { data } = await api.get<ApiResponse<PerformanceSeriesResponse>>('/fleet/performance/series', {
    params: { ...params, imeis: params?.imeis?.join(',') },
  });
  return data.data;
}

export async function getConsumption(params?: ImeiParams) {
  const { data } = await api.get<ApiResponse<ConsumptionPoint[]>>('/fleet/consumption', {
    params: { ...params, imeis: params?.imeis?.join(',') },
  });
  return data.data;
}

export async function getFleetEvents(params?: ImeiParams & { refillThreshold?: number; dropThreshold?: number }) {
  const { data } = await api.get<ApiResponse<FleetEvent[]>>('/fleet/events', {
    params: { ...params, imeis: params?.imeis?.join(',') },
  });
  return data.data;
}

export async function getFuelLoads(params?: ImeiParams & { refillThreshold?: number }) {
  const { data } = await api.get<ApiResponse<FuelLoad[]>>('/fleet/fuel-loads', {
    params: { ...params, imeis: params?.imeis?.join(',') },
  });
  return data.data;
}

export async function getLowPerformance(params?: RangeParams) {
  const { data } = await api.get<ApiResponse<LowPerformanceUnit[]>>('/fleet/low-performance', { params });
  return data.data;
}

export async function getLatestVehicles() {
  const { data } = await api.get<ApiResponse<VehicleLatest[]>>('/vehicles/latest');
  return data.data.map(normalizeVehicle);
}

export async function getKpis(params?: { startDate?: string; endDate?: string; imei?: string }) {
  const { data } = await api.get<ApiResponse<Kpis>>('/kpis', { params });
  return data.data;
}

function normalizeHistory(h: any): HistoryRecord {
  return {
    ...h,
    speed: Number(h.speed),
    fuel: Number(h.fuel),
    latitude: Number(h.latitude),
    longitude: Number(h.longitude),
  };
}

export async function getHistory(imei: string, params?: { startDate?: string; endDate?: string }) {
  const { data } = await api.get<ApiResponse<HistoryRecord[]>>('/history', {
    params: { imei, ...params },
  });
  return data.data.map(normalizeHistory);
}

// --- NUEVO PARA LA TABLA DE REGISTROS CRUDOS ---
function normalizeRecord(r: any) {
  return {
    ...r,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    speed: Number(r.speed),
    heading: Number(r.heading),
    fuel: Number(r.fuel),
    satellites: Number(r.satellites),
    altitude: Number(r.altitude),
  };
}

export async function getRecords(params?: { limit?: number }) {
  const { data } = await api.get<ApiResponse<any[]>>('/records', { params });
  return data.data.map(normalizeRecord);
}

// En tu archivo api/client.ts (o donde tengas getRecords)

export const getFuel5MinRecords = async ({ limit = 1000 }) => {
  const response = await fetch(`/api/fuel-5min?limit=${limit}`);
  const json = await response.json();
  
  if (!json.success) {
    throw new Error(json.error || 'Error al obtener bloques de 5 min');
  }
  
  return json.data;
};