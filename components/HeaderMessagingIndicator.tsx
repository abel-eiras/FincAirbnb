/**
 * HeaderMessagingIndicator Component - FincAirbnb
 * 
 * Indicador de mensajes sin leer para el header
 * Muestra un badge rojo cuando hay mensajes pendientes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { getUnreadMessagesCount } from '@/services/mockMessagesDashboard';
import type { User as UserType } from '@/shared/types';

interface HeaderMessagingIndicatorProps {
  user: UserType | null;
}

export function HeaderMessagingIndicator({ user }: HeaderMessagingIndicatorProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user) {
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const count = await getUnreadMessagesCount(user.id, user.role as 'owner' | 'guest');
        setUnreadCount(count);
      } catch (error) {
        console.error('Error cargando mensajes sin leer:', error);
        setUnreadCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadUnreadCount();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  if (!user || isLoading) {
    return null;
  }

  if (unreadCount === 0) {
    return (
      <div className="flex items-center text-gray-600">
        <MessageCircle className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="relative flex items-center">
      <MessageCircle className="h-5 w-5 text-galician-blue" />
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
        {unreadCount > 9 ? '9+' : unreadCount}
      </div>
    </div>
  );
}
