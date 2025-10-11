# Payment Integration - FincAirbnb

## Overview

The Payment Integration system handles all monetary transactions on FincAirbnb, including subscription payments from property owners and booking payments from guests. Planned for Phase 4 of development.

---

## Payment Flows

### 1. Subscription Payments (Property Owners)

**Recurring subscription for property owners**

### 2. Booking Payments (Guests)

**One-time payments for property bookings**

---

## Payment Providers

### Primary: Stripe

**Why Stripe**:
- Industry standard
- Excellent documentation
- Strong fraud prevention
- PCI compliant
- Subscription management built-in
- Webhook support
- Multiple payment methods
- International support

**Features Used**:
- Payment Intents API
- Subscriptions API
- Customer Portal
- Webhooks
- Connect (for payouts to owners)

### Secondary: Redsys

**Why Redsys**:
- Spanish market preference
- Local bank card support
- Required by some Spanish banks
- Trusted by Spanish consumers

**Use Case**: Alternative for Spanish users who prefer local payment

---

## Subscription Payment Flow

### Owner Subscribes

```
Owner selects plan (Basic/Pro/Enterprise)
    │
    ▼
Redirected to payment page
    │
    ├─ Plan details
    ├─ Price breakdown
    └─ Payment method input
    │
    ▼
Enter payment details
    │
    ├─ Card number
    ├─ Expiry date
    ├─ CVC
    └─ Billing address
    │
    ▼
Stripe processes payment
    │
    ├─ Create Stripe Customer
    ├─ Create Payment Method
    ├─ Create Subscription
    └─ Process initial payment
    │
    ▼
Webhook confirms payment
    │
    └─ Update user status to "active"
    │
    ▼
Owner redirected to dashboard
    │
    └─ "Subscription Active" confirmation
```

### Recurring Billing

```
Subscription renewal date
    │
    ▼
Stripe automatically charges card
    │
    ├─ Success
    │   ├─ Webhook: invoice.paid
    │   ├─ Update subscription status
    │   ├─ Send receipt email
    │   └─ Continue service
    │
    └─ Failure
        ├─ Webhook: invoice.payment_failed
        ├─ Send dunning email (retry notification)
        ├─ Retry payment (Stripe auto-retry)
        └─ After retries fail:
            ├─ Suspend subscription
            ├─ Hide properties from search
            └─ Notify owner
```

---

## Booking Payment Flow

### Guest Makes Booking

```
Guest confirms booking
    │
    ▼
Create booking (status: pending)
    │
    ▼
Payment page
    │
    ├─ Booking summary
    ├─ Price breakdown
    ├─ Cancellation policy
    └─ Payment method
    │
    ▼
Guest enters payment details
    │
    ▼
Create Stripe Payment Intent
    │
    ├─ Amount: booking total
    ├─ Currency: EUR
    ├─ Metadata: booking ID, property ID, dates
    └─ Capture method: automatic or manual
    │
    ▼
Stripe processes payment
    │
    ├─ 3D Secure verification (if required)
    ├─ Fraud checks
    └─ Card authorization
    │
    ▼
Payment successful
    │
    ├─ Webhook: payment_intent.succeeded
    ├─ Update booking status: confirmed
    ├─ Hold funds (Stripe Connect)
    └─ Send confirmations
    │
    ▼
After check-in (automatic trigger)
    │
    ├─ Release payment to owner
    ├─ Deduct platform fee
    └─ Transfer to owner's bank account
```

### Payment Holding Period

**Purpose**: Prevent fraud, allow cancellations

**Standard Hold**:
- Funds held until check-in date
- Released 24 hours after check-in
- Owner receives payment within 2-3 business days

**Early Release** (optional for verified owners):
- Released immediately after booking
- Higher risk for owner

---

## Payment Methods

### Supported Payment Methods

#### Credit/Debit Cards
- Visa
- Mastercard
- American Express
- Maestro

#### Bank Transfers (Future)
- SEPA Direct Debit
- Bank transfer (manual)

#### Digital Wallets (Future)
- Apple Pay
- Google Pay
- PayPal

---

## Stripe Integration

### Setup

```typescript
// Install Stripe
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

// Initialize Stripe
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
```

### Create Subscription

```typescript
// Backend API route: /api/subscriptions/create
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const { userId, priceId } = await req.json();
  
  // Create or retrieve Stripe customer
  let customer = await getOrCreateStripeCustomer(userId);
  
  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      userId,
    },
  });
  
  return Response.json({
    subscriptionId: subscription.id,
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
  });
}
```

### Create Booking Payment

```typescript
// Backend API route: /api/bookings/:id/payment
export async function POST(req: Request, { params }) {
  const bookingId = params.id;
  const booking = await getBooking(bookingId);
  
  // Create Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.total * 100), // Convert to cents
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
    metadata: {
      bookingId,
      propertyId: booking.propertyId,
      guestId: booking.guestId,
      ownerId: booking.ownerId,
    },
    // Use Stripe Connect for marketplace
    application_fee_amount: Math.round(booking.serviceFee * 100),
    transfer_data: {
      destination: ownerStripeAccountId,
    },
  });
  
  return Response.json({
    clientSecret: paymentIntent.client_secret,
  });
}
```

### Frontend Payment Form

```typescript
// components/payment/PaymentForm.tsx
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export function PaymentForm({ clientSecret, bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billingName,
            email: billingEmail,
          },
        },
      }
    );
    
    if (error) {
      setError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      // Payment successful
      router.push(`/reservas/${bookingId}/confirmacion`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={cardElementOptions} />
      <button type="submit" disabled={!stripe}>
        Pagar {formatPrice(total)}
      </button>
    </form>
  );
}
```

---

## Webhooks

### Stripe Webhooks

**Endpoint**: `/api/webhooks/stripe`

**Events to Handle**:

```typescript
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      sig,
      webhookSecret
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  switch (event.type) {
    // Subscription events
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
      
    case 'invoice.paid':
      await handleInvoicePaid(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object);
      break;
      
    // Booking payment events
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
      
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
      
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
  }
  
  return Response.json({ received: true });
}
```

---

## Stripe Connect (Marketplace Payments)

### Why Stripe Connect?

**Marketplace Requirements**:
- FincAirbnb receives bookings
- FincAirbnb takes service fee
- Owner receives net amount
- Automatic splits and transfers

### Connect Account Types

**Standard Connect** (Recommended):
- Owner creates own Stripe account
- Full control over their account
- Direct relationship with Stripe
- FincAirbnb facilitates payments

**Express Connect** (Alternative):
- Simplified onboarding
- FincAirbnb manages more aspects
- Faster setup for owners

### Owner Onboarding

```typescript
// Create Connect account for owner
export async function createOwnerConnectAccount(userId: string) {
  const account = await stripe.accounts.create({
    type: 'standard', // or 'express'
    country: 'ES',
    email: user.email,
    metadata: {
      userId,
    },
  });
  
  // Create account link for onboarding
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${baseUrl}/taboleiro/pagamentos/reactivar`,
    return_url: `${baseUrl}/taboleiro/pagamentos/completado`,
    type: 'account_onboarding',
  });
  
  return accountLink.url;
}
```

### Payment Split

```typescript
// Booking payment with split
const paymentIntent = await stripe.paymentIntents.create({
  amount: 100000, // 1000€ booking
  currency: 'eur',
  application_fee_amount: 10000, // 100€ service fee (10%)
  transfer_data: {
    destination: ownerStripeAccountId, // 900€ to owner
  },
  metadata: {
    bookingId: booking.id,
  },
});
```

---

## Subscription Management

### Subscription Dashboard

**Owner can**:
- View current plan
- View billing history
- Download invoices
- Update payment method
- Upgrade/downgrade plan
- Cancel subscription

### Plan Changes

#### Upgrade

```typescript
// Upgrade subscription
export async function upgradeSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: 'create_prorations', // Charge difference immediately
  });
}
```

#### Downgrade

```typescript
// Downgrade at period end
export async function downgradeSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: 'none',
    billing_cycle_anchor: 'unchanged', // Change at next billing
  });
}
```

#### Cancel

```typescript
// Cancel at period end
export async function cancelSubscription(subscriptionId: string) {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}
```

### Stripe Customer Portal

**Self-service portal** for subscriptions:

```typescript
// Create portal session
export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/taboleiro/configuracion/facturacion`,
  });
  
  return session.url;
}
```

**Portal Features**:
- Update payment method
- View invoices
- Cancel subscription
- Update billing info

---

## Refunds & Cancellations

### Refund Policy

**Based on cancellation policy**:
- Calculate refund amount
- Deduct non-refundable fees
- Process refund

```typescript
export async function processRefund(
  bookingId: string,
  reason: string
) {
  const booking = await getBooking(bookingId);
  const refundAmount = calculateRefundAmount(booking);
  
  // Create refund in Stripe
  const refund = await stripe.refunds.create({
    payment_intent: booking.paymentIntentId,
    amount: Math.round(refundAmount * 100),
    reason: 'requested_by_customer',
    metadata: {
      bookingId,
      reason,
    },
  });
  
  // Update booking
  await updateBooking(bookingId, {
    status: 'cancelled',
    paymentStatus: 'refunded',
    refundAmount,
  });
  
  // Notify owner and guest
  await sendRefundNotifications(booking, refundAmount);
  
  return refund;
}
```

### Partial Refunds

For cancellations with partial refunds:

```typescript
// 50% refund example
const refund = await stripe.refunds.create({
  payment_intent: paymentIntentId,
  amount: Math.round(booking.total * 0.5 * 100),
});
```

---

## Security & Compliance

### PCI Compliance

**Stripe handles**:
- Card data never touches our servers
- PCI-DSS Level 1 certified
- Tokenization
- Encryption

**Our responsibility**:
- Use Stripe.js / Elements
- HTTPS only
- Secure webhooks
- No storing of card data

### 3D Secure (SCA)

**Strong Customer Authentication** (EU requirement):
- Automatic with Payment Intents API
- Stripe handles challenge flow
- Required for payments >€30

### Fraud Prevention

**Stripe Radar**:
- Machine learning fraud detection
- Automatic blocking of suspicious cards
- Manual review rules

**Our measures**:
- Verify user accounts
- Monitor for unusual patterns
- Rate limiting on payments
- Review high-value transactions

---

## Pricing & Fees

### Our Fees

**Service Fee** (from guests):
- 10% of booking subtotal
- Covers platform costs, payment processing, support

**Subscription** (from owners):
- Monthly/annual plans
- Covers platform access, tools, features

### Stripe Fees

**European Cards**: 1.4% + €0.25  
**Non-European Cards**: 2.9% + €0.25  
**Stripe Connect**: +0.25% per transaction

**Example Calculation**:
```
Booking: 1000€
Service Fee (10%): 100€
Subtotal for processing: 1100€

Stripe Fee: (1100 × 1.4%) + 0.25 = 15.65€

Owner receives: 1000 - 15.65 = 984.35€
Platform receives: 100 - Stripe Connect fee
```

---

## Database Schema

```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_customer_id VARCHAR(100) NOT NULL,
  stripe_subscription_id VARCHAR(100) NOT NULL,
  
  plan_id VARCHAR(50) NOT NULL, -- 'basic', 'pro', 'enterprise'
  status VARCHAR(20) NOT NULL, -- 'active', 'cancelled', 'past_due'
  
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  subscription_id UUID REFERENCES subscriptions(id),
  
  stripe_payment_intent_id VARCHAR(100),
  stripe_charge_id VARCHAR(100),
  
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL, -- 'pending', 'succeeded', 'failed'
  
  payment_method VARCHAR(50), -- 'card', 'bank_transfer'
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Refunds table
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  payment_id UUID NOT NULL REFERENCES payments(id),
  
  stripe_refund_id VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  status VARCHAR(20) NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  
  stripe_invoice_id VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  invoice_pdf VARCHAR(500),
  
  period_start TIMESTAMP,
  period_end TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Testing

### Test Mode

**Stripe Test Cards**:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
Insufficient funds: 4000 0000 0000 9995
```

**Test Environment**:
- Use Stripe test API keys
- No real charges
- Simulate webhooks
- Test all flows

---

## Future Enhancements

### Phase 5+
- [ ] Multi-currency support
- [ ] Dynamic currency conversion
- [ ] Split payments (group bookings)
- [ ] Payment plans (installments)
- [ ] Gift cards
- [ ] Promotional codes / Discounts
- [ ] Automated payouts schedule
- [ ] Cryptocurrency payments
- [ ] Bank transfer (manual verification)
- [ ] Local payment methods (Bizum, etc.)

---

**Status**: Specification Phase  
**Target Release**: Phase 4  
**Dependencies**: Booking system, User authentication  
**Priority**: Critical

