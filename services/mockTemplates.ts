/**
 * Mock Templates Service - FincAirbnb
 * 
 * Servicio que simula sistema de plantillas de mensajes para propietarios
 */

import type { MessageTemplate, CreateTemplateData, TemplateVariables } from '@/shared/types';
import { delay, loadMockData, generateId } from './utils';
import { apiClient } from './apiClient';
import { isExternalApiEnabled } from './runtime';

/**
 * Obtiene todas las plantillas de un propietario
 * 
 * @param ownerId - ID del propietario
 * @returns Promise con array de plantillas
 */
export async function getTemplates(ownerId: string): Promise<MessageTemplate[]> {
  if (isExternalApiEnabled()) {
    return apiClient.get<MessageTemplate[]>(`/templates/owner/${ownerId}`);
  }

  await delay();
  
  const templates = await loadMockData<MessageTemplate>('templates');
  
  // Filtrar plantillas del propietario + plantillas por defecto
  return templates.filter(t => t.ownerId === ownerId || t.isDefault);
}

/**
 * Obtiene plantillas por categoría
 * 
 * @param ownerId - ID del propietario
 * @param category - Categoría de plantilla
 * @returns Promise con array de plantillas
 */
export async function getTemplatesByCategory(
  ownerId: string, 
  category: string
): Promise<MessageTemplate[]> {
  await delay();
  
  const allTemplates = await getTemplates(ownerId);
  return allTemplates.filter(t => t.category === category);
}

/**
 * Crea una nueva plantilla
 * 
 * @param ownerId - ID del propietario
 * @param data - Datos de la plantilla
 * @returns Promise con la plantilla creada
 */
export async function createTemplate(
  ownerId: string,
  data: CreateTemplateData
): Promise<MessageTemplate> {
  if (isExternalApiEnabled()) {
    return apiClient.post<MessageTemplate>('/templates', { ...data, ownerId });
  }

  await delay();
  
  // Extraer variables del contenido (buscar {{variable}})
  const variableRegex = /\{\{(\w+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variableRegex.exec(data.content)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  const newTemplate: MessageTemplate = {
    id: generateId('template'),
    ownerId,
    name: data.name,
    content: data.content,
    category: data.category,
    variables,
    isDefault: false,
    createdAt: new Date().toISOString()
  };
  
  // Guardar
  const templates = await loadMockData<MessageTemplate>('templates');
  templates.push(newTemplate);
  saveToLocalStorage('templates', templates);
  
  return newTemplate;
}

/**
 * Actualiza una plantilla existente
 * 
 * @param templateId - ID de la plantilla
 * @param ownerId - ID del propietario
 * @param data - Datos actualizados
 * @returns Promise con la plantilla actualizada
 */
export async function updateTemplate(
  templateId: string,
  ownerId: string,
  data: Partial<CreateTemplateData>
): Promise<MessageTemplate> {
  if (isExternalApiEnabled()) {
    return apiClient.patch<MessageTemplate>(`/templates/${templateId}`, data);
  }

  await delay();
  
  const templates = await loadMockData<MessageTemplate>('templates');
  const index = templates.findIndex(t => t.id === templateId && t.ownerId === ownerId);
  
  if (index === -1) {
    throw new Error('Plantilla non atopada');
  }
  
  // Solo permitir editar plantillas personalizadas
  if (templates[index].isDefault) {
    throw new Error('Non se poden editar as plantillas por defecto');
  }
  
  // Actualizar datos
  if (data.name) templates[index].name = data.name;
  if (data.content) {
    templates[index].content = data.content;
    
    // Recalcular variables
    const variableRegex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = variableRegex.exec(data.content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    templates[index].variables = variables;
  }
  if (data.category) templates[index].category = data.category;
  
  saveToLocalStorage('templates', templates);
  
  return templates[index];
}

/**
 * Elimina una plantilla
 * 
 * @param templateId - ID de la plantilla
 * @param ownerId - ID del propietario
 */
export async function deleteTemplate(templateId: string, ownerId: string): Promise<void> {
  if (isExternalApiEnabled()) {
    await apiClient.delete<{ deleted: boolean }>(`/templates/${templateId}`);
    return;
  }

  await delay();
  
  const templates = await loadMockData<MessageTemplate>('templates');
  const index = templates.findIndex(t => t.id === templateId && t.ownerId === ownerId);
  
  if (index === -1) {
    throw new Error('Plantilla non atopada');
  }
  
  // No permitir eliminar plantillas por defecto
  if (templates[index].isDefault) {
    throw new Error('Non se poden eliminar as plantillas por defecto');
  }
  
  templates.splice(index, 1);
  saveToLocalStorage('templates', templates);
}

/**
 * Procesa una plantilla reemplazando variables
 * 
 * @param template - Plantilla a procesar
 * @param variables - Variables para reemplazar
 * @returns Contenido procesado
 */
export function processTemplate(
  template: MessageTemplate, 
  variables: Partial<TemplateVariables>
): string {
  let content = template.content;
  
  // Reemplazar variables
  Object.entries(variables).forEach(([key, value]) => {
    if (value) {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
  });
  
  return content;
}

/**
 * Obtiene las variables disponibles en una plantilla
 * 
 * @param content - Contenido de la plantilla
 * @returns Array de nombres de variables
 */
export function extractVariables(content: string): string[] {
  const variableRegex = /\{\{(\w+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variableRegex.exec(content)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
}

// Helper para guardar en localStorage
function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(`fincairbnb_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}






