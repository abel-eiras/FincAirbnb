# UI/UX Guidelines - FincAirbnb

## Overview

This document defines the design system, user interface patterns, and user experience principles for FincAirbnb. All design decisions should align with these guidelines to ensure consistency across the platform.

---

## Design Philosophy

### Core Principles

1. **Galician Identity**: Embrace Galician culture and aesthetics
2. **Simplicity**: Clean, uncluttered interfaces
3. **Accessibility**: Inclusive design for all users
4. **Mobile-First**: Optimize for mobile devices
5. **Trust & Transparency**: Clear information, honest communication
6. **Rural Aesthetic**: Warm, natural, authentic feel

---

## Color System

### Primary Colors

```css
/* Galician Blue - Primary brand color */
--galician-blue: #0066CC;
--galician-blue-light: #3385DB;
--galician-blue-dark: #004C99;
--galician-blue-50: rgba(0, 102, 204, 0.05);
--galician-blue-100: rgba(0, 102, 204, 0.1);

/* Galician Green - Secondary, nature */
--galician-green: #4A7C59;
--galician-green-light: #6B9978;
--galician-green-dark: #2F5A3C;

/* Shell Beige - Warm accents */
--shell-beige: #F5E6D3;
--shell-beige-light: #FAF3E8;
--shell-beige-dark: #E5D4BF;
```

### Neutral Colors

```css
/* Grays */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Black & White */
--white: #FFFFFF;
--black: #000000;
```

### Semantic Colors

```css
/* Success */
--success: #10B981;
--success-light: #34D399;
--success-dark: #059669;
--success-bg: #D1FAE5;

/* Error */
--error: #EF4444;
--error-light: #F87171;
--error-dark: #DC2626;
--error-bg: #FEE2E2;

/* Warning */
--warning: #F59E0B;
--warning-light: #FCD34D;
--warning-dark: #D97706;
--warning-bg: #FEF3C7;

/* Info */
--info: #3B82F6;
--info-light: #60A5FA;
--info-dark: #2563EB;
--info-bg: #DBEAFE;
```

### Color Usage

**Primary Actions**: Galician Blue  
**Secondary Actions**: Galician Green  
**Destructive Actions**: Error Red  
**Backgrounds**: Shell Beige, Gray tones  
**Text**: Gray-900 (primary), Gray-600 (secondary)  
**Borders**: Gray-200, Gray-300

---

## Typography

### Font Family

```css
/* Primary Font */
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Type Scale

```css
/* Headings */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
```

### Typography Usage

```tsx
// Hero Heading
className="text-5xl md:text-6xl font-bold text-gray-900"

// Section Heading
className="text-3xl md:text-4xl font-bold text-gray-900"

// Card Title
className="text-xl font-semibold text-gray-900"

// Body Text
className="text-base text-gray-700"

// Small Text
className="text-sm text-gray-600"

// Caption
className="text-xs text-gray-500"
```

### Line Height

```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

---

## Spacing System

### Scale (Tailwind convention)

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
--spacing-32: 8rem;     /* 128px */
```

### Spacing Usage

**Component Padding**:
- Small: `p-4` (16px)
- Medium: `p-6` (24px)
- Large: `p-8` (32px)

**Section Spacing**:
- Between sections: `py-16` or `py-20` (64-80px)
- Mobile: `py-12` (48px)

**Element Gaps**:
- Tight: `gap-2` (8px)
- Normal: `gap-4` (16px)
- Loose: `gap-6` (24px)

---

## Layout

### Breakpoints

```css
/* Mobile First */
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

### Container

```tsx
// Standard container
<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
```

### Grid System

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Common Layouts

**Two-column (sidebar + content)**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  <aside className="lg:col-span-1">{/* Sidebar */}</aside>
  <main className="lg:col-span-3">{/* Content */}</main>
</div>
```

**Three-column grid**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## Components

### Buttons

#### Primary Button
```tsx
<button className="
  px-6 py-3 
  bg-galician-blue hover:bg-galician-blue-dark 
  text-white font-medium 
  rounded-lg 
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-galician-blue focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Botón primario
</button>
```

#### Secondary Button
```tsx
<button className="
  px-6 py-3 
  bg-white hover:bg-gray-50
  text-galician-blue font-medium 
  border-2 border-galician-blue
  rounded-lg 
  transition-colors duration-200
">
  Botón secundario
</button>
```

#### Ghost Button
```tsx
<button className="
  px-6 py-3 
  text-galician-blue hover:bg-galician-blue-50
  font-medium 
  rounded-lg 
  transition-colors duration-200
">
  Botón fantasma
</button>
```

#### Sizes
```tsx
// Small
className="px-3 py-1.5 text-sm"

// Medium (default)
className="px-4 py-2 text-base"

// Large
className="px-6 py-3 text-lg"
```

---

### Forms

#### Input Field
```tsx
<input 
  type="text"
  className="
    w-full px-4 py-2.5
    border border-gray-300 rounded-lg
    focus:border-galician-blue focus:ring-2 focus:ring-galician-blue-100
    placeholder:text-gray-400
    disabled:bg-gray-50 disabled:cursor-not-allowed
  "
  placeholder="Escribe aquí..."
/>
```

#### Label
```tsx
<label className="block text-sm font-medium text-gray-700 mb-1.5">
  Nome do campo
</label>
```

#### Error Message
```tsx
<p className="text-sm text-error mt-1">
  ⚠️ Este campo é obrigatorio
</p>
```

#### Helper Text
```tsx
<p className="text-sm text-gray-500 mt-1">
  Texto de axuda adicional
</p>
```

---

### Cards

#### Basic Card
```tsx
<div className="
  bg-white 
  rounded-xl 
  border border-gray-200
  p-6 
  hover:shadow-lg 
  transition-shadow duration-200
">
  {/* Card content */}
</div>
```

#### Property Card
```tsx
<article className="
  bg-white 
  rounded-xl 
  overflow-hidden
  border border-gray-200
  hover:shadow-xl 
  transition-all duration-300
  cursor-pointer
">
  <div className="aspect-video relative overflow-hidden">
    <img src={image} alt={title} className="object-cover w-full h-full" />
  </div>
  <div className="p-4">
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{location}</p>
    <p className="text-lg font-bold text-galician-blue mt-2">{price}</p>
  </div>
</article>
```

---

### Badges

```tsx
// Status badge
<span className="
  inline-flex items-center 
  px-2.5 py-0.5 
  rounded-full 
  text-xs font-medium
  bg-success-bg text-success-dark
">
  Activo
</span>

// Colors
className="bg-success-bg text-success-dark" // Success
className="bg-error-bg text-error-dark"     // Error
className="bg-warning-bg text-warning-dark" // Warning
className="bg-info-bg text-info-dark"       // Info
className="bg-gray-100 text-gray-700"       // Neutral
```

---

### Avatars

```tsx
// Small
<img 
  src={avatar} 
  alt={name}
  className="w-8 h-8 rounded-full object-cover"
/>

// Medium
<img className="w-12 h-12 rounded-full" />

// Large
<img className="w-16 h-16 rounded-full" />

// With border
<img className="w-12 h-12 rounded-full border-2 border-white" />
```

---

## Icons

### Icon Library: Lucide React

```tsx
import { Home, Search, User, Heart, Calendar } from 'lucide-react';

// Standard size
<Home className="w-5 h-5" />

// Small
<Home className="w-4 h-4" />

// Large
<Home className="w-6 h-6" />

// With color
<Home className="w-5 h-5 text-galician-blue" />
```

### Icon Usage

**Buttons**: 20px (w-5 h-5)  
**Navigation**: 24px (w-6 h-6)  
**Small UI**: 16px (w-4 h-4)  
**Feature blocks**: 48px (w-12 h-12)

---

## Shadows

```css
/* Elevation system */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### Usage

**Cards**: `shadow` or `shadow-md`  
**Dropdowns/Modals**: `shadow-lg`  
**Hover states**: `hover:shadow-xl`  
**Focus states**: `focus:shadow-lg`

---

## Border Radius

```css
--rounded-none: 0;
--rounded-sm: 0.125rem;     /* 2px */
--rounded: 0.25rem;         /* 4px */
--rounded-md: 0.375rem;     /* 6px */
--rounded-lg: 0.5rem;       /* 8px */
--rounded-xl: 0.75rem;      /* 12px */
--rounded-2xl: 1rem;        /* 16px */
--rounded-3xl: 1.5rem;      /* 24px */
--rounded-full: 9999px;
```

### Usage

**Buttons**: `rounded-lg` (8px)  
**Cards**: `rounded-xl` (12px)  
**Images**: `rounded-lg` or `rounded-2xl`  
**Avatars**: `rounded-full`  
**Badges**: `rounded-full`

---

## Animation & Transitions

### Transition Durations

```css
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### Common Transitions

```tsx
// Hover effects
className="transition-colors duration-200"
className="transition-shadow duration-300"
className="transition-transform duration-200"

// All properties
className="transition-all duration-300"

// Easing
className="transition-all duration-300 ease-in-out"
```

### Loading States

```tsx
// Skeleton loader
<div className="animate-pulse bg-gray-200 rounded-lg h-48" />

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-4 border-galician-blue border-t-transparent" />
```

---

## Accessibility

### Focus States

```tsx
// Standard focus ring
className="focus:outline-none focus:ring-2 focus:ring-galician-blue focus:ring-offset-2"

// Focus within (for containers)
className="focus-within:ring-2 focus-within:ring-galician-blue"
```

### ARIA Labels

```tsx
// Button
<button aria-label="Pechar menú">
  <X className="w-5 h-5" />
</button>

// Link
<a href="/fincas" aria-label="Ver todas as fincas">

// Form field
<input 
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="error-message"
/>
```

### Screen Reader Only Text

```tsx
<span className="sr-only">
  Texto só para lectores de pantalla
</span>
```

---

## Responsive Design

### Mobile-First Approach

```tsx
// Mobile first, then tablet/desktop
<div className="
  text-base                  // mobile
  md:text-lg                // tablet
  lg:text-xl                // desktop
">
```

### Common Patterns

**Stack on mobile, grid on desktop**:
```tsx
<div className="flex flex-col lg:flex-row gap-6">
```

**Hide on mobile**:
```tsx
<div className="hidden lg:block">
```

**Show only on mobile**:
```tsx
<div className="block lg:hidden">
```

---

## Loading States

### Skeleton Screens

```tsx
<div className="space-y-4">
  <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
</div>
```

### Spinners

```tsx
// Inline spinner
<div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-galician-blue border-t-transparent" />

// Page loader
<div className="flex justify-center items-center h-screen">
  <div className="animate-spin rounded-full h-12 w-12 border-4 border-galician-blue border-t-transparent" />
</div>
```

---

## Empty States

```tsx
<div className="text-center py-12">
  <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
    <InboxIcon className="w-full h-full" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Ningún resultado
  </h3>
  <p className="text-gray-600 mb-6">
    Non atopamos fincas que coincidan cos teus criterios
  </p>
  <button className="btn-primary">
    Limpar filtros
  </button>
</div>
```

---

## Error States

```tsx
<div className="rounded-lg bg-error-bg border border-error p-4">
  <div className="flex">
    <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
    <div className="ml-3">
      <h3 className="text-sm font-medium text-error">
        Erro ao cargar os datos
      </h3>
      <p className="text-sm text-error-dark mt-1">
        Non puidemos cargar a información. Téntao de novo.
      </p>
      <button className="mt-3 text-sm font-medium text-error hover:text-error-dark">
        Volver intentar
      </button>
    </div>
  </div>
</div>
```

---

## Best Practices

### General Guidelines

1. **Consistency**: Use the same patterns throughout
2. **Feedback**: Provide visual feedback for all interactions
3. **Performance**: Optimize images, lazy load when possible
4. **Accessibility**: Always include alt text, ARIA labels, keyboard navigation
5. **Mobile**: Test on real devices, not just browser emulators
6. **Typography**: Maintain readability with proper line height and spacing
7. **Color Contrast**: Ensure WCAG AA compliance (4.5:1 for normal text)

### Component Checklist

- [ ] Responsive on all breakpoints
- [ ] Accessible (ARIA, keyboard navigation)
- [ ] Loading states defined
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Hover/focus states styled
- [ ] Mobile touch targets (min 44x44px)
- [ ] Dark mode considered (future)

---

**Last Updated**: October 2024  
**Maintained By**: Design & Development Team  
**Related**: `galician-language-policy.md`, `brand-identity.md`

