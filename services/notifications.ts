import { apiClient } from './apiClient';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  metadata: Record<string, string>;
  createdAt: string;
}

export async function getNotifications(): Promise<Notification[]> {
  return apiClient.get<Notification[]>('/notifications');
}

export async function getUnreadCount(): Promise<number> {
  const data = await apiClient.get<{ count: number }>('/notifications/unread-count');
  return data.count;
}

export async function markAsRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`, {});
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all', {});
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}
