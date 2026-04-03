'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 text-gray-600 hover:text-galician-blue transition-colors rounded-lg hover:bg-gray-100"
        aria-label="Notificacións"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          isLoading={isLoading}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}
    </div>
  );
}
