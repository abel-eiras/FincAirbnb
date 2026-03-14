/**
 * Template Selector Component - FincAirbnb
 * 
 * Componente para seleccionar plantillas de mensajes en el chat
 * Solo visible para propietarios
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  X, 
  Send, 
  Search,
  Eye,
  Copy
} from 'lucide-react';
import { getTemplates, processTemplate } from '@/services/mockTemplates';
import type { MessageTemplate, TemplateVariables } from '@/shared/types';
import { TEMPLATE_CATEGORIES, VARIABLE_TRANSLATIONS } from '@/shared/types/message';

interface TemplateSelectorProps {
  isOwner: boolean;
  conversationId?: string;
  propertyId?: string;
  guestName?: string;
  ownerName?: string;
  onTemplateSelect: (content: string) => void;
  onClose: () => void;
}

export function TemplateSelector({
  isOwner,
  conversationId,
  propertyId,
  guestName = '',
  ownerName = '',
  onTemplateSelect,
  onClose
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [processedContent, setProcessedContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar plantillas
  useEffect(() => {
    const loadTemplates = async () => {
      if (!isOwner) return;
      
      try {
        setIsLoading(true);
        // Usar un propietario mock para cargar plantillas
        const userTemplates = await getTemplates('user-owner-1');
        setTemplates(userTemplates);
      } catch (error) {
        console.error('Error cargando plantillas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [isOwner]);

  // Procesar plantilla seleccionada
  useEffect(() => {
    if (selectedTemplate) {
      const variables: Partial<TemplateVariables> = {
        guestName: guestName || 'Labrego',
        propertyName: 'Finca',
        ownerName: ownerName || 'Propietario',
        checkInDate: 'Data de entrada',
        checkOutDate: 'Data de saída',
        propertyAddress: 'Enderezo da finca',
        bookingId: conversationId
      };

      const processed = processTemplate(selectedTemplate, variables);
      setProcessedContent(processed);
    }
  }, [selectedTemplate, guestName, ownerName, conversationId]);

  // Filtrar plantillas
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (processedContent) {
      onTemplateSelect(processedContent);
      onClose();
    }
  };

  const handleCopyTemplate = () => {
    if (processedContent) {
      navigator.clipboard.writeText(processedContent);
      // TODO: Mostrar toast de confirmación
    }
  };

  // Solo mostrar para propietarios
  if (!isOwner) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-galician-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando plantillas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-galician-blue" />
            <span>Plantillas de Mensaxes</span>
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Filtros */}
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar plantillas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todas</option>
            {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de plantillas */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Selecciona unha plantilla ({filteredTemplates.length})
            </h3>
            
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Non se atoparon plantillas</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-galician-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {template.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Por defecto
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {template.content.substring(0, 100)}...
                    </p>
                    {template.variables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Variables: {template.variables.map(variable => 
                            VARIABLE_TRANSLATIONS[variable as keyof typeof VARIABLE_TRANSLATIONS] || variable
                          ).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vista previa */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Vista previa
            </h3>
            
            {selectedTemplate ? (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    {selectedTemplate.name}
                  </h4>
                  <Textarea
                    value={processedContent}
                    readOnly
                    className="min-h-32 text-sm"
                    placeholder="Selecciona unha plantilla para ver a vista previa..."
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleUseTemplate}
                    className="flex-1 bg-galician-blue hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Usar Plantilla
                  </Button>
                  <Button
                    onClick={handleCopyTemplate}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Selecciona unha plantilla para ver a vista previa</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
