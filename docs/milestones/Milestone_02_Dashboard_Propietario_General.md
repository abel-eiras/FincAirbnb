# 📊 Milestone 02: Dashboard Propietario - Vista General

## Resumen

**Objetivo**: Crear dashboard principal para propietarios con estadísticas, métricas y acciones rápidas.

**Duración**: 1.5 semanas  
**Prioridad**: Alta  
**Estado**: 📅 Planificado

---

## Objetivos

- Panel principal con estadísticas de negocio
- Gráficos de rendimiento (ocupación, ingresos)
- Lista de próximas reservas
- Acciones rápidas (crear propiedad, gestionar calendar)
- Notificaciones y alertas importantes

---

## Tareas Principales

### 1. Página Principal Dashboard Propietario (3 días)

**Ruta**: `/taboleiro` (para propietarios)

**Componentes**:

```typescript
// app/taboleiro/page.tsx - Vista condicional según role
- Si owner: Vista de propietario
- Si guest: Vista de huésped (Milestone 04)

components/dashboard/owner/
├── OwnerStats.tsx           // Tarjetas de estadísticas
├── RevenueChart.tsx         // Gráfico de ingresos
├── OccupancyChart.tsx       // Gráfico de ocupación
├── UpcomingBookings.tsx     // Próximas reservas
├── RecentActivity.tsx       // Actividad reciente
└── QuickActions.tsx         // Botones de acción rápida
```

**Estadísticas a mostrar**:
- Total de propiedades activas
- Reservas totales (mes actual)
- Ingresos mensuales
- Tasa de ocupación
- Rating promedio
- Tasa de respuesta

### 2. Gráficos y Visualizaciones (2 días)

**Librería**: Recharts (ya instalada)

**Gráficos**:

#### 2.1 Gráfico de Ingresos
```typescript
<LineChart>
  - Últimos 6 meses
  - Ingresos mensuales
  - Comparación año anterior (mock)
</LineChart>
```

#### 2.2 Gráfico de Ocupación
```typescript
<BarChart>
  - Porcentaje de ocupación por mes
  - Últimos 12 meses
</BarChart>
```

#### 2.3 Gráfico de Reservas
```typescript
<AreaChart>
  - Número de reservas por mes
  - Tendencia
</AreaChart>
```

### 3. Próximas Reservas (1 día)

**Componente**: `UpcomingBookings.tsx`

**Features**:
- Lista de próximas 5 reservas
- Información básica (propiedad, fechas, huésped)
- Estado de la reserva
- Acciones rápidas (ver detalle, mensaje)

### 4. Actividad Reciente (1 día)

**Componente**: `RecentActivity.tsx`

**Eventos a mostrar**:
- Nueva reserva
- Nueva valoración
- Nuevo mensaje
- Cancelación
- Pago recibido

### 5. Acciones Rápidas (0.5 días)

**Componente**: `QuickActions.tsx`

**Acciones**:
- Crear nova propiedade
- Ver calendario
- Xestionar reservas
- Responder mensaxes
- Ver valoracións
- Configurar prezos

---

## Datos Mock

```typescript
// services/mockStats.ts
export async function getOwnerStats(ownerId: string) {
  return {
    totalProperties: 3,
    activeProperties: 3,
    monthlyBookings: 8,
    monthlyRevenue: 4500,
    occupancyRate: 75,
    averageRating: 4.8,
    responseRate: 98,
    totalReviews: 45
  }
}

export async function getRevenueData(ownerId: string) {
  // Datos mock de últimos 6 meses
}

export async function getOccupancyData(ownerId: string) {
  // Datos mock de ocupación
}
```

---

## Criterios de Aceptación

**Funcionales**:
1. ✅ Dashboard carga y muestra estadísticas correctas
2. ✅ Gráficos renderizan correctamente
3. ✅ Próximas reservas se muestran ordenadas
4. ✅ Acciones rápidas navegan correctamente
5. ✅ Responsive en mobile

**Técnicos**:
1. ✅ Servicios mock de estadísticas funcionan
2. ✅ Gráficos Recharts integrados
3. ✅ Loading states implementados
4. ✅ Error handling
5. ✅ TypeScript sin errores

**UX**:
1. ✅ Información clara y visible
2. ✅ Colores consistentes con brand
3. ✅ Navegación intuitiva
4. ✅ Feedback visual en interacciones

---

**Milestone Anterior**: 01 - Estructura Mock  
**Siguiente Milestone**: 03 - Dashboard Propietario - Gestión de Propiedades

