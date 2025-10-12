/**
 * PropertyForm Component - FincAirbnb
 * 
 * Componente principal del formulario multi-step para crear propiedades
 * Maneja la navegación entre pasos y la validación
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '@/shared/types';

// Importar componentes de cada paso
import { Step1Basic } from './form-steps/Step1Basic';
import { Step2Details } from './form-steps/Step2Details';
import { Step3Photos } from './form-steps/Step3Photos';
import { Step4Pricing } from './form-steps/Step4Pricing';
import { Step5Review } from './form-steps/Step5Review';

interface PropertyFormProps {
  currentStep: number;
  formData: Partial<Property>;
  onUpdateData: (data: Partial<Property>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
}

/**
 * Componente principal del formulario multi-step
 */
export function PropertyForm({
  currentStep,
  formData,
  onUpdateData,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
  canGoNext,
  canGoPrev,
  isLastStep
}: PropertyFormProps) {
  
  // Renderizar el paso actual
  const renderCurrentStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: onUpdateData,
      onNext,
      onPrev,
      onSubmit,
      isSubmitting
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
    <div className="space-y-6">
      {/* Contenido del paso actual */}
      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>

      {/* Navegación del formulario */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div>
          {canGoPrev && (
            <Button
              variant="outline"
              onClick={onPrev}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {!isLastStep ? (
            <Button
              onClick={onNext}
              className="bg-galician-blue hover:bg-blue-700 flex items-center"
            >
              Seguinte
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-galician-green hover:bg-green-700 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publicando...
                </>
              ) : (
                <>
                  Publicar Finca
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
