# 🔍 Milestone 05: Catálogo de Fincas + Búsqueda

## Resumen
**Objetivo**: Catálogo público de fincas para labregos con búsqueda avanzada e filtros adaptados ao cultivo.

**Duración**: 2 semanas | **Prioridad**: Alta | **Estado**: ✅ COMPLETADO

---

## Objetivos
- Catálogo público de todas as fincas para alugar
- Búsqueda por texto (nome, localización, tipo de cultivo)
- Filtros avanzados (ubicación, prezo por mes, tamaño, tipo de solo)
- Ordenación (prezo, tamaño, localización)
- Paginación
- Copy gallego con retranca

---

## Tareas

### 1. Página Catálogo (`/fincas`)
**Componentes**:
- `PropertyCatalog.tsx`
- `SearchBar.tsx` - Barra búsqueda
- `FilterSidebar.tsx` - Filtros laterales
- `PropertyGrid.tsx` - Grid de resultados
- `Pagination.tsx`
- `SortDropdown.tsx`

### 2. Búsqueda y Filtros
**Barra de Búsqueda**:
- Texto libre (título, descripción)
- Ubicación (city/province)
- Fechas (check-in/out) - futuro
- Huéspedes

**Filtros Avanzados**:
- **Tipo**: Finca, Pazo, Casa rural, Hórreo
- **Precio**: Rango slider (min-max)
- **Capacidad**: Número de personas
- **Comodidades**: WiFi, Parking, Pool, BBQ, etc.
- **Rating**: Mínimo rating
- **Pet-friendly**: Checkbox

### 3. Ordenación
- Precio (ascendente/descendente)
- Rating (mayor a menor)
- Más recientes
- Más populares (por views)

### 4. PropertyCard Público
- Foto principal
- Título y ubicación
- Rating y número de reviews
- Precio por noche
- Comodidades destacadas
- Badge "Verificado"
- Botón favorita
- Link a detalle

### 5. Paginación
- 12 propiedades por página
- Números de página
- Prev/Next
- Info "Mostrando X de Y"

### 6. Estados Especiales
- Loading skeleton
- Sin resultados
- Error de carga
- Filtros aplicados (badges)

---

## Servicios Mock
```typescript
// services/mockProperties.ts
export async function searchProperties(
  query: string,
  filters: PropertyFilters
): Promise<{
  properties: Property[]
  total: number
  page: number
  pages: number
}>

// Implementar filtrado complejo
```

---

## Criterios de Aceptación
1. ✅ Búsqueda por texto funcional
2. ✅ Todos los filtros aplicables
3. ✅ Resultados actualizan en tiempo real
4. ✅ Paginación correcta
5. ✅ Responsive mobile
6. ✅ Performance optimizada (memoization)

**Milestone Anterior**: 04 | **Siguiente**: 06

