/**
 * StarRating Component - FincAirbnb
 * 
 * Componente para mostrar y seleccionar ratings con estrellas
 */

'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showNumber = false,
  className 
}: StarRatingProps) {
  const handleStarClick = (newRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (hoverRating: number) => {
    if (!readonly) {
      // Aquí podrías implementar hover effects si quieres
    }
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            disabled={readonly}
            className={cn(
              'transition-colors duration-150',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
              sizeClasses[size]
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              )}
            />
          </button>
        ))}
      </div>
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

/**
 * Componente para mostrar rating como texto
 */
interface RatingTextProps {
  rating: number;
  totalReviews?: number;
  className?: string;
}

export function RatingText({ rating, totalReviews, className }: RatingTextProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="flex items-center space-x-1">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span className="text-lg font-semibold text-gray-900">
          {rating.toFixed(1)}
        </span>
      </div>
      {totalReviews && (
        <span className="text-sm text-gray-600">
          ({totalReviews} valoración{totalReviews !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
}

