/**
 * Página de Mis Alugamentos - FincAirbnb
 * 
 * Vista de alugamentos para labregos
 * Adaptada ao contexto agrícola e cultivo
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  MessageCircle,
  Clock,
  MapPin,
  Wheat,
  Eye,
  User,
  AlertTriangle,
  Heart
} from 'lucide-react';

interface AlugamentoLabrego {
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
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function MosAlugamentosPage() {
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  
  const [alugamentos, setAlugamentos] = useState<AlugamentoLabrego[]>([]);
  const [filteredAlugamentos, setFilteredAlugamentos] = useState<AlugamentoLabrego[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Cargar alugamentos
  useEffect(() => {
    const loadAlugamentos = () => {
      try {
        setIsLoading(true);
        
        // Obtener alugamentos del localStorage
        const allAlugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
        
        // Filtrar solo los del labrego actual (por email por ahora)
        const userAlugamentos = allAlugamentos.filter((alugamento: AlugamentoLabrego) => {
          return alugamento.labregoData.email === user?.email;
        });
        
        setAlugamentos(userAlugamentos);
        setFilteredAlugamentos(userAlugamentos);
      } catch (error) {
        console.error('Error cargando alugamentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadAlugamentos();
    }
  }, [user]);

  // Filtrar por estado
  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredAlugamentos(alugamentos);
    } else {
      setFilteredAlugamentos(alugamentos.filter(a => a.status === selectedStatus));
    }
  }, [selectedStatus, alugamentos]);

  const handleCancelAlugamento = (alugamentoId: string) => {
    if (!confirm('Estás seguro de que queres cancelar este alugamento?')) {
      return;
    }

    const updatedAlugamentos = alugamentos.map(alugamento => 
      alugamento.id === alugamentoId 
        ? { ...alugamento, status: 'cancelled' as const }
        : alugamento
    );
    
    setAlugamentos(updatedAlugamentos);
    
    // Actualizar localStorage
    const allAlugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
    const updatedAllAlugamentos = allAlugamentos.map((a: AlugamentoLabrego) => 
      a.id === alugamentoId 
        ? { ...a, status: 'cancelled' as const }
        : a
    );
    localStorage.setItem('alugamentos', JSON.stringify(updatedAllAlugamentos));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aceptado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rexeitado</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCultivoIcon = (cultivoType: string) => {
    switch (cultivoType) {
      case 'hortalizas': return '🥬';
      case 'frutais': return '🍎';
      case 'viñedo': return '🍇';
      case 'cereais': return '🌾';
      case 'flores': return '🌻';
      default: return '🌱';
    }
  };

  const canCancel = (alugamento: AlugamentoLabrego) => {
    if (alugamento.status !== 'accepted') return false;
    
    const startDate = new Date(alugamento.startDate);
    const now = new Date();
    const diffTime = startDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Se puede cancelar hasta 30 días antes
    return diffDays > 30;
  };

  if (!user || user.role !== 'guest') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-900 mb-2">Acceso Restrinxido</h2>
              <p className="text-red-600">Esta páxina só está dispoñible para labregos.</p>
              <Button onClick={() => router.push('/taboleiro')} className="mt-4">
                Voltar ao Taboleiro
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/taboleiro')}
                className="flex items-center text-gray-600 hover:text-galician-blue"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-galician-blue">
                  Os Meus Alugamentos
                </h1>
                <p className="text-gray-600 mt-1">
                  Xestiona os teus alugamentos de fincas para cultivar
                </p>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Filtrar por:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Todos os estados</option>
                <option value="pending">Pendentes</option>
                <option value="accepted">Aceptados</option>
                <option value="rejected">Rexeitados</option>
                <option value="completed">Completados</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>

          {/* Stats rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {alugamentos.filter(a => a.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aceptados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {alugamentos.filter(a => a.status === 'accepted').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Activos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {alugamentos.filter(a => a.status === 'accepted').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-galician-blue bg-opacity-10 rounded-lg">
                    <Wheat className="h-5 w-5 text-galician-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-galician-blue">
                      {alugamentos.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de alugamentos */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando alugamentos...</p>
            </div>
          ) : filteredAlugamentos.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Non tes alugamentos
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedStatus === 'all' 
                    ? 'Aínda non solicitaches alugamentos de fincas. ¡Comeza a buscar a túa finca perfecta!'
                    : `Non tes alugamentos con estado "${selectedStatus}".`
                  }
                </p>
                <Button 
                  onClick={() => router.push('/fincas')}
                  className="bg-galician-blue hover:bg-blue-700"
                >
                  Buscar Fincas
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredAlugamentos.map((alugamento) => {
                const endDate = new Date(alugamento.startDate);
                endDate.setMonth(endDate.getMonth() + alugamento.duration);
                const isUpcoming = new Date(alugamento.startDate) > new Date();
                const isActive = alugamento.status === 'accepted' && !isUpcoming;

                return (
                  <Card key={alugamento.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        
                        {/* Información principal */}
                        <div className="flex-1 space-y-4">
                          
                          {/* Header con estado */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {alugamento.propertyTitle}
                              </h3>
                              <p className="text-sm text-gray-600">
                                ID: {alugamento.id} • {new Date(alugamento.createdAt).toLocaleDateString('gl-ES')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(alugamento.status)}
                              {isActive && (
                                <Badge className="bg-green-100 text-green-800">
                                  🌱 Activo
                                </Badge>
                              )}
                              {isUpcoming && alugamento.status === 'accepted' && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  📅 Próximo
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Detalles del alugamento */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Data de inicio</p>
                              <p className="text-gray-900">{new Date(alugamento.startDate).toLocaleDateString('gl-ES')}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Data de fin</p>
                              <p className="text-gray-900">{endDate.toLocaleDateString('gl-ES')}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Tipo de cultivo</p>
                              <p className="text-gray-900">{getCultivoIcon(alugamento.cultivoType)} {alugamento.cultivoType}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Persoas</p>
                              <p className="text-gray-900">{alugamento.people} persoas</p>
                            </div>
                          </div>

                          {/* Solicitudes especiales */}
                          {alugamento.specialRequests && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">As túas solicitudes especiais:</p>
                              <p className="text-sm text-gray-600 bg-shell-beige p-3 rounded-lg">
                                {alugamento.specialRequests}
                              </p>
                            </div>
                          )}

                          {/* Tu motivación */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">A túa motivación:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {alugamento.labregoData.motivation}
                            </p>
                          </div>

                          {/* Información específica según estado */}
                          {alugamento.status === 'pending' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-yellow-800">Esperando resposta do propietario</p>
                                  <p className="text-sm text-yellow-700">
                                    O propietario está revisando a túa solicitude. Recibirás unha notificación cando responda.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {alugamento.status === 'accepted' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-green-800">¡Alugamento aceptado!</p>
                                  <p className="text-sm text-green-700">
                                    O propietario aceptou a túa solicitude. Contactará contigo pronto para coordinar os detalles.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {alugamento.status === 'rejected' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-red-800">Solicitude rexeitada</p>
                                  <p className="text-sm text-red-700">
                                    Esta solicitude foi rexeitada polo propietario. Podes buscar outras fincas dispoñibles.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Columna lateral - Precio y acciones */}
                        <div className="lg:w-80 space-y-4">
                          
                          {/* Precio */}
                          <Card className="bg-galician-blue">
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-sm text-white mb-1">Total do alugamento</p>
                                <p className="text-2xl font-bold text-white">
                                  {alugamento.pricing.total.toFixed(2)}€
                                </p>
                                <p className="text-xs text-white opacity-90">
                                  {alugamento.pricing.basePrice}€/mes × {alugamento.duration} meses
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Acciones */}
                          <div className="space-y-3">
                            {alugamento.status === 'accepted' && (
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push(`/taboleiro/mensaxeria?alugamento=${alugamento.id}`)}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contactar Propietario
                              </Button>
                            )}

                            {canCancel(alugamento) && (
                              <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => handleCancelAlugamento(alugamento.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar Alugamento
                              </Button>
                            )}

                            {!canCancel(alugamento) && alugamento.status === 'accepted' && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-start space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-red-800">Non se pode cancelar</p>
                                    <p className="text-xs text-red-700">
                                      Só se pode cancelar ata 30 días antes do inicio.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => router.push(`/alugamentos/${alugamento.id}/confirmacion`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>

                            <Button
                              variant="ghost"
                              className="w-full"
                              onClick={() => router.push('/fincas')}
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Buscar Máis Fincas
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
