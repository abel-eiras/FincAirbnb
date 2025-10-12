/**
 * FincasFavoritas Component - FincAirbnb
 * 
 * Componente para mostrar as fincas favoritas dun labrego
 * Con retranca gallega e copy divertido
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MapPin, 
  Euro, 
  ArrowRight,
  Wheat,
  Star,
  Trash2
} from 'lucide-react';
import { getProperty } from '@/services/mockProperties';
import type { Property } from '@/shared/types';

interface FincasFavoritasProps {
  labregoId: string;
}

// Mock de fincas favoritas (en unha implementación real sería un servicio separado)
const mockFavoritas = [
  'prop-1',
  'prop-3',
  'prop-5'
];

export function FincasFavoritas({ labregoId }: FincasFavoritasProps) {
  const [fincas, setFincas] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavoritas = async () => {
      try {
        setIsLoading(true);
        
        // Cargar as propiedades favoritas
        const propiedades = await Promise.all(
          mockFavoritas.map(async (propertyId) => {
            const property = await getProperty(propertyId);
            return property;
          })
        );

        setFincas(propiedades.filter(p => p !== null) as Property[]);
      } catch (error) {
        console.error('Error cargando favoritas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoritas();
  }, [labregoId]);

  const handleEliminarFavorita = (propertyId: string) => {
    // Mock: eliminar da lista local
    setFincas(prev => prev.filter(f => f.id !== propertyId));
    // En unha implementación real, aquí chamaríase ao servicio para eliminar
    console.log(`Eliminando favorita: ${propertyId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-600" />
            Fincas que Che Gustan para Cultivar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-galician-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando as túas favoritas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (fincas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-600" />
            Fincas que Che Gustan para Cultivar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Non tes fincas favoritas aínda 💔
            </h3>
            <p className="text-gray-600 mb-4">
              Busca fincas que che gusten e gárdas para cultivar despois. ¡A terra está esperando!
            </p>
            <Button 
              onClick={() => window.location.href = '/fincas'}
              className="bg-galician-blue hover:bg-blue-700"
            >
              Buscar Fincas
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-600" />
          Fincas que Che Gustan para Cultivar ({fincas.length})
        </CardTitle>
        <p className="text-gray-600">
          As fincas que gardaches para cultivar algún día
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fincas.map((property) => (
            <div key={property.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{property.title}</h3>
                    <Badge className="bg-red-100 text-red-800">
                      <Heart className="h-3 w-3 mr-1" />
                      Favorita
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location?.city}, {property.location?.province}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Euro className="h-4 w-4 mr-2 text-green-600" />
                      <div>
                        <div className="font-medium">Prezo:</div>
                        <div>{property.pricing?.basePrice}€ por mes</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Wheat className="h-4 w-4 mr-2 text-orange-600" />
                      <div>
                        <div className="font-medium">Tamaño:</div>
                        <div>{property.size?.land} ha</div>
                      </div>
                    </div>
                  </div>

                  {property.rating && (
                    <div className="mt-2 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {property.rating} ({property.reviewCount} avaliacións)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <Button 
                    size="sm" 
                    className="bg-galician-blue hover:bg-blue-700"
                    onClick={() => window.location.href = `/fincas/${property.id}`}
                  >
                    Ver Finca
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEliminarFavorita(property.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Quitar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {fincas.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={() => window.location.href = '/taboleiro/favoritas'}
              className="w-full"
            >
              Ver Todas as Favoritas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
