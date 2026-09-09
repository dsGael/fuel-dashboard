import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

type Trend = 'up' | 'down' | 'neutral';

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  delta?: string;
  trend?: Trend;
  sparkline?: number[];
}

const colorMap = {
  blue: 'bg-accent-blue/15 text-accent-blue',
  green: 'bg-accent-green/15 text-accent-green',
  orange: 'bg-accent-orange/15 text-accent-orange',
  red: 'bg-accent-red/15 text-accent-red',
  purple: 'bg-accent-purple/15 text-accent-purple',
};

const trendColor: Record<Trend, string> = {
  up: 'text-accent-green',
  down: 'text-accent-red',
  neutral: 'text-slate-400',
};

export function KpiCard({ label, value, icon: Icon, color, delta, trend = 'neutral' }: KpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className={clsx('w-10 h-10 rounded-full flex items-center justify-center shrink-0', colorMap[color])}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-xl font-semibold leading-tight">{value}</p>
        </div>
      </div>
      {delta && <span className={clsx('text-xs font-medium', trendColor[trend])}>{delta}</span>}
    </div>
  );
}