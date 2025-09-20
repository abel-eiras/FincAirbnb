/**
 * Página de Prueba de Autenticación
 * 
 * Esta página es solo para debugging y testing del sistema de autenticación.
 * Muestra el estado actual del AuthContext en tiempo real.
 */

'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestAuthPage() {
  const { 
    session, 
    isLoading, 
    error, 
    isInitialized,
    isAuthenticated, 
    getCurrentUser 
  } = useAuth();

  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-galician-blue mb-8">
          🔧 Test de Autenticación
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Estado del Contexto */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Estado del Contexto</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>isLoading:</span>
                <span className={`font-mono ${isLoading ? 'text-red-600' : 'text-green-600'}`}>
                  {isLoading.toString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>isInitialized:</span>
                <span className={`font-mono ${isInitialized ? 'text-green-600' : 'text-red-600'}`}>
                  {isInitialized.toString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>isAuthenticated:</span>
                <span className={`font-mono ${isAuthenticated() ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthenticated().toString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>error:</span>
                <span className={`font-mono ${error ? 'text-red-600' : 'text-gray-500'}`}>
                  {error || 'null'}
                </span>
              </div>
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Usuario Actual</h2>
            {user ? (
              <div className="space-y-2 text-sm">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Nombre:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Teléfono:</strong> {user.phone || 'No especificado'}</div>
                <div><strong>Fecha de registro:</strong> {user.joinDate}</div>
              </div>
            ) : (
              <p className="text-gray-500">No hay usuario autenticado</p>
            )}
          </div>

          {/* Sesión Completa */}
          <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Sesión Completa</h2>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          {/* Acciones de Prueba */}
          <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Acciones de Prueba</h2>
            <div className="space-x-4">
              <a 
                href="/login" 
                className="inline-block bg-galician-blue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ir a Login
              </a>
              <a 
                href="/register" 
                className="inline-block bg-galician-green text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Ir a Registro
              </a>
              <a 
                href="/dashboard" 
                className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Ir a Dashboard
              </a>
              <a 
                href="/" 
                className="inline-block bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Ir a Home
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
