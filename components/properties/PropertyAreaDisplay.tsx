/**
 * PropertyAreaDisplay Component - FincAirbnb
 * 
 * Componente especializado para mostrar el área de una propiedad
 * con todas las conversiones y equivalencias por municipio
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, MapPin, Ruler } from 'lucide-react';
import { 
  convertArea, 
  formatAreaValue, 
  getAreaUnitLabel, 
  hasSpecificFerradosEquivalence 
} from '@/lib/area-conversions';
import type { Property } from '@/shared/types';

interface PropertyAreaDisplayProps {
  property: Property;
  className?: string;
}

/**
 * Componente para mostrar el área de una propiedad con conversiones
 */
export function PropertyAreaDisplay({ property, className }: PropertyAreaDisplayProps) {
  if (!property.size?.land || property.size.land <= 0) {
    return null;
  }

  const area = property.size.land;
  const unit = 'hectareas'; // Por defecto usamos hectáreas
  const provincia = property.location?.province;
  const municipio = property.location?.city;

  // Calcular todas las conversiones
  const conversions = {
    hectareas: convertArea(area, unit, 'hectareas', provincia, municipio),
    metros_cuadrados: convertArea(area, unit, 'metros_cuadrados', provincia, municipio),
    ferrados: convertArea(area, unit, 'ferrados', provincia, municipio)
  };

  const hasSpecificFerrados = municipio && provincia && hasSpecificFerradosEquivalence(provincia, municipio);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Ruler className="h-5 w-5 mr-2 text-galician-blue" />
          Superficie da Propiedade
          {hasSpecificFerrados && (
            <Badge variant="secondary" className="ml-2">
              <MapPin className="h-3 w-3 mr-1" />
              {municipio}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Área principal */}
        <div className="mb-4">
          <div className="text-center p-4 bg-galician-blue/10 rounded-lg">
            <div className="text-3xl font-bold text-galician-blue">
              {conversions.hectareas !== null ? formatAreaValue(conversions.hectareas, 'hectareas') : 'N/D'}
            </div>
            <div className="text-sm text-galician-blue/80">
              {getAreaUnitLabel('hectareas')}
            </div>
            {unit !== 'hectareas' && (
              <div className="text-xs text-gray-600 mt-1">
                (Valor orixinal: {area.toLocaleString('es-ES')} {getAreaUnitLabel(unit)})
              </div>
            )}
          </div>
        </div>

        {/* Conversiones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Metros cuadrados */}
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-semibold text-green-900">
              {conversions.metros_cuadrados !== null ? formatAreaValue(conversions.metros_cuadrados, 'metros_cuadrados') : 'N/D'}
            </div>
            <div className="text-sm text-green-700">
              {getAreaUnitLabel('metros_cuadrados')}
            </div>
          </div>

          {/* Ferrados */}
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-semibold text-orange-900">
              {conversions.ferrados !== null ? formatAreaValue(conversions.ferrados, 'ferrados') : 'N/D'}
            </div>
            <div className="text-sm text-orange-700">
              {getAreaUnitLabel('ferrados')}
              {hasSpecificFerrados && conversions.ferrados !== null && (
                <div className="text-xs text-orange-600 mt-1">
                  Equivalencia de {municipio}
                </div>
              )}
              {conversions.ferrados === null && (
                <div className="text-xs text-orange-600 mt-1">
                  Dato no disponible
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        {hasSpecificFerrados && (
          <div className="mt-4 p-3 bg-orange-100 rounded-lg">
            <div className="flex items-start">
              <Calculator className="h-4 w-4 text-orange-600 mt-0.5 mr-2" />
              <div className="text-sm text-orange-800">
                <strong>Equivalencia específica:</strong> En {municipio}, 
                a medida tradicional de ferrados ten unha equivalencia específica 
                diferente doutros municipios. Esta conversión é máis precisa para 
                a zona local.
              </div>
            </div>
          </div>
        )}

        {/* Comparación visual */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Comparación visual:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Un campo de fútbol estándar: ~0.7 hectáreas</div>
            <div>• Un parque urbano típico: ~2-5 hectáreas</div>
            <div>• Unha finca familiar tradicional: ~1-3 hectáreas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente simplificado para mostrar solo el área principal
 */
export function SimpleAreaDisplay({ property, className }: PropertyAreaDisplayProps) {
  if (!property.size?.land || property.size.land <= 0) {
    return null;
  }

  const area = property.size.land;
  const unit = 'hectareas'; // Por defecto
  const provincia = property.location?.province;
  const municipio = property.location?.city;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Ruler className="h-4 w-4 text-gray-500" />
      <span className="text-sm text-gray-700">
        {formatAreaValue(area, unit)} {getAreaUnitLabel(unit)}
      </span>
      {municipio && provincia && hasSpecificFerradosEquivalence(provincia, municipio) && (
        <Badge variant="outline" className="text-xs">
          <MapPin className="h-3 w-3 mr-1" />
          {municipio}
        </Badge>
      )}
    </div>
  );
}
