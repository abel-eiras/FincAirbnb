# Booking System - FincAirbnb

## Overview

The Booking System enables guests to reserve properties and property owners to manage reservations. This is a critical feature planned for Phase 3 of development.

---

## User Stories

### As a Guest, I want to:
1. Select dates and book a property
2. See total cost breakdown before confirming
3. Receive booking confirmation
4. View my upcoming and past bookings
5. Modify booking dates (if policy allows)
6. Cancel a booking
7. Communicate with the property owner
8. Leave a review after my stay

### As a Property Owner, I want to:
1. Receive booking requests
2. Accept or decline requests (if not instant book)
3. View all my bookings in a calendar
4. Manage booking status
5. Communicate with guests
6. Issue refunds if needed
7. Track booking revenue

---

## Data Model

### Booking Schema

```typescript
interface Booking {
  // IDs
  id: string;
  propertyId: string;
  guestId: string;
  ownerId: string;
  
  // Dates
  checkInDate: string;      // ISO date
  checkOutDate: string;
  nights: number;           // Calculated
  
  // Guests
  numberOfGuests: number;
  guestDetails?: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  
  // Pricing
  pricing: {
    basePrice: number;      // Price per night/month
    nights: number;
    subtotal: number;       // basePrice × nights
    cleaningFee: number;
    serviceFee: number;     // Platform fee
    taxes: number;
    discount?: number;      // Promotional discount
    total: number;          // Final amount
  };
  
  // Status
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  
  // Special Requests
  specialRequests?: string;
  
  // Communication
  messages: Message[];
  
  // Cancellation
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  cancellationDetails?: {
    cancelledAt: string;
    cancelledBy: 'guest' | 'owner' | 'admin';
    reason: string;
    refundAmount: number;
  };
  
  // Review
  guestReview?: Review;
  ownerReview?: Review;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

type BookingStatus = 
  | 'pending'        // Awaiting owner approval
  | 'confirmed'      // Approved by owner
  | 'paid'          // Payment completed
  | 'checked_in'    // Guest has checked in
  | 'checked_out'   // Guest has checked out
  | 'completed'     // Booking finished
  | 'cancelled'     // Cancelled
  | 'declined';     // Owner declined

type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Review {
  id: string;
  rating: number;       // 1-5 stars
  comment: string;
  categories: {
    cleanliness: number;
    communication: number;
    accuracy: number;
    location: number;
    value: number;
  };
  createdAt: string;
}
```

---

## Booking Flow

### 1. Search & Select

```
Guest searches for properties
    │
    ▼
Views search results
    │
    ▼
Clicks on property
    │
    ▼
Property detail page loads
    │
    └─ Shows availability calendar
```

### 2. Booking Widget

**Sticky Booking Widget** (right sidebar on property page):

```
┌────────────────────────────────────┐
│  150€ por noite                    │
│                                    │
│  📅 Check-in                       │
│  [Date Picker] ───────►           │
│                                    │
│  📅 Check-out                      │
│  [Date Picker] ───────►           │
│                                    │
│  👥 Hóspedes                       │
│  [Dropdown: 1-10] ────►           │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ 150€ × 5 noites   750€      │ │
│  │ Limpeza            50€       │ │
│  │ Taxa de servizo    75€       │ │
│  │ ─────────────────────────    │ │
│  │ Total             875€       │ │
│  └──────────────────────────────┘ │
│                                    │
│  [Reservar]                        │
│                                    │
│  Non se che cobra ata confirmar    │
└────────────────────────────────────┘
```

### 3. Booking Request Flow

```
Guest fills booking widget
    │
    ├─ Selects dates
    ├─ Selects number of guests
    └─ Views price breakdown
    │
    ▼
Clicks "Reservar"
    │
    ▼
Booking Form Page
    │
    ├─ Guest details (if not logged in)
    ├─ Special requests (textarea)
    ├─ Cancellation policy (display)
    ├─ House rules (must accept)
    └─ Payment method
    │
    ▼
Review Booking Page
    │
    ├─ Property summary
    ├─ Dates & guests
    ├─ Price breakdown
    ├─ Cancellation policy
    └─ Payment details
    │
    ▼
Confirm & Pay
    │
    ├─ Process payment
    ├─ Create booking record
    └─ Send confirmations
    │
    ▼
Booking Confirmation Page
    │
    ├─ Booking details
    ├─ Confirmation number
    ├─ Host contact info
    └─ "Message Host" button
```

### 4. Owner Response Flow

**For properties without Instant Book**:

```
Owner receives notification
    │
    ├─ Email notification
    ├─ In-app notification
    └─ SMS (optional)
    │
    ▼
Owner reviews booking request
    │
    ├─ Guest profile
    ├─ Guest reviews
    ├─ Booking details
    └─ Special requests
    │
    ▼
Owner makes decision
    │
    ├─ Accept
    │   ├─ Booking status → 'confirmed'
    │   ├─ Process payment
    │   └─ Notify guest
    │
    └─ Decline
        ├─ Booking status → 'declined'
        ├─ Optional reason
        └─ Notify guest
```

---

## Instant Book

**Instant Book** allows guests to book without owner approval.

**Requirements for Instant Book**:
- Property owner must enable it
- Property must be verified
- Guest must have verified ID (future)
- Guest must have positive reviews (or none)

**Benefits**:
- Faster bookings
- Higher conversion rate
- Better search ranking

---

## Booking Management

### Guest Booking Dashboard

**URL**: `/taboleiro/reservas`

**Tabs**:
1. **Próximas** (Upcoming)
   - Bookings with `status: confirmed/paid`
   - Sorted by check-in date
   
2. **Pasadas** (Past)
   - Bookings with `status: completed`
   - Option to leave review
   
3. **Canceladas** (Cancelled)
   - Bookings with `status: cancelled`

**Booking Card**:
```
┌─────────────────────────────────────────────────┐
│ [Photo] │ Finca do Val                          │
│         │ Ponteareas, Pontevedra                │
│         │                                       │
│         │ 📅 15-20 Nov 2024 (5 noites)         │
│         │ 👥 4 hóspedes                         │
│         │ 💰 875€                               │
│         │                                       │
│         │ Estado: Confirmada ✓                  │
│         │                                       │
│         │ [Ver detalles] [Mensaxe]  [Cancelar] │
└─────────────────────────────────────────────────┘
```

### Owner Booking Dashboard

**URL**: `/taboleiro/reservas-recibidas`

**Sections**:
1. **Calendario** - Calendar view of all bookings
2. **Listaxe** - List view with filters
3. **Pendentes** - Requiring action
4. **Confirmadas** - Upcoming confirmed bookings
5. **Completadas** - Past bookings

**Quick Stats**:
- Bookings this month
- Revenue this month
- Occupancy rate
- Pending requests (requiring action)

---

## Calendar Integration

### Property Calendar

**Features**:
- View availability
- Block dates (personal use, maintenance)
- Set custom pricing for specific dates
- Bulk operations (block weekends, block range)
- View existing bookings
- Color coding:
  - 🟢 Available
  - 🔴 Booked
  - 🟡 Blocked
  - 🔵 Past dates

**Calendar View**:
```
        Novembro 2024
  D  L  M  M  X  V  S
              1  2  3
  4  5  6  7  8  9  10
  11 12 13 14 15 16 17
  18 19 20 21 22 23 24
  25 26 27 28 29 30

Legend:
🟢 Dispoñible
🔴 Reservado
🟡 Bloqueado
```

### External Calendar Sync (Future)

**iCal Export**:
- Generate iCal feed for property
- Import into Google Calendar, Airbnb, Booking.com

**iCal Import**:
- Import bookings from other platforms
- Prevent double bookings
- Automatic sync (daily)

---

## Pricing Calculation

### Price Breakdown Logic

```typescript
function calculateBookingPrice(
  basePrice: number,
  nights: number,
  cleaningFee: number,
  serviceFeePercentage: number = 10
) {
  const subtotal = basePrice * nights;
  const serviceFee = subtotal * (serviceFeePercentage / 100);
  const taxes = (subtotal + serviceFee) * 0.10; // 10% IVA (Spain)
  const total = subtotal + cleaningFee + serviceFee + taxes;
  
  return {
    subtotal,
    cleaningFee,
    serviceFee,
    taxes,
    total,
  };
}
```

### Dynamic Pricing (Future Enhancement)

**Factors**:
- Day of week (weekend premium)
- Season (high/low season)
- Demand (surge pricing)
- Advance booking (early bird discount)
- Last-minute bookings
- Length of stay (weekly/monthly discount)

---

## Cancellation Policies

### Flexible
- **Full refund** if cancelled 24+ hours before check-in
- **50% refund** if cancelled within 24 hours
- **No refund** after check-in

### Moderate
- **Full refund** if cancelled 5+ days before check-in
- **50% refund** if cancelled 2-5 days before
- **No refund** if cancelled within 2 days

### Strict
- **Full refund** if cancelled 14+ days before check-in
- **50% refund** if cancelled 7-14 days before
- **No refund** if cancelled within 7 days

**Service Fee**: Always non-refundable

---

## Notifications

### Email Notifications

**Guest Notifications**:
- Booking request sent
- Booking confirmed
- Booking declined
- Check-in reminder (1 day before)
- Check-out reminder
- Review request (after check-out)
- Cancellation confirmation

**Owner Notifications**:
- New booking request
- Booking cancelled by guest
- Guest checked in
- Review received
- Payment received

### In-App Notifications

**Real-time notifications** for:
- New booking requests
- New messages
- Status changes
- Review received

### SMS Notifications (Optional, Future)

**High-priority events**:
- Booking confirmed
- Cancellation
- Check-in reminder

---

## Messaging System

### Booking Conversation Thread

**Features**:
- Private thread per booking
- Real-time messaging
- File attachments
- Read receipts
- Email fallback (notifications)

**Pre-booking Inquiries**:
- Guests can message before booking
- Not attached to specific booking
- Converts to booking thread if booked

**Message Templates** (for owners):
- Welcome message
- Check-in instructions
- House manual
- Thank you message

---

## Reviews & Ratings

### Review System

**When reviews are enabled**:
- 14 days after check-out
- Both guest and owner can review
- Reviews published simultaneously (after both submit or 14 days)
- Cannot edit after submission

**Rating Categories** (1-5 stars):

**For Property** (by guest):
- Overall rating
- Cleanliness
- Communication
- Accuracy (vs. listing)
- Location
- Value

**For Guest** (by owner):
- Overall rating
- Cleanliness (how they left property)
- Communication
- Rule following
- Would host again?

**Review Display**:
- Average rating (weighted)
- Total number of reviews
- Rating breakdown (histogram)
- Recent reviews (latest 10)
- Search/filter reviews

---

## Technical Implementation

### API Endpoints (Future)

```
# Bookings
POST   /api/bookings                # Create booking
GET    /api/bookings                # List user's bookings
GET    /api/bookings/:id            # Get booking details
PUT    /api/bookings/:id            # Update booking
DELETE /api/bookings/:id            # Cancel booking

# Owner booking management
GET    /api/properties/:id/bookings # List property bookings
PATCH  /api/bookings/:id/accept     # Accept booking
PATCH  /api/bookings/:id/decline    # Decline booking

# Availability
GET    /api/properties/:id/availability?from=2024-01-01&to=2024-12-31
POST   /api/properties/:id/availability # Block dates

# Pricing
POST   /api/bookings/calculate-price # Calculate booking price

# Messaging
GET    /api/bookings/:id/messages   # Get messages
POST   /api/bookings/:id/messages   # Send message

# Reviews
POST   /api/bookings/:id/review     # Submit review
GET    /api/properties/:id/reviews  # Get property reviews
```

### Database Schema

```sql
-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id),
  guest_id UUID NOT NULL REFERENCES users(id),
  owner_id UUID NOT NULL REFERENCES users(id),
  
  -- Dates
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INT NOT NULL,
  
  -- Guests
  number_of_guests INT NOT NULL,
  adults INT,
  children INT,
  infants INT,
  pets INT,
  
  -- Pricing
  base_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) NOT NULL,
  taxes DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  
  -- Details
  special_requests TEXT,
  cancellation_policy VARCHAR(20) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'paid', 'checked_in', 'checked_out', 'completed', 'cancelled', 'declined'))
);

-- Messages table
CREATE TABLE booking_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewee_id UUID NOT NULL REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  
  rating_overall INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_cleanliness INT CHECK (rating_cleanliness BETWEEN 1 AND 5),
  rating_communication INT CHECK (rating_communication BETWEEN 1 AND 5),
  rating_accuracy INT CHECK (rating_accuracy BETWEEN 1 AND 5),
  rating_location INT CHECK (rating_location BETWEEN 1 AND 5),
  rating_value INT CHECK (rating_value BETWEEN 1 AND 5),
  
  comment TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (booking_id, reviewer_id)
);

-- Indexes
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_owner ON bookings(owner_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_booking ON booking_messages(booking_id);
CREATE INDEX idx_reviews_property ON reviews(property_id);
```

---

## Security & Validation

### Validation Rules

**Dates**:
- Check-out must be after check-in
- Check-in must be in the future (or today)
- Must meet minimum stay requirement
- Cannot overlap with existing bookings

**Guests**:
- Number of guests ≤ property capacity
- At least 1 guest required

**Pricing**:
- All amounts must be positive
- Total must equal sum of parts

**Status Transitions**:
- Define valid status transitions
- Prevent invalid state changes

---

## Future Enhancements

### Phase 4+
- [ ] Split payments (group bookings)
- [ ] Insurance options
- [ ] Damage deposit hold/release
- [ ] Automatic check-in instructions
- [ ] Smart lock integration
- [ ] Guest verification (ID upload)
- [ ] Background checks (optional)
- [ ] Multi-property bookings
- [ ] Gift cards
- [ ] Loyalty program
- [ ] Booking analytics (peak times, trends)
- [ ] Recommended pricing AI
- [ ] Auto-accept criteria (verified guests only)

---

**Status**: Specification Phase  
**Target Release**: Phase 3  
**Dependencies**: Property listings, Payment system, Authentication  
**Priority**: Critical

