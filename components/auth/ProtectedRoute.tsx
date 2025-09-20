/**
 * Componente ProtectedRoute
 * 
 * Este componente protege rutas que requieren autenticación.
 * Si el usuario no está logueado, lo redirige al login.
 * Si está logueado, muestra el contenido protegido.
 * 
 * ¿Por qué este componente?
 * - Protección a nivel de componente
 * - Mejor UX (no flash de contenido no autorizado)
 * - Fácil de usar: solo envuelve el contenido
 * - Manejo de estados de carga
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageSpinner } from '@/components/ui/LoadingSpinner';

// Props del componente
interface ProtectedRouteProps {
  children: React.ReactNode;        // Contenido a proteger
  fallback?: React.ReactNode;       // Componente alternativo si no está autenticado
  redirectTo?: string;              // Ruta de redirección (por defecto /login)
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  // Efecto para manejar la redirección
  useEffect(() => {
    // Solo redirigir si no está cargando y no está autenticado
    if (!isLoading && !isAuthenticated()) {
      // Añadir la ruta actual como parámetro de redirección
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Mostrar spinner solo si está cargando Y no se ha inicializado
  if (isLoading && !isInitialized) {
    return <PageSpinner text="Verificando autenticación..." />;
  }

  // Si no está autenticado, mostrar fallback o nada (se redirigirá)
  if (!isAuthenticated()) {
    return fallback || null;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
}

/**
 * Hook para verificar autenticación en componentes
 * Útil cuando necesitas lógica condicional basada en autenticación
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  const requireAuth = (redirectTo: string = '/login') => {
    if (!isLoading && !isAuthenticated()) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
      return false;
    }
    return isAuthenticated();
  };

  return { requireAuth, isAuthenticated: isAuthenticated(), isLoading };
}

/**
 * Componente para mostrar contenido solo a usuarios autenticados
 * Más ligero que ProtectedRoute, no redirige automáticamente
 */
export function AuthOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  if (isLoading && !isInitialized) {
    return <PageSpinner text="Cargando..." />;
  }

  return isAuthenticated() ? <>{children}</> : <>{fallback}</>;
}

/**
 * Componente para mostrar contenido solo a usuarios NO autenticados
 * Útil para mostrar botones de login/registro solo cuando no está logueado
 */
export function GuestOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  if (isLoading && !isInitialized) {
    return <PageSpinner text="Cargando..." />;
  }

  return !isAuthenticated() ? <>{children}</> : <>{fallback}</>;
}
