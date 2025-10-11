/**
 * Taboleiro (Dashboard) Principal
 * 
 * Página protegida que muestra el panel de control del usuario autenticado.
 * Muestra contenido diferente según el rol (propietario o huésped).
 * 
 * Ruta: /taboleiro
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, User, Calendar, Bell, TrendingUp, MessageSquare } from 'lucide-react';
import { translateUserRole } from '@/lib/translations';
import { OwnerStats } from '@/components/dashboard/owner/OwnerStats';
import { RevenueChart } from '@/components/dashboard/owner/RevenueChart';
import { OccupancyChart } from '@/components/dashboard/owner/OccupancyChart';
import { UpcomingBookings } from '@/components/dashboard/owner/UpcomingBookings';
import { RecentActivity } from '@/components/dashboard/owner/RecentActivity';
import { QuickActions } from '@/components/dashboard/owner/QuickActions';
import { 
  getOwnerStats, 
  getRevenueData, 
  getOccupancyData, 
  getRecentActivity, 
  getUpcomingBookings,
  type OwnerStats as OwnerStatsType,
  type RevenueData,
  type OccupancyData,
  type RecentActivity as RecentActivityType
} from '@/services/mockStats';

export default function TaboleiroPage() {
  const { getCurrentUser, logout } = useAuth();
  const user = getCurrentUser();
  
  // Estados para los datos del dashboard
  const [ownerStats, setOwnerStats] = useState<OwnerStatsType | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityType[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || user.role !== 'owner') return;
      
      setIsLoading(true);
      try {
        const [stats, revenue, occupancy, activity, bookings] = await Promise.all([
          getOwnerStats(user.id),
          getRevenueData(user.id),
          getOccupancyData(user.id),
          getRecentActivity(user.id),
          getUpcomingBookings(user.id)
        ]);
        
        setOwnerStats(stats);
        setRevenueData(revenue);
        setOccupancyData(occupancy);
        setRecentActivity(activity);
        setUpcomingBookings(bookings);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);
  
  // Determinar si es propietario o huésped
  const isOwner = user?.role === 'owner';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header del Taboleiro */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-galician-blue">
                  Benvido/a, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  {isOwner 
                    ? 'Xestiona as túas propiedades e reservas' 
                    : 'As túas reservas e favoritas'}
                </p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Pechar sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            
            {/* Perfil del Usuario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-galician-green">
                  <User className="h-5 w-5 mr-2" />
                  O teu perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">Nome:</span>
                      <span className="ml-2">{user?.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Teléfono:</span>
                        <span className="ml-2">{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Perfil:</span>
                      <span className="ml-2">{user?.role ? translateUserRole(user.role) : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Membro desde:</span>
                      <span className="ml-2">
                        {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('gl-ES') : 'N/A'}
                      </span>
                    </div>
                    {user?.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Localización:</span>
                        <span className="ml-2">
                          {user.location.city}, {user.location.province}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones rápidas - Solo para propietarios */}
            {isOwner && <QuickActions />}

            {/* Dashboard específico según el rol */}
            {isOwner ? (
              /* Dashboard del Propietario */
              <div className="space-y-8">
                {/* Estadísticas principales */}
                {ownerStats && (
                  <OwnerStats stats={ownerStats} isLoading={isLoading} />
                )}

                {/* Gráficos principales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {revenueData.length > 0 && (
                    <RevenueChart data={revenueData} isLoading={isLoading} />
                  )}
                  {occupancyData.length > 0 && (
                    <OccupancyChart data={occupancyData} isLoading={isLoading} />
                  )}
                </div>

                {/* Reservas y actividad */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingBookings.length > 0 && (
                    <UpcomingBookings bookings={upcomingBookings} isLoading={isLoading} />
                  )}
                  {recentActivity.length > 0 && (
                    <RecentActivity activities={recentActivity} isLoading={isLoading} />
                  )}
                </div>
              </div>
            ) : (
              /* Dashboard del Labrego (Milestone 04) */
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Panel de Labrego
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Gestiona as túas reservas e descubre novas fincas.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        As Miñas Reservas
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Home className="h-4 w-4 mr-2" />
                        Buscar Fincas
                      </Button>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        📋 <strong>Próximo:</strong> O dashboard completo para labregos estará dispoñible no Milestone 04.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Información de desarrollo */}
          <div className="mt-8">
            <Card className="bg-shell-beige border-galician-green">
              <CardHeader>
                <CardTitle className="text-galician-green text-sm">
                  ✅ Milestone 02 - Dashboard Propietario Completado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Implementáronse as funcionalidades do <strong>Milestone 02</strong>:
                </p>
                <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
                  <li>Estatísticas completas do negocio</li>
                  <li>Gráficos de ingresos e ocupación</li>
                  <li>Próximas reservas e actividade recente</li>
                  <li>Accións rápidas para xestión</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Próximo:</strong> Milestone 03 - Xestión de Propiedades
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

