# 💬 Milestone 09: Sistema de Mensaxería (UI Mock)

## Resumen
**Objetivo**: Sistema de mensajería simulado para comunicación entre huéspedes y propietarios.

**Duración**: 1.5 semanas | **Prioridad**: Media | **Estado**: 📅 Planificado

---

## Objetivos
- Inbox con lista de conversaciones
- Thread de mensajes
- Enviar mensajes (mock)
- Plantillas de mensajes (propietarios)
- Notificaciones de mensajes nuevos
- Conversaciones por booking o consulta pre-booking

---

## Tareas

### 1. Inbox (`/mensaxes`)

**Layout**:
```
┌──────────────┐ ┌────────────────────┐
│Conversations │ │ Message Thread     │
│              │ │                    │
│ [Conv 1]  2  │ │ [Property Header]  │
│ [Conv 2]     │ │ [Message 1]        │
│ [Conv 3]     │ │ [Message 2]        │
│              │ │ [Message 3]        │
│              │ │                    │
│              │ │ [Input + Send]     │
└──────────────┘ └────────────────────┘
```

**Componentes**:
```
components/messages/
├── MessagesLayout.tsx
├── ConversationList.tsx
├── ConversationCard.tsx
├── MessageThread.tsx
├── MessageBubble.tsx
├── MessageInput.tsx
├── PropertyHeader.tsx
└── TemplateSelector.tsx (owners)
```

### 2. Lista de Conversaciones

**Features**:
- Todas las conversaciones del usuario
- Unread badge count
- Preview último mensaje
- Timestamp relativo
- Avatar de otro participante
- Ordenar por más reciente
- Buscar conversaciones

### 3. Thread de Mensajes

**Features**:
- Header con info de propiedad/booking
- Lista de mensajes scrollable
- Mensajes agrupados por fecha
- Burbujas diferentes para enviados/recibidos
- Timestamp
- Estado de lectura
- Auto-scroll al último mensaje

### 4. Enviar Mensajes

**Input**:
- Textarea autoexpandible
- Max 2000 caracteres
- Counter de caracteres
- Botón enviar
- Enter para enviar (Shift+Enter para nueva línea)
- Emoji picker (opcional)

**Mock Send**:
- Añadir mensaje a conversation (localStorage)
- Simular delay
- Mostrar como enviado
- Actualizar preview en lista

### 5. Plantillas (Propietarios)

**Página**: `/taboleiro/mensaxes/modelos`

**Features**:
- Crear plantilla
- Variables: `{{guestName}}`, `{{propertyName}}`, etc.
- Categorías (bienvenida, check-in, check-out, FAQ)
- Usar plantilla (quick-insert en conversation)

**Plantillas Precargadas**:
- Mensaje de bienvenida
- Instrucciones de check-in
- Instrucciones de check-out
- FAQ comunes

### 6. Notificaciones

**Badge** en icono de mensajes:
- Contador de no leídos
- Actualiza al leer

**Toast** al recibir mensaje:
- Solo si conversation no está abierta
- Nombre + preview

---

## Servicios Mock

```typescript
// services/mockMessages.ts
export async function getConversations(userId: string)
export async function getConversation(id: string)
export async function sendMessage(conversationId: string, senderId: string, content: string)
export async function markAsRead(conversationId: string, userId: string)
export async function createConversation(propertyId: string, guestId: string, ownerId: string)
```

---

## Estados y Edge Cases

**Empty states**:
- Sin conversaciones: "Aínda non tes mensaxes"
- Conversation sin mensajes

**Loading**:
- Skeleton loader para lista
- Spinner al enviar mensaje

**Error**:
- Mensaje no enviado (retry button)
- Error al cargar conversaciones

---

## Criterios de Aceptación
1. ✅ Inbox funcional con lista de conversaciones
2. ✅ Thread de mensajes renderiza correctamente
3. ✅ Enviar mensaje funciona (mock)
4. ✅ Plantillas funcionan (propietarios)
5. ✅ Notificaciones de unread
6. ✅ Mobile responsive (full-screen en mobile)
7. ✅ Real-time simulation (auto-update)

**Milestone Anterior**: 08 | **Siguiente**: 10

