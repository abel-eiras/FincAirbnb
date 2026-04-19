/**
 * PropertyList Component - FincAirbnb
 * 
 * Componente que muestra la lista de propiedades del propietario
 * Soporta vista grid y lista con estados de carga
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Grid, 
  List, 
  Home,
  Plus,
  Calendar,
  Users,
  Star,
  Euro,
  MapPin,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { translatePropertyType } from '@/lib/translations';
import type { Property } from '@/shared/types';

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  onEdit: (propertyId: string) => void;
  onView: (propertyId: string) => void;
  onCalendar: (propertyId: string) => void;
}

/**
 * Componente de vista en lista para una propiedad
 */
interface PropertyListItemProps {
  property: Property;
  onEdit: (propertyId: string) => void;
  onView: (propertyId: string) => void;
  onCalendar: (propertyId: string) => void;
}

function PropertyListItem({ property, onEdit, onView, onCalendar }: PropertyListItemProps) {
  // TODO: Implementar estadísticas reales cuando estén disponibles
  const mainImage = property.photos?.[0]?.url || '/images/placeholder-property.jpg';

  const getStatusBadge = () => {
    switch (property.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (property.status) {
      case 'active': return 'Activa';
      case 'inactive': return 'Inactiva';
      case 'draft': return 'Borrador';
      default: return property.status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Imagen */}
          <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {property.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location.city}, {property.location.province}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {property.description}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge()}`}>
                  {getStatusText()}
                </span>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-galician-blue">
                <Euro className="h-4 w-4 mr-1" />
                <span className="font-medium">{property.pricing?.basePrice?.toLocaleString('es-ES') || 'N/A'}€/mes</span>
              </div>
              <div className="flex items-center text-galician-green">
                <Calendar className="h-4 w-4 mr-1" />
                <span>0 reservas</span>
              </div>
              <div className="flex items-center text-purple-600">
                <Star className="h-4 w-4 mr-1" />
                <span>N/A</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>{property.size?.capacity || 'N/A'} persoas</span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(property.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(property.id)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCalendar(property.id)}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendario
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente principal de lista de propiedades
 */
export function PropertyList({ 
  properties, 
  isLoading, 
  viewMode, 
  onEdit, 
  onView, 
  onCalendar 
}: PropertyListProps) {
  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Estado vacío
  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Non tes propiedades aínda
          </h3>
          <p className="text-gray-600 mb-6">
            Crea a túa primeira finca para comezar a recibir reservas
          </p>
          <Button 
            className="bg-galician-blue hover:bg-blue-700"
            onClick={() => {
              // TODO: Navegar a crear propiedad
              console.log('Crear primeira propiedade');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Primeira Finca
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Renderizar según el modo de vista
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={onEdit}
            onView={onView}
            onCalendar={onCalendar}
          />
        ))}
      </div>
    );
  }

  // Vista lista
  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <PropertyListItem
          key={property.id}
          property={property}
          onEdit={onEdit}
          onView={onView}
          onCalendar={onCalendar}
        />
      ))}
    </div>
  );
}
