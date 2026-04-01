/**
 * Users Service - FincAirbnb
 *
 * Acceso básico a datos de usuario (perfil público).
 * Usado principalmente para enriquecer vistas de mensaxería.
 */

import type { User } from '@/shared/types';
import { delay, loadMockData } from './utils';
import { apiClient } from './apiClient';
import { isExternalApiEnabled } from './runtime';

/**
 * Obtén o perfil básico dun usuario polo seu ID.
 * Devolve null se non se atopa ou se produce un erro.
 */
export async function getUserById(userId: string): Promise<User | null> {
  if (isExternalApiEnabled()) {
    try {
      return await apiClient.get<User>(`/users/${userId}`);
    } catch {
      return null;
    }
  }

  await delay(100);
  const users = await loadMockData<User>('users');
  return users.find(u => u.id === userId) ?? null;
}
