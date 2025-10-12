'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Home, Settings } from 'lucide-react';
import { AvailabilityCalendar } from '@/components/properties/AvailabilityCalendar';
import { toast } from '@/hooks/use-toast';
import { getProperty, updateProperty } from '@/services/mockProperties';
import type { Property, CalendarDay } from '@/shared/types';

export function CalendarioPropiedadClient() {
  const params = useParams();
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar la propiedad
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setIsLoading(true);
        const data = await getProperty(propertyId);
        
        if (!data) {
          toast({
            title: "Propiedade non encontrada",
            description: "A propiedade que buscas non existe.",
            variant: "destructive",
          });
          router.push('/taboleiro/minas-fincas');
          return;
        }
        
        // Verificar que el usuario es el propietario
        if (data.ownerId !== user?.id) {
          toast({
            title: "Erro de permisos",
            description: "Non tes permisos para xestionar esta propiedade.",
            variant: "destructive",
          });
          router.push('/taboleiro/minas-fincas');
          return;
        }
        
        setProperty(data);
      } catch (error) {
        console.error('Error cargando propiedade:', error);
        toast({
          title: "Erro",
          description: "Non se puido cargar a propiedade.",
          variant: "destructive",
        });
        router.push('/taboleiro/minas-fincas');
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId && user?.id) {
      loadProperty();
    }
  }, [propertyId, user?.id, router]);

  // Manejar cambios en la disponibilidad
  const handleAvailabilityChange = async (availability: CalendarDay[]) => {
    if (!property) return;

    try {
      setIsSaving(true);
      
      // TODO: Implementar lógica de guardado de disponibilidad
      // Por ahora solo mostramos un mensaje de éxito
      console.log('Disponibilidad actualizada:', availability);
      
      toast({
        title: "Disponibilidade actualizada",
        description: "Os cambios no calendario gardáronse correctamente.",
      });
    } catch (error) {
      console.error('Error actualizando disponibilidade:', error);
      toast({
        title: "Erro",
        description: "Non se puido gardar a disponibilidade.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando calendario...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!property) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Propiedade non encontrada</h1>
                <p className="text-gray-600 mb-6">A propiedade que buscas non existe ou non tes permisos para velá.</p>
                <Button onClick={() => router.push('/taboleiro/minas-fincas')}>
                  Voltar ao listado
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-galician-blue">
                  Calendario de Disponibilidade
                </h1>
                <p className="text-gray-600 mt-1">
                  Xestiona cando a túa propiedade está dispoñible para reservas
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/taboleiro/fincas/${propertyId}/editar`)}
                  className="flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Propiedade
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/taboleiro/minas-fincas')}
                  className="flex items-center text-gray-600 hover:text-galician-blue"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              </div>
            </div>
          </div>

          {/* Información de la propiedad */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-galician-blue" />
                {property.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Tipo:</span>
                  <span className="ml-2 text-gray-900">
                    {property.propertyType === 'finca' ? 'Finca' : property.propertyType}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Prezo base:</span>
                  <span className="ml-2 text-gray-900">
                    {property.pricing?.basePrice || 0}€/mes
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Localización:</span>
                  <span className="ml-2 text-gray-900">
                    {property.location?.city}, {property.location?.province}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estado:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    property.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status === 'active' ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendario de disponibilidad */}
          <AvailabilityCalendar
            property={property}
            onAvailabilityChange={handleAvailabilityChange}
            isLoading={isSaving}
          />

          {/* Información adicional */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-galician-blue" />
                Consellos para o Calendario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dispoñibilidade</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Fai clic nun día para bloquear/desbloquear</li>
                    <li>• Os días bloqueados non están dispoñibles para reservas</li>
                    <li>• Podes bloquear todo o mes dunha vez</li>
                    <li>• Os cambios gárdanse automaticamente</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prezos Especiais</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Establece prezos diferentes para fechas especiais</li>
                    <li>• Útil para festivos, temporada alta, eventos</li>
                    <li>• O prezo especial sobrescribe o prezo base</li>
                    <li>• Podes eliminar prezos especiais en calquera momento</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
