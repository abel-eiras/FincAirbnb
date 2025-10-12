/**
 * PropertyCard Component - FincAirbnb
 * 
 * Componente que muestra una propiedad individual en formato tarjeta
 * Incluye información básica, estadísticas y acciones rápidas
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Euro, 
  Users, 
  Calendar, 
  Star, 
  Eye, 
  Edit, 
  MoreVertical,
  Image as ImageIcon,
  Ruler,
  Clock,
  TrendingUp
} from 'lucide-react';
import { translatePropertyType } from '@/lib/translations';
import { SingleAreaConversion } from './AreaConversions';
import type { Property } from '@/shared/types';

interface PropertyCardProps {
  property: Property;
  onEdit: (propertyId: string) => void;
  onView: (propertyId: string) => void;
  onCalendar: (propertyId: string) => void;
}

/**
 * Componente de tarjeta de propiedad
 */
export function PropertyCard({ property, onEdit, onView, onCalendar }: PropertyCardProps) {
  // Obtener la imagen principal
  const mainImageUrl = property.photos?.[0]?.url || '/images/placeholder-property.jpg';
  
  // Calcular estadísticas con verificaciones robustas
  // TODO: Implementar estadísticas reales cuando estén disponibles
  const totalBookings = 0; // Por ahora usamos valores mock
  const occupiedDays = 0;
  const occupancyRate = 0;

  // Determinar color del badge de estado
  const getStatusBadge = () => {
    switch (property.status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Traducir estado al gallego
  const getStatusText = () => {
    switch (property.status) {
      case 'active':
        return 'Activa';
      case 'inactive':
        return 'Inactiva';
      case 'draft':
        return 'Borrador';
      default:
        return property.status;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Imagen de la propiedad */}
      <div className="relative h-48 bg-gray-100">
        {property.photos && property.photos.length > 0 ? (
          <img
            src={mainImageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Badge de estado */}
        <div className="absolute top-3 left-3">
          <Badge className={getStatusBadge()}>
            {getStatusText()}
          </Badge>
        </div>

        {/* Badge de tipo */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            {translatePropertyType(property.propertyType)}
          </Badge>
        </div>

        {/* Botón de acciones */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Información básica */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location?.city || 'N/A'}, {property.location?.province || 'N/A'}</span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">
            {property.description}
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-galician-blue mb-1">
              <Euro className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-600">Prezo/mes</p>
            <p className="font-semibold text-sm">
              {property.pricing?.basePrice ? property.pricing.basePrice.toLocaleString('es-ES') : 'N/A'}€
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-galician-green mb-1">
              <Calendar className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-600">Reservas</p>
            <p className="font-semibold text-sm">
              {totalBookings}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-purple-600 mb-1">
              <Star className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-600">Valoración</p>
            <p className="font-semibold text-sm">
              N/A
            </p>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>Capacidade: {property.size?.capacity || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Ocupación: {occupancyRate}%</span>
          </div>
        </div>

        {/* Superficie con conversiones */}
        {property.size?.land && property.size.land > 0 && (
          <div className="mb-4 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <Ruler className="h-3 w-3 mr-1" />
              <span>Superficie:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium text-blue-700">
                  {property.size.land.toLocaleString('es-ES')} ha
                </div>
                <div className="text-blue-600">Hectáreas</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-700">
                  <SingleAreaConversion
                    value={property.size.land}
                    fromUnit="hectareas"
                    toUnit="metros_cuadrados"
                    provincia={property.location?.province}
                    municipio={property.location?.city}
                  />
                </div>
                <div className="text-green-600">m²</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-orange-700">
                  <SingleAreaConversion
                    value={property.size.land}
                    fromUnit="hectareas"
                    toUnit="ferrados"
                    provincia={property.location?.province}
                    municipio={property.location?.city}
                  />
                </div>
                <div className="text-orange-600">Ferrados</div>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(property.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(property.id)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCalendar(property.id)}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Calendario
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
