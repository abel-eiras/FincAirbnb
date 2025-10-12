/**
 * Step4Pricing Component - FincAirbnb
 * 
 * Cuarto paso del formulario: Precio y reglas
 * Incluye: tarifas, políticas de cancelación, reglas especiales
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Euro, 
  Calendar, 
  Shield, 
  Info
} from 'lucide-react';
import type { Property } from '@/shared/types';

// Esquema de validación para el paso 4
const step4Schema = z.object({
  pricing: z.object({
    basePrice: z.number().min(1, 'O prezo base debe ser maior a 0'),
    currency: z.string().default('EUR'),
    minimumStay: z.number().min(1, 'A estancia mínima debe ser polo menos 1 mes'),
    maximumStay: z.number().optional(),
    cleaningFee: z.number().min(0).optional(),
    securityDeposit: z.number().min(0).optional()
  }),
  availability: z.object({
    advanceBookingDays: z.number().min(1, 'Debe permitir reservas con antelación')
  }),
  policies: z.object({
    cancellationPolicy: z.string().min(1, 'Debe seleccionar unha política de cancelación'),
    norms: z.string().optional(),
    specialInstructions: z.string().optional()
  })
});

type Step4Data = z.infer<typeof step4Schema>;

interface Step4PricingProps {
  data: Partial<Property>;
  onUpdate: (data: Partial<Property>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * Componente del cuarto paso del formulario
 */
export function Step4Pricing({ data, onUpdate, onNext }: Step4PricingProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      pricing: {
        basePrice: data.pricing?.basePrice || 0,
        currency: 'EUR',
        minimumStay: data.pricing?.minimumStay || 1,
        maximumStay: undefined,
        cleaningFee: 0,
        securityDeposit: 0,
      },
      availability: {
        advanceBookingDays: 30
      },
      policies: {
        cancellationPolicy: '',
        norms: '',
        specialInstructions: ''
      }
    },
    mode: 'onChange'
  });

  // Observar cambios en el formulario
  const watchedData = watch();

  // Actualizar datos cuando cambien
  React.useEffect(() => {
    onUpdate(watchedData as any);
  }, [watchedData, onUpdate]);

  // Manejar envío del paso
  const handleStepSubmit = (stepData: Step4Data) => {
    onUpdate(stepData as any);
    onNext();
  };

  // Políticas de cancelación
  const cancellationPolicies = [
    { 
      value: 'flexible', 
      label: 'Flexible', 
      description: 'Cancelación gratuíta ata 1 mes antes do inicio' 
    },
    { 
      value: 'moderate', 
      label: 'Moderada', 
      description: 'Cancelación gratuíta ata 2 meses antes do inicio' 
    },
    { 
      value: 'strict', 
      label: 'Estrita', 
      description: 'Cancelación gratuíta ata 3 meses antes do inicio' 
    },
    { 
      value: 'super_strict', 
      label: 'Moi Estrita', 
      description: 'Cancelación gratuíta ata 6 meses antes do inicio' 
    }
  ];


  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} className="space-y-6">
      {/* Precios Base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Euro className="h-5 w-5 mr-2 text-galician-blue" />
            Prezos Base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Precio base por mes */}
            <div className="space-y-2">
              <Label htmlFor="basePrice">Prezo por mes (€) *</Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                step="0.01"
                {...register('pricing.basePrice', { valueAsNumber: true })}
                className={errors.pricing?.basePrice ? 'border-red-500' : ''}
                placeholder="Ex: 25.00"
              />
              {errors.pricing?.basePrice && (
                <p className="text-sm text-red-600">{errors.pricing.basePrice.message}</p>
              )}
            </div>

            {/* Estancia mínima */}
            <div className="space-y-2">
              <Label htmlFor="minimumStay">Estancia mínima (meses) *</Label>
              <Input
                id="minimumStay"
                type="number"
                min="1"
                {...register('pricing.minimumStay', { valueAsNumber: true })}
                className={errors.pricing?.minimumStay ? 'border-red-500' : ''}
                placeholder="Ex: 1"
              />
              {errors.pricing?.minimumStay && (
                <p className="text-sm text-red-600">{errors.pricing.minimumStay.message}</p>
              )}
            </div>
          </div>

          {/* Estancia máxima */}
          <div className="space-y-2">
            <Label htmlFor="maximumStay">Estancia máxima (meses)</Label>
            <Input
              id="maximumStay"
              type="number"
              min="1"
              {...register('pricing.maximumStay', { valueAsNumber: true })}
              placeholder="Ex: 30 (opcional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tarifas Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Euro className="h-5 w-5 mr-2 text-galician-blue" />
            Tarifas Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Taxa de limpeza */}
            <div className="space-y-2">
              <Label htmlFor="cleaningFee">Taxa de limpeza (€)</Label>
              <Input
                id="cleaningFee"
                type="number"
                min="0"
                step="0.01"
                {...register('pricing.cleaningFee', { valueAsNumber: true })}
                placeholder="Ex: 15.00"
              />
            </div>

            {/* Depósito de seguridade */}
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Depósito de seguridade (€)</Label>
              <Input
                id="securityDeposit"
                type="number"
                min="0"
                step="0.01"
                {...register('pricing.securityDeposit', { valueAsNumber: true })}
                placeholder="Ex: 50.00"
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Dispoñibilidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2 text-galician-blue" />
            Dispoñibilidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Antelación de reserva */}
            <div className="space-y-2">
              <Label htmlFor="advanceBookingDays">Antelación de reserva (días) *</Label>
              <Input
                id="advanceBookingDays"
                type="number"
                min="1"
                {...register('availability.advanceBookingDays', { valueAsNumber: true })}
                className={errors.availability?.advanceBookingDays ? 'border-red-500' : ''}
                placeholder="Ex: 30"
              />
              {errors.availability?.advanceBookingDays && (
                <p className="text-sm text-red-600">{errors.availability.advanceBookingDays.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Políticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Shield className="h-5 w-5 mr-2 text-galician-blue" />
            Políticas e Regras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Política de cancelación */}
          <div className="space-y-2">
            <Label htmlFor="cancellationPolicy">Política de cancelación *</Label>
            <Select
              value={watchedData.policies?.cancellationPolicy}
              onValueChange={(value) => setValue('policies.cancellationPolicy', value)}
            >
              <SelectTrigger className={errors.policies?.cancellationPolicy ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona unha política de cancelación" />
              </SelectTrigger>
              <SelectContent>
                {cancellationPolicies.map((policy) => (
                  <SelectItem key={policy.value} value={policy.value}>
                    <div>
                      <div className="font-medium">{policy.label}</div>
                      <div className="text-sm text-gray-500">{policy.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.policies?.cancellationPolicy && (
              <p className="text-sm text-red-600">{errors.policies.cancellationPolicy.message}</p>
            )}
          </div>


          {/* Normas */}
          <div className="space-y-2">
            <Label htmlFor="norms">Normas</Label>
            <Textarea
              id="norms"
              {...register('policies.norms')}
              placeholder="Ex: Non fumar, non animais domésticos, respectar a natureza..."
              rows={3}
            />
          </div>

          {/* Instrucións especiais */}
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Instrucións especiais</Label>
            <Textarea
              id="specialInstructions"
              {...register('policies.specialInstructions')}
              placeholder="Ex: Acceso pola porta traseira, chaves baixo a maceta..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumen de prezos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Info className="h-5 w-5 mr-2 text-galician-blue" />
            Resumo de Prezos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Prezo base por mes:</span>
              <span className="font-medium">{watchedData.pricing?.basePrice || 0}€</span>
            </div>
            {watchedData.pricing?.cleaningFee && watchedData.pricing.cleaningFee > 0 && (
              <div className="flex justify-between">
                <span>Taxa de limpeza:</span>
                <span className="font-medium">{watchedData.pricing.cleaningFee}€</span>
              </div>
            )}
            {watchedData.pricing?.securityDeposit && watchedData.pricing.securityDeposit > 0 && (
              <div className="flex justify-between">
                <span>Depósito de seguridade:</span>
                <span className="font-medium">{watchedData.pricing.securityDeposit}€</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold">
                <span>Total estimado por mes:</span>
                <span>{(watchedData.pricing?.basePrice || 0) + (watchedData.pricing?.cleaningFee || 0)}€</span>
              </div>
            </div>
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
