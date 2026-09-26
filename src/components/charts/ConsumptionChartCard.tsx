import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import type { ConsumptionPoint } from '../../types';

interface ConsumptionChartCardProps {
  data: ConsumptionPoint[];
}

export function ConsumptionChartCard({ data }: ConsumptionChartCardProps) {
  return (
    <Card title="Consumo vs Rendimiento">
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />
          <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
          <YAxis yAxisId="left" stroke="#64748B" fontSize={12} label={{ value: '% consumido', angle: -90, position: 'insideLeft', fill: '#64748B' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={12} label={{ value: 'km/%', angle: 90, position: 'insideRight', fill: '#64748B' }} />
          <Tooltip contentStyle={{ background: '#161B29', border: '1px solid #232A3B', borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="consumo" name="Consumo (% fuel)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="rendimiento" name="Rendimiento (km/%)" stroke="#22C55E" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}