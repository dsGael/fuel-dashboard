import axios from 'axios';
import type {
  ApiResponse,
  FleetVehicle,
  FuelPoint,
  FuelProcessedRecord,
  FuelProcessedQuery,
  PagedResponse,
} from '../types';
import type { ProcessedPoint } from '../components/charts/FuelProcessedChart';

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

export async function getConsumption(params?: ImeiParams) {
  const { data } = await api.get<ApiResponse<FuelPoint[]>>('/fuel/chart/CORBER', {
    params: { ...params, imeis: params?.imeis?.join(',') },
  });
  return data.data;
}
export async function getFuelProcessedChart(params?: ImeiParams) {
  const { data } = await api.get<ApiResponse<ProcessedPoint[]>>('/fuel/processed/chart', {
    params: { ...params, imeis: params?.imeis?.join(',') },
  });
  return data.data;
}

export async function getConsumptionYARIS(params?: ImeiParams) {
  const { data } = await api.get<ApiResponse<FuelPoint[]>>('/fuel/chart/YARIS', {
    params: { ...params, imeis: params?.imeis?.join(',') },
  });
  return data.data;
}

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

export async function getRecords(params?: { limit?: number; startDate?: string; endDate?: string }) {
  const { data } = await api.get<ApiResponse<any[]>>('/records', { params });
  return data.data.map(normalizeRecord);
}

export async function getFuelProcessedRecords(params?: FuelProcessedQuery, signal?: AbortSignal) {
  const { data } = await api.get<PagedResponse<FuelProcessedRecord[]>>('/fuel/processed', {
    params,
    signal,
  });
  return { rows: data.data, total: data.total };
}