/**
 * Mock Authentication Service - FincAirbnb
 * 
 * Servicio que simula autenticación de usuarios
 * En producción, esto se reemplazará con llamadas a la API real
 */

import type { User, RegisterData, LoginData, AuthResponse } from '@/shared/types';
import { delay, loadMockData, generateId } from './utils';

/**
 * Realiza login de un usuario
 * Verifica credenciales contra los datos mock en users.json
 * 
 * @param credentials - Email y contraseña
 * @returns Promise con respuesta de autenticación (user + token)
 * 
 * @example
 * const response = await login({ email: 'xose@correo.gal', password: 'Contrasinal123' })
 * if (response.user) {
 *   // Login exitoso
 * }
 */
export async function login(credentials: LoginData): Promise<AuthResponse> {
  // Simular delay de red
  await delay(800);
  
  try {
    // Cargar usuarios de los datos mock
    const users = await loadMockData<User>('users');
    
    // Buscar usuario por email
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Email ou contrasinal incorrectos');
    }
    
    // Verificar contraseña (en mock, comparación simple)
    // En producción, esto compararía hash de contraseña
    if (user.password !== credentials.password) {
      throw new Error('Email ou contrasinal incorrectos');
    }
    
    // Generar token mock
    const token = generateMockToken(user.id);
    
    // Devolver usuario SIN contraseña
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      expiresIn: 86400, // 24 horas en segundos
    };
    
  } catch (error) {
    throw error;
  }
}

/**
 * Registra un nuevo usuario en la plataforma (MOCK)
 * 
 * @param data - Datos del nuevo usuario
 * @returns Promise con respuesta de autenticación
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  await delay(1000);
  
  try {
    // Cargar usuarios existentes
    const users = await loadMockData<User>('users');
    
    // Verificar que el email no exista
    const exists = users.some(u => u.email === data.email);
    if (exists) {
      throw new Error('Xa existe unha conta con este email');
    }
    
    // Crear nuevo usuario
    const newUser: User = {
      id: generateId('user'),
      email: data.email,
      password: data.password, // En producción, esto estaría hasheado
      name: data.name,
      role: data.role || 'guest',
      phone: data.phone,
      verified: false,
      stats: {
        totalBookings: 0,
        rating: 0,
      },
      joinedAt: new Date().toISOString(),
    };
    
    // Guardar en mock (localStorage)
    users.push(newUser);
    saveToLocalStorage('users', users);
    
    // Auto-login: devolver token
    const token = generateMockToken(newUser.id);
    const { password, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token,
      expiresIn: 86400,
    };
    
  } catch (error) {
    throw error;
  }
}

// Claves de localStorage (consistentes con AuthContext)
const STORAGE_KEYS = {
  TOKEN: 'fincairbnb_token',
  USER: 'fincairbnb_user',
} as const;

/**
 * Cierra la sesión del usuario
 * Elimina el token del almacenamiento local
 */
export function logout(): void {
  // Limpiar localStorage
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  
  console.log('✅ Sesión pechada correctamente');
}

/**
 * Obtiene el usuario actual desde localStorage
 * 
 * @returns Usuario actual o null si no está autenticado
 */
export function getCurrentUser(): User | null {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error al cargar usuario:', error);
    return null;
  }
}

/**
 * Verifica si hay una sesión activa válida
 * 
 * @returns boolean indicando si hay sesión activa
 */
export function hasActiveSession(): boolean {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  
  if (!token || !userData) {
    return false;
  }
  
  // Validar token
  const validation = validateMockToken(token);
  return validation.valid;
}

/**
 * Actualiza el perfil del usuario (MOCK)
 * 
 * @param userId - ID del usuario
 * @param data - Datos a actualizar
 * @returns Promise con el usuario actualizado
 */
export async function updateProfile(
  userId: string,
  data: Partial<User>
): Promise<User> {
  await delay();
  
  const users = await loadMockData<User>('users');
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    throw new Error('Usuario non atopado');
  }
  
  // Actualizar usuario
  const updated = {
    ...users[index],
    ...data,
  };
  
  users[index] = updated;
  saveToLocalStorage('users', users);
  
  // Actualizar también en localStorage de sesión
  const { password, ...userWithoutPassword } = updated;
  localStorage.setItem('user-data', JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
}

/**
 * Simula envío de email para recuperación de contraseña (MOCK)
 * 
 * @param email - Email del usuario
 * @returns Promise indicando éxito
 */
export async function resetPassword(email: string): Promise<{ success: boolean }> {
  await delay(1200);
  
  const users = await loadMockData<User>('users');
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Non se atopou ningún usuario con este email');
  }
  
  // En mock, solo loggeamos (en producción enviaría email real)
  console.log(`📧 Email de recuperación enviado a: ${email}`);
  
  return { success: true };
}

// ============================================================================
// FUNCIONES HELPER PRIVADAS
// ============================================================================

/**
 * Genera un token JWT mock (simulado, NO seguro)
 * En producción, el backend generaría un JWT real con firma criptográfica
 * 
 * @param userId - ID del usuario
 * @returns Token JWT mock
 */
function generateMockToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 horas
  }));
  const signature = btoa('mock-signature-not-secure');
  
  return `${header}.${payload}.${signature}`;
}

/**
 * Valida un token JWT mock
 * Verifica que no haya expirado
 * 
 * @param token - Token a validar
 * @returns Objeto con validez y userId si es válido
 */
function validateMockToken(token: string): { valid: boolean; userId?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Verificar expiración
    if (payload.exp < now) {
      return { valid: false };
    }
    
    return { valid: true, userId: payload.sub };
  } catch (error) {
    return { valid: false };
  }
}

/**
 * Guarda datos en localStorage
 * Helper para persistir datos mock
 */
function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(`fincairbnb_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

