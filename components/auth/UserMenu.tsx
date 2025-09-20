/**
 * Componente UserMenu
 * 
 * Menú desplegable para usuarios autenticados que incluye:
 * - Avatar del usuario
 * - Opciones de perfil
 * - Botón de logout
 * 
 * ¿Por qué un componente separado?
 * - Reutilizable en diferentes partes de la app
 * - Lógica de menú centralizada
 * - Fácil de mantener y actualizar
 */

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Tractor 
} from 'lucide-react';
import Link from 'next/link';

export function UserMenu() {
  const { getCurrentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const user = getCurrentUser();

  // Si no hay usuario, no mostrar nada
  if (!user) {
    return null;
  }

  // Obtener iniciales del nombre para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Manejar logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {/* Avatar del usuario */}
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.avatar} 
              alt={`Avatar de ${user.name}`}
            />
            <AvatarFallback className="bg-galician-blue text-white text-sm">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          {/* Nombre del usuario (solo en desktop) */}
          <span className="hidden md:block text-sm font-medium text-gray-700">
            {user.name}
          </span>
          
          {/* Icono de flecha */}
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56 mt-2"
        sideOffset={5}
      >
        {/* Header con información del usuario */}
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={user.avatar} 
                alt={`Avatar de ${user.name}`}
              />
              <AvatarFallback className="bg-galician-blue text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Enlace al dashboard */}
        <DropdownMenuItem asChild>
          <Link 
            href="/dashboard" 
            className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Tractor className="h-4 w-4 mr-3 text-galician-blue" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        {/* Enlace al perfil */}
        <DropdownMenuItem asChild>
          <Link 
            href="/dashboard/profile" 
            className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4 mr-3 text-gray-500" />
            <span>O meu perfil</span>
          </Link>
        </DropdownMenuItem>

        {/* Enlace a configuración */}
        <DropdownMenuItem asChild>
          <Link 
            href="/dashboard/settings" 
            className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4 mr-3 text-gray-500" />
            <span>Configuración</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Botón de logout */}
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Pechar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
