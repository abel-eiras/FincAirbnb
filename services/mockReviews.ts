/**
 * Mock Reviews Service - FincAirbnb
 * 
 * Servicios mock para el sistema de reseñas y valoraciones
 */

import { Review, CreateReviewData, ReviewResponse } from '@/shared/types';
import { apiClient } from './apiClient';
import { isExternalApiEnabled } from './runtime';

// Interfaz local para compatibilidad
interface LocalCreateReviewData {
  propertyId: string;
  userId: string;
  rating: number;
  categoryRatings?: {
    limpeza: number;
    comunicacion: number;
    precision: number;
    localizacion: number;
    calidadePrezo: number;
  };
  title?: string;
  comment: string;
  recommend?: boolean;
  photos?: { url: string; caption?: string }[];
}

interface LocalReviewResponse {
  id: string;
  reviewId: string;
  ownerId: string;
  text: string;
  createdAt: string;
}

interface LocalReview {
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
  photos: { id: string; url: string; caption?: string }[];
  recommend: boolean;
  helpfulCount: number;
  createdAt: string;
  response?: LocalReviewResponse;
  verified: boolean;
}

// Cargar datos mock
const loadMockData = (type: string) => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(type) || '[]');
};

const saveMockData = (type: string, data: any[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(type, JSON.stringify(data));
};

/**
 * Crear una nueva reseña
 */
export async function createReview(data: LocalCreateReviewData): Promise<LocalReview> {
  if (isExternalApiEnabled()) {
    return apiClient.post<LocalReview>('/reviews', data);
  }

  try {
    const reviews = loadMockData('reviews');
    const users = loadMockData('users');
    const properties = loadMockData('properties');
    
    // Verificar que el usuario existe
    const user = users.find((u: any) => u.id === data.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Verificar que la propiedad existe
    const property = properties.find((p: any) => p.id === data.propertyId);
    if (!property) {
      throw new Error('Propiedad no encontrada');
    }
    
    // Crear nueva reseña
    const newReview: LocalReview = {
      id: `review-${Date.now()}`,
      propertyId: data.propertyId,
      userId: data.userId,
      userName: user.name,
      userAvatar: user.avatar,
      rating: data.rating,
      categoryRatings: data.categoryRatings || {
        limpeza: data.rating,
        comunicacion: data.rating,
        precision: data.rating,
        localizacion: data.rating,
        calidadePrezo: data.rating
      },
      title: data.title || '',
      comment: data.comment,
      photos: data.photos?.map((photo, index) => 
        typeof photo === 'string' 
          ? { id: `photo-${Date.now()}-${index}`, url: photo } 
          : { id: `photo-${Date.now()}-${index}`, ...photo }
      ) || [],
      recommend: data.recommend || false,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      response: undefined,
      verified: true
    };
    
    reviews.push(newReview);
    saveMockData('reviews', reviews);
    
    return newReview;
  } catch (error) {
    console.error('Error creando reseña:', error);
    throw error;
  }
}

/**
 * Obtener reseñas de una propiedad
 */
export async function getPropertyReviews(propertyId: string): Promise<LocalReview[]> {
  if (isExternalApiEnabled()) {
    return apiClient.get<LocalReview[]>(`/reviews/property/${propertyId}`);
  }

  try {
    const reviews = loadMockData('reviews');
    return reviews.filter((review: LocalReview) => review.propertyId === propertyId);
  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    return [];
  }
}

/**
 * Responder a una reseña (propietario)
 */
export async function respondToReview(reviewId: string, response: string, ownerId: string): Promise<LocalReviewResponse> {
  if (isExternalApiEnabled()) {
    const review = await apiClient.post<LocalReview>(`/reviews/${reviewId}/respond`, { content: response, ownerId });
    return review.response as LocalReviewResponse;
  }

  try {
    const reviews = loadMockData('reviews');
    const reviewIndex = reviews.findIndex((r: LocalReview) => r.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Reseña no encontrada');
    }
    
    const reviewResponse: LocalReviewResponse = {
      id: `response-${Date.now()}`,
      reviewId,
      ownerId,
      text: response,
      createdAt: new Date().toISOString()
    };
    
    reviews[reviewIndex].response = reviewResponse;
    saveMockData('reviews', reviews);
    
    return reviewResponse;
  } catch (error) {
    console.error('Error respondiendo a reseña:', error);
    throw error;
  }
}

/**
 * Marcar reseña como útil
 */
export async function markReviewHelpful(reviewId: string, userId: string): Promise<boolean> {
  if (isExternalApiEnabled()) {
    await apiClient.post(`/reviews/${reviewId}/helpful`, { userId });
    return true;
  }

  try {
    const reviews = loadMockData('reviews');
    const reviewIndex = reviews.findIndex((r: LocalReview) => r.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Reseña no encontrada');
    }
    
    reviews[reviewIndex].helpfulCount += 1;
    saveMockData('reviews', reviews);
    
    return true;
  } catch (error) {
    console.error('Error marcando reseña como útil:', error);
    return false;
  }
}

/**
 * Obtener estadísticas de reseñas de una propiedad
 */
export async function getPropertyReviewStats(propertyId: string): Promise<{
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
}> {
  try {
    const reviews = await getPropertyReviews(propertyId);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        categoryAverages: {
          limpeza: 0,
          comunicacion: 0,
          precision: 0,
          localizacion: 0,
          calidadePrezo: 0
        },
        recommendPercentage: 0
      };
    }
    
    // Calcular rating promedio
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    // Distribución de ratings
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });
    
    // Promedios por categoría
    const categoryAverages = {
      limpeza: reviews.reduce((sum, r) => sum + r.categoryRatings.limpeza, 0) / reviews.length,
      comunicacion: reviews.reduce((sum, r) => sum + r.categoryRatings.comunicacion, 0) / reviews.length,
      precision: reviews.reduce((sum, r) => sum + r.categoryRatings.precision, 0) / reviews.length,
      localizacion: reviews.reduce((sum, r) => sum + r.categoryRatings.localizacion, 0) / reviews.length,
      calidadePrezo: reviews.reduce((sum, r) => sum + r.categoryRatings.calidadePrezo, 0) / reviews.length
    };
    
    // Porcentaje de recomendaciones
    const recommendCount = reviews.filter(r => r.recommend).length;
    const recommendPercentage = (recommendCount / reviews.length) * 100;
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
      categoryAverages: {
        limpeza: Math.round(categoryAverages.limpeza * 10) / 10,
        comunicacion: Math.round(categoryAverages.comunicacion * 10) / 10,
        precision: Math.round(categoryAverages.precision * 10) / 10,
        localizacion: Math.round(categoryAverages.localizacion * 10) / 10,
        calidadePrezo: Math.round(categoryAverages.calidadePrezo * 10) / 10
      },
      recommendPercentage: Math.round(recommendPercentage)
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de reseñas:', error);
    throw error;
  }
}

/**
 * Obtener reseñas de un usuario
 */
export async function getUserReviews(userId: string): Promise<LocalReview[]> {
  if (isExternalApiEnabled()) {
    const reviews = await apiClient.get<LocalReview[]>('/reviews');
    return reviews.filter((review) => review.userId === userId);
  }

  try {
    const reviews = loadMockData('reviews');
    return reviews.filter((review: LocalReview) => review.userId === userId);
  } catch (error) {
    console.error('Error obteniendo reseñas del usuario:', error);
    return [];
  }
}

/**
 * Obtener reseñas pendientes de valorar
 */
export async function getPendingReviews(userId: string): Promise<Array<{
  alugamentoId: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  endDate: string;
  canReview: boolean;
}>> {
  if (isExternalApiEnabled()) {
    try {
      const [alugamentos, reviews] = await Promise.all([
        apiClient.get<any[]>(`/alugamentos/labrego/${userId}`),
        apiClient.get<LocalReview[]>('/reviews')
      ]);

      const now = new Date();
      const completedAlugamentos = alugamentos.filter(
        (a: any) => a.status === 'completado' && new Date(a.finCultivo) < now
      );

      return completedAlugamentos
        .filter((a: any) =>
          !reviews.some((r: LocalReview) => r.propertyId === a.propertyId && r.userId === userId)
        )
        .map((a: any) => ({
          alugamentoId: a.id,
          propertyId: a.propertyId,
          propertyTitle: a.propertyId,
          propertyImage: '',
          endDate: a.finCultivo,
          canReview: true
        }));
    } catch (error) {
      console.error('Error obteniendo reseñas pendientes:', error);
      return [];
    }
  }

  try {
    const alugamentos = loadMockData('alugamentos');
    const reviews = loadMockData('reviews');
    const properties = loadMockData('properties');

    const userAlugamentos = alugamentos.filter((alugamento: any) =>
      alugamento.labregoId === userId &&
      new Date(alugamento.finCultivo) < new Date()
    );

    const pendingReviews = userAlugamentos.map((alugamento: any) => {
      const property = properties.find((p: any) => p.id === alugamento.propertyId);
      const hasReview = reviews.some((review: LocalReview) =>
        review.propertyId === alugamento.propertyId && review.userId === userId
      );

      return {
        alugamentoId: alugamento.id,
        propertyId: alugamento.propertyId,
        propertyTitle: property?.title || 'Propiedad desconocida',
        propertyImage: property?.photos?.[0] || '',
        endDate: alugamento.finCultivo,
        canReview: !hasReview
      };
    });

    return pendingReviews.filter((review: any) => review.canReview);
  } catch (error) {
    console.error('Error obteniendo reseñas pendientes:', error);
    return [];
  }
}