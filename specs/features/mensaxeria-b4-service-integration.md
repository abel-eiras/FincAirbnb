# Traceability: B4 Mensaxería — Service Integration

## Requisito
A páxina de mensaxes debe consumir a API real cando `NEXT_PUBLIC_USE_EXTERNAL_API=true`,
eliminando os lookups de `localStorage` para usuarios e propiedades.

## Cambios realizados

### `services/mockUsers.ts` (novo)

| Función              | Endpoint BE       | Mock fallback                         |
|---------------------|-------------------|---------------------------------------|
| `getUserById(id)`   | `GET /users/:id`  | filtra `users.json` por `id`          |

### `app/taboleiro/mensaxes/page.tsx`

**Enriquecemento de conversas:**
- Antes: `JSON.parse(localStorage.getItem('users'))` + `JSON.parse(localStorage.getItem('properties'))`
- Agora: `getProperty(propId)` (servizo real) + `getUserById(uid)` (novo servizo)
- Batch paralelo con `Promise.all` sobre IDs únicos para evitar N+1

**Envío de mensaxes:**
- Antes: escribe directamente en `localStorage.getItem('messages')`
- Agora: `sendMessage(conversationId, user.id, content)` do servizo (xa tiña branch real)

**Imports limpados:**
- Eliminado: `getConversationsFromAlugamentos` (non usado)
- Eliminado: `Conversation as ConversationType` (alias non usado)
- Engadido: `sendMessage`, `getProperty`, `getUserById`

## Endpoints consumidos

| Endpoint                          | Servizo              |
|-----------------------------------|----------------------|
| `GET /messages/user/:userId`      | `getConversations`   |
| `POST /messages/:id/messages`     | `sendMessage`        |
| `GET /properties/:id`             | `getProperty`        |
| `GET /users/:id`                  | `getUserById`        |
