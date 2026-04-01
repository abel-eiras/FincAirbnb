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

### 🔄 Milestone 06: Detalle de Finca — EN PROGRESO (≈70%)

**Arquivo**: `Milestone_06_Detalle_Propiedad.md`

Completado:

- [x] Páxina `/fincas/[id]` con galería de fotos (lightbox)
- [x] Información básica (descrición, comodidades, regras, ubicación mock)
- [x] Booking widget sticky (desktop) / fixed bottom (mobile)
- [x] Conversión de ferrados (variable por concello, non constante)

Pendente:

- [ ] Sección de reviews en detalle (compoñente `ReviewsSection` existe pero non integrado)
- [ ] Perfil do propietario (host card con stats)
- [ ] Fincas similares (carousel)
- [ ] SEO / `generateMetadata`

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

### 📅 Milestone 10: Perfiles + Configuración — PENDENTE

**Arquivo**: `Milestone_10_Perfiles_Configuracion.md`

- Perfil público propietario/labrego
- Edición de perfil
- Configuración (conta, notificacións, privacidade)
- Cambio de contrasinal, eliminar conta

**Depende de**: B1 (auth real funcionando)

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

### 📅 B6: Conectar Stats — PENDENTE

Require B1 completado (só propietario)

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
| M06 Detalle finca         | 🔄     | Reviews, host card, similares pendentes |
| M07 Alugamentos           | ✅     |                                         |
| M08 Reviews               | ✅     |                                         |
| M09 Mensaxería            | ✅     |                                         |
| M10 Perfiles              | 📅     | Depende de B1                           |
| B0 Seguridade backend     | ✅     | JWT + bcrypt implementado               |
| B1 Auth FE↔BE             | ✅     | Completado 2026-04-01                   |
| B2 Propiedades            | ✅     | Completado 2026-04-01                   |
| B3 Alugamentos            | ✅     | Completado 2026-04-02                   |
| B4 Mensaxería             | ✅     | Completado 2026-04-02                   |
| B5 Reviews                | ✅     | Completado 2026-04-02                   |
| B6 Stats                  | 📅     |                                         |

---

**Última actualización**: 2026-04-02
