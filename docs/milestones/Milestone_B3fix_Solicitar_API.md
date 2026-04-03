# 🔧 Milestone B3-FIX: Pechar Deuda Técnica — Solicitar Alugamento vía API Real

**Fecha**: Pendente  
**Prioridade**: Alta (deuda técnica de B3) | **Estado**: ⏳ Pendente

---

## Problema

`app/alugamentos/solicitar/page.tsx` crea o alugamento gardándoo directamente en **localStorage** (liñas 130–145):

```typescript
// MOCK — a eliminar
const alugamentoCompleto = { id: `alugamento-${Date.now()}`, ... };
const existingAlugamentos = JSON.parse(localStorage.getItem('alugamentos') || '[]');
existingAlugamentos.push(alugamentoCompleto);
localStorage.setItem('alugamentos', JSON.stringify(existingAlugamentos));
router.push(`/alugamentos/${alugamentoCompleto.id}/confirmacion`);
```

O backend xa ten `POST /alugamentos` (crud xenérico via `createCrudRouter`) e `validateToken`. O alugamento non chega á base de datos real.

---

## Requisitos previos

- `NEXT_PUBLIC_USE_EXTERNAL_API=true` no `.env` do frontend ✅
- Backend correndo en `localhost:4000` ✅
- JWT no localStorage do labrego autenticado ✅
- `POST /alugamentos` dispoñible no backend ✅

---

## Plan de implementación

### 1. Actualizar `mockAlugamentos.ts` (servizo FE)

Engadir función `createAlugamento` con branch real:

```typescript
export async function createAlugamento(data: CreateAlugamentoPayload): Promise<Alugamento> {
  if (isExternalApiEnabled()) {
    const res = await apiClient.post('/alugamentos', data);
    return res.data;
  }
  // mock fallback
  const mock = { id: `alugamento-${Date.now()}`, ...data, status: 'pendente', createdAt: new Date().toISOString() };
  const list = JSON.parse(localStorage.getItem('alugamentos') || '[]');
  list.push(mock);
  localStorage.setItem('alugamentos', JSON.stringify(list));
  return mock;
}
```

### 2. Refactorizar `solicitar/page.tsx`

- Importar `useAuth` para obter `user.id` (labregoId)
- Substituír o bloque localStorage por `createAlugamento(payload)`
- O payload debe incluír: `propertyId`, `labregoId`, `ownerId`, datas, duración, persoas, cultivoType, pricing, status: 'pendente'
- Redirixir a `/alugamentos/${alugamento.id}/confirmacion` co ID real da BD

### 3. Actualizar `confirmacion/page.tsx`

- Actualmente le o alugamento de localStorage: substituír por `getAlugamentoById(id)` (xa existe)
- Mostrar datos reais da BD

### 4. Verificar campos en backend

O `AlugamentoModel` usa `baseLooseSchema` (esquema aberto) → acepta calquera campo. Verificar que o seed ten o campo `ownerId` en todos os alugamentos para que `GET /alugamentos/owner/:ownerId` siga funcionando.

---

## Campos do payload a enviar

```typescript
interface CreateAlugamentoPayload {
  propertyId: string;
  labregoId: string;    // user.id do usuario autenticado
  ownerId: string;      // property.ownerId
  inicioAlugamento: string;  // startDate ISO
  finCultivo: string;        // startDate + duration meses ISO
  duration: number;          // meses
  people: number;
  cultivoType: string;
  specialRequests?: string;
  pricing: { basePrice: number; subtotal: number; serviceFee: number; total: number };
  labregoData: { name: string; email: string; phone: string; experience: string; motivation: string; references?: string };
  status: 'pendente';
}
```

---

## Ficheiros a modificar

| Ficheiro | Acción |
|---|---|
| `services/mockAlugamentos.ts` | Engadir `createAlugamento()` con branch real |
| `app/alugamentos/solicitar/page.tsx` | Substituír localStorage por `createAlugamento()` + `useAuth` |
| `app/alugamentos/[id]/confirmacion/page.tsx` | Substituír localStorage por `getAlugamentoById(id)` |

---

## Verificación

- [ ] Crear alugamento con usuario autenticado → aparece en MongoDB (`db.alugamentos.find()`)
- [ ] `/taboleiro/mos-alugamentos` mostra o novo alugamento
- [ ] `/taboleiro/alugamentos-recibidos` (propietario) mostra a solicitude
- [ ] Páxina de confirmación mostra datos reais (non localStorage)
- [ ] Mock fallback funciona cando `NEXT_PUBLIC_USE_EXTERNAL_API=false`
