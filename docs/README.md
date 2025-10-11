# 📚 Documentación FincAirbnb

Esta carpeta contiene la documentación de desarrollo del proyecto FincAirbnb (en español).

## 📁 Estructura de Documentación del Proyecto

### `/docs/` - Documentación de Desarrollo (Español)
Guías y planes de desarrollo para el equipo.

```
docs/
├── README.md                 # Este archivo
├── milestones/              # Planes de desarrollo por milestone
│   └── Milestone_01.md      # Sistema de Autenticación y Dashboard
├── development/             # Documentación técnica de desarrollo
├── api/                     # Documentación de APIs (cuando existan)
└── deployment/              # Guías de despliegue
```

### `/context/` - Documentación Técnica (Inglés)
Especificaciones completas para agentes de IA y desarrolladores internacionales.

```
context/
├── business/                # Modelo de negocio, personas, KPIs
├── technical/               # Arquitectura, stack técnico
├── features/                # Especificaciones de funcionalidades
├── design/                  # Guías de diseño, marca, idioma
└── integrations/            # Integraciones externas
```

### Archivos Raíz
- **`AGENTS.MD`**: Punto de entrada principal para agentes de IA (inglés)
- **`RESUMEN_EJECUTIVO.md`**: Resumen para stakeholders no técnicos (español)
- **`README.md`**: Documentación del proyecto (gallego)

## 🚀 Milestones

- **Milestone 01:** ✅ Sistema de Autenticación y Dashboard (Completado)
- **Milestone 02:** Sistema de listado de propiedades (En planificación)
- **Milestone 03:** Sistema de reservas (Planificado)
- **Milestone 04:** Integración de pagos (Planificado)
- **Milestone 05:** Sistema de mensajería (Planificado)
- **Milestone 06:** Reseñas y valoraciones (Planificado)

## 📖 Cómo usar esta documentación

### Para Agentes de IA / Desarrolladores
1. **Lee primero**: `/AGENTS.MD` - Contexto completo del proyecto
2. **Arquitectura**: `/context/technical/architecture.md`
3. **Stack técnico**: `/context/technical/tech-stack.md`
4. **Funcionalidades**: `/context/features/` - Especificaciones detalladas

### Para el Equipo de Desarrollo
1. **Milestones**: `/docs/milestones/` - Planes de cada fase
2. **Development**: `/docs/development/` - Guías de implementación
3. **Política de idiomas**: `/context/design/galician-language-policy.md`

### Para Product Owner / Stakeholders
1. **Resumen ejecutivo**: `/RESUMEN_EJECUTIVO.md` - Visión general en español
2. **Business docs**: `/context/business/` - Modelo de negocio, métricas
3. **Milestones**: `/docs/milestones/` - Progreso y planes

### Para Diseño y UX
1. **UI/UX Guidelines**: `/context/design/ui-ux-guidelines.md`
2. **Brand Identity**: `/context/design/brand-identity.md`
3. **Language Policy**: `/context/design/galician-language-policy.md`
4. **URL Mapping**: `/context/design/url-mapping.md`

## 🌍 Política de Idiomas

**Importante**: El proyecto sigue una política estricta de idiomas:

- **Interfaz de usuario**: 🟢 Gallego (100%)
- **URLs**: 🟢 Gallego (ej: `/rexistro`, `/taboleiro`)
- **Documentación técnica** (`/context/`): 🔴 Inglés
- **Documentación de desarrollo** (`/docs/`): 🟡 Español
- **Resumen ejecutivo**: 🟡 Español
- **Código**: 🔴 Inglés (variables, funciones, comentarios)

Ver `/context/design/galician-language-policy.md` para detalles completos.

## 🔗 Enlaces Rápidos

- [AGENTS.MD](../AGENTS.MD) - Guía principal para IA
- [RESUMEN_EJECUTIVO.md](../RESUMEN_EJECUTIVO.md) - Resumen del proyecto
- [Business Model](../context/business/business-model.md) - Modelo de negocio
- [Architecture](../context/technical/architecture.md) - Arquitectura técnica
- [UI/UX Guidelines](../context/design/ui-ux-guidelines.md) - Guías de diseño

## 🔄 Actualizaciones

- **Octubre 2024**: Documentación completa creada
  - Estructura `/context/` con 20+ documentos técnicos
  - AGENTS.MD y RESUMEN_EJECUTIVO.md
  - Milestone 01 completado

Esta documentación se actualiza con cada milestone completado y cada nueva funcionalidad implementada.
