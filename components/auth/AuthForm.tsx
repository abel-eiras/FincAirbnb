/**
 * Componente AuthForm Base
 * 
 * Un formulario reutilizable para autenticación que mantiene
 * la identidad visual gallega y proporciona validaciones consistentes.
 * 
 * ¿Por qué un formulario base?
 * - Consistencia en todos los formularios de auth
 * - Validaciones reutilizables
 * - Estilos unificados
 * - Fácil mantenimiento
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

// Esquema de validación base para formularios de auth
const authFormSchema = z.object({
  email: z
    .string()
    .min(1, 'O email é obrigatorio')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(8, 'A contrasinal debe ter polo menos 8 caracteres')
    .regex(/[A-Z]/, 'A contrasinal debe ter polo menos unha maiúscula')
    .regex(/[0-9]/, 'A contrasinal debe ter polo menos un número'),
});

// Tipos derivados del esquema
type AuthFormData = z.infer<typeof authFormSchema>;

// Props del componente
interface AuthFormProps {
  title: string;                    // Título del formulario
  subtitle?: string;                // Subtítulo opcional
  onSubmit: (data: AuthFormData) => Promise<void>; // Función de envío
  isLoading?: boolean;              // Estado de carga
  error?: string | null;            // Error a mostrar
  children?: React.ReactNode;       // Contenido adicional (enlaces, etc.)
  className?: string;               // Clases CSS adicionales
  showRememberMe?: boolean;         // Mostrar checkbox "Recordar sesión"
  onRememberMeChange?: (checked: boolean) => void; // Callback para remember me
}

export function AuthForm({
  title,
  subtitle,
  onSubmit,
  isLoading = false,
  error,
  children,
  className,
  showRememberMe = false,
  onRememberMeChange,
}: AuthFormProps) {
  // Configuración del formulario con React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authFormSchema),
    mode: 'onChange', // Validar mientras el usuario escribe
  });

  // Función que se ejecuta al enviar el formulario
  const handleFormSubmit = async (data: AuthFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Los errores se manejan en el componente padre
      console.error('Error en AuthForm:', err);
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Header del formulario */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-galician-blue mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

        {/* Checkbox Recordar Sesión */}
        {showRememberMe && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              onCheckedChange={onRememberMeChange}
              disabled={isLoading}
            />
            <Label 
              htmlFor="rememberMe" 
              className="text-sm text-gray-600 cursor-pointer"
            >
              Recordar sesión
            </Label>
          </div>
        )}

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
              Procesando...
            </>
          ) : (
            title
          )}
        </Button>

        {/* Contenido adicional (enlaces, etc.) */}
        {children && (
          <div className="mt-6 text-center">
            {children}
          </div>
        )}
      </form>
    </div>
  );
}

/**
 * Componente para mostrar enlaces de navegación en formularios
 * Útil para enlaces como "¿No tienes cuenta?" o "¿Olvidaste tu contraseña?"
 */
export function AuthFormLinks({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2 text-sm text-gray-600">
      {children}
    </div>
  );
}

/**
 * Componente para un enlace individual en formularios de auth
 */
export function AuthFormLink({ 
  href, 
  children, 
  className 
}: { 
  href: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'text-galician-blue hover:text-blue-700 font-medium',
        'transition-colors duration-200',
        className
      )}
    >
      {children}
    </a>
  );
}
