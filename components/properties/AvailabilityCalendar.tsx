/**
 * AvailabilityCalendar Component - FincAirbnb
 * 
 * Componente para gestionar la disponibilidad de propiedades
 * Incluye calendario mensual, bloqueo/desbloqueo de fechas, precios especiales
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Euro,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Property, CalendarDay } from '@/shared/types';

interface AvailabilityCalendarProps {
  property: Property;
  onAvailabilityChange: (availability: CalendarDay[]) => void;
  isLoading?: boolean;
}

interface PriceOverride {
  id: string;
  date: string;
  price: number;
  reason: string;
}

/**
 * Componente de calendario de disponibilidad
 */
export function AvailabilityCalendar({ 
  property, 
  onAvailabilityChange, 
  isLoading = false 
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [availability, setAvailability] = useState<CalendarDay[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<PriceOverride[]>([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [tempPrice, setTempPrice] = useState({ price: '', reason: '' });

  // Generar días del mes actual
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Generar 42 días (6 semanas)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Obtener estado de un día específico
  const getDayStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = availability.find(d => d.date === dateStr);
    
    if (!dayData) {
      return {
        available: true,
        price: property.pricing?.basePrice || 0,
        blocked: false,
        priceOverride: null
      };
    }
    
    const priceOverride = priceOverrides.find(p => p.date === dateStr);
    
    return {
      available: dayData.available,
      price: priceOverride?.price || dayData.price || property.pricing?.basePrice || 0,
      blocked: !dayData.available,
      priceOverride: priceOverride || null
    };
  };

  // Toggle disponibilidad de un día
  const toggleDayAvailability = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingDay = availability.find(d => d.date === dateStr);
    
    let newAvailability;
    if (existingDay) {
      newAvailability = availability.map(d =>
        d.date === dateStr ? { ...d, available: !d.available } : d
      );
    } else {
      newAvailability = [
        ...availability,
        {
          date: dateStr,
          available: false,
          price: property.pricing?.basePrice || 0
        }
      ];
    }
    
    setAvailability(newAvailability);
    onAvailabilityChange(newAvailability);
    
    toast({
      title: existingDay?.available ? "Día bloqueado" : "Día desbloqueado",
      description: `${date.toLocaleDateString('es-ES')} ${existingDay?.available ? 'bloqueado' : 'disponible'} para reservas.`,
    });
  };

  // Agregar precio especial
  const addPriceOverride = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const newOverride: PriceOverride = {
      id: `override-${Date.now()}`,
      date: dateStr,
      price: parseFloat(tempPrice.price),
      reason: tempPrice.reason
    };
    
    setPriceOverrides(prev => [...prev, newOverride]);
    setTempPrice({ price: '', reason: '' });
    setShowPriceModal(false);
    
    toast({
      title: "Prezo especial agregado",
      description: `Prezo de ${newOverride.price}€ para ${date.toLocaleDateString('es-ES')}.`,
    });
  };

  // Eliminar precio especial
  const removePriceOverride = (overrideId: string) => {
    setPriceOverrides(prev => prev.filter(p => p.id !== overrideId));
    toast({
      title: "Prezo especial eliminado",
      description: "O prezo especial eliminouse correctamente.",
    });
  };

  // Navegar entre meses
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const calendarDays = generateCalendarDays(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-galician-blue" />
            Calendario de Disponibilidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Navegación del mes */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              disabled={isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="text-xl font-semibold text-gray-900 capitalize">
              {monthName}
            </h3>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              disabled={isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Leyenda */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-600">Dispoñible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">Bloqueado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm text-gray-600">Prezo especial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-600">Mes pasado</span>
            </div>
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-1">
            {/* Días de la semana */}
            {['Do', 'Lu', 'Ma', 'Mi', 'Xo', 'Ve', 'Sá'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Días del mes */}
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const dayStatus = getDayStatus(day);
              
              return (
                <div
                  key={index}
                  className={`
                    relative p-2 min-h-[60px] border rounded cursor-pointer transition-colors
                    ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                    ${isToday ? 'ring-2 ring-galician-blue' : ''}
                    ${dayStatus.blocked 
                      ? 'bg-red-100 border-red-300 hover:bg-red-200' 
                      : dayStatus.priceOverride
                      ? 'bg-blue-100 border-blue-300 hover:bg-blue-200'
                      : 'bg-green-100 border-green-300 hover:bg-green-200'
                    }
                  `}
                  onClick={() => isCurrentMonth && toggleDayAvailability(day)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        !isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {day.getDate()}
                      </span>
                      
                      {dayStatus.blocked && (
                        <Lock className="h-3 w-3 text-red-600" />
                      )}
                      
                      {dayStatus.priceOverride && (
                        <Euro className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-600 mt-auto">
                      {dayStatus.priceOverride ? (
                        <div className="space-y-1">
                          <div className="font-medium">{dayStatus.price}€</div>
                          <div className="text-xs truncate" title={dayStatus.priceOverride.reason}>
                            {dayStatus.priceOverride.reason}
                          </div>
                        </div>
                      ) : (
                        <div>{dayStatus.price}€</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Acciones rápidas */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Bloquear todo el mes
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                const monthAvailability = Array.from({ length: daysInMonth }, (_, i) => ({
                  date: new Date(year, month, i + 1).toISOString().split('T')[0],
                  available: false,
                  price: property.pricing?.basePrice || 0
                }));
                
                const newAvailability = [
                  ...availability.filter(d => !d.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)),
                  ...monthAvailability
                ];
                
                setAvailability(newAvailability);
                onAvailabilityChange(newAvailability);
                
                toast({
                  title: "Mes bloqueado",
                  description: `Todo o mes de ${monthName} foi bloqueado.`,
                });
              }}
              disabled={isLoading}
            >
              <Lock className="h-4 w-4 mr-2" />
              Bloquear Mes
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Desbloquear todo el mes
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                
                const newAvailability = availability.filter(d => 
                  !d.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)
                );
                
                setAvailability(newAvailability);
                onAvailabilityChange(newAvailability);
                
                toast({
                  title: "Mes desbloqueado",
                  description: `Todo o mes de ${monthName} está dispoñible.`,
                });
              }}
              disabled={isLoading}
            >
              <Unlock className="h-4 w-4 mr-2" />
              Desbloquear Mes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Precios especiales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Euro className="h-5 w-5 mr-2 text-galician-blue" />
            Prezos Especiais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priceOverrides.length > 0 ? (
              <div className="space-y-2">
                {priceOverrides.map(override => (
                  <div key={override.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">
                        {new Date(override.date).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {override.price}€ - {override.reason}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removePriceOverride(override.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Euro className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Non hai prezos especiais configurados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para agregar precio especial */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Agregar Prezo Especial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="special-price">Prezo (€)</Label>
                <Input
                  id="special-price"
                  type="number"
                  value={tempPrice.price}
                  onChange={(e) => setTempPrice(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="special-reason">Motivo</Label>
                <Input
                  id="special-reason"
                  value={tempPrice.reason}
                  onChange={(e) => setTempPrice(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Ex: Festivo, temporada alta..."
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowPriceModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => addPriceOverride(selectedDates[0] ? new Date(selectedDates[0]) : new Date())}
                  className="flex-1"
                  disabled={!tempPrice.price || !tempPrice.reason}
                >
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
