/**
 * UpcomingBookings Component - FincAirbnb
 * 
 * Componente que muestra las próximas reservas del propietario
 * con información básica y acciones rápidas
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Euro, 
  MessageSquare, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Booking {
  id: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  guestCount: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface UpcomingBookingsProps {
  bookings: Booking[];
  isLoading?: boolean;
}

/**
 * Función para formatear fechas en gallego
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('gl-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Función para obtener el estado de la reserva en gallego
 */
function getStatusInfo(status: string) {
  switch (status) {
    case 'confirmed':
      return {
        label: 'Confirmada',
        icon: <CheckCircle className="h-4 w-4" />,
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'pending':
      return {
        label: 'Pendente',
        icon: <Clock className="h-4 w-4" />,
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    case 'cancelled':
      return {
        label: 'Cancelada',
        icon: <AlertCircle className="h-4 w-4" />,
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200'
      };
    default:
      return {
        label: status,
        icon: <AlertCircle className="h-4 w-4" />,
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-800 border-gray-200'
      };
  }
}

/**
 * Componente de tarjeta individual de reserva
 */
interface BookingCardProps {
  booking: Booking;
  onViewDetails: (bookingId: string) => void;
  onSendMessage: (guestName: string) => void;
}

function BookingCard({ booking, onViewDetails, onSendMessage }: BookingCardProps) {
  const statusInfo = getStatusInfo(booking.status);
  
  // Calcular días de estadía
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const daysDiff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calcular días hasta la llegada
  const today = new Date();
  const daysUntilCheckIn = Math.ceil((checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-galician-blue mb-1">
              {booking.propertyName}
            </h4>
            <p className="text-sm text-gray-600">
              {booking.guestName}
            </p>
          </div>
          <Badge className={statusInfo.className}>
            {statusInfo.icon}
            <span className="ml-1">{statusInfo.label}</span>
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {/* Fechas */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-galician-blue" />
            <span>
              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
            </span>
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              {daysDiff} días
            </span>
          </div>

          {/* Huéspedes */}
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-galician-green" />
            <span>{booking.guestCount} {booking.guestCount === 1 ? 'persoa' : 'persoas'}</span>
          </div>

          {/* Precio */}
          <div className="flex items-center text-sm text-gray-600">
            <Euro className="h-4 w-4 mr-2 text-green-600" />
            <span className="font-semibold">
              {booking.totalAmount.toLocaleString('es-ES')}€
            </span>
          </div>

          {/* Días hasta llegada */}
          {daysUntilCheckIn > 0 && (
            <div className="flex items-center text-sm">
              {daysUntilCheckIn <= 3 ? (
                <span className="text-red-600 font-medium">
                  Chega en {daysUntilCheckIn} {daysUntilCheckIn === 1 ? 'día' : 'días'}
                </span>
              ) : daysUntilCheckIn <= 7 ? (
                <span className="text-yellow-600 font-medium">
                  Chega en {daysUntilCheckIn} días
                </span>
              ) : (
                <span className="text-gray-600">
                  Chega en {daysUntilCheckIn} días
                </span>
              )}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(booking.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver detalles
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSendMessage(booking.guestName)}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Mensaxe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente principal de próximas reservas
 */
export function UpcomingBookings({ bookings, isLoading = false }: UpcomingBookingsProps) {
  const handleViewDetails = (bookingId: string) => {
    console.log('Ver detalles de reserva:', bookingId);
    // TODO: Navegar a página de detalles de reserva
  };

  const handleSendMessage = (guestName: string) => {
    console.log('Enviar mensaje a:', guestName);
    // TODO: Abrir chat con el huésped
  };

  const handleViewAllBookings = () => {
    console.log('Ver todas las reservas');
    // TODO: Navegar a página de gestión de reservas
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filtrar solo las próximas reservas (confirmadas y pendientes)
  const upcomingBookings = bookings
    .filter(booking => booking.status === 'confirmed' || booking.status === 'pending')
    .slice(0, 5); // Mostrar máximo 5

  const confirmedCount = upcomingBookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = upcomingBookings.filter(b => b.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-galician-blue" />
            <CardTitle className="text-xl font-bold text-galician-blue">
              Próximas Reservas
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllBookings}
          >
            Ver todas
          </Button>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
            <span>{confirmedCount} confirmadas</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-yellow-600 mr-1" />
            <span>{pendingCount} pendentes</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Non hai reservas próximas</p>
            <p className="text-sm">
              Cando recibas novas reservas, aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={handleViewDetails}
                onSendMessage={handleSendMessage}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
