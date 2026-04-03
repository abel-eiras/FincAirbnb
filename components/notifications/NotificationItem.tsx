'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { gl } from 'date-fns/locale';
import type { Notification } from '@/services/notifications';

const TYPE_ICONS: Record<string, string> = {
  nova_solicitude: '📋',
  solicitude_aceptada: '✅',
  solicitude_rexeitada: '❌',
  pago_confirmado: '💳',
  nova_mensaxe: '💬',
  nova_avaliacion: '⭐',
  resposta_avaliacion: '💬',
};

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!notification.read) onRead(notification.id);
    if (notification.link) router.push(notification.link);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: gl,
  });

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">
          {TYPE_ICONS[notification.type] ?? '🔔'}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-gray-900 truncate ${!notification.read ? 'font-semibold' : ''}`}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
        </div>
        {!notification.read && (
          <span className="w-2 h-2 bg-galician-blue rounded-full flex-shrink-0 mt-1.5" />
        )}
      </div>
    </button>
  );
}
