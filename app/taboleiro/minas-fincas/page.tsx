/**
 * Página de Listado de Propiedades - FincAirbnb
 * 
 * Página principal para que los propietarios gestionen sus propiedades
 * Incluye listado, filtros y acciones rápidas
 * 
 * Ruta: /taboleiro/minas-fincas
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Grid, 
  List, 
  Filter, 
  Search,
  Home,
  MapPin,
  Euro,
  Calendar,
  Users,
  Star,
  Eye,
  Edit,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import { PropertyList } from '@/components/properties/PropertyList';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { getPropertiesByOwner } from '@/services/mockProperties';
import type { Property } from '@/shared/types';

export default function MinasFincasPage() {
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  
  // Estados para las propiedades
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Cargar propiedades del propietario
  useEffect(() => {
    const loadProperties = async () => {
      if (!user || user.role !== 'owner') return;
      
      setIsLoading(true);
      try {
        const ownerProperties = await getPropertiesByOwner(user.id);
        setProperties(ownerProperties);
        setFilteredProperties(ownerProperties);
      } catch (error) {
        console.error('Error cargando propiedades:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [user]);

  // Manejar filtros
  const handleFiltersChange = (filtered: Property[]) => {
    setFilteredProperties(filtered);
  };

  // Estadísticas rápidas
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    inactive: properties.filter(p => p.status === 'inactive').length,
    totalRevenue: properties.reduce((sum, p) => sum + (p.stats?.totalRevenue || 0), 0),
    totalBookings: properties.reduce((sum, p) => sum + (p.stats?.totalBookings || 0), 0),
  };

  if (!user || user.role !== 'owner') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Acceso Restrinxido
              </h2>
              <p className="text-gray-600">
                Esta páxina só está dispoñible para propietarios.
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-galician-blue">
                  As Miñas Fincas
                </h1>
                <p className="text-gray-600 mt-1">
                  Xestiona as túas propiedades e a súa dispoñibilidade
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  className="bg-galician-blue hover:bg-blue-700"
                  onClick={() => {
                    // TODO: Navegar a crear propiedad
                    console.log('Crear nova propiedade');
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Finca
                </Button>
                
                {/* Botón de retroceso */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/taboleiro')}
                  className="flex items-center text-gray-600 hover:text-galician-blue"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Propiedades</p>
                    <p className="text-2xl font-bold text-galician-blue">{stats.total}</p>
                  </div>
                  <Home className="h-8 w-8 text-galician-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Activas</p>
                    <p className="text-2xl font-bold text-galician-green">{stats.active}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-galician-green" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingresos Totais</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString('es-ES')}€</p>
                  </div>
                  <Euro className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reservas Totais</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalBookings}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controles de Vista y Filtros */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Botones de vista */}
              <div className="flex items-center bg-white rounded-lg border p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Botón de filtros */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {showFilters && <Badge className="ml-2">Activo</Badge>}
              </Button>
            </div>

            {/* Resultados */}
            <div className="text-sm text-gray-600">
              Mostrando {filteredProperties.length} de {properties.length} propiedades
            </div>
          </div>

          {/* Panel de Filtros */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtros de Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyFilters
                  properties={properties}
                  onFiltersChange={handleFiltersChange}
                />
              </CardContent>
            </Card>
          )}

          {/* Listado de Propiedades */}
          <PropertyList
            properties={filteredProperties}
            isLoading={isLoading}
            viewMode={viewMode}
            onEdit={(propertyId) => {
              console.log('Editar propiedade:', propertyId);
            }}
            onView={(propertyId) => {
              console.log('Ver propiedade:', propertyId);
            }}
            onCalendar={(propertyId) => {
              console.log('Calendario de propiedade:', propertyId);
            }}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
