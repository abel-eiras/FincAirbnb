/**
 * Property Types - FincAirbnb
 * 
 * Tipos relacionados con propiedades y fincas
 */

// Tipos de propiedad en Galicia
export type PropertyType = 'finca' | 'pazo' | 'casa_rural' | 'horreo' | 'cortina';

// Estado de publicación de la propiedad
export type PropertyStatus = 'draft' | 'active' | 'inactive' | 'pending_review';

// Tipo de precio (por noche o por mes)
export type PricingType = 'per_night' | 'per_month';

// Política de cancelación
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict';

/**
 * Ubicación de la propiedad
 */
export interface Location {
  address: string;
  city: string;
  province: 'Pontevedra' | 'A Coruña' | 'Lugo' | 'Ourense';
  region: 'Galicia';
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Tamaño y capacidad de la propiedad
 */
export interface PropertySize {
  land: number; // Hectáreas
  buildingArea?: number; // Metros cuadrados
  rooms?: number;
  bathrooms?: number;
  capacity: number; // Número máximo de huéspedes
}

/**
 * Comodidades disponibles en la propiedad
 */
export interface Amenities {
  // Básicas
  wifi: boolean;
  electricity: boolean;
  water: boolean;
  heating: boolean;
  
  // Cocina
  kitchen: boolean;
  refrigerator: boolean;
  stove: boolean;
  
  // Exterior
  garden: boolean;
  parking: boolean;
  pool: boolean;
  bbq: boolean;
  
  // Actividades
  farmAnimals: boolean;
  cropFields: boolean;
  hiking: boolean;
  fishing: boolean;
  
  // Otros
  petFriendly: boolean;
  childFriendly: boolean;
  wheelchairAccessible: boolean;
}

/**
 * Información de precios
 */
export interface Pricing {
  basePrice: number; // Precio base
  pricingType: PricingType;
  weekendPrice?: number; // Precio en fin de semana
  minimumStay: number; // Noches/meses mínimos
  cleaningFee?: number;
  deposit: number; // Depósito
}

/**
 * Foto de la propiedad
 */
export interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
  caption?: string;
  order: number;
}

/**
 * Reglas de la casa
 */
export interface HouseRules {
  smokingAllowed: boolean;
  partiesAllowed: boolean;
  petsAllowed: boolean;
  checkInTime: string; // Formato: "15:00"
  checkOutTime: string; // Formato: "11:00"
  cancellationPolicy: CancellationPolicy;
  houseRules: string[]; // Array de reglas personalizadas
}

/**
 * Propiedad completa
 */
export interface Property {
  id: string;
  ownerId: string;
  
  // Información básica
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  propertyType: PropertyType;
  
  // Ubicación
  location: Location;
  
  // Detalles
  size: PropertySize;
  amenities: Amenities;
  pricing: Pricing;
  photos: Photo[];
  rules: HouseRules;
  
  // Estado y metadatos
  status: PropertyStatus;
  featured: boolean;
  verified: boolean;
  views: number;
  bookings: number;
  rating: number;
  reviewCount: number;
  
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * Filtros para buscar propiedades
 */
export interface PropertyFilters {
  city?: string;
  province?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  amenities?: string[]; // Array de nombres de comodidades
  petFriendly?: boolean;
  minRating?: number;
  
  // Paginación
  page?: number;
  limit?: number;
  
  // Ordenación
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'recent' | 'popular';
}

/**
 * Datos para crear nueva propiedad
 */
export interface CreatePropertyData {
  title: string;
  description: string;
  shortDescription: string;
  propertyType: PropertyType;
  location: Location;
  size: PropertySize;
  amenities: Amenities;
  pricing: Pricing;
  rules: HouseRules;
}

/**
 * Resultado de búsqueda con paginación
 */
export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

