# Milestones — FincAirbnb

## Estado Real (actualizado 2026-04-01)

Esta carpeta contiene los milestones de desarrollo de FincAirbnb. El proyecto tiene **dos fases**: frontend con datos mock (M00–M10) y backend + integración real (B0–B6).

---

## Fase Frontend — Mock UI

### ✅ Milestone 00: Autenticación y Base — COMPLETADO

- Sistema registro / login / logout con mock
- Recuperación de contraseña (mock)
- Dashboard base con protección de rutas
- Context API para auth (`AuthContext.tsx`)

### ✅ Milestone 01: Estructura Mock + Dashboard Base — COMPLETADO

- 7 archivos JSON en `/mocks/` (users, properties, bookings, messages, reviews, alugamentos, templates)
- 11 servicios mock en `/services/` con patrón `isExternalApiEnabled()`
- Types compartidos en `/shared/types/`

### ✅ Milestone 02: Dashboard Propietario — Vista General — COMPLETADO

- `/taboleiro` con estadísticas, gráficos (Recharts), próximas reservas
- Componentes: `OwnerStats`, `RevenueChart`, `OccupancyChart`, `UpcomingBookings`, `RecentActivity`

### ✅ Milestone 03: Xestión de Propiedades — COMPLETADO

- CRUD completo de fincas con formulario multi-step (5 pasos)
- Gestión de fotos mock, calendario de disponibilidad
- Rutas: `/taboleiro/minas-fincas`, `/taboleiro/fincas/crear`, `/taboleiro/fincas/[id]/editar`

### ✅ Milestone 04: Dashboard Labrego (Cliente) — COMPLETADO

- Dashboard huésped con mis alugamentos, favoritas, avaliaciones pendentes
- Rutas: `/taboleiro` (vista labrego), `/taboleiro/mos-alugamentos`

### ✅ Milestone 05: Catálogo de Fincas + Busca — COMPLETADO

- Catálogo público `/fincas` con busca por texto, filtros, ordenación
- Búsqueda conectada a `GET /api/properties/search/all` (backend listo)

### ✅ Milestone 06: Detalle de Finca — COMPLETADO (2026-04-02)

**Arquivo**: `Milestone_06_Detalle_Propiedad.md`

- [x] Páxina `/fincas/[id]` con galería de fotos (lightbox)
- [x] Información básica (descrición, comodidades, regras, ubicación mock)
- [x] Booking widget sticky (desktop) / fixed bottom (mobile)
- [x] Conversión de ferrados (variable por concello, non constante)
- [x] Sección de reviews con `ReviewsSection` conectada a `useAuth`
- [x] Host card: perfil do propietario con avatar, bio, localización e botón contactar
- [x] Fincas similares: top 3 da mesma provincia con foto, prezo, rating e tipo
- [x] SEO: `generateMetadata` dinámico en `layout.tsx` con OpenGraph

### ✅ Milestone 07: Sistema de Alugamentos — COMPLETADO

- Fluxo completo: widget → `/alugamentos/solicitar` → `/alugamentos/[id]/confirmacion`
- Xestión owner: `/taboleiro/alugamentos-recibidos`
- Cálculo de prezo mock, validación de datas

### ✅ Milestone 08: Sistema de Reviews — COMPLETADO

- Formulario valoración: `/alugamentos/[id]/valorar`
- `ReviewCard`, `RatingBreakdown`, `CategoryRatings`, `ReviewResponse`, helpful votes
- Respostas de propietario implementadas

### ✅ Milestone 09: Sistema de Mensaxería — COMPLETADO

- Inbox `/taboleiro/mensaxes` con conversacións e thread
- Plantillas de mensaxes para propietarios (`/taboleiro/mensaxes/modelos`)
- `MessageThread`, `TemplateSelector`, notificacións

### ✅ Milestone 10: Perfiles + Configuración — COMPLETADO (2026-04-02)

**Arquivo**: `Milestone_10_Perfiles_Configuracion.md`

- [x] Perfil público `/perfil/[id]` — avatar, bio, stats, fincas do propietario
- [x] Edición de perfil `/taboleiro/perfil` — nome, bio, teléfono, localización, avatar
- [x] Configuración `/taboleiro/configuracion` — notificacións, cambio de contrasinal, eliminar conta
- [x] `updateUser()` en AuthContext para sincronizar sesión tras edición
- [x] `changePassword()` e `deleteAccount()` en `mockAuth.ts` con `isExternalApiEnabled()` branch

---

## Fase Backend + Integración Real

### ✅ B0: Seguridade Backend — COMPLETADO (2026-04-01)

- JWT real con `jsonwebtoken` (`jwt.sign({ id, role }, JWT_SECRET)`)
- Passwords con `bcryptjs` (salt 12)
- Middleware `validateToken` + `checkRole` en `shared/middleware/auth.ts`
- Todas las rutas protegidas (propiedades e reviews: GET público, mutacións auth)
- `openapi.yaml` v0.3.0 con `BearerAuth` scheme

### ✅ B1: Conectar Auth FE ↔ BE — COMPLETADO (2026-04-01)

- [x] `apiClient.ts` envía `Authorization: Bearer` desde localStorage
- [x] MongoDB correndo (Docker: `mongo-fincairbnb`)
- [x] Backend arrancado en `localhost:4000`
- [x] Seed con bcrypt + IDs remapeados (`npm run seed:mocks`)
- [x] `NEXT_PUBLIC_USE_EXTERNAL_API=true` en frontend `.env`
- [x] Login real verificado: `POST /auth/login` → JWT ✅
- [x] `GET /auth/me` con Bearer → usuario correcto ✅
- [x] `serializeDoc` mapea `_id → id` en todas las respostas

### ✅ B2: Conectar Propiedades — COMPLETADO (2026-04-01)

- [x] `GET /api/properties` — catálogo público con `id` correcto
- [x] `GET /api/properties/:id` — detalle por MongoDB `_id` (`findById`)
- [x] `GET /api/properties/owner/:ownerId` — fincas do propietario autenticado
- [x] `GET /api/properties/search/all?q=` — busca por texto
- [x] POST/PATCH/DELETE protexidos con `validateToken`
- [x] IDs de relación remapeados no seed (ownerId real MongoDB)
- [x] `openapi.yaml` v0.3.3

### ✅ B3: Conectar Alugamentos — COMPLETADO (2026-04-02)

- [x] Rutas backend implementadas e protexidas con `validateToken`
- [x] `serializeDocs` aplicado a todas as respostas
- [x] `labregoId` remapeado no seed
- [x] `GET /alugamentos/owner/:ownerId` engadido ao backend
- [x] `getAlugamentosByOwner` + `updateAlugamentoStatus` no servizo FE
- [x] `mos-alugamentos/page.tsx` refactorizado: usa `getAlugamentosByLabrego(user.id)` (elimina localStorage)
- [x] `alugamentos-recibidos/page.tsx` refactorizado: usa `getAlugamentosByOwner(user.id)` (elimina localStorage)
- [x] Contrato de tipos `Alugamento` FE ↔ BE verificado e aliñado
- [x] Status values aliñados: `confirmado / completado / cancelado`
- ⚠️ Pendente: `solicitar/page.tsx` aínda usa localStorage para crear (M07)

### ✅ B4: Conectar Mensaxería — COMPLETADO (2026-04-02)

- [x] `getConversations(user.id)` xa usaba `isExternalApiEnabled()` ✅
- [x] `sendMessage()` xa tiña branch real ✅
- [x] Enriquecemento localStorage → `getProperty()` + `getUserById()` (novo servizo)
- [x] `handleSendMessage` usa `sendMessage()` en vez de localStorage
- [x] `mockUsers.ts` con `getUserById` (chama `GET /users/:id`)

### ✅ B5: Conectar Reviews — COMPLETADO (2026-04-02)

- [x] `getPropertyReviews`, `createReview`, `respondToReview`, `markReviewHelpful` xa tiñan branches reais ✅
- [x] `ReviewForm` e `ReviewsSection` xa usaban os servizos ✅
- [x] `getPendingReviews`: engadido `isExternalApiEnabled()` branch con `GET /alugamentos/labrego/:id` + `GET /reviews`
- [x] `valorar/page.tsx`: substituído localStorage por `getAlugamentoById` + `getProperty`
- [x] Correxido campo de autorización: `labregoData.email` → `labregoId`
- [x] Correxido campo de data: `endDate` → `finCultivo`

### ✅ B7: Auth Avanzado + Cascade Delete — COMPLETADO (2026-04-02)

- [x] `POST /auth/change-password` — verifica contrasinal actual, hashea nova
- [x] `PATCH /users/:id` — bloquea actualización de password por CRUD xenérico
- [x] `DELETE /users/:id` — cascade delete (propiedades, alugamentos, reviews, conversacións)
- [x] Frontend `changePassword()` e `deleteAccount()` conectados á API real

### ✅ B8: Stats Aggregation — COMPLETADO (2026-04-02)

- [x] `GET /stats/revenue/:ownerId` — ingresos últimos 6 meses por mes (MongoDB)
- [x] `GET /stats/occupancy/:ownerId` — ocupación últimos 12 meses
- [x] `GET /stats/bookings/:ownerId` — evolución alugamentos últimos 12 meses
- [x] `GET /stats/activity/:ownerId` — actividade recente top 10
- [x] Frontend: `getRevenueData`, `getOccupancyData`, `getBookingsData`, `getRecentActivity` conectados

### ⏳ B3-FIX: Deuda Técnica — Solicitar Alugamento vía API — PENDENTE

**Arquivo**: `Milestone_B3fix_Solicitar_API.md`

- [ ] `createAlugamento()` en `services/mockAlugamentos.ts` con branch real (`POST /alugamentos`)
- [ ] `solicitar/page.tsx`: substituír localStorage por `createAlugamento()` + `useAuth`
- [ ] `confirmacion/page.tsx`: substituír localStorage por `getAlugamentoById(id)`

### ⏳ B9: Pagos con Stripe — PENDENTE

**Arquivo**: `Milestone_B9_Pagos_Stripe.md`

- [ ] Backend: módulo `/payments` con `create-intent` e webhook
- [ ] Frontend: `@stripe/react-stripe-js`, páxina `/alugamentos/[id]/pagar`
- [ ] Webhook: alugamento pasa a `confirmado` tras pago exitoso
- [ ] Badge de estado de pago en `/taboleiro/mos-alugamentos`

### ⏳ B10: Sistema de Notificacións — PENDENTE

**Arquivo**: `Milestone_B10_Notificacions.md`

- [ ] Backend: modelo `Notification`, módulo `/notifications`, helper `createNotification`
- [ ] Disparadores: nova solicitude, aceptación, pago, mensaxe, avaliación
- [ ] Frontend: `NotificationBell` con badge no Header, `NotificationPanel` dropdown
- [ ] Hook `useNotifications` con polling cada 30s

### ⏳ B11: Upload de Fotos Real (Cloudinary) — PENDENTE

**Arquivo**: `Milestone_B11_Upload_Fotos.md`

- [ ] Backend: módulo `/uploads` con signed URL e delete
- [ ] Frontend: `PhotoUploader` con drag & drop, preview e progreso
- [ ] Integrar no formulario multi-step (paso 3 de creación/edición de finca)
- [ ] `next/image` configurado para dominio `res.cloudinary.com`

### ✅ B6: Conectar Stats — COMPLETADO (2026-04-02)

- [x] `getOwnerStats(ownerId)` → `GET /stats/owner/:ownerId` xa conectado ✅
- [x] `getUpcomingBookings(ownerId)` → `GET /alugamentos/owner/:ownerId` (filtra confirmados futuros, top 5)
- [x] `taboleiro/page.tsx` usa correctamente as funcións de stats ✅
- ⚠️ Sen endpoint BE: `getRevenueData`, `getOccupancyData`, `getBookingsData`, `getRecentActivity` → retornan datos mock (endpoints de agregación pendentes para producción)

---

## Progreso Global

| Milestone                 | Estado | Notas                                   |
|---------------------------|--------|-----------------------------------------|
| M00 Auth base             | ✅     |                                         |
| M01 Mock + dashboard      | ✅     |                                         |
| M02 Dashboard propietario | ✅     |                                         |
| M03 Xestión propiedades   | ✅     |                                         |
| M04 Dashboard labrego     | ✅     |                                         |
| M05 Catálogo + busca      | ✅     |                                         |
| M06 Detalle finca         | ✅     | Completado 2026-04-02                   |
| M07 Alugamentos           | ✅     |                                         |
| M08 Reviews               | ✅     |                                         |
| M09 Mensaxería            | ✅     |                                         |
| M10 Perfiles              | ✅     | Completado 2026-04-02                   |
| B0 Seguridade backend     | ✅     | JWT + bcrypt implementado               |
| B1 Auth FE↔BE             | ✅     | Completado 2026-04-01                   |
| B2 Propiedades            | ✅     | Completado 2026-04-01                   |
| B3 Alugamentos            | ✅     | Completado 2026-04-02                   |
| B4 Mensaxería             | ✅     | Completado 2026-04-02                   |
| B5 Reviews                | ✅     | Completado 2026-04-02                   |
| B6 Stats                  | ✅     | Completado 2026-04-02                   |
| B7 Auth avanzado          | ✅     | Completado 2026-04-02                   |
| B8 Stats aggregation      | ✅     | Completado 2026-04-02                   |
| B3-FIX Solicitar vía API  | ✅     | Completado 2026-04-02                   |
| B9 Pagos Stripe           | ✅     | Completado 2026-04-02                   |
| B10 Notificacións         | ✅     | Completado 2026-04-02                   |
| B11 Upload fotos          | ✅     | Completado 2026-04-02                   |

---

**Última actualización**: 2026-04-02 (B3-FIX, B9, B10, B11 completados — TypeScript ✅ sen erros)
