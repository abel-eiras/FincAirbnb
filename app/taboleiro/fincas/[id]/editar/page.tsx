import { EditarPropiedadClient } from './EditarPropiedadClient';
import { loadMockData } from '@/services/utils';
import type { Property } from '@/shared/types';

// Función requerida para exportación estática
export async function generateStaticParams() {
  // Obtener todas las propiedades para generar las rutas estáticas
  try {
    const properties = await loadMockData<Property>('properties');
    
    return properties.map((property) => ({
      id: property.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function EditarPropiedadPage() {
  return <EditarPropiedadClient />;
}
