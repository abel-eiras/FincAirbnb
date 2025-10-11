# ⭐ Milestone 08: Sistema de Reviews (UI Mock)

## Resumen
**Objetivo**: Sistema completo de reseñas y valoraciones con ratings por categorías.

**Duración**: 1 semana | **Prioridad**: Media | **Estado**: 📅 Planificado

---

## Objetivos
- Formulario de valoración (huésped valora propiedad)
- Visualización de reviews en detalle de propiedad
- Sistema de respuestas (propietario responde)
- Rating breakdown
- Valoraciones útiles (helpful votes)

---

## Tareas

### 1. Formulario de Review (`/reservas/[id]/valorar`)

**Campos**:
- Rating general (1-5 estrellas) *requerido
- Ratings por categoría:
  - Limpeza
  - Comunicación
  - Precisión
  - Localización
  - Calidade-prezo
- Título (opcional)
- Comentario (min 50 caracteres)
- Fotos (mock - solo URLs)
- "Recomendarías?" (Sí/No)

**Componentes**:
- `ReviewForm.tsx`
- `StarRating.tsx` - Input de estrellas
- `CategoryRatings.tsx`
- `PhotoUploadMock.tsx`

### 2. Visualización de Reviews

**En Property Detail**:
- Rating overview (promedio + breakdown)
- Rating distribution (gráfico de barras)
- Filtros (todos, 5★, 4★, etc.)
- Ordenar (recientes, útiles, rating)
- Lista de reviews
- Paginación

**Review Card**:
- Avatar y nombre del reviewer
- Rating
- Fecha
- Comentario
- Fotos (si las hay)
- Respuesta del propietario
- Botones: Útil, Reportar

### 3. Responder a Review (Owner)

**Componente**: `ReviewResponse.tsx`

**Features**:
- Textarea para respuesta
- Límite 500 caracteres
- Preview
- Guardar (añade a review en mock data)

### 4. Ratings Breakdown

**Componente**: `RatingBreakdown.tsx`

**Visualización**:
```
⭐ 4.8 (127 valoracións)

Limpeza      ★★★★★ 4.9
Comunicación ★★★★★ 5.0
Precisión    ★★★★☆ 4.7
Localización ★★★★★ 4.9
Calidade-prezo ★★★★☆ 4.6

Distribución:
5★ ████████████████ 85% (108)
4★ ███░░░░░░░░░░░░░ 10% (13)
3★ █░░░░░░░░░░░░░░░  3% (4)
2★ ░░░░░░░░░░░░░░░░  1% (1)
1★ ░░░░░░░░░░░░░░░░  1% (1)
```

### 5. Servicios Mock

```typescript
// services/mockReviews.ts
export async function createReview(data: CreateReviewData)
export async function getPropertyReviews(propertyId: string)
export async function respondToReview(reviewId: string, response: string)
export async function markReviewHelpful(reviewId: string)
```

---

## Criterios de Aceptación
1. ✅ Crear review funcional
2. ✅ Visualización correcta en property
3. ✅ Respuestas de propietario funcionan
4. ✅ Rating breakdown preciso
5. ✅ Helpful votes actualizan
6. ✅ Mobile responsive

**Milestone Anterior**: 07 | **Siguiente**: 09

