import { apiClient } from '@/services/apiClient';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

export function validateImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError('Só se aceptan imaxes JPG, PNG ou WebP');
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new UploadError(`O ficheiro non pode superar ${MAX_FILE_SIZE_MB} MB`);
  }
}

export function validateFileCount(current: number, adding: number): void {
  if (current + adding > MAX_FILES) {
    throw new UploadError(`Non podes engadir máis de ${MAX_FILES} fotos por finca`);
  }
}

export async function uploadToCloudinary(file: File, folder = 'fincas'): Promise<string> {
  validateImageFile(file);

  const { signature, timestamp, apiKey, cloudName } = await apiClient.post<{
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
  }>('/uploads/sign', { folder });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', apiKey);
  formData.append('folder', folder);
  formData.append('transformation', 'c_fill,w_800,h_600,q_auto,f_auto');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new UploadError(err?.error?.message ?? 'Erro ao subir a imaxe');
  }

  const data = await res.json();
  return data.secure_url as string;
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await apiClient.delete(`/uploads/delete`, { publicId });
}

export function getPublicIdFromUrl(url: string): string | null {
  // Extrae o publicId dunha URL de Cloudinary
  // Ex: https://res.cloudinary.com/cloud/image/upload/v123/fincas/abc.jpg → fincas/abc
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return match ? match[1] : null;
}
