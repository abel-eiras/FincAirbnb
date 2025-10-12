/**
 * MessagingQuickAccess Component - FincAirbnb
 * 
 * Componente para acceso rápido a la mensajería desde el dashboard
 * Incluye indicadores de mensajes sin leer y conversaciones recientes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Bell, 
  Clock, 
  User, 
  Eye,
  ChevronRight,
  Mail,
  MailOpen
} from 'lucide-react';
import { getMessagingStats, markConversationAsRead } from '@/services/mockMessagesDashboard';
import type { User as UserType } from '@/shared/types';

interface MessagingQuickAccessProps {
  user: UserType;
}

interface MessagingStats {
  totalUnread: number;
  conversationsWithUnread: number;
  recentActivity: Array<{
    alugamentoId: string;
    propertyTitle: string;
    otherUserName: string;
    messagePreview: string;
    timestamp: string;
    isUnread: boolean;
  }>;
}

export function MessagingQuickAccess({ user }: MessagingQuickAccessProps) {
  const router = useRouter();
  const [stats, setStats] = useState<MessagingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await getMessagingStats(user.id, user.role as 'owner' | 'guest');
        setStats(data);
      } catch (error) {
        console.error('Error cargando estadísticas de mensajería:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user.id, user.role]);

  const handleMarkAsRead = async (alugamentoId: string) => {
    try {
      // En un sistema real, aquí se marcaría la conversación como leída
      // Por ahora, solo actualizamos las estadísticas
      const data = await getMessagingStats(user.id, user.role as 'owner' | 'guest');
      setStats(data);
    } catch (error) {
      console.error('Error marcando como leído:', error);
    }
  };

  const handleGoToConversation = (alugamentoId: string) => {
    router.push(`/taboleiro/mensaxeria?alugamento=${alugamentoId}`);
  };

  const handleGoToAllMessages = () => {
    router.push('/taboleiro/mensaxeria');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageCircle className="h-5 w-5 mr-2 text-galician-blue" />
            Mensaxería
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-galician-blue mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Cargando mensaxes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <MessageCircle className="h-5 w-5 mr-2 text-galician-blue" />
            Mensaxería
            {stats.totalUnread > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {stats.totalUnread}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoToAllMessages}
            className="text-galician-blue hover:text-blue-700"
          >
            Ver todas
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          {stats.totalUnread > 0 
            ? `Tes ${stats.totalUnread} mensaxe${stats.totalUnread !== 1 ? 's' : ''} sen ler`
            : 'Non tes mensaxes novas'
          }
        </p>
      </CardHeader>
      <CardContent>
        {stats.recentActivity.length === 0 ? (
          <div className="text-center py-6">
            <MailOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Non hai actividade recente de mensaxería
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={`${activity.alugamentoId}-${index}`}
                className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                  activity.isUnread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
                onClick={() => handleGoToConversation(activity.alugamentoId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {activity.otherUserName}
                      </span>
                      {activity.isUnread && (
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-1">
                      {activity.propertyTitle}
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {activity.messagePreview}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1 ml-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString('gl-ES', {
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {stats.recentActivity.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {stats.conversationsWithUnread} conversación{stats.conversationsWithUnread !== 1 ? 's' : ''} con mensaxes
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToAllMessages}
                className="text-galician-blue border-galician-blue hover:bg-galician-blue hover:text-white"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver todas
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
