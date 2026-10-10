import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

// Punto devuelto por GET /api/fuel/chart
interface FuelPoint {
  imei: string;
  numero_economico: string | number | null;
  recorded_at: string;
  fuel: number | null;
}

interface ConsumptionChartCardProps {
  data: FuelPoint[];
  /** Límites del eje Y. Si no se define alguno, ese extremo es automático. */
  yMin?: number;
  yMax?: number;
  /** Marcas fijas del eje Y, p. ej. [0, 500, 1000, 1500, 2000] */
  yTicks?: number[];
}

const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7', '#06B6D4', '#EC4899'];

export function ConsumptionChartCard({ data, yMin, yMax, yTicks }: ConsumptionChartCardProps) {
  const { chartData, lineKeys } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], lineKeys: [] as string[] };

    const grouped: Record<string, Record<string, any>> = {};
    const seriesUnicas = new Set<string>();

    data.forEach((punto) => {
      if (punto.fuel == null) return;

      if (!grouped[punto.recorded_at]) {
        grouped[punto.recorded_at] = { recorded_at: punto.recorded_at };
      }
      const identificador = punto.numero_economico
        ? String(punto.numero_economico)
        : String(punto.imei);
      grouped[punto.recorded_at][identificador] = Number(punto.fuel);
      seriesUnicas.add(identificador);
    });

    const arregloFinal = Object.values(grouped).sort(
      (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );

    return { chartData: arregloFinal, lineKeys: Array.from(seriesUnicas) };
  }, [data]);

  return (
    <Card title="Lectura de Combustible (sensor)">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />

          <XAxis
            dataKey="recorded_at"
            stroke="#64748B"
            fontSize={11}
            tickFormatter={(val) =>
              new Date(val).toLocaleString('es-MX', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Hermosillo',
              })
            }
          />

          <YAxis
            stroke="#64748B"
            fontSize={11}
            domain={[yMin ?? 'auto', yMax ?? 'auto']}
            ticks={yTicks}
            allowDataOverflow={yMin !== undefined || yMax !== undefined}
            label={{ value: 'Lectura', angle: -90, position: 'insideLeft', fill: '#64748B' }}
          />

          <Tooltip
            contentStyle={{ background: '#161B29', border: '1px solid #232A3B', borderRadius: 8, fontSize: '12px' }}
            labelFormatter={(label) =>
              label == null
                ? ''
                : new Date(String(label)).toLocaleString('es-MX', { timeZone: 'America/Hermosillo' })
            }
          />

          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />

          {lineKeys.map((identificador, index) => (
            <Line
              key={identificador}
              type="monotone"
              dataKey={identificador}
              // Número económico corto -> "Unidad N"; si cae a IMEI (largo) -> últimos 4 dígitos
              name={identificador.length > 10 ? `...${identificador.slice(-4)}` : `Unidad ${identificador}`}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}