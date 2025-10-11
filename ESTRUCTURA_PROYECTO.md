# Estructura del Proyecto FincAirbnb

## Visión General

FincAirbnb está organizado como un **monorepo** con frontend y backend claramente separados. Actualmente, el desarrollo se centra en el **frontend con datos mock** antes de implementar el backend real.

---

## Estructura de Carpetas

```
FincAirbnb/                      # Raíz del monorepo
│
├── 📁 FRONTEND (Actual - Next.js 13)
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Rutas de autenticación
│   │   │   ├── rexistro/
│   │   │   ├── acceder/
│   │   │   └── recuperar-contrasinal/
│   │   ├── dashboard/          # Alias temporal (mover a taboleiro)
│   │   ├── taboleiro/          # Dashboard protegido (futuro)
│   │   ├── fincas/             # Catálogo de propiedades
│   │   ├── perfil/             # Perfil de usuario
│   │   ├── layout.tsx          # Layout raíz
│   │   └── page.tsx            # Homepage
│   │
│   ├── components/              # Componentes React
│   │   ├── auth/               # Autenticación
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── properties/         # Propiedades components
│   │   └── shared/             # Componentes compartidos
│   │
│   ├── contexts/                # React Context API
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── use-toast.ts
│   │
│   ├── lib/                     # Utilidades
│   │   ├── auth-mock.ts        # Auth mock (actual)
│   │   └── utils.ts
│   │
│   ├── mocks/                   # 🆕 Datos JSON mock
│   │   ├── users.json
│   │   ├── properties.json
│   │   ├── bookings.json
│   │   ├── messages.json
│   │   ├── reviews.json
│   │   └── README.md
│   │
│   ├── services/                # 🆕 Mock services (simulan API)
│   │   ├── mockAuth.ts
│   │   ├── mockProperties.ts
│   │   ├── mockBookings.ts
│   │   ├── mockMessages.ts
│   │   ├── mockReviews.ts
│   │   └── README.md
│   │
│   ├── types/                   # TypeScript types
│   │   └── auth.ts
│   │
│   ├── middleware.ts            # Next.js middleware
│   ├── next.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
├── 📁 BACKEND (Futuro)
│   ├── src/
│   │   ├── api/                # API routes
│   │   ├── controllers/        # Controladores
│   │   ├── services/           # Lógica de negocio
│   │   ├── models/             # Modelos de datos
│   │   ├── middleware/         # Middleware
│   │   ├── utils/              # Utilidades
│   │   └── server.ts           # Entry point
│   │
│   ├── prisma/                 # Prisma ORM
│   │   └── schema.prisma
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 📁 SHARED (Código compartido)
│   ├── types/                  # Types compartidos
│   │   ├── user.ts
│   │   ├── property.ts
│   │   ├── booking.ts
│   │   ├── message.ts
│   │   └── review.ts
│   │
│   ├── constants/              # Constantes
│   │   ├── roles.ts
│   │   ├── status.ts
│   │   └── config.ts
│   │
│   └── utils/                  # Utilidades compartidas
│       └── validators.ts
│
├── 📁 DOCUMENTACIÓN
│   ├── context/                # Docs técnicas (inglés)
│   │   ├── business/
│   │   ├── technical/
│   │   ├── features/
│   │   ├── design/
│   │   └── integrations/
│   │
│   ├── docs/                   # Docs de desarrollo (español)
│   │   ├── milestones/         # Milestones de desarrollo
│   │   │   ├── Milestone_00.md (✅ Completado)
│   │   │   ├── Milestone_01.md (🆕)
│   │   │   ├── Milestone_02.md (🆕)
│   │   │   └── ... (hasta 10)
│   │   └── development/
│   │
│   ├── AGENTS.MD              # Para agentes de IA
│   ├── RESUMEN_EJECUTIVO.md   # Para stakeholders
│   └── ESTRUCTURA_PROYECTO.md # Este archivo
│
├── 📁 RAÍZ
│   ├── .gitignore
│   ├── README.md              # README principal (gallego)
│   └── package.json           # Workspace root (opcional)
│
└── 📁 ASSETS (futuro)
    └── images/

```

---

## Estado Actual vs. Futuro

### ✅ Estado Actual (Fase 1 Completada)

**Ubicación**: Raíz del proyecto (actúa como frontend)

**Implementado**:
- ✅ Sistema de autenticación mock
- ✅ Registro, login, recuperación de contraseña
- ✅ Dashboard básico
- ✅ Protección de rutas
- ✅ Gestión de perfil
- ✅ UI components (shadcn/ui)

**Estructura actual**:
```
/ (raíz = frontend)
├── app/
├── components/
├── contexts/
├── lib/
├── types/
└── middleware.ts
```

### 🔄 Próximos Pasos (Fase 2+)

**A añadir**:
- 🆕 `/mocks/` - Datos JSON mock
- 🆕 `/services/` - Servicios que simulan API
- 🆕 `/shared/` - Código compartido (types, constants)
- 🆕 `/backend/` - Estructura vacía para futuro

**Reorganización mínima**:
- Mover código de `/lib/auth-mock.ts` a `/services/mockAuth.ts` (futuro)
- Centralizar types en `/shared/types/`
- Mantener compatibilidad con código existente

---

## Filosofía de Desarrollo

### Fase Frontend (Actual - Milestones 1-10)

**Objetivo**: Construir toda la UI/UX con datos mock

**Tecnologías**:
- Next.js 13 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Context API para estado
- JSON files para datos mock

**Ventajas**:
- Desarrollo rápido sin dependencias de backend
- Iteración rápida en diseño
- Permite testing de UX temprano
- Datos predecibles y controlables

### Fase Backend (Futuro - Post Milestone 10)

**Objetivo**: API real con base de datos

**Tecnologías previstas**:
- Node.js + Express o Next.js API Routes
- PostgreSQL + Prisma ORM
- JWT Authentication
- Stripe + Redsys para pagos

**Migración**:
- Los servicios mock se reemplazan por llamadas API reales
- Los types compartidos se mantienen
- La UI permanece igual (solo cambia el origen de datos)

---

## Convenciones de Código

### Nomenclatura de Archivos

```
PascalCase:    Componentes React (Button.tsx, PropertyCard.tsx)
camelCase:     Funciones, hooks, utils (useAuth.ts, formatDate.ts)
kebab-case:    Rutas de app/ (rexistro/, taboleiro/)
UPPERCASE:     Constantes (ROLES.ts, CONFIG.ts)
lowercase:     Archivos de config (package.json, tsconfig.json)
```

### Estructura de Componentes

```typescript
// ComponentName.tsx
import { ... } from '...'

// Types
interface ComponentNameProps {
  ...
}

// Component
export function ComponentName({ props }: ComponentNameProps) {
  // Hooks
  const [state, setState] = useState(...)
  
  // Handlers
  const handleAction = () => { ... }
  
  // Effects
  useEffect(() => { ... }, [])
  
  // Render
  return (
    <div>...</div>
  )
}

// Exports
export default ComponentName
```

### Organización de Imports

```typescript
// 1. React
import { useState, useEffect } from 'react'

// 2. Next.js
import { useRouter } from 'next/navigation'

// 3. External libraries
import { toast } from 'sonner'

// 4. Internal: Types
import type { User, Property } from '@/shared/types'

// 5. Internal: Services
import { getProperties } from '@/services/mockProperties'

// 6. Internal: Components
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/PropertyCard'

// 7. Internal: Utils
import { formatDate, formatPrice } from '@/lib/utils'

// 8. Styles
import styles from './Component.module.css'
```

---

## Datos Mock

### Ubicación: `/mocks/`

Archivos JSON con datos de ejemplo para desarrollo:

- `users.json` - Usuarios (propietarios, huéspedes, admin)
- `properties.json` - Propiedades/fincas
- `bookings.json` - Reservas
- `messages.json` - Mensajes
- `reviews.json` - Reseñas

### Servicios Mock: `/services/`

Funciones que simulan llamadas API:

```typescript
// services/mockProperties.ts
export async function getProperties(filters?: PropertyFilters) {
  // Simula delay de red
  await delay(300)
  
  // Lee datos de JSON
  const properties = await import('@/mocks/properties.json')
  
  // Aplica filtros
  return filterProperties(properties.default, filters)
}
```

**Ventajas**:
- Simula latencia real de red
- Permite testing de estados de carga
- Fácil de reemplazar con API real
- No requiere backend funcionando

---

## Migraciones Futuras

### De Mock a API Real

**Antes** (Mock):
```typescript
import { getProperties } from '@/services/mockProperties'

const properties = await getProperties({ city: 'Pontevedra' })
```

**Después** (API):
```typescript
import { getProperties } from '@/services/api/properties'

const properties = await getProperties({ city: 'Pontevedra' })
```

**Cambios necesarios**:
1. Crear archivo nuevo: `/services/api/properties.ts`
2. Implementar fetch a endpoint real
3. Actualizar imports en componentes
4. Los types y la lógica de UI permanecen iguales

---

## Scripts Útiles

```bash
# Desarrollo
npm run dev              # Inicia Next.js dev server

# Build
npm run build            # Build para producción
npm run start            # Sirve build de producción

# Linting
npm run lint             # ESLint

# Type checking
npx tsc --noEmit         # Verifica tipos sin compilar

# Futuro: Backend
cd backend
npm run dev              # API dev server (futuro)
```

---

## Variables de Entorno

### Frontend (Actual)

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_DELAY=300  # ms
```

### Backend (Futuro)

```bash
# backend/.env
DATABASE_URL=postgresql://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
REDSYS_SECRET_KEY=...
```

---

## Milestones de Desarrollo

| # | Milestone | Duración | Estado |
|---|-----------|----------|--------|
| 0 | Autenticación y Base | - | ✅ Completado |
| 1 | Estructura Mock + Dashboard Base | 1 sem | 📅 Planificado |
| 2 | Dashboard Propietario - Vista General | 1.5 sem | 📅 Planificado |
| 3 | Dashboard Propietario - Gestión | 2 sem | 📅 Planificado |
| 4 | Dashboard Cliente/Huésped | 1 sem | 📅 Planificado |
| 5 | Catálogo + Búsqueda | 2 sem | 📅 Planificado |
| 6 | Detalle de Propiedad | 1.5 sem | 📅 Planificado |
| 7 | Sistema de Reservas (UI) | 2 sem | 📅 Planificado |
| 8 | Sistema de Reviews (UI) | 1 sem | 📅 Planificado |
| 9 | Mensajería (UI) | 1.5 sem | 📅 Planificado |
| 10 | Perfiles + Configuración | 1 sem | 📅 Planificado |

**Total Frontend**: ~14 semanas (~3.5 meses)

Ver `/docs/milestones/` para detalles de cada milestone.

---

## Preguntas Frecuentes

### ¿Por qué monorepo?

- **Simplicidad**: Todo en un lugar
- **Aprendizaje**: Ver frontend y backend juntos
- **Compartir código**: Types, constantes, utils
- **Un solo repositorio Git**: Más fácil de gestionar

### ¿Cuándo empezamos con backend?

Después de completar los 10 milestones de frontend. Así tendremos:
- UI/UX validada y pulida
- Todos los flujos probados con mocks
- Especificaciones claras de qué necesita el backend

### ¿Los mocks no son desperdicio?

No, porque:
- Permiten desarrollo frontend independiente
- Sirven para testing
- Documentan la estructura de datos esperada
- Facilitan demos sin backend funcionando

### ¿Cómo contribuir?

1. Leer `/docs/README.md` y `/AGENTS.MD`
2. Revisar milestone actual en `/docs/milestones/`
3. Seguir convenciones de este documento
4. Mantener política de idioma gallego en UI

---

**Última Actualización**: Octubre 2024  
**Versión**: 2.0 (Reestructuración monorepo)  
**Mantenido por**: Equipo de desarrollo

