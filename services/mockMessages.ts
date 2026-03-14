/**
 * Mock Messages Service - FincAirbnb
 * 
 * Servicio que simula sistema de mensajería
 */

import type { Conversation, Message, CreateConversationData } from '@/shared/types';
import { delay, loadMockData, generateId } from './utils';
import { initializeMissingConversations } from './mockConversationManager';
import { apiClient } from './apiClient';
import { isExternalApiEnabled } from './runtime';

/**
 * Obtiene todas las conversaciones de un usuario
 * Incluye conversaciones generales y conversaciones de alugamentos
 * 
 * @param userId - ID del usuario
 * @returns Promise con array de conversaciones
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  if (isExternalApiEnabled()) {
    return apiClient.get<Conversation[]>(`/messages/user/${userId}`);
  }

  await delay();
  
  // Primero, inicializar conversaciones faltantes
  await initializeMissingConversations();
  
  const conversations = await loadMockData<Conversation>('messages');
  
  // Filtrar conversaciones donde el usuario participa
  // Incluye tanto conversaciones generales como de alugamentos
  return conversations.filter(c => 
    c.guestId === userId || c.ownerId === userId
  );
}

/**
 * Obtiene una conversación específica por ID
 * 
 * @param id - ID de la conversación
 * @returns Promise con la conversación
 */
export async function getConversation(id: string): Promise<Conversation> {
  if (isExternalApiEnabled()) {
    return apiClient.get<Conversation>(`/messages/${id}`);
  }

  await delay();
  
  const conversations = await loadMockData<Conversation>('messages');
  const conversation = conversations.find(c => c.id === id);
  
  if (!conversation) {
    throw new Error('Conversación non atopada');
  }
  
  return conversation;
}

/**
 * Envía un mensaje en una conversación (MOCK)
 * 
 * @param conversationId - ID de la conversación
 * @param senderId - ID del remitente
 * @param content - Contenido del mensaje
 * @returns Promise con el mensaje creado
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message> {
  if (isExternalApiEnabled()) {
    return apiClient.post<Message>(`/messages/${conversationId}/messages`, { senderId, content });
  }

  await delay();
  
  const conversations = await loadMockData<Conversation>('messages');
  const index = conversations.findIndex(c => c.id === conversationId);
  
  if (index === -1) {
    throw new Error('Conversación non atopada');
  }
  
  // Determinar tipo de remitente
  const conversation = conversations[index];
  const senderType = senderId === conversation.guestId ? 'guest' : 'owner';
  
  // Crear nuevo mensaje
  const newMessage: Message = {
    id: generateId('msg'),
    senderId,
    senderType,
    content,
    read: false,
    createdAt: new Date().toISOString(),
  };
  
  // Añadir mensaje a la conversación
  conversations[index].messages.push(newMessage);
  conversations[index].lastMessageAt = newMessage.createdAt;
  conversations[index].lastMessagePreview = content.substring(0, 100);
  
  // Guardar
  saveToLocalStorage('messages', conversations);
  
  return newMessage;
}

/**
 * Marca una conversación como leída
 * 
 * @param conversationId - ID de la conversación
 * @param userId - ID del usuario que lee
 */
export async function markAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
  if (isExternalApiEnabled()) {
    await apiClient.post<{ updated: boolean }>(`/messages/${conversationId}/read`, { userId });
    return;
  }

  await delay();
  
  const conversations = await loadMockData<Conversation>('messages');
  const conversation = conversations.find(c => c.id === conversationId);
  
  if (!conversation) {
    return;
  }
  
  // Marcar todos los mensajes del otro usuario como leídos
  conversation.messages.forEach(msg => {
    if (msg.senderId !== userId) {
      msg.read = true;
    }
  });
  
  saveToLocalStorage('messages', conversations);
}

/**
 * Crea una nueva conversación (MOCK)
 * 
 * @param data - Datos de la conversación
 * @returns Promise con la conversación creada
 */
export async function createConversation(
  data: CreateConversationData
): Promise<Conversation> {
  if (isExternalApiEnabled()) {
    return apiClient.post<Conversation>('/messages', data);
  }

  await delay();
  
  // Crear primera mensaje
  const firstMessage: Message = {
    id: generateId('msg'),
    senderId: data.guestId,
    senderType: 'guest',
    content: data.initialMessage,
    read: false,
    createdAt: new Date().toISOString(),
  };
  
  // Crear conversación
  const newConversation: Conversation = {
    id: generateId('conv'),
    bookingId: data.bookingId || null,
    propertyId: data.propertyId,
    guestId: data.guestId,
    ownerId: data.ownerId,
    messages: [firstMessage],
    lastMessageAt: firstMessage.createdAt,
    lastMessagePreview: firstMessage.content.substring(0, 100),
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  
  // Guardar
  const conversations = await loadMockData<Conversation>('messages');
  conversations.push(newConversation);
  saveToLocalStorage('messages', conversations);
  
  return newConversation;
}

/**
 * Cuenta mensajes no leídos del usuario
 * 
 * @param userId - ID del usuario
 * @returns Promise con el número de mensajes no leídos
 */
export async function getUnreadCount(userId: string): Promise<number> {
  if (isExternalApiEnabled()) {
    const result = await apiClient.get<{ count: number }>(`/messages/user/${userId}/unread-count`);
    return result.count;
  }

  await delay();
  
  const conversations = await getConversations(userId);
  
  let unreadCount = 0;
  
  // Contar mensajes no leídos en cada conversación
  conversations.forEach(conv => {
    conv.messages.forEach(msg => {
      // Solo contar mensajes de otros usuarios que no hemos leído
      if (msg.senderId !== userId && !msg.read) {
        unreadCount++;
      }
    });
  });
  
  return unreadCount;
}

/**
 * Busca conversaciones por texto
 * 
 * @param userId - ID del usuario
 * @param query - Texto de búsqueda
 * @returns Promise con conversaciones filtradas
 */
export async function searchConversations(
  userId: string, 
  query: string
): Promise<Conversation[]> {
  if (isExternalApiEnabled()) {
    const conversations = await apiClient.get<Conversation[]>(`/messages/user/${userId}`);
    const lowerQuery = query.toLowerCase();
    return conversations.filter((conv) =>
      conv.messages.some((msg) => msg.content.toLowerCase().includes(lowerQuery)) ||
      conv.propertyId.toLowerCase().includes(lowerQuery)
    );
  }

  await delay();
  
  const conversations = await getConversations(userId);
  const lowerQuery = query.toLowerCase();
  
  return conversations.filter(conv => {
    // Buscar en el contenido de los mensajes
    const hasMatchingMessage = conv.messages.some(msg => 
      msg.content.toLowerCase().includes(lowerQuery)
    );
    
    // Buscar en el ID de la propiedad (título)
    const hasMatchingProperty = conv.propertyId.toLowerCase().includes(lowerQuery);
    
    return hasMatchingMessage || hasMatchingProperty;
  });
}

/**
 * Obtiene conversaciones con filtros
 * 
 * @param userId - ID del usuario
 * @param filters - Filtros a aplicar
 * @returns Promise con conversaciones filtradas
 */
export async function getFilteredConversations(
  userId: string,
  filters: {
    unreadOnly?: boolean;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<Conversation[]> {
  if (isExternalApiEnabled()) {
    let conversations = await apiClient.get<Conversation[]>(`/messages/user/${userId}`);
    if (filters.unreadOnly) {
      conversations = conversations.filter((conv) => conv.messages.some((msg) => !msg.read && msg.senderId !== userId));
    }
    return conversations;
  }

  await delay();
  
  let conversations = await getConversations(userId);
  
  // Filtrar por no leídos
  if (filters.unreadOnly) {
    conversations = conversations.filter(conv => {
      return conv.messages.some(msg => !msg.read && msg.senderId !== userId);
    });
  }
  
  // Filtrar por fecha
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    conversations = conversations.filter(conv => 
      new Date(conv.createdAt) >= fromDate
    );
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    conversations = conversations.filter(conv => 
      new Date(conv.createdAt) <= toDate
    );
  }
  
  return conversations;
}

// Helper para guardar en localStorage
function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(`fincairbnb_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

