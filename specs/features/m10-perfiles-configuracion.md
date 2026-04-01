# Traceability: M10 Perfiles + Configuración

## Requisito
Os usuarios deben poder ver e editar o seu perfil, e xestionar a configuración da conta
(notificacións, contrasinal, eliminar conta).

## Cambios realizados

### `contexts/AuthContext.tsx`

- Engadida acción `UPDATE_USER` ao reducer: actualiza `session.user` sen tocar o token
- Engadido método `updateUser(user: User)`: actualiza `localStorage['fincairbnb_user']` e despacha a acción
- Exposto en `AuthContextType` e en `contextValue`

### `services/mockAuth.ts`

**`changePassword(userId, currentPassword, newPassword)`** — nova función:
- Real: `POST /auth/change-password` con `{ currentPassword, newPassword }`
- Mock: verifica `user.password === currentPassword`

**`deleteAccount(userId)`** — nova función:
- Real: `DELETE /users/:userId`
- Mock: devolve `{ success: true }`

### `app/taboleiro/perfil/page.tsx` (novo)

- Formulario de edición: nome, teléfono, bio, avatar URL, cidade, provincia
- Garda con `updateProfile(user.id, data)` → `updateUser(updated)` para actualizar sesión en memoria
- Mostra avatar ou inicial do nome
- Confirmación visual "Perfil gardado correctamente"

### `app/taboleiro/configuracion/page.tsx` (novo)

- **Notificacións**: toggles para email (reservas, mensaxes, reviews, marketing) e in-app
- **Cambio de contrasinal**: form con contrasinal actual, nova e confirmación. Valida longura (≥8) e coincidencia
- **Zona de perigo**: eliminar conta con confirmación de texto "eliminar". Fai `deleteAccount()` + `logout()` + redirect `/`

### `app/perfil/[id]/page.tsx` (novo)

- Mostra perfil público dun usuario polo seu ID
- Avatar/inicial, nome, rol, localización, ano de unión
- Stats: valoración, nº fincas, alugamentos, taxa resposta
- Botón "Enviar mensaxe" (só para outros usuarios autenticados)
- Botón "Editar perfil" (só para o propio usuario)
- Se o usuario é propietario: mostra grid das súas fincas (top 6) con foto, título, prezo

## Endpoints backend esperados

| Función           | Endpoint                          | Estado            |
|-------------------|-----------------------------------|-------------------|
| `updateProfile`   | `PATCH /users/:id`                | ✅ Xa existe (B4) |
| `changePassword`  | `POST /auth/change-password`      | ⚠️ Pendente BE    |
| `deleteAccount`   | `DELETE /users/:id`               | ⚠️ Pendente BE    |
