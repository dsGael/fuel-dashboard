import { useVehicleSelection } from '../../context/VehicleSelectionContext';

export function VehicleSelector() {
  const { selectedImei, setSelectedImei, autobuses } = useVehicleSelection();

  return (
    <div className="flex flex-col">
      <label htmlFor="vehicle-select" className="text-xs text-slate-400 mb-1">Unidad</label>
      <select
        id="vehicle-select"
        value={selectedImei ?? ''}
        onChange={(e) => setSelectedImei(e.target.value || null)}
        className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 h-[34px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
      >
        <option value="">Todas las unidades</option>
        {autobuses.map((a) => (
          <option key={a.imei} value={a.imei}>
            Unidad {a.numero_economico ?? a.imei}
          </option>
        ))}
      </select>
    </div>
  );
}
