# ⚙️ Milestone 10: Perfiles + Configuración

## Resumen
**Objetivo**: Páginas de perfil de usuario y configuración completa de la cuenta.

**Duración**: 1 semana | **Prioridad**: Media | **Estado**: 📅 Planificado

---

## Objetivos
- Perfil público de usuario (propietario/huésped)
- Edición de perfil
- Configuración de cuenta
- Configuración de notificaciones
- Configuración de privacidad
- Gestión de suscripción (propietarios)
- Cambio de contraseña
- Eliminar cuenta

---

## Tareas

### 1. Perfil Público

#### Vista Propietario (`/propietarios/[id]`)
**Secciones**:
- Avatar y nombre
- Bio
- Ubicación
- Member since
- Stats (response rate, response time, properties, bookings)
- Badges (Superhost, Verified, etc.)
- Lista de propiedades
- Reviews recibidas

#### Vista Huésped (`/hoxpedes/[id]`)
- Avatar y nombre
- Bio
- Member since
- Reviews dadas
- Badges (Experienced traveler, etc.)

### 2. Edición de Perfil (`/taboleiro/perfil`)

**Formulario**:
- Avatar (upload mock - solo URL)
- Nome completo
- Bio (max 500 chars)
- Teléfono
- Ubicación (ciudad, provincia)
- Idioma preferido
- Guardar cambios

**Componentes**:
- `ProfileForm.tsx`
- `AvatarUploadMock.tsx`
- `BioEditor.tsx`

### 3. Configuración de Cuenta (`/taboleiro/configuracion`)

**Secciones** (Tabs):

#### Conta
- Email (mostrar, no editable sin verificación)
- Cambiar contraseña
- Autenticación de dos factores (UI mock, futuro)
- Sesiones activas (mock)

#### Notificacións
Checkboxes para:
- **Email**:
  - Reservas
  - Mensajes
  - Reviews
  - Marketing
- **In-app**:
  - Reservas
  - Mensajes
  - Sistema
- **Push** (futuro):
  - Enabled/disabled

#### Privacidade
- Perfil público/privado
- Mostrar teléfono
- Permitir buscar por email
- Historial de datos (download mock)
- Eliminar cuenta

#### Subscrición (solo propietarios)
- Plan actual
- Cambiar plan (mock)
- Métodos de pago (mock)
- Facturas (mock)
- Cancelar suscripción

### 4. Cambiar Contraseña

**Modal/Página**: `/taboleiro/configuracion/cambiar-contrasinal`

**Campos**:
- Contrasinal actual
- Nova contrasinal
- Confirmar contrasinal

**Validación**:
- Contrasinal actual correcta (mock check)
- Nueva cumple requisitos (8+ chars, mayúscula, número)
- Confirmación coincide

### 5. Eliminar Cuenta

**Modal de Confirmación**:
- Advertencia seria
- Explicar consecuencias
- Checkbox "Entendo que esta acción é irreversible"
- Input: Escribir "ELIMINAR" para confirmar
- Botón destructivo
- Mock deletion (logout + mensaje)

---

## Componentes

```
components/profile/
├── PublicProfile.tsx
├── OwnerProfile.tsx
├── GuestProfile.tsx
├── ProfileForm.tsx
├── AvatarUpload.tsx
├── StatsDisplay.tsx
└── BadgesList.tsx

components/settings/
├── SettingsLayout.tsx
├── AccountSettings.tsx
├── NotificationSettings.tsx
├── PrivacySettings.tsx
├── SubscriptionSettings.tsx
├── ChangePasswordForm.tsx
└── DeleteAccountModal.tsx
```

---

## Servicios Mock

```typescript
// services/mockUsers.ts (nuevo)
export async function getUserProfile(userId: string)
export async function updateUserProfile(userId: string, data: Partial<User>)
export async function changePassword(userId: string, oldPassword: string, newPassword: string)
export async function updateNotificationSettings(userId: string, settings: NotificationSettings)
export async function deleteAccount(userId: string)
```

---

## Criterios de Aceptación

**Funcionales**:
1. ✅ Perfil público visualizable
2. ✅ Edición de perfil funcional
3. ✅ Todas las configuraciones editables
4. ✅ Cambio de contraseña funciona (mock)
5. ✅ Eliminar cuenta funciona (logout)

**UX**:
1. ✅ Navegación clara (tabs)
2. ✅ Confirmaciones para acciones destructivas
3. ✅ Feedback visual al guardar
4. ✅ Mobile responsive

**Técnicos**:
1. ✅ Validaciones robustas
2. ✅ Tipos TypeScript correctos
3. ✅ Sin errores de compilación

---

## Resultado Final

Al completar Milestone 10, tendremos **todo el frontend completo** con:
- ✅ Sistema de autenticación
- ✅ Dashboards (propietario y huésped)
- ✅ Gestión de propiedades
- ✅ Catálogo y búsqueda
- ✅ Sistema de reservas (UI)
- ✅ Reviews
- ✅ Mensajería
- ✅ Perfiles y configuración

**Todo funcionando con datos mock**, listo para integrar backend real.

**Milestone Anterior**: 09 | **Siguiente**: Backend Development

