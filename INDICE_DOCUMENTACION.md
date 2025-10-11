# 📚 Índice de Documentación - FincAirbnb

## 🎯 Documentación Principal

### 📄 Archivos de Raíz
- **`README.md`** - Guía de inicio rápido en gallego
- **`AGENTS.MD`** - Documentación técnica completa para IA (inglés)
- **`RESUMEN_EJECUTIVO.md`** - Resumen ejecutivo del negocio (español)
- **`ESTRUCTURA_PROYECTO.md`** - Estructura del monorepo y convenciones

---

## 📁 Estructura de Documentación

### 🏗️ `/context/` - Documentación Técnica (Inglés)
**Para desarrolladores y modelos de IA**

#### `/context/business/`
- **`business-model.md`** - Modelo de negocio y monetización
- **`user-personas.md`** - Personas de usuario y casos de uso
- **`kpis-metrics.md`** - Métricas y KPIs del negocio

#### `/context/design/`
- **`brand-identity.md`** - Identidad de marca y colores
- **`galician-language-policy.md`** - Política de idioma gallego
- **`ui-ux-guidelines.md`** - Guías de diseño UI/UX
- **`url-mapping.md`** - Mapeo de URLs en gallego

#### `/context/features/`
- **`property-listing.md`** - Sistema de listado de propiedades
- **`booking-system.md`** - Sistema de reservas
- **`payment-integration.md`** - Integración de pagos
- **`messaging-system.md`** - Sistema de mensajería
- **`reviews-ratings.md`** - Sistema de reseñas

#### `/context/integrations/`
- **`payment-gateways.md`** - Pasarelas de pago
- **`calendar-sync.md`** - Sincronización de calendarios
- **`notification-services.md`** - Servicios de notificaciones

#### `/context/technical/`
- **`architecture.md`** - Arquitectura del sistema
- **`tech-stack.md`** - Stack tecnológico
- **`authentication-system.md`** - Sistema de autenticación

---

### 📋 `/docs/` - Documentación de Desarrollo (Español)
**Para desarrolladores y gestión del proyecto**

#### `/docs/milestones/` - Hitos de Desarrollo
- **`README.md`** - Índice de milestones
- **`Milestone_01_Estructura_Mock_Dashboard.md`** - Estructura y dashboard base
- **`Milestone_02_Dashboard_Propietario_General.md`** - Dashboard del propietario
- **`Milestone_03_Xestion_Propiedades.md`** - Gestión de propiedades
- **`Milestone_04_Dashboard_Cliente.md`** - Dashboard del cliente
- **`Milestone_05_Catalogo_Busqueda.md`** - Catálogo y búsqueda
- **`Milestone_06_Detalle_Propiedad.md`** - Detalle de propiedad
- **`Milestone_07_Sistema_Reservas.md`** - Sistema de reservas
- **`Milestone_08_Sistema_Reviews.md`** - Sistema de reseñas
- **`Milestone_09_Sistema_Mensaxeria.md`** - Sistema de mensajería
- **`Milestone_10_Perfiles_Configuracion.md`** - Perfiles y configuración

#### `/docs/implementations/` - Implementaciones Completadas
- **`MILESTONE_01_VERIFICATION.md`** - Verificación del Milestone 01
- **`MILESTONE_02_COMPLETADO.md`** - Implementación completada del Milestone 02
- **`MILESTONE_03_PROGRESO.md`** - Progreso del Milestone 03

#### `/docs/fixes/` - Correcciones y Soluciones
- **`CORRECCION_ERRORES_M03.md`** - Corrección de errores en Milestone 03
- **`CORRECCION_NAVEGACION_DASHBOARD.md`** - Corrección de navegación
- **`SOLUCION_404_ACEDER.md`** - Solución del error 404 en /acceder
- **`SOLUCION_ERRORES_HIDRATACION.md`** - Primera versión de solución
- **`SOLUCION_ERRORES_HIDRATACION_V2.md`** - Solución completa de hidratación

#### `/docs/updates/` - Actualizaciones y Mejoras
- **`ACTUALIZACION_CREDENCIALES.md`** - Actualización de credenciales de prueba
- **`ACTUALIZACION_IDIOMA_DASHBOARD.md`** - Actualización de idioma en dashboard
- **`ACTUALIZACION_TERMINOS_AGRICOLAS.md`** - Actualización de términos agrícolas

#### `/docs/verifications/` - Verificaciones
- **`MILESTONE_01_VERIFICATION.md`** - Verificación final del Milestone 01

#### `/docs/development/` - Guías de Desarrollo
- **`README.md`** - Índice de guías de desarrollo
- **`header-integration.md`** - Integración del header
- **`phase1-implementation.md`** - Implementación de Fase 1
- **`phase2-complete.md`** - Completado de Fase 2

#### `/docs/` - Documentación General
- **`README.md`** - Índice general de documentación
- **`IMPLEMENTACION_COMPLETA.md`** - Documentación de implementación completa
- **`PHASE1_COMPLETE.md`** - Documentación de Fase 1 completada
- **`TERMINOS_AGRICOLAS_GALEGOS.md`** - Términos agrícolas en gallego

---

## 🗂️ Estructura de Código

### 📁 `/shared/` - Tipos y Constantes Compartidas
- **`/types/`** - Definiciones de tipos TypeScript
  - `user.ts` - Tipos de usuario y autenticación
  - `property.ts` - Tipos de propiedades
  - `booking.ts` - Tipos de reservas
  - `message.ts` - Tipos de mensajería
  - `review.ts` - Tipos de reseñas
  - `index.ts` - Exportaciones centralizadas

### 📁 `/services/` - Servicios Mock
- **`mockAuth.ts`** - Servicio de autenticación mock
- **`mockProperties.ts`** - Servicio de propiedades mock
- **`mockBookings.ts`** - Servicio de reservas mock
- **`mockMessages.ts`** - Servicio de mensajería mock
- **`mockReviews.ts`** - Servicio de reseñas mock
- **`mockStats.ts`** - Servicio de estadísticas mock
- **`utils.ts`** - Utilidades comunes

### 📁 `/mocks/` - Datos Mock
- **`users.json`** - Usuarios de prueba
- **`properties.json`** - Propiedades de prueba
- **`bookings.json`** - Reservas de prueba
- **`messages.json`** - Mensajes de prueba
- **`reviews.json`** - Reseñas de prueba

### 📁 `/components/` - Componentes React
- **`/auth/`** - Componentes de autenticación
- **`/dashboard/`** - Componentes del dashboard
- **`/properties/`** - Componentes de propiedades
- **`/ui/`** - Componentes UI reutilizables

---

## 🚀 Guía de Navegación Rápida

### Para Desarrolladores
1. **Empezar aquí**: `README.md` (gallego)
2. **Arquitectura**: `/context/technical/architecture.md`
3. **Milestones actuales**: `/docs/milestones/README.md`
4. **Implementaciones**: `/docs/implementations/`

### Para IA/Agentes
1. **Documentación completa**: `AGENTS.MD`
2. **Contexto técnico**: `/context/README.md`
3. **Milestones**: `/docs/milestones/`

### Para Stakeholders
1. **Resumen ejecutivo**: `RESUMEN_EJECUTIVO.md`
2. **Modelo de negocio**: `/context/business/business-model.md`
3. **Progreso**: `/docs/implementations/`

### Para Correcciones
1. **Errores recientes**: `/docs/fixes/`
2. **Actualizaciones**: `/docs/updates/`
3. **Verificaciones**: `/docs/verifications/`

---

## 📝 Convenciones de Documentación

### Idiomas
- **Gallego**: UI/UX, URLs, contenido visible al usuario
- **Español**: Documentación de desarrollo, milestones
- **Inglés**: Documentación técnica, contexto para IA

### Nomenclatura
- **Archivos de milestone**: `MILESTONE_XX_DESCRIPCION.md`
- **Correcciones**: `CORRECCION_DESCRIPCION.md`
- **Soluciones**: `SOLUCION_DESCRIPCION.md`
- **Actualizaciones**: `ACTUALIZACION_DESCRIPCION.md`

### Estructura
- **Encabezados**: Jerarquía clara con emojis
- **Código**: Bloques de código con sintaxis highlighting
- **Estado**: Marcadores de progreso (✅ ❌ 🚧)
- **Enlaces**: Referencias cruzadas entre documentos

---

## 🔄 Mantenimiento

### Archivos a Mantener Actualizados
- `AGENTS.MD` - Cuando se agreguen nuevas funcionalidades
- `README.md` - Cuando cambien instrucciones de inicio
- `/docs/milestones/README.md` - Progreso de milestones
- Este índice - Cuando se agreguen nuevos documentos

### Archivos Obsoletos
- Los archivos de `/docs/fixes/` pueden archivarse después de 6 meses
- Los archivos de `/docs/updates/` pueden consolidarse periódicamente
- Los archivos de verificación pueden eliminarse después de completar el milestone

---

**Última actualización**: 11 de octubre de 2025  
**Versión**: 1.0  
**Mantenido por**: Equipo de desarrollo FincAirbnb
