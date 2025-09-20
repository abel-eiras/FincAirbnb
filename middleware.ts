/**
 * Middleware de Next.js para Rutas Protegidas
 * 
 * Este middleware se ejecuta antes de que se cargue cualquier página
 * y verifica si el usuario está autenticado para acceder a rutas protegidas.
 * 
 * ¿Qué hace este middleware?
 * - Intercepta todas las peticiones a la aplicación
 * - Verifica si la ruta requiere autenticación
 * - Redirige a login si el usuario no está autenticado
 * - Permite el acceso si el usuario está logueado
 * 
 * ¿Por qué usar middleware?
 * - Protección a nivel de servidor (más seguro)
 * - Evita que se cargue contenido no autorizado
 * - Mejor experiencia de usuario (redirección inmediata)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
// Cualquier ruta que empiece por /dashboard necesita estar logueado
const protectedRoutes = ['/dashboard'];

// Rutas de autenticación (donde van los usuarios no autenticados)
const authRoutes = ['/login', '/register', '/forgot-password'];

// Función para verificar si un token es válido
// Esta es una versión simplificada para el middleware
function isValidToken(token: string): boolean {
  try {
    // Verificación básica del formato JWT
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decodificar el payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar expiración
    const now = Date.now();
    if (payload.exp && payload.exp < now) return false;

    return true;
  } catch {
    return false;
  }
}

// Función para verificar si una ruta está protegida
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

// Función para verificar si una ruta es de autenticación
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname === route);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener el token de las cookies o headers
  // En un proyecto real, esto vendría de cookies httpOnly
  const token = request.cookies.get('fincairbnb_token')?.value;

  // Verificar si la ruta está protegida
  if (isProtectedRoute(pathname)) {
    // Si no hay token o es inválido, redirigir a login
    if (!token || !isValidToken(token)) {
      const loginUrl = new URL('/login', request.url);
      // Añadir parámetro para saber de dónde venía el usuario
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si el usuario está autenticado y trata de acceder a rutas de auth,
  // redirigir al dashboard
  if (isAuthRoute(pathname) && token && isValidToken(token)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si todo está bien, continuar con la petición
  return NextResponse.next();
}

// Configuración del middleware
// Especifica en qué rutas debe ejecutarse
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
