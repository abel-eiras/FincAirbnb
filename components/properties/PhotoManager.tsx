/**
 * PhotoManager Component - FincAirbnb
 * 
 * Componente para gestionar fotos de propiedades
 * Incluye subida, eliminación, reordenación y selección de foto principal
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Star, 
  Move, 
  Plus,
  Eye,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Photo } from '@/shared/types';

interface PhotoManagerProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  maxPhotos?: number;
  isLoading?: boolean;
}

/**
 * Componente para gestionar fotos de propiedades
 */
export function PhotoManager({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 10,
  isLoading = false 
}: PhotoManagerProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Generar URLs mock para las fotos
  const generateMockPhotoUrl = (index: number): string => {
    const categories = ['house', 'farm', 'landscape', 'garden', 'barn'];
    const category = categories[index % categories.length];
    return `https://picsum.photos/800/600?random=${index}&category=${category}`;
  };

  // Agregar nueva foto
  const addPhoto = () => {
    if (photos.length >= maxPhotos) {
      toast({
        title: "Límite alcanzado",
        description: `Só se poden subir ${maxPhotos} fotos como máximo.`,
        variant: "destructive",
      });
      return;
    }

    const newPhoto: Photo = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: generateMockPhotoUrl(photos.length),
      caption: '',
      isPrimary: photos.length === 0, // Primera foto es principal
      order: photos.length + 1
    };

    onPhotosChange([...photos, newPhoto]);
    toast({
      title: "Foto agregada",
      description: "A nova foto engadiuse correctamente.",
    });
  };

  // Eliminar foto
  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
    toast({
      title: "Foto eliminada",
      description: "A foto eliminouse correctamente.",
    });
  };

  // Establecer foto principal
  const setMainPhoto = (photoId: string) => {
    const updatedPhotos = photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    }));
    onPhotosChange(updatedPhotos);
    toast({
      title: "Foto principal",
      description: "A foto principal actualizouse correctamente.",
    });
  };

  // Actualizar caption
  const updateCaption = (photoId: string, caption: string) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, caption } : photo
    );
    onPhotosChange(updatedPhotos);
  };

  // Reordenar fotos (drag & drop básico)
  const movePhoto = (fromIndex: number, toIndex: number) => {
    const updatedPhotos = [...photos];
    const [movedPhoto] = updatedPhotos.splice(fromIndex, 1);
    updatedPhotos.splice(toIndex, 0, movedPhoto);
    onPhotosChange(updatedPhotos);
  };

  // Simular subida de archivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      toast({
        title: "Límite excedido",
        description: `Só se poden subir ${maxPhotos - photos.length} fotos máis.`,
        variant: "destructive",
      });
      return;
    }

    // Simular subida de archivos
    Array.from(files).forEach((file, index) => {
      const newPhoto: Photo = {
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: generateMockPhotoUrl(photos.length + index),
        caption: file.name.replace(/\.[^/.]+$/, ""), // Nombre sin extensión
        isPrimary: photos.length === 0 && index === 0, // Primera foto es principal
        order: photos.length + index + 1
      };
      photos.push(newPhoto);
    });

    onPhotosChange([...photos]);
    toast({
      title: "Fotos subidas",
      description: `${files.length} foto(s) subiuse(ron) correctamente.`,
    });

    // Limpiar input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Xestión de Fotos
          </h3>
          <p className="text-sm text-gray-600">
            Sube e xestiona as imaxes da túa propiedade
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {photos.length} / {maxPhotos} fotos
          </Badge>
        </div>
      </div>

      {/* Área de subida */}
      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-galician-blue transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Subir Fotos
            </h4>
            <p className="text-gray-600 mb-4">
              Arrastra as fotos aquí ou fai clic para seleccionar
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="photo-upload"
                disabled={photos.length >= maxPhotos || isLoading}
              />
              <Label
                htmlFor="photo-upload"
                className="cursor-pointer bg-galician-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Seleccionar Archivos
              </Label>
              <Button
                variant="outline"
                onClick={addPhoto}
                disabled={photos.length >= maxPhotos || isLoading}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Foto Mock
              </Button>
            </div>
            {photos.length >= maxPhotos && (
              <p className="text-sm text-red-600 mt-2">
                Alcanzaste o límite máximo de {maxPhotos} fotos
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid de fotos */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-galician-blue" />
              Fotos da Propiedade ({photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`relative group border rounded-lg overflow-hidden ${
                    photo.isPrimary ? 'ring-2 ring-galician-blue' : 'border-gray-200'
                  }`}
                >
                  {/* Imagen */}
                  <div className="aspect-video bg-gray-100 relative">
                    <Image
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    
                    {/* Overlay de acciones */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(photo.url, '_blank')}
                          className="bg-white/90 hover:bg-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setMainPhoto(photo.id)}
                          className={`${
                            photo.isPrimary 
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                              : 'bg-white/90 hover:bg-white'
                          }`}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removePhoto(photo.id)}
                          className="bg-red-500/90 hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex space-x-1">
                      {photo.isPrimary && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Principal
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        {index + 1}
                      </Badge>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-3">
                    <Label htmlFor={`caption-${photo.id}`} className="text-xs font-medium">
                      Descripción (opcional)
                    </Label>
                    <Input
                      id={`caption-${photo.id}`}
                      value={photo.caption || ''}
                      onChange={(e) => updateCaption(photo.id, e.target.value)}
                      placeholder="Descrición da foto..."
                      className="mt-1 text-sm"
                    />
                  </div>

                  {/* Controles de orden */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col space-y-1">
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => movePhoto(index, index - 1)}
                          className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                        >
                          ↑
                        </Button>
                      )}
                      {index < photos.length - 1 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => movePhoto(index, index + 1)}
                          className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                        >
                          ↓
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consejos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Consellos para as fotos:</p>
              <ul className="space-y-1 text-xs">
                <li>• A primeira foto será a principal por defecto</li>
                <li>• Usa imaxes de alta calidade e boa iluminación</li>
                <li>• Inclúe diferentes ángulos da propiedade</li>
                <li>• Engade descricións para axudar aos labregos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
