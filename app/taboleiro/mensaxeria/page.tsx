/**
 * Página de Mensajería - FincAirbnb
 * 
 * Sistema de mensajería entre propietarios y labregos
 * Adaptado ao contexto de fincas agrícolas
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageThread } from '@/components/messaging/MessageThread';
import { 
  ArrowLeft, 
  MessageCircle,
  User,
  Home,
  Wheat
} from 'lucide-react';

interface AlugamentoData {
  id: string;
  propertyId: string;
  propertyTitle: string;
  startDate: string;
  duration: number;
  cultivoType: string;
  labregoData: {
    name: string;
    email: string;
  };
  status: string;
}

export default function MensaxeriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  
  const [alugamento, setAlugamento] = useState<AlugamentoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del alugamento
  useEffect(() => {
    const loadAlugamento = () => {
      try {
        setIsLoading(true);
        
        const alugamentoId = searchParams.get('alugamento');
        if (!alugamentoId) {
          router.push('/taboleiro');
          return;
        }

        // Buscar alugamento en localStorage
        const allAlugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
        const foundAlugamento = allAlugamentos.find((a: AlugamentoData) => a.id === alugamentoId);
        
        if (foundAlugamento) {
          setAlugamento(foundAlugamento);
        } else {
          router.push('/taboleiro');
        }
      } catch (error) {
        console.error('Error cargando alugamento:', error);
        router.push('/taboleiro');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlugamento();
  }, [searchParams, router]);

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-900 mb-2">Acceso Restrinxido</h2>
              <p className="text-red-600">Debes estar autenticado para acceder á mensaxería.</p>
              <Button onClick={() => router.push('/acceder')} className="mt-4">
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando conversación...</p>
            </div>
          </div>
          <Footer />
        </main>
      </ProtectedRoute>
    );
  }

  if (!alugamento) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <Home className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-900 mb-2">Erro</h2>
                <p className="text-red-600">Non se atopou o alugamento especificado.</p>
                <Button 
                  onClick={() => router.push('/taboleiro')}
                  className="mt-4"
                >
                  Voltar ao Taboleiro
                </Button>
              </CardContent>
            </Card>
          </div>
          <Footer />
        </main>
      </ProtectedRoute>
    );
  }

  // Determinar el otro usuario
  const currentUser = {
    id: user.id,
    name: user.name,
    role: user.role as 'owner' | 'guest'
  };

  const otherUser = {
    id: user.role === 'owner' ? 'labrego-id' : 'owner-id', // IDs mock
    name: user.role === 'owner' ? alugamento.labregoData.name : 'Propietario da Finca',
    role: user.role === 'owner' ? 'guest' as const : 'owner' as const
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-galician-blue"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-galician-blue">
                Mensaxería
              </h1>
              <p className="text-gray-600 mt-1">
                Conversación sobre o alugamento de {alugamento.propertyTitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Información del alugamento */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Wheat className="h-5 w-5 mr-2 text-galician-blue" />
                    Detalles do Alugamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Finca</p>
                    <p className="text-gray-900">{alugamento.propertyTitle}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Data de inicio</p>
                    <p className="text-gray-900">{new Date(alugamento.startDate).toLocaleDateString('gl-ES')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duración</p>
                    <p className="text-gray-900">{alugamento.duration} meses</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipo de cultivo</p>
                    <p className="text-gray-900">🌱 {alugamento.cultivoType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Estado</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alugamento.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alugamento.status === 'accepted' ? 'Aceptado' : 'Pendente'}
                    </span>
                  </div>

                  {/* Información del otro usuario */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {user.role === 'owner' ? 'Labrego' : 'Propietario'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-galician-blue bg-opacity-10 rounded-full flex items-center justify-center">
                        <span className="text-sm">
                          {user.role === 'owner' ? '🌱' : '🏡'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{otherUser.name}</p>
                        {user.role === 'owner' && (
                          <p className="text-xs text-gray-500">{alugamento.labregoData.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversación */}
            <div className="lg:col-span-3">
              <div className="h-[600px]">
                <MessageThread
                  alugamentoId={alugamento.id}
                  currentUser={currentUser}
                  otherUser={otherUser}
                />
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
