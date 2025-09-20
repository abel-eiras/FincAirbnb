/**
 * Componente AuthButtons
 * 
 * Botones de autenticación que se muestran cuando el usuario NO está logueado.
 * Incluye botones para login y registro.
 * 
 * ¿Por qué un componente separado?
 * - Reutilizable en diferentes partes de la app
 * - Lógica de navegación centralizada
 * - Fácil de mantener y actualizar
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export function AuthButtons() {
  return (
    <div className="flex items-center space-x-3">
      {/* Botón de Login */}
      <Link href="/login">
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-4 py-2 text-galician-blue hover:bg-galician-blue hover:text-white transition-colors rounded-xl"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Entrar</span>
        </Button>
      </Link>

      {/* Botón de Registro */}
      <Link href="/register">
        <Button
          className="flex items-center space-x-2 px-4 py-2 bg-galician-blue hover:bg-blue-700 text-white transition-colors rounded-xl"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Rexistrarse</span>
        </Button>
      </Link>
    </div>
  );
}

/**
 * Variante compacta para móviles
 * Muestra solo iconos en pantallas pequeñas
 */
export function AuthButtonsCompact() {
  return (
    <div className="flex items-center space-x-2">
      {/* Botón de Login compacto */}
      <Link href="/login">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-galician-blue hover:bg-galician-blue hover:text-white transition-colors rounded-lg"
          title="Entrar"
        >
          <LogIn className="h-4 w-4" />
        </Button>
      </Link>

      {/* Botón de Registro compacto */}
      <Link href="/register">
        <Button
          size="sm"
          className="p-2 bg-galician-blue hover:bg-blue-700 text-white transition-colors rounded-lg"
          title="Rexistrarse"
        >
          <UserPlus className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
