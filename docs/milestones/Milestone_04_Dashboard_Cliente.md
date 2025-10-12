# 🌾 Milestone 04: Dashboard do Labrego/Labrega

## Resumen
**Objetivo**: Dashboard para labregos/labregas con as súas fincas alugadas, favoritas e próximas estancias mensuais.

**Duración**: 1 semana | **Prioridad**: Media | **Estado**: 📅 Planificado

---

## Objetivos
- Vista principal dashboard labrego/labrega
- As miñas fincas alugadas (próximas, pasadas, canceladas)
- Fincas favoritas para cultivar
- Accións rápidas (buscar, mensaxear, avaliar fincas)

---

## Tareas

### 1. Dashboard Principal (`/taboleiro` - vista guest)
**Componentes**:
- `GuestDashboard.tsx`
- `UpcomingTrips.tsx` - Próximos viajes
- `FavoriteProperties.tsx` - Favoritas
- `ReviewsPending.tsx` - Reviews pendientes
- `QuickSearch.tsx` - Búsqueda rápida

### 2. Mis Reservas (`/taboleiro/reservas`)
**Tabs**:
- Próximas
- Pasadas
- Canceladas

**Features**:
- Ver detalles de reserva
- Modificar reserva (futuro)
- Cancelar reserva
- Descargar confirmación
- Mensaje al propietario
- Dejar review (si pasada)

### 3. Favoritas (`/taboleiro/favoritas`)
- Lista de propiedades guardadas (mock)
- Eliminar de favoritas
- Buscar en favoritas
- Ordenar

### 4. Reviews Pendientes
- Lista de reservas completadas sin review
- Botón rápido para valorar
- Notificación si hay pendientes

---

## Datos Mock
```typescript
// Usar bookings.json filtrado por guestId
// Añadir campo "favorite" a properties
```

---

## Criterios de Aceptación
1. ✅ Vista específica para huéspedes
2. ✅ Reservas organizadas por estado
3. ✅ Sistema de favoritas funcional
4. ✅ Reviews pendientes visibles

**Milestone Anterior**: 03 | **Siguiente**: 05

