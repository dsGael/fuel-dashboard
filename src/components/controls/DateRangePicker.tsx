import React, { useState, useEffect } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
  // Estado local para los inputs (no dispara queries aún)
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);

  // Sincronizar si cambia desde afuera
  useEffect(() => {
    setLocalStart(startDate);
    setLocalEnd(endDate);
  }, [startDate, endDate]);

  const handleApply = () => {
    let finalStart = localStart;
    let finalEnd = localEnd;

    // Validación de seguridad
    if (localStart > localEnd) {
      finalEnd = localStart;
      setLocalEnd(localStart);
    }
    
    // Aquí disparamos el query global de React Query
    onChange(finalStart, finalEnd);
  };

  return (
    <div className="flex flex-col sm:flex-row items-end gap-2 sm:gap-4">
      <div className="flex flex-col">
        <label className="text-xs text-slate-400 mb-1">Fecha inicio</label>
        <input 
          type="date" 
          value={localStart}
          onChange={(e) => setLocalStart(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-slate-400 mb-1">Fecha fin</label>
        <input 
          type="date" 
          value={localEnd}
          onChange={(e) => setLocalEnd(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
        />
      </div>
      <button 
        onClick={handleApply}
        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-1.5 px-4 rounded-md transition-colors h-[34px]"
      >
        Filtrar
      </button>
    </div>
  );
};