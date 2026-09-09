import axios from 'axios';
import type { ApiResponse, VehicleLatest, Kpis, HistoryRecord } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3002/api',
});

function normalizeVehicle(v: any): VehicleLatest {
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