import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Card } from '../ui/Card';

// Punto devuelto por GET /api/fuel/processed/chart (una fila por ventana de 5 min)
export interface ProcessedPoint {
  idautobus: string;
  imei: string;
  numero_economico: string | number | null;
  ventana_inicio: string;
  ventana_fin: string;
  litros: number | null;
  calidad_ventana?: string | null;
  motivo_calidad?: string | null;
  encendido?: boolean | null; // ignición dominante de la ventana
}

export interface ProcessedChartCardProps {
  data: ProcessedPoint[];
  /** Límites del eje Y (litros). Si no se define alguno, ese extremo es automático. */
  yMin?: number;
  yMax?: number;
  /** Marcas fijas del eje Y, p. ej. [0, 10, 20, 30, 40] */
  yTicks?: number[];
  /** IMEI seleccionado: solo con un vehículo elegido se sombrea encendido/apagado */
  selectedImei?: string | null;
}

interface SeriesDef {
  dataKey: string; // sin puntos: Recharts interpreta "." como ruta anidada
  name: string;
  color: string;
}

interface StateRange {
  x1: string;
  x2: string;
  encendido: boolean;
}

const COLORS = ['#22C55E', '#F59E0B', '#F59E0B', '#EF4444', '#A855F7', '#06B6D4', '#EC4899'];

export function ProcessedChartCard({ data, yMin, yMax, yTicks, selectedImei }: ProcessedChartCardProps) {
  const { chartData, series, ranges } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], series: [] as SeriesDef[], ranges: [] as StateRange[] };

    const grouped: Record<string, Record<string, any>> = {};
    const unidades: string[] = []; // orden de aparición = color estable

    // Estado por ventana del vehículo seleccionado. Se registra aunque no haya litros,
    // para que los extremos de las áreas existan como categorías del eje X.
    const encendidoPorVentana: Record<string, boolean> = {};

    data.forEach((p) => {
      if (selectedImei && p.imei === selectedImei && p.encendido != null) {
        encendidoPorVentana[p.ventana_inicio] = p.encendido;
        if (!grouped[p.ventana_inicio]) grouped[p.ventana_inicio] = { ventana_inicio: p.ventana_inicio };
      }
      if (p.litros == null) return;

      const unidad = p.numero_economico ? String(p.numero_economico) : String(p.idautobus ?? p.imei);
      let idx = unidades.indexOf(unidad);
      if (idx === -1) {
        unidades.push(unidad);
        idx = unidades.length - 1;
      }

      if (!grouped[p.ventana_inicio]) grouped[p.ventana_inicio] = { ventana_inicio: p.ventana_inicio };
      grouped[p.ventana_inicio][`u${idx}`] = Number(p.litros);
    });

    const arregloFinal = Object.values(grouped).sort(
      (a, b) => new Date(a.ventana_inicio).getTime() - new Date(b.ventana_inicio).getTime()
    );

    const defs: SeriesDef[] = unidades.map((unidad, idx) => ({
      dataKey: `u${idx}`,
      name: unidad.length > 10 ? `...${unidad.slice(-4)}` : `Unidad ${unidad}`,
      color: COLORS[idx % COLORS.length],
    }));

    // Tramos consecutivos con el mismo estado; cada tramo llega hasta el inicio del siguiente punto
    const rangos: StateRange[] = [];
    let actual: StateRange | null = null;
    arregloFinal.forEach((pt, i) => {
      const est = encendidoPorVentana[pt.ventana_inicio];
      if (est === undefined) return;
      if (actual?.encendido === est) {
        actual.x2 = pt.ventana_inicio;
      } else {
        if (actual) actual.x2 = pt.ventana_inicio;
        actual = { x1: pt.ventana_inicio, x2: pt.ventana_inicio, encendido: est };
        rangos.push(actual);
      }
      if (i === arregloFinal.length - 1) actual.x2 = pt.ventana_inicio;
    });

    return { chartData: arregloFinal, series: defs, ranges: rangos };
  }, [data, selectedImei]);

  return (
    <Card title="Litros por ventana">
      {/* debounce > duración de la animación de la sidebar (200 ms): redibuja una sola vez al terminar */}
      <ResponsiveContainer width="100%" height={280} debounce={500}>
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

          {ranges.map((r, i) => (
            <ReferenceArea
              key={i}
              x1={r.x1}
              x2={r.x2}
              fill={r.encendido ? '#22C55E' : '#EF4444'}
              fillOpacity={0.12}
              ifOverflow="visible"
            />
          ))}

          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name}
              stroke={s.color}
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
