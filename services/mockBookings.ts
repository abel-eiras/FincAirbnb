/**
 * Mock Bookings Service - FincAirbnb
 * 
 * Servicio que simula operaciones de reservas
 */

import type { Booking, CreateBookingData, CalendarDay, BookingFilters } from '@/shared/types';
import { delay, loadMockData, generateId, calculateDays } from './utils';

/**
 * Obtiene las reservas de un usuario (como huésped o propietario)
 * 
 * @param userId - ID del usuario
 * @param role - 'guest' (reservas hechas) o 'owner' (reservas recibidas)
 * @returns Promise con array de reservas
 */
export async function getUserBookings(
  userId: string,
  role: 'guest' | 'owner'
): Promise<Booking[]> {
  await delay();
  
  const bookings = await loadMockData<Booking>('bookings');
  
  // Filtrar según el rol
  if (role === 'guest') {
    return bookings.filter(b => b.guestId === userId);
  } else {
    return bookings.filter(b => b.ownerId === userId);
  }
}

/**
 * Obtiene una reserva específica por ID
 * 
 * @param id - ID de la reserva
 * @returns Promise con la reserva o error si no existe
 */
export async function getBooking(id: string): Promise<Booking> {
  await delay();
  
  const bookings = await loadMockData<Booking>('bookings');
  const booking = bookings.find(b => b.id === id);
  
  if (!booking) {
    throw new Error('Reserva non atopada');
  }
  
  return booking;
}

/**
 * Obtiene todas las reservas de una propiedad
 * 
 * @param propertyId - ID de la propiedad
 * @param filters - Filtros opcionales (por estado, fechas)
 * @returns Promise con array de reservas
 */
export async function getPropertyBookings(
  propertyId: string,
  filters?: BookingFilters
): Promise<Booking[]> {
  await delay();
  
  let bookings = await loadMockData<Booking>('bookings');
  
  // Filtrar por propiedad
  bookings = bookings.filter(b => b.propertyId === propertyId);
  
  // Aplicar filtros adicionales si existen
  if (filters) {
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      bookings = bookings.filter(b => statuses.includes(b.status));
    }
    
    if (filters.startDate) {
      bookings = bookings.filter(b => b.checkInDate >= filters.startDate!);
    }
    
    if (filters.endDate) {
      bookings = bookings.filter(b => b.checkOutDate <= filters.endDate!);
    }
  }
  
  return bookings;
}

/**
 * Crea una nueva reserva (MOCK)
 * 
 * @param data - Datos de la reserva
 * @returns Promise con la reserva creada
 */
export async function createBooking(data: CreateBookingData): Promise<Booking> {
  await delay();
  
  // Calcular número de noches
  const nights = calculateDays(data.checkInDate, data.checkOutDate);
  
  // En un mock simple, necesitaríamos obtener el precio de la propiedad
  // Por ahora, creamos una reserva básica
  const newBooking: Booking = {
    id: generateId('book'),
    ...data,
    ownerId: '', // Se obtendría de la propiedad
    nights,
    pricing: {
      basePrice: 0,
      nights,
      subtotal: 0,
      cleaningFee: 0,
      serviceFee: 0,
      taxes: 0,
      total: 0,
    },
    status: 'pending',
    paymentStatus: 'pending',
    cancellationPolicy: 'moderate',
    createdAt: new Date().toISOString(),
  };
  
  // Guardar en localStorage
  const bookings = await loadMockData<Booking>('bookings');
  bookings.push(newBooking);
  saveToLocalStorage('bookings', bookings);
  
  return newBooking;
}

/**
 * Actualiza una reserva existente (MOCK)
 * 
 * @param id - ID de la reserva
 * @param data - Datos a actualizar
 * @returns Promise con la reserva actualizada
 */
export async function updateBooking(
  id: string,
  data: Partial<Booking>
): Promise<Booking> {
  await delay();
  
  const bookings = await loadMockData<Booking>('bookings');
  const index = bookings.findIndex(b => b.id === id);
  
  if (index === -1) {
    throw new Error('Reserva non atopada');
  }
  
  const updated = {
    ...bookings[index],
    ...data,
  };
  
  bookings[index] = updated;
  saveToLocalStorage('bookings', bookings);
  
  return updated;
}

/**
 * Cancela una reserva (MOCK)
 * 
 * @param id - ID de la reserva
 * @param reason - Motivo de la cancelación
 * @returns Promise con la reserva cancelada
 */
export async function cancelBooking(id: string, reason: string): Promise<Booking> {
  await delay();
  
  const bookings = await loadMockData<Booking>('bookings');
  const index = bookings.findIndex(b => b.id === id);
  
  if (index === -1) {
    throw new Error('Reserva non atopada');
  }
  
  // Calcular reembolso según política (simplificado)
  const refundAmount = bookings[index].pricing.total * 0.5; // 50% de ejemplo
  
  const cancelled: Booking = {
    ...bookings[index],
    status: 'cancelled',
    paymentStatus: 'refunded',
    cancelledAt: new Date().toISOString(),
    cancellationDetails: {
      cancelledBy: 'guest',
      reason,
      refundAmount,
    },
  };
  
  bookings[index] = cancelled;
  saveToLocalStorage('bookings', bookings);
  
  return cancelled;
}

/**
 * Obtiene la disponibilidad de una propiedad para un mes
 * 
 * @param propertyId - ID de la propiedad
 * @param year - Año
 * @param month - Mes (1-12)
 * @returns Promise con array de días del calendario
 */
export async function getAvailability(
  propertyId: string,
  year: number,
  month: number
): Promise<CalendarDay[]> {
  await delay();
  
  // Obtener reservas de la propiedad
  const bookings = await getPropertyBookings(propertyId, {
    status: ['confirmed', 'paid'],
  });
  
  // Generar días del mes
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendar: CalendarDay[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Verificar si hay reserva en esta fecha
    const booking = bookings.find(b => 
      date >= b.checkInDate && date < b.checkOutDate
    );
    
    calendar.push({
      date,
      available: !booking,
      bookingId: booking?.id,
      blocked: false,
    });
  }
  
  return calendar;
}

// Helper para guardar en localStorage
function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(`fincairbnb_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

