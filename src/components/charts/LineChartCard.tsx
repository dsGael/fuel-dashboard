import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface LineChartCardProps {
  title: string;
  data: Record<string, string | number>[];
  xKey: string;
  lines: { key: string; color: string; name: string }[];
  yLabel?: string;
}

export function LineChartCard({ title, data, xKey, lines, yLabel }: LineChartCardProps) {
  return (
    <Card title={title}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />
          <XAxis dataKey={xKey} stroke="#64748B" fontSize={12} />
          <YAxis stroke="#64748B" fontSize={12} label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#64748B' } : undefined} />
          <Tooltip contentStyle={{ background: '#161B29', border: '1px solid #232A3B', borderRadius: 8 }} />
          {lines.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}