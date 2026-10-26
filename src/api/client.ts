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

const TOKEN_KEY = 'auth-token';

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // sin localStorage no hay sesión guardada que borrar
  }
}

// Devuelve el token guardado solo si sigue vigente según el `exp` del JWT
export function getToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp * 1000 > Date.now()) return token;
  } catch {
    // token malformado: se trata como sesión inválida
  }
  logout();
  return null;
}

export async function login(correo: string, password: string) {
  const { data } = await api.post<{ token: string }>('/auth/login', { correo, password });
  try {
    localStorage.setItem(TOKEN_KEY, data.token);
  } catch {
    // sin localStorage la sesión no sobrevive la recarga
  }
  return data.token;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
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