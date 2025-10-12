/**
 * NotificationsBell Component - FincAirbnb
 * 
 * Componente de campanita de notificaciones que muestra:
 * - Mensajes sin leer
 * - Solicitudes de alquiler no vistas
 * - Badge con contador total
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, MessageCircle, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { getMessagingStats } from '@/services/mockMessagesDashboard';
import type { User as UserType } from '@/shared/types';

interface NotificationsBellProps {
  user: UserType;
}

interface NotificationItem {
  id: string;
  type: 'message' | 'alugamento';
  title: string;
  description: string;
  timestamp: string;
  href: string;
  isRead: boolean;
}

export function NotificationsBell({ user }: NotificationsBellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        
        // Cargar mensajes sin leer
        const messagingStats = await getMessagingStats(user.id, user.role as 'owner' | 'guest');
        
        const notificationItems: NotificationItem[] = [];
        let unreadCount = 0;
        
        // Agregar mensajes sin leer
        messagingStats.recentActivity.forEach((activity, index) => {
          if (activity.isUnread) {
            notificationItems.push({
              id: `msg-${activity.alugamentoId}-${index}`,
              type: 'message',
              title: `Nova mensaxe de ${activity.otherUserName}`,
              description: activity.messagePreview,
              timestamp: activity.timestamp,
              href: `/taboleiro/mensaxes?alugamento=${activity.alugamentoId}`,
              isRead: false
            });
            unreadCount++;
          }
        });
        
        // TODO: Agregar solicitudes de alquiler pendientes cuando esté disponible el servicio
        // Por ahora solo mostramos mensajes
        
        // Ordenar por timestamp (más recientes primero)
        notificationItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setNotifications(notificationItems);
        setTotalUnread(unreadCount);
        
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [user.id, user.role]);

  const handleNotificationClick = (notification: NotificationItem) => {
    setIsOpen(false);
    router.push(notification.href);
  };

  const handleMarkAllAsRead = () => {
    // En un sistema real, aquí se marcarían todas las notificaciones como leídas
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setTotalUnread(0);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Hai poucos minutos';
    } else if (diffInHours < 24) {
      return `Hai ${Math.floor(diffInHours)} horas`;
    } else {
      return date.toLocaleDateString('gl-ES', { day: '2-digit', month: '2-digit' });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'alugamento':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-gray-100 transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {totalUnread > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
              {totalUnread > 9 ? '9+' : totalUnread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificacións</CardTitle>
              {totalUnread > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-galician-blue mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Cargando notificacións...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Non tes notificacións novas
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 10).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1 truncate">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                
                {notifications.length > 10 && (
                  <div className="p-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        setIsOpen(false);
                        router.push('/taboleiro/mensaxes');
                      }}
                    >
                      Ver todas as notificacións ({notifications.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
