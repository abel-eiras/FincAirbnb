/**
 * FincasFilters Component - FincAirbnb
 * 
 * Filtros laterales adaptados ao contexto de fincas para cultivo
 * Con copy gallego e retranca
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  X,
  MapPin,
  Euro,
  Ruler,
  Wheat,
  Droplets
} from 'lucide-react';

interface FincasFiltersProps {
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  onClearAll: () => void;
}

export function FincasFilters({ onClose, onApplyFilters, onClearAll }: FincasFiltersProps) {
  const [filters, setFilters] = React.useState({
    provincia: '',
    municipio: '',
    precioMin: 0,
    precioMax: 1000,
    tamanhoMin: 0,
    tiposSolo: [] as string[],
    auga: false,
    electricidade: false,
    acceso: false
  });

  const provincias = ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'];
  const tiposSolo = [
    { id: 'agricola', label: 'Agrícola (cultivos)' },
    { id: 'pastos', label: 'Pastos (gandaría)' },
    { id: 'forestal', label: 'Forestal (árbores)' },
    { id: 'mixto', label: 'Mixto' }
  ];

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    // Limpiar filtros localmente
    setFilters({
      provincia: '',
      municipio: '',
      precioMin: 0,
      precioMax: 1000,
      tamanhoMin: 0,
      tiposSolo: [],
      auga: false,
      electricidade: false,
      acceso: false
    });
    
    // Comunicar al componente padre que limpie todo
    onClearAll();
    
    // Cerrar la barra lateral
    onClose();
  };

  const toggleTipoSolo = (tipo: string) => {
    setFilters(prev => ({
      ...prev,
      tiposSolo: prev.tiposSolo.includes(tipo)
        ? prev.tiposSolo.filter(t => t !== tipo)
        : [...prev.tiposSolo, tipo]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4 overflow-y-auto">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-galician-green to-green-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <Wheat className="h-5 w-5 mr-2" />
              Filtros de Búsqueda
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-green-50 mt-2">
            Afina a túa búsqueda para atopar a finca perfecta
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Localización */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-galician-blue" />
              <Label className="text-base font-semibold">Localización</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provincia" className="text-sm">Provincia</Label>
              <select
                id="provincia"
                value={filters.provincia}
                onChange={(e) => setFilters(prev => ({ ...prev, provincia: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Todas as provincias</option>
                {provincias.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipio" className="text-sm">Municipio</Label>
              <Input
                id="municipio"
                type="text"
                placeholder="Ex: Ponteareas, Vigo..."
                value={filters.municipio}
                onChange={(e) => setFilters(prev => ({ ...prev, municipio: e.target.value }))}
              />
            </div>
          </div>

          {/* Precio */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-galician-blue" />
              <Label className="text-base font-semibold">Prezo por mes</Label>
            </div>

            <div className="space-y-3">
              <Slider
                min={0}
                max={1000}
                step={10}
                value={[filters.precioMin, filters.precioMax]}
                onValueChange={([min, max]) => 
                  setFilters(prev => ({ ...prev, precioMin: min, precioMax: max }))
                }
                className="w-full"
              />
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={filters.precioMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, precioMin: Number(e.target.value) }))}
                    className="w-20 h-8 text-xs"
                  />
                  <span className="text-gray-600">€</span>
                </div>
                
                <span className="text-gray-400">—</span>
                
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={filters.precioMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, precioMax: Number(e.target.value) }))}
                    className="w-20 h-8 text-xs"
                  />
                  <span className="text-gray-600">€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tamaño */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Ruler className="h-5 w-5 text-galician-blue" />
              <Label className="text-base font-semibold">Tamaño mínimo</Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={filters.tamanhoMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, tamanhoMin: Number(e.target.value) }))}
                  placeholder="0"
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">hectáreas</span>
              </div>
              <p className="text-xs text-gray-500">
                💡 1 hectárea = 10.000 m² (aprox. un campo de fútbol)
              </p>
            </div>
          </div>

          {/* Tipo de Solo */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Wheat className="h-5 w-5 text-galician-blue" />
              <Label className="text-base font-semibold">Tipo de Solo</Label>
            </div>

            <div className="space-y-2">
              {tiposSolo.map(tipo => (
                <div key={tipo.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tipo.id}
                    checked={filters.tiposSolo.includes(tipo.id)}
                    onCheckedChange={() => toggleTipoSolo(tipo.id)}
                  />
                  <Label 
                    htmlFor={tipo.id} 
                    className="text-sm cursor-pointer flex-1"
                  >
                    {tipo.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Servicios Básicos */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-galician-blue" />
              <Label className="text-base font-semibold">Servizos Básicos</Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auga"
                  checked={filters.auga}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, auga: !!checked }))
                  }
                />
                <Label htmlFor="auga" className="text-sm cursor-pointer">
                  💧 Auga corrente
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="electricidade"
                  checked={filters.electricidade}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, electricidade: !!checked }))
                  }
                />
                <Label htmlFor="electricidade" className="text-sm cursor-pointer">
                  ⚡ Electricidade
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceso"
                  checked={filters.acceso}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, acceso: !!checked }))
                  }
                />
                <Label htmlFor="acceso" className="text-sm cursor-pointer">
                  🚗 Acceso con vehículo
                </Label>
              </div>
            </div>
          </div>

          {/* Copy con retranca */}
          <div className="bg-shell-beige p-4 rounded-lg">
            <p className="text-sm text-galician-green">
              💡 <strong>Consello:</strong> As mellores fincas non teñen WiFi. 
              Así non che entra a tentación de mirar o móbil mentres plantas.
            </p>
          </div>
        </CardContent>

        {/* Botones de acción */}
        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
          >
            Limpar
          </Button>
          <Button
            className="flex-1 bg-galician-blue hover:bg-blue-700"
            onClick={handleApply}
          >
            Aplicar Filtros
          </Button>
        </div>
      </Card>
    </div>
  );
}
