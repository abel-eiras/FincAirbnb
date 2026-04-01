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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  MessageCircle,
  Clock,
  Wheat,
  Eye,
  User
} from 'lucide-react';
import {
  Alugamento,
  getAlugamentosByOwner,
  updateAlugamentoStatus
} from '@/services/mockAlugamentos';
import { getProperty } from '@/services/mockProperties';
import { createConversationOnAlugamentoAccepted } from '@/services/mockConversationManager';

export default function AlugamentosRecibidosPage() {
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const [alugamentos, setAlugamentos] = useState<Alugamento[]>([]);
  const [filteredAlugamentos, setFilteredAlugamentos] = useState<Alugamento[]>([]);
  const [propertyNames, setPropertyNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const loadAlugamentos = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const items = await getAlugamentosByOwner(user.id);
        setAlugamentos(items);
        setFilteredAlugamentos(items);

        // Cargar nomes de propiedades
        const uniqueIds = [...new Set(items.map(a => a.propertyId))];
        const nameMap: Record<string, string> = {};
        await Promise.all(
          uniqueIds.map(async (propId) => {
            try {
              const prop = await getProperty(propId);
              if (prop) nameMap[propId] = prop.title;
            } catch { /* silent */ }
          })
        );
        setPropertyNames(nameMap);
      } catch (error) {
        console.error('Error cargando alugamentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlugamentos();
  }, [user]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredAlugamentos(alugamentos);
    } else {
      setFilteredAlugamentos(alugamentos.filter(a => a.status === selectedStatus));
    }
  }, [selectedStatus, alugamentos]);

  const handleStatusChange = async (alugamentoId: string, newStatus: 'confirmado' | 'cancelado') => {
    try {
      await updateAlugamentoStatus(alugamentoId, newStatus);
      setAlugamentos(prev =>
        prev.map(a => a.id === alugamentoId ? { ...a, status: newStatus } : a)
      );

      if (newStatus === 'confirmado') {
        try {
          await createConversationOnAlugamentoAccepted(alugamentoId);
        } catch (error) {
          console.error('Error creando conversación:', error);
        }
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Non se puido actualizar o estado. Tenta de novo.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmado</Badge>;
      case 'completado':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
      case 'cancelado':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCultivoIcon = (tipoCultivo: string) => {
    switch (tipoCultivo) {
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
                <option value="confirmado">Confirmados</option>
                <option value="completado">Completados</option>
                <option value="cancelado">Cancelados</option>
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
                    <p className="text-2xl font-bold text-yellow-600">0</p>
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
                    <p className="text-sm text-gray-600">Confirmados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {alugamentos.filter(a => a.status === 'confirmado').length}
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
                    <p className="text-sm text-gray-600">Completados</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {alugamentos.filter(a => a.status === 'completado').length}
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
              {filteredAlugamentos.map((alugamento) => (
                <Card key={alugamento.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                      {/* Información principal */}
                      <div className="flex-1 space-y-4">

                        {/* Header con estado */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {propertyNames[alugamento.propertyId] ?? alugamento.propertyId}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ID: {alugamento.id} • {new Date(alugamento.creado).toLocaleDateString('gl-ES')}
                            </p>
                          </div>
                          {getStatusBadge(alugamento.status)}
                        </div>

                        {/* Datos do labrego */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="h-4 w-4 text-galician-blue" />
                            <span className="font-medium text-gray-700 text-sm">
                              Labrego ID: {alugamento.labregoId}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Experiencia: {alugamento.detallesCultivo.experiencia}
                          </p>
                        </div>

                        {/* Detalles del alugamento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Data de inicio</p>
                            <p className="text-gray-900">{new Date(alugamento.inicioCultivo).toLocaleDateString('gl-ES')}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Data de fin</p>
                            <p className="text-gray-900">{new Date(alugamento.finCultivo).toLocaleDateString('gl-ES')}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Tipo de cultivo</p>
                            <p className="text-gray-900">
                              {getCultivoIcon(alugamento.detallesCultivo.tipoCultivo)} {alugamento.detallesCultivo.tipoCultivo}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Duración</p>
                            <p className="text-gray-900">{alugamento.meses} meses</p>
                          </div>
                        </div>

                        {/* Solicitudes especiales */}
                        {alugamento.solicitudesEspeciais && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Solicitudes especiais:</p>
                            <p className="text-sm text-gray-600 bg-shell-beige p-3 rounded-lg">
                              {alugamento.solicitudesEspeciais}
                            </p>
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
                                {alugamento.prezos.total.toFixed(2)}€
                              </p>
                              <p className="text-xs text-white opacity-90">
                                {alugamento.prezos.prezoMes}€/mes × {alugamento.meses} meses
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Acciones según estado */}
                        <div className="space-y-3">
                          {alugamento.status === 'confirmado' && (
                            <>
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push(`/taboleiro/mensaxes?alugamento=${alugamento.id}`)}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contactar Labrego
                              </Button>
                              <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => handleStatusChange(alugamento.id, 'cancelado')}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancelar
                              </Button>
                            </>
                          )}

                          {alugamento.status === 'cancelado' && (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(alugamento.id, 'confirmado')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Reconfirmar
                            </Button>
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}
