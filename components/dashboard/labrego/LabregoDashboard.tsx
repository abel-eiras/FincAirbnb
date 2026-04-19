/**
 * LabregoDashboard Component - FincAirbnb
 * 
 * Dashboard principal para labregos/labregas
 * Con copy gallego e retranca rural
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wheat, 
  Calendar, 
  Heart, 
  Star, 
  TrendingUp, 
  Clock,
  MapPin,
  Euro,
  MessageCircle
} from 'lucide-react';
import { getEstatisticasLabrego } from '@/services/mockAlugamentos';
import type { User } from '@/shared/types';

interface LabregoStats {
  totalAlugamentos: number;
  proximos: number;
  completados: number;
  cancelados: number;
  totalGasto: number;
  mesesCultivados: number;
  gastoMedio: number;
}

interface LabregoDashboardProps {
  user: User;
}

export function LabregoDashboard({ user }: LabregoDashboardProps) {
  const router = useRouter();
  const [stats, setStats] = useState<LabregoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await getEstatisticasLabrego(user.id);
        setStats(data);
      } catch (error) {
        console.error('Error cargando estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando as túas estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saludo con retranca gallega */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Wheat className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                ¡Ola, {user.name?.split(' ')[0]}! 🌾
              </h2>
              <p className="text-gray-600 mt-1">
                As túas fincas esperando... ¡A terra non se cultiva soa!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Próximos alugamentos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Próximas Fincas
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.proximos || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.proximos === 1 ? 'Finca esperando' : 'Fincas esperando'}
            </p>
          </CardContent>
        </Card>

        {/* Fincas cultivadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fincas Cultivadas
            </CardTitle>
            <Wheat className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.completados || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.mesesCultivados || 0} meses de experiencia
            </p>
          </CardContent>
        </Card>

        {/* Gasto total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Investido
            </CardTitle>
            <Euro className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.totalGasto ? stats.totalGasto.toLocaleString('es-ES') : 0}€
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Gasto medio: {stats?.gastoMedio ? stats.gastoMedio.toLocaleString('es-ES') : 0}€
            </p>
          </CardContent>
        </Card>

        {/* Total alugamentos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Fincas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.totalAlugamentos || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.totalAlugamentos === 1 ? 'Alugamento total' : 'Alugamentos totais'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accións rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Clock className="h-5 w-5 mr-2 text-galician-blue" />
            Accións Rápidas
          </CardTitle>
          <p className="text-gray-600">
            O que necesitas facer hoxe na túa vida de labrego
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50"
              onClick={() => router.push('/taboleiro/mos-alugamentos')}
            >
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Os Meus Alugamentos</span>
              <span className="text-xs text-gray-500">Próximas e pasadas</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50"
              onClick={() => router.push('/taboleiro/mensaxes')}
            >
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">Mensaxes</span>
              <span className="text-xs text-gray-500">Con propietarios</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-red-50"
              onClick={() => router.push('/taboleiro/favoritas')}
            >
              <Heart className="h-6 w-6 text-red-600" />
              <span className="text-sm font-medium">Favoritas</span>
              <span className="text-xs text-gray-500">Fincas que che gustan</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-yellow-50"
              onClick={() => router.push('/fincas')}
            >
              <MapPin className="h-6 w-6 text-yellow-600" />
              <span className="text-sm font-medium">Buscar Fincas</span>
              <span className="text-xs text-gray-500">Atopa a túa próxima</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje motivacional */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🌱 &quot;A terra non se cultiva soa, pero ti sí que a podes facer florecer&quot;
            </h3>
            <p className="text-gray-600">
              {stats?.proximos === 0 
                ? "Non tes fincas próximas. ¿Que tal buscar unha nova para cultivar?" 
                : `Tes ${stats?.proximos} ${stats?.proximos === 1 ? 'finca esperando' : 'fincas esperando'} para cultivar. ¡Á traballo!`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
