/**
 * RevenueChart Component - FincAirbnb
 * 
 * Gráfico de líneas que muestra la evolución de ingresos mensuales
 * usando Recharts para visualización de datos
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Euro } from 'lucide-react';
import type { RevenueData } from '@/services/mockStats';

interface RevenueChartProps {
  data: RevenueData[];
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
            <span className="text-gray-600">Ingresos:</span>{' '}
            <span className="font-medium text-green-600">
              {data.revenue ? (typeof window !== 'undefined' ? data.revenue.toLocaleString('es-ES') : data.revenue.toString()) : 'N/A'}€
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Reservas:</span>{' '}
            <span className="font-medium text-galician-blue">
              {data.bookings || 'N/A'}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Prezo medio:</span>{' '}
            <span className="font-medium text-purple-600">
              {data.averagePrice ? (typeof window !== 'undefined' ? data.averagePrice.toLocaleString('es-ES') : data.averagePrice.toString()) : 'N/A'}€
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Componente principal del gráfico de ingresos
 */
export function RevenueChart({ data, isLoading = false }: RevenueChartProps) {
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
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / data.length;
  const growthRate = data.length > 1 
    ? ((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Euro className="h-5 w-5 text-galician-blue" />
            <CardTitle className="text-xl font-bold text-galician-blue">
              Evolución de Ingresos
            </CardTitle>
          </div>
          <Badge 
            variant={growthRate >= 0 ? "default" : "destructive"}
            className={growthRate >= 0 ? "bg-green-100 text-green-800" : ""}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </Badge>
        </div>
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Total:</span>{' '}
            {totalRevenue.toLocaleString('es-ES')}€
          </div>
          <div>
            <span className="font-medium">Media:</span>{' '}
            {averageRevenue.toLocaleString('es-ES')}€/mes
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}€`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Línea de ingresos */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0066CC"
                strokeWidth={3}
                dot={{ fill: '#0066CC', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0066CC', strokeWidth: 2 }}
                name="Ingresos (€)"
              />
              
              {/* Línea de número de reservas (escala secundaria) */}
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#4A7C59"
                strokeWidth={2}
                dot={{ fill: '#4A7C59', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#4A7C59', strokeWidth: 2 }}
                name="Reservas"
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas adicionales */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Mes con máis ingresos</p>
            <p className="font-semibold text-galician-blue">
              {data.reduce((max, item) => item.revenue > max.revenue ? item : max, data[0])?.month}
            </p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Mes con máis reservas</p>
            <p className="font-semibold text-galician-green">
              {data.reduce((max, item) => item.bookings > max.bookings ? item : max, data[0])?.month}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Prezo medio</p>
            <p className="font-semibold text-purple-600">
              {Math.round(data.reduce((sum, item) => sum + item.averagePrice, 0) / data.length)}€
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
