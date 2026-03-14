/**
 * CategoryRatings Component - FincAirbnb
 * 
 * Componente para valoraciones por categorías específicas
 */

'use client';

import React from 'react';
import { StarRating } from './StarRating';

export interface CategoryRatingsData {
  limpeza: number;
  comunicacion: number;
  precision: number;
  localizacion: number;
  calidadePrezo: number;
}

interface CategoryRatingsProps {
  ratings: CategoryRatingsData;
  onRatingsChange?: (ratings: CategoryRatingsData) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const categories = [
  {
    key: 'limpeza' as keyof CategoryRatingsData,
    label: 'Limpeza',
    description: 'Estado de limpeza da finca'
  },
  {
    key: 'comunicacion' as keyof CategoryRatingsData,
    label: 'Comunicación',
    description: 'Facilidade de comunicación co propietario'
  },
  {
    key: 'precision' as keyof CategoryRatingsData,
    label: 'Precisión',
    description: 'A descrición coincide coa realidade'
  },
  {
    key: 'localizacion' as keyof CategoryRatingsData,
    label: 'Localización',
    description: 'Calidade da localización e accesos'
  },
  {
    key: 'calidadePrezo' as keyof CategoryRatingsData,
    label: 'Calidade-prezo',
    description: 'Relación entre calidade e prezo'
  }
];

export function CategoryRatings({ 
  ratings, 
  onRatingsChange, 
  readonly = false, 
  size = 'md',
  className 
}: CategoryRatingsProps) {
  const handleRatingChange = (category: keyof CategoryRatingsData, rating: number) => {
    if (!readonly && onRatingsChange) {
      onRatingsChange({
        ...ratings,
        [category]: rating
      });
    }
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.key} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {category.label}
                </span>
                <span className="text-xs text-gray-500">
                  {ratings[category.key].toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {category.description}
              </p>
            </div>
            <div className="ml-4">
              <StarRating
                rating={ratings[category.key]}
                onRatingChange={(rating) => handleRatingChange(category.key, rating)}
                readonly={readonly}
                size={size}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Componente para mostrar resumen de ratings por categoría
 */
interface CategoryRatingsSummaryProps {
  ratings: CategoryRatingsData;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryRatingsSummary({ 
  ratings, 
  showLabels = true,
  size = 'md',
  className 
}: CategoryRatingsSummaryProps) {
  const averageRating = Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.keys(ratings).length;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {showLabels && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Media por categorías:</span>
          <span className="text-sm font-semibold text-gray-900">
            {averageRating.toFixed(1)} ⭐
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2">
        {categories.map((category) => (
          <div key={category.key} className="flex items-center justify-between">
            <span className="text-xs text-gray-600 truncate">
              {category.label}
            </span>
            <StarRating
              rating={ratings[category.key]}
              readonly={true}
              size={size}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

