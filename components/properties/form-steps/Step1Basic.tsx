/**
 * Step1Basic Component - FincAirbnb
 * 
 * Primer paso del formulario: Información básica de la propiedad
 * Incluye: título, tipo de propiedad, localización
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Home, FileText } from 'lucide-react';
import { PROVINCIAS_GALICIA, getMunicipiosByProvincia } from '@/lib/galicia-locations';
import type { Property } from '@/shared/types';
import { translatePropertyType } from '@/lib/translations';

// Esquema de validación para el paso 1
const step1Schema = z.object({
  title: z.string().min(10, 'O título debe ter polo menos 10 caracteres'),
  propertyType: z.string().min(1, 'Debe seleccionar un tipo de propiedade'),
  description: z.string().min(50, 'A descrición debe ter polo menos 50 caracteres'),
  location: z.object({
    address: z.string().min(10, 'A dirección debe ter polo menos 10 caracteres'),
    city: z.string().min(2, 'A cidade é obrigatoria'),
    province: z.string().min(2, 'A provincia é obrigatoria'),
    postalCode: z.string().min(5, 'O código postal é obrigatorio'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  })
});

type Step1Data = z.infer<typeof step1Schema>;

interface Step1BasicProps {
  data: Partial<Property>;
  onUpdate: (data: Partial<Property>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * Componente del primer paso del formulario
 */
export function Step1Basic({ data, onUpdate, onNext }: Step1BasicProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      title: data.title || '',
      propertyType: data.propertyType || 'finca',
      description: data.description || '',
      location: {
        address: data.location?.address || '',
        city: data.location?.city || '',
        province: data.location?.province || '',
        postalCode: data.location?.postalCode || '',
        coordinates: data.location?.coordinates
      }
    },
    mode: 'onChange'
  });

  // Observar cambios en el formulario
  const watchedData = watch();

  // Actualizar datos cuando cambien
  React.useEffect(() => {
    onUpdate(watchedData as Partial<Property>);
  }, [watchedData, onUpdate]);

  // Manejar envío del paso
  const handleStepSubmit = (stepData: Step1Data) => {
    onUpdate(stepData as Partial<Property>);
    onNext();
  };

  // Tipos de propiedad disponibles
  const propertyTypes = [
    { value: 'finca', label: 'Finca Rural' },
    { value: 'huerto', label: 'Horto' },
    { value: 'vinedo', label: 'Viñedo' },
    { value: 'bosque', label: 'Bosque' },
    { value: 'pradera', label: 'Pradeira' },
    { value: 'monte', label: 'Monte' },
    { value: 'cortello', label: 'Cortello' }
  ];

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Home className="h-5 w-5 mr-2 text-galician-blue" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título da Propiedade *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ex: Finca familiar en Ourense con 2 hectáreas"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Tipo de Propiedad */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Propiedade *</Label>
            <Select
              value={watchedData.propertyType}
              onValueChange={(value) => setValue('propertyType', value)}
            >
              <SelectTrigger className={errors.propertyType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona o tipo de propiedade" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyType && (
              <p className="text-sm text-red-600">{errors.propertyType.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrición *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe a túa propiedade, o que se pode facer nela, a súa historia..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            <p className="text-sm text-gray-500">
              {watchedData.description?.length || 0} / 50 caracteres mínimo
            </p>
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Localización */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2 text-galician-blue" />
            Localización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección Completa *</Label>
            <Input
              id="address"
              {...register('location.address')}
              placeholder="Ex: Rúa da Igrexa, 15, Bóveda"
              className={errors.location?.address ? 'border-red-500' : ''}
            />
            {errors.location?.address && (
              <p className="text-sm text-red-600">{errors.location.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provincia */}
            <div className="space-y-2">
              <Label htmlFor="province">Provincia *</Label>
              <Select 
                value={watch('location.province') || ''} 
                onValueChange={(value) => {
                  setValue('location.province', value);
                  setValue('location.city', ''); // Limpiar ciudad cuando cambie provincia
                }}
              >
                <SelectTrigger className={errors.location?.province ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona a provincia" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCIAS_GALICIA.map((provincia) => (
                    <SelectItem key={provincia.value} value={provincia.value}>
                      {provincia.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location?.province && (
                <p className="text-sm text-red-600">{errors.location.province.message}</p>
              )}
            </div>

            {/* Municipio */}
            <div className="space-y-2">
              <Label htmlFor="city">Municipio *</Label>
              <Select 
                value={watch('location.city') || ''} 
                onValueChange={(value) => setValue('location.city', value)}
                disabled={!watch('location.province')}
              >
                <SelectTrigger className={errors.location?.city ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona o municipio" />
                </SelectTrigger>
                <SelectContent>
                  {watch('location.province') && getMunicipiosByProvincia(watch('location.province')).map((municipio) => (
                    <SelectItem key={municipio.value} value={municipio.value}>
                      {municipio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location?.city && (
                <p className="text-sm text-red-600">{errors.location.city.message}</p>
              )}
            </div>
          </div>

          {/* Código Postal */}
          <div className="space-y-2">
            <Label htmlFor="postalCode">Código Postal *</Label>
            <Input
              id="postalCode"
              {...register('location.postalCode')}
              placeholder="Ex: 32001"
              className={errors.location?.postalCode ? 'border-red-500' : ''}
            />
            {errors.location?.postalCode && (
              <p className="text-sm text-red-600">{errors.location.postalCode.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botón de continuación (oculto, se activa con Enter o botón externo) */}
      <div className="hidden">
        <Button type="submit" disabled={!isValid}>
          Continuar
        </Button>
      </div>
    </form>
  );
}
