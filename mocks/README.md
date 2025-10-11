# Mock Data - FincAirbnb

## Overview

This directory contains JSON files with mock data for frontend development. These files simulate the data that will eventually come from the backend API.

---

## Files

- **`users.json`** - User accounts (owners, guests, admin)
- **`properties.json`** - Property listings (fincas)
- **`bookings.json`** - Booking reservations
- **`messages.json`** - Messages between users
- **`reviews.json`** - Property and user reviews

---

## Usage

### In Components

```typescript
import users from '@/mocks/users.json'
import properties from '@/mocks/properties.json'

// Use directly
const user = users.find(u => u.id === userId)
```

### With Mock Services (Recommended)

```typescript
import { getProperties } from '@/services/mockProperties'

// Service handles filtering, delays, etc.
const properties = await getProperties({ city: 'Pontevedra' })
```

---

## Data Structure

### User IDs
- `user-owner-1` - Manuel (Property Owner)
- `user-owner-2` - Ana (Property Manager)
- `user-guest-1` - Laura (Guest)
- `user-guest-2` - Carlos (Guest)
- `user-admin-1` - David (Admin)

### Property IDs
- `prop-1` - Finca do Val
- `prop-2` - Pazo de Salnés
- `prop-3` - Casa da Hedra
- ... (more properties)

### Booking IDs
- `book-1`, `book-2`, etc.

### Message Conversation IDs
- `conv-1`, `conv-2`, etc.

### Review IDs
- `rev-1`, `rev-2`, etc.

---

## Updating Mock Data

When adding/modifying mock data:

1. **Keep IDs consistent** across files
2. **Use Galician text** for user-facing content
3. **Realistic data** - use real Galician places, names
4. **Validate JSON** before committing

---

## Future Migration

These JSON files will be replaced with API calls:

**Before** (Mock):
```typescript
import properties from '@/mocks/properties.json'
```

**After** (API):
```typescript
const response = await fetch('/api/properties')
const properties = await response.json()
```

The structure will remain the same, only the data source changes.

---

**Last Updated**: Octubre 2024

