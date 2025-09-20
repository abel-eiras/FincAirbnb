/**
 * Tipos TypeScript para el sistema de autenticación
 * 
 * Este archivo define todas las interfaces y tipos que necesitamos
 * para manejar usuarios, sesiones y autenticación en la aplicación.
 * 
 * ¿Por qué separar los tipos?
 * - Reutilización: Los tipos se pueden usar en múltiples componentes
 * - Mantenimiento: Cambios centralizados en un solo lugar
 * - IntelliSense: Mejor autocompletado en el IDE
 */

// Tipo para un usuario en nuestro sistema
export interface User {
  id: string;           // Identificador único del usuario
  name: string;         // Nombre completo
  email: string;        // Email (también funciona como username)
  phone?: string;       // Teléfono (opcional)
  avatar?: string;      // URL de la imagen de perfil
  joinDate: string;     // Fecha de registro (formato ISO)
  preferences?: {       // Preferencias del usuario (opcional)
    newsletter: boolean;
    notifications: boolean;
  };
}

// Tipo para las credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean; // Checkbox "Recordar sesión"
}

// Tipo para el formulario de registro
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms: boolean;     // Debe ser true para continuar
  newsletter?: boolean;     // Opcional
}

// Tipo para la sesión del usuario autenticado
export interface AuthSession {
  user: User;           // Datos del usuario
  token: string;        // Token JWT (mock)
  expiresAt: number;    // Timestamp de expiración
  isAuthenticated: boolean; // Estado de autenticación
}

// Tipo para el contexto de autenticación
export interface AuthContextType {
  // Estado actual
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Acciones disponibles
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  
  // Utilidades
  isAuthenticated: () => boolean;
  getCurrentUser: () => User | null;
}

// Tipo para errores de autenticación
export interface AuthError {
  code: string;         // Código del error (ej: "INVALID_CREDENTIALS")
  message: string;      // Mensaje para mostrar al usuario
  field?: string;       // Campo específico que causó el error (opcional)
}

// Tipo para la respuesta de la API mock
export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: AuthError;
}

// Constantes para códigos de error
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
} as const;

// Tipo para los códigos de error (TypeScript utility)
export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES];
