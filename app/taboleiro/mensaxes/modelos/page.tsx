/**
 * Página de Gestión de Plantillas - FincAirbnb
 * 
 * Página para que los propietarios gestionen sus plantillas de mensajes
 * Ruta: /taboleiro/mensaxes/modelos
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  FileText,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  processTemplate,
} from '@/services/mockTemplates';
import { TEMPLATE_CATEGORIES } from '@/shared/types/message';
import type { MessageTemplate, CreateTemplateData, TemplateVariables } from '@/shared/types';

export default function TemplatesPage() {
  const { getCurrentUser } = useAuth();
  const router = useRouter();
  const user = getCurrentUser();
  
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState<CreateTemplateData>({
    name: '',
    content: '',
    category: 'custom'
  });

  // Cargar plantillas
  useEffect(() => {
    const loadTemplates = async () => {
      if (!user || user.role !== 'owner') return;
      
      try {
        setIsLoading(true);
        const userTemplates = await getTemplates(user.id);
        setTemplates(userTemplates);
      } catch (error) {
        console.error('Error cargando plantillas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [user]);

  // Filtrar plantillas
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = async () => {
    if (!user || user.role !== 'owner') return;
    
    try {
      const newTemplate = await createTemplate(user.id, formData);
      setTemplates(prev => [...prev, newTemplate]);
      
      // Reset form
      setFormData({ name: '', content: '', category: 'custom' });
      setShowCreateForm(false);
      
      // TODO: Mostrar toast de éxito
    } catch (error) {
      console.error('Error creando plantilla:', error);
      // TODO: Mostrar toast de error
    }
  };

  const handleUpdateTemplate = async () => {
    if (!user || user.role !== 'owner' || !editingTemplate) return;
    
    try {
      const updatedTemplate = await updateTemplate(editingTemplate.id, user.id, formData);
      setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
      
      // Reset form
      setFormData({ name: '', content: '', category: 'custom' });
      setEditingTemplate(null);
      
      // TODO: Mostrar toast de éxito
    } catch (error) {
      console.error('Error actualizando plantilla:', error);
      // TODO: Mostrar toast de error
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!user || user.role !== 'owner') return;
    
    if (!confirm('¿Estás seguro de que queres eliminar esta plantilla?')) {
      return;
    }
    
    try {
      await deleteTemplate(templateId, user.id);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      
      // TODO: Mostrar toast de éxito
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
      // TODO: Mostrar toast de error
    }
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      category: template.category
    });
    setShowCreateForm(true);
  };

  const handlePreviewTemplate = (template: MessageTemplate) => {
    setPreviewTemplate(template);
  };

  const handleCopyTemplate = (template: MessageTemplate) => {
    setFormData({
      name: `${template.name} (copia)`,
      content: template.content,
      category: template.category
    });
    setShowCreateForm(true);
    setEditingTemplate(null);
  };

  const processTemplatePreview = (template: MessageTemplate): string => {
    const variables: Partial<TemplateVariables> = {
      guestName: 'María',
      propertyName: 'Finca do Pazo',
      ownerName: user?.name || 'Propietario',
      checkInDate: '15 de marzo',
      checkOutDate: '20 de marzo',
      propertyAddress: 'Rúa do Pazo, 123',
      bookingId: 'book-123'
    };

    return processTemplate(template, variables);
  };

  // Solo permitir acceso a propietarios
  if (user?.role !== 'owner') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Acceso restrinxido
              </h1>
              <p className="text-gray-600">
                Esta páxina só está dispoñible para propietarios
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Plantillas de Mensaxes</h1>
                  <p className="text-gray-600">Xestiona as túas plantillas para responder rapidamente</p>
                </div>
              </div>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-galician-blue hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Plantilla
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6 flex space-x-4">
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

          {/* Formulario de crear/editar */}
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingTemplate ? 'Editar Plantilla' : 'Nova Plantilla'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da plantilla
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Benvida para labregos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contido da plantilla
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Escribe o contido da plantilla. Podes usar variables como {{guestName}}, {{propertyName}}, etc."
                    className="min-h-32"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Variables dispoñibles: guestName, propertyName, ownerName, checkInDate, checkOutDate, propertyAddress, bookingId
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                    className="bg-galician-blue hover:bg-blue-700"
                  >
                    {editingTemplate ? 'Actualizar' : 'Crear'} Plantilla
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTemplate(null);
                      setFormData({ name: '', content: '', category: 'custom' });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de plantillas */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-galician-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando plantillas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">
                            {TEMPLATE_CATEGORIES[template.category]}
                          </Badge>
                          {template.isDefault && (
                            <Badge variant="secondary">Por defecto</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {template.content.substring(0, 150)}...
                    </p>
                    
                    {template.variables.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable) => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      
                      {!template.isDefault && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Eliminar
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyTemplate(template)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Non hai plantillas
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Non se atoparon plantillas con estes filtros'
                  : 'Crea a túa primeira plantilla para aforrar tempo'
                }
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-galician-blue hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Plantilla
              </Button>
            </div>
          )}
        </main>

        {/* Modal de vista previa */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vista previa: {previewTemplate.name}</CardTitle>
                  <Button variant="ghost" onClick={() => setPreviewTemplate(null)}>
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {processTemplatePreview(previewTemplate)}
                  </pre>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Variables utilizadas:</p>
                  <div className="flex flex-wrap gap-1">
                    {previewTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
