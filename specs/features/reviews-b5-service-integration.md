# Traceability: B5 Reviews — Service Integration

## Requisito
O fluxo de valoracións debe consumir a API real cando `NEXT_PUBLIC_USE_EXTERNAL_API=true`,
eliminando os accesos directos a `localStorage` en páxinas e no servizo.

## Cambios realizados

### `services/mockReviews.ts`

**`getPendingReviews(userId)`** — engadido `isExternalApiEnabled()` branch:
- Chama `GET /alugamentos/labrego/:userId` para obter alugamentos completados
- Chama `GET /reviews` para obter todas as reviews e filtrar as xa escritas
- Filtra `status === 'completado'` e `finCultivo < now`
- Correxido campo mock: `labregoData.email` → `labregoId`, `endDate` → `finCultivo`

### `app/alugamentos/[id]/valorar/page.tsx`

| Antes (localStorage)                       | Agora (servizo)                                |
|--------------------------------------------|------------------------------------------------|
| `JSON.parse(localStorage.getItem('alugamentos'))` | `getAlugamentoById(params.id)`          |
| `JSON.parse(localStorage.getItem('properties'))` | `getProperty(foundAlugamento.propertyId)` |
| `foundAlugamento.labregoData.email !== user.id` | `foundAlugamento.labregoId !== user.id` |
| `foundAlugamento.endDate`                  | `foundAlugamento.finCultivo`                   |

## Servizos xa correctos (non requiriron cambios)

| Función               | Endpoint BE                        |
|-----------------------|------------------------------------|
| `createReview`        | `POST /reviews`                    |
| `getPropertyReviews`  | `GET /reviews/property/:propertyId`|
| `respondToReview`     | `POST /reviews/:id/respond`        |
| `markReviewHelpful`   | `POST /reviews/:id/helpful`        |
| `getUserReviews`      | `GET /reviews` (filtrado FE)       |

## Componentes xa correctos

- `ReviewForm` — importa `createReview` do servizo ✅
- `ReviewsSection` — importa `getPropertyReviews` + `getPropertyReviewStats` ✅
- `ReviewCard` — non usa localStorage ✅
