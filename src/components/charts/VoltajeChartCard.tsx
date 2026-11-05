import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Card } from '../ui/Card';
import type { GpsRecord } from '../../types';

const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7', '#06B6D4', '#EC4899'];

const formatFecha = (val: unknown, opts?: Intl.DateTimeFormatOptions) =>
  new Date(String(val)).toLocaleString('es-MX', { ...opts, timeZone: 'America/Hermosillo' });

interface VoltajeChartCardProps {
  data: GpsRecord[];
  /** Límites del eje Y en voltios. Si no se define alguno, ese extremo es automático. */
  yMin?: number;
  yMax?: number;
  /** IMEI seleccionado: solo con un vehículo elegido se sombrea encendido/apagado */
  selectedImei?: string | null;
}

interface StateRange {
  x1: string;
  x2: string;
  encendido: boolean;
}

export function VoltajeChartCard({ data, yMin, yMax, selectedImei }: Readonly<VoltajeChartCardProps>) {
  const { chartData, lineKeys, ranges } = useMemo(() => {
    const grouped: Record<string, Record<string, any>> = {};
    const series = new Set<string>();
    const encendidoPorRegistro: Record<string, boolean> = {};

    data.forEach((r) => {
      if (selectedImei && r.imei === selectedImei && r.ignicion != null) {
        encendidoPorRegistro[r.recorded_at] = r.ignicion;
        grouped[r.recorded_at] ??= { recorded_at: r.recorded_at };
      }
      if (r.voltaje == null) return;
      const id = r.numero_economico ? String(r.numero_economico) : String(r.imei);
      grouped[r.recorded_at] ??= { recorded_at: r.recorded_at };
      grouped[r.recorded_at][id] = Number(r.voltaje) / 1000; // el GPS reporta mV
      series.add(id);
    });

    // la API puede devolver los registros en orden descendente
    const ordenado = Object.values(grouped).sort(
      (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );
    // Tramos consecutivos con el mismo estado (misma lógica que la gráfica de litros)
    const rangos: StateRange[] = [];
    let actual: StateRange | null = null;
    ordenado.forEach((pt, i) => {
      const est = encendidoPorRegistro[pt.recorded_at];
      if (est === undefined) return;
      if (actual?.encendido === est) {
        actual.x2 = pt.recorded_at;
      } else {
        if (actual) actual.x2 = pt.recorded_at;
        actual = { x1: pt.recorded_at, x2: pt.recorded_at, encendido: est };
        rangos.push(actual);
      }
      if (i === ordenado.length - 1) actual.x2 = pt.recorded_at;
    });

    return { chartData: ordenado, lineKeys: Array.from(series), ranges: rangos };
  }, [data, selectedImei]);

  return (
    <Card title="Voltaje de batería">
      <ResponsiveContainer width="100%" height={280} debounce={500}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />
          <XAxis
            dataKey="recorded_at"
            stroke="#64748B"
            fontSize={11}
            tickFormatter={(val) =>
              formatFecha(val, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            }
          />
          <YAxis
            stroke="#64748B"
            fontSize={11}
            domain={[yMin ?? 'auto', yMax ?? 'auto']}
            allowDataOverflow={yMin !== undefined || yMax !== undefined}
            label={{ value: 'Voltaje', angle: -90, position: 'insideLeft', fill: '#64748B' }}
          />
          <Tooltip
            contentStyle={{ background: '#161B29', border: '1px solid #232A3B', borderRadius: 8, fontSize: '12px' }}
            labelFormatter={(label) => (label == null ? '' : formatFecha(label))}
            formatter={(value, name) => [`${Number(value).toFixed(2)} V`, name]}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
          {ranges.map((r, i) => (
            <ReferenceArea
              key={i}
              x1={r.x1}
              x2={r.x2}
              fill={r.encendido ? '#15e863' : '#EF4444'}
              fillOpacity={0.3}
              ifOverflow="visible"
            />
          ))}
          {lineKeys.map((id, index) => (
            <Line
              key={id}
              type="monotone"
              dataKey={id}
              name={id.length > 10 ? `...${id.slice(-4)}` : `Unidad ${id}`}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
