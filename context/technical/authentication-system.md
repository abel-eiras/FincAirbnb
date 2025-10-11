# Authentication System - FincAirbnb

## Overview

FincAirbnb's authentication system is currently implemented as a **mock system** for Phase 1 development. This document describes both the current implementation and the planned production-ready system.

---

## Current Implementation (Phase 1 - Mock)

### Architecture

```
User Action (Login/Register)
    │
    ▼
Auth Form Component
    │
    ▼
useAuth() Hook
    │
    ▼
AuthContext
    │
    ▼
Mock Auth Service (lib/auth-mock.ts)
    │
    ├─ Simulate API delay
    ├─ Validate credentials (mock)
    ├─ Generate mock JWT token
    └─ Store in LocalStorage
    │
    ▼
Update Context State
    │
    ▼
Trigger Re-render
    │
    ▼
Middleware Checks Session
    │
    └─ Allow/Deny access to protected routes
```

---

## File Structure

```
contexts/
└── AuthContext.tsx          # Authentication context provider

lib/
├── auth-mock.ts            # Mock authentication service
└── utils.ts                # Utilities

types/
└── auth.ts                 # TypeScript types

components/auth/
├── AuthForm.tsx            # Reusable auth form
├── ProtectedRoute.tsx      # Route protection HOC
├── UserMenu.tsx            # User menu dropdown
└── AuthButtons.tsx         # Login/Register buttons

app/
├── rexistro/              # Registration page
├── acceder/               # Login page
├── recuperar-contrasinal/ # Password recovery
└── taboleiro/             # Protected dashboard

middleware.ts              # Route protection middleware
```

---

## Core Components

### 1. AuthContext (`contexts/AuthContext.tsx`)

**Purpose**: Global authentication state management

**State**:
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**Actions**:
```typescript
interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkSession: () => void;
}
```

**Implementation**:
```typescript
// Using useReducer for state management
const [state, dispatch] = useReducer(authReducer, initialState);

// Actions
const login = async (email: string, password: string) => {
  dispatch({ type: 'LOGIN_START' });
  try {
    const response = await mockAuthService.login(email, password);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    localStorage.setItem('auth-token', response.token);
    router.push('/taboleiro');
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', payload: error.message });
  }
};
```

**Usage**:
```typescript
// In components
const { user, isAuthenticated, login, logout } = useAuth();

if (!isAuthenticated) {
  return <LoginPrompt />;
}

return <Dashboard user={user} />;
```

---

### 2. Mock Auth Service (`lib/auth-mock.ts`)

**Purpose**: Simulate backend authentication

**Mock User Data**:
```typescript
const mockUsers = [
  {
    id: "1",
    email: "xose@example.com",
    password: "password123", // In production: hashed
    name: "Xosé Manuel",
    role: "owner",
    avatar: "/avatars/default.jpg",
    phone: "+34 600 123 456",
    createdAt: "2024-01-15",
  },
  // More mock users...
];
```

**Methods**:

#### `login(email, password)`
```typescript
async function login(email: string, password: string) {
  // Simulate API delay
  await delay(800);
  
  // Find user
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    throw new Error("Credenciais incorrectas");
  }
  
  // Generate mock token
  const token = generateMockToken(user);
  
  // Return user data (without password)
  const { password: _, ...userData } = user;
  
  return {
    user: userData,
    token,
    expiresIn: 3600, // 1 hour
  };
}
```

#### `register(userData)`
```typescript
async function register(userData: RegisterData) {
  await delay(1000);
  
  // Check if email exists
  const exists = mockUsers.some(u => u.email === userData.email);
  if (exists) {
    throw new Error("O correo electrónico xa está rexistrado");
  }
  
  // Create new user
  const newUser = {
    id: generateId(),
    ...userData,
    role: "guest",
    createdAt: new Date().toISOString(),
  };
  
  // In mock: just add to array (in production: save to DB)
  mockUsers.push(newUser);
  
  // Auto-login
  return login(userData.email, userData.password);
}
```

#### `logout()`
```typescript
function logout() {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user-data');
  // In production: invalidate token on server
}
```

#### `validateToken(token)`
```typescript
function validateToken(token: string): User | null {
  try {
    // Mock validation (in production: verify JWT signature)
    const payload = parseJwt(token);
    
    if (payload.exp < Date.now() / 1000) {
      return null; // Token expired
    }
    
    // Find user
    const user = mockUsers.find(u => u.id === payload.sub);
    if (!user) return null;
    
    const { password: _, ...userData } = user;
    return userData;
  } catch {
    return null;
  }
}
```

---

### 3. Middleware (`middleware.ts`)

**Purpose**: Protect routes from unauthorized access

**Implementation**:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from cookie or header
  const token = request.cookies.get('auth-token')?.value 
    || request.headers.get('authorization')?.replace('Bearer ', '');
  
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/taboleiro');
  const isAuthRoute = ['/acceder', '/rexistro'].some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // Protected route without token
  if (isProtectedRoute && !token) {
    const url = new URL('/acceder', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // Auth route with token (already logged in)
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/taboleiro', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/taboleiro/:path*',
    '/acceder',
    '/rexistro',
  ],
};
```

---

### 4. Protected Route Component

**Purpose**: Client-side route protection

**Implementation**:
```typescript
// components/auth/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/acceder');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}
```

**Usage**:
```typescript
// In page component
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

---

## Authentication Flows

### Registration Flow

```
1. User fills registration form
   ├─ Nome completo
   ├─ Correo electrónico
   ├─ Contrasinal
   ├─ Confirmar contrasinal
   └─ Aceptar termos e condicións
   
2. Form validation (Zod)
   ├─ Email format
   ├─ Password strength (min 8 chars)
   ├─ Passwords match
   └─ Terms accepted
   
3. Submit to mock auth service
   ├─ Check email uniqueness
   ├─ Create user record
   └─ Generate session token
   
4. Store token in LocalStorage

5. Update AuthContext state

6. Redirect to /taboleiro
```

**Validation Schema**:
```typescript
const registerSchema = z.object({
  name: z.string().min(2, "Nome demasiado curto"),
  email: z.string().email("Correo electrónico non válido"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe conter unha maiúscula")
    .regex(/[0-9]/, "Debe conter un número"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "Debes aceptar os termos"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Os contrasinais non coinciden",
  path: ["confirmPassword"],
});
```

---

### Login Flow

```
1. User enters credentials
   ├─ Correo electrónico
   └─ Contrasinal
   
2. Form validation
   ├─ Email format
   └─ Password not empty
   
3. Submit to mock auth service
   ├─ Find user by email
   ├─ Verify password (mock comparison)
   └─ Generate session token
   
4. Store token in LocalStorage

5. Update AuthContext state
   ├─ Set user data
   └─ Set isAuthenticated = true
   
6. Redirect to /taboleiro
```

**Validation Schema**:
```typescript
const loginSchema = z.object({
  email: z.string().email("Correo electrónico non válido"),
  password: z.string().min(1, "Contrasinal obrigatorio"),
  remember: z.boolean().optional(),
});
```

---

### Logout Flow

```
1. User clicks "Pechar sesión"

2. Call logout action
   ├─ Clear LocalStorage
   │   ├─ Remove auth-token
   │   └─ Remove user-data
   └─ Clear AuthContext state
   
3. Redirect to homepage (/)
```

---

### Password Recovery Flow (Mock)

```
1. User enters email

2. Form validation
   └─ Valid email format
   
3. Mock "send email"
   ├─ Simulate API delay
   ├─ Check if email exists
   └─ Log reset link to console (mock)
   
4. Show confirmation message
   "Enviámosche un correo con instrucións"
   
5. User redirected to confirmation page

(In production: actual email with token link)
```

---

### Session Check Flow

```
On App Load:
1. Check LocalStorage for token

2. If token exists:
   ├─ Validate token format
   ├─ Check expiration
   └─ Load user data
   
3. If valid:
   └─ Update AuthContext with user data
   
4. If invalid/expired:
   ├─ Clear storage
   └─ Redirect to login if on protected route
```

---

## Type Definitions

### User Type (`types/auth.ts`)

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'guest' | 'owner' | 'admin';
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface AuthError {
  code: string;
  message: string;
}
```

---

## Security (Current vs. Production)

### ⚠️ Current Mock Limitations

**NOT SECURE - For development only**:
- Passwords stored in plain text
- Tokens not cryptographically signed
- LocalStorage (vulnerable to XSS)
- No HTTPS enforcement
- No rate limiting
- No CSRF protection
- Client-side only validation

**Do NOT use in production!**

---

### ✅ Future Production Implementation

#### Backend Authentication Service

**Tech Stack**:
- NextAuth.js or custom JWT implementation
- PostgreSQL for user storage
- bcrypt for password hashing
- Redis for session storage

**Flow**:
```
Client                    Server                  Database
  │                         │                         │
  ├─ POST /api/auth/login ──►                         │
  │                         ├─ Query user ───────────►│
  │                         ◄─ Return user ───────────┤
  │                         ├─ Verify password (bcrypt)│
  │                         ├─ Generate JWT           │
  │                         ├─ Store session (Redis)  │
  ◄─ Set HTTP-only cookie ─┤                         │
  │                         │                         │
```

#### Password Hashing

```typescript
import bcrypt from 'bcryptjs';

// On registration
const hashedPassword = await bcrypt.hash(password, 10);

// On login
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

#### JWT Token

```typescript
import jwt from 'jsonwebtoken';

// Generate
const token = jwt.sign(
  { 
    sub: user.id, 
    email: user.email, 
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify
const payload = jwt.verify(token, process.env.JWT_SECRET);
```

#### HTTP-Only Cookies

```typescript
// Set cookie
response.setHeader('Set-Cookie', [
  `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
]);

// Prevents XSS attacks (JavaScript can't access)
```

#### Rate Limiting

```typescript
// Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Demasiadas tentativas, téntao de novo máis tarde",
});

app.use('/api/auth/login', limiter);
```

#### CSRF Protection

```typescript
// CSRF token in forms
<input type="hidden" name="csrfToken" value={csrfToken} />

// Verify on server
if (req.body.csrfToken !== req.session.csrfToken) {
  throw new Error('Invalid CSRF token');
}
```

#### Session Management

```typescript
// Store in Redis
await redis.setex(
  `session:${userId}`,
  3600, // 1 hour
  JSON.stringify(sessionData)
);

// Validate on each request
const session = await redis.get(`session:${userId}`);
if (!session) {
  throw new Error('Session expired');
}
```

---

## Error Handling

### Error Types

```typescript
enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

interface AuthError {
  code: AuthErrorCode;
  message: string;
  galicianMessage: string; // User-facing message
}
```

### Error Messages (Galician)

```typescript
const errorMessages = {
  INVALID_CREDENTIALS: "Correo electrónico ou contrasinal incorrectos",
  EMAIL_EXISTS: "Este correo electrónico xa está rexistrado",
  SESSION_EXPIRED: "A túa sesión caducou. Inicia sesión de novo",
  UNAUTHORIZED: "Non tes permiso para acceder a este recurso",
  RATE_LIMIT_EXCEEDED: "Demasiadas tentativas. Téntao de novo en 15 minutos",
};
```

---

## Testing Strategy (Future)

### Unit Tests
```typescript
describe('AuthContext', () => {
  it('should login successfully with valid credentials', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Integration Tests
```typescript
describe('Login Flow', () => {
  it('should complete full login flow', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Correo'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contrasinal'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Iniciar sesión'));
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/taboleiro');
    });
  });
});
```

---

## Migration Path: Mock → Production

### Phase 1: Current (Mock)
- ✅ Frontend authentication flows
- ✅ Route protection
- ✅ User state management
- ✅ Form validation

### Phase 2: Backend API
- [ ] Set up authentication API routes
- [ ] Implement password hashing
- [ ] JWT token generation
- [ ] HTTP-only cookies

### Phase 3: Database Integration
- [ ] User model and schema
- [ ] Password reset tokens table
- [ ] Session storage (Redis)

### Phase 4: Security Hardening
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Security headers
- [ ] Input sanitization

### Phase 5: Advanced Features
- [ ] OAuth providers (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Email verification
- [ ] Account recovery

---

**Last Updated**: October 2024  
**Status**: Phase 1 Mock Implementation  
**Next Steps**: Backend API development (Phase 2)

