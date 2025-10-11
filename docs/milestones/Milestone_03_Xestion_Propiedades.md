# 🏡 Milestone 03: Dashboard Propietario - Gestión de Propiedades

## Resumen
**Objetivo**: CRUD completo de propiedades con formularios multi-step, gestión de fotos mock y calendario de disponibilidad.

**Duración**: 2 semanas | **Prioridad**: Alta | **Estado**: 📅 Planificado

---

## Objetivos
- Listado de propiedades del propietario
- Crear nueva propiedad (formulario multi-step)
- Editar propiedad existente
- Gestión de fotos (mock URLs)
- Calendario de disponibilidad
- Activar/desactivar propiedades

---

## Tareas

### 1. Listado de Propiedades (`/taboleiro/minas-fincas`)
**Componentes**:
- `PropertyList.tsx` - Grid/list view
- `PropertyCard.tsx` - Tarjeta de propiedad
- `PropertyFilters.tsx` - Filtros

**Features**:
- Vista grid/lista
- Filtros (activas, inactivas, todas)
- Estadísticas por propiedad
- Acciones rápidas (editar, ver, calendario)

### 2. Crear Propiedad (`/taboleiro/fincas/crear`)
**Formulario Multi-Step**:
1. Información básica (título, tipo, localización)
2. Detalles (descripción, tamaño, capacidad)
3. Comodidades (checkboxes)
4. Fotos (mock - URLs ficticias)
5. Precio y reglas
6. Revisar y publicar

**Componentes**:
- `PropertyForm.tsx` - Form container
- `Step1Basic.tsx` - Step 1
- `Step2Details.tsx` - Step 2
- etc.

**Validación**: React Hook Form + Zod

### 3. Editar Propiedad (`/taboleiro/fincas/[id]/editar`)
- Reutilizar componentes de creación
- Cargar datos existentes
- Guardar cambios (mock update)

### 4. Gestión de Fotos (`/taboleiro/fincas/[id]/fotos`)
- Upload simulado (solo guarda URLs mock)
- Reordenar fotos (drag & drop con `dnd-kit`)
- Establecer foto principal
- Añadir captions

### 5. Calendario de Disponibilidad (`/taboleiro/fincas/[id]/calendario`)
- Vista mensual con `react-day-picker`
- Bloquear/desbloquear fechas
- Ver reservas existentes
- Gestión de precios por fecha (opcional)

---

## Criterios de Aceptación
1. ✅ CRUD completo funcional
2. ✅ Formularios con validación
3. ✅ Calendario interactivo
4. ✅ Fotos mock gestionables
5. ✅ Responsive mobile

**Milestone Anterior**: 02 | **Siguiente**: 04

