/**
 * Página de Recuperación de Contraseña
 * 
 * Página para que los usuarios puedan solicitar un reset de contraseña.
 * En modo mock, simula el envío de un email de recuperación.
 * 
 * Características:
 * - Formulario simple con validación de email
 * - Simulación de envío de email
 * - Página de confirmación
 * - Enlaces de navegación
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner, AuthFormLinks, AuthFormLink } from '@/components/auth/AuthForm';
import { mockSendPasswordResetEmail } from '@/lib/auth-mock';
import { cn } from '@/lib/utils';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

// Esquema de validación para el email
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatorio')
    .email('Formato de email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isInitialized && isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Manejar el envío del formulario
  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mockSendPasswordResetEmail(data.email);

      if (response.success) {
        setEmail(data.email);
        setIsEmailSent(true);
      } else {
        setError(response.error?.message || 'Erro ao enviar o email');
      }
    } catch (err) {
      setError('Erro de conexión. Téntao de novo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Si está cargando Y no inicializado, mostrar spinner
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, no mostrar nada (se redirigirá)
  if (isAuthenticated()) {
    return null;
  }

  // Página de confirmación de email enviado
  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            {/* Icono de éxito */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-galician-blue mb-2">
              Email enviado
            </h1>
            <p className="text-gray-600 mb-8">
              Enviamos un email a <strong>{email}</strong> con as instrucións para recuperar a túa contrasinal.
            </p>

            {/* Información adicional */}
            <div className="bg-shell-beige p-4 rounded-xl mb-8">
              <h3 className="text-sm font-medium text-galician-green mb-2">
                💡 Modo de desenvolvemento
              </h3>
              <p className="text-xs text-gray-600">
                Como estamos en modo mock, o email non se enviou realmente. 
                En produción, recibirías un email con un enlace para cambiar a contrasinal.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="space-y-4">
              <Button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                className="w-full bg-galician-blue hover:bg-blue-700"
              >
                Enviar outro email
              </Button>
              
              <div className="flex items-center justify-center space-x-4 text-sm">
                <AuthFormLink href="/login">
                  <ArrowLeft className="h-4 w-4 mr-1 inline" />
                  Volver ao login
                </AuthFormLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-galician-blue mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-galician-blue mb-2">
            Recuperar contrasinal
          </h1>
          <p className="text-gray-600">
            Introduce o teu email e enviarémosche as instrucións para recuperar a túa contrasinal.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6">
          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="o.teu.email@exemplo.com"
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-xl',
                'focus:ring-2 focus:ring-galician-blue focus:border-transparent',
                'transition-all duration-200',
                errors.email && 'border-red-500 focus:ring-red-500'
              )}
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Error general */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-2">❌</span>
                {error}
              </p>
            </div>
          )}

          {/* Botón de envío */}
          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className={cn(
              'w-full py-3 px-6 bg-galician-blue hover:bg-blue-700',
              'text-white font-medium rounded-xl',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center'
            )}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                Enviando...
              </>
            ) : (
              'Enviar instrucións'
            )}
          </Button>

          {/* Enlaces */}
          <div className="mt-6 text-center">
            <AuthFormLinks>
              <div className="space-y-2">
                <AuthFormLink href="/login">
                  <ArrowLeft className="h-4 w-4 mr-1 inline" />
                  Volver ao login
                </AuthFormLink>
                <div className="text-gray-500">
                  ¿Non tes conta?{' '}
                  <AuthFormLink href="/register">
                    Rexístrate aquí
                  </AuthFormLink>
                </div>
              </div>
            </AuthFormLinks>
          </div>
        </form>
      </div>
    </div>
  );
}
