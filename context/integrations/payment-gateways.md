# Payment Gateways - FincAirbnb

## Overview

FincAirbnb integrates with multiple payment gateways to process subscriptions and booking payments. This document details the integration specifications for each payment provider.

---

## Payment Provider Strategy

### Primary: Stripe
**Usage**: Main payment processor
- International cards
- Subscription management
- Marketplace payments (Stripe Connect)
- Modern API and excellent documentation

### Secondary: Redsys
**Usage**: Spanish market preference
- Local Spanish cards
- Preferred by some Spanish banks
- Required for certain regional payment methods

---

## Stripe Integration

### Overview

**Stripe** powers the core payment infrastructure for FincAirbnb.

### Products Used

1. **Stripe Payments**: One-time booking payments
2. **Stripe Billing**: Subscription management
3. **Stripe Connect**: Marketplace payouts to property owners
4. **Stripe Checkout**: Pre-built payment pages (optional)
5. **Stripe Elements**: Embedded payment forms

---

### Setup

#### API Keys

```bash
# Environment variables
STRIPE_PUBLIC_KEY=pk_test_...           # Client-side key
STRIPE_SECRET_KEY=sk_test_...           # Server-side key
STRIPE_WEBHOOK_SECRET=whsec_...         # Webhook signature
STRIPE_CONNECT_CLIENT_ID=ca_...         # Connect onboarding
```

**Test Mode vs. Live Mode**:
- Development: Use test keys (`pk_test_`, `sk_test_`)
- Production: Use live keys (`pk_live_`, `sk_live_`)

#### Installation

```bash
# Backend (Node.js)
npm install stripe

# Frontend (React)
npm install @stripe/stripe-js @stripe/react-stripe-js
```

#### Initialization

```typescript
// Backend: lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Frontend: lib/stripe-client.ts
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);
```

---

### Subscription Payments

#### Create Subscription

**Flow**:
1. Owner selects plan (Basic/Pro/Enterprise)
2. Create or retrieve Stripe Customer
3. Attach payment method
4. Create subscription
5. Handle webhook confirmation

**Backend Implementation**:

```typescript
// api/subscriptions/create
export async function createSubscription(
  userId: string,
  priceId: string,
  paymentMethodId: string
) {
  // Get or create Stripe customer
  const user = await getUserById(userId);
  let customerId = user.stripeCustomerId;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;
    await updateUser(userId, { stripeCustomerId: customerId });
  }
  
  // Attach payment method
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
  
  // Set as default payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
  
  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_settings: {
      payment_method_types: ['card'],
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      userId,
    },
  });
  
  return subscription;
}
```

#### Price IDs

```typescript
export const STRIPE_PRICES = {
  basic_monthly: 'price_basic_monthly',
  basic_yearly: 'price_basic_yearly',
  pro_monthly: 'price_pro_monthly',
  pro_yearly: 'price_pro_yearly',
  enterprise_monthly: 'price_enterprise_monthly',
  enterprise_yearly: 'price_enterprise_yearly',
};
```

---

### Booking Payments

#### Payment Intent Flow

**Best Practice**: Use Payment Intents API for SCA compliance

**Flow**:
1. Create booking record (status: pending)
2. Create Payment Intent
3. Confirm payment on client
4. Webhook confirms success
5. Update booking status

**Backend**:

```typescript
// api/bookings/[id]/payment-intent
export async function createBookingPaymentIntent(bookingId: string) {
  const booking = await getBooking(bookingId);
  
  // Calculate amounts
  const amount = Math.round(booking.total * 100); // Convert to cents
  const applicationFee = Math.round(booking.serviceFee * 100);
  
  // Create Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    customer: booking.guest.stripeCustomerId,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      bookingId: booking.id,
      propertyId: booking.propertyId,
      guestId: booking.guestId,
      ownerId: booking.ownerId,
    },
    // Marketplace: Split payment
    application_fee_amount: applicationFee,
    transfer_data: {
      destination: booking.owner.stripeConnectAccountId,
    },
    // Release funds after check-in
    on_behalf_of: booking.owner.stripeConnectAccountId,
    transfer_group: `booking_${bookingId}`,
  });
  
  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}
```

**Frontend**:

```typescript
// components/payment/BookingPaymentForm.tsx
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export function BookingPaymentForm({ clientSecret, bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setProcessing(true);
    
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/reservas/${bookingId}/confirmacion`,
      },
    });
    
    if (error) {
      setError(error.message || 'Erro ao procesar o pago');
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Success handled by webhook
      router.push(`/reservas/${bookingId}/confirmacion`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Procesando...' : 'Pagar'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

---

### Stripe Connect (Marketplace)

#### Owner Onboarding

**Purpose**: Enable owners to receive payouts

**Flow**:
1. Owner completes registration
2. Create Connect account
3. Generate account link for onboarding
4. Owner completes Stripe onboarding
5. Account activated

**Implementation**:

```typescript
// api/connect/onboard
export async function createConnectAccount(userId: string) {
  const user = await getUserById(userId);
  
  // Create Standard Connect account
  const account = await stripe.accounts.create({
    type: 'standard',
    country: 'ES',
    email: user.email,
    metadata: {
      userId,
    },
  });
  
  // Save account ID
  await updateUser(userId, {
    stripeConnectAccountId: account.id,
  });
  
  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.BASE_URL}/taboleiro/pagamentos/reactivar`,
    return_url: `${process.env.BASE_URL}/taboleiro/pagamentos/completado`,
    type: 'account_onboarding',
  });
  
  return {
    accountId: account.id,
    url: accountLink.url,
  };
}
```

#### Payout Schedule

```typescript
// Configure payout schedule
await stripe.accounts.update(accountId, {
  settings: {
    payouts: {
      schedule: {
        interval: 'manual', // or 'daily', 'weekly', 'monthly'
      },
    },
  },
});

// Manual payout
await stripe.payouts.create(
  {
    amount: 100000, // €1000
    currency: 'eur',
  },
  {
    stripeAccount: accountId,
  }
);
```

---

### Webhooks

#### Endpoint Setup

```typescript
// api/webhooks/stripe
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Handle event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;
    case 'invoice.paid':
      await handleInvoicePaid(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object);
      break;
    // Connect events
    case 'account.updated':
      await handleAccountUpdated(event.data.object);
      break;
  }
  
  return Response.json({ received: true });
}
```

#### Event Handlers

```typescript
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId;
  
  await updateBooking(bookingId, {
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentIntentId: paymentIntent.id,
    paidAt: new Date(),
  });
  
  // Send confirmation emails
  await sendBookingConfirmationEmail(bookingId);
  
  // Notify owner
  await notifyOwnerOfNewBooking(bookingId);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  
  await createSubscriptionRecord({
    userId,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });
  
  // Activate user account
  await activateOwnerAccount(userId);
}
```

---

## Redsys Integration

### Overview

**Redsys** is the primary Spanish payment gateway, used by many Spanish banks.

### Why Redsys?

- Required by some Spanish banks
- Preferred by Spanish consumers
- Local payment methods
- Sometimes lower fees for Spanish cards

### Integration Approach

**Option 1**: Direct integration  
**Option 2**: Use middleware/SDK (easier)

### Implementation

```typescript
// Using redsys-easy library
import Redsys from 'redsys-easy';

const redsys = new Redsys({
  merchantCode: process.env.REDSYS_MERCHANT_CODE!,
  terminal: process.env.REDSYS_TERMINAL!,
  secretKey: process.env.REDSYS_SECRET_KEY!,
});

// Create payment
export async function createRedsysPayment(booking: Booking) {
  const order = generateOrderNumber();
  
  const paymentData = {
    amount: Math.round(booking.total * 100), // Cents
    currency: '978', // EUR
    order: order,
    description: `Reserva ${booking.id}`,
    merchantURL: `${process.env.BASE_URL}/api/webhooks/redsys`,
    urlOK: `${process.env.BASE_URL}/reservas/${booking.id}/confirmacion`,
    urlKO: `${process.env.BASE_URL}/reservas/${booking.id}/error`,
  };
  
  const form = redsys.createPaymentForm(paymentData);
  
  return {
    formHTML: form,
    order,
  };
}

// Handle webhook
export async function handleRedsysNotification(notification: any) {
  const isValid = redsys.verifySignature(notification);
  
  if (!isValid) {
    throw new Error('Invalid Redsys signature');
  }
  
  const response = redsys.parseNotification(notification);
  
  if (response.Ds_Response === '0000') {
    // Payment successful
    await handlePaymentSuccess(response.Ds_Order);
  } else {
    // Payment failed
    await handlePaymentFailure(response.Ds_Order, response.Ds_Response);
  }
}
```

---

## Payment Method Selection

### User Interface

```tsx
<div className="payment-method-selector">
  <label>
    <input type="radio" name="method" value="card" defaultChecked />
    💳 Tarxeta de crédito/débito (Stripe)
  </label>
  
  <label>
    <input type="radio" name="method" value="redsys" />
    🏦 Redsys (tarxetas españolas)
  </label>
  
  {/* Future methods */}
  <label>
    <input type="radio" name="method" value="bank_transfer" disabled />
    🏛️ Transferencia bancaria (próximamente)
  </label>
</div>
```

---

## Security Best Practices

### PCI Compliance

**Never store card data**:
- Use Stripe Elements or Hosted pages
- Tokenize card data immediately
- Never log card numbers

**Use HTTPS**:
- All payment pages MUST be HTTPS
- Enforce HSTS headers

**Webhook Security**:
- Always verify webhook signatures
- Use environment secrets
- Log suspicious requests

### Fraud Prevention

**Stripe Radar**:
- Enabled by default
- Machine learning fraud detection
- Custom rules for high-risk transactions

**3D Secure (SCA)**:
- Automatic with Payment Intents
- Required in EU for >€30
- Better fraud protection

**Address Verification**:
- Collect billing address
- Verify with card issuer (AVS)

---

## Testing

### Test Cards (Stripe)

```
Successful payment:
4242 4242 4242 4242

Requires authentication (3DS):
4000 0025 0000 3155

Declined:
4000 0000 0000 0002

Insufficient funds:
4000 0000 0000 9995

Expired card:
4000 0000 0000 0069
```

### Test Webhooks

```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

---

## Monitoring & Analytics

### Stripe Dashboard

**Key Metrics**:
- Successful payments
- Failed payments
- Dispute rate
- Refund rate
- Average transaction value

### Custom Tracking

```typescript
// Log payment events
await logPaymentEvent({
  type: 'payment_initiated',
  bookingId,
  amount,
  currency: 'EUR',
  method: 'stripe',
  userId,
  timestamp: new Date(),
});
```

---

## Error Handling

### Common Errors

```typescript
export const PAYMENT_ERRORS = {
  card_declined: 'Tarxeta rexeitada. Verifica os datos.',
  insufficient_funds: 'Fondos insuficientes.',
  expired_card: 'Tarxeta caducada.',
  incorrect_cvc: 'Código de seguridade incorrecto.',
  processing_error: 'Erro ao procesar o pago. Téntao de novo.',
  network_error: 'Erro de conexión. Comproba a túa internet.',
};

export function getErrorMessage(errorCode: string): string {
  return PAYMENT_ERRORS[errorCode] || PAYMENT_ERRORS.processing_error;
}
```

---

## Future Enhancements

- [ ] Apple Pay / Google Pay
- [ ] PayPal integration
- [ ] Bank transfers (SEPA)
- [ ] Local Spanish methods (Bizum)
- [ ] Cryptocurrency (if regulations allow)
- [ ] Buy Now Pay Later (Klarna, etc.)
- [ ] Gift cards
- [ ] Multi-currency support

---

**Last Updated**: October 2024  
**Integration Owner**: Backend & Payment Team  
**Security Review**: Required before production

