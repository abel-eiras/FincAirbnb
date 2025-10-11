/**
 * Review Types - FincAirbnb
 * 
 * Tipos relacionados con reseñas y valoraciones
 */

// Estado de la review
export type ReviewStatus = 'draft' | 'published' | 'hidden' | 'flagged';

// Tipo de valorado (propiedad o huésped)
export type RevieweeType = 'property' | 'guest';

/**
 * Ratings por categorías
 */
export interface RatingCategories {
  overall: number; // 1-5, requerido
  cleanliness: number;
  communication: number;
  accuracy?: number; // Solo para propiedades
  location?: number; // Solo para propiedades
  value?: number; // Solo para propiedades
  rulesRespect?: number; // Solo para huéspedes
}

/**
 * Foto incluida en review
 */
export interface ReviewPhoto {
  id: string;
  url: string;
  caption?: string;
}

/**
 * Respuesta del propietario a una review
 */
export interface ReviewResponse {
  content: string;
  respondedAt: string;
}

/**
 * Review completa
 */
export interface Review {
  id: string;
  bookingId: string;
  propertyId?: string; // Si es review de propiedad
  
  // Quién valora a quién
  reviewerId: string;
  revieweeId: string;
  revieweeType: RevieweeType;
  
  // Valoraciones
  ratings: RatingCategories;
  
  // Contenido
  title?: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  
  // Fotos (opcional)
  photos?: ReviewPhoto[];
  
  // Respuesta (solo para reviews de propiedades)
  response?: ReviewResponse;
  
  // Estado
  status: ReviewStatus;
  verified: boolean; // Reserva verificada
  
  // Interacciones
  helpful: number; // Votos "útil"
  notHelpful: number;
  
  // Timestamps
  createdAt: string;
  publishedAt?: string;
}

/**
 * Datos para crear nueva review
 */
export interface CreateReviewData {
  bookingId: string;
  revieweeId: string;
  revieweeType: RevieweeType;
  propertyId?: string;
  ratings: RatingCategories;
  title?: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  photos?: { url: string; caption?: string }[];
}

/**
 * Estadísticas de reviews de una propiedad
 */
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: {
    overall: number;
    cleanliness: number;
    communication: number;
    accuracy: number;
    location: number;
    value: number;
  };
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  recommendationRate: number; // Porcentaje que recomendarían
}

