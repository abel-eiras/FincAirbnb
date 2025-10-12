/**
 * Step5Review Component - FincAirbnb
 * 
 * Quinto paso del formulario: Revisar y publicar
 * Muestra un resumen completo de la propiedad antes de publicarla
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  MapPin, 
  Ruler, 
  Users, 
  Euro, 
  Calendar,
  Star,
  Edit,
  Eye,
  Home,
  TreePine,
  Droplets
} from 'lucide-react';
import type { Property } from '@/shared/types';
import { translatePropertyType } from '@/lib/translations';

interface Step5ReviewProps {
  data: Partial<Property>;
  onUpdate: (data: Partial<Property>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * Componente del sexto paso del formulario
 */
export function Step5Review({ data, onSubmit, isSubmitting }: Step5ReviewProps) {
  
  // Función para formatear fecha
  const formatDate = () => {
    return new Date().toLocaleDateString('gl-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para contar comodidades seleccionadas
  const countAmenities = () => {
    if (!data.amenities) return 0;
    return Object.values(data.amenities).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      {/* Header de revisión */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-galician-green bg-opacity-10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-galician-green" />
        </div>
        <h2 className="text-2xl font-bold text-galician-blue mb-2">
          Revisar e Publicar
        </h2>
        <p className="text-gray-600">
          Revisa todos os datos da túa propiedade antes de publicala
        </p>
      </div>

      {/* Resumen completo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Home className="h-5 w-5 mr-2 text-galician-blue" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900">{data.title}</h4>
              <p className="text-sm text-gray-600">{data.description}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {translatePropertyType(data.propertyType || '')}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {data.location?.address}, {data.location?.city}, {data.location?.province}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Detalles técnicos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TreePine className="h-5 w-5 mr-2 text-galician-blue" />
              Detalles Técnicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Superficie:</span>
              <span className="font-medium">
                {data.size?.land} ha
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Capacidade:</span>
              <span className="font-medium">{data.size?.capacity} persoas</span>
            </div>

            {/* TODO: Agregar más campos cuando estén disponibles */}

          </CardContent>
        </Card>

        {/* Comodidades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Star className="h-5 w-5 mr-2 text-galician-blue" />
              Comodidades ({countAmenities()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {data.amenities && Object.entries(data.amenities).map(([key, value]) => {
                if (!value) return null;
                
                const labels: Record<string, string> = {
                  wifi: 'WiFi',
                  parking: 'Aparcamento',
                  security: 'Seguridade',
                  cleaning: 'Limpieza',
                  irrigation: 'Sistema de rega',
                  tools: 'Ferramentas',
                  seeds: 'Sementes incluídas',
                  compost: 'Compost/Adubo',
                  guidedTour: 'Visita guiada',
                  localGuide: 'Guía local',
                  traditionalMethods: 'Métodos tradicionais',
                  harvestIncluded: 'Recolección incluída',
                  bathroom: 'Baño',
                  kitchen: 'Cociña',
                  electricity: 'Electricidade',
                  water: 'Auga potable',
                  transportation: 'Transporte',
                  accommodation: 'Aloxamento',
                  meals: 'Comidas',
                  equipment: 'Equipamento'
                };
                
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-galician-green" />
                    <span className="text-sm">{labels[key] || key}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Precios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Euro className="h-5 w-5 mr-2 text-galician-blue" />
              Prezos e Políticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Prezo por día:</span>
              <span className="font-medium">{data.pricing?.basePrice}€</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estancia mínima:</span>
              <span className="font-medium">{data.pricing?.minimumStay} días</span>
            </div>

            {data.pricing?.cleaningFee && data.pricing.cleaningFee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa de limpeza:</span>
                <span className="font-medium">{data.pricing.cleaningFee}€</span>
              </div>
            )}


            <div className="border-t pt-2">
              <div className="flex items-center justify-between font-bold">
                <span>Total por día:</span>
                <span className="text-galician-green">
                  {(data.pricing?.basePrice || 0) + (data.pricing?.cleaningFee || 0)}€
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fotos */}
      {data.photos && data.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Eye className="h-5 w-5 mr-2 text-galician-blue" />
              Fotos ({data.photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.photos.map((photo, index) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de publicación */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-900">Información de Publicación</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• A túa propiedade será visible para os labregos inmediatamente</p>
              <p>• Podes editar calquera información despois da publicación</p>
              <p>• Recibirás notificacións cando alguén faga unha reserva</p>
              <p>• Data de publicación: {formatDate()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de publicación */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className="bg-galician-green hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Publicando a túa finca...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-3" />
              Publicar Finca
            </>
          )}
        </Button>
      </div>

      {/* Nota final */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Ao publicar, aceptas os{' '}
          <a href="#" className="text-galician-blue hover:underline">
            Termos e Condicións
          </a>{' '}
          de FincAirbnb
        </p>
      </div>
    </div>
  );
}
