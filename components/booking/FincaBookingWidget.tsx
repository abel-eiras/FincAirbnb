/**
 * FincaBookingWidget Component - FincAirbnb
 * 
 * Widget de alugamento adaptado para fincas
 * Con duración en meses y contexto agrícola
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar,
  Users,
  Calculator,
  ArrowRight,
  Info
} from 'lucide-react';
import type { Property } from '@/shared/types';

interface FincaBookingWidgetProps {
  property: Property;
}

interface AlugamentoData {
  startDate: string;
  duration: number; // meses
  people: number;
  cultivoType: string;
  specialRequests?: string;
}

export function FincaBookingWidget({ property }: FincaBookingWidgetProps) {
  const router = useRouter();
  const [alugamentoData, setAlugamentoData] = useState<AlugamentoData>({
    startDate: '',
    duration: 1,
    people: 1,
    cultivoType: 'hortalizas',
    specialRequests: ''
  });

  const cultivoTypes = [
    { id: 'hortalizas', label: 'Hortalizas', icon: '🥬' },
    { id: 'frutais', label: 'Frutais', icon: '🍎' },
    { id: 'viñedo', label: 'Viñedo', icon: '🍇' },
    { id: 'cereais', label: 'Cereais', icon: '🌾' },
    { id: 'flores', label: 'Flores', icon: '🌻' },
    { id: 'outros', label: 'Outros', icon: '🌱' }
  ];

  const durationOptions = [
    { value: 1, label: '1 mes' },
    { value: 3, label: '3 meses' },
    { value: 6, label: '6 meses' },
    { value: 12, label: '12 meses' },
    { value: 24, label: '24 meses' }
  ];

  const calculatePrice = () => {
    const basePrice = property.pricing?.basePrice || 0;
    const totalPrice = basePrice * alugamentoData.duration;
    
    return {
      basePrice,
      duration: alugamentoData.duration,
      subtotal: totalPrice,
      serviceFee: totalPrice * 0.05, // 5% fee
      total: totalPrice + (totalPrice * 0.05)
    };
  };

  const handleInputChange = (field: keyof AlugamentoData, value: string | number) => {
    setAlugamentoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validar datos
    if (!alugamentoData.startDate) {
      alert('Por favor, selecciona unha data de inicio');
      return;
    }

    if (alugamentoData.people > (property.size?.capacity || 0)) {
      alert(`A capacidade máxima é de ${property.size?.capacity || 0} persoas`);
      return;
    }

    // Crear objeto de alugamento
    const alugamento = {
      propertyId: property.id,
      propertyTitle: property.title,
      ...alugamentoData,
      pricing: calculatePrice()
    };

    // Navegar a página de solicitud
    const queryParams = new URLSearchParams({
      data: JSON.stringify(alugamento)
    });
    
    router.push(`/alugamentos/solicitar?${queryParams.toString()}`);
  };

  const price = calculatePrice();

  return (
    <Card className="sticky top-6">
      <CardContent className="p-6">
        {/* Precio */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-galician-blue mb-2">
            {property.pricing?.basePrice || 0}€
          </div>
          <div className="text-gray-600">por mes</div>
        </div>

        <div className="space-y-4">
          {/* Data de inicio */}
          <div>
            <Label htmlFor="startDate" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Data de inicio
            </Label>
            <Input
              id="startDate"
              type="date"
              value={alugamentoData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full"
            />
          </div>

          {/* Duración */}
          <div>
            <Label htmlFor="duration" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Duración (meses)
            </Label>
            <select
              id="duration"
              value={alugamentoData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {durationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Número de persoas */}
          <div>
            <Label htmlFor="people" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 mr-2" />
              Número de persoas
            </Label>
            <Input
              id="people"
              type="number"
              min="1"
              max={property.size?.capacity || 10}
              value={alugamentoData.people}
              onChange={(e) => handleInputChange('people', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Capacidade máxima: {property.size?.capacity || 0} persoas
            </p>
          </div>

          {/* Tipo de cultivo */}
          <div>
            <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <span className="mr-2">🌱</span>
              Tipo de cultivo
            </Label>
            <select
              value={alugamentoData.cultivoType}
              onChange={(e) => handleInputChange('cultivoType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {cultivoTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Solicitudes especiais */}
          <div>
            <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700 mb-2">
              Solicitudes especiais (opcional)
            </Label>
            <textarea
              id="specialRequests"
              value={alugamentoData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Ex: Necesito acceso a auga de rego constante..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none"
            />
          </div>

          {/* Desglose de precio */}
          {alugamentoData.duration > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Calculator className="h-4 w-4 mr-2" />
                Desglose do prezo
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{property.pricing?.basePrice || 0}€ × {alugamentoData.duration} meses</span>
                <span>{price.subtotal}€</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Taxa de servizo (5%)</span>
                <span>{price.serviceFee.toFixed(2)}€</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-galician-blue">{price.total.toFixed(2)}€</span>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-shell-beige p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-galician-green mt-0.5" />
              <div className="text-xs text-galician-green">
                <p className="font-medium mb-1">💡 Información importante:</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Non se cobra ata confirmar o alugamento</li>
                  <li>O propietario revisará a túa solicitude</li>
                  <li>Podes cancelar gratis ata 1 mes antes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botón de solicitar */}
          <Button 
            className="w-full bg-galician-blue hover:bg-blue-700 py-3"
            size="lg"
            onClick={handleSubmit}
            disabled={!alugamentoData.startDate}
          >
            Solicitar Alugamento
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Non se cobra ata confirmar o alugamento
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
