/**
 * RatingBreakdown Component - FincAirbnb
 * 
 * Componente para mostrar desglose detallado de ratings
 */

'use client';

import React from 'react';
import { StarRating, RatingText } from './StarRating';
import { CategoryRatingsSummary } from './CategoryRatings';

interface RatingBreakdownProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  categoryAverages: {
    limpeza: number;
    comunicacion: number;
    precision: number;
    localizacion: number;
    calidadePrezo: number;
  };
  recommendPercentage: number;
  className?: string;
}

export function RatingBreakdown({
  averageRating,
  totalReviews,
  ratingDistribution,
  categoryAverages,
  recommendPercentage,
  className
}: RatingBreakdownProps) {
  const maxCount = Math.max(...Object.values(ratingDistribution));

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Rating General */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <StarRating
            rating={Math.round(averageRating)}
            readonly={true}
            size="lg"
          />
          <span className="text-3xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <p className="text-gray-600">
          {totalReviews} valoración{totalReviews !== 1 ? 's' : ''}
        </p>
        {recommendPercentage > 0 && (
          <p className="text-sm text-green-600 mt-1">
            {recommendPercentage}% recomendarían esta finca
          </p>
        )}
      </div>

      {/* Distribución de Ratings */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Distribución de valoracións</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <StarRating
                    rating={1}
                    readonly={true}
                    size="sm"
                  />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600 w-12 text-right">
                  {count > 0 ? `${Math.round(percentage)}%` : '0%'}
                </div>
                <div className="text-xs text-gray-500 w-8 text-right">
                  ({count})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ratings por Categorías */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Valoración por categorías</h4>
        <CategoryRatingsSummary
          ratings={categoryAverages}
          showLabels={false}
          size="sm"
        />
      </div>

      {/* Información Adicional */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total de valoracións:</span>
            <span className="ml-2 font-medium">{totalReviews}</span>
          </div>
          <div>
            <span className="text-gray-600">Media xeral:</span>
            <span className="ml-2 font-medium">{averageRating.toFixed(1)} ⭐</span>
          </div>
          <div>
            <span className="text-gray-600">Recomendacións:</span>
            <span className="ml-2 font-medium text-green-600">
              {recommendPercentage}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Última valoración:</span>
            <span className="ml-2 font-medium">Hai 2 días</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente simplificado para mostrar en cards
 */
interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  showStars?: boolean;
  className?: string;
}

export function RatingSummary({ 
  averageRating, 
  totalReviews, 
  showStars = true,
  className 
}: RatingSummaryProps) {
  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      {showStars && (
        <StarRating
          rating={Math.round(averageRating)}
          readonly={true}
          size="sm"
        />
      )}
      <span className="text-sm font-medium text-gray-900">
        {averageRating.toFixed(1)}
      </span>
      <span className="text-xs text-gray-500">
        ({totalReviews})
      </span>
    </div>
  );
}

