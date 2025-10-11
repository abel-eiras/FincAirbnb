/**
 * Mock Services Utilities - FincAirbnb
 * 
 * Funciones de utilidad para simular comportamiento de API real
 */

/**
 * Simula delay de red (latencia de API real)
 * Útil para probar estados de carga y hacer el mock más realista
 * 
 * @param ms - Milisegundos de delay (por defecto 300-800ms aleatorio)
 */
export async function delay(ms?: number): Promise<void> {
  // Si no se especifica, usar delay aleatorio entre 300-800ms
  const delayTime = ms ?? (300 + Math.random() * 500);
  
  return new Promise(resolve => setTimeout(resolve, delayTime));
}

/**
 * Obtiene datos de un archivo JSON mock
 * Helper para cargar datos mock de forma consistente
 * 
 * @param fileName - Nombre del archivo sin extensión (ej: 'users', 'properties')
 * @returns Datos del archivo JSON
 */
export async function loadMockData<T>(fileName: string): Promise<T[]> {
  try {
    // Importación dinámica del JSON
    const data = await import(`@/mocks/${fileName}.json`);
    return data.default as T[];
  } catch (error) {
    console.error(`Error loading mock data from ${fileName}.json:`, error);
    return [];
  }
}

/**
 * Genera un ID único simple para datos mock
 * En producción esto vendría de la base de datos
 * 
 * @param prefix - Prefijo para el ID (ej: 'user', 'prop', 'book')
 * @returns ID único
 */
export function generateId(prefix: string = 'item'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Filtra un array según criterios
 * Helper genérico para aplicar filtros a datos mock
 * 
 * @param items - Array de items a filtrar
 * @param filters - Objeto con criterios de filtrado
 * @returns Array filtrado
 */
export function filterItems<T>(
  items: T[],
  filters: Record<string, any>
): T[] {
  return items.filter(item => {
    // Por cada filtro, verificar si el item cumple
    for (const [key, value] of Object.entries(filters)) {
      // Si el filtro está vacío/undefined, skip
      if (value === undefined || value === null || value === '') {
        continue;
      }
      
      // Verificar si el item tiene la propiedad
      const itemValue = (item as any)[key];
      
      // Si no coincide, filtrar fuera
      if (itemValue !== value) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Pagina un array de resultados
 * 
 * @param items - Array completo de items
 * @param page - Número de página (1-indexed)
 * @param limit - Items por página
 * @returns Objeto con items paginados y metadata
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);
  
  return {
    items: paginatedItems,
    total,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Ordena un array según criterio
 * 
 * @param items - Array a ordenar
 * @param sortBy - Clave por la que ordenar
 * @param order - 'asc' o 'desc'
 * @returns Array ordenado
 */
export function sortItems<T>(
  items: T[],
  sortBy: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue > bValue ? 1 : -1;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Simula un error de API con cierta probabilidad
 * Útil para probar manejo de errores
 * 
 * @param errorRate - Probabilidad de error (0-1, por defecto 0.05 = 5%)
 * @param errorMessage - Mensaje de error personalizado
 */
export function simulateError(
  errorRate: number = 0.05,
  errorMessage: string = 'Error de rede simulado'
): void {
  if (Math.random() < errorRate) {
    throw new Error(errorMessage);
  }
}

/**
 * Formatea una fecha ISO a formato legible en gallego
 * 
 * @param isoDate - Fecha en formato ISO
 * @returns Fecha formateada
 */
export function formatDateGalician(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  
  // Usar locale gallego
  return date.toLocaleDateString('gl-ES', options);
}

/**
 * Calcula cuántos días hay entre dos fechas
 * 
 * @param startDate - Fecha inicio (YYYY-MM-DD)
 * @param endDate - Fecha fin (YYYY-MM-DD)
 * @returns Número de días
 */
export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

