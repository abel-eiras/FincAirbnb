# Traceability: B3 Alugamentos — Service Integration

## Requisito
As páxinas de alugamentos deben consumir a API real cando `NEXT_PUBLIC_USE_EXTERNAL_API=true`,
eliminando a dependencia de `localStorage` e interfaces locais incompatibles co tipo `Alugamento`.

## Cambios realizados

### `services/mockAlugamentos.ts`

| Función engadida               | Endpoint BE                          | Mock fallback                            |
|-------------------------------|--------------------------------------|------------------------------------------|
| `getAlugamentosByOwner(id)`   | `GET /alugamentos/owner/:ownerId`    | filtra `alugamentos.json` por `ownerId`  |
| `updateAlugamentoStatus(id, status)` | `PATCH /alugamentos/:id`      | clona o obxecto con novo status          |

### `app/taboleiro/mos-alugamentos/page.tsx`

- Elimínase interface local `AlugamentoLabrego` — usa `Alugamento` de `mockAlugamentos.ts`
- Carga: `getAlugamentosByLabrego(user.id)` en vez de `localStorage.getItem('alugamentos')`
- Cancel: `cancelarAlugamento(id, motivo)` en vez de `localStorage.setItem`
- Títulos de propiedades: lookup por `getProperty(propertyId)` (deduplicado)
- Mapeo de campos: `inicioCultivo`, `finCultivo`, `meses`, `detallesCultivo.tipoCultivo`, `prezos.total`
- Status values: `confirmado / completado / cancelado` (aliñados co backend)

### `app/taboleiro/alugamentos-recibidos/page.tsx`

- Elimínase interface local `AlugamentoRecibido` — usa `Alugamento`
- Carga: `getAlugamentosByOwner(user.id)` en vez de `localStorage`
- Accept/reject: `updateAlugamentoStatus(id, 'confirmado' | 'cancelado')`
- Mesmos mapeos de campos e status que `mos-alugamentos`

## Contrato de tipos verificado

| Campo `Alugamento` (FE)          | Campo BE (MongoDB)       | OK |
|---------------------------------|--------------------------|----|
| `id`                            | `_id` → `id` via `serializeDoc` | ✅ |
| `inicioCultivo`                 | `inicioCultivo`          | ✅ |
| `finCultivo`                    | `finCultivo`             | ✅ |
| `meses`                         | `meses`                  | ✅ |
| `detallesCultivo.tipoCultivo`   | `detallesCultivo.tipoCultivo` | ✅ |
| `prezos.total`                  | `prezos.total`           | ✅ |
| `status`                        | `confirmado/completado/cancelado` | ✅ |

## Pendente

- `solicitar/page.tsx`: aínda usa `localStorage` para crear alugamentos (pendente M07)
