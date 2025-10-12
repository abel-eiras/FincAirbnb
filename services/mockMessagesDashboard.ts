/**
 * Mock Messages Dashboard Service - FincAirbnb
 * 
 * Servicio para manejar mensajes y notificaciones del dashboard
 * Incluye conteo de mensajes sin leer y acceso rápido
 */

import { delay } from './utils';
import type { Message, Conversation } from '@/shared/types';

/**
 * Obtiene el número de mensajes sin leer para un usuario
 */
export async function getUnreadMessagesCount(userId: string, userRole: 'owner' | 'guest'): Promise<number> {
  await delay(300);
  
  try {
    // Cargar mensajes desde localStorage
    const conversations = JSON.parse(localStorage.getItem('messages') || '[]');
    
    let unreadCount = 0;
    
    conversations.forEach((conversation: any) => {
      conversation.messages.forEach((message: any) => {
        if (!message.read && message.senderId !== userId) {
          // Contar solo mensajes del otro rol
          if (userRole === 'owner' && message.senderType === 'guest') {
            unreadCount++;
          } else if (userRole === 'guest' && message.senderType === 'owner') {
            unreadCount++;
          }
        }
      });
    });
    
    return unreadCount;
  } catch (error) {
    console.error('Error contando mensajes sin leer:', error);
    return 0;
  }
}

/**
 * Obtiene las conversaciones recientes con mensajes sin leer
 */
export async function getRecentConversationsWithUnread(
  userId: string, 
  userRole: 'owner' | 'guest',
  limit: number = 5
): Promise<Array<{
  conversationId: string;
  alugamentoId: string;
  propertyTitle: string;
  otherUserName: string;
  otherUserRole: 'owner' | 'guest';
  lastMessage: any;
  unreadCount: number;
}>> {
  await delay(400);
  
  try {
    const conversations = JSON.parse(localStorage.getItem('messages') || '[]');
    const alugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const recentConversations: Array<{
      conversationId: string;
      alugamentoId: string;
      propertyTitle: string;
      otherUserName: string;
      otherUserRole: 'owner' | 'guest';
      lastMessage: any;
      unreadCount: number;
    }> = [];
    
    conversations.forEach((conversation: any) => {
      const alugamento = alugamentos.find((a: any) => a.id === conversation.bookingId);
      if (!alugamento) return;
      
      // Encontrar el otro usuario en la conversación
      const otherUserId = userRole === 'owner' 
        ? alugamento.labregoData.email 
        : alugamento.ownerId;
      
      const otherUser = users.find((u: any) => 
        (userRole === 'owner' ? u.email === otherUserId : u.id === otherUserId)
      );
      
      if (!otherUser) return;
      
      // Contar mensajes sin leer
      let unreadCount = 0;
      let lastMessage: any = null;
      
      conversation.messages.forEach((message: any) => {
        if (!message.read && message.senderId !== userId) {
          unreadCount++;
        }
        if (!lastMessage || new Date(message.createdAt) > new Date(lastMessage.createdAt)) {
          lastMessage = message;
        }
      });
      
      if (unreadCount > 0 && lastMessage) {
        recentConversations.push({
          conversationId: conversation.id,
          alugamentoId: conversation.bookingId || conversation.id,
          propertyTitle: alugamento.propertyTitle,
          otherUserName: otherUser.name,
          otherUserRole: otherUser.role,
          lastMessage,
          unreadCount
        });
      }
    });
    
    // Ordenar por fecha del último mensaje y limitar resultados
    return recentConversations
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error obteniendo conversaciones recientes:', error);
    return [];
  }
}

/**
 * Marca todos los mensajes de una conversación como leídos
 */
export async function markConversationAsRead(conversationId: string, userId: string): Promise<void> {
  await delay(200);
  
  try {
    const conversations = JSON.parse(localStorage.getItem('messages') || '[]');
    
    const conversation = conversations.find((c: any) => c.id === conversationId);
    if (conversation) {
      conversation.messages.forEach((message: any) => {
        if (message.senderId !== userId) {
          message.read = true;
        }
      });
      
      localStorage.setItem('messages', JSON.stringify(conversations));
    }
  } catch (error) {
    console.error('Error marcando conversación como leída:', error);
  }
}

/**
 * Obtiene estadísticas de mensajería para el dashboard
 */
export async function getMessagingStats(userId: string, userRole: 'owner' | 'guest'): Promise<{
  totalUnread: number;
  conversationsWithUnread: number;
  recentActivity: Array<{
    alugamentoId: string;
    propertyTitle: string;
    otherUserName: string;
    messagePreview: string;
    timestamp: string;
    isUnread: boolean;
  }>;
}> {
  await delay(500);
  
  try {
    const conversations = JSON.parse(localStorage.getItem('messages') || '[]');
    const alugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    let totalUnread = 0;
    let conversationsWithUnread = 0;
    const recentActivity: Array<{
      alugamentoId: string;
      propertyTitle: string;
      otherUserName: string;
      messagePreview: string;
      timestamp: string;
      isUnread: boolean;
    }> = [];
    
    conversations.forEach((conversation: any) => {
      const alugamento = alugamentos.find((a: any) => a.id === conversation.bookingId);
      if (!alugamento) return;
      
      let conversationUnreadCount = 0;
      let lastMessage: any = null;
      
      conversation.messages.forEach((message: any) => {
        if (!message.read && message.senderId !== userId) {
          conversationUnreadCount++;
          totalUnread++;
        }
        if (!lastMessage || new Date(message.createdAt) > new Date(lastMessage.createdAt)) {
          lastMessage = message;
        }
      });
      
      if (conversationUnreadCount > 0) {
        conversationsWithUnread++;
      }
      
      if (lastMessage) {
        const otherUserId = userRole === 'owner' 
          ? alugamento.labregoData.email 
          : alugamento.ownerId;
        
        const otherUser = users.find((u: any) => 
          (userRole === 'owner' ? u.email === otherUserId : u.id === otherUserId)
        );
        
        if (otherUser && lastMessage) {
          recentActivity.push({
            alugamentoId: conversation.bookingId || conversation.id,
            propertyTitle: alugamento.propertyTitle,
            otherUserName: otherUser.name,
            messagePreview: lastMessage.content.length > 50 
              ? lastMessage.content.substring(0, 50) + '...' 
              : lastMessage.content,
            timestamp: lastMessage.createdAt,
            isUnread: !lastMessage.read && lastMessage.senderId !== userId
          });
        }
      }
    });
    
    // Ordenar por timestamp y limitar a 5
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return {
      totalUnread,
      conversationsWithUnread,
      recentActivity: recentActivity.slice(0, 5)
    };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas de mensajería:', error);
    return {
      totalUnread: 0,
      conversationsWithUnread: 0,
      recentActivity: []
    };
  }
}