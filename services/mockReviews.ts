/**
 * Mock Reviews Service - FincAirbnb
 * 
 * Servicio que simula sistema de reseñas y valoraciones
 */

import type { Review, CreateReviewData, ReviewStats } from '@/shared/types';
import { delay, loadMockData, generateId } from './utils';

/**
 * Obtiene las reseñas de una propiedad
 * 
 * @param propertyId - ID de la propiedad
 * @returns Promise con array de reviews
 */
export async function getPropertyReviews(propertyId: string): Promise<Review[]> {
  await delay();
  
  const reviews = await loadMockData<Review>('reviews');
  
  // Filtrar por propiedad y solo publicadas
  return reviews.filter(r => 
    r.propertyId === propertyId && 
    r.status === 'published'
  );
}

/**
 * Obtiene las reviews de un usuario (dadas o recibidas)
 * 
 * @param userId - ID del usuario
 * @param type - 'given' (reviews que ha escrito) o 'received' (que ha recibido)
 * @returns Promise con array de reviews
 */
export async function getUserReviews(
  userId: string,
  type: 'given' | 'received'
): Promise<Review[]> {
  await delay();
  
  const reviews = await loadMockData<Review>('reviews');
  
  if (type === 'given') {
    return reviews.filter(r => r.reviewerId === userId);
  } else {
    return reviews.filter(r => r.revieweeId === userId);
  }
}

/**
 * Crea una nueva review (MOCK)
 * 
 * @param data - Datos de la review
 * @returns Promise con la review creada
 */
export async function createReview(data: CreateReviewData): Promise<Review> {
  await delay();
  
  const newReview: Review = {
    id: generateId('rev'),
    reviewerId: data.revieweeId || generateId('user'),
    ...data,
    photos: data.photos?.map(photo => ({
      ...photo,
      id: generateId('photo')
    })),
    response: undefined,
    status: 'published', // En mock, publicar inmediatamente
    verified: true,
    helpful: 0,
    notHelpful: 0,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  };
  
  // Guardar
  const reviews = await loadMockData<Review>('reviews');
  reviews.push(newReview);
  saveToLocalStorage('reviews', reviews);
  
  return newReview;
}

/**
 * Propietario responde a una review (MOCK)
 * 
 * @param reviewId - ID de la review
 * @param responseText - Texto de la respuesta
 * @returns Promise con la review actualizada
 */
export async function respondToReview(
  reviewId: string,
  responseText: string
): Promise<Review> {
  await delay();
  
  const reviews = await loadMockData<Review>('reviews');
  const index = reviews.findIndex(r => r.id === reviewId);
  
  if (index === -1) {
    throw new Error('Valoración non atopada');
  }
  
  // Añadir respuesta
  reviews[index].response = {
    content: responseText,
    respondedAt: new Date().toISOString(),
  };
  
  saveToLocalStorage('reviews', reviews);
  
  return reviews[index];
}

/**
 * Marca una review como útil (MOCK)
 * 
 * @param reviewId - ID de la review
 * @returns Promise<void>
 */
export async function markReviewHelpful(reviewId: string): Promise<void> {
  await delay();
  
  const reviews = await loadMockData<Review>('reviews');
  const review = reviews.find(r => r.id === reviewId);
  
  if (review) {
    review.helpful++;
    saveToLocalStorage('reviews', reviews);
  }
}

/**
 * Calcula estadísticas de reviews de una propiedad
 * 
 * @param propertyId - ID de la propiedad
 * @returns Promise con estadísticas calculadas
 */
export async function getReviewStats(propertyId: string): Promise<ReviewStats> {
  await delay();
  
  const reviews = await getPropertyReviews(propertyId);
  
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: {
        overall: 0,
        cleanliness: 0,
        communication: 0,
        accuracy: 0,
        location: 0,
        value: 0,
      },
      ratingDistribution: {
        '5': 0,
        '4': 0,
        '3': 0,
        '2': 0,
        '1': 0,
      },
      recommendationRate: 0,
    };
  }
  
  // Calcular promedio de cada categoría
  const totalReviews = reviews.length;
  
  const ratingBreakdown = {
    overall: calculateAverage(reviews, 'overall'),
    cleanliness: calculateAverage(reviews, 'cleanliness'),
    communication: calculateAverage(reviews, 'communication'),
    accuracy: calculateAverage(reviews, 'accuracy'),
    location: calculateAverage(reviews, 'location'),
    value: calculateAverage(reviews, 'value'),
  };
  
  // Calcular distribución por estrellas
  const ratingDistribution = {
    '5': reviews.filter(r => r.ratings.overall === 5).length,
    '4': reviews.filter(r => r.ratings.overall === 4).length,
    '3': reviews.filter(r => r.ratings.overall === 3).length,
    '2': reviews.filter(r => r.ratings.overall === 2).length,
    '1': reviews.filter(r => r.ratings.overall === 1).length,
  };
  
  // Calcular tasa de recomendación
  const wouldRecommendCount = reviews.filter(r => r.wouldRecommend).length;
  const recommendationRate = (wouldRecommendCount / totalReviews) * 100;
  
  return {
    totalReviews,
    averageRating: ratingBreakdown.overall,
    ratingBreakdown,
    ratingDistribution,
    recommendationRate,
  };
}

// Helper para calcular promedio de una categoría de rating
function calculateAverage(reviews: Review[], category: keyof typeof reviews[0]['ratings']): number {
  const ratings = reviews
    .map(r => r.ratings[category])
    .filter(r => r !== undefined) as number[];
  
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Redondear a 1 decimal
}

// Helper para guardar en localStorage
function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(`fincairbnb_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

