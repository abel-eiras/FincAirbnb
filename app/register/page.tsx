/**
 * Página de Registro
 * 
 * Página para que nuevos usuarios se registren en FincAirbnb.
 * Incluye validaciones completas y términos y condiciones.
 * 
 * Características:
 * - Formulario completo con validaciones
 * - Integración con AuthContext
 * - Redirección automática después del registro
 * - Manejo de errores
 * - Diseño responsive
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
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner, AuthFormLinks, AuthFormLink } from '@/components/auth/AuthForm';
import { RegisterData } from '@/types/auth';
import { cn } from '@/lib/utils';

// Esquema de validación para el registro
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome debe ter polo menos 2 caracteres')
    .max(50, 'O nome non pode ter máis de 50 caracteres'),
  email: z
    .string()
    .min(1, 'O email é obrigatorio')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(8, 'A contrasinal debe ter polo menos 8 caracteres')
    .regex(/[A-Z]/, 'A contrasinal debe ter polo menos unha maiúscula')
    .regex(/[0-9]/, 'A contrasinal debe ter polo menos un número'),
  confirmPassword: z.string(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: 'Formato de teléfono inválido'
    }),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar os termos e condicións'
    }),
  newsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As contrasinais non coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated, isLoading, isInitialized, error, clearError } = useAuth();
  const router = useRouter();

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Limpiar errores al desmontar
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Manejar el envío del formulario
  const handleRegister = async (data: RegisterFormData) => {
    try {
      const registerData: RegisterData = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone,
        acceptTerms: data.acceptTerms,
        newsletter: data.newsletter,
      };

      await registerUser(registerData);
      
      // La redirección se maneja en el useEffect
    } catch (err) {
      console.error('Error en registro:', err);
    }
  };

  // Si está cargando Y no inicializado, mostrar spinner
  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, redirigir
  if (isAuthenticated()) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-galician-blue mb-2">
            Rexístrate
          </h1>
          <p className="text-gray-600">
            Crea a túa conta en FincAirbnb
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="O teu nome completo"
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-xl',
                'focus:ring-2 focus:ring-galician-blue focus:border-transparent',
                'transition-all duration-200',
                errors.name && 'border-red-500 focus:ring-red-500'
              )}
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.name.message}
              </p>
            )}
          </div>

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

          {/* Campo Teléfono (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Teléfono <span className="text-gray-400">(opcional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+34 600 123 456"
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-xl',
                'focus:ring-2 focus:ring-galician-blue focus:border-transparent',
                'transition-all duration-200',
                errors.phone && 'border-red-500 focus:ring-red-500'
              )}
              {...register('phone')}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contrasinal
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="A túa contrasinal"
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-xl',
                'focus:ring-2 focus:ring-galician-blue focus:border-transparent',
                'transition-all duration-200',
                errors.password && 'border-red-500 focus:ring-red-500'
              )}
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmar contrasinal
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite a túa contrasinal"
              className={cn(
                'w-full px-4 py-3 border border-gray-300 rounded-xl',
                'focus:ring-2 focus:ring-galician-blue focus:border-transparent',
                'transition-all duration-200',
                errors.confirmPassword && 'border-red-500 focus:ring-red-500'
              )}
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Checkbox Términos y Condiciones */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              {...register('acceptTerms')}
              disabled={isLoading}
            />
            <Label 
              htmlFor="acceptTerms" 
              className="text-sm text-gray-600 cursor-pointer leading-relaxed"
            >
              Acepto os{' '}
              <a href="#" className="text-galician-blue hover:underline">
                termos e condicións
              </a>{' '}
              e a{' '}
              <a href="#" className="text-galician-blue hover:underline">
                política de privacidade
              </a>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.acceptTerms.message}
            </p>
          )}

          {/* Checkbox Newsletter */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              {...register('newsletter')}
              disabled={isLoading}
            />
            <Label 
              htmlFor="newsletter" 
              className="text-sm text-gray-600 cursor-pointer"
            >
              Quero recibir ofertas e novidades por email
            </Label>
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
                Creando conta...
              </>
            ) : (
              'Crear conta'
            )}
          </Button>

          {/* Enlaces */}
          <div className="mt-6 text-center">
            <AuthFormLinks>
              <div className="text-gray-500">
                ¿Xa tes conta?{' '}
                <AuthFormLink href="/login">
                  Entra aquí
                </AuthFormLink>
              </div>
            </AuthFormLinks>
          </div>
        </form>
      </div>
    </div>
  );
}
