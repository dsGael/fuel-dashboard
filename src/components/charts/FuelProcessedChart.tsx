import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

// Punto devuelto por GET /api/fuel/processed/chart
export interface ProcessedPoint {
  idautobus: string;
  imei: string;
  numero_economico: string | number | null;
  ventana_inicio: string;
  //litros_calculados: number | null;
  litros_finales: number | null;
  estado_resultado?: string | null;
  actualizo_final?: boolean | null;
}

export interface ProcessedChartCardProps {
  data: ProcessedPoint[];
  /** Límites del eje Y (litros). Si no se define alguno, ese extremo es automático. */
  yMin?: number;
  yMax?: number;
  /** Marcas fijas del eje Y, p. ej. [0, 10, 20, 30, 40] */
  yTicks?: number[];
}

interface SeriesDef {
  dataKey: string; // sin puntos: Recharts interpreta "." como ruta anidada
  name: string;
  color: string;
  dashed: boolean;
}

const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7', '#06B6D4', '#EC4899'];

export function ProcessedChartCard({ data, yMin, yMax, yTicks }: ProcessedChartCardProps) {
  const { chartData, series } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], series: [] as SeriesDef[] };

    const grouped: Record<string, Record<string, any>> = {};
    const unidades: string[] = []; // orden de aparición = color estable
    const etiquetas: Record<string, string> = {};

    data.forEach((p) => {
      if (p.litros_finales == null) return;

      const unidad = p.numero_economico ? String(p.numero_economico) : String(p.idautobus ?? p.imei);
      let idx = unidades.indexOf(unidad);
      if (idx === -1) {
        unidades.push(unidad);
        idx = unidades.length - 1;
        etiquetas[unidad] = unidad.length > 10 ? `...${unidad.slice(-4)}` : `Unidad ${unidad}`;
      }

      if (!grouped[p.ventana_inicio]) grouped[p.ventana_inicio] = { ventana_inicio: p.ventana_inicio };
      // if (p.litros_calculados != null) grouped[p.ventana_inicio][`u${idx}_calc`] = Number(p.litros_calculados);
      if (p.litros_finales != null) grouped[p.ventana_inicio][`u${idx}_fin`] = Number(p.litros_finales);
    });

    const arregloFinal = Object.values(grouped).sort(
      (a, b) => new Date(a.ventana_inicio).getTime() - new Date(b.ventana_inicio).getTime()
    );

    // Dos líneas por unidad, mismo color: calculados punteada, finales sólida
    const defs: SeriesDef[] = unidades.flatMap((unidad, idx) => [
      // {
      //   dataKey: `u${idx}_calc`,
      //   name: `${etiquetas[unidad]} · calculados`,
      //   color: COLORS[idx % COLORS.length + 1],
      //   dashed: true,
      // },
      {
        dataKey: `u${idx}_fin`,
        name: `${etiquetas[unidad]} · finales`,
        color: COLORS[idx % COLORS.length],
        dashed: false,
      },
    ]);

    return { chartData: arregloFinal, series: defs };
  }, [data]);

  return (
    <Card title="Litros finales">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />

          <XAxis
            dataKey="ventana_inicio"
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
            label={{ value: 'Litros', angle: -90, position: 'insideLeft', fill: '#64748B' }}
          />

          <Tooltip
            contentStyle={{ background: '#161B29', border: '1px solid #232A3B', borderRadius: 8, fontSize: '12px' }}
            formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)} L` : value)}
            labelFormatter={(label) =>
              label == null
                ? ''
                : new Date(String(label)).toLocaleString('es-MX', { timeZone: 'America/Hermosillo' })
            }
          />

          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />

          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? '5 4' : undefined}
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