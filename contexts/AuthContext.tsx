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
import { AuthContextType, AuthSession, LoginCredentials, RegisterData, User } from '@/types/auth';
import { mockLogin, mockRegister, validateMockToken, mockGetUserById } from '@/lib/auth-mock';

// Estado inicial del contexto
const initialState = {
  session: null,
  isLoading: false, // Empezamos sin cargar para evitar problemas de SSR
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
    // Inicialización simple - solo marcar como inicializado
    // La verificación de sesión se hace de forma lazy cuando se necesita
    dispatch({ type: 'INITIALIZED' });
  }, []);

  /**
   * Función de login
   * Maneja el proceso de autenticación del usuario
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await mockLogin(credentials);

      if (response.success && response.data) {
        const session: AuthSession = {
          user: response.data.user,
          token: response.data.token,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
          isAuthenticated: true,
        };

        // Guardar en localStorage si "Recordar sesión" está marcado
        if (credentials.rememberMe && typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        dispatch({ type: 'SET_SESSION', payload: session });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Erro de autenticación' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro de conexión' });
    }
  };

  /**
   * Función de registro
   * Maneja la creación de nuevas cuentas
   */
  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await mockRegister(data);

      if (response.success && response.data) {
        const session: AuthSession = {
          user: response.data.user,
          token: response.data.token,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
          isAuthenticated: true,
        };

        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        dispatch({ type: 'SET_SESSION', payload: session });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Erro ao rexistrarse' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro de conexión' });
    }
  };

  /**
   * Función de logout
   * Cierra la sesión del usuario y limpia los datos guardados
   */
  const logout = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
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
      return true;
    }

    // Si estamos en el cliente y no hay sesión, intentar recuperarla
    if (typeof window !== 'undefined' && !state.session) {
      const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (savedToken && savedUser) {
        const tokenValidation = validateMockToken(savedToken);
        if (tokenValidation.valid) {
          try {
            const user = JSON.parse(savedUser);
            const session: AuthSession = {
              user,
              token: savedToken,
              expiresAt: Date.now() + (24 * 60 * 60 * 1000),
              isAuthenticated: true,
            };
            dispatch({ type: 'SET_SESSION', payload: session });
            return true;
          } catch (error) {
            // Si hay error parseando, limpiar localStorage
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
          }
        } else {
          // Token inválido, limpiar
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
    }

    return false;
  };

  /**
   * Obtiene el usuario actual
   */
  const getCurrentUser = (): User | null => {
    return state.session?.user || null;
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
