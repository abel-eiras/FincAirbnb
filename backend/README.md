# FincAirbnb Backend

## Status: 🚧 Planned (Not Implemented Yet)

This directory is reserved for the future backend implementation. Currently, FincAirbnb operates with a frontend-only architecture using mock data.

---

## Planned Architecture

**Framework**: Node.js + Express or Next.js API Routes  
**Database**: PostgreSQL  
**ORM**: Prisma  
**Authentication**: JWT + HTTP-only cookies  
**File Storage**: AWS S3 or Cloudinary  
**Payment**: Stripe + Redsys

---

## Timeline

**Backend development** will begin after completing frontend Milestones 1-10 (~3.5 months).

**Phases**:
1. **Phase 1**: Basic API (auth, properties, users)
2. **Phase 2**: Bookings API
3. **Phase 3**: Messaging & real-time
4. **Phase 4**: Payment integration
5. **Phase 5**: Admin API

---

## Planned Structure

```
backend/
├── src/
│   ├── api/              # API route handlers
│   ├── controllers/      # Business logic controllers
│   ├── services/         # Business services
│   ├── models/           # Data models
│   ├── middleware/       # Auth, validation, etc.
│   ├── utils/            # Utilities
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Design Preview

See `/context/features/` for detailed API specifications.

**Example endpoints**:
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/properties
POST   /api/properties
GET    /api/bookings
POST   /api/bookings
```

---

## Migration from Mock

When backend is ready:

1. Replace mock services with API calls
2. Keep same TypeScript interfaces
3. Update imports in frontend
4. No UI changes needed

**Before**:
```typescript
import { getProperties } from '@/services/mockProperties'
```

**After**:
```typescript
import { getProperties } from '@/services/api/properties'
```

---

For now, focus on frontend development. Backend will come later! 🚀

---

**Planned Start**: After Milestone 10  
**Target**: Q1 2025

