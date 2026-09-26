import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useFleetVehicles } from '../hooks/useFleetVehicles';
import type { SelectionMode } from '../types';

interface VehicleSelectionValue {
  mode: SelectionMode;
  setMode: (m: SelectionMode) => void;
  selectedImei: string | null;
  setSelectedImei: (imei: string) => void;
  imeis: string[]; // lista efectiva a pedir en las gráficas: [imei] o todos
  vehicles: ReturnType<typeof useFleetVehicles>['vehicles'];
  loading: boolean;
}

const VehicleSelectionContext = createContext<VehicleSelectionValue | null>(null);

export function VehicleSelectionProvider({ children }: { children: ReactNode }) {
  const { vehicles, loading } = useFleetVehicles();
  const [mode, setMode] = useState<SelectionMode>('all');
  const [selectedImei, setSelectedImei] = useState<string | null>(null);

  const imeis = useMemo(() => {
    if (mode === 'single' && selectedImei) return [selectedImei];
    return vehicles.map((v) => v.imei);
  }, [mode, selectedImei, vehicles]);

  const value: VehicleSelectionValue = {
    mode,
    setMode,
    selectedImei: selectedImei ?? vehicles[0]?.imei ?? null,
    setSelectedImei,
    imeis,
    vehicles,
    loading,
  };

  return <VehicleSelectionContext.Provider value={value}>{children}</VehicleSelectionContext.Provider>;
}

export function useVehicleSelection() {
  const ctx = useContext(VehicleSelectionContext);
  if (!ctx) throw new Error('useVehicleSelection debe usarse dentro de VehicleSelectionProvider');
  return ctx;
}