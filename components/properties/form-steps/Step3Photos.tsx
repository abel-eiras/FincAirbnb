/**
 * Step3Photos Component - FincAirbnb
 * 
 * Tercer paso del formulario: Gestión de fotos
 * Utiliza el componente PhotoManager para una gestión completa
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PhotoManager } from '@/components/properties/PhotoManager';
import { PhotoUploader } from '@/components/uploads/PhotoUploader';
import type { Property, Photo } from '@/shared/types';

// Esquema de validación para el paso 3 (fotos)
const step3Schema = z.object({
  photos: z.array(z.object({
    id: z.string(),
    url: z.string(),
    caption: z.string().optional(),
  })).min(1, 'Debe subir polo menos unha foto')
});

type Step3Data = z.infer<typeof step3Schema>;

interface Step3PhotosProps {
  data: Partial<Property>;
  onUpdate: (data: Partial<Property>) => void;
  isLoading?: boolean;
}

/**
 * Componente del tercer paso del formulario (fotos)
 */
export function Step3Photos({ data, onUpdate, isLoading = false }: Step3PhotosProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      photos: data.photos || []
    },
    mode: 'onChange'
  });

  // Observar cambios en el formulario
  const watchedData = watch();

  // Actualizar datos cuando cambien las fotos
  const handlePhotosChange = (photos: Photo[]) => {
    setValue('photos', photos);
    onUpdate({ photos: photos as any });
  };

  // Establecer la primera foto como principal automáticamente
  React.useEffect(() => {
    const photos = data.photos || [];
    if (photos.length > 0 && !photos.some(p => p.isPrimary)) {
      const updatedPhotos = photos.map((photo, index) => ({
        ...photo,
        isPrimary: index === 0
      }));
      handlePhotosChange(updatedPhotos);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.photos]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Fotos da Propiedade
        </h2>
        <p className="text-gray-600">
          Sube e xestiona as imaxes que mellor representen a túa finca
        </p>
      </div>

      {/* Upload real de fotos */}
      <PhotoUploader
        photos={(data.photos || []).map(p => p.url)}
        onChange={(urls: string[]) => {
          const existingUrls = (data.photos || []).map(p => p.url);
          const newUrls = urls.filter(u => !existingUrls.includes(u));
          const removedUrls = existingUrls.filter(u => !urls.includes(u));

          let updated = [...(data.photos || [])].filter(p => !removedUrls.includes(p.url));
          const newPhotos: Photo[] = newUrls.map((url, i) => ({
            id: `photo-${Date.now()}-${i}`,
            url,
            caption: '',
            isPrimary: updated.length === 0 && i === 0,
            order: updated.length + i,
          }));
          handlePhotosChange([...updated, ...newPhotos]);
        }}
        folder="fincas"
      />

      {/* Gestión de orde e descrición de fotos existentes */}
      {(data.photos || []).length > 0 && (
        <PhotoManager
          photos={data.photos || []}
          onPhotosChange={handlePhotosChange}
          maxPhotos={10}
          isLoading={isLoading}
        />
      )}

      {/* Mostrar errores de validación */}
      {errors.photos && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errors.photos.message}</p>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Importante sobre as fotos:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• A primeira foto será a principal por defecto</li>
          <li>• Mínimo 1 foto, máximo 20 fotos</li>
          <li>• Usa imaxes de alta calidade para mellor presentación</li>
          <li>• Inclúe diferentes ángulos e características da propiedade</li>
          <li>• As descricións axudan aos labregos a entender mellor a finca</li>
        </ul>
      </div>
    </div>
  );
}