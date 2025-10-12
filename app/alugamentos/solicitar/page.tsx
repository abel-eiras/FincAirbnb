/**
 * Página de Solicitud de Alugamento - FincAirbnb
 * 
 * Página para solicitar alugamento de una finca
 * Con formulario completo y revisión de datos
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  CheckCircle, 
  Calendar,
  Users,
  Calculator,
  AlertCircle,
  Home,
  Shield
} from 'lucide-react';
import { getProperty } from '@/services/mockProperties';
import type { Property } from '@/shared/types';

interface AlugamentoData {
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
}

interface LabregoData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  motivation: string;
  references: string;
}

export default function SolicitarAlugamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [alugamentoData, setAlugamentoData] = useState<AlugamentoData | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [labregoData, setLabregoData] = useState<LabregoData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    motivation: '',
    references: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos de la solicitud
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener datos de la URL
        const dataParam = searchParams.get('data');
        if (!dataParam) {
          router.push('/fincas');
          return;
        }

        const alugamento = JSON.parse(decodeURIComponent(dataParam));
        setAlugamentoData(alugamento);

        // Cargar datos de la propiedad
        const propertyData = await getProperty(alugamento.propertyId);
        setProperty(propertyData);

      } catch (error) {
        console.error('Error cargando datos:', error);
        router.push('/fincas');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams, router]);

  const handleInputChange = (field: keyof LabregoData, value: string) => {
    setLabregoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!alugamentoData || !property) return;

    // Validar formulario
    const requiredFields = ['name', 'email', 'phone', 'experience', 'motivation'];
    const missingFields = requiredFields.filter(field => !labregoData[field as keyof LabregoData]);
    
    if (missingFields.length > 0) {
      alert('Por favor, completa todos os campos obrigatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío de solicitud
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Crear objeto completo de alugamento
      const alugamentoCompleto = {
        id: `alugamento-${Date.now()}`,
        ...alugamentoData,
        labregoData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage (mock)
      const existingAlugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
      existingAlugamentos.push(alugamentoCompleto);
      localStorage.setItem('alugamentos', JSON.stringify(existingAlugamentos));

      // Navegar a confirmación
      router.push(`/alugamentos/${alugamentoCompleto.id}/confirmacion`);

    } catch (error) {
      console.error('Error enviando solicitude:', error);
      alert('Erro ao enviar a solicitude. Téntao de novo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando solicitude...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!alugamentoData || !property) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Home className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-900 mb-2">Erro</h2>
              <p className="text-red-600">Non se puideron cargar os datos da solicitude.</p>
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              Solicitar Alugamento
            </h1>
            <p className="text-gray-600 mt-1">
              Completa os teus datos para solicitar o alugamento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Resumen de la finca */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Home className="h-5 w-5 mr-2 text-galician-blue" />
                  Finca Seleccionada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-galician-green to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-white">🌾</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-gray-600">{property.location?.city}, {property.location?.province}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>📏 {property.size?.land || 0} ha</span>
                      <span>👥 {property.size?.capacity || 0} persoas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles del alugamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-galician-blue" />
                  Detalles do Alugamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Data de inicio</Label>
                    <p className="text-lg">{new Date(alugamentoData.startDate).toLocaleDateString('gl-ES')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Duración</Label>
                    <p className="text-lg">{alugamentoData.duration} meses</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Persoas</Label>
                    <p className="text-lg">{alugamentoData.people} persoas</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tipo de cultivo</Label>
                    <p className="text-lg">🌱 {alugamentoData.cultivoType}</p>
                  </div>
                </div>
                
                {alugamentoData.specialRequests && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Solicitudes especiais</Label>
                    <p className="text-gray-700 mt-1">{alugamentoData.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Datos del labrego */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-galician-blue" />
                  Os Teus Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nome completo *
                    </Label>
                    <Input
                      id="name"
                      value={labregoData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="O teu nome completo"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={labregoData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="o.teu@email.gal"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={labregoData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+34 600 000 000"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                    Experiencia en agricultura *
                  </Label>
                  <Textarea
                    id="experience"
                    value={labregoData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Conta-nos sobre a túa experiencia coa agricultura..."
                    className="mt-1 h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="motivation" className="text-sm font-medium text-gray-700">
                    Motivación para este alugamento *
                  </Label>
                  <Textarea
                    id="motivation"
                    value={labregoData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    placeholder="Por que queres alugar esta finca? Que plans tes?"
                    className="mt-1 h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="references" className="text-sm font-medium text-gray-700">
                    Referencias (opcional)
                  </Label>
                  <Textarea
                    id="references"
                    value={labregoData.references}
                    onChange={(e) => handleInputChange('references', e.target.value)}
                    placeholder="Se tes referencias doutros propietarios ou experiencias..."
                    className="mt-1 h-20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna lateral - Resumen */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calculator className="h-5 w-5 mr-2 text-galician-blue" />
                  Resumo do Prezo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{alugamentoData.pricing.basePrice}€ × {alugamentoData.duration} meses</span>
                    <span>{alugamentoData.pricing.subtotal}€</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Taxa de servizo (5%)</span>
                    <span>{alugamentoData.pricing.serviceFee.toFixed(2)}€</span>
                  </div>
                  
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-galician-blue">{alugamentoData.pricing.total.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Información de seguridad */}
                <div className="bg-shell-beige p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-galician-green mt-0.5" />
                    <div className="text-sm text-galician-green">
                      <p className="font-medium mb-1">🛡️ A túa seguridade:</p>
                      <ul className="space-y-1 list-disc pl-4">
                        <li>Non se cobra ata confirmar</li>
                        <li>Datos protexidos e seguros</li>
                        <li>Cancelación gratuíta ata 1 mes antes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Botón de enviar */}
                <Button 
                  className="w-full bg-galician-blue hover:bg-blue-700 py-3"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enviar Solicitude
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  O propietario revisará a túa solicitude e contactará contigo
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
