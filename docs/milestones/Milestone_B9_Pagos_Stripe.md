# 💳 Milestone B9: Pagos con Stripe

**Fecha**: Pendente  
**Prioridade**: Alta | **Estado**: ⏳ Pendente  
**Depende de**: B3-FIX completado (alugamento creado en BD antes de pagar)

---

## Obxectivo

Integrar Stripe para cobrar o alugamento ao labrego no momento en que o propietario **acepta** a solicitude. O fluxo é:

1. Labrego solicita → alugamento queda en `pendente` (sen pago)
2. Propietario acepta → backend crea un `PaymentIntent` en Stripe
3. Labrego recibe notificación / ve botón "Pagar" en `/taboleiro/mos-alugamentos`
4. Labrego completa o pago con Stripe Elements
5. Webhook de Stripe confirma → alugamento pasa a `confirmado`

---

## Stack

- **Backend**: `stripe` npm package, SK secreta en `.env`
- **Frontend**: `@stripe/stripe-js` + `@stripe/react-stripe-js`, PK pública en `.env`
- **Webhook**: endpoint `POST /payments/webhook` con `stripe.webhooks.constructEvent`

---

## Fase 1 — Backend

### 1.1 Instalar dependencia

```bash
npm install stripe
```

### 1.2 Config Stripe

```typescript
// FincAirbnb_backend/src/config/stripe.ts
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
```

### 1.3 Módulo payments

```
FincAirbnb_backend/src/modules/payments/
├── payments.routes.ts
├── payments.controller.ts
└── payments.service.ts
```

#### Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/payments/create-intent` | Crea PaymentIntent para un alugamento | ✅ |
| `POST` | `/payments/webhook` | Webhook Stripe (sen auth JWT, con signature) | ❌ |
| `GET`  | `/payments/alugamento/:id` | Estado de pago dun alugamento | ✅ |

#### `POST /payments/create-intent`

```typescript
// Body: { alugamentoId: string }
// 1. Busca o alugamento, verifica que está en 'confirmado' polo owner
// 2. Crea stripe.paymentIntents.create({ amount: total*100, currency: 'eur', metadata: { alugamentoId } })
// 3. Garda stripePaymentIntentId no alugamento
// 4. Devolve { clientSecret }
```

#### `POST /payments/webhook`

```typescript
// Stripe envía eventos: payment_intent.succeeded, payment_intent.payment_failed
// En succeeded: AlugamentoModel.findOneAndUpdate({ stripePaymentIntentId }, { status: 'confirmado', estadoPago: 'pagado' })
```

### 1.4 Actualizar AlugamentoModel (campos de pago)

Engadir ao schema (ou ao seed):
```typescript
stripePaymentIntentId?: string;
estadoPago: 'pendente' | 'pagado' | 'reembolsado' | 'fallido';
```

---

## Fase 2 — Frontend

### 2.1 Instalar dependencias

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2.2 Compoñente de pago

```
FincAirbnb_frontend/components/payments/
├── StripeProvider.tsx    # <Elements> wrapper con PK pública
├── PaymentForm.tsx       # CardElement + botón confirmar
└── PaymentStatus.tsx     # Estado: pendente / pagado / fallido
```

### 2.3 Páxina de pago

**Ruta**: `/alugamentos/[id]/pagar`

Fluxo:
1. Chama `POST /payments/create-intent` → obtén `clientSecret`
2. Renderiza `<StripeProvider>` → `<PaymentForm>`
3. Usuario introduce tarxeta → `stripe.confirmCardPayment(clientSecret)`
4. En éxito → redirixe a `/alugamentos/[id]/confirmacion`

### 2.4 Actualizar `/taboleiro/mos-alugamentos`

- Se `status === 'confirmado'` e `estadoPago === 'pendente'` → mostra botón "Pagar agora"
- Se `estadoPago === 'pagado'` → badge verde "Pagado"
- Se `estadoPago === 'reembolsado'` → badge amarelo

### 2.5 Servizo FE

```typescript
// services/payments.ts
export async function createPaymentIntent(alugamentoId: string): Promise<{ clientSecret: string }>
export async function getPaymentStatus(alugamentoId: string): Promise<{ estadoPago: string }>
```

---

## Variables de entorno

```env
# Backend
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Ficheiros a crear/modificar

| Ficheiro | Acción |
|---|---|
| `FincAirbnb_backend/src/config/stripe.ts` | Novo — instancia Stripe |
| `FincAirbnb_backend/src/modules/payments/payments.routes.ts` | Novo |
| `FincAirbnb_backend/src/modules/payments/payments.controller.ts` | Novo |
| `FincAirbnb_backend/src/modules/payments/payments.service.ts` | Novo |
| `FincAirbnb_backend/src/app.ts` | Rexistrar `/payments` routes |
| `FincAirbnb_frontend/components/payments/StripeProvider.tsx` | Novo |
| `FincAirbnb_frontend/components/payments/PaymentForm.tsx` | Novo |
| `FincAirbnb_frontend/app/alugamentos/[id]/pagar/page.tsx` | Novo |
| `FincAirbnb_frontend/app/taboleiro/mos-alugamentos/page.tsx` | Modificar — botón pagar |
| `FincAirbnb_frontend/services/payments.ts` | Novo |
| `FincAirbnb_backend/.env` | Engadir STRIPE_* vars |
| `FincAirbnb_frontend/.env` | Engadir NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY |

---

## Verificación

- [ ] `POST /payments/create-intent` → devolve `clientSecret`
- [ ] Pago con tarxeta de test Stripe (`4242 4242 4242 4242`) → éxito
- [ ] Webhook recibido → alugamento en BD pasa a `estadoPago: 'pagado'`
- [ ] Pago fallido (`4000 0000 0000 9995`) → `estadoPago: 'fallido'`
- [ ] Badge correcto en `/taboleiro/mos-alugamentos` segundo estado
- [ ] Reembolso automático en cancelación (opcional fase 2)
