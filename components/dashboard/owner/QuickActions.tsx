/**
 * QuickActions Component - FincAirbnb
 * 
 * Componente que muestra botones de acciones rápidas
 * para tareas comunes del propietario
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Calendar,
  FileText,
  MessageSquare,
  Star,
  Settings,
  Home,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

/**
 * Definición de acciones rápidas disponibles
 */
const quickActions = [
  {
    id: 'manage-properties',
    title: 'Xestionar Propiedades',
    description: 'Ver e xestionar as túas fincas',
    icon: <Home className="h-6 w-6" />,
    color: 'bg-galician-blue hover:bg-blue-700',
    href: '/taboleiro/minas-fincas'
  },
  {
    id: 'view-calendar',
    title: 'Ver Calendario',
    description: 'Xestionar dispoñibilidade e reservas',
    icon: <Calendar className="h-6 w-6" />,
    color: 'bg-galician-green hover:bg-green-700',
    href: '/taboleiro/calendario'
  },
  {
    id: 'manage-bookings',
    title: 'Xestionar Reservas',
    description: 'Ver e xestionar todas as reservas',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-purple-600 hover:bg-purple-700',
    href: '/taboleiro/reservas'
  },
  {
    id: 'respond-messages',
    title: 'Responder Mensaxes',
    description: 'Ver e responder mensaxes dos labregos',
    icon: <MessageSquare className="h-6 w-6" />,
    color: 'bg-indigo-600 hover:bg-indigo-700',
    href: '/taboleiro/mensaxes'
  },
  {
    id: 'view-reviews',
    title: 'Ver Valoracións',
    description: 'Revisar valoracións e comentarios',
    icon: <Star className="h-6 w-6" />,
    color: 'bg-yellow-600 hover:bg-yellow-700',
    href: '/taboleiro/valoracions'
  },
  {
    id: 'pricing-settings',
    title: 'Configurar Prezos',
    description: 'Ajustar prezos e políticas',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-green-600 hover:bg-green-700',
    href: '/taboleiro/prezos'
  }
];

/**
 * Acciones secundarias (menos frecuentes)
 */
const secondaryActions = [
  {
    id: 'property-stats',
    title: 'Estatísticas das Propiedades',
    description: 'Analizar rendemento por propiedade',
    icon: <Home className="h-5 w-5" />,
    href: '/taboleiro/estatisticas'
  },
  {
    id: 'guest-management',
    title: 'Xestión de Labregos',
    description: 'Ver historial de labregos',
    icon: <Users className="h-5 w-5" />,
    href: '/taboleiro/labregos'
  },
  {
    id: 'account-settings',
    title: 'Configuración da Conta',
    description: 'Axustes do perfil e conta',
    icon: <Settings className="h-5 w-5" />,
    href: '/taboleiro/configuracion'
  },
  {
    id: 'booking-history',
    title: 'Historial de Reservas',
    description: 'Ver todas as reservas pasadas',
    icon: <Clock className="h-5 w-5" />,
    href: '/taboleiro/historial'
  }
];

/**
 * Componente principal de acciones rápidas
 */
export function QuickActions({ onAction }: QuickActionsProps) {
  const router = useRouter();
  
  const handleAction = (actionId: string, href: string) => {
    console.log('Acción seleccionada:', actionId);
    
    // Llamar callback si existe
    if (onAction) {
      onAction(actionId);
    }
    
    // Navegación con Next.js router
    router.push(href);
  };

  return (
    <div className="space-y-6">
      {/* Acciones principales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-galician-blue flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Accións Rápidas
          </CardTitle>
          <p className="text-gray-600">
            Accesos directos ás funcións máis utilizadas
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-start space-y-2 ${action.color} text-white border-0 hover:shadow-md transition-all duration-200`}
                onClick={() => handleAction(action.id, action.href)}
              >
                <div className="flex items-center space-x-2 w-full">
                  {action.icon}
                  <span className="font-semibold text-left">{action.title}</span>
                </div>
                <p className="text-sm opacity-90 text-left">
                  {action.description}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones secundarias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Outras Accións
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Funcións adicionais de xestión
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {secondaryActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                className="h-auto p-3 flex flex-col items-start space-y-2 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handleAction(action.id, action.href)}
              >
                <div className="flex items-center space-x-2 w-full">
                  {action.icon}
                  <span className="font-medium text-sm text-left">{action.title}</span>
                </div>
                <p className="text-xs text-gray-500 text-left">
                  {action.description}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-gradient-to-r from-shell-beige to-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-galician-blue rounded-full">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-galician-blue mb-1">
                💡 Consello do Día
              </h4>
              <p className="text-sm text-gray-700">
                Mantén os teus prezos actualizados segundo a demanda estacional. 
                Os prezos dinámicos poden aumentar os teus ingresos ata un 25%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
