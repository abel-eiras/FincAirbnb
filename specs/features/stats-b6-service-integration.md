# Traceability: B6 Stats — Service Integration

## Requisito
O dashboard do propietario debe mostrar estatísticas reais cando `NEXT_PUBLIC_USE_EXTERNAL_API=true`.

## Cambios realizados

### `services/mockStats.ts`

**`getOwnerStats(ownerId)`** — xa tiña `isExternalApiEnabled()` branch ✅
- Chama `GET /stats/owner/:ownerId`
- Campos: `totalProperties`, `activeProperties`, `monthlyBookings`, `monthlyRevenue`, `averageRating`

**`getUpcomingBookings(ownerId)`** — engadido `isExternalApiEnabled()` branch:
- Chama `GET /alugamentos/owner/:ownerId`
- Filtra `status === 'confirmado'` e `inicioCultivo > now`
- Ordena por data e devolve top 5
- Enriquece con nomes de propiedades via `getProperty(propertyId)`

## Limitacións coñecidas (sen endpoint BE)

| Función              | Estado              | Nota                                      |
|---------------------|---------------------|-------------------------------------------|
| `getRevenueData`    | Mock (hardcoded)    | Require agregación mensual de alugamentos |
| `getOccupancyData`  | Mock (hardcoded)    | Require cálculo de días ocupados vs total |
| `getBookingsData`   | Mock (hardcoded)    | Require agregación por mes                |
| `getRecentActivity` | Mock (hardcoded)    | Require endpoint de actividade recente    |

Estes endpoints de agregación son traballo para producción/fase avanzada.

## Páxina conectada

- `app/taboleiro/page.tsx` — usa `Promise.all` con todas as funcións de stats,
  filtrando por `user.role === 'owner'`. Non requiriu cambios.
