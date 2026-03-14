/**
 * Página de Alugamentos Recibidos - FincAirbnb
 * 
 * Gestión de alugamentos para propietarios de fincas
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
  User
} from 'lucide-react';
import { createConversationOnAlugamentoAccepted } from '@/services/mockConversationManager';

interface AlugamentoRecibido {
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

export default function AlugamentosRecibidosPage() {
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  
  const [alugamentos, setAlugamentos] = useState<AlugamentoRecibido[]>([]);
  const [filteredAlugamentos, setFilteredAlugamentos] = useState<AlugamentoRecibido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Cargar alugamentos
  useEffect(() => {
    const loadAlugamentos = () => {
      try {
        setIsLoading(true);
        
        // Obtener alugamentos del localStorage
        const allAlugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
        
        // Filtrar solo los del propietario actual
        const userAlugamentos = allAlugamentos.filter((alugamento: AlugamentoRecibido) => {
          // Por ahora, mostrar todos (en producción sería por ownerId)
          return true;
        });
        
        setAlugamentos(userAlugamentos);
        setFilteredAlugamentos(userAlugamentos);
      } catch (error) {
        console.error('Error cargando alugamentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlugamentos();
  }, []);

  // Filtrar por estado
  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredAlugamentos(alugamentos);
    } else {
      setFilteredAlugamentos(alugamentos.filter(a => a.status === selectedStatus));
    }
  }, [selectedStatus, alugamentos]);

  const handleStatusChange = async (alugamentoId: string, newStatus: 'accepted' | 'rejected') => {
    const updatedAlugamentos = alugamentos.map(alugamento => 
      alugamento.id === alugamentoId 
        ? { ...alugamento, status: newStatus }
        : alugamento
    );
    
    setAlugamentos(updatedAlugamentos);
    
    // Actualizar localStorage
    const allAlugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
    const updatedAllAlugamentos = allAlugamentos.map((a: AlugamentoRecibido) => 
      a.id === alugamentoId 
        ? { ...a, status: newStatus }
        : a
    );
    localStorage.setItem('alugamentos', JSON.stringify(updatedAllAlugamentos));
    
    // Si se acepta el alugamento, crear conversación automáticamente
    if (newStatus === 'accepted') {
      try {
        await createConversationOnAlugamentoAccepted(alugamentoId);
        console.log(`Conversación creada automáticamente para alugamento ${alugamentoId}`);
      } catch (error) {
        console.error('Error creando conversación:', error);
        // No mostrar error al usuario, es opcional
      }
    }
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

  if (!user || user.role !== 'owner') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-900 mb-2">Acceso Restrinxido</h2>
              <p className="text-red-600">Esta páxina só está dispoñible para propietarios de fincas.</p>
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
                  Alugamentos Recibidos
                </h1>
                <p className="text-gray-600 mt-1">
                  Xestiona as solicitudes de alugamento das túas fincas
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
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Non hai alugamentos
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedStatus === 'all' 
                    ? 'Aínda non recibiches solicitudes de alugamento para as túas fincas.'
                    : `Non hai alugamentos con estado "${selectedStatus}".`
                  }
                </p>
                <Button 
                  onClick={() => router.push('/taboleiro/minas-fincas')}
                  className="bg-galician-blue hover:bg-blue-700"
                >
                  Xestionar Fincas
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredAlugamentos.map((alugamento) => {
                const endDate = new Date(alugamento.startDate);
                endDate.setMonth(endDate.getMonth() + alugamento.duration);

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
                            {getStatusBadge(alugamento.status)}
                          </div>

                          {/* Datos del labrego */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="h-4 w-4 text-galician-blue" />
                              <span className="font-medium text-gray-900">{alugamento.labregoData.name}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <span>📧 {alugamento.labregoData.email}</span>
                              <span>📞 {alugamento.labregoData.phone}</span>
                            </div>
                          </div>

                          {/* Detalles del alugamento */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                              <p className="text-sm font-medium text-gray-700 mb-1">Solicitudes especiais:</p>
                              <p className="text-sm text-gray-600 bg-shell-beige p-3 rounded-lg">
                                {alugamento.specialRequests}
                              </p>
                            </div>
                          )}

                          {/* Motivación del labrego */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Motivación do labrego:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {alugamento.labregoData.motivation}
                            </p>
                          </div>
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
                          {alugamento.status === 'pending' && (
                            <div className="space-y-3">
                              <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusChange(alugamento.id, 'accepted')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aceptar Alugamento
                              </Button>
                              
                              <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => handleStatusChange(alugamento.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Rexeitar
                              </Button>
                            </div>
                          )}

                          {alugamento.status === 'accepted' && (
                            <div className="space-y-3">
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push(`/taboleiro/mensaxes?alugamento=${alugamento.id}`)}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contactar Labrego
                              </Button>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push(`/alugamentos/${alugamento.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
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
