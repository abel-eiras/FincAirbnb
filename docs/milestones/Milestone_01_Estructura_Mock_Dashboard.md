# 🏗️ Milestone 01: Estructura Mock + Dashboard Base

## Resumen Ejecutivo

**Objetivo**: Establecer la infraestructura de datos mock y refinar el dashboard base para soportar el desarrollo frontend completo sin dependencia del backend.

**Duración estimada**: 1 semana (5 días laborables)  
**Prioridad**: Alta  
**Estado**: 📅 Planificado

---

## Contexto

Actualmente tenemos un sistema de autenticación mock básico. Este milestone amplía esa infraestructura para incluir todos los datos necesarios (propiedades, reservas, mensajes, reviews) y crea servicios mock reutilizables que simulen llamadas API reales.

---

## Objetivos

### Principales
- ✅ Crear estructura de datos mock completa (JSON files)
- ✅ Implementar servicios mock que simulen APIs
- ✅ Refinar dashboard base con navegación mejorada
- ✅ Establecer patrones de carga de datos
- ✅ Configurar tipos TypeScript compartidos

### Secundarios
- 🔄 Documentar estructura de datos
- 🔄 Crear utilities comunes
- 🔄 Establecer convenciones de código

---

## Tareas de Desarrollo

### 1. Estructura de Datos Mock (1 día)

**Archivos a crear**: `/mocks/`

#### 1.1 users.json
```json
[
  {
    "id": "user-owner-1",
    "email": "xose@example.com",
    "name": "Xosé Manuel García",
    "role": "owner",
    ...
  }
]
```

**Contenido**:
- 3 propietarios
- 3 huéspedes
- 1 administrador

#### 1.2 properties.json
```json
[
  {
    "id": "prop-1",
    "title": "Finca do Val",
    "location": { ... },
    "pricing": { ... },
    ...
  }
]
```

**Contenido**:
- 5 propiedades diferentes
- Tipos variados (finca, pazo, casa rural, hórreo)
- Datos completos (fotos, comodidades, precios)

#### 1.3 bookings.json
- 7 reservas (confirmadas, completadas, canceladas)
- Diferentes estados para testing

#### 1.4 messages.json
- 3 conversaciones
- Mensajes de ejemplo realistas

#### 1.5 reviews.json
- 4 reseñas
- Ratings variados
- Con y sin respuesta del propietario

### 2. Servicios Mock (2 días)

**Archivos a crear**: `/services/`

#### 2.1 Utilities Base
```typescript
// services/utils.ts
export function delay(ms: number): Promise<void>
export function simulateError(rate: number): void
export function paginate<T>(items: T[], page: number, limit: number): T[]
```

#### 2.2 mockAuth.ts (Refactorizar)
- Mover de `lib/auth-mock.ts` a `services/mockAuth.ts`
- Mejorar con tipos más estrictos
- Añadir métodos faltantes

Funciones:
```typescript
export async function login(email: string, password: string)
export async function register(data: RegisterData)
export async function logout()
export function getCurrentUser()
export async function updateProfile(userId: string, data: Partial<User>)
export async function resetPassword(email: string)
```

#### 2.3 mockProperties.ts
```typescript
export async function getProperties(filters?: PropertyFilters): Promise<Property[]>
export async function getProperty(id: string): Promise<Property>
export async function getPropertyBySlug(slug: string): Promise<Property>
export async function createProperty(data: CreatePropertyData): Promise<Property>
export async function updateProperty(id: string, data: Partial<Property>): Promise<Property>
export async function deleteProperty(id: string): Promise<void>
export async function searchProperties(query: string): Promise<Property[]>
export async function getOwnerProperties(ownerId: string): Promise<Property[]>
```

#### 2.4 mockBookings.ts
```typescript
export async function getUserBookings(userId: string, role: 'guest' | 'owner'): Promise<Booking[]>
export async function getBooking(id: string): Promise<Booking>
export async function createBooking(data: CreateBookingData): Promise<Booking>
export async function updateBooking(id: string, data: Partial<Booking>): Promise<Booking>
export async function cancelBooking(id: string, reason: string): Promise<Booking>
export async function getPropertyBookings(propertyId: string): Promise<Booking[]>
export async function getAvailability(propertyId: string, year: number, month: number): Promise<CalendarDay[]>
```

#### 2.5 mockMessages.ts
```typescript
export async function getConversations(userId: string): Promise<Conversation[]>
export async function getConversation(id: string): Promise<Conversation>
export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<Message>
export async function markAsRead(conversationId: string, userId: string): Promise<void>
export async function createConversation(data: CreateConversationData): Promise<Conversation>
```

#### 2.6 mockReviews.ts
```typescript
export async function getPropertyReviews(propertyId: string): Promise<Review[]>
export async function getUserReviews(userId: string, type: 'given' | 'received'): Promise<Review[]>
export async function createReview(data: CreateReviewData): Promise<Review>
export async function respondToReview(reviewId: string, response: string): Promise<Review>
export async function markHelpful(reviewId: string): Promise<void>
```

### 3. Types Compartidos (0.5 días)

**Directorio**: `/shared/types/`

#### 3.1 Crear Types
```
shared/types/
├── user.ts          # User, RegisterData, LoginData
├── property.ts      # Property, PropertyFilters, CreatePropertyData
├── booking.ts       # Booking, BookingStatus, CreateBookingData
├── message.ts       # Conversation, Message, CreateConversationData
├── review.ts        # Review, CreateReviewData
└── index.ts         # Export all
```

#### 3.2 Mover Types Existentes
- Mover de `types/auth.ts` a `shared/types/user.ts`
- Consolidar y limpiar

### 4. Refinar Dashboard Base (1 día)

#### 4.1 Mejorar Layout
```typescript
// app/taboleiro/layout.tsx
- Sidebar con navegación mejorada
- Header con user menu
- Breadcrumbs
- Mobile-responsive
```

Estructura de navegación:
```
Dashboard
├── Inicio
├── Minas propiedades (si owner)
│   ├── Listaxe
│   ├── Crear nova
│   └── Calendario
├── Reservas
│   ├── Próximas
│   ├── Pasadas
│   └── Canceladas
├── Mensaxes
├── Valoracións
├── Perfil
└── Configuración
```

#### 4.2 Página Principal Dashboard
```typescript
// app/taboleiro/page.tsx
- Vista general con widgets
- Estadísticas básicas (mock)
- Acciones rápidas
- Notificaciones recientes
```

#### 4.3 Componentes Dashboard
```
components/dashboard/
├── Sidebar.tsx
├── DashboardHeader.tsx
├── StatsCard.tsx
├── QuickActions.tsx
├── RecentActivity.tsx
└── NotificationsList.tsx
```

### 5. Configuración y Utilities (0.5 días)

#### 5.1 Configuración
```typescript
// lib/config.ts
export const APP_CONFIG = {
  MOCK_DELAY_MIN: 300,
  MOCK_DELAY_MAX: 800,
  ITEMS_PER_PAGE: 10,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
}
```

#### 5.2 Utilidades Comunes
```typescript
// lib/utils.ts (ampliar)
export function formatDate(date: string): string
export function formatPrice(price: number): string
export function formatDistance(km: number): string
export function slugify(text: string): string
export function calculateNights(checkIn: string, checkOut: string): number
```

---

## Testing Manual

### Checklist de Pruebas

**Datos Mock**:
- [ ] Todos los JSON files se cargan correctamente
- [ ] No hay errores de formato JSON
- [ ] Los IDs son consistentes entre archivos

**Servicios Mock**:
- [ ] `mockAuth` - Login exitoso
- [ ] `mockAuth` - Login fallido (credenciales incorrectas)
- [ ] `mockAuth` - Registro de usuario
- [ ] `mockProperties` - Obtener todas las propiedades
- [ ] `mockProperties` - Obtener propiedad por ID
- [ ] `mockProperties` - Filtrar propiedades
- [ ] `mockBookings` - Obtener reservas de usuario
- [ ] `mockMessages` - Obtener conversaciones
- [ ] `mockReviews` - Obtener reseñas de propiedad

**Dashboard**:
- [ ] Navegación funciona correctamente
- [ ] Sidebar responsive (mobile)
- [ ] User menu despliega correctamente
- [ ] Página principal carga sin errores
- [ ] Estadísticas se muestran (aunque sean mock)

**TypeScript**:
- [ ] No hay errores de compilación
- [ ] Todos los tipos están bien definidos
- [ ] Imports funcionan correctamente

---

## Criterios de Aceptación

### Funcionales
1. ✅ Todos los archivos JSON mock creados con datos realistas
2. ✅ Todos los servicios mock implementados y funcionando
3. ✅ Dashboard base refinado con navegación completa
4. ✅ Types compartidos definidos y utilizables
5. ✅ Delays de red simulados (300-800ms)
6. ✅ Errores simulados para testing

### Técnicos
1. ✅ Zero errores de TypeScript
2. ✅ Código documentado con JSDoc
3. ✅ Estructura de carpetas clara
4. ✅ README.md en `/mocks` y `/services`
5. ✅ Convenciones de nomenclatura consistentes

### UX
1. ✅ Dashboard responsive
2. ✅ Navegación intuitiva
3. ✅ Loading states visibles
4. ✅ Feedback visual en interacciones

---

## Documentación Requerida

### Archivos a Crear/Actualizar
- [x] `/mocks/README.md` - Explicación de datos mock
- [x] `/services/README.md` - Guía de servicios mock
- [x] `/shared/types/README.md` - Documentación de types
- [x] `/ESTRUCTURA_PROYECTO.md` - Actualizar con nueva estructura
- [ ] `/docs/development/MOCK_SERVICES.md` - Guía de uso

### Comentarios en Código
Cada servicio debe incluir:
```typescript
/**
 * Obtiene todas las propiedades con filtros opcionales
 * 
 * @param filters - Filtros opcionales (ciudad, precio, etc.)
 * @returns Promise con array de propiedades
 * 
 * @example
 * const properties = await getProperties({ city: 'Pontevedra' })
 */
export async function getProperties(filters?: PropertyFilters): Promise<Property[]>
```

---

## Riesgos y Mitigación

### Riesgo 1: Complejidad de Servicios Mock
**Probabilidad**: Media  
**Impacto**: Medio  
**Mitigación**: Empezar simple, añadir funcionalidad gradualmente

### Riesgo 2: Inconsistencia en Datos
**Probabilidad**: Media  
**Impacto**: Alto  
**Mitigación**: Validar IDs cruzados entre archivos JSON

### Riesgo 3: Tipos Incorrectos
**Probabilidad**: Baja  
**Impacto**: Alto  
**Mitigación**: TypeScript strict mode, revisión de tipos

---

## Métricas de Éxito

- ✅ **Servicios mock**: 6 servicios funcionando (auth, properties, bookings, messages, reviews + utils)
- ✅ **Datos mock**: 5 archivos JSON con datos completos
- ✅ **Coverage de types**: 100% de entidades tipadas
- ✅ **Dashboard**: Navegación completa implementada
- ✅ **Tiempo de respuesta**: Delays realistas (300-800ms)
- ✅ **Zero errores**: TypeScript compilation sin errores

---

## Próximos Pasos (Post-Milestone)

Una vez completado este milestone, el equipo podrá:
1. Desarrollar dashboard de propietario (Milestone 02)
2. Construir interfaces con datos mock realistas
3. Testing de flujos completos sin backend
4. Iterar en diseño/UX sin esperar backend

---

## Notas de Implementación

### Prioridad de Desarrollo
1. **Día 1**: Crear todos los JSON mock
2. **Día 2**: Implementar utilities y mockAuth
3. **Día 3**: Implementar mockProperties y mockBookings
4. **Día 4**: Implementar mockMessages y mockReviews, types compartidos
5. **Día 5**: Refinar dashboard, testing, documentación

### Consideraciones Técnicas
- Mantener compatibilidad con código existente
- Los servicios mock deben tener la misma interfaz que las futuras APIs
- Usar async/await consistentemente
- Simular delays para probar estados de carga

---

**Creado**: Octubre 2024  
**Actualizado**: Octubre 2024  
**Responsable**: Equipo de Desarrollo Frontend  
**Milestone Anterior**: Milestone 00 (Autenticación y Base) ✅  
**Siguiente Milestone**: Milestone 02 (Dashboard Propietario - Vista General)

