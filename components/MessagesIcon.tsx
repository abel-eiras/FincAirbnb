/**
 * MessagesIcon - FincAirbnb
 * 
 * Icono de sobre de carta para notificaciones de mensajes específicos
 * Muestra contador de mensajes sin leer y enlace directo a la página de mensajes
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { getMessagingStatsForUser } from '@/services/mockConversationManager';
import type { User as UserType } from '@/shared/types';
import Link from 'next/link';

interface MessagesIconProps {
  user: UserType;
}

interface MessageNotification {
  id: string;
  conversationId: string;
  propertyTitle: string;
  otherUserName: string;
  messagePreview: string;
  timestamp: string;
  isUnread: boolean;
}

export function MessagesIcon({ user }: MessagesIconProps) {
  const [messages, setMessages] = useState<MessageNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Usar el nuevo servicio que conecta con alugamentos
      const messagingStats = await getMessagingStatsForUser(user.id, user.role as 'owner' | 'guest');

      const messageNotifications: MessageNotification[] = [];
      let currentUnreadCount = 0;

      // Convertir actividades recientes en notificaciones de mensajes
      messagingStats.recentActivity.forEach((activity, index) => {
        if (activity.isUnread) {
          messageNotifications.push({
            id: `msg-${activity.alugamentoId}-${index}`,
            conversationId: activity.alugamentoId,
            propertyTitle: activity.propertyTitle,
            otherUserName: activity.otherUserName,
            messagePreview: activity.messagePreview,
            timestamp: activity.timestamp,
            isUnread: true
          });
          currentUnreadCount++;
        }
      });

      // Ordenar por timestamp (más recientes primero)
      messageNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setMessages(messageNotifications);
      setUnreadCount(currentUnreadCount);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      setMessages([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const markAllAsRead = () => {
    // Lógica para marcar todos los mensajes como leídos
    // Por ahora, solo actualizamos el estado local
    setMessages(prev => prev.map(m => ({ ...m, isUnread: false })));
    setUnreadCount(0);
    // TODO: Implementar la lógica real para marcar mensajes como leídos en el backend/mock service
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
      return date.toLocaleDateString('gl-ES', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Mail className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Mensaxes</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between px-2 py-1">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
            <MessageCircle className="h-4 w-4 text-galician-blue" />
            <span>Mensaxes ({unreadCount})</span>
          </h3>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button variant="link" size="sm" onClick={markAllAsRead} className="text-xs text-galician-blue">
                Marcar como lidas
              </Button>
            )}
            <Button variant="link" size="sm" asChild className="text-xs text-galician-blue">
              <Link href="/taboleiro/mensaxes" onClick={() => setIsOpen(false)}>
                Ver todos
              </Link>
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem className="text-center text-gray-500">Cargando...</DropdownMenuItem>
        ) : messages.length === 0 ? (
          <DropdownMenuItem className="text-center text-gray-500">Non hai mensaxes</DropdownMenuItem>
        ) : (
          messages.map(message => (
            <DropdownMenuItem key={message.id} asChild>
              <Link 
                href={`/taboleiro/mensaxes?alugamento=${message.conversationId}`} 
                onClick={() => setIsOpen(false)}
                className={`flex flex-col items-start space-y-1 p-2 rounded-md cursor-pointer 
                            ${message.isUnread ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'}
                            transition-colors relative`}
              >
                {message.isUnread && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
                )}
                <p className={`text-sm font-medium ${message.isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                  {message.otherUserName}
                </p>
                <p className={`text-xs ${message.isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                  {message.propertyTitle}
                </p>
                <p className={`text-xs ${message.isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                  {message.messagePreview}
                </p>
                <p className="text-xs text-gray-400">
                  {formatTimestamp(message.timestamp)}
                </p>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link 
            href="/taboleiro/mensaxes" 
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center space-x-2 text-galician-blue font-medium"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Ir a Mensaxes</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
