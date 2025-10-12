/**
 * Mock Stats Service - FincAirbnb
 * 
 * Servicio que simula estadísticas y métricas del propietario
 * En producción, estos datos vendrían de la API real con cálculos en tiempo real
 */

import { delay, generateId } from './utils';

/**
 * Estadísticas generales del propietario
 */
export interface OwnerStats {
  totalProperties: number;
  activeProperties: number;
  monthlyBookings: number;
  monthlyRevenue: number;
  occupancyRate: number;
  averageRating: number;
  responseRate: number;
  totalReviews: number;
  yearlyRevenue: number;
  totalBookings: number;
  cancellationRate: number;
}

/**
 * Datos para gráfico de ingresos (últimos 6 meses)
 */
export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
  averagePrice: number;
}

/**
 * Datos para gráfico de ocupación (últimos 12 meses)
 */
export interface OccupancyData {
  month: string;
  occupancyRate: number;
  availableDays: number;
  bookedDays: number;
}

/**
 * Datos para gráfico de reservas (últimos 12 meses)
 */
export interface BookingsData {
  month: string;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

/**
 * Actividad reciente del propietario
 */
export interface RecentActivity {
  id: string;
  type: 'booking' | 'review' | 'message' | 'payment' | 'cancellation';
  title: string;
  description: string;
  timestamp: string;
  propertyName?: string;
  amount?: number;
  rating?: number;
}

/**
 * Obtiene las estadísticas generales del propietario
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con estadísticas calculadas
 */
export async function getOwnerStats(ownerId: string): Promise<OwnerStats> {
  await delay(800);
  
  // Simular cálculos basados en datos reales
  // En producción, esto haría queries a la base de datos
  return {
    totalProperties: 3,
    activeProperties: 3,
    monthlyBookings: 8,
    monthlyRevenue: 4500,
    occupancyRate: 75,
    averageRating: 4.8,
    responseRate: 98,
    totalReviews: 45,
    yearlyRevenue: 52000,
    totalBookings: 127,
    cancellationRate: 5,
  };
}

/**
 * Obtiene datos de ingresos de los últimos 6 meses
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con datos de ingresos por mes
 */
export async function getRevenueData(ownerId: string): Promise<RevenueData[]> {
  await delay(600);
  
  // Datos mock realistas para los últimos 6 meses
  const months = [
    { month: 'Mai', revenue: 4200, bookings: 7, averagePrice: 600 },
    { month: 'Xuñ', revenue: 3800, bookings: 6, averagePrice: 633 },
    { month: 'Xul', revenue: 5600, bookings: 9, averagePrice: 622 },
    { month: 'Ago', revenue: 6100, bookings: 10, averagePrice: 610 },
    { month: 'Set', revenue: 4800, bookings: 8, averagePrice: 600 },
    { month: 'Out', revenue: 4500, bookings: 8, averagePrice: 563 },
  ];
  
  return months;
}

/**
 * Obtiene datos de ocupación de los últimos 12 meses
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con datos de ocupación por mes
 */
export async function getOccupancyData(ownerId: string): Promise<OccupancyData[]> {
  await delay(600);
  
  // Datos mock realistas para los últimos 12 meses
  const months = [
    { month: 'Nov 2023', occupancyRate: 45, availableDays: 22, bookedDays: 18 },
    { month: 'Dec 2023', occupancyRate: 35, availableDays: 20, bookedDays: 14 },
    { month: 'Xan 2024', occupancyRate: 25, availableDays: 31, bookedDays: 12 },
    { month: 'Feb 2024', occupancyRate: 40, availableDays: 28, bookedDays: 16 },
    { month: 'Mar 2024', occupancyRate: 55, availableDays: 31, bookedDays: 22 },
    { month: 'Abr 2024', occupancyRate: 70, availableDays: 30, bookedDays: 28 },
    { month: 'Mai 2024', occupancyRate: 75, availableDays: 31, bookedDays: 25 },
    { month: 'Xuñ 2024', occupancyRate: 80, availableDays: 30, bookedDays: 26 },
    { month: 'Xul 2024', occupancyRate: 85, availableDays: 31, bookedDays: 28 },
    { month: 'Ago 2024', occupancyRate: 90, availableDays: 31, bookedDays: 30 },
    { month: 'Set 2024', occupancyRate: 75, availableDays: 30, bookedDays: 25 },
    { month: 'Out 2024', occupancyRate: 70, availableDays: 31, bookedDays: 22 },
  ];
  
  return months;
}

/**
 * Obtiene datos de reservas de los últimos 12 meses
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con datos de reservas por mes
 */
export async function getBookingsData(ownerId: string): Promise<BookingsData[]> {
  await delay(600);
  
  // Datos mock realistas para los últimos 12 meses
  const months = [
    { month: 'Nov 2023', totalBookings: 15, confirmedBookings: 12, cancelledBookings: 3 },
    { month: 'Dec 2023', totalBookings: 12, confirmedBookings: 10, cancelledBookings: 2 },
    { month: 'Xan 2024', totalBookings: 8, confirmedBookings: 7, cancelledBookings: 1 },
    { month: 'Feb 2024', totalBookings: 14, confirmedBookings: 12, cancelledBookings: 2 },
    { month: 'Mar 2024', totalBookings: 18, confirmedBookings: 16, cancelledBookings: 2 },
    { month: 'Abr 2024', totalBookings: 22, confirmedBookings: 20, cancelledBookings: 2 },
    { month: 'Mai 2024', totalBookings: 25, confirmedBookings: 23, cancelledBookings: 2 },
    { month: 'Xuñ 2024', totalBookings: 28, confirmedBookings: 26, cancelledBookings: 2 },
    { month: 'Xul 2024', totalBookings: 30, confirmedBookings: 28, cancelledBookings: 2 },
    { month: 'Ago 2024', totalBookings: 32, confirmedBookings: 30, cancelledBookings: 2 },
    { month: 'Set 2024', totalBookings: 26, confirmedBookings: 24, cancelledBookings: 2 },
    { month: 'Out 2024', totalBookings: 24, confirmedBookings: 22, cancelledBookings: 2 },
  ];
  
  return months;
}

/**
 * Obtiene la actividad reciente del propietario
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con lista de actividades recientes
 */
export async function getRecentActivity(ownerId: string): Promise<RecentActivity[]> {
  await delay(500);
  
  // Actividades mock realistas de los últimos días
  return [
    {
      id: generateId('activity'),
      type: 'booking',
      title: 'Nova reserva confirmada',
      description: 'Finca do Val - 15-18 Novembro',
      timestamp: '2024-10-15T10:30:00Z',
      propertyName: 'Finca do Val',
      amount: 650,
    },
    {
      id: generateId('activity'),
      type: 'review',
      title: 'Nova valoración recibida',
      description: '5 estrelas de María González',
      timestamp: '2024-10-14T16:45:00Z',
      propertyName: 'Pazo de Salnés',
      rating: 5,
    },
    {
      id: generateId('activity'),
      type: 'message',
      title: 'Nova mensaxe',
      description: 'Consulta sobre disponibilidade',
      timestamp: '2024-10-14T09:20:00Z',
      propertyName: 'Cortiña das Flores',
    },
    {
      id: generateId('activity'),
      type: 'payment',
      title: 'Pago recibido',
      description: 'Reserva Finca do Val - 450€',
      timestamp: '2024-10-13T14:15:00Z',
      propertyName: 'Finca do Val',
      amount: 450,
    },
    {
      id: generateId('activity'),
      type: 'booking',
      title: 'Reserva cancelada',
      description: 'Cortiña das Flores - 20-22 Novembro',
      timestamp: '2024-10-12T11:30:00Z',
      propertyName: 'Cortiña das Flores',
      amount: 320,
    },
  ];
}

/**
 * Obtiene las próximas reservas del propietario
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con próximas reservas
 */
export async function getUpcomingBookings(ownerId: string) {
  await delay(500);
  
  // Próximas reservas mock
  return [
    {
      id: 'book-1',
      propertyName: 'Finca do Val',
      checkInDate: '2024-10-20',
      checkOutDate: '2024-10-23',
      guestName: 'Carlos Rodríguez',
      guestCount: 4,
      totalAmount: 750,
      status: 'confirmed',
    },
    {
      id: 'book-2',
      propertyName: 'Pazo de Salnés',
      checkInDate: '2024-10-25',
      checkOutDate: '2024-10-28',
      guestName: 'Ana Martínez',
      guestCount: 2,
      totalAmount: 650,
      status: 'confirmed',
    },
    {
      id: 'book-3',
      propertyName: 'Cortiña das Flores',
      checkInDate: '2024-11-02',
      checkOutDate: '2024-11-05',
      guestName: 'Luis García',
      guestCount: 3,
      totalAmount: 480,
      status: 'pending',
    },
    {
      id: 'book-4',
      propertyName: 'Finca do Val',
      checkInDate: '2024-11-08',
      checkOutDate: '2024-11-12',
      guestName: 'Elena Fernández',
      guestCount: 6,
      totalAmount: 1200,
      status: 'confirmed',
    },
    {
      id: 'book-5',
      propertyName: 'Pazo de Salnés',
      checkInDate: '2024-11-15',
      checkOutDate: '2024-11-18',
      guestName: 'Miguel López',
      guestCount: 2,
      totalAmount: 680,
      status: 'pending',
    },
  ];
}
