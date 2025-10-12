/**
 * PhotoGallery Component - FincAirbnb
 * 
 * Galería de fotos con lightbox para páginas de detalle de fincas
 * Con navegación y contador
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

interface PhotoGalleryProps {
  photos: Photo[];
  title?: string;
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Si no hay fotos, mostrar placeholder
  if (!photos || photos.length === 0) {
    return (
      <div className="bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-2">
              <div className="aspect-video bg-gradient-to-br from-galician-green to-green-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg">Fotos da finca</p>
                  <p className="text-sm opacity-80">Engadir fotos próximamente</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-gradient-to-br from-galician-blue to-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl mb-1">🌱</div>
                  <p className="text-sm">Detalle 1</p>
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-shell-beige to-yellow-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-galician-green">
                  <div className="text-2xl mb-1">🚜</div>
                  <p className="text-sm">Detalle 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1);
    }
  };

  // Manejar navegación con teclado
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  return (
    <>
      {/* Galería principal */}
      <div className="bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Foto principal */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openLightbox(0)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-galician-green to-green-600 rounded-lg overflow-hidden">
                    <img
                      src={photos[0]?.url || '/placeholder-finca.jpg'}
                      alt={photos[0]?.caption || 'Foto principal da finca'}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay con botón de expandir */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity">
                        <Maximize2 className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Badge de foto principal */}
                    {photos[0]?.isPrimary && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Principal
                        </span>
                      </div>
                    )}

                    {/* Contador de fotos */}
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        1 de {photos.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fotos secundarias */}
            <div className="grid grid-cols-2 gap-4">
              {photos.slice(1, 5).map((photo, index) => (
                <Card 
                  key={photo.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => openLightbox(index + 1)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-gradient-to-br from-galician-blue to-blue-600 rounded-lg overflow-hidden">
                      <img
                        src={photo.url || '/placeholder-finca.jpg'}
                        alt={photo.caption || `Foto ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity">
                          <Maximize2 className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      {/* Badge de foto principal */}
                      {photo.isPrimary && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-yellow-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                            ★
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Botón "Ver más fotos" si hay más de 5 */}
              {photos.length > 5 && (
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => openLightbox(5)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-gradient-to-br from-shell-beige to-yellow-200 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-galician-green">
                          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">+{photos.length - 5} máis</p>
                        </div>
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            
            {/* Botón cerrar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Botón anterior */}
            {photos.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Botón siguiente */}
            {photos.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Imagen principal */}
            <div className="flex items-center justify-center">
              <img
                src={photos[selectedPhotoIndex].url}
                alt={photos[selectedPhotoIndex].caption || `Foto ${selectedPhotoIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>

            {/* Información de la foto */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-lg font-medium">
                {photos[selectedPhotoIndex].caption || `Foto ${selectedPhotoIndex + 1}`}
              </p>
              <p className="text-white/80 text-sm">
                {selectedPhotoIndex + 1} de {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
