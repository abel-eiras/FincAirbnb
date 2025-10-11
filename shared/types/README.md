# Shared Types - FincAirbnb

## Overview

This directory contains TypeScript type definitions shared between frontend and backend (future). Centralizing types ensures consistency and prevents duplication.

---

## Structure

```
shared/types/
├── README.md        # This file
├── user.ts          # User, authentication types
├── property.ts      # Property, listing types
├── booking.ts       # Booking, reservation types
├── message.ts       # Messaging types
├── review.ts        # Review and rating types
└── index.ts         # Re-export all types
```

---

## Usage

### Import from Shared

```typescript
// In frontend
import type { User, Property, Booking } from '@/shared/types'

// In backend (future)
import type { User, Property } from '@shared/types'
```

### Type Organization

Each file exports:
- Main entity type
- Create/Update DTO types
- Filter/Query types
- Response types
- Enum types

**Example**:
```typescript
// shared/types/property.ts

export interface Property {
  id: string
  ownerId: string
  title: string
  // ... full property
}

export interface CreatePropertyData {
  title: string
  description: string
  // ... fields needed to create
}

export interface UpdatePropertyData {
  title?: string
  description?: string
  // ... partial update
}

export interface PropertyFilters {
  city?: string
  province?: string
  minPrice?: number
  maxPrice?: number
  // ... filter options
}

export type PropertyType = 'finca' | 'pazo' | 'casa_rural' | 'horreo' | 'cortina'
export type PropertyStatus = 'draft' | 'active' | 'inactive' | 'pending_review'
```

---

## Type Files

### user.ts
- `User`
- `RegisterData`
- `LoginData`
- `UserRole`
- `AuthResponse`
- `UserStats`
- `NotificationSettings`

### property.ts
- `Property`
- `CreatePropertyData`
- `UpdatePropertyData`
- `PropertyFilters`
- `PropertyType`
- `PropertyStatus`
- `Amenities`
- `Location`
- `Pricing`
- `Rules`

### booking.ts
- `Booking`
- `CreateBookingData`
- `UpdateBookingData`
- `BookingStatus`
- `PaymentStatus`
- `BookingFilters`
- `GuestDetails`
- `PricingBreakdown`
- `CalendarDay`

### message.ts
- `Conversation`
- `Message`
- `CreateConversationData`
- `CreateMessageData`
- `MessageTemplate`
- `SenderType`

### review.ts
- `Review`
- `CreateReviewData`
- `ReviewResponse`
- `RatingCategories`
- `ReviewStats`

---

## Best Practices

1. **Use interfaces for objects**: `interface User { ... }`
2. **Use types for unions**: `type UserRole = 'guest' | 'owner' | 'admin'`
3. **Optional fields**: Use `?` for optional properties
4. **Readonly when needed**: `readonly id: string`
5. **Enums vs Union Types**: Prefer union types for simplicity
6. **JSDoc comments**: Document complex types

```typescript
/**
 * Represents a property listing on FincAirbnb
 * 
 * @property id - Unique identifier
 * @property ownerId - Reference to property owner
 * @property status - Current publication status
 */
export interface Property {
  id: string
  ownerId: string
  status: PropertyStatus
  // ...
}
```

---

## Migration Strategy

### Current State
Types currently in `types/auth.ts` will be moved to `shared/types/user.ts`

### Future Backend
When backend is implemented, these same types will be imported:

```typescript
// backend/src/controllers/properties.ts
import type { Property, CreatePropertyData } from '@shared/types'
```

---

**Last Updated**: Octubre 2024  
**Maintained By**: Development Team

