/**
 * Página de Inicialización de Conversaciones - FincAirbnb
 * 
 * Página para crear conversaciones automáticamente desde alugamentos aceptados
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageCircle, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  RefreshCw,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { initializeMissingConversations } from '@/services/mockConversationManager';
import Link from 'next/link';

export default function InitConversationsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    conversationsCreated?: number;
  } | null>(null);
  const [alugamentosInfo, setAlugamentosInfo] = useState<{
    total: number;
    accepted: number;
    withoutConversation: number;
  } | null>(null);

  // Cargar información de alugamentos
  useEffect(() => {
    const loadAlugamentosInfo = () => {
      try {
        const alugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
        const conversations = JSON.parse(localStorage.getItem('messages') || '[]');
        
        const accepted = alugamentos.filter((a: any) => a.status === 'accepted');
        const withoutConversation = accepted.filter((a: any) => 
          !conversations.some((c: any) => c.bookingId === a.id)
        );
        
        setAlugamentosInfo({
          total: alugamentos.length,
          accepted: accepted.length,
          withoutConversation: withoutConversation.length
        });
      } catch (error) {
        console.error('Error cargando información de alugamentos:', error);
      }
    };

    if (user) {
      loadAlugamentosInfo();
    }
  }, [user]);

  const handleInitialize = async () => {
    if (!user) return;

    setIsLoading(true);
    setResult(null);

    try {
      const conversationsCreated = await initializeMissingConversations();
      
      setResult({
        success: true,
        message: `Inicialización completada con éxito.`,
        conversationsCreated
      });
      
      // Recargar información
      const alugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
      const conversations = JSON.parse(localStorage.getItem('messages') || '[]');
      
      const accepted = alugamentos.filter((a: any) => a.status === 'accepted');
      const withoutConversation = accepted.filter((a: any) => 
        !conversations.some((c: any) => c.bookingId === a.id)
      );
      
      setAlugamentosInfo({
        total: alugamentos.length,
        accepted: accepted.length,
        withoutConversation: withoutConversation.length
      });
      
    } catch (error) {
      console.error('Error inicializando conversaciones:', error);
      setResult({
        success: false,
        message: 'Erro ao inicializar as conversacións. Téntao de novo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso restrinxido
            </h1>
            <p className="text-gray-600 mb-6">
              Precisas estar rexistrado para acceder a esta páxina.
            </p>
            <Link href="/acceder">
              <Button className="bg-galician-blue hover:bg-blue-700">
                Acceder
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/taboleiro" className="inline-flex items-center text-galician-blue hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao taboleiro
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inicialización de Conversacións
          </h1>
          <p className="text-gray-600">
            Esta ferramenta crea conversacións automáticamente desde os alugamentos aceptados.
          </p>
        </div>

        {/* Información de alugamentos */}
        {alugamentosInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-galician-blue" />
                Estado dos Alugamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{alugamentosInfo.total}</div>
                  <div className="text-sm text-blue-800">Total Alugamentos</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{alugamentosInfo.accepted}</div>
                  <div className="text-sm text-green-800">Aceptados</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{alugamentosInfo.withoutConversation}</div>
                  <div className="text-sm text-orange-800">Sen Conversación</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-galician-blue" />
              Inicializar Conversacións
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Como funciona?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Busca todos os alugamentos aceptados</li>
                <li>• Crea unha conversación para cada un que non teña unha</li>
                <li>• Xera unha mensaxe inicial automática</li>
                <li>• Integra o sistema de mensaxería cos alugamentos</li>
              </ul>
            </div>

            {/* Resultado */}
            {result && (
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message}
                  {result.conversationsCreated !== undefined && (
                    <span className="block mt-1 font-medium">
                      Conversacións creadas: {result.conversationsCreated}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Botón de acción */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Inicializar Sistema
                </h3>
                <p className="text-sm text-gray-600">
                  Preme o botón para crear conversacións desde os alugamentos aceptados.
                </p>
              </div>
              
              <Button
                onClick={handleInitialize}
                disabled={isLoading || (alugamentosInfo?.withoutConversation === 0)}
                className="bg-galician-blue hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Inicializando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Inicializar
                  </>
                )}
              </Button>
            </div>

            {alugamentosInfo?.withoutConversation === 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Todas as conversacións xa están creadas. Non hai nada que inicializar.
                </AlertDescription>
              </Alert>
            )}

            {/* Navegación */}
            {result?.success && (
              <div className="pt-4 border-t">
                <div className="flex space-x-4">
                  <Link href="/taboleiro/mensaxes">
                    <Button variant="outline" className="w-full">
                      Ver Mensaxería
                    </Button>
                  </Link>
                  <Link href="/taboleiro/mos-alugamentos">
                    <Button variant="outline" className="w-full">
                      Ver Alugamentos
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Información Técnica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Usuarios afectados:</strong> {user.name} ({user.role})
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date().toLocaleString('gl-ES')}
              </p>
              <p>
                <strong>Nota:</strong> Esta operación é segura e non afecta aos datos existentes.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}






