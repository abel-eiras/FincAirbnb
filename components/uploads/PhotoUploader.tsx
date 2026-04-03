'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, AlertCircle, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadToCloudinary, validateImageFile, validateFileCount, UploadError, getPublicIdFromUrl, deleteFromCloudinary } from '@/lib/cloudinary';
import { isExternalApiEnabled } from '@/services/runtime';

const MAX_FILES = 10;

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  folder?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: 'uploading' | 'error';
  error?: string;
}

export function PhotoUploader({ photos, onChange, folder = 'fincas' }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files);

    try {
      validateFileCount(photos.length, fileArr.length);
    } catch (err: any) {
      alert(err.message);
      return;
    }

    const newUploading: UploadingFile[] = fileArr.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 'uploading' as const,
    }));

    setUploading(prev => [...prev, ...newUploading]);

    const results = await Promise.allSettled(
      newUploading.map(async (item) => {
        try {
          validateImageFile(item.file);

          let url: string;
          if (isExternalApiEnabled()) {
            url = await uploadToCloudinary(item.file, folder);
          } else {
            // Mock fallback: usa a URL local de preview
            await new Promise(r => setTimeout(r, 800));
            url = item.preview;
          }
          return { id: item.id, url };
        } catch (err: any) {
          throw { id: item.id, error: err instanceof UploadError ? err.message : 'Erro ao subir' };
        }
      })
    );

    const newUrls: string[] = [];
    const failedIds: { id: string; error: string }[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        newUrls.push(result.value.url);
      } else {
        failedIds.push(result.reason);
      }
    });

    if (newUrls.length > 0) {
      onChange([...photos, ...newUrls]);
    }

    setUploading(prev =>
      prev
        .map(u => {
          const failed = failedIds.find(f => f.id === u.id);
          if (failed) return { ...u, progress: 'error' as const, error: failed.error };
          const succeeded = results.find(r => r.status === 'fulfilled' && (r as any).value.id === u.id);
          if (succeeded) return null;
          return u;
        })
        .filter(Boolean) as UploadingFile[]
    );

    // Limpar os que tiveron éxito despois dun momento
    setTimeout(() => {
      setUploading(prev => prev.filter(u => u.progress === 'error'));
    }, 500);
  }, [photos, onChange, folder]);

  const handleRemove = async (url: string) => {
    onChange(photos.filter(p => p !== url));

    // Eliminar de Cloudinary se é unha URL real (non preview local)
    if (isExternalApiEnabled() && url.includes('cloudinary.com')) {
      const publicId = getPublicIdFromUrl(url);
      if (publicId) {
        deleteFromCloudinary(publicId).catch(() => { /* silent */ });
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const canAddMore = photos.length + uploading.length < MAX_FILES;

  return (
    <div className="space-y-4">
      {/* Grid de fotos existentes */}
      {(photos.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((url, i) => (
            <div key={url} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}

          {uploading.map((item) => (
            <div key={item.id} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview} alt="Subindo..." className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                {item.progress === 'uploading' ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white drop-shadow" />
                ) : (
                  <div className="text-center p-2">
                    <AlertCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                    <p className="text-xs text-white drop-shadow">{item.error}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zona de drop */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            dragOver
              ? 'border-galician-blue bg-blue-50'
              : 'border-gray-300 hover:border-galician-blue hover:bg-gray-50'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Arrastra fotos ou fai clic para seleccionar
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG ou WebP · Máx. 5 MB por foto · Ata {MAX_FILES} fotos
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {photos.length}/{MAX_FILES} fotos engadidas
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      )}

      {!canAddMore && (
        <p className="text-sm text-gray-500 text-center">
          Límite de {MAX_FILES} fotos alcanzado. Elimina algunha para engadir máis.
        </p>
      )}
    </div>
  );
}
