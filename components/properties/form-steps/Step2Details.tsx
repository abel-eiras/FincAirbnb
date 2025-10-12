/**
 * Step2Details Component - FincAirbnb
 * 
 * Segundo paso del formulario: Detalles de la propiedad
 * Incluye: tamaño, capacidad, características específicas
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler, Users, TreePine, Droplets } from 'lucide-react';
import { AreaConversions } from '@/components/properties/AreaConversions';
import type { Property, PropertySize } from '@/shared/types';

// Esquema de validación para el paso 2
const step2Schema = z.object({
  size: z.object({
    land: z.number().min(0.1, 'A superficie debe ser maior a 0.1 hectáreas'),
    unit: z.string().min(1, 'Debe seleccionar unha unidade de medida'),
    capacity: z.number().min(1, 'A capacidade debe ser polo menos 1 persoa')
  }),
  maxGuests: z.number().min(1, 'A capacidade debe ser polo menos 1 persoa'),
  features: z.object({
    hasWater: z.boolean().default(false),
    hasElectricity: z.boolean().default(false),
    hasParking: z.boolean().default(false),
    hasStorage: z.boolean().default(false),
    hasTools: z.boolean().default(false),
    hasIrrigation: z.boolean().default(false),
    hasFencing: z.boolean().default(false),
    hasRoadAccess: z.boolean().default(false)
  }),
  soilType: z.string().min(1, 'Debe seleccionar o tipo de solo'),
  orientation: z.string().min(1, 'Debe seleccionar a orientación'),
  altitude: z.number().optional(),
  notes: z.string().optional()
});

type Step2Data = z.infer<typeof step2Schema>;

// Extender PropertySize para incluir unit temporalmente
interface ExtendedPropertySize extends PropertySize {
  unit?: string;
}

interface Step2DetailsProps {
  data: Partial<Property>;
  onUpdate: (data: Partial<Property>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * Componente del segundo paso del formulario
 */
export function Step2Details({ data, onUpdate, onNext }: Step2DetailsProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      size: {
        land: data.size?.land || 0,
        unit: (data.size as ExtendedPropertySize)?.unit || 'hectareas',
        capacity: data.size?.capacity || 1
      },
      maxGuests: data.size?.capacity || 1,
      features: {
        hasWater: false,
        hasElectricity: false,
        hasParking: false,
        hasStorage: false,
        hasTools: false,
        hasIrrigation: false,
        hasFencing: false,
        hasRoadAccess: false
      },
      soilType: '',
      orientation: '',
      altitude: undefined,
      notes: ''
    },
    mode: 'onChange'
  });

  // Observar cambios en el formulario
  const watchedData = watch();

  // Actualizar datos cuando cambien
  React.useEffect(() => {
    onUpdate(watchedData);
  }, [watchedData, onUpdate]);

  // Manejar envío del paso
  const handleStepSubmit = (stepData: Step2Data) => {
    onUpdate(stepData);
    onNext();
  };

  // Unidades de medida
  const areaUnits = [
    { value: 'hectareas', label: 'Hectáreas' },
    { value: 'metros_cuadrados', label: 'Metros cadrados' },
    { value: 'ferrados', label: 'Ferrados' }
  ];

  // Tipos de suelo
  const soilTypes = [
    { value: 'arcilloso', label: 'Arxiloso' },
    { value: 'arenoso', label: 'Areoso' },
    { value: 'limoso', label: 'Limoso' },
    { value: 'franco', label: 'Franco' },
    { value: 'calizo', label: 'Calizo' },
    { value: 'granitico', label: 'Granítico' }
  ];

  // Orientaciones
  const orientations = [
    { value: 'norte', label: 'Norte' },
    { value: 'sur', label: 'Sur' },
    { value: 'este', label: 'Leste' },
    { value: 'oeste', label: 'Oeste' },
    { value: 'noreste', label: 'Nordeste' },
    { value: 'noroeste', label: 'Noroeste' },
    { value: 'sureste', label: 'Sueste' },
    { value: 'suroeste', label: 'Suroeste' }
  ];

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-6">
      {/* Tamaño y Capacidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Ruler className="h-5 w-5 mr-2 text-galician-blue" />
            Tamaño e Capacidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Superficie */}
            <div className="space-y-2">
              <Label htmlFor="area">Superficie *</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                min="0.1"
                {...register('size.land', { valueAsNumber: true })}
                className={errors.size?.land ? 'border-red-500' : ''}
              />
              {errors.size?.land && (
                <p className="text-sm text-red-600">{errors.size.land.message}</p>
              )}
            </div>

            {/* Unidad */}
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade *</Label>
              <Select
                value={watchedData.size?.unit}
                onValueChange={(value) => setValue('size.unit', value)}
              >
                <SelectTrigger className={errors.size?.unit ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona unidade" />
                </SelectTrigger>
                <SelectContent>
                  {areaUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.size?.unit && (
                <p className="text-sm text-red-600">{errors.size.unit.message}</p>
              )}
            </div>

            {/* Capacidad */}
            <div className="space-y-2">
              <Label htmlFor="maxGuests">Capacidade (persoas) *</Label>
              <Input
                id="maxGuests"
                type="number"
                min="1"
                {...register('maxGuests', { valueAsNumber: true })}
                className={errors.maxGuests ? 'border-red-500' : ''}
              />
              {errors.maxGuests && (
                <p className="text-sm text-red-600">{errors.maxGuests.message}</p>
              )}
            </div>
          </div>

          {/* Conversiones de área - TODO: Implementar cuando tengamos location en el formulario */}
        </CardContent>
      </Card>

      {/* Características Físicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TreePine className="h-5 w-5 mr-2 text-galician-blue" />
            Características Físicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Suelo */}
            <div className="space-y-2">
              <Label htmlFor="soilType">Tipo de Solo *</Label>
              <Select
                value={watchedData.soilType}
                onValueChange={(value) => setValue('soilType', value)}
              >
                <SelectTrigger className={errors.soilType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona o tipo de solo" />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map((soil) => (
                    <SelectItem key={soil.value} value={soil.value}>
                      {soil.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.soilType && (
                <p className="text-sm text-red-600">{errors.soilType.message}</p>
              )}
            </div>

            {/* Orientación */}
            <div className="space-y-2">
              <Label htmlFor="orientation">Orientación *</Label>
              <Select
                value={watchedData.orientation}
                onValueChange={(value) => setValue('orientation', value)}
              >
                <SelectTrigger className={errors.orientation ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona a orientación" />
                </SelectTrigger>
                <SelectContent>
                  {orientations.map((orientation) => (
                    <SelectItem key={orientation.value} value={orientation.value}>
                      {orientation.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.orientation && (
                <p className="text-sm text-red-600">{errors.orientation.message}</p>
              )}
            </div>
          </div>

          {/* Altitud */}
          <div className="space-y-2">
            <Label htmlFor="altitude">Altitud (metros)</Label>
            <Input
              id="altitude"
              type="number"
              min="0"
              {...register('altitude', { valueAsNumber: true })}
              placeholder="Ex: 450"
            />
          </div>
        </CardContent>
      </Card>

      {/* Servicios e Infraestructura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Droplets className="h-5 w-5 mr-2 text-galician-blue" />
            Servizos e Infraestrutura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(watchedData.features || {}).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) => setValue(`features.${key}` as any, e.target.checked)}
                  className="h-4 w-4 text-galician-blue focus:ring-galician-blue border-gray-300 rounded"
                />
                <Label htmlFor={key} className="text-sm">
                  {key === 'hasWater' && 'Auga'}
                  {key === 'hasElectricity' && 'Electricidade'}
                  {key === 'hasParking' && 'Aparcamento'}
                  {key === 'hasStorage' && 'Almacenamento'}
                  {key === 'hasTools' && 'Ferramentas'}
                  {key === 'hasIrrigation' && 'Rega'}
                  {key === 'hasFencing' && 'Valla'}
                  {key === 'hasRoadAccess' && 'Acceso por estrada'}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notas Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Información adicional</Label>
            <textarea
              id="notes"
              {...register('notes')}
              placeholder="Calquera información adicional sobre a propiedade..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-galician-blue focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Botón de continuación (oculto) */}
      <div className="hidden">
        <button type="submit" disabled={!isValid}>
          Continuar
        </button>
      </div>
    </form>
  );
}
