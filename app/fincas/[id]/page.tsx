/**
 * Página de Detalle de Finca - FincAirbnb
 *
 * Página completa de detalle de una finca específica
 * Adaptada ao contexto de fincas para cultivo
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Car,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { getProperty, getProperties } from '@/services/mockProperties';
import { getUserById } from '@/services/mockUsers';
import { PhotoGallery } from '@/components/fincas/PhotoGallery';
import { FincaBookingWidget } from '@/components/booking/FincaBookingWidget';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { useAuth } from '@/contexts/AuthContext';
import type { Property, User } from '@/shared/types';

export default function FincaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const { id } = params;

  const [property, setProperty] = useState<Property | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<User | null>(null);
  const [similarFincas, setSimilarFincas] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

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

        if (!fetchedProperty) {
          setError('Finca non atopada');
          return;
        }

        setProperty(fetchedProperty);

        // Favoritos (localStorage está OK para esta feature de UI)
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(id));

        // Fetch owner info y fincas similares en paralelo
        const [owner, searchResult] = await Promise.all([
          getUserById(fetchedProperty.ownerId).catch(() => null),
          getProperties({ province: fetchedProperty.location?.province }).catch(() => ({ properties: [], total: 0 }))
        ]);

        setOwnerInfo(owner);

        const similar = (searchResult.properties ?? [])
          .filter((p: Property) => p.id !== id)
          .slice(0, 3);
        setSimilarFincas(similar);

      } catch (err) {
        console.error('Error cargando finca:', err);
        setError('Erro ao cargar a finca');
      } finally {
        setIsLoading(false);
      }
    };

    loadFinca();
  }, [id]);

  const toggleFavorite = () => {
    if (!id || typeof id !== 'string') return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorite
      ? favorites.filter((favId: string) => favId !== id)
      : [...favorites, id];
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (!property) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
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

  const isOwner = user?.id === property.ownerId;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button onClick={() => router.push('/fincas')} className="hover:text-galician-blue">
              Fincas
            </button>
            <span>›</span>
            <span className="text-gray-900">{property.location?.city}</span>
            <span>›</span>
            <span className="text-gray-900">{property.title}</span>
          </div>

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

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFavorite}
                className={`flex items-center ${isFavorite ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Favorita' : 'Gardar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Galería */}
      <PhotoGallery photos={property.photos || []} title={property.title} />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">

            {/* Descripción */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-galician-blue mb-4">Sobre esta finca</h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description || 'Esta finca está esperando a que chegas a cultivar os teus soños. Ten unha terra fértil e unha localización privilegiada para comezar o teu proxecto agrícola.'}
                </p>
              </CardContent>
            </Card>

            {/* Servizos básicos */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-galician-blue mb-4">Servizos Básicos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><Droplets className="h-5 w-5 text-blue-600" /></div>
                    <div>
                      <p className="font-medium">Auga corrente</p>
                      <p className="text-sm text-gray-600">Acceso a auga para rego</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg"><Zap className="h-5 w-5 text-yellow-600" /></div>
                    <div>
                      <p className="font-medium">Electricidade</p>
                      <p className="text-sm text-gray-600">Punto de luz dispoñible</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg"><Car className="h-5 w-5 text-green-600" /></div>
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
                <h2 className="text-2xl font-bold text-galician-blue mb-4">Onde está</h2>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">🗺️</div>
                  <p className="text-gray-600">Mapa interactivo</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {property.location?.city}, {property.location?.province}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Host Card — Propietario */}
            {ownerInfo && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-galician-blue mb-4">O Propietario</h2>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {ownerInfo.avatar ? (
                        <Image
                          src={ownerInfo.avatar}
                          alt={ownerInfo.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-galician-blue flex items-center justify-center text-white text-2xl font-bold">
                          {ownerInfo.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{ownerInfo.name}</h3>
                      {ownerInfo.location && (
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {ownerInfo.location.city}, {ownerInfo.location.province}
                        </p>
                      )}
                      {ownerInfo.bio && (
                        <p className="text-gray-700 mt-3 text-sm leading-relaxed">{ownerInfo.bio}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Propietario en FincAirbnb</span>
                        </div>
                      </div>
                      {!isOwner && user && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => router.push(`/taboleiro/mensaxes`)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contactar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <ReviewsSection
                  propertyId={property.id}
                  currentUserId={user?.id}
                  isOwner={isOwner}
                />
              </CardContent>
            </Card>

          </div>

          {/* Columna lateral — Booking Widget */}
          <div className="lg:col-span-1">
            <FincaBookingWidget property={property} />
          </div>
        </div>

        {/* Fincas Similares */}
        {similarFincas.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-galician-blue mb-6">Fincas similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarFincas.map((finca) => (
                <Card
                  key={finca.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                  onClick={() => router.push(`/fincas/${finca.id}`)}
                >
                  <div className="relative h-48 bg-gray-200">
                    {finca.photos?.[0] ? (
                      <Image
                        src={finca.photos[0].url}
                        alt={finca.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">🌾</div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{finca.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {finca.location?.city}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-galician-blue">
                        {finca.pricing?.basePrice ?? 0}€<span className="text-sm font-normal text-gray-500">/mes</span>
                      </span>
                      {finca.rating && (
                        <div className="flex items-center text-sm">
                          <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                          <span>{finca.rating}</span>
                        </div>
                      )}
                    </div>
                    {finca.propertyType && (
                      <Badge className="mt-2 text-xs bg-green-100 text-green-800">{finca.propertyType}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
