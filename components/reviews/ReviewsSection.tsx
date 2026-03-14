/**
 * ReviewsSection Component - FincAirbnb
 * 
 * Componente para mostrar la sección completa de reviews en una propiedad
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RatingBreakdown } from './RatingBreakdown';
import { ReviewCard } from './ReviewCard';
import { getPropertyReviews, getPropertyReviewStats } from '@/services/mockReviews';
import { 
  Star, 
  Filter, 
  SortAsc, 
  MessageCircle,
  TrendingUp
} from 'lucide-react';

interface ReviewsSectionProps {
  propertyId: string;
  currentUserId?: string;
  isOwner?: boolean;
  className?: string;
}

type SortOption = 'recent' | 'helpful' | 'rating-high' | 'rating-low';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1';

export function ReviewsSection({ 
  propertyId, 
  currentUserId, 
  isOwner = false,
  className 
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const [reviewsData, statsData] = await Promise.all([
          getPropertyReviews(propertyId),
          getPropertyReviewStats(propertyId)
        ]);
        
        setReviews(reviewsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error cargando reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [propertyId]);

  const handleHelpful = async (reviewId: string) => {
    // TODO: Implementar función para marcar como útil
    console.log('Marcar como útil:', reviewId);
  };

  const handleReport = async (reviewId: string) => {
    // TODO: Implementar función para reportar
    console.log('Reportar review:', reviewId);
  };

  // Filtrar y ordenar reviews
  const filteredAndSortedReviews = React.useMemo(() => {
    let filtered = reviews;

    // Filtrar por rating
    if (filterBy !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterBy));
    }

    // Ordenar
    switch (sortBy) {
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'helpful':
        filtered = filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case 'rating-high':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        filtered = filtered.sort((a, b) => a.rating - b.rating);
        break;
    }

    return filtered;
  }, [reviews, filterBy, sortBy]);

  const displayedReviews = showAll ? filteredAndSortedReviews : filteredAndSortedReviews.slice(0, 3);

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-galician-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando valoracións...</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="text-center py-12">
          <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aínda non hai valoracións
          </h3>
          <p className="text-gray-600">
            Esta finca aínda non ten valoracións dos labregos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header con rating general */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.averageRating.toFixed(1)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {stats.totalReviews} valoración{stats.totalReviews !== 1 ? 's' : ''}
            </p>
            {stats.recommendPercentage > 0 && (
              <p className="text-xs text-green-600">
                {stats.recommendPercentage}% recomendarían
              </p>
            )}
          </div>
        </div>
        
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <MessageCircle className="h-3 w-3 mr-1" />
          {stats.totalReviews} valoracións
        </Badge>
      </div>

      {/* Rating breakdown */}
      <RatingBreakdown
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
        ratingDistribution={stats.ratingDistribution}
        categoryAverages={stats.categoryAverages}
        recommendPercentage={stats.recommendPercentage}
      />

      {/* Filtros y ordenación */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Filtrar:</span>
            </div>
            <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="5">5 ⭐</SelectItem>
                <SelectItem value="4">4 ⭐</SelectItem>
                <SelectItem value="3">3 ⭐</SelectItem>
                <SelectItem value="2">2 ⭐</SelectItem>
                <SelectItem value="1">1 ⭐</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Máis recentes</SelectItem>
                <SelectItem value="helpful">Máis útiles</SelectItem>
                <SelectItem value="rating-high">Rating alto</SelectItem>
                <SelectItem value="rating-low">Rating baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Lista de reviews */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            currentUserId={currentUserId}
            isOwner={isOwner}
            onHelpful={handleHelpful}
            onReport={handleReport}
            showCategoryRatings={false}
          />
        ))}
      </div>

      {/* Botón para mostrar más */}
      {filteredAndSortedReviews.length > 3 && !showAll && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="bg-white hover:bg-gray-50"
          >
            Ver todas as valoracións ({filteredAndSortedReviews.length})
          </Button>
        </div>
      )}

      {/* Resumen */}
      {showAll && filteredAndSortedReviews.length > 3 && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            Mostrando {filteredAndSortedReviews.length} de {filteredAndSortedReviews.length} valoracións
          </p>
        </div>
      )}
    </div>
  );
}







