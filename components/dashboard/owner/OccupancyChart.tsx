/**
 * OccupancyChart Component - FincAirbnb
 * 
 * Gráfico de barras que muestra la tasa de ocupación por mes
 * usando Recharts para visualización de datos
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Home, Calendar } from 'lucide-react';
import type { OccupancyData } from '@/services/mockStats';

interface OccupancyChartProps {
  data: OccupancyData[];
  isLoading?: boolean;
}

/**
 * Componente de tooltip personalizado para el gráfico
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-galician-blue mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-gray-600">Taxa de ocupación:</span>{' '}
            <span className="font-medium text-galician-green">
              {data.occupancyRate}%
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Días reservados:</span>{' '}
            <span className="font-medium text-blue-600">
              {data.bookedDays}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Días dispoñibles:</span>{' '}
            <span className="font-medium text-gray-600">
              {data.availableDays}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Componente principal del gráfico de ocupación
 */
export function OccupancyChart({ data, isLoading = false }: OccupancyChartProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  // Calcular estadísticas rápidas
  const averageOccupancy = data.reduce((sum, item) => sum + item.occupancyRate, 0) / data.length;
  const maxOccupancy = Math.max(...data.map(item => item.occupancyRate));
  const minOccupancy = Math.min(...data.map(item => item.occupancyRate));
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  const occupancyChange = previousMonth 
    ? currentMonth.occupancyRate - previousMonth.occupancyRate 
    : 0;

  // Preparar datos para mostrar tanto ocupación como días disponibles
  const chartData = data.map(item => ({
    ...item,
    diasLibres: item.availableDays - item.bookedDays,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-galician-green" />
            <CardTitle className="text-xl font-bold text-galician-blue">
              Taxa de Ocupación
            </CardTitle>
          </div>
          <Badge 
            variant={occupancyChange >= 0 ? "default" : "destructive"}
            className={occupancyChange >= 0 ? "bg-green-100 text-green-800" : ""}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {occupancyChange >= 0 ? '+' : ''}{occupancyChange.toFixed(1)}%
          </Badge>
        </div>
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Media anual:</span>{' '}
            {averageOccupancy.toFixed(1)}%
          </div>
          <div>
            <span className="font-medium">Máxima:</span>{' '}
            {maxOccupancy}%
          </div>
          <div>
            <span className="font-medium">Mínima:</span>{' '}
            {minOccupancy}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Barra de días reservados */}
              <Bar
                dataKey="occupancyRate"
                fill="#4A7C59"
                name="Taxa de ocupación (%)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas adicionales */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-galician-green mb-2">
              📈 Análise de Ocupación
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Mejor mes:</span>{' '}
                <span className="font-medium">
                  {data.find(item => item.occupancyRate === maxOccupancy)?.month}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Peor mes:</span>{' '}
                <span className="font-medium">
                  {data.find(item => item.occupancyRate === minOccupancy)?.month}
                </span>
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-galician-blue mb-2">
              📊 Comparativa Mensual
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Mes actual:</span>{' '}
                <span className="font-medium">
                  {currentMonth?.occupancyRate}%
                </span>
              </p>
              <p>
                <span className="text-gray-600">Mes anterior:</span>{' '}
                <span className="font-medium">
                  {previousMonth?.occupancyRate}%
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de rendimiento */}
        <div className="mt-4 p-4 bg-gradient-to-r from-galician-green to-galician-blue text-white rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold mb-1">Rendemento de Ocupación</h4>
              <p className="text-sm opacity-90">
                {averageOccupancy >= 70 
                  ? 'Excelente rendemento - Ocupación alta'
                  : averageOccupancy >= 50
                  ? 'Bo rendemento - Ocupación media'
                  : 'Necesita mellora - Ocupación baixa'
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {averageOccupancy.toFixed(1)}%
              </div>
              <div className="text-sm opacity-90">
                Media anual
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
