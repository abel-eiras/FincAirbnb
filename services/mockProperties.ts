/**
 * Mock Properties Service - FincAirbnb
 * 
 * Servicio que simula operaciones CRUD de propiedades
 * En producción, estos métodos harán llamadas a la API real
 */

import type { Property, PropertyFilters, CreatePropertyData, PropertySearchResult } from '@/shared/types';
import { delay, loadMockData, generateId, paginate, sortItems } from './utils';

/**
 * Obtiene todas las propiedades con filtros opcionales
 * 
 * @param filters - Filtros opcionales (ciudad, precio, comodidades, etc.)
 * @returns Promise con array de propiedades filtradas
 * 
 * @example
 * const properties = await getProperties({ city: 'Pontevedra', minPrice: 50 })
 */
export async function getProperties(filters?: PropertyFilters): Promise<PropertySearchResult> {
  // Simular delay de red
  await delay();
  
  // Cargar todas las propiedades
  let properties = await loadMockData<Property>('properties');
  
  // Aplicar filtros si existen
  if (filters) {
    properties = applyFilters(properties, filters);
  }
  
  // Ordenar si se especifica
  if (filters?.sortBy) {
    properties = applySorting(properties, filters.sortBy);
  }
  
  // Paginar resultados
  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const result = paginate(properties, page, limit);
  
  return {
    properties: result.items,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
  };
}

/**
 * Obtiene una propiedad por su ID
 * 
 * @param id - ID de la propiedad
 * @returns Promise con la propiedad o null si no existe
 */
export async function getProperty(id: string): Promise<Property | null> {
  await delay();
  
  const properties = await loadMockData<Property>('properties');
  const property = properties.find(p => p.id === id);
  
  if (!property) {
    throw new Error('Propiedade non atopada');
  }
  
  return property;
}

/**
 * Obtiene una propiedad por su slug (URL amigable)
 * 
 * @param slug - Slug de la propiedad (ej: 'finca-do-val-ponteareas')
 * @returns Promise con la propiedad o null si no existe
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  await delay();
  
  const properties = await loadMockData<Property>('properties');
  const property = properties.find(p => p.slug === slug);
  
  if (!property) {
    throw new Error('Propiedade non atopada');
  }
  
  return property;
}

/**
 * Obtiene las propiedades de un propietario específico
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con array de propiedades del propietario
 */
export async function getOwnerProperties(ownerId: string): Promise<Property[]> {
  await delay();
  
  const properties = await loadMockData<Property>('properties');
  return properties.filter(p => p.ownerId === ownerId);
}

/**
 * Crea una nueva propiedad (MOCK - guarda en localStorage)
 * 
 * @param data - Datos de la nueva propiedad
 * @param ownerId - ID del propietario
 * @returns Promise con la propiedad creada
 */
export async function createProperty(
  data: CreatePropertyData,
  ownerId: string
): Promise<Property> {
  await delay();
  
  // Crear slug a partir del título
  const slug = createSlug(data.title, data.location.city);
  
  // Crear nueva propiedad
  const newProperty: Property = {
    id: generateId('prop'),
    ownerId,
    ...data,
    slug,
    photos: [], // Inicialmente sin fotos
    status: 'draft',
    featured: false,
    verified: false,
    views: 0,
    bookings: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // En mock: guardar en localStorage
  const properties = await loadMockData<Property>('properties');
  properties.push(newProperty);
  saveToLocalStorage('properties', properties);
  
  return newProperty;
}

/**
 * Actualiza una propiedad existente (MOCK)
 * 
 * @param id - ID de la propiedad
 * @param data - Datos a actualizar (parcial)
 * @returns Promise con la propiedad actualizada
 */
export async function updateProperty(
  id: string,
  data: Partial<Property>
): Promise<Property> {
  await delay();
  
  const properties = await loadMockData<Property>('properties');
  const index = properties.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error('Propiedade non atopada');
  }
  
  // Actualizar propiedad
  const updated = {
    ...properties[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  properties[index] = updated;
  saveToLocalStorage('properties', properties);
  
  return updated;
}

/**
 * Elimina una propiedad (MOCK)
 * 
 * @param id - ID de la propiedad a eliminar
 */
export async function deleteProperty(id: string): Promise<void> {
  await delay();
  
  const properties = await loadMockData<Property>('properties');
  const filtered = properties.filter(p => p.id !== id);
  saveToLocalStorage('properties', filtered);
}

/**
 * Busca propiedades por texto (título o descripción)
 * 
 * @param query - Texto de búsqueda
 * @param filters - Filtros adicionales opcionales
 * @returns Promise con resultados de búsqueda
 */
export async function searchProperties(
  query: string,
  filters?: PropertyFilters
): Promise<PropertySearchResult> {
  await delay();
  
  let properties = await loadMockData<Property>('properties');
  
  // Filtrar por query de texto
  if (query && query.trim() !== '') {
    const lowerQuery = query.toLowerCase();
    properties = properties.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.location.city.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Aplicar filtros adicionales
  if (filters) {
    properties = applyFilters(properties, filters);
  }
  
  // Ordenar
  if (filters?.sortBy) {
    properties = applySorting(properties, filters.sortBy);
  }
  
  // Paginar
  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const result = paginate(properties, page, limit);
  
  return {
    properties: result.items,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
  };
}

// ============================================================================
// FUNCIONES HELPER PRIVADAS
// ============================================================================

/**
 * Aplica filtros a un array de propiedades
 * Función interna para centralizar lógica de filtrado
 */
function applyFilters(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter(property => {
    // Filtro por ciudad
    if (filters.city && property.location.city !== filters.city) {
      return false;
    }
    
    // Filtro por provincia
    if (filters.province && property.location.province !== filters.province) {
      return false;
    }
    
    // Filtro por tipo de propiedad
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false;
    }
    
    // Filtro por precio mínimo
    if (filters.minPrice && property.pricing.basePrice < filters.minPrice) {
      return false;
    }
    
    // Filtro por precio máximo
    if (filters.maxPrice && property.pricing.basePrice > filters.maxPrice) {
      return false;
    }
    
    // Filtro por capacidad mínima
    if (filters.minCapacity && property.size.capacity < filters.minCapacity) {
      return false;
    }
    
    // Filtro por rating mínimo
    if (filters.minRating && property.rating < filters.minRating) {
      return false;
    }
    
    // Filtro por pet-friendly
    if (filters.petFriendly && !property.amenities.petFriendly) {
      return false;
    }
    
    // Filtro por comodidades específicas
    if (filters.amenities && filters.amenities.length > 0) {
      for (const amenity of filters.amenities) {
        if (!(property.amenities as any)[amenity]) {
          return false;
        }
      }
    }
    
    return true;
  });
}

/**
 * Aplica ordenación a propiedades
 */
function applySorting(properties: Property[], sortBy: string): Property[] {
  switch (sortBy) {
    case 'price_asc':
      return sortItems(properties, 'pricing', 'asc');
    case 'price_desc':
      return sortItems(properties, 'pricing', 'desc');
    case 'rating':
      return sortItems(properties, 'rating', 'desc');
    case 'recent':
      return sortItems(properties, 'createdAt', 'desc');
    case 'popular':
      return sortItems(properties, 'views', 'desc');
    default:
      return properties;
  }
}

/**
 * Crea un slug URL-friendly a partir del título
 */
function createSlug(title: string, city: string): string {
  const titleSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guión
    .replace(/^-+|-+$/g, ''); // Quitar guiones al inicio/final
  
  const citySlug = city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');
  
  return `${titleSlug}-${citySlug}`;
}

/**
 * Obtiene las propiedades de un propietario específico
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con array de propiedades del propietario
 * 
 * @example
 * const ownerProperties = await getPropertiesByOwner('user-owner-1')
 */
export async function getPropertiesByOwner(ownerId: string): Promise<Property[]> {
  await delay(500);
  
  // Cargar todas las propiedades
  const allProperties = await loadMockData<Property>('properties');
  
  // Filtrar por propietario
  const ownerProperties = allProperties.filter(property => property.ownerId === ownerId);
  
  return ownerProperties;
}

/**
 * Guarda datos en localStorage (helper para mock)
 * En producción esto se reemplazará con llamadas API
 */
function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(`fincairbnb_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

