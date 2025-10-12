/**
 * AvaliacionsPendentes Component - FincAirbnb
 * 
 * Componente para mostrar as avaliacións pendentes dun labrego
 * Con copy gallego e retranca
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Calendar, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { getAlugamentosPasados, type Alugamento } from '@/services/mockAlugamentos';
import { getProperty } from '@/services/mockProperties';
import type { Property } from '@/shared/types';

interface AvaliacionsPendentesProps {
  labregoId: string;
}

interface FincaConAvaliacionPendente {
  alugamento: Alugamento;
  property: Property;
}

export function AvaliacionsPendentes({ labregoId }: AvaliacionsPendentesProps) {
  const [fincas, setFincas] = useState<FincaConAvaliacionPendente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvaliacionsPendentes = async () => {
      try {
        setIsLoading(true);
        
        // Obter alugamentos pasados (estos serían os que precisan avaliación)
        const alugamentos = await getAlugamentosPasados(labregoId);
        
        // Filtrar só os que non teñen avaliación (mock: todos precisan avaliación)
        const alugamentosConAvaliacion = alugamentos.filter(alugamento => {
          // En unha implementación real, aquí verificaríamos se xa existe avaliación
          return true;
        });
        
        // Obter detalles das propiedades
        const fincasConDetalles = await Promise.all(
          alugamentosConAvaliacion.map(async (alugamento) => {
            const property = await getProperty(alugamento.propertyId);
            return { alugamento, property };
          })
        );

        setFincas(fincasConDetalles.filter(f => f.property !== null) as FincaConAvaliacionPendente[]);
      } catch (error) {
        console.error('Error cargando avaliacións pendentes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAvaliacionsPendentes();
  }, [labregoId]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('gl-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularDiasDesdeFin = (finCultivo: string) => {
    const fin = new Date(finCultivo);
    const agora = new Date();
    const dias = Math.floor((agora.getTime() - fin.getTime()) / (1000 * 60 * 60 * 24));
    return dias;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-600" />
            Avaliacións Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-galician-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando avaliacións pendentes...</p>
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
            <Star className="h-5 w-5 mr-2 text-yellow-600" />
            Avaliacións Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Estás ao día! ⭐
            </h3>
            <p className="text-gray-600 mb-4">
              Non tes fincas pendentes de avaliar. ¡Boa labrego!
            </p>
            <Button 
              onClick={() => window.location.href = '/fincas'}
              className="bg-galician-blue hover:bg-blue-700"
            >
              Buscar Nova Finca
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
          <Star className="h-5 w-5 mr-2 text-yellow-600" />
          Avaliacións Pendentes ({fincas.length})
        </CardTitle>
        <p className="text-gray-600">
          Fincas que cultivaches e aínda non avaliaste
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fincas.map(({ alugamento, property }) => {
            const diasDesdeFin = calcularDiasDesdeFin(alugamento.finCultivo);
            
            return (
              <div key={alugamento.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{property.title}</h3>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                      {diasDesdeFin > 7 && (
                        <Badge variant="destructive" className="text-xs">
                          {diasDesdeFin} días
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.location?.city}, {property.location?.province}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium">Cultivada:</div>
                          <div>{formatarData(alugamento.finCultivo)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                        <div>
                          <div className="font-medium">Duración:</div>
                          <div>{alugamento.meses} {alugamento.meses === 1 ? 'mes' : 'meses'}</div>
                        </div>
                      </div>
                    </div>

                    {diasDesdeFin > 7 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        ⏰ Llevas {diasDesdeFin} días sen avaliar esta finca. ¡Non te esquezas!
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button 
                      size="sm" 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => window.location.href = `/fincas/${property.id}/avaliar`}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Avaliar
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/fincas/${property.id}`}
                    >
                      Ver Finca
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {fincas.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Consello:</strong> Avaliar as fincas axuda a outros labregos a escoller mellor. 
                ¡A túa experiencia é valiosa!
              </p>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/taboleiro/avaliacions'}
              className="w-full"
            >
              Ver Todas as Avaliacións Pendentes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
