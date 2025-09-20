/**
 * Página Principal del Dashboard
 * 
 * Página protegida que muestra el dashboard del usuario autenticado.
 * Esta es una versión básica que se expandirá en la Fase 3.
 * 
 * Características:
 * - Ruta protegida (requiere autenticación)
 * - Muestra información del usuario
 * - Botón de logout
 * - Diseño responsive
 */

'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tractor, User, Calendar, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const { getCurrentUser, logout } = useAuth();
  const user = getCurrentUser();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header del Dashboard */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-galician-blue">
                  ¡Benvido, {user?.name}! 🚜
                </h1>
                <p className="text-gray-600 mt-1">
                  Xa estás listo para alugar a túa primeira finca
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

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card de bienvenida */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center text-galician-green">
                  <Tractor className="h-5 w-5 mr-2" />
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
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Membro desde:</span>
                      <span className="ml-2">
                        {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('gl-ES') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="font-medium">Localización:</span>
                      <span className="ml-2">Galicia</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de fincas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-galician-blue">
                  As miñas fincas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Tractor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Aínda non tes fincas alugadas
                  </p>
                  <Button className="bg-galician-green hover:bg-green-600">
                    Buscar fincas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card de actividades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-galician-blue">
                  Actividade recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Non hai actividade recente
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card de notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-galician-blue">
                  Notificacións
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-galician-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg">🔔</span>
                  </div>
                  <p className="text-gray-600">
                    Non tes notificacións
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información de desarrollo */}
          <div className="mt-8">
            <Card className="bg-shell-beige border-galician-green">
              <CardHeader>
                <CardTitle className="text-galician-green text-sm">
                  💡 Información de desenvolvemento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Esta é unha versión básica do dashboard. Na <strong>Fase 3</strong> 
                  implementaremos funcionalidades completas como:
                </p>
                <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
                  <li>Gestión completa de fincas</li>
                  <li>Gráficos de actividade</li>
                  <li>Sistema de notificacións</li>
                  <li>Configuracións de perfil</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
