# Notification Services - FincAirbnb

## Overview

FincAirbnb uses multiple notification channels to keep users informed about bookings, messages, and platform updates. This document details all notification integrations and strategies.

---

## Notification Channels

### 1. Email (Primary)
**Provider**: Resend or SendGrid  
**Usage**: All transactional and marketing emails  
**Priority**: High

### 2. In-App Notifications
**Provider**: Custom implementation  
**Usage**: Real-time platform notifications  
**Priority**: Medium

### 3. Push Notifications (Future)
**Provider**: Firebase Cloud Messaging (FCM) or OneSignal  
**Usage**: Mobile app and web push  
**Priority**: Future

### 4. SMS (Optional)
**Provider**: Twilio  
**Usage**: Critical notifications, 2FA  
**Priority**: Low (optional)

---

## Email Notifications

### Email Service Provider Selection

#### Option 1: Resend (Recommended)

**Why Resend?**
- Modern, developer-friendly API
- React email templates
- Excellent deliverability
- Generous free tier (3,000 emails/month)
- Built for transactional emails

**Setup**:
```bash
npm install resend
```

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  from = 'FincAirbnb <noreply@fincairbnb.com>',
}) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
  
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
  
  return data;
}
```

#### Option 2: SendGrid

**Why SendGrid?**
- Industry standard
- Robust APIs
- Advanced analytics
- Template management
- Marketing email support

**Setup**:
```bash
npm install @sendgrid/mail
```

```typescript
// lib/email-sendgrid.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(msg: {
  to: string;
  subject: string;
  html: string;
}) {
  await sgMail.send({
    ...msg,
    from: 'noreply@fincairbnb.com',
  });
}
```

---

### Email Templates

#### React Email Templates

**Why React Email?**
- Write emails in React components
- Type-safe
- Preview in development
- Responsive by default

**Setup**:
```bash
npm install react-email @react-email/components
```

**Example Template**:

```tsx
// emails/BookingConfirmation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface BookingConfirmationEmailProps {
  guestName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingId: string;
}

export default function BookingConfirmationEmail({
  guestName,
  propertyName,
  checkInDate,
  checkOutDate,
  bookingId,
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>A túa reserva en {propertyName} foi confirmada!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://fincairbnb.com/logo.png"
            width="48"
            height="48"
            alt="FincAirbnb"
          />
          <Heading style={h1}>Reserva confirmada! 🎉</Heading>
          <Text style={text}>
            Ola {guestName},
          </Text>
          <Text style={text}>
            A túa reserva en <strong>{propertyName}</strong> foi confirmada.
          </Text>
          <Section style={details}>
            <Text style={detailsText}>
              📅 <strong>Check-in:</strong> {checkInDate}
            </Text>
            <Text style={detailsText}>
              📅 <strong>Check-out:</strong> {checkOutDate}
            </Text>
            <Text style={detailsText}>
              🔖 <strong>Código de reserva:</strong> {bookingId}
            </Text>
          </Section>
          <Link style={button} href={`https://fincairbnb.com/reservas/${bookingId}`}>
            Ver detalles da reserva
          </Link>
          <Text style={footer}>
            Enviarémosche as instrucións de check-in uns días antes da túa chegada.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: '#f6f9fc', fontFamily: 'DM Sans, sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px' };
const h1 = { fontSize: '32px', fontWeight: 'bold', margin: '40px 0' };
const text = { fontSize: '16px', lineHeight: '26px' };
const details = { backgroundColor: '#F5E6D3', borderRadius: '8px', padding: '24px' };
const detailsText = { fontSize: '16px', margin: '8px 0' };
const button = {
  backgroundColor: '#0066CC',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '32px 0',
};
const footer = { fontSize: '14px', color: '#6B7280' };
```

---

### Email Notification Types

#### Transactional Emails

**Guest Emails**:

| Event | Template | Priority |
|-------|----------|----------|
| Registration | `WelcomeEmail` | High |
| Email verification | `EmailVerificationEmail` | Critical |
| Booking confirmed | `BookingConfirmationEmail` | Critical |
| Booking cancelled | `BookingCancellationEmail` | High |
| Check-in reminder (24h) | `CheckInReminderEmail` | High |
| Check-out reminder | `CheckOutReminderEmail` | Medium |
| Review request | `ReviewRequestEmail` | Low |
| Message received | `NewMessageEmail` | Medium |
| Password reset | `PasswordResetEmail` | Critical |

**Owner Emails**:

| Event | Template | Priority |
|-------|----------|----------|
| New booking request | `NewBookingRequestEmail` | Critical |
| Booking confirmed | `OwnerBookingConfirmedEmail` | High |
| Booking cancelled | `OwnerBookingCancelledEmail` | High |
| New message | `NewMessageEmail` | Medium |
| Review received | `ReviewReceivedEmail` | Low |
| Payment received | `PaymentReceivedEmail` | High |
| Subscription renewal | `SubscriptionRenewalEmail` | Medium |
| Subscription payment failed | `SubscriptionFailedEmail` | Critical |

---

### Email Sending Implementation

```typescript
// services/email-service.ts
import { render } from '@react-email/render';
import BookingConfirmationEmail from '@/emails/BookingConfirmation';
import { sendEmail } from '@/lib/email';

export async function sendBookingConfirmation(booking: Booking) {
  const emailHtml = render(
    BookingConfirmationEmail({
      guestName: booking.guest.name,
      propertyName: booking.property.title,
      checkInDate: formatDate(booking.checkInDate),
      checkOutDate: formatDate(booking.checkOutDate),
      bookingId: booking.id,
    })
  );
  
  await sendEmail({
    to: booking.guest.email,
    subject: `Reserva confirmada en ${booking.property.title}`,
    html: emailHtml,
  });
  
  // Log email sent
  await logEmailSent({
    userId: booking.guestId,
    type: 'booking_confirmation',
    bookingId: booking.id,
    sentAt: new Date(),
  });
}

export async function sendNewBookingNotification(booking: Booking) {
  const emailHtml = render(
    NewBookingRequestEmail({
      ownerName: booking.owner.name,
      guestName: booking.guest.name,
      propertyName: booking.property.title,
      checkInDate: formatDate(booking.checkInDate),
      checkOutDate: formatDate(booking.checkOutDate),
      bookingId: booking.id,
      totalAmount: formatPrice(booking.total),
    })
  );
  
  await sendEmail({
    to: booking.owner.email,
    subject: `Nova reserva en ${booking.property.title}`,
    html: emailHtml,
  });
}
```

---

### Email Preferences

**Allow users to control notifications**:

```typescript
interface EmailPreferences {
  userId: string;
  
  // Transactional (cannot unsubscribe)
  bookingConfirmations: true;
  paymentReceipts: true;
  accountSecurity: true;
  
  // Optional
  bookingReminders: boolean;
  messageNotifications: boolean;
  reviewRequests: boolean;
  platformUpdates: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

// Check preferences before sending
export async function shouldSendEmail(
  userId: string,
  emailType: string
): Promise<boolean> {
  const preferences = await getUserEmailPreferences(userId);
  
  // Always send critical emails
  const critical = ['booking_confirmation', 'payment_receipt', 'password_reset'];
  if (critical.includes(emailType)) {
    return true;
  }
  
  // Check user preference
  return preferences[emailType] ?? true;
}
```

---

## In-App Notifications

### Notification Types

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  read: boolean;
  createdAt: Date;
}

type NotificationType =
  | 'booking_request'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'new_message'
  | 'review_received'
  | 'payment_received'
  | 'property_verified'
  | 'system_alert';
```

### Implementation

```typescript
// services/notification-service.ts
export async function createNotification(notification: CreateNotificationDto) {
  const newNotification = await db.notifications.create({
    data: {
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      actionUrl: notification.actionUrl,
      actionText: notification.actionText,
      read: false,
      createdAt: new Date(),
    },
  });
  
  // Emit real-time event (WebSocket)
  await emitNotification(notification.userId, newNotification);
  
  return newNotification;
}

// Get user notifications
export async function getUserNotifications(userId: string, unreadOnly = false) {
  return await db.notifications.findMany({
    where: {
      userId,
      ...(unreadOnly && { read: false }),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

// Mark as read
export async function markNotificationAsRead(notificationId: string) {
  return await db.notifications.update({
    where: { id: notificationId },
    data: { read: true },
  });
}
```

### Real-Time with WebSocket

```typescript
// Using Socket.io
import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  
  // Join user room
  socket.join(`user:${userId}`);
  
  console.log(`User ${userId} connected`);
});

// Emit notification
export async function emitNotification(userId: string, notification: Notification) {
  io.to(`user:${userId}`).emit('notification', notification);
}

// Client-side
socket.on('notification', (notification) => {
  // Show toast
  toast.success(notification.title);
  
  // Update notification count
  updateNotificationCount();
  
  // Play sound
  playNotificationSound();
});
```

---

## Push Notifications (Future)

### Web Push (Progressive Web App)

**Using Firebase Cloud Messaging**:

```typescript
// firebase-messaging-sw.js (Service Worker)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "...",
  projectId: "...",
  messagingSenderId: "...",
  appId: "...",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

**Request Permission**:

```typescript
// Client-side
import { getMessaging, getToken } from 'firebase/messaging';

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    
    // Save token to backend
    await saveDeviceToken(userId, token);
    
    return token;
  }
  
  return null;
}
```

---

## SMS Notifications (Optional)

### Twilio Integration

**Setup**:
```bash
npm install twilio
```

**Implementation**:

```typescript
// lib/sms.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to: string, message: string) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    
    return result;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
}

// Example: Check-in reminder
export async function sendCheckInReminderSMS(booking: Booking) {
  if (!booking.guest.phone) return;
  
  const message = `Recordatorio: O teu check-in en ${booking.property.title} é mañá. Código: ${booking.id}. FincAirbnb`;
  
  await sendSMS(booking.guest.phone, message);
}
```

**Use Cases**:
- Check-in reminders (24h before)
- Urgent booking changes
- Two-factor authentication
- Critical alerts

**Cost Consideration**: SMS is expensive (~€0.05-0.10/message), use sparingly

---

## Notification Preferences

### User Settings

```typescript
interface NotificationSettings {
  userId: string;
  
  email: {
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    marketing: boolean;
  };
  
  inApp: {
    bookings: boolean;
    messages: boolean;
    reviews: boolean;
    system: boolean;
  };
  
  push: {
    enabled: boolean;
    bookings: boolean;
    messages: boolean;
  };
  
  sms: {
    enabled: boolean;
    checkInReminders: boolean;
    urgentOnly: boolean;
  };
}
```

---

## Best Practices

### Email

1. **Subject Lines**: Clear and concise (40-50 characters)
2. **Sender Name**: "FincAirbnb" not "noreply@..."
3. **Preheader**: Compelling preview text
4. **Mobile-First**: 60% of emails opened on mobile
5. **CTA**: Clear call-to-action buttons
6. **Unsubscribe**: Easy to find (required by law)
7. **Spam Compliance**: Follow CAN-SPAM, GDPR

### Timing

**Immediate** (within 1 minute):
- Booking confirmations
- Payment receipts
- Password resets

**Scheduled**:
- Check-in reminders: 24 hours before
- Check-out reminders: Day of checkout, 6 AM
- Review requests: 24 hours after checkout

**Digest** (if enabled):
- Weekly property performance
- Monthly earnings summary

### Rate Limiting

```typescript
// Prevent notification spam
export async function canSendNotification(
  userId: string,
  type: string
): Promise<boolean> {
  const recentCount = await getRecentNotificationCount(userId, type, 3600); // Last hour
  
  const limits = {
    new_message: 10,
    booking_update: 5,
    default: 3,
  };
  
  const limit = limits[type] || limits.default;
  
  return recentCount < limit;
}
```

---

## Monitoring & Analytics

### Track Email Performance

```typescript
interface EmailMetrics {
  emailId: string;
  type: string;
  sentAt: Date;
  delivered: boolean;
  opened: boolean;
  clicked: boolean;
  bounced: boolean;
  complained: boolean;
}

// Webhook from email provider
export async function handleEmailWebhook(event: EmailEvent) {
  await updateEmailMetrics({
    emailId: event.messageId,
    [event.type]: true,
    [`${event.type}At`]: new Date(),
  });
}
```

### Key Metrics

- **Delivery Rate**: % of emails successfully delivered
- **Open Rate**: % of delivered emails opened (industry avg: 20-25%)
- **Click Rate**: % of emails with link clicks (industry avg: 2-5%)
- **Bounce Rate**: % of emails that bounced (keep < 2%)
- **Unsubscribe Rate**: % who unsubscribed (keep < 0.5%)

---

## Future Enhancements

- [ ] WhatsApp notifications (via Twilio API)
- [ ] Telegram bot for notifications
- [ ] Voice calls for critical alerts (Twilio)
- [ ] Smart notification batching (digest mode)
- [ ] AI-powered send time optimization
- [ ] Multi-language email templates
- [ ] A/B testing for email templates
- [ ] Rich push notifications with actions
- [ ] Notification analytics dashboard

---

**Last Updated**: October 2024  
**Integration Owner**: Backend & Marketing Team  
**Compliance**: GDPR, CAN-SPAM, ePrivacy

