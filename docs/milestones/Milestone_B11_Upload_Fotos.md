# 📸 Milestone B11: Upload de Fotos Real (Cloudinary)

**Fecha**: Pendente  
**Prioridade**: Media | **Estado**: ⏳ Pendente  
**Depende de**: B2 completado (propiedades en BD real) ✅

---

## Obxectivo

Substituír as URLs de fotos mock (Unsplash/placeholders) por imaxes reais subidas polos propietarios. O formulario multi-step de creación/edición de finca (5 pasos) debe permitir subir imaxes e gardar as URLs de Cloudinary en MongoDB.

---

## Arquitectura

O upload faise en **dúas fases** para evitar gardar ficheiros no servidor de Express:

1. **Backend** xera un **signed upload URL** de Cloudinary
2. **Frontend** sube o ficheiro directamente a Cloudinary (sen pasar polo backend)
3. Cloudinary devolve a URL pública → gárdase en `property.photos[]`

Esta arquitectura é segura: a SK de Cloudinary nunca chega ao cliente.

---

## Cloudinary

- **Plan gratuíto**: 25 GB storage, 25 GB bandwidth/mes — suficiente para MVP
- **Configuración**: Upload Preset `unsigned` OU signed desde backend
- **Transformacións**: `c_fill,w_800,h_600,q_auto,f_auto` para optimizar

---

## Fase 1 — Backend

### 1.1 Instalar dependencia

```bash
npm install cloudinary
```

### 1.2 Config Cloudinary

```typescript
// FincAirbnb_backend/src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
```

### 1.3 Endpoints de upload

```
FincAirbnb_backend/src/modules/uploads/
├── uploads.routes.ts
└── uploads.controller.ts
```

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/uploads/sign` | Xera signature para upload directo | ✅ |
| `DELETE` | `/uploads/delete` | Elimina imaxe de Cloudinary por `publicId` | ✅ |

#### `POST /uploads/sign`

```typescript
// Body: { folder?: string }
// Response: { signature, timestamp, apiKey, cloudName, folder }
// Usa cloudinary.utils.api_sign_request()
```

#### `DELETE /uploads/delete`

```typescript
// Body: { publicId: string }
// Usa cloudinary.uploader.destroy(publicId)
// Verificar que o publicId pertence a unha finca do usuario (validación de ownership)
```

### 1.4 Validar ownership no PATCH de propiedades

En `PATCH /properties/:id`, verificar que `req.user.id === property.ownerId` antes de actualizar o array `photos`.

---

## Fase 2 — Frontend

### 2.1 Instalar dependencias

```bash
# Non necesita SDK — upload directo con fetch/FormData a Cloudinary API
```

### 2.2 Utilidade de upload

```typescript
// FincAirbnb_frontend/lib/cloudinary.ts

export async function uploadToCloudinary(file: File, folder = 'fincas'): Promise<string> {
  // 1. Pedir signature ao backend
  const { signature, timestamp, apiKey, cloudName } = await apiClient.post('/uploads/sign', { folder });
  
  // 2. Upload directo a Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', apiKey);
  formData.append('folder', folder);
  formData.append('transformation', 'c_fill,w_800,h_600,q_auto,f_auto');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST', body: formData
  });
  const data = await res.json();
  return data.secure_url; // URL pública HTTPS
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await apiClient.delete('/uploads/delete', { data: { publicId } });
}
```

### 2.3 Compoñente de upload

```
FincAirbnb_frontend/components/uploads/
├── PhotoUploader.tsx      # Drop zone + preview + progreso
└── PhotoGrid.tsx          # Grid de fotos con botón eliminar
```

#### `PhotoUploader.tsx`

- Drag & drop ou click para seleccionar ficheiros
- Preview inmediata (URL.createObjectURL)
- Progreso de upload (estado local)
- Límite: máx. 10 fotos por finca, máx. 5 MB por ficheiro
- Formatos: JPG, PNG, WebP

### 2.4 Integrar no formulario multi-step

**Paso 3 do formulario de finca** (`/taboleiro/fincas/crear` e `/taboleiro/fincas/[id]/editar`):

- Substituír o campo de texto "URL de foto" por `PhotoUploader`
- Ao subir → engadir URL ao array `photos` do formulario
- Ao eliminar → chamar `deleteFromCloudinary(publicId)` + eliminar do array

### 2.5 Actualizar cards de fincas

- `PropertyCard.tsx`: `<Image src={photo.url} />` con `next/image`
- `FincaBookingWidget.tsx`: foto da finca
- `solicitar/page.tsx`: foto da finca seleccionada
- Engadir `placeholder="blur"` e `blurDataURL` de Cloudinary (`c_fill,w_10,h_10,e_blur:1000`)

---

## Variables de entorno

```env
# Backend
CLOUDINARY_CLOUD_NAME=dxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Frontend (só cloud name, non secrets)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxxxx
```

---

## Migración de datos existentes

Os alugamentos e propiedades do seed teñen URLs de Unsplash. Dúas opcións:

**Opción A (MVP)**: Manter URLs de Unsplash no seed. Só as novas fincas creadas terán fotos de Cloudinary.

**Opción B (completo)**: Script de migración que descarga as imaxes de Unsplash e as sube a Cloudinary, actualizando `property.photos` en MongoDB.

→ **Recomendado para MVP**: Opción A.

---

## Ficheiros a crear/modificar

| Ficheiro | Acción |
|---|---|
| `FincAirbnb_backend/src/config/cloudinary.ts` | Novo |
| `FincAirbnb_backend/src/modules/uploads/uploads.routes.ts` | Novo |
| `FincAirbnb_backend/src/modules/uploads/uploads.controller.ts` | Novo |
| `FincAirbnb_backend/src/app.ts` | Rexistrar `/uploads` routes |
| `FincAirbnb_backend/.env` | Engadir CLOUDINARY_* vars |
| `FincAirbnb_frontend/lib/cloudinary.ts` | Novo — utilidades upload/delete |
| `FincAirbnb_frontend/components/uploads/PhotoUploader.tsx` | Novo |
| `FincAirbnb_frontend/components/uploads/PhotoGrid.tsx` | Novo |
| `FincAirbnb_frontend/app/taboleiro/fincas/crear/page.tsx` | Modificar paso 3 |
| `FincAirbnb_frontend/app/taboleiro/fincas/[id]/editar/page.tsx` | Modificar paso 3 |
| `FincAirbnb_frontend/.env` | Engadir NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME |

---

## Verificación

- [ ] `POST /uploads/sign` devolve signature válida
- [ ] Upload dun ficheiro PNG → URL `res.cloudinary.com/...` gardada en BD
- [ ] `DELETE /uploads/delete` → imaxe eliminada de Cloudinary
- [ ] Formulario de edición de finca mostra as fotos actuais + permite engadir/eliminar
- [ ] `next/image` carga fotos de Cloudinary sen erros de dominio (`domains` en `next.config.js`)
- [ ] Ficheiro >5MB → rexeitado con mensaxe de erro
- [ ] Máis de 10 fotos → botón de subir desactivado
