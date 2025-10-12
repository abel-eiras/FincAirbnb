/**
 * AreaConversions Component - FincAirbnb
 * 
 * Componente que muestra las conversiones de área en diferentes unidades
 * Incluye equivalencias específicas de ferrados por municipio
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, MapPin } from 'lucide-react';
import { 
  convertArea, 
  formatAreaValue, 
  getAreaUnitLabel, 
  hasSpecificFerradosEquivalence 
} from '@/lib/area-conversions';

interface AreaConversionsProps {
  value: number;
  unit: string;
  provincia?: string;
  municipio?: string;
  className?: string;
}

/**
 * Componente que muestra las conversiones de área
 */
export function AreaConversions({ value, unit, provincia, municipio, className }: AreaConversionsProps) {
  // No mostrar conversiones si no hay valor
  if (!value || value <= 0) {
    return null;
  }

  // Calcular conversiones
  const conversions = {
    hectareas: unit !== 'hectareas' ? convertArea(value, unit, 'hectareas', provincia, municipio) : value,
    metros_cuadrados: unit !== 'metros_cuadrados' ? convertArea(value, unit, 'metros_cuadrados', provincia, municipio) : value,
    ferrados: unit !== 'ferrados' ? convertArea(value, unit, 'ferrados', provincia, municipio) : value
  };

  // Verificar si tiene equivalencia específica de ferrados
  const hasSpecificFerrados = provincia && municipio && hasSpecificFerradosEquivalence(provincia, municipio);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm">
          <Calculator className="h-4 w-4 mr-2 text-galician-blue" />
          Equivalencias
          {hasSpecificFerrados && (
            <Badge variant="secondary" className="ml-2 text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {provincia} - {municipio}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Hectáreas */}
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-900">
              {conversions.hectareas !== null ? formatAreaValue(conversions.hectareas, 'hectareas') : 'N/D'}
            </div>
            <div className="text-xs text-blue-700">
              {getAreaUnitLabel('hectareas')}
            </div>
          </div>

          {/* Metros cuadrados */}
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-900">
              {conversions.metros_cuadrados !== null ? formatAreaValue(conversions.metros_cuadrados, 'metros_cuadrados') : 'N/D'}
            </div>
            <div className="text-xs text-green-700">
              {getAreaUnitLabel('metros_cuadrados')}
            </div>
          </div>

          {/* Ferrados */}
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <div className="text-lg font-semibold text-orange-900">
              {conversions.ferrados !== null ? formatAreaValue(conversions.ferrados, 'ferrados') : 'N/D'}
            </div>
            <div className="text-xs text-orange-700">
              {getAreaUnitLabel('ferrados')}
              {hasSpecificFerrados && conversions.ferrados !== null && (
                <span className="block text-orange-600 font-medium">
                  ({provincia} - {municipio})
                </span>
              )}
              {conversions.ferrados === null && (
                <span className="block text-orange-600 font-medium">
                  Dato no disponible
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        {hasSpecificFerrados && conversions.ferrados !== null && (
          <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-800">
            <strong>Nota:</strong> A equivalencia de ferrados varía por municipio. 
            Este cálculo usa a equivalencia específica para {provincia} - {municipio}.
          </div>
        )}
        
        {conversions.ferrados === null && (
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-600">
            <strong>Nota:</strong> Non hai datos de equivalencia de ferrados dispoñibles para {provincia} - {municipio}.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Componente simplificado para mostrar solo una conversión específica
 */
export function SingleAreaConversion({ 
  value, 
  fromUnit, 
  toUnit, 
  provincia,
  municipio, 
  className 
}: {
  value: number;
  fromUnit: string;
  toUnit: string;
  provincia?: string;
  municipio?: string;
  className?: string;
}) {
  if (!value || value <= 0) {
    return null;
  }

  const convertedValue = convertArea(value, fromUnit, toUnit, provincia, municipio);
  
  // Si la conversión no está disponible (null), mostrar mensaje
  if (convertedValue === null) {
    return (
      <span className={className} title="Dato no disponible para este municipio">
        N/D
      </span>
    );
  }
  
  const formattedValue = formatAreaValue(convertedValue, toUnit);
  const unitLabel = getAreaUnitLabel(toUnit);

  return (
    <span className={className}>
      {formattedValue} {unitLabel}
    </span>
  );
}
