/**
 * Booking Types - FincAirbnb
 * 
 * Tipos relacionados con reservas
 */

// Estados de una reserva
export type BookingStatus = 
  | 'pending'      // Esperando aprobación del propietario
  | 'confirmed'    // Confirmada por el propietario
  | 'paid'         // Pagada
  | 'checked_in'   // Huésped ya llegó
  | 'checked_out'  // Huésped salió
  | 'completed'    // Reserva finalizada
  | 'cancelled'    // Cancelada
  | 'declined';    // Rechazada por propietario

// Estados de pago
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

/**
 * Detalles de huéspedes en la reserva
 */
export interface GuestDetails {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

/**
 * Desglose de precios de la reserva
 */
export interface PricingBreakdown {
  basePrice: number;      // Precio por noche/mes
  nights: number;
  subtotal: number;       // basePrice × nights
  cleaningFee: number;
  serviceFee: number;     // Tarifa de plataforma
  taxes: number;
  discount?: number;
  total: number;
}

/**
 * Detalles de cancelación
 */
export interface CancellationDetails {
  cancelledBy: 'guest' | 'owner' | 'admin';
  reason: string;
  refundAmount: number;
}

/**
 * Reserva completa
 */
export interface Booking {
  id: string;
  propertyId: string;
  guestId: string;
  ownerId: string;
  
  // Fechas
  checkInDate: string;  // Formato: YYYY-MM-DD
  checkOutDate: string;
  nights: number;
  
  // Huéspedes
  numberOfGuests: number;
  guestDetails?: GuestDetails;
  
  // Precio
  pricing: PricingBreakdown;
  
  // Estado
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  
  // Detalles adicionales
  specialRequests?: string;
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  cancellationDetails?: CancellationDetails;
  
  // Timestamps
  createdAt: string;
  confirmedAt?: string;
  paidAt?: string;
  cancelledAt?: string;
  completedAt?: string;
}

/**
 * Datos para crear nueva reserva
 */
export interface CreateBookingData {
  propertyId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  guestDetails?: GuestDetails;
  specialRequests?: string;
}

/**
 * Día del calendario de disponibilidad
 */
export interface CalendarDay {
  date: string; // YYYY-MM-DD
  available: boolean;
  price?: number; // Precio para ese día (si override)
  bookingId?: string; // Si está reservado
  blocked?: boolean; // Bloqueado manualmente por el owner
}

/**
 * Filtros para buscar reservas
 */
export interface BookingFilters {
  status?: BookingStatus | BookingStatus[];
  startDate?: string;
  endDate?: string;
  propertyId?: string;
}

