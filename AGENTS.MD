# FincAirbnb - AI Agent Context

## 🎯 Project Overview

**FincAirbnb** is a marketplace platform connecting property owners with guests interested in renting rural properties (fincas) in Galicia, Spain. The platform enables property owners to list their fincas, manage bookings, and monetize their properties through a subscription-based model.

### Mission
To create a digital experience that brings urban dwellers to the Galician countryside while providing property owners with professional tools to manage their rental business.

### Target Market
- **Primary**: Galicia, Spain
- **User Base**: Property owners, guests, platform administrators
- **Niche**: Rural properties, experiential tourism

---

## 💼 Business Model

### Revenue Streams
1. **Primary**: Monthly/annual subscriptions for property owners
   - Basic: €29/month - Up to 2 properties
   - Pro: €79/month - Up to 10 properties
   - Enterprise: €199/month - Unlimited properties + premium features

2. **Future consideration**: Commission on bookings (5-10%)

### Value Proposition
- **For Property Owners**: Professional tools, calendar management, payment processing, analytics
- **For Guests**: Curated selection, verified properties, secure booking, local experiences

---

## 👥 User Roles

### 1. Property Owners (Propietarios)
- List and manage properties
- Handle bookings and availability
- Communicate with guests
- Access analytics and reports
- Manage subscription

### 2. Guests (Hóspedes)
- Search and discover properties
- Make bookings
- Leave reviews
- Message property owners
- Manage reservations

### 3. Administrators (Administradores)
- Manage platform
- Verify properties
- Handle disputes
- Monitor metrics
- Manage users

---

## 🏗️ Technical Architecture

### Stack Overview
- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod validation
- **State Management**: Context API (currently), React Query (future)
- **Authentication**: Mock system (Phase 1), NextAuth.js (future)
- **Database**: TBD (PostgreSQL recommended)
- **Payments**: Stripe + Redsys (Spanish market)

### Current Phase: Phase 1 - Authentication & Dashboard
- Mock authentication system
- User registration/login/password recovery
- Protected routes
- Basic dashboard
- User profile management

See `/context/technical/architecture.md` for detailed architecture.

---

## 📂 Project Structure (Monorepo)

```
FincAirbnb/                  # Monorepo root
│
├── 🎨 FRONTEND (Current - Next.js App)
│   ├── app/                # Next.js App Router
│   │   ├── (auth routes)  # Galician auth pages
│   │   ├── dashboard/     # Protected dashboard (legacy)
│   │   ├── taboleiro/     # Dashboard (Galician)
│   │   ├── fincas/        # Property catalog
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── auth/         # Authentication
│   │   ├── ui/           # shadcn/ui (50+ components)
│   │   ├── dashboard/    # Dashboard specific
│   │   ├── properties/   # Property components
│   │   └── shared/       # Shared components
│   ├── contexts/         # React Context API
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── mocks/            # 🆕 JSON mock data
│   │   ├── users.json
│   │   ├── properties.json
│   │   ├── bookings.json
│   │   ├── messages.json
│   │   └── reviews.json
│   ├── services/         # 🆕 Mock API services
│   │   ├── mockAuth.ts
│   │   ├── mockProperties.ts
│   │   ├── mockBookings.ts
│   │   ├── mockMessages.ts
│   │   └── mockReviews.ts
│   ├── types/            # TypeScript types
│   └── middleware.ts     # Route protection
│
├── 🔧 BACKEND (Future - Planned)
│   ├── src/              # Backend source
│   ├── prisma/           # Database ORM
│   └── README.md         # Backend docs
│
├── 🤝 SHARED (Types & Constants)
│   ├── types/            # Shared TypeScript types
│   │   ├── user.ts
│   │   ├── property.ts
│   │   ├── booking.ts
│   │   ├── message.ts
│   │   └── review.ts
│   └── constants/        # Shared constants
│
├── 📚 DOCUMENTATION
│   ├── context/          # Technical docs (English)
│   ├── docs/             # Development docs (Spanish)
│   │   └── milestones/  # 11 frontend milestones
│   ├── AGENTS.MD        # This file
│   ├── RESUMEN_EJECUTIVO.md
│   └── ESTRUCTURA_PROYECTO.md
│
└── 📄 ROOT FILES
    ├── package.json
    ├── tsconfig.json
    └── README.md         # Galician
```

---

## 🌍 Language Policy

### Critical: Multi-Language Strategy

1. **User-Facing Content (UI/UX)**: **Galician (Galego)**
   - All buttons, labels, messages, copy
   - Error messages
   - Success notifications
   - Help text

2. **URLs and Routes**: **Galician**
   - `/rexistro` instead of `/register`
   - `/acceder` instead of `/login`
   - `/taboleiro` instead of `/dashboard`
   - See `/context/design/url-mapping.md` for complete mapping

3. **Technical Documentation**: **English**
   - Code documentation
   - Architecture docs
   - API specifications
   - All files in `/context/`

4. **Business Documentation**: **Spanish**
   - Executive summaries
   - Business plans
   - Stakeholder communications
   - See `/RESUMEN_EJECUTIVO.md`

5. **Code (Variables, Functions, Comments)**: **English**
   - Standard software development practice
   - Ensures international compatibility
   - Better tooling support

---

## 🗺️ Development Roadmap

**Strategy**: Frontend-first with mock data, then backend integration.

### Frontend Milestones (Current Focus)

**✅ Milestone 00: Authentication & Dashboard** (COMPLETED)
- User registration, login, logout, password recovery
- Protected routes with middleware
- Basic dashboard structure
- User profile management

**📅 Milestone 01: Mock Infrastructure + Dashboard Base** (1 week)
- Mock data structure (JSON files)
- Mock services (simulate APIs)
- Refined dashboard layout
- Shared TypeScript types

**📅 Milestone 02: Owner Dashboard - Overview** (1.5 weeks)
- Statistics and metrics
- Revenue and occupancy charts
- Upcoming bookings list
- Quick actions

**📅 Milestone 03: Owner Dashboard - Property Management** (2 weeks)
- CRUD operations for properties
- Multi-step creation form
- Photo management (mock)
- Availability calendar

**📅 Milestone 04: Guest Dashboard** (1 week)
- Guest overview
- My bookings (upcoming, past, cancelled)
- Favorite properties
- Pending reviews

**📅 Milestone 05: Property Catalog + Search** (2 weeks)
- Public property listings
- Advanced search and filters
- Sorting and pagination
- Property grid view

**📅 Milestone 06: Property Detail Page** (1.5 weeks)
- Complete property information
- Photo gallery with lightbox
- Reviews section
- Booking widget (sticky)
- Similar properties

**📅 Milestone 07: Booking System (UI)** (2 weeks)
- Complete booking flow
- Date and guest selection
- Price calculation
- Booking confirmation
- Owner booking management

**📅 Milestone 08: Reviews System (UI)** (1 week)
- Review form with ratings
- Review display and filtering
- Owner responses
- Rating breakdown

**📅 Milestone 09: Messaging System (UI)** (1.5 weeks)
- Inbox and conversations
- Message thread
- Message templates (owners)
- Notifications

**📅 Milestone 10: Profiles + Settings** (1 week)
- Public user profiles
- Profile editing
- Account settings
- Subscription management (mock)

**Total Frontend Duration**: ~14-16 weeks (~4 months)

### Backend Development (Future - Post Milestone 10)
- Phase 1: API Foundation (auth, users, properties)
- Phase 2: Bookings API
- Phase 3: Real-time messaging
- Phase 4: Payment integration (Stripe + Redsys)
- Phase 5: Admin panel backend
- Phase 6: Production deployment

See `/docs/milestones/` for detailed specifications of each frontend milestone.

---

## 📊 Key Performance Indicators (KPIs)

See `/context/business/kpis-metrics.md` for detailed metrics tracking.

### Primary KPIs
1. **Revenue Metrics**
   - Monthly Recurring Revenue (MRR)
   - Subscription conversion rate
   - Average Revenue Per User (ARPU)

2. **User Engagement**
   - Active property owners
   - Number of active listings
   - Booking completion rate
   - User retention rate

3. **Platform Health**
   - Time to first booking
   - Search-to-booking conversion
   - User satisfaction score
   - Platform availability (uptime)

---

## 🔌 Integrations (Planned)

### Payment Gateways
- **Stripe**: International payments, subscriptions
- **Redsys**: Spanish debit/credit cards

### Calendar Services
- **Google Calendar**: Two-way sync
- **iCal**: Import/export functionality
- **Airbnb/Booking.com**: Future integration

### Communication
- **SendGrid/Resend**: Transactional emails
- **Twilio**: SMS notifications (optional)
- **Firebase**: Push notifications

### Analytics
- **Google Analytics**: User behavior
- **Mixpanel/PostHog**: Product analytics

---

## 🎨 Design System

### Brand Colors (Galician Theme)
```css
--galician-blue: #0066CC
--galician-green: #4A7C59
--shell-beige: #F5E6D3
```

### Typography
- **Font Family**: DM Sans
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Component Library
- **Base**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom configuration

See `/context/design/ui-ux-guidelines.md` for complete design system.

---

## 🔒 Security Considerations

### Current (Phase 1 - Mock)
- Client-side authentication simulation
- Local storage for session persistence
- No real sensitive data storage

### Future (Production)
- JWT token-based authentication
- HTTP-only cookies for sessions
- HTTPS enforcement
- CSRF protection
- Rate limiting
- Input sanitization
- SQL injection prevention
- XSS protection

---

## 🧪 Testing Strategy

### Current Status
- Manual testing
- TypeScript type safety

### Planned
- **Unit Tests**: Vitest/Jest
- **Integration Tests**: React Testing Library
- **E2E Tests**: Playwright
- **Visual Regression**: Chromatic/Percy

---

## 📦 Deployment

### Current
- Development environment only
- Local execution with `npm run dev`

### Planned
- **Platform**: Vercel (recommended) or Netlify
- **Database**: Supabase or PlanetScale
- **CDN**: Cloudflare or built-in Vercel CDN
- **Environment**: Production, Staging, Development

---

## 📚 Documentation Structure

### For AI Agents (You!)
Start here, then explore:
1. **This file** (`AGENTS.MD`) - Complete project overview
2. `/ESTRUCTURA_PROYECTO.md` - Monorepo structure and conventions
3. `/context/business/` - Business model and strategy
4. `/context/technical/` - System architecture and tech stack
5. `/context/features/` - Feature specifications (all phases)
6. `/context/design/` - Design system and language policy
7. `/docs/milestones/` - **Current work**: 11 frontend milestones

### For Developers
1. `/README.md` - Quick start (Galician)
2. `/ESTRUCTURA_PROYECTO.md` - Project structure and conventions
3. `/docs/milestones/` - Development milestones (Spanish)
4. `/docs/development/` - Implementation guides
5. `/mocks/README.md` - Mock data documentation
6. `/services/README.md` - Mock services guide
7. `/context/technical/` - Architecture details (English)

### For Business Stakeholders
1. `/RESUMEN_EJECUTIVO.md` - Executive summary (Spanish)
2. `/context/business/` - Business documentation (English)
3. `/docs/milestones/README.md` - Development timeline overview

---

## 🚀 Getting Started (For AI Agents)

### Understanding the Codebase
1. **Read this file first** (you're doing it! 👍)
2. **Check current milestone**: `/docs/milestones/README.md` - See what's in progress
3. **Project structure**: `/ESTRUCTURA_PROYECTO.md` - Understand monorepo organization
4. **Architecture**: `/context/technical/architecture.md` - System design
5. **Language policy**: `/context/design/galician-language-policy.md` - CRITICAL: UI in Galician
6. **Mock data**: `/mocks/README.md` - Understand mock data structure
7. **Services**: `/services/README.md` - How mock services work

### Current Development Phase

**Phase**: Frontend with Mock Data (Milestones 01-10)  
**Current Status**: Milestone 00 completed ✅, Milestone 01 next 📅  
**Approach**: Build complete UI/UX with mock data before backend

**Key Locations**:
- `/mocks/` - JSON data files (users, properties, bookings, etc.)
- `/services/` - Mock API services
- `/shared/types/` - TypeScript type definitions
- `/components/` - React components
- `/app/` - Next.js pages and routes

### Making Changes

**Always Remember**:
1. **Language Policy**: User-facing text MUST be in Galician 🇪🇸
2. **URLs in Galician**: `/rexistro`, `/taboleiro`, `/fincas` (see url-mapping.md)
3. **TypeScript**: All code properly typed
4. **Mock First**: Use mock services, not real APIs
5. **Components**: Check `/components/ui/` before creating new ones
6. **Design System**: Follow `/context/design/ui-ux-guidelines.md`

### Common Tasks

**Adding a new page**:
1. Create in `/app/` with Galician route name
2. Use mock services for data
3. Add to navigation if needed
4. Update `/context/design/url-mapping.md`

**Adding a component**:
1. Check if shadcn/ui has it first
2. Follow design system guidelines
3. Use TypeScript interfaces
4. Keep UI text in Galician

**Adding mock data**:
1. Add to appropriate JSON file in `/mocks/`
2. Update mock service in `/services/`
3. Ensure IDs are consistent across files

**Working on a milestone**:
1. Read milestone doc in `/docs/milestones/`
2. Follow task list in order
3. Test thoroughly
4. Update checklist when complete
5. Document any deviations

---

## 📞 Contact & Support

**Project Type**: Early-stage development
**Status**: Phase 1 in progress
**Documentation**: Actively maintained

For questions about:
- **Business decisions**: See `/RESUMEN_EJECUTIVO.md` and `/context/business/`
- **Technical architecture**: See `/context/technical/`
- **Design guidelines**: See `/context/design/`
- **Feature specs**: See `/context/features/`

---

## 🔄 Version History

- **v0.1.0** (October 2024) - Initial documentation structure
- **Current Phase**: Authentication & Dashboard (Phase 1)

---

**Remember**: When working on this project, always check the language policy before adding any user-facing content. Galician for users, English for code and technical docs, Spanish for business summaries. This is a critical requirement! 🌍

