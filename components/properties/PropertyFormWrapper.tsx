/**
 * PropertyFormWrapper Component - FincAirbnb
 * 
 * Wrapper del formulario que maneja tanto creación como edición de propiedades
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import type { Property } from '@/shared/types';

// Importar componentes de cada paso
import { Step1Basic } from './form-steps/Step1Basic';
import { Step2Details } from './form-steps/Step2Details';
import { Step3Photos } from './form-steps/Step3Photos';
import { Step4Pricing } from './form-steps/Step4Pricing';
import { Step5Review } from './form-steps/Step5Review';

interface PropertyFormWrapperProps {
  initialData?: Property;
  onSave: (data: Partial<Property>) => Promise<void>;
  isEditing?: boolean;
  isLoading?: boolean;
  onDataChange?: (hasData: boolean) => void;
}

/**
 * Wrapper del formulario multi-step para crear/editar propiedades
 */
export function PropertyFormWrapper({
  initialData,
  onSave,
  isEditing = false,
  isLoading = false,
  onDataChange
}: PropertyFormWrapperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Property>>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar formData cuando cambie initialData (para modo edición)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const steps = [
    { id: 1, title: 'Información Básica', description: 'Título, tipo e localización' },
    { id: 2, title: 'Detalles', description: 'Descrición, tamaño e capacidade' },
    { id: 3, title: 'Fotos', description: 'Imaxes da propiedade' },
    { id: 4, title: 'Prezo e Regras', description: 'Tarifas e políticas' },
    { id: 5, title: 'Revisar', description: isEditing ? 'Revisar e gardar cambios' : 'Revisar e publicar' }
  ];

  const totalSteps = steps.length;

  // Validaciones por paso
  const getStepValidation = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.propertyType && formData.location?.province && formData.location?.city);
      case 2:
        return !!(formData.description && formData.size?.land && formData.size?.capacity);
      case 3:
        return !!(formData.photos && formData.photos.length > 0);
      case 4:
        return !!(formData.pricing?.basePrice && formData.pricing?.minimumStay);
      case 5:
        return true; // El paso de revisión siempre es válido
      default:
        return false;
    }
  };

  const canGoNext = getStepValidation(currentStep);
  const canGoPrev = currentStep > 1;
  const isLastStep = currentStep === totalSteps;

  const handleUpdateData = (data: Partial<Property>) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    
    // Notificar si hay datos en el formulario
    if (onDataChange) {
      const hasData = !!(newFormData.title || newFormData.description || newFormData.propertyType || 
                        newFormData.location?.address || newFormData.location?.city || 
                        newFormData.size?.land || newFormData.photos?.length);
      onDataChange(hasData);
    }
  };

  const handleNext = () => {
    if (canGoNext && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (error) {
      console.error('Error guardando propiedade:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar el paso actual
  const renderCurrentStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: handleUpdateData,
      onNext: handleNext,
      onPrev: handlePrev,
      onSubmit: handleSubmit,
      isSubmitting: isSubmitting || isLoading
    };

    switch (currentStep) {
      case 1:
        return <Step1Basic {...stepProps} />;
      case 2:
        return <Step2Details {...stepProps} />;
      case 3:
        return <Step3Photos {...stepProps} />;
      case 4:
        return <Step4Pricing {...stepProps} />;
      case 5:
        return <Step5Review {...stepProps} />;
      default:
        return <Step1Basic {...stepProps} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Paso {currentStep} de {totalSteps}: {steps[currentStep - 1].title}
          </h2>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% completado
          </span>
        </div>
        
        {/* Progress bar personalizado */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-galician-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          {steps[currentStep - 1].description}
        </p>
      </div>

      {/* Contenido del paso actual */}
      <div className="mb-8">
        {renderCurrentStep()}
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={!canGoPrev || isSubmitting || isLoading}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex items-center space-x-2">
          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={!canGoNext || isSubmitting || isLoading}
              className="bg-galician-blue hover:bg-blue-700 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Gardando...' : 'Publicando...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Gardar cambios' : 'Publicar propiedade'}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canGoNext || isSubmitting || isLoading}
              className="bg-galician-blue hover:bg-blue-700 flex items-center"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Indicadores de pasos */}
      <div className="mt-8 flex justify-center space-x-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
              index + 1 === currentStep
                ? 'bg-galician-blue text-white'
                : index + 1 < currentStep
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                index + 1 === currentStep
                  ? 'bg-white'
                  : index + 1 < currentStep
                  ? 'bg-green-600'
                  : 'bg-gray-400'
              }`}
            />
            <span className="hidden sm:inline">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
