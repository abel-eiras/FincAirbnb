/**
 * Página de Crear Propiedad - FincAirbnb
 * 
 * Formulario multi-step para crear nuevas propiedades
 * Incluye 5 pasos: información básica, detalles, fotos, precio y revisión
 * 
 * Ruta: /taboleiro/fincas/crear
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Home, AlertTriangle } from 'lucide-react';
import { PropertyFormWrapper } from '@/components/properties/PropertyFormWrapper';
import { toast } from '@/hooks/use-toast';
import { createProperty } from '@/services/mockProperties';
import type { Property, CreatePropertyData } from '@/shared/types';

export default function CrearPropiedadPage() {
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  // Estado del formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFormData, setHasFormData] = useState(false);

  const handleSave = async (data: Partial<Property>) => {
    try {
      setIsSubmitting(true);
      
      if (!user?.id) {
        toast({
          title: "Erro",
          description: "Usuario non autenticado.",
          variant: "destructive",
        });
        return;
      }
      
      // Agregar información del propietario
      const propertyData = {
        ...data,
        ownerId: user.id,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Crear la propiedad
      await createProperty(propertyData as CreatePropertyData, user.id);
      
      toast({
        title: "Propiedade creada",
        description: "A nova finca engadiuse correctamente ao teu catálogo.",
      });
      
      // Redirigir al listado
      router.push('/taboleiro/minas-fincas');
    } catch (error) {
      console.error('Error creando propiedade:', error);
      toast({
        title: "Erro",
        description: "Non se puido crear a propiedade. Téntao de novo.",
        variant: "destructive",
      });
      throw error; // Re-throw para que el wrapper maneje el error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'owner') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Acceso Restrinxido
              </h2>
              <p className="text-gray-600">
                Esta páxina só está dispoñible para propietarios.
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Botón de retroceso con alerta */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-gray-600 hover:text-galician-blue"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Voltar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center text-lg">
                        <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                        ¡Ai, ai, ai! 🚨
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-base">
                        <div className="space-y-3">
                          <p>
                            <strong>¡Mira que tes moito traballo feito!</strong> 😅
                          </p>
                          <p>
                            Se saes agora, <span className="font-semibold text-red-600">toda a información que escribiches</span> vai desaparecer como o promesa electoral tralas eleccións. 
                            Todo ese texto que tanto che custou escribir... 
                          </p>
                          <p className="font-medium">
                            ¿Estás seguro de que queres marchar? A finca non se vai crear soa... E vai seguir ahí a monte mentras na alugues. Tendo que limpala ti...
                          </p>
                          <p className="text-sm text-gray-600 italic">
                            "Despois non me digas que non te avisei" 
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">
                        Non, mellor sigo escribindo
                      </AlertDialogCancel>
                      <Button 
                        onClick={() => window.location.href = '/taboleiro/minas-fincas'}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Si, quero botar todo polo cano
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <div>
                  <h1 className="text-3xl font-bold text-galician-blue">
                    Crear Nova Finca
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Engade unha nova propiedade ao teu catálogo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8">
              <PropertyFormWrapper
                onSave={handleSave}
                isEditing={false}
                isLoading={isSubmitting}
                onDataChange={setHasFormData}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}