/**
 * Contexto de Autenticación
 * 
 * Este componente proporciona el estado de autenticación a toda la aplicación
 * usando React Context API. Es como un "estado global" para la autenticación.
 * 
 * ¿Por qué usar Context?
 * - Evita "prop drilling" (pasar props por muchos componentes)
 * - Estado centralizado y accesible desde cualquier componente
 * - Fácil de usar con el hook useAuth()
 */

'use client'; // Necesario para usar hooks en Next.js 13+

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { User, LoginData, RegisterData, AuthResponse } from '@/shared/types';
import { login as mockLogin, register as mockRegister, logout as mockLogout, getCurrentUser as getStoredUser, hasActiveSession } from '@/services/mockAuth';
import { ClientOnly } from '@/components/ui/ClientOnly';

// Types para el contexto de autenticación
interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
  isAuthenticated: boolean;
}

interface AuthContextType {
  // Estado
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Acciones
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  
  // Utilidades
  isAuthenticated: () => boolean;
  getCurrentUser: () => User | null;
}

// Estado inicial del contexto
const initialState = {
  session: null,
  isLoading: true, // Empezamos cargando para evitar problemas de SSR
  error: null,
  isInitialized: false, // Flag para saber si ya se inicializó
};

// Tipos para el reducer (patrón para manejar estado complejo)
type AuthState = {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
};

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: AuthSession | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZED' };

// Reducer para manejar cambios de estado
// Un reducer es una función pura que toma el estado actual y una acción,
// y devuelve el nuevo estado. Es más predecible que usar setState directamente.
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SESSION':
      return { 
        ...state, 
        session: action.payload,
        isLoading: false,
        error: null, // Limpiar errores al establecer sesión
        isInitialized: true
      };
    
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload,
        isLoading: false 
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGOUT':
      return { 
        ...state, 
        session: null,
        error: null,
        isLoading: false,
        isInitialized: true
      };
    
    case 'INITIALIZED':
      return { 
        ...state, 
        isLoading: false,
        isInitialized: true
      };
    
    default:
      return state;
  }
};

// Crear el contexto (inicialmente undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Claves para localStorage (donde guardamos la sesión)
const STORAGE_KEYS = {
  TOKEN: 'fincairbnb_token',
  USER: 'fincairbnb_user',
  EXPIRES_AT: 'fincairbnb_expires_at',
} as const;

/**
 * Provider del contexto de autenticación
 * Este componente envuelve toda la aplicación y proporciona
 * el estado de autenticación a todos los componentes hijos
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Verifica si hay una sesión guardada al cargar la aplicación
   * Esto permite que el usuario permanezca logueado al recargar la página
   */
  useEffect(() => {
    // Solo inicializar en el cliente para evitar problemas de hidratación
    if (typeof window !== 'undefined') {
      try {
        // Intentar recuperar sesión existente
        if (hasActiveSession()) {
          const user = getStoredUser();
          const token = localStorage.getItem('fincairbnb_token');
          
          if (user && token) {
            const storedExpiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
            const expiresAt = storedExpiresAt ? Number(storedExpiresAt) : Date.now() + (24 * 60 * 60 * 1000);
            const session: AuthSession = {
              user,
              token,
              expiresAt,
              isAuthenticated: true,
            };
            dispatch({ type: 'SET_SESSION', payload: session });
          }
        }
        
        // Marcar como inicializado
        dispatch({ type: 'INITIALIZED' });
      } catch (error) {
        console.error('Error al inicializar sesión:', error);
        dispatch({ type: 'INITIALIZED' });
      }
    }
  }, []);

  /**
   * Función de login
   * Maneja el proceso de autenticación del usuario usando el nuevo servicio mockAuth
   */
  const login = async (credentials: LoginData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Llamar al servicio de autenticación
      const response = await mockLogin(credentials);

      // Crear sesión con los datos del usuario
      const session: AuthSession = {
        user: response.user,
        token: response.token,
        expiresAt: Date.now() + (response.expiresIn * 1000), // Convertir segundos a ms
        isAuthenticated: true,
      };

      // Guardar en localStorage (siempre en mock, en producción se usarían httpOnly cookies)
      if (typeof window !== 'undefined') {
        const expiresAt = Date.now() + (response.expiresIn * 1000);
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(expiresAt));
      }

      dispatch({ type: 'SET_SESSION', payload: session });
      
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Erro de autenticación' });
    }
  };

  /**
   * Función de registro
   * Crea una nueva cuenta usando el servicio mockAuth
   */
  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Llamar al servicio de registro
      const response = await mockRegister(data);

      // Crear sesión (auto-login después de registro)
      const session: AuthSession = {
        user: response.user,
        token: response.token,
        expiresAt: Date.now() + (response.expiresIn * 1000),
        isAuthenticated: true,
      };

      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        const expiresAt = Date.now() + (response.expiresIn * 1000);
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(expiresAt));
      }

      dispatch({ type: 'SET_SESSION', payload: session });
      
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Erro ao rexistrarse' });
    }
  };

  /**
   * Función de logout
   * Cierra la sesión usando el servicio mockAuth
   */
  const logout = (): void => {
    mockLogout(); // Usa el servicio que limpia localStorage
    dispatch({ type: 'LOGOUT' });
  };

  /**
   * Limpia errores del estado
   */
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  /**
   * Verifica si el usuario está autenticado
   * Si no hay sesión en memoria, intenta recuperarla del localStorage
   */
  const isAuthenticated = (): boolean => {
    // Si ya tenemos sesión en memoria, usarla
    if (state.session?.isAuthenticated) {
      if (state.session.expiresAt < Date.now()) {
        logout();
        return false;
      }
      return true;
    }

    // Si estamos en el cliente y no hay sesión, intentar recuperarla
    if (typeof window !== 'undefined' && !state.session) {
      // Usar el servicio para verificar sesión
      if (hasActiveSession()) {
        const user = getStoredUser();
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        
        if (user && token) {
          const storedExpiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
          const expiresAt = storedExpiresAt ? Number(storedExpiresAt) : Date.now() + (24 * 60 * 60 * 1000);
          if (expiresAt < Date.now()) {
            logout();
            return false;
          }
          const session: AuthSession = {
            user,
            token,
            expiresAt,
            isAuthenticated: true,
          };
          dispatch({ type: 'SET_SESSION', payload: session });
          return true;
        }
      }
    }

    return false;
  };

  /**
   * Obtiene el usuario actual
   * Primero intenta desde la sesión en memoria, luego desde localStorage
   */
  const getCurrentUser = (): User | null => {
    if (state.session?.user) {
      return state.session.user;
    }
    
    // Intentar desde localStorage
    return getStoredUser();
  };

  // Valor que se proporciona a través del contexto
  const contextValue: AuthContextType = {
    session: state.session,
    isLoading: state.isLoading,
    error: state.error,
    isInitialized: state.isInitialized,
    login,
    register,
    logout,
    clearError,
    isAuthenticated,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para usar el contexto de autenticación
 * 
 * ¿Por qué un hook personalizado?
 * - Evita usar useContext directamente en cada componente
 * - Proporciona validación de que el contexto existe
 * - Más fácil de usar y mantener
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
}
