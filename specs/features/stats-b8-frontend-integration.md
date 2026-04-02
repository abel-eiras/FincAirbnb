# Traceability: B8 Stats — Frontend Integration

## Requisito
O dashboard do propietario debe mostrar gráficos con datos reais
cando `NEXT_PUBLIC_USE_EXTERNAL_API=true`.

## Cambios realizados

### `services/mockStats.ts`

Engadido `isExternalApiEnabled()` branch nas 4 funcións de gráficos:

| Función            | Endpoint real                       |
|--------------------|-------------------------------------|
| `getRevenueData`   | `GET /stats/revenue/:ownerId`       |
| `getOccupancyData` | `GET /stats/occupancy/:ownerId`     |
| `getBookingsData`  | `GET /stats/bookings/:ownerId`      |
| `getRecentActivity`| `GET /stats/activity/:ownerId`      |

## Estado completo dos servizos de stats

| Función               | API real | Endpoint BE               |
|-----------------------|----------|---------------------------|
| `getOwnerStats`       | ✅       | `GET /stats/owner/:id`    |
| `getUpcomingBookings` | ✅       | `GET /alugamentos/owner/:id` |
| `getRevenueData`      | ✅       | `GET /stats/revenue/:id`  |
| `getOccupancyData`    | ✅       | `GET /stats/occupancy/:id`|
| `getBookingsData`     | ✅       | `GET /stats/bookings/:id` |
| `getRecentActivity`   | ✅       | `GET /stats/activity/:id` |

Todos os endpoints de stats están agora conectados. O mock segue dispoñible como fallback.
