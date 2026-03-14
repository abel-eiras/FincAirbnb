/**
 * Mock Conversation Manager - FincAirbnb
 * 
 * Servicio para gestionar la conexión entre alugamentos y conversaciones
 */

import type { Conversation, Message } from '@/shared/types';
import { delay, loadMockData, generateId } from './utils';
import { apiClient } from './apiClient';
import { isExternalApiEnabled } from './runtime';

/**
 * Crea una conversación automáticamente cuando se crea un alugamento
 * 
 * @param alugamentoId - ID del alugamento
 * @param propertyId - ID de la propiedad
 * @param labregoId - ID del labrego
 * @param ownerId - ID del propietario
 * @param initialMessage - Mensaje inicial opcional
 * @returns Promise con la conversación creada
 */
export async function createConversationFromAlugamento(
  alugamentoId: string,
  propertyId: string,
  labregoId: string,
  ownerId: string,
  initialMessage?: string
): Promise<Conversation> {
  if (isExternalApiEnabled()) {
    return apiClient.post<Conversation>('/messages', {
      bookingId: alugamentoId,
      propertyId,
      guestId: labregoId,
      ownerId,
      initialMessage: initialMessage || 'Ola! Conversación iniciada para o alugamento.'
    });
  }

  await delay();
  
  // Mensaje inicial por defecto
  const defaultMessage = initialMessage || 
    `Ola! Acabo de solicitar o alugamento da finca. Estou moi emocionado/a para comezar a cultivar!`;
  
  // Crear primer mensaje
  const firstMessage: Message = {
    id: generateId('msg'),
    senderId: labregoId,
    senderType: 'guest',
    content: defaultMessage,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  // Crear conversación
  const newConversation: Conversation = {
    id: generateId('conv'),
    bookingId: alugamentoId,
    propertyId,
    guestId: labregoId,
    ownerId,
    messages: [firstMessage],
    lastMessageAt: firstMessage.createdAt,
    lastMessagePreview: firstMessage.content.substring(0, 100),
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  // Guardar conversación
  const conversations = await loadMockData<Conversation>('messages');
  conversations.push(newConversation);
  saveToLocalStorage('messages', conversations);
  
  return newConversation;
}

/**
 * Obtiene todas las conversaciones relacionadas con alugamentos del usuario
 * 
 * @param userId - ID del usuario
 * @param userRole - Rol del usuario ('owner' | 'guest')
 * @returns Promise con conversaciones
 */
export async function getConversationsFromAlugamentos(
  userId: string,
  userRole: 'owner' | 'guest'
): Promise<Conversation[]> {
  if (isExternalApiEnabled()) {
    return apiClient.get<Conversation[]>(`/messages/user/${userId}`);
  }

  await delay();
  
  // Cargar alugamentos y conversaciones
  const alugamentos = await loadMockData<any>('alugamentos');
  const conversations = await loadMockData<Conversation>('messages');
  
  // Filtrar alugamentos del usuario
  const userAlugamentos = alugamentos.filter((alug: any) => {
    if (userRole === 'owner') {
      return alug.ownerId === userId;
    } else {
      return alug.labregoId === userId;
    }
  });
  
  // Encontrar conversaciones relacionadas
  const relatedConversations = conversations.filter(conv => {
    return userAlugamentos.some((alug: any) => alug.id === conv.bookingId);
  });
  
  return relatedConversations;
}

/**
 * Inicializa conversaciones para alugamentos existentes que no tienen conversación
 * 
 * @returns Promise con el número de conversaciones creadas
 */
export async function initializeMissingConversations(): Promise<number> {
  if (isExternalApiEnabled()) {
    return 0;
  }

  await delay();
  
  const alugamentos = await loadMockData<any>('alugamentos');
  const conversations = await loadMockData<Conversation>('messages');
  
  let createdCount = 0;
  
  for (const alugamento of alugamentos) {
    // Verificar si ya existe conversación para este alugamento
    const existingConversation = conversations.find(conv => conv.bookingId === alugamento.id);
    
    if (!existingConversation) {
      // Crear conversación automáticamente
      try {
        await createConversationFromAlugamento(
          alugamento.id,
          alugamento.propertyId,
          alugamento.labregoId,
          alugamento.ownerId
        );
        createdCount++;
      } catch (error) {
        console.error(`Error creando conversación para alugamento ${alugamento.id}:`, error);
      }
    }
  }
  
  return createdCount;
}

/**
 * Obtiene estadísticas de mensajería para un usuario
 * 
 * @param userId - ID del usuario
 * @param userRole - Rol del usuario
 * @returns Promise con estadísticas
 */
export async function getMessagingStatsForUser(
  userId: string,
  userRole: 'owner' | 'guest'
): Promise<{
  totalConversations: number;
  unreadMessages: number;
  recentActivity: Array<{
    alugamentoId: string;
    propertyTitle: string;
    otherUserName: string;
    messagePreview: string;
    timestamp: string;
    isUnread: boolean;
  }>;
}> {
  await delay();
  
  const conversations = await getConversationsFromAlugamentos(userId, userRole);
  const users = await loadMockData<any>('users');
  const properties = await loadMockData<any>('properties');
  
  let unreadCount = 0;
  const recentActivity: any[] = [];
  
  conversations.forEach(conv => {
    // Contar mensajes no leídos
    conv.messages.forEach(msg => {
      if (!msg.read && msg.senderId !== userId) {
        unreadCount++;
      }
    });
    
    // Obtener información para actividad reciente
    const property = properties.find((p: any) => p.id === conv.propertyId);
    const otherUserId = userRole === 'owner' ? conv.guestId : conv.ownerId;
    const otherUser = users.find((u: any) => u.id === otherUserId);
    
    if (property && otherUser) {
      const lastMessage = conv.messages[conv.messages.length - 1];
      const isUnread = !lastMessage.read && lastMessage.senderId !== userId;
      
      recentActivity.push({
        alugamentoId: conv.bookingId,
        propertyTitle: property.title,
        otherUserName: otherUser.name,
        messagePreview: lastMessage.content.substring(0, 100),
        timestamp: lastMessage.createdAt,
        isUnread
      });
    }
  });
  
  // Ordenar por timestamp (más recientes primero)
  recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return {
    totalConversations: conversations.length,
    unreadMessages: unreadCount,
    recentActivity: recentActivity.slice(0, 5) // Solo los 5 más recientes
  };
}

/**
 * Crea una conversación automáticamente cuando se acepta un alugamento
 * 
 * @param alugamentoId - ID del alugamento aceptado
 * @returns Promise con la conversación creada o null si ya existe
 */
export async function createConversationOnAlugamentoAccepted(
  alugamentoId: string
): Promise<Conversation | null> {
  await delay();
  
  // Cargar datos
  const alugamentos = await loadMockData<any>('alugamentos');
  const conversations = await loadMockData<Conversation>('messages');
  
  // Buscar el alugamento
  const alugamento = alugamentos.find((alug: any) => alug.id === alugamentoId);
  if (!alugamento) {
    console.error(`Alugamento ${alugamentoId} no encontrado`);
    return null;
  }
  
  // Verificar si ya existe conversación
  const existingConversation = conversations.find(conv => conv.bookingId === alugamentoId);
  if (existingConversation) {
    console.log(`Conversación ya existe para alugamento ${alugamentoId}`);
    return existingConversation;
  }
  
  // Crear conversación automáticamente
  try {
    const newConversation = await createConversationFromAlugamento(
      alugamento.id,
      alugamento.propertyId,
      alugamento.labregoId,
      alugamento.ownerId,
      `Ola! O teu alugamento foi aceptado. Estou emocionado/a para comezar a cultivar na túa finca! 🌱`
    );
    
    console.log(`Conversación creada automáticamente para alugamento ${alugamentoId}`);
    return newConversation;
  } catch (error) {
    console.error(`Error creando conversación para alugamento ${alugamentoId}:`, error);
    return null;
  }
}

/**
 * Obtiene o crea una conversación para un alugamento específico
 * 
 * @param alugamentoId - ID del alugamento
 * @returns Promise con la conversación existente o creada
 */
export async function getOrCreateConversationForAlugamento(
  alugamentoId: string
): Promise<Conversation | null> {
  await delay();
  
  // Cargar datos
  const alugamentos = await loadMockData<any>('alugamentos');
  const conversations = await loadMockData<Conversation>('messages');
  
  // Buscar el alugamento
  const alugamento = alugamentos.find((alug: any) => alug.id === alugamentoId);
  if (!alugamento) {
    console.error(`Alugamento ${alugamentoId} no encontrado`);
    return null;
  }
  
  // Verificar si ya existe conversación
  const existingConversation = conversations.find(conv => conv.bookingId === alugamentoId);
  if (existingConversation) {
    return existingConversation;
  }
  
  // Crear conversación si no existe
  try {
    const newConversation = await createConversationFromAlugamento(
      alugamento.id,
      alugamento.propertyId,
      alugamento.labregoId,
      alugamento.ownerId,
      `Ola! O teu alugamento foi aceptado. Estou emocionado/a para comezar a cultivar na túa finca! 🌱`
    );
    
    console.log(`Conversación creada para alugamento ${alugamentoId}`);
    return newConversation;
  } catch (error) {
    console.error(`Error creando conversación para alugamento ${alugamentoId}:`, error);
    return null;
  }
}

// Helper para guardar en localStorage
function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(`fincairbnb_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}
