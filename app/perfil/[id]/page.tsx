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
  MapPin,
  Star,
  Calendar,
  MessageCircle,
  Home,
} from 'lucide-react';
import { getUserById } from '@/services/mockUsers';
import { getOwnerProperties } from '@/services/mockProperties';
import { useAuth } from '@/contexts/AuthContext';
import type { User, Property } from '@/shared/types';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const userId = params.id as string;

  const [profile, setProfile] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const [user, ownerProps] = await Promise.all([
          getUserById(userId),
          getOwnerProperties(userId).catch(() => [] as Property[]),
        ]);
        setProfile(user);
        setProperties(ownerProps.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [userId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Usuario non atopado</h2>
              <Button onClick={() => router.back()} className="bg-galician-blue hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  const isOwnProfile = currentUser?.id === userId;
  const isOwner = profile.role === 'owner';
  const memberSince = profile.joinedAt
    ? new Date(profile.joinedAt).getFullYear()
    : null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-galician-blue mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar — info do usuario */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    width={96}
                    height={96}
                    className="rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-galician-blue flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <h1 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Badge className="text-xs bg-galician-blue text-white">
                    {isOwner ? 'Propietario' : 'Labrego'}
                  </Badge>
                  {profile.verified && (
                    <Badge className="text-xs bg-green-100 text-green-800">Verificado</Badge>
                  )}
                </div>

                {profile.location && (
                  <p className="text-sm text-gray-500 flex items-center justify-center mb-2">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {profile.location.city}, {profile.location.province}
                  </p>
                )}
                {memberSince && (
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Membro desde {memberSince}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            {profile.stats && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  {profile.stats.rating && profile.stats.rating > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Valoración</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{profile.stats.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ) : null}
                  {isOwner && profile.stats.properties ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Fincas</span>
                      <span className="font-semibold">{profile.stats.properties}</span>
                    </div>
                  ) : null}
                  {profile.stats.totalBookings > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Alugamentos</span>
                      <span className="font-semibold">{profile.stats.totalBookings}</span>
                    </div>
                  )}
                  {isOwner && profile.stats.responseRate ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taxa resposta</span>
                      <span className="font-semibold">{profile.stats.responseRate}%</span>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* Accións */}
            {!isOwnProfile && currentUser && (
              <Button
                className="w-full bg-galician-blue hover:bg-blue-700"
                onClick={() => router.push('/taboleiro/mensaxes')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar mensaxe
              </Button>
            )}
            {isOwnProfile && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/taboleiro/perfil')}
              >
                Editar perfil
              </Button>
            )}
          </div>

          {/* Columna principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-galician-blue mb-3">Sobre {profile.name}</h2>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Fincas do propietario */}
            {isOwner && properties.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-galician-blue mb-4 flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Fincas de {profile.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {properties.map(finca => (
                      <div
                        key={finca.id}
                        className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => router.push(`/fincas/${finca.id}`)}
                      >
                        <div className="relative h-32 bg-gray-100">
                          {finca.photos?.[0]?.url ? (
                            <Image
                              src={finca.photos[0].url}
                              alt={finca.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-3xl">🌾</div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-gray-900 text-sm truncate">{finca.title}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-0.5">
                            <MapPin className="h-3 w-3 mr-0.5" />
                            {finca.location?.city}
                          </p>
                          <p className="text-sm font-bold text-galician-blue mt-1">
                            {finca.pricing?.basePrice ?? 0}€
                            <span className="text-xs font-normal text-gray-500">/mes</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty state se non hai bio nin fincas */}
            {!profile.bio && properties.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-3">👤</div>
                  <p>Este usuario aínda non completou o seu perfil.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
