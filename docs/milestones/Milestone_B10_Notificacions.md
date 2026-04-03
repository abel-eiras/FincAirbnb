# 🔔 Milestone B10: Sistema de Notificacións

**Fecha**: Pendente  
**Prioridade**: Media | **Estado**: ⏳ Pendente  
**Depende de**: B3-FIX, B9 (os eventos que disparan notificacións)

---

## Obxectivo

Implementar un sistema de notificacións persistentes en MongoDB. Cada acción relevante (nova solicitude, aceptación, pago, mensaxe) xera unha notificación para o usuario destinatario. O taboleiro mostra un badge co número de notificacións non lidas.

---

## Colección MongoDB: `notifications`

```typescript
interface Notification {
  _id: ObjectId;
  userId: string;        // destinatario
  type: NotificationType;
  title: string;         // ex: "Nova solicitude de alugamento"
  message: string;       // ex: "Xoán García solicitou A Finca do Río"
  link?: string;         // ex: "/taboleiro/alugamentos-recibidos"
  read: boolean;         // default false
  createdAt: Date;
  metadata?: {
    alugamentoId?: string;
    propertyId?: string;
    fromUserId?: string;
  };
}

type NotificationType =
  | 'nova_solicitude'       // propietario: labrego solicitou
  | 'solicitude_aceptada'   // labrego: propietario aceptou
  | 'solicitude_rexeitada'  // labrego: propietario rexeitou
  | 'pago_confirmado'       // labrego: pago procesado con éxito
  | 'nova_mensaxe'          // ambos: mensaxe recibida
  | 'nova_avaliacion'       // propietario: labrego deixou avaliación
  | 'resposta_avaliacion';  // labrego: propietario respondeu
```

---

## Fase 1 — Backend

### 1.1 Modelo

```typescript
// FincAirbnb_backend/src/models/NotificationModel.ts
import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  read: { type: Boolean, default: false },
  metadata: Schema.Types.Mixed,
}, { timestamps: true });

export const NotificationModel = model('Notification', notificationSchema, 'notifications');
```

### 1.2 Servizo de notificacións (helper interno)

```typescript
// FincAirbnb_backend/src/shared/notifications.ts
export async function createNotification(payload: CreateNotificationDto): Promise<void>
```

Este helper chámase dende outros módulos (alugamentos, mensaxes, reviews, payments) para crear notificacións como efecto secundario.

### 1.3 Módulo notifications

```
FincAirbnb_backend/src/modules/notifications/
├── notifications.routes.ts
├── notifications.controller.ts
└── notifications.service.ts
```

#### Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET`  | `/notifications` | Notificacións do usuario autenticado (paxinadas) | ✅ |
| `GET`  | `/notifications/unread-count` | Número de non lidas | ✅ |
| `PATCH`| `/notifications/:id/read` | Marcar como lida | ✅ |
| `PATCH`| `/notifications/read-all` | Marcar todas como lidas | ✅ |
| `DELETE`| `/notifications/:id` | Eliminar notificación | ✅ |

Todas filtran por `userId === req.user.id` (do token JWT).

### 1.4 Disparadores de notificacións

Engadir `createNotification()` nos seguintes handlers existentes:

| Evento | Arquivo backend | Notificación creada |
|--------|----------------|---------------------|
| `POST /alugamentos` | `alugamentos.routes.ts` | → propietario: `nova_solicitude` |
| `PATCH /alugamentos/:id` (status→confirmado) | `alugamentos.routes.ts` | → labrego: `solicitude_aceptada` |
| `PATCH /alugamentos/:id` (status→cancelado polo owner) | `alugamentos.routes.ts` | → labrego: `solicitude_rexeitada` |
| `POST /payments/webhook` (succeeded) | `payments.routes.ts` | → labrego: `pago_confirmado` |
| `POST /messages` | `messages.routes.ts` | → destinatario: `nova_mensaxe` |
| `POST /reviews` | `reviews.routes.ts` | → propietario: `nova_avaliacion` |
| `PATCH /reviews/:id/respond` | `reviews.routes.ts` | → labrego: `resposta_avaliacion` |

---

## Fase 2 — Frontend

### 2.1 Servizo FE

```typescript
// FincAirbnb_frontend/services/notifications.ts
export async function getNotifications(): Promise<Notification[]>
export async function getUnreadCount(): Promise<number>
export async function markAsRead(id: string): Promise<void>
export async function markAllAsRead(): Promise<void>
```

### 2.2 Hook

```typescript
// FincAirbnb_frontend/hooks/useNotifications.ts
// Polling cada 30s con setInterval
// Expón: notifications, unreadCount, markAsRead, markAllAsRead, refresh
```

### 2.3 Compoñentes

```
FincAirbnb_frontend/components/notifications/
├── NotificationBell.tsx    # Icona con badge de non lidas
├── NotificationPanel.tsx   # Dropdown con lista
└── NotificationItem.tsx    # Ítem individual con tipo, mensaxe, link, data
```

### 2.4 Integración no Header

- `NotificationBell` no `Header.tsx` (só visible para usuarios autenticados)
- Badge vermello co número cando `unreadCount > 0`
- Click → abre `NotificationPanel` como dropdown

### 2.5 Páxina completa (opcional)

**Ruta**: `/taboleiro/notificacions`

- Lista completa con filtros (todas / non lidas)
- Botón "Marcar todas como lidas"
- Enlace rápido a cada notificación

---

## Ficheiros a crear/modificar

| Ficheiro | Acción |
|---|---|
| `FincAirbnb_backend/src/models/NotificationModel.ts` | Novo |
| `FincAirbnb_backend/src/shared/notifications.ts` | Novo — helper `createNotification` |
| `FincAirbnb_backend/src/modules/notifications/notifications.routes.ts` | Novo |
| `FincAirbnb_backend/src/modules/notifications/notifications.controller.ts` | Novo |
| `FincAirbnb_backend/src/modules/notifications/notifications.service.ts` | Novo |
| `FincAirbnb_backend/src/app.ts` | Rexistrar `/notifications` routes |
| `FincAirbnb_backend/src/modules/alugamentos/alugamentos.routes.ts` | Engadir `createNotification` calls |
| `FincAirbnb_backend/src/modules/messages/messages.routes.ts` | Engadir `createNotification` call |
| `FincAirbnb_backend/src/modules/reviews/reviews.routes.ts` | Engadir `createNotification` calls |
| `FincAirbnb_frontend/services/notifications.ts` | Novo |
| `FincAirbnb_frontend/hooks/useNotifications.ts` | Novo |
| `FincAirbnb_frontend/components/notifications/NotificationBell.tsx` | Novo |
| `FincAirbnb_frontend/components/notifications/NotificationPanel.tsx` | Novo |
| `FincAirbnb_frontend/components/notifications/NotificationItem.tsx` | Novo |
| `FincAirbnb_frontend/components/Header.tsx` | Integrar `NotificationBell` |
| `FincAirbnb_frontend/app/taboleiro/notificacions/page.tsx` | Novo (opcional) |

---

## Verificación

- [ ] `POST /alugamentos` → créase notificación `nova_solicitude` para o propietario en MongoDB
- [ ] `GET /notifications` devolve só as notificacións do usuario autenticado
- [ ] `GET /notifications/unread-count` devolve número correcto
- [ ] Badge no Header mostra o conteo
- [ ] Click en notificación → marca como lida + navega ao link
- [ ] "Marcar todas como lidas" limpa o badge
- [ ] Cascade delete en `DELETE /users/:id` borra as notificacións do usuario
