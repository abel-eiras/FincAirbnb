'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type Notification,
} from '@/services/notifications';
import { isExternalApiEnabled } from '@/services/runtime';

const POLL_INTERVAL_MS = 30_000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    if (!isExternalApiEnabled()) return;
    try {
      const [items, count] = await Promise.all([getNotifications(), getUnreadCount()]);
      setNotifications(items);
      setUnreadCount(count);
    } catch {
      // silent — non romper a UI
    }
  }, []);

  const handleMarkAsRead = useCallback(async (id: string) => {
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!isExternalApiEnabled()) return;

    setIsLoading(true);
    refresh().finally(() => setIsLoading(false));

    intervalRef.current = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    refresh,
  };
}
