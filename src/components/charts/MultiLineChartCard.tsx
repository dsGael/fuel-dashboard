import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import type { PerformancePoint } from '../../types';

interface MultiLineChartCardProps {
  title: string;
  data: PerformancePoint[];
  seriesKeys: string[]; // IMEIs
  yLabel?: string;
  action?: React.ReactNode;
}

const PALETTE = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function MultiLineChartCard({ title, data, seriesKeys, yLabel, action }: MultiLineChartCardProps) {
  return (
    <Card title={title} action={action}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />
          <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
          <YAxis
            stroke="#64748B"
            fontSize={12}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#64748B' } : undefined}
          />
          <Tooltip contentStyle={{ background: '#161B29', border: '1px solid #232A3B', borderRadius: 8 }} />
          {seriesKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
          {seriesKeys.map((imei, i) => (
            <Line
              key={imei}
              type="monotone"
              dataKey={imei}
              name={`Unidad ${imei}`}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}