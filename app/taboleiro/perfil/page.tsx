'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, User, MapPin, Phone, Camera, CheckCircle } from 'lucide-react';
import { updateProfile } from '@/services/mockAuth';
import type { UpdateProfileData } from '@/shared/types';

export default function PerfilPage() {
  const router = useRouter();
  const { getCurrentUser, updateUser } = useAuth();
  const user = getCurrentUser();

  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    phone: '',
    bio: '',
    location: { city: '', province: '' },
    avatar: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only re-initialize the form when the user ID changes (login/switch), not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? '',
        phone: user.phone ?? '',
        bio: user.bio ?? '',
        location: {
          city: user.location?.city ?? '',
          province: user.location?.province ?? '',
        },
        avatar: user.avatar ?? '',
      });
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    setIsSaving(true);
    try {
      const updated = await updateProfile(user.id, {
        name: formData.name,
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
        location:
          formData.location?.city
            ? { city: formData.location.city, province: formData.location.province ?? '' }
            : undefined,
        avatar: formData.avatar || undefined,
      });
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao gardar o perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const initials = user.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => router.push('/taboleiro')} className="text-gray-500 hover:text-galician-blue">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">O meu perfil</h1>
          </div>

          {/* Avatar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative flex-shrink-0">
                  {formData.avatar ? (
                    <Image
                      src={formData.avatar}
                      alt={user.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-galician-blue flex items-center justify-center text-white text-3xl font-bold">
                      {initials}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-200">
                    <Camera className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="text-xs bg-galician-blue text-white">
                      {user.role === 'owner' ? 'Propietario' : 'Labrego'}
                    </Badge>
                    {user.verified && (
                      <Badge className="text-xs bg-green-100 text-green-800">Verificado</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-galician-blue flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información persoal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="O teu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1" /> Teléfono
                  </label>
                  <Input
                    value={formData.phone ?? ''}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sobre min</label>
                <Textarea
                  value={formData.bio ?? ''}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Cóntanos algo sobre ti, a túa experiencia con fincas..."
                  className="min-h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de avatar
                </label>
                <Input
                  value={formData.avatar ?? ''}
                  onChange={e => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" /> Localización
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={formData.location?.city ?? ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        location: { city: e.target.value, province: prev.location?.province ?? '' },
                      }))
                    }
                    placeholder="Concello"
                  />
                  <Input
                    value={formData.location?.province ?? ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        location: { city: prev.location?.city ?? '', province: e.target.value },
                      }))
                    }
                    placeholder="Provincia"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {saved && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Perfil gardado correctamente
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !(formData.name ?? '').trim()}
                  className="bg-galician-blue hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Gardando...' : 'Gardar cambios'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
