/**
 * User Types - FincAirbnb
 * 
 * Tipos relacionados con usuarios, autenticación y perfiles
 */

// Rol del usuario en la plataforma
export type UserRole = 'guest' | 'owner' | 'admin';

// Estado de la suscripción (para propietarios)
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';
export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise';

/**
 * Usuario completo de la plataforma
 */
export interface User {
  id: string;
  email: string;
  password?: string; // Solo en mock, nunca enviar al frontend en producción
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  
  // Ubicación
  location?: {
    city: string;
    province: string;
  };
  
  // Suscripción (solo para owners)
  subscription?: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: string;
    endDate: string;
  };
  
  // Estadísticas
  stats?: {
    properties?: number; // Para owners
    totalBookings: number;
    rating?: number;
    responseRate?: number; // Para owners
    responseTime?: number; // Horas promedio
    reviews?: number; // Para guests
  };
  
  // Metadatos
  verified: boolean;
  joinedAt: string;
  lastLogin?: string;
}

/**
 * Datos para registro de nuevo usuario
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string; // Para validación en frontend
  phone?: string;
  role?: UserRole; // Por defecto 'guest'
  acceptTerms: boolean;
}

/**
 * Datos para login
 */
export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number; // Segundos hasta expiración
}

/**
 * Datos para actualizar perfil
 */
export interface UpdateProfileData {
  name?: string;
  phone?: string;
  bio?: string;
  location?: {
    city: string;
    province: string;
  };
  avatar?: string;
}

/**
 * Configuración de notificaciones
 */
export interface NotificationSettings {
  email: {
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    marketing: boolean;
  };
  inApp: {
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    system: boolean;
  };
}

