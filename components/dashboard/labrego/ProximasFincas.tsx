/**
 * ProximasFincas Component - FincAirbnb
 * 
 * Componente para mostrar as próximas fincas alugadas por un labrego
 * Con copy gallego e información sobre cultivo
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Wheat, 
  ArrowRight,
  User,
  Euro
} from 'lucide-react';
import { getProximosAlugamentos, type Alugamento } from '@/services/mockAlugamentos';
import { getProperty } from '@/services/mockProperties';
import type { Property } from '@/shared/types';

interface ProximasFincasProps {
  labregoId: string;
}

interface FincaConAlugamento {
  alugamento: Alugamento;
  property: Property;
}

export function ProximasFincas({ labregoId }: ProximasFincasProps) {
  const [fincas, setFincas] = useState<FincaConAlugamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProximasFincas = async () => {
      try {
        setIsLoading(true);
        const alugamentos = await getProximosAlugamentos(labregoId);
        
        // Obter detalles das propiedades
        const fincasConDetalles = await Promise.all(
          alugamentos.map(async (alugamento) => {
            const property = await getProperty(alugamento.propertyId);
            return { alugamento, property };
          })
        );

        setFincas(fincasConDetalles.filter(f => f.property !== null) as FincaConAlugamento[]);
      } catch (error) {
        console.error('Error cargando próximas fincas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProximasFincas();
  }, [labregoId]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('gl-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTipoCultivoEmoji = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'hortalizas': return '🥬';
      case 'viñedo': return '🍇';
      case 'árbores froiteiros': return '🍎';
      case 'cereais': return '🌾';
      case 'flores': return '🌸';
      default: return '🌱';
    }
  };

  const getExperienciaColor = (experiencia: string) => {
    switch (experiencia) {
      case 'principiante': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-blue-100 text-blue-800';
      case 'avanzado': return 'bg-purple-100 text-purple-800';
      case 'experto': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Próximas Fincas para Cultivar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-galician-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando as túas próximas fincas...</p>
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
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Próximas Fincas para Cultivar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Non tes fincas próximas 🌱
            </h3>
            <p className="text-gray-600 mb-4">
              A terra está esperando... ¿Que tal buscar unha nova finca para cultivar?
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
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Próximas Fincas para Cultivar ({fincas.length})
        </CardTitle>
        <p className="text-gray-600">
          As túas fincas esperando para seren cultivadas
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fincas.map(({ alugamento, property }) => (
            <div key={alugamento.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{property.title}</h3>
                    <Badge className={getExperienciaColor(alugamento.detallesCultivo.experiencia)}>
                      {alugamento.detallesCultivo.experiencia}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location?.city}, {property.location?.province}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <div>
                        <div className="font-medium">Inicio:</div>
                        <div>{formatarData(alugamento.inicioCultivo)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-green-600" />
                      <div>
                        <div className="font-medium">Duración:</div>
                        <div>{alugamento.meses} {alugamento.meses === 1 ? 'mes' : 'meses'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Euro className="h-4 w-4 mr-2 text-purple-600" />
                      <div>
                        <div className="font-medium">Prezo:</div>
                        <div>{alugamento.prezos.prezoMes}€/mes</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-4">
                    <div className="flex items-center">
                      <Wheat className="h-4 w-4 mr-1 text-green-600" />
                      <span className="text-sm">
                        {getTipoCultivoEmoji(alugamento.detallesCultivo.tipoCultivo)} {alugamento.detallesCultivo.tipoCultivo}
                      </span>
                    </div>
                    
                    {alugamento.detallesCultivo.herramientasPropias && (
                      <Badge variant="outline" className="text-xs">
                        🛠️ Ferramentas propias
                      </Badge>
                    )}
                    
                    {alugamento.detallesCultivo.mascotas > 0 && (
                      <Badge variant="outline" className="text-xs">
                        🐕 {alugamento.detallesCultivo.mascotas} mascota{alugamento.detallesCultivo.mascotas > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.location.href = `/fincas/${property.id}`}
                  >
                    Ver Detalles
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.location.href = '/taboleiro/mensaxes'}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Mensaxe
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {fincas.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={() => window.location.href = '/taboleiro/miñas-fincas'}
              className="w-full"
            >
              Ver Todas as Miñas Fincas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
