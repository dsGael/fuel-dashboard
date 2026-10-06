import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface ConsumptionChartCardProps {
  data: any[]; 
}

const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7', '#06B6D4', '#EC4899'];

export function ConsumptionChartCard({ data }: ConsumptionChartCardProps) {
  
  const { chartData, lineKeys } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], lineKeys: [] };

    const grouped: Record<string, any> = {};
    const imeisUnicos = new Set<string>();

    // Agrupamos la data que ya viene filtrada desde el backend
    data.forEach((punto) => {
      if(punto.valido===false) return;

      if (!grouped[punto.date]) {
        grouped[punto.date] = { date: punto.date };
      }
      grouped[punto.date][punto.imei] = punto.litros;
      imeisUnicos.add(punto.imei);

    });

    const arregloFinal = Object.values(grouped).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return { 
      chartData: arregloFinal, 
      lineKeys: Array.from(imeisUnicos) 
    };
  }, [data]);

  return (
    <Card title="Nivel de Combustible en Tanque (Litros)">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#232A3B" />
          
          <XAxis 
            dataKey="date" 
            stroke="#64748B" 
            fontSize={11} 
            tickFormatter={(val) => {
              const date = new Date(val);
              // Mostramos día, mes y hora para que se vea bien sin importar el tamaño del rango seleccionado globalmente
              return date.toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            }}
          />
          
          <YAxis 
            stroke="#64748B" 
            fontSize={11} 
            domain={['auto', 'auto']}
            label={{ value: 'Litros (L)', angle: -90, position: 'insideLeft', fill: '#64748B' }} 
          />
          
          <Tooltip 
            contentStyle={{ background: '#161B29', border: '1px solid #232A3B', borderRadius: 8, fontSize: '12px' }}
            labelFormatter={(label) =>
              label == null ? '' : new Date(String(label)).toLocaleString('es-MX')
            }
          />
          
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />

          {lineKeys.map((imei, index) => (
            <Line 
              key={imei}
              type="monotone" 
              dataKey={imei} 
              name={`Unidad ${String(imei).slice(-4)}`} 
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