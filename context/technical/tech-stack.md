# Technology Stack - FincAirbnb

## Overview

FincAirbnb is built with modern web technologies focused on performance, developer experience, and scalability. This document details all technologies, libraries, and tools used in the project.

---

## Core Technologies

### Frontend Framework

#### Next.js 13.5.1
**Purpose**: React framework with App Router  
**Why chosen**:
- Server-side rendering (SSR) and static generation (SSG)
- Built-in routing with App Router
- Excellent performance optimizations
- SEO-friendly
- Image and font optimization
- Vercel deployment integration
- Great TypeScript support

**Key Features Used**:
- App Router (`app/` directory)
- Server Components
- Client Components
- Middleware for route protection
- Dynamic routes
- Layouts and templates

**Documentation**: [nextjs.org](https://nextjs.org)

---

#### React 18.2.0
**Purpose**: UI library  
**Why chosen**:
- Component-based architecture
- Large ecosystem
- Excellent TypeScript support
- Concurrent rendering
- Suspense for data fetching
- Strong community

**Key Features Used**:
- Functional components
- Hooks (useState, useEffect, useContext, useReducer, custom hooks)
- Context API for state management
- Suspense (future)

**Documentation**: [react.dev](https://react.dev)

---

#### TypeScript 5.2.2
**Purpose**: Static typing  
**Why chosen**:
- Type safety prevents runtime errors
- Better IDE support (IntelliSense)
- Self-documenting code
- Easier refactoring
- Industry standard

**Configuration**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Documentation**: [typescriptlang.org](https://www.typescriptlang.org)

---

## Styling & UI

### Tailwind CSS 3.3.3
**Purpose**: Utility-first CSS framework  
**Why chosen**:
- Rapid development
- Consistent design system
- Small bundle size (purges unused styles)
- Excellent responsive utilities
- Custom configuration support

**Custom Configuration**:
```javascript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        'galician-blue': '#0066CC',
        'galician-green': '#4A7C59',
        'shell-beige': '#F5E6D3',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
}
```

**Plugins**:
- `tailwindcss-animate`: Animation utilities
- `@tailwindcss/forms` (future): Form styling

**Documentation**: [tailwindcss.com](https://tailwindcss.com)

---

### shadcn/ui (Radix UI)
**Purpose**: Accessible component library  
**Why chosen**:
- Copy-paste components (no package dependency bloat)
- Built on Radix UI (accessibility-first)
- Fully customizable
- TypeScript support
- Tailwind CSS integration
- Production-ready components

**Components Used** (50+ components):
- **Forms**: Input, Label, Checkbox, Radio Group, Select, Textarea
- **Overlays**: Dialog, Dropdown Menu, Popover, Tooltip, Sheet
- **Navigation**: Tabs, Accordion, Navigation Menu
- **Feedback**: Toast, Alert, Progress
- **Data Display**: Card, Avatar, Badge, Table
- **Layout**: Separator, Scroll Area, Resizable

**Component Structure**:
```
components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
└── [45+ more components]
```

**Documentation**: [ui.shadcn.com](https://ui.shadcn.com)

---

### Class Variance Authority (CVA) 0.7.0
**Purpose**: Managing component variants  
**Example**:
```typescript
const buttonVariants = cva(
  "rounded-lg font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-galician-blue text-white",
        secondary: "bg-shell-beige text-galician-blue",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
  }
);
```

**Documentation**: [cva.style](https://cva.style)

---

### clsx 2.1.1 + tailwind-merge 2.5.2
**Purpose**: Conditional class merging  
**Usage**:
```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  "base-class",
  isActive && "active-class",
  className // from props
)} />
```

---

### Lucide React 0.446.0
**Purpose**: Icon library  
**Why chosen**:
- Beautiful, consistent icons
- Tree-shakeable (only import used icons)
- TypeScript support
- Customizable size and color

**Usage**:
```typescript
import { User, Settings, LogOut } from "lucide-react";

<User className="w-5 h-5" />
```

**Documentation**: [lucide.dev](https://lucide.dev)

---

## Form Management

### React Hook Form 7.53.0
**Purpose**: Form state management and validation  
**Why chosen**:
- Minimal re-renders (performance)
- Easy validation integration
- TypeScript support
- Small bundle size
- Excellent DX

**Features Used**:
- `useForm` hook
- Form validation
- Field arrays
- Error handling
- Integration with Zod

**Example**:
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { email: "", password: "" },
});

<form onSubmit={form.handleSubmit(onSubmit)}>
  <input {...form.register("email")} />
  {form.formState.errors.email && <span>Error</span>}
</form>
```

**Documentation**: [react-hook-form.com](https://react-hook-form.com)

---

### Zod 3.23.8
**Purpose**: Schema validation  
**Why chosen**:
- TypeScript-first
- Type inference
- Composable schemas
- Excellent error messages
- Runtime validation

**Example**:
```typescript
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email non válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;
```

**Documentation**: [zod.dev](https://zod.dev)

---

## State Management

### React Context API (Current)
**Purpose**: Global state management  
**Why chosen**: 
- Built into React
- No external dependencies
- Simple for authentication state
- Good for small to medium apps

**Implementation**:
```
contexts/
└── AuthContext.tsx
```

**Future Migration**: React Query + Zustand for better scalability

---

## Icons & Assets

### DM Sans Font
**Purpose**: Primary typeface  
**Why chosen**:
- Clean, modern look
- Good readability
- Multiple weights (400, 500, 600, 700)
- Web-optimized

**Loading**: Next.js Font optimization
```typescript
import { DM_Sans } from '@next/font/google';
```

---

## Development Tools

### ESLint 8.49.0
**Purpose**: Code linting  
**Configuration**: `eslint-config-next` (Next.js defaults)
**Rules**: TypeScript, React, accessibility

**Scripts**:
```bash
npm run lint
```

---

### PostCSS 8.4.30
**Purpose**: CSS processing  
**Plugins**:
- `tailwindcss`
- `autoprefixer`

**Configuration**: `postcss.config.js`

---

## Package Manager

### npm (Node Package Manager)
**Version**: Node 18+ required  
**Lock file**: `package-lock.json`

**Scripts**:
```json
{
  "dev": "next dev",         // Development server
  "build": "next build",     // Production build
  "start": "next start",     // Production server
  "lint": "next lint"        // Linting
}
```

---

## Additional Libraries

### date-fns 3.6.0
**Purpose**: Date manipulation  
**Why chosen**: Lightweight, modular, TypeScript support  
**Usage**: Date formatting, parsing, calculations

---

### Recharts 2.12.7
**Purpose**: Chart library  
**Why chosen**: React-based, responsive, customizable  
**Usage**: Dashboard analytics and statistics visualization

---

### Sonner 1.5.0
**Purpose**: Toast notifications  
**Why chosen**: Beautiful, simple API, accessible  
**Usage**: Success/error/info messages

**Example**:
```typescript
import { toast } from "sonner";

toast.success("Sesión iniciada correctamente!");
```

---

### Input OTP 1.2.4
**Purpose**: OTP input component  
**Future use**: Two-factor authentication

---

### Embla Carousel React 8.3.0
**Purpose**: Carousel component  
**Future use**: Property image galleries

---

### React Resizable Panels 2.1.3
**Purpose**: Resizable layout panels  
**Future use**: Dashboard customization

---

### vaul 0.9.9
**Purpose**: Drawer component  
**Usage**: Mobile navigation, bottom sheets

---

## Future Technologies (Planned)

### Backend & Database

#### Supabase or PostgreSQL
**Purpose**: Database  
**Features**: 
- Relational data
- Real-time subscriptions
- Row-level security
- Built-in authentication

#### Prisma (ORM)
**Purpose**: Database ORM  
**Features**:
- Type-safe database client
- Migrations
- Schema management

---

### Authentication

#### NextAuth.js
**Purpose**: Authentication library  
**Features**:
- OAuth providers
- JWT tokens
- Session management
- TypeScript support

---

### File Storage

#### Cloudinary or AWS S3
**Purpose**: Image and file storage  
**Features**:
- Image optimization
- CDN delivery
- Transformations

---

### Payment Processing

#### Stripe
**Purpose**: Payment processing and subscriptions  
**Features**:
- Subscription management
- Webhooks
- PCI compliance

#### Redsys
**Purpose**: Spanish payment gateway  
**Features**:
- Local payment methods
- Spanish bank integration

---

### Email & Communication

#### Resend or SendGrid
**Purpose**: Transactional emails  
**Features**:
- Email templates
- Delivery tracking
- API

#### Twilio (optional)
**Purpose**: SMS notifications  
**Features**:
- SMS sending
- Phone verification

---

### Analytics

#### Vercel Analytics
**Purpose**: Web analytics  
**Features**:
- Core Web Vitals
- Page views
- Built-in with Vercel

#### PostHog or Mixpanel
**Purpose**: Product analytics  
**Features**:
- Event tracking
- Funnels
- User cohorts

---

### Monitoring & Error Tracking

#### Sentry
**Purpose**: Error tracking  
**Features**:
- Error reporting
- Performance monitoring
- Source map support

#### LogRocket
**Purpose**: Session replay  
**Features**:
- User session recording
- Network monitoring
- Console logs

---

### Testing (Planned)

#### Vitest
**Purpose**: Unit testing  
**Why**: Fast, Vite-powered

#### React Testing Library
**Purpose**: Component testing  
**Why**: Testing best practices

#### Playwright
**Purpose**: E2E testing  
**Why**: Cross-browser, reliable

---

## Deployment & Infrastructure

### Vercel (Planned)
**Purpose**: Hosting platform  
**Features**:
- Edge network
- Automatic deployments
- Preview environments
- Built-in analytics
- Great Next.js integration

**Alternative**: Netlify

---

### Cloudflare (Future)
**Purpose**: CDN and security  
**Features**:
- DDoS protection
- WAF (Web Application Firewall)
- Image optimization
- Analytics

---

## Development Environment

### Recommended Tools

#### VS Code
**Extensions**:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- GitLens

#### Git
**Version control**: GitHub repository  
**Branching strategy**: Git Flow

---

## Dependencies Overview

### Production Dependencies (30+)
```json
{
  "next": "13.5.1",
  "react": "18.2.0",
  "typescript": "5.2.2",
  "tailwindcss": "3.3.3",
  "@radix-ui/*": "Various versions",
  "lucide-react": "0.446.0",
  "react-hook-form": "7.53.0",
  "zod": "3.23.8",
  "date-fns": "3.6.0",
  "recharts": "2.12.7",
  "sonner": "1.5.0",
  // ... and more
}
```

### Development Dependencies
```json
{
  "eslint": "8.49.0",
  "eslint-config-next": "13.5.1",
  "autoprefixer": "10.4.15",
  "postcss": "8.4.30"
}
```

**Total Bundle Size**: ~500KB (gzipped, estimated for production)

---

## Performance Considerations

### Bundle Optimization
- Tree-shaking enabled
- Code splitting (automatic with Next.js)
- Dynamic imports for heavy components
- CSS purging (Tailwind)

### Image Optimization
- Next.js Image component
- Automatic WebP conversion
- Lazy loading
- Responsive images

### Font Optimization
- Next.js Font optimization
- Self-hosted fonts
- Font display swap

---

## Browser Support

### Target Browsers
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### Mobile Support
- iOS Safari 12+
- Android Chrome 90+

**Polyfills**: Handled automatically by Next.js

---

## Security Considerations

### Current
- TypeScript for type safety
- Input validation with Zod
- XSS protection (React's built-in escaping)
- CSP headers (Next.js defaults)

### Future Production
- HTTPS enforcement
- HTTP-only cookies
- CSRF tokens
- Rate limiting
- Content Security Policy (CSP)
- Helmet.js for security headers

---

## Version Management

### Node Version
**Required**: Node.js 18.x or higher  
**Recommended**: Use nvm for version management

### Package Updates
**Strategy**: 
- Major updates: Quarterly review
- Minor updates: Monthly review
- Security patches: Immediate

**Tools**: 
- `npm outdated` - Check for updates
- Dependabot - Automated security updates

---

## Tech Stack Decision Log

### Why Not Vue/Angular?
- React has larger ecosystem
- Better Next.js integration
- Team expertise

### Why Not Redux?
- Overkill for current needs
- Context API sufficient for Phase 1
- Can migrate to React Query + Zustand later

### Why Mock Data First?
- Faster iteration on UI/UX
- No backend dependency bottleneck
- Can perfect frontend before backend complexity

### Why Subscription Components (shadcn)?
- No library bloat
- Full customization
- Better understanding of components
- Easy to modify

---

**Last Updated**: October 2024  
**Next Review**: After Phase 2 planning  
**Tech Lead**: Development Team

