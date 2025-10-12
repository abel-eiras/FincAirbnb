/**
 * Página de Detalle de Finca - FincAirbnb
 * 
 * Página completa de detalle de una finca específica
 * Adaptada ao contexto de fincas para cultivo
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Users, 
  Ruler,
  Droplets,
  Zap,
  Car
} from 'lucide-react';
import { getProperty } from '@/services/mockProperties';
import { PhotoGallery } from '@/components/fincas/PhotoGallery';
import type { Property } from '@/shared/types';

export default function FincaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Cargar finca
  useEffect(() => {
    const loadFinca = async () => {
      if (!id || typeof id !== 'string') {
        setError('ID de finca non válido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedProperty = await getProperty(id);
        
        if (fetchedProperty) {
          setProperty(fetchedProperty);
          // Verificar si está en favoritos (mock)
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          setIsFavorite(favorites.includes(id));
        } else {
          setError('Finca non atopada');
        }
      } catch (err) {
        console.error('Error cargando finca:', err);
        setError('Erro ao cargar a finca');
      } finally {
        setIsLoading(false);
      }
    };

    loadFinca();
  }, [id]);

  // Toggle favorita
  const toggleFavorite = () => {
    if (!id || typeof id !== 'string') return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorite 
      ? favorites.filter((favId: string) => favId !== id)
      : [...favorites, id];
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  // Compartir
  const handleShare = async () => {
    if (!property) return;

    const shareData = {
      title: property.title,
      text: `Mira esta finca en FincAirbnb: ${property.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // TODO: Mostrar toast de confirmación
        console.log('Link copiado al portapapeles');
      }
    } catch (err) {
      console.error('Error compartiendo:', err);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando finca...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🌾</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error || 'Finca non atopada'}
              </h2>
              <p className="text-gray-600 mb-6">
                Parece que esta finca xa foi plantada noutro sitio!
              </p>
              <Button 
                onClick={() => router.push('/fincas')}
                className="bg-galician-blue hover:bg-blue-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ás fincas
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button 
              onClick={() => router.push('/fincas')}
              className="hover:text-galician-blue"
            >
              Fincas
            </button>
            <span>›</span>
            <span className="text-gray-900">{property.location?.city}</span>
            <span>›</span>
            <span className="text-gray-900">{property.title}</span>
          </div>

          {/* Título y acciones */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location?.city}, {property.location?.province}</span>
                </div>
                
                {property.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="ml-1">({property.reviewCount || 0} avaliacións)</span>
                  </div>
                )}
              </div>

              {/* Información rápida */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center">
                  <Ruler className="h-4 w-4 mr-2 text-galician-blue" />
                  <span>{property.size?.land || 0} ha</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-galician-blue" />
                  <span>{property.size?.capacity || 0} persoas</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-galician-green">
                    {property.pricing?.basePrice || 0}€/mes
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFavorite}
                className={`flex items-center ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                    : ''
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Favorita' : 'Favorita'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Galería de fotos */}
      <PhotoGallery 
        photos={property.photos || []} 
        title={property.title}
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Descripción */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-galician-blue mb-4">
                  Sobre esta finca
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description || 'Esta finca está esperando a que chegas a cultivar os teus soños. Ten unha terra fértil e unha localización privilegiada para comezar o teu proxecto agrícola.'}
                </p>
              </CardContent>
            </Card>

            {/* Servizos básicos */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-galician-blue mb-4">
                  Servizos Básicos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Droplets className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Auga corrente</p>
                      <p className="text-sm text-gray-600">Acceso a auga para rego</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Zap className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Electricidade</p>
                      <p className="text-sm text-gray-600">Punto de luz dispoñible</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Car className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Acceso con vehículo</p>
                      <p className="text-sm text-gray-600">Camino practicable</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-galician-blue mb-4">
                  Onde está
                </h2>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <p className="text-gray-600">
                    Mapa interactivo aquí
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {property.location?.city}, {property.location?.province}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-galician-blue mb-4">
                  Avaliacións dos labregos
                </h2>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⭐</div>
                  <p className="text-gray-600">
                    Sistema de reviews en desenvolvemento
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Columna lateral - Booking Widget */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-galician-blue mb-2">
                    {property.pricing?.basePrice || 0}€
                  </div>
                  <div className="text-gray-600">por mes</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de inicio
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración (meses)
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="1">1 mes</option>
                      <option value="3">3 meses</option>
                      <option value="6">6 meses</option>
                      <option value="12">12 meses</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de persoas
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={property.size?.capacity || 10}
                      defaultValue="1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <Button 
                    className="w-full bg-galician-blue hover:bg-blue-700 py-3"
                    size="lg"
                  >
                    Solicitar Alugamento
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Non se cobra ata confirmar o alugamento
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
