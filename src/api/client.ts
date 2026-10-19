import axios from 'axios';
import type {
  ApiResponse,
  Autobus,
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
  imei?: string | null; // null/undefined = todos
}

export async function getAutobuses() {
  const { data } = await api.get<ApiResponse<Autobus[]>>('/autobuses');
  return data.data;
}

export async function getConsumption(params?: ImeiParams) {
  const { data } = await api.get<ApiResponse<FuelPoint[]>>('/fuel/chart/CORBER', {
    params,
  });
  return data.data;
}
export async function getFuelProcessedChart(params?: ImeiParams) {
  const { data } = await api.get<ApiResponse<ProcessedPoint[]>>('/fuel/processed/chart', {
    params,
  });
  return data.data;
}

export async function getConsumptionYARIS(params?: ImeiParams) {
  const { data } = await api.get<ApiResponse<FuelPoint[]>>('/fuel/chart/YARIS', {
    params,
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

export async function getRecords(params?: ImeiParams & { limit?: number }) {
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