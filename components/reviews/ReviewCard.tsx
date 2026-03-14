/**
 * ReviewCard Component - FincAirbnb
 * 
 * Componente para mostrar una reseña individual
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating, RatingText } from './StarRating';
import { CategoryRatingsSummary } from './CategoryRatings';
import { ReviewResponse } from './ReviewResponse';
import { 
  ThumbsUp, 
  Flag, 
  Calendar,
  CheckCircle,
  MessageCircle
} from 'lucide-react';

interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  categoryRatings: {
    limpeza: number;
    comunicacion: number;
    precision: number;
    localizacion: number;
    calidadePrezo: number;
  };
  title?: string;
  comment: string;
  photos: string[];
  recommend: boolean;
  helpfulCount: number;
  createdAt: string;
  response?: {
    id: string;
    reviewId: string;
    ownerId: string;
    text: string;
    createdAt: string;
  };
  verified: boolean;
}

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  isOwner?: boolean;
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  showCategoryRatings?: boolean;
  className?: string;
}

export function ReviewCard({
  review,
  currentUserId,
  isOwner = false,
  onHelpful,
  onReport,
  showCategoryRatings = false,
  className
}: ReviewCardProps) {
  const [showResponse, setShowResponse] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);

  const handleHelpful = () => {
    if (!isHelpful && onHelpful) {
      onHelpful(review.id);
      setIsHelpful(true);
    }
  };

  const handleReport = () => {
    if (onReport) {
      onReport(review.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('gl-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 space-y-4 ${className || ''}`}>
      {/* Header de la reseña */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.userAvatar} alt={review.userName} />
            <AvatarFallback className="bg-galician-blue text-white text-sm">
              {getInitials(review.userName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">{review.userName}</h4>
              {review.verified && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {review.recommend && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Recomenda
            </Badge>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-4">
        <StarRating
          rating={review.rating}
          readonly={true}
          size="md"
        />
        <span className="text-sm text-gray-600">
          {review.rating} de 5 estrelas
        </span>
      </div>

      {/* Título */}
      {review.title && (
        <h5 className="font-medium text-gray-900">{review.title}</h5>
      )}

      {/* Comentario */}
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {/* Ratings por categorías */}
      {showCategoryRatings && (
        <div className="bg-gray-50 rounded-lg p-4">
          <CategoryRatingsSummary
            ratings={review.categoryRatings}
            showLabels={false}
            size="sm"
          />
        </div>
      )}

      {/* Fotos */}
      {review.photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {review.photos.map((photo, index) => (
            <Image
              key={index}
              src={photo}
              alt={`Foto ${index + 1} da valoración`}
              className="w-full h-24 object-cover rounded-lg"
              width={240}
              height={96}
            />
          ))}
        </div>
      )}

      {/* Respuesta del propietario */}
      {review.response && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Resposta do propietario
            </span>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            {review.response.text}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            {formatDate(review.response.createdAt)}
          </p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={isHelpful}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Útil ({review.helpfulCount})</span>
          </Button>
          
          {isOwner && !review.response && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResponse(!showResponse)}
              className="flex items-center space-x-1 text-galician-blue hover:text-blue-700"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Responder</span>
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReport}
          className="text-gray-400 hover:text-red-500"
        >
          <Flag className="h-4 w-4" />
        </Button>
      </div>

      {/* Formulario de respuesta (solo para propietarios) */}
      {showResponse && isOwner && !review.response && (
        <ReviewResponse
          reviewId={review.id}
          onSuccess={() => {
            setShowResponse(false);
            // Aquí podrías actualizar la review para mostrar la respuesta
          }}
          onCancel={() => setShowResponse(false)}
        />
      )}
    </div>
  );
}

