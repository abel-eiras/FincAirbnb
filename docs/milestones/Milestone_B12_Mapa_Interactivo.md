# 🗺️ Milestone B12: Mapa Interactivo (Mapbox GL)

**Data**: 2026-04-03  
**Prioridade**: Media | **Estado**: ✅ Completado  
**Depende de**: B2 completado (propiedades con `location.coordinates` en BD) ✅

---

## Obxectivo

Substituír o placeholder gris "Mapa interactivo" en `/fincas/[id]` (~liña 295) por un mapa real de Mapbox GL que mostre a ubicación exacta da finca con un marcador. As propiedades xa teñen o campo `location.coordinates?: { lat, lng }` no tipo (`shared/types/property.ts:28`).

---

## Provedor elixido: Mapbox

- **Plan gratuíto**: 50.000 cargas de mapa/mes — suficiente para MVP e TFG
- **Alternativa**: Google Maps (require tarxeta de crédito, máis complexo)
- **SDK**: `react-map-gl` (wrapper React oficial para Mapbox GL JS)
- **Autenticación**: token público (`pk.ey...`) que vai ao cliente — non é un secret

---

## Fase 1 — Backend (mínima intervención)

### 1.1 Engadir coordenadas ao seed

Os documentos de propiedades no seed non teñen `coordinates`. Hai que engadilas:

```typescript
// FincAirbnb_backend/src/seeds/properties.seed.ts
// Engadir a cada propiedade dentro de `location`:
location: {
  city: "Pontevedra",
  province: "Pontevedra",
  region: "Galicia",
  postalCode: "36001",
  coordinates: { lat: 42.4298, lng: -8.6446 }  // coordenadas reais da cidade
}
```

Coordenadas de referencia para o seed:
| Cidade       | lat     | lng     |
|--------------|---------|---------|
| Pontevedra   | 42.4298 | -8.6446 |
| Santiago     | 42.8782 | -8.5448 |
| A Coruña     | 43.3623 | -8.4115 |
| Lugo         | 43.0097 | -7.5560 |
| Ourense      | 42.3364 | -7.8641 |
| Vigo         | 42.2328 | -8.7226 |

Tras editar o seed:
```bash
cd FincAirbnb_backend
npm run seed:mocks
```

### 1.2 Verificar que `GET /api/properties/:id` devolve coordinates

O campo xa está no schema Mongoose (schema solto con `strict: false`), polo que non require cambios no modelo. Só verificar que o seed o inclúe e que `serializeDoc` non o elimina.

---

## Fase 2 — Frontend

### 2.1 Instalar dependencias

```bash
cd FincAirbnb_frontend
npm install mapbox-gl react-map-gl
npm install --save-dev @types/mapbox-gl
```

### 2.2 Obter token de Mapbox

1. Rexístrate en [mapbox.com](https://mapbox.com) → Create account
2. Dashboard → Tokens → copia o "Default public token" (`pk.ey...`)
3. Engade ao `FincAirbnb_frontend/.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoixxxxxxx...
```

### 2.3 Crear o compoñente `PropertyMap`

```
FincAirbnb_frontend/components/map/
└── PropertyMap.tsx
```

```typescript
// FincAirbnb_frontend/components/map/PropertyMap.tsx
"use client";

import { useRef } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface PropertyMapProps {
  lat: number;
  lng: number;
  city: string;
  province: string;
}

export default function PropertyMap({ lat, lng, city, province }: PropertyMapProps) {
  return (
    <div className="h-72 w-full rounded-lg overflow-hidden">
      <Map
        initialViewState={{ longitude: lng, latitude: lat, zoom: 12 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <div className="text-3xl" title={`${city}, ${province}`}>📍</div>
        </Marker>
      </Map>
    </div>
  );
}
```

**Notas de implementación:**
- `"use client"` obrigatorio — Mapbox GL usa APIs do navegador (`window`, `WebGL`)
- `mapStyle="outdoors-v12"` é o estilo máis apropiado para fincas rurais (terreo, ríos, montes)
- O marcador usa emoji para evitar dependencias de imaxe; pódese substituír por un SVG customizado

### 2.4 Integrar na páxina de detalle

**Ficheiro**: `FincAirbnb_frontend/app/fincas/[id]/page.tsx` (~liña 291)

Substituír o bloque `{/* Ubicación */}` completo:

```tsx
// ANTES (~liña 291-303):
<Card>
  <CardContent className="p-6">
    <h2 className="text-2xl font-bold text-galician-blue mb-4">Onde está</h2>
    <div className="bg-gray-100 rounded-lg p-8 text-center">
      <div className="text-4xl mb-4">🗺️</div>
      <p className="text-gray-600">Mapa interactivo</p>
      <p className="text-sm text-gray-500 mt-2">
        {property.location?.city}, {property.location?.province}
      </p>
    </div>
  </CardContent>
</Card>

// DESPOIS:
<Card>
  <CardContent className="p-6">
    <h2 className="text-2xl font-bold text-galician-blue mb-4">Onde está</h2>
    {property.location?.coordinates ? (
      <PropertyMap
        lat={property.location.coordinates.lat}
        lng={property.location.coordinates.lng}
        city={property.location.city}
        province={property.location.province}
      />
    ) : (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">🗺️</div>
        <p className="text-gray-500 text-sm">
          {property.location?.city}, {property.location?.province}
        </p>
      </div>
    )}
    <p className="text-sm text-gray-500 mt-3">
      📍 {property.location?.city}, {property.location?.province}
    </p>
  </CardContent>
</Card>
```

Engadir o import ao principio do ficheiro:
```tsx
import dynamic from "next/dynamic";
const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), { ssr: false });
```

**Por que `dynamic` con `ssr: false`?** Mapbox GL JS usa `window` e WebGL, que non están dispoñibles no servidor. O import dinámico evita erros de hidratación en Next.js.

### 2.5 Configurar dominio de Mapbox en next.config.js

Non é necesario para Mapbox (as tiles non usan `next/image`), pero sí para o CSS:

```javascript
// FincAirbnb_frontend/next.config.js — sen cambios necesarios
// Mapbox GL JS carga o CSS vía import, non require configuración adicional
```

---

## Caso sen coordenadas

Se unha finca non ten `coordinates` no BD (fincas antigas do seed ou creadas sen coordenadas), o compoñente mostra o fallback con texto. Non hai erros.

Para o formulario de creación de finca (`/taboleiro/fincas/crear`, paso 2 — ubicación), engadir un campo opcional de coordenadas ou un mini-mapa de selección é mellora futura fóra do scope deste milestone.

---

## Variables de entorno

```env
# FincAirbnb_frontend/.env.local
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoixxxxxxx...
```

O token é público (prefixo `pk.`) — vai ao navegador, non é un secret. Aínda así, en Mapbox Dashboard podes restrinxilo a dominios específicos (recomendado para produción).

---

## Ficheiros a crear/modificar

| Ficheiro | Acción |
|---|---|
| `FincAirbnb_backend/src/seeds/properties.seed.ts` | Engadir `coordinates` a cada propiedade |
| `FincAirbnb_frontend/components/map/PropertyMap.tsx` | Novo — compoñente de mapa |
| `FincAirbnb_frontend/app/fincas/[id]/page.tsx` | Substituír placeholder (~liña 291) por `PropertyMap` |
| `FincAirbnb_frontend/.env.local` | Engadir `NEXT_PUBLIC_MAPBOX_TOKEN` |

---

## Verificación

- [ ] `NEXT_PUBLIC_MAPBOX_TOKEN` configurado en `.env.local`
- [ ] `npm install mapbox-gl react-map-gl` completado sen erros
- [ ] Seed executado con `coordinates` en todas as propiedades
- [ ] `/fincas/[id]` mostra mapa real con marcador na ubicación correcta
- [ ] Fallback (texto con cidade) móstrase se a finca non ten coordenadas
- [ ] O mapa é responsive (ocupa o ancho completo na card)
- [ ] Non hai erros de SSR en `npm run build`
- [ ] Controis de zoom (+/-) visibles e funcionais
