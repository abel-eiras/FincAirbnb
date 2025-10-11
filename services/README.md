# Mock Services - FincAirbnb

## Overview

This directory contains service functions that simulate API calls using mock data. These services will be replaced with real API calls once the backend is implemented.

---

## Purpose

Mock services provide:
1. **Realistic API behavior** - Simulates network delays, error states
2. **Easy replacement** - Same interface as real API will have
3. **Independent development** - Frontend doesn't depend on backend
4. **Predictable testing** - Control exact data returned

---

## Structure

```
services/
├── README.md           # This file
├── mockAuth.ts         # Authentication (login, register, logout)
├── mockProperties.ts   # Property listings (get, create, update)
├── mockBookings.ts     # Bookings (create, get, update, cancel)
├── mockMessages.ts     # Messaging (send, get conversations)
└── mockReviews.ts      # Reviews (create, get reviews)
```

---

## Usage Pattern

### Import and Use

```typescript
import { getProperties } from '@/services/mockProperties'

async function PropertyList() {
  const properties = await getProperties({
    city: 'Pontevedra',
    minPrice: 50,
    maxPrice: 200
  })
  
  return <div>{/* render properties */}</div>
}
```

###Features

**Network Delay Simulation**:
```typescript
// Simulates 300-800ms network delay
await delay(300 + Math.random() * 500)
```

**Error Simulation**:
```typescript
// Optional: Simulate errors
if (Math.random() < 0.05) { // 5% error rate
  throw new Error('Network error')
}
```

**Filtering & Pagination**:
```typescript
const properties = await getProperties({
  city: 'Pontevedra',
  page: 1,
  limit: 10
})
```

---

## Service Interfaces

### mockAuth.ts

```typescript
// Login
await login(email: string, password: string): Promise<AuthResponse>

// Register
await register(data: RegisterData): Promise<AuthResponse>

// Logout
logout(): void

// Get current user
getCurrentUser(): User | null

// Update profile
await updateProfile(userId: string, data: Partial<User>): Promise<User>
```

### mockProperties.ts

```typescript
// Get all properties (with filters)
await getProperties(filters?: PropertyFilters): Promise<Property[]>

// Get single property
await getProperty(id: string): Promise<Property>

// Create property
await createProperty(data: CreatePropertyData): Promise<Property>

// Update property
await updateProperty(id: string, data: Partial<Property>): Promise<Property>

// Delete property
await deleteProperty(id: string): Promise<void>

// Search properties
await searchProperties(query: string, filters?: PropertyFilters): Promise<Property[]>
```

### mockBookings.ts

```typescript
// Get user bookings
await getUserBookings(userId: string, type: 'guest' | 'owner'): Promise<Booking[]>

// Get single booking
await getBooking(id: string): Promise<Booking>

// Create booking
await createBooking(data: CreateBookingData): Promise<Booking>

// Update booking
await updateBooking(id: string, data: Partial<Booking>): Promise<Booking>

// Cancel booking
await cancelBooking(id: string, reason: string): Promise<Booking>

// Get property availability
await getAvailability(propertyId: string, month: string): Promise<CalendarDay[]>
```

### mockMessages.ts

```typescript
// Get conversations
await getConversations(userId: string): Promise<Conversation[]>

// Get conversation by ID
await getConversation(id: string): Promise<Conversation>

// Send message
await sendMessage(conversationId: string, content: string, senderId: string): Promise<Message>

// Mark as read
await markAsRead(conversationId: string, userId: string): Promise<void>

// Create conversation
await createConversation(data: CreateConversationData): Promise<Conversation>
```

### mockReviews.ts

```typescript
// Get property reviews
await getPropertyReviews(propertyId: string): Promise<Review[]>

// Get user reviews (given or received)
await getUserReviews(userId: string, type: 'given' | 'received'): Promise<Review[]>

// Create review
await createReview(data: CreateReviewData): Promise<Review>

// Respond to review (owner)
await respondToReview(reviewId: string, response: string): Promise<Review>

// Mark review as helpful
await markHelpful(reviewId: string, userId: string): Promise<void>
```

---

## Helper Utilities

### Delay Function

```typescript
// services/utils.ts
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Usage
await delay(500) // Wait 500ms
```

### Load JSON Data

```typescript
// Load mock data
import usersData from '@/mocks/users.json'
import propertiesData from '@/mocks/properties.json'

// Use as needed
const users: User[] = usersData
```

### Filtering Helper

```typescript
export function filterProperties(
  properties: Property[],
  filters: PropertyFilters
): Property[] {
  return properties.filter(property => {
    if (filters.city && property.location.city !== filters.city) {
      return false
    }
    if (filters.minPrice && property.pricing.basePrice < filters.minPrice) {
      return false
    }
    // ... more filters
    return true
  })
}
```

---

## Migration to Real API

When backend is ready, replace mock services with API calls:

### Before (Mock)

```typescript
// services/mockProperties.ts
export async function getProperties(filters?: PropertyFilters) {
  await delay(500)
  const properties = await import('@/mocks/properties.json')
  return filterProperties(properties.default, filters)
}
```

### After (Real API)

```typescript
// services/api/properties.ts
export async function getProperties(filters?: PropertyFilters) {
  const response = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  })
  return response.json()
}
```

### Update Imports

```typescript
// Before
import { getProperties } from '@/services/mockProperties'

// After
import { getProperties } from '@/services/api/properties'
```

---

## Testing with Mock Services

Mock services make testing easier:

```typescript
// Mock specific responses
jest.mock('@/services/mockProperties', () => ({
  getProperties: jest.fn().mockResolvedValue([mockProperty1, mockProperty2])
}))

// Test component
render(<PropertyList />)
await waitFor(() => {
  expect(screen.getByText('Finca do Val')).toBeInTheDocument()
})
```

---

## Best Practices

1. **Keep same interface** - Mock services should match future API exactly
2. **Simulate delays** - Always add realistic network delays
3. **Handle errors** - Simulate error states occasionally
4. **Type safety** - Use TypeScript types for all inputs/outputs
5. **Document** - Comment unusual behavior or edge cases

---

## Environment Configuration

```typescript
// lib/config.ts
export const MOCK_CONFIG = {
  DELAY_MIN: 300,  // Minimum delay in ms
  DELAY_MAX: 800,  // Maximum delay in ms
  ERROR_RATE: 0.05, // 5% error rate for testing
  ENABLE_DELAYS: process.env.NODE_ENV !== 'test' // Disable in tests
}
```

---

**Last Updated**: Octubre 2024  
**Status**: In Development  
**Backend API**: Planned for post-Milestone 10

