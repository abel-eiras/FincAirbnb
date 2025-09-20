/**
 * Componente LoadingSpinner
 * 
 * Un spinner de carga reutilizable que mantiene la identidad visual gallega.
 * Se usa en formularios, botones y páginas que cargan datos.
 * 
 * ¿Por qué un componente separado?
 * - Reutilizable en toda la aplicación
 * - Consistencia visual
 * - Fácil de personalizar
 * - Accesible (screen readers)
 */

import React from 'react';
import { cn } from '@/lib/utils';

// Props del componente
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';        // Tamaño del spinner
  color?: 'primary' | 'white' | 'galician'; // Color del spinner
  className?: string;                // Clases CSS adicionales
  text?: string;                    // Texto opcional debajo del spinner
}

// Tamaños predefinidos para el spinner
const sizeClasses = {
  sm: 'h-4 w-4',      // Pequeño (para botones)
  md: 'h-8 w-8',      // Mediano (para formularios)
  lg: 'h-12 w-12',    // Grande (para páginas completas)
};

// Colores predefinidos
const colorClasses = {
  primary: 'text-galician-blue',     // Azul gallego (por defecto)
  white: 'text-white',               // Blanco (para fondos oscuros)
  galician: 'text-galician-green',   // Verde gallego
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className,
  text 
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {/* Spinner animado */}
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-200',
          sizeClasses[size],
          colorClasses[color],
          'border-t-current' // El borde superior toma el color del texto
        )}
        role="status"
        aria-label="Cargando"
      >
        {/* Contenido oculto para screen readers */}
        <span className="sr-only">Cargando...</span>
      </div>
      
      {/* Texto opcional */}
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Variante para botones
 * Un spinner más pequeño que se puede usar dentro de botones
 */
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <LoadingSpinner 
      size="sm" 
      color="white" 
      className={cn('mr-2', className)} 
    />
  );
}

/**
 * Variante para páginas completas
 * Un spinner grande con texto para páginas que cargan
 */
export function PageSpinner({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner 
        size="lg" 
        color="primary" 
        text={text}
      />
    </div>
  );
}

/**
 * Variante inline
 * Para usar dentro de texto o elementos pequeños
 */
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <LoadingSpinner 
      size="sm" 
      color="primary" 
      className={cn('inline-block', className)} 
    />
  );
}
