'use client';

import { Menu, Tractor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { AuthButtons, AuthButtonsCompact } from '@/components/auth/AuthButtons';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ClientOnly } from '@/components/ui/ClientOnly';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
              <h1 className="text-lg sm:text-xl font-bold text-galician-blue">FincAirbnb</h1>
              <p className="hidden sm:block text-xs text-gray-500">Farming como un pro</p>
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

          {/* Área de autenticación - Solo en cliente */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Abrir menú de navegación"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm">
                <SheetHeader>
                  <SheetTitle>Navegación</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link href="/#beneficios" className="text-base font-medium text-gray-800 hover:text-galician-blue">
                      Beneficios
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/#testemuños" className="text-base font-medium text-gray-800 hover:text-galician-blue">
                      Testemuños
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/fincas" className="text-base font-medium text-gray-800 hover:text-galician-blue">
                      Ver fincas
                    </Link>
                  </SheetClose>
                  <div className="pt-4 border-t">
                    <SheetClose asChild>
                      <Link href="/acceder" className="block text-base font-medium text-gray-800 hover:text-galician-blue">
                        Entrar
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/rexistro" className="mt-3 block text-base font-medium text-gray-800 hover:text-galician-blue">
                        Rexistrarse
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <ClientOnly fallback={<div className="w-20 h-8" />}>
              {isLoading ? (
                // Mostrar spinner mientras carga el estado de autenticación
                <LoadingSpinner size="sm" color="primary" />
              ) : isAuthenticated() ? (
                // Mostrar menú de usuario si está autenticado
                <>
                  <NotificationBell />
                  <UserMenu />
                </>
              ) : (
                // Mostrar botones de login/registro si no está autenticado
                <>
                  <div className="hidden sm:block">
                    <AuthButtons />
                  </div>
                  <div className="sm:hidden">
                    <AuthButtonsCompact />
                  </div>
                </>
              )}
            </ClientOnly>
          </div>
        </div>
      </div>
    </header>
  );
}