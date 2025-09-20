/**
 * Página de Login
 * 
 * Página para que los usuarios inicien sesión en FincAirbnb.
 * Utiliza el componente AuthForm base y se integra con el sistema de autenticación.
 * 
 * Características:
 * - Formulario con validaciones
 * - Integración con AuthContext
 * - Redirección automática después del login
 * - Manejo de errores
 * - Diseño responsive
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm, AuthFormLinks, AuthFormLink } from '@/components/auth/AuthForm';
import { LoginCredentials } from '@/types/auth';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, isInitialized, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rememberMe, setRememberMe] = useState(false);

  // Obtener la URL de redirección desde los parámetros de búsqueda
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated()) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Limpiar errores al desmontar el componente
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Manejar el envío del formulario
  const handleLogin = async (data: LoginCredentials) => {
    try {
      await login({
        ...data,
        rememberMe,
      });
      
      // La redirección se maneja en el useEffect
    } catch (err) {
      // Los errores se manejan en el AuthContext
      console.error('Error en login:', err);
    }
  };

  // Si está cargando Y no inicializado, mostrar spinner
  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, redirigir
  if (isAuthenticated()) {
    router.push(redirectTo);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Formulario de login */}
        <AuthForm
          title="Entrar"
          subtitle="Accede á túa conta de FincAirbnb"
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
          showRememberMe={true}
          onRememberMeChange={setRememberMe}
        >
          <AuthFormLinks>
            <div className="space-y-2">
              <AuthFormLink href="/forgot-password">
                ¿Esqueceches a contrasinal?
              </AuthFormLink>
              <div className="text-gray-500">
                ¿Non tes conta?{' '}
                <AuthFormLink href="/register">
                  Rexístrate aquí
                </AuthFormLink>
              </div>
            </div>
          </AuthFormLinks>
        </AuthForm>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <div className="bg-shell-beige p-4 rounded-xl">
            <h3 className="text-sm font-medium text-galician-green mb-2">
              💡 Conta de proba
            </h3>
            <p className="text-xs text-gray-600">
              Email: <code className="bg-white px-1 rounded">xose@example.com</code>
              <br />
              Contrasinal: <code className="bg-white px-1 rounded">Password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
