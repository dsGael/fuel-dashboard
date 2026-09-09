import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface BarChartCardProps {
  title: string;
  data: Record<string, string | number>[];
  xKey: string;
  bars: { key: string; color: string; name: string }[];
}

export function BarChartCard({ title, data, xKey, bars }: BarChartCardProps) {
  return (
    <Card title={title}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />
          <XAxis dataKey={xKey} stroke="#64748B" fontSize={12} />
          <YAxis stroke="#64748B" fontSize={12} />
          <Tooltip contentStyle={{ background: '#161B29', border: '1px solid #232A3B', borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {bars.map((b) => (
            <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}