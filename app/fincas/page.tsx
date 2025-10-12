/**
 * Catálogo Público de Fincas
 * 
 * Página pública para buscar e explorar fincas dispoñibles para alugar
 * Mantén a estética da landing page con copy gallego e retranca
 * 
 * Ruta: /fincas
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FincasFilters } from '@/components/fincas/FincasFilters';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin,
  ArrowRight,
  Star,
  Heart
} from 'lucide-react';
import { getProperties } from '@/services/mockProperties';
import type { Property } from '@/shared/types';

export default function FincasPage() {
  const router = useRouter();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState<any>(null);

  // Cargar fincas
  useEffect(() => {
    const loadFincas = async () => {
      try {
        setIsLoading(true);
        const result = await getProperties();
        setAllProperties(result.properties);
        setFilteredProperties(result.properties);
      } catch (error) {
        console.error('Error cargando fincas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFincas();
  }, []);

  // Aplicar búsqueda y filtros
  useEffect(() => {
    let results = [...allProperties];

    // Búsqueda por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.location?.city.toLowerCase().includes(query) ||
        p.location?.province.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    // Aplicar filtros
    if (filters) {
      // Filtro por provincia
      if (filters.provincia) {
        results = results.filter(p => p.location?.province === filters.provincia);
      }

      // Filtro por municipio
      if (filters.municipio) {
        const municipio = filters.municipio.toLowerCase();
        results = results.filter(p => 
          p.location?.city.toLowerCase().includes(municipio)
        );
      }

      // Filtro por precio
      results = results.filter(p => {
        const price = p.pricing?.basePrice || 0;
        return price >= filters.precioMin && price <= filters.precioMax;
      });

      // Filtro por tamaño
      if (filters.tamanhoMin > 0) {
        results = results.filter(p => 
          (p.size?.land || 0) >= filters.tamanhoMin
        );
      }
    }

    // Ordenar resultados
    results = sortProperties(results, sortBy);

    setFilteredProperties(results);
  }, [searchQuery, filters, sortBy, allProperties]);

  // Función de ordenación
  const sortProperties = (properties: Property[], sortBy: string) => {
    const sorted = [...properties];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.pricing?.basePrice || 0) - (b.pricing?.basePrice || 0));
      case 'price-desc':
        return sorted.sort((a, b) => (b.pricing?.basePrice || 0) - (a.pricing?.basePrice || 0));
      case 'size-desc':
        return sorted.sort((a, b) => (b.size?.land || 0) - (a.size?.land || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // La búsqueda se aplica automáticamente por el useEffect
    console.log('Buscando:', searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilters(null);
    setSortBy('relevance');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      {/* Hero Section - Coherente con landing */}
      <section className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-20 bg-galician-green rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-20 w-40 h-24 bg-galician-blue rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center bg-shell-beige text-galician-green px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4 mr-2" />
              {isLoading ? 'Cargando...' : `${filteredProperties.length} fincas esperando por ti`}
            </div>

            {/* Título */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Atopa a túa{' '}
              <span className="text-galician-blue">finca perfecta</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de hectáreas esperando. Filtra por localización, prezo ou tamaño. 
              <br className="hidden md:block" />
              <span className="text-galician-green font-medium">
                ¡As patacas non se van plantar soas!
              </span>
            </p>

            {/* Barra de búsqueda - Estilo landing */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-4 rounded-2xl shadow-lg border">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex items-center space-x-3 px-4">
                    <Search className="h-5 w-5 text-galician-blue" />
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Busca por localización, tipo de cultivo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="border-galician-green text-galician-green hover:bg-galician-green hover:text-white rounded-xl"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                    
                    <Button 
                      className="bg-galician-blue hover:bg-blue-700 rounded-xl px-8"
                      onClick={handleSearch}
                    >
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats rápidos */}
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-galician-blue">
              {isLoading ? '...' : filteredProperties.length}
            </div>
            <div className="text-sm text-gray-600">Fincas dispoñibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-galician-green">Desde 120€</div>
            <div className="text-sm text-gray-600">Por mes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">Todas</div>
            <div className="text-sm text-gray-600">En Galicia</div>
          </div>
        </div>

        {/* Encabezado de resultados */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Fincas dispoñibles agora
            </h2>
            <p className="text-sm text-gray-600">
              Ordenadas por relevancia
            </p>
          </div>

          {/* Ordenación */}
          <select 
            className="border-0 bg-shell-beige text-galician-green rounded-lg px-4 py-2 text-sm font-medium"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Máis relevantes</option>
            <option value="price-asc">Prezo: € → €€€</option>
            <option value="price-desc">Prezo: €€€ → €</option>
            <option value="size-desc">Tamaño: Maior primeiro</option>
            <option value="rating">Mellor valoradas</option>
          </select>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-bounce">🌾</div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Buscando as mellores fincas...</p>
            <p className="text-sm text-gray-500 mt-2">
              Non te preocupes, isto vai máis rápido que plantar un tomate 🍅
            </p>
          </div>
        )}

        {/* Grid de fincas - Estilo coherente */}
        {!isLoading && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card 
                key={property.id} 
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-galician-blue overflow-hidden"
                onClick={() => router.push(`/fincas/${property.id}`)}
              >
                <CardContent className="p-0">
                  {/* Imagen - Estilo landing con gradiente */}
                  <div className="relative h-48 bg-gradient-to-br from-galician-green to-green-600 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center space-y-2">
                        <div className="text-5xl">🌱</div>
                        <div className="text-xs opacity-75">Foto proximamente</div>
                      </div>
                    </div>
                    
                    {/* Botón favorito */}
                    <button 
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Favorito:', property.id);
                      }}
                    >
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                    </button>

                    {/* Badge verificado */}
                    {property.verified && (
                      <div className="absolute bottom-3 left-3 bg-galician-blue text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Verificada
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-galician-blue transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-galician-green" />
                        <span>{property.location?.city}, {property.location?.province}</span>
                      </div>
                    </div>

                    {/* Rating si existe */}
                    {property.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">{property.rating}</span>
                        <span className="text-sm text-gray-500">
                          ({property.reviewCount} avaliacións)
                        </span>
                      </div>
                    )}

                    {/* Detalles rápidos */}
                    <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
                      <div>
                        <span className="font-medium">{property.size?.land || 0} ha</span>
                        <span className="text-xs ml-1">de terra</span>
                      </div>
                      <div>
                        <span className="font-medium">{property.size?.capacity || 0}</span>
                        <span className="text-xs ml-1">persoas</span>
                      </div>
                    </div>

                    {/* Prezo e CTA */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-galician-blue">
                            {property.pricing?.basePrice || 0}€
                          </span>
                          <span className="text-sm text-gray-600 ml-1">/mes</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          + taxas
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-galician-green hover:bg-green-700 rounded-xl group"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/fincas/${property.id}`;
                        }}
                      >
                        Ver finca
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Sin resultados - Con retranca */}
        {!isLoading && filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🤷‍♂️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Vaites! Non atopamos fincas
            </h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
              Parece que todas as fincas están ocupadas plantando grelos.
              <br />
              Tenta con outros filtros ou busca.
            </p>
            <Button 
              className="bg-galician-blue hover:bg-blue-700 rounded-xl"
              onClick={handleClearSearch}
            >
              Limpar búsqueda
            </Button>
          </div>
        )}

        {/* Modal de filtros */}
        {showFilters && (
          <FincasFilters
            onClose={() => setShowFilters(false)}
            onApplyFilters={handleApplyFilters}
            onClearAll={handleClearSearch}
          />
        )}

        {/* CTA final - Estilo landing */}
        {!isLoading && filteredProperties.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-galician-green to-green-600 rounded-3xl p-12 text-white text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">
                Non atopaches a finca perfecta aínda?
              </h2>
              <p className="text-lg opacity-90">
                Non te preocupes! Segue buscando ou cambia os filtros para atopar máis opcións.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}