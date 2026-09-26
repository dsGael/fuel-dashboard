import clsx from 'clsx';
import { useVehicleSelection } from '../../context/VehicleSelectionContext';

export function VehicleSelector() {
  const { mode, setMode, selectedImei, setSelectedImei, vehicles } = useVehicleSelection();

  return (
    <div className="flex items-center gap-3">
      <div className="flex bg-card border border-border rounded-lg p-1">
        {(['single', 'all'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={clsx(
              'px-3 py-1.5 text-xs rounded-md transition-colors',
              mode === m ? 'bg-accent-blue text-white' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {m === 'single' ? 'Un camión' : 'Todos'}
          </button>
        ))}
      </div>

      {mode === 'single' && (
        <select
          value={selectedImei ?? ''}
          onChange={(e) => setSelectedImei(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-slate-200"
        >
          {vehicles.map((v) => (
            <option key={v.imei} value={v.imei}>
              Unidad {v.imei}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}