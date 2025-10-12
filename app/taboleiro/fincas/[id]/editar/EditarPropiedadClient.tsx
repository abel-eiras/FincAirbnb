'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { PropertyFormWrapper } from '@/components/properties/PropertyFormWrapper';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { getProperty, updateProperty, deleteProperty } from '@/services/mockProperties';
import type { Property } from '@/shared/types';

export function EditarPropiedadClient() {
  const params = useParams();
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
          window.location.href = '/taboleiro/minas-fincas';
          return;
        }
        
        // Verificar que el usuario es el propietario
        if (data.ownerId !== user?.id) {
          toast({
            title: "Erro de permisos",
            description: "Non tes permisos para editar esta propiedade.",
            variant: "destructive",
          });
          window.location.href = '/taboleiro/minas-fincas';
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

  // Manejar actualización de la propiedad
  const handleSave = async (updatedProperty: Partial<Property>) => {
    try {
      setIsSaving(true);
      await updateProperty(propertyId, updatedProperty);
      
      toast({
        title: "Propiedade actualizada",
        description: "Os cambios gardáronse correctamente.",
      });
      
      // Redirigir al listado
      window.location.href = '/taboleiro/minas-fincas';
    } catch (error) {
      console.error('Error actualizando propiedade:', error);
      toast({
        title: "Erro",
        description: "Non se puido actualizar a propiedade.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Manejar eliminación de la propiedad
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProperty(propertyId);
      
      toast({
        title: "Propiedade eliminada",
        description: "A propiedade eliminouse correctamente.",
      });
      
      // Redirigir al listado
      window.location.href = '/taboleiro/minas-fincas';
    } catch (error) {
      console.error('Error eliminando propiedade:', error);
      toast({
        title: "Erro",
        description: "Non se puido eliminar a propiedade.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
                <p className="text-gray-600">Cargando propiedade...</p>
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
                <Button onClick={() => window.location.href = '/taboleiro/minas-fincas'}>
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
                  Editar Finca
                </h1>
                <p className="text-gray-600 mt-1">
                  Modifica os datos da túa propiedade
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/taboleiro/minas-fincas'}
                  className="flex items-center text-gray-600 hover:text-galician-blue"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={isDeleting}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción non se pode desfacer. Eliminarase permanentemente a propiedade 
                        "{property.title}" e todos os seus datos asociados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Información de la propiedad */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Save className="h-5 w-5 mr-2 text-galician-blue" />
                Propiedade: {property.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                <div>
                  <span className="font-medium text-gray-700">Tipo:</span>
                  <span className="ml-2 text-gray-900">
                    {property.propertyType === 'finca' ? 'Finca' : property.propertyType}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Última actualización:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(property.updatedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de edición */}
          <PropertyFormWrapper
            initialData={property}
            onSave={handleSave}
            isEditing={true}
            isLoading={isSaving}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
