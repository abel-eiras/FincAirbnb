/**
 * Página de Valoración - FincAirbnb
 * 
 * Página para que los labregos valoren una finca después de su alugamento
 * Ruta: /alugamentos/[id]/valorar
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAlugamentoById } from '@/services/mockAlugamentos';
import { getProperty } from '@/services/mockProperties';

export default function ValorarPage() {
  const params = useParams();
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  
  const [alugamento, setAlugamento] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const alugamentoId = params.id as string;
        const foundAlugamento = await getAlugamentoById(alugamentoId);

        if (!foundAlugamento) {
          setError('Alugamento non encontrado');
          return;
        }

        if (foundAlugamento.labregoId !== user?.id) {
          setError('Non tes permisos para valorar este alugamento');
          return;
        }

        if (new Date(foundAlugamento.finCultivo) > new Date()) {
          setError('Non podes valorar un alugamento que aínda non terminou');
          return;
        }

        const foundProperty = await getProperty(foundAlugamento.propertyId);

        if (!foundProperty) {
          setError('Propiedad non encontrada');
          return;
        }

        setAlugamento(foundAlugamento);
        setProperty(foundProperty);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Erro ao cargar os datos do alugamento');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [params.id, user]);

  const handleSuccess = () => {
    router.push('/taboleiro/mos-alugamentos');
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <LoadingSpinner size="lg" color="primary" />
              <p className="text-gray-600 mt-4">Cargando datos do alugamento...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Erro ao cargar a valoración
              </h1>
              <Alert variant="destructive" className="max-w-md mx-auto mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </Button>
                <Button
                  onClick={() => router.push('/taboleiro/mos-alugamentos')}
                  className="bg-galician-blue hover:bg-blue-700"
                >
                  Ir ao taboleiro
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (!alugamento || !property) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Datos non encontrados
              </h1>
              <p className="text-gray-600 mb-6">
                Non se puideron cargar os datos do alugamento ou da propiedade.
              </p>
              <Button
                onClick={() => router.push('/taboleiro/mos-alugamentos')}
                className="bg-galician-blue hover:bg-blue-700"
              >
                Ir ao taboleiro
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReviewForm
            propertyId={property.id}
            propertyTitle={property.title}
            propertyImage={property.photos?.[0] || ''}
            userId={user!.id}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

