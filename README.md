# FincAirbnb — Frontend

> **FincAirbnb** es la cara visible de un experimento: en un curso online pidieron montar algo parecido a la plataforma de alquileres que todo el mundo nombra con dos sílabas; esta es **mi versión mini y un poco paródica**: fincas rurales, humor y **interfaz en gallego** (URLs y copy), porque el chiste también es el idioma.

No es un clon funcional de ningún producto real: es un **MVP de estudio** con auth, catálogo, reservas/alugamentos, mensajería, valoraciones, pagos de prueba (Stripe), mapa opcional (Mapbox) y subida de fotos (Cloudinary).

---

## Stack

| Pieza | Tecnología |
|-------|------------|
| Framework | Next.js 13 (App Router) + React 18 |
| Estilo | Tailwind CSS, Radix / shadcn |
| Formularios | react-hook-form + Zod |
| Mapas (opcional) | Mapbox GL (`NEXT_PUBLIC_MAPBOX_TOKEN`) |
| Pagos (cliente) | Stripe.js (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) |
| API | Tu backend Express; las rutas bajo `/api/...` |

---

## Requisitos

- Node.js 20+
- El **backend** corriendo (repo hermano `FincAirbnb_backend`) o una URL de API desplegada

---

## Puesta en marcha local

### 1. Clonar y dependencias

```bash
git clone <este-repo>
cd FincAirbnb_frontend   # o como lo hayas llamado
npm ci
```

### 2. Variables de entorno

Crea `.env.local` (Next la carga sola y **no** debe subirse a git):

```bash
cp .env.example .env.local
```

Mínimo para trabajar contra tu API:

```env
NEXT_PUBLIC_USE_EXTERNAL_API=true
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Producción (ej. Vercel):** misma clave, pero con la URL pública del backend, **incluyendo `/api` al final**:

```env
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
```

Opcionales según features:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.ey...   # si quieres mapa en detalle de finca
```

### 3. Arrancar

```bash
npm run dev
```

Abre `http://localhost:3000`. Si el backend no está levantado o `NEXT_PUBLIC_API_URL` apunta mal, verás errores de red en consola.

---

## Scripts

| Comando | Uso |
|---------|-----|
| `npm run dev` | Desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build (tras `build`) |
| `npm run lint` | ESLint |
| `npm run test:rules` | Comprobaciones de rama / reglas del repo |

---

## Despliegue (esquema rápido)

```
1. Vercel (o similar)
   └── Importar repo → root del proyecto Next
   └── Variables de entorno (Production):
         NEXT_PUBLIC_USE_EXTERNAL_API=true
         NEXT_PUBLIC_API_URL=https://TU-API/api
         NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  (si usas pagos)
         NEXT_PUBLIC_MAPBOX_TOKEN=...                    (opcional)

2. Redeploy después de cambiar NEXT_PUBLIC_*
   └── Esas variables se inyectan en tiempo de build
```

**CORS:** el backend debe permitir el origen de tu dominio Vercel (`CORS_ORIGIN` en el servidor).

---

## Estructura (resumen)

- `app/` — Rutas App Router (`/fincas`, `/taboleiro`, `/rexistro`…)
- `components/` — UI reutilizable
- `contexts/` — Auth y estado global ligero
- `services/` — Cliente HTTP (`apiClient`) y servicios
- `mocks/` — Datos JSON para seed del backend (ver README del backend)
- `docs/` — Milestones y notas de desarrollo

Más detalle: `docs/` (milestones, contrato FE/BE), `AGENTS.MD`, y si lo necesitas `RESUMEN_EJECUTIVO.md`.

---

## Idioma

- **UI y rutas:** gallego (`gl` en layout).
- **Este README y parte de la documentación:** español o mixto según carpeta.

---

## Seguridad antes de hacer el repo público

- No subas `.env`, `.env.local`, ni carpetas `.vercel` con tokens.
- Las claves públicas de Stripe (`pk_...`) pueden estar en el front; el resto solo en el servidor.
- Revisa que no haya secretos en issues, commits o capturas.

---

## Licencia

Este proyecto se distribuye bajo [Creative Commons Zero 1.0 (CC0)](https://creativecommons.org/publicdomain/zero/1.0/): úsalo, cópialo o déjalo vivir su vida.
