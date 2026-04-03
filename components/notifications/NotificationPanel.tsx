'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '@/services/notifications';

interface NotificationPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({
  notifications,
  isLoading,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  // Pechar ao facer clic fóra
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const unread = notifications.filter(n => !n.read);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-galician-blue" />
          <h3 className="font-semibold text-gray-900">Notificacións</h3>
        </div>
        {unread.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs text-galician-blue hover:text-blue-700"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Marcar todas
          </Button>
        )}
      </div>

      {/* Lista */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-galician-blue" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Sen notificacións</p>
          </div>
        ) : (
          notifications.map(n => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={onMarkAsRead}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <button
            onClick={() => { router.push('/taboleiro/notificacions'); onClose(); }}
            className="text-xs text-galician-blue hover:underline w-full text-center"
          >
            Ver todas as notificacións
          </button>
        </div>
      )}
    </div>
  );
}
