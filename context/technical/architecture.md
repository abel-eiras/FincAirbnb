# System Architecture - FincAirbnb

## Overview

FincAirbnb is built as a modern, scalable web application using Next.js 13 with the App Router. The current architecture supports Phase 1 (Authentication & Dashboard) with mock data, designed to evolve into a full-stack application with real backend services.

---

## Architecture Evolution

### Phase 1: Frontend-Only with Mock Data (Current)
```
┌─────────────────────────────────────────┐
│         Client Browser                   │
├─────────────────────────────────────────┤
│  Next.js 13 App (App Router)            │
│  ├─ React Components                    │
│  ├─ Client State (Context API)          │
│  ├─ Mock Auth Service                   │
│  └─ Local Storage (session persistence) │
└─────────────────────────────────────────┘
```

**Characteristics**:
- No real backend
- Data stored in LocalStorage/SessionStorage
- Mock authentication service
- All business logic in frontend
- Static deployment (Vercel/Netlify)

### Phase 2: Backend Integration (Future)
```
┌────────────────────┐      ┌──────────────────────┐
│   Client Browser   │◄────►│  Next.js App         │
└────────────────────┘      │  (SSR + API Routes)  │
                            └──────────┬───────────┘
                                      │
                            ┌─────────▼───────────┐
                            │   Backend API       │
                            │  (REST or GraphQL)  │
                            └─────────┬───────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
              ┌─────▼────┐     ┌─────▼──────┐   ┌────▼─────┐
              │ Database │     │  Storage   │   │  Queue   │
              │(Postgres)│     │ (S3/Cloud) │   │ (Redis)  │
              └──────────┘     └────────────┘   └──────────┘
```

**Characteristics**:
- RESTful or GraphQL API
- PostgreSQL for relational data
- Cloud storage for images
- Redis for sessions/cache
- Background job processing

### Phase 3: Microservices (Scale)
```
                    ┌──────────────────┐
                    │   Load Balancer  │
                    └────────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        ┌─────▼─────┐ ┌────▼────┐ ┌─────▼─────┐
        │  Next.js  │ │   API   │ │  Booking  │
        │  Frontend │ │ Gateway │ │  Service  │
        └───────────┘ └────┬────┘ └─────┬─────┘
                          │            │
                    ┌──────┼────────────┼──────┐
                    │      │            │      │
              ┌─────▼──┐ ┌─▼───┐  ┌────▼──┐ ┌─▼──────┐
              │  Auth  │ │User │  │Payment│ │Message │
              │Service │ │Svc  │  │ Svc   │ │  Svc   │
              └────────┘ └─────┘  └───────┘ └────────┘
```

---

## Current Architecture (Phase 1)

### High-Level Overview

```
┌───────────────────────────────────────────────────────────┐
│                     Browser                               │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Next.js Application                    │    │
│  │                                                  │    │
│  │  ┌────────────────────────────────────────┐    │    │
│  │  │        App Router (app/)                │    │    │
│  │  │  ┌──────────┐  ┌──────────┐            │    │    │
│  │  │  │  Pages   │  │ Layouts  │            │    │    │
│  │  │  └──────────┘  └──────────┘            │    │    │
│  │  └────────────────────────────────────────┘    │    │
│  │                                                  │    │
│  │  ┌────────────────────────────────────────┐    │    │
│  │  │        Components Layer                 │    │    │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐            │    │    │
│  │  │  │ Auth │ │  UI  │ │ Biz  │            │    │    │
│  │  │  └──────┘ └──────┘ └──────┘            │    │    │
│  │  └────────────────────────────────────────┘    │    │
│  │                                                  │    │
│  │  ┌────────────────────────────────────────┐    │    │
│  │  │        State Management                 │    │    │
│  │  │  ┌──────────────┐                       │    │    │
│  │  │  │ AuthContext  │                       │    │    │
│  │  │  └──────────────┘                       │    │    │
│  │  └────────────────────────────────────────┘    │    │
│  │                                                  │    │
│  │  ┌────────────────────────────────────────┐    │    │
│  │  │        Services Layer                   │    │    │
│  │  │  ┌──────────────┐                       │    │    │
│  │  │  │ Mock Auth    │                       │    │    │
│  │  │  └──────────────┘                       │    │    │
│  │  └────────────────────────────────────────┘    │    │
│  │                                                  │    │
│  │  ┌────────────────────────────────────────┐    │    │
│  │  │        Data Persistence                 │    │    │
│  │  │  ┌──────────────┐ ┌──────────────┐     │    │    │
│  │  │  │LocalStorage  │ │SessionStorage│     │    │    │
│  │  │  └──────────────┘ └──────────────┘     │    │    │
│  │  └────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

### Directory Structure Mapping

```
app/                          # Next.js App Router
├── (auth-pages)/            # Auth route group
│   ├── rexistro/           # Registration (Galician URL)
│   ├── acceder/            # Login
│   └── recuperar-contrasinal/ # Password recovery
├── taboleiro/              # Dashboard (protected)
│   ├── layout.tsx          # Dashboard layout
│   └── page.tsx            # Dashboard home
├── layout.tsx              # Root layout
├── page.tsx                # Landing page
└── globals.css             # Global styles

components/
├── auth/                   # Authentication components
│   ├── AuthForm.tsx       # Reusable form component
│   ├── ProtectedRoute.tsx # Route protection HOC
│   ├── UserMenu.tsx       # User dropdown menu
│   └── AuthButtons.tsx    # Login/Register buttons
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── [50+ UI components]
└── [feature-components]/  # Business logic components

contexts/
└── AuthContext.tsx        # Authentication state management

lib/
├── auth-mock.ts          # Mock authentication service
└── utils.ts              # Utility functions

types/
└── auth.ts               # TypeScript type definitions

middleware.ts             # Route protection middleware
```

---

## Component Architecture

### Component Hierarchy

```
App (layout.tsx)
├── Header
│   ├── Logo
│   ├── Navigation
│   └── UserMenu (if authenticated)
│       ├── Avatar
│       ├── Dropdown
│       └── Logout Button
├── Main Content (page.tsx)
│   ├── Public Pages
│   │   ├── HeroSection
│   │   ├── BenefitsSection
│   │   └── TestimonialsSection
│   ├── Auth Pages
│   │   ├── AuthForm
│   │   │   ├── Input Fields
│   │   │   ├── Validation
│   │   │   └── Submit Button
│   │   └── LoadingSpinner
│   └── Dashboard (Protected)
│       ├── DashboardLayout
│       │   ├── Sidebar
│       │   └── DashboardHeader
│       └── Dashboard Content
│           ├── Overview Cards
│           ├── Statistics
│           └── Quick Actions
└── Footer
    ├── Links
    └── Social Media
```

### Component Patterns

#### 1. Presentation Components
**Location**: `components/ui/`
**Purpose**: Pure UI components, no business logic
**Example**: Button, Input, Card

```typescript
// Stateless, props-driven
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant, size, onClick, children }: ButtonProps) {
  // Pure rendering logic
}
```

#### 2. Container Components
**Location**: `components/auth/`, `components/dashboard/`
**Purpose**: Business logic, state management
**Example**: AuthForm, DashboardOverview

```typescript
// Stateful, handles business logic
export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  const handleSubmit = async (data) => {
    // Business logic
  };
  
  return <form>{/* UI components */}</form>;
}
```

#### 3. Layout Components
**Location**: `app/layout.tsx`, `app/taboleiro/layout.tsx`
**Purpose**: Page structure, persistent UI
**Example**: RootLayout, DashboardLayout

```typescript
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

---

## State Management

### Current: React Context API

```
┌──────────────────────────────────────┐
│         AuthContext                  │
├──────────────────────────────────────┤
│  State:                              │
│  ├─ user: User | null                │
│  ├─ isAuthenticated: boolean         │
│  ├─ isLoading: boolean               │
│  └─ error: string | null             │
│                                      │
│  Actions:                            │
│  ├─ login(email, password)           │
│  ├─ register(userData)               │
│  ├─ logout()                         │
│  ├─ updateProfile(data)              │
│  └─ checkSession()                   │
└──────────────────────────────────────┘
         │
         │ Provides context to
         ▼
┌──────────────────────────────────────┐
│     All Child Components             │
│  ├─ useAuth() hook                   │
│  └─ Access to auth state & actions   │
└──────────────────────────────────────┘
```

### Future: React Query + Zustand

**React Query** for server state:
- API calls
- Caching
- Refetching
- Optimistic updates

**Zustand** for client state:
- UI state
- User preferences
- Temporary form data

---

## Data Flow

### Authentication Flow

```
User Action (Login)
    │
    ▼
LoginForm Component
    │
    ▼
useAuth() Hook
    │
    ▼
AuthContext (login action)
    │
    ▼
Mock Auth Service (lib/auth-mock.ts)
    │
    ├─ Validate credentials
    ├─ Generate mock JWT
    └─ Store in LocalStorage
    │
    ▼
Update AuthContext State
    │
    ├─ Set user data
    ├─ Set isAuthenticated = true
    └─ Trigger re-render
    │
    ▼
Middleware Checks Session
    │
    └─ Redirects to /taboleiro
    │
    ▼
Dashboard Renders (Protected)
```

### Protected Route Flow

```
User Navigates to /taboleiro
    │
    ▼
Middleware Intercepts (middleware.ts)
    │
    ├─ Check LocalStorage for token
    │
    ├─ Token Found?
    │   ├─ Yes → Allow access
    │   └─ No → Redirect to /acceder
    │
    ▼
Page Component Renders
    │
    ▼
Loads AuthContext
    │
    └─ Double-check authentication
        │
        ├─ Authenticated → Show content
        └─ Not authenticated → Show loading/redirect
```

---

## Routing Strategy

### App Router Structure

```
app/
├── layout.tsx                    # Root layout (global)
├── page.tsx                      # Landing page (/)
│
├── (public)/                     # Public route group
│   ├── rexistro/
│   │   └── page.tsx             # /rexistro
│   ├── acceder/
│   │   └── page.tsx             # /acceder
│   └── recuperar-contrasinal/
│       └── page.tsx             # /recuperar-contrasinal
│
└── (protected)/                  # Protected route group
    └── taboleiro/
        ├── layout.tsx           # Dashboard layout
        ├── page.tsx             # /taboleiro
        ├── perfil/
        │   └── page.tsx         # /taboleiro/perfil
        └── (future routes)/
```

### Middleware Protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/taboleiro');
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/acceder', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/taboleiro/:path*']
};
```

---

## Security Architecture (Current - Mock)

### Mock Authentication
- **JWT-style tokens**: Simulated, not cryptographically secure
- **Storage**: LocalStorage (development only)
- **Session**: Client-side only
- **Validation**: Frontend validation only

⚠️ **Warning**: Current implementation is NOT secure for production. Mock data only.

### Future Production Security
- **JWT tokens**: Real cryptographic signing
- **HTTP-only cookies**: Prevent XSS attacks
- **CSRF tokens**: Prevent CSRF attacks
- **Rate limiting**: Prevent brute force
- **Input sanitization**: Prevent injection attacks
- **HTTPS**: Encrypt all traffic
- **Secure headers**: CSP, HSTS, etc.

---

## Performance Optimization

### Current Optimizations
- **Code splitting**: Automatic with Next.js App Router
- **Image optimization**: Next.js Image component
- **Font optimization**: Next.js Font optimization
- **CSS**: Tailwind CSS (purged in production)

### Future Optimizations
- **Static generation**: ISR for public pages
- **Lazy loading**: React.lazy for heavy components
- **Service worker**: Offline support
- **CDN**: Asset distribution
- **Database indexing**: Query optimization
- **Caching**: Redis for frequent queries

---

## Scalability Considerations

### Vertical Scaling
- Increase server resources
- Database connection pooling
- Memory optimization

### Horizontal Scaling
- Load balancing
- Stateless application design
- Distributed caching
- Database replication

### Content Delivery
- CDN for static assets
- Image optimization service
- Geographic distribution

---

## Monitoring & Observability (Future)

```
┌─────────────────────────────────────┐
│     Application Layer               │
│  (Instrumentation)                  │
└──────────┬─────────────────────────┘
           │
    ┌──────┼──────┐
    │      │      │
    ▼      ▼      ▼
┌───────┐ ┌────┐ ┌─────┐
│Logging│ │Metrics│ │Traces│
│(Logs) │ │(Stats)│ │(APM) │
└───┬───┘ └──┬──┘ └──┬──┘
    │        │       │
    └────────┼───────┘
             │
    ┌────────▼──────────┐
    │  Monitoring Stack │
    │  - Datadog        │
    │  - Sentry         │
    │  - LogRocket      │
    └───────────────────┘
```

---

## Deployment Architecture

### Current (Development)
```
Local Machine
    │
    ├─ npm run dev
    │
    └─ http://localhost:3000
```

### Future (Production)
```
GitHub Repository
    │
    ▼
CI/CD Pipeline (GitHub Actions)
    │
    ├─ Run tests
    ├─ Build application
    ├─ Run security checks
    │
    ▼
Vercel / Netlify
    │
    ├─ Deploy to Edge Network
    ├─ Environment variables
    └─ Custom domain
    │
    ▼
Production (https://fincairbnb.com)
```

---

## Technology Decisions

### Why Next.js 13 App Router?
- Server components for better performance
- Built-in routing
- Great DX (Developer Experience)
- Vercel deployment optimization
- SEO-friendly
- TypeScript support

### Why Context API (current)?
- Simple for small state
- No external dependencies
- Good for authentication state
- Easy to understand

### Why Mock Data (Phase 1)?
- Rapid prototyping
- No backend dependency
- Focus on UI/UX first
- Easy to iterate

---

**Last Updated**: October 2024  
**Next Review**: After Phase 2 planning  
**Architecture Owner**: Technical Lead

