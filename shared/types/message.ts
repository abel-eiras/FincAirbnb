/**
 * Message Types - FincAirbnb
 * 
 * Tipos relacionados con mensajería y conversaciones
 */

// Tipo de remitente del mensaje
export type SenderType = 'guest' | 'owner' | 'system';

// Estado de la conversación
export type ConversationStatus = 'active' | 'archived';

// Tipo de conversación
export type ConversationType = 'inquiry' | 'booking';

/**
 * Mensaje individual en una conversación
 */
export interface Message {
  id: string;
  senderId: string;
  senderType: SenderType;
  content: string;
  read: boolean;
  createdAt: string;
}

/**
 * Conversación completa entre dos usuarios
 */
export interface Conversation {
  id: string;
  bookingId?: string | null; // null si es consulta pre-booking
  propertyId: string;
  guestId: string;
  ownerId: string;
  
  // Mensajes
  messages: Message[];
  
  // Preview para lista
  lastMessageAt: string;
  lastMessagePreview: string;
  
  // Estado
  status: ConversationStatus;
  createdAt: string;
}

/**
 * Datos para crear nueva conversación
 */
export interface CreateConversationData {
  propertyId: string;
  guestId: string;
  ownerId: string;
  initialMessage: string;
  bookingId?: string;
}

/**
 * Plantilla de mensaje (para propietarios)
 */
export interface MessageTemplate {
  id: string;
  ownerId: string;
  name: string;
  content: string;
  category: 'welcome' | 'checkin' | 'checkout' | 'faq' | 'custom';
  variables: string[]; // Ej: ['guestName', 'propertyName']
  isDefault: boolean; // Plantillas predefinidas del sistema
  createdAt: string;
}

/**
 * Datos para crear una plantilla
 */
export interface CreateTemplateData {
  name: string;
  content: string;
  category: 'welcome' | 'checkin' | 'checkout' | 'faq' | 'custom';
}

/**
 * Variables disponibles para plantillas
 */
export interface TemplateVariables {
  guestName: string;
  propertyName: string;
  checkInDate?: string;
  checkOutDate?: string;
  ownerName: string;
  propertyAddress?: string;
  bookingId?: string;
}

/**
 * Traducciones de variables para mostrar al usuario
 */
export const VARIABLE_TRANSLATIONS = {
  guestName: 'Nome do hóspede',
  propertyName: 'Nome da finca',
  checkInDate: 'Data de chegada',
  checkOutDate: 'Data de saída',
  ownerName: 'Nome do propietario',
  propertyAddress: 'Enderezo da finca',
  bookingId: 'ID da reserva'
} as const;

/**
 * Categorías de plantillas con traducciones
 */
export const TEMPLATE_CATEGORIES = {
  welcome: 'Benvida',
  checkin: 'Chegada',
  checkout: 'Saída', 
  faq: 'Preguntas frecuentes',
  custom: 'Personalizada'
} as const;
