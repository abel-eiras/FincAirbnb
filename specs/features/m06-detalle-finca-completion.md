# Traceability: M06 Detalle Finca — Completado

## Requisito
A páxina `/fincas/[id]` debe mostrar:
- ReviewsSection con autenticación correcta
- Host card (perfil do propietario)
- Fincas similares (mesma provincia, excluíndo a actual)
- SEO con `generateMetadata`

## Cambios realizados

### `app/fincas/[id]/page.tsx`

- **ReviewsSection**: conectada a `useAuth()` — `currentUserId={user?.id}`, `isOwner={isOwner}`
- **Host Card**: mostra avatar/inicial, nome, localización, bio e botón "Contactar" (só visible para labregos autenticados). Usa `getUserById(property.ownerId)`.
- **Fincas similares**: carga top 3 da mesma provincia excluíndo a finca actual. Cada tarxeta mostra foto, título, prezo, rating e `propertyType`.
- **Imports engadidos**: `useAuth`, `getUserById`, `getProperties`, `Image`, `Badge`, `MessageCircle`, `Calendar`
- **Bug fixes**: `photos[0].url` (era `photos[0]`), `propertyType` (era `type` inexistente)

### `app/fincas/[id]/layout.tsx` (novo)

- `generateMetadata` dinámico: título, descrición e OpenGraph baseados na finca real
- Fallback seguro se a finca non existe

### Fixes de TypeScript (pre-existentes detectados)

| Arquivo | Corrección |
|---------|-----------|
| `shared/types/index.ts` | Engadidos `CreateTemplateData` e `TemplateVariables` ás exportacións |
| `app/taboleiro/mensaxes/modelos/page.tsx` | Importa `CreateTemplateData` de `@/shared/types` en vez de `mockTemplates` |
| `app/init-conversations/page.tsx` | `const { user }` → `const user = getCurrentUser()` |
| `app/init-messaging/page.tsx` | Ídem |
| `app/taboleiro/alugamentos-recibidos/page.tsx` | `[...new Set(...)]` → `Array.from(new Set(...))` |
| `app/taboleiro/mos-alugamentos/page.tsx` | Ídem |

## Estado

- M06 ✅ Completado
