/**
 * OwnerStats Component - FincAirbnb
 * 
 * Componente que muestra las estadísticas principales del propietario
 * en tarjetas organizadas con iconos y colores del brand
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calendar, 
  Euro, 
  TrendingUp, 
  Star, 
  MessageSquare,
  Users,
  XCircle
} from 'lucide-react';
import type { OwnerStats } from '@/services/mockStats';

interface OwnerStatsProps {
  stats: OwnerStats;
  isLoading?: boolean;
}

/**
 * Componente de tarjeta de estadística individual
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

function StatCard({ title, value, icon, color, subtitle, trend, trendValue }: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-galician-blue mb-1">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500">
                {subtitle}
              </p>
            )}
            {trend && trendValue && (
              <div className="flex items-center mt-1">
                {getTrendIcon()}
                <span className={`text-xs ml-1 ${getTrendColor()}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente principal de estadísticas del propietario
 */
export function OwnerStats({ stats, isLoading = false }: OwnerStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título de la sección */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-galician-blue">
          Estatísticas do Negocio
        </h2>
        <Badge variant="outline" className="text-galician-green border-galician-green">
          Mes actual
        </Badge>
      </div>

      {/* Grid de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Propiedades Activas */}
        <StatCard
          title="Propiedades Activas"
          value={stats.activeProperties}
          subtitle={`de ${stats.totalProperties} total`}
          icon={<Home className="h-6 w-6 text-white" />}
          color="bg-galician-blue"
          trend="up"
          trendValue="+1 este mes"
        />

        {/* Reservas del Mes */}
        <StatCard
          title="Reservas do Mes"
          value={stats.monthlyBookings}
          subtitle="novas reservas"
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-galician-green"
          trend="up"
          trendValue="+12% vs mes anterior"
        />

        {/* Ingresos Mensuales */}
        <StatCard
          title="Ingresos do Mes"
          value={`${stats.monthlyRevenue.toLocaleString('es-ES')}€`}
          subtitle="ingresos mensuais"
          icon={<Euro className="h-6 w-6 text-white" />}
          color="bg-green-600"
          trend="up"
          trendValue="+8% vs mes anterior"
        />

        {/* Tasa de Ocupación */}
        <StatCard
          title="Taxa de Ocupación"
          value={`${stats.occupancyRate}%`}
          subtitle="ocupación media"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-blue-600"
          trend="up"
          trendValue="+5% vs mes anterior"
        />
      </div>

      {/* Grid de estadísticas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rating Promedio */}
        <StatCard
          title="Valoración Media"
          value={stats.averageRating}
          subtitle={`de ${stats.totalReviews} valoracións`}
          icon={<Star className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
          trend="neutral"
          trendValue="Estable"
        />

        {/* Tasa de Respuesta */}
        <StatCard
          title="Taxa de Resposta"
          value={`${stats.responseRate}%`}
          subtitle="tempo de resposta"
          icon={<MessageSquare className="h-6 w-6 text-white" />}
          color="bg-purple-600"
          trend="up"
          trendValue="+2% vs mes anterior"
        />

        {/* Total de Reservas */}
        <StatCard
          title="Total de Reservas"
          value={stats.totalBookings}
          subtitle="reservas totais"
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-indigo-600"
          trend="up"
          trendValue="+15 este mes"
        />

        {/* Tasa de Cancelación */}
        <StatCard
          title="Taxa de Cancelación"
          value={`${stats.cancellationRate}%`}
          subtitle="cancelacións"
          icon={<XCircle className="h-6 w-6 text-white" />}
          color="bg-red-500"
          trend="down"
          trendValue="-1% vs mes anterior"
        />
      </div>

      {/* Resumen anual */}
      <Card className="bg-gradient-to-r from-galician-blue to-galician-green text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Ingresos Anuais
              </h3>
              <p className="text-3xl font-bold">
                {stats.yearlyRevenue.toLocaleString('es-ES')}€
              </p>
              <p className="text-sm opacity-90 mt-1">
                {stats.totalBookings} reservas en total
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl opacity-20">
                <Euro className="h-12 w-12" />
              </div>
              <p className="text-sm mt-2">
                +22% vs ano anterior
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
