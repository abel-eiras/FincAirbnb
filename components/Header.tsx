'use client';

import { Tractor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export function Header() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Enlazado al home */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-galician-blue rounded-xl p-2">
              <Tractor className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-galician-blue">FincAirbnb</h1>
              <p className="text-xs text-gray-500">Farming como un pro</p>
            </div>
          </Link>

          {/* Navegación central */}
          <nav className="hidden md:flex space-x-8">
            <a href="#beneficios" className="text-gray-700 hover:text-galician-blue transition-colors">
              Beneficios
            </a>
            <a href="#testemuños" className="text-gray-700 hover:text-galician-blue transition-colors">
              Testemuños
            </a>
          </nav>

          {/* Área de autenticación */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              // Mostrar spinner mientras carga el estado de autenticación
              <LoadingSpinner size="sm" color="primary" />
            ) : isAuthenticated() ? (
              // Mostrar menú de usuario si está autenticado
              <UserMenu />
            ) : (
              // Mostrar botones de login/registro si no está autenticado
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}