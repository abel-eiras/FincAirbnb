/**
 * RecentActivity Component - FincAirbnb
 * 
 * Componente que muestra la actividad reciente del propietario
 * con eventos como nuevas reservas, valoraciones, mensajes, etc.
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  Calendar,
  Star,
  MessageSquare,
  Euro,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import type { RecentActivity } from '@/services/mockStats';

interface RecentActivityProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

/**
 * Función para formatear fechas relativas en gallego
 */
function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Hai menos dunha hora';
  } else if (diffInHours < 24) {
    return `Hai ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hai ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }
}

/**
 * Función para obtener el icono y color según el tipo de actividad
 */
function getActivityIcon(type: string) {
  switch (type) {
    case 'booking':
      return {
        icon: <Calendar className="h-5 w-5" />,
        color: 'text-galician-blue',
        bgColor: 'bg-blue-100'
      };
    case 'review':
      return {
        icon: <Star className="h-5 w-5" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    case 'message':
      return {
        icon: <MessageSquare className="h-5 w-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      };
    case 'payment':
      return {
        icon: <Euro className="h-5 w-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    case 'cancellation':
      return {
        icon: <XCircle className="h-5 w-5" />,
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      };
    default:
      return {
        icon: <Activity className="h-5 w-5" />,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      };
  }
}

/**
 * Componente de tarjeta individual de actividad
 */
interface ActivityCardProps {
  activity: RecentActivity;
  onViewDetails: (activityId: string) => void;
}

function ActivityCard({ activity, onViewDetails }: ActivityCardProps) {
  const iconInfo = getActivityIcon(activity.type);

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      {/* Icono de actividad */}
      <div className={`p-2 rounded-full ${iconInfo.bgColor} ${iconInfo.color}`}>
        {iconInfo.icon}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {activity.title}
            </h4>
            <p className="text-sm text-gray-600 mb-1">
              {activity.description}
            </p>
            {activity.propertyName && (
              <p className="text-xs text-galician-blue font-medium">
                {activity.propertyName}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {/* Información adicional */}
            {activity.amount && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                {activity.amount.toLocaleString('es-ES')}€
              </Badge>
            )}
            {activity.rating && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                <Star className="h-3 w-3 mr-1" />
                {activity.rating}
              </Badge>
            )}
            {/* Botón de ver detalles */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onViewDetails(activity.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Timestamp */}
        <div className="flex items-center mt-2">
          <Clock className="h-3 w-3 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente principal de actividad reciente
 */
export function RecentActivity({ activities, isLoading = false }: RecentActivityProps) {
  const handleViewDetails = (activityId: string) => {
    console.log('Ver detalles de actividad:', activityId);
    // TODO: Navegar a página de detalles o mostrar modal
  };

  const handleViewAllActivity = () => {
    console.log('Ver toda la actividad');
    // TODO: Navegar a página de actividad completa
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar máximo 5 actividades
  const recentActivities = activities.slice(0, 5);

  // Contar tipos de actividad
  const activityCounts = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-galician-blue" />
            <CardTitle className="text-xl font-bold text-galician-blue">
              Actividade Recente
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllActivity}
          >
            Ver toda
          </Button>
        </div>
        
        {/* Resumen de actividad */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {activityCounts.booking > 0 && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-galician-blue mr-1" />
              <span>{activityCounts.booking} reservas</span>
            </div>
          )}
          {activityCounts.review > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-600 mr-1" />
              <span>{activityCounts.review} valoracións</span>
            </div>
          )}
          {activityCounts.message > 0 && (
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-purple-600 mr-1" />
              <span>{activityCounts.message} mensaxes</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Non hai actividade recente</p>
            <p className="text-sm">
              A actividade do teu negocio aparecerá aquí
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
