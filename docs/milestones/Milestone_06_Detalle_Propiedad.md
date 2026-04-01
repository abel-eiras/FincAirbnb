# 📄 Milestone 06: Página de Detalle de Propiedad

## Resumen
**Objetivo**: Página completa de detalle de propiedad con toda la información y booking widget.

**Duración**: 1.5 semanas | **Prioridad**: Alta | **Estado**: 🔄 En Progreso (≈70%)

---

## Objetivos
- Vista completa de propiedad
- Galería de fotos
- Información detallada (descripción, comodidades, reglas)
- Ubicación en mapa (mock)
- Reviews y ratings
- Perfil del propietario
- Booking widget (sticky)
- Propiedades similares

---

## Tareas

### 1. Página Detalle (`/fincas/[slug]`)
**Ruta**: Usar slug de propiedad (ej: `/fincas/finca-do-val-ponteareas`)

### 2. Secciones Principales

#### Hero Section
- Galería de fotos (lightbox)
- Título y ubicación
- Rating y reviews count
- Botones: Compartir, Guardar

#### Quick Info Bar
- Tipo de propiedad
- Capacidad (huéspedes)
- Dormitorios/baños
- Tamaño (hectáreas)

#### About Section
- Descripción completa
- "Ler máis" expandible
- Highlights

#### Amenities Section
- Iconos organizados por categoría
- Básicas
- Cocina
- Exterior
- Actividades
- Otros

#### Location Section
- Mapa mock (placeholder o iframe Google Maps)
- Dirección aproximada
- Distancia a puntos de interés

#### Reviews Section
- Rating breakdown
- Lista de reviews (paginadas)
- Filtrar por rating
- Review card con foto, texto, respuesta

#### Host Section
- Foto y nombre
- Member since
- Response rate
- Properties count
- "Contactar" button

#### Booking Widget (Sticky)
- Precio por noche
- Selector de fechas
- Número de huéspedes
- Cálculo de precio total
- "Reservar" button
- Nota: "Non se cobra ata confirmar"

#### Similar Properties
- 3-4 propiedades similares
- Misma ubicación o tipo
- Carousel

### 3. Componentes
```
components/property/
├── PropertyDetail.tsx
├── PhotoGallery.tsx
├── PropertyInfo.tsx
├── AmenitiesList.tsx
├── LocationMap.tsx
├── ReviewsList.tsx
├── ReviewCard.tsx
├── HostProfile.tsx
├── BookingWidget.tsx
└── SimilarProperties.tsx
```

### 4. Funcionalidades

**Galería**:
- Grid layout (1 grande + 4 pequeñas)
- Click abre fullscreen lightbox
- Navegación con flechas
- Contador "X de Y"

**Booking Widget**:
- Sticky en scroll (desktop)
- Mobile: fixed bottom
- Validación de fechas
- Cálculo automático
- Click → Flujo de reserva (Milestone 07)

**Share**:
- Copiar link
- Share nativo (Web Share API)

**Favorita**:
- Toggle estado
- Guardar en localStorage (mock)

---

## URL Structure
```
/fincas/[slug]
- slug: titulo-ciudad (ej: finca-do-val-ponteareas)
```

---

## SEO & Meta Tags
```tsx
export async function generateMetadata({ params }) {
  const property = await getPropertyBySlug(params.slug)
  return {
    title: `${property.title} - FincAirbnb`,
    description: property.shortDescription,
    openGraph: {
      images: [property.photos[0].url],
    },
  }
}
```

---

## Criterios de Aceptación
1. ✅ Toda la información visible
2. ✅ Galería funcional con lightbox
3. ✅ Reviews se muestran correctamente
4. ✅ Booking widget sticky funciona
5. ✅ Mobile responsive
6. ✅ SEO optimizado
7. ✅ Loading states
8. ✅ Error handling (propiedad no encontrada)

**Milestone Anterior**: 05 | **Siguiente**: 07

