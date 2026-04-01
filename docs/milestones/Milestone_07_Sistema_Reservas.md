# 📅 Milestone 07: Sistema de Reservas (UI Mock)

## Resumen
**Objetivo**: Flujo completo de reserva con cálculo de precios, confirmación y gestión mock.

**Duración**: 2 semanas | **Prioridad**: Alta | **Estado**: ✅ Completado

---

## Objetivos
- Flujo de reserva completo (desde propiedad hasta confirmación)
- Selector de fechas con calendario
- Cálculo automático de precio
- Formulario de detalles de reserva
- Página de confirmación
- Gestión de reservas (ver, modificar mock, cancelar)

---

## Tareas

### 1. Flujo de Reserva

**Steps**:
1. Booking widget en detalle de propiedad
2. Seleccionar fechas y huéspedes
3. Review booking page (`/reservas/nova`)
4. Mock payment (simular pago sin cobro real)
5. Confirmación (`/reservas/[id]/confirmacion`)

### 2. Componentes

```
components/booking/
├── BookingWidget.tsx       # Widget en property detail
├── DateRangePicker.tsx     # Selector de fechas
├── GuestSelector.tsx       # Selector de huéspedes
├── PriceBreakdown.tsx      # Desglose de precio
├── BookingForm.tsx         # Formulario principal
├── BookingReview.tsx       # Review antes de confirmar
├── BookingConfirmation.tsx # Página de confirmación
└── BookingCard.tsx         # Tarjeta de reserva
```

### 3. Páginas

#### `/reservas/nova`
- Resumen de propiedad
- Detalles de reserva (fechas, huéspedes)
- Solicitudes especiales (textarea)
- Política de cancelación
- Desglose de precio
- Mock payment button

#### `/reservas/[id]`
- Detalles completos
- Estado de reserva
- Acciones (mensaje, modificar, cancelar)
- Información del propietario
- Instrucciones de check-in (si próxima)

#### `/reservas/[id]/confirmacion`
- Mensaje de éxito
- Número de confirmación
- Detalles de reserva
- Próximos pasos
- Botones (ver reserva, mensaje al propietario)

### 4. Lógica de Negocio Mock

**Cálculo de Precio**:
```typescript
function calculatePrice(
  basePrice: number,
  nights: number,
  isWeekend: boolean,
  cleaningFee: number
) {
  const nightlyRate = isWeekend ? weekendPrice : basePrice
  const subtotal = nightlyRate * nights
  const serviceFee = subtotal * 0.10
  const taxes = (subtotal + serviceFee) * 0.10
  const total = subtotal + cleaningFee + serviceFee + taxes
  
  return { subtotal, cleaningFee, serviceFee, taxes, total }
}
```

**Validaciones**:
- Check-out > Check-in
- Cumple minimum stay
- Número de huéspedes ≤ capacidad
- Fechas no bloqueadas

### 5. Gestión de Reservas Owner

**Página**: `/taboleiro/reservas-recibidas`

**Features**:
- Vista calendario
- Vista lista
- Filtros por estado
- Aceptar/rechazar (si no instant book)
- Ver detalles
- Mensaje a huésped
- Export a CSV (futuro)

---

## Datos Mock

```typescript
// Al crear reserva nueva, añadir a bookings.json (localStorage)
// Simular estados de reserva
// Calcular disponibilidad basado en bookings existentes
```

---

## Criterios de Aceptación
1. ✅ Flujo completo funcional
2. ✅ Cálculos de precio correctos
3. ✅ Validaciones funcionando
4. ✅ Confirmación clara
5. ✅ Gestión de reservas (owner)
6. ✅ Mobile responsive

**Milestone Anterior**: 06 | **Siguiente**: 08

