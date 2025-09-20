/**
 * Sistema de Autenticación Mock
 * 
 * Este archivo simula un backend de autenticación usando datos locales.
 * En un proyecto real, estas funciones harían llamadas a una API.
 * 
 * ¿Por qué usar un sistema mock?
 * - Desarrollo rápido sin backend
 * - Testing independiente del frontend
 * - Demostración de funcionalidad
 * - Prototipado de UX
 */

import { User, LoginCredentials, RegisterData, AuthResponse, AUTH_ERROR_CODES } from '@/types/auth';

// Datos mock de usuarios (simula una base de datos)
// En un proyecto real, estos datos estarían en una base de datos
const mockUsers: User[] = [
  {
    id: "1",
    name: "Xosé Manuel",
    email: "xose@example.com",
    phone: "+34 600 123 456",
    avatar: "/avatars/xose.jpg",
    joinDate: "2024-01-15T10:30:00Z",
    preferences: {
      newsletter: true,
      notifications: true,
    },
  },
  {
    id: "2",
    name: "María do Campo",
    email: "maria@example.com",
    phone: "+34 600 789 012",
    avatar: "/avatars/maria.jpg",
    joinDate: "2024-02-20T14:15:00Z",
    preferences: {
      newsletter: false,
      notifications: true,
    },
  },
];

// Simula una base de datos de contraseñas (en la realidad estarían hasheadas)
// Las contraseñas deben cumplir las validaciones: min 8 chars, mayúscula, número
const mockPasswords: Record<string, string> = {
  "xose@example.com": "Password123",
  "maria@example.com": "Password123",
};

/**
 * Simula un delay de red (como si fuera una llamada a API)
 * Esto hace que la experiencia sea más realista
 */
const simulateNetworkDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Genera un token JWT mock
 * En la realidad, esto lo haría el backend con una clave secreta
 */
const generateMockToken = (userId: string): string => {
  // Simulamos un JWT con datos básicos
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  }));
  const signature = btoa("mock-signature");
  
  return `${header}.${payload}.${signature}`;
};

/**
 * Valida un token JWT mock
 * En la realidad, esto verificaría la firma del token
 */
export const validateMockToken = (token: string): { valid: boolean; userId?: string } => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }

    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now();
    
    // Verificar si el token ha expirado
    if (payload.exp && payload.exp < now) {
      return { valid: false };
    }

    return { valid: true, userId: payload.userId };
  } catch (error) {
    return { valid: false };
  }
};

/**
 * Función de login mock
 * Simula el proceso de autenticación de un usuario
 */
export const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simular delay de red
  await simulateNetworkDelay(800);

  try {
    // Buscar usuario por email
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.USER_NOT_FOUND,
          message: "Non se atopou ningún usuario con este email",
          field: "email"
        }
      };
    }

    // Verificar contraseña
    const storedPassword = mockPasswords[credentials.email];
    if (!storedPassword || storedPassword !== credentials.password) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
          message: "Email ou contrasinal incorrectos",
          field: "password"
        }
      };
    }

    // Generar token
    const token = generateMockToken(user.id);

    return {
      success: true,
      data: {
        user,
        token
      }
    };

  } catch (error) {
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: "Erro de conexión. Téntao de novo."
      }
    };
  }
};

/**
 * Función de registro mock
 * Simula el proceso de crear una nueva cuenta
 */
export const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  // Simular delay de red
  await simulateNetworkDelay(1200);

  try {
    // Verificar si el email ya existe
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS,
          message: "Xa existe unha conta con este email",
          field: "email"
        }
      };
    }

    // Validar contraseña (básico)
    if (data.password.length < 8) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.WEAK_PASSWORD,
          message: "A contrasinal debe ter polo menos 8 caracteres",
          field: "password"
        }
      };
    }

    // Verificar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: {
          code: AUTH_ERROR_CODES.WEAK_PASSWORD,
          message: "As contrasinais non coinciden",
          field: "confirmPassword"
        }
      };
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: undefined, // Sin avatar por defecto
      joinDate: new Date().toISOString(),
      preferences: {
        newsletter: data.newsletter || false,
        notifications: true,
      },
    };

    // Añadir a la "base de datos" mock
    mockUsers.push(newUser);
    mockPasswords[data.email] = data.password;

    // Generar token
    const token = generateMockToken(newUser.id);

    return {
      success: true,
      data: {
        user: newUser,
        token
      }
    };

  } catch (error) {
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.NETWORK_ERROR,
        message: "Erro ao crear a conta. Téntao de novo."
      }
    };
  }
};

/**
 * Obtiene un usuario por ID (para verificar tokens)
 */
export const mockGetUserById = async (userId: string): Promise<User | null> => {
  await simulateNetworkDelay(300);
  return mockUsers.find(u => u.id === userId) || null;
};

/**
 * Obtiene un usuario por email
 */
export const mockGetUserByEmail = async (email: string): Promise<User | null> => {
  await simulateNetworkDelay(300);
  return mockUsers.find(u => u.email === email) || null;
};

/**
 * Simula el envío de email de recuperación de contraseña
 */
export const mockSendPasswordResetEmail = async (email: string): Promise<AuthResponse> => {
  await simulateNetworkDelay(1500);

  const user = await mockGetUserByEmail(email);
  
  if (!user) {
    return {
      success: false,
      error: {
        code: AUTH_ERROR_CODES.USER_NOT_FOUND,
        message: "Non se atopou ningún usuario con este email",
        field: "email"
      }
    };
  }

  // En la realidad, aquí se enviaría un email
  console.log(`📧 Email de recuperación enviado a: ${email}`);
  
  return {
    success: true,
    data: {
      user,
      token: generateMockToken(user.id) // Token temporal para reset
    }
  };
};
