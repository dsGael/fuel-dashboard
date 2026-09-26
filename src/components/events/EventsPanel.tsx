import { Fuel, AlertTriangle, WifiOff } from 'lucide-react';
import { Card } from '../ui/Card';
import type { FleetEvent } from '../../types';

const CONFIG = {
  refill: { icon: Fuel, color: 'text-accent-blue bg-accent-blue/15', label: 'Posible recarga de combustible' },
  sudden_drop: { icon: AlertTriangle, color: 'text-accent-red bg-accent-red/15', label: 'Posible extracción de combustible' },
  no_comm: { icon: WifiOff, color: 'text-accent-orange bg-accent-orange/15', label: 'Sin comunicación' },
};

export function EventsPanel({ events }: Readonly<{ events: FleetEvent[] }>) {
  return (
    <Card title="Eventos y alertas recientes" >
      <ul className="space-y-3 max-h-70 overflow-y-auto px-5 py-2">
        {events.length === 0 && <p className="text-xs text-slate-500">Sin eventos en este período.</p>}
        {events.map((e, i) => {
          const cfg = CONFIG[e.type];
          const Icon = cfg.icon;
          return (
            <li key={`${e.imei}-${e.recorded_at}-${i}`} className="flex items-start gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.color}`}>
                <Icon size={15} />
              </span>
              <div className="flex-1 text-xs">
                <p className="text-slate-200 font-medium">{cfg.label}</p>
                <p className="text-slate-500">
                  Unidad {e.imei} · {new Date(e.recorded_at).toLocaleString()}
                </p>
              </div>
              {e.delta !== undefined && (
                <span className={e.delta < 0 ? 'text-accent-red text-xs' : 'text-accent-green text-xs'}>
                  {e.delta > 0 ? '+' : ''}
                  {e.delta}%
                </span>
              )}
              {e.minutes_since !== undefined && (
                <span className="text-slate-400 text-xs">{e.minutes_since} min</span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}