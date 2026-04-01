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

### 🔄 B1: Conectar Auth FE ↔ BE — EN PROGRESO

- [x] `apiClient.ts` envía `Authorization: Bearer` desde localStorage
- [x] MongoDB correndo (Docker: `mongo-fincairbnb`)
- [x] Backend arrancado en `localhost:4000`
- [ ] Seed de datos mock en MongoDB (`npm run seed:mocks`)
- [ ] Verificar `/acceder` con credenciais reais → JWT devolto
- [ ] Cambiar `NEXT_PUBLIC_USE_EXTERNAL_API=true` en frontend `.env`

### 📅 B2: Conectar Propiedades — PENDENTE

- GET público xa funciona (non require token)
- Verificar contrato `{ success: bool, data: T }` con tipos frontend

### 📅 B3: Conectar Alugamentos — PENDENTE

Require B1 completado (rutas protexidas)

### 📅 B4: Conectar Mensaxería — PENDENTE

Require B1 completado

### 📅 B5: Conectar Reviews — PENDENTE

GETs públicos xa listos; mutacións requiren B1

### 📅 B6: Conectar Stats — PENDENTE

Require B1 completado (só propietario)

---

## Progreso Global

| Milestone | Estado | Notas |
|-----------|--------|-------|
| M00 Auth base | ✅ | |
| M01 Mock + dashboard | ✅ | |
| M02 Dashboard propietario | ✅ | |
| M03 Xestión propiedades | ✅ | |
| M04 Dashboard labrego | ✅ | |
| M05 Catálogo + busca | ✅ | |
| M06 Detalle finca | 🔄 | Reviews, host card, similares pendentes |
| M07 Alugamentos | ✅ | |
| M08 Reviews | ✅ | |
| M09 Mensaxería | ✅ | |
| M10 Perfiles | 📅 | Depende de B1 |
| B0 Seguridade backend | ✅ | JWT + bcrypt implementado |
| B1 Auth FE↔BE | 🔄 | Seed + .env pendente |
| B2–B6 Módulos restantes | 📅 | En orde tras B1 |

---

**Última actualización**: 2026-04-01
