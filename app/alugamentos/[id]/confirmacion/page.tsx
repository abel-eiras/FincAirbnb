/**
 * Página de Confirmación de Alugamento - FincAirbnb
 * 
 * Página de confirmación después de enviar solicitud de alugamento
 * Con detalles completos y próximos pasos
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAlugamentoById } from '@/services/mockAlugamentos';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Calendar,
  Users,
  MapPin,
  MessageCircle,
  Home,
  Clock,
  Shield
} from 'lucide-react';

interface AlugamentoCompleto {
  id: string;
  propertyId: string;
  propertyTitle: string;
  startDate: string;
  duration: number;
  people: number;
  cultivoType: string;
  specialRequests?: string;
  pricing: {
    basePrice: number;
    duration: number;
    subtotal: number;
    serviceFee: number;
    total: number;
  };
  labregoData: {
    name: string;
    email: string;
    phone: string;
    experience: string;
    motivation: string;
    references: string;
  };
  status: string;
  createdAt: string;
}

export default function ConfirmacionAlugamentoPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [alugamento, setAlugamento] = useState<AlugamentoCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAlugamento = async () => {
      try {
        setIsLoading(true);

        if (!id || typeof id !== 'string') {
          router.push('/fincas');
          return;
        }

        const found = await getAlugamentoById(id);
        if (found) {
          setAlugamento(found as unknown as AlugamentoCompleto);
        } else {
          router.push('/fincas');
        }
      } catch (error) {
        console.error('Error cargando alugamento:', error);
        router.push('/fincas');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlugamento();
  }, [id, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando confirmación...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!alugamento) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Home className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-900 mb-2">Erro</h2>
              <p className="text-red-600">Non se atopou a solicitude de alugamento.</p>
              <Button 
                onClick={() => router.push('/fincas')}
                className="mt-4"
              >
                Voltar ás fincas
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  const endDate = new Date(alugamento.startDate);
  endDate.setMonth(endDate.getMonth() + alugamento.duration);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mensaje de éxito */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Solicitude Enviada!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A túa solicitude de alugamento foi enviada correctamente. 
            O propietario revisará os teus datos e contactará contigo pronto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Detalles del alugamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-galician-blue" />
                  Detalles do Alugamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Home className="h-5 w-5 text-galician-blue" />
                    <div>
                      <p className="font-medium">{alugamento.propertyTitle}</p>
                      <p className="text-sm text-gray-600">ID: {alugamento.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Data de inicio</Label>
                      <p className="text-lg">{new Date(alugamento.startDate).toLocaleDateString('gl-ES')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Data de fin</Label>
                      <p className="text-lg">{endDate.toLocaleDateString('gl-ES')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Duración</Label>
                      <p className="text-lg">{alugamento.duration} meses</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Persoas</Label>
                      <p className="text-lg">{alugamento.people} persoas</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Tipo de cultivo</Label>
                      <p className="text-lg">🌱 {alugamento.cultivoType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Estado</Label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendente de revisión
                      </span>
                    </div>
                  </div>

                  {alugamento.specialRequests && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Solicitudes especiais</Label>
                      <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg">
                        {alugamento.specialRequests}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Precio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-galician-blue" />
                  Desglose do Prezo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{alugamento.pricing.basePrice}€ × {alugamento.duration} meses</span>
                    <span>{alugamento.pricing.subtotal}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de servizo (5%)</span>
                    <span>{alugamento.pricing.serviceFee.toFixed(2)}€</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-galician-blue">{alugamento.pricing.total.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próximos pasos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="h-5 w-5 mr-2 text-galician-blue" />
                  Próximos Pasos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-galician-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Revisión do propietario</h4>
                      <p className="text-sm text-gray-600">
                        O propietario revisará a túa solicitude e os teus datos. Isto pode levar de 24 a 48 horas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Contacto do propietario</h4>
                      <p className="text-sm text-gray-600">
                        Se a túa solicitude é aceptada, o propietario contactará contigo para coordinar os detalles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Confirmación e pagamento</h4>
                      <p className="text-sm text-gray-600">
                        Unha vez acordados os detalles, confirmarase o alugamento e procederase ao pagamento.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna lateral - Acciones */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Accións</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-galician-blue hover:bg-blue-700"
                  onClick={() => router.push('/fincas')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ver Máis Fincas
                </Button>

                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/taboleiro')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ir ao Taboleiro
                </Button>

                <div className="bg-shell-beige p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-galician-green mt-0.5" />
                    <div className="text-sm text-galician-green">
                      <p className="font-medium mb-1">💡 Consello:</p>
                      <p>Podes seguir buscando outras fincas mentres esperas a resposta do propietario.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
