import { createContext, useContext, useState, type ReactNode } from 'react';
import { useAutobuses } from '../hooks/useAutobuses';

interface VehicleSelectionValue {
  selectedImei: string | null; // null = todas las unidades
  setSelectedImei: (imei: string | null) => void;
  autobuses: ReturnType<typeof useAutobuses>['autobuses'];
  loading: boolean;
}

const VehicleSelectionContext = createContext<VehicleSelectionValue | null>(null);

export function VehicleSelectionProvider({ children }: { children: ReactNode }) {
  const { autobuses, loading } = useAutobuses();
  const [selectedImei, setSelectedImei] = useState<string | null>(null);

  return (
    <VehicleSelectionContext.Provider value={{ selectedImei, setSelectedImei, autobuses, loading }}>
      {children}
    </VehicleSelectionContext.Provider>
  );
}

export function useVehicleSelection() {
  const ctx = useContext(VehicleSelectionContext);
  if (!ctx) throw new Error('useVehicleSelection debe usarse dentro de VehicleSelectionProvider');
  return ctx;
}
