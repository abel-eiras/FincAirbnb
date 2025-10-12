/**
 * PropertyFilters Component - FincAirbnb
 * 
 * Componente que permite filtrar las propiedades del propietario
 * Incluye filtros por estado, tipo, ubicación y rango de precios
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Filter,
  Search,
  MapPin,
  Euro,
  Home
} from 'lucide-react';
import { translatePropertyType } from '@/lib/translations';
import type { Property } from '@/shared/types';

interface PropertyFiltersProps {
  properties: Property[];
  onFiltersChange: (filteredProperties: Property[]) => void;
}

interface FilterState {
  search: string;
  status: string;
  type: string;
  province: string;
  minPrice: string;
  maxPrice: string;
  hasBookings: boolean;
  hasPhotos: boolean;
}

/**
 * Componente de filtros para propiedades
 */
export function PropertyFilters({ properties, onFiltersChange }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    type: 'all',
    province: 'all',
    minPrice: '',
    maxPrice: '',
    hasBookings: false,
    hasPhotos: false,
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filtered = properties.filter(property => {
      // Filtro de búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!property.title.toLowerCase().includes(searchLower) &&
            !property.description.toLowerCase().includes(searchLower) &&
            !property.location.city.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtro de estado
      if (filters.status !== 'all' && property.status !== filters.status) {
        return false;
      }

      // Filtro de tipo
      if (filters.type !== 'all' && property.propertyType !== filters.type) {
        return false;
      }

      // Filtro de provincia
      if (filters.province !== 'all' && property.location.province !== filters.province) {
        return false;
      }

      // Filtro de precio mínimo
      if (filters.minPrice && property.pricing?.basePrice && property.pricing.basePrice < parseInt(filters.minPrice)) {
        return false;
      }

      // Filtro de precio máximo
      if (filters.maxPrice && property.pricing?.basePrice && property.pricing.basePrice > parseInt(filters.maxPrice)) {
        return false;
      }

      // Filtro de reservas
      if (filters.hasBookings) {
        // TODO: Implementar verificación de reservas cuando esté disponible
        return false;
      }

      // Filtro de fotos
      if (filters.hasPhotos && (!property.photos || property.photos.length === 0)) {
        return false;
      }

      return true;
    });

    onFiltersChange(filtered);

    // Actualizar filtros activos
    const active: string[] = [];
    if (filters.search) active.push(`Búsqueda: "${filters.search}"`);
    if (filters.status !== 'all') active.push(`Estado: ${getStatusText(filters.status)}`);
    if (filters.type !== 'all') active.push(`Tipo: ${translatePropertyType(filters.type)}`);
    if (filters.province !== 'all') active.push(`Provincia: ${filters.province}`);
    if (filters.minPrice) active.push(`Prezo min: ${filters.minPrice}€`);
    if (filters.maxPrice) active.push(`Prezo max: ${filters.maxPrice}€`);
    if (filters.hasBookings) active.push('Con reservas');
    if (filters.hasPhotos) active.push('Con fotos');
    
    setActiveFilters(active);
  }, [filters, properties, onFiltersChange]);

  // Obtener opciones únicas
  const uniqueTypes = Array.from(new Set(properties.map(p => p.propertyType)));
  const uniqueProvinces = Array.from(new Set(properties.map(p => p.location.province)));

  // Función para obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'inactive': return 'Inactiva';
      case 'draft': return 'Borrador';
      default: return status;
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      province: 'all',
      minPrice: '',
      maxPrice: '',
      hasBookings: false,
      hasPhotos: false,
    });
  };

  // Eliminar filtro específico
  const removeFilter = (filterText: string) => {
    if (filterText.includes('Búsqueda:')) {
      setFilters(prev => ({ ...prev, search: '' }));
    } else if (filterText.includes('Estado:')) {
      setFilters(prev => ({ ...prev, status: 'all' }));
    } else if (filterText.includes('Tipo:')) {
      setFilters(prev => ({ ...prev, type: 'all' }));
    } else if (filterText.includes('Provincia:')) {
      setFilters(prev => ({ ...prev, province: 'all' }));
    } else if (filterText.includes('Prezo min:')) {
      setFilters(prev => ({ ...prev, minPrice: '' }));
    } else if (filterText.includes('Prezo max:')) {
      setFilters(prev => ({ ...prev, maxPrice: '' }));
    } else if (filterText === 'Con reservas') {
      setFilters(prev => ({ ...prev, hasBookings: false }));
    } else if (filterText === 'Con fotos') {
      setFilters(prev => ({ ...prev, hasPhotos: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros activos */}
      {activeFilters.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{filter}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpar todo
          </Button>
        </div>
      )}

      {/* Filtros principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Label>
          <Input
            id="search"
            placeholder="Nome, descrición, cidade..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Estado
          </Label>
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activa</SelectItem>
              <SelectItem value="inactive">Inactiva</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <Label className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Tipo
          </Label>
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {translatePropertyType(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provincia */}
        <div className="space-y-2">
          <Label className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Provincia
          </Label>
          <Select value={filters.province} onValueChange={(value) => setFilters(prev => ({ ...prev, province: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as provincias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueProvinces.map(province => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtros adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Precio mínimo */}
        <div className="space-y-2">
          <Label htmlFor="minPrice" className="flex items-center">
            <Euro className="h-4 w-4 mr-2" />
            Prezo mínimo
          </Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
          />
        </div>

        {/* Precio máximo */}
        <div className="space-y-2">
          <Label htmlFor="maxPrice" className="flex items-center">
            <Euro className="h-4 w-4 mr-2" />
            Prezo máximo
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Filtros adicionais</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasBookings"
                checked={filters.hasBookings}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasBookings: !!checked }))}
              />
              <Label htmlFor="hasBookings" className="text-sm">
                Con reservas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPhotos"
                checked={filters.hasPhotos}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasPhotos: !!checked }))}
              />
              <Label htmlFor="hasPhotos" className="text-sm">
                Con fotos
              </Label>
            </div>
          </div>
        </div>

        {/* Botón de limpiar */}
        <div className="flex items-end">
          <Button variant="outline" onClick={clearFilters} className="w-full">
            Limpar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
